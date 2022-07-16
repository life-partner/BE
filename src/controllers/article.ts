require('dotenv').config();
import express from 'express';
import db from '../DBindex';
import { Request, Response, NextFunction } from 'express';
import { MysqlError } from 'mysql';

// const router = express.Router();

const post = (req: Request, res: Response) => {
  const { user } = res.locals;
  const {
    location,
    detail_location,
    price,
    period,
    use_point,
    point_earned,
    title,
    contents,
    post_bank,
    post_account,
    post_holder,
  } = req.body;

  const query =
    'insert into article(location, detail_location, price, period, use_point,  point_earned, title, contents, post_bank, post_account, post_holder, status, writer, curdate() as date) ' +
    'values(?,?,?,?,?,?,?,?,?,?,?)';
  const values = [
    location,
    detail_location,
    price,
    period,
    use_point,
    point_earned,
    title,
    contents,
    post_bank,
    post_account,
    post_holder,
    'waiting',
    user.nickanme,
  ];

  try {
    db.query(query, values, (error: MysqlError | null, result: any[]) => {
      if (error)
        return res.json({
          result: false,
        });
      return res.json({
        result: true,
      });
    });
  } catch (error) {
    console.log('error in article_post: ', error);
    return res.json({
      result: false,
    });
  }
};

const main = (req: Request, res: Response) => {
  let is_user = false;
  if (res.locals.user) is_user = true;

  try {
    db.query('select * from article where status=waiting', (error: MysqlError, result: any[]) => {
      if (error)
        return res.json({
          result: false,
        });
      return res.json({
        result: true,
        is_user: is_user,
        articles: result,
      });
    });
    // return res.json({
    //     result: true,
    //     is_user: is_user,
    //     articles: data
    // })
  } catch (error) {
    return res.json({
      result: false,
    });
  }
};

const detail = (req: Request, res: Response) => {
  let is_user = false;
  if (res.locals.user) is_user = true;
  const { article_id } = req.params;

  try {
    db.query('select * from article where id=?', article_id, (error: MysqlError | null, result: any[]) => {
      if (error)
        return res.json({
          result: false,
        });
      return res.json({
        result: true,
        is_user: is_user,
        article: result,
      });
    });
  } catch (error) {
    return res.json({
      result: false,
    });
  }
};

const point = (req: Request, res: Response) => {
  let is_user = false;
  if (res.locals.user) is_user = true;
  const { user } = res.locals;

  try {
    db.query(
      'select point, article.point_earned, article.date from user right outer join article.writer=? where nickname=?',
      [user.nickname, user.nickname],
      (error: MysqlError | null, result: any[]) => {
        if (error)
          return res.json({
            result: false,
          });
        return res.json({
          result: true,
          current_point: result[0].point,
          history: [{ point_earned: result[0].point_earned, dateTime: result[0].date }],
        });
      },
    );
  } catch (error) {
    return res.json({
      result: false,
    });
  }
};

const change_status = (req: Request, res: Response) => {
  const { status } = req.body;
  const { article_id } = req.params;

  try {
    db.query('update article set status=? where id=?', [status, article_id], (error: MysqlError | null) => {
      if (error)
        return res.json({
          result: false,
        });
    });
    return res.json({
      result: true,
    });
  } catch (error) {
    return res.json({
      result: false,
    });
  }
};

const choice = (req: Request, res: Response) => {
  const { nickname } = req.body;
  const { article_id } = req.params;

  try {
    db.query(
      'update article set status=? partner=? where id=?',
      ['matching', nickname, article_id],
      (error: MysqlError | null) => {
        if (error)
          return res.json({
            result: false,
          });
      },
    );
    return res.json({
      result: true,
    });
  } catch (error) {
    return res.json({
      result: false,
    });
  }
};

export default { post, main, detail, point, change_status, choice };
