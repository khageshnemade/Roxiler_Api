import React, { useEffect } from "react";
import { useTransaction } from "./TransactionContext";
import BarChart from "./BarChart";
import PieChart from "./PieChart";

export default function List() {
  // State for month, search term, transactions, and pagination
  const {
    month,
    setMonth,
    search,
    setSearch,
    transactions,
    page,
    setPage,
    perPage,
    statistics,
    totalProducts,
  } = useTransaction();

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setPage(1); // Reset to first page when month changes
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when search term changes
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (page * perPage < totalProducts) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="container">
      {/* Centered Circle Background Heading */}
      <div className="d-flex justify-content-center align-items-center">
        <h2
          className="my-4 text-center position-relative"
          style={{
            width: "200px",
            height: "200px",
            padding: "50px 20px",
            backgroundColor: "#f0f0f0",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          Transaction Dashboard
        </h2>
      </div>

      {/* Search and Month Selector - Responsive Flex Container */}
      <div className="d-flex flex-column flex-md-row justify-content-between mb-3">
        {/* Search Input on the left side */}
        <div className="w-100 w-md-50 mb-2 mb-md-0 me-md-3">
          <input
            className="form-control"
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by title, description, or price"
          />
        </div>

        {/* Month Dropdown on the right side */}
        <div className="w-100 w-md-25">
          <select
            value={month}
            onChange={handleMonthChange}
            className="form-control"
          >
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table for displaying transactions */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>TITLE</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr key={`${transaction.id}-${index}`}>
                  <td>{transaction.id}</td>
                  <td>{transaction.title}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.price}</td>
                  <td>{transaction.sold ? "Sold" : "Not Sold"}</td>
                  <td>
                    <img
                      className="img-fluid"
                      style={{ maxWidth: "150px" }}
                      src={transaction.image}
                      alt={transaction.title}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No transactions found for {month}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Buttons */}
      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-success"
          onClick={handlePreviousPage}
          disabled={page === 1}
        >
          Previous
        </button>
        <button
          className="btn btn-success"
          onClick={handleNextPage}
          disabled={page * perPage >= totalProducts}
        >
          Next
        </button>
      </div>

      {/* Statistics Section */}
      <div className="mt-4">
        <h3 className="text-center">Statistics</h3>
        <ul
          className="bg-primary p-4 w-100 w-md-25 mx-auto rounded shadow list-unstyled text-white"
          style={{ textDecoration: "none" }}
        >
          <li className="mb-3">
            <span className="fw-bold fs-5">Total Sale:</span>
            <span className="fs-4 ms-2">{statistics.TotalSale}</span>
          </li>
          <li className="mb-3">
            <span className="fw-bold fs-5">Total Sold Items:</span>
            <span className="fs-4 ms-2">{statistics.TotalItems}</span>
          </li>
          <li>
            <span className="fw-bold fs-5">Total Not Sold Items:</span>
            <span className="fs-4 ms-2">{statistics.notSale}</span>
          </li>
        </ul>

        {/* Bar Chart */}
        <div className="container w-100 w-md-50">
          <h3>{`Bar Chart Data for ${month}`}</h3>
          <BarChart />
        </div>

        {/* Pie Chart */}
        <div className="container w-50 w-md-50">
          <h3>{`Pie Chart Data for ${month}`}</h3>
          <PieChart />
        </div>
      </div>
    </div>
  );
}
