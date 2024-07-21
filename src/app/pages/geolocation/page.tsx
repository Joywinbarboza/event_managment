"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// ... (keep the existing categories and JwtPayload interface)
const categories = {
  Marriage: [
    "Sounds and Lighting",
    "Catering",
    "Decoration",
    "Photographer",
    "Videographer",
    "Venue",
    "Florist",
    "Dress and Attire",
  ],
  Birthday: [
    "Cakes",
    "Balloons",
    "Games",
    "Party Favors",
    "Entertainment",
    "Venue",
    "Invitation Cards",
    "Photographer",
  ],
  Conference: [
    "Projectors",
    "Seating",
    "Refreshments",
    "Wi-Fi",
    "Sound System",
    "Stage Setup",
    "Registration Desk",
    "Name Tags",
  ],
  Concert: [
    "Stage Setup",
    "Sound System",
    "Lighting",
    "Security",
    "Merchandise",
    "Ticketing",
    "Promotion",
    "Backstage Passes",
  ],
  Festival: [
    "Stalls",
    "Live Performances",
    "Security",
    "Food Trucks",
    "Seating Areas",
    "Games",
    "First Aid",
    "Restrooms",
  ],
  Workshop: [
    "Materials and Supplies",
    "Instructor",
    "Projector",
    "Seating",
    "Refreshments",
    "Certificates",
    "Venue",
    "Handouts",
  ],
  Sports_Event: [
    "Referees",
    "Team Jerseys",
    "Equipment",
    "Medals and Trophies",
    "First Aid",
    "Security",
    "Seating",
    "Ticketing",
  ],
  Corporate_Party: [
    "Catering",
    "Entertainment",
    "Awards",
    "Photography",
    "Venue",
    "DJ",
    "Gift Bags",
    "Themed Decor",
  ],
};

interface JwtPayload {
  user: {
    _id: string;
  };
  iat?: number;
  exp?: number;
}

const Home = () => {
  // ... (keep all the existing state variables and functions)
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const [range, setRange] = useState(1500);
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState("");
  const [collection, setCollection] = useState(null);
  const [savedCollections, setSavedCollections] = useState([]);
  const [userId, setUserId] = useState<any>();
  const [collectionName, setCollectionName] = useState("");
  const [currentCollectionName, setCurrentCollectionName] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/accessTokenCookie");
        if (!response.ok) {
          throw new Error("Failed to fetch token data");
        }
        const data = await response.json();
        setUserId(data.userId);
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

  const handleClick = (place) => {
    if (category && keyword && collectionName) {
      const exists = savedCollections.some(
        (col) =>
          col.category === category &&
          col.keyword === keyword &&
          col.collectionName === collectionName
      );

      if (!exists) {
        setCollection({
          placeName: place.name,
          category,
          keyword,
          collectionName,
          rating: place.rating,
          formatted_phone_number: place.phone_number,
          formatted_address: place.address,
          price_level: place.price_level,
          // photos: place.photos,
        });
      } else {
        alert(
          "This place with the same keyword and collection name is already in the collection."
        );
      }
    } else {
      alert("Please select a category, keyword, and enter a collection name.");
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
      const batchId = Date.now().toString();

      try {
        const savePromises = savedCollections.map((collection) =>
          axios.post("/api/collections/create", {
            placeName: collection.placeName,
            category: collection.category,
            keyword: collection.keyword,
            userId: userId,
            batchId: batchId,
            collectionName: collection.collectionName,
            rating: collection.rating,
            formatted_phone_number: collection.formatted_phone_number,
            formatted_address: collection.formatted_address,
            price_level: collection.price_level,
            // photos: collection.photos,
          })
        );

        const responses = await Promise.all(savePromises);
        responses.forEach((response) => console.log(response.data));

        console.log("All collections have been saved successfully.");
        setSavedCollections([]);
        setCollectionName("");
        setCurrentCollectionName("");
      } catch (error) {
        console.error("Error saving collections:", error);
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
        setCategory(newCategory);
        setKeyword("");
        setCollectionName("");
        setCurrentCollectionName("");
      }
    } else {
      setCategory(newCategory);
      setKeyword("");
    }
  };

  const handleCollectionNameChange = (newCollectionName) => {
    if (savedCollections.length > 0) {
      if (
        window.confirm(
          "Changing collection name will remove the saved collections. Do you want to proceed?"
        )
      ) {
        setSavedCollections([]);
        setCollection(null);
        setCurrentCollectionName(newCollectionName);
        setCollectionName(newCollectionName);
      } else {
        // If the user cancels, revert the input to the current collection name
        setCollectionName(currentCollectionName);
      }
    } else {
      setCurrentCollectionName(newCollectionName);
      setCollectionName(newCollectionName);
    }
  };

  const goToLanding = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <button className="bg-sky-400 text-white py-3 px-6 rounded-md hover:bg-yellow-700 transition duration-300 ease-in-out" onClick={goToLanding}>
        MAIN PAGE
      </button>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Find Places
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white shadow-lg rounded-lg p-6 text-black"
        >
          <div className="flex flex-col md:flex-row mb-4 space-y-4 md:space-y-0 md:space-x-4 text-black">
            <input
              type="text"
              value={location.latitude}
              onChange={(e) =>
                setLocation({ ...location, latitude: e.target.value })
              }
              placeholder="Enter latitude"
              required
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <input
              type="text"
              value={location.longitude}
              onChange={(e) =>
                setLocation({ ...location, longitude: e.target.value })
              }
              placeholder="Enter longitude"
              required
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out"
            >
              Get Current Location
            </button>
          </div>

          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            required
            className="block w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            className="block w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            className="block w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <input
            type="text"
            value={collectionName}
            onChange={(e) => handleCollectionNameChange(e.target.value)}
            placeholder="Enter collection name"
            required
            className="block w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Search
          </button>
        </form>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        {collection && (
          <div className="mt-8 bg-white shadow-lg rounded-lg p-6 text-black">
            <h2 className="text-3xl font-bold mb-4">Collection</h2>
            <h3 className="text-2xl font-semibold mb-2">
              {collection.placeName}
            </h3>
            <p className="text-lg mb-1">
              <span className="font-semibold">Category:</span>{" "}
              {collection.category}
            </p>
            <p className="text-lg mb-1">
              <span className="font-semibold">Keyword:</span>{" "}
              {collection.keyword}
            </p>
            <p className="text-lg mb-1">
              <span className="font-semibold">Collection Name:</span>{" "}
              {collection.collectionName}
            </p>
            <p className="text-lg mb-1">
              <span className="font-semibold">Rating:</span> {collection.rating}
            </p>
            <p className="text-lg mb-1">
              <span className="font-semibold">Phone:</span>{" "}
              {collection.formatted_phone_number}
            </p>
            <p className="text-lg mb-1">
              <span className="font-semibold">Address:</span>{" "}
              {collection.formatted_address}
            </p>
            <p className="text-lg mb-4">
              <span className="font-semibold">Price Level:</span>{" "}
              {collection.price_level}
            </p>
            <button
              onClick={handleSave}
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-300 ease-in-out"
            >
              Save
            </button>
          </div>
        )}

        {savedCollections.length > 0 && (
          <div className="mt-8">
            <h2 className="text-3xl font-bold mb-4 text-stone-600">Saved Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedCollections.map((col, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg p-6 text-black">
                  <h3 className="text-2xl font-semibold mb-2">
                    {col.placeName}
                  </h3>
                  <p className="text-lg mb-1">
                    <span className="font-semibold">Category:</span>{" "}
                    {col.category}
                  </p>
                  <p className="text-lg mb-1">
                    <span className="font-semibold">Keyword:</span>{" "}
                    {col.keyword}
                  </p>
                  <p className="text-lg mb-1">
                    <span className="font-semibold">Collection Name:</span>{" "}
                    {col.collectionName}
                  </p>
                  <p className="text-lg mb-1">
                    <span className="font-semibold">Rating:</span> {col.rating}
                  </p>
                  <p className="text-lg mb-1">
                    <span className="font-semibold">Phone:</span>{" "}
                    {col.formatted_phone_number}
                  </p>
                  <p className="text-lg mb-1">
                    <span className="font-semibold">Address:</span>{" "}
                    {col.formatted_address}
                  </p>
                  <p className="text-lg mb-4">
                    <span className="font-semibold">Price Level:</span>{" "}
                    {col.price_level}
                  </p>
                  <button
                    onClick={() => handleRemove(index)}
                    className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition duration-300 ease-in-out"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex space-x-4">
          {savedCollections.length > 0 && (
            <button
              onClick={handleDatabaseSave}
              className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
            >
              SAVE TO DB
            </button>
          )}
          <button
            onClick={goToCollections}
            className="bg-yellow-600 text-white py-3 px-6 rounded-md hover:bg-yellow-700 transition duration-300 ease-in-out"
          >
            See your collection
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {places.map((place) => (
            <div
              key={place.name}
              className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between text-black"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-2">{place.name}</h2>
                <p className="mb-1">
                  <span className="font-semibold">Rating:</span> {place.rating}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Phone:</span>{" "}
                  {place.phone_number}
                </p>
                <p className="mb-1">
                  <span className="font-semibold">Address:</span>{" "}
                  {place.address}
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Price Level:</span>{" "}
                  {place.price_level}
                </p>
              </div>
              <button
                onClick={() => handleClick(place)}
                className={`w-full py-2 px-4 rounded-md transition duration-300 ease-in-out ${
                  collection?.placeName === place.name
                    ? "bg-green-700 text-white"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                Add to Collection
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
