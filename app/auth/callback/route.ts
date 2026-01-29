import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies() // Next.js 15 bắt buộc phải await cái này

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Bỏ qua lỗi nếu gọi từ Server Component, nhưng ở Route Handler này thì nó sẽ chạy tốt.
            }
          },
        },
      }
    )
    
    // Đổi code lấy session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Thành công -> Redirect về Home
      // Quan trọng: Check môi trường để redirect đúng
      const forwardedHost = request.headers.get('x-forwarded-host') 
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Nếu lỗi -> Chuyển sang trang báo lỗi
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}