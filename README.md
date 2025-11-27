# 🏛️ Landmark Lens

Aplikasi web modern untuk mendeteksi landmark dari gambar dan menghasilkan panduan audio naratif secara otomatis menggunakan **Google Gemini AI**.

### ✨ Fitur Utama

- **AI Detection:** Mengidentifikasi nama dan konteks landmark dari unggahan foto.
- **Audio Generation:** Mengubah deskripsi teks menjadi panduan audio (TTS) yang natural.
- **Modern UI:** Desain _Linear-style_ dengan Tailwind CSS, efek glassmorphism, dan dukungan Markdown.
- **Drag-and-Drop:** Komponen scanner interaktif untuk kemudahan input gambar.

### 🛠️ Tech Stack

- **Core:** Next.js 16, TypeScript, React
- **Styling:** Tailwind CSS, Lucide Icons
- **AI & Logic:** Google Gemini API (Multimodal), Web Audio API

### 🚀 Cara Menjalankan

1.  **Clone & Install**

    ```bash
    git clone https://github.com/seinzzz/landmark-lens.git
    cd landmark-ai-guide
    npm install
    ```

2.  **Setup Environment**
    Buat file `.env.local` dan masukkan API Key:

    ```env
    GOOGLE_API_KEY=your_gemini_api_key
    ```

3.  **Run Development Server**

    ```bash
    npm run dev
    ```

    Buka `http://localhost:3000` di browser.

---

_Dibuat menggunakan Next.js & Gemini AI._
© 2025 landmark-lens
