'use client';

import dynamic from 'next/dynamic';

// Dynamically import the CareerPathTree component with no SSR
const CareerPathTree = dynamic(() => import('@/pages/CareerPathTree'), {
  ssr: false,
});

export default function CareerTreePage() {
  return <CareerPathTree />;
} 