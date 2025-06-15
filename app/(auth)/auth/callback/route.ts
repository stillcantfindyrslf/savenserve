import { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (!code) {
    return redirect('/');
  }

  const supabase = await createClient();

  try {
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      return redirect('/');
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      return redirect('/');
    } else {
      return redirect('/');
    }
  } catch {
    return redirect('/');
  }
}