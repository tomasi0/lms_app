import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export async function getCategory() {
  try {
    const response = await api.get("/category");
    return response.data;
  } catch (error) {
    console.error("Error getCategory:", error);
  }
}
