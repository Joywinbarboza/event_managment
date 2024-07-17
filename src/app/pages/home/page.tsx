"use client";
import { useState, useEffect } from "react";
import axios from "axios";

interface Place {
  name: string;
  rating: number;
  phone_number: string;
  address: string;
  price_level: number;
  photos: Array<{ photo_reference: string }>;
}

type Category = "Marriage" | "Birthday" | "Conference";

const categories: Record<Category, string[]> = {
  Marriage: ["Sounds and Lighting", "Catering", "Decoration"],
  Birthday: ["Cakes", "Balloons", "Games"],
  Conference: ["Projectors", "Seating", "Refreshments"],
};

const Home = () => {
  const [location, setLocation] = useState({ latitude: "", longitude: "" });
  const [category, setCategory] = useState<Category | "">("");
  const [keyword, setKeyword] = useState("");
  const [range, setRange] = useState(1500);
  const [places, setPlaces] = useState<Place[]>([]);
  const [error, setError] = useState("");

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

  const handleSubmit = async (event: React.FormEvent) => {
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
    } catch (error: any) {
      setError(error.response?.data?.error || "Something went wrong");
      setPlaces([]);
    }
  };

  return (
    <div className="container mx-auto p-4">
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
          onChange={(e) => setCategory(e.target.value as Category)}
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
          <div key={place.name} className="mb-4 p-4 border rounded">
            <h2 className="text-2xl font-semibold">{place.name}</h2>
            <p>Rating: {place.rating}</p>
            <p>Phone: {place.phone_number}</p>
            <p>Address: {place.address}</p>
            <p>Price Level: {place.price_level}</p>
            {place.photos && place.photos.length > 0 && (
              <img
                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`}
                alt={place.name}
                className="w-48"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
