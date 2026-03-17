import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm h-16 flex items-center justify-between px-8">
      {/* Logo and Brand */}
      <button onClick={() => navigate('/')} className="flex items-center gap-3 group cursor-pointer">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          PerfSight
        </h1>
      </button>

      {/* User Menu */}
      <div className="flex items-center gap-4">
        {userInfo && (
          <>
            {/* User Info */}
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                  {userInfo.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {userInfo.name}
                  </p>
                  <p className="text-xs text-gray-500">View Profile</p>
                </div>
              </div>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
