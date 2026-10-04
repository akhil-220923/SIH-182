import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../layouts/DashboardLayout';

import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Cases } from '../pages/Cases';
import { CaseDetail } from '../pages/CaseDetail';
import { Investigation } from '../pages/Investigation';
import { TransactionGraph } from '../pages/TransactionGraph';
import { Attribution } from '../pages/Attribution';
import { RiskAnalysis } from '../pages/RiskAnalysis';
import { Reports } from '../pages/Reports';
import { VASPRegistry } from '../pages/VASPRegistry';
import { Evidence } from '../pages/Evidence';
import { SAHYOG } from '../pages/SAHYOG';
import { AuditLogs } from '../pages/AuditLogs';
import { Settings } from '../pages/Settings';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('tracevasp_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'cases',
        element: <Cases />,
      },
      {
        path: 'cases/:id',
        element: <CaseDetail />,
      },
      {
        path: 'investigate',
        element: <Investigation />,
      },
      {
        path: 'investigate/:address',
        element: <Investigation />,
      },
      {
        path: 'graph/:address',
        element: <TransactionGraph />,
      },
      {
        path: 'attribution/:address',
        element: <Attribution />,
      },
      {
        path: 'risk/:address',
        element: <RiskAnalysis />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'vasp-registry',
        element: <VASPRegistry />,
      },
      {
        path: 'evidence',
        element: <Evidence />,
      },
      {
        path: 'sahyog',
        element: <SAHYOG />,
      },
      {
        path: 'audit-logs',
        element: <AuditLogs />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
