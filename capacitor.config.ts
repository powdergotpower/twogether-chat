import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.anshnoah.chat', // ✅ valid package name
  appName: 'Calculator',
  webDir: 'dist',
  bundledWebRuntime: false // optional but recommended
};

export default config;
