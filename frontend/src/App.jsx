import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./modules/Register";
import Login from "./modules/Login";
import AulaVirtual from "./modules/AulaVirtual";

function App() {
  function validateSession() {
    const expiry = localStorage.getItem("session_expiry");
    if (!expiry) return false;

    const now = new Date().getTime();
    return now < expiry;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/aulavirtual/*" element={<AulaVirtual />} />
        <Route path="/aulavirtual/*" element={ validateSession() ? <AulaVirtual /> : <Login /> }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;