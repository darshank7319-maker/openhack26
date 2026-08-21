"""
FarmConnect Backend - Database Manager (SQLite + JSON Persistence Engine)
"""

import sqlite3
import json
import os
import time

DB_FILE = os.path.join(os.path.dirname(__file__), "farmconnect.db")

class Database:
    @staticmethod
    def get_connection():
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        return conn

    @classmethod
    def init_db(cls):
        conn = cls.get_connection()
        cursor = conn.cursor()

        # Users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                role TEXT,
                name TEXT,
                email TEXT,
                phone TEXT,
                avatar TEXT,
                farm_name TEXT,
                location TEXT,
                rating REAL,
                total_ratings INTEGER,
                is_verified INTEGER,
                kisan_card TEXT,
                experience_years INTEGER,
                total_crops_sold TEXT,
                bio TEXT,
                bank_details TEXT,
                delivery_address TEXT
            )
        """)

        # Products table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                name TEXT,
                category TEXT,
                price REAL,
                unit TEXT,
                min_order_qty REAL,
                available_qty REAL,
                harvest_date TEXT,
                freshness TEXT,
                is_organic INTEGER,
                organic_cert TEXT,
                farmer_id TEXT,
                farmer_name TEXT,
                farm_name TEXT,
                location TEXT,
                rating REAL,
                reviews_count INTEGER,
                image TEXT,
                description TEXT,
                shelf_life_days INTEGER,
                bulk_discount TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Orders table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id TEXT PRIMARY KEY,
                date TEXT,
                expected_delivery TEXT,
                buyer_id TEXT,
                buyer_name TEXT,
                buyer_phone TEXT,
                delivery_address TEXT,
                farmer_id TEXT,
                farmer_name TEXT,
                farm_name TEXT,
                farmer_phone TEXT,
                items_json TEXT,
                item_total REAL,
                delivery_fee REAL,
                discount REAL,
                total REAL,
                payment_method TEXT,
                payment_status TEXT,
                status TEXT,
                tracking_timeline_json TEXT,
                delivery_partner_json TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Mandi Prices table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS mandi_prices (
                id TEXT PRIMARY KEY,
                commodity TEXT,
                category TEXT,
                current_price REAL,
                previous_price REAL,
                change_percent REAL,
                trend TEXT,
                local_mandi TEXT,
                best_mandi TEXT,
                farm_connect_price REAL,
                market_demand TEXT,
                advisory_tip TEXT
            )
        """)

        # Conversations table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS conversations (
                id TEXT PRIMARY KEY,
                farmer_id TEXT,
                farmer_name TEXT,
                farmer_avatar TEXT,
                farm_name TEXT,
                buyer_id TEXT,
                buyer_name TEXT,
                product_id TEXT,
                product_name TEXT,
                product_price TEXT,
                last_updated TEXT,
                unread_count INTEGER,
                messages_json TEXT
            )
        """)

        # Notifications table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS notifications (
                id TEXT PRIMARY KEY,
                type TEXT,
                title TEXT,
                message TEXT,
                time TEXT,
                is_read INTEGER,
                target TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Payouts table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS payouts (
                id TEXT PRIMARY KEY,
                amount REAL,
                date TEXT,
                status TEXT,
                upi TEXT,
                ref TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        conn.commit()

        # Seed initial data if empty
        cursor.execute("SELECT COUNT(*) FROM products")
        if cursor.fetchone()[0] == 0:
            cls.seed_data(conn)

        conn.close()

    @classmethod
    def seed_data(cls, conn):
        cursor = conn.cursor()
        
        # Seed Demo Users
        users = [
            ("usr_farmer_01", "farmer", "Rameshwar Patil", "farmer@farmconnect.com", "+91 98234 56789", 
             "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80",
             "Patil Organic Agri Farms", "Nashik, Maharashtra", 4.9, 128, 1, "MH-NSK-2024-8841", 16, "1,420 Quintals",
             "Passionate certified organic farmer producing export-grade tomatoes, onions, and table grapes using sustainable drip irrigation.",
             json.dumps({"accountHolder": "Rameshwar B. Patil", "bankName": "State Bank of India", "accountNumber": "•••• •••• 4892", "ifsc": "SBIN0001244", "upiId": "patil.farm@sbi"}),
             json.dumps({"fullName": "Rameshwar Patil", "city": "Nashik", "state": "Maharashtra"})),
            ("usr_buyer_01", "buyer", "Ananya Sharma", "buyer@farmconnect.com", "+91 97112 34567",
             "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
             "", "Kothrud, Pune, Maharashtra", 5.0, 12, 1, "", 0, "",
             "Retail Consumer & Organic Produce Enthusiast.",
             "{}",
             json.dumps({"fullName": "Ananya Sharma", "phone": "+91 97112 34567", "street": "Flat 402, Green Meadows Residency, Paud Road", "city": "Pune", "state": "Maharashtra", "pincode": "411038", "landmark": "Near Vanaz Metro Station"}))
        ]

        cursor.executemany("""
            INSERT OR REPLACE INTO users VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, users)

        # Seed Sample Products
        products = [
            ("prod_01", "Fresh Hybrid Red Tomatoes", "Vegetables", 34, "kg", 5, 450, "2026-08-19", "Harvested Yesterday", 1, "NPOP Organic India Certified", "usr_farmer_01", "Rameshwar Patil", "Patil Organic Agri Farms", "Nashik, Maharashtra", 4.9, 46, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80", "Vine-ripened, naturally sweet hybrid tomatoes grown with zero synthetic pesticides.", 8, "10% off for 50kg+"),
            ("prod_02", "Nashik Premium Red Onions", "Vegetables", 28, "kg", 10, 1200, "2026-08-17", "Cured 4 Days Ago", 0, "Standard APMC Graded A+", "usr_farmer_01", "Rameshwar Patil", "Patil Organic Agri Farms", "Lasalgaon, Nashik", 4.8, 84, "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80", "Export quality Lasalgaon pinkish-red onions with high pungency.", 30, "₹2/kg discount on 100kg+"),
            ("prod_03", "Jyoti Golden Table Potatoes", "Vegetables", 22, "kg", 5, 850, "2026-08-15", "Direct Cold Farm Vault", 1, "Jaivik Bharat Certified", "usr_farmer_02", "Suresh Deshmukh", "Deshmukh Agro Land", "Manchar, Pune", 4.7, 32, "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80", "Smooth-skinned Kufri Jyoti potatoes rich in natural starch.", 45, "8% off on 50kg+"),
            ("prod_04", "Sharbati Golden Wheat (Unpolished)", "Grains & Cereals", 46, "kg", 25, 3200, "2026-07-28", "Sun-dried & Cleaned", 1, "Jaivik Bharat Certified", "usr_farmer_03", "Balwinder Singh", "Singh Natural Harvests", "Sehore, Madhya Pradesh", 4.95, 92, "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80", "Aromatic golden-kernelled Sharbati MP wheat known as Queen of Wheat.", 180, "₹3/kg off on 1 Quintal"),
            ("prod_05", "Traditional Basmati Paddy Rice (Taraori)", "Grains & Cereals", 78, "kg", 10, 2100, "2026-07-10", "Aged 1 Year", 1, "NPOP Organic India", "usr_farmer_04", "Harpreet Brar", "Doaba Green Acres", "Karnal, Haryana", 4.9, 54, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80", "Authentic long-grain scented Basmati rice extending 2.5x on cooking.", 365, "12% off on 100kg+"),
            ("prod_06", "Fresh Juicy Crunchy Red Carrots", "Vegetables", 36, "kg", 3, 380, "2026-08-20", "Harvested Today", 1, "NPOP Organic India", "usr_farmer_01", "Rameshwar Patil", "Patil Organic Agri Farms", "Nashik, Maharashtra", 4.8, 29, "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80", "Sweet, crunchy country carrots packed with Vitamin A.", 10, "5% off for 20kg+"),
            ("prod_07", "Grand Naine Ripe Yellow Bananas", "Fruits", 42, "dozen", 2, 260, "2026-08-19", "Naturally Ripened (0 Carbide)", 1, "Chemical-Free Certified", "usr_farmer_05", "Kishor Chaudhari", "Khandesh Banana Orchards", "Jalgaon, Maharashtra", 4.85, 68, "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80", "Creamy, naturally sweet Jalgaon bananas ripened without chemicals.", 6, "₹5/dozen off on 10+"),
            ("prod_08", "Ratnagiri Alphonso (Hapus) Mangoes", "Fruits", 580, "dozen", 1, 85, "2026-08-18", "GI Tag Certified Batch", 1, "GI Registered", "usr_farmer_06", "Ganesh Kelkar", "Konkan Heritage Orchards", "Devgad, Ratnagiri", 5.0, 112, "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80", "Authentic Devgad Alphonso with floral aroma and golden saffron pulp.", 7, "10% off on 5+ Crates"),
            ("prod_09", "Organic Farm Raw Honey (Wildflower)", "Dairy & Organic", 340, "kg", 1, 140, "2026-08-01", "Raw & Unprocessed", 1, "Jaivik Bharat Certified", "usr_farmer_07", "Mahesh Joshi", "Sahyadri Bee Apiary", "Mahabaleshwar, Maharashtra", 4.9, 38, "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80", "100% pure raw wildflower honey extracted from western ghat bee boxes.", 500, "₹30 off on 3kg+"),
            ("prod_10", "Salem Lakadong High-Curcumin Turmeric", "Spices & Herbs", 180, "kg", 1, 320, "2026-07-25", "Hand-sorted Dry", 1, "Jaivik Bharat Organic", "usr_farmer_08", "Venkatesan Pillai", "Kaveri Spice Estates", "Salem, Tamil Nadu", 4.92, 45, "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80", "Potent turmeric rhizomes containing over 5.8% natural curcumin content.", 360, "15% off on 10kg+")
        ]

        for p in products:
            cursor.execute("""
                INSERT OR REPLACE INTO products 
                (id, name, category, price, unit, min_order_qty, available_qty, harvest_date, freshness, is_organic, organic_cert, farmer_id, farmer_name, farm_name, location, rating, reviews_count, image, description, shelf_life_days, bulk_discount)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            """, p)

        # Seed Orders
        order_items = [
            {"productId": "prod_01", "name": "Fresh Hybrid Red Tomatoes", "price": 34, "unit": "kg", "quantity": 10, "image": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"},
            {"productId": "prod_06", "name": "Fresh Juicy Crunchy Red Carrots", "price": 36, "unit": "kg", "quantity": 5, "image": "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=600&auto=format&fit=crop&q=80"}
        ]
        timeline = [
            {"step": "Order Placed", "time": "Aug 21, 08:30 AM", "completed": True, "desc": "Order received and payment verified via UPI."},
            {"step": "Confirmed", "time": "Pending confirmation", "completed": False, "desc": "Farmer will confirm produce stock & packing."},
            {"step": "Shipped", "time": "Pending", "completed": False, "desc": "Picked up by AgriLogistics Van from Nashik Farm."},
            {"step": "Out for Delivery", "time": "Pending", "completed": False, "desc": "Delivery executive en route to Kothrud, Pune."},
            {"step": "Delivered", "time": "Pending", "completed": False, "desc": "Fresh produce received at doorstep."}
        ]
        partner = {"name": "Vikas Shinde", "vehicle": "AgriDirect Express Van (MH-15-EG-4912)", "phone": "+91 98450 11223"}

        cursor.execute("""
            INSERT OR REPLACE INTO orders 
            (id, date, expected_delivery, buyer_id, buyer_name, buyer_phone, delivery_address, farmer_id, farmer_name, farm_name, farmer_phone, items_json, item_total, delivery_fee, discount, total, payment_method, payment_status, status, tracking_timeline_json, delivery_partner_json)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, (
            "ORD-94821", "2026-08-21 08:30 AM", "Tomorrow (Within 24 Hours)", "usr_buyer_01", "Ananya Sharma", "+91 97112 34567",
            "Flat 402, Green Meadows Residency, Paud Road, Pune 411038", "usr_farmer_01", "Rameshwar Patil", "Patil Organic Agri Farms", "+91 98234 56789",
            json.dumps(order_items), 520, 0, 52, 468, "UPI (Google Pay)", "Paid", "Pending", json.dumps(timeline), json.dumps(partner)
        ))

        # Seed Mandi Prices
        mandi = [
            ("mandi_01", "Tomato (Hybrid)", "Vegetables", 34, 30, 13.3, "up", "Pimpalgaon APMC (₹3,200/Q)", "Azadpur APMC, Delhi (₹3,600/Q)", 34, "High Demand", "Harvest peak flush now; urban demand jumped 18% in last 48h."),
            ("mandi_02", "Red Onion (Nashik Quality)", "Vegetables", 28, 29.5, -5.1, "down", "Lasalgaon APMC (₹2,650/Q)", "Vashi APMC, Mumbai (₹2,950/Q)", 28, "Steady", "Store well-cured bulbs in aerated crates."),
            ("mandi_03", "Potato (Kufri Jyoti)", "Vegetables", 22, 21, 4.8, "up", "Pune Market Yard (₹2,100/Q)", "Agra Mandi, UP (₹2,350/Q)", 22, "High Demand", "Direct retail through FarmConnect yields ₹4/kg more than middlemen."),
            ("mandi_04", "Sharbati Wheat (Grade A)", "Grains & Cereals", 46, 44, 4.5, "up", "Sehore APMC (₹4,200/Q)", "Khanna Mandi, Punjab (₹4,700/Q)", 46, "Very High", "Premium grain quality commanding strong buyer interest."),
            ("mandi_05", "Basmati Rice (Aged Grain)", "Grains & Cereals", 78, 76, 2.6, "up", "Karnal APMC (₹7,200/Q)", "Delhi APMC (₹8,100/Q)", 78, "Export Rally", "Zero packaging deductions when listing directly to cooperative groups."),
            ("mandi_06", "Grand Naine Banana", "Fruits", 42, 45, -6.6, "down", "Jalgaon Mandi (₹1,600/Crate)", "Surat APMC (₹1,850/Crate)", 42, "Moderate", "Bundle as ripe ready-to-eat packs for premium households."),
            ("mandi_07", "Lakadong Turmeric", "Spices & Herbs", 180, 168, 7.1, "up", "Erode APMC (₹16,500/Q)", "Sangli Mandi (₹18,200/Q)", 180, "Surging", "High curcumin varieties in peak demand for wellness products.")
        ]
        cursor.executemany("""
            INSERT OR REPLACE INTO mandi_prices VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        """, mandi)

        # Seed Notifications
        notifs = [
            ("notif_01", "order", "New Direct Order Received! 🎉", "Buyer Ananya Sharma placed order #ORD-94821 for Tomatoes & Carrots (₹468).", "15 mins ago", 0, "orders"),
            ("notif_02", "price", "Tomato Mandi Rate Alert 📈", "Tomato prices in Pimpalgaon Mandi increased by +13.3% today to ₹34/kg.", "1 hour ago", 0, "mandi"),
            ("notif_03", "payment", "Payment Credited 💰", "₹1,060 settled for Order #ORD-93502 directly to your State Bank of India account.", "2 hours ago", 1, "earnings")
        ]
        cursor.executemany("""
            INSERT OR REPLACE INTO notifications (id, type, title, message, time, is_read, target) VALUES (?,?,?,?,?,?,?)
        """, notifs)

        # Seed Payouts
        payouts = [
            ("PAY-2091", 4800, "2026-08-18", "Completed", "patil.farm@sbi", "SBIN88219491"),
            ("PAY-1980", 6200, "2026-08-10", "Completed", "patil.farm@sbi", "SBIN77109244")
        ]
        cursor.executemany("""
            INSERT OR REPLACE INTO payouts (id, amount, date, status, upi, ref) VALUES (?,?,?,?,?,?)
        """, payouts)

        # Seed Conversations
        conv_messages = [
            {"id": "msg_1", "sender": "buyer", "text": "Namaste Rameshwar ji! Are your tomatoes 100% organic?", "time": "09:45 AM"},
            {"id": "msg_2", "sender": "farmer", "text": "Namaste Ananya ji! Yes, completely natural using Jeevamrutha bio-fertilizer.", "time": "09:50 AM"},
            {"id": "msg_3", "sender": "buyer", "text": "Can you dispatch 10kg by tomorrow?", "time": "10:10 AM"},
            {"id": "msg_4", "sender": "farmer", "text": "Absolutely! Placed orders are dispatched in chilled logistics vans.", "time": "10:15 AM"}
        ]
        cursor.execute("""
            INSERT OR REPLACE INTO conversations 
            (id, farmer_id, farmer_name, farmer_avatar, farm_name, buyer_id, buyer_name, product_id, product_name, product_price, last_updated, unread_count, messages_json)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, (
            "conv_01", "usr_farmer_01", "Rameshwar Patil", "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80",
            "Patil Organic Agri Farms", "usr_buyer_01", "Ananya Sharma", "prod_01", "Fresh Hybrid Red Tomatoes", "₹34/kg", "10:15 AM", 1, json.dumps(conv_messages)
        ))

        conn.commit()
