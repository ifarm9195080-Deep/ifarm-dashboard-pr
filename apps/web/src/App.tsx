import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type FormEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import SectionLabel from './components/SectionLabel';

type Locale = 'en' | 'ar';
type CopyKey = keyof typeof copy.en;
type NavItem = {
  id: 'home' | 'dashboard' | 'store' | 'ai';
  href: string;
  label: CopyKey;
  soon?: boolean;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function decodeHash(hash: string) {
  try {
    return decodeURIComponent(hash);
  } catch {
    return '';
  }
}

function readSavedLocale(): Locale {
  try {
    return window.localStorage.getItem('ifarm-locale') === 'ar' ? 'ar' : 'en';
  } catch {
    return 'en';
  }
}

function saveLocale(locale: Locale) {
  try {
    window.localStorage.setItem('ifarm-locale', locale);
  } catch {
    // Language selection still works for the current page when storage is unavailable.
  }
}

const copy = {
  en: {
    home: 'Home',
    dashboard: 'Dashboard',
    store: 'Store',
    ai: 'AI',
    soon: 'Soon',
    comingSoonTitle: 'Coming soon',
    comingSoonText: 'We are preparing this iFarm experience. Check back soon for updates.',
    backHome: 'Back to Home',
    contactUs: 'Contact Us',
    toggleLanguage: 'العربية',
    mainNav: 'Main navigation',
    toggleNav: 'Toggle navigation',
    footerNav: 'Footer navigation',
    languageLabel: 'Language',
    backToIFarm: 'Back to iFarm',
    heroLabel: 'iFarm Agricultural Development',
    heroLine1: 'We plan your land,',
    heroLine2: 'and grow its future.',
    heroText:
      'From land assessment to harvest marketing, we guide you with integrated agricultural solutions combining field expertise and smart technology.',
    freeConsultation: 'Start with a Free Consultation',
    exploreServices: 'Explore Our Services',
    rooted: 'Rooted in knowledge',
    commitment1: 'Better decisions. Smarter farming.',
    commitment2: 'From field to market',
    commitment3: 'Technology for farmers',
    commitment4: 'Knowledge-driven planning',
    whoWeAre: 'Who We Are',
    aboutTitle: 'Practical insight for better farm decisions.',
    aboutText:
      'iFarm works alongside landowners and farmers to understand local conditions, clarify priorities, and support informed decisions throughout each project.',
    aboutAssessment: 'Land assessment',
    aboutAssessmentText: 'Understand soil, water, and your land’s potential.',
    aboutPlanning: 'Crop and project planning',
    aboutPlanningText: 'Choose suitable crops and plan a clear development path.',
    aboutGuidance: 'Ongoing agricultural guidance',
    aboutGuidanceText: 'Get practical support as your project grows.',
    services: 'Our services',
    servicesTitle: 'Integrated solutions, from field to market.',
    servicesIntro:
      'Choose the right starting point for your project, and we’ll help you identify the next step.',
    service1: 'Feasibility Studies & Planning',
    service1Text: 'Project study, farm design, and a step-by-step implementation plan.',
    service1Note: 'Turn ideas into action',
    service2: 'Crops & Seeds',
    service2Text: "Selecting suitable crops, varieties, and seeds for your land's conditions.",
    service2Note: 'A selection that fits your land',
    service3: 'Land Assessment',
    service3Text:
      'Understanding soil, water, and land suitability before making an investment decision.',
    service3Note: 'Start from a solid foundation',
    service4: 'Marketing & Export',
    service4Text:
      'Planning harvest marketing and preparing it for commercial and export opportunities.',
    service4Note: 'Connect your harvest to the market',
    service5: 'Farm Management',
    service5Text:
      'Organizing agricultural operations and monitoring production with data-driven decisions.',
    service5Note: 'From planning to operations',
    service6: 'Smart Irrigation',
    service6Text: 'Planning irrigation networks and employing technologies to monitor farm needs.',
    service6Note: 'Resources managed with awareness',
    consultationEyebrow: 'Integrated agricultural consultation',
    consultationTitle: 'Better farming starts with understanding your land.',
    consultationText:
      'Tell us about your land and monitoring needs. The iFarm team can help you explore the right starting point.',
    benefit1: 'Land and soil assessment',
    benefit2: 'Crop and project planning',
    benefit3: 'Ongoing agricultural guidance',
    advisor: 'Talk to an agricultural advisor',
    smartSystem: 'iFarm Smart System',
    smartTitle: 'Your farm, closer than ever. With the iFarm Smart System.',
    smartText:
      'Stay connected to your farm with a clear view of changing conditions and the information that supports everyday decisions.',
    smartBenefit1: 'Clearer visibility into farm data',
    smartBenefit2: 'Planning and monitoring in one place',
    smartBenefit3: 'Smart tools to support agricultural decisions',
    discoverSystem: 'Discover the New System',
    howStart: 'How do we start',
    stepsTitle: "Your first step doesn't need to be complicated.",
    step1: 'Tell us about your land',
    step1Text: "Share your land's location, project stage, and what you need.",
    step2: 'We understand your needs together',
    step2Text: 'We discuss your goals and identify the information needed to evaluate the project.',
    step3: 'We map the next step',
    step3Text: 'We propose the right service path and a plan for starting your project.',
    getInTouch: 'Contact Us',
    contactTitle: "Your land has potential. Let's discover it together.",
    contactText:
      'Do you have land or an agricultural project idea? Get in touch and let us help you choose the right starting point.',
    phone: '+20 3 2275 5233',
    instagram: '@ifarm_wm',
    website: 'www.ifarm.com',
    contactTeam: 'Contact the iFarm team',
    socialFollow: 'Follow iFarm',
    footerTagline: 'Your agricultural development partner',
    footerServices: 'Services',
    footerContact: 'Contact',
    companyName: 'iFarm Agricultural Development',
    copyright: '© 2026 iFarm. All rights reserved.',
    firstName: 'First Name',
    firstNamePlaceholder: 'Your first name',
    lastName: 'Last Name',
    lastNamePlaceholder: 'Your last name',
    phoneNumber: 'Phone Number',
    phonePlaceholder: '+20 1XX XXX XXXX',
    emailAddress: 'Email Address',
    contactEmailPlaceholder: 'name@example.com',
    howHelp: 'How can we help you?',
    messagePlaceholder: 'Tell us about your farm or project...',
    sendInquiry: 'Send inquiry',
    firstNameRequired: 'First name is required.',
    lastNameRequired: 'Last name is required.',
    phoneRequired: 'Phone number is required.',
    emailRequired: 'Email address is required.',
    emailInvalid: 'Please enter a valid email address.',
    inquiryNotConnected:
      'The inquiry form is not connected yet. Your message was not sent or stored.',
    welcomeEyebrow: 'iFarm Smart System',
    welcomeTitle: 'Welcome to intelligent farm monitoring.',
    welcomeText:
      'Monitor your farm, follow sensor readings, and understand changing conditions through one connected platform built to support better agricultural decisions.',
    welcomeFeature1: 'See farm conditions in one place',
    welcomeFeature2: 'Follow sensor readings and alerts',
    welcomeFeature3: 'Make informed decisions with your farm data',
    dashboardHeroLine1: 'Your Farm.',
    dashboardHeroLine2: 'Connected to Nature.',
    dashboardHeroLine3: 'Powered by Intelligence.',
    dashboardHeroText:
      'Monitor your farm in real time with smart sensors, live cameras, detailed reports, and easy-to-use settings — all in one place.',
    previewTitle: 'Farm Overview',
    previewSubtitle: 'Real-time data from your farm',
    previewAllFarms: 'All Farms',
    previewDemo: 'Illustrative preview · Sample values',
    previewMenu: 'Dashboard preview menu',
    previewSensors: 'Sensors',
    previewCameras: 'Cameras',
    previewReports: 'Reports',
    previewSettings: 'Settings',
    previewActiveSensors: 'Active Sensors',
    previewCamerasOnline: 'Cameras Online',
    previewAvgTemperature: 'Avg. Temperature',
    previewAvgMoisture: 'Avg. Soil Moisture',
    previewFieldConditions: 'Field Conditions',
    previewSoilMoisture: 'Soil Moisture',
    previewTemperature: 'Temperature',
    previewRecentActivity: 'Recent Activity',
    previewSensorThree: 'Sensor #3',
    previewMoistureUpdate: 'Soil moisture updated',
    previewTenMinutes: '10 min ago',
    previewCameraOne: 'Camera #1',
    previewMotion: 'Motion detected',
    previewTwentyFiveMinutes: '25 min ago',
    previewSensorSeven: 'Sensor #7',
    previewBatteryLow: 'Battery level low',
    previewOneHour: '1 hour ago',
    previewChartLabel:
      'Illustrative field conditions chart showing soil moisture and temperature over a day',
    interestedLabel: 'Interested in iFarm?',
    interestedTitle: 'Bring smarter monitoring to your farm.',
    interestedText:
      'Leave your email address and our team can follow up when the iFarm Smart System is ready for your farm.',
    emailLabel: 'Email address',
    emailPlaceholder: 'you@example.com',
    joinInterest: 'Register your interest',
    interestNotConnected: 'This form is not connected yet. Your email was not sent or stored.',
    existingLabel: 'Already an iFarm client?',
    existingTitle: 'Your farm workspace is ready when you are.',
    existingText:
      'Registered iFarm Smart System clients can sign in to access their private farm monitoring dashboard.',
    clientSignIn: 'Client Sign In',
    backToDashboard: 'Back to Dashboard',
    loginEyebrow: 'Client access',
    loginTitle: 'Sign in to your iFarm workspace.',
    loginText: 'Use the credentials provided for your iFarm Smart System account.',
    loginHeading: 'Sign in',
    loginSubtitle: 'to your iFarm Dashboard',
    username: 'Username',
    usernamePlaceholder: 'Enter your username',
    password: 'Password',
    passwordPlaceholder: 'Enter your password',
    accountId: 'Account ID',
    accountIdPlaceholder: 'Enter your account ID',
    signIn: 'Sign In',
    usernameRequired: 'Username is required.',
    passwordRequired: 'Password is required.',
    accountIdRequired: 'Account ID is required.',
    accountIdInvalid: 'Please enter a valid Account ID.',
    loginNotConnected: 'Authentication is not connected yet. You have not been signed in.',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
  },
  ar: {
    home: 'الرئيسية',
    dashboard: 'لوحة التحكم',
    store: 'المتجر',
    ai: 'الذكاء الاصطناعي',
    soon: 'قريبًا',
    comingSoonTitle: 'قريبًا',
    comingSoonText: 'نعمل على تجهيز هذه التجربة من آي فارم. تابعنا لمعرفة آخر المستجدات.',
    backHome: 'العودة إلى الرئيسية',
    contactUs: 'تواصل معنا',
    toggleLanguage: 'English',
    mainNav: 'التنقل الرئيسي',
    toggleNav: 'فتح أو إغلاق قائمة التنقل',
    footerNav: 'روابط التذييل',
    languageLabel: 'اللغة',
    backToIFarm: 'العودة إلى آي فارم',
    heroLabel: 'آي فارم للتنمية الزراعية',
    heroLine1: 'نخطط لأرضك،',
    heroLine2: 'وننمي مستقبلها.',
    heroText:
      'من تقييم الأرض إلى تسويق المحصول، نرشدك بحلول زراعية متكاملة تجمع بين الخبرة الميدانية والتقنيات الذكية.',
    freeConsultation: 'ابدأ باستشارة مجانية',
    exploreServices: 'اكتشف خدماتنا',
    rooted: 'جذورنا في المعرفة',
    commitment1: 'قرارات أفضل. زراعة أذكى.',
    commitment2: 'من الحقل إلى السوق',
    commitment3: 'تقنية لخدمة المزارعين',
    commitment4: 'تخطيط قائم على المعرفة',
    whoWeAre: 'من نحن',
    aboutTitle: 'خبرة عملية لقرارات زراعية أوضح.',
    aboutText:
      'نعمل مع ملاك الأراضي والمزارعين لفهم ظروف الأرض وتحديد الأولويات، بما يساعدهم على اتخاذ قرارات مدروسة لمشروعاتهم الزراعية.',
    aboutAssessment: 'تقييم الأراضي',
    aboutAssessmentText: 'تعرّف على التربة والمياه وإمكانات أرضك.',
    aboutPlanning: 'تخطيط المحاصيل والمشروع',
    aboutPlanningText: 'اختر المحاصيل المناسبة وحدد مسارًا واضحًا للتطوير.',
    aboutGuidance: 'إرشاد زراعي مستمر',
    aboutGuidanceText: 'احصل على دعم عملي مع نمو مشروعك.',
    services: 'خدماتنا',
    servicesTitle: 'حلول متكاملة من الحقل إلى السوق.',
    servicesIntro: 'اختر نقطة البداية المناسبة لمشروعك، وسنساعدك في تحديد الخطوة التالية.',
    service1: 'دراسات الجدوى والتخطيط',
    service1Text: 'دراسة المشروع وتصميم المزرعة وخطة تنفيذ خطوة بخطوة.',
    service1Note: 'حوّل الأفكار إلى خطوات',
    service2: 'المحاصيل والبذور',
    service2Text: 'اختيار المحاصيل والأصناف والبذور المناسبة لظروف أرضك.',
    service2Note: 'اختيار يناسب أرضك',
    service3: 'تقييم الأراضي',
    service3Text: 'فهم التربة والمياه ومدى ملاءمة الأرض قبل اتخاذ قرار الاستثمار.',
    service3Note: 'ابدأ بأساس واضح',
    service4: 'التسويق والتصدير',
    service4Text: 'تخطيط تسويق المحصول والاستعداد للفرص التجارية والتصديرية.',
    service4Note: 'اربط محصولك بالسوق',
    service5: 'إدارة المزارع',
    service5Text: 'تنظيم العمليات الزراعية ومتابعة الإنتاج بقرارات قائمة على البيانات.',
    service5Note: 'من التخطيط إلى التشغيل',
    service6: 'الري الذكي',
    service6Text: 'تخطيط شبكات الري واستخدام التقنيات لمتابعة احتياجات المزرعة.',
    service6Note: 'إدارة واعية للموارد',
    consultationEyebrow: 'استشارات زراعية متكاملة',
    consultationTitle: 'الزراعة الأفضل تبدأ بفهم أرضك.',
    consultationText:
      'أخبرنا عن أرضك واحتياجاتك للمتابعة. يساعدك فريق آي فارم في اكتشاف نقطة البداية المناسبة.',
    benefit1: 'تقييم الأرض والتربة',
    benefit2: 'تخطيط المحاصيل والمشروع',
    benefit3: 'إرشاد زراعي مستمر',
    advisor: 'تحدث إلى مستشار زراعي',
    smartSystem: 'نظام آي فارم الذكي',
    smartTitle: 'مزرعتك أقرب إليك من أي وقت مضى.',
    smartText:
      'ابقَ على تواصل مع مزرعتك، وتابع تغير ظروفها والمعلومات التي تساعدك في قراراتك اليومية.',
    smartBenefit1: 'رؤية أوضح لبيانات المزرعة',
    smartBenefit2: 'التخطيط والمتابعة في مكان واحد',
    smartBenefit3: 'أدوات ذكية تدعم قراراتك الزراعية',
    discoverSystem: 'اكتشف النظام الجديد',
    howStart: 'كيف نبدأ؟',
    stepsTitle: 'خطوتك الأولى يمكن أن تكون بسيطة.',
    step1: 'أخبرنا عن أرضك',
    step1Text: 'شاركنا موقع أرضك ومرحلة المشروع وما تحتاج إليه.',
    step2: 'نفهم احتياجاتك معًا',
    step2Text: 'نناقش أهدافك ونحدد المعلومات اللازمة لتقييم المشروع.',
    step3: 'نحدد الخطوة التالية',
    step3Text: 'نقترح مسار الخدمة المناسب وخطة بدء مشروعك.',
    getInTouch: 'تواصل معنا',
    contactTitle: 'أرضك لديها إمكانات. دعنا نكتشفها معًا.',
    contactText:
      'هل لديك أرض أو فكرة لمشروع زراعي؟ تواصل معنا لنساعدك في اختيار نقطة البداية المناسبة.',
    phone: '+20 3 2275 5233',
    instagram: '@ifarm_wm',
    website: 'www.ifarm.com',
    contactTeam: 'تواصل مع فريق آي فارم',
    socialFollow: 'تابع آي فارم',
    footerTagline: 'شريكك في التنمية الزراعية',
    footerServices: 'الخدمات',
    footerContact: 'تواصل معنا',
    companyName: 'آي فارم للتنمية الزراعية',
    copyright: '© 2026 آي فارم. جميع الحقوق محفوظة.',
    firstName: 'الاسم الأول',
    firstNamePlaceholder: 'اكتب اسمك الأول',
    lastName: 'اسم العائلة',
    lastNamePlaceholder: 'اكتب اسم العائلة',
    phoneNumber: 'رقم الهاتف',
    phonePlaceholder: '+20 1XX XXX XXXX',
    emailAddress: 'البريد الإلكتروني',
    contactEmailPlaceholder: 'name@example.com',
    howHelp: 'كيف يمكننا مساعدتك؟',
    messagePlaceholder: 'أخبرنا عن مزرعتك أو مشروعك...',
    sendInquiry: 'إرسال الاستفسار',
    firstNameRequired: 'الاسم الأول مطلوب.',
    lastNameRequired: 'اسم العائلة مطلوب.',
    phoneRequired: 'رقم الهاتف مطلوب.',
    emailRequired: 'البريد الإلكتروني مطلوب.',
    emailInvalid: 'يرجى إدخال بريد إلكتروني صالح.',
    inquiryNotConnected: 'نموذج الاستفسار غير متصل حاليًا. لم يتم إرسال رسالتك أو حفظها.',
    welcomeEyebrow: 'نظام آي فارم الذكي',
    welcomeTitle: 'مرحبًا بك في المراقبة الزراعية الذكية.',
    welcomeText:
      'تابع مزرعتك وقراءات المستشعرات والتغيرات في الظروف عبر منصة مترابطة تساعدك على اتخاذ قرارات زراعية أفضل.',
    welcomeFeature1: 'تابع ظروف المزرعة في مكان واحد',
    welcomeFeature2: 'راقب قراءات المستشعرات والتنبيهات',
    welcomeFeature3: 'اتخذ قرارات مدروسة باستخدام بيانات مزرعتك',
    dashboardHeroLine1: 'مزرعتك.',
    dashboardHeroLine2: 'متصلة بالطبيعة.',
    dashboardHeroLine3: 'مدعومة بالذكاء.',
    dashboardHeroText:
      'تابع مزرعتك لحظة بلحظة عبر مستشعرات ذكية وكاميرات مباشرة وتقارير مفصلة وإعدادات سهلة الاستخدام، كل ذلك في مكان واحد.',
    previewTitle: 'نظرة عامة على المزرعة',
    previewSubtitle: 'بيانات مباشرة من مزرعتك',
    previewAllFarms: 'كل المزارع',
    previewDemo: 'واجهة توضيحية · بيانات تجريبية',
    previewMenu: 'قائمة معاينة لوحة المتابعة',
    previewSensors: 'المستشعرات',
    previewCameras: 'الكاميرات',
    previewReports: 'التقارير',
    previewSettings: 'الإعدادات',
    previewActiveSensors: 'مستشعر نشط',
    previewCamerasOnline: 'كاميرات متصلة',
    previewAvgTemperature: 'متوسط الحرارة',
    previewAvgMoisture: 'متوسط رطوبة التربة',
    previewFieldConditions: 'ظروف الحقل',
    previewSoilMoisture: 'رطوبة التربة',
    previewTemperature: 'الحرارة',
    previewRecentActivity: 'النشاط الأخير',
    previewSensorThree: 'المستشعر ٣',
    previewMoistureUpdate: 'تم تحديث رطوبة التربة',
    previewTenMinutes: 'منذ ١٠ دقائق',
    previewCameraOne: 'الكاميرا ١',
    previewMotion: 'تم رصد حركة',
    previewTwentyFiveMinutes: 'منذ ٢٥ دقيقة',
    previewSensorSeven: 'المستشعر ٧',
    previewBatteryLow: 'مستوى البطارية منخفض',
    previewOneHour: 'منذ ساعة',
    previewChartLabel: 'رسم توضيحي لظروف الحقل يبيّن رطوبة التربة والحرارة على مدار اليوم',
    interestedLabel: 'مهتم بنظام آي فارم؟',
    interestedTitle: 'اجعل متابعة مزرعتك أكثر ذكاءً.',
    interestedText:
      'اترك بريدك الإلكتروني ليتمكن فريقنا من التواصل معك عند توفر نظام آي فارم الذكي لمزرعتك.',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'name@example.com',
    joinInterest: 'سجل اهتمامك',
    interestNotConnected: 'هذا النموذج غير متصل حاليًا. لم يتم إرسال بريدك أو حفظه.',
    existingLabel: 'هل أنت من عملاء آي فارم؟',
    existingTitle: 'مساحة متابعة مزرعتك بانتظارك.',
    existingText:
      'يمكن لعملاء نظام آي فارم الذكي المسجلين تسجيل الدخول إلى لوحة المتابعة الخاصة بمزرعتهم.',
    clientSignIn: 'تسجيل دخول العميل',
    backToDashboard: 'العودة إلى صفحة النظام',
    loginEyebrow: 'دخول العملاء',
    loginTitle: 'سجل الدخول إلى مساحة آي فارم.',
    loginText: 'استخدم بيانات الدخول الخاصة بحساب نظام آي فارم الذكي.',
    loginHeading: 'تسجيل الدخول',
    loginSubtitle: 'إلى لوحة آي فارم',
    username: 'اسم المستخدم',
    usernamePlaceholder: 'أدخل اسم المستخدم',
    password: 'كلمة المرور',
    passwordPlaceholder: 'أدخل كلمة المرور',
    accountId: 'معرّف الحساب',
    accountIdPlaceholder: 'أدخل معرّف الحساب',
    signIn: 'تسجيل الدخول',
    usernameRequired: 'اسم المستخدم مطلوب.',
    passwordRequired: 'كلمة المرور مطلوبة.',
    accountIdRequired: 'معرّف الحساب مطلوب.',
    accountIdInvalid: 'يرجى إدخال معرّف حساب صالح.',
    loginNotConnected: 'المصادقة غير متصلة حاليًا. لم يتم تسجيل دخولك.',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
  },
} satisfies Record<Locale, Record<string, string>>;

const navItems: NavItem[] = [
  { id: 'home', href: '/', label: 'home' },
  { id: 'dashboard', href: '/dashboard', label: 'dashboard' },
  { id: 'store', href: '/store', label: 'store', soon: true },
  { id: 'ai', href: '/ai', label: 'ai', soon: true },
];

type I18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: CopyKey) => string;
  navigate: (to: string) => void;
};
const I18nContext = createContext<I18nValue | null>(null);
function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nContext');
  return value;
}

type AppLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };
function AppLink({ href, onClick, target, children, ...props }: AppLinkProps) {
  const { navigate } = useI18n();
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    let destination: URL;
    try {
      destination = new URL(href, window.location.href);
    } catch {
      event.preventDefault();
      return;
    }
    if (destination.protocol !== 'http:' && destination.protocol !== 'https:') {
      event.preventDefault();
      return;
    }
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      target === '_blank' ||
      props.download !== undefined
    )
      return;
    if (href.startsWith('#')) return;
    if (destination.origin !== window.location.origin) return;
    event.preventDefault();
    navigate(`${destination.pathname}${destination.search}${destination.hash}`);
  }
  return (
    <a href={href} target={target} {...props} onClick={handleClick}>
      {children}
    </a>
  );
}

type IconName =
  | 'arrow'
  | 'check'
  | 'leaf'
  | 'sprout'
  | 'map'
  | 'box'
  | 'tractor'
  | 'water'
  | 'menu'
  | 'phone'
  | 'globe'
  | 'clipboard'
  | 'facebook'
  | 'instagram'
  | 'mail'
  | 'user'
  | 'lock'
  | 'id'
  | 'eye'
  | 'eyeOff'
  | 'camera'
  | 'thermometer'
  | 'bell'
  | 'settings'
  | 'warning';

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const shared = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };
  const paths: Record<IconName, ReactNode> = {
    arrow: (
      <>
        <path d="M7 17 17 7M7 7h10v10" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    leaf: (
      <>
        <path d="M20 4c-8 0-14 4-14 11a5 5 0 0 0 5 5c7 0 11-6 9-16Z" />
        <path d="M4 21c3-5 7-8 12-11" />
      </>
    ),
    sprout: (
      <>
        <path d="M12 21v-9" />
        <path d="M12 12c0-5-3-8-8-8 0 5 3 8 8 8Zm0 4c0-4 3-7 8-7 0 4-3 7-8 7Z" />
        <path d="M6 21h12" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
        <path d="M9 3v15m6-12v15" />
      </>
    ),
    box: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Z" />
        <path d="M3 8v9l9 5 9-5V8M12 13v9" />
      </>
    ),
    tractor: (
      <>
        <path d="M3 17h13l3 2h2v-6h-5l-2-5H8l-2 5H3v4Z" />
        <circle cx="7" cy="18" r="2" />
        <circle cx="17" cy="18" r="2" />
        <path d="M10 8V5h4" />
      </>
    ),
    water: (
      <>
        <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z" />
        <path d="M9 15a3 3 0 0 0 3 3" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    phone: (
      <>
        <path d="M5 3h4l2 5-3 2a16 16 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2C10 20 4 14 3 5a2 2 0 0 1 2-2Z" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18m0-18a14 14 0 0 0 0 18" />
      </>
    ),
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="17" rx="2" />
        <path d="M9 4V3h6v1M8 10h8m-8 4h8m-8 4h5" />
      </>
    ),
    facebook: (
      <>
        <path d="M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9a1 1 0 0 1 1-1Z" />
      </>
    ),
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 1 1 8 0v3m-4 5v2" />
      </>
    ),
    id: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8" cy="11" r="2" />
        <path d="M5.5 16a3 3 0 0 1 5 0M13 10h5m-5 4h5" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    eyeOff: (
      <>
        <path d="m3 3 18 18M10.6 6.2A10.7 10.7 0 0 1 12 6c6.5 0 10 6 10 6a16 16 0 0 1-3 3.5M6.2 6.2C3.4 8 2 12 2 12s3.5 6 10 6c1.4 0 2.6-.3 3.7-.8" />
        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      </>
    ),
    camera: (
      <>
        <path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" />
        <circle cx="12" cy="13" r="3.5" />
      </>
    ),
    thermometer: (
      <>
        <path d="M14 14.8V5a3 3 0 0 0-6 0v9.8a5 5 0 1 0 6 0Z" />
        <path d="M11 11v6" />
      </>
    ),
    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Zm-8 12h4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path
          d="m19.4 15 .1.1 1.3 1-1.4 2.4-1.6-.6a8 8 0 0 1-1.7 1l-.3 1.7h-2.8l-.3-1.7a8 8 0 0 1-1.7-1l-1.6.6L8 16.1l1.3-1a7 7 0 0 1 0-2.1l-1.3-1 1.4-2.4 1.6.6a8 8 0 0 1 1.7-1L13 7.5h2.8l.3 1.7a8 8 0 0 1 1.7 1l1.6-.6 1.4 2.4-1.3 1a7 7 0 0 1-.1 2Z"
          transform="translate(-1 -1)"
        />
      </>
    ),
    warning: (
      <>
        <path d="M12 3 2.7 19a1.4 1.4 0 0 0 1.2 2h16.2a1.4 1.4 0 0 0 1.2-2L12 3Z" />
        <path d="M12 9v4m0 3h.01" />
      </>
    ),
  };
  return <svg {...shared}>{paths[name]}</svg>;
}

function Button({
  children,
  href,
  variant = 'dark',
  arrow = true,
  className = '',
}: {
  children: ReactNode;
  href: string;
  variant?: 'dark' | 'lime' | 'outline';
  arrow?: boolean;
  className?: string;
}) {
  return (
    <AppLink className={`button button--${variant} ${className}`} href={href}>
      {children}
      {arrow && <Icon name="arrow" size={16} />}
    </AppLink>
  );
}

function BrandMark() {
  const { t } = useI18n();
  return (
    <AppLink href="/" className="brand" aria-label={t('companyName')}>
      <span className="brand__logo">
        <img src="/assets/logo.webp" width="160" height="150" alt="" decoding="async" />
      </span>
    </AppLink>
  );
}

function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div className="language-switch" role="group" aria-label={t('languageLabel')}>
      <button
        type="button"
        aria-pressed={locale === 'en'}
        className={locale === 'en' ? 'is-selected' : ''}
        onClick={() => {
          setLocale('en');
        }}
      >
        English
      </button>
      <button
        type="button"
        aria-pressed={locale === 'ar'}
        className={locale === 'ar' ? 'is-selected' : ''}
        onClick={() => {
          setLocale('ar');
        }}
      >
        العربية
      </button>
    </div>
  );
}

function Navbar({
  active = 'home',
  login = false,
}: {
  active?: 'home' | 'dashboard' | 'store' | 'ai';
  login?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { t, locale } = useI18n();
  return (
    <header className={`site-header ${login ? 'site-header--login' : ''}`}>
      <nav className="navbar wrap" aria-label={t('mainNav')}>
        <BrandMark />
        {!login && (
          <button
            className="menu-toggle"
            type="button"
            aria-label={t('toggleNav')}
            aria-expanded={open}
            onClick={() => {
              setOpen(!open);
            }}
          >
            <Icon name="menu" size={21} />
          </button>
        )}
        <div className={`nav-content ${open ? 'is-open' : ''}`}>
          {login ? (
            <div className="login-header-actions">
              <AppLink className="back-to-ifarm" href="/dashboard">
                <span aria-hidden="true">←</span>
                <span>{t('backToIFarm')}</span>
              </AppLink>
              <LanguageSwitch />
            </div>
          ) : (
            <>
              <div className="nav-links" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                {navItems.map((item) => (
                  <AppLink
                    key={item.id}
                    className={`nav-link ${active === item.id ? 'is-active' : ''}`}
                    aria-current={active === item.id ? 'page' : undefined}
                    href={item.href}
                    aria-label={item.soon ? `${t(item.label)}, ${t('soon')}` : undefined}
                  >
                    {t(item.label)}
                    {item.soon && <span className="nav-link__badge">{t('soon')}</span>}
                  </AppLink>
                ))}
              </div>
              <div className="nav-actions">
                <LanguageSwitch />
                <Button
                  href={
                    active === 'dashboard'
                      ? '#interested'
                      : active === 'home'
                        ? '#contact'
                        : '/#contact'
                  }
                  className="nav-cta"
                >
                  {t('contactUs')}
                </Button>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function FigmaImage({
  label,
  src,
  srcSet,
  sizes,
  className = '',
  crop = '',
}: {
  label: string;
  src: string;
  srcSet?: string;
  sizes?: string;
  className?: string;
  crop?: string;
}) {
  return (
    <div className={`figma-image ${className} ${crop}`} role="img" aria-label={label}>
      <img src={src} srcSet={srcSet} sizes={sizes} loading="lazy" decoding="async" alt="" />
    </div>
  );
}

const services: { icon: IconName; title: CopyKey; description: CopyKey; note: CopyKey }[] = [
  { icon: 'clipboard', title: 'service1', description: 'service1Text', note: 'service1Note' },
  { icon: 'sprout', title: 'service2', description: 'service2Text', note: 'service2Note' },
  { icon: 'map', title: 'service3', description: 'service3Text', note: 'service3Note' },
  { icon: 'box', title: 'service4', description: 'service4Text', note: 'service4Note' },
  { icon: 'tractor', title: 'service5', description: 'service5Text', note: 'service5Note' },
  { icon: 'water', title: 'service6', description: 'service6Text', note: 'service6Note' },
];

function ServiceCard({ icon, title, description, note }: (typeof services)[number]) {
  const { t } = useI18n();
  return (
    <article className="service-card">
      <div className="service-card__top">
        <span className="icon-tile">
          <Icon name={icon} size={22} />
        </span>
        <Icon name="arrow" size={16} />
      </div>
      <h3>{t(title)}</h3>
      <p>{t(description)}</p>
      <span className="service-card__note">{t(note)}</span>
    </article>
  );
}

function Benefits({ items }: { items: CopyKey[] }) {
  const { t } = useI18n();
  return (
    <ul className="benefit-list">
      {items.map((item) => (
        <li key={item}>
          <span>
            <Icon name="check" size={14} />
          </span>
          {t(item)}
        </li>
      ))}
    </ul>
  );
}

function DashboardPreview() {
  const { t, locale } = useI18n();
  const menu: { icon: IconName; label: CopyKey }[] = [
    { icon: 'sprout', label: 'previewSensors' },
    { icon: 'camera', label: 'previewCameras' },
    { icon: 'clipboard', label: 'previewReports' },
    { icon: 'settings', label: 'previewSettings' },
  ];
  const metrics: { icon: IconName; value: string; label: CopyKey; tone: string }[] = [
    { icon: 'leaf', value: '24', label: 'previewActiveSensors', tone: 'green' },
    { icon: 'camera', value: '3', label: 'previewCamerasOnline', tone: 'forest' },
    { icon: 'thermometer', value: '28°C', label: 'previewAvgTemperature', tone: 'red' },
    { icon: 'water', value: '68%', label: 'previewAvgMoisture', tone: 'blue' },
  ];
  const activity: {
    icon: IconName;
    title: CopyKey;
    detail: CopyKey;
    time: CopyKey;
    tone: string;
  }[] = [
    {
      icon: 'water',
      title: 'previewSensorThree',
      detail: 'previewMoistureUpdate',
      time: 'previewTenMinutes',
      tone: 'green',
    },
    {
      icon: 'camera',
      title: 'previewCameraOne',
      detail: 'previewMotion',
      time: 'previewTwentyFiveMinutes',
      tone: 'blue',
    },
    {
      icon: 'warning',
      title: 'previewSensorSeven',
      detail: 'previewBatteryLow',
      time: 'previewOneHour',
      tone: 'amber',
    },
  ];
  return (
    <div
      className="dashboard-preview"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      role="group"
      aria-label={t('previewDemo')}
    >
      <div className="dashboard-preview__bezel">
        <div className="dashboard-preview__chrome" aria-hidden="true">
          <span />
          <span />
          <span />
          <i />
        </div>
        <div className="dashboard-preview__app">
          <aside className="dashboard-preview__sidebar">
            <div className="dashboard-preview__brand">
              <img src="/assets/logo.webp" width="160" height="150" alt="iFarm" decoding="async" />
            </div>
            <nav aria-label={t('previewMenu')}>
              <ul>
                {menu.map((item, index) => (
                  <li key={item.label}>
                    <span
                      className={index === 0 ? 'is-current' : ''}
                      aria-current={index === 0 ? 'page' : undefined}
                    >
                      <Icon name={item.icon} size={16} />
                      <span>{t(item.label)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          <div className="dashboard-preview__main">
            <header className="dashboard-preview__topbar">
              <div className="dashboard-preview__heading">
                <span className="dashboard-preview__demo">{t('previewDemo')}</span>
                <h2>{t('previewTitle')}</h2>
                <p>{t('previewSubtitle')}</p>
              </div>
              <div className="dashboard-preview__tools">
                <span className="dashboard-preview__farm-select">
                  {t('previewAllFarms')} <span aria-hidden="true">⌄</span>
                </span>
                <span className="dashboard-preview__bell" aria-hidden="true">
                  <Icon name="bell" size={16} />
                </span>
                <span className="dashboard-preview__avatar" aria-hidden="true">
                  D
                </span>
              </div>
            </header>
            <div className="dashboard-preview__metrics">
              {metrics.map((metric) => (
                <article className="dashboard-preview__metric" key={metric.label}>
                  <span className={`dashboard-preview__metric-icon is-${metric.tone}`}>
                    <Icon name={metric.icon} size={17} />
                  </span>
                  <span className="dashboard-preview__metric-info">
                    <strong>{metric.value}</strong>
                    <small>{t(metric.label)}</small>
                  </span>
                </article>
              ))}
            </div>
            <div className="dashboard-preview__lower">
              <section className="dashboard-preview__panel dashboard-preview__chart-panel">
                <div className="dashboard-preview__panel-head">
                  <h3>{t('previewFieldConditions')}</h3>
                  <span aria-hidden="true">⌄</span>
                </div>
                <div className="dashboard-preview__legend">
                  <span>
                    <i className="is-soil" />
                    {t('previewSoilMoisture')}
                  </span>
                  <span>
                    <i className="is-temperature" />
                    {t('previewTemperature')}
                  </span>
                </div>
                <svg
                  className="dashboard-preview__chart"
                  viewBox="0 0 360 150"
                  role="img"
                  aria-label={t('previewChartLabel')}
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="dashboard-chart-fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0" stopColor="#72ba50" stopOpacity=".22" />
                      <stop offset="1" stopColor="#72ba50" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    className="dashboard-preview__gridline"
                    d="M36 18H352M36 54H352M36 90H352M36 126H352"
                  />
                  <path
                    className="dashboard-preview__area"
                    d="M36 78 C58 68 72 52 96 62 S134 86 157 69 S190 45 214 55 S248 78 271 61 S316 48 352 57 L352 126H36Z"
                  />
                  <path
                    className="dashboard-preview__soil-line"
                    d="M36 78 C58 68 72 52 96 62 S134 86 157 69 S190 45 214 55 S248 78 271 61 S316 48 352 57"
                  />
                  <path
                    className="dashboard-preview__temperature-line"
                    d="M36 97 C59 87 73 94 96 88 S136 72 157 82 S190 102 214 91 S250 72 271 82 S317 98 352 87"
                  />
                  <text x="4" y="21">
                    100%
                  </text>
                  <text x="9" y="57">
                    50%
                  </text>
                  <text x="15" y="129">
                    0%
                  </text>
                </svg>
                <div className="dashboard-preview__times" aria-hidden="true">
                  <span>06:00</span>
                  <span>10:00</span>
                  <span>14:00</span>
                  <span>18:00</span>
                  <span>22:00</span>
                </div>
              </section>
              <section className="dashboard-preview__panel dashboard-preview__activity">
                <h3>{t('previewRecentActivity')}</h3>
                <ul>
                  {activity.map((item) => (
                    <li key={item.title}>
                      <span className={`dashboard-preview__activity-icon is-${item.tone}`}>
                        <Icon name={item.icon} size={15} />
                      </span>
                      <span className="dashboard-preview__activity-copy">
                        <strong>{t(item.title)}</strong>
                        <span>{t(item.detail)}</span>
                        <small>{t(item.time)}</small>
                      </span>
                      <span className="dashboard-preview__activity-arrow" aria-hidden="true">
                        ›
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
      <span className="dashboard-preview__stand" aria-hidden="true" />
    </div>
  );
}

const aboutFeatures: { icon: IconName; title: CopyKey; description: CopyKey }[] = [
  { icon: 'leaf', title: 'aboutAssessment', description: 'aboutAssessmentText' },
  { icon: 'sprout', title: 'aboutPlanning', description: 'aboutPlanningText' },
  { icon: 'clipboard', title: 'aboutGuidance', description: 'aboutGuidanceText' },
];

function AboutHighlights() {
  const { t } = useI18n();
  return (
    <ul className="about-highlights">
      {aboutFeatures.map((feature) => (
        <li key={feature.title}>
          <span className="about-highlight__icon">
            <Icon name={feature.icon} size={17} />
          </span>
          <span className="about-highlight__copy">
            <strong>{t(feature.title)}</strong>
            <span>{t(feature.description)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function AboutBotanical() {
  return (
    <div className="about-botanical" aria-hidden="true">
      <img
        className="about-botanical__corner about-botanical__corner--top"
        src="/assets/who-we-are/who-we-are-leaf-top-right.webp"
        width="360"
        height="360"
        loading="lazy"
        decoding="async"
        alt=""
        draggable="false"
      />
      <img
        className="about-botanical__corner about-botanical__corner--bottom"
        src="/assets/who-we-are/who-we-are-leaf-bottom-left.webp"
        width="360"
        height="360"
        loading="lazy"
        decoding="async"
        alt=""
        draggable="false"
      />
    </div>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section className="hero">
      <img
        className="hero__background"
        src="/assets/farmland-landscape.webp"
        srcSet="/assets/farmland-landscape-1200.webp 1200w, /assets/farmland-landscape.webp 2400w"
        sizes="100vw"
        width="2400"
        height="831"
        fetchPriority="high"
        decoding="async"
        alt=""
        aria-hidden="true"
      />
      <div className="hero-grid wrap">
        <div className="hero__content">
          <SectionLabel variant="dark">{t('heroLabel')}</SectionLabel>
          <h1>
            {t('heroLine1')}
            <br />
            {t('heroLine2')}
          </h1>
          <p>{t('heroText')}</p>
          <div className="hero__actions">
            <Button href="#contact" variant="lime">
              {t('freeConsultation')}
            </Button>
            <a className="text-link text-link--light" href="#services">
              {t('exploreServices')} <span>↓</span>
            </a>
          </div>
          <div className="hero__signature">
            <span className="signature-line" />
            {t('rooted')}
          </div>
        </div>
      </div>
    </section>
  );
}

function CommitmentStrip() {
  const { t } = useI18n();
  const items: CopyKey[] = ['commitment1', 'commitment2', 'commitment3', 'commitment4'];
  return (
    <div className="commitments wrap">
      {items.map((item) => (
        <div className="commitment" key={item}>
          <Icon name="check" size={16} />
          {t(item)}
        </div>
      ))}
    </div>
  );
}

function AboutSection() {
  const { t, locale } = useI18n();
  const artwork =
    locale === 'en'
      ? {
          src: '/assets/who-we-are/en-1200.webp',
          srcSet: '/assets/who-we-are/en-640.webp 640w, /assets/who-we-are/en-1200.webp 1200w',
          width: 1200,
          height: 434,
          alt: 'iFarm agricultural development across the farm',
        }
      : {
          src: '/assets/who-we-are/ar-banner-1200.webp',
          srcSet:
            '/assets/who-we-are/ar-banner-640.webp 640w, /assets/who-we-are/ar-banner-1200.webp 1200w',
          width: 1200,
          height: 434,
          alt: 'تصميم آي فارم للتنمية الزراعية مع شعار الشركة ورسالتها باللغة العربية',
        };
  return (
    <section className="about-section section-pad">
      <div className="about-grid wrap">
        <div className="about-copy">
          <SectionLabel>{t('whoWeAre')}</SectionLabel>
          <h2>{t('aboutTitle')}</h2>
          <p>{t('aboutText')}</p>
          <AboutHighlights />
        </div>
        <AboutBotanical />
        <picture className="about-artwork">
          <img
            src={artwork.src}
            srcSet={artwork.srcSet}
            sizes="(min-width: 961px) calc(70vw - 80px), (min-width: 681px) calc(100vw - 124px), calc(100vw - 70px)"
            width={artwork.width}
            height={artwork.height}
            loading="lazy"
            decoding="async"
            alt={artwork.alt}
          />
        </picture>
      </div>
    </section>
  );
}

function ServicesSection() {
  const { t } = useI18n();
  return (
    <section className="services-section section-pad" id="services">
      <div className="wrap">
        <SectionLabel>{t('services')}</SectionLabel>
        <h2>{t('servicesTitle')}</h2>
        <p className="section-intro">{t('servicesIntro')}</p>
        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ConsultationFeature() {
  const { t, locale } = useI18n();
  const servicesImage =
    locale === 'en'
      ? {
          src: '/assets/localized/en/farm-services.webp',
          srcSet:
            '/assets/localized/en/farm-services-640.webp 640w, /assets/localized/en/farm-services.webp 800w',
        }
      : {
          src: '/assets/localized/ar/farm-services.webp',
          srcSet:
            '/assets/localized/ar/farm-services-640.webp 640w, /assets/localized/ar/farm-services.webp 800w',
        };
  const servicesImageLabel =
    locale === 'en'
      ? 'iFarm farm planning and agricultural services'
      : 'خدمات آي فارم للتخطيط الزراعي';
  return (
    <section className="consultation-feature section-pad">
      <div className="wrap consultation-grid">
        <div className="consultation-copy">
          <SectionLabel>{t('consultationEyebrow')}</SectionLabel>
          <h2>{t('consultationTitle')}</h2>
          <p>{t('consultationText')}</p>
          <Benefits items={['benefit1', 'benefit2', 'benefit3']} />
          <Button href="#contact" variant="dark">
            {t('advisor')}
          </Button>
        </div>
        <FigmaImage
          label={servicesImageLabel}
          src={servicesImage.src}
          srcSet={servicesImage.srcSet}
          sizes="(max-width: 680px) calc(100vw - 40px), 360px"
          className="consultation-image"
        />
      </div>
    </section>
  );
}

function SmartSystemSection() {
  const { t, locale } = useI18n();
  const systemImage =
    locale === 'en'
      ? '/assets/localized/en/smart-system.webp'
      : '/assets/localized/ar/smart-system.webp';
  const systemImageLabel =
    locale === 'en'
      ? 'Original iFarm Smart System promotional poster'
      : 'ملصق نظام آي فارم الذكي الأصلي';
  return (
    <section className="smart-section section-pad">
      <img
        className="smart-section__background"
        src="/assets/smart-system-landscape.webp"
        srcSet="/assets/smart-system-landscape-960.webp 960w, /assets/smart-system-landscape.webp 1920w"
        sizes="100vw"
        width="1920"
        height="1280"
        loading="lazy"
        decoding="async"
        alt=""
        aria-hidden="true"
      />
      <div className="wrap smart-grid">
        <div className="smart-copy">
          <SectionLabel variant="dark">{t('smartSystem')}</SectionLabel>
          <h2>{t('smartTitle')}</h2>
          <p>{t('smartText')}</p>
          <Benefits items={['smartBenefit1', 'smartBenefit2', 'smartBenefit3']} />
          <Button href="/dashboard" variant="lime">
            {t('discoverSystem')}
          </Button>
        </div>
        <figure className="smart-poster">
          <img
            src={systemImage}
            width="832"
            height="1248"
            loading="lazy"
            decoding="async"
            alt={systemImageLabel}
          />
        </figure>
      </div>
    </section>
  );
}

function StepsSection() {
  const { t } = useI18n();
  const steps: { n: string; title: CopyKey; body: CopyKey }[] = [
    { n: '01', title: 'step1', body: 'step1Text' },
    { n: '02', title: 'step2', body: 'step2Text' },
    { n: '03', title: 'step3', body: 'step3Text' },
  ];
  return (
    <section className="steps-section section-pad">
      <div className="wrap">
        <SectionLabel>{t('howStart')}</SectionLabel>
        <h2>{t('stepsTitle')}</h2>
        <div className="steps-grid">
          {steps.map((s) => (
            <article className="step" key={s.n}>
              <span>{s.n}</span>
              <h3>{t(s.title)}</h3>
              <p>{t(s.body)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const { t } = useI18n();
  type InquiryField = 'firstName' | 'lastName' | 'phone' | 'email';
  const [values, setValues] = useState<Record<InquiryField, string>>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState<Partial<Record<InquiryField, CopyKey>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('');
  const errorKey: Record<InquiryField, CopyKey> = {
    firstName: 'firstNameRequired',
    lastName: 'lastNameRequired',
    phone: 'phoneRequired',
    email: 'emailRequired',
  };
  const errorFor = (field: InquiryField, value: string): CopyKey | undefined => {
    if (!value.trim()) return errorKey[field];
    if (field === 'email' && !isValidEmail(value)) return 'emailInvalid';
    return undefined;
  };
  function updateField(field: InquiryField, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus('');
    if (submitted) setErrors((current) => ({ ...current, [field]: errorFor(field, value) }));
  }
  function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const next = Object.fromEntries(
      (Object.keys(values) as InquiryField[]).map((field) => [
        field,
        errorFor(field, values[field]),
      ]),
    ) as Partial<Record<InquiryField, CopyKey>>;
    setErrors(next);
    setStatus(Object.values(next).some(Boolean) ? '' : t('inquiryNotConnected'));
  }
  const field = (name: InquiryField, label: CopyKey, placeholder: CopyKey, type = 'text') => (
    <label className="inquiry-field" htmlFor={`inquiry-${name}`} key={name}>
      <span>
        {t(label)}{' '}
        <span className="required-mark" aria-hidden="true">
          *
        </span>
      </span>
      <input
        id={`inquiry-${name}`}
        name={name}
        type={type}
        placeholder={t(placeholder)}
        autoComplete={
          name === 'firstName'
            ? 'given-name'
            : name === 'lastName'
              ? 'family-name'
              : name === 'phone'
                ? 'tel'
                : 'email'
        }
        value={values[name]}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `inquiry-${name}-error` : undefined}
        required
        onChange={(event) => {
          updateField(name, event.target.value);
        }}
      />
      {errors[name] && (
        <span className="inquiry-field__error" id={`inquiry-${name}-error`}>
          {t(errors[name])}
        </span>
      )}
    </label>
  );
  return (
    <section className="contact-section section-pad" id="contact">
      <div className="wrap contact-grid">
        <div className="contact-copy">
          <SectionLabel>{t('getInTouch')}</SectionLabel>
          <h2>{t('contactTitle')}</h2>
          <p>{t('contactText')}</p>
          <a className="contact-phone" href="tel:+203227552330">
            <Icon name="phone" size={19} />
            {t('phone')}
          </a>
        </div>
        <form className="inquiry-form" noValidate onSubmit={submitInquiry}>
          <h3>{t('contactTeam')}</h3>
          <div className="form-row">
            {field('firstName', 'firstName', 'firstNamePlaceholder')}
            {field('lastName', 'lastName', 'lastNamePlaceholder')}
          </div>
          <div className="form-row">
            {field('phone', 'phoneNumber', 'phonePlaceholder', 'tel')}
            {field('email', 'emailAddress', 'contactEmailPlaceholder', 'email')}
          </div>
          <label className="inquiry-field" htmlFor="inquiry-message">
            <span>{t('howHelp')}</span>
            <textarea
              id="inquiry-message"
              name="message"
              rows={4}
              placeholder={t('messagePlaceholder')}
            />
          </label>
          <button className="button button--dark submit-button" type="submit">
            {t('sendInquiry')}
            <Icon name="arrow" size={16} />
          </button>
          <p className="form-note inquiry-status" role="status" aria-live="polite">
            {status}
          </p>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <BrandMark />
            <div>
              <strong>{t('companyName')}</strong>
              <p>{t('footerTagline')}</p>
            </div>
          </div>
          <nav className="footer__links" aria-label={t('footerNav')}>
            <AppLink href="/">{t('home')}</AppLink>
            <AppLink href="/dashboard">{t('dashboard')}</AppLink>
            <AppLink href="/#services">{t('footerServices')}</AppLink>
            <AppLink href="/#contact">{t('footerContact')}</AppLink>
          </nav>
          <div className="footer__contact">
            <a href="tel:+203227552330">{t('phone')}</a>
            <a href="https://www.ifarm.com" target="_blank" rel="noopener noreferrer">
              {t('website')}
            </a>
          </div>
        </div>
        <div className="footer__bottom">
          <span>{t('companyName')}</span>
          <span>{t('copyright')}</span>
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <>
      <Navbar active="home" />
      <main>
        <Hero />
        <CommitmentStrip />
        <AboutSection />
        <ServicesSection />
        <ConsultationFeature />
        <SmartSystemSection />
        <StepsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

function DashboardWelcomePage() {
  const { t } = useI18n();
  const [interestStatus, setInterestStatus] = useState('');
  const [emailError, setEmailError] = useState<CopyKey | null>(null);
  function handleInterest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const emailValue = new FormData(event.currentTarget).get('email');
    const email = typeof emailValue === 'string' ? emailValue.trim() : '';
    if (!email) {
      setEmailError('emailRequired');
      setInterestStatus('');
      return;
    }
    if (!isValidEmail(email)) {
      setEmailError('emailInvalid');
      setInterestStatus('');
      return;
    }
    setEmailError(null);
    setInterestStatus(t('interestNotConnected'));
  }
  return (
    <>
      <div className="dashboard-page">
        <Navbar active="dashboard" />
        <main className="dashboard-welcome">
          <section className="dashboard-hero">
            <img
              className="dashboard-hero__background"
              src="/assets/dashboard-hero-background.webp"
              srcSet="/assets/dashboard-hero-background-960.webp 960w, /assets/dashboard-hero-background.webp 1672w"
              sizes="100vw"
              width="1672"
              height="941"
              fetchPriority="high"
              decoding="async"
              alt=""
              aria-hidden="true"
            />
            <div className="dashboard-hero__shade" />
            <div className="wrap dashboard-hero__content">
              <div className="dashboard-hero__copy">
                <SectionLabel variant="dark" className="dashboard-hero__eyebrow">
                  {t('welcomeEyebrow')}
                </SectionLabel>
                <h1>
                  <span>{t('dashboardHeroLine1')}</span>
                  <span>{t('dashboardHeroLine2')}</span>
                  <span className="is-highlighted">{t('dashboardHeroLine3')}</span>
                </h1>
                <p>{t('dashboardHeroText')}</p>
              </div>
              <DashboardPreview />
            </div>
            <span className="dashboard-hero__ground" aria-hidden="true" />
          </section>
          <section className="existing-section section-pad dashboard-client-section">
            <div className="wrap existing-card dashboard-client-card">
              <div className="dashboard-client__copy">
                <SectionLabel className="dashboard-client__badge">
                  {t('existingLabel')}
                </SectionLabel>
                <h2>{t('existingTitle')}</h2>
                <p>{t('existingText')}</p>
              </div>
              <Button
                href="/dashboard/login"
                variant="lime"
                className="sign-in-cta dashboard-client__button"
              >
                {t('clientSignIn')}
              </Button>
            </div>
          </section>
          <section className="dashboard-interest section-pad" id="interested">
            <div className="wrap dashboard-interest__card">
              <div className="dashboard-interest__copy">
                <SectionLabel variant="dark" className="dashboard-interest__badge">
                  {t('interestedLabel')}
                </SectionLabel>
                <h2>{t('interestedTitle')}</h2>
                <p>{t('interestedText')}</p>
              </div>
              <form
                className="interest-form dashboard-interest__form"
                noValidate
                onSubmit={handleInterest}
              >
                <label htmlFor="interest-email">{t('emailLabel')}</label>
                <div className="interest-form__row">
                  <span className="dashboard-interest__input">
                    <Icon name="mail" size={20} />
                    <input
                      id="interest-email"
                      name="email"
                      type="email"
                      dir="ltr"
                      autoComplete="email"
                      placeholder={t('emailPlaceholder')}
                      aria-invalid={Boolean(emailError)}
                      aria-describedby={emailError ? 'interest-email-error' : undefined}
                      required
                      onChange={() => {
                        setEmailError(null);
                        setInterestStatus('');
                      }}
                    />
                  </span>
                  <button className="button button--dark" type="submit">
                    {t('joinInterest')}
                    <Icon name="arrow" size={16} />
                  </button>
                </div>
                {emailError && (
                  <p className="form-note interest-error" id="interest-email-error" role="alert">
                    {t(emailError)}
                  </p>
                )}
                <p
                  className="form-note dashboard-interest__status"
                  role="status"
                  aria-live="polite"
                >
                  {interestStatus}
                </p>
              </form>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}

function ComingSoonPage({ feature }: { feature: 'store' | 'ai' }) {
  const { t } = useI18n();
  return (
    <>
      <Navbar active={feature} />
      <main className="placeholder-page">
        <section className="placeholder-card" aria-labelledby="coming-soon-title">
          <SectionLabel>{t(feature)}</SectionLabel>
          <h1 id="coming-soon-title">
            {t(feature)} · {t('comingSoonTitle')}
          </h1>
          <p>{t('comingSoonText')}</p>
          <Button href="/" variant="dark" arrow={false}>
            {t('backHome')}
          </Button>
        </section>
      </main>
      <Footer />
    </>
  );
}

type LoginFieldName = 'username' | 'password' | 'accountId';
function ClientLoginPage() {
  const { t } = useI18n();
  const [values, setValues] = useState<Record<LoginFieldName, string>>({
    username: '',
    password: '',
    accountId: '',
  });
  const [errors, setErrors] = useState<Partial<Record<LoginFieldName, CopyKey | undefined>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [status, setStatus] = useState('');

  function validateField(field: LoginFieldName, value: string): CopyKey | undefined {
    if (field === 'password' ? value.length === 0 : !value.trim()) {
      if (field === 'username') return 'usernameRequired';
      if (field === 'password') return 'passwordRequired';
      return 'accountIdRequired';
    }
    if (field === 'accountId' && /\s/.test(value.trim())) return 'accountIdInvalid';
    return undefined;
  }

  function handleChange(field: LoginFieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus('');
    if (submitted) setErrors((current) => ({ ...current, [field]: validateField(field, value) }));
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors: Partial<Record<LoginFieldName, CopyKey | undefined>> = {
      username: validateField('username', values.username),
      password: validateField('password', values.password),
      accountId: validateField('accountId', values.accountId),
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) {
      setStatus('');
      return;
    }
    setStatus(t('loginNotConnected'));
  }

  function renderFieldError(field: LoginFieldName) {
    const key = errors[field];
    return key ? (
      <span className="login-field__error" id={`login-${field}-error`}>
        {t(key)}
      </span>
    ) : null;
  }

  return (
    <div className="login-route">
      <Navbar login />
      <main className="login-screen">
        <div className="login-botanical login-botanical--one" aria-hidden="true" />
        <div className="login-botanical login-botanical--two" aria-hidden="true" />
        <div className="login-botanical login-botanical--three" aria-hidden="true" />
        <section className="login-card" aria-labelledby="login-title">
          <div className="login-brandline">
            <span className="login-brandline__mark">
              <Icon name="leaf" size={19} />
            </span>
            <span>{t('smartSystem')}</span>
          </div>
          <h1 id="login-title">{t('loginHeading')}</h1>
          <p className="login-card__subtitle">{t('loginSubtitle')}</p>
          <form className="login-form" noValidate onSubmit={handleLogin}>
            <div className="login-field">
              <label className="login-field__label" htmlFor="login-username">
                {t('username')}{' '}
                <span className="required-mark" aria-hidden="true">
                  *
                </span>
              </label>
              <span className={`login-field__control ${errors.username ? 'has-error' : ''}`}>
                <Icon name="user" size={18} />
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder={t('usernamePlaceholder')}
                  value={values.username}
                  aria-invalid={Boolean(errors.username)}
                  aria-describedby={errors.username ? 'login-username-error' : undefined}
                  required
                  onChange={(event) => {
                    handleChange('username', event.target.value);
                  }}
                />
              </span>
              {renderFieldError('username')}
            </div>
            <div className="login-field">
              <label className="login-field__label" htmlFor="login-password">
                {t('password')}{' '}
                <span className="required-mark" aria-hidden="true">
                  *
                </span>
              </label>
              <span className={`login-field__control ${errors.password ? 'has-error' : ''}`}>
                <Icon name="lock" size={18} />
                <input
                  id="login-password"
                  name="password"
                  type={passwordVisible ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder={t('passwordPlaceholder')}
                  value={values.password}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'login-password-error' : undefined}
                  required
                  onChange={(event) => {
                    handleChange('password', event.target.value);
                  }}
                />
                <button
                  className="password-toggle"
                  type="button"
                  aria-label={passwordVisible ? t('hidePassword') : t('showPassword')}
                  aria-pressed={passwordVisible}
                  onClick={() => {
                    setPasswordVisible((visible) => !visible);
                  }}
                >
                  <Icon name={passwordVisible ? 'eyeOff' : 'eye'} size={18} />
                </button>
              </span>
              {renderFieldError('password')}
            </div>
            <div className="login-field">
              <label className="login-field__label" htmlFor="login-account-id">
                {t('accountId')}{' '}
                <span className="required-mark" aria-hidden="true">
                  *
                </span>
              </label>
              <span className={`login-field__control ${errors.accountId ? 'has-error' : ''}`}>
                <Icon name="id" size={18} />
                <input
                  id="login-account-id"
                  name="accountId"
                  type="text"
                  autoComplete="off"
                  placeholder={t('accountIdPlaceholder')}
                  value={values.accountId}
                  aria-invalid={Boolean(errors.accountId)}
                  aria-describedby={errors.accountId ? 'login-accountId-error' : undefined}
                  required
                  onChange={(event) => {
                    handleChange('accountId', event.target.value);
                  }}
                />
              </span>
              {renderFieldError('accountId')}
            </div>
            <button className="button button--dark login-submit" type="submit">
              {t('signIn')}
              <Icon name="arrow" size={16} />
            </button>
            <p
              className={`login-form__status ${status ? 'is-visible' : ''}`}
              role="status"
              aria-live="polite"
            >
              {status}
            </p>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [locale, setLocaleState] = useState<Locale>(readSavedLocale);
  const [route, setRoute] = useState(() => window.location.pathname.replace(/\/$/, '') || '/');
  const routeScrollMode = useRef<'top' | 'hash' | 'restore' | null>(null);
  const t = (key: CopyKey) => copy[locale][key];
  const setLocale = (next: Locale) => {
    setLocaleState(next);
  };
  const navigate = (to: string) => {
    const destination = new URL(to, window.location.href);
    if (destination.origin !== window.location.origin) return;
    const nextRoute = destination.pathname.replace(/\/$/, '') || '/';
    const nextUrl = `${destination.pathname}${destination.search}${destination.hash}`;
    if (nextUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`)
      window.history.pushState(null, '', nextUrl);
    if (nextRoute === route) {
      const target = destination.hash
        ? document.getElementById(decodeHash(destination.hash.slice(1)))
        : null;
      if (target)
        target.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        });
      else if (!destination.hash) window.scrollTo({ top: 0, behavior: 'auto' });
      return;
    }
    routeScrollMode.current = destination.hash ? 'hash' : 'top';
    setRoute(nextRoute);
  };
  const value = { locale, setLocale, t, navigate };

  useEffect(() => {
    const onPopState = () => {
      routeScrollMode.current = 'restore';
      setRoute(window.location.pathname.replace(/\/$/, '') || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  useEffect(() => {
    saveLocale(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.title =
      route === '/dashboard/login'
        ? `${t('clientSignIn')} · iFarm`
        : route === '/dashboard'
          ? `${t('dashboard')} · iFarm`
          : route === '/store'
            ? `${t('store')} · iFarm`
            : route === '/ai'
              ? `${t('ai')} · iFarm`
              : 'iFarm — Agricultural Development';
  }, [locale, route]);

  useEffect(() => {
    const mode = routeScrollMode.current ?? 'top';
    routeScrollMode.current = null;
    if (mode === 'restore') return;
    if (mode === 'hash' && window.location.hash) {
      requestAnimationFrame(() =>
        document.getElementById(decodeHash(window.location.hash.slice(1)))?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        }),
      );
    } else if (mode === 'top') window.scrollTo({ top: 0, behavior: 'auto' });
  }, [route]);

  return (
    <I18nContext.Provider value={value}>
      <div
        className={`app-shell locale-${locale}`}
        lang={locale}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="page-transition" key={route}>
          {route === '/dashboard/login' ? (
            <ClientLoginPage />
          ) : route === '/dashboard' ? (
            <DashboardWelcomePage />
          ) : route === '/store' ? (
            <ComingSoonPage feature="store" />
          ) : route === '/ai' ? (
            <ComingSoonPage feature="ai" />
          ) : (
            <HomePage />
          )}
        </div>
      </div>
    </I18nContext.Provider>
  );
}
