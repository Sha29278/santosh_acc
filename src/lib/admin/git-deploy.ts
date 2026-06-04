/**
 * Git Deploy — commits changes to GitHub via the GitHub API.
 *
 * When the admin saves content, the updated JSON files are committed directly
 * to the repo. Vercel auto-deploys from GitHub, so changes go live in ~30-60s.
 *
 * Required environment variables:
 *   GITHUB_TOKEN   — Personal Access Token with `repo` scope
 *   GITHUB_REPO    — "owner/repo" format (e.g., "Sha29278/santosh_acc")
 *
 * Falls back gracefully if env vars are not set (local dev mode).
 */

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  if (!token || !repo) return null;
  return { token, repo };
}

const API = "https://api.github.com";

/**
 * Get the current SHA of a file (needed for updates).
 * Returns null if the file doesn't exist yet.
 */
async function getFileSha(
  path: string,
): Promise<string | null> {
  const config = getConfig();
  if (!config) return null;

  try {
    const res = await fetch(`${API}/repos/${config.repo}/contents/${path}`, {
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any).sha ?? null;
  } catch {
    return null;
  }
}

/**
 * Commit a text file to the repository.
 * Creates the file if it doesn't exist, updates it if it does.
 */
export async function commitTextFile(
  filePath: string,
  content: string,
  message: string,
): Promise<boolean> {
  const config = getConfig();
  if (!config) return false;

  try {
    const sha = await getFileSha(filePath);
    const body: Record<string, unknown> = {
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
    };
    if (sha) body.sha = sha;

    const res = await fetch(`${API}/repos/${config.repo}/contents/${filePath}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Commit a binary file (image) to the repository.
 */
export async function commitBinaryFile(
  filePath: string,
  buffer: Buffer,
  message: string,
): Promise<boolean> {
  const config = getConfig();
  if (!config) return false;

  try {
    const sha = await getFileSha(filePath);
    const body: Record<string, unknown> = {
      message,
      content: buffer.toString("base64"),
    };
    if (sha) body.sha = sha;

    const res = await fetch(`${API}/repos/${config.repo}/contents/${filePath}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Delete a file from the repository.
 */
export async function deleteRepoFile(
  filePath: string,
  message: string,
): Promise<boolean> {
  const config = getConfig();
  if (!config) return false;

  try {
    const sha = await getFileSha(filePath);
    if (!sha) return false;

    const res = await fetch(`${API}/repos/${config.repo}/contents/${filePath}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${config.token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, sha }),
    });

    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Check if git deploy is configured.
 */
export function isGitDeployEnabled(): boolean {
  return getConfig() !== null;
}
