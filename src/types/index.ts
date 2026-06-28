export interface Profile {
  name: string;
}

export interface Settings {
  hc: boolean;
  fz: 'normal' | 'lg' | 'xl';
  theme: 'light' | 'dark';
}

export interface AppStateShape {
  settings: Settings;
  profile: Profile;
  sparkDate: string | null;
}
