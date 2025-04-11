import React, { useMemo } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import Navbar from "../components/Navbar";
import { useStateContext } from "../contexts/ContextProvider";

export default function Home() {
  const { activeMenu, currentMode } = useStateContext();

  // ✅ Memoized sidebar JSX
  const sidebar = useMemo(
    () => (
      <div
        className={
          activeMenu
            ? "w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white"
            : "w-0 dark:bg-secondary-dark-bg"
        }
      >
        <SideBar />
      </div>
    ),
    [activeMenu]
  );

  // ✅ Memoized wrapper className
  const contentWrapperClass = useMemo(
    () =>
      activeMenu
        ? "w-full dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72"
        : "bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2",
    [activeMenu]
  );

  return (
    <div
      className={`flex relative ${
        currentMode === "light" ? "dark" : ""
      }  dark:bg-main-dark-bg`}
    >
      {/* Sidebar */}
      {sidebar}

      {/* Main content area */}
      <div className={contentWrapperClass}>
        <div className="sticky top-0 z-50 bg-main-bg dark:bg-main-dark-bg navbar w-full">
          <Navbar />
        </div>
        <Outlet />
      </div>
    </div>
  );
}
