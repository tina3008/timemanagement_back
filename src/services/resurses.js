import ResursesCollection from '../db/models/resurses.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

const getAllResurses = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter,
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const resursesQuery = ResursesCollection.find();

  if (filter.resurseName) {
    resursesQuery.where('resurseName').equals(filter.resurseName);
  }
  if (filter.category) {
    resursesQuery.where('category').equals(filter.category);
  }

  resursesQuery.where('userId').equals(userId);

  const [resursesCount, resurses] = await Promise.all([
    ResursesCollection.find().merge(resursesQuery).countDocuments(),
    resursesQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(resursesCount, perPage, page);

  return {
    data: resurses,
    ...paginationData,
  };
};

function getResurseById(resurseId, userId) {
  return ResursesCollection.findOne({ _id: resurseId, userId });
}

function createResurse(resurse) {
  return ResursesCollection.create(resurse);
}

function deleteResurse(resurseId, userId) {
  return ResursesCollection.findOneAndDelete({ _id: resurseId, userId });
}

const patchResurse = async (resurseId, userId, payload, options) => {
  const rawResult = await ResursesCollection.findOneAndUpdate(
    { _id: resurseId, userId },
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
    resurse: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export { getAllResurses, getResurseById, createResurse, deleteResurse, patchResurse };
