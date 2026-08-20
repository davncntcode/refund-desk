CREATE TABLE `refund_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`reference` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_email` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`currency` text DEFAULT 'USD' NOT NULL,
	`reason_category` text NOT NULL,
	`reason` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `refund_requests_reference_unique` ON `refund_requests` (`reference`);--> statement-breakpoint
CREATE INDEX `refund_requests_status_idx` ON `refund_requests` (`status`);--> statement-breakpoint
CREATE INDEX `refund_requests_created_at_idx` ON `refund_requests` (`created_at`);--> statement-breakpoint
CREATE INDEX `refund_requests_email_idx` ON `refund_requests` (`customer_email`);--> statement-breakpoint
CREATE TABLE `refund_status_events` (
	`id` text PRIMARY KEY NOT NULL,
	`refund_id` text NOT NULL,
	`from_status` text,
	`to_status` text NOT NULL,
	`note` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`refund_id`) REFERENCES `refund_requests`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `refund_status_events_refund_idx` ON `refund_status_events` (`refund_id`,`created_at`);