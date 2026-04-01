import { axiosInstance } from "./axios";

export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data
    } catch (error) {
        console.log("Error in getAuthUser", error);
        return null
    }
}

export const signup = async (registerData)=> {
    const response = await axiosInstance.post("/auth/register", registerData);
    return response.data;
};

export const login = async (loginData)=> {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
};

export const createClass = async (classData) => {
    const response = await axiosInstance.post("/class/create", classData);
    return response.data;
}

export async function getClasses() {
  const response = await axiosInstance.get("/class/lecturer");
  return response.data;
}

export const deleteClass = async (id) => {
  const res = await axiosInstance.delete(`/class/${id}`);
  return res.data;
};

export const updateClass = async ({ id, classData }) => {
  const res = await axiosInstance.put(`/class/${id}`, classData);
  return res.data;
};

export const createSession = async (data) => {
    const response = await axiosInstance.post("/sessions", data);
    return response.data;
}

export async function getSessionById(id) {
  const response = await axiosInstance.get(`/sessions/${id}`);
  return response.data;
};


export const getStreamToken = async () => {
    const response = await axiosInstance.get(`/chat/token`);
    return response.data;
}

export const joinClass = async (data) => {
    const response = await axiosInstance.post("/class/join", data);
    return response.data;
}

export async function getStudentClasses() {
  const response = await axiosInstance.get("/class/student");
  return response.data;
}

export async function getClassById(id) {
  const response = await axiosInstance.get(`/class/student/${id}`);
  return response.data;
};

export async function getActiveSessionByClass(id) {
  const response = await axiosInstance.get(`/sessions/class/${id}`);
  return response.data;
};

export async function JoinSession(id) {
  const response = await axiosInstance.post(`/sessions/${id}/join`);
  return response.data;
};

export async function endSession(id) {
  const response = await axiosInstance.post(`/sessions/${id}/end`);
  return response.data;
};

export const getLecturerStudents = async () => {
  const res = await axiosInstance.get("/class/students");
  return res.data;
};

export const getLecturerAttendance = async () => {
  const res = await axiosInstance.get("/class/attendance");
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const getMyRecentSession = async () => {
  const res = await axiosInstance.get("/sessions/my-recent");
  return res.data;
};

export const getStudentSessions = async () => {
  const res = await axiosInstance.get("/sessions/student");
  return res.data;
};