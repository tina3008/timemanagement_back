import { model, Schema } from 'mongoose';

const tasksSchema = new Schema(
  {
    task: {
      type: String,
      required: true,
    },
    timeDeclaration: {
      type: Number,
      required: true,
    },
    timeReal: {
      type: Number,
      required: false,
    },
    taskType: {
      type: String,
      required: true,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['completed', 'pending','working'],
      default: 'pending',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

tasksSchema.virtual('timeDifferent').get(function () {
  if (this.timeReal == null) return null;
  return this.timeReal - this.timeDeclaration;
});

const TasksCollection = model('tasks', tasksSchema);
export default TasksCollection;
