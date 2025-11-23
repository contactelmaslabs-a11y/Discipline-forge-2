import { useEffect } from "react";

interface AdBannerProps {
  dataAdSlot?: string;
  className?: string;
}

export default function AdBanner({ dataAdSlot = "1234567890", className = "" }: AdBannerProps) {
  useEffect(() => {
    // Push ads configuration
    try {
      if (typeof (window as any).adsbygoogle !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Error loading AdSense ad:', error);
    }
  }, [dataAdSlot]);

  return (
    <div className={`ad-banner-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client="ca-app-pub-xxxxxxxxxxxxxxxx"
        data-ad-slot={dataAdSlot}
      />
    </div>
  );
}
