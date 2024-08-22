import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// Learning_Contents
export async function getAllContents() {
  try {
    const response = await api.get("/learning/contents");
    return response.data;
  } catch (error) {
    console.error("Error getAllContents:", error);
    throw error;
  }
}

export async function getContentsByLectureId(lectureId) {
  try {
    const response = await api.get(`/learning/contents/${lectureId}`);
    return response.data;
  } catch (error) {
    console.error("Error getContentsByLectureId:", error);
    throw error;
  }
}

export async function getContentByLectureIdBySeq(lectureId, seq) {
  try {
    const response = await api.get(`/learning/contents/${lectureId}/${seq}`);
    return response.data;
  } catch (error) {
    console.error("Error getContentByLectureIdBySeq:", error);
    throw error;
  }
}

// Learning_Review
export async function getAllReview() {
  try {
    const response = await api.get("/learning/review");
    return response.data;
  } catch (error) {
    console.error("Error getAllReview:", error);
    throw error;
  }
}

export async function getReviewByLectureId(lectureId) {
  try {
    const response = await api.get(`/learning/review/${lectureId}`);
    return response.data;
  } catch (error) {
    console.error("Error getReviewByLectureId:", error);
    throw error;
  }
}

export async function getReviewByLectureIdUserId(lectureId, userId) {
  try {
    const response = await api.get(`/learning/review/${lectureId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getReviewByLectureIdUserId:", error);
    throw error;
  }
}

export async function saveReview(learningReview) {
  try {
    const response = await api.post("/learning/saveReview", learningReview);
    return response.data;
  } catch (error) {
    console.error("Error saveReview:", error);
    throw error;
  }
}
