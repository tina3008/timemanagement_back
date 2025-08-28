import { model, Schema } from 'mongoose';

const tasksSchema = new Schema(
  {
    task: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeDeclaration: {
      type: Date,
      required: true,
    },
    timeReal: {
      type: Date,
      required: false,
    },
    timeDifferent: {
      type: Date,
      required: false,
    },

    taskType: {
      type: String,
      required: true,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    photo: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const TasksCollection = model('tasks', tasksSchema);
export default TasksCollection;
