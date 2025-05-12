// // components/FilterPanel.tsx
// import React, { useState, useEffect } from 'react';
// import { FilterOptions } from '../types';

// interface FilterPanelProps {
//   filters: FilterOptions;
//   onFilterChange: (filters: FilterOptions) => void;
//   counties: string[];
//   facilities: string[];
//   conditions: string[];
// }

// const FilterPanel: React.FC<FilterPanelProps> = ({ 
//   filters, 
//   onFilterChange, 
//   counties, 
//   facilities, 
//   conditions 
// }) => {
//   const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
//   const [countyFacilities, setCountyFacilities] = useState<string[]>(facilities);

//   useEffect(() => {
//     setLocalFilters(filters);
//   }, [filters]);

//   useEffect(() => {
//     // Simulate filtering facilities by county
//     // In a real app, this would likely be an API call
//     if (filters.location.county !== 'all') {
//       // This is a placeholder - in a real app, you'd filter facilities based on county
//       const filteredFacilities = facilities.filter((_, index) => index % 2 === 0);
//       setCountyFacilities(filteredFacilities);
//     } else {
//       setCountyFacilities(facilities);
//     }
//   }, [filters.location.county, facilities]);

//   const handleChange = (section: keyof FilterOptions, value: any) => {
//     const updatedFilters = { ...localFilters };
    
//     if (section === 'gender') {
//       updatedFilters.gender = value;
//     } else if (section === 'ageRange') {
//       updatedFilters.ageRange = value;
//     } else if (section === 'location') {
//       updatedFilters.location = { ...updatedFilters.location, ...value };
      
//       // Reset facility when county changes
//       if (value.county !== undefined && value.county !== updatedFilters.location.county) {
//         updatedFilters.location.facility = 'all';
//       }
//     } else if (section === 'demographics') {
//       updatedFilters.demographics = { ...updatedFilters.demographics, ...value };
//     }
    
//     setLocalFilters(updatedFilters);
//     onFilterChange(updatedFilters);
//   };

//   const handleAgeRangeChange = (type: 'min' | 'max', value: number) => {
//     const ageRange = { ...localFilters.ageRange };
//     ageRange[type] = value;
    
//     // Ensure min doesn't exceed max and vice versa
//     if (type === 'min' && ageRange.min > ageRange.max) {
//       ageRange.min = ageRange.max;
//     } else if (type === 'max' && ageRange.max < ageRange.min) {
//       ageRange.max = ageRange.min;
//     }
    
//     handleChange('ageRange', ageRange);
//   };

//   const handleReset = () => {
//     const resetFilters: FilterOptions = {
//       gender: 'all',
//       ageRange: { min: 0, max: 100 },
//       location: {
//         county: 'all',
//         facility: 'all'
//       },
//       demographics: {
//         condition: 'all'
//       }
//     };
    
//     setLocalFilters(resetFilters);
//     onFilterChange(resetFilters);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-medium">Filters</h3>
//         <button 
//           onClick={handleReset}
//           className="text-sm text-blue-600 hover:text-blue-800"
//         >
//           Reset All
//         </button>
//       </div>
      
//       {/* Gender Filter */}
//       <div>
//         <h4 className="font-medium mb-2">Gender</h4>
//         <div className="space-y-2">
//           <div className="flex items-center">
//             <input 
//               id="gender-all" 
//               type="radio" 
//               name="gender" 
//               value="all"
//               checked={localFilters.gender === 'all'}
//               onChange={() => handleChange('gender', 'all')}
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//             />
//             <label htmlFor="gender-all" className="ml-2 block text-sm text-gray-700">All</label>
//           </div>
//           <div className="flex items-center">
//             <input 
//               id="gender-male" 
//               type="radio" 
//               name="gender" 
//               value="male"
//               checked={localFilters.gender === 'male'}
//               onChange={() => handleChange('gender', 'male')}
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//             />
//             <label htmlFor="gender-male" className="ml-2 block text-sm text-gray-700">Male</label>
//           </div>
//           <div className="flex items-center">
//             <input 
//               id="gender-female" 
//               type="radio" 
//               name="gender" 
//               value="female"
//               checked={localFilters.gender === 'female'}
//               onChange={() => handleChange('gender', 'female')}
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//             />
//             <label htmlFor="gender-female" className="ml-2 block text-sm text-gray-700">Female</label>
//           </div>
//         </div>
//       </div>
      
//       {/* Age Range Filter */}
//       <div>
//         <h4 className="font-medium mb-2">Age Range</h4>
//         <div className="grid grid-cols-2 gap-2">
//           <div>
//             <label htmlFor="age-min" className="block text-sm text-gray-700 mb-1">Min</label>
//             <input 
//               id="age-min" 
//               type="number" 
//               min="0" 
//               max="100"
//               value={localFilters.ageRange.min}
//               onChange={(e) => handleAgeRangeChange('min', parseInt(e.target.value) || 0)}
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//             />
//           </div>
//           <div>
//             <label htmlFor="age-max" className="block text-sm text-gray-700 mb-1">Max</label>
//             <input 
//               id="age-max" 
//               type="number" 
//               min="0" 
//               max="100"
//               value={localFilters.ageRange.max}
//               onChange={(e) => handleAgeRangeChange('max', parseInt(e.target.value) || 0)}
//               className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//             />
//           </div>
//         </div>
//         <div className="mt-3">
//           <label htmlFor="age-range" className="block text-sm text-gray-700 mb-1">
//             Range: {localFilters.ageRange.min} - {localFilters.ageRange.max}
//           </label>
//           <input
//             type="range"
//             min="0"
//             max="100"
//             value={localFilters.ageRange.max}
//             onChange={(e) => handleAgeRangeChange('max', parseInt(e.target.value))}
//             className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//           />
//         </div>
//       </div>
      
//       {/* Location Filters */}
//       <div>
//         <h4 className="font-medium mb-2">Location</h4>
        
//         {/* County Dropdown */}
//         <div className="mb-3">
//           <label htmlFor="county" className="block text-sm text-gray-700 mb-1">County</label>
//           <select 
//             id="county"
//             value={localFilters.location.county}
//             onChange={(e) => handleChange('location', { county: e.target.value })}
//             className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//           >
//             <option value="all">All Counties</option>
//             {counties.map(county => (
//               <option key={county} value={county}>{county}</option>
//             ))}
//           </select>
//         </div>
        
//         {/* Facility Dropdown */}
//         <div>
//           <label htmlFor="facility" className="block text-sm text-gray-700 mb-1">Facility</label>
//           <select 
//             id="facility"
//             value={localFilters.location.facility}
//             onChange={(e) => handleChange('location', { facility: e.target.value })}
//             className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//             disabled={localFilters.location.county === 'all'} // Optional: Disable until county is selected
//           >
//             <option value="all">All Facilities</option>
//             {countyFacilities.map(facility => (
//               <option key={facility} value={facility}>{facility}</option>
//             ))}
//           </select>
//           {localFilters.location.county === 'all' && (
//             <p className="text-xs text-gray-500 mt-1">Select a county first</p>
//           )}
//         </div>
//       </div>
      
//       {/* Medical Condition Filter */}
//       <div>
//         <h4 className="font-medium mb-2">Medical Condition</h4>
//         <select 
//           id="condition"
//           value={localFilters.demographics.condition}
//           onChange={(e) => handleChange('demographics', { condition: e.target.value })}
//           className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//         >
//           <option value="all">All Conditions</option>
//           {conditions.map(condition => (
//             <option key={condition} value={condition}>{condition}</option>
//           ))}
//         </select>
//       </div>
      
//       <div className="pt-4 border-t border-gray-200">
//         <button
//           onClick={() => onFilterChange(localFilters)}
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//         >
//           Apply Filters
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FilterPanel;