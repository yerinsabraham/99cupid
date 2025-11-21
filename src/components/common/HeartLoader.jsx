import './HeartLoader.css';

export default function HeartLoader({ text = 'Loading...', size = 'medium' }) {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`heart-loader ${sizes[size]}`}>
        <svg viewBox="0 0 32 29.6" className="w-full h-full">
          <path
            d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
            c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"
            fill="currentColor"
            className="text-pink-600"
          />
        </svg>
      </div>
      {text && (
        <p className="text-gray-600 font-medium text-sm animate-pulse">{text}</p>
      )}
    </div>
  );
}
