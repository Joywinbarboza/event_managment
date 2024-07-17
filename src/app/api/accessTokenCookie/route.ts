import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

export async function GET(req: any) {
  try {
    if (req.method === "GET") {
      const cookieStore = cookies();
      const accessToken = cookieStore.get("access_token").value;
      if (!accessToken) {
        return NextResponse.json(
          { message: "Access token not found in cookies" },
          { status: 401 }
        );
      }
      const decodedToken: any = jwtDecode(accessToken);
      console.log(decodedToken);
      return NextResponse.json(decodedToken.id);
    } else {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 405 }
      );
    }
  } catch (error) {
    console.error("Error fetching access token:", error);
    return NextResponse.json(
      { message: "Failed to fetch access token" },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';