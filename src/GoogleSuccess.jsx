import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // pastikan kamu pakai react-router

export default function GoogleSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken) {
      // Simpan token, misal di localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Redirect ke halaman utama atau dashboard
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);

  return <p>Logging in with Google...</p>;
}
