import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Hero = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 relative">
      {/* Subtle top border line for classic editorial feel */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-stone-900"></div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-6 lg:px-12 border-b border-stone-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl font-serif font-bold tracking-tight text-stone-900">
              PerfSight.
            </span>
          </Link>
          
          <div className="flex items-center gap-6">
            {userInfo ? (
              <Link
                to="/dashboard"
                className="px-6 py-2 border border-stone-900 text-stone-900 text-sm font-medium hover:bg-stone-900 hover:text-white transition-colors duration-300"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-stone-900 text-stone-50 text-sm font-medium hover:bg-stone-800 transition-colors duration-300"
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
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500 border-b border-stone-300 pb-1">
                Engineering Excellence
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl lg:text-7xl font-serif text-stone-900 mb-8 leading-tight">
              A timeless approach to <br />
              <span className="italic text-stone-600">performance intelligence.</span>
            </h1>

            {/* Subheadline text */}
            <p className="text-lg text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Enterprise-grade telemetry meets sophisticated design. Measure, benchmark, and perfect your software with absolute clarity.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              {userInfo ? (
                <Link
                  to="/dashboard"
                  className="px-10 py-3 bg-stone-900 text-stone-50 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 transition-colors duration-300"
                >
                  Launch Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-10 py-3 bg-stone-900 text-stone-50 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 transition-colors duration-300"
                  >
                    Begin Journey
                  </Link>
                  <Link
                    to="/login"
                    className="px-10 py-3 border border-stone-300 text-stone-900 text-sm font-medium uppercase tracking-widest hover:border-stone-900 transition-colors duration-300"
                  >
                    View Demo
                  </Link>
                </>
              )}
            </div>

            {/* Classical Stats layout with serif touches */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-10 border-t border-stone-200">
              <div className="text-center">
                <div className="text-3xl font-serif text-stone-900 mb-1">99.9%</div>
                <div className="text-xs uppercase tracking-widest text-stone-500">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif text-stone-900 mb-1">&lt;50ms</div>
                <div className="text-xs uppercase tracking-widest text-stone-500">Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif text-stone-900 mb-1">24/7</div>
                <div className="text-xs uppercase tracking-widest text-stone-500">Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-serif text-stone-900 mb-4">
              Pillars of Performance
            </h2>
            <div className="w-12 h-px bg-stone-400 mx-auto my-6"></div>
            <p className="text-stone-600 max-w-xl mx-auto">
              Precision tools designed for modern engineering teams who demand clarity without the clutter.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {/* Feature 1 */}
            <div className="group">
              <div className="mb-4 text-stone-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-serif text-stone-900 mb-3">Real-time Metrics</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Track latency, throughput, and performance metrics instantaneously. Precision when it matters most.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group">
              <div className="mb-4 text-stone-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-serif text-stone-900 mb-3">Refined Detection</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Algorithms distinguish between subtle regressions and anomalies. Sophisticated heuristics for deeper insights.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group">
              <div className="mb-4 text-stone-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-serif text-stone-900 mb-3">Code Provenance</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Version-controlled performance baselines directly tied to your source. Complete historical awareness.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group">
              <div className="mb-4 text-stone-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-serif text-stone-900 mb-3">Hardware Symbiosis</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Probe CPU cycles, cache utilization, and branch predictions. A transparent window into the machine.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group">
              <div className="mb-4 text-stone-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-lg font-serif text-stone-900 mb-3">Tasteful Alerts</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Surgically precise notifications crafted to inform, not to overwhelm. Signal above the noise.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group">
              <div className="mb-4 text-stone-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-serif text-stone-900 mb-3">Scholarly Reporting</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Comprehensive, document-grade reports. Communicate performance metrics with executive clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Elegant CTA Section */}
      <section className="relative z-10 px-6 lg:px-12 py-24 bg-stone-100 border-t border-stone-200 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-serif text-stone-900 mb-6">
            Elevate your standards.
          </h2>
          <p className="text-stone-600 mb-10">
            Join the collective of engineering teams who treat performance as a fundamental craft.
          </p>
          {userInfo ? (
            <Link
              to="/dashboard"
              className="inline-block px-10 py-3 bg-stone-900 text-stone-50 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 transition-colors duration-300"
            >
              Control Panel
            </Link>
          ) : (
            <Link
              to="/register"
              className="inline-block px-10 py-3 bg-stone-900 text-stone-50 text-sm font-medium uppercase tracking-widest hover:bg-stone-800 transition-colors duration-300"
            >
              Reserve Your Access
            </Link>
          )}
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="px-6 lg:px-12 py-12 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-serif font-bold text-stone-900">
            PerfSight.
          </div>
          <p className="text-stone-400 text-xs tracking-wider uppercase">
            © {new Date().getFullYear()} PerfSight. Designed for permanence.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
