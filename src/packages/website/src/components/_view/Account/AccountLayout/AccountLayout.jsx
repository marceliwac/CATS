import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import SignIn from '../SignIn/SignIn';
import CompleteSignUp from '../CompleteSignUp/CompleteSignUp';
import RequestPasswordReset from '../RequestPasswordReset/RequestPasswordReset';
import ResetPassword from '../ResetPassword/ResetPassword';
import SignOut from '../SignOut/SignOut';
import NotFound from '../../Common/NotFound/NotFound';
import SignUp from '../SignUp/SignUp';
import Enroll from '../Enroll/Enroll';
import CompleteManualSignUp from '../CompleteManualSignUp/CompleteManualSignUp';

export default function AccountLayout() {
  return (
    <Routes>
      <Route index element={<Navigate to="signIn" replace />} />
      <Route path="enroll" element={<Enroll />} />
      <Route path="signUp" element={<SignUp />} />
      <Route path="signIn" element={<SignIn />} />
      <Route path="signOut" element={<SignOut />} />
      <Route path="completeSignup" element={<CompleteSignUp />} />
      <Route path="completeManualSignup" element={<CompleteManualSignUp />} />
      <Route path="requestPasswordReset" element={<RequestPasswordReset />} />
      <Route path="resetPassword" element={<ResetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
