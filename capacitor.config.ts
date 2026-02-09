import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.taj.store',
  appName: 'TAJ Store',
  webDir: 'dist',
  server: {
    url: 'https://tajmedicalstore.netlify.app/',
    cleartext: true
  }
};

export default config;
