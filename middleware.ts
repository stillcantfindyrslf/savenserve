import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
	const response = await updateSession(request)

	const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
	const isFavoritesPath = request.nextUrl.pathname.startsWith('/category/favorites');
	const isProfilePath = request.nextUrl.pathname.startsWith('/profile');
	const isCartPath = request.nextUrl.pathname.startsWith('/cart');


	if (!isAdminPath && !isFavoritesPath && !isProfilePath && !isCartPath) {
		return response;
	}

	const supabase = createClient(request);

	const { data: { session } } = await supabase.auth.getSession();

	if (!session) {
		const redirectUrl = new URL('/', request.url);
		return NextResponse.redirect(redirectUrl);
	}

	if (isFavoritesPath || isProfilePath || isCartPath) {
		return response;
	}

	const { data: userProfile, error } = await supabase
		.from('user_profiles')
		.select('role')
		.eq('id', session.user.id)
		.single();

	if (error || !userProfile || userProfile.role !== 'ADMIN') {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		'/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
		'/admin/:path*',
		'/category/favorites/:path*',
		'/profile',
		'/cart',
	],
}