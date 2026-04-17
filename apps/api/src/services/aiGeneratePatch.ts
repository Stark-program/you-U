import type { PatchOp } from '@you-u/shared';

/** Full theme slice for page + cover (mock AI — replace with LLM later). */
type ColorTheme = {
  bg: string;
  surface: string;
  textPrimary: string;
  textMuted: string;
  brand: string;
  accent: string;
};

const COLOR_THEMES: Record<string, ColorTheme> = {
  red: {
    bg: '#991b1b',
    surface: '#7f1d1d',
    textPrimary: '#fef2f2',
    textMuted: '#fecaca',
    brand: '#f87171',
    accent: '#fca5a5',
  },
  blue: {
    bg: '#1e3a8a',
    surface: '#1e40af',
    textPrimary: '#eff6ff',
    textMuted: '#bfdbfe',
    brand: '#3b82f6',
    accent: '#60a5fa',
  },
  navy: {
    bg: '#172554',
    surface: '#1e3a8a',
    textPrimary: '#e0e7ff',
    textMuted: '#a5b4fc',
    brand: '#6366f1',
    accent: '#818cf8',
  },
  green: {
    bg: '#14532d',
    surface: '#166534',
    textPrimary: '#f0fdf4',
    textMuted: '#bbf7d0',
    brand: '#22c55e',
    accent: '#4ade80',
  },
  lime: {
    bg: '#365314',
    surface: '#3f6212',
    textPrimary: '#f7fee7',
    textMuted: '#d9f99d',
    brand: '#84cc16',
    accent: '#a3e635',
  },
  teal: {
    bg: '#134e4a',
    surface: '#115e59',
    textPrimary: '#f0fdfa',
    textMuted: '#99f6e4',
    brand: '#14b8a6',
    accent: '#2dd4bf',
  },
  cyan: {
    bg: '#164e63',
    surface: '#155e75',
    textPrimary: '#ecfeff',
    textMuted: '#a5f3fc',
    brand: '#06b6d4',
    accent: '#22d3ee',
  },
  purple: {
    bg: '#4c1d95',
    surface: '#5b21b6',
    textPrimary: '#faf5ff',
    textMuted: '#e9d5ff',
    brand: '#a855f7',
    accent: '#c084fc',
  },
  violet: {
    bg: '#4c1d95',
    surface: '#6d28d9',
    textPrimary: '#f5f3ff',
    textMuted: '#ddd6fe',
    brand: '#8b5cf6',
    accent: '#a78bfa',
  },
  pink: {
    bg: '#831843',
    surface: '#9d174d',
    textPrimary: '#fdf2f8',
    textMuted: '#fbcfe8',
    brand: '#ec4899',
    accent: '#f472b6',
  },
  orange: {
    bg: '#9a3412',
    surface: '#c2410c',
    textPrimary: '#fff7ed',
    textMuted: '#fed7aa',
    brand: '#f97316',
    accent: '#fb923c',
  },
  yellow: {
    bg: '#713f12',
    surface: '#854d0e',
    textPrimary: '#fefce8',
    textMuted: '#fef08a',
    brand: '#eab308',
    accent: '#facc15',
  },
  brown: {
    bg: '#431407',
    surface: '#7c2d12',
    textPrimary: '#fff7ed',
    textMuted: '#fdba74',
    brand: '#d97706',
    accent: '#ea580c',
  },
  gray: {
    bg: '#1f2937',
    surface: '#374151',
    textPrimary: '#f9fafb',
    textMuted: '#9ca3af',
    brand: '#6b7280',
    accent: '#9ca3af',
  },
  grey: {
    bg: '#1f2937',
    surface: '#374151',
    textPrimary: '#f9fafb',
    textMuted: '#9ca3af',
    brand: '#6b7280',
    accent: '#9ca3af',
  },
  black: {
    bg: '#030712',
    surface: '#111827',
    textPrimary: '#f9fafb',
    textMuted: '#9ca3af',
    brand: '#4b5563',
    accent: '#6b7280',
  },
  white: {
    bg: '#e5e7eb',
    surface: '#f3f4f6',
    textPrimary: '#111827',
    textMuted: '#4b5563',
    brand: '#6366f1',
    accent: '#8b5cf6',
  },
  magenta: {
    bg: '#701a75',
    surface: '#86198f',
    textPrimary: '#fdf4ff',
    textMuted: '#f0abfc',
    brand: '#d946ef',
    accent: '#e879f9',
  },
  indigo: {
    bg: '#312e81',
    surface: '#3730a3',
    textPrimary: '#eef2ff',
    textMuted: '#c7d2fe',
    brand: '#6366f1',
    accent: '#818cf8',
  },
  olive: {
    bg: '#3f3f1e',
    surface: '#4d4d1f',
    textPrimary: '#f7fee7',
    textMuted: '#d9f99d',
    brand: '#84cc16',
    accent: '#a3e635',
  },
  coral: {
    bg: '#7f1d1d',
    surface: '#9a3412',
    textPrimary: '#fff1f2',
    textMuted: '#fecdd3',
    brand: '#fb7185',
    accent: '#fda4af',
  },
  gold: {
    bg: '#713f12',
    surface: '#854d0e',
    textPrimary: '#fefce8',
    textMuted: '#fde047',
    brand: '#eab308',
    accent: '#facc15',
  },
};

const CYBER_THEME: ColorTheme = {
  bg: '#0f172a',
  surface: '#1e1b4b',
  textPrimary: '#e0e7ff',
  textMuted: '#a5b4fc',
  brand: '#c084fc',
  accent: '#22d3ee',
};

type ComponentTarget =
  | 'stats'
  | 'statPosts'
  | 'statFollowers'
  | 'statFollowing'
  | 'buttonPrimary'
  | 'buttonGhost'
  | 'card'
  | 'title'
  | 'handle'
  | 'lede';

function findLastColorKeyword(prompt: string): string | null {
  const p = prompt.toLowerCase();
  let bestEnd = -1;
  let bestWord: string | null = null;

  for (const word of Object.keys(COLOR_THEMES)) {
    const re = new RegExp(`\\b${word}\\b`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(p)) !== null) {
      const end = m.index + m[0].length;
      if (end > bestEnd) {
        bestEnd = end;
        bestWord = word;
      }
    }
  }

  return bestWord;
}

/** UI pieces the user can name in natural language (mock routing). */
function detectComponentTargets(p: string): Set<ComponentTarget> {
  const s = new Set<ComponentTarget>();

  if (/\bstats\b/.test(p)) {
    s.add('stats');
  }
  if (/\bposts?\b/.test(p)) {
    s.add('statPosts');
  }
  if (/\bfollowers?\b/.test(p)) {
    s.add('statFollowers');
  }
  if (/\bfollowing\b/.test(p)) {
    s.add('statFollowing');
  }

  const ghost =
    /\bghost\b/.test(p) ||
    /\bshare profile\b/.test(p) ||
    /\bsecondary\s+button\b/.test(p);
  const primary =
    /\bedit profile\b/.test(p) ||
    /\bprimary\s+button\b/.test(p) ||
    (/\bprimary\b/.test(p) && /\bbutton/.test(p));

  if (ghost) {
    s.add('buttonGhost');
  }
  if (primary) {
    s.add('buttonPrimary');
  }
  if (/\bbuttons?\b/.test(p) && !ghost && !primary) {
    s.add('buttonPrimary');
    s.add('buttonGhost');
  }

  if (/\b(cards?|about\s+card|profile\s+cards?|highlights)\b/.test(p)) {
    s.add('card');
  }
  if (/\b(title|heading|headline)\b/.test(p)) {
    s.add('title');
  }
  if (/\b(handle|username)\b/.test(p)) {
    s.add('handle');
  }
  if (/\b(lede|tagline|subtitle)\b/.test(p)) {
    s.add('lede');
  }

  return s;
}

/** User also wants the full page / shell background updated. */
function wantsGlobalThemeAlso(p: string): boolean {
  return /\b(page|background|backdrop|whole\s+profile|entire\s+profile|main\s+bg|profile\s+bg)\b/.test(
    p,
  );
}

function pushThemeOps(ops: PatchOp[], t: ColorTheme): void {
  ops.push({ op: 'setTheme', path: 'theme.color.bg', value: t.bg });
  ops.push({ op: 'setTheme', path: 'theme.color.surface', value: t.surface });
  ops.push({
    op: 'setTheme',
    path: 'theme.color.textPrimary',
    value: t.textPrimary,
  });
  ops.push({ op: 'setTheme', path: 'theme.color.textMuted', value: t.textMuted });
  ops.push({ op: 'setTheme', path: 'theme.color.brand', value: t.brand });
  ops.push({ op: 'setTheme', path: 'theme.color.accent', value: t.accent });
}

function pushComponentSliceOps(
  ops: PatchOp[],
  basePath: string,
  t: ColorTheme,
): void {
  ops.push({
    op: 'setTheme',
    path: `${basePath}.bg`,
    value: `color-mix(in srgb, ${t.surface} 72%, transparent)`,
  });
  ops.push({
    op: 'setTheme',
    path: `${basePath}.border`,
    value: `1px solid color-mix(in srgb, ${t.brand} 42%, transparent)`,
  });
  ops.push({ op: 'setTheme', path: `${basePath}.text`, value: t.textPrimary });
  ops.push({ op: 'setTheme', path: `${basePath}.label`, value: t.textMuted });
}

function pushComponentTargetOps(
  ops: PatchOp[],
  target: ComponentTarget,
  t: ColorTheme,
): void {
  switch (target) {
    case 'stats':
      pushComponentSliceOps(ops, 'theme.components.stats', t);
      break;
    case 'statPosts':
      pushComponentSliceOps(ops, 'theme.components.statPosts', t);
      break;
    case 'statFollowers':
      pushComponentSliceOps(ops, 'theme.components.statFollowers', t);
      break;
    case 'statFollowing':
      pushComponentSliceOps(ops, 'theme.components.statFollowing', t);
      break;
    case 'buttonPrimary':
      ops.push({
        op: 'setTheme',
        path: 'theme.components.buttonPrimary.bg',
        value: `linear-gradient(135deg, ${t.brand} 0%, ${t.accent} 100%)`,
      });
      ops.push({
        op: 'setTheme',
        path: 'theme.components.buttonPrimary.text',
        value: '#111827',
      });
      break;
    case 'buttonGhost':
      ops.push({
        op: 'setTheme',
        path: 'theme.components.buttonGhost.bg',
        value: `color-mix(in srgb, ${t.surface} 75%, transparent)`,
      });
      ops.push({
        op: 'setTheme',
        path: 'theme.components.buttonGhost.border',
        value: `1px solid color-mix(in srgb, ${t.textMuted} 45%, transparent)`,
      });
      ops.push({
        op: 'setTheme',
        path: 'theme.components.buttonGhost.text',
        value: t.textPrimary,
      });
      break;
    case 'card':
      ops.push({
        op: 'setTheme',
        path: 'theme.components.card.bg',
        value: t.surface,
      });
      ops.push({
        op: 'setTheme',
        path: 'theme.components.card.border',
        value: `1px solid color-mix(in srgb, ${t.brand} 38%, transparent)`,
      });
      ops.push({
        op: 'setTheme',
        path: 'theme.components.card.text',
        value: t.textPrimary,
      });
      ops.push({
        op: 'setTheme',
        path: 'theme.components.card.label',
        value: t.textMuted,
      });
      break;
    case 'title':
      ops.push({
        op: 'setTheme',
        path: 'theme.components.title.text',
        value: t.textPrimary,
      });
      break;
    case 'handle':
      ops.push({
        op: 'setTheme',
        path: 'theme.components.handle.text',
        value: t.textMuted,
      });
      break;
    case 'lede':
      ops.push({
        op: 'setTheme',
        path: 'theme.components.lede.text',
        value: `color-mix(in srgb, ${t.textPrimary} 88%, transparent)`,
      });
      break;
    default:
      break;
  }
}

function resolveTheme(p: string, colorWord: string | null): ColorTheme | null {
  if (/\bcyber\b/.test(p)) {
    return CYBER_THEME;
  }
  if (colorWord !== null) {
    return COLOR_THEMES[colorWord];
  }
  return null;
}

function pushTypographyOps(p: string, ops: PatchOp[]): void {
  if (/\binter\b/.test(p)) {
    ops.push({ op: 'setTheme', path: 'theme.typography.headingFont', value: 'Inter' });
    ops.push({ op: 'setTheme', path: 'theme.typography.bodyFont', value: 'Inter' });
  } else if (/\bsans[\s-]?serif\b/.test(p)) {
    ops.push({ op: 'setTheme', path: 'theme.typography.headingFont', value: 'System' });
    ops.push({ op: 'setTheme', path: 'theme.typography.bodyFont', value: 'System' });
  } else if (/\bserif\b/.test(p)) {
    ops.push({ op: 'setTheme', path: 'theme.typography.headingFont', value: 'Serif' });
    ops.push({ op: 'setTheme', path: 'theme.typography.bodyFont', value: 'Serif' });
  } else if (/\b(?:ui\s+)?sans\b/.test(p) && !/\bmono/.test(p)) {
    ops.push({ op: 'setTheme', path: 'theme.typography.headingFont', value: 'System' });
    ops.push({ op: 'setTheme', path: 'theme.typography.bodyFont', value: 'System' });
  }

  if (/\bmono(space)?\b|\bmonospace\b/.test(p)) {
    ops.push({ op: 'setTheme', path: 'theme.typography.bodyFont', value: 'Mono' });
  }

  if (/\b(larger|bigger|large)\s+(text|font|type)\b|\b(?:up|increase)\s+font\b/.test(p)) {
    ops.push({ op: 'setTheme', path: 'theme.typography.scale', value: 'expressive' });
  }
  if (/\b(smaller|compact|tiny)\s+(text|font|type)\b|\b(?:down|decrease)\s+font\b/.test(p)) {
    ops.push({ op: 'setTheme', path: 'theme.typography.scale', value: 'compact' });
  }
  if (/\bnormal\s+(text|size|scale)\b|\bdefault\s+(text|size|scale)\b/.test(p)) {
    ops.push({ op: 'setTheme', path: 'theme.typography.scale', value: 'default' });
  }

  if (/\b(airy|spacious)\b/.test(p) && /\b(spacing|padding|layout|gap)\b/.test(p)) {
    ops.push({ op: 'setTheme', path: 'theme.spacing.density', value: 'airy' });
  }
  if (/\b(tight|dense)\b/.test(p) && /\b(spacing|padding|layout|gap)\b/.test(p)) {
    ops.push({ op: 'setTheme', path: 'theme.spacing.density', value: 'compact' });
  }

  const gapMatch = p.match(/\b(?:gap|section\s+spacing)\s*(\d{1,3})\b/);
  if (gapMatch) {
    const n = Number(gapMatch[1]);
    if (n >= 8 && n <= 80) {
      ops.push({ op: 'setTheme', path: 'theme.spacing.sectionGap', value: n });
    }
  }
}

function trimCopyValue(s: string): string {
  return s.trim().replace(/[.!?]+$/u, '').trim();
}

/**
 * Extract copy from the **original** prompt (never lowercased), so names and
 * taglines keep their casing. Matching is case-insensitive via /i.
 */
function pushCopyFromPrompt(raw: string, ops: PatchOp[]): void {
  const displayNamePatterns: RegExp[] = [
    /\b(?:display\s*name|display\s*title)\s+(?:is|=|:)\s+([^\n]+)/i,
    /\b(?:username|user\s*name)\s+(?:is|=|:)\s+([^\n]+)/i,
    /\b(?:change|set|update)\s+(?:my\s+)?(?:display\s*name|username|user\s*name)\s+to\s+([^\n]+)/i,
    /\b(?:change|set|update)\s+name\s+to\s+([^\n]+)/i,
    /\b(?:username|display\s*name)\s+from\s+[^\n]+?\s+to\s+([^\n]+)/i,
    /\bmy\s+name\s+is\s+([^\n]+)/i,
  ];

  let displayName: string | undefined;
  for (const re of displayNamePatterns) {
    const m = raw.match(re);
    const v = m?.[1] !== undefined ? trimCopyValue(m[1]) : '';
    if (v) {
      displayName = v;
      break;
    }
  }

  if (displayName) {
    ops.push({
      op: 'updateModule',
      moduleId: 'mod-hero',
      path: 'displayName',
      value: displayName,
    });
  }

  const handleMatch = raw.match(/\bhandle\s+(?:is\s+)?(@?[\w.-]+)/i);
  if (handleMatch) {
    const hRaw = handleMatch[1];
    const h = hRaw.startsWith('@') ? hRaw : `@${hRaw}`;
    ops.push({
      op: 'updateModule',
      moduleId: 'mod-hero',
      path: 'handle',
      value: h,
    });
  }

  const taglinePatterns: RegExp[] = [
    /\b(?:tagline|lede|subtitle)\s+(?:is|=|:)\s+([^\n]+)/i,
    /\b(?:change|set|update)\s+(?:my\s+)?(?:tagline|subtitle|lede)\s+to\s+([^\n]+)/i,
    /\b(?:tagline|subtitle|lede)\s+from\s+[^\n]+?\s+to\s+([^\n]+)/i,
  ];

  let lede: string | undefined;
  for (const re of taglinePatterns) {
    const m = raw.match(re);
    const v = m?.[1] !== undefined ? trimCopyValue(m[1]) : '';
    if (v) {
      lede = v;
      break;
    }
  }

  if (lede) {
    ops.push({
      op: 'updateModule',
      moduleId: 'mod-hero',
      path: 'lede',
      value: lede,
    });
  }

  const aboutMatch = raw.match(
    /\babout\s+(?:section\s+)?(?:text|body)\s+(?:is|=|:)\s+(.+?)(?:\.|$)/is,
  );
  if (aboutMatch?.[1]) {
    ops.push({
      op: 'updateModule',
      moduleId: 'mod-about',
      path: 'content',
      value: aboutMatch[1].trim(),
    });
  }

  const highlightsMatch = raw.match(
    /\bhighlights?\s+(?:title|heading)\s+(?:is|=|:)\s+(.+?)(?:\.|$)/is,
  );
  if (highlightsMatch?.[1]) {
    ops.push({
      op: 'updateModule',
      moduleId: 'mod-highlights',
      path: 'title',
      value: highlightsMatch[1].trim(),
    });
  }

  const activityMatch = raw.match(
    /\bactivity\s+(?:section\s+)?(?:title|heading)\s+(?:is|=|:)\s+(.+?)(?:\.|$)/is,
  );
  if (activityMatch?.[1]) {
    ops.push({
      op: 'updateModule',
      moduleId: 'mod-activity',
      path: 'title',
      value: activityMatch[1].trim(),
    });
  }

  const primaryBtn = raw.match(
    /\b(?:primary|edit profile)\s+(?:button\s+)?(?:says|is|reads)\s+["']?([^"'\n]+)/i,
  );
  if (primaryBtn?.[1]) {
    ops.push({
      op: 'updateModule',
      moduleId: 'mod-hero',
      path: 'primaryCta',
      value: primaryBtn[1].trim(),
    });
  }

  const ghostBtn = raw.match(
    /\b(?:ghost|share profile)\s+(?:button\s+)?(?:says|is|reads)\s+["']?([^"'\n]+)/i,
  );
  if (ghostBtn?.[1]) {
    ops.push({
      op: 'updateModule',
      moduleId: 'mod-hero',
      path: 'secondaryCta',
      value: ghostBtn[1].trim(),
    });
  }
}

/**
 * Mock AI: returns structured patch ops from a prompt.
 * Replace with LLM + JSON schema enforcement later.
 */
export function mockGeneratePatch(prompt: string): PatchOp[] {
  const p = prompt.toLowerCase();
  const ops: PatchOp[] = [];

  const targets = detectComponentTargets(p);
  const colorWord = findLastColorKeyword(p);
  const theme = resolveTheme(p, colorWord);

  if (theme !== null) {
    if (targets.size === 0) {
      pushThemeOps(ops, theme);
    } else {
      for (const target of targets) {
        pushComponentTargetOps(ops, target, theme);
      }
      if (wantsGlobalThemeAlso(p)) {
        pushThemeOps(ops, theme);
      }
    }
  }

  pushTypographyOps(p, ops);
  pushCopyFromPrompt(prompt, ops);

  if (/\brewrite\b/.test(p) || /\brefine\b.*\bbio\b/.test(p)) {
    ops.push({
      op: 'updateModule',
      moduleId: 'mod-about',
      path: 'body',
      value: 'Refined bio text suggested by AI (requires approval).',
    });
  }

  if (p.includes('bind') || p.includes('metric')) {
    ops.push({
      op: 'updateModule',
      moduleId: 'mod-stats',
      path: 'bind.followers',
      value: 'external:metrics/followers',
    });
  }

  if (p.includes('unsafe') || (p.includes('script') && p.includes('inject'))) {
    ops.push({
      op: 'updateModule',
      moduleId: 'mod-about',
      path: 'body',
      value: '<script>alert(1)</script>',
    });
  }

  if (ops.length === 0) {
    ops.push({ op: 'setTheme', path: 'theme.spacing.sectionGap', value: 28 });
  }

  return ops;
}
