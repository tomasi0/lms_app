import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// Code_class
export async function getAllCodeClass() {
  try {
    const response = await api.get("/lms/code_class");
    return response.data;
  } catch (error) {
    console.error("Error getAllCodeClass:", error);
  }
}

// Code_class_detail
export async function getAllCodeClassDetail() {
  try {
    const response = await api.get("/code/codeClassDetail");
    return response.data;
  } catch (error) {
    console.error("Error getAllCodeClassDetail:", error);
  }
}

export async function saveCodeClassDetail(codeClassDetail) {
  try {
    const response = await api.post(codeClassDetail);
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error("Error saveCodeClassDetail:", error);
  }
}
