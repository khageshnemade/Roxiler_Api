import React from "react";
import Chart from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { useTransaction } from "./TransactionContext";

const BarChart = () => {
  const { barChart, month } = useTransaction();

  const labels = Object.keys(barChart);
  const dataFromA = Object.values(barChart);
  const data = {
    labels: labels,
    datasets: [
      {
        label: `Transactions in ${month}`,
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: dataFromA,
      },
    ],
  };
  return <Bar data={data} />;
};

export default BarChart;
