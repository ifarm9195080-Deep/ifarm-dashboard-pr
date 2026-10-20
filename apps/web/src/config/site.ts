export const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  dashboardLogin: '/dashboard/login',
  store: '/store',
  ai: '/ai',
} as const;

export const SITE_DETAILS = {
  phone: '+20 3 2275 5233',
  phoneHref: 'tel:+203227552330',
  website: 'https://www.ifarm.com',
  instagram: 'https://www.instagram.com/ifarm_wm',
} as const;

export const SAFE_POST_LOGIN_ROUTES = [ROUTES.dashboard] as const;
