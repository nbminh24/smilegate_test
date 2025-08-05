# 1. Giới thiệu dự án

**🚀 Live Demo: [https://gamage.vercel.app/](https://gamage.vercel.app/) 🚀**


Đây là một ứng dụng web hiện đại dùng để quản lý cơ sở dữ liệu game. Giao diện được thiết kế sạch sẽ, trực quan và đầy đủ các tính năng CRUD (Tạo, Đọc, Cập nhật, Xóa).


## 2. Các tính năng chính

### Trang Danh sách game (Game List Page)

- **Tìm kiếm & Lọc nâng cao**: Hỗ trợ tìm kiếm tức thì theo từ khóa và lọc game theo danh mục (Category).
- **Hiển thị dạng bảng**: Danh sách game được trình bày trong một bảng dữ liệu mạnh mẽ, có hỗ trợ phân trang để điều hướng hiệu quả qua các bộ dữ liệu lớn.
- **Xóa hàng loạt**: Cho phép người dùng chọn và xóa nhiều game cùng một lúc để tăng hiệu quả quản lý.
- **Đăng ký game mới**: Cung cấp nút bấm để dễ dàng điều hướng đến trang tạo game mới.

### Trang Đăng ký game (Game Registration Page)

- **Tạo và Chỉnh sửa**: Một form duy nhất được sử dụng cho cả việc tạo game mới và cập nhật thông tin của game đã có.
- **Hỗ trợ đa ngôn ngữ**: Cho phép nhập tên game bằng nhiều ngôn ngữ khác nhau. Các ngôn ngữ được hỗ trợ bao gồm **Tiếng Anh (EN)**, **Tiếng Hàn (KO)**, và **Tiếng Nhật (JA)**.
- **Quản lý ngôn ngữ linh hoạt**: Người dùng có thể thêm, xóa các mục nhập ngôn ngữ và chỉ định một ngôn ngữ làm ngôn ngữ mặc định.
- **Xác thực dữ liệu (Validation)**: Sử dụng thư viện `yup` để xác thực dữ liệu đầu vào theo thời gian thực ngay trên client, đảm bảo tính toàn vẹn của dữ liệu trước khi gửi lên server.

## 3. Công nghệ và Công cụ

- **Framework**: **Nuxt 3** - Một framework Vue.js mạnh mẽ để xây dựng các ứng dụng full-stack.
- **Styling**: **UnoCSS** - Một công cụ CSS utility-first có khả năng tùy biến cao, được sử dụng để tạo ra một hệ thống thiết kế nhất quán và hiện đại.
- **UI Components**: **PrimeVue** - Một bộ thư viện component UI toàn diện cho Vue.
- **Package Manager**: **Bun** - Một trình quản lý gói và runtime JavaScript cực nhanh.
- **Linter**: **ESLint** - Được cấu hình để đảm bảo code luôn sạch sẽ, dễ đọc và nhất quán.
- **Backend**: **Nuxt 3 Server Engine (Nitro)** - Backend được tích hợp ngay trong project Nuxt, xử lý các yêu cầu API và logic phía máy chủ.
- **Database**: **Supabase** - Một giải pháp Backend-as-a-Service mạnh mẽ, được sử dụng để lưu trữ và quản lý dữ liệu game.

## 4. Hướng dẫn sử dụng

### Cài đặt và Chạy dự án

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2.  **Cấu hình biến môi trường**:
    Sao chép tệp `.env.example` để tạo tệp `.env` mới và điền thông tin Supabase của bạn:
    ```bash
    cp .env.example .env
    ```
    Nội dung tệp `.env`:
    ```
    SUPABASE_URL="YOUR_SUPABASE_URL"
    SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"
    ```

3.  **Install dependencies**:
    ```bash
    bun install
    ```

4.  **Run the development server**:
    Ứng dụng sẽ có sẵn tại `http://localhost:3000`.
    ```bash
    bun run dev
    ```

### Truy cập phiên bản đã deploy

Dự án này cũng đã được build và deploy lên Vercel. Bạn có thể truy cập và trải nghiệm phiên bản live của ứng dụng tại địa chỉ: [https://gamage.vercel.app/](https://gamage.vercel.app/)
