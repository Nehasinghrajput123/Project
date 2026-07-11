import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const DashboardLayout = () => {
  const location = useLocation();
  console.log("Current Location Object:", location);

  // Dynamic Header Title Conditions mapping
  let currentTitle = "Dashboard";

  if (location.pathname.includes("create-project")) {
    currentTitle = "Create Project";
  } else if (location.pathname.includes("projects")) {
    currentTitle = "Project Management";
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Pass dynamically resolved string parameter */}
        <Navbar title={currentTitle} />

        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;