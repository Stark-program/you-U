import type { PatchOp, PolicyDecision, ProfileConfig } from '@you-u/shared';

export const DEMO_PROFILE_ID = 'demo-profile';

const jsonHeaders = {
  'Content-Type': 'application/json',
};

export type PatchResponse = {
  summary: string;
  patchOps: PatchOp[];
  decision: PolicyDecision;
  warnings: string[];
  requiresUserApproval: boolean;
  suggestedAutoOps: PatchOp[];
  suggestedPendingOps: PatchOp[];
};

export async function postAiPatch(input: {
  profileId: string;
  prompt: string;
  mode: 'suggest' | 'autoSafe';
  baseVersion?: number;
}): Promise<PatchResponse> {
  const res = await fetch(`/api/profile/${input.profileId}/ai/patch`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      prompt: input.prompt,
      mode: input.mode,
      baseVersion: input.baseVersion,
    }),
  });
  if (!res.ok) {
    throw new Error(`AI patch failed: ${res.status}`);
  }
  return res.json() as Promise<PatchResponse>;
}

export async function postAiApply(input: {
  profileId: string;
  ops: PatchOp[];
  confirmApproval?: boolean;
}): Promise<{ config: ProfileConfig }> {
  const res = await fetch(`/api/profile/${input.profileId}/ai/apply`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({
      ops: input.ops,
      confirmApproval: input.confirmApproval ?? false,
    }),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as {
      error?: string;
      decision?: unknown;
    };
    throw new Error(
      typeof err.error === 'string'
        ? err.error
        : `Apply failed: ${res.status}`,
    );
  }
  return res.json() as Promise<{ config: ProfileConfig }>;
}

export async function postPublish(profileId: string): Promise<{
  config: ProfileConfig;
}> {
  const res = await fetch(`/api/profile/${profileId}/publish`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error(`Publish failed: ${res.status}`);
  }
  return res.json() as Promise<{ config: ProfileConfig }>;
}

export async function postRollback(
  profileId: string,
  version: number,
): Promise<{ config: ProfileConfig }> {
  const res = await fetch(
    `/api/profile/${profileId}/rollback/${version}`,
    { method: 'POST' },
  );
  if (!res.ok) {
    throw new Error(`Rollback failed: ${res.status}`);
  }
  return res.json() as Promise<{ config: ProfileConfig }>;
}

export async function getConfig(
  profileId: string,
  status: 'draft' | 'published' = 'draft',
): Promise<{ config: ProfileConfig }> {
  const res = await fetch(
    `/api/profile/${profileId}/config?status=${status}`,
  );
  if (!res.ok) {
    throw new Error(`Load config failed: ${res.status}`);
  }
  return res.json() as Promise<{ config: ProfileConfig }>;
}

export async function getChanges(profileId: string) {
  const res = await fetch(`/api/profile/${profileId}/changes`);
  if (!res.ok) {
    throw new Error(`Changes failed: ${res.status}`);
  }
  return res.json() as Promise<{
    changes: Array<{
      id: string;
      prompt: string;
      decision: unknown;
      createdAt: string;
    }>;
  }>;
}

export async function getSnapshots(profileId: string) {
  const res = await fetch(`/api/profile/${profileId}/snapshots`);
  if (!res.ok) {
    throw new Error(`Snapshots failed: ${res.status}`);
  }
  return res.json() as Promise<{
    snapshots: Array<{ id: string; version: number; createdAt: string }>;
  }>;
}
