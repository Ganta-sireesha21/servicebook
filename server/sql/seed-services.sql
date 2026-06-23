-- Insert sample services with INR pricing into Supabase
-- Run this SQL directly in Supabase SQL Editor > New Query

INSERT INTO services (title, description, category, duration, price, image_url, status)
VALUES
  ('Executive Coaching', 'One-to-one sessions for professional growth and leadership development.', 'Business', 60, 5500.00, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80', 'active'),
  ('Wellness Consultation', 'Personalized health planning and wellbeing support for busy professionals.', 'Wellness', 50, 3500.00, 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80', 'active'),
  ('Brand Strategy Session', 'Focused planning to align your brand story, identity, and launch strategy.', 'Creative', 75, 6500.00, 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1200&q=80', 'active'),
  ('Yoga Wellness Package', 'Guided movement, meditation, and posture coaching for stress relief.', 'Health', 55, 3200.00, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80', 'active'),
  ('Digital Marketing Bootcamp', 'Comprehensive training on SEO, social media, and content strategy.', 'Consulting', 120, 8500.00, 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80', 'active'),
  ('Graphic Design Consultation', 'Professional design guidance for branding, logos, and visual identity.', 'Creative', 60, 4500.00, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80', 'active'),
  ('Career Counseling', 'Personalized guidance for career planning, resume building, and job search strategy.', 'Consulting', 45, 2500.00, 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80', 'active'),
  ('Fitness Training Session', 'One-on-one personalized fitness coaching and workout planning.', 'Health', 60, 2000.00, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80', 'active');

-- Verify the insert
SELECT id, title, category, price FROM services ORDER BY created_at DESC LIMIT 8;
