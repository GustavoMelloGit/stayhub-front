export const ROUTES = {
  stayInstructions: (stay_id: string) => `/stay/${stay_id}`,
  stayDetail: (stay_id: string) => `/stay-detail/${stay_id}`,
  login: '/login',
  signup: '/signup',
  home: '/',
  property: (property_id: string) => `/property/${property_id}`,
  reconcileStays: '/reconcile-stays',
} as const;
