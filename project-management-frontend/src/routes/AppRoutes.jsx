import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Projects from "../pages/Projects";
import Dashboard from "../components/Dashboard";
import DashboardLayout from "../components/DashboardLayout";
import Register from "../pages/Regiester";
import CreateProject from "../pages/CreateProject";
import TaskBoard from "../pages/TaskBoard";
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); 

  if (!token) {
    return <Navigate to="/login" replace />;
  }  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<TaskBoard />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/dashboard/projects/:id" element={<TaskBoard />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;