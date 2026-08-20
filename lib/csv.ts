type Cell = string | number | null | undefined;

// a leading =, +, - or @ makes spreadsheets treat the cell as a formula
const FORMULA_START = /^[=+\-@]/;

function escapeCell(value: Cell) {
  if (value === null || value === undefined) return "";

  const text = String(value);
  const safe = FORMULA_START.test(text) ? `'${text}` : text;

  return /["\r\n,]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export function toCsv(rows: Cell[][]) {
  return rows.map((row) => row.map(escapeCell).join(",")).join("\r\n");
}
