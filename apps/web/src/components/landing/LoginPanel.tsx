import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  isDemoLoginValid,
  setDemoSession,
} from '../../auth/demoLogin.js';

export function LoginPanel() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <aside className="landing__aside" aria-label="Sign in">
      <div className="landing__panel">
        <h2 className="landing__panelTitle">Sign in</h2>
        <p className="landing__panelHint">
          Use username <strong>admin</strong> and password <strong>password</strong> to continue.
        </p>
        <form
          className="landing__form"
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            if (isDemoLoginValid(username, password)) {
              setDemoSession();
              navigate('/profile', { replace: true });
              return;
            }
            setError('Invalid username or password.');
          }}
        >
          {error ? (
            <p className="landing__formError" role="alert">
              {error}
            </p>
          ) : null}
          <div className="landing__field">
            <label htmlFor="login-username">Username</label>
            <input
              id="login-username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div className="landing__field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="landing__submit">
            Continue
          </button>
        </form>
        <p className="landing__footerNote">
          <span className="landing__linkLike">Forgot password?</span>
          <span aria-hidden> · </span>
          <Link to="/register" className="landing__footerLink">
            Create an account
          </Link>
        </p>
      </div>
    </aside>
  );
}
