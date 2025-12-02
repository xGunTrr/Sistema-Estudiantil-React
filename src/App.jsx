import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AulaVirtual from './components/AulaVirtual';
import Login from './components/Login';
import Navbar from './components/Navbar';
import CrearTarea from "./components/CrearTarea";
import SubirTarea from "./components/SubirTarea";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [showAulaVirtual, setShowAulaVirtual] = useState(false);

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setShowAulaVirtual(true);
  };

  return (
    <Router>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : showAulaVirtual ? (
        <AulaVirtual role={userRole} />
      ) : (
        <>
          <Navbar userRole={userRole} />
          <Routes>
            <Route path="/crear-tarea" element={<CrearTarea />} />
            <Route path="/subir-tarea" element={<SubirTarea />} />
          </Routes>
        </>
      )}
    </Router>
  );
}
export default App;
