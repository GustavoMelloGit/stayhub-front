export const ROUTES = {
  stayInstructions: (stay_id: string) => `/stay/${stay_id}`,
  login: '/login',
  signup: '/signup',
  properties: '/',
  property: (property_id: string) => `/property/${property_id}`,
};
