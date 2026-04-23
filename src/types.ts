export interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl: string;
  beds: number;
  baths: number;
  area: number;
  type: string;
  status: string;
}

export type ViewMode = 'public' | 'settings';

export interface SiteSettings {
  contactPhone: string;
  consultantPhone: string;
}

export interface Promotion {
  id: string;
  title: string;
  detail: string;
  image: string;
}

export type SettingsTab = 'profile' | 'history' | 'favorites' | 'purchases' | 'interface' | 'admin';
