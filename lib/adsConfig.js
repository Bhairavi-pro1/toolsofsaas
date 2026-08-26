/**
 * Global Advertising Configuration
 * 
 * Directly control whether ads (banners, sidebars, third-party ad scripts) are displayed across the site.
 * 
 * 🟢 Set `enabled: true`  -> to show all ads and load ad scripts.
 * 🔴 Set `enabled: false` -> to hide all ads and stop ad scripts completely.
 */

export const ADS_CONFIG = {
  // Master toggle: change to true when your site is verified for ads
  enabled: false,

  // Google AdSense Client ID for verification & serving (e.g., 'ca-pub-xxxxxxxxxxxxxxxx')
  adsenseClientId: '',

  // Adcash Zone IDs
  adcash: {
    bannerZoneId: '11767574',
    sidebarZoneId: '11767662',
  },
};

export const areAdsEnabled = () => ADS_CONFIG.enabled;

