import express from 'express';
import mongoose from 'mongoose';
import { searchApi } from './api/search'; // We import the routes object
 
const mongodb = process.env.MONGODB_URI || 'mongodb://localhost:27017';
mongooseInit(mongodb); // I've moved Mongoose initialization to a function below
 
export const app = express(); // Create express app
 
app.use('/api', searchApi); // We **USE** the routes object for the '/api' route
 
/* Mongoose initialization function */
function mongooseInit(mongodb) {
  mongoose.Promise = global.Promise;
  mongoose.connect(mongodb);
}