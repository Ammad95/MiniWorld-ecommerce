-- Payment Accounts and Settings Tables for MiniWorld (FIXED VERSION)
-- Run this in Supabase SQL Editor to enable dynamic settings management

-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS payment_accounts CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- Create payment_accounts table with correct schema
CREATE TABLE payment_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  payment_method_type VARCHAR(50) NOT NULL DEFAULT 'bank_transfer',
  routing_number VARCHAR(50),
  iban VARCHAR(50),
  branch_code VARCHAR(20),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table for tax and shipping rates
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE payment_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payment_accounts
CREATE POLICY "Enable read access for everyone" ON payment_accounts
  FOR SELECT USING (true);

CREATE POLICY "Enable all access for authenticated users" ON payment_accounts
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for site_settings  
CREATE POLICY "Enable read access for everyone" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Enable all access for authenticated users" ON site_settings
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Insert default settings
INSERT INTO site_settings (setting_key, setting_value, description) VALUES
  ('tax_rate', '{"rate": 0.1, "description": "Tax rate (10%)"}', 'Default tax rate applied to orders'),
  ('shipping_rate', '{"rate": 150, "free_shipping_threshold": 5000, "description": "PKR 150 shipping, free over PKR 5,000"}', 'Shipping rates and free shipping threshold'),
  ('currency', '{"code": "PKR", "symbol": "PKR", "name": "Pakistani Rupee"}', 'Default currency settings');

-- Insert sample payment account
INSERT INTO payment_accounts (
  account_name, 
  account_number, 
  bank_name, 
  payment_method_type, 
  routing_number, 
  iban, 
  branch_code, 
  description, 
  is_active
) VALUES (
  'MiniHub Business Account',
  '1234567890123456',
  'Allied Bank Limited',
  'bank_transfer',
  '010101010',
  'PK36ABCD0123456789012345',
  '0101',
  'Primary business account for bank transfers',
  true
);

-- Create indexes for better performance
CREATE INDEX idx_payment_accounts_active ON payment_accounts(is_active);
CREATE INDEX idx_payment_accounts_type ON payment_accounts(payment_method_type);
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);

-- Create trigger function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_payment_accounts_updated_at 
  BEFORE UPDATE ON payment_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at 
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Show created tables for verification
SELECT 'payment_accounts table created successfully' as status;
SELECT 'site_settings table created successfully' as status;
SELECT 'Setup completed - ready to use!' as status;
