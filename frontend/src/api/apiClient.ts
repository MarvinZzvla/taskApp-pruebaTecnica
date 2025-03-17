import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://49e7s0q577.execute-api.us-east-1.amazonaws.com/Prod",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
