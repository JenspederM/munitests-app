import { UserDropdown } from "./UserDropdown";
import React, { useState } from "react";
import { NavbarMenu, RouteType } from "../types";

export function NavbarRouter({ navItems }: { navItems: RouteType[] }) {
  const [currentView, setCurrentView] = useState("dashboard");
  const sidebarRef = React.useRef<HTMLInputElement>(null);

  const navigate = (path: string) => {
    if (!sidebarRef.current) return;
    setCurrentView(path);
    sidebarRef.current.checked = false;
  };

  function Menu({ items, className }: NavbarMenu) {
    return (
      <ul className={className}>
        {items.map((item) => (
          <li key={item.title}>
            <a onClick={() => navigate(item.path)} className="btn btn-ghost">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="drawer">
      <input ref={sidebarRef} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content relative flex flex-col">
        <div className="w-full navbar fixed bg-base-300 px-8 z-10">
          <div className="flex-none lg:hidden">
            <button
              onClick={() => {
                if (sidebarRef.current) {
                  sidebarRef.current.checked = true;
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
            <label
              htmlFor="navbar-drawer"
              className="btn btn-square btn-ghost"
            ></label>
          </div>
          <div className="flex-1">
            <h1
              className="btn btn-ghost normal-case text-xl px-0"
              onClick={() => setCurrentView("dashboard")}
            >
              Munitests
            </h1>
          </div>
          <div className="flex-none hidden lg:block">
            <Menu items={navItems} className="menu menu-horizontal" />
          </div>
          <div className="lg:ml-4">
            <UserDropdown />
          </div>
        </div>
        <div className="absolute w-full top-16">
          {navItems
            .filter((item) => item.path === currentView)
            .map((item) => (
              <div
                className={`flex flex-col w-full h-[calc(100vh-64px)] overflow-auto`}
                key={item.path}
              >
                {item.element}
              </div>
            ))}
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="navbar-drawer"
          className="drawer-overlay"
          onClick={() => {
            if (sidebarRef.current) {
              sidebarRef.current.checked = false;
            }
          }}
        ></label>
        <Menu items={navItems} className="menu p-4 w-80 bg-base-100" />
      </div>
    </div>
  );
}
