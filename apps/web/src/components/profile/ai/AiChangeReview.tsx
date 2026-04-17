import type { PatchOp, PolicyDecision } from '@you-u/shared';

import { AiDecisionBadge } from './AiDecisionBadge.js';

type Props = {
  decision: PolicyDecision | null;
  patchOps: PatchOp[];
  summary: string | null;
  warnings: string[];
};

export function AiChangeReview({
  decision,
  patchOps,
  summary,
  warnings,
}: Props) {
  if (!decision) {
    return null;
  }

  return (
    <div className="profile__aiReview">
      <div className="profile__aiReviewHeader">
        <h3 className="profile__aiReviewTitle">AI proposal</h3>
        <AiDecisionBadge level={decision.level} />
      </div>
      {summary ? <p className="profile__aiSummary">{summary}</p> : null}
      {warnings.length > 0 ? (
        <ul className="profile__aiWarnings">
          {warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : null}
      <details className="profile__aiDetails">
        <summary>View proposed operations</summary>
        <pre className="profile__aiPre">{JSON.stringify(patchOps, null, 2)}</pre>
      </details>
      <details className="profile__aiDetails">
        <summary>Policy decision</summary>
        <pre className="profile__aiPre">
          {JSON.stringify(decision, null, 2)}
        </pre>
      </details>
    </div>
  );
}
