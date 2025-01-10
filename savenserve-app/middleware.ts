import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
	const publicPaths = ['/auth/login', '/auth/signup', '/auth/confirm']; // Публичные маршруты, доступные без авторизации
	const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));

	if (isPublicPath) {
		// Разрешаем доступ к публичным страницам
		return NextResponse.next();
	}

	// Проверяем и обновляем сессию для всех остальных запросов
	return await updateSession(request);
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - Публичные страницы (login, signup, confirm)
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
};