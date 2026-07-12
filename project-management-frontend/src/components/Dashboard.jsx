import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardMetrics, fetchUserAssignedStats } from '../redux/dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
    const { metrics, userStats, loading, error } = useSelector((state) => state.dashboard);
 const storedUser = localStorage.getItem('user');
  const userObj = storedUser ? JSON.parse(storedUser) : null;
  const userRole = userObj?.role || 'Member';
  useEffect(() => {
    if (userRole === 'Admin') {
      dispatch(fetchDashboardMetrics());
    } else {
      dispatch(fetchUserAssignedStats());
    }
  }, [dispatch, userRole]);

  if (loading) return <div className="p-6 text-xl font-semibold text-gray-600">Loading dashboard data...</div>;
  if (error) return <div className="p-6 text-red-500 font-medium">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Dashboard {userRole === 'Admin' ? '(Admin View)' : '(Member View)'}
      </h2>
      {userRole === 'Admin' && (
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h3 className="text-gray-500 font-medium">Total Projects</h3>
            <p className="text-4xl font-bold mt-3 text-gray-800">{metrics?.projects || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h3 className="text-gray-500 font-medium">Total Tasks</h3>
            <p className="text-4xl font-bold mt-3 text-gray-800">{metrics?.tasks || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h3 className="text-gray-500 font-medium font-medium">Global Completed</h3>
            <p className="text-4xl font-bold mt-3 text-green-600">{metrics?.completed || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h3 className="text-gray-500 font-medium">Total Platform Members</h3>
            <p className="text-4xl font-bold mt-3 text-blue-600">{metrics?.users || 0}</p>
          </div>
        </div>
      )}
      {userRole !== 'Admin' && (
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h3 className="text-gray-500 font-medium">My Assigned Projects</h3>
            <p className="text-4xl font-bold mt-3 text-indigo-600">
              {userStats?.assignedProjectsCount || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
            <h3 className="text-gray-500 font-medium">My Completed Tasks</h3>
            <p className="text-4xl font-bold mt-3 text-emerald-600">
              {userStats?.completedTasksCount || 0}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;