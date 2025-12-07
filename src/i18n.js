// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  id: {
    translation: {
      common: { back: "Kembali" },
      settings: {
        title: "Pengaturan",
        tabs: { privacy: "Privasi", notif: "Notifikasi", language: "Bahasa & Regional", support: "Bantuan" },
      },
      dashboard: {
        sidebar: { home: "Beranda", chat: "Obrolan", botSettings: "Pengaturan Bot", reports: "Laporan", packages: "Paket Saya", referral: "Referral", backToLanding: "Kembali ke Beranda" },
      },
      home: {
        welcome: "Selamat datang",
        user: "Pengguna",
        subtitle: "Joyin siap nemenin bisnismu.",
        incomingChats: "Chat Masuk",
        monthlyChats: "Chat Bulanan",
        answeredChats: "Chat Terjawab",
        totalChats: "Total Chat",
        stats: {
          title: "Statistik Pengiriman Pesan",
          messages: "Pesan",
          avgPerMonth: "rata-rata/bulan",
          average: "Rata-rata",
          note: "Data di atas merupakan contoh. Integrasikan dengan API analitik Anda untuk angka aktual."
        },
        bot: {
          title: "Customer Service Bot",
          active: "Aktif",
          desc: "Bot layanan pelanggan yang membantu menjawab pertanyaan, memberikan panduan, dan mendukung kebutuhan pelanggan.",
          manage: "Kelola Bot"
        },
        services: {
          title: "Layanan Bot Tersedia",
          item1: "Menjawab pertanyaan pelanggan otomatis",
          item2: "Memberikan panduan produk & layanan",
          item3: "Mendukung kebutuhan pelanggan 24/7",
          item4: "Statistik performa bot real-time"
        }
      },
      months: {
        janShort: "Jan", febShort: "Feb", marShort: "Mar", aprShort: "Apr", mayShort: "Mei", junShort: "Jun",
        julShort: "Jul", augShort: "Agu", sepShort: "Sep", octShort: "Okt", novShort: "Nov", decShort: "Des"
      },
      navbar: {
        referral: "Referral",
        paket: "Paket",
        beranda: "Beranda",
        tutorial: "Tutorial",
        tentang: "Tentang Kami",
        login: "Login",
        dashboard: "Dashboard",
        logout: "Keluar",
        bahasa: "Bahasa",
      },
      hero: {
        title: "Chatbot Pintar Joyin, Balesin Chat Otomatis Tanpa Ribet",
        desc: "Dengan chatbot AI, kamu nggak perlu nunggu lama lagi. Semua jawaban langsung tersedia dalam hitungan detik!",
        btnStart: "Ayo Mulai",
        btnLearn: "Pelajari Lebih Lanjut",
      },
      fitur: {
        title: "Yang Kamu Dapatkan di Joyin",
        items: [
          { title: "Joyin Personality", desc: "Atur gaya ngobrol si Joyin sesuai karakter bisnismu-ramah, formal, santai? Bisa semua!." },
          { title: "Knowledge Base", desc: "Simpan semua info penting soal produk atau layananmu, biar Joyin bisa jawab dengan tepat." },
          { title: "Auto-Ignore List", desc: "Mau skip nomor spam atau iseng? Joyin bisa diatur buat ngabaikan otomatis." },
          { title: "Online 24/7", desc: "Joyin selalu bisa jawab chat pelanggan kapan pun, bahkan saat kamu lagi tidur!" },
        ]
      },
      keunggulan: {
        title: "Kenapa harus pakai chatbot ini?",
        items: [
          { title: "Respons Kilat", desc: "Jawaban langsung keluar dalam hitungan detik. Gak pake tunggu-tungguan." },
          { title: "Aktif 24/7", desc: "Chatbot ini gak kenal kata libur. Mau nanya tengah malam pun tetap dilayani — kapan aja, selalu siap!" },
          { title: "Multitasking", desc: "Bisa bantu banyak orang sekaligus tanpa kewalahan. Gak ada antri panjang, semua dilayani barengan!" },
          { title: "Ramah & Sabar", desc: "Bisa diajak ngobrol santai tanpa takut di-judge. Mau tanya berulang kali juga tetap dijawab, gak bosenan." },
          { title: "Hemat Biaya", desc: "Gak perlu banyak tim CS. Chatbot bantu handle pertanyaan umum secara otomatis — efisien dan praktis." },
          { title: "Jawaban Akurat", desc: "Dibekali AI yang pintar, jadi jawaban gak asal. Informasi yang keluar tetap konsisten, meski ditanya 100 kali." },
          { title: "Bisa Disesuaikan", desc: "Mau gaya formal, sopan, atau receh? Semua bisa diatur biar sesuai dengan identitas usahamu!" },
          { title: "Mudah Terintegrasi", desc: "Full Power di WhatsApp Joyin khusus buat WhatsApp, jadi performanya optimal untuk balasin chat pelanggan tanpa delay." },
        ]
      },
      paket: {
        title: "Temukan Paket yang Paling Cocok untukmu",
        desc: "Joyin punya pilihan paket yang fleksibel buat segala kebutuhan. Mau yang simpel atau lengkap? Tinggal pilih, Joyin yang bantuin!",
        month: "/ Bulan",
        loading: "Memulai pembayaran...",
        plans: [
          {
            title: "Paket Basic",
            features: ["300 percakapan/bulan", "Balasan otomatis 24/7", "Integrasi WhatsApp mudah", "Template balasan standar", "Statistik bulanan sederhana", "FAQ dasar bawaan"],
            button: "Pilih Basic"
          },
          {
            title: "Paket Pro",
            features: ["1.000 percakapan/bulan", "Balasan otomatis 24/7", "Template balasan custom", "Auto-update FAQ produk", "Statistik & insight pelanggan", "Notifikasi chat masuk", "Pesan sambutan personal"],
            button: "Pilih Pro"
          },
          {
            title: "Paket Bisnis",
            features: ["5.000 percakapan/bulan", "Multi-admin WhatsApp", "Balasan otomatis 24/7", "Template balasan premium", "FAQ otomatis & terjadwal", "Pesan terjadwal promosi", "Laporan mingguan lengkap", "Prioritas dukungan teknis"],
            button: "Pilih Bisnis"
          },
          {
            title: "Paket Enterprise",
            features: ["Chat tanpa batas", "Integrasi WhatsApp API penuh", "Balasan otomatis 24/7", "Statistik real-time & export data", "Multi-admin + manajemen tim", "Laporan custom & konsultasi setup", "Prioritas dukungan & SLA support", "Integrasi sistem internal (CRM/API)"],
            button: "Pilih Enterprise"
          },
        ]
      },
      testimoni: {
        title: "Cerita dari Pengguna Joyin",
        desc: "Mereka udah ngerasain gimana Joyin bantuin bisnis sehari-hari. Dari yang baru mulai sampai yang udah jalan lama — semua punya cerita seru bareng Joyin!",
        items: [
          {
            name: "Amalia",
            role: "Owner Skincare",
            text: "Respon makin cepat, aku jadi bisa fokus ke hal lain. Joyin bantu banget pas lagi banyak chat masuk, semua dijawab tanpa ribet!"
          },
          {
            name: "Ahmad Afif",
            role: "Freelancer & Designer",
            text: "Pernah dicoba buat landing page bisnis kecil-kecilan, ternyata chatbot-nya langsung nyambung sama pengunjung. Auto trust naik!"
          },
          {
            name: "Yayapiv",
            role: "Penjual di Shopee & Instagram",
            text: "Joyin bantu banget waktu orderan lagi rame. Pertanyaan umum dijawab otomatis, aku tinggal kirim barang!"
          },
        ]
      },
      footer: {
        quickLinks: "Quick Links",
        support: "Support",
        contact: "Contact Us",
        links: {
          fitur: "Fitur",
          reseller: "Reseller",
          about: "Tentang Kami",
          faq: "FAQ",
          privacy: "Kebijakan Privasi",
          terms: "Syarat dan Ketentuan"
        },
        copyright: "Joyin.id. All rights reserved."
      },
      referral: {
        hero: {
          title: "Dapatkan Keuntungan dari Referral Joyin!",
          desc: "Temanmu dapat diskon spesial, kamu pun dapat hadiah menarik. Semakin banyak yang bergabung, semakin banyak untung yang kamu dapat!",
          btnCode: "Dapatkan Kode Referral",
          btnLearn: "Pelajari Lebih Lanjut"
        },
        why: {
          title1: "Kenapa Harus Ikut",
          title2: "Program Referral",
          desc1: "Di Joyin, kami percaya hal baik pantas dibagikan! Ajak temanmu untuk bergabung, dan kalian berdua bisa dapetin hadiah spesial dari Joyin 🎉",
          desc2: "Setiap ajakan membawa kamu semakin dekat ke hadiah utama — kesempatan seru yang sayang banget kalau dilewatkan! Yuk, mulai bagikan link referral-mu sekarang dan raih hadiahnya!"
        },
        section2: {
          title: "Cara Kerjanya Sangat Mudah!",
          desc: "Hanya tiga langkah mudah buat nikmatin keseruan program referral Joyin"
        },
        how: {
          steps: [
            { title: "Dapatkan Kode Unik", desc: "Hanya tiga langkah mudah buat nikmatin keseruan program referral Joyin" },
            { title: "Bagikan ke Teman", desc: "Share kode Anda melalui WhatsApp, Instagram, Facebook, atau platform sosial media lainnya" },
            { title: "Dapatkan Bonus", desc: "Ketika teman Anda mendaftar dan bertransaksi, Anda langsung mendapat bonus!" }
          ]
        },
        join: {
          title: "Yuk Gabung & Dapatkan Referral dari Joyin!",
          desc: "Mulai perjalananmu bareng Joyin sekarang. Setelah daftar, kamu bisa langsung bagikan kode referral-mu dan kumpulkan hadiah seru dari setiap teman yang ikut bergabung!",
          btn: "Bergabung & Dapatkan Hadiah"
        },
        bottomCta: "Ayo Bergabung!",
        modal: {
          title: "Kode Referral Kamu",
          desc: "Bagikan kode ini ke temanmu. Temanmu dapat diskon 6% saat beli paket.",
          loading: "Mengambil kode referral...",
          retry: "Coba Lagi",
          close: "Tutup",
          codeLabel: "KODE",
          codeNote: "1 orang hanya bisa pakai 1x kode referral saat registrasi.",
          copy: "Copy",
          progressTitle: "Progress hadiah paket Pro 1 bulan",
          progressNote: "Ajak {{target}} orang menggunakan kode referralmu untuk dapat hadiah."
        },
        errors: {
          sessionExpired: "Sesi kamu habis / belum login. Silakan login lagi.",
          fetchFailed: "Gagal mengambil data referral",
          general: "Terjadi kesalahan saat mengambil referral code."
        },
        copySuccess: "Berhasil disalin!",
        copySuccessShort: "Kode tersalin!"
      },
      tutorial: {
        headerTitle: "Pusat Tutorial Joyin",
        headerDesc: "Di sini kamu bisa belajar cara menggunakan chatbot, cara mengintegrasikan ke berbagai platform, dan cara membuat ucapan yang menarik. Semua panduan dibuat simpel supaya kamu bisa langsung praktik.",
        search: "Cari Tutorial...",
        view: "Lihat",
        prev: "Sebelumnya",
        next: "Berikutnya",
        page: "Halaman {{current}} dari {{total}}"
      }
    },
  },
  en: {
    translation: {
      common: { back: "Back" },
      settings: {
        title: "Settings",
        tabs: { privacy: "Privacy", notif: "Notifications", language: "Language & Region", support: "Support" },
      },
      dashboard: {
        sidebar: { home: "Home", chat: "Chat", botSettings: "Bot Settings", reports: "Reports", packages: "My Packages", referral: "Referral", backToLanding: "Back to Home" },
        errorLoadProfile: "Failed to load profile",
        referralPlaceholder: {
          title: "Referral",
          desc: "Referral page will be here.",
          yourCode: "Your Referral Code",
          info: "Users who enter the code during registration will get a discount (according to your rules)."
        },
        profile: {
          planFree: "Free",
          defaultName: "User",
          viewProfile: "Profile"
        },
        dropdown: {
          settings: "Settings",
          settingsSub: "Language & preferences",
          logout: "Logout",
          language: "Language"
        }
      },
      home: {
        welcome: "Welcome",
        user: "User",
        subtitle: "Joyin is ready to accompany your business.",
        incomingChats: "Incoming Chats",
        monthlyChats: "Monthly Chats",
        answeredChats: "Answered Chats",
        totalChats: "Total Chats",
        stats: {
          title: "Message Delivery Statistics",
          messages: "Messages",
          avgPerMonth: "average/month",
          average: "Average",
          note: "The data above is an example. Integrate with your analytics API for actual figures."
        },
        bot: {
          title: "Customer Service Bot",
          active: "Active",
          desc: "Customer service bot that helps answer questions, provide guides, and support customer needs.",
          manage: "Manage Bot"
        },
        services: {
          title: "Bot Services Available",
          item1: "Auto-answer customer questions",
          item2: "Provide product & service guides",
          item3: "Support customer needs 24/7",
          item4: "Real-time bot performance statistics"
        }
      },
      months: {
        janShort: "Jan", febShort: "Feb", marShort: "Mar", aprShort: "Apr", mayShort: "May", junShort: "Jun",
        julShort: "Jul", augShort: "Aug", sepShort: "Sep", octShort: "Oct", novShort: "Nov", decShort: "Dec"
      },
      navbar: {
        referral: "Referral",
        paket: "Plans",
        beranda: "Home",
        tutorial: "Tutorial",
        tentang: "About Us",
        login: "Login",
        dashboard: "Dashboard",
        logout: "Logout",
        bahasa: "Language",
      },
      hero: {
        title: "Smart Chatbot Joyin, Reply Chats Automatically Without Hassle",
        desc: "With AI chatbot, you don't need to wait long anymore. All answers are instantly available in seconds!",
        btnStart: "Start Now",
        btnLearn: "Learn More",
      },
      fitur: {
        title: "What You Get with Joyin",
        items: [
          { title: "Joyin Personality", desc: "Set Joyin's chat style according to your business character—friendly, formal, casual? Can do all!" },
          { title: "Knowledge Base", desc: "Store all important product or service info, so Joyin can answer accurately." },
          { title: "Auto-Ignore List", desc: "Want to skip spam or prank numbers? Joyin can be set to ignore automatically." },
          { title: "Online 24/7", desc: "Joyin can always answer customer chats anytime, even when you're sleeping!" },
        ]
      },
      keunggulan: {
        title: "Why use this chatbot?",
        items: [
          { title: "Lightning Fast Response", desc: "Answers come out instantly in seconds. No waiting around." },
          { title: "Active 24/7", desc: "This chatbot knows no holidays. Even at midnight, it serves — anytime, always ready!" },
          { title: "Multitasking", desc: "Can help many people at once without being overwhelmed. No long cues, everyone served together!" },
          { title: "Friendly & Patient", desc: "Can be chatted with casually without fear of judgement. Asked repeatedly, it answers without getting bored." },
          { title: "Cost Effective", desc: "No need for many CS teams. Chatbot helps handle common questions automatically — efficient and practical." },
          { title: "Accurate Answers", desc: "Equipped with smart AI, so answers aren't random. Information remains consistent, even if asked 100 times." },
          { title: "Customizable", desc: "Want formal, polite, or casual style? All can be set to match your business identity!" },
          { title: "Easy Integration", desc: "Full Power on WhatsApp Joyin specifically for WhatsApp, so performance is optimal for replying to customer chats without delay." },
        ]
      },
      paket: {
        title: "Find the Plan That Suits You Best",
        desc: "Joyin has flexible plan options for all needs. Want simple or complete? Just choose, Joyin helps!",
        month: "/ Month",
        loading: "Starting payment...",
        plans: [
          {
            title: "Basic Plan",
            features: ["300 conversations/month", "24/7 Auto reply", "Easy WhatsApp Integration", "Standard reply templates", "Simple monthly stats", "Built-in basic FAQ"],
            button: "Select Basic"
          },
          {
            title: "Pro Plan",
            features: ["1,000 conversations/month", "24/7 Auto reply", "Custom reply templates", "Auto-update product FAQ", "Customer stats & insights", "Incoming chat notifications", "Personal welcome message"],
            button: "Select Pro"
          },
          {
            title: "Business Plan",
            features: ["5,000 conversations/month", "Multi-admin WhatsApp", "24/7 Auto reply", "Premium reply templates", "Auto & scheduled FAQ", "Scheduled promo messages", "Complete weekly reports", "Priority technical support"],
            button: "Select Business"
          },
          {
            title: "Enterprise Plan",
            features: ["Unlimited chats", "Full WhatsApp API Integration", "24/7 Auto reply", "Real-time stat & data export", "Multi-admin + team management", "Custom report & setup consultation", "Priority support & SLA", "Internal system integration (CRM/API)"],
            button: "Select Enterprise"
          },
        ]
      },
      testimoni: {
        title: "Stories from Joyin Users",
        desc: "They've experienced how Joyin helps daily business. From starters to long-runners — all have exciting stories with Joyin!",
        items: [
          {
            name: "Amalia",
            role: "Owner Skincare",
            text: "Response gets faster, I can focus on other things. Joyin really helps when many chats come in, all answered without hassle!"
          },
          {
            name: "Ahmad Afif",
            role: "Freelancer & Designer",
            text: "Tried for a small business landing page, turned out the chatbot connects instantly with visitors. Auto trust goes up!"
          },
          {
            name: "Yayapiv",
            role: "Shopee & Instagram Seller",
            text: "Joyin helps a lot when orders are high. Common questions answered automatically, I just ship goods!"
          },
        ]
      },
      footer: {
        quickLinks: "Quick Links",
        support: "Support",
        contact: "Contact Us",
        links: {
          fitur: "Features",
          reseller: "Reseller",
          about: "About Us",
          faq: "FAQ",
          privacy: "Privacy Policy",
          terms: "Terms and Conditions"
        },
        copyright: "Joyin.id. All rights reserved."
      },
      referral: {
        hero: {
          title: "Get Benefits from Joyin Referral!",
          desc: "Your friends get special discounts, you get attractive rewards. The more people join, the more profit you get!",
          btnCode: "Get Referral Code",
          btnLearn: "Learn More"
        },
        why: {
          title1: "Why Join the",
          title2: "Referral Program",
          desc1: "At Joyin, we believe good things are worth sharing! Invite your friends to join, and both of you can get special rewards from Joyin 🎉",
          desc2: "Every invitation brings you closer to the main prize — an exciting opportunity you don't want to miss! Come on, start sharing your referral link now and get the prize!"
        },
        section2: {
          title: "It Works Very Easily!",
          desc: "Just three easy steps to enjoy the excitement of Joyin referral program"
        },
        how: {
          steps: [
            { title: "Get Unique Code", desc: "Just three easy steps to enjoy the excitement of Joyin referral program" },
            { title: "Share with Friends", desc: "Share your code via WhatsApp, Instagram, Facebook, or other social media platforms" },
            { title: "Get Bonus", desc: "When your friend registers and transacts, you instantly get a bonus!" }
          ]
        },
        join: {
          title: "Join & Get Referral from Joyin!",
          desc: "Start your journey with Joyin now. After registering, you can immediately share your referral code and collect exciting rewards from every friend who joins!",
          btn: "Join & Get Rewards"
        },
        bottomCta: "Let's Join!",
        modal: {
          title: "Your Referral Code",
          desc: "Share this code with your friends. Your friends get a 6% discount when buying a package.",
          loading: "Fetching referral code...",
          retry: "Try Again",
          close: "Close",
          codeLabel: "CODE",
          codeNote: "1 person can only use 1x referral code during registration.",
          copy: "Copy",
          progressTitle: "Pro 1 month package reward progress",
          progressNote: "Invite {{target}} people to use your referral code to get rewards."
        },
        errors: {
          sessionExpired: "Your session has expired / not logged in. Please login again.",
          fetchFailed: "Failed to fetch referral data",
          general: "An error occurred while fetching referral code."
        },
        copySuccess: "Copied successfully!",
        copySuccessShort: "Code copied!"
      },
      tutorial: {
        headerTitle: "Joyin Tutorial Center",
        headerDesc: "Here you can learn how to use the chatbot, how to integrate into various platforms, and how to create attractive greetings. All guides are made simple so you can practice immediately.",
        search: "Search Tutorials...",
        view: "View",
        prev: "Previous",
        next: "Next",
        page: "Page {{current}} of {{total}}"
      },
      about: {
        hero: {
          title: "Let's Get to Know Joyin!",
          desc: "Welcome to Joyin, your business best friend in handling customer chats. We believe fast and warm communication makes customers more comfortable. Joyin is here to help you respond automatically 24 hours nonstop, so your business keeps running even when you're relaxing."
        },
        mascot: {
          p1: "Joyin is here to help you respond automatically for a full 24 hours, so your business keeps running even when you're relaxing. With our smart system, every interaction feels more personal without the hassle of replying one by one.",
          p2: "We want to create a lighter and more enjoyable customer experience. Every message is replied to quickly, yet still has a human touch that makes customers feel cared for."
        },
        joyCemerlang: {
          title: "Make Chat More Alive Without the Hassle",
          left: "No need to stay up late or keep staring at the screen just for a fast response. Joyin is ready to help you stay connected anytime, anywhere, without losing the warmth of conversation.",
          right: "With Joyin, just set it up once and let our chatbot work for you — answering automatically with a friendly and natural style, keeping customers close, and helping your business grow without the hassle."
        },
        growth: {
          title: "Always Room to Grow",
          body: "We believe every business has a unique way to connect with customers. That's why Joyin keeps growing to adapt to your business communication style — from casual chats to professional services, you can easily manage it all."
        },
        cta: {
          title: "Let's Grow with Joyin!",
          desc: "There's no such thing as too early to start using Joyin. Try it now and feel how easy it is to chat with customers without the hassle. Come join us and let Joyin help your business grow faster and closer!",
          contact: "Contact Us"
        }
      }
    },
  },
};

const STORAGE_KEY = "app_lang";

const saved = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
})();

const initialLang = saved || (navigator.language?.startsWith("en") ? "en" : "id");

i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: "id",
  interpolation: { escapeValue: false },
});

export const setAppLanguage = async (lng) => {
  const normalized = lng?.startsWith("en") ? "en" : "id";
  await i18n.changeLanguage(normalized);
  document.documentElement.lang = normalized;
  try {
    localStorage.setItem(STORAGE_KEY, normalized);
  } catch { }
};

export default i18n;
