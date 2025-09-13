import { ObjectId } from "mongodb";

export interface Invite {
  _id: string; // The invite code itself
  generatedBy: ObjectId; // Reference to the user who generated this invite
  createdAt: Date;
  usedAt?: Date; // When the invite was used (if used)
  usedBy?: ObjectId; // Who used the invite (if used)
}

export interface CreateInviteData {
  code: string;
  generatedBy: ObjectId;
}
