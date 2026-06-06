import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

async function checkAuth() {
  return (await cookies()).get("admin_token")?.value === "authenticated";
}

const GITHUB_API = "https://api.github.com";

/**
 * Test if a GitHub token is valid.
 */
async function testToken(token: string): Promise<{ valid: boolean; login?: string; error?: string }> {
  try {
    const res = await fetch(`${GITHUB_API}/user`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
    });
    if (res.ok) {
      const user = await res.json();
      return { valid: true, login: user.login };
    }
    if (res.status === 401) {
      return { valid: false, error: "Token is invalid or expired" };
    }
    return { valid: false, error: `GitHub API returned ${res.status}` };
  } catch (e) {
    return { valid: false, error: `Failed to reach GitHub: ${e instanceof Error ? e.message : "Unknown error"}` };
  }
}

/**
 * Update an environment variable on Vercel using the Vercel API.
 */
async function updateVercelEnv(key: string, value: string): Promise<boolean> {
  const vercelToken = process.env.VERCEL_TOKEN;
  const vercelProjectId = process.env.VERCEL_PROJECT_ID;
  if (!vercelToken || !vercelProjectId) return false;

  try {
    // Create/update the env var — Vercel API handles overwriting existing keys
    const res = await fetch(
      `https://api.vercel.com/v10/projects/${vercelProjectId}/env`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${vercelToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key,
          value,
          type: "encrypted",
          target: ["production"],
        }),
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { token: newToken } = await request.json();
    if (!newToken || typeof newToken !== "string" || !newToken.startsWith("ghp_")) {
      return NextResponse.json({ error: "Invalid token format. Must start with 'ghp_'." }, { status: 400 });
    }

    // 1. Test the new token
    const test = await testToken(newToken);
    if (!test.valid) {
      return NextResponse.json({
        error: test.error || "Token verification failed",
        tested: false,
      }, { status: 400 });
    }

    const results: { localEnv: boolean; vercel: boolean; tested: boolean; login?: string } = {
      localEnv: false,
      vercel: false,
      tested: true,
      login: test.login,
    };

    // 2. Update local .env.local file (committed on next deploy)
    try {
      const envPath = path.join(process.cwd(), ".env.local");
      const repo = process.env.GITHUB_REPO || "Sha29278/santosh_acc";
      const content = `GITHUB_TOKEN=${newToken}\nGITHUB_REPO=${repo}\n`;
      // Try to update or create .env.local
      if (fs.existsSync(envPath)) {
        let existing = fs.readFileSync(envPath, "utf-8");
        existing = existing.replace(/^GITHUB_TOKEN=.*$/m, `GITHUB_TOKEN=${newToken}`);
        if (!existing.includes("GITHUB_TOKEN=")) {
          existing += `\nGITHUB_TOKEN=${newToken}`;
        }
        fs.writeFileSync(envPath, existing);
      } else {
        fs.writeFileSync(envPath, content);
      }
      results.localEnv = true;
    } catch {
      // On Vercel, filesystem is read-only — this is expected
      results.localEnv = false;
    }

    // 3. Update Vercel environment variable (if VERCEL_TOKEN is configured)
    results.vercel = await updateVercelEnv("GITHUB_TOKEN", newToken);

    return NextResponse.json({
      success: true,
      message: `Token updated and verified as @${test.login}!`,
      results,
    });
  } catch {
    return NextResponse.json({ error: "Failed to update token" }, { status: 500 });
  }
}
