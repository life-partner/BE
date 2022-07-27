require('dotenv').config();
import db from '../DBindex';
import { Request, Response } from 'express';
import { MysqlError } from 'mysql';

const partners_list = (req: Request, res: Response) => {
  const { articleId } = req.params;
  let data: string[] = [];
  try {
    db.query('select partner from partner where article_id=?', articleId, (error: MysqlError | null, result: any[]) => {
      if (error)
        return res.status(400).json({
          result: false,
        });
      if (result.length > 5)
        return res.status(400).json({
          result: false,
          err_code: 444,
        });
      for (let i = 0; i < result.length; i++) {
        data.push(result[i].partner);
      }
      return res.status(200).json({
        result: true,
        partners: data,
      });
    });
  } catch (error) {
    return res.status(400).json({
      result: false,
    });
  }
};

const partners_post = (req: Request, res: Response) => {
  const { articleId } = req.params;
  const { user } = res.locals;
  try {
    db.query('select * from partner where aritlce_id=? and partner=?', [articleId, user.nickname], (error, result) => {
      if (error)
        return res.status(400).json({
          result: false,
        });
      if (result[0].length > 0)
        return res.status(400).json({
          result: false,
        });
      db.query(
        'insert into partner(article_id, partner, date) values(?, ?, date_format(curdate(), "%Y-%m-%d"))',
        [articleId, user.nickname],
        (error) => {
          if (error)
            return res.status(400).json({
              result: false,
            });
          return res.status(200).json({
            result: true,
          });
        },
      );
    });
  } catch (error) {
    return res.status(400).json({
      result: false,
    });
  }
};

export default { partners_list, partners_post };
