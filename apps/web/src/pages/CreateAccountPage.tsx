import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { LandingHero } from '../components/landing/LandingHero.js';

export function CreateAccountPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="landing">
      <LandingHero />
      <aside className="landing__aside" aria-label="Create account">
        <div className="landing__panel">
          <h2 className="landing__panelTitle">Create account</h2>
          <p className="landing__panelHint">
            Choose a username and password. Registration will connect to the server in a
            later step.
          </p>
          <form
            className="landing__form"
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);
              if (!username.trim()) {
                setError('Enter a username.');
                return;
              }
              if (password.length < 8) {
                setError('Password must be at least 8 characters.');
                return;
              }
              if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
              }
              navigate('/', { replace: true });
            }}
          >
            {error ? (
              <p className="landing__formError" role="alert">
                {error}
              </p>
            ) : null}
            <div className="landing__field">
              <label htmlFor="register-username">Username</label>
              <input
                id="register-username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
              />
            </div>
            <div className="landing__field">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="landing__field">
              <label htmlFor="register-confirm">Confirm password</label>
              <input
                id="register-confirm"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="landing__submit">
              Create account
            </button>
          </form>
          <p className="landing__footerNote">
            <Link to="/" className="landing__footerLink">
              Back to sign in
            </Link>
          </p>
        </div>
      </aside>
    </div>
  );
}
