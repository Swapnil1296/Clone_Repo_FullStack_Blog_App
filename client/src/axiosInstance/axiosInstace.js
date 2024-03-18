import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://clone-repo-fullstack-blog-app-1.onrender.com",
});

export default axiosInstance;
