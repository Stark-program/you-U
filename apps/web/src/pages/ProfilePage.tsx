import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import type { ProfileConfig } from '@you-u/shared';

import { AiAssistPanel } from '../components/profile/ai/AiAssistPanel.js';
import {
  clearDemoSession,
  hasDemoSession,
} from '../auth/demoLogin.js';
import { DEMO_PROFILE_ID, getConfig } from '../lib/profileApi.js';
import {
  getAboutData,
  getActivityData,
  getHeroData,
  getHighlightsData,
  getStatsData,
  STAT_KEYS,
} from '../lib/profileModules.js';
import { profileThemeVars } from '../lib/profileThemeVars.js';

export function ProfilePage() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);
  const [profileConfig, setProfileConfig] = useState<ProfileConfig | null>(
    null,
  );

  useEffect(() => {
    if (!hasDemoSession()) {
      navigate('/', { replace: true });
      return;
    }
    setAllowed(true);
  }, [navigate]);

  useEffect(() => {
    if (!allowed) {
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const { config } = await getConfig(DEMO_PROFILE_ID);
        if (!cancelled) {
          setProfileConfig(config);
        }
      } catch {
        if (!cancelled) {
          setProfileConfig(null);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [allowed]);

  if (!allowed) {
    return null;
  }

  const hero = getHeroData(profileConfig);
  const about = getAboutData(profileConfig);
  const stats = getStatsData(profileConfig);
  const highlights = getHighlightsData(profileConfig);
  const activity = getActivityData(profileConfig);

  const themeStyle =
    profileConfig !== null ? profileThemeVars(profileConfig.theme) : undefined;

  return (
    <main className="profile" style={themeStyle}>
      <section className="profile__shell" aria-label="User profile">
        <div className="profile__cover" aria-hidden />
        <header className="profile__header">
          <div className="profile__identity">
            <div className="profile__avatar" aria-hidden>
              {hero.avatarInitial.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="profile__eyebrow">{hero.eyebrow}</p>
              <h1 className="profile__title">{hero.displayName}</h1>
              <p className="profile__handle">{hero.handle}</p>
            </div>
          </div>
          <p className="profile__lede">{hero.lede}</p>
          <ul className="profile__stats" aria-label="Profile stats">
            {stats.items.map((row, i) => (
              <li
                key={`${row.label}-${i}`}
                data-stat={STAT_KEYS[i] ?? `stat-${i}`}
              >
                <strong>{row.value}</strong>
                <span>{row.label}</span>
              </li>
            ))}
          </ul>
          <div className="profile__actions">
            <button type="button" className="profile__btn profile__btnPrimary">
              {hero.primaryCta}
            </button>
            <button type="button" className="profile__btn profile__btnGhost">
              {hero.secondaryCta}
            </button>
          </div>
        </header>

        <AiAssistPanel onDraftUpdated={setProfileConfig} />

        <section className="profile__grid" aria-label="Profile details and activity">
          <article className="profile__card">
            <h2 className="profile__cardTitle">{about.title}</h2>
            <p className="profile__cardText">{about.content}</p>
          </article>
          <article className="profile__card">
            <h2 className="profile__cardTitle">{highlights.title}</h2>
            <ul className="profile__list">
              {highlights.items.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </article>
          <article className="profile__card profile__cardWide">
            <h2 className="profile__cardTitle">{activity.title}</h2>
            <ul className="profile__activity">
              {activity.items.map((row, i) => (
                <li key={`${row.label}-${row.time}-${i}`}>
                  <span className="profile__activityLabel">{row.label}</span>
                  <span>{row.text}</span>
                  <time>{row.time}</time>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <footer className="profile__footerActions">
          <Link to="/" className="profile__link">
            Back to home
          </Link>
          <span aria-hidden className="profile__actionsSep">
            ·
          </span>
          <button
            type="button"
            className="profile__signOut"
            onClick={() => {
              clearDemoSession();
              navigate('/', { replace: true });
            }}
          >
            Sign out
          </button>
        </footer>
      </section>
    </main>
  );
}
