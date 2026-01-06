-- supabase/schema.sql
-- Create Products Table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  brand text not null,
  price integer not null,
  sale_price integer,
  images text[], -- Array of image URLs
  category text,
  description text,
  story_content jsonb, -- Editorial content structure: [{ type: 'image' | 'text', ... }]
  options jsonb, -- Available options: { sizes: [], colors: [] }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;

-- Create Policy: Allow public read access
create policy "Allow public read access"
  on public.products
  for select
  to public
  using (true);

-- Insert Sample Data (Editorial Product)
insert into public.products (
  name, 
  brand, 
  price, 
  sale_price, 
  category, 
  description,
  options,
  story_content
) values (
  'Essential Basic T-Shirt',
  '29CM STANDARD',
  59000,
  45000,
  'Top',
  '일상의 편안함을 위한 최적의 선택. 고밀도 코튼 소재가 주는 부드러운 터치감을 경험하세요.',
  '{
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["White", "Black", "Navy"]
  }',
  '[
    {
      "type": "header",
      "content": "The Essential\\nDaily Wear"
    },
    {
      "type": "text",
      "content": "일상의 편안함을 위한 최적의 선택.\\n고밀도 코튼 소재가 주는 부드러운 터치감과\\n어떤 스타일에도 자연스럽게 어우러지는 실루엣을 경험해보세요."
    },
    {
      "type": "image",
      "src": "/placeholder-1.jpg",
      "caption": "Natural Silhouette"
    },
    {
      "type": "grid",
      "items": [
        { "type": "image", "src": "/placeholder-2.jpg", "caption": "Detail View 1" },
        { "type": "image", "src": "/placeholder-3.jpg", "caption": "Detail View 2" }
      ]
    },
    {
      "type": "footer",
      "title": "Material & Care",
      "content": "Cotton 100%\\nMachine wash cold."
    }
  ]'
);
