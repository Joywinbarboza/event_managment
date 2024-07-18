import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import GeoCollection from "../../../models/collection.model";

// Define the POST method handler
export async function POST(req: NextRequest) {
  try {
    const db = await dbConnect();
    const body = await req.json();
    const { 
      placeName, 
      category, 
      keyword, 
      userId, 
      batchId, 
      collectionName, 
      rating, 
      formatted_phone_number, 
      formatted_address, 
      price_level 
    } = body;

    console.log(body);
    // Validate request body
    if (!placeName || !category || !keyword || !userId || !batchId || !collectionName) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Create new Collection
    const newCollection = new GeoCollection({
      userId,
      placeName,
      category,
      keyword,
      batchId,
      collectionName,
      rating,
      formatted_phone_number,
      formatted_address,
      price_level,
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
