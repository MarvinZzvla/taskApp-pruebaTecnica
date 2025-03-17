import { Task } from "../pages/Home/Home";
import apiClient from "./apiClient";

export const getTasks = async () => {
  try {
    const { data } = await apiClient.get("/tasks");
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const createTasks = async (task: Task) => {
  try {
    const { data } = await apiClient.post("/tasks", task);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateTasks = async (task: Task) => {
  try {
    const { data } = await apiClient.put(`/tasks`, task);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteTasks = async (id: string) => {
  try {
    const { data } = await apiClient.delete(`/tasks?id=${id}`);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
