import { Link } from 'react-router-dom';
import { UsersIcon, FolderIcon, CalendarIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const dashboardSections = [
  { name: 'User Management', to: '/usermanagement', icon: UsersIcon },
  { name: 'Admin Settings', to: '/admins', icon: FolderIcon },
  { name: 'Reports', to: '#', icon: CalendarIcon },
  { name: 'Settings', to: '#', icon: Cog6ToothIcon },
];
function Dashboard() {
  return (
    <>
      <div className="min-h-screen w-full sm:w-[1000px] relative sm:left-[320px] flex flex-col overflow-scroll">
        {/* Main Content */}
        <main className="flex-grow px-4 py-8 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Section Cards */}
            {dashboardSections.map((section) => (
              <Link
                key={section.name}
                to={section.to}
                className="relative flex items-center justify-between p-6 text-gray-900 transition-transform duration-300 bg-white border border-gray-300 shadow-lg rounded-xl hover:scale-105 bg-opacity-90"
              >
                <div className="flex items-center space-x-4">
                  <section.icon className="w-8 h-8" />
                  <h3 className="text-xl font-semibold">{section.name}</h3>
                </div>
                <span className="absolute top-0 right-0 p-4 text-2xl opacity-10">{'>'}</span>
              </Link>
            ))}
          </div>
          {/* Admin Overview & Stats */}
          <section className="mt-10">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Admin Stats */}
              <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg bg-opacity-90">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Admin Overview</h2>
                <p className="text-gray-500">Manage and view details about your platform's admin activity.</p>
                <div className="flex flex-wrap gap-4 mt-6">
                  <div className="flex items-center p-4 space-x-2 rounded-xl">
                    <UsersIcon className="w-6 h-6 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">Admins Active</h3>
                      <p className="text-sm text-gray-500">10 Admins</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 space-x-2 rounded-xl">
                    <CalendarIcon className="w-6 h-6 text-yellow-500" />
                    <div>
                      <h3 className="font-semibold">Recent Updates</h3>
                      <p className="text-sm text-gray-500">5 Updates</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Quick Links */}
              <div className="p-6 bg-white border border-gray-300 rounded-lg shadow-lg bg-opacity-90">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Quick Links</h2>
                <ul className="space-y-4">
                  <li>
                    <Link
                      to="/usermanagement"
                      className="block font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Manage Users
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admins"
                      className="block font-semibold text-green-600 hover:text-green-800"
                    >
                      Admin Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="block font-semibold text-gray-600 hover:text-gray-800"
                    >
                      Reports
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
export default Dashboard;