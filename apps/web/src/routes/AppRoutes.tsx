import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// ---- Auth (eager) -----------------------------------------
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import LandingPage from '../LandingPage';

// ---- Citizen (lazy) ----------------------------------------
const CitizenDashboard = lazy(() => import('../pages/citizen/CitizenDashboard'));
const ProblemList      = lazy(() => import('../pages/citizen/ProblemList'));
const ProblemSubmit    = lazy(() => import('../pages/citizen/ProblemSubmit'));
const ProblemDetail    = lazy(() => import('../pages/citizen/ProblemDetail'));
const FeedbackPage     = lazy(() => import('../pages/citizen/FeedbackPage'));

// ---- Admin / Government (lazy) -----------------------------
const AdminDashboard   = lazy(() => import('../pages/government/AdminDashboard'));
const ProblemReview    = lazy(() => import('../pages/government/ProblemReview'));
const MatchingPage     = lazy(() => import('../pages/government/MatchingPage'));
const ProposalReview   = lazy(() => import('../pages/government/ProposalReview'));

// ---- University (lazy) -------------------------------------
const UniversityDashboard = lazy(() => import('../pages/university/UniversityDashboard'));
const ProblemDiscovery    = lazy(() => import('../pages/university/ProblemDiscovery'));
const ProposalForm        = lazy(() => import('../pages/university/ProposalForm'));
const ProjectList         = lazy(() => import('../pages/university/ProjectList'));
const MilestoneTracker    = lazy(() => import('../pages/university/MilestoneTracker'));

// ---- Industry (lazy) ----------------------------------------
const IndustryDashboard = lazy(() => import('../pages/industry/IndustryDashboard'));
const BrowseProposals   = lazy(() => import('../pages/industry/BrowseProposals'));

// ---- Loading fallback --------------------------------------
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-surface">
    <div className="flex flex-col items-center gap-space-md">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
        <span className="material-symbols-outlined text-primary">hourglass_top</span>
      </div>
      <p className="font-label-lg text-label-lg text-on-surface-variant">Loading…</p>
    </div>
  </div>
);

// ---- Root redirect -----------------------------------------
const RootRedirect: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <LandingPage />;
  switch (role) {
    case 'GOVERNMENT':
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    case 'UNIVERSITY':
      return <Navigate to="/university" replace />;
    case 'INDUSTRY':
      return <Navigate to="/industry" replace />;
    default:
      return <Navigate to="/citizen" replace />;
  }
};

// ─── Authenticated page wrapper ─────────────────────────────
// Puts the sidebar Layout around a role-protected page.
const P = ({ roles, children }: { roles: string[]; children: React.ReactNode }) => (
  <Layout>
    <ProtectedRoute allowedRoles={roles as Parameters<typeof ProtectedRoute>[0]['allowedRoles']}>
      {children}
    </ProtectedRoute>
  </Layout>
);

// ---- App Routes --------------------------------------------
const AppRoutes: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* ── Public — no sidebar ─────────────────────────────── */}
      <Route path="/"         element={<RootRedirect />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ── Citizen ─────────────────────────────────────────── */}
      <Route path="/citizen"                     element={<P roles={['CITIZEN']}><CitizenDashboard /></P>} />
      <Route path="/citizen/problems"            element={<P roles={['CITIZEN']}><ProblemList /></P>} />
      <Route path="/citizen/problems/submit"     element={<P roles={['CITIZEN']}><ProblemSubmit /></P>} />
      <Route path="/citizen/problems/:id"        element={<P roles={['CITIZEN']}><ProblemDetail /></P>} />
      <Route path="/citizen/feedback/:problemId" element={<P roles={['CITIZEN']}><FeedbackPage /></P>} />

      {/* ── Admin / Government ──────────────────────────────── */}
      <Route path="/admin"           element={<P roles={['GOVERNMENT','ADMIN']}><AdminDashboard /></P>} />
      <Route path="/admin/problems"  element={<P roles={['GOVERNMENT','ADMIN']}><ProblemReview /></P>} />
      <Route path="/admin/matching"  element={<P roles={['GOVERNMENT','ADMIN']}><MatchingPage /></P>} />
      <Route path="/admin/proposals" element={<P roles={['GOVERNMENT','ADMIN']}><ProposalReview /></P>} />

      {/* ── University ──────────────────────────────────────── */}
      <Route path="/university"                              element={<P roles={['UNIVERSITY']}><UniversityDashboard /></P>} />
      <Route path="/university/problems"                     element={<P roles={['UNIVERSITY']}><ProblemDiscovery /></P>} />
      <Route path="/university/proposals/new/:problemId"     element={<P roles={['UNIVERSITY']}><ProposalForm /></P>} />
      <Route path="/university/projects"                     element={<P roles={['UNIVERSITY']}><ProjectList /></P>} />
      <Route path="/university/projects/:projectId/milestones" element={<P roles={['UNIVERSITY']}><MilestoneTracker /></P>} />

      {/* ── Industry ────────────────────────────────────────── */}
      <Route path="/industry"          element={<P roles={['INDUSTRY']}><IndustryDashboard /></P>} />
      <Route path="/industry/proposals" element={<P roles={['INDUSTRY']}><BrowseProposals /></P>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
