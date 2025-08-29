import {
  createResurse,
  deleteResurse,
  getAllResurses,
  getResurseById,
  patchResurse,
} from '../services/resurses.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getResursesController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const resurses = await getAllResurses({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.json({
    status: 200,
    message: 'Successfully found resurses!',
    data: resurses,
  });
};

export const getResurseIDController = async (req, res, next) => {
  const { resurseId } = req.params;
  const resurse = await getResurseById(resurseId, req.user._id);

  if (!resurse) {
    throw createHttpError(404, `Resurse not found, ${resurseId}`);
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found resurse with id ${resurseId}!`,
    data: resurse,
  });
};

export const createResurseController = async (req, res) => {
  const resurseFields = {
    resurse: req.body.resurse,
    category: req.body.category,
    userId: req.user._id,
  };
  const resurse = await createResurse(resurseFields);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a resurse!',
    data: resurse,
  });
};

export const deleteResurseController = async (req, res) => {
  const { resurseId } = req.params;

  const resurse = await deleteResurse(resurseId, req.user._id);

  if (!resurse) {
    throw createHttpError(404, 'resurse not found');
  }

  res.status(204).send();
};

export const changeResurseController = async (req, res, next) => {
  const { resurseId } = req.params;

  const result = await patchResurse(resurseId, req.user._id, {
    ...req.body,
  });

  if (!result) {
    next(createHttpError(404, `Resurse not found ${resurseId}`));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully patched a resurse!',
    data: result.resurse,
  });
};
