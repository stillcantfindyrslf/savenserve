import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const token_hash = searchParams.get('token_hash');
	const type = searchParams.get('type') as EmailOtpType | null;
	const next = searchParams.get('next') ?? '/'; // Путь по умолчанию - главная страница

	if (token_hash && type) {
		const supabase = await createClient();

		// Проверяем OTP
		const { error } = await supabase.auth.verifyOtp({
			type,
			token_hash,
		});

		if (!error) {
			// Перенаправляем пользователя на указанный путь или на главную страницу
			return redirect(next);
		} else {
			console.error('Error verifying OTP:', error.message);
		}
	}

	// Если произошла ошибка верификации, перенаправляем на главную страницу
	return redirect('/');
}
