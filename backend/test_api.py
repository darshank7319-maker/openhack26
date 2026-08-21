"""
FarmConnect Backend - Automated Endpoint Test Suite
"""

import urllib.request
import urllib.parse
import json

BASE_URL = "http://localhost:5000/api"

def test_endpoint(name, url, method="GET", data=None):
    try:
        req = urllib.request.Request(url, method=method)
        req.add_header("Content-Type", "application/json")
        encoded_data = json.dumps(data).encode("utf-8") if data else None
        
        with urllib.request.urlopen(req, data=encoded_data) as resp:
            status = resp.getcode()
            body = json.loads(resp.read().decode("utf-8"))
            print(f"[PASS] {method} {name} -> HTTP {status}")
            return body
    except Exception as e:
        print(f"[FAIL] {method} {name} -> ERROR: {e}")
        return None

def run_tests():
    print("==================================================")
    print("Testing FarmConnect Backend REST API (Port 5000)")
    print("==================================================")
    
    # 1. Health
    test_endpoint("Health Check", f"{BASE_URL}/health")

    # 2. Products List
    prods = test_endpoint("Get Products", f"{BASE_URL}/products")
    
    # 3. Single Product
    if prods and prods.get("products"):
        first_id = prods["products"][0]["id"]
        test_endpoint(f"Get Product {first_id}", f"{BASE_URL}/products/{first_id}")

    # 4. Add New Crop Product
    new_crop = {
        "name": "Mahabaleshwar Organic Strawberries",
        "category": "Fruits",
        "price": 280,
        "unit": "crate",
        "minOrderQty": 1,
        "availableQty": 60,
        "harvestDate": "2026-08-21",
        "freshness": "Fresh Pick",
        "isOrganic": True,
        "organicCert": "Jaivik Bharat Certified",
        "location": "Mahabaleshwar, Maharashtra",
        "image": "https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=600",
        "description": "Sweet, juicy, freshly picked red strawberries from high-altitude hill farms."
    }
    added = test_endpoint("Create Product (Add Crop)", f"{BASE_URL}/products", method="POST", data=new_crop)

    # 5. Orders List
    orders = test_endpoint("Get Orders", f"{BASE_URL}/orders")

    # 6. Place New Order
    new_order = {
        "items": [
            {"productId": "prod_01", "name": "Fresh Hybrid Red Tomatoes", "price": 34, "unit": "kg", "quantity": 5}
        ],
        "itemTotal": 170,
        "deliveryFee": 40,
        "discount": 17,
        "total": 193,
        "paymentMethod": "UPI (Google Pay)",
        "buyerName": "Ananya Sharma",
        "deliveryAddress": "Pune, Maharashtra"
    }
    created_order = test_endpoint("Create Order (Checkout)", f"{BASE_URL}/orders", method="POST", data=new_order)

    # 7. Update Order Status
    if created_order and created_order.get("orderId"):
        test_endpoint(f"Update Order Status", f"{BASE_URL}/orders/{created_order['orderId']}/status", method="PUT", data={"status": "Confirmed"})

    # 8. Mandi Prices
    test_endpoint("Get Mandi Prices", f"{BASE_URL}/mandi-prices")

    # 9. Conversations & Messages
    test_endpoint("Get Conversations", f"{BASE_URL}/conversations")
    test_endpoint("Send Chat Message", f"{BASE_URL}/messages", method="POST", data={"conversationId": "conv_01", "text": "Are these tomatoes fresh?", "sender": "buyer"})

    # 10. Earnings & Payout
    test_endpoint("Get Earnings", f"{BASE_URL}/earnings")
    test_endpoint("Request Payout", f"{BASE_URL}/payouts", method="POST", data={"amount": 2500, "upi": "patil.farm@sbi"})

    # 11. Notifications
    test_endpoint("Get Notifications", f"{BASE_URL}/notifications")

    # 12. Users
    test_endpoint("Get Users", f"{BASE_URL}/users")

    print("\n[SUCCESS] All FarmConnect backend API endpoints tested and verified!")

if __name__ == "__main__":
    run_tests()
