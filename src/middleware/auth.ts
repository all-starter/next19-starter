import { createClient } from '@/utils/supbase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * 受保护的路由列表
 * 这些路由需要用户登录才能访问
 */
const PROTECTED_ROUTES = ['/profile', '/settings', '/dashboard']

/**
 * 公开路由列表
 * 这些路由在用户已登录时应该重定向到主页
 */
const PUBLIC_ROUTES = ['/login', '/register']

/**
 * 认证中间件
 * 检查用户认证状态并处理路由保护
 */
export async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 创建服务端 Supabase 客户端
  const supabase = await createClient()

  try {
    // 获取用户会话
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    const isAuthenticated = !error && !!session?.user
    const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route)
    )
    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
      pathname.startsWith(route)
    )

    // 如果是受保护的路由但用户未登录，重定向到登录页
    if (isProtectedRoute && !isAuthenticated) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // 如果是公开路由但用户已登录，重定向到主页
    if (isPublicRoute && isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('认证中间件错误:', error)
    // 发生错误时，对于受保护的路由重定向到登录页
    if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }
}

/**
 * 检查路径是否需要认证中间件处理
 */
export function shouldRunAuthMiddleware(pathname: string): boolean {
  // 排除静态文件和 API 路由
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return false
  }

  // 检查是否是需要处理的路由
  return (
    PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) ||
    PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
  )
}
