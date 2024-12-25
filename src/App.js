import "./App.css";
import { useState } from "react";
import { useAuth } from "./contexts/AuthProvider";
import MainAppBar from "./components/MainAppBar";

function App() {
  const auth = useAuth();

  return (
    <>
      <MainAppBar />
    </>
  );
}

export default App;
