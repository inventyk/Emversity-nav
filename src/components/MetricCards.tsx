/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { College } from '../types';
import { Award, GraduationCap, MapPin, Building2, Phone } from 'lucide-react';

interface MetricCardsProps {
  colleges: College[];
}

export default function MetricCards({ colleges }: MetricCardsProps) {
  // Compute key stats
  const totalIntake = colleges.reduce((sum, c) => sum + (c.learnerIntake || 0), 0);
  const openAdmissions = colleges.filter(c => c.admissionStatus === 'Admission 2026 Open').length;
  
  // High quality program distinct list
  const distinctPrograms = Array.from(
    new Set(colleges.flatMap(c => c.programsList))
  ).length;

  const statesCount = Array.from(new Set(colleges.map(c => c.state))).length;
  const maxRoi = Math.max(...colleges.map(c => c.avgPlacementPackage || 0));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* card 1 */}
      <div className="relative border border-[#27272a] bg-[#111113] rounded-2xl p-5 shadow-lg overflow-hidden flex flex-col justify-between group hover:border-[#f59e0b]/40 transition-colors duration-300">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-[#a1a1aa]">Listed Campuses</span>
          <span className="p-1 px-2.5 text-[10px] rounded-full font-bold bg-[#27272a] text-[#f59e0b] border border-[#f59e0b]/20">
            {openAdmissions} Open
          </span>
        </div>
        <div className="mt-2">
          <span className="font-sans font-extrabold text-[#e4e4e7] text-2xl lg:text-3xl tracking-tight">
            {colleges.length}
          </span>
          <span className="text-[#10b981] text-[10px] block font-mono mt-1">
            Across {statesCount} Indian States
          </span>
        </div>
        <div className="absolute right-[-10px] bottom-[-10px] opacity-5 text-white group-hover:scale-110 transition-transform duration-300">
          <Building2 className="w-20 h-20" />
        </div>
      </div>

      {/* card 2 */}
      <div className="relative border border-[#27272a] bg-[#111113] rounded-2xl p-5 shadow-lg overflow-hidden flex flex-col justify-between group hover:border-[#f59e0b]/40 transition-colors duration-300">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-[#a1a1aa]">Allied Programs Offered</span>
          <span className="p-1.5 rounded-lg bg-[#27272a] text-[#f59e0b]">
            <GraduationCap className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="mt-2">
          <span className="font-sans font-extrabold text-[#e4e4e7] text-2xl lg:text-3xl tracking-tight">
            {distinctPrograms}
          </span>
          <span className="text-[#a1a1aa] text-[10px] block font-mono mt-1">
            Across B.AOTT, CVT, BPT, etc.
          </span>
        </div>
        <div className="absolute right-[-10px] bottom-[-10px] opacity-5 text-white group-hover:scale-110 transition-transform duration-300">
          <GraduationCap className="w-20 h-20" />
        </div>
      </div>

      {/* card 3 */}
      <div className="relative border border-[#27272a] bg-[#111113] rounded-2xl p-5 shadow-lg overflow-hidden flex flex-col justify-between group hover:border-[#f59e0b]/40 transition-colors duration-300">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-[#a1a1aa]">Cumulative Seat Intake</span>
          <span className="p-1.5 rounded-lg bg-[#27272a] text-[#f59e0b]">
            <Building2 className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="mt-2">
          <span className="font-sans font-extrabold text-[#e4e4e7] text-2xl lg:text-3xl tracking-tight">
            {totalIntake.toLocaleString()}
          </span>
          <span className="text-[#a1a1aa] text-[10px] block font-mono mt-1">
            Seats Open For 2026 Batch
          </span>
        </div>
        <div className="absolute right-[-10px] bottom-[-10px] opacity-5 text-white group-hover:scale-110 transition-transform duration-300">
          <Award className="w-20 h-20" />
        </div>
      </div>

      {/* card 4 */}
      <div className="relative border border-[#27272a] bg-[#111113] rounded-2xl p-5 shadow-lg overflow-hidden flex flex-col justify-between group hover:border-[#f59e0b]/40 transition-colors duration-300">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-[#a1a1aa]">Top Average Package</span>
          <span className="p-1.5 rounded-lg bg-[#27272a] text-[#f59e0b]">
            <Award className="w-3.5 h-3.5" />
          </span>
        </div>
        <div className="mt-2">
          <span className="font-sans font-extrabold text-[#e4e4e7] text-2xl lg:text-3xl tracking-tight">
            {maxRoi.toFixed(1)} LPA
          </span>
          <span className="text-[#f59e0b] text-[10px] block font-mono mt-1">
            Max Average Recorded Placement
          </span>
        </div>
        <div className="absolute right-[-10px] bottom-[-10px] opacity-5 text-white group-hover:scale-110 transition-transform duration-300">
          <MapPin className="w-20 h-20" />
        </div>
      </div>
    </div>
  );
}
