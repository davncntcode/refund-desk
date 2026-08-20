import { nanoid } from "nanoid";
import { db } from "./index";
import { refundRequests, refundStatusEvents } from "./schema";
import { REASON_CATEGORIES, type ReasonCategory, type RefundStatus } from "../domain";

// fixed seed keeps demo data, screenshots and e2e runs stable
let state = 20260820;
const random = () => {
  state = (state * 1103515245 + 12345) % 2147483648;
  return state / 2147483648;
};
const pick = <T,>(items: readonly T[]) => items[Math.floor(random() * items.length)];
const between = (min: number, max: number) => min + Math.floor(random() * (max - min + 1));

const CUSTOMERS = [
  "Amara Okafor", "Ben Salvador", "Chloe Whitfield", "Daniyal Rahman", "Elena Kovacs",
  "Felix Ortega", "Grace Lindqvist", "Hana Yamamoto", "Isaac Mbeki", "Jasmine Corrales",
  "Kofi Mensah", "Lucia Ferrari", "Marcus Delaney", "Nadia Haddad", "Omar Farouk",
  "Priya Raghavan", "Quentin Boucher", "Rosa Delgado", "Samir Patel", "Tessa Lindgren",
  "Ubong Etim", "Valentina Rossi", "Wesley Chan", "Ximena Duarte", "Yusuf Demir",
  "Zara Petrov", "Aaron Kessler", "Bianca Moreau", "Caleb Nwosu", "Dalia Haroun",
];

const REASON_TEXT: Record<ReasonCategory, string[]> = {
  duplicate_charge: [
    "Charged twice for the same order within a minute. Only one confirmation email arrived.",
    "Bank statement shows two identical charges on the same day for order placed once.",
    "Retried a failed payment and both attempts went through.",
  ],
  item_not_received: [
    "Tracking has shown the parcel as in transit for eleven days with no movement.",
    "Courier marked the delivery as complete but nothing arrived at the address.",
    "Order was never dispatched and the promised ship date has passed twice.",
  ],
  damaged_item: [
    "Screen arrived cracked, photos of the packaging and the unit attached to the ticket.",
    "Box was crushed in transit and two of the four items inside are unusable.",
    "Item leaked in the packaging and stained the rest of the order.",
  ],
  cancelled_order: [
    "Cancelled within the hour but the payment was captured the next morning anyway.",
    "Support confirmed the cancellation over chat and the charge still cleared.",
    "Cancelled the subscription before the renewal date and was billed regardless.",
  ],
  billing_error: [
    "Charged the annual rate instead of the monthly rate selected at checkout.",
    "Promotional discount was applied at checkout but missing from the final invoice.",
    "Currency conversion applied twice, so the total is well above the quoted price.",
  ],
  other: [
    "Ordered the wrong size and the exchange window had already closed by one day.",
    "Duplicate account created by mistake and both were charged the setup fee.",
    "Service was unavailable for most of the billing period covered by this charge.",
  ],
};

const REJECTION_NOTES = [
  "Outside the 30 day refund window and no delivery exception on file.",
  "Charge matches a delivered order with a signed proof of delivery.",
  "Customer already received a courtesy credit for this order.",
];

const REVIEW_NOTES = [
  "Pulled the payment record, waiting on the courier trace.",
  "Asked the customer for photos before deciding.",
  "Checking whether the duplicate settled or was only authorised.",
];

const APPROVAL_NOTES = [
  "Duplicate confirmed in the payment log, refunding in full.",
  "Courier confirmed the parcel as lost, approving the full amount.",
  "Damage evident from the photos, approved without a return.",
];

// how many requests end in each status
const PLAN: { status: RefundStatus; count: number }[] = [
  { status: "pending", count: 9 },
  { status: "in_review", count: 6 },
  { status: "approved", count: 6 },
  { status: "refunded", count: 15 },
  { status: "rejected", count: 8 },
];

const PATH: Record<RefundStatus, RefundStatus[]> = {
  pending: ["pending"],
  in_review: ["pending", "in_review"],
  approved: ["pending", "in_review", "approved"],
  refunded: ["pending", "in_review", "approved", "refunded"],
  rejected: ["pending", "in_review", "rejected"],
};

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function emailFor(name: string, index: number) {
  const [first, last] = name.toLowerCase().split(" ");
  // rfc 2606 reserved domains, so demo data can never reach a real inbox
  const host = pick(["example.com", "example.net", "example.org", "mail.example.com"]);
  return `${first}.${last}${index % 4 === 0 ? index : ""}@${host}`;
}

function noteFor(to: RefundStatus) {
  if (to === "rejected") return pick(REJECTION_NOTES);
  if (to === "in_review") return random() < 0.6 ? pick(REVIEW_NOTES) : null;
  if (to === "approved") return random() < 0.7 ? pick(APPROVAL_NOTES) : null;
  return null;
}

async function main() {
  const now = Date.now();
  const targets = PLAN.flatMap(({ status, count }) => Array.from({ length: count }, () => status));

  // newest first so the recent rows are the unresolved ones
  const rows = targets
    .map((status, index) => {
      const ageDays = status === "pending" ? between(0, 6) : between(3, 75);
      return { status, createdAt: now - ageDays * DAY - between(0, 20) * HOUR, index };
    })
    .sort((a, b) => a.createdAt - b.createdAt);

  const requests: (typeof refundRequests.$inferInsert)[] = [];
  const events: (typeof refundStatusEvents.$inferInsert)[] = [];

  rows.forEach((row, position) => {
    const id = nanoid(12);
    const name = CUSTOMERS[row.index % CUSTOMERS.length];
    const category = pick(REASON_CATEGORIES);
    const year = new Date(row.createdAt).getUTCFullYear();
    const path = PATH[row.status];

    let at = row.createdAt;
    path.forEach((to, step) => {
      if (step > 0) at += between(2, 60) * HOUR;
      events.push({
        id: nanoid(12),
        refundId: id,
        fromStatus: step === 0 ? null : path[step - 1],
        toStatus: to,
        note: step === 0 ? null : noteFor(to),
        createdAt: new Date(Math.min(at, now)),
      });
    });

    requests.push({
      id,
      reference: `RF-${year}-${String(position + 1).padStart(4, "0")}`,
      customerName: name,
      customerEmail: emailFor(name, row.index),
      amountCents: between(12, 2400) * 100 + pick([0, 49, 95, 99]),
      reasonCategory: category,
      reason: pick(REASON_TEXT[category]),
      status: row.status,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(Math.min(at, now)),
    });
  });

  await db.delete(refundStatusEvents);
  await db.delete(refundRequests);
  await db.insert(refundRequests).values(requests);
  await db.insert(refundStatusEvents).values(events);

  console.log(`seeded ${requests.length} refund requests and ${events.length} status events`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
