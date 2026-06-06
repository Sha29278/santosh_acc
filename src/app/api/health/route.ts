import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const GITHUB_API = "https://api.github.com";

/**
 * GET /api/health — Returns system health status including:
 * - GitHub token validity
 * - Last commit to site-content.json
 * - Whether the full pipeline is operational
 */
export async function GET() {
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  const result: {
    githubToken: { status: string; message: string; user?: string };
    lastCommit: { exists: boolean; message?: string; date?: string; sha?: string };
    overall: string;
  } = {
    githubToken: { status: "unknown", message: "" },
    lastCommit: { exists: false },
    overall: "degraded",
  };

  // 1. Check GitHub token
  if (!token || !repo) {
    result.githubToken = { status: "missing", message: "GITHUB_TOKEN or GITHUB_REPO not configured in environment variables." };
  } else {
    try {
      const userRes = await fetch(`${GITHUB_API}/user`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
      });
      if (userRes.ok) {
        const user = await userRes.json();
        result.githubToken = {
          status: "valid",
          message: `Authenticated as @${user.login}`,
          user: user.login,
        };
      } else if (userRes.status === 401) {
        result.githubToken = { status: "expired", message: "Token is invalid or expired. Generate a new one and update it below." };
      } else {
        result.githubToken = { status: "error", message: `GitHub API returned ${userRes.status}` };
      }
    } catch (e) {
      result.githubToken = { status: "error", message: `Failed to reach GitHub API: ${e instanceof Error ? e.message : "Unknown error"}` };
    }
  }

  // 2. Check last commit to site-content.json
  if (token && repo) {
    try {
      const commitsRes = await fetch(
        `${GITHUB_API}/repos/${repo}/commits?path=data/site-content.json&per_page=1`,
        {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github.v3+json" },
        },
      );
      if (commitsRes.ok) {
        const commits = await commitsRes.json();
        if (Array.isArray(commits) && commits.length > 0) {
          result.lastCommit = {
            exists: true,
            message: commits[0].commit.message,
            date: commits[0].commit.committer.date,
            sha: commits[0].sha.slice(0, 8),
          };
        }
      }
    } catch {
      // Silently fail — this is non-critical
    }
  }

  // 3. Overall status
  if (result.githubToken.status === "valid") {
    result.overall = "healthy";
  } else if (result.githubToken.status === "expired" || result.githubToken.status === "missing") {
    result.overall = "degraded";
  } else {
    result.overall = "unknown";
  }

  return NextResponse.json(result);
}
