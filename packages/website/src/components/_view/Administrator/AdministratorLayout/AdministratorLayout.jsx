import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Administrators from '../Users/Administrators/Administrators';
import Participants from '../Users/Participants/Participants';
import Participant from '../Users/Participant/Participant';
import InviteAdministrator from '../Users/Administrators/InviteAdministrator/InviteAdministrator';
import InviteParticipant from '../Users/Participants/InviteParticipant/InviteParticipant';
import NotFound from '../../Common/NotFound/NotFound';
import AuthenticatedAdminRoute from '../../../_functional/AuthenticatedAdminRoute';

function AdministratorLayout() {
  return (
    <Routes>
      <Route index element={<Navigate to="users" />} />
      <Route path="users/*">
        <Route index element={<Navigate to="participants" />} />
        <Route path="administrators/*">
          <Route index element={<Administrators />} />
          <Route path="invite" element={<InviteAdministrator />} />
        </Route>
        <Route path="participants/*">
          <Route index element={<Participants />} />
          <Route path="invite" element={<InviteParticipant />} />
          <Route path=":userId" element={<Participant />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AuthenticatedAdminRoute(AdministratorLayout);
