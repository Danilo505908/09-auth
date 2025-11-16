import axios from "axios";

// Client API should call Next.js API routes, not the external backend directly
const baseURL = "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});