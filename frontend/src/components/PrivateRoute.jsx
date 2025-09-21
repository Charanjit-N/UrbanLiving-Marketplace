import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  // If a user is logged in, show the child component (e.g., Profile page).
  // Otherwise, redirect them to the sign-in page.
  return currentUser ? <Outlet /> : <Navigate to="/signIn" />;
}