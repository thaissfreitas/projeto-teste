import axios from "axios";
import { API_URL } from "../consts";

export const api = axios.create({
	baseURL: API_URL
})