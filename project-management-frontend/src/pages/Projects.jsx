import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 6; 

  const navigate = useNavigate();
  
  // Get real logged-in user context
  const currentUser = JSON.parse(localStorage.getItem("user")) || { _id: "admin-id", role: "Admin" };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let endpoint = "";

        // 🎯 ROLE BASED ROUTING DISPATCHER
        if (currentUser?.role === "Admin") {
          endpoint = `/projects/getAllProject?page=${currentPage}&limit=${limit}`;
        } else {
          endpoint = `/projects/user-projects/userId?page=${currentPage}&limit=${limit}`;
        }

        const response = await api.get(endpoint);
        const responseData = response.data.data || response.data;
        
        setProjects(responseData.projects || []);
        setTotalPages(responseData.pagination?.totalPages || 1);
        setTotalItems(responseData.pagination?.totalItems || 0);
      } catch (error) {
        console.error("Failed to fetch projects", error);
        toast.error("Could not load projects data metrics");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage, currentUser._id, currentUser?.role]);

  const handleDelete = async (projectId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project workspace?")) {
      try {
        await api.delete(`/projects/${projectId}`);
        toast.success("Project deleted successfully");
        setProjects((prev) => prev.filter((p) => p._id !== projectId));
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete project");
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[580px]">
      <div>
        
        {/* Dynamic Header Layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-6 border-b border-gray-100 gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              {currentUser?.role === "Admin" ? "All Company Projects" : "My Assigned Workspaces"}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {currentUser?.role === "Admin" 
                ? "Monitor workspaces, assign micro-tasks, and track roles in real-time."
                : "View your active project tracking matrix and synchronized cards."}
            </p>
          </div>
          
          {/* Admin Role Gate Button (Hidden for Members) */}
          {currentUser?.role === "Admin" && (
            <Link 
              to="/create-project" 
              className="px-5 py-2.5 bg-[#2E75B6] text-white text-xs font-bold rounded-xl hover:bg-[#1C5B8B] hover:shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span className="text-sm font-black">+</span> Create New Project
            </Link>
          )}
        </div>

        {/* Content Flow */}
        {loading ? (
          <div className="py-28 text-center text-gray-400 font-medium text-xs tracking-wider">
            Loading real-time data metrics...
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-2xl max-w-md mx-auto my-6 p-6">
            <p className="text-gray-400 text-xs font-semibold">No active projects synchronized yet.</p>
          </div>
        ) : (
          
          /* 📊 High-Fidelity Refined Table Matrix */
          <div className="overflow-x-auto rounded-xl border border-gray-100/80">
            <table className="min-w-full divide-y divide-gray-200/60 text-left text-xs">
              <thead className="bg-gray-50/70 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th scope="col" className="px-6 py-4">Project Name</th>
                  <th scope="col" className="px-6 py-4">Created By</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Team Composition</th>
                  <th scope="col" className="px-6 py-4 text-center">Control Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100 bg-white text-gray-600">
                {projects.map((project) => (
                  <tr 
                    key={project._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    {/* 1. Project Title Details */}
                    <td className="px-6 py-4 max-w-[240px]">
                      <div className="font-bold text-gray-900 text-sm group-hover:text-[#2E75B6] transition-colors truncate">
                        {project.name}
                      </div>
                      <div className="text-[11px] text-gray-400 font-normal truncate mt-0.5">
                        {project.description || "No description specified."}
                      </div>
                    </td>

                    {/* 2. Created By Identity */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-gray-600">
                          {(project.createdBy?.name || "Admin").charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-700">
                          {project.createdBy?.name || "Admin"}
                        </span>
                      </div>
                    </td>

                    {/* 3. Status Workflow Indicator */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full bg-blue-50 text-[#2E75B6] border border-blue-100/70">
                        {project.status || "ACTIVE"}
                      </span>
                    </td>

                    {/* 4. Active Members Count */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 font-bold text-gray-500 bg-gray-50/80 px-2.5 py-1 rounded-lg border border-gray-100">
                        <span>👥</span>
                        <span>{project.members?.length || 0} Members</span>
                      </div>
                    </td>

                    {/* 5. Custom Functional CTAs */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/dashboard/projects/${project._id}`)}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200/60 rounded-lg text-[11px] font-bold transition-all shadow-sm cursor-pointer"
                        >
                          View Board
                        </button>
                        
                        {/* 🎯 DELETE ACTION GATE: Only Creator/Admin can see or execute destructions */}
                        {currentUser?.role === "Admin" && project.createdBy?._id === currentUser?._id && (
                          <button
                            onClick={(e) => handleDelete(project._id, e)}
                            className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200/60 rounded-lg text-[11px] font-bold transition-all shadow-sm cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Synchronized Pagination Actions Layout */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-5 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3.5 py-2 border border-gray-200 rounded-xl text-[11px] font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:hover:bg-white select-none shadow-sm cursor-pointer"
          >
            &larr; Previous
          </button>
          
          <span className="text-[11px] font-bold text-gray-400 bg-gray-50 border border-gray-100/80 px-3 py-1.5 rounded-lg">
            Page <strong className="text-gray-700">{currentPage}</strong> of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3.5 py-2 border border-gray-200 rounded-xl text-[11px] font-bold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:hover:bg-white select-none shadow-sm cursor-pointer"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
}

export default Projects;