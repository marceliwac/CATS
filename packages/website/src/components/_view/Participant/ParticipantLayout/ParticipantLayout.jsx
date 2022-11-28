import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Stays from '../Stays/Stays';
import Stay from '../Stay/Stay';
import NotFound from '../../Common/NotFound/NotFound';
import AuthenticatedParticipantRoute from '../../../_functional/AuthenticatedParticipantRoute';

function ParticipantLayout() {
  return (
    <Routes>
      <Route index element={<Navigate to="stays" />} />
      <Route path="stays/*">
        <Route index element={<Stays />} />
        <Route path=":stayAssignmentId" element={<Stay />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AuthenticatedParticipantRoute(ParticipantLayout);
