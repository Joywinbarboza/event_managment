// pages/api/createCollection/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import GeoCollection from "../../../models/collection.model";

// Define the POST method handler
export async function POST(req: NextRequest) {
  try {
    const db = await dbConnect();
    const body = await req.json();
    const { placeName, category, keyword, userId, batchId } = body; // Destructure batchId from request body

    // Validate request body
    if (!placeName || !category || !keyword || !userId || !batchId) { // Include batchId in validation
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Create new GeoCollection
    const newCollection = new GeoCollection({
      userId,
      placeName,
      category,
      keyword,
      batchId, // Include batchId in the new collection
    });

    await db.collection('geocollections').insertOne(newCollection).then(() => {
      console.log('Collection created:', newCollection);
    });

    // Respond with success message and created collection data
    return NextResponse.json({
      message: "Collection created successfully",
      collection: newCollection,
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating collection:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}