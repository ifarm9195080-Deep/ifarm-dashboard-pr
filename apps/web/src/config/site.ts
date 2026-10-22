export const ROUTES = {
  home: '/',
  marketingHome: '/company',
  dashboard: '/dashboard',
  dashboardLogin: '/dashboard/login',
  dashboardSensors: '/dashboard/sensors',
  dashboardCameras: '/dashboard/cameras',
  dashboardReports: '/dashboard/reports',
  dashboardThermal: '/dashboard/thermal',
  dashboardSettings: '/dashboard/settings',
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

export const DASHBOARD_NAVIGATION = [
  { path: ROUTES.dashboard, label: 'dashboardOverview', icon: 'overview' },
  { path: ROUTES.dashboardSensors, label: 'dashboardSensors', icon: 'sensors' },
  { path: ROUTES.dashboardCameras, label: 'dashboardCameras', icon: 'cameras' },
  { path: ROUTES.dashboardReports, label: 'dashboardReports', icon: 'reports' },
  { path: ROUTES.dashboardThermal, label: 'dashboardThermal', icon: 'thermal' },
  { path: ROUTES.dashboardSettings, label: 'dashboardSettings', icon: 'settings' },
] as const;
