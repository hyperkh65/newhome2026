-- Tables for (주)와이앤케이 LED Platform CMS

-- 1. Site Settings (Company info, Menu names, Hero settings)
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL, -- 'company', 'menu', 'hero', 'footer'
    config JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    manufacturer TEXT DEFAULT 'YNK',
    price BIGINT NOT NULL,
    original_price BIGINT,
    description TEXT,
    image TEXT,
    specs JSONB DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    documents JSONB DEFAULT '[]'::jsonb,
    certificates TEXT[] DEFAULT '{}',
    badge TEXT,
    stock INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 4.5,
    reviews INTEGER DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Board/Blog Posts
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- 'board', 'blog'
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT DEFAULT 'YNK Admin',
    attachments JSONB DEFAULT '[]', -- List of {name, url}
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial Data
INSERT INTO site_settings (category, config) VALUES 
('company', '{"name": "(주)와이앤케이", "address": "인천광역시 남동구 산단로 35 (남촌동)", "tel": "032-862-1350", "fax": "032-863-1351", "email": "contact@ynk2014.com", "business_id": "131-86-67779", "about_text": "와이앤케이는 미래를 밝히는 LED 솔루션 전문 기업입니다."}'),
('menu', '[{"label": "회사소개", "href": "/about"}, {"label": "제품소개", "href": "/shop"}, {"label": "무역/인증 안내", "href": "/trade-info"}, {"label": "물류조회", "href": "/tracking"}, {"label": "게시판", "href": "/board"}, {"label": "블로그", "href": "/blog"}]');
