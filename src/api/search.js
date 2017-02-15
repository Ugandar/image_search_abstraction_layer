import express from 'express';
import Search from 'bing.search';
import { SearchHistory } from '../models/searchHistory';

var search = new Search('/Q0r38aJ1M7F2I2pSfvBKAigdhkQqvkREGYupdm7gnQ'); // Create the search object
 
export const searchApi = express.Router();
 
searchApi.get('/search/:query', (req, res) => {
   let query = req.params.query, // Get the query from the path parameters object
   offset = req.query.offset || 10, // We grab the "offset" query param or set it to 10 by default
      timestamp = Date.now();   // Get the unix timestamp
 
 // Finally, we use the options object top pass the offset in
  search.images(query, (error, results) => {
    if (error) {
      res.status(500).json(error); // We return an error code
    } else {
       res.status(200).json(results.map(createResults));
    }
  });
  
  // We grab the values that interest us and ignore the rest
function createResults(image) {
  return {
    url: image.url,
    title: image.title,
    thumbnail: image.thumbnail.url,
    source: image.sourceUrl,
    type: image.type
  }
}
 
  // We save a new search history entry asynchronously
  let queryHistory = new SearchHistory({ query, timestamp }); // Notice ES6 here!
  queryHistory.save();
});
 
searchApi.get('/latest', (req, res) => {
   SearchHistory
    .find() // We search for every entry
    .select({ _id: 0, query: 1, timestamp: 1 }) // We want timestamp and query back, but not the default _id field
    .sort({ timestamp: -1 }) // Order by DESCENDING timestamp
    .limit(10) // Limit the result to 10 entries
    .then(results => {  // Finally, return the results
      res.status(200).json(results);
    });
});