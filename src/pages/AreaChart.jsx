import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import useFetch from "../hooks/useFetch";
import { useStateContext } from "../contexts/ContextProvider";

export default function DepositAreaChart() {
  const { currentMode } = useStateContext();
  const apiUrl = import.meta.env.VITE_API_URL;
  const { data: apiResponse, loading, error } = useFetch(apiUrl);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  const { totalDepositAmount, totalAdminDepositAmount, totalAdminBonusAmount } =
    apiResponse?.data || {};

  // Prepare data for the AreaChart
  const chartData = [
    { name: "User Deposit", amount: totalDepositAmount || 0 },
    { name: "Admin Deposit", amount: totalAdminDepositAmount || 0 },
    { name: "Admin Bonus", amount: totalAdminBonusAmount || 0 },
  ];

  return (
    <div className="w-full h-96 flex flex-col justify-between p-2 md:ml-6 md:mr-6 relative">
      <div className="flex">
        <span
          className={`p-2 mr-2 mb-5 text-white cursor-pointer bg-[#03C9D7]`}
        >
          Deposits and Bonuses Comparison{" "}
        </span>
      </div>
      <ResponsiveContainer width="95%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorAmount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
