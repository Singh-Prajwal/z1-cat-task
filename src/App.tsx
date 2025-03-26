import { useState, useEffect } from "react";
import axios from "axios";

// Define TypeScript interface for the API response
interface CatImage {
  id: string;
  url: string;
}

const API_URL = "https://api.thecatapi.com/v1/images/search?limit=10";

function App() {
  const [cats, setCats] = useState<CatImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchCats = async () => {
    setLoading(true);
    try {
      const response = await axios.get<CatImage[]>(API_URL);
      setCats(response.data);
    } catch (error) {
      console.error("Error fetching cats:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCats(); // Load images on first render
  }, []);

  return (
    <div className="container">
      <h1>🐱 Random Cat Gallery</h1>
      <button onClick={fetchCats} disabled={loading}>
        {loading ? "Loading..." : "Load More Cats"}
      </button>

      <div className="grid">
        {cats.map((cat) => (
          <div key={cat.id} className="card">
            <img src={cat.url} alt="Cat" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
