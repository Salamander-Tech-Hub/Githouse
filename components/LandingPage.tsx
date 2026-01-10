import React from 'react';

interface LandingPageProps {
  onJoinHub: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onJoinHub }) => {
  return (
    <div className="bg-brand-dark font-sans text-gray-300">
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 bg-brand-dark/80 backdrop-blur-sm border-b border-brand-gray-light">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand-yellow rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-brand-ink">all_inclusive</span>
              </div>
              <span className="text-xl font-bold text-white">Salamander</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a className="text-sm font-medium hover:text-white" href="#">Projects</a>
              <a className="text-sm font-medium hover:text-white" href="#">Developers</a>
              <a className="text-sm font-medium hover:text-white" href="#">Docs</a>
              <a className="text-sm font-medium hover:text-white" href="#">Community</a>
            </nav>
            <div className="flex items-center gap-4">
              <div className="relative hidden sm:block">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input className="w-48 pl-10 pr-4 py-2 text-sm bg-brand-gray-light border border-brand-gray rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition-colors" placeholder="Search..." type="text"/>
              </div>
              <button onClick={onJoinHub} className="px-4 py-2 text-sm font-semibold bg-brand-yellow text-brand-ink rounded-lg hover:brightness-95 transition-all">
                Join Hub
              </button>
            </div>
          </div>
        </header>
        <main className="flex-grow">
          <section className="py-24 md:py-32">
            <div className="container mx-auto px-6 text-center">
              <div className="inline-block bg-brand-yellow p-4 rounded-3xl mb-8">
                <div className="bg-brand-ink px-12 py-6 rounded-2xl relative">
                  <span className="absolute top-4 left-6 text-[0.6rem] uppercase tracking-widest text-gray-400 font-bold">Tech Hub</span>
                  <h1 className="font-display text-5xl sm:text-7xl md:text-8xl text-brand-yellow leading-none">salamander</h1>
                  <span className="absolute bottom-4 right-6 text-[0.6rem] uppercase tracking-widest text-gray-400 font-bold">Since 2025</span>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white max-w-4xl mx-auto leading-tight">The Open-Source Platform for Collaborative Innovation</h2>
              <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto">
                Build, share, and discover cutting-edge projects. Salamander is where the next generation of technology is forged by a global community of developers.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                <a className="w-full sm:w-auto px-8 py-3 font-semibold bg-brand-yellow text-brand-ink rounded-lg hover:brightness-95 transition-all flex items-center justify-center gap-2" href="#">
                  <span className="material-symbols-outlined">explore</span>
                  Explore Projects
                </a>
                <a className="w-full sm:w-auto px-8 py-3 font-semibold bg-brand-gray-light text-gray-300 rounded-lg hover:bg-brand-gray transition-colors flex items-center justify-center gap-2" href="#">
                  <span className="material-symbols-outlined">description</span>
                  Read the Docs
                </a>
              </div>
            </div>
          </section>
          <section className="py-16 bg-brand-gray-light">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                <div className="p-6 bg-brand-dark rounded-lg">
                  <p className="text-4xl font-bold text-brand-yellow">12k+</p>
                  <p className="mt-2 text-sm text-gray-400 uppercase tracking-wider font-semibold">Active Projects</p>
                </div>
                <div className="p-6 bg-brand-dark rounded-lg">
                  <p className="text-4xl font-bold text-brand-yellow">150k+</p>
                  <p className="mt-2 text-sm text-gray-400 uppercase tracking-wider font-semibold">Developers</p>
                </div>
                <div className="p-6 bg-brand-dark rounded-lg">
                  <p className="text-4xl font-bold text-brand-yellow">2.1M+</p>
                  <p className="mt-2 text-sm text-gray-400 uppercase tracking-wider font-semibold">Contributions</p>
                </div>
                <div className="p-6 bg-brand-dark rounded-lg">
                  <p className="text-4xl font-bold text-brand-yellow">85</p>
                  <p className="mt-2 text-sm text-gray-400 uppercase tracking-wider font-semibold">Countries</p>
                </div>
              </div>
            </div>
          </section>
          <section className="py-24">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold text-white">Featured Repositories</h3>
                <p className="mt-3 text-gray-400 max-w-2xl mx-auto">Discover projects that are pushing the boundaries of technology and gaining momentum.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-brand-gray-light rounded-lg p-6 flex flex-col bg-brand-dark hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-brand-yellow">layers</span>
                    <h4 className="font-bold text-lg text-white truncate">Project-Phoenix</h4>
                  </div>
                  <p className="text-sm text-gray-400 flex-grow mb-4">A declarative UI framework for building reactive web applications with unparalleled performance.</p>
                  <div className="flex items-center text-sm text-gray-500 gap-4 mt-auto">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-brand-yellow"></span>
                      JavaScript
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">star</span>
                      1.2k
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">account_tree</span>
                      256
                    </span>
                  </div>
                </div>
                <div className="border border-brand-gray-light rounded-lg p-6 flex flex-col bg-brand-dark hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-brand-yellow">neurology</span>
                    <h4 className="font-bold text-lg text-white truncate">SynapseML</h4>
                  </div>
                  <p className="text-sm text-gray-400 flex-grow mb-4">A lightweight, fast, and user-friendly machine learning library built on top of tensor primitives.</p>
                  <div className="flex items-center text-sm text-gray-500 gap-4 mt-auto">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      Python
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">star</span>
                      980
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">account_tree</span>
                      102
                    </span>
                  </div>
                </div>
                <div className="border border-brand-gray-light rounded-lg p-6 flex flex-col bg-brand-dark hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-brand-yellow">shield</span>
                    <h4 className="font-bold text-lg text-white truncate">Krypton-Core</h4>
                  </div>
                  <p className="text-sm text-gray-400 flex-grow mb-4">End-to-end encrypted communication protocol for decentralized networks and applications.</p>
                  <div className="flex items-center text-sm text-gray-500 gap-4 mt-auto">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                      Rust
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">star</span>
                      750
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">account_tree</span>
                      88
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <footer className="bg-brand-gray-light border-t border-brand-gray">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-sm text-gray-400">© 2025 Salamander Tech Hub. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <a className="text-gray-400 hover:text-white transition-colors" href="#">Privacy</a>
                <a className="text-gray-400 hover:text-white transition-colors" href="#">Terms</a>
                <a className="text-gray-400 hover:text-white transition-colors" href="#">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
