import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import StayAssignments from '../StayAssignments/StayAssignments';
import StayAssignment from '../StayAssignment/StayAssignment';
import NotFound from '../../Common/NotFound/NotFound';
import AuthenticatedParticipantRoute from '../../../_functional/AuthenticatedParticipantRoute';

function ParticipantLayout() {
  return (
    <Routes>
      <Route index element={<Navigate to="stayAssignments" />} />
      <Route path="stayAssignments/*">
        <Route index element={<StayAssignments />} />
        <Route path=":stayAssignmentId" element={<StayAssignment />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AuthenticatedParticipantRoute(ParticipantLayout);
