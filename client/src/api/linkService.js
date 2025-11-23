import axios from "axios";

const API = "https://tinylink-production-4c27.up.railway.app/api/links";

export const getLinks = () => axios.get(API);
export const createLink = (data) => axios.post(API, data);
export const deleteLink = (code) => axios.delete(`${API}/${code}`);
export const getSingleLink = (code) => axios.get(`${API}/${code}`);
