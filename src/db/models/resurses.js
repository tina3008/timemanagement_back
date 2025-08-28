import { model, Schema } from 'mongoose';

const resursesSchema = new Schema(
  {
    resurs: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const ResursesCollection = model('resurses', resursesSchema);
export default ResursesCollection;
