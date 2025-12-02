import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { SystemData } from '../types';

const SystemMonitor: React.FC = () => {
  const [data, setData] = useState<SystemData[]>([]);

  useEffect(() => {
    const updateData = () => {
      setData(currentData => {
        const now = new Date();
        const newDataPoint: SystemData = {
          time: now.toLocaleTimeString(),
          cpu: Math.floor(Math.random() * 40) + 20 + (Math.random() > 0.8 ? 30 : 0), // Random spikes
          memory: Math.floor(Math.random() * 20) + 40,
          network: Math.floor(Math.random() * 80) + 10
        };
        const newData = [...currentData, newDataPoint];
        if (newData.length > 20) newData.shift();
        return newData;
      });
    };

    const interval = setInterval(updateData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full space-y-4 p-4 border-l border-blue-term/20 bg-black/40">
      <h2 className="text-blue-term font-mono text-lg font-bold border-b border-blue-term/50 pb-2">SYSTEM MONITOR</h2>
      
      <div className="flex-1 min-h-[150px]">
        <h3 className="text-blue-term/70 font-mono text-xs mb-1">CPU LOAD</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#050a14', borderColor: '#00f3ff', color: '#00f3ff' }}
              itemStyle={{ color: '#00f3ff' }}
              labelStyle={{ display: 'none' }}
            />
            <Area type="monotone" dataKey="cpu" stroke="#00f3ff" fillOpacity={1} fill="url(#colorCpu)" isAnimationActive={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 min-h-[150px]">
        <h3 className="text-blue-term/70 font-mono text-xs mb-1">NETWORK I/O</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
             <XAxis dataKey="time" hide />
             <YAxis hide />
             <Tooltip 
              contentStyle={{ backgroundColor: '#050a14', borderColor: '#10b981', color: '#10b981' }}
              itemStyle={{ color: '#10b981' }}
              labelStyle={{ display: 'none' }}
            />
             <Line type="step" dataKey="network" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-1/3">
         <h3 className="text-blue-term/70 font-mono text-xs mb-2">ACTIVE THREADS</h3>
         <div className="grid grid-cols-4 gap-2 text-center font-mono text-xs text-blue-term/60">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border border-blue-term/20 p-1">
                    {Math.floor(Math.random() * 999).toString().padStart(3, '0')}
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default SystemMonitor;