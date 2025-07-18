-- Create announcements table for the Communications feature
-- This table stores dynamic announcements that will be displayed on the website

-- Drop table if it exists (for clean setup)
DROP TABLE IF EXISTS announcements CASCADE;

-- Create announcements table
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Create policies for announcements
-- Allow all access for authenticated users (admin only)
CREATE POLICY "Enable all access for authenticated users" ON announcements
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Allow read access for anonymous users (for displaying on website)
CREATE POLICY "Enable read access for everyone" ON announcements
  FOR SELECT USING (true);

-- Create index for better performance
CREATE INDEX idx_announcements_active ON announcements(is_active, created_at);
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);

-- Insert sample announcement
INSERT INTO announcements (title, content, is_active) VALUES 
('Welcome Announcement', '✨ Free shipping on orders over $100 | New arrivals weekly', true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_announcements_updated_at 
    BEFORE UPDATE ON announcements
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Announcements table created successfully!' as result; 