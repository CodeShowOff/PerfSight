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
    <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-sm h-16 flex items-center justify-between px-6 lg:px-12 transition-colors duration-300 z-10">
      {/* Subtle top border block on header instead of floating */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-stone-900 dark:bg-stone-300 transition-colors duration-300"></div>

      {/* Logo and Brand */}
      <button onClick={() => navigate('/')} className="flex items-center gap-3 group cursor-pointer mt-1">
        <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 transition-colors duration-300">
          PerfSight.
        </h1>
      </button>

      {/* User Menu & Toggles */}
      <div className="flex items-center gap-6 mt-1">
        {userInfo && (
          <div className="flex items-center gap-4">
            {/* User Info */}
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-3 py-1 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-stone-900 dark:bg-stone-100 rounded-full flex items-center justify-center text-stone-50 dark:text-stone-900 font-serif font-bold text-sm transition-colors duration-300">
                {userInfo.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 transition-colors duration-300 leading-none mb-1">
                  {userInfo.name}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider leading-none">
                  Profile
                </p>
              </div>
            </button>

            <div className="w-px h-8 bg-stone-200 dark:bg-stone-800 mx-2 transition-colors duration-300"></div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-100 transition-colors duration-300 shadow-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
