-- VibeResearch Supabase 실전 연동용 데이터베이스 스키마 SQL 쿼리 🛠️
-- Supabase SQL Editor에 그대로 붙여넣고 실행(Run)해 주세요!

-- 1. profiles 테이블 생성 (사용자 프로필 및 구독 정보)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  "isSubscribed" BOOLEAN DEFAULT false,
  role TEXT DEFAULT 'user',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) 활성화 (필요시 비활성화하거나 정책을 추가할 수 있습니다.)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 누구나 프로필을 읽고 쓸 수 있게 임시 정책 허용 (MVP 테스트용)
CREATE POLICY "Allow public read/write access to profiles"
ON public.profiles
FOR ALL
USING (true)
WITH CHECK (true);


-- 2. requests 테이블 생성 (리서치 요청 및 완료 보고서)
CREATE TABLE IF NOT EXISTS public.requests (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "userEmail" TEXT NOT NULL,
  topic TEXT NOT NULL,
  "targetAudience" TEXT NOT NULL,
  "specialRequests" TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
  "reportContent" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS 활성화
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- 누구나 요청을 읽고 쓸 수 있게 임시 정책 허용 (MVP 테스트용)
CREATE POLICY "Allow public read/write access to requests"
ON public.requests
FOR ALL
USING (true)
WITH CHECK (true);
