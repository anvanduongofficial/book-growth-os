"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, CheckCircle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import confetti from "canvas-confetti";

// Actions & Components
import { completeDayAction } from "@/app/actions/update-progress";
import { DayHeader } from "@/components/book/DayHeader";
import { LearnSection } from "@/components/book/LearnSection";
import { ActionSection } from "@/components/book/ActionSection";
import { useBookProgress } from "@/hooks/use-book-progress";

// --- DỮ LIỆU SÁCH (Giữ nguyên của bạn) ---
const DATABASE: Record<string, any> = {
  "1": {
    day_index: 1,
    title: "Bạn không thực sự làm chủ cuộc đời mình",
    summary: "Thực tế là bạn chỉ sống theo thói quen.",
    content: "<p><b>1. THE TRAP:</b> Bạn bị cuốn vào vòng xoáy của thói quen mà không nhận ra.</p><p><b>2. THE SHIFT:</b> Sống chủ động, không thụ động.</p><p><b>3. THE PROOF:</b> Nhớ lần bạn bỏ lỡ cơ hội vì sợ hãi.</p><p><b>4. THE MICRO-ACTION:</b> Viết ra 3 điều bạn muốn thay đổi ngay hôm nay.</p>",
    audioUrl: "",
    xp: 50,
    workbook: {
      title: "Thực hành 24h",
      fields: [
        { id: "f1", label: "Câu hỏi buộc người đọc tự thú", placeholder: "Thú nhận đi...", type: "text" },
        { id: "f2", label: "Mệnh lệnh hành động cụ thể", placeholder: "Cam kết...", type: "text" },
        { id: "f3", label: "Thời gian thực hiện?", placeholder: "VD: 21:00", type: "time" }
      ]
    },
    quiz: {
      question: "Bạn có dám đối mặt với sự thật?",
      options: [ "Chọn né tránh và an phận", "Chọn thay đổi và hành động", "Một lựa chọn sai khác" ],
      correctAnswer: 1,
      explanation: "Chỉ có hành động mới thay đổi được số phận."
    },
    gift: { title: "Thông điệp", content: "Cuộc sống không cho bạn cơ hội thứ hai." }
  },
  "2": {
    day_index: 2,
    title: "Bạn chỉ là một nạn nhân của hoàn cảnh",
    summary: "Cảm giác bất lực chỉ khiến bạn yếu đuối hơn.",
    content: "<p><b>1. THE TRAP:</b> Bạn đổ lỗi cho môi trường, không dám nhìn nhận bản thân.</p><p><b>2. THE SHIFT:</b> Chịu trách nhiệm về cuộc sống của mình.</p><p><b>3. THE PROOF:</b> Nhớ lần bạn đổ lỗi cho người khác vì thất bại.</p><p><b>4. THE MICRO-ACTION:</b> Viết ra 3 trách nhiệm bạn cần nhận lấy.</p>",
    audioUrl: "",
    xp: 50,
    workbook: {
      title: "Thực hành 24h",
      fields: [
        { id: "f1", label: "Câu hỏi buộc người đọc tự thú", placeholder: "Thú nhận đi...", type: "text" },
        { id: "f2", label: "Mệnh lệnh hành động cụ thể", placeholder: "Cam kết...", type: "text" },
        { id: "f3", label: "Thời gian thực hiện?", placeholder: "VD: 21:00", type: "time" }
      ]
    },
    quiz: {
      question: "Bạn sẽ chọn cách nào?",
      options: ["Đổ lỗi cho hoàn cảnh", "Chấp nhận và thay đổi", "Một lựa chọn sai khác"],
      correctAnswer: 1,
      explanation: "Chỉ có bạn mới có thể thay đổi số phận của mình."
    },
    gift: { title: "Thông điệp", content: "Chỉ có bạn mới có thể viết nên câu chuyện của mình." }
  },
  "3": {
    day_index: 3,
    title: "Thói quen thụ động giết chết ước mơ",
    summary: "Cứ để mọi thứ trôi qua, bạn sẽ mãi không thành công.",
    content: "<p><b>1. THE TRAP:</b> Bạn ngồi chờ cơ hội đến mà không hành động.</p><p><b>2. THE SHIFT:</b> Hành động là chìa khóa mở cánh cửa thành công.</p><p><b>3. THE PROOF:</b> Bạn đã từng bỏ lỡ cơ hội vì sự do dự.</p><p><b>4. THE MICRO-ACTION:</b> Đặt ra một kế hoạch hành động cho ngày mai.</p>",
    audioUrl: "",
    xp: 50,
    workbook: {
      title: "Thực hành 24h",
      fields: [
        { id: "f1", label: "Câu hỏi buộc người đọc tự thú", placeholder: "Thú nhận đi...", type: "text" },
        { id: "f2", label: "Mệnh lệnh hành động cụ thể", placeholder: "Cam kết...", type: "text" },
        { id: "f3", label: "Thời gian thực hiện?", placeholder: "VD: 21:00", type: "time" }
      ]
    },
    quiz: {
      question: "Bạn sẽ làm gì để không bỏ lỡ cơ hội?",
      options: ["Chờ đợi cơ hội đến", "Hành động ngay lập tức", "Một lựa chọn sai khác"],
      correctAnswer: 1,
      explanation: "Chỉ có hành động mới mang lại kết quả."
    },
    gift: { title: "Thông điệp", content: "Đừng để thời gian trôi đi mà không làm gì." }
  },
  "4": {
    day_index: 4,
    title: "Giả tạo là kẻ thù lớn nhất của bạn",
    summary: "Đừng sống cuộc đời mà người khác mong muốn.",
    content: "<p><b>1. THE TRAP:</b> Bạn sống giả tạo để làm hài lòng người khác.</p><p><b>2. THE SHIFT:</b> Sống thật với chính mình.</p><p><b>3. THE PROOF:</b> Nhớ lần bạn thay đổi bản thân để được chấp nhận.</p><p><b>4. THE MICRO-ACTION:</b> Viết ra 3 điều bạn thực sự muốn làm.</p>",
    audioUrl: "",
    xp: 50,
    workbook: { title: "Thực hành 24h", fields: [
      { id: "f1", label: "Câu hỏi buộc người đọc tự thú", placeholder: "Thú nhận đi...", type: "text" },
      { id: "f2", label: "Mệnh lệnh hành động cụ thể", placeholder: "Cam kết...", type: "text" },
      { id: "f3", label: "Thời gian thực hiện?", placeholder: "VD: 21:00", type: "time" }
    ]},
    quiz: {
      question: "Bạn có dám sống thật không?",
      options: ["Chọn giả tạo để được yêu thương", "Chọn sống thật với bản thân", "Một lựa chọn sai khác"],
      correctAnswer: 1,
      explanation: "Chỉ có sự thật mới mang lại hạnh phúc."
    },
    gift: { title: "Thông điệp", content: "Sống thật là cách duy nhất để sống hạnh phúc." }
  },
  "5": {
    day_index: 5,
    title: "Chỉ có bạn mới có thể cứu rỗi chính mình",
    summary: "Không ai có thể làm thay bạn điều đó.",
    content: "<p><b>1. THE TRAP:</b> Bạn chờ đợi người khác đến để giải cứu.</p><p><b>2. THE SHIFT:</b> Bạn là người duy nhất có thể thay đổi cuộc đời mình.</p><p><b>3. THE PROOF:</b> Nhớ lần bạn phụ thuộc vào người khác và thất bại.</p><p><b>4. THE MICRO-ACTION:</b> Tìm kiếm một cách tự lực để giải quyết vấn đề của bạn.</p>",
    audioUrl: "",
    xp: 50,
    workbook: { title: "Thực hành 24h", fields: [
      { id: "f1", label: "Câu hỏi buộc người đọc tự thú", placeholder: "Thú nhận đi...", type: "text" },
      { id: "f2", label: "Mệnh lệnh hành động cụ thể", placeholder: "Cam kết...", type: "text" },
      { id: "f3", label: "Thời gian thực hiện?", placeholder: "VD: 21:00", type: "time" }
    ]},
    quiz: {
      question: "Bạn có dám đứng lên tự cứu mình?",
      options: ["Chờ đợi người khác đến", "Hành động và giải quyết", "Một lựa chọn sai khác"],
      correctAnswer: 1,
      explanation: "Chỉ có bạn mới là người hùng trong câu chuyện của chính mình."
    },
    gift: { title: "Thông điệp", content: "Mọi điều tốt đẹp bắt đầu từ chính bạn." }
  },
  "6": {
    day_index: 6,
    title: "Sự lười biếng sẽ giết chết bạn",
    summary: "Mỗi phút trôi qua là một cơ hội bị lãng phí.",
    content: "<p><b>1. THE TRAP:</b> Bạn trì hoãn mọi thứ và tự biện minh.</p><p><b>2. THE SHIFT:</b> Hành động ngay lập tức để không bỏ lỡ.</p><p><b>3. THE PROOF:</b> Bạn đã từng hối hận vì đã để mọi thứ trôi qua.</p><p><b>4. THE MICRO-ACTION:</b> Chọn một việc cần làm ngay bây giờ và thực hiện.</p>",
    audioUrl: "",
    xp: 50,
    workbook: { title: "Thực hành 24h", fields: [
      { id: "f1", label: "Câu hỏi buộc người đọc tự thú", placeholder: "Thú nhận đi...", type: "text" },
      { id: "f2", label: "Mệnh lệnh hành động cụ thể", placeholder: "Cam kết...", type: "text" },
      { id: "f3", label: "Thời gian thực hiện?", placeholder: "VD: 21:00", type: "time" }
    ]},
    quiz: {
      question: "Bạn có dám từ bỏ sự lười biếng không?",
      options: ["Tiếp tục lười biếng", "Hành động ngay lập tức", "Một lựa chọn sai khác"],
      correctAnswer: 1,
      explanation: "Hành động là cách duy nhất để thay đổi."
    },
    gift: { title: "Thông điệp", content: "Mỗi giây phút là một cơ hội, đừng lãng phí." }
  },
  "7": {
    day_index: 7,
    title: "Bạn cần đặt mục tiêu rõ ràng",
    summary: "Mù mờ về tương lai chỉ dẫn đến thất bại.",
    content: "<p><b>1. THE TRAP:</b> Bạn sống mà không có mục tiêu cụ thể.</p><p><b>2. THE SHIFT:</b> Mục tiêu rõ ràng là động lực lớn nhất.</p><p><b>3. THE PROOF:</b> Nhớ lần bạn không có mục tiêu và thất bại.</p><p><b>4. THE MICRO-ACTION:</b> Viết ra 3 mục tiêu ngắn hạn và dài hạn.</p>",
    audioUrl: "",
    xp: 50,
    workbook: { title: "Thực hành 24h", fields: [
      { id: "f1", label: "Câu hỏi buộc người đọc tự thú", placeholder: "Thú nhận đi...", type: "text" },
      { id: "f2", label: "Mệnh lệnh hành động cụ thể", placeholder: "Cam kết...", type: "text" },
      { id: "f3", label: "Thời gian thực hiện?", placeholder: "VD: 21:00", type: "time" }
    ]},
    quiz: {
      question: "Bạn có biết mục tiêu của mình không?",
      options: ["Không có mục tiêu", "Có mục tiêu rõ ràng", "Một lựa chọn sai khác"],
      correctAnswer: 1,
      explanation: "Mục tiêu là ánh sáng dẫn đường cho bạn."
    },
    gift: { title: "Thông điệp", content: "Mục tiêu là động lực để sống mỗi ngày." }
  },
  "8": {
    day_index: 8,
    title: "Thói quen không biết nói 'không'",
    summary: "Sự yếu đuối dẫn đến sự kiệt quệ.",
    content: "<p><b>1. THE TRAP:</b> Bạn liên tục nói 'có' dù không muốn.</p><p><b>2. THE SHIFT:</b> Học cách từ chối để bảo vệ bản thân.</p><p><b>3. THE PROOF:</b> Nhớ lần bạn đã nhận quá nhiều và cảm thấy áp lực.</p><p><b>4. THE MICRO-ACTION:</b> Thực hành từ chối một yêu cầu hôm nay.</p>",
    audioUrl: "",
    xp: 50,
    workbook: { title: "Thực hành 24h", fields: [
      { id: "f1", label: "Câu hỏi buộc người đọc tự thú", placeholder: "Thú nhận đi...", type: "text" },
      { id: "f2", label: "Mệnh lệnh hành động cụ thể", placeholder: "Cam kết...", type: "text" },
      { id: "f3", label: "Thời gian thực hiện?", placeholder: "VD: 21:00", type: "time" }
    ]},
    quiz: {
      question: "Bạn có dám nói 'không' không?",
      options: ["Luôn nói 'có'", "Học cách nói 'không'", "Một lựa chọn sai khác"],
      correctAnswer: 1,
      explanation: "Nói 'không' là cách bảo vệ bản thân."
    },
    gift: { title: "Thông điệp", content: "Sự từ chối là sức mạnh chứ không phải yếu đuối." }
  },
  "9": {
    day_index: 9,
    title: "Bạn không kiểm soát thời gian",
    summary: "Thời gian là tài sản quý giá nhất của bạn.",
    content: "<p><b>1. THE TRAP:</b> Bạn để thời gian trôi qua mà không có kế hoạch.</p><p><b>2. THE SHIFT:</b> Quản lý thời gian là quản lý cuộc sống.</p><p><b>3. THE PROOF:</b> Nhớ lần bạn hối hận vì lãng phí thời gian.</p><p><b>4. THE MICRO-ACTION:</b> Lập kế hoạch cho ngày mai trong 5 phút.</p>",
    audioUrl: "",
    xp: 50,
    workbook: { title: "Thực hành 24h", fields: [
      { id: "f1", label: "Câu hỏi buộc người đọc tự thú", placeholder: "Thú nhận đi...", type: "text" },
      { id: "f2", label: "Mệnh lệnh hành động cụ thể", placeholder: "Cam kết...", type: "text" },
      { id: "f3", label: "Thời gian thực hiện?", placeholder: "VD: 21:00", type: "time" }
    ]},
    quiz: {
      question: "Bạn có biết quản lý thời gian không?",
      options: ["Thời gian trôi qua tự do", "Có kế hoạch rõ ràng", "Một lựa chọn sai khác"],
      correctAnswer: 1,
      explanation: "Thời gian là tài sản quý giá nhất của bạn."
    },
    gift: { title: "Thông điệp", content: "Thời gian là thứ bạn không thể lấy lại." }
  },
  "10": {
    day_index: 10,
    title: "Chỉ có bạn mới biết giá trị thật của bản thân",
    summary: "Người khác không thể đánh giá bạn chính xác.",
    content: "<p><b>1. THE TRAP:</b> Bạn để người khác quyết định giá trị của bạn.</p><p><b>2. THE SHIFT:</b> Tự định giá trị bản thân.</p><p><b>3. THE PROOF:</b> Nhớ lần bạn cảm thấy tự ti vì ý kiến người khác.</p><p><b>4. THE MICRO-ACTION:</b> Viết ra 3 điều bạn tự hào về bản thân.</p>",
    audioUrl: "",
    xp: 50,
    workbook: { title: "Thực hành 24h", fields: [
      { id: "f1", label: "Câu hỏi buộc người đọc tự thú", placeholder: "Thú nhận đi...", type: "text" },
      { id: "f2", label: "Mệnh lệnh hành động cụ thể", placeholder: "Cam kết...", type: "text" },
      { id: "f3", label: "Thời gian thực hiện?", placeholder: "VD: 21:00", type: "time" }
    ]},
    quiz: {
      question: "Ai quyết định giá trị của bạn?",
      options: ["Người khác", "Chỉ có tôi", "Một lựa chọn sai khác"],
      correctAnswer: 1,
      explanation: "Chỉ bạn mới có quyền đánh giá bản thân."
    },
    gift: { title: "Thông điệp", content: "Giá trị của bạn không phụ thuộc vào người khác." }
  },
  "11": {
    day_index: 11,
    title: "Thói quen so sánh bản thân với người khác",
    summary: "Chỉ làm bạn cảm thấy thiếu thốn hơn.",
    content: "<p><b>1. THE TRAP:</b> Bạn luôn so sánh mình với người khác.</p><p><b>2. THE SHIFT:</b> Tự hào về bản thân là điều quan trọng nhất.</p><p><b>3. THE PROOF:</b> Nhớ lần bạn cảm thấy tự ti khi so sánh.</p><p><b>4. THE MICRO-ACTION:</b> Viết ra 3 điều làm bạn độc đáo.</p>",
    audioUrl: "",
    xp: 50,
    workbook: { title: "Thực hành 24h", fields: [
      { id: "f1", label: "Câu hỏi buộc người đọc tự thú", placeholder: "Thú nhận đi...", type: "text" },
      { id: "f2", label: "Mệnh lệnh hành động cụ thể", placeholder: "Cam kết...", type: "text" },
      { id: "f3", label: "Thời gian thực hiện?", placeholder: "VD: 21:00", type: "time" }
    ]},
    quiz: {
      question: "Bạn có dám yêu bản thân không?",
      options: ["Chỉ biết so sánh", "Yêu thương bản thân", "Một lựa chọn sai khác"],
      correctAnswer: 1,
      explanation: "Yêu bản thân là khởi đầu của mọi điều tốt đẹp."
    },
    gift: { title: "Thông điệp", content: "Bạn là duy nhất, đừng so sánh với ai khác." }
  },
  "12": {
    day_index: 12,
    title: "Bỏ qua giá trị của sự kiên nhẫn",
    summary: "Kiên nhẫn là đức tính bị đánh giá thấp.",
    content: "<p><b>1. THE TRAP:</b> Bạn muốn mọi thứ ngay lập tức.</p><p><b>2. THE SHIFT:</b> Kiên nhẫn là chìa khóa thành công.</p><p><b>3. THE PROOF:</b> Nhớ lần bạn vội vàng và thất bại.</p><p><b>4. THE MICRO-ACTION:</b> Hãy dành thời gian cho một điều gì đó hôm nay.</p>",
    audioUrl: "",
    xp: 50,
    workbook: { title: "Thực hành 24h", fields: [
      { id: "f1", label: "Câu hỏi buộc người đọc tự thú", placeholder: "Thú nhận đi...", type: "text" },
      { id: "f2", label: "Mệnh lệnh hành động cụ thể", placeholder: "Cam kết...", type: "text" },
      { id: "f3", label: "Thời gian thực hiện?", placeholder: "VD: 21:00", type: "time" }
    ]},
    quiz: {
      question: "Bạn có biết kiên nhẫn là gì không?",
      options: ["Không quan tâm", "Tìm kiếm sự vội vã", "Một lựa chọn sai khác"],
      correctAnswer: 1,
      explanation: "Kiên nhẫn là chìa khóa cho mọi thành công."
    },
    gift: { title: "Thông điệp", content: "Kiên nhẫn sẽ đưa bạn đến thành công." }
  },
  "13": {
    day_index: 13,
    title: "Bạn cần một mạng lưới hỗ trợ",
    summary: "Cô đơn chỉ khiến bạn yếu đuối hơn.",
    content: "<p><b>1. THE TRAP:</b> Bạn nghĩ mình có thể tự mình làm mọi việc.</p><p><b>2. THE SHIFT:</b> Mạng lưới hỗ trợ là sức mạnh của bạn.</p><p><b>3. THE PROOF:</b> Nhớ lần bạn thất bại vì không có ai bên cạnh.</p><p><b>4. THE MICRO-ACTION:</b> Liên hệ với một người bạn để chia sẻ cảm xúc hôm nay.</p>",
    audioUrl: "",
    xp: 50,
    workbook: { title: "Thực hành 24h", fields: [
      { id: "f1", label: "Câu hỏi buộc người đọc tự thú", placeholder: "Thú nhận đi...", type: "text" },
      { id: "f2", label: "Mệnh lệnh hành động cụ thể", placeholder: "Cam kết...", type: "text" },
      { id: "f3", label: "Thời gian thực hiện?", placeholder: "VD: 21:00", type: "time" }
    ]},
    quiz: {
      question: "Bạn có biết tầm quan trọng của mạng lưới hỗ trợ không?",
      options: ["Không cần ai cả", "Có nhưng không sử dụng", "Một lựa chọn sai khác"],
      correctAnswer: 1,
      explanation: "Mạng lưới hỗ trợ là sức mạnh của bạn."
    },
    gift: { title: "Thông điệp", content: "Bạn không đơn độc trong cuộc chiến này." }
  },
  "14": {
    day_index: 14,
    title: "Thành công không phải là đích đến",
    summary: "Thành công là một hành trình, không phải một điểm dừng.",
    content: "<p><b>1. THE TRAP:</b> Bạn nghĩ thành công chỉ là đích đến cuối cùng.</p><p><b>2. THE SHIFT:</b> Đánh giá hành trình hơn là kết quả.</p><p><b>3. THE PROOF:</b> Nhớ lần bạn đạt được điều gì đó nhưng vẫn thấy trống rỗng.</p><p><b>4. THE MICRO-ACTION:</b> Tận hưởng một khoảnh khắc trong hành trình của bạn hôm nay.</p>",
    audioUrl: "",
    xp: 50,
    workbook: { title: "Thực hành 24h", fields: [
      { id: "f1", label: "Câu hỏi buộc người đọc tự thú", placeholder: "Thú nhận đi...", type: "text" },
      { id: "f2", label: "Mệnh lệnh hành động cụ thể", placeholder: "Cam kết...", type: "text" },
      { id: "f3", label: "Thời gian thực hiện?", placeholder: "VD: 21:00", type: "time" }
    ]},
    quiz: {
      question: "Thành công của bạn mang lại điều gì?",
      options: ["Chỉ là một cái đích", "Một hành trình ý nghĩa", "Một lựa chọn sai khác"],
      correctAnswer: 1,
      explanation: "Hành trình mới là điều quan trọng nhất."
    },
    gift: { title: "Thông điệp", content: "Hành trình mới là điều đáng giá hơn cả." }
  }
};

interface PageProps {
  params: Promise<{ id: string; dayIndex: string; }>; // Lưu ý: dayId hay dayIndex phụ thuộc vào tên folder
}

export default function DayPage({ params }: PageProps) {
  const router = useRouter();
  
  // 1. Params & Hooks
  const resolvedParams = use(params);
  const bookId = resolvedParams.id;
  const rawDayId = resolvedParams.dayIndex;
  const currentDayIndex = parseInt(rawDayId, 10);
  
  const data = DATABASE[rawDayId] || DATABASE["1"]; 
  const progress = useBookProgress(bookId, currentDayIndex);

  // 2. States
  const [hasChanges, setHasChanges] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userCurrentDay, setUserCurrentDay] = useState(1);
  const [loading, setLoading] = useState(true);

  // 3. Logic so sánh ngày
  const currentDayNum = Number(currentDayIndex);
  const userDayNum = Number(userCurrentDay);
  const isPast = currentDayNum < userDayNum;    
  const isPresent = currentDayNum === userDayNum; 
  const isFuture = currentDayNum > userDayNum;    

  // 4. Validator
  const isWorkbookCompleted = data.workbook?.fields?.every((field: any) => {
      const answer = progress.workbookAnswers[field.id];
      return answer && answer.trim().length > 0;
  }) ?? true;

  const isQuizCompleted = data.quiz 
      ? (progress.quizState.selected !== null && progress.quizState.isSubmitted === true)
      : true;

  const canFinish = isWorkbookCompleted && isQuizCompleted;

  // 🔥 5. USE EFFECTS (PHẢI ĐẶT Ở ĐÂY - TRƯỚC KHI RETURN) 🔥

  // Effect 1: Điều khiển Auto-save
  useEffect(() => {
      if (isPast) {
          progress.setAutoSaveEnabled(false);
      } else {
          progress.setAutoSaveEnabled(true);
      }
  }, [isPast]); 

  // Effect 2: Fetch Data
  useEffect(() => {
    const init = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        setUserId(user.id);
        
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('current_day')
          .eq('user_id', user.id)
          .eq('book_id', bookId)
          .maybeSingle();
          
          if (!progressData) {
            // Logic Sync Reset
            if (currentDayIndex === 1) {
              console.warn("⚠️ Phát hiện DB trống -> Reset LocalStorage.");
              progress.resetData(); 
              setUserCurrentDay(1);
            } 
          } else {
            setUserCurrentDay(progressData.current_day);
          }
          
        const realDay = progressData ? progressData.current_day : 1;
        if (currentDayIndex > realDay) {
          router.replace(`/book/${bookId}/day/${realDay}`);
          return;
        }

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        setLoading(false); // ✅ Quan trọng: Chạy xong thì tắt loading
      }
    };
    
    // Đợi Hook load xong mới chạy Init
    if (!isNaN(currentDayIndex) && progress.isLoaded) {
        init();
    } else if (isNaN(currentDayIndex)) {
        setLoading(false);
    }
  }, [bookId, currentDayIndex, router, progress.isLoaded]);

  // 6. Handle Wrapper Update
  const handleWorkbookChange = (id: string, value: string) => {
      progress.updateWorkbook(id, value);
      if (isPast) {
          setHasChanges(true);
      }
  };

  // 7. Handle Complete
  const handleComplete = async () => {
    if (!userId) return alert("Bạn cần đăng nhập!");
    if (!canFinish) return alert("Chưa điền đủ thông tin!");

    setIsCompleting(true);

    if (isFuture) return alert("Bạn chưa học tới ngày này!");

    // Nếu là bài cũ -> Lưu thủ công trước
    if (isPast) {
        progress.saveNow(); 
    }

    if (isPresent) {
        const end = Date.now() + 1000;
        const colors = ['#2563EB', '#ffffff'];
        (function frame() {
          confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
          confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
          if (Date.now() < end) requestAnimationFrame(frame);
        }());
    }

    const result = await completeDayAction(bookId, currentDayIndex, userId);
    
    if (result.success) {
        if (isPresent) {
            setTimeout(() => {
                router.push(`/book/${bookId}`); 
                router.refresh(); 
            }, 1500);
        } else {
            setHasChanges(false); 
            setIsCompleting(false);
        }
    } else {
        alert(result.message || "Lỗi lưu tiến độ.");
        setIsCompleting(false);
    }
  };

  // 🔥 8. RENDER UI (BÂY GIỜ MỚI ĐƯỢC PHÉP RETURN) 🔥
  
  if (isNaN(currentDayIndex)) return <div className="p-10 text-red-500">Lỗi URL.</div>;
 if (loading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen pb-32 font-sans relative">
        {/* Header Skeleton */}
        <div className="px-6 pt-6 pb-2 animate-pulse">
          <div className="h-4 w-20 bg-slate-200 rounded mb-4"></div> {/* Nút back */}
          <div className="h-3 w-16 bg-slate-200 rounded mb-2"></div> {/* Day index */}
          <div className="h-8 w-3/4 bg-slate-200 rounded mb-3"></div> {/* Title */}
          <div className="h-4 w-full bg-slate-200 rounded"></div>     {/* Summary */}
        </div>

        {/* Tabs Skeleton */}
        <div className="flex border-b border-slate-100 px-6 mt-4">
           <div className="flex-1 pb-3 border-b-2 border-slate-200">
              <div className="h-4 w-20 bg-slate-200 rounded mx-auto"></div>
           </div>
           <div className="flex-1 pb-3">
              <div className="h-4 w-20 bg-slate-100 rounded mx-auto"></div>
           </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-6 animate-pulse space-y-4">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-40 bg-slate-200 rounded-xl w-full my-4"></div> {/* Giả lập Ảnh/Video */}
            <div className="h-4 bg-slate-200 rounded w-4/5"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-32 font-sans text-slate-800 relative">
      
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <Link href={`/book/${bookId}`} className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-slate-800">
          <ChevronLeft size={16} /> Quay lại
        </Link>
      </div>
      <DayHeader dayIndex={data.day_index} title={data.title} summary={data.summary} />
      
      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-6 mt-4 sticky top-0 bg-white z-20">
           <button onClick={() => progress.setActiveTab("LEARN")} className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${progress.activeTab === "LEARN" ? "text-blue-600 border-blue-600" : "text-slate-400 border-transparent"}`}>BÀI HỌC</button>
           <button onClick={() => progress.setActiveTab("ACTION")} className={`flex-1 pb-3 text-sm font-bold transition-colors border-b-2 ${progress.activeTab === "ACTION" ? "text-blue-600 border-blue-600" : "text-slate-400 border-transparent"}`}>THỰC HÀNH</button>
      </div>

      {/* Content */}
      <div className="p-6">
        {progress.activeTab === "LEARN" ? (
          <LearnSection htmlContent={data.content} onGoToAction={() => progress.setActiveTab("ACTION")} />
        ) : (
           <div key={currentDayIndex}>
             <ActionSection 
                isSaving={progress.isSaving}
                workbook={data.workbook} 
                quiz={data.quiz} 
                giftContent={data.gift?.content} 
                progress={{
                  answers: progress.workbookAnswers,
                  updateWorkbook: handleWorkbookChange,
                  quizState: progress.quizState,
                  updateQuiz: progress.updateQuiz
                }}
              />
           </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="w-full max-w-md bg-white/95 backdrop-blur border-t border-slate-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pointer-events-auto">
            
            {(isPresent || isPast) && (
                <>
                {isPast && !hasChanges ? (
                    <div className="w-full py-4 bg-green-50 text-green-700 font-bold text-lg rounded-xl flex items-center justify-center gap-2 border border-green-200 shadow-sm transition-all duration-300">
                        <CheckCircle size={20} /> ĐÃ HOÀN THÀNH
                    </div>
                ) : (
                    <button
                        onClick={handleComplete}
                        disabled={isCompleting || !canFinish}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
                            isCompleting 
                            ? "bg-blue-50 text-blue-400 cursor-wait shadow-none"
                            : !canFinish
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : isPast && hasChanges 
                                    ? "bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-50" 
                                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-300" 
                        }`}
                    >
                        {isCompleting ? (
                            <>⏳ Đang xử lý...</>
                        ) : (
                            <>
                            {isPast && hasChanges ? (
                                <>
                                    <CheckCircle size={20} className="text-slate-900"/> 
                                    CẬP NHẬT NỘI DUNG
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={20} /> 
                                    HOÀN THÀNH BÀI HỌC
                                </>
                            )}
                            </>
                        )}
                    </button>
                )}
                </>
            )}

            {isFuture && (
                <div className="w-full py-4 bg-gray-100 text-gray-400 font-bold text-lg rounded-xl flex items-center justify-center gap-2 border border-gray-200 cursor-not-allowed">
                    <Lock size={20} /> Bài học đang khóa
                </div>
            )}

        </div>
      </div>

    </div>
  );
}