require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import { MysqlError } from 'mysql';
import db from './DBindex';
import jwt from 'jsonwebtoken';

const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(400).json({ result: false });

  const [token_type, token_value] = authorization.split(' ');
  if (token_type === 'NOT') return next();
  if (token_type !== 'Bearer') return res.status(400).json({ result: false });

  try {
    const { id }: any = jwt.verify(token_value, process.env.TOKEN_SECRET_KEY!);
    db.query('select * from user where id=?', id, (err: MysqlError | null, result: any[]) => {
      if (err) return res.status(400).json({ result: false });
      res.locals.user = result[0];
      next();
    });
  } catch (error) {
    console.log('catch error in auth: ', error);
    return res.status(400).json({ result: false });
  }
};

export default auth;
