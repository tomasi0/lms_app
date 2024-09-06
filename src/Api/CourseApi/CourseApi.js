import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// Course_History
export async function getAllCourseHistory() {
  try {
    const response = await api.get("/course/history");
    return response.data;
  } catch (error) {
    console.error("Error getAllCourseHistory:", error);
  }
}

// Course_Registration
export async function deleteCourseRegistration(userId, lectureId) {
  try {
    await api.delete(`/course/delCourseRegistration/${userId}/${lectureId}`);
  } catch (error) {
    console.error("Error deleteCourseRegistration:", error);
  }
}

export async function getAllRegistration() {
  try {
    const response = await api.get("/course/registration");
    return response.data;
  } catch (error) {
    console.error("Error getAllRegistration:", error);
    throw error;
  }
}

export async function getLectureStatusCountJPQL(userId) {
  try {
    const response = await api.get(`/course/lectureStatusCount/id/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getLectureStatusCountJPQL:", error);
    throw error;
  }
}

export async function saveCourseRegistration(courseRegistration) {
  try {
    const response = await api.post(
      "/course/saveCourseRegistration",
      courseRegistration
    );
    return response.data;
  } catch (error) {
    console.error("Error saveCourseRegistration:", error);
    throw error;
  }
}

export async function getCourseRegistraionById(userId, lectureId) {
  try {
    const response = await api.get(
      `/course/registration/${userId}/${lectureId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getCourseRegistraionById:", error);
    throw error;
  }
}
