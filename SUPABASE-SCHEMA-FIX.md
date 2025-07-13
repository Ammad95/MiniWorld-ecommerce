# 🔧 Supabase Schema Fix - Duplicate Column Issue

## ❌ **Problem Found**
```
ERROR: 42701: column "customer_name" specified more than once
```

## 🔍 **Root Cause**
The error occurred in the `order_analytics` view at the end of the schema file. The view was trying to create two columns with the same name:

1. **From `o.*`**: `customer_name` (from orders table)
2. **From `c.name as customer_name`**: Another `customer_name` (from customers table)

## ✅ **Solution Applied**

### **Fixed Line:**
```sql
-- BEFORE (caused error):
CREATE VIEW order_analytics AS
SELECT 
    o.*,
    c.name as customer_name,  -- ❌ Duplicate!
    c.mobile as customer_mobile,
    EXTRACT(month FROM o.created_at) as order_month,
    EXTRACT(year FROM o.created_at) as order_year
FROM orders o
LEFT JOIN customers c ON c.id = o.customer_id;

-- AFTER (fixed):
CREATE VIEW order_analytics AS
SELECT 
    o.*,
    c.name as registered_customer_name,  -- ✅ Renamed!
    c.mobile as customer_mobile,
    EXTRACT(month FROM o.created_at) as order_month,
    EXTRACT(year FROM o.created_at) as order_year
FROM orders o
LEFT JOIN customers c ON c.id = o.customer_id;
```

## 🚀 **How to Fix This**

### **Option 1: Use the Fixed File**
1. Use `supabase-schema-fixed.sql` instead of the original
2. This file has the correction already applied

### **Option 2: Quick Manual Fix**
If you already started with the original file:
1. Go to the **end of the SQL file**
2. Find the `order_analytics` view (around line 290)
3. Change `c.name as customer_name` to `c.name as registered_customer_name`
4. Run the corrected SQL

## 📊 **What This View Does**
The `order_analytics` view provides useful data for admin reports:
- All order details
- Customer information (for registered customers)
- Order timing for analytics
- Combined order and customer data in one query

## ✅ **Verification**
After running the fixed schema, you should see:
```
MiniWorld Database Schema Created Successfully! 🚀
```

## 🎯 **Next Steps**
1. **Run the fixed schema**: Use `supabase-schema-fixed.sql`
2. **Verify tables created**: Check Table Editor in Supabase
3. **Continue setup**: Follow the Supabase setup guide
4. **Test the views**: Query `order_analytics` and `product_analytics`

---

**The schema is now ready to run without errors! 🎉** 