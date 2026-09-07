/**
 * Global Advertising Configuration
 * 
 * Directly control whether ads (banners, sidebars, third-party ad scripts) are displayed across the site.
 * 
 * 🟢 Set `enabled: true`  -> to show all ads and load ad scripts.
 * 🔴 Set `enabled: false` -> to hide all ads and stop ad scripts completely.
 */

export const ADS_CONFIG = {
  // Master toggle: set to true to display ads across the site
  enabled: true,

  // Google AdSense Client ID for verification & serving (e.g., 'ca-pub-xxxxxxxxxxxxxxxx')
  adsenseClientId: '',

  // HighRevenueFormat / Adsterra configuration
  highRevenueFormat: {
    skyscraperKey: 'd1720e24b3eaaa5aa2f04f6480f4f69c',   // 160x600 size
    bannerKey: 'e2051dca3c2bb317ee62af29706f4816',       // 728x90 size
    mobileBannerKey: '08c962ba39cc51ed22ba2dd21a43b419', // 320x50 mobile size
  },

  // Adcash Zone IDs
  adcash: {
    bannerZoneId: '11767574',
    sidebarZoneId: '11767662',
  },
};

export const areAdsEnabled = () => ADS_CONFIG.enabled;

