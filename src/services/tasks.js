import TasksCollection from '../db/models/tasks.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';


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

function getTaskById(taskId, userId)  {
  return TasksCollection.findOne({ _id: taskId, userId });

};


function createTask  (task)  {
 return TasksCollection.create(task);
};

// function deleteTask(taskId, userId) {
//   return TasksCollection.findOneAndDelete({ _id: taskId, userId });
// };
function deleteTask(taskId, userId) {
  console.log('service taskId, userId', taskId, userId);

  return TasksCollection.findOneAndDelete({ _id: taskId, userId });

}


const patchTask = async (taskId, userId, payload, options ) => {
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



export {
  getAllTasks,
  getTaskById,
  createTask,
  deleteTask,
   patchTask,
};
