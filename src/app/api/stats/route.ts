import { NextResponse } from "next/server";
import { dbService } from "@/lib/database";

export async function GET() {
  try {
    const totalUsers = await dbService.getTotalUsers();
    const availableInvites = await dbService.getAvailableInvites();
    const maxUsers = 144000;
    const progressPercentage = Math.round((totalUsers / maxUsers) * 100);

    return NextResponse.json({
      totalUsers,
      availableInvites,
      maxUsers,
      progressPercentage,
      remainingSlots: maxUsers - totalUsers,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
