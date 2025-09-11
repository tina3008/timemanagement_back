import { model, Schema } from 'mongoose';

const notesSchema = new Schema(
  {
    note: {
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

const NotesCollection = model('notes', notesSchema);
export default NotesCollection;
