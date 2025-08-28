const parseisFavourite = (isFavourite) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const isBool = typeof JSON.parse(isString) === 'boolean';
  if (!isBool) return;
  return JSON.parse(isFavourite);
};

const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;

 const isContactType = (contactType) =>
   ['work', 'home', 'personal'].includes(contactType);

 if (isContactType(contactType)) return contactType;
};

export const parseFilterParams = (query) => {
  const { isFavourite, contactType } = query;

  const parsedisFavourite = parseisFavourite(isFavourite);
 const parsedContactType = parseContactType(contactType);
  return {
    isFavourite: parsedisFavourite,
    contactType: parsedContactType,
  };
};
