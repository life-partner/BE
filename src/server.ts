require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import userRouter from './routes/user';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', [userRouter]);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`
  ################################################
  🛡️  Server listening...
  ################################################
`);
});
