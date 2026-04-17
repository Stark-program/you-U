import { useCallback, useState } from 'react';

import type { PatchOp, PolicyDecision, ProfileConfig } from '@you-u/shared';

import {
  DEMO_PROFILE_ID,
  getConfig,
  getSnapshots,
  postAiApply,
  postAiPatch,
  postPublish,
  postRollback,
  type PatchResponse,
} from '../../../lib/profileApi.js';

import { AiChangeReview } from './AiChangeReview.js';
import { AiHistoryDrawer } from './AiHistoryDrawer.js';
import { AiPromptBar } from './AiPromptBar.js';

type Props = {
  onDraftUpdated?: (config: ProfileConfig) => void;
};

export function AiAssistPanel({ onDraftUpdated }: Props) {
  const profileId = DEMO_PROFILE_ID;
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [last, setLast] = useState<PatchResponse | null>(null);
  const [snapshots, setSnapshots] = useState<
    Array<{ id: string; version: number; createdAt: string }>
  >([]);
  const [rollbackVersion, setRollbackVersion] = useState('');

  const runPatch = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await postAiPatch({
        profileId,
        prompt,
        mode: 'autoSafe',
      });
      setLast(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setBusy(false);
    }
  }, [prompt, profileId]);

  const applySafe = useCallback(async () => {
    if (!last || last.suggestedAutoOps.length === 0) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { config } = await postAiApply({
        profileId,
        ops: last.suggestedAutoOps,
      });
      onDraftUpdated?.(config);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Apply failed');
    } finally {
      setBusy(false);
    }
  }, [last, profileId, onDraftUpdated]);

  const applyConfirmed = useCallback(async () => {
    if (!last || last.patchOps.length === 0) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { config } = await postAiApply({
        profileId,
        ops: last.patchOps,
        confirmApproval: true,
      });
      onDraftUpdated?.(config);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Apply failed');
    } finally {
      setBusy(false);
    }
  }, [last, profileId, onDraftUpdated]);

  const publish = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await postPublish(profileId);
      const snaps = await getSnapshots(profileId);
      setSnapshots(snaps.snapshots);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Publish failed');
    } finally {
      setBusy(false);
    }
  }, [profileId]);

  const rollback = useCallback(async () => {
    const v = Number(rollbackVersion);
    if (!Number.isFinite(v)) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await postRollback(profileId, v);
      const { config } = await getConfig(profileId);
      onDraftUpdated?.(config);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Rollback failed');
    } finally {
      setBusy(false);
    }
  }, [profileId, rollbackVersion, onDraftUpdated]);

  const loadSnapshots = useCallback(async () => {
    try {
      const snaps = await getSnapshots(profileId);
      setSnapshots(snaps.snapshots);
    } catch {
      /* ignore */
    }
  }, [profileId]);

  const decision: PolicyDecision | null = last?.decision ?? null;
  const patchOps: PatchOp[] = last?.patchOps ?? [];
  const warnings = last?.warnings ?? [];

  return (
    <section className="profile__ai" aria-label="AI Assist">
      <div className="profile__aiHeader">
        <h2 className="profile__aiTitle">AI Assist</h2>
        <p className="profile__aiSubtitle">
          Policy-aware suggestions (L0–L3). Safe changes can apply to your draft;
          sensitive edits require explicit confirmation.
        </p>
      </div>

      <AiPromptBar
        value={prompt}
        onChange={setPrompt}
        onSubmit={() => void runPatch()}
        disabled={busy}
      />

      {error ? (
        <p className="profile__aiError" role="alert">
          {error}
        </p>
      ) : null}

      <AiChangeReview
        decision={decision}
        patchOps={patchOps}
        summary={last?.summary ?? null}
        warnings={warnings}
      />

      <div className="profile__aiActions">
        <button
          type="button"
          className="profile__btn profile__btnPrimary"
          disabled={
            busy ||
            !last ||
            last.suggestedAutoOps.length === 0 ||
            !last.decision.allowed
          }
          onClick={() => void applySafe()}
        >
          Apply safe changes (L2)
        </button>
        <button
          type="button"
          className="profile__btn profile__btnGhost"
          disabled={
            busy || !last || last.suggestedPendingOps.length === 0
          }
          onClick={() => void applyConfirmed()}
        >
          Apply with confirmation (L1/L3)
        </button>
      </div>

      <div className="profile__aiPublish">
        <button
          type="button"
          className="profile__btn profile__btnGhost"
          disabled={busy}
          onClick={() => void publish()}
        >
          Publish draft
        </button>
        <button
          type="button"
          className="profile__btn profile__btnGhost"
          disabled={busy}
          onClick={() => void loadSnapshots()}
        >
          Load snapshots
        </button>
        <label className="profile__aiRollback">
          <span>Rollback to version</span>
          <input
            type="number"
            value={rollbackVersion}
            onChange={(e) => setRollbackVersion(e.target.value)}
            min={1}
          />
        </label>
        <button
          type="button"
          className="profile__btn profile__btnGhost"
          disabled={busy || rollbackVersion === ''}
          onClick={() => void rollback()}
        >
          Rollback
        </button>
      </div>

      {snapshots.length > 0 ? (
        <ul className="profile__aiSnapList">
          {snapshots.map((s) => (
            <li key={s.id}>
              v{s.version} — {String(s.createdAt)}
            </li>
          ))}
        </ul>
      ) : null}

      <AiHistoryDrawer profileId={profileId} />
    </section>
  );
}
