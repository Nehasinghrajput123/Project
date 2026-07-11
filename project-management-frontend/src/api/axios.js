import axios from "axios";

const api = axios.create({
  baseURL: "https://project-management-backend.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("ehduehdueh",token)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;