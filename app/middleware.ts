// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value ||
    request.headers.get('Authorization')?.split(' ')[1]

  const { pathname } = request.nextUrl

  // Rutas protegidas
  const protectedRoutes = ['/dashboard', '/profile']

  // Rutas públicas
  const publicRoutes = ['/login', '/register']

  // Si no hay token y está intentando acceder a una ruta protegida
  if (!token && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si hay token y está intentando acceder a una ruta pública
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}