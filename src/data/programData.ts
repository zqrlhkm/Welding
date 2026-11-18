export interface PainPoint {
  number: string;
  title: string;
  description: string;
  featured?: boolean;
}

export interface BenefitItem {
  title: string;
  description: string;
}

export interface ProgramTrack {
  id: string;
  code: string;
  title: string;
  audience: string;
  duration: string;
  focus: string;
  outcomes: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const WHATSAPP_NUMBER = '60133466472';
export const DISPLAY_PHONE = '013-346 6472';

export const HERO_METRICS = [
  { value: '15+ Tahun', label: 'Syarat Umur Minimum' },
  { value: '70% Praktikal', label: 'Latihan Bengkel Sebenar' },
  { value: '3 Laluan', label: 'Program Kemahiran Terfokus' },
  { value: '013-346 6472', label: 'Talian Penasihat Akademik' },
];

export const PAIN_POINTS: PainPoint[] = [
  {
    number: '01',
    title: 'Kewangan Keluarga & Anak',
    description:
      'Kos sara hidup semakin mendesak manakala simpanan pelajaran anak pula terhad, merunsingkan perancangan jangka panjang keluarga.',
    featured: true,
  },
  {
    number: '02',
    title: 'Keselamatan & Sahsiah Anak',
    description:
      'Bimbang anak terpesong dengan pengaruh negatif di luar sekiranya tiada pengawasan disiplin yang ketat dan bimbingan akhlak.',
  },
  {
    number: '03',
    title: 'Persekitaran Tempat Belajar',
    description:
      'Risau pusat pengajian kurang kondusif, peralatan usang, atau tenaga pengajar yang tiada komitmen memantau perkembangan anak.',
  },
  {
    number: '04',
    title: 'Sukar Dapat Kerja Lepas Habis',
    description:
      'Risau anak menganggur kerana kelayakan sijil yang tidak menepati kehendak pasaran industri pekerjaan teknikal semasa.',
    featured: true,
  },
];

export const SOLUTION_BENEFITS: BenefitItem[] = [
  {
    title: 'Kemahiran Jaminan Tinggi (High Demand)',
    description:
      'Sektor minyak, gas, perkapalan, dan pembuatan industri berat sentiasa memerlukan jurukimpal (welder) mahir yang bertauliah.',
  },
  {
    title: 'Persekitaran Positif & Berdisiplin',
    description:
      'Pusat latihan menekankan pembentukan sahsiah mulia, akhlak terpelihara, serta pematuhan piawaian keselamatan bengkel setiap masa.',
  },
  {
    title: 'Pendapatan Lumayan Awal',
    description:
      'Anak boleh mula menjana pendapatan sendiri pada usia muda dalam bidang teknikal, sekali gus meringankan beban kewangan keluarga.',
  },
  {
    title: 'Bimbingan Hingga Dapat Kerja',
    description:
      'Kami menghubungkan pelatih terus dengan rangkaian rakan industri dan majikan teknikal bagi laluan penempatan kerja yang stabil.',
  },
];

export const WORKSHOP_SPECS = [
  { code: 'MOD-01', label: 'Teknik Kimpalan Teras', value: 'SMAW & GMAW (MIG)' },
  { code: 'MOD-02', label: 'Disiplin & Sahsiah', value: 'Pemantauan Harian & Akhlak' },
  { code: 'MOD-03', label: 'Keselamatan Bengkel', value: 'Standard PPE & Prosedur Industri' },
  { code: 'MOD-04', label: 'Laluan Kerjaya', value: 'Industri Tempatan & Luar Negara' },
];

export const PROGRAM_TRACKS: ProgramTrack[] = [
  {
    id: 'smaw-gmaw',
    code: 'Trek 01',
    title: 'Sijil Asas Welding Profesional (SMAW / GMAW)',
    audience: 'Permulaan Teknikal · Umur 15+ Tahun',
    duration: 'Fokus Praktikal Bengkel',
    focus:
      'Membina asas kukuh dalam teknik kimpalan arka (SMAW) dan MIG (GMAW) daripada peringkat sifar sehingga mahir mengendalikan peralatan bengkel.',
    outcomes: [
      'Penguasaan teknik kimpalan kepingan dan struktur asas',
      'Latihan keselamatan bengkel dan pengendalian mesin',
      'Penilaian kemahiran berterusan oleh pengajar berpengalaman',
    ],
  },
  {
    id: 'kerjaya',
    code: 'Trek 02',
    title: 'Program Sijil Kemahiran & Penempatan Kerjaya',
    audience: 'Laluan Industri · Persediaan Kerja',
    duration: 'Latihan + Padanan Industri',
    focus:
      'Direka khusus untuk melahirkan tenaga kerja teknikal siap-industri dengan pensijilan kemahiran serta sokongan bimbingan penempatan pekerjaan.',
    outcomes: [
      'Latihan intensif mengikut spesifikasi sektor minyak, gas & fabrikasi',
      'Persediaan temu duga teknikal dan ujian kemahiran majikan',
      'Akses kepada rangkaian rakan industri Akademi Kemahiran Kimpalan (GIS)',
    ],
  },
  {
    id: 'remaja-15',
    code: 'Trek 03',
    title: 'Kursus Intensif Khas Remaja 15 Tahun ke Atas',
    audience: 'Khas Remaja · Bimbingan Disiplin',
    duration: 'Struktur Terbimbing',
    focus:
      'Program khas untuk remaja berusia 15 tahun ke atas yang lebih cenderung kepada pembelajaran amali, menggabungkan kemahiran tangan dan pembentukan sahsiah.',
    outcomes: [
      'Kaedah pengajaran amali yang mudah difahami pelajar bukan akademik',
      'Persekitaran positif dengan pemantauan disiplin dan akhlak',
      'Laporan berkala perkembangan pelatih kepada ibu bapa',
    ],
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'Adakah anak berumur 15 tahun tanpa keputusan akademik cemerlang layak menyertai program ini?',
    answer:
      'Ya. Program ini dirangka khusus untuk remaja berumur 15 tahun ke atas yang berminat membina kerjaya melalui kemahiran praktikal. Penekanan utama diberikan kepada latihan amali di bengkel, disiplin kerja, dan kesungguhan untuk belajar.',
  },
  {
    question: 'Bagaimanakah aspek keselamatan dan sahsiah anak dipantau sepanjang latihan?',
    answer:
      'Setiap sesi bengkel dikawal selia oleh tenaga pengajar berpengalaman dengan pematuhan ketat peralatan perlindungan diri (PPE). Selain kemahiran teknikal, akademi menekankan rutin disiplin, adab, dan persekitaran rakan sebaya yang positif.',
  },
  {
    question: 'Apakah peluang pekerjaan selepas anak menamatkan latihan welding?',
    answer:
      'Jurukimpal mahir mempunyai permintaan tinggi dalam sektor fabrikasi logam, pembinaan, perkapalan, pembuatan industri berat, serta minyak dan gas di dalam dan luar negara. Pelatih turut dibimbing melalui rangkaian rakan industri kami.',
  },
  {
    question: 'Bagaimanakah ibu bapa boleh mendapatkan maklumat yuran dan tarikh pengambilan?',
    answer:
      'Isikan borang pendaftaran pantas di bawah dan pilih program yang diminati. Butiran maklumat akan dihantar terus ke WhatsApp penasihat akademik Akademi Kemahiran Kimpalan (GIS) (013-346 6472) untuk sesi penerangan percuma.',
  },
];
