require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import { MysqlError } from 'mysql';
const jwt = require('jsonwebtoken');
const db = require('./DBindex');

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(400).json({ result: false });

  const [token_type, token_value] = authorization.split(' ');
  if (token_type !== 'Bearer') return res.status(400).json({ result: false });

  try {
    const { userID } = jwt.verify(token_value, process.env.TOKEN_SECRET_KEY);
    await db.query('select * from user where id=?', userID, (err: MysqlError, result: any[]) => {
      if (err) return res.status(400).json({ result: false });
      console.log('typeof result in auth: ', typeof result);
      res.locals.user = result[0];
      next();
    });
  } catch (error) {
    console.log('catch error in auth: ', error);
    return res.status(400).json({ result: false });
  }
};

export default auth;
