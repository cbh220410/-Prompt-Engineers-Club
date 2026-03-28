
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

const savedTheme = window.localStorage.getItem("theme");
const initialTheme = savedTheme === "light" ? "light" : "dark";

document.documentElement.classList.toggle("dark", initialTheme === "dark");
document.documentElement.classList.toggle("light", initialTheme === "light");

createRoot(document.getElementById("root")!).render(
  <App />
);
  
