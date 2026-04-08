import { LandingHero } from '../components/landing/LandingHero.js';
import { LoginPanel } from '../components/landing/LoginPanel.js';

export function LandingPage() {
  return (
    <div className="landing">
      <LandingHero />
      <LoginPanel />
    </div>
  );
}
