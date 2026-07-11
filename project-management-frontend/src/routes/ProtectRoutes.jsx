import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Projects from "../pages/Projects";
import TaskBoard from "../pages/TaskBoard";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Protected Route */}
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />

      {/* Protected Route */}
      <Route
        path="/project/:id"
        element={
          <ProtectedRoute>
            <TaskBoard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
