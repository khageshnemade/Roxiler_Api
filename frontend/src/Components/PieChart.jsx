import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { useTransaction } from "./TransactionContext";
export default function PieChart() {
  const { pieChart, month } = useTransaction();

  const data = {
    labels: Object.keys(pieChart),
    datasets: [
      {
        label: `Transactions in ${month}`,
        data: Object.values(pieChart),
        backgroundColor: [
          "#007D9C",
          "#244D70",
          "#D123B3",
          "#F7E018",
          "#fff",
          "#FE452A",
        ],
        borderColor: [
          "rgba(255,99,132,1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return <Pie data={data} width={50} height={50} />;
}
