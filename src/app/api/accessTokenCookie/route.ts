import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { dbConnect } from "../../../lib/db";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    if (req.method === "GET") {
      const cookieStore = cookies();
      const accessToken = cookieStore.get("access_token")?.value;

      if (!accessToken) {
        return NextResponse.json(
          { message: "Access token not found in cookies" },
          { status: 401 }
        );
      }

      const decodedToken: any = jwtDecode(accessToken);
      const userId = decodedToken.id;

      // Connect to the database
      const db = await dbConnect();

      // Fetch user information from the 'users' collection
      const user = await db.collection("users").findOne({ _id: ObjectId.createFromHexString(userId) });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      // Return both userId and username
      return NextResponse.json({
        userId: user._id,
        username: user.username // Assuming the username field is called 'username'
      });
    } else {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }
  } catch (error) {
    console.error("Error fetching user information:", error);
    return NextResponse.json(
      { message: "Failed to fetch user information" },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';