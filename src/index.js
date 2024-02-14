import dotenv from 'dotenv';
import connectDB from './db/index.js';
import serverless from 'serverless-http';
import { app } from './app.js';
dotenv.config({
  path: './.env',
});

connectDB();
// .then(() => {
//   app.listen(process.env.PORT || 8000, () => {
//     console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
//   });
// })
// .catch((err) => {
//   console.log('MONGO db connection failed !!! ', err);
// });

module.exports.handler = serverless(app, {
  provider: process.env.SERVERLESS_PROVIDER,
});
