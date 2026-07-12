import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../api/axios";
import AddTaskModal from "../components/AddTaskModal";
import { io } from "socket.io-client"; 

function TaskBoard() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.user);

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSocket, setActiveSocket] = useState(null); // 🎯 Socket state reference ke liye

  const statuses = [
    { key: "Todo", label: "To Do", bgColor: "bg-slate-100", textColor: "text-slate-700", dotColor: "bg-slate-400" },
    { key: "In Progress", label: "In Progress", bgColor: "bg-blue-50", textColor: "text-blue-700", dotColor: "bg-blue-500" },
    { key: "Done", label: "Completed", bgColor: "bg-emerald-50", textColor: "text-emerald-700", dotColor: "bg-emerald-500" }
  ];

  // 📋 API Fetch Effect (Sirf Initial Page Load ke liye)
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const cleanId = id ? id.trim() : "";
        let response;
        
        if (currentUser?.role === "Admin") {
          response = await api.get(`/tasks/project/${cleanId}`);
        } else {
          response = await api.get("/tasks/getTask/userId");
        }
        
        const responseData = response.data.data || [];
        const projectSpecificTasks = currentUser?.role === "Admin" 
          ? responseData 
          : responseData.filter(task => task.projectId === cleanId);

        setTasks(projectSpecificTasks);
        
        if (projectSpecificTasks.length > 0) {
          setProject({ name: projectSpecificTasks[0].projectName || "Workspace Board", status: "ACTIVE" });
        } else {
          setProject({ name: "Project Workspace", status: "ACTIVE" });
        }
      } catch (error) {
        toast.error("Failed to load project board details.");
      } finally {
        setLoading(false);
      }
    };

    if (id && currentUser) fetchProjectDetails();
  }, [id, navigate, currentUser]);


  // 🎯 REAL-TIME SOCKET CONNECTION & LISTENER EFFECT
  useEffect(() => {
    if (!id) return;
    
    console.log("Connecting socket for project:", id);
    const token = localStorage.getItem("token"); 
    const socketUrl = "https://project-backend-f00j.onrender.com" || "http://localhost:5000";
    
    const socketInstance = io(socketUrl, {
      auth: { token }
    });

    setActiveSocket(socketInstance); // Socket instance save karein

    socketInstance.emit("joinProject", id);

    socketInstance.on("taskUpdated", (updatedTask) => {
      console.log("Real-time task received via socket:", updatedTask);
      
      setTasks((prevTasks) => {
        const exists = prevTasks.some((t) => t._id === updatedTask._id);
        if (exists) {
          return prevTasks.map((t) => (t._id === updatedTask._id ? updatedTask : t));
        } else if (currentUser?.role === "Admin") {
          return [...prevTasks, updatedTask];
        }
        return prevTasks;
      });

      toast.success(`Task grid updated via network loop!`, { icon: "⚡" });
    });

    return () => {
      socketInstance.off("taskUpdated");
      socketInstance.disconnect();
    };
  }, [id, currentUser]);


  // ⚡ HANDLER: NO MORE REST API API CALL! Directly hitting Socket pipeline
  const handleStatusChange = (taskId, newStatus) => {
    if (!activeSocket) {
      toast.error("Socket terminal not ready.");
      return;
    }

    // 1. Optimistic local UI update taaki zero lag feel ho
    setTasks((prevTasks) =>
      prevTasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
    
    // 2. 🚀 Emit directly to socket gateway
    activeSocket.emit("changeTaskStatus", {
      taskId,
      projectId: id,
      newStatus
    });
  };

  if (loading) return <div className="py-32 text-center text-xs text-gray-400">Loading Kanban workspace...</div>;

  return (
    <div className="space-y-6">
      {/* 📋 Header Section */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{project?.name}</h2>
          <p className="text-xs text-gray-500 mt-1">Real-time synchronized pipeline active (Pure WebSockets enabled).</p>
        </div>
        {currentUser?.role === "Admin" && (
          <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-[#2E75B6] text-white text-xs font-bold rounded-xl">+ Add Task</button>
        )}
      </div>

      {/* 📊 Kanban Matrix columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {statuses.map((column) => {
          const columnTasks = tasks.filter((task) => task.status === column.key);
          
          return (
            <div key={column.key} className="bg-gray-50/70 border border-gray-200/50 rounded-2xl p-4 min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${column.dotColor}`} />
                  <h3 className="font-bold text-gray-800 text-sm">{column.label}</h3>
                </div>
                <span className="bg-white border text-gray-500 px-2 py-0.5 rounded-md font-bold text-[11px]">{columnTasks.length}</span>
              </div>

              <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[600px]">
                {columnTasks.length === 0 ? (
                  <div className="border border-dashed border-gray-200 bg-white/40 rounded-xl py-12 text-center text-xs text-gray-400">No tasks in this pool</div>
                ) : (
                  columnTasks.map((task) => (
                    <div key={task._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex flex-col justify-between min-h-[110px]">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{task.title}</h4>
                        {task.description && <p className="text-xs text-gray-400 line-clamp-2 mt-1">{task.description}</p>}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                        <div className="w-5 h-5 rounded-full bg-slate-100 text-gray-500 flex items-center justify-center text-[9px] font-black uppercase">
                          {task.assignedTo?.name?.charAt(0) || "U"}
                        </div>

                        <div className="flex items-center gap-2">
                          {column.key !== "Todo" && (
                            <button onClick={() => handleStatusChange(task._id, "Todo")} className="text-[10px] font-bold text-gray-400 hover:text-gray-600">Todo</button>
                          )}
                          {column.key !== "In Progress" && (
                            <button onClick={() => handleStatusChange(task._id, "In Progress")} className="text-[10px] font-bold text-blue-500 hover:text-blue-700">Work</button>
                          )}
                          {column.key !== "Done" && (
                            <button onClick={() => handleStatusChange(task._id, "Done")} className="text-[10px] font-bold text-emerald-500 hover:text-emerald-700">Done</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddTaskModal projectId={id} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onTaskCreated={(newTask) => setTasks((prev) => [...prev, newTask])} />
    </div>
  );
}

export default TaskBoard;