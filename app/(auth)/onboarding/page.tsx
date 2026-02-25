'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingForm, type OnboardingFormData } from '@/components/user/education/OnboardingForm';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { upsertUserProfile, getUserProfile } from '@/services/userService';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const checkOnboarding = async () => {
      try {
        const profile = await getUserProfile(user.id);

        if (profile?.onboarding_completed) {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('[Onboarding] Error checking profile:', err);
      } finally {
        setLoading(false);
      }
    };
    checkOnboarding();
  }, [user, authLoading, router]);

  const handleComplete = async (data: OnboardingFormData) => {
    try {
      if (!user) {
        toast({
          variant: "destructive",
          title: "Sesi Habis",
          description: "Silakan login kembali.",
        });
        router.push('/login');
        return;
      }

      // Basic validation check before service call
      if (!data.status) {
        toast({
          variant: "destructive",
          title: "Data Tidak Lengkap",
          description: "Harap isi semua informasi yang diperlukan.",
        });
        return;
      }

      await upsertUserProfile({
        id: user.id,
        status: data.status,
        pregnancy_month: data.pregnancyMonth,
        pregnancy_week: data.pregnancyWeek,
        due_date: data.dueDate ? format(data.dueDate, 'yyyy-MM-dd') : undefined,
        current_weight: data.weight,
        height: data.height,
        child_name: data.childName,
        child_birth_date: data.childBirthDate ? format(data.childBirthDate, 'yyyy-MM-dd') : undefined,
        child_weight: data.childWeight,
        child_height: data.childHeight,
        current_day: data.currentDay,
        onboarding_completed: true,
      });

      toast({
        title: "Onboarding Berhasil",
        description: "Data Anda telah disimpan. Selamat datang di Genting!",
      });

      router.push('/dashboard');
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error saving onboarding data:', message);
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan Data",
        description: message || "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
      });
    }
  };

  if (loading) {
     return (
       <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center p-6">
         <div className="w-full max-w-lg bg-white rounded-[40px] p-8 shadow-sm space-y-6">
           <div className="space-y-2 text-center">
             <Skeleton className="h-4 w-32 mx-auto rounded-full" />
             <Skeleton className="h-10 w-64 mx-auto rounded-xl" />
             <Skeleton className="h-4 w-full rounded-full" />
           </div>
           <div className="space-y-4">
             <Skeleton className="h-12 w-full rounded-2xl" />
             <div className="grid grid-cols-2 gap-4">
               <Skeleton className="h-12 w-full rounded-2xl" />
               <Skeleton className="h-12 w-full rounded-2xl" />
             </div>
             <Skeleton className="h-32 w-full rounded-2xl" />
             <Skeleton className="h-12 w-full rounded-2xl bg-blue-100" />
           </div>
         </div>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-[#F2F4F6] flex items-center justify-center p-6">
      <OnboardingForm onComplete={handleComplete} />
    </div>
  );
}
