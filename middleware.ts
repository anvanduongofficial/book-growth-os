import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Gọi hàm updateSession chúng ta vừa tạo ở Bước 1
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Chạy middleware trên tất cả các đường dẫn TRỪ:
     * - _next/static (file tĩnh hệ thống)
     * - _next/image (file ảnh tối ưu)
     * - favicon.ico
     * - các file ảnh đuôi .svg, .png, .jpg...
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}