import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// Lms_Events
export async function createLmsEvent(lmsEvent) {
  try {
    const response = await api.post("/api/lmsevents", lmsEvent);
    return response.data;
  } catch (error) {
    console.error("Error createLmsEvent:", error);
    throw error;
  }
}

export async function getAllLmsEvents(page = 1, size = 10) {
  try {
    const response = await api.get("/api/lmsevents", {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error getAllLmsEvents:", error);
    throw error;
  }
}

export async function getLmsEventById(id) {
  try {
    const response = await api.get(`/api/lmsevents/id/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getLmsEventById:", error);
    throw error;
  }
}

export async function updateLmsEvent(id, lmsEventDetails) {
  try {
    const response = await api.put(`/api/lmsevents/id/${id}`, lmsEventDetails);
    return response.data;
  } catch (error) {
    console.error("Error updateLmsEvent:", error);
    throw error;
  }
}

export async function deleteLmsEvent(id) {
  try {
    await api.delete(`/api/lmsevents/id/${id}`);
  } catch (error) {
    console.error("Error deleteLmsEvent:", error);
    throw error;
  }
}

export async function getAllEvent() {
  try {
    const response = await api.get("/api/lmsevents/event");
    return response.data;
  } catch (error) {
    console.error("Error getAllEvent", error);
    throw error;
  }
}

// Lms_Notices
export async function getAllNotices(page = 0, size = 5) {
  try {
    const response = await api.get("/api/notices", {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error getAllNotices:", error);
    throw error;
  }
}

export async function getNoticeById(id) {
  try {
    const response = await api.get(`/api/notices/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getNoticeById:", error);
    throw error;
  }
}

export async function createNotice(notice) {
  try {
    const response = await api.post("/api/notices", notice);
    return response.data;
  } catch (error) {
    console.error("Error createNotice:", error);
    throw error;
  }
}

export async function updateNotice(id, notice) {
  try {
    const response = await api.put(`/api/notices/${id}`, notice);
    return response.data;
  } catch (error) {
    console.error("Error updateNotice:", error);
    throw error;
  }
}

export async function deleteNotice(id) {
  try {
    await api.delete(`/api/notices/${id}`);
  } catch (error) {
    console.error("Error deleteNotice:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get("/api/notices/current");
    return response.data;
  } catch (error) {
    console.error("Error getCurrentUser:", error);
    throw error;
  }
}

// Lms_Qa
export async function getAllQuestions(page = 0, size = 5, category = null) {
  try {
    const response = await api.get("/api/qa/getAllItems", {
      params: { page, size, category },
    });
    return response.data;
  } catch (error) {
    console.error("Error getAllQuestions:", error);
    throw error;
  }
}

export async function getQuestionById(id) {
  try {
    const response = await api.get(`/api/qa/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getQuestionById:", error);
    throw error;
  }
}

export async function createQuestion(question) {
  try {
    const response = await api.post("/api/qa/newQuestion", question);
    return response.data;
  } catch (error) {
    console.error("Error createQuestion:", error);
    throw error;
  }
}

export async function updateQuestion(id, question) {
  try {
    const response = await api.put(`/api/qa/${id}`, question);
    return response.data;
  } catch (error) {
    console.error("Error updateQuestion:", error);
    throw error;
  }
}

export async function deleteQuestion(id) {
  try {
    await api.delete(`/api/qa/${id}`);
  } catch (error) {
    console.error("Error deleteQuestion:", error);
    throw error;
  }
}

export async function answerQuestion(id, answerDto) {
  try {
    const response = await api.post(`/api/qa/${id}/answer`, answerDto);
    return response.data;
  } catch (error) {
    console.error("Error answerQuestion:", error);
    throw error;
  }
}

export async function updateQuestionStatus(id, statusUpdateDto) {
  try {
    const response = await api.put(
      `/api/qa/${id}/updateStatus`,
      statusUpdateDto
    );
    return response.data;
  } catch (error) {
    console.error("Error updateQuestionStatus:", error);
    throw error;
  }
}

export async function searchQuestions(keyword, page = 0, size = 5) {
  try {
    const response = await api.get("/api/qa/search", {
      params: { keyword, page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Error searchQuestions:", error);
    throw error;
  }
}
