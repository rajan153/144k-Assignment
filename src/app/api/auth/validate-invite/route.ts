import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviteCode } = body;

    if (!inviteCode) {
      return NextResponse.json(
        { error: "Invite code is required" },
        { status: 400 }
      );
    }

    // Check if invite code exists and is valid
    const invite = await dbService.getInviteByCode(inviteCode);

    if (!invite) {
      return NextResponse.json(
        {
          valid: false,
          error: "Invalid invite code",
        },
        { status: 200 }
      );
    }

    if (invite.usedAt) {
      return NextResponse.json(
        {
          valid: false,
          error: "This invite code has already been used",
        },
        { status: 200 }
      );
    }

    // Check if we've reached the 144K limit
    const totalUsers = await dbService.getTotalUsers();
    if (totalUsers >= 144000) {
      return NextResponse.json(
        {
          valid: false,
          error:
            "Sorry, the community has reached its maximum capacity of 144,000 members",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      valid: true,
      message: "Invite code is valid",
    });
  } catch (error) {
    console.error("Invite validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
