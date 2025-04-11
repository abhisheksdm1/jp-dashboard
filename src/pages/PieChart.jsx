import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LabelList,
} from "recharts";
import { useStateContext } from "../contexts/ContextProvider";
import useFetch from "../hooks/useFetch";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const RADIAN = Math.PI / 180;

// Custom label for percentages inside pie
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function PieChart1() {
  const { currentMode, currentColor } = useStateContext();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data: apiResponse, loading, error } = useFetch(apiUrl);
  const [activeUser, setActiveUser] = useState(1);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const handleUser1 = () => {
    setActiveUser(1);
  };

  const handleUser2 = () => {
    setActiveUser(2);
  };

  const chartData1 = [
    {
      name: "todaysUserAddition",
      value: apiResponse?.data?.todaysUserAddition || 0,
    },
    {
      name: "lastSevenDaysUserAddition",
      value: apiResponse?.data?.lastSevenDaysUserAddition || 0,
    },
    {
      name: "lastThirtyDaysUsersAddition",
      value: apiResponse?.data?.lastThirtyDaysUsersAddition || 0,
    },
  ];
  const chartData2 = [
    {
      name: "dailyActiveUsers",
      value: apiResponse?.data?.dailyActiveUsers || 0,
    },
    {
      name: "weeklyActiveUsers",
      value: apiResponse?.data?.weeklyActiveUsers || 0,
    },
    {
      name: "monthlyActiveUsers",
      value: apiResponse?.data?.monthlyActiveUsers || 0,
    },
  ];

  return (
    <div
      style={{ height: 400 }}
      className="flex flex-col justify-between p-2 md:ml-6 md:mr-6 relative"
    >
      <div className="flex">
        <h1
          className={`p-2 mr-2 text-white cursor-pointer ${
            activeUser === 1 ? "bg-[#03C9D7]" : " bg-[#00C49F]"
          }`}
          onClick={handleUser1}
        >
          New Users Distribution
        </h1>

        <h1
          className={`p-2 mr-2 text-white cursor-pointer ${
            activeUser === 2 ? " bg-[#03C9D7]" : "bg-[#00C49F]"
          }`}
          onClick={handleUser2}
        >
          All Users Distribution
        </h1>
      </div>

      {activeUser === 1 ? (
        <ResponsiveContainer>
          <PieChart>
            <Tooltip />
            <Pie
              data={chartData1}
              dataKey="value"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {/* 🔥 Custom LabelList with colored text */}

              {chartData1.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer>
          <PieChart>
            <Tooltip />
            <Pie
              data={chartData2}
              dataKey="value"
              labelLine={false}
              label={renderCustomizedLabel}
            >
              {/* 🔥 Custom LabelList with colored text */}

              {chartData2.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
