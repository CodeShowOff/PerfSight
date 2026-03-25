import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  return (
    <div className="h-screen flex flex-col font-sans transition-colors duration-300">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar />
        {/* Main Content Pane */}
        <main className="flex-1 overflow-y-auto bg-stone-50 dark:bg-stone-950 p-6 lg:p-10 transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
