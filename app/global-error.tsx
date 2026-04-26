"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ko">
      <body>
        <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
            오류가 발생했습니다
          </h1>
          <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
            잠시 후 다시 시도해주세요.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1.5rem",
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
