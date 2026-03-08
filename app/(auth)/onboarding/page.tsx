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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkRef = React.useRef(false);

  useEffect(() => {
    if (authLoading || isSubmitting || checkRef.current) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const checkOnboarding = async () => {
      try {
        checkRef.current = true;
        const profile = await getUserProfile(user.id);

        if (profile?.onboarding_completed) {
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('[Onboarding] Error checking profile:', err);
        checkRef.current = false; // Reset on error to allow retry
      } finally {
        setLoading(false);
      }
    };
    checkOnboarding();
  }, [user, authLoading, router, isSubmitting]);

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

      setIsSubmitting(true);
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

      // Update global context profile before redirecting
      // Note: We'll use window.location.assign as before for a full refresh
      // but refreshing the context is a good safety measure if we ever change to router.push
      window.location.assign('/dashboard');
    } catch (error: unknown) {
      setIsSubmitting(false);
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error saving onboarding data:', message);
      toast({
        variant: "destructive",
        title: "Gagal Menyimpan Data",
        description: message || "Terjadi kesalahan saat menyimpan data. Silakan coba lagi.",
      });
    }
  };

  if (loading || isSubmitting) {
     return (
       <div className="min-h-screen bg-[#F2F4F6] flex flex-col items-center justify-center p-6 text-center">
         <div className="w-full max-w-lg bg-white rounded-[40px] p-8 shadow-sm space-y-6">
           <div className="space-y-4">
             <div className="w-16 h-16 border-4 border-cerulean border-t-transparent rounded-full animate-spin mx-auto mb-4" />
             <h2 className="text-2xl font-bold text-slate-900">
               {isSubmitting ? 'Menyimpan Profil...' : 'Menyiapkan Onboarding...'}
             </h2>
             <p className="text-slate-500">
               {isSubmitting ? 'Harap tunggu sebentar, kami sedang menyiapkan dashboard Anda.' : 'Memeriksa status akun Anda.'}
             </p>
           </div>
           
           <div className="space-y-4 pt-4 border-t border-slate-100">
             <Skeleton className="h-12 w-full rounded-2xl" />
             <div className="grid grid-cols-2 gap-4">
               <Skeleton className="h-12 w-full rounded-2xl" />
               <Skeleton className="h-12 w-full rounded-2xl" />
             </div>
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
