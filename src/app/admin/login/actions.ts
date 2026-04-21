'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export async function signIn(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    console.log('signIn action started for email:', email);
    const supabase = await createClient();
    console.log('supabase client created successfully');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('signInWithPassword result error:', error);

    if (error) {
      console.log('Redirecting to login with error');
      redirect('/admin/login?message=Giriş başarısız. Bilgileri kontrol edin.');
    }

    console.log('Redirecting to /admin on success');
    redirect('/admin');
  } catch (error) {
    console.error('SERVER ACTION ERROR:', error);
    throw error;
  }
}
