import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Create admin client that bypasses RLS
const adminClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const sampleServices = [
  {
    title: 'Executive Coaching',
    description: 'One-to-one sessions for professional growth and leadership development.',
    category: 'Business',
    duration: 60,
    price: 5500.00,
    image_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    status: 'active'
  },
  {
    title: 'Wellness Consultation',
    description: 'Personalized health planning and wellbeing support for busy professionals.',
    category: 'Wellness',
    duration: 50,
    price: 3500.00,
    image_url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80',
    status: 'active'
  },
  {
    title: 'Brand Strategy Session',
    description: 'Focused planning to align your brand story, identity, and launch strategy.',
    category: 'Creative',
    duration: 75,
    price: 6500.00,
    image_url: 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1200&q=80',
    status: 'active'
  },
  {
    title: 'Yoga Wellness Package',
    description: 'Guided movement, meditation, and posture coaching for stress relief.',
    category: 'Health',
    duration: 55,
    price: 3200.00,
    image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    status: 'active'
  },
  {
    title: 'Digital Marketing Bootcamp',
    description: 'Comprehensive training on SEO, social media, and content strategy.',
    category: 'Consulting',
    duration: 120,
    price: 8500.00,
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    status: 'active'
  },
  {
    title: 'Graphic Design Consultation',
    description: 'Professional design guidance for branding, logos, and visual identity.',
    category: 'Creative',
    duration: 60,
    price: 4500.00,
    image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
    status: 'active'
  },
  {
    title: 'Career Counseling',
    description: 'Personalized guidance for career planning, resume building, and job search strategy.',
    category: 'Consulting',
    duration: 45,
    price: 2500.00,
    image_url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    status: 'active'
  },
  {
    title: 'Fitness Training Session',
    description: 'One-on-one personalized fitness coaching and workout planning.',
    category: 'Health',
    duration: 60,
    price: 2000.00,
    image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    status: 'active'
  }
];

async function seed() {
  try {
    console.log('Starting database seed...');
    console.log('Using admin client to bypass RLS policies...');
    
    // Insert sample services using admin client
    const { data, error } = await adminClient
      .from('services')
      .insert(sampleServices)
      .select();
    
    if (error) {
      console.error('Error seeding services:', error);
      process.exit(1);
    } else {
      console.log(`✓ Successfully seeded ${data.length} services`);
      console.log('\nSeeded services:');
      data.forEach(s => {
        console.log(`  - ${s.title} (${s.category}): ₹${s.price}`);
      });
      process.exit(0);
    }
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
