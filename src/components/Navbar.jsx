import React, { useEffect, useMemo, useCallback } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { FiShoppingCart } from "react-icons/fi";
import { BsChatLeft } from "react-icons/bs";
import { RiNotification3Line } from "react-icons/ri";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useStateContext } from "../contexts/ContextProvider";
import avatar from "../assets/avatar.jpg";
import { IoMdSunny } from "react-icons/io";
import { LuSunMoon } from "react-icons/lu";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <button
    type="button"
    onClick={customFunc}
    style={{ color }}
    className="relative text-xl rounded-full p-3 hover:bg-light-gray"
  >
    {dotColor && (
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
    )}
    {icon}
  </button>
);

const Navbar = () => {
  const {
    currentColor,
    setActiveMenu,
    handleClick,
    setScreenSize,
    screenSize,
    currentMode,
    setCurrentMode,
    setMode,
  } = useStateContext();
  console.log(currentMode, "nav");

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setActiveMenu(screenSize > 900);
  }, [screenSize]);

  const handleActiveMenu = useCallback(() => {
    setActiveMenu((prev) => !prev);
  }, [setActiveMenu]);

  // ✅ Memoized nav buttons
  const navButtons = useMemo(
    () => [
      {
        title: "Cart",
        onClick: () => handleClick("cart"),
        icon: <FiShoppingCart />,
      },
      {
        title: "Chat",
        onClick: () => handleClick("chat"),
        icon: <BsChatLeft />,
        dotColor: "#03C9D7",
      },
      {
        title: "Notification",
        onClick: () => handleClick("notification"),
        icon: <RiNotification3Line />,
        dotColor: "rgb(254, 201, 15)",
      },
    ],
    [handleClick]
  );

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />
      <div className="flex items-center">
        {currentMode === "light" ? (
          <IoMdSunny
            color={currentColor}
            fontSize="30px"
            onClick={() => {
              setCurrentMode("dark");
              setMode("dark");
            }}
          />
        ) : (
          <LuSunMoon
            color={currentColor}
            fontSize="30px"
            onClick={() => {
              setCurrentMode("light");
              setMode("light");
            }}
          />
        )}

        {navButtons.map(({ title, onClick, icon, dotColor }) => (
          <NavButton
            key={title}
            title={title}
            customFunc={onClick}
            color={currentColor}
            icon={icon}
            dotColor={dotColor}
          />
        ))}

        <div
          className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
          onClick={() => handleClick("userProfile")}
        >
          <img
            className="rounded-full w-8 h-8"
            src={avatar}
            alt="user-profile"
          />
          <p>
            <span className="text-gray-400 text-14">Hi,</span>{" "}
            <span className="text-gray-400 font-bold ml-1 text-14">
              Michael
            </span>
          </p>
          <MdKeyboardArrowDown className="text-gray-400 text-14" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
