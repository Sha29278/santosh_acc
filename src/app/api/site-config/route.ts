import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readJSON, writeJSON } from "@/lib/admin/storage";

interface SiteConfig {
  adminUsername: string;
  adminPassword: string;
  adminEmail?: string;
  siteName: string;
  siteDescription: string;
  heroBadge: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  logoUrl?: string;
}

export const dynamic = "force-dynamic";

const MASKED_PASSWORD = "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022";

async function checkAuth() {
  return (await cookies()).get("admin_token")?.value === "authenticated";
}

export async function GET() {
  const config = await readJSON<SiteConfig>("site-config.json", {
    adminUsername: "admin",
    adminPassword: "admin@123",
    siteName: "AccTax Solutions",
    siteDescription: "Your Trusted GST & Taxation Partner",
    heroBadge: "Trusted by businesses across India",
    contactEmail: "info@acctaxsolutions.in",
    contactPhone: "+91 9613461462",
    address: "Fancy Ali, Jorhat, Assam - 785001",
    logoUrl: "",
  });
  // Never expose password in response
  const safe = { ...config, adminPassword: MASKED_PASSWORD };
  return NextResponse.json(safe);
}

export async function PUT(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const current = await readJSON<SiteConfig>("site-config.json", {
      adminUsername: "admin",
      adminPassword: "admin@123",
      siteName: "AccTax Solutions",
      siteDescription: "Your Trusted GST & Taxation Partner",
      heroBadge: "Trusted by businesses across India",
      contactEmail: "info@acctaxsolutions.in",
      contactPhone: "+91 9613461462",
      address: "Fancy Ali, Jorhat, Assam - 785001",
      logoUrl: "",
    });

    // Use ?? (nullish coalescing) so fields can be set to empty string
    const updated: SiteConfig = {
      adminUsername: body.adminUsername ?? current.adminUsername,
      adminPassword: body.adminPassword && body.adminPassword !== MASKED_PASSWORD
        ? body.adminPassword
        : current.adminPassword,
      adminEmail: body.adminEmail ?? current.adminEmail ?? "",
      siteName: body.siteName ?? current.siteName,
      siteDescription: body.siteDescription ?? current.siteDescription,
      heroBadge: body.heroBadge ?? current.heroBadge,
      contactEmail: body.contactEmail ?? current.contactEmail,
      contactPhone: body.contactPhone ?? current.contactPhone,
      address: body.address ?? current.address,
      logoUrl: body.logoUrl !== undefined ? body.logoUrl : (current.logoUrl || ""),
    };

    const saved = await writeJSON("site-config.json", updated);
    if (!saved) {
      return NextResponse.json({ error: "Settings were not persisted — GitHub save failed. Check your GITHUB_TOKEN." }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: "Settings saved successfully!" });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
