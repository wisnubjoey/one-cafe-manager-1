"use client";

import React, { useState, useEffect } from 'react';
import { MobileView } from './mobile-view';
import { DesktopView } from './desktop-view';

export function ResponsiveWrapper() {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Return null or a skeleton on first render if we want to avoid hydration mismatch,
  // but for simplicity we'll just render mobile as default during SSR.
  return isMobile ? <MobileView /> : <DesktopView />;
}
