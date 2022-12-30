import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Administrators from '../Users/Administrators/Administrators';
import Participants from '../Users/Participants/Participants';
import InviteAdministrator from '../Users/Administrators/InviteAdministrator/InviteAdministrator';
import InviteParticipant from '../Users/Participants/InviteParticipant/InviteParticipant';
import NotFound from '../../Common/NotFound/NotFound';
import AuthenticatedAdminRoute from '../../../_functional/AuthenticatedAdminRoute';
import StayAssignments from '../Stays/StayAssignments/StayAssignments';
import ParticipantStayAssignments from '../Stays/ParticipantStayAssignments/ParticipantStayAssignments';
import ParticipantAssignStays from '../Stays/ParticipantAssignStays/ParticipantAssignStays';
import GroupAssignments from '../GroupAssignments/GroupAssignments/GroupAssignments';
import GroupAssignment from '../GroupAssignments/GroupAssignment/GroupAssignment';
import CreateGroupAssignment from '../GroupAssignments/CreateGroupAssignment/CreateGroupAssignment';
import UpdateGroupAssignment from '../GroupAssignments/UpdateGroupAssignment/UpdateGroupAssignment';

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
        </Route>
      </Route>
      <Route path="stayAssignments/*">
        <Route index element={<StayAssignments />} />
        <Route path=":userId">
          <Route index element={<ParticipantStayAssignments />} />
          <Route path="assign" element={<ParticipantAssignStays />} />
        </Route>
      </Route>
      <Route path="groupAssignments/*">
        <Route index element={<GroupAssignments />} />
        <Route path=":groupId/*">
          <Route index element={<GroupAssignment />} />
          <Route path="edit" element={<UpdateGroupAssignment />} />
        </Route>
        <Route path="create" element={<CreateGroupAssignment />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AuthenticatedAdminRoute(AdministratorLayout);
