/**
 * SKINKSA → NETWORK ORDERS row (matches backend `send_sheets_webhook` JSON).
 *
 * Sheet "Sheet1" row 1 headers (exact order):
 * OrderDate | orderid | country | name | phone | address | url | sku | Product |
 * quantity | price | currency | notes | utm_source | utm_medium | utm_campaign |
 * utm_term | utm_content | national_address | status
 *
 * Deploy as Web App: Execute as Me, Anyone can access.
 * Set ORDERS_WEBHOOK_URL to the deployment URL (no token).
 */

var SHEET_NAME = "Sheet1";

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse(400, { ok: false, error: "Missing payload" });
    }

    var body = JSON.parse(e.postData.contents);
    var rowObj = body.sheet_row || body;
    var ordered = body.row;
    var columns = body.column_order;

    var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error("Missing sheet: " + SHEET_NAME);
    }

    var values;
    if (ordered && Array.isArray(ordered)) {
      values = ordered;
    } else if (columns && Array.isArray(columns)) {
      values = columns.map(function (key) {
        var v = rowObj[key];
        return v === undefined || v === null ? "" : v;
      });
    } else {
      return jsonResponse(400, { ok: false, error: "missing row or column_order" });
    }

    sheet.appendRow(values);
    return jsonResponse(200, { ok: true });
  } catch (error) {
    return jsonResponse(500, { ok: false, error: String(error) });
  }
}

function jsonResponse(status, body) {
  var output = ContentService.createTextOutput(JSON.stringify(body));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
