import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaProjectDiagram,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {

  const navigate = useNavigate();


  const handleLogout = () => {

    // Remove login data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/login");
  };


  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen">

      <div className="text-center py-6 text-2xl font-bold">
        PMS
      </div>


      <nav className="px-4">

        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700"
        >
          <FaHome />
          Dashboard
        </NavLink>


        <NavLink
          to="/projects"
          className="flex items-center gap-3 p-3 rounded hover:bg-slate-700 mt-2"
        >
          <FaProjectDiagram />
          Projects
        </NavLink>


        <button
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded hover:bg-red-600 mt-6 w-full"
        >
          <FaSignOutAlt />
          Logout
        </button>


      </nav>

    </aside>
  );
};

export default Sidebar;