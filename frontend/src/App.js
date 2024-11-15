import List from "./Components/List";
import React from "react";
import { TransactionProvider } from "./Components/TransactionContext";

function App() {
  return (
    <TransactionProvider>
      <div>
        <List />
      
      </div>
    </TransactionProvider>
  );
}

export default App;
