import { ObjectId } from "mongodb";

export interface Invite {
  _id: string; // The invite code itself
  generatedBy: string; // Reference to the user who generated this invite - stored as string
  createdAt: Date;
  usedAt?: Date; // When the invite was used (if used)
  usedBy?: string; // Who used the invite (if used) - stored as string
}

export interface CreateInviteData {
  code: string;
  generatedBy: ObjectId;
}
