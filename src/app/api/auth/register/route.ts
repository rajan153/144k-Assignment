import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/database";
import { generateInviteCodes } from "@/lib/inviteGenerator";
import { broadcastNewMember, broadcastStatsUpdate } from "@/lib/websocket";
import { CreateUserData } from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, inviteCode } = body;

    // Validate input
    if (!name || !email || !inviteCode) {
      return NextResponse.json(
        { error: "Name, email, and invite code are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await dbService.getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Validate invite code
    const invite = await dbService.getInviteByCode(inviteCode);
    if (!invite) {
      return NextResponse.json(
        { error: "Invalid or already used invite code" },
        { status: 400 }
      );
    }

    if (invite.usedAt) {
      return NextResponse.json(
        { error: "This invite code has already been used" },
        { status: 400 }
      );
    }

    // Check if we've reached the 144K limit
    const totalUsers = await dbService.getTotalUsers();
    if (totalUsers >= 144000) {
      return NextResponse.json(
        {
          error:
            "Sorry, the community has reached its maximum capacity of 144,000 members",
        },
        { status: 400 }
      );
    }

    // Create new user
    const userData: CreateUserData = {
      name,
      email,
      inviteCode,
    };

    const newUser = await dbService.createUser(userData);

    // Mark invite as used
    await dbService.useInvite(inviteCode, newUser._id!);

    // Generate two new invite codes for the user
    const newInviteCodes = await generateInviteCodes(2);

    // Create invite documents in database
    for (const code of newInviteCodes) {
      await dbService.createInvite({
        code,
        generatedBy: newUser._id!,
      });
    }

    // Update user with generated invite codes
    await dbService.updateUserInvites(newUser._id!, newInviteCodes);

    // Broadcast new member to WebSocket clients
    broadcastNewMember({
      name: newUser.name,
      email: newUser.email,
      joinedAt: newUser.joinedAt,
    });

    // Broadcast updated stats
    const updatedStats = {
      totalUsers: await dbService.getTotalUsers(),
      availableInvites: await dbService.getAvailableInvites(),
      maxUsers: 144000,
      progressPercentage: Math.round(
        ((await dbService.getTotalUsers()) / 144000) * 100
      ),
      remainingSlots: 144000 - (await dbService.getTotalUsers()),
    };
    broadcastStatsUpdate(updatedStats);

    // Return success response
    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        joinedAt: newUser.joinedAt,
        inviteCodes: newInviteCodes,
      },
      message:
        "Welcome to the 144K community! You have been given 2 invite codes to share.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
