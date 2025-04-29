import React, { useState } from 'react';

const NutrientTable = ({ inputFoods, nutrientData }) => {
  const [openNutrient, setOpenNutrient] = useState(null);

  const foodList = inputFoods.map(f => f.toLowerCase().trim());

  const normalize = str => str.toLowerCase().trim().replace(/s$/, '');

  const toggleDropdown = nutrientName => {
    setOpenNutrient(prev => (prev === nutrientName ? null : nutrientName));
  };

  // First, map to add isCovered status
  const nutrientsWithStatus = nutrientData.map(nutrient => {
    const isCovered = nutrient.foods.some(source =>
      foodList.some(input => normalize(input) === normalize(source))
    );
    return { ...nutrient, isCovered };
  });

  // Then sort: missing (false) first, covered (true) after
  const sortedNutrients = nutrientsWithStatus.sort((a, b) => {
    if (a.isCovered === b.isCovered) return 0;
    return a.isCovered ? 1 : -1;
  });

  return (
    <div className="grid gap-2">
      {sortedNutrients.map(nutrient => {
        const isOpen = openNutrient === nutrient.name;

        return (
          <div
            key={nutrient.name}
            onClick={() => toggleDropdown(nutrient.name)}
            className={`rounded-md p-2 cursor-pointer transition-colors ${
              nutrient.isCovered ? 'bg-green-200' : 'bg-red-200'
            }`}
          >
            <div className="font-semibold">
              {nutrient.name}: {nutrient.isCovered ? '✅ Covered' : '❌ Missing'}
            </div>
            {isOpen && (
              <ul className="mt-2 pl-4 text-sm text-gray-700 list-disc list-inside">
                {nutrient.foods.map((food, idx) => (
                  <li key={idx}>{food}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NutrientTable;
