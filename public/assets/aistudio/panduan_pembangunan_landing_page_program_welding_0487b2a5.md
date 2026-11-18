# Panduan Pembangunan Landing Page Program Welding (GIS Akademi)

Dokumen ini mengandungi panduan lengkap serta kod sumber penuh bagi membina *landing page* promosi program kemahiran *welding* (kimpalan) yang disasarkan khusus untuk ibu bapa yang mempunyai anak berumur 15 tahun ke atas.

---

## 🛠️ Spesifikasi Rekaan & Ciri Utama
1. **Logo GIS Akademi:** Menggunakan imej logo rasmi pada bahagian navigasi atas.
2. **Banner Utama Sinematik (Wide Screen & Cinematic):** Menggunakan imej bengkel latihan kimpalan sebenar dengan kesan tindihan (*dark gradient overlay*) dan teks tajuk bergaya lebar yang dramatik.
3. **Animasi & Peralihan Teks (Smooth Animations & Transitions):** Menggunakan animasi peralihan halus (*fade-in*, *slide-up*, dan kesan hover interaktif) berasaskan Tailwind CSS dan skrip ringan.
4. **Mod Cerah Eksklusif (Light Mode):** Palet warna cerah, bersih, profesional, dan mesra pengguna tanpa menggunakan mod gelap (*dark mode*).
5. **Borang Pantas ke WhatsApp:** Pengguna mengisi 3 item asas (Nama, No Telefon, Emel) berserta pilihan kursus, dan data terus dilancarkan ke WhatsApp nombor **0133466472** dalam format mesej automatik.

---

## 💻 Kod Sumber Penuh (Single-File HTML)

Simpan kod di bawah sebagai `index.html`:

```html
<!DOCTYPE html>
<html lang="ms" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Program Kemahiran Welding Kerjaya Masa Depan Anak Anda | GIS Akademi</title>
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        /* Animasi halus masuk */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
        }
    </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased selection:bg-amber-400 selection:text-slate-950">

    <!-- NAVIGATION BAR -->
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 shadow-xs transition-all">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <div class="flex items-center gap-3">
                <!-- Logo Pertama -->
                <img src="Logo GIS.png" alt="Logo GIS" class="h-10 w-auto object-contain">
                <span class="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base hidden sm:inline">GIS Akademi Kemahiran</span>
            </div>
            <a href="#daftar" class="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-transform hover:-translate-y-0.5">
                Daftar Pertanyaan
            </a>
        </div>
    </nav>

    <!-- HEADER / CINEMATIC WIDE SCREEN BANNER -->
    <header class="relative min-h-[85vh] flex items-center justify-center text-center px-6 py-24 overflow-hidden bg-slate-950">
        <!-- Imej Kedua sebagai Background Header Cinematic -->
        <div class="absolute inset-0 z-0">
            <img src="image_f1ea86.jpg" alt="Bengkel Welding Profesional" class="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms] opacity-40">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40"></div>
        </div>

        <div class="max-w-5xl mx-auto relative z-10 animate-fade-in-up">
            <span class="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs sm:text-sm font-bold uppercase tracking-wider px-4 py-1.5 rounded-full inline-block mb-6 shadow-sm backdrop-blur-sm">
                ⚡ Khas Untuk Ibu Bapa Yang Ada Anak Remaja Umur 15 Tahun Ke Atas
            </span>
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
                Risau Masa Depan Anak Tak Cukup Belajar & Susah Dapat Kerja? Jom Bekalkan Mereka Kemahiran <span class="text-amber-400 underline decoration-amber-400/40">Welding Profesional!</span>
            </h1>
            <p class="text-base sm:text-lg lg:text-xl text-slate-200 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
                Program latihan teknikal bertauliah tinggi dengan persekitaran positif, jaminan sahsiah terpelihara, dan laluan kerjaya bergaji lumayan di dalam & luar negara.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
                <a href="#daftar" class="bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold px-8 py-4 rounded-xl shadow-xl transition-transform hover:-translate-y-0.5 text-base flex items-center gap-2">
                    <span>Dapatkan Konsultasi Percuma</span>
                    <span>→</span>
                </a>
            </div>
        </div>
    </header>

    <!-- SECTION: PAIN POINTS (KERISAUAN IBU BAPA) -->
    <section class="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div class="text-center max-w-2xl mx-auto mb-16">
            <span class="text-rose-600 font-bold text-xs uppercase tracking-widest bg-rose-100/70 px-3.5 py-1.5 rounded-full border border-rose-200">Situasi Yang Sering Merisaukan Ibu Bapa</span>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-4">Adakah Anda Sebagai Ibu Bapa Berdepan 5 Masalah Ini?</h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Card 1 -->
            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all hover:-translate-y-1">
                <div class="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6 shadow-inner">📉</div>
                <h3 class="font-bold text-lg mb-2 text-slate-900">Kewangan Keluarga & Anak</h3>
                <p class="text-slate-600 text-sm leading-relaxed">Kos sara hidup semakin mendesak manakala simpanan pelajaran anak pula terhad, merunsingkan perancangan jangka panjang.</p>
            </div>
            <!-- Card 2 -->
            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all hover:-translate-y-1">
                <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6 shadow-inner">⚠️</div>
                <h3 class="font-bold text-lg mb-2 text-slate-900">Keselamatan & Sahsiah Anak</h3>
                <p class="text-slate-600 text-sm leading-relaxed">Bimbang anak terpesong dengan pengaruh negatif di luar sekiranya tiada pengawasan disiplin yang ketat dan bimbingan akhlak.</p>
            </div>
            <!-- Card 3 -->
            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all hover:-translate-y-1">
                <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6 shadow-inner">🏫</div>
                <h3 class="font-bold text-lg mb-2 text-slate-900">Persekitaran Tempat Belajar</h3>
                <p class="text-slate-600 text-sm leading-relaxed">Risau pusat pengajian kurang kondusif, peralatan usang, atau tenaga pengajar yang tiada komitmen memantau perkembangan anak.</p>
            </div>
            <!-- Card 4 -->
            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all hover:-translate-y-1">
                <div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6 shadow-inner">❌</div>
                <h3 class="font-bold text-lg mb-2 text-slate-900">Takut Anak Putus Di Tengah Jalan</h3>
                <p class="text-slate-600 text-sm leading-relaxed">Kebimbangan anak hilang minat meneruskan sistem akademik konvensional lalu putus asa dan gagal menghabiskan persekolahan.</p>
            </div>
            <!-- Card 5 -->
            <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all hover:-translate-y-1 md:col-span-2 lg:col-span-1">
                <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6 shadow-inner">💼</div>
                <h3 class="font-bold text-lg mb-2 text-slate-900">Sukar Dapat Kerja Lepas Habis</h3>
                <p class="text-slate-600 text-sm leading-relaxed">Risau anak menganggur kerana kelayakan sijil yang tidak menepati kehendak pasaran industri pekerjaan teknikal semasa.</p>
            </div>
        </div>
    </section>

    <!-- SECTION: SOLUTION & BENEFITS -->
    <section class="bg-white py-24 px-6 lg:px-12 border-y border-slate-200/80">
        <div class="max-w-5xl mx-auto">
            <div class="text-center max-w-2xl mx-auto mb-16">
                <span class="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">Jawapan Kepada Kerisauan Anda</span>
                <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-4">Bagaimana Program Kami Membantu Masa Depan Anak Anda?</h2>
            </div>
            <div class="grid md:grid-cols-2 gap-6">
                <div class="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200/60 hover:border-blue-200 transition">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">✓</div>
                    <div>
                        <h4 class="font-bold text-slate-900 mb-1">Kemahiran Jaminan Tinggi (High Demand)</h4>
                        <p class="text-slate-600 text-sm leading-relaxed">Sektor minyak, gas, dan pembuatan industri berat amat memerlukan jurukimah (welder) mahir bertauliah.</p>
                    </div>
                </div>
                <div class="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200/60 hover:border-blue-200 transition">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">✓</div>
                    <div>
                        <h4 class="font-bold text-slate-900 mb-1">Persekitaran Positif & Berdisiplin</h4>
                        <p class="text-slate-600 text-sm leading-relaxed">Pusat latihan menekankan pembentukan sahsiah mulia, akhlak terpelihara, serta keselamatan diutamakan.</p>
                    </div>
                </div>
                <div class="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200/60 hover:border-blue-200 transition">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">✓</div>
                    <div>
                        <h4 class="font-bold text-slate-900 mb-1">Pendapatan Lumayan Awal</h4>
                        <p class="text-slate-600 text-sm leading-relaxed">Anak boleh mula menjana pendapatan sendiri pada usia muda, mengurangkan beban kewangan keluarga.</p>
                    </div>
                </div>
                <div class="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-200/60 hover:border-blue-200 transition">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">✓</div>
                    <div>
                        <h4 class="font-bold text-slate-900 mb-1">Bimbingan Hingga Dapat Kerja</h4>
                        <p class="text-slate-600 text-sm leading-relaxed">Kami menghubungkan pelatih terus dengan rangkaian industri rakan kongsi pekerjaan yang stabil.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION: FORM (BORANG UTAMA) -->
    <section id="daftar" class="py-24 px-6 lg:px-12 max-w-xl mx-auto">
        <div class="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-200/80">
            <div class="text-center mb-8">
                <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">Pendaftaran Pantas</span>
                <h3 class="text-2xl font-extrabold text-slate-900 mt-4 mb-2">Dapatkan Info & Slot Tempat Duduk</h3>
                <p class="text-slate-600 text-sm">Isikan maklumat di bawah. Anda akan terus dihubungkan dengan penasihat akademik kami melalui WhatsApp secara automatik.</p>
            </div>

            <!-- FORM -->
            <form id="leadForm" onsubmit="handleFormSubmit(event)" class="space-y-5">
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Nama Penuh (Ibu Bapa / Penjaga / Anak)</label>
                    <input type="text" id="nama" required class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-slate-50/50" placeholder="cth: En. Razak bin Abdullah">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">No. Telefon (WhatsApp)</label>
                    <input type="tel" id="telefon" required class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-slate-50/50" placeholder="cth: 0123456789">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Emel</label>
                    <input type="email" id="emel" required class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-slate-50/50" placeholder="cth: emel@contoh.com">
                </div>
                <div>
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Kursus / Program Yang Diminati</label>
                    <select id="kursus" required class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm bg-slate-50/50">
                        <option value="" disabled selected>-- Sila Pilih Program --</option>
                        <option value="Sijil Asas Welding Profesional (SMAW / GMAW)">Sijil Asas Welding Profesional (SMAW / GMAW)</option>
                        <option value="Program Sijil Kemahiran & Penempatan Kerjaya">Program Sijil Kemahiran & Penempatan Kerjaya</option>
                        <option value="Kursus Intensif Khas Remaja 15 Tahun ke Atas">Kursus Intensif Khas Remaja 15 Tahun ke Atas</option>
                    </select>
                </div>
                <button type="submit" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 text-base flex items-center justify-center gap-2 cursor-pointer">
                    <span>Hantar & Terus ke WhatsApp</span>
                    <span>💬</span>
                </button>
            </form>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-white text-slate-500 py-10 px-6 text-center text-xs border-t border-slate-200">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-2">
                <img src="Logo GIS.png" alt="Logo GIS" class="h-6 w-auto object-contain">
                <span class="font-bold text-slate-700">GIS Akademi Kemahiran</span>
            </div>
            <p>&copy; 2026 Program Latihan Kemahiran Welding. Hak Cipta Terpelihara.</p>
        </div>
    </footer>

    <!-- SCRIPT: WHATSAPP REDIRECT -->
    <script>
        function handleFormSubmit(event) {
            event.preventDefault();

            // Ambil data nilai daripada input borang
            const nama = document.getElementById('nama').value.trim();
            const telefon = document.getElementById('telefon').value.trim();
            const emel = document.getElementById('emel').value.trim();
            const kursus = document.getElementById('kursus').value;

            // Nombor tujuan WhatsApp yang ditetapkan (0133466472)
            const whatsappNumber = '60133466472';

            // Format mesej pra-isi dengan maklumat borang
            const message = `Hai, saya berminat dengan program welding anda.%0A%0A*Maklumat Pendaftaran:*%0A- Nama: ${nama}%0A- No Telefon: ${telefon}%0A- Emel: ${emel}%0A- Kursus Diminati: ${kursus}%0A%0ASila berikan butiran lanjut. Terima kasih!`;

            // Buka aplikasi WhatsApp dengan mesej yang telah diisi
            window.location.href = `https://wa.me/${whatsappNumber}?text=${message}`;
        }
    </script>
</body>
</html>
```

---

## 🚀 Cara Penggunaan
1. Pastikan fail imej logo dinamakan `Logo GIS.png` dan imej banner dinamakan `image_f1ea86.jpg` diletakkan di dalam folder yang sama dengan fail `index.html`.
2. Buka fail `index.html` menggunakan mana-mana pelayar web (*web browser*) atau hoskan pada pelayan web anda.
