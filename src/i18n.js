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
      },
      obrolan: {
        title: "Obrolan",
        emptyState: {
          title: "Ups, kamu belum punya paket nih",
          desc1: "Yuk pilih paket dulu biar bisa lanjut menikmati semua fitur chatbot",
          desc2: "dan bikin bisnismu makin lancar",
          btn: "Pilih Paket"
        }
      },
      myPackages: {
        title: "Paket Saya",
        emptyState: {
          title: "Ups, kamu belum punya paket nih",
          desc1: "Yuk pilih paket dulu biar bisa lanjut menikmati semua fitur chatbot",
          desc2: "dan bikin bisnismu makin lancar",
          btn: "Pilih Paket"
        }
      },
      report: {
        title: "Laporan",
        emptyState: {
          title: "Ups, kamu belum punya paket nih",
          desc1: "Yuk pilih paket dulu biar bisa lanjut menikmati semua fitur chatbot",
          desc2: "dan bikin bisnismu makin lancar",
          btn: "Pilih Paket"
        }
      },
      botSettings: {
        title: "Pengaturan Bot",
        emptyState: {
          title: "Ups, kamu belum punya paket nih",
          desc1: "Yuk pilih paket dulu biar bisa lanjut menikmati semua fitur chatbot",
          desc2: "dan bikin bisnismu makin lancar",
          btn: "Pilih Paket"
        }
      },
      referralDashboard: {
        heroTitle: "Ajak Teman, Dapatkan Komisi",
        heroDesc: "Ajak temanmu pakai Joyin dan nikmati hadiahnya bareng-bareng! Makin banyak yang gabung, makin besar keuntungan yang kamu dapat.",
        yourCode: "Kode Referral Anda :",
        copy: "Salin",
        copied: "Tersalin",
        listTitle: "Daftar Referral",
        table: {
          no: "No",
          name: "Nama",
          email: "Email",
          date: "Waktu",
          status: "Status"
        },
        empty: "Belum ada referral"
      },
      obrolanBasic: {
        title: "Obrolan",
        online: "Online",
        offline: "Offline"
      },
      botSettingsBasic: {
        title: "Pengaturan Bot",
        tabs: {
          basic: "Pengaturan Dasar",
          reply: "Pesan & Balasan",
          persona: "Personality & Training",
          faq: "Manajemen FAQ"
        },
        basic: {
          botName: {
            label: "Nama Bot",
            desc: "Nama ini akan muncul di header chat pelanggan."
          },
          desc: {
            label: "Deskripsi Bot",
            desc: "Info singkat yang muncul di profil bot."
          },
          lang: "Bahasa Utama Bot",
          speed: {
            label: "Kecepatan Balas (detik)",
            desc: "Jeda waktu sebelum bot mengirim balasan (simulasi ngetik)."
          },
          emoji: {
            title: "Gunakan Emoji",
            desc: "Bot akan menyisipkan emoji agar lebih ekspresif."
          }
        },
        reply: {
          welcome: "Pesan Sambutan (Welcome Message)",
          timing: {
            title: "Kapan pesan sambutan dikirim?",
            first: {
              title: "Hanya saat pertama kali chat",
              desc: "Kirim cuma sekali seumur hidup per user."
            },
            every: {
              title: "Setiap sesi baru (setelah 24 jam)",
              desc: "Kirim ulang jika user chat lagi besoknya."
            }
          },
          default: "Balasan Default (Jika bot bingung)",
          closing: "Pesan Penutup (Closing)"
        },
        persona: {
          desc: {
            label: "Deskripsi Karakter & Peran",
            desc: "Jelaskan siapa bot ini. Contoh: 'Kamu adalah CS Joyin yang ramah dan suka membantu...'"
          },
          tone: {
            title: "Gaya Bahasa (Tone)",
            friendly: {
              title: "Ramah & Santai",
              desc: "Menggunakan bahasa gaul, emoji, dan sapaan hangat."
            },
            formal: {
              title: "Formal & Profesional",
              desc: "Bahasa baku, sopan, langsung pada inti masalah."
            }
          },
          example: {
            label: "Contoh Gaya Bicara (Opsional)",
            desc: "Berikan contoh kalimat agar AI meniru gaya bicaranya."
          },
          restrictions: {
            label: "Batasan & Larangan",
            desc: "Apa yang TIDAK BOLEH dibahas oleh bot? (Misal: kompetitor, politik, SARA)"
          }
        },
        faq: {
          addTitle: "Tambah FAQ Baru",
          editTitle: "Edit FAQ",
          question: "Pertanyaan (Keywords)",
          answer: "Jawaban Bot",
          addBtn: "Tambahkan ke List",
          saveBtn: "Simpan Perubahan",
          cancelBtn: "Batal Edit",
          listTitle: "Daftar FAQ",
          active: "Aktif",
          inactive: "Nonaktif",
          empty: "Belum ada FAQ yang ditambahkan.",
          toggleTitle: "Klik untuk ubah status",
          editLabel: "Edit FAQ",
          deleteLabel: "Hapus FAQ"
        },
        buttons: {
          save: "Simpan Semua Pengaturan",
          reset: "Reset"
        }
      },
      reportBasic: {
        title: "Laporan"
      },
      myPackagesBasic: {
        title: "Paket Basic",
        desc: "Atur dan cek status paket langganan Anda",
        stats: {
          duration: "Durasi Langganan",
          durationVal: "3 Bulan",
          active: "Masa Aktif",
          activeVal: "15 Hari Lagi",
          due: "Jatuh Tempo",
          dueVal: "1 Januari 2026"
        },
        buttons: {
          renew: "Perpanjang Paket",
          upgrade: "Upgrade Paket",
          cancel: "Batalkan Paket"
        },
        features: {
          title: "Fitur yang Didapatkan",
          f1: { title: "300 percakapan/bulan", desc: "Bisa melayani hingga 300 interaksi pelanggan setiap bulannya." },
          f2: { title: "Template balasan standar", desc: "Tersedia kumpulan template siap pakai untuk mempercepat balasan." },
          f3: { title: "Balasan otomatis 24/7", desc: "Chatbot aktif sepanjang hari untuk menjawab pesan kapan saja." },
          f4: { title: "Statistik bulanan sederhana", desc: "Lihat ringkasan performa chatbot secara jelas setiap bulan." },
          f5: { title: "Integrasi WhatsApp mudah", desc: "Cukup beberapa langkah untuk langsung terhubung ke WhatsApp Anda." },
          f6: { title: "FAQ dasar bawaan", desc: "Sudah dilengkapi jawaban FAQ umum agar chatbot bisa langsung bekerja." }
        }
      },
      referralBasic: {
        hero: {
          title: "Ajak Teman, Dapatkan Komisi",
          desc: "Ajak temanmu pakai Joyin dan nikmati hadiahnya bareng-bareng! Makin banyak yang gabung, makin besar keuntungan yang kamu dapat."
        },
        code: {
          label: "Kode Referral Anda :",
          placeholder: "Masukkan kode referral",
          copy: "Salin",
          copied: "Tersalin"
        },
        list: {
          title: "Daftar Referral",
          table: {
            no: "No",
            name: "Nama",
            email: "Email",
            time: "Waktu",
            status: "Status"
          }
        }
      },
      obrolanPro: {
        title: "Obrolan",
        online: "Online",
        offline: "Offline"
      },
      obrolanBisnis: {
        title: "Obrolan",
        online: "Online",
        offline: "Offline"
      },
      obrolanEnterprise: {
        title: "Obrolan",
        online: "Online",
        offline: "Offline"
      },
      botSettingsPro: {
        title: "Pengaturan Bot",
        tabs: {
          basic: "Pengaturan Dasar",
          reply: "Pesan & Balasan",
          persona: "Personality & Training",
          faq: "FAQ Management"
        },
        basic: {
          botName: {
            label: "Nama Bot",
            desc: "Nama ini akan muncul di header chat pelanggan."
          },
          desc: {
            label: "Deskripsi Bot",
            desc: "Info singkat yang muncul di profil bot."
          },
          lang: "Bahasa Utama Bot",
          speed: {
            label: "Kecepatan Respon",
            desc: "Membuat jeda pengetikan agar respon terasa lebih natural."
          },
          emoji: {
            title: "Gunakan Emoji",
            desc: "Buat pesan terasa lebih ekspresif dengan tambahan emoji."
          }
        },
        reply: {
          welcome: "Pesan Sambutan (Welcome Message)",
          timing: {
            title: "Waktu Kirim Pesan Sambutan",
            first: {
              title: "Hanya pada chat pertama",
              desc: "Pesan sambutan dikirim sekali saat customer pertama kali chat"
            },
            every: {
              title: "Setiap chat baru",
              desc: "Pesan sambutan dikirim setiap kali memulai percakapan baru"
            }
          },
          default: "Balasan Default (Ketika Bot Tidak Paham)",
          closing: "Pesan Penutup Chat"
        },
        persona: {
          desc: {
            label: "Personality Bot",
            desc: "Jelaskan karakter, gaya bicara, cara menyapa, dan peran utama bot."
          },
          tone: {
            title: "Gaya Komunikasi",
            friendly: {
              title: "Ramah & Santai",
              desc: "Gunakan bahasa sehari-hari, nada hangat, dan boleh memakai emoji seperlunya."
            },
            formal: {
              title: "Formal & Profesional",
              desc: "Gunakan bahasa baku & profesional, cocok untuk konteks bisnis dan perusahaan."
            }
          },
          example: {
            label: "Contoh Balasan Ideal",
            desc: "Berikan 1–2 contoh balasan yang mewakili gaya bahasa bot."
          },
          restrictions: {
            label: "Hal yang Tidak Boleh Dijawab / Disampaikan",
            desc: "Tuliskan topik yang harus dihindari bot (misalnya: politik, SARA, dsb)."
          }
        },
        faq: {
          addTitle: "Tambah FAQ Baru",
          editTitle: "Edit FAQ",
          question: "Pertanyaan",
          answer: "Jawaban",
          addBtn: "Tambah FAQ",
          saveBtn: "Simpan Perubahan",
          cancelBtn: "Batal",
          listTitle: "Daftar FAQ",
          active: "Aktif",
          inactive: "Nonaktif",
          empty: "Belum ada FAQ. Tambahkan pertanyaan baru di atas.",
          toggleTitle: "Klik untuk ubah status",
          editLabel: "Edit FAQ",
          deleteLabel: "Hapus FAQ"
        },
        buttons: {
          save: "Simpan Pengaturan",
          reset: "Reset"
        }
      },
      reportPro: {
        title: "Laporan"
      },
      myPackagesPro: {
        title: "Paket Pro",
        desc: "Atur dan cek status paket langganan Anda",
        stats: {
          duration: "Durasi Langganan",
          durationVal: "3 Bulan",
          active: "Masa Aktif",
          activeVal: "15 Hari Lagi",
          due: "Jatuh Tempo",
          dueVal: "1 Januari 2026"
        },
        buttons: {
          renew: "Perpanjang Paket",
          upgrade: "Upgrade Paket",
          cancel: "Batalkan Paket"
        },
        features: {
          title: "Fitur yang Didapatkan",
          f1: { title: "1000 percakapan/bulan", desc: "Bisa melayani hingga 1000 interaksi pelanggan setiap bulannya." },
          f2: { title: "Statistik & insight pelanggan", desc: "Lihat performa chat dan perilaku pelanggan untuk memahami kebutuhan mereka." },
          f3: { title: "Balasan otomatis 24/7", desc: "Chatbot aktif sepanjang hari untuk menjawab pesan kapan saja." },
          f4: { title: "Template balasan Custom", desc: "Buat dan atur template balasan sesuai gaya bisnis kamu." },
          f5: { title: "Notifikasi chat masuk", desc: "Dapatkan pemberitahuan instan tiap ada pelanggan yang mengirim pesan." },
          f6: { title: "Auto-update FAQ produk", desc: "FAQ langsung diperbarui otomatis setiap kali kamu ubah data produk." },
          f7: { title: "Pesan sambutan personal", desc: "Chatbot menyapa pelanggan dengan salam pembuka yang kamu tentukan sendiri." }
        }
      },
      referralPro: {
        hero: {
          title: "Ajak Teman, Dapatkan Komisi",
          desc: "Ajak temanmu pakai Joyin dan nikmati hadiahnya bareng-bareng! Makin banyak yang gabung, makin besar keuntungan yang kamu dapat."
        },
        code: {
          label: "Kode Referral Anda :",
          placeholder: "Masukkan kode referral",
          copy: "Salin",
          copied: "Tersalin",
          share: "Bagikan kode unikmu dan dapatkan bonusnya!"
        },
        list: {
          title: "Daftar Referral",
          table: {
            no: "No",
            name: "Nama",
            email: "Email",
            time: "Waktu",
            status: "Status"
          },
          empty: "Belum ada teman yang menggunakan referral Anda."
        }
      },
      botSettingsBisnis: {
        title: "Pengaturan Bot",
        tabs: {
          basic: "Pengaturan Dasar",
          reply: "Pesan & Balasan",
          persona: "Personality & Training",
          faq: "FAQ Management"
        },
        basic: {
          botName: {
            label: "Nama Bot",
            desc: "Nama ini akan muncul di header chat pelanggan."
          },
          desc: {
            label: "Deskripsi Bot",
            desc: "Info singkat yang muncul di profil bot."
          },
          lang: "Bahasa Utama Bot",
          speed: {
            label: "Kecepatan Respon",
            desc: "Membuat jeda pengetikan agar respon terasa lebih natural."
          },
          emoji: {
            title: "Gunakan Emoji",
            desc: "Buat pesan terasa lebih ekspresif dengan tambahan emoji."
          }
        },
        reply: {
          welcome: "Pesan Sambutan (Welcome Message)",
          timing: {
            title: "Waktu Kirim Pesan Sambutan",
            first: {
              title: "Hanya pada chat pertama",
              desc: "Pesan sambutan dikirim sekali saat customer pertama kali chat"
            },
            every: {
              title: "Setiap chat baru",
              desc: "Pesan sambutan dikirim setiap kali memulai percakapan baru"
            }
          },
          default: "Balasan Default (Ketika Bot Tidak Paham)",
          closing: "Pesan Penutup Chat"
        },
        persona: {
          desc: {
            label: "Personality Bot",
            desc: "Jelaskan karakter, gaya bicara, cara menyapa, dan peran utama bot."
          },
          tone: {
            title: "Gaya Komunikasi",
            friendly: {
              title: "Ramah & Santai",
              desc: "Gunakan bahasa sehari-hari, nada hangat, dan boleh memakai emoji seperlunya."
            },
            formal: {
              title: "Formal & Profesional",
              desc: "Gunakan bahasa baku & profesional, cocok untuk konteks bisnis dan perusahaan."
            }
          },
          example: {
            label: "Contoh Balasan Ideal",
            desc: "Berikan 1–2 contoh balasan yang mewakili gaya bahasa bot."
          },
          restrictions: {
            label: "Hal yang Tidak Boleh Dijawab / Disampaikan",
            desc: "Tuliskan topik yang harus dihindari bot (misalnya: politik, SARA, dsb)."
          }
        },
        faq: {
          addTitle: "Tambah FAQ Baru",
          editTitle: "Edit FAQ",
          question: "Pertanyaan",
          answer: "Jawaban",
          addBtn: "Tambah FAQ",
          saveBtn: "Simpan Perubahan",
          cancelBtn: "Batal",
          listTitle: "Daftar FAQ",
          active: "Aktif",
          inactive: "Nonaktif",
          empty: "Belum ada FAQ. Tambahkan pertanyaan baru di atas.",
          toggleTitle: "Klik untuk ubah status",
          editLabel: "Edit FAQ",
          deleteLabel: "Hapus FAQ"
        },
        buttons: {
          save: "Simpan Pengaturan",
          reset: "Reset"
        }
      },
      reportBisnis: {
        title: "Laporan"
      },
      myPackagesBisnis: {
        title: "Paket Bisnis",
        desc: "Atur dan cek status paket langganan Anda",
        stats: {
          duration: "Durasi Langganan",
          durationVal: "6 Bulan",
          active: "Masa Aktif",
          activeVal: "45 Hari Lagi",
          due: "Jatuh Tempo",
          dueVal: "20 Juni 2026"
        },
        buttons: {
          renew: "Perpanjang Paket",
          upgrade: "Upgrade Paket",
          cancel: "Batalkan Paket"
        },
        features: {
          title: "Fitur yang Didapatkan",
          f1: { title: "5.000 percakapan/bulan", desc: "Kapasitas chat lebih besar untuk menangani lonjakan pelanggan." },
          f2: { title: "Multi-admin WhatsApp", desc: "Akses WhatsApp bisnis bisa digunakan oleh beberapa admin sekaligus." },
          f3: { title: "Balasan otomatis 24/7", desc: "Layanan pelanggan selalu aktif tanpa henti, siang maupun malam." },
          f4: { title: "Template balasan premium", desc: "Akses ke template eksklusif yang lebih profesional dan variatif." },
          f5: { title: "FAQ otomatis & terjadwal", desc: "Atur jawaban otomatis yang bisa berubah sesuai jadwal tertentu." },
          f6: { title: "Pesan terjadwal promosi", desc: "Jadwalkan pesan broadcast atau promosi ke pelanggan secara otomatis." },
          f7: { title: "Laporan mingguan lengkap", desc: "Dapatkan analisis performa bot dan insight pelanggan setiap minggu." },
          f8: { title: "Prioritas dukungan teknis", desc: "Dapatkan bantuan teknis lebih cepat dari tim support kami." }
        }
      },
      referralBisnis: {
        hero: {
          title: "Ajak Teman, Dapatkan Komisi",
          desc: "Ajak temanmu pakai Joyin dan nikmati hadiahnya bareng-bareng! Makin banyak yang gabung, makin besar keuntungan yang kamu dapat."
        },
        code: {
          label: "Kode Referral Anda :",
          placeholder: "Masukkan kode referral",
          copy: "Salin",
          copied: "Tersalin",
          share: "Bagikan kode unikmu dan dapatkan bonusnya!"
        },
        list: {
          title: "Daftar Referral",
          table: {
            no: "No",
            name: "Nama",
            email: "Email",
            time: "Waktu",
            status: "Status"
          },
          empty: "Belum ada teman yang menggunakan referral Anda."
        }
      },
      botSettingsEnterprise: {
        title: "Pengaturan Bot",
        tabs: {
          basic: "Pengaturan Dasar",
          reply: "Pesan & Balasan",
          persona: "Personality & Training",
          faq: "FAQ Management"
        },
        basic: {
          botName: {
            label: "Nama Bot",
            desc: "Nama ini akan muncul di header chat pelanggan."
          },
          desc: {
            label: "Deskripsi Bot",
            desc: "Info singkat yang muncul di profil bot."
          },
          lang: "Bahasa Utama Bot",
          speed: {
            label: "Kecepatan Respon",
            desc: "Membuat jeda pengetikan agar respon terasa lebih natural."
          },
          emoji: {
            title: "Gunakan Emoji",
            desc: "Buat pesan terasa lebih ekspresif dengan tambahan emoji."
          }
        },
        reply: {
          welcome: "Pesan Sambutan (Welcome Message)",
          timing: {
            title: "Waktu Kirim Pesan Sambutan",
            first: {
              title: "Hanya pada chat pertama",
              desc: "Pesan sambutan dikirim sekali saat customer pertama kali chat"
            },
            every: {
              title: "Setiap chat baru",
              desc: "Pesan sambutan dikirim setiap kali memulai percakapan baru"
            }
          },
          default: "Balasan Default (Ketika Bot Tidak Paham)",
          closing: "Pesan Penutup Chat"
        },
        persona: {
          desc: {
            label: "Personality Bot",
            desc: "Jelaskan karakter, gaya bicara, cara menyapa, dan peran utama bot."
          },
          tone: {
            title: "Gaya Komunikasi",
            friendly: {
              title: "Ramah & Santai",
              desc: "Gunakan bahasa sehari-hari, nada hangat, dan boleh memakai emoji seperlunya."
            },
            formal: {
              title: "Formal & Profesional",
              desc: "Gunakan bahasa baku & profesional, cocok untuk konteks bisnis dan perusahaan."
            }
          },
          example: {
            label: "Contoh Balasan Ideal",
            desc: "Berikan 1–2 contoh balasan yang mewakili gaya bahasa bot."
          },
          restrictions: {
            label: "Hal yang Tidak Boleh Dijawab / Disampaikan",
            desc: "Tuliskan topik yang harus dihindari bot (misalnya: politik, SARA, dsb)."
          }
        },
        faq: {
          addTitle: "Tambah FAQ Baru",
          editTitle: "Edit FAQ",
          question: "Pertanyaan",
          answer: "Jawaban",
          addBtn: "Tambah FAQ",
          saveBtn: "Simpan Perubahan",
          cancelBtn: "Batal",
          listTitle: "Daftar FAQ",
          active: "Aktif",
          inactive: "Nonaktif",
          empty: "Belum ada FAQ. Tambahkan pertanyaan baru di atas.",
          toggleTitle: "Klik untuk ubah status",
          editLabel: "Edit FAQ",
          deleteLabel: "Hapus FAQ"
        },
        buttons: {
          save: "Simpan Pengaturan",
          reset: "Reset"
        }
      },
      reportEnterprise: {
        title: "Laporan"
      },
      myPackagesEnterprise: {
        title: "Paket Enterprise",
        desc: "Atur dan cek status paket langganan Anda",
        stats: {
          duration: "Durasi Langganan",
          durationVal: "12 Bulan",
          active: "Masa Aktif",
          activeVal: "150 Hari Lagi",
          due: "Jatuh Tempo",
          dueVal: "31 Desember 2030"
        },
        buttons: {
          renew: "Perpanjang Paket",
          upgrade: "Kelola Layanan",
          cancel: "Hubungi Sales"
        },
        features: {
          title: "Fitur yang Didapatkan",
          f1: { title: "Chat tanpa batas", desc: "Tidak ada batasan jumlah percakapan, bebas chat sepuasnya." },
          f2: { title: "Integrasi WhatsApp API penuh", desc: "Kases fitur WhatsApp API paling lengkap untuk skala enterprise." },
          f3: { title: "Balasan otomatis 24/7", desc: "Layanan pelanggan selalu aktif tanpa henti, kapan pun dibutuhkan." },
          f4: { title: "Statistik real-time & export data", desc: "Pantau performa secara langsung dan unduh data untuk analisis mendalam." },
          f5: { title: "Multi-admin + manajemen tim", desc: "Atur hak akses berbeda untuk setiap anggota tim atau divisi." },
          f6: { title: "Laporan custom & konsultasi setup", desc: "Laporan yang disesuaikan kebutuhan & bantuan setup dari tim ahli." },
          f7: { title: "Prioritas dukungan & SLA support", desc: "Jaminan layanan (SLA) dan dukungan prioritas untuk kendala teknis." },
          f8: { title: "Integrasi sistem internal (CRM/API)", desc: "Hubungkan chatbot dengan sistem CRM atau database perusahaan Anda." }
        }
      },
      referralEnterprise: {
        hero: {
          title: "Ajak Teman, Dapatkan Komisi",
          desc: "Ajak temanmu pakai Joyin dan nikmati hadiahnya bareng-bareng! Makin banyak yang gabung, makin besar keuntungan yang kamu dapat."
        },
        code: {
          label: "Kode Referral Anda :",
          placeholder: "Masukkan kode referral",
          copy: "Salin",
          copied: "Tersalin",
          share: "Bagikan kode unikmu dan dapatkan bonusnya!"
        },
        list: {
          title: "Daftar Referral",
          table: {
            no: "No",
            name: "Nama",
            email: "Email",
            time: "Waktu",
            status: "Status"
          },
          empty: "Belum ada teman yang menggunakan referral Anda."
        }
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
      },
      obrolan: {
        title: "Chat",
        emptyState: {
          title: "Oops, you don't have a plan yet",
          desc1: "Let's choose a plan first to continue enjoying all chatbot features",
          desc2: "and make your business smoother",
          btn: "Choose Plan"
        }
      },
      myPackages: {
        title: "My Packages",
        emptyState: {
          title: "Oops, you don't have a plan yet",
          desc1: "Let's choose a plan first to continue enjoying all chatbot features",
          desc2: "and make your business smoother",
          btn: "Choose Plan"
        }
      },
      report: {
        title: "Report",
        emptyState: {
          title: "Oops, you don't have a plan yet",
          desc1: "Let's choose a plan first to continue enjoying all chatbot features",
          desc2: "and make your business smoother",
          btn: "Choose Plan"
        }
      },
      botSettings: {
        title: "Bot Settings",
        emptyState: {
          title: "Oops, you don't have a plan yet",
          desc1: "Let's choose a plan first to continue enjoying all chatbot features",
          desc2: "and make your business smoother",
          btn: "Choose Plan"
        }
      },
      referralDashboard: {
        heroTitle: "Invite Friends, Get Commission",
        heroDesc: "Invite your friends to use Joyin and enjoy the rewards together! The more people join, the bigger profit you get.",
        yourCode: "Your Referral Code :",
        copy: "Copy",
        copied: "Copied",
        listTitle: "Referral List",
        table: {
          no: "No",
          name: "Name",
          email: "Email",
          date: "Time",
          status: "Status"
        },
        empty: "No referrals yet"
      },
      obrolanBasic: {
        title: "Chat",
        online: "Online",
        offline: "Offline"
      },
      botSettingsBasic: {
        title: "Bot Settings",
        tabs: {
          basic: "Basic",
          reply: "Messages & Replies",
          persona: "Personality & Training",
          faq: "FAQ Management"
        },
        basic: {
          botName: {
            label: "Bot Name",
            desc: "This name will appear in the customer chat header."
          },
          desc: {
            label: "Bot Description",
            desc: "Short info that appears in the bot profile."
          },
          lang: "Bot Primary Language",
          speed: {
            label: "Reply Speed (seconds)",
            desc: "Delay before bot sends a reply (typing simulation)."
          },
          emoji: {
            title: "Use Emoji",
            desc: "Bot will insert emojis to be more expressive."
          }
        },
        reply: {
          welcome: "Welcome Message",
          timing: {
            title: "When is the welcome message sent?",
            first: {
              title: "Only on first chat",
              desc: "Send only once in a lifetime per user."
            },
            every: {
              title: "Every new session (after 24 hours)",
              desc: "Resend if user chats again the next day."
            }
          },
          default: "Default Reply (If bot is confused)",
          closing: "Closing Message"
        },
        persona: {
          desc: {
            label: "Character & Role Description",
            desc: "Explain who this bot is. Example: 'You are a friendly Joyin CS who likes to help...'"
          },
          tone: {
            title: "Language Style (Tone)",
            friendly: {
              title: "Friendly & Casual",
              desc: "Using slang, emojis, and warm greetings."
            },
            formal: {
              title: "Formal & Professional",
              desc: "Standard, polite language, straight to the point."
            }
          },
          example: {
            label: "Speech Style Example (Optional)",
            desc: "Provide example sentences for AI to mimic its speech style."
          },
          restrictions: {
            label: "Restrictions & Prohibitions",
            desc: "What MUST NOT be discussed by the bot? (e.g., competitors, politics, SARA)"
          }
        },
        faq: {
          addTitle: "Add New FAQ",
          editTitle: "Edit FAQ",
          question: "Question (Keywords)",
          answer: "Bot Answer",
          addBtn: "Add to List",
          saveBtn: "Save Changes",
          cancelBtn: "Cancel",
          listTitle: "FAQ List",
          active: "Active",
          inactive: "Inactive",
          empty: "No FAQs added yet.",
          toggleTitle: "Click to toggle status",
          editLabel: "Edit FAQ",
          deleteLabel: "Delete FAQ"
        },
        buttons: {
          save: "Save All Settings",
          reset: "Reset"
        }
      },
      reportBasic: {
        title: "Report"
      },
      myPackagesBasic: {
        title: "Basic Plan",
        desc: "Manage and check your subscription plan status",
        stats: {
          duration: "Subscription Duration",
          durationVal: "3 Months",
          active: "Active Period",
          activeVal: "15 Days Left",
          due: "Due Date",
          dueVal: "January 1, 2026"
        },
        buttons: {
          renew: "Renew Plan",
          upgrade: "Upgrade Plan",
          cancel: "Cancel Plan"
        },
        features: {
          title: "Features You Get",
          f1: { title: "300 conversations/month", desc: "Serve up to 300 customer interactions every month." },
          f2: { title: "Standard reply templates", desc: "Available ready-to-use templates to speed up replies." },
          f3: { title: "24/7 Auto reply", desc: "Chatbot is active all day to answer messages anytime." },
          f4: { title: "Simple monthly stats", desc: "View chatbot performance summary clearly every month." },
          f5: { title: "Easy WhatsApp Integration", desc: "Just a few steps to connect directly to your WhatsApp." },
          f6: { title: "Built-in basic FAQ", desc: "Equipped with common FAQ answers so the chatbot can work immediately." }
        }
      },
      referralBasic: {
        hero: {
          title: "Invite Friends, Get Commission",
          desc: "Invite your friends to use Joyin and enjoy the rewards together! The more people join, the bigger profit you get."
        },
        code: {
          label: "Your Referral Code :",
          placeholder: "Enter referral code",
          copy: "Copy",
          copied: "Copied"
        },
        list: {
          title: "Referral List",
          table: {
            no: "No",
            name: "Name",
            email: "Email",
            time: "Time",
            status: "Status"
          },
          empty: "No referrals yet."
        }
      },
      botSettingsPro: {
        title: "Bot Settings",
        tabs: {
          basic: "Basic Settings",
          reply: "Messages & Replies",
          persona: "Personality & Training",
          faq: "FAQ Management"
        },
        basic: {
          botName: {
            label: "Bot Name",
            desc: "This name will appear in the customer chat header."
          },
          desc: {
            label: "Bot Description",
            desc: "Short info that appears in the bot profile."
          },
          lang: "Bot Primary Language",
          speed: {
            label: "Response Speed",
            desc: "Create typing pause to make response feel more natural."
          },
          emoji: {
            title: "Use Emoji",
            desc: "Make messages feel more expressive with additional emojis."
          }
        },
        reply: {
          welcome: "Welcome Message",
          timing: {
            title: "Welcome Message Timing",
            first: {
              title: "Only on first chat",
              desc: "Welcome message sent once when customer chats for the first time"
            },
            every: {
              title: "Every new chat",
              desc: "Welcome message sent every time a new conversation starts"
            }
          },
          default: "Default Reply (When Bot Doesn't Understand)",
          closing: "Chat Closing Message"
        },
        persona: {
          desc: {
            label: "Bot Personality",
            desc: "Explain character, speaking style, how to greet, and main role of the bot."
          },
          tone: {
            title: "Communication Style",
            friendly: {
              title: "Friendly & Casual",
              desc: "Use daily language, warm tone, and may use emojis as needed."
            },
            formal: {
              title: "Formal & Professional",
              desc: "Use standard & professional language, suitable for business context."
            }
          },
          example: {
            label: "Ideal Reply Example",
            desc: "Provide 1–2 reply examples representing the bot's language style."
          },
          restrictions: {
            label: "Things Not To Answer / Say",
            desc: "Write topics the bot must avoid (e.g., politics, SARA, etc)."
          }
        },
        faq: {
          addTitle: "Add New FAQ",
          editTitle: "Edit FAQ",
          question: "Question",
          answer: "Answer",
          addBtn: "Add FAQ",
          saveBtn: "Save Changes",
          cancelBtn: "Cancel",
          listTitle: "FAQ List",
          active: "Active",
          inactive: "Inactive",
          empty: "No FAQ yet. Add a new question above.",
          toggleTitle: "Click to toggle status",
          editLabel: "Edit FAQ",
          deleteLabel: "Delete FAQ"
        },
        buttons: {
          save: "Save Settings",
          reset: "Reset"
        }
      },
      reportPro: {
        title: "Report"
      },
      myPackagesPro: {
        title: "Pro Plan",
        desc: "Manage and check your subscription plan status",
        stats: {
          duration: "Subscription Duration",
          durationVal: "3 Months",
          active: "Active Period",
          activeVal: "15 Days Left",
          due: "Due Date",
          dueVal: "January 1, 2026"
        },
        buttons: {
          renew: "Renew Plan",
          upgrade: "Upgrade Plan",
          cancel: "Cancel Plan"
        },
        features: {
          title: "Features You Get",
          f1: { title: "1000 conversations/month", desc: "Serve up to 1000 customer interactions every month." },
          f2: { title: "Customer stats & insights", desc: "View chat performance and customer behavior to understand their needs." },
          f3: { title: "24/7 Auto reply", desc: "Chatbot is active all day to answer messages anytime." },
          f4: { title: "Custom reply templates", desc: "Create and organize reply templates according to your business style." },
          f5: { title: "Incoming chat notifications", desc: "Get instant notifications whenever a customer sends a message." },
          f6: { title: "Auto-update FAQ product", desc: "FAQ is automatically updated whenever you change product data." },
          f7: { title: "Personal welcome message", desc: "Chatbot greets customers with a welcome greeting you define yourself." }
        }
      },
      referralPro: {
        hero: {
          title: "Invite Friends, Get Commission",
          desc: "Invite your friends to use Joyin and enjoy the rewards together! The more people join, the bigger profit you get."
        },
        code: {
          label: "Your Referral Code :",
          placeholder: "Enter referral code",
          copy: "Copy",
          copied: "Copied",
          share: "Share your unique code and get the bonus!"
        },
        list: {
          title: "Referral List",
          table: {
            no: "No",
            name: "Name",
            email: "Email",
            time: "Time",
            status: "Status"
          },
          empty: "No friends have used your referral yet."
        }
      },
      botSettingsBisnis: {
        title: "Bot Settings",
        tabs: {
          basic: "Basic Settings",
          reply: "Messages & Replies",
          persona: "Personality & Training",
          faq: "FAQ Management"
        },
        basic: {
          botName: {
            label: "Bot Name",
            desc: "This name will appear in the customer chat header."
          },
          desc: {
            label: "Bot Description",
            desc: "Short info that appears in the bot profile."
          },
          lang: "Bot Primary Language",
          speed: {
            label: "Response Speed",
            desc: "Create typing pause to make response feel more natural."
          },
          emoji: {
            title: "Use Emoji",
            desc: "Make messages feel more expressive with additional emojis."
          }
        },
        reply: {
          welcome: "Welcome Message",
          timing: {
            title: "Welcome Message Timing",
            first: {
              title: "Only on first chat",
              desc: "Welcome message sent once when customer chats for the first time"
            },
            every: {
              title: "Every new chat",
              desc: "Welcome message sent every time a new conversation starts"
            }
          },
          default: "Default Reply (When Bot Doesn't Understand)",
          closing: "Chat Closing Message"
        },
        persona: {
          desc: {
            label: "Bot Personality",
            desc: "Explain character, speaking style, how to greet, and main role of the bot."
          },
          tone: {
            title: "Communication Style",
            friendly: {
              title: "Friendly & Casual",
              desc: "Use daily language, warm tone, and may use emojis as needed."
            },
            formal: {
              title: "Formal & Professional",
              desc: "Use standard & professional language, suitable for business context."
            }
          },
          example: {
            label: "Ideal Reply Example",
            desc: "Provide 1–2 reply examples representing the bot's language style."
          },
          restrictions: {
            label: "Things Not To Answer / Say",
            desc: "Write topics the bot must avoid (e.g., politics, SARA, etc)."
          }
        },
        faq: {
          addTitle: "Add New FAQ",
          editTitle: "Edit FAQ",
          question: "Question",
          answer: "Answer",
          addBtn: "Add FAQ",
          saveBtn: "Save Changes",
          cancelBtn: "Cancel",
          listTitle: "FAQ List",
          active: "Active",
          inactive: "Inactive",
          empty: "No FAQ yet. Add a new question above.",
          toggleTitle: "Click to toggle status",
          editLabel: "Edit FAQ",
          deleteLabel: "Delete FAQ"
        },
        buttons: {
          save: "Save Settings",
          reset: "Reset"
        }
      },
      reportBisnis: {
        title: "Report"
      },
      myPackagesBisnis: {
        title: "Business Plan",
        desc: "Manage and check your subscription plan status",
        stats: {
          duration: "Subscription Duration",
          durationVal: "6 Months",
          active: "Active Period",
          activeVal: "45 Days Left",
          due: "Due Date",
          dueVal: "June 20, 2026"
        },
        buttons: {
          renew: "Renew Plan",
          upgrade: "Upgrade Plan",
          cancel: "Cancel Plan"
        },
        features: {
          title: "Features You Get",
          f1: { title: "5,000 conversations/month", desc: "Larger chat capacity to handle customer surges." },
          f2: { title: "Multi-admin WhatsApp", desc: "Business WhatsApp access can be used by multiple admins simultaneously." },
          f3: { title: "24/7 Auto reply", desc: "Customer service always active non-stop, day or night." },
          f4: { title: "Premium reply templates", desc: "Access to exclusive templates that are more professional and varied." },
          f5: { title: "Auto & scheduled FAQ", desc: "Set automatic answers that can change according to a specific schedule." },
          f6: { title: "Scheduled promo messages", desc: "Schedule broadcast messages or promotions to customers automatically." },
          f7: { title: "Complete weekly reports", desc: "Get bot performance analysis and customer insights every week." },
          f8: { title: "Priority technical support", desc: "Get technical help faster from our support team." }
        }
      },
      referralBisnis: {
        hero: {
          title: "Invite Friends, Get Commission",
          desc: "Invite your friends to use Joyin and enjoy the rewards together! The more people join, the bigger profit you get."
        },
        code: {
          label: "Your Referral Code :",
          placeholder: "Enter referral code",
          copy: "Copy",
          copied: "Copied",
          share: "Share your unique code and get the bonus!"
        },
        list: {
          title: "Referral List",
          table: {
            no: "No",
            name: "Name",
            email: "Email",
            time: "Time",
            status: "Status"
          },
          empty: "No friends have used your referral yet."
        }
      },
      botSettingsEnterprise: {
        title: "Bot Settings",
        tabs: {
          basic: "Basic Settings",
          reply: "Messages & Replies",
          persona: "Personality & Training",
          faq: "FAQ Management"
        },
        basic: {
          botName: {
            label: "Bot Name",
            desc: "This name will appear in the customer chat header."
          },
          desc: {
            label: "Bot Description",
            desc: "Short info that appears in the bot profile."
          },
          lang: "Bot Primary Language",
          speed: {
            label: "Response Speed",
            desc: "Create typing pause to make response feel more natural."
          },
          emoji: {
            title: "Use Emoji",
            desc: "Make messages feel more expressive with additional emojis."
          }
        },
        reply: {
          welcome: "Welcome Message",
          timing: {
            title: "Welcome Message Timing",
            first: {
              title: "Only on first chat",
              desc: "Welcome message sent once when customer chats for the first time"
            },
            every: {
              title: "Every new chat",
              desc: "Welcome message sent every time a new conversation starts"
            }
          },
          default: "Default Reply (When Bot Doesn't Understand)",
          closing: "Chat Closing Message"
        },
        persona: {
          desc: {
            label: "Bot Personality",
            desc: "Explain character, speaking style, how to greet, and main role of the bot."
          },
          tone: {
            title: "Communication Style",
            friendly: {
              title: "Friendly & Casual",
              desc: "Use daily language, warm tone, and may use emojis as needed."
            },
            formal: {
              title: "Formal & Professional",
              desc: "Use standard & professional language, suitable for business context."
            }
          },
          example: {
            label: "Ideal Reply Example",
            desc: "Provide 1–2 reply examples representing the bot's language style."
          },
          restrictions: {
            label: "Things Not To Answer / Say",
            desc: "Write topics the bot must avoid (e.g., politics, SARA, etc)."
          }
        },
        faq: {
          addTitle: "Add New FAQ",
          editTitle: "Edit FAQ",
          question: "Question",
          answer: "Answer",
          addBtn: "Add FAQ",
          saveBtn: "Save Changes",
          cancelBtn: "Cancel",
          listTitle: "FAQ List",
          active: "Active",
          inactive: "Inactive",
          empty: "No FAQ yet. Add a new question above.",
          toggleTitle: "Click to toggle status",
          editLabel: "Edit FAQ",
          deleteLabel: "Delete FAQ"
        },
        buttons: {
          save: "Save Settings",
          reset: "Reset"
        }
      },
      reportEnterprise: {
        title: "Report"
      },
      myPackagesEnterprise: {
        title: "Enterprise Plan",
        desc: "Manage and check your subscription plan status",
        stats: {
          duration: "Subscription Duration",
          durationVal: "12 Months",
          active: "Active Period",
          activeVal: "150 Days Left",
          due: "Due Date",
          dueVal: "December 31, 2030"
        },
        buttons: {
          renew: "Renew Plan",
          upgrade: "Manage Service",
          cancel: "Contact Sales"
        },
        features: {
          title: "Features You Get",
          f1: { title: "Unlimited chats", desc: "No limit on number of conversations, chat as much as freely." },
          f2: { title: "Full WhatsApp API Integration", desc: "Access the most complete WhatsApp API features for enterprise scale." },
          f3: { title: "24/7 Auto reply", desc: "Customer service always active non-stop, whenever needed." },
          f4: { title: "Real-time stat & data export", desc: "Monitor performance directly and download data for in-depth analysis." },
          f5: { title: "Multi-admin + team management", desc: "Set different access rights for each team member or division." },
          f6: { title: "Custom report & setup consultation", desc: "Report customized to needs & setup help from expert team." },
          f7: { title: "Priority support & SLA support", desc: "Service Level Agreement (SLA) guarantee and priority support for technical issues." },
          f8: { title: "Internal system integration (CRM/API)", desc: "Connect chatbot with your company's CRM system or database." }
        }
      },
      referralEnterprise: {
        hero: {
          title: "Invite Friends, Get Commission",
          desc: "Invite your friends to use Joyin and enjoy the rewards together! The more people join, the bigger profit you get."
        },
        code: {
          label: "Your Referral Code :",
          placeholder: "Enter referral code",
          copy: "Copy",
          copied: "Copied",
          share: "Share your unique code and get the bonus!"
        },
        list: {
          title: "Referral List",
          table: {
            no: "No",
            name: "Name",
            email: "Email",
            time: "Time",
            status: "Status"
          },
          empty: "No friends have used your referral yet."
        }
      },
      obrolanPro: {
        title: "Chat",
        online: "Online",
        offline: "Offline"
      },
      obrolanBisnis: {
        title: "Chat",
        online: "Online",
        offline: "Offline"
      },
      obrolanEnterprise: {
        title: "Chat",
        online: "Online",
        offline: "Offline"
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
