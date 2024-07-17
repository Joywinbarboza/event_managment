// pages/api/deleteCollection/[id].ts
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Import ObjectId from MongoDB
import { dbConnect } from "../../../../../lib/db";
import GeoCollection from "../../../../models/collection.model";

export async function DELETE(req, { params }) {
  try {
    const db = await dbConnect();
    // const { id } = await req.json(); // Extract collection ID from query parameters
    const id = await params.id;

    // Validate if ID is provided
    if (!id) {
      return NextResponse.json(
        { message: "Collection ID is required" },
        { status: 400 }
      );
    }

    // Check if the ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid Collection ID" },
        { status: 400 }
      );
    }

    // Find the collection by ID and delete it
    try {
      const result = await db
        .collection("geocollections")
        .findOneAndDelete({ _id: ObjectId.createFromHexString(id) });

      return NextResponse.json(
        {
          message: "Collection deleted successfully",
          deletedCollection: result,
        },
        { status: 200 }
      );
    } catch (err) {
      console.error("Error deleting collection:", err);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error connecting to database:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
