# 10 - Google Sheets Webhook and COD Ops

## Purpose

The backend must send every finalized COD order to Google Sheets through an Apps Script webhook.

This gives the business an immediate operations queue for confirmation and delivery.

## Required Sheet Tabs

Create three tabs:

- `orders`
- `order_items`
- `tracking_events`

Use CSV templates in `docs/templates/`.

## Webhook Timing

Send webhook after:

1. COD form submitted,
2. upsell accepted/skipped,
3. order finalized as `pending_confirmation`.

Do not send final sheet row before upsell decision.

## Webhook Payload Shape

Backend sends:

```json
{
  "token": "shared-secret",
  "order": {
    "id": "uuid",
    "order_number": "SK-10001",
    "status": "pending_confirmation",
    "customer_name": "Name",
    "customer_phone_e164": "+9665XXXXXXXX",
    "customer_phone_digits": "9665XXXXXXXX",
    "currency": "SAR",
    "subtotal_sar": 159,
    "upsell_sar": 99,
    "total_sar": 258,
    "selected_offer_code": "OFFER_2",
    "upsell_decision": "accepted"
  },
  "items": [],
  "attribution": {},
  "tracking": []
}
```

## Reliability Requirements

Backend must:

- save webhook payload before sending,
- retry failures,
- record response/error,
- expose internal resend endpoint,
- avoid duplicate rows when re-sending if possible.

Apps Script should:

- validate token,
- append order row,
- append item rows,
- append tracking rows if provided,
- return JSON.

## COD Confirmation Workflow

Sheet should support ops columns:

- confirmation_status,
- call_attempts,
- confirmed_city,
- address,
- courier_tracking,
- delivery_status,
- cancellation_reason,
- notes.

These may be manually added after the template columns.

## Confirmation Script

Suggested phone/WhatsApp confirmation:

`هلا [الاسم]، معك فريق SKINKSA. وصلنا طلبك لسيروم SKINKSA بالدفع عند الاستلام بقيمة [المبلغ] ر.س. نأكد معك العنوان ووقت التوصيل المناسب؟`

Goal:

- reassure,
- confirm order total,
- confirm address,
- reduce refusal by reminding no online payment required.
