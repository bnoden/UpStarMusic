const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} arg An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 * like this: { all: [artists], count: count, offset: offset, limit: limit }
 */
module.exports = (arg, sortProperty, offset = 0, limit = 10) => {
  const fullQuery = arg => Artist.find(buildQuery(arg));
  const resultCount = arg => fullQuery(arg).count();

  const query = fullQuery(arg)
    .sort({ [sortProperty]: 1 }) // [sortProperty] is ES6 interpolated object key, not array
    .skip(offset)
    .limit(limit);

  return Promise.all([query, resultCount(arg)]).then(results => ({
    all: results[0],
    count: results[1],
    offset,
    limit
  }));
};

const buildQuery = arg => {
  const query = {};
  const { age, name, yearsActive } = arg;

  if (name) {
    query.$text = { $search: name };
  }
  if (age) {
    query.age = {
      $gte: age.min,
      $lte: age.max
    };
  }
  if (yearsActive) {
    query.yearsActive = {
      $gte: yearsActive.min,
      $lte: yearsActive.max
    };
  }

  return query;
};
