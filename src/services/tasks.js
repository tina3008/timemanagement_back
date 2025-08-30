import TasksCollection from '../db/models/tasks.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';
import moment from 'moment-timezone';

const getAllTasks = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter,
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const tasksQuery = TasksCollection.find();

  if (filter.isFavourite) {
    tasksQuery.where('isFavourite').equals(filter.isFavourite);
  }
  if (filter.taskType) {
    tasksQuery.where('taskType').equals(filter.taskType);
  }

  tasksQuery.where('userId').equals(userId);

  const [tasksCount, tasks] = await Promise.all([
    TasksCollection.find().merge(tasksQuery).countDocuments(),
    tasksQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(tasksCount, perPage, page);

  return {
    data: tasks,
    ...paginationData,
  };
};

function getTaskById(taskId, userId) {
  return TasksCollection.findOne({ _id: taskId, userId });
}

function createTask(task) {
  return TasksCollection.create(task);
}

function deleteTask(taskId, userId) {
  return TasksCollection.findOneAndDelete({ _id: taskId, userId });
}

const patchTask = async (taskId, userId, payload, options) => {
  const rawResult = await TasksCollection.findOneAndUpdate(
    { _id: taskId, userId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;
  console.log(rawResult._id);
  return {
    task: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

// export const findTasksByDay = async (userId, day) => {
//   const start = new Date(day);
//   start.setHours(0, 0, 0, 0);

//   const end = new Date(day);
//   end.setHours(23, 59, 59, 999);

//   return await TasksCollection.find({
//     userId,
//     date: { $gte: start, $lt: end },
//   });
// };

// export const findTasksByMonth = async (userId, year, month) => {
//   const start = new Date(year, month - 1, 1);
//   const end = new Date(year, month, 0, 23, 59, 59, 999);

//   return await TasksCollection.find({
//     userId,
//     date: { $gte: start, $lt: end },
//   });
// };

export const findTasksByDay = async (userId, day, timezone = 'UTC') => {
  // day = строка типа "2025-08-29"
  const start = moment.tz(day, timezone).startOf('day').toDate();
  const end = moment.tz(day, timezone).endOf('day').toDate();

  return await TasksCollection.find({
    userId,
    date: { $gte: start, $lte: end },
  });
};

export const findTasksByMonth = async (
  userId,
  year,
  month,
  timezone = 'UTC',
) => {
  // month: 1–12
  const start = moment
    .tz({ year, month: month - 1, day: 1 }, timezone)
    .startOf('month')
    .toDate();
  const end = moment
    .tz({ year, month: month - 1, day: 1 }, timezone)
    .endOf('month')
    .toDate();

  return await TasksCollection.find({
    userId,
    date: { $gte: start, $lte: end },
  });
};

export { getAllTasks, getTaskById, createTask, deleteTask, patchTask };
