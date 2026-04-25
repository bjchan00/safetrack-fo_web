-- 회원 약관 동의 이력 테이블
CREATE TABLE IF NOT EXISTS member_terms_agreements (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id        UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  terms_agreed     BOOLEAN NOT NULL DEFAULT false,
  privacy_agreed   BOOLEAN NOT NULL DEFAULT false,
  location_agreed  BOOLEAN NOT NULL DEFAULT false,
  marketing_agreed BOOLEAN NOT NULL DEFAULT false,
  agreed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address       TEXT,
  user_agent       TEXT
);

CREATE INDEX IF NOT EXISTS idx_terms_member_id
  ON member_terms_agreements(member_id);
