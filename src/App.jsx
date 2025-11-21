import { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AulaVirtual from './components/AulaVirtual';
import Login from './components/Login';        

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
          </Routes>
        </>
      )}
    </Router>
  );
}
export default App;
