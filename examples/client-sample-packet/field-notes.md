# Field Notes

## Invoice sample fields

| Field | Meaning | Required | Notes |
|---|---|---|---|
| invoiceId | Unique invoice identifier | Yes | Must be stable across exports |
| customerId | Client customer identifier | Recommended | Can be redacted |
| customerName | Customer display name | Recommended | Can be redacted |
| amount | Invoice amount | Yes | Confirm decimal and rounding rules |
| currency | Invoice currency | Yes | Confirm single-currency or multi-currency workflow |
| status | Invoice status | Yes | Confirm allowed values |
| issuedAt | Invoice issue date | Recommended | Confirm date format |
| dueAt | Invoice due date | Yes | Required for overdue detection |
| paidAt | Paid date | Optional | Empty if unpaid |
| projectCode | Project or cost center code | Optional | Required only for project margin workflows |

## Bank transaction sample fields

| Field | Meaning | Required | Notes |
|---|---|---|---|
| bankTransactionId | Unique bank transaction identifier | Yes | Client must confirm this ID is stable |
| transactionDate | Bank transaction date | Yes | Confirm timezone and date format |
| description | Bank memo or description | Recommended | Redact private details |
| amount | Transaction amount | Yes | Confirm sign convention |
| currency | Transaction currency | Yes | Confirm FX handling if needed |
| direction | Inflow or outflow | Recommended | Useful for matching logic |
| reference | Invoice, vendor, or payment reference | Optional | Useful for reconciliation |

## Mapping questions

- Is `bankTransactionId` stable across exports?
- Can invoice IDs appear in bank transaction descriptions?
- Are partial payments possible?
- Are overpayments possible?
- Are multi-currency invoices possible?
- Should overdue invoices be grouped by customer, project, or owner?
- Who approves payment-like outputs?
- What must remain blocked in the first build?
