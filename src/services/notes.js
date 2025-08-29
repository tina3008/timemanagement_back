import NotesCollection from '../db/models/notes.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

const getAllNotes = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter,
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const notesQuery = NotesCollection.find();

  if (filter.isFavourite) {
    notesQuery.where('isFavourite').equals(filter.isFavourite);
  }
  if (filter.noteType) {
    notesQuery.where('noteType').equals(filter.noteType);
  }

  notesQuery.where('userId').equals(userId);

  const [notesCount, notes] = await Promise.all([
    NotesCollection.find().merge(notesQuery).countDocuments(),
    notesQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(notesCount, perPage, page);

  return {
    data: notes,
    ...paginationData,
  };
};

function getNoteById(noteId, userId) {
  return NotesCollection.findOne({ _id: noteId, userId });
}

function createNote(note) {
  return NotesCollection.create(note);
}

function deleteNote(noteId, userId) {
  return NotesCollection.findOneAndDelete({ _id: noteId, userId });
}

const patchNote = async (noteId, userId, payload, options) => {
  const rawResult = await NotesCollection.findOneAndUpdate(
    { _id: noteId, userId },
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
    note: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export { getAllNotes, getNoteById, createNote, deleteNote, patchNote };
