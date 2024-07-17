import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const location = searchParams.get("location");
  const keyword = searchParams.get("keyword");
  const range = searchParams.get("range");

  if (!location || !keyword || !range) {
    return NextResponse.json(
      { error: "Location, keyword, and range are required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location,
          radius: range,
          keyword,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    const places = response.data.results;

    const placeDetailsPromises = places.map(async (place: any) => {
      const placeDetailsResponse = await axios.get(
        "https://maps.googleapis.com/maps/api/place/details/json",
        {
          params: {
            place_id: place.place_id,
            fields: "name,rating,formatted_phone_number,formatted_address,price_level,photos",
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      const { name, rating, formatted_phone_number, formatted_address, price_level, photos } =
        placeDetailsResponse.data.result;

      return { name, rating, phone_number: formatted_phone_number || "N/A", address: formatted_address, price_level, photos };
    });

    const results = await Promise.all(placeDetailsPromises);

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching data from Google Maps API:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export const config = {
//   runtime: 'experimental-edge',
// };

export const runtime = "experimental-edge";