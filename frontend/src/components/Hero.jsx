import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 relative transition-colors duration-300">
      {/* Subtle top border line for classic editorial feel */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-stone-900 dark:bg-stone-300 transition-colors duration-300"></div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6 lg:px-12 border-b border-stone-200 dark:border-stone-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100 transition-colors duration-300">
              PerfSight.
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors duration-300"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {/* Sun icon */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {/* Moon icon */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            {userInfo ? (
              <Link
                to="/dashboard"
                className="px-6 py-2 border border-stone-900 dark:border-stone-300 text-stone-900 dark:text-stone-100 text-sm font-medium hover:bg-stone-900 hover:text-white dark:hover:bg-stone-300 dark:hover:text-stone-900 transition-colors duration-300"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-sm font-medium hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors duration-300"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-12 pt-20 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            {/* Minimal Subheadline/Tag */}
            <div className="mb-6 inline-block">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 border-b border-stone-300 dark:border-stone-700 pb-1 transition-colors duration-300">
                Engineering Excellence
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-7xl font-serif text-stone-900 dark:text-stone-100 mb-8 leading-tight transition-colors duration-300">
              A timeless approach to <br />
              <span className="italic text-stone-600 dark:text-stone-400">performance intelligence.</span>
            </h1>

            {/* Subheadline text */}
            <p className="text-lg text-stone-600 dark:text-stone-400 mb-12 max-w-2xl mx-auto leading-relaxed transition-colors duration-300">
              Enterprise-grade telemetry meets sophisticated design. Measure, benchmark, and perfect your software with absolute clarity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              {userInfo ? (
                <Link
                  to="/dashboard"
                  className="px-10 py-3 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors duration-300"
                >
                  Launch Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-10 py-3 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors duration-300"
                  >
                    Begin Journey
                  </Link>
                  <Link
                    to="/login"
                    className="px-10 py-3 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm font-medium uppercase tracking-widest hover:border-stone-900 dark:hover:border-stone-300 transition-colors duration-300"
                  >
                    View Demo
                  </Link>
                </>
              )}
            </div>

            {/* Classical Stats layout with serif touches */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-10 border-t border-stone-200 dark:border-stone-800 transition-colors duration-300">
              <div className="text-center">
                <div className="text-3xl font-serif text-stone-900 dark:text-stone-100 mb-1 transition-colors duration-300">99.9%</div>
                <div className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif text-stone-900 dark:text-stone-100 mb-1 transition-colors duration-300">&lt;50ms</div>
                <div className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif text-stone-900 dark:text-stone-100 mb-1 transition-colors duration-300">24/7</div>
                <div className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 dark:text-stone-100 mb-4 transition-colors duration-300">
              Pillars of Performance
            </h2>
            <div className="w-12 h-px bg-stone-400 dark:bg-stone-600 mx-auto my-6 transition-colors duration-300"></div>
            <p className="text-stone-600 dark:text-stone-400 max-w-xl mx-auto transition-colors duration-300">
              Precision tools designed for modern engineering teams who demand clarity without the clutter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {/* Feature 1 */}
            <div className="group">
              <div className="mb-4 text-stone-400 dark:text-stone-500 transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-serif text-stone-900 dark:text-stone-100 mb-3 transition-colors duration-300">Real-time Metrics</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed transition-colors duration-300">
                Track latency, throughput, and performance metrics instantaneously. Precision when it matters most.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="mb-4 text-stone-400 dark:text-stone-500 transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-serif text-stone-900 dark:text-stone-100 mb-3 transition-colors duration-300">Refined Detection</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed transition-colors duration-300">
                Algorithms distinguish between subtle regressions and anomalies. Sophisticated heuristics for deeper insights.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="mb-4 text-stone-400 dark:text-stone-500 transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-serif text-stone-900 dark:text-stone-100 mb-3 transition-colors duration-300">Code Provenance</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed transition-colors duration-300">
                Version-controlled performance baselines directly tied to your source. Complete historical awareness.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group">
              <div className="mb-4 text-stone-400 dark:text-stone-500 transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-serif text-stone-900 dark:text-stone-100 mb-3 transition-colors duration-300">Hardware Symbiosis</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed transition-colors duration-300">
                Probe CPU cycles, cache utilization, and branch predictions. A transparent window into the machine.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group">
              <div className="mb-4 text-stone-400 dark:text-stone-500 transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-lg font-serif text-stone-900 dark:text-stone-100 mb-3 transition-colors duration-300">Tasteful Alerts</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed transition-colors duration-300">
                Surgically precise notifications crafted to inform, not to overwhelm. Signal above the noise.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group">
              <div className="mb-4 text-stone-400 dark:text-stone-500 transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-serif text-stone-900 dark:text-stone-100 mb-3 transition-colors duration-300">Scholarly Reporting</h3>
              <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed transition-colors duration-300">
                Comprehensive, document-grade reports. Communicate performance metrics with executive clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24 bg-stone-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 dark:text-stone-100 mb-4 transition-colors duration-300">
              The Architects
            </h2>
            <div className="w-12 h-px bg-stone-400 dark:bg-stone-600 mx-auto my-6 transition-colors duration-300"></div>
            <p className="text-stone-600 dark:text-stone-400 max-w-xl mx-auto transition-colors duration-300">
              Meet the minds behind the telemetry. A collective of engineers obsessed with absolute precision.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-10 lg:gap-14">
            {/* Shivansh Mittal */}
            <div className="text-center w-full sm:w-1/3 lg:w-1/4 group">
              <div className="w-24 h-24 mx-auto bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 text-stone-500 dark:text-stone-400 font-serif text-2xl group-hover:bg-stone-900 dark:group-hover:bg-stone-100 group-hover:text-stone-50 dark:group-hover:text-stone-900 transition-colors duration-300">
                SM
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mb-1 transition-colors duration-300">Shivansh Mittal</h3>
              <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 transition-colors duration-300">Founder & CEO</p>
            </div>

            {/* Suryansh Chauhan */}
            <div className="text-center w-full sm:w-1/3 lg:w-1/4 group">
              <div className="w-24 h-24 mx-auto bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 text-stone-500 dark:text-stone-400 font-serif text-2xl group-hover:bg-stone-900 dark:group-hover:bg-stone-100 group-hover:text-stone-50 dark:group-hover:text-stone-900 transition-colors duration-300">
                SC
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mb-1 transition-colors duration-300">Suryansh Chauhan</h3>
              <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 transition-colors duration-300">Co-Founder & CTO</p>
            </div>

            {/* Shubham Kumar */}
            <div className="text-center w-full sm:w-1/3 lg:w-1/4 group">
              <div className="w-24 h-24 mx-auto bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 text-stone-500 dark:text-stone-400 font-serif text-2xl group-hover:bg-stone-900 dark:group-hover:bg-stone-100 group-hover:text-stone-50 dark:group-hover:text-stone-900 transition-colors duration-300">
                SK
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mb-1 transition-colors duration-300">Shubham Kumar</h3>
              <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 transition-colors duration-300">Head of Perf Engineering</p>
            </div>

            {/* Shyamal Mishra */}
            <div className="text-center w-full sm:w-1/3 lg:w-1/4 group">
              <div className="w-24 h-24 mx-auto bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 text-stone-500 dark:text-stone-400 font-serif text-2xl group-hover:bg-stone-900 dark:group-hover:bg-stone-100 group-hover:text-stone-50 dark:group-hover:text-stone-900 transition-colors duration-300">
                SM
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mb-1 transition-colors duration-300">Shyamal Mishra</h3>
              <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 transition-colors duration-300">Lead Systems Architect</p>
            </div>

            {/* Uday Pratap Singh */}
            <div className="text-center w-full sm:w-1/3 lg:w-1/4 group">
              <div className="w-24 h-24 mx-auto bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 text-stone-500 dark:text-stone-400 font-serif text-2xl group-hover:bg-stone-900 dark:group-hover:bg-stone-100 group-hover:text-stone-50 dark:group-hover:text-stone-900 transition-colors duration-300">
                UP
              </div>
              <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mb-1 transition-colors duration-300">Uday Pratap Singh</h3>
              <p className="text-xs uppercase tracking-widest text-stone-500 dark:text-stone-400 transition-colors duration-300">VP of Product & Design</p>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24 bg-stone-100 dark:bg-stone-900/50 border-t border-stone-200 dark:border-stone-800 text-center transition-colors duration-300">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif text-stone-900 dark:text-stone-100 mb-6 transition-colors duration-300">
            Elevate your standards.
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-10 transition-colors duration-300">
            Join the collective of engineering teams who treat performance as a fundamental craft.
          </p>
          {userInfo ? (
            <Link
              to="/dashboard"
              className="inline-block px-10 py-3 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors duration-300"
            >
              Control Panel
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-block px-10 py-3 bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors duration-300"
            >
              Reserve Your Access
            </Link>
          )}
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="px-6 lg:px-12 py-12 bg-white dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 transition-colors duration-300">
            PerfSight.
          </div>
          <p className="text-stone-400 dark:text-stone-500 text-xs tracking-wider uppercase transition-colors duration-300">
            © {new Date().getFullYear()} PerfSight. Designed for permanence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
