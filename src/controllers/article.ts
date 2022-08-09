require('dotenv').config();
import db from '../DBindex';
import { Request, Response } from 'express';
import { MysqlError } from 'mysql';

const post = (req: Request, res: Response) => {
  const { user } = res.locals;
  const {
    location,
    detail_location,
    gu,
    dong,
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
    'insert into article(location, detail_location, gu, dong, price, period, use_point, title, contents, post_bank, post_account, post_holder, point_earned, writer, date) ' +
    'values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, date_format(curdate(), "%Y-%m-%d"))';
  const values = [
    location,
    detail_location,
    gu,
    dong,
    price,
    period,
    use_point,
    title,
    contents,
    post_bank,
    post_account,
    post_holder,
    point_earned,
    user.nickname,
  ];
  try {
    db.query(query, values, (error: MysqlError | null, result: any[]) => {
      if (error) {
        return res.status(401).json({
          result: false,
        });
      }
      return res.status(201).json({
        result: true,
      });
    });
  } catch (error) {
    console.log('catch error in article_post: ', error);
    return res.status(401).json({
      result: false,
    });
  }
};

const main = (req: Request, res: Response) => {
  let data: string[] = [];
  let is_user = false;
  if (res.locals.user) is_user = true;
  try {
    db.query('select *, date_format(date, "%Y-%m-%d") as date from article where status="waiting"', (error, result) => {
      if (error) {
        return res.status(400).json({
          result: false,
        });
      }
      for (let i = 0; i < result.length; i++) {
        data.push(result[i]);
      }
      return res.status(200).json({
        result: true,
        is_user: is_user,
        articles: data,
      });
    });
  } catch (error) {
    return res.status(400).json({
      result: false,
    });
  }
};

const detail = (req: Request, res: Response) => {
  let is_user = false;
  if (res.locals.user) is_user = true;
  const { articleId } = req.params;
  try {
    db.query('select * from article where id=?', articleId, (error, result) => {
      if (error)
        return res.status(400).json({
          result: false,
        });
      return res.status(200).json({
        result: true,
        is_user: is_user,
        article: result,
      });
    });
  } catch (error) {
    return res.status(400).json({
      result: false,
    });
  }
};

const point = (req: Request, res: Response) => {
  let data: any[] = [];
  const { user } = res.locals;
  console.log('res.locals.user: ', user);
  try {
    db.query(
      'select article.id, article.point_earned, date_format(article.date, "%Y-%m-%d") as date from article where article.partner = ? order by article.id desc',
      user.nickname,
      (error, result) => {
        if (error)
          return res.status(400).json({
            result: false,
          });
        if (result.length < 1) {
          return res.status(200).json({
            result: true,
            current_point: user.current_point,
            date: user.date,
          });
        }
        for (let i = 0; i < result.length; i++) {
          data.push({ id: result[i].id, point_earned: result[i].point_earned, date: result[i].date });
        }
        return res.status(200).json({
          result: true,
          current_point: user.current_point,
          history: data,
        });
      },
    );
  } catch (error) {
    return res.status(400).json({
      result: false,
    });
  }
};

const change_status = (req: Request, res: Response) => {
  const { status } = req.body;
  const { articleId } = req.params;
  console.log('status & articleId: ', status, ' & ', articleId);
  try {
    let query = 'update article set status=? where id=?';
    if (status === 'waiting') {
      query = 'update article set status = ? partner = null where id = ?';
    }
    console.log('query: ', query);
    db.query(query, [status, articleId], (error) => {
      if (error)
        return res.status(400).json({
          result: false,
        });
      return res.status(200).json({
        result: true,
      });
    });
  } catch (error) {
    return res.status(400).json({
      result: false,
    });
  }
};

const choice = (req: Request, res: Response) => {
  const { nickname } = req.body;
  const { articleId } = req.params;
  try {
    db.query('update article set status="matching", partner=? where id=?', [nickname, articleId], (error) => {
      if (error)
        return res.status(400).json({
          result: false,
        });
      return res.status(200).json({
        result: true,
      });
    });
  } catch (error) {
    return res.status(400).json({
      result: false,
    });
  }
};

const search = (req: Request, res: Response) => {
  let is_user = false;
  if (res.locals.user) is_user = true;
  const { minprice, maxperiod, location1, location2, location3 } = req.query;
  console.log('req.query: ', req.query);
  const [location1_gu, location1_dong] = location1.split(' ');
  const [location2_gu, location2_dong] = location2.split(' ');
  const [location3_gu, location3_dong] = location3.split(' ');
  try {
    let query =
      'select *, date_format(date, "%Y-%m-%d") as date from article where price >= ? and ? >= period and status="waiting" and ((gu=? and dong=?) or (gu=? and dong=?) or (gu=? and dong=?))';
    if (location1 === '* *') {
      query = 'select *, date_format(date, "%Y-%m-%d") as date from article where price >= ? and ? >= period';
    }
    db.query(
      query,
      [minprice, maxperiod, location1_gu, location1_dong, location2_gu, location2_dong, location3_gu, location3_dong],
      (error, result) => {
        console.log('sql error: ', error);
        if (error)
          return res.status(400).json({
            result: false,
          });
        return res.status(200).json({
          result: true,
          is_user: is_user,
          articles: result,
        });
      },
    );
  } catch (error) {
    console.log('catch error: ', error);
    return res.status(400).json({
      result: false,
    });
  }
};

export default { post, main, detail, point, change_status, choice, search };
