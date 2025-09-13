import { getDatabase } from "../lib/mongodb";
import { generateInviteCodes } from "../lib/inviteGenerator";
import { ObjectId } from "mongodb";

async function initializeDatabase() {
  try {
    console.log("🚀 Initializing 144K database...");

    const db = await getDatabase();

    // Check if we already have users
    const usersCollection = db.collection("users");
    const existingUsers = await usersCollection.countDocuments();

    if (existingUsers > 0) {
      console.log(
        "✅ Database already initialized with",
        existingUsers,
        "users"
      );
      return;
    }

    // Create the first user (founder)
    const firstUser = {
      _id: new ObjectId(),
      name: "Founder",
      email: "founder@144k.com",
      joinedAt: new Date(),
      generatedInvites: [] as string[],
      invitedBy: "FOUNDER-CODE",
      isActive: true,
    };

    // Generate initial invite codes
    const initialInviteCodes = await generateInviteCodes(2);

    // Update user with invite codes
    firstUser.generatedInvites = initialInviteCodes;

    // Insert the first user
    await usersCollection.insertOne(firstUser);
    console.log("✅ Created founder user");

    // Create invite documents
    const invitesCollection = db.collection("invites");
    for (const code of initialInviteCodes) {
      await invitesCollection.insertOne({
        _id: new ObjectId(),
        code: code,
        generatedBy: firstUser._id,
        createdAt: new Date(),
      });
    }

    console.log("✅ Created initial invite codes:", initialInviteCodes);
    console.log("🎉 Database initialization complete!");
    console.log("📧 Founder email: founder@144k.com");
    console.log("🔑 Initial invite codes:", initialInviteCodes.join(", "));
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log("✅ Script completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Script failed:", error);
      process.exit(1);
    });
}

export { initializeDatabase };
