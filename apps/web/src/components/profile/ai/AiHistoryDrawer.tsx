import { useEffect, useState } from 'react';

import { getChanges } from '../../../lib/profileApi.js';

type Row = {
  id: string;
  prompt: string;
  createdAt: string;
};

type Props = {
  profileId: string;
};

export function AiHistoryDrawer({ profileId }: Props) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const data = await getChanges(profileId);
        if (!cancelled) {
          setRows(data.changes);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load history');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, profileId]);

  return (
    <div className="profile__aiHistory">
      <button
        type="button"
        className="profile__btn profile__btnGhost"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? 'Hide' : 'Show'} AI history
      </button>
      {open ? (
        <div className="profile__aiHistoryBody">
          {error ? <p className="profile__aiError">{error}</p> : null}
          <ul className="profile__aiHistoryList">
            {rows.map((r) => (
              <li key={r.id}>
                <span className="profile__aiHistoryPrompt">{r.prompt}</span>
                <span className="profile__aiHistoryMeta">{r.createdAt}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
