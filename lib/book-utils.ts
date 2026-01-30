// src/lib/book-utils.ts

export interface SandwichContent {
  trap: string;
  shift: string;
  proof: string;
  action: string;
}

export const parseSandwichContent = (htmlContent: string): SandwichContent => {
  // Hàm này dùng Regex để "gắp" nội dung sau các thẻ <b>
  const extract = (key: string) => {
    // Tìm đoạn text nằm giữa <b>KEY:</b> và thẻ đóng </p>
    const regex = new RegExp(`<b>\\d+\\.\\s*${key}:<\\/b>(.*?)<\\/p>`, "s");
    const match = htmlContent.match(regex);
    return match ? match[1].trim() : "";
  };

  return {
    trap: extract("THE TRAP"),
    shift: extract("THE SHIFT"),
    proof: extract("THE PROOF"),
    action: extract("THE MICRO-ACTION"),
  };
};