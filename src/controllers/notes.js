import {
  createNote,
  deleteNote,
  getAllNotes,
  getNoteById,
  patchNote,
} from '../services/notes.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export const getNotesController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const notes = await getAllNotes({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.json({
    status: 200,
    message: 'Successfully found notes!',
    data: notes,
  });
};

export const getNoteIDController = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await getNoteById(noteId, req.user._id);

  if (!note) {
    throw createHttpError(404, `Note not found, ${noteId}`);
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found note with id ${noteId}!`,
    data: note,
  });
};

export const createNoteController = async (req, res) => {
  const noteFields = {
    note: req.body.note,
    userId: req.user._id,
  };
  const note = await createNote(noteFields);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a note!',
    data: note,
  });
};

export const deleteNoteController = async (req, res) => {
  const { noteId } = req.params;

  const note = await deleteNote(noteId, req.user._id);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(204).send();
};

export const changeNoteController = async (req, res, next) => {
  const { noteId } = req.params;

  const result = await patchNote(noteId, req.user._id, {
    ...req.body,
  });

  if (!result) {
    next(createHttpError(404, `Note not found ${noteId}`));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully patched a note!',
    data: result.note,
  });
};
