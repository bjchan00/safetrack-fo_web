-- members 테이블에 registration_channel 컬럼 추가
ALTER TABLE members
  ADD COLUMN IF NOT EXISTS registration_channel TEXT
    CHECK (registration_channel IN ('app_ios', 'app_android', 'web', 'admin'))
    DEFAULT 'admin';

-- 기존 데이터 (BO에서 생성된 회원)는 'admin'으로 처리
UPDATE members SET registration_channel = 'admin' WHERE registration_channel IS NULL;
