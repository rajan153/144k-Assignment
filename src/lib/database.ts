import { getDatabase } from "./mongodb";
import { User, CreateUserData } from "../models/User";
import { Invite, CreateInviteData } from "../models/Invite";
import { ObjectId } from "mongodb";

export class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // User operations
  async createUser(userData: CreateUserData): Promise<User> {
    const db = await getDatabase();
    const usersCollection = db.collection<User>("users");

    const newUser: User = {
      name: userData.name,
      email: userData.email,
      joinedAt: new Date(),
      generatedInvites: [],
      invitedBy: userData.inviteCode,
      isActive: true,
    };

    const result = await usersCollection.insertOne(newUser);
    newUser._id = result.insertedId;

    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const db = await getDatabase();
    const usersCollection = db.collection<User>("users");
    return await usersCollection.findOne({ email });
  }

  async getUserById(id: ObjectId): Promise<User | null> {
    const db = await getDatabase();
    const usersCollection = db.collection<User>("users");
    return await usersCollection.findOne({ _id: id });
  }

  async updateUserInvites(
    userId: ObjectId,
    inviteCodes: string[]
  ): Promise<void> {
    const db = await getDatabase();
    const usersCollection = db.collection<User>("users");
    await usersCollection.updateOne(
      { _id: userId },
      { $set: { generatedInvites: inviteCodes } }
    );
  }

  async getTotalUsers(): Promise<number> {
    const db = await getDatabase();
    const usersCollection = db.collection<User>("users");
    return await usersCollection.countDocuments({ isActive: true });
  }

  // Invite operations
  async createInvite(inviteData: CreateInviteData): Promise<void> {
    const db = await getDatabase();
    const invitesCollection = db.collection<Invite>("invites");

    const newInvite: Invite = {
      _id: inviteData.code,
      generatedBy: inviteData.generatedBy,
      createdAt: new Date(),
    };

    await invitesCollection.insertOne(newInvite);
  }

  async getInviteByCode(code: string): Promise<Invite | null> {
    const db = await getDatabase();
    const invitesCollection = db.collection<Invite>("invites");
    return await invitesCollection.findOne({ _id: code });
  }

  async useInvite(code: string, userId: ObjectId): Promise<void> {
    const db = await getDatabase();
    const invitesCollection = db.collection<Invite>("invites");

    await invitesCollection.updateOne(
      { _id: code },
      {
        $set: {
          usedAt: new Date(),
          usedBy: userId,
        },
      }
    );
  }

  async deleteInvite(code: string): Promise<void> {
    const db = await getDatabase();
    const invitesCollection = db.collection<Invite>("invites");
    await invitesCollection.deleteOne({ _id: code });
  }

  async getAvailableInvites(): Promise<number> {
    const db = await getDatabase();
    const invitesCollection = db.collection<Invite>("invites");
    return await invitesCollection.countDocuments({
      usedAt: { $exists: false },
    });
  }
}

export const dbService = DatabaseService.getInstance();
