import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readJSON, writeJSON } from "@/lib/admin/storage";

// Generate a secure random password
function generatePassword(length = 12): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "!@#$%^&*";
  const all = upper + lower + digits + special;

  // Ensure at least one of each type
  let password = "";
  password += upper[Math.floor(Math.random() * upper.length)];
  password += lower[Math.floor(Math.random() * lower.length)];
  password += digits[Math.floor(Math.random() * digits.length)];
  password += special[Math.floor(Math.random() * special.length)];

  // Fill remaining characters
  for (let i = password.length; i < length; i++) {
    password += all[Math.floor(Math.random() * all.length)];
  }

  // Shuffle the password
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

export async function POST() {
  // Check if already authenticated (only logged-in admins can reset)
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  const isAuthenticated = token?.value === "authenticated";
  if (!isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await readJSON<{ adminUsername: string; adminPassword: string }>("site-config.json", {
    adminUsername: "admin",
    adminPassword: "admin@123",
  });

  // If not authenticated, reset requires knowing the current username
  // For simplicity, we allow reset from the login page with just username verification
  // Or this can be triggered while logged in from the sidebar

  // Generate new password
  const newPassword = generatePassword();
  config.adminPassword = newPassword;
  await writeJSON("site-config.json", config);

  return NextResponse.json({
    success: true,
    message: "Password has been reset successfully.",
    newPassword: newPassword,
  });
}
