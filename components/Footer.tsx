
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/50 p-4 mt-8 border-t border-gray-700/50">
      <div className="container mx-auto text-center text-gray-500 text-sm">
        <p>Powered by Gemini API. Data is for informational purposes only.</p>
        <p className="mt-1">
            Note: Automated email/WhatsApp alerts require a backend service and are not implemented in this demo.
        </p>
      </div>
    </footer>
  );
};
