// AdMob configuration and utilities
// Note: Replace with your actual AdMob IDs in production

const ADMOB_CONFIG = {
  // Banner ad unit IDs (replace with your actual IDs)
  bannerAdUnitId: 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx',
  
  // Rewarded video ad unit ID
  rewardedAdUnitId: 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx',
};

export interface RewardedAdCallback {
  onRewardEarned?: () => void;
  onAdClosed?: () => void;
  onAdError?: (error: Error) => void;
}

// Load Google Mobile Ads SDK
export function loadAdMobSDK() {
  if (typeof window !== 'undefined' && !window.gapi) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.onload = () => {
      console.log('AdMob SDK loaded');
    };
    document.head.appendChild(script);
  }
}

// Display banner ad
export function displayBannerAd(containerId: string) {
  try {
    if (typeof (window as any).adsbygoogle !== 'undefined') {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    }
  } catch (error) {
    console.error('Error displaying banner ad:', error);
  }
}

// Display rewarded video ad with callback
export function displayRewardedAd(callbacks?: RewardedAdCallback) {
  try {
    // In production, use Google Mobile Ads API
    // For now, simulate ad display with a modal
    console.log('Rewarded ad requested');
    
    // Mock ad completion for testing
    setTimeout(() => {
      if (callbacks?.onRewardEarned) {
        callbacks.onRewardEarned();
      }
    }, 3000);
  } catch (error) {
    if (callbacks?.onAdError) {
      callbacks.onAdError(error as Error);
    }
    console.error('Error displaying rewarded ad:', error);
  }
}

export { ADMOB_CONFIG };
