import { useEffect, useState } from 'react';
import logo from './assets/logo.png';

const SPLASH_DURATION = 3 * 1000; // 3 seconds

interface SplashProviderProps {
  children: React.ReactNode;
}
/**
 * This will play only once when the app is first opened.
 * Good place to put developer and/or publisher logos.
 */
export const SplashProvider = ({ children }: SplashProviderProps) => {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsSplashVisible(false), SPLASH_DURATION);
    return () => clearTimeout(timeout);
  }, []);

  if (!isSplashVisible) return children;

  return (
    <div className="fullscreen-center">
      <img src={logo} className="h-40 w-auto mb-15" />
      <h1 className="text-5xl font-pixel text-primary">iamandrew.io games</h1>
    </div>
  );
};
