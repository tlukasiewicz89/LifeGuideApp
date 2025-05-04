import React, { useState } from 'react';
import { nutrientData } from './data/nutrients';
import { bonusFoods } from './data/bonusFoods';
import NutrientTable from './components/NutrientTable';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [inputFoods, setInputFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const allNutrientFoods = [...nutrientData, ...bonusFoods];
  const allFoods = [...new Set(allNutrientFoods.flatMap(n => n.foods))];

  const normalize = str => str.toLowerCase().trim().replace(/s$/, '');

  const addFood = food => {
    if (!inputFoods.includes(food)) {
      setInputFoods(prev => [...prev, food]);
    }
    setSearch('');
    setShowSuggestions(false);
  };

  const removeFood = food => {
    setInputFoods(prev => prev.filter(f => f !== food));
  };

  const handleRemoveAll = () => {
    setShowConfirmModal(true);
  };

  const confirmRemoveAll = () => {
    setInputFoods([]);
    setShowConfirmModal(false);
  };

  const cancelRemoveAll = () => {
    setShowConfirmModal(false);
  };

  const filteredSuggestions = allFoods.filter(food =>
    normalize(food).includes(normalize(search)),
  );

  const handleKeyDown = e => {
    if (e.key === 'Enter' && filteredSuggestions.length > 0) {
      e.preventDefault();
      addFood(filteredSuggestions[0]);
    }
  };

  const getNutrientsForFood = food => {
    const matchingNutrients = [];
    allNutrientFoods.forEach(nutrient => {
      if (
        nutrient.foods.some(source => normalize(source) === normalize(food))
      ) {
        matchingNutrients.push(nutrient.name);
      }
    });
    return matchingNutrients;
  };

  const coveredEssentialNutrients = nutrientData.filter(nutrient =>
    nutrient.foods.some(source =>
      inputFoods.some(food => normalize(source) === normalize(food)),
    ),
  );

  const essentialCoveragePercent = Math.round(
    (coveredEssentialNutrients.length / nutrientData.length) * 100,
  );

  return (
    <div className="min-h-screen p-6 font-sans bg-gradient-to-br from-[#f9f5f0] via-[#fefaf6] to-[#fffefc] text-gray-800">
      <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-amber-600 via-orange-400 to-yellow-300 bg-clip-text text-transparent animate-pulse">
        🧠 Nutrient Coverage Checker
      </h1>

      {/* Input Section */}
      <div className="relative max-w-2xl mx-auto mb-10">
        <input
          type="text"
          placeholder="Type qualified foods here to check nutrients for the day..."
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full p-3 border border-amber-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-300 focus:outline-none"
        />

        {showSuggestions && search && (
          <div className="absolute z-10 w-full border border-amber-100 rounded-xl bg-white shadow max-h-48 overflow-y-auto mt-1">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((food, idx) => (
                <div
                  key={idx}
                  onClick={() => addFood(food)}
                  className="p-3 hover:bg-amber-100 cursor-pointer transition-all"
                >
                  {food}
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-400">No matching foods</div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {/* Food List */}
        <div className="space-y-8 md:col-span-1">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold">📝 Foods</h2>
              {inputFoods.length > 0 && (
                <button
                  onClick={handleRemoveAll}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove All
                </button>
              )}
            </div>
            <ul className="space-y-2">
              {inputFoods.map((food, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex justify-between items-center bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg shadow-sm text-sm"
                >
                  <span>{food}</span>
                  <button
                    onClick={() => removeFood(food)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Food Nutrients */}
          <div className="space-y-4">
            {inputFoods.map((food, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-4 bg-white border border-amber-100 rounded-xl shadow hover:scale-105 transition-transform"
              >
                <div className="font-bold mb-2 text-amber-700">{food}</div>
                <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                  {getNutrientsForFood(food).map((nutrient, idx2) => (
                    <li key={idx2}>{nutrient}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Nutrient Tables */}
        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              Essential Nutrients
              <span className="text-sm text-amber-600">
                ({essentialCoveragePercent}%)
              </span>
            </h2>
            <NutrientTable
              inputFoods={inputFoods}
              nutrientData={nutrientData}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Beneficial Groups</h2>
            <NutrientTable inputFoods={inputFoods} nutrientData={bonusFoods} />
          </div>
        </div>
      </div>

      {/* Modal for confirming clear all */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white p-8 rounded-2xl shadow-md text-center space-y-6"
            >
              <h3 className="text-lg font-bold text-amber-800">
                Clear all selected foods?
              </h3>
              <div className="flex justify-center gap-6">
                <button
                  onClick={confirmRemoveAll}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Yes, Clear All
                </button>
                <button
                  onClick={cancelRemoveAll}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
