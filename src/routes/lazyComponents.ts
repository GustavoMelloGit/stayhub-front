import { lazy } from 'react';

/**
 * O layout do app entra aqui junto com as views. Ele era o único import
 * síncrono do roteador, e arrastava `Sidebar → SpecularButton → ogl` (WebGL)
 * para o chunk de entrada, que a landing pública também baixa.
 */
export const LazyAppLayout = lazy(() =>
  import('@/components/layout').then(module => ({ default: module.AppLayout }))
);

export const LazyLoginView = lazy(
  () => import('@/modules/auth/view/LoginView')
);
export const LazySignupView = lazy(
  () => import('@/modules/auth/view/SignupView')
);
export const LazyStayInstructionsView = lazy(() =>
  import('@/modules/stay/view/StayInstructionsView').then(module => ({
    default: module.StayInstructionsView,
  }))
);
export const LazyStayDetailView = lazy(() =>
  import('@/modules/stay/view/StayDetailView').then(module => ({
    default: module.StayDetailView,
  }))
);
export const LazyNotFoundView = lazy(() =>
  import('@/modules/error/view/NotFoundView').then(module => ({
    default: module.NotFoundView,
  }))
);
export const LazyDashboardView = lazy(
  () => import('@/modules/property/view/DashboardView')
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
export const LazyCreatePropertyView = lazy(
  () => import('@/modules/property/view/CreatePropertyView')
);
export const LazyConnectAuthorizeView = lazy(
  () => import('@/modules/auth/view/ConnectAuthorizeView')
);
export const LazyConnectedAppsView = lazy(
  () => import('@/modules/auth/view/ConnectedAppsView')
);
export const LazyForgotPasswordView = lazy(
  () => import('@/modules/auth/view/ForgotPasswordView')
);
export const LazyResetPasswordView = lazy(
  () => import('@/modules/auth/view/ResetPasswordView')
);
export const LazyChangePasswordView = lazy(
  () => import('@/modules/auth/view/ChangePasswordView')
);
export const LazyBillingSettingsView = lazy(
  () => import('@/modules/billing/view/BillingSettingsView')
);
export const LazyLandingView = lazy(
  () => import('@/modules/landing/view/LandingView')
);
export const LazyGuidesIndexView = lazy(
  () => import('@/modules/guides/view/GuidesIndexView')
);
export const LazyGuideView = lazy(
  () => import('@/modules/guides/view/GuideView')
);
