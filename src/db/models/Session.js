import { model, Schema } from "mongoose";

const sessionsSchema = new Schema(
  {
    userId: {
      type:Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const SessionsCollections = model('session', sessionsSchema);
