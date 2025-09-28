import { lazy } from 'react';

export const LazyLoginView = lazy(
  () => import('@/modules/auth/view/LoginView')
);
export const LazySignupView = lazy(
  () => import('@/modules/auth/view/SignupView')
);
export const LazyStayInstructionsView = lazy(() =>
  import('@/modules/stay/view/StayInstructionsView').then((module) => ({
    default: module.StayInstructionsView,
  }))
);
export const LazyNotFoundView = lazy(() =>
  import('@/modules/error/view/NotFoundView').then((module) => ({
    default: module.NotFoundView,
  }))
);
export const LazyPropertyListView = lazy(
  () => import('@/modules/property/view/PropertyListView')
);
export const LazyPropertyDetailView = lazy(
  () => import('@/modules/property/view/PropertyDetailView')
);
export const LazyReconcileStaysView = lazy(
  () => import('@/modules/property/view/ReconcileStaysView')
);
