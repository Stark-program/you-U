import { APP_NAME, TAGLINE } from '@you-u/shared';

export function LandingHero() {
  return (
    <section className="landing__hero" aria-labelledby="landing-title">
      <div className="landing__heroGlow" aria-hidden />
      <p className="landing__eyebrow">Welcome</p>
      <h1 id="landing-title" className="landing__title">
        {APP_NAME}
      </h1>
      <p className="landing__tagline">{TAGLINE}</p>
      <p className="landing__lede">
        A calmer place to be yourself—share what matters, tune how it feels, grow
        with people who get you.
      </p>
    </section>
  );
}
