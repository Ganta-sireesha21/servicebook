-- Supabase PostgreSQL schema for Service Booking Platform

create extension if not exists "uuid-ossp";

create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null unique,
  password text not null,
  phone text,
  profile_image text,
  role text not null default 'customer',
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  category text not null,
  duration integer not null,
  price numeric(10,2) not null,
  image_url text,
  status text not null default 'active',
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  service_id uuid references services(id) on delete cascade,
  booking_date date not null,
  booking_time text not null,
  notes text,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  booking_id uuid references bookings(id) on delete cascade,
  amount numeric(10,2) not null,
  payment_status text not null default 'pending',
  transaction_id text,
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamp with time zone default timezone('utc', now())
);

insert into services (title, description, category, duration, price, image_url, status)
values
('Executive Coaching', 'One-to-one sessions for professional growth and leadership development.', 'Business', 60, 190.00, 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80', 'active'),
('Wellness Consultation', 'Personalized health planning and wellbeing support for busy professionals.', 'Wellness', 50, 120.00, 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1200&q=80', 'active'),
('Brand Strategy Session', 'Focused planning to align your brand story, identity, and launch strategy.', 'Creative', 75, 220.00, 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=1200&q=80', 'active'),
('Yoga Wellness Package', 'Guided movement, meditation, and posture coaching for stress relief.', 'Health', 55, 110.00, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80', 'active');
