require('dotenv').config();
import db from '../DBindex';
import { Request, Response } from 'express';
import { MysqlError } from 'mysql';

const partners = (req: Request, res: Response) => {
  const { article_id } = req.params;
  let nickname: string[] = [];

  try {
    db.query('select nickname from parner where articleId=?', article_id, (error: MysqlError | null, result: any[]) => {
      if (error)
        return res.json({
          result: false,
        });
      for (let i = 0; i < result[0].length; i++) {
        nickname.push(result[0].nickname);
      }
      console.log('list of partners: ', nickname);
      res.json({
        result: true,
        partners: nickname,
      });
    });
  } catch (error) {
    return res.json({
      result: false,
    });
  }
};

export default { partners };
