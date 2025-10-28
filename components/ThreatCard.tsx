
import React from 'react';
import { Vulnerability } from '../types';

interface ThreatCardProps {
  threat: Vulnerability;
}

const InfoRow: React.FC<{ label: string; value: string; isCode?: boolean }> = ({ label, value, isCode = false }) => (
  <div className="py-3 sm:grid sm:grid-cols-4 sm:gap-4">
    <dt className="text-sm font-medium text-cyan-300">{label}</dt>
    <dd className={`mt-1 text-sm text-gray-300 sm:mt-0 sm:col-span-3 ${isCode ? 'font-mono bg-gray-800 p-2 rounded' : ''}`}>{value}</dd>
  </div>
);


export const ThreatCard: React.FC<ThreatCardProps> = ({ threat }) => {
  const getCvssColor = (score: string) => {
    const scoreNum = parseFloat(score);
    if (scoreNum >= 9.0) return 'bg-red-500/80 border-red-400';
    if (scoreNum >= 7.0) return 'bg-orange-500/80 border-orange-400';
    if (scoreNum >= 4.0) return 'bg-yellow-500/80 border-yellow-400';
    if (scoreNum > 0) return 'bg-blue-500/80 border-blue-400';
    return 'bg-gray-500/80 border-gray-400';
  }
  
  const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Zero-Day Vulnerability':
            return 'bg-red-600/80 border-red-500 text-red-100';
        case 'CVE':
            return 'bg-yellow-600/80 border-yellow-500 text-yellow-100';
        case 'News':
            return 'bg-blue-600/80 border-blue-500 text-blue-100';
        default:
            return 'bg-gray-600/80 border-gray-500 text-gray-100';
    }
  }

  return (
    <div className="bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:border-cyan-500/50">
      <div className="px-4 py-5 sm:px-6 bg-gray-800/50">
        <div className="flex flex-wrap items-center justify-between gap-y-2">
            <h3 className="text-lg leading-6 font-medium text-cyan-400 w-full sm:w-auto">{threat.vulnerability}</h3>
            <div className="flex items-center gap-x-3">
                {threat.category && (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getCategoryColor(threat.category)}`}>
                        {threat.category}
                    </span>
                )}
                {threat.cvssScore && threat.cvssScore.toLowerCase() !== 'n/a' && (
                    <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full border ${getCvssColor(threat.cvssScore)}`}>
                        CVSS: {threat.cvssScore}
                    </span>
                )}
            </div>
        </div>
        <p className="mt-2 max-w-2xl text-sm text-gray-400">{threat.generalDescription}</p>
        {threat.date && (
            <p className="mt-1 text-xs text-gray-500">
                Reported on: {new Date(threat.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
            </p>
        )}
      </div>
      <div className="border-t border-gray-700/50 px-4 py-5 sm:px-6">
        <dl className="divide-y divide-gray-800">
          <InfoRow label="Vulnerability Description" value={threat.vulnerabilityDescription} />
          <InfoRow label="Affected Systems" value={threat.affectedSystems} isCode={true} />
          <InfoRow label="Impact" value={threat.impact} />
          <InfoRow label="Recommendations" value={threat.recommendations} />
        </dl>
      </div>
    </div>
  );
};