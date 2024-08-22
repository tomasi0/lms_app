import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// Lecture
export async function getAllLecture(search = "", category = "") {
  try {
    const queryParams = new URLSearchParams();
    if (search) queryParams.append("search", search);
    if (category) queryParams.append("category", category);

    const response = await api.get(`/lecture?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error getLectures:", error);
  }
}

export async function getCategoryLecture(keyword) {
  try {
    const response = await api.get(`/lecture/category/${keyword}`);
    return response.data;
  } catch (error) {
    console.error("Error getCategoryLecture:", error);
  }
}

export async function getLecture(lectureId) {
  try {
    const response = await api.get(`/lecture/${lectureId}`);
    return response.data;
  } catch (error) {
    console.error("Error getLecture:", error);
  }
}

export async function getLectureCategoryCountJPQL() {
  try {
    const response = await api.get("/lecture/categoryCount");
    return response.data;
  } catch (error) {
    console.error("Error getLectureCategoryCountJPQL:", error);
  }
}

export async function saveLecture(lectureList) {
  try {
    const response = await api.post("/lecture/lectureList", lectureList, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error saveLecture:", error);
  }
}

// Lecture_Progress
export async function updateLearningTime(lpSeq, learningTime) {
  try {
    const response = await api.put(
      `/progress/updateLearningTime/${lpSeq}/${learningTime}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updateLearningTime:", error);
    throw error;
  }
}

export async function getAllLectureProgress() {
  try {
    const response = await api.get("/progress/getAllLectureProgress");
    return response.data;
  } catch (error) {
    console.error("Error getAllLectureProgress:", error);
    throw error;
  }
}

export async function getLectureProgressDetails(userId, lectureId) {
  try {
    const response = await api.get(
      `/lms/lecture/progress/${userId}/${lectureId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getLectureProgressDetails:", error);
    throw error;
  }
}
