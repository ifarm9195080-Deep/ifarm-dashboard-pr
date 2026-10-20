export { ar } from './ar';
export { en } from './en';

export type Locale = 'en' | 'ar';
export type CopyKey = keyof typeof import('./en').en;
