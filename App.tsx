import React, { useState } from 'react';
import Terminal from './components/Terminal';
import SystemMonitor from './components/SystemMonitor';
import NetworkMap from './components/NetworkMap';

const App: React.FC = () => {
  const [activity, setActivity] = useState(0);

  const handleActivity = () => {
    setActivity(prev => prev + 1);
  };

  return (
    <div className="w-screen h-screen bg-dark-bg text-blue-term overflow-hidden flex flex-col relative">
      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-10 animate-scanline bg-gradient-to-b from-transparent via-blue-term/20 to-transparent h-[100px] w-full" />
      
      {/* Header */}
      <header className="h-12 border-b border-blue-term/30 flex items-center justify-between px-6 bg-black/50 z-40 backdrop-blur-sm">
        <div className="flex items-center gap-4">
            <div className="text-xl font-bold font-mono tracking-widest text-shadow-glow">BLUE-TERMINAL</div>
            <div className="text-xs bg-blue-term/20 px-2 py-0.5 rounded text-blue-300 font-mono">SECURE_CONNECTION</div>
        </div>
        <div className="font-mono text-xs flex gap-6">
            <span className="opacity-70">LOC: 127.0.0.1</span>
            <span className="opacity-70">UPTIME: 42:10:33</span>
            <span className={activity % 2 === 0 ? "text-blue-term" : "text-white"}>● LIVE</span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Column: Terminal */}
        <section className="flex-1 min-w-[60%] h-full relative">
            <Terminal onActivity={handleActivity} />
        </section>

        {/* Right Column: Visuals (Hidden on small screens) */}
        <aside className="hidden md:flex w-[400px] flex-col h-full border-l border-blue-term/30 bg-black/20">
            <div className="h-1/2 border-b border-blue-term/30">
                <SystemMonitor />
            </div>
            <div className="h-1/2">
                <NetworkMap />
            </div>
        </aside>
      </main>

      {/* Mobile Visuals Toggle (Optional, usually just hide visuals on mobile for cleaner terminal) */}
      <div className="md:hidden absolute top-14 right-4 z-50">
        <div className="w-2 h-2 bg-blue-term rounded-full animate-ping"></div>
      </div>
    </div>
  );
};

export default App;