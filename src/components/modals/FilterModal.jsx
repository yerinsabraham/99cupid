import { useState, useEffect } from 'react';
import { X, MapPin, Sliders } from 'lucide-react';

/**
 * FilterModal - Location and preference filters for swipe page
 */
export default function FilterModal({ isOpen, onClose, onApplyFilters, currentFilters = {} }) {
  const [filters, setFilters] = useState({
    location: currentFilters.location || '',
    maxDistance: currentFilters.maxDistance || 'any',
    ageMin: currentFilters.ageMin || 18,
    ageMax: currentFilters.ageMax || 50,
    gender: currentFilters.gender || 'everyone',
    ...currentFilters
  });

  useEffect(() => {
    if (isOpen) {
      // Reset to current filters when modal opens
      setFilters({
        location: currentFilters.location || '',
        maxDistance: currentFilters.maxDistance || 'any',
        ageMin: currentFilters.ageMin || 18,
        ageMax: currentFilters.ageMax || 50,
        gender: currentFilters.gender || 'everyone',
        ...currentFilters
      });
    }
  }, [isOpen, currentFilters]);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters = {
      location: '',
      maxDistance: 'any',
      ageMin: 18,
      ageMax: 50,
      gender: 'everyone'
    };
    setFilters(defaultFilters);
    onApplyFilters(defaultFilters);
    onClose();
  };

  if (!isOpen) return null;

  // List of major Philippine cities/regions for quick selection
  const philippineLocations = [
    'Metro Manila',
    'Quezon City',
    'Manila',
    'Makati',
    'Taguig',
    'Pasig',
    'Cebu City',
    'Davao City',
    'Cagayan de Oro',
    'Iloilo City',
    'Bacolod',
    'Baguio',
    'General Santos',
    'Zamboanga City',
    'Antipolo',
    'Caloocan',
    'Las Piñas',
    'Parañaque',
    'Muntinlupa',
    'Valenzuela'
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in-scale">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Sliders className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Filters</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-white/90">Find matches near you</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Location Filter */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
              <MapPin className="w-4 h-4" />
              <span>Location</span>
            </label>
            
            {/* Manual Input */}
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Enter city or leave blank for all"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors mb-3"
            />

            {/* Quick Select */}
            <div className="text-xs text-gray-500 mb-2">Quick select:</div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {philippineLocations.map((location) => (
                <button
                  key={location}
                  onClick={() => setFilters(prev => ({ ...prev, location }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    filters.location === location
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          {/* Distance Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Maximum Distance
            </label>
            <select
              value={filters.maxDistance}
              onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:outline-none transition-colors"
            >
              <option value="any">Any distance</option>
              <option value="same-city">Same city only</option>
              <option value="same-region">Same region</option>
              <option value="nearby">Nearby cities</option>
            </select>
          </div>

          {/* Age Range */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Age Range: {filters.ageMin} - {filters.ageMax}
            </label>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Minimum Age</label>
                <input
                  type="range"
                  min="18"
                  max="65"
                  value={filters.ageMin}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    setFilters(prev => ({ 
                      ...prev, 
                      ageMin: newMin,
                      ageMax: Math.max(newMin, prev.ageMax)
                    }));
                  }}
                  className="w-full accent-pink-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Maximum Age</label>
                <input
                  type="range"
                  min="18"
                  max="65"
                  value={filters.ageMax}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value);
                    setFilters(prev => ({ 
                      ...prev, 
                      ageMax: newMax,
                      ageMin: Math.min(newMax, prev.ageMin)
                    }));
                  }}
                  className="w-full accent-pink-500"
                />
              </div>
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Show Me
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'everyone', label: 'Everyone' },
                { value: 'men', label: 'Men' },
                { value: 'women', label: 'Women' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilters(prev => ({ ...prev, gender: option.value }))}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    filters.gender === option.value
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50 border-t flex space-x-3">
          <button
            onClick={handleReset}
            className="flex-1 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
