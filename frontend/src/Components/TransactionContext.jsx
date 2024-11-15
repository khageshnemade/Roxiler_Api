// TransactionContext.js
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

// Create Context
const TransactionContext = createContext();

// Custom Hook to use the TransactionContext
export const useTransaction = () => useContext(TransactionContext);

// Provider Component
export const TransactionProvider = ({ children }) => {
  // State for month, search term, transactions, and pagination
  const [month, setMonth] = useState("March");
  const [search, setSearch] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [statistics, setStatistics] = useState({});
  const [barChart, setBarChart] = useState({});
  const [pieChart, setPieChart] = useState({});

  // Function to fetch transactions
  const fetchTransactions = async (month, search, page, perPage) => {
    try {
      const response = await axios.get("http://localhost:5000/combined_data", {
        params: { month, search, page, perPage },
      });
      const data = response.data;
      console.log(data);
      setStatistics(data.statistics);
      setBarChart(data.barChart);
      setPieChart(data.pieChart);
      setTransactions(data.products);
      setTotalProducts(data.totalProducts);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Fetch transactions whenever month, search term, or page changes
  useEffect(() => {
    fetchTransactions(month, search, page, perPage); // Pass search to the fetchTransactions
  }, [month, search, page, perPage]);

  // Context value to be passed to components
  const contextValue = {
    month,
    setMonth,
    search,
    setSearch,
    transactions,
    page,
    setPage,
    perPage,
    statistics,
    barChart,
    pieChart,
    totalProducts,
    fetchTransactions,
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};
