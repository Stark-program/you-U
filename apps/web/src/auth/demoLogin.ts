/** Temporary demo gate; replace with real auth. */
export const DEMO_USERNAME = 'admin';
export const DEMO_PASSWORD = 'password';

const DEMO_SESSION_KEY = 'youu-demo-auth';

export function isDemoLoginValid(username: string, password: string): boolean {
  return username === DEMO_USERNAME && password === DEMO_PASSWORD;
}

export function setDemoSession(): void {
  sessionStorage.setItem(DEMO_SESSION_KEY, '1');
}

export function hasDemoSession(): boolean {
  return sessionStorage.getItem(DEMO_SESSION_KEY) === '1';
}

export function clearDemoSession(): void {
  sessionStorage.removeItem(DEMO_SESSION_KEY);
}
