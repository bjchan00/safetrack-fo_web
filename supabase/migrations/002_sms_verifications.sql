-- SMS 인증 임시 저장 테이블
CREATE TABLE IF NOT EXISTS sms_verifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       TEXT NOT NULL,
  code        TEXT NOT NULL,
  token       TEXT,                -- 인증 성공 후 발급되는 verify_token
  attempts    INT DEFAULT 0,       -- 인증 실패 횟수 (최대 3회)
  verified    BOOLEAN DEFAULT false,
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '3 minutes',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sms_phone_expires
  ON sms_verifications(phone, expires_at);

-- 만료된 레코드 자동 정리를 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_sms_expires_at
  ON sms_verifications(expires_at);
