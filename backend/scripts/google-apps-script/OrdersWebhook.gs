/**
 * NETWORK ORDERS — Web App for SKINKSA (POST from backend, no secret).
 *
 * Sheet1 — row 1 must be exactly these 20 headers (same order):
 * OrderDate,orderid,country,name,phone,address,url,sku,Product,quantity,price,currency,status,notes,utm_source,utm_medium,utm_campaign,utm_term,utm_content,national_address
 *
 * - Only `status` stays empty (backend sends "").
 * - All other cells get a value from the JSON payload.
 * - `orderid` format: SKINKSA-SK-xxxxx (brand + your order number).
 *
 * Deploy → Web app → Execute as: Me, Who has access: Anyone
 * Put the Web app URL in backend ORDERS_WEBHOOK_URL
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
        if (v === undefined || v === null) {
          return key === 'status' ? '' : '-';
        }
        return v;
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
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Optional: verify 20 columns against your header row */
function testAppendDummy() {
  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  sheet.appendRow([
    '01/05/2026',
    'SKINKSA-SK-10001',
    'KSA',
    'Test',
    '966501234567',
    'الرياض — حي النخيل',
    'https://officialskinksa.store',
    'SKINKSA-PEP-30ML/SKINKSA-PEP-ADDON',
    'منتج١/منتج٢',
    '2/1',
    199,
    'SAR',
    '',
    'SKINKSA · SK-10001 · uuid',
    '-',
    '-',
    '-',
    '-',
    '-',
    'الرياض'
  ]);
}
