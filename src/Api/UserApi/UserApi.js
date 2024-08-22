import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export async function signUp(userDto) {
  try {
    const response = await api.post("/user/signup", userDto);
    return response.data;
  } catch (error) {
    console.error("Error signUp:", error);
    throw error;
  }
}

export async function login(userDto) {
  try {
    const response = await api.post("/user/login", userDto);
    return response.data;
  } catch (error) {
    console.error("Error login:", error);
    throw error;
  }
}

export async function logout() {
  try {
    const response = await api.post("/user/logout");
    return response.data;
  } catch (error) {
    console.error("Error logout:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const response = await api.get("/user/current");
    return response.data;
  } catch (error) {
    console.error("Error getCurrentUser:", error);
    throw error;
  }
}

export async function getUserByUserId(userId) {
  try {
    const response = await api.get(`/user/id/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getUserByUserId:", error);
    throw error;
  }
}

export async function findUsersByUserNameLike(userName) {
  try {
    const response = await api.get(`/user/id/nameLike/${userName}`);
    return response.data;
  } catch (error) {
    console.error("Error findUsersByUserNameLike:", error);
    throw error;
  }
}

export async function getUserByUserName(userName) {
  try {
    const response = await api.get(`/user/id/name/${userName}`);
    return response.data;
  } catch (error) {
    console.error("Error getUserByUserName:", error);
    throw error;
  }
}

export async function getAllUsers() {
  try {
    const response = await api.get("/user/admin/getAllUsers");
    return response.data;
  } catch (error) {
    console.error("Error getAllUsers:", error);
    throw error;
  }
}

export async function setUserData(user) {
  try {
    const response = await api.put("/user/userset", user);
    return response.data;
  } catch (error) {
    console.error("Error setUserData:", error);
    throw error;
  }
}

export async function updateAuthority(authorityUpdateDto) {
  try {
    const response = await api.put("/user/updateAuthority", authorityUpdateDto);
    return response.data;
  } catch (error) {
    console.error("Error updateAuthority:", error);
    throw error;
  }
}
