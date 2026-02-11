'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingForm } from '@/components/education/OnboardingForm';
import { createClient } from '@/lib/supabase/client';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { format } from 'date-fns';

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();

        if (profile?.onboarding_completed) {
          router.push('/dashboard');
        }
      } finally {
        setLoading(false);
      }
    };
    checkOnboarding();
  }, [router, supabase]);

  const handleComplete = async (data: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not found');

      const { error } = await supabase
        .from('profiles')
        .update({
          status: data.status,
          pregnancy_month: data.pregnancyMonth,
          pregnancy_week: data.pregnancyWeek,
          due_date: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : null,
          current_weight: data.weight,
          height: data.height,
          child_name: data.childName,
          child_birth_date: data.childBirthDate ? format(data.childBirthDate, 'yyyy-MM-dd') : null,
          child_weight: data.childWeight,
          child_height: data.childHeight,
          current_day: data.currentDay,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      console.error('Error saving onboarding data:', error.message);
      alert('Gagal menyimpan data. Silakan coba lagi.');
    }
  };

  if (loading) {
     return <LoadingScreen message="Menyiapkan Onboarding..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <OnboardingForm onComplete={handleComplete} />
    </div>
  );
}
