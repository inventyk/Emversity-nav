/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { College } from '../types';
import { BarChart, TrendingUp, DollarSign, Users, Award } from 'lucide-react';

interface DashboardChartsProps {
  colleges: College[];
}

export default function DashboardCharts({ colleges }: DashboardChartsProps) {
  const [activeTab, setActiveTab] = useState<'roi' | 'intake'>('roi');

  // Chart Dimensions
  const containerHeight = 260;
  const paddingBottom = 40;
  const chartHeight = containerHeight - paddingBottom;

  // TAB 1: ROI data mapping (Fee vs Placement Packages)
  // Let's take top 10 or all colleges for neat visualization
  const roiData = colleges.slice(0, 10).map((col) => ({
    name: col.name.length > 20 ? `${col.name.substring(0, 18)}...` : col.name,
    fullName: col.name,
    fee: col.annualFee, // in Lakhs
    placement: col.avgPlacementPackage || 2, // in LPA
    state: col.state
  }));

  const maxFee = Math.max(...roiData.map((d) => d.fee)) || 5;
  const maxPlacement = Math.max(...roiData.map((d) => d.placement)) || 10;
  const maxValY1 = Math.ceil(maxFee);
  const maxValY2 = Math.ceil(maxPlacement);

  // TAB 2: State intake aggregate trends
  const stateAggregates = colleges.reduce((acc, col) => {
    if (!acc[col.state]) {
      acc[col.state] = { state: col.state, intake: 0, count: 0 };
    }
    acc[col.state].intake += col.learnerIntake;
    acc[col.state].count += 1;
    return acc;
  }, {} as { [key: string]: { state: string; intake: number; count: number } });

  const stateData = Object.values(stateAggregates).sort((a, b) => b.intake - a.intake);
  const maxIntake = Math.max(...stateData.map((d) => d.intake)) || 1000;
  const maxIntakeY = Math.ceil(maxIntake / 100) * 100;

  return (
    <div className="border border-[#27272a] bg-[#111113] rounded-3xl p-6 shadow-lg">
      {/* Tab select and header info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#f59e0b] bg-[#27272a] px-2.5 py-1 rounded-full border border-[#f59e0b]/20">
            Analytics Studio
          </span>
          <h2 className="font-sans font-bold text-white text-xl tracking-tight mt-1.5">
            Key Institutional Trends
          </h2>
        </div>

        <div className="flex bg-[#18181b] p-1 rounded-xl border border-[#27272a] w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('roi')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === 'roi'
                ? 'bg-[#27272a] text-[#f59e0b] shadow-sm'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            Fee vs Placement ROI
          </button>
          <button
            onClick={() => setActiveTab('intake')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
              activeTab === 'intake'
                ? 'bg-[#27272a] text-[#f59e0b] shadow-sm'
                : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            State Enrollment Capacity
          </button>
        </div>
      </div>

      {/* Render Dynamic Charts */}
      {activeTab === 'roi' ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
            <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-xl">
              <span className="text-[10px] font-medium text-[#f59e0b] uppercase tracking-widest block">
                Average Placement
              </span>
              <span className="font-sans font-bold text-white text-lg">
                ~5.8 LPA
              </span>
            </div>
            <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-xl">
              <span className="text-[10px] font-medium text-[#10b981] uppercase tracking-widest block">
                Typical Course Duration
              </span>
              <span className="font-sans font-bold text-white text-lg">
                4 Years (3+1)
              </span>
            </div>
            <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-xl col-span-2">
              <p className="text-[10px] text-[#a1a1aa] leading-relaxed font-mono">
                💡 <strong className="text-[#f59e0b]">ROI Insight:</strong> DBS Global and Techno India offer the highest reported direct clinical placement rates relative to initial tuition booking.
              </p>
            </div>
          </div>

          {/* SVG Multi bar chart (Tuition Fee in Indigo, Placement in Green) */}
          <div className="relative h-[280px] w-full mt-4">
            <svg viewBox={`0 0 800 ${containerHeight}`} className="w-full h-full">
              {/* Y Axis Guides */}
              {Array.from({ length: 5 }).map((_, i) => {
                const stepY = (chartHeight / 4) * i;
                const valueY1 = (maxValY1 / 4) * (4 - i);
                return (
                  <g key={i}>
                    <line
                      x1="45"
                      y1={stepY}
                      x2="760"
                      y2={stepY}
                      stroke="rgba(161,161,170,0.1)"
                      strokeWidth="1"
                    />
                    <text x="5" y={stepY + 4} className="fill-[#71717a] text-[9px] font-mono">
                      {valueY1.toFixed(1)}L
                    </text>
                  </g>
                );
              })}

              {/* Bars rendering */}
              {roiData.map((d, i) => {
                const barSpacing = 72;
                const startX = 55 + i * barSpacing;
                
                // Heights
                const feePercentage = d.fee / maxValY1;
                const feeHeight = feePercentage * chartHeight;
                
                const placementPercentage = d.placement / maxValY1; // map on same axis for dual bars
                const placementHeight = placementPercentage * chartHeight;

                return (
                  <g key={d.fullName} className="group">
                    {/* Hover highlights overlay */}
                    <rect
                      x={startX - 10}
                      y="0"
                      width="60"
                      height={chartHeight}
                      className="fill-white/0 hover:fill-white/5 transition-colors pointer-events-auto cursor-pointer"
                    />

                    {/* Left Bar: Tuition Fee (Steel Gray) */}
                    <motion.rect
                      x={startX}
                      y={chartHeight - feeHeight}
                      width="18"
                      height={feeHeight}
                      rx="3"
                      className="fill-[#52525b]/90 cursor-pointer value-hover"
                      initial={{ height: 0, y: chartHeight }}
                      animate={{ height: feeHeight, y: chartHeight - feeHeight }}
                      transition={{ duration: 0.8, delay: i * 0.04, type: 'spring', stiffness: 120 }}
                    />

                    {/* Right Bar: Average Placement (Sophisticated Amber) */}
                    <motion.rect
                      x={startX + 22}
                      y={chartHeight - placementHeight}
                      width="18"
                      height={placementHeight}
                      rx="3"
                      className="fill-[#f59e0b] cursor-pointer"
                      initial={{ height: 0, y: chartHeight }}
                      animate={{ height: placementHeight, y: chartHeight - placementHeight }}
                      transition={{ duration: 0.8, delay: i * 0.04 + 0.1, type: 'spring', stiffness: 120 }}
                    />

                    {/* Labels under the bars */}
                    <text
                      x={startX + 20}
                      y={containerHeight - 15}
                      textAnchor="middle"
                      className="fill-[#a1a1aa] text-[9px] font-sans"
                    >
                      {d.name}
                    </text>

                    {/* Mini Dynamic tooltips */}
                    <g
                      transform={`translate(${startX + 18}, ${Math.min(chartHeight - feeHeight, chartHeight - placementHeight) - 25})`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-250"
                    >
                      <rect
                        x="-60"
                        y="-30"
                        width="120"
                        height="34"
                        rx="4"
                        className="fill-[#18181b] border border-[#27272a] shadow-2xl"
                        stroke="#3f3f46"
                        strokeWidth="1"
                      />
                      <text x="0" y="-18" textAnchor="middle" className="fill-white font-sans text-[8px] font-semibold">
                        {d.fullName.length > 20 ? `${d.fullName.substring(0, 18)}...` : d.fullName}
                      </text>
                      <text x="0" y="-8" textAnchor="middle" className="fill-[#f59e0b] font-mono text-[8px]">
                        Fee: {d.fee.toFixed(2)}L | Placement: {d.placement.toFixed(1)} LPA
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Custom chart legend */}
            <div className="absolute top-2 right-4 flex items-center gap-4 text-[10px] text-[#a1a1aa]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 bg-[#52525b] rounded-full inline-block"></span>
                <span>Annual Tuition Fee (Lakhs)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 bg-[#f59e0b] rounded-full inline-block"></span>
                <span>Avg Placement package (LPA)</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* TAB 2: State Enrollment Capacity (Total capacity of colleges mapped top down) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-5">
            <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-xl">
              <span className="text-[10px] font-medium text-[#f59e0b] uppercase tracking-widest block">
                Total Listed Colleges
              </span>
              <span className="font-sans font-bold text-white text-lg">
                24 Campuses
              </span>
            </div>
            <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-xl">
              <span className="text-[10px] font-medium text-[#10b981] uppercase tracking-widest block">
                Total Cumulative Intake
              </span>
              <span className="font-sans font-bold text-white text-lg">
                8,036 Students
              </span>
            </div>
            <div className="p-3 bg-[#18181b] border border-[#27272a] rounded-xl col-span-2">
              <p className="text-[10px] text-[#a1a1aa] leading-relaxed font-mono">
                📊 <strong className="text-[#f59e0b]">Geographic Hotspot:</strong> Karnataka and Tamil Nadu are the absolute largest allied health science educational hubs with over 2000+ total combined learner intakes.
              </p>
            </div>
          </div>

          <div className="relative h-[280px] w-full mt-4">
            <svg viewBox={`0 0 800 ${containerHeight}`} className="w-full h-full">
              {/* Y Axis lines */}
              {Array.from({ length: 5 }).map((_, i) => {
                const stepY = (chartHeight / 4) * i;
                const valueY = (maxIntakeY / 4) * (4 - i);
                return (
                  <g key={i}>
                    <line
                      x1="45"
                      y1={stepY}
                      x2="760"
                      y2={stepY}
                      stroke="rgba(161,161,170,0.1)"
                      strokeWidth="1"
                    />
                    <text x="5" y={stepY + 4} className="fill-[#71717a] text-[9px] font-mono">
                      {Math.round(valueY)}
                    </text>
                  </g>
                );
              })}

              {/* State Bars rendering */}
              {stateData.map((d, i) => {
                const totalBars = stateData.length;
                const plotWidth = 700;
                const spacing = totalBars > 0 ? plotWidth / totalBars : 60;
                const startX = 65 + i * spacing;
                const barWidth = Math.max(15, spacing - 16);

                const htPercentage = d.intake / maxIntakeY;
                const barHeight = htPercentage * chartHeight;

                return (
                  <g key={d.state} className="group">
                    {/* Hover highlights */}
                    <rect
                      x={startX - 6}
                      y="0"
                      width={barWidth + 12}
                      height={chartHeight}
                      className="fill-white/0 hover:fill-white/5 transition-colors pointer-events-auto cursor-pointer"
                    />

                    {/* Solid Bar */}
                    <motion.rect
                      x={startX}
                      y={chartHeight - barHeight}
                      width={barWidth}
                      height={barHeight}
                      rx="4"
                      className="fill-[#f59e0b]/90 hover:fill-[#fbbf24] cursor-pointer"
                      initial={{ height: 0, y: chartHeight }}
                      animate={{ height: barHeight, y: chartHeight - barHeight }}
                      transition={{ duration: 0.8, delay: i * 0.05, type: 'spring', stiffness: 120 }}
                    />

                    {/* Labels under the bars */}
                    <text
                      x={startX + barWidth / 2}
                      y={containerHeight - 15}
                      textAnchor="middle"
                      className="fill-[#a1a1aa] text-[8px] font-mono font-medium"
                    >
                      {d.state.substring(0, 10)}
                    </text>

                    {/* Bar details label inside or above */}
                    <text
                      x={startX + barWidth / 2}
                      y={chartHeight - barHeight - 8}
                      textAnchor="middle"
                      className="fill-[#f59e0b] text-[9px] font-bold font-mono opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"
                    >
                      {d.intake} Students
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Custom chart legend */}
            <div className="absolute top-2 right-4 flex items-center gap-4 text-[10px] text-[#a1a1aa]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1.5 bg-[#f59e0b] rounded-full inline-block"></span>
                <span>Cumulative Student Seat Capacity By State</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
