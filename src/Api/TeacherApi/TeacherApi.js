import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export async function getAllTeachers() {
  try {
    const response = await api.get("/teacher");
    return response.data;
  } catch (error) {
    console.error("Error fetching all teachers:", error);
    throw error;
  }
}

export async function getTeacherByLectureId(lectureId) {
  try {
    const response = await api.get(`/teacher/${lectureId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching teachers by lecture ID:", error);
    throw error;
  }
}

export async function saveTeacher(teacher) {
  try {
    const response = await api.post("/teacher/saveTeacher", teacher);
    return response.data;
  } catch (error) {
    console.error("Error saving teacher:", error);
    throw error;
  }
}
