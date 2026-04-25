export function normalizePhone(phone: string): string {
  return phone.replace(/[-\s]/g, "");
}

export function validatePhone(phone: string): boolean {
  return /^01[016789]\d{7,8}$/.test(normalizePhone(phone));
}

export function validatePassword(password: string): boolean {
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2 && !/[^가-힣a-zA-Z\s]/.test(name.trim());
}

export function getPasswordStrength(password: string): "weak" | "medium" | "strong" {
  if (password.length < 8) return "weak";
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);
  if (hasLetter && hasNumber && hasSpecial && password.length >= 10) return "strong";
  if (hasLetter && hasNumber) return "medium";
  return "weak";
}

export function formatPhone(phone: string): string {
  const p = normalizePhone(phone);
  if (p.length === 11) return `${p.slice(0, 3)}-${p.slice(3, 7)}-${p.slice(7)}`;
  if (p.length === 10) return `${p.slice(0, 3)}-${p.slice(3, 6)}-${p.slice(6)}`;
  return phone;
}
