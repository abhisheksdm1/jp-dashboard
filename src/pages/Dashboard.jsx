import React, { useState } from "react";
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
import useFetch from "../hooks/useFetch";
import { useStateContext } from "../contexts/ContextProvider";

const COLORS = [
  "#ff4000",
  "#ff8000",
  "#ffbf00",
  "#ffff00",
  "#bfff00",
  "#80ff00",
  "#40ff00",
  "#00ff00",
  "#00ff40",
  "#00ff80",
  "#00ffbf",
  "#00ffff",
  "#00bfff",
  "#0080ff",
  "#0040ff",
  "#0000ff",
  "#4000ff",
  "#8000ff",
  "#bf00ff",
  "#ff00ff",
  "#ff00bf",
  "#ff0080",
  "#ff0040",
  "#ff0000",
];

const StatCard = ({ label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 border bold border-gray-300 dark:border-gray-600 rounded-2xl p-4 shadow-md">
    <p style={{ color }} className="dark:text-gray-400 text-sm">
      {label}
    </p>
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
      {value}
    </h2>
  </div>
);

const Dashboard = () => {
  const { currentColor } = useStateContext();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data, loading, error } = useFetch(apiUrl);
  const [analyticsMode, setAnalyticsMode] = useState(false);
  const [screenSize, setScreenSize] = useState(window.innerWidth);
  console.log(screenSize);

  if (loading) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

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

  const renderCustomLegend = ({ payload }) => (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm mt-4 justify-items-center">
      {payload.map((entry, index) => (
        <li key={`item-${index}`} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-700 dark:text-white truncate">
            {entry.value}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-8 flex flex-col md:p-8 bg-gray-100 dark:bg-gray-900">
      <div className="flex">
        <span
          className={`p-2 mr-2 mb-5 text-white cursor-pointer ${
            analyticsMode ? "bg-[#03C9D7]" : " bg-[#00C49F]"
          }`}
          onClick={() => setAnalyticsMode((prev) => !prev)}
        >
          Analytics Mode{" "}
        </span>
      </div>

      {!analyticsMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {allStats.map((stat, index) => (
            <StatCard
              key={index}
              label={stat.label}
              value={stat.value}
              color={currentColor}
            />
          ))}
        </div>
      ) : (
        <>
          {/* Bar Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-10">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Dashboard Bar Chart Overview
            </h2>

            {/* Outer scrollable wrapper */}
            <div className="overflow-x-auto">
              {/* Inner fixed-width container */}
              <div className="w-[1200px] md:w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                      height={90}
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis
                      ticks={[
                        0, 50, 100, 500, 1000, 2000, 6000, 13000, 19000, 25000,
                        35000,
                      ]}
                      domain={[0, 35000]}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="value"
                      fill={currentColor}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md ">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Dashboard Pie Chart Overview
            </h2>
            <div className="w-full h-[1000px] sm:h-[800px] md:h-[600px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip />
                  <Legend content={renderCustomLegend} />
                  <Pie
                    data={chartData} // Show only top 8 for clarity
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={screenSize > 900 ? 150 : 70}
                    label={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
