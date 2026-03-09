'use client';

import React from 'react';
import { Header } from '@/app/components/organisms/Header';
import { TrainingRedesignPrototype } from '@/app/components/training/TrainingRedesignPrototype';

export default function TrainingWireframePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <TrainingRedesignPrototype />
    </div>
  );
}

