import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/'; // Đăng nhập xong thì về trang chủ

  if (token_hash && type) {
    const cookieStore = {
      getAll() { return [] },
      setAll() {}
    } as any; // Mock cookie store cho route handler đơn giản (hoặc dùng cookies() từ next/headers nếu cần strict)

    // Tạo client server-side tạm thời để trao đổi token
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
            get(name: string) {
                return request.cookies.get(name)?.value
              },
              set(name: string, value: string, options: CookieOptions) {
                request.cookies.set({
                  name,
                  value,
                  ...options,
                })
                // Cập nhật cookie cho response trả về
                cookieStore.setAll([{ name, value, options }]) 
              },
              remove(name: string, options: CookieOptions) {
                request.cookies.set({
                  name,
                  value: '',
                  ...options,
                })
                cookieStore.setAll([{ name, value: '', options }])
              },
        },
      }
    );

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // Đổi token thành công -> Chuyển hướng người dùng về trang đích
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  // Nếu lỗi -> Chuyển về trang lỗi
  return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
}