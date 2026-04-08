import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { APP_NAME } from '@you-u/shared';

import {
  clearDemoSession,
  hasDemoSession,
} from '../auth/demoLogin.js';

export function ProfilePage() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (!hasDemoSession()) {
      navigate('/', { replace: true });
      return;
    }
    setAllowed(true);
  }, [navigate]);

  if (!allowed) {
    return null;
  }

  return (
    <main className="profile">
      <header className="profile__header">
        <p className="profile__eyebrow">{APP_NAME}</p>
        <h1 className="profile__title">Profile</h1>
        <p className="profile__lede">
          You’re signed in as <strong>admin</strong>.
        </p>
        <p className="profile__actions">
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
        </p>
      </header>
    </main>
  );
}
