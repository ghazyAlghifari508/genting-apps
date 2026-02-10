'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingForm } from '@/components/education/OnboardingForm';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Optional: Check if already completed and redirect back?
    // For now, let them re-onboard if they access this page manually.
  }, []);

  const handleComplete = () => {
    router.push('/education');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
       <div className="p-6">
         <Button 
            variant="ghost" 
            onClick={() => router.push('/education')}
            className="gap-2 text-slate-500 hover:text-slate-900"
         >
            <ArrowLeft className="w-4 h-4" /> Kembali tanpa setup
         </Button>
       </div>
       <div className="flex-1 flex items-center justify-center p-4">
          <OnboardingForm onComplete={handleComplete} />
       </div>
    </div>
  );
}
