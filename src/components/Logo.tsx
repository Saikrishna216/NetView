import React from 'react';
import { Film } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <Film className="text-netflix-red" size={28} />
      <span className="text-netflix-red font-bold text-2xl ml-1">NETVIEW</span>
    </div>
  );
};

export default Logo;