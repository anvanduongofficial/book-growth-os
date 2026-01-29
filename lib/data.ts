import { Book } from "@/types/roadmap";

export const BOOKS: Book[] = [
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    cover: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
    totalDays: 21,
    description: "Xây dựng thói quen tốt và phá bỏ thói quen xấu qua những thay đổi tí hon.",
    roadmap: [
      {
        day_index: 1,
        title: "Quy tắc 1%",
        summary: "Sức mạnh của những thay đổi nhỏ tích lũy theo thời gian.",
        tools: [
          {
            id: "t1",
            type: "checklist",
            title: "Thiết lập môi trường",
            description: "Hãy làm cho thói quen tốt trở nên dễ dàng nhìn thấy.",
            items: [
              { id: "c1", label: "Tôi đã đặt cuốn sách ở đầu giường." },
              { id: "c2", label: "Tôi đã để giày chạy bộ ngay cửa ra vào." }
            ]
          }
        ]
      },
      {
        day_index: 2,
        title: "Vùng thất vọng",
        summary: "Kết quả thường đến chậm hơn bạn nghĩ. Đừng bỏ cuộc sớm.",
        tools: [] // Ngày 2 chưa có tool, sẽ bị khóa trong logic sau này
      }
    ]
  },
  {
    id: "psychology-of-money",
    title: "Tâm lý học về tiền",
    author: "Morgan Housel",
    cover: "https://images-na.ssl-images-amazon.com/images/I/81Dky+tD+pL.jpg",
    totalDays: 14,
    description: "Góc nhìn về tiền bạc không qua lăng kính con số mà qua cảm xúc con người.",
    roadmap: [
      {
        day_index: 1,
        title: "Không ai điên cả",
        summary: "Trải nghiệm cá nhân quyết định tư duy tài chính.",
        tools: [
          {
            id: "cal1",
            type: "calculator",
            title: "Máy tính Tự do Tài chính",
            description: "Tính toán số tiền bạn cần để nghỉ hưu sớm.",
            config: {
              input_label: "Chi tiêu hàng tháng",
              result_label: "Số tiền cần có (Quy tắc 4%)",
              suffix: "VNĐ"
            }
          }
        ]
      }
    ]
  }
];