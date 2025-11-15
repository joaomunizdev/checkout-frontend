import axios from "axios";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://api.example.com/api";

const api = axios.create({
  baseURL: API_BASE,
});

export default api;
