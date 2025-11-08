import { createBrowserRouter, Outlet } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { PublicRoute } from '@/components/PublicRoute';
import { ROUTES } from './routes';
import { AppLayout } from '@/components/layout';
import {
  LazyLoginView,
  LazySignupView,
  LazyStayInstructionsView,
  LazyStayDetailView,
  LazyNotFoundView,
  LazyPropertyListView,
  LazyPropertyDetailView,
  LazyReconcileStaysView,
} from './lazyComponents';

export const router = createBrowserRouter([
  {
    path: ROUTES.home,
    element: (
      <ProtectedRoute>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <LazyPropertyListView />,
      },
      {
        path: ROUTES.property(':property_id'),
        element: <LazyPropertyDetailView />,
      },
      {
        path: ROUTES.reconcileStays,
        element: <LazyReconcileStaysView />,
      },
      {
        path: ROUTES.stayDetail(':stay_id'),
        element: <LazyStayDetailView />,
      },
    ],
  },
  {
    path: ROUTES.stayInstructions(':stay_id'),
    element: <LazyStayInstructionsView />,
  },
  {
    path: ROUTES.login,
    element: (
      <PublicRoute>
        <LazyLoginView />
      </PublicRoute>
    ),
  },
  {
    path: ROUTES.signup,
    element: (
      <PublicRoute>
        <LazySignupView />
      </PublicRoute>
    ),
  },
  {
    path: '*',
    element: <LazyNotFoundView />,
  },
]);
