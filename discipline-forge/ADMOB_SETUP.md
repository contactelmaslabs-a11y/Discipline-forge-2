# AdMob Setup Guide for Discipline Forge

This app includes AdMob integration for monetization. Follow these steps to enable ads:

## 1. Create an AdMob Account

1. Go to [Google AdMob](https://admob.google.com)
2. Sign in with your Google account
3. Create a new app if you haven't already
4. Accept the AdMob policies

## 2. Get Your Ad Unit IDs

### For Banner Ads:
1. In AdMob console, navigate to **Apps** → Your App
2. Click **Ad units** → **Create new ad unit**
3. Select **Banner** as the ad format
4. Copy the **Ad unit ID** (format: `ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx`)

### For Rewarded Video Ads:
1. Create another ad unit with **Rewarded** format
2. Copy the **Ad unit ID**

## 3. Update Configuration

Edit `client/src/lib/admob.ts` and replace:

```typescript
const ADMOB_CONFIG = {
  bannerAdUnitId: 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx', // Your Banner Ad Unit ID
  rewardedAdUnitId: 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx', // Your Rewarded Ad Unit ID
};
```

## 4. Update Publisher ID

Edit `client/index.html` and replace `ca-app-pub-xxxxxxxxxxxxxxxx` with your **Google Publisher ID** (found in AdMob settings):

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-app-pub-xxxxxxxxxxxxxxxx" crossorigin="anonymous"></script>
```

## 5. Test Mode

To test ads before going live:

1. Add test device IDs in AdMob console
2. Or use the test ad unit IDs (provided by AdMob in the help section)

## Features Implemented

### Banner Ads
- Placed on profile and stats pages
- Auto-load and display ads from AdMob network
- Responsive and mobile-optimized

### Rewarded Video Ads
- **Watch Ad to Revive** button: Allow users to watch a short video to revive a missed task
- Users get bonus discipline points (+10) for watching
- Access via the ReviveTaskModal component

## Revenue Features

The app includes:
- **Rewarded ads** for task revival (primary revenue)
- **Banner ads** throughout the app
- **Monetization potential** for premium features in future releases

## Important Notes

- **Test thoroughly** before going live with real ad unit IDs
- **Follow AdMob policies** to avoid account suspension
- Invalid traffic, click fraud, or policy violations will result in account termination
- Monitor your earnings in the AdMob console

## Troubleshooting

**Ads not showing:**
1. Verify your Ad Unit IDs are correct
2. Check that your Publisher ID is correct in the script tag
3. Wait 30+ minutes for new ad units to be activated
4. Check AdMob console for any policy violations

**Rewarded ad not working:**
1. Ensure rewarded video unit is properly configured
2. Check browser console for errors
3. Test in incognito mode to clear cache

For more help, visit [Google AdMob Help](https://support.google.com/admob)
