import axios from "axios";

export const http = axios.create({
  baseURL: "https://stikynotes.onrender.com/api",
  timeout: 10000,
});
