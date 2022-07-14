require('dotenv').config();
import express from 'express';
import db from '../DBindex';
import cryptojs from 'crypto-js';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { MysqlError } from 'mysql';

// const router = express.Router();

const signup = (req: Request, res: Response) => {
  const { nickname, password, phone, address, detail_address, bank, account, holder } = req.body;
  try {
    // 중복 닉네임 확인
    db.query('select nickname from user where nickname=?', nickname, (error: MysqlError | null, result: any[]) => {
      if (result.length > 0)
        return res.status(401).json({
          result: false,
          err_code: 401,
        });
    });
    const privateKey: string | undefined = process.env.PASSWORD_SECRET_KEY;
    const encrypted = cryptojs.AES.encrypt(JSON.stringify(password), privateKey!).toString();
    const query =
      'insert into user(userID, password, phone, address, detail_address, bank, account, holder) ' +
      'values(?, ?, ?, ?, ?, ?, ?, ?)';
    const value = [nickname, encrypted, phone, address, detail_address, bank, account, holder];
    db.query(query, value, () => {
      res.status(201).json({
        result: true,
      });
    });
  } catch (error) {
    console.log('catch error in signup: ', error);
    res.status(401).json({
      result: false,
    });
  }
};

const login = (req: Request, res: Response) => {
  const { nickname, password } = req.body;
  try {
    const privateKey: string | undefined = process.env.PASSWORD_SECRET_KEY;
    db.query('select * from users where nickname=?', nickname, (error: MysqlError | null, result: any[]) => {
      if (result.length < 1) {
        return res.status(401).json({
          result: false,
          err_code: 401,
        });
      }
      const bytes = cryptojs.AES.decrypt(result[0].password, privateKey!);
      const decrypted = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
      if (password === decrypted) {
        const token = jwt.sign(
          {
            id: result[0].id,
          },
          process.env.TOKEN_SECRET_KEY!,
        );
        res.status(200).json({
          result: true,
          token: token,
        });
      } else {
        res.status(400).json({
          result: false,
          message: '비밀번호가 틀립니다. 다시 확인해주세요.',
        });
      }
    });
  } catch (error) {
    console.log('catch error in login: ', error);
    res.status(400).json({
      result: false,
    });
  }
};

const user_info = (req: Request, res: Response) => {
  const { user } = res.locals;
  res.status(200).json({
    nickname: user.nickname,
    phone: user.phone,
    address: user.address,
    detail_address: user.detail_address,
    bank: user.bank,
    account: user.account,
    holder: user.holder,
    current_point: user.current_point,
  });
};

const modify_password = (req: Request, res: Response) => {
  const { user } = res.locals;
  const { password, modifiedPassword } = req.body;
  try {
    const privateKey: string | undefined = process.env.PASSWORD_SECRET_KEY;
    const bytes = cryptojs.AES.decrypt(result[0].password, privateKey!);
    const decrypted = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
    db.query('select * from users where nickname=?', user.nickname, (error: MysqlError | null, result: any[]) => {
      if (password === decrypted) {
        res.status(200).json({
          result: true,
        });
      } else {
        res.status(400).json({
          result: false,
          message: '비밀번호가 틀립니다. 다시 확인해주세요.',
        });
      }
    });
  } catch (error) {
    console.log('catch error in login: ', error);
    res.status(400).json({
      result: false,
    });
  }
};

export default { signup, login, user_info, modify_password, modify_phone, modify_address, modify_account };
