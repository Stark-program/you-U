import { describe, expect, it } from 'vitest';

import { evaluatePolicy, evaluatePolicyConfirmed } from './policyEngine.js';

describe('evaluatePolicy', () => {
  it('blocks script injection (L0)', async () => {
    const d = await evaluatePolicy([
      {
        op: 'updateModule',
        moduleId: 'm',
        path: 'body',
        value: '<script>evil()</script>',
      },
    ]);
    expect(d.allowed).toBe(false);
    expect(d.blockedOps.length).toBe(1);
  });

  it('sends bio edits to pending approval (L1)', async () => {
    const d = await evaluatePolicy([
      {
        op: 'updateModule',
        moduleId: 'm',
        path: 'data.body',
        value: 'hello',
      },
    ]);
    expect(d.pendingApprovalOps.length).toBe(1);
    expect(d.autoOps.length).toBe(0);
  });

  it('auto-applies theme token changes (L2)', async () => {
    const d = await evaluatePolicy([
      { op: 'setTheme', path: 'theme.color.brand', value: '#ffffff' },
    ]);
    expect(d.autoOps.length).toBe(1);
    expect(d.allowed).toBe(true);
  });

  it('sends data binding to pending (L3)', async () => {
    const d = await evaluatePolicy([
      {
        op: 'updateModule',
        moduleId: 'm',
        path: 'bind.followers',
        value: 'external:metrics/followers',
      },
    ]);
    expect(d.pendingApprovalOps.length).toBe(1);
  });
});

describe('evaluatePolicyConfirmed', () => {
  it('allows text edits after confirmation when moderation passes', async () => {
    const d = await evaluatePolicyConfirmed([
      {
        op: 'updateModule',
        moduleId: 'm',
        path: 'data.body',
        value: 'hello world',
      },
    ]);
    expect(d.allowed).toBe(true);
    expect(d.autoOps.length).toBe(1);
  });
});
