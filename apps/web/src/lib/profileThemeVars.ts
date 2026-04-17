import type { ThemeComponentColors, ThemeTokens } from '@you-u/shared';
import type { CSSProperties } from 'react';

const FONT_STACKS: Record<string, string> = {
  system: 'ui-sans-serif, system-ui, sans-serif',
  sans: 'ui-sans-serif, system-ui, sans-serif',
  inter: '"Inter", ui-sans-serif, system-ui, sans-serif',
  serif: '"Source Serif 4", Georgia, "Times New Roman", serif',
  mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  display: '"Inter", ui-sans-serif, system-ui, sans-serif',
};

const SCALE_VARS: Record<
  ThemeTokens['typography']['scale'],
  {
    base: string;
    title: string;
    eyebrow: string;
    cardTitle: string;
    lede: string;
    statValue: string;
    statLabel: string;
    avatar: string;
  }
> = {
  compact: {
    base: '0.9375rem',
    title: 'clamp(1.35rem, 3.2vw, 1.85rem)',
    eyebrow: '0.68rem',
    cardTitle: '0.94rem',
    lede: '0.94rem',
    statValue: '1rem',
    statLabel: '0.72rem',
    avatar: 'clamp(1.45rem, 2.8vw, 1.75rem)',
  },
  default: {
    base: '1rem',
    title: 'clamp(1.6rem, 4vw, 2.2rem)',
    eyebrow: '0.72rem',
    cardTitle: '1rem',
    lede: '1rem',
    statValue: '1.1rem',
    statLabel: '0.76rem',
    avatar: 'clamp(1.6rem, 3vw, 2rem)',
  },
  expressive: {
    base: '1.0625rem',
    title: 'clamp(1.85rem, 4.5vw, 2.45rem)',
    eyebrow: '0.78rem',
    cardTitle: '1.06rem',
    lede: '1.06rem',
    statValue: '1.2rem',
    statLabel: '0.8rem',
    avatar: 'clamp(1.75rem, 3.2vw, 2.15rem)',
  },
};

const DENSITY_PAD: Record<
  ThemeTokens['spacing']['density'],
  { header: string; grid: string; footer: string }
> = {
  compact: {
    header: 'clamp(1rem, 2.5vw, 1.5rem)',
    grid: '0 clamp(1rem, 2.5vw, 1.5rem) clamp(1rem, 2.5vw, 1.5rem)',
    footer: '0.75rem clamp(1rem, 2.5vw, 1.5rem) 1.1rem',
  },
  default: {
    header: 'clamp(1.25rem, 3vw, 2rem)',
    grid: '0 clamp(1.25rem, 3vw, 2rem) clamp(1.25rem, 3vw, 2rem)',
    footer: '0.9rem clamp(1.25rem, 3vw, 2rem) 1.35rem',
  },
  airy: {
    header: 'clamp(1.5rem, 3.5vw, 2.5rem)',
    grid: '0 clamp(1.5rem, 3.5vw, 2.5rem) clamp(1.5rem, 3.5vw, 2.5rem)',
    footer: '1rem clamp(1.5rem, 3.5vw, 2.5rem) 1.5rem',
  },
};

function resolveFontStack(token: string): string {
  const t = token.trim();
  if (t.includes(',')) {
    return t;
  }
  const mapped = FONT_STACKS[t.toLowerCase()];
  return mapped ?? t;
}

function assignComponentVars(
  out: Record<string, string>,
  prefix: string,
  slice?: ThemeComponentColors,
): void {
  if (!slice) {
    return;
  }
  if (slice.bg !== undefined) {
    out[`${prefix}-bg`] = slice.bg;
  }
  if (slice.border !== undefined) {
    out[`${prefix}-border`] = slice.border;
  }
  if (slice.text !== undefined) {
    out[`${prefix}-text`] = slice.text;
  }
  if (slice.label !== undefined) {
    out[`${prefix}-label`] = slice.label;
  }
}

/** Maps saved profile theme tokens to CSS custom properties on `.profile`. */
export function profileThemeVars(theme: ThemeTokens): CSSProperties {
  const c = theme.color;
  const r = theme.spacing.cardRadius;
  const typo = theme.typography;
  const scale = SCALE_VARS[typo.scale];
  const pad = DENSITY_PAD[theme.spacing.density];

  const vars: Record<string, string> = {
    '--profile-bg-color': c.bg,
    '--profile-bg-image': 'none',
    '--profile-shell-bg': c.surface,
    '--profile-cover-bg': `linear-gradient(120deg, ${c.brand} 0%, ${c.accent} 100%)`,
    '--profile-text': c.textPrimary,
    '--profile-muted': c.textMuted,
    '--profile-card-bg': c.surface,
    '--profile-card-radius': `${r}px`,
    '--profile-font-heading': resolveFontStack(typo.headingFont),
    '--profile-font-body': resolveFontStack(typo.bodyFont),
    '--profile-font-size-base': scale.base,
    '--profile-font-size-title': scale.title,
    '--profile-font-size-eyebrow': scale.eyebrow,
    '--profile-font-size-card-title': scale.cardTitle,
    '--profile-font-size-lede': scale.lede,
    '--profile-font-size-stat-value': scale.statValue,
    '--profile-font-size-stat-label': scale.statLabel,
    '--profile-font-size-avatar': scale.avatar,
    '--profile-pad-header': pad.header,
    '--profile-pad-grid': pad.grid,
    '--profile-pad-footer': pad.footer,
    '--profile-grid-gap': `${theme.spacing.sectionGap}px`,
  };

  const comp = theme.components;
  if (comp) {
    assignComponentVars(vars, '--profile-stats', comp.stats);
    assignComponentVars(vars, '--profile-stat-posts', comp.statPosts);
    assignComponentVars(vars, '--profile-stat-followers', comp.statFollowers);
    assignComponentVars(vars, '--profile-stat-following', comp.statFollowing);
    assignComponentVars(vars, '--profile-btn-primary', comp.buttonPrimary);
    assignComponentVars(vars, '--profile-btn-ghost', comp.buttonGhost);
    assignComponentVars(vars, '--profile-card-custom', comp.card);
    assignComponentVars(vars, '--profile-title-custom', comp.title);
    assignComponentVars(vars, '--profile-handle-custom', comp.handle);
    assignComponentVars(vars, '--profile-lede-custom', comp.lede);
  }

  return vars as CSSProperties;
}
