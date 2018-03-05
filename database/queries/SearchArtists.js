const Artist = require('../models/artist');

/**
 * Searches through the Artist collection
 * @param {object} criteria An object with a name, age, and yearsActive
 * @param {string} sortProperty The property to sort the results by
 * @param {integer} offset How many records to skip in the result set
 * @param {integer} limit How many records to return in the result set
 * @return {promise} A promise that resolves with the artists, count, offset, and limit
 * like this: { all: [artists], count: count, offset: offset, limit: limit }
 */
module.exports = (criteria, sortProperty, offset = 0, limit = 10) => {
  // write query that follows sort, offset, limit options only
  // don't worry about 'criteria' yet

  const query = Artist.find({})
    .sort({ [sortProperty]: 1 }) // [sortProperty] is ES6 interpolated object key, not array
    .skip(offset)
    .limit(limit);

  return Promise.all([query, Artist.count()]).then(results => ({
    all: results[0],
    count: results[1],
    offset,
    limit
  }));
};
