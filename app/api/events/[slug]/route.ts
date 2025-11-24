import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import { IEvent } from "@/database/event.model";

// Type definition for route parameters
interface RouteParams {
  params: {
    slug: string;
  };
}

// Type definition for API response
interface ApiResponse {
  event?: IEvent;
  message?: string;
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 * 
 * @param req - Next.js request object
 * @param context - Route context containing dynamic parameters
 * @returns JSON response with event data or error message
 */
export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse>> {
  try {
    // Extract and validate slug parameter
    const { slug } = params;

    // Validate slug is present and not empty
    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        { message: "Slug parameter is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    // Validate slug format (alphanumeric, hyphens, underscores only)
    const slugRegex = /^[a-z0-9-_]+$/;
    const normalizedSlug = slug.trim().toLowerCase();
    
    if (!slugRegex.test(normalizedSlug)) {
      return NextResponse.json(
        { message: "Invalid slug format. Slug must contain only lowercase letters, numbers, hyphens, and underscores" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Query event by slug (slug is stored in lowercase per schema)
    const event = await Event.findOne({ slug: normalizedSlug });

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { message: `Event with slug "${normalizedSlug}" not found` },
        { status: 404 }
      );
    }

    // Return successful response with event data
    return NextResponse.json({ event }, { status: 200 });

  } catch (error) {
    // Handle unexpected errors
    console.error("Error fetching event by slug:", error);
    
    // Provide user-friendly error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : "An unexpected error occurred while fetching the event";

    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}

