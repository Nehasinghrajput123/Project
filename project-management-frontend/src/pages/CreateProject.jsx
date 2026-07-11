import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

function CreateProject() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [allUsers, setAllUsers] = useState([]); 
  const [selectedMembers, setSelectedMembers] = useState([]); 
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/auth/users");
        setAllUsers(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to load users", error);
        toast.error("Failed to load team members");
      }
    };
    fetchUsers();
  }, []);

  const toggleMember = (userId) => {
    if (selectedMembers.includes(userId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    } else {
      setSelectedMembers([...selectedMembers, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Project name is required!");

    try {
      setLoading(true);
      await api.post("/projects", {
        name,
        description,
        members: selectedMembers,
      });

      toast.success("Project created successfully.");
      navigate("/projects");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-3xl shadow-md border border-gray-100">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Create New Project</h2>
        <p className="text-sm text-gray-500 mt-1">Add details and assign members to this project.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700">Project Name *</label>
          <input
            type="text"
            placeholder="e.g., Team Collaboration App"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-200 px-4 focus:ring-2 focus:ring-[#2E75B6] outline-none text-gray-800 bg-white"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700">Description</label>
          <textarea
            rows="3"
            placeholder="Project details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-gray-200 p-4 focus:ring-2 focus:ring-[#2E75B6] outline-none resize-none text-gray-800 bg-white"
          />
        </div>

        {/* Dynamic Multi-Select Dropdown Component */}
        <div className="flex flex-col space-y-2 relative">
          <label className="text-sm font-semibold text-gray-700">Add Team Members</label>
          
          {/* FIXED: Display box with row layout & inline badge wrappers */}
          <div 
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full min-h-[50px] rounded-xl border border-gray-200 p-2 cursor-pointer bg-white flex flex-wrap gap-2 items-center justify-between focus-within:ring-2 focus-within:ring-[#2E75B6]"
          >
            {selectedMembers.length === 0 ? (
              <span className="text-gray-400 pl-2 text-sm select-none">Select members...</span>
            ) : (
              // Ek line me items ko tightly space karne ke liye inline-flex aur container layout fix kiya
              <div className="flex flex-wrap gap-2 items-center">
                {selectedMembers.map((id) => {
                  const user = allUsers.find((u) => u._id === id);
                  return (
                    <span 
                      key={id} 
                      className="inline-flex items-center bg-blue-50 text-[#2E75B6] text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100 shadow-sm transition-all"
                    >
                      {/* Sirf user ka name show hoga, email display block me se poori tarah remove kar diya */}
                      <span>{user?.name}</span>
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); toggleMember(id); }}
                        className="hover:text-red-500 font-extrabold ml-2 text-sm leading-none"
                      >
                        &times;
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
            <span className="text-gray-400 text-xs pr-2 select-none">{showDropdown ? "▲" : "▼"}</span>
          </div>

          {/* Floating Users Dropdown List */}
          {showDropdown && (
            <>
              {/* Overlay Backdrop to close dropbox safely */}
              <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
              
              <div className="absolute top-[82px] left-0 w-full max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-2xl z-50 p-2 space-y-1 block">
                {allUsers.length === 0 ? (
                  <div className="p-3 text-sm text-gray-400 text-center">No users found</div>
                ) : (
                  allUsers.map((user) => {
                    const isSelected = selectedMembers.includes(user._id);
                    return (
                      <div
                        key={user._id}
                        onClick={() => toggleMember(user._id)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer text-sm font-medium transition-all ${
                          isSelected 
                            ? "bg-blue-50 text-[#2E75B6] border border-blue-100" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {/* Dropdown list me full info standard style me clean dikhegi */}
                        <div>
                          <p className="font-semibold text-gray-800">{user.name}</p>
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#2E75B6] text-white flex items-center justify-center font-bold text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="px-6 h-12 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 h-12 rounded-xl bg-[#2E75B6] hover:bg-[#1C5B8B] text-white font-bold transition-all shadow-md disabled:opacity-50"
          >
            {loading ? "Creating..." : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateProject;