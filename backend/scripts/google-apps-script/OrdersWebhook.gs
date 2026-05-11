/**
 * NETWORK ORDERS — Web App endpoint for SKINKSA backend.
 *
 * 1. Create a Google Sheet; on Sheet1, row 1 headers must match exactly (18 columns):
 *    OrderDate,country,name,phone,address,url,sku,Product,quantity,price,currency,notes,
 *    utm_source,utm_medium,utm_campaign,utm_term,utm_content,national_address
 *
 *    Tip: The backend sends `orderid` inside `notes` as: nama-sk-xxxxx | #SK-xxxxx | uuid
 *
 * 2. Extensions → Apps Script → paste this file → Save.
 *
 * 3. Deploy → New deployment → type "Web app"
 *    - Execute as: Me
 *    - Who has access: Anyone
 *
 * 4. Copy the Web app URL into backend ORDERS_WEBHOOK_URL (no secret/token).
 */

const SHEET_NAME = 'Sheet1';

function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return jsonResponse({ ok: false, error: 'empty body' }, 400);
  }
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ ok: false, error: 'invalid JSON' }, 400);
  }

  var rowObj = body.sheet_row || body;
  var ordered = body.row;
  var columns = body.column_order;

  try {
    var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    if (!sheet) {
      return jsonResponse({ ok: false, error: 'sheet not found: ' + SHEET_NAME }, 500);
    }

    var values;
    if (ordered && Array.isArray(ordered)) {
      values = ordered;
    } else if (columns && Array.isArray(columns)) {
      values = columns.map(function (key) {
        var v = rowObj[key];
        return v === undefined || v === null ? '' : v;
      });
    } else {
      return jsonResponse({ ok: false, error: 'missing row or column_order' }, 400);
    }

    sheet.appendRow(values);
    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) }, 500);
  }
}

function jsonResponse(obj, statusCode) {
  var out = ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  // Apps Script does not expose HTTP status to clients consistently; body carries result.
  return out;
}

/** Optional: test from the script editor — verify 18 columns align with your header row. */
function testAppendDummy() {
  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  sheet.appendRow([
    '01/05/2026',
    'KSA',
    'Test',
    '966501234567',
    'الرياض — حي النخيل',
    'https://officialskinksa.store',
    'NAMA-BCP-30ML/NAMA-UPG-44721',
    'منتج١/منتج٢',
    '2/1',
    199,
    'SAR',
    'nama-sk-10001 | #SK-10001 | test-uuid',
    '',
    '',
    '',
    '',
    '',
    'الرياض'
  ]);
}
