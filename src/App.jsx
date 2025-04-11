import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PieChart from "./pages/PieChart";
import AreaChart from "./pages/AreaChart";
import { ContextProvider } from "./contexts/ContextProvider";
import Error from "./pages/Error";

// Define routes correctly using createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "pie-chart",
        element: <PieChart />,
      },
      {
        path: "area-chart",
        element: <AreaChart />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <ContextProvider>
        <RouterProvider router={router} />
      </ContextProvider>
    </>
  );
}

export default App;
