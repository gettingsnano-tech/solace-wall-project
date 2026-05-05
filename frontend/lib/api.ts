import axios from "axios";

// On the client, we use relative URLs to trigger Next.js rewrites.
// On the server (SSR), we must use the absolute URL from the environment.
let apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

if (apiUrl && !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
  apiUrl = `http://${apiUrl}`;
}

const API_URL = typeof window !== "undefined" 
  ? "" 
  : (apiUrl || "");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;
