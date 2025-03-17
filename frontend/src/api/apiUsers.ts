import { User } from "../pages/Home/Home";
import apiClient from "./apiClient";

export interface Credentials {
  email: string;
  password: string;
}

export const getUsers = async () => {
  try {
    const { data } = await apiClient.get("/users");
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const createUser = async (user: User) => {
  try {
    const { data } = await apiClient.post("/users", { user: user });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateUserDb = async (user: User) => {
  try {
    const { data } = await apiClient.put(`/users`, { user: user });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteUserDb = async (id: string) => {
  try {
    const { data } = await apiClient.delete(`/users?id=${id}`);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
export const getLogin = async (credentials: Credentials) => {
  try {
    const { data } = await apiClient.post(`/users/login`, credentials);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
