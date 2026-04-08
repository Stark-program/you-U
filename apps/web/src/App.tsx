import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { CreateAccountPage } from './pages/CreateAccountPage.js';
import { LandingPage } from './pages/LandingPage.js';
import { ProfilePage } from './pages/ProfilePage.js';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<CreateAccountPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}
