"""
FarmConnect Backend - REST API Server
Runs on port 5000 with complete CORS and JSON endpoints.
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse
import os
import sys

# Add parent path
sys.path.insert(0, os.path.dirname(__file__))
from db import Database

PORT = int(os.environ.get("PORT", 5000))

class FarmConnectAPIHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

    def _send_json(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        conn = Database.get_connection()
        cursor = conn.cursor()

        try:
            # Health check
            if path == "/" or path == "/api/health":
                self._send_json({
                    "status": "online",
                    "service": "FarmConnect Direct Marketplace API",
                    "version": "2.0.0",
                    "endpoints": [
                        "/api/products", "/api/orders", "/api/mandi-prices",
                        "/api/conversations", "/api/notifications", "/api/earnings", "/api/users"
                    ]
                })

            # Products list
            elif path == "/api/products":
                cursor.execute("SELECT * FROM products ORDER BY created_at DESC")
                rows = [dict(row) for row in cursor.fetchall()]
                # Convert boolean / number types
                for r in rows:
                    r["isOrganic"] = bool(r.get("is_organic"))
                    r["availableQty"] = r.get("available_qty")
                    r["minOrderQty"] = r.get("min_order_qty")
                    r["harvestDate"] = r.get("harvest_date")
                    r["farmerId"] = r.get("farmer_id")
                    r["farmerName"] = r.get("farmer_name")
                    r["farmName"] = r.get("farm_name")
                    r["reviewsCount"] = r.get("reviews_count")
                    r["bulkDiscount"] = r.get("bulk_discount")
                    r["shelfLifeDays"] = r.get("shelf_life_days")
                self._send_json({"products": rows})

            # Orders list
            elif path == "/api/orders":
                cursor.execute("SELECT * FROM orders ORDER BY created_at DESC")
                rows = []
                for row in cursor.fetchall():
                    item = dict(row)
                    item["items"] = json.loads(item.get("items_json") or "[]")
                    item["trackingTimeline"] = json.loads(item.get("tracking_timeline_json") or "[]")
                    item["deliveryPartner"] = json.loads(item.get("delivery_partner_json") or "{}")
                    item["itemTotal"] = item.get("item_total")
                    item["deliveryFee"] = item.get("delivery_fee")
                    item["buyerId"] = item.get("buyer_id")
                    item["buyerName"] = item.get("buyer_name")
                    item["buyerPhone"] = item.get("buyer_phone")
                    item["deliveryAddress"] = item.get("delivery_address")
                    item["farmerId"] = item.get("farmer_id")
                    item["farmerName"] = item.get("farmer_name")
                    item["farmName"] = item.get("farm_name")
                    item["farmerPhone"] = item.get("farmer_phone")
                    item["paymentMethod"] = item.get("payment_method")
                    item["paymentStatus"] = item.get("payment_status")
                    item["expectedDelivery"] = item.get("expected_delivery")
                    rows.append(item)
                self._send_json({"orders": rows})

            # Mandi Prices
            elif path == "/api/mandi-prices":
                cursor.execute("SELECT * FROM mandi_prices")
                rows = []
                for row in cursor.fetchall():
                    item = dict(row)
                    item["currentPrice"] = item.get("current_price")
                    item["previousPrice"] = item.get("previous_price")
                    item["changePercent"] = item.get("change_percent")
                    item["localMandi"] = item.get("local_mandi")
                    item["bestMandi"] = item.get("best_mandi")
                    item["farmConnectPrice"] = item.get("farm_connect_price")
                    item["marketDemand"] = item.get("market_demand")
                    item["advisoryTip"] = item.get("advisory_tip")
                    rows.append(item)
                self._send_json({"mandiPrices": rows})

            # Conversations & Chat
            elif path == "/api/conversations":
                cursor.execute("SELECT * FROM conversations")
                rows = []
                for row in cursor.fetchall():
                    item = dict(row)
                    item["messages"] = json.loads(item.get("messages_json") or "[]")
                    item["farmerId"] = item.get("farmer_id")
                    item["farmerName"] = item.get("farmer_name")
                    item["farmerAvatar"] = item.get("farmer_avatar")
                    item["farmName"] = item.get("farm_name")
                    item["buyerId"] = item.get("buyer_id")
                    item["buyerName"] = item.get("buyer_name")
                    item["productId"] = item.get("product_id")
                    item["productName"] = item.get("product_name")
                    item["productPrice"] = item.get("product_price")
                    item["lastUpdated"] = item.get("last_updated")
                    item["unreadCount"] = item.get("unread_count")
                    rows.append(item)
                self._send_json({"conversations": rows})

            # Notifications
            elif path == "/api/notifications":
                cursor.execute("SELECT * FROM notifications ORDER BY created_at DESC")
                rows = []
                for row in cursor.fetchall():
                    item = dict(row)
                    item["isRead"] = bool(item.get("is_read"))
                    rows.append(item)
                self._send_json({"notifications": rows})

            # Earnings and Payouts
            elif path == "/api/earnings":
                cursor.execute("SELECT * FROM payouts ORDER BY created_at DESC")
                payouts = [dict(r) for r in cursor.fetchall()]
                self._send_json({
                    "payouts": payouts,
                    "metrics": {
                        "todayEarnings": 2450,
                        "weeklyEarnings": 14850,
                        "monthlyEarnings": 58200,
                        "totalLifetimeEarnings": 142600,
                        "availableBalance": 18450,
                        "pendingEscrow": 3850
                    }
                })

            # Users
            elif path == "/api/users":
                cursor.execute("SELECT * FROM users")
                rows = []
                for row in cursor.fetchall():
                    u = dict(row)
                    u["bankDetails"] = json.loads(u.get("bank_details") or "{}")
                    u["deliveryAddress"] = json.loads(u.get("delivery_address") or "{}")
                    u["farmName"] = u.get("farm_name")
                    u["isVerified"] = bool(u.get("is_verified"))
                    u["kisanCardNumber"] = u.get("kisan_card")
                    u["experienceYears"] = u.get("experience_years")
                    u["totalCropsSold"] = u.get("total_crops_sold")
                    rows.append(u)
                self._send_json({"users": rows})

            else:
                self._send_json({"error": "Not Found", "path": path}, 404)

        except Exception as e:
            self._send_json({"error": str(e)}, 500)
        finally:
            conn.close()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
        try:
            payload = json.loads(body)
        except:
            payload = {}

        conn = Database.get_connection()
        cursor = conn.cursor()

        try:
            # Create Product
            if path == "/api/products":
                prod_id = payload.get("id") or ("prod_" + str(int(time.time() * 1000)))
                cursor.execute("""
                    INSERT INTO products 
                    (id, name, category, price, unit, min_order_qty, available_qty, harvest_date, freshness, is_organic, organic_cert, farmer_id, farmer_name, farm_name, location, rating, reviews_count, image, description, shelf_life_days, bulk_discount)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """, (
                    prod_id, payload.get("name"), payload.get("category"), payload.get("price"),
                    payload.get("unit", "kg"), payload.get("minOrderQty", 1), payload.get("availableQty", 100),
                    payload.get("harvestDate"), payload.get("freshness", "Harvested Today"),
                    1 if payload.get("isOrganic") else 0, payload.get("organicCert", "Standard"),
                    payload.get("farmerId", "usr_farmer_01"), payload.get("farmerName", "Rameshwar Patil"),
                    payload.get("farmName", "Patil Organic Farm"), payload.get("location", "Nashik, Maharashtra"),
                    payload.get("rating", 5.0), payload.get("reviewsCount", 1), payload.get("image"),
                    payload.get("description"), payload.get("shelfLifeDays", 10), payload.get("bulkDiscount", "5% off")
                ))

                # Also insert notification
                cursor.execute("""
                    INSERT INTO notifications (id, type, title, message, time, is_read, target)
                    VALUES (?,?,?,?,?,?,?)
                """, ("notif_" + str(int(time.time())), "order", "New Crop Listed! 🌾", f"Your produce '{payload.get('name')}' is now live in marketplace.", "Just now", 0, "my-products"))

                conn.commit()
                self._send_json({"success": True, "product": payload, "id": prod_id}, 201)

            # Create Order
            elif path == "/api/orders":
                order_id = payload.get("id") or ("ORD-" + str(int(time.time() % 90000 + 10000)))
                now_str = "Aug 21, 09:00 AM"
                timeline = [
                    {"step": "Order Placed", "time": now_str, "completed": True, "desc": "Order booked & payment verified."},
                    {"step": "Confirmed", "time": "Pending confirmation", "completed": False, "desc": "Farmer will confirm produce stock & packing."},
                    {"step": "Shipped", "time": "Pending", "completed": False, "desc": "Picked up by AgriLogistics Van from Farm."},
                    {"step": "Out for Delivery", "time": "Pending", "completed": False, "desc": "Delivery executive en route."},
                    {"step": "Delivered", "time": "Pending", "completed": False, "desc": "Fresh produce received at doorstep."}
                ]
                partner = {"name": "Santosh Kumar", "vehicle": "AgriDirect Express Van (MH-14-EA-6621)", "phone": "+91 98230 44556"}

                cursor.execute("""
                    INSERT INTO orders 
                    (id, date, expected_delivery, buyer_id, buyer_name, buyer_phone, delivery_address, farmer_id, farmer_name, farm_name, farmer_phone, items_json, item_total, delivery_fee, discount, total, payment_method, payment_status, status, tracking_timeline_json, delivery_partner_json)
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                """, (
                    order_id, now_str, "Tomorrow (Within 24 Hours)",
                    payload.get("buyerId", "usr_buyer_01"), payload.get("buyerName", "Ananya Sharma"), payload.get("buyerPhone", "+91 97112 34567"),
                    payload.get("deliveryAddress", "Pune, Maharashtra"), payload.get("farmerId", "usr_farmer_01"),
                    payload.get("farmerName", "Rameshwar Patil"), payload.get("farmName", "Patil Organic Farm"), "+91 98234 56789",
                    json.dumps(payload.get("items", [])), payload.get("itemTotal", 0), payload.get("deliveryFee", 0),
                    payload.get("discount", 0), payload.get("total", 0), payload.get("paymentMethod", "UPI"),
                    "Paid" if payload.get("paymentMethod") != "Cash on Delivery" else "Pending on Delivery",
                    "Pending", json.dumps(timeline), json.dumps(partner)
                ))

                # Insert notification
                cursor.execute("""
                    INSERT INTO notifications (id, type, title, message, time, is_read, target)
                    VALUES (?,?,?,?,?,?,?)
                """, ("notif_" + str(int(time.time())), "order", "New Order Booked! 📦", f"Order #{order_id} placed for ₹{payload.get('total')}.", "Just now", 0, "orders"))

                conn.commit()
                self._send_json({"success": True, "orderId": order_id, "order": payload}, 201)

            # Send Message
            elif path == "/api/messages":
                conv_id = payload.get("conversationId", "conv_01")
                sender = payload.get("sender", "buyer")
                text = payload.get("text", "")
                now_time = "10:30 AM"

                cursor.execute("SELECT messages_json FROM conversations WHERE id = ?", (conv_id,))
                row = cursor.fetchone()
                if row:
                    msgs = json.loads(row[0] or "[]")
                    msgs.append({"id": "msg_" + str(int(time.time())), "sender": sender, "text": text, "time": now_time})
                    cursor.execute("UPDATE conversations SET messages_json = ?, last_updated = ? WHERE id = ?", (json.dumps(msgs), now_time, conv_id))
                else:
                    msgs = [{"id": "msg_" + str(int(time.time())), "sender": sender, "text": text, "time": now_time}]
                    cursor.execute("""
                        INSERT INTO conversations (id, farmer_id, farmer_name, farmer_avatar, farm_name, buyer_id, buyer_name, product_id, product_name, product_price, last_updated, unread_count, messages_json)
                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
                    """, (
                        conv_id, "usr_farmer_01", "Rameshwar Patil", "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80",
                        "Patil Organic Farm", "usr_buyer_01", "Ananya Sharma", "prod_01", "Fresh Produce", "₹34/kg", now_time, 0, json.dumps(msgs)
                    ))
                conn.commit()
                self._send_json({"success": True, "conversationId": conv_id, "messages": msgs})

            # Payout Request
            elif path == "/api/payouts":
                payout_id = "PAY-" + str(int(time.time() % 9000 + 1000))
                amount = payload.get("amount", 1000)
                upi = payload.get("upi", "patil.farm@sbi")
                ref = "SBIN" + str(int(time.time() % 90000000 + 10000000))
                cursor.execute("""
                    INSERT INTO payouts (id, amount, date, status, upi, ref)
                    VALUES (?,?,?,?,?,?)
                """, (payout_id, amount, "2026-08-21", "Completed", upi, ref))

                cursor.execute("""
                    INSERT INTO notifications (id, type, title, message, time, is_read, target)
                    VALUES (?,?,?,?,?,?,?)
                """, ("notif_" + str(int(time.time())), "payment", "Payout Successful 🏦", f"₹{amount} transferred to {upi}. Ref: {ref}", "Just now", 0, "earnings"))

                conn.commit()
                self._send_json({"success": True, "payout": {"id": payout_id, "amount": amount, "upi": upi, "ref": ref, "status": "Completed"}})

            # Reset Database
            elif path == "/api/reset":
                cursor.execute("DELETE FROM products")
                cursor.execute("DELETE FROM orders")
                cursor.execute("DELETE FROM conversations")
                cursor.execute("DELETE FROM notifications")
                cursor.execute("DELETE FROM payouts")
                Database.seed_data(conn)
                self._send_json({"success": True, "message": "Database reset to initial demo state."})

            else:
                self._send_json({"error": "Unknown POST endpoint", "path": path}, 404)

        except Exception as e:
            self._send_json({"error": str(e)}, 500)
        finally:
            conn.close()

    def do_PUT(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
        try:
            payload = json.loads(body)
        except:
            payload = {}

        conn = Database.get_connection()
        cursor = conn.cursor()

        try:
            # Update order status: /api/orders/<id>/status
            if path.startswith("/api/orders/") and path.endswith("/status"):
                order_id = path.split("/")[3]
                next_status = payload.get("status", "Confirmed")

                cursor.execute("SELECT tracking_timeline_json FROM orders WHERE id = ?", (order_id,))
                row = cursor.fetchone()
                if row:
                    timeline = json.loads(row[0] or "[]")
                    statuses = ["Pending", "Confirmed", "Shipped", "Out for Delivery", "Delivered"]
                    target_idx = statuses.index(next_status) if next_status in statuses else -1
                    if target_idx >= 0:
                        for idx, step_item in enumerate(timeline):
                            if idx <= target_idx:
                                step_item["completed"] = True

                    cursor.execute("""
                        UPDATE orders 
                        SET status = ?, tracking_timeline_json = ?, payment_status = ?
                        WHERE id = ?
                    """, (next_status, json.dumps(timeline), "Paid & Settled" if next_status == "Delivered" else "Paid", order_id))

                    cursor.execute("""
                        INSERT INTO notifications (id, type, title, message, time, is_read, target)
                        VALUES (?,?,?,?,?,?,?)
                    """, ("notif_" + str(int(time.time())), "order", f"Order {next_status} 🚚", f"Order #{order_id} is now {next_status}.", "Just now", 0, "orders"))

                    conn.commit()
                    self._send_json({"success": True, "orderId": order_id, "status": next_status})
                else:
                    self._send_json({"error": "Order not found"}, 404)

            # Mark all notifications read
            elif path == "/api/notifications/read-all":
                cursor.execute("UPDATE notifications SET is_read = 1")
                conn.commit()
                self._send_json({"success": True})

            else:
                self._send_json({"error": "Unknown PUT endpoint"}, 404)

        except Exception as e:
            self._send_json({"error": str(e)}, 500)
        finally:
            conn.close()

def run_server():
    Database.init_db()
    server_address = ("", PORT)
    httpd = HTTPServer(server_address, FarmConnectAPIHandler)
    print(f"[ONLINE] FarmConnect Backend REST API running on http://localhost:{PORT}")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
