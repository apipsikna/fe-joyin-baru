import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const user = params.get("user");

    if (accessToken && refreshToken && user) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", user); // sudah dalam bentuk string JSON dari backend
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div>Logging in with Google...</div>;
}