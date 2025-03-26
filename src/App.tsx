import { useState, useEffect } from "react";
import axios from "axios";

interface CatImage {
  id: string;
  url: string;
}

interface Breed {
  id: string;
  name: string;
}

const API_URL = "https://api.thecatapi.com/v1/images/search?limit=10";
const BREED_URL = "https://api.thecatapi.com/v1/breeds";

function App() {
  const [cats, setCats] = useState<CatImage[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const fetchCats = async (breedId?: string) => {
    setLoading(true);
    try {
      const url = breedId ? `${API_URL}&breed_ids=${breedId}` : API_URL;
      const response = await axios.get<CatImage[]>(url);
      setCats(response.data);
    } catch (error) {
      console.error("Error fetching cats:", error);
    }
    setLoading(false);
  };

  const fetchBreeds = async () => {
    try {
      const response = await axios.get<Breed[]>(BREED_URL);
      setBreeds(response.data);
    } catch (error) {
      console.error("Error fetching breeds:", error);
    }
  };

  useEffect(() => {
    fetchCats();
    fetchBreeds();
  }, []);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } flex flex-col items-center py-10`}
    >
      <h1 className="text-3xl font-bold mb-6">🐱 Random Cat Images Gallery</h1>

      <div className="flex gap-4 mb-4">
        <select
          className="p-2 border rounded bg-white text-black"
          value={selectedBreed}
          onChange={(e) => {
            setSelectedBreed(e.target.value);
            fetchCats(e.target.value);
          }}
        >
          <option value="">All Breeds</option>
          {breeds.map((breed) => (
            <option key={breed.id} value={breed.id}>
              {breed.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          {viewMode === "grid" ? "Switch to List View" : "Switch to Grid View"}
        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      <button
        onClick={() => fetchCats(selectedBreed)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Loading..." : "Load More Cats"}
      </button>

      <div
        className={`mt-6 flex ${
          viewMode === "grid"
            ? "flex-row flex-wrap justify-center gap-4"
            : "flex-col gap-4"
        }`}
      >
        {cats.map((cat) => (
          <div
            key={cat.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 flex items-center gap-4"
          >
            <img
              src={cat.url}
              alt="Cat"
              className={`rounded-lg ${
                viewMode === "grid"
                  ? "w-48 h-48 object-cover"
                  : "w-32 h-32 object-cover"
              }`}
            />
            {viewMode === "list" && (
              <p className="text-gray-700 dark:text-gray-300">
                Cat ID: {cat.id}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
