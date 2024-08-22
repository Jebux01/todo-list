import axios from "axios";

const ClientHttp = axios.create({
  baseURL: "http://localhost:8000/v1/tasks",
  headers: { "Content-Type": "application/json" },
});

export default ClientHttp;
