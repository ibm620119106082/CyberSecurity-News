import React from 'react';
import { ThreatCard } from './ThreatCard';
import { Vulnerability } from '../types';

interface CategorySectionProps {
  title: string;
  threats: Vulnerability[];
}

export const CategorySection: React.FC<CategorySectionProps> = ({ title, threats }) => {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-cyan-300 border-b-2 border-gray-700/50 pb-3 mb-6">
        {title}
      </h2>
      <div className="grid gap-6 md:gap-8 grid-cols-1">
        {threats.map((threat, index) => (
          <ThreatCard key={`${threat.vulnerability}-${index}`} threat={threat} />
        ))}
      </div>
    </div>
  );
};