import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  joinedAt: Date;
  generatedInvites: string[];
  invitedBy?: string; // The invite code that was used to join
  isActive: boolean;
}

export interface CreateUserData {
  name: string;
  email: string;
  inviteCode: string;
}
