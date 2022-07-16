require('dotenv').config();
import express from 'express';
import db from '../DBindex';
import { Request, Response, NextFunction } from 'express';
import { MysqlError } from 'mysql';

const partners = (req: Request, res: Response) => {
  const { article_id } = req.params;

  try {
    db.query('select nickname from parner where articleId=?', article_id, (error: MysqlError | null, result: any[]) => {
      if (error)
        return res.json({
          result: false,
        });
      res.json({
        result: true,
        partners: result[0].nickname,
      });
    });
  } catch (error) {
    return res.json({
      result: false,
    });
  }
};

export default { partners };
