#### Complete App

[jp-assingment](https://jp-dashboard-two.vercel.app/)

#### Create React APP

[VITE](https://vitejs.dev/guide/)

```sh
npm create vite@latest projectName -- --template react
```

#### Vite - Folder and File Structure

```sh
npm i
```

```sh
npm run dev
```

## npm instal

```sh
npm install tailwindcss @tailwindcss/vite react-router-dom recharts react-icon
```

- APP running on http://localhost:5173/
- .jsx extension

#### Remove Boilerplate

- remove App.css
- remove all code in index.css

  App.jsx

## Installed Tailwind css

```sh
npm install tailwindcss @tailwindcss/vite

```

-changed configration

```sh
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

- import tailwind css App.css

```sh
@import "tailwindcss";
```

#### Router

[React Router](https://reactrouter.com/en/main)

- version 7 brought significant changes (loader and action)
- pages as independent entities
- less need for global state
- more pages

#### Setup Router

- all my examples will include version !!!

```sh
npm i react-router-dom
```

App.jsx

```jsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <h1>home</h1>,
  },
  {
    path: "/about",
    element: (
      <div>
        <h2>about page</h2>
      </div>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
```

#### Create Pages

- create src/pages directory

  AreaChart.jsx
  Dashboard.jsx
  Home.jsx
  PieChart.jsx

# Create Components

    Navbar.jsx
    Sidebar.jsx

# Create hooks folder

    useFetch.js

# Crate contexts

    ContextProvider.jsx

#### Error Page

- bubbles up

App.jsx

```jsx
{
    path: '/',
    element: <Home />,
    errorElement: <Error />,
    ...
}
```

Error.jsx

# fetch custome hook page

    useFetch.js
    - used useEffect
    - aync/await to handle promise
    - AbortCOntroller used to cancell or abort an asynchronous request, like a fetch

# context page

    ContextProvider.jsx

```sh

import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

const initialState = {
 chat: false,
 cart: false,
 userProfile: false,
 notification: false,
};

export const ContextProvider = ({ children }) => {
 const color = localStorage.getItem("colorMode");
 console.log(color);
 const [screenSize, setScreenSize] = useState(undefined);
 const [currentColor, setCurrentColor] = useState("#03C9D7");
 const [currentMode, setCurrentMode] = useState(color);
 const [themeSettings, setThemeSettings] = useState(false);
 const [activeMenu, setActiveMenu] = useState(true);
 const [isClicked, setIsClicked] = useState(initialState);

 const setMode = (color) => {
   setCurrentMode(color);
   localStorage.setItem("colorMode", color);
 };

 const setColor = (color) => {
   setCurrentColor(color);
   localStorage.setItem("colorMode", color);
 };

 const handleClick = (clicked) =>
   setIsClicked({ ...initialState, [clicked]: true });

 return (
   // eslint-disable-next-line react/jsx-no-constructed-context-values
   <StateContext.Provider
     value={{
       currentColor,
       currentMode,
       activeMenu,
       screenSize,
       setScreenSize,
       handleClick,
       isClicked,
       initialState,
       setIsClicked,
       setActiveMenu,
       setCurrentColor,
       setCurrentMode,
       setMode,
       setColor,
       themeSettings,
       setThemeSettings,
     }}
   >
     {children}
   </StateContext.Provider>
 );
};

export const useStateContext = () => useContext(StateContext);
```

    - first crate context
    - state and object crated which we have to send file component and pages
    - crated provide with the value attribute

```sh
  localStorage.getItem("colorMode");
```

    - used when page is refresh still data will persist

## pages/Home

```sh

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
```

    --used outlet of react-router-dom to render children of nested route
    --memozied the value using usememo

## pages/Dashboard

    -Dashboard have analatics mode button in which we can switch card container to anyaltic mode where the recharts graph are the line chart and pie chart
    -api call from custome hook
    -got data in data variable
    -we have nested array like object inside object so cannot show in list
    - each and revery data should be similar the only we can map so for that making we have used

    ```sh

    const statsData = data?.data || {};

const excludeKeys = ["withdrawData"];
const flatStats = Object.entries(statsData)
.filter(([key]) => !excludeKeys.includes(key))
.map(([key, value]) => ({ label: formatLabel(key), value }));

const withdrawStats = (statsData.withdrawData || []).flatMap((item) => [
{ label: `${item._id} - Total Amount`, value: item.totalAmount },
{ label: `${item._id} - TDS Amount`, value: item.tdsAmount },
{ label: `${item._id} - Count`, value: item.count },
]);

const allStats = [...flatStats, ...withdrawStats];

function formatLabel(key) {
return key
.replace(/([A-Z])/g, " $1")
.replace(/^./, (str) => str.toUpperCase());
}

const chartData = allStats
.filter((item) => typeof item.value === "number")
.map((item) => ({
name:
item.label.length > 25 ? item.label.slice(0, 25) + "..." : item.label,
value: item.value,
}));

````
    --analatic mode

    used

```sh
    import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
```

    -use various built-in components and property to crate line chart and pie parts

## AreaChart

    --same for Area charts we we have used area chat and many other builtin components
    like

    ```sh
    <AreaChart></AreaChart>
    <Area></Area>
    <Tooltip/>
    <CartesianGrid/>
    ```

## Pie chart


    --same for pie charts we we have used area chat and many other builtin components
    like
    -- we have two button one show pie charts of "New Users Distribution" and second show piecharts of "Active Users Distribution"


    ```sh
    <PieCharts>
    <Tooltip>
    <Pie>
    ```

## components Navbar

--its consist of burger menu light dark mode and static content

## dark mode

    -- configure dark mode in tailwind

```sh
@custom-variant dark (&:where(.dark, .dark *));
```
    -- how to use it just toggle on dark class in any parent component

```sh

 <div
      className={`flex relative ${
        currentMode === "light" ? "dark" : ""
      }  dark:bg-main-dark-bg`}
    >
      {/* Sidebar */}
      {sidebar}
      </div>
```

# SideBar

    -- it consist of 3 navigation link dashboard , pie chart , area chart
    -- route change

    ```sh

    <NavLink
                to="/dashboard"
                onClick={handleCloseSideBar}
                className={({ isActive }) =>
                  isActive ? activeLink : normalLink
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : "",
                })}
              >
                Dashboard
              </NavLink>

```

# global css and tailwind configuration

```sh

@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));


@theme {
  --font-sans: "Open Sans", sans-serif;
  --text-standard:14px;
  --background-color-main-bg:#FAFBFB;
  --background-color-main-dark-bg:#20232A;
  --background-color-secondary-dark-bg:#33373E;
  --background-color-light-gray:#F7F7F7;
  --background-color-half-transparent:rgba(0, 0, 0, 0.5);
  --border-width-1:1px;
  --border-color-color:red;
  --height-80:80px;
  --min-height-590:590px;
  --background-image-hero-pattern:url('https://i.ibb.co/MkvLDfb/Rectangle-4389.png');

}




.sidebar {
  box-shadow: rgb(113 122 131 / 11%) 0px 7px 30px 0px;
}
.nav-item,
.navbar {
  z-index: 10000;
}
@media  screen and (max-width:800px) {
  .sidebar{
    z-index: 10000000;
  }
}

.e-dlg-center-center, .e-quick-popup-wrapper.e-device{
  z-index: 1000000 !important;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: rgb(216, 216, 216);
  border-radius: 40px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}

/* color-picker style  */

 #preview {
  background: transparent
    url('https://ej2.syncfusion.com/react/demos/src/color-picker/images/pen.png')
    no-repeat;
  display: inline-block;
  height: 80px;
  margin: 10px 0;
  min-width: 300px;
  max-width: 600px;
  background-color: #008000;
}

.e-input-group:not(.e-float-icon-left), .e-input-group.e-success:not(.e-float-icon-left), .e-input-group.e-warning:not(.e-float-icon-left), .e-input-group.e-error:not(.e-float-icon-left), .e-input-group.e-control-wrapper:not(.e-float-icon-left), .e-input-group.e-control-wrapper.e-success:not(.e-float-icon-left), .e-input-group.e-control-wrapper.e-warning:not(.e-float-icon-left), .e-input-group.e-control-wrapper.e-error:not(.e-float-icon-left){
  border: none;
}

```

# env file

```sh

-- insde .env file

VITE_API_URL=https://d29l1nxcqevrmo.cloudfront.net/dashboard

-- call .env variable

  const apiUrl = import.meta.env.VITE_API_URL;

````
