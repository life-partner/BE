require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import user_router from './routes/user';
import article_router from './routes/article';
import partner_router from './routes/partner';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', [user_router, article_router, partner_router]);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`
  ################################################
  🛡️  Server listening...
  ################################################
`);
});
