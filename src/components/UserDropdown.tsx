import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Logout, User } from "./Icons";
import { useEffect, useState } from "react";

const THEMES = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
].sort((a, b) => a.localeCompare(b));

export function UserDropdown() {
  const [currentTheme, setCurrentTheme] = useState<string>("dark");

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) {
      setTheme(theme);
      setCurrentTheme(theme);
    }
  }, []);

  const setTheme = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  };

  return (
    <div className="relative dropdown dropdown-end z-10">
      <label
        tabIndex={0}
        className="btn btn-circle btn-ghost btn-outline btn-sm"
      >
        <User />
      </label>
      <div
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 space-y-4"
      >
        <div className="form-control">
          <label className="label">
            <span className="label-text">Theme</span>
          </label>
          <select
            value={currentTheme}
            onChange={(e) => setTheme(e.target.value)}
            className="select select-bordered"
          >
            {THEMES.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>
        <button
          className="btn btn-error space-x-2"
          onClick={() => signOut(auth)}
        >
          <Logout />
          <div>Sign out</div>
        </button>
      </div>
    </div>
  );
}
