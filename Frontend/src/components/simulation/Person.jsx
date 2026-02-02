import { motion } from 'framer-motion';
import { UserCircle } from 'lucide-react';

const Person = ({ person, onClick, location }) => {
  const avatarColors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-red-500'
  ];
  
  const colorIndex = person.id % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  return (
    <motion.button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all cursor-pointer ${
        location === 'outside' 
          ? 'bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-primary-500' 
          : 'bg-white/90 hover:bg-white border-2 border-white hover:border-primary-500 shadow-lg'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`w-14 h-14 ${avatarColor} rounded-full flex items-center justify-center text-white shadow-md`}>
        <UserCircle size={32} />
      </div>
      <span className="text-xs font-medium text-gray-700">{person.name}</span>
      <span className="text-xs text-gray-500">
        {location === 'outside' ? 'Click to enter' : 'Click to exit'}
      </span>
    </motion.button>
  );
};

export default Person;
