const Dashboard = () => {
  return (
    <div>

      <h2 className="text-3xl font-bold mb-8">
        Dashboard
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Projects</h3>

          <p className="text-4xl font-bold mt-3">
            12
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">Tasks</h3>

          <p className="text-4xl font-bold mt-3">
            87
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-gray-500">
            Completed
          </h3>

          <p className="text-4xl font-bold mt-3 text-green-600">
            41
          </p>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;