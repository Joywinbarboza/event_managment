"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const categories = {
  Marriage: ["Sounds and Lighting", "Catering", "Decoration"],
  Birthday: ["Cakes", "Balloons", "Games"],
  Conference: ["Projectors", "Seating", "Refreshments"],
};

interface JwtPayload {
  user: {
    _id: string;
    // Add other fields within the user object if necessary
  };
  iat?: number;
  exp?: number;
}

const Home = () => {
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [range, setRange] = useState(1500);
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");
  const [collection, setCollection] = useState(null);
  const [savedCollections, setSavedCollections] = useState([]);
  const [userId, setUserId] = useState<any>();

  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/accessTokenCookie");
        if (!response.ok) {
          throw new Error("Failed to fetch token data");
        }
        const data = await response.json();
        setUserId(data);
        console.log(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserId();
  }, []);

  const goToCollections = () => {
    router.push("/pages/seeCollection");
  };

  const handleClick = (placeName) => {
    if (category && keyword) {
      const exists = savedCollections.some(
        (col) => col.category === category && col.keyword === keyword
      );

      if (!exists) {
        setCollection({ placeName, category, keyword });
      } else {
        alert("This place with the same keyword is already in the collection.");
      }
    }
  };

  const handleSave = () => {
    if (collection) {
      setSavedCollections([...savedCollections, collection]);
      setCollection(null);
    }
  };

  const handleDatabaseSave = async () => {
    if (savedCollections.length > 0 && userId) {
      const batchId = Date.now().toString(); // Use current timestamp as batch ID

      try {
        const savePromises = savedCollections.map((collection) =>
          axios.post("/api/collections/create", {
            placeName: collection.placeName,
            category: collection.category,
            keyword: collection.keyword,
            userId: userId,
            batchId: batchId, // Add batch ID to each collection
          })
        );

        const responses = await Promise.all(savePromises);
        responses.forEach((response) => console.log(response.data)); // Optionally handle success response

        console.log("All collections have been saved successfully.");
        setSavedCollections([]);
      } catch (error) {
        console.error("Error saving collections:", error);
        // Handle error (show an alert, log, etc.)
      }
    }
  };

  const handleRemove = (index) => {
    setSavedCollections(savedCollections.filter((_, i) => i !== index));
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
          setError("");
        },
        (error) => {
          setError(error.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get("/api/googleMaps", {
        params: {
          location: `${location.latitude},${location.longitude}`,
          keyword,
          range,
        },
      });
      setPlaces(response.data);
      setError("");
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
      setPlaces([]);
    }
  };

  const handleCategoryChange = (newCategory) => {
    if (savedCollections.length > 0) {
      if (
        window.confirm(
          "Changing category will lose the saved collection. Do you want to proceed?"
        )
      ) {
        setSavedCollections([]);
        setCollection(null);
      } else {
        return;
      }
    }
    setCategory(newCategory);
    setKeyword("");
  };

  return (
    <div className="container mx-auto p-4 font-bebasNeue">
      <h1 className="text-3xl font-bold mb-4">Find Places</h1>
      <form onSubmit={handleSubmit} className="mb-4 text-black">
        <div className="flex mb-2">
          <input
            type="text"
            value={location.latitude}
            onChange={(e) =>
              setLocation({ ...location, latitude: e.target.value })
            }
            placeholder="Enter latitude"
            required
            className="block w-full p-2 border rounded"
          />
          <input
            type="text"
            value={location.longitude}
            onChange={(e) =>
              setLocation({ ...location, longitude: e.target.value })
            }
            placeholder="Enter longitude"
            required
            className="block w-full p-2 border rounded ml-2"
          />
          <button
            type="button"
            onClick={handleGetCurrentLocation}
            className="bg-blue-500 text-white py-2 px-4 rounded ml-2"
          >
            Get Current Location
          </button>
        </div>
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          required
          className="block w-full p-2 mb-2 border rounded"
        >
          <option value="" disabled>
            Select a category
          </option>
          {Object.keys(categories).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          required
          className="block w-full p-2 mb-2 border rounded"
          disabled={!category}
        >
          <option value="" disabled>
            Select a keyword
          </option>
          {category &&
            categories[category].map((kw) => (
              <option key={kw} value={kw}>
                {kw}
              </option>
            ))}
        </select>
        <input
          type="number"
          value={range}
          onChange={(e) => setRange(Number(e.target.value))}
          placeholder="Enter range in meters"
          required
          className="block w-full p-2 mb-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Search
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        {places.map((place) => (
          <div
            key={place.name}
            className="mb-4 p-4 border rounded flex justify-around"
          >
            <div className="w-[50%]">
              <h2 className="text-2xl font-semibold ">{place.name}</h2>
              <p>Rating: {place.rating}</p>
              <p>Phone: {place.phone_number}</p>
              <p>Address: {place.address}</p>
              <p>Price Level: {place.price_level}</p>
            </div>
            <div className="flex justify-center my-auto">
              <button
                onClick={() => handleClick(place.name)}
                className={`w-60 h-10 rounded-lg ${
                  collection?.placeName === place.name
                    ? "bg-green-700 text-white"
                    : "bg-green-500 text-black"
                }`}
              >
                add
              </button>
            </div>
          </div>
        ))}
      </div>
      {collection && (
        <div className="mt-8">
          <h2 className="text-3xl font-bold">Collection</h2>
          <h3 className="text-2xl">{collection.placeName}</h3>
          <p className="text-xl">{`Category: ${collection.category}`}</p>
          <p className="text-xl">{`Keyword: ${collection.keyword}`}</p>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
          >
            Save
          </button>
        </div>
      )}
      {savedCollections.length > 0 && (
        <div className="mt-8">
          <h2 className="text-3xl font-bold">Saved Collections</h2>
          {savedCollections.map((col, index) => (
            <div key={index} className="mb-4 p-4 border rounded">
              <h3 className="text-2xl">{col.placeName}</h3>
              <p className="text-xl">{`Category: ${col.category}`}</p>
              <p className="text-xl">{`Keyword: ${col.keyword}`}</p>
              <button
                onClick={() => handleRemove(index)}
                className="bg-red-500 text-white py-2 px-4 rounded mt-4"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      {savedCollections.length > 0 && (
        <button
          onClick={handleDatabaseSave}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          SAVE TO DB
        </button>
      )}
      <button
        onClick={goToCollections}
        className="bg-yellow-500 text-white py-2 px-4 rounded mt-4"
      >
        See your collection
      </button>
    </div>
  );
};

export default Home;

