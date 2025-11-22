import { FaBars, FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Sidebar({ selectedTab, setSelectedTab }) {
  const navigate = useNavigate();

  const handleCursosClick = () => {
    setSelectedTab("cursos");
    navigate("/");
  };

  return (
    <aside className="w-24 bg-[#071a3e] h-screen flex flex-col items-center pt-4">
      <div className="w-full flex justify-center mb-4">
        <FaBars className="text-2xl text-white" />
      </div>
      <button
        className={`flex flex-col items-center w-11/12 h-20 rounded-t-lg rounded-b-lg mt-2 transition font-bold
        ${selectedTab === "cursos" ? "bg-white text-[#183a6e] border-l-4 border-[#ed1c36]" : "text-white bg-[#071a3e]"}`}
        onClick={handleCursosClick}
      >
        <FaBook className="text-xl mt-3 mb-1" />
        <span className="text-xs">Cursos</span>
      </button>
    </aside>
  );
}

export default Sidebar;
