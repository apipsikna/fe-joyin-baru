// src/components/dashboard/ProfileModal.jsx
import { FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { resolveAvatarUrl } from "../../utils/avatar";

export default function ProfileModal({ profile, setProfile, onClose }) {
  const { updateProfile, uploadAvatar } = useAuth();

  const [tempProfile, setTempProfile] = useState(profile || {});
  const [saving, setSaving] = useState(false);

  // preview avatar
  const [avatarPreview, setAvatarPreview] = useState(
    resolveAvatarUrl(profile?.avatar)
  );

  // Ambil nilai awal dari profile hanya sekali saat modal dibuka
  useEffect(() => {
    setTempProfile(profile || {});
    setAvatarPreview(resolveAvatarUrl(profile?.avatar));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ⬅️ DI SINI kuncinya, bukan [profile] lagi

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("[ProfileModal] avatar dipilih:", file);
    // preview lokal dulu
    setAvatarPreview(URL.createObjectURL(file));

    try {
      // upload ke BE
      const newAvatar = await uploadAvatar(file); // akan return "/uploads/xxx.jpg"
      console.log("[ProfileModal] uploadAvatar return =", newAvatar);

      if (newAvatar && typeof newAvatar === "string") {
        const updated = {
          ...tempProfile,
          avatar: newAvatar,
        };

        setTempProfile(updated);
        if (typeof setProfile === "function") {
          setProfile(updated); // update parent (dashboard)
        }

        // pakai URL final dari server
        setAvatarPreview(resolveAvatarUrl(newAvatar));
      }
    } catch (err) {
      console.error("❌ Error upload avatar:", err);
      alert(
        err?.response?.data?.message || err.message || "Gagal upload avatar"
      );
      // kalau gagal, balik ke avatar lama
      setAvatarPreview(resolveAvatarUrl(profile?.avatar));
    }
  };

  const handleSave = async () => {
    console.log("[ProfileModal] handleSave dipanggil");
    setSaving(true);
    try {
      const payload = {
        name: tempProfile.name || "",
        phone: tempProfile.phone || "",
        birthDate: tempProfile.birthDate || "",
      };

      // update data teks ke BE
      await updateProfile(payload);

      // update parent state (nama, telepon, tgl lahir)
      if (typeof setProfile === "function") {
        setProfile((prev) => ({
          ...(prev || {}),
          ...payload,
          avatar: (prev && prev.avatar) || tempProfile.avatar,
        }));
      }

      onClose();
    } catch (err) {
      console.error("❌ Error update profile:", err);
      alert(
        err?.response?.data?.message || err.message || "Gagal update profil"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
      <div className="bg-white rounded-3xl p-8 w-full max-w-3xl relative">
        {/* Tombol Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-6 text-gray-400 hover:text-gray-600 text-xl"
        >
          <FaTimes />
        </button>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-28 h-28">
            <img
              src={avatarPreview}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow"
            />

            {/* Tombol ganti foto */}
            <label className="absolute bottom-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-green-600">
              Ganti foto
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <h3 className="mt-4 text-lg font-semibold">
            {tempProfile.name || "Enter Your Name"}
          </h3>
          <p className="text-gray-500 text-sm">{tempProfile.email}</p>
        </div>

        {/* Form dua kolom */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-6 mb-8">
          {/* Nama */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Nama</label>
            <input
              type="text"
              value={tempProfile.name || ""}
              onChange={(e) =>
                setTempProfile({ ...tempProfile, name: e.target.value })
              }
              className="w-full border-b border-gray-300 focus:border-green-500 outline-none py-1"
              placeholder="Enter Your Name"
            />
          </div>

          {/* No Telepon */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              No. Telepon
            </label>
            <input
              type="text"
              value={tempProfile.phone || ""}
              onChange={(e) =>
                setTempProfile({ ...tempProfile, phone: e.target.value })
              }
              className="w-full border-b border-gray-300 focus:border-green-500 outline-none py-1"
              placeholder="+62 812 3456 7890"
            />
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={tempProfile.email || ""}
              readOnly
              className="w-full border-b border-gray-300 bg-gray-100 py-1 cursor-not-allowed"
            />
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Tanggal Lahir
            </label>
            <input
              type="date"
              value={tempProfile.birthDate || ""}
              onChange={(e) =>
                setTempProfile({ ...tempProfile, birthDate: e.target.value })
              }
              className="w-full border-b border-gray-300 focus:border-green-500 outline-none py-1"
            />
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`${
              saving ? "bg-gray-400" : "bg-green-400 hover:bg-gray-500"
            } text-white px-8 py-2 rounded-full font-medium shadow`}
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
