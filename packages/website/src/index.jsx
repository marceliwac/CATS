import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/_layouts/Layout/Layout';
import AccountLayout from './components/_view/Account/AccountLayout/AccountLayout';
import useAuth, { AuthenticationProvider } from './hooks/useAuth';
import AdministratorLayout from './components/_view/Administrator/AdministratorLayout/AdministratorLayout';
import NotFound from './components/_view/Common/NotFound/NotFound';
import Support from './components/_view/Support/Support';
import ParticipantLayout from './components/_view/Participant/ParticipantLayout/ParticipantLayout';

function RootRedirect() {
  const auth = useAuth();
  if (auth.isAuthenticationComplete) {
    if (auth.credentials) {
      if (auth.isAdministrator) {
        return <Navigate replace to="/administrator" />;
      }
      if (auth.isParticipant) {
        return <Navigate replace to="/participant" />;
      }
    }
    return <Navigate replace to="/account/signIn" />;
  }
  return <Navigate replace to="/404" />;
}

ReactDOM.render(
  <React.StrictMode>
    <AuthenticationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/support" element={<Support />} />
          <Route
            path="/enroll"
            element={<Navigate replace to="/account/enroll" />}
          />
          <Route path="/" element={<Layout />}>
            <Route index element={<RootRedirect />} />
            <Route path="/account/*" element={<AccountLayout />} />
            <Route path="/administrator/*" element={<AdministratorLayout />} />
            <Route path="/participant/*" element={<ParticipantLayout />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthenticationProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
