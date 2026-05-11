/**
 * SKINKSA Google Sheets Orders Webhook
 *
 * Sheet tabs required:
 * - orders
 * - order_items
 * - tracking_events
 *
 * Script property required:
 * - WEBHOOK_TOKEN
 *
 * Deploy as Web App:
 * - Execute as: Me
 * - Access: Anyone
 */

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse(400, { ok: false, error: "Missing payload" });
    }

    var payload = JSON.parse(e.postData.contents);
    var expectedToken = PropertiesService.getScriptProperties().getProperty("WEBHOOK_TOKEN");

    if (!expectedToken || payload.token !== expectedToken) {
      return jsonResponse(401, { ok: false, error: "Unauthorized" });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var orders = getRequiredSheet(ss, "orders");
    var items = getRequiredSheet(ss, "order_items");
    var tracking = getRequiredSheet(ss, "tracking_events");

    var now = new Date().toISOString();
    var order = payload.order || {};
    var attribution = payload.attribution || {};

    orders.appendRow([
      now,
      order.id || "",
      order.order_number || "",
      order.status || "",
      order.customer_name || "",
      order.customer_phone_e164 || "",
      order.customer_phone_digits || "",
      order.currency || "SAR",
      numberOrBlank(order.subtotal_sar),
      numberOrBlank(order.upsell_sar),
      numberOrBlank(order.total_sar),
      order.selected_offer_code || "",
      order.selected_offer_label || "",
      order.upsell_decision || "",
      attribution.source_url || "",
      attribution.utm_source || "",
      attribution.utm_medium || "",
      attribution.utm_campaign || "",
      attribution.utm_content || "",
      attribution.utm_term || "",
      attribution.fbclid || "",
      attribution.ttclid || "",
      attribution.snap_click_id || "",
      attribution.user_agent || "",
      attribution.ip_address || "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    ]);

    (payload.items || []).forEach(function (item) {
      items.appendRow([
        now,
        order.id || "",
        order.order_number || "",
        item.id || "",
        item.product_slug || "",
        item.product_title || "",
        item.offer_code || "",
        numberOrBlank(item.quantity),
        numberOrBlank(item.unit_price_sar),
        numberOrBlank(item.line_total_sar),
        item.is_upsell === true
      ]);
    });

    (payload.tracking || []).forEach(function (event) {
      tracking.appendRow([
        now,
        order.id || "",
        order.order_number || "",
        event.platform || "",
        event.event_name || "",
        event.event_id || "",
        event.channel || "",
        event.status || "",
        numberOrBlank(event.value_sar),
        event.currency || "SAR",
        event.response_code || "",
        event.error_message || ""
      ]);
    });

    return jsonResponse(200, { ok: true });
  } catch (error) {
    return jsonResponse(500, { ok: false, error: String(error) });
  }
}

function getRequiredSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    throw new Error("Missing required sheet: " + name);
  }
  return sheet;
}

function numberOrBlank(value) {
  if (value === null || value === undefined || value === "") return "";
  var n = Number(value);
  return isNaN(n) ? "" : n;
}

function jsonResponse(status, body) {
  var output = ContentService.createTextOutput(JSON.stringify(body));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
