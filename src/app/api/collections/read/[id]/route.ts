// pages/api/readCollections/[userId].ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/db";
import GeoCollection from "../../../../models/collection.model";
import { ObjectId } from "mongodb";
// import Router, { useRouter } from "next/router";

// Define the GET method handler
export async function GET(req: NextRequest, { params }) {
  try {
    const db = await dbConnect();
    // const router  = useRouter();
    const id = await params.id;

    console.log(id);

    // Fetch collections for the specified user ID
    // const collections = await GeoCollection.find({ id });
    const collections = await db
      .collection("geocollections")
      .find({ userId: ObjectId.createFromHexString(id) })
      .toArray();

    // Respond with the fetched collections
    return NextResponse.json(
      {
        collections,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
