import { useState, useEffect } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

function AddTaskModal({ projectId, isOpen, onClose, onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [members, setMembers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch project members so Admin can assign the task to someone
  useEffect(() => {
    const fetchProjectMembers = async () => {
      if (!isOpen || !projectId) return;
      try {
        const response = await api.get(`/projects/${projectId}`);
        const data = response.data.data || response.data;
        setMembers(data.members || []);
      } catch (error) {
        console.error("Error fetching workspace team members:", error);
      }
    };
    fetchProjectMembers();
  }, [projectId, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Task title is required");

    try {
      setSubmitting(true);
      
      // Matches your Mongoose schema parameters perfectly
      const payload = {
        title: title.trim(),
        description: description.trim(),
        priority: priority,
        projectId: projectId, 
        assignedTo: assignedTo || null, // Optional field tracking
      };

      const response = await api.post("/tasks", payload);
      const createdTask = response.data.data || response.data;

      toast.success("Task assigned successfully!");
      onTaskCreated(createdTask); // Instantly updates the Kanban board view
      
      // Reset Form State
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setAssignedTo("");
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error(error.response?.data?.message || "Failed to deploy new task Blueprint");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      
      {/* Modal Wrapper Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
        
        {/* Header Section */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Create New Task Assignment</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Input Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          
          {/* 1. Task Title Input */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Task Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Configure Nginx Reverse Proxy Setup"
              className="w-full h-11 px-4 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {/* 2. Task Description Textarea */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Functional Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide an overview of the core rules for this deployment cycle..."
              rows={3}
              className="w-full p-4 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500 transition-colors resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 3. Priority Selection Dropdown */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-11 px-3 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none bg-white focus:border-blue-500 transition-colors"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* 4. Team Member Assignment Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">Assign Operator</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full h-11 px-3 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none bg-white focus:border-blue-500 transition-colors"
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Trigger Buttons Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-50 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-10 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 h-10 bg-[#2E75B6] text-white text-xs font-bold rounded-xl hover:bg-[#1C5B8B] transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Deploying..." : "Deploy Task"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

export default AddTaskModal;