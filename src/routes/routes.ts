export const ROUTES = {
  stayInstructions: (stay_id: string) => `/stay/${stay_id}`,
  stayDetail: (property_id: string, stay_id: string) =>
    `/property/${property_id}/stay/${stay_id}`,
  login: '/login',
  signup: '/signup',
  home: '/',
  property: (property_id: string) => `/property/${property_id}`,
  reconcileStays: '/reconcile-stays',
} as const;
