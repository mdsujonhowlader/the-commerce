export const env = {
  baseUrl:
    (import.meta.env.VITE_BACKEND_URL ??
      "https://the-commerce-1.onrender.com") ||
    "http://localhost:5000",
};
