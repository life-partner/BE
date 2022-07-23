require('dotenv').config();
import db from '../DBindex';
import cryptojs from 'crypto-js';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { MysqlError } from 'mysql';

const signup = (req: Request, res: Response) => {
  const { nickname, password, phone, address, detail_address, gu, dong, bank, account, holder } = req.body;
  console.log('req.body: ', req.body);
  // 필수 데이터 중 하나라도 빈 값으로 넘어오면 예외 처리
  if (!nickname || !password || !phone || !address || !detail_address || !dong || !gu)
    return res.status(401).json({
      result: false,
      err_code: 401,
    });
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
      'insert into user(nickname, password, phone, address, detail_address, gu, dong, bank, account, holder, current_point) ' +
      'values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const value = [nickname, encrypted, phone, address, detail_address, gu, dong, bank, account, holder, 1000];
    db.query(query, value, (error, result) => {
      console.log('sql error: ', error);
      console.log('sql result: ', result);
      if (error)
        return res.status(401).json({
          result: false,
        });
      return res.status(201).json({
        result: true,
      });
    });
  } catch (error) {
    console.log('catch error in signup: ', error);
    return res.status(401).json({
      result: false,
    });
  }
};

const login = (req: Request, res: Response) => {
  const { nickname, password } = req.body;
  console.log('req.body in login: ', req.body);
  try {
    db.query('select * from user where nickname=?', nickname, (error, result) => {
      console.log('sql error in login: ', error);
      console.log('sql result in login: ', result);
      console.log('sql result in login[0]: ', result[0]);
      console.log('sql result in login[0].password: ', result[0].password);
      if (result[0].length < 1) {
        return res.status(401).json({
          result: false,
          err_code: 401,
        });
      }
      const privateKey: string | undefined = process.env.PASSWORD_SECRET_KEY;
      const bytes = cryptojs.AES.decrypt(result[0].password, privateKey!);
      console.log('bytes: ', bytes);
      const decrypted = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
      console.log('decrypted: ', decrypted);
      if (password === decrypted) {
        const token = jwt.sign(
          {
            id: result[0].id,
          },
          process.env.TOKEN_SECRET_KEY!,
        );
        return res.status(200).json({
          result: true,
          token: token,
        });
      } else {
        return res.status(400).json({
          result: false,
          message: '비밀번호가 틀립니다. 다시 확인해주세요.',
        });
      }
    });
  } catch (error) {
    console.log('catch error in login: ', error);
    return res.status(400).json({
      result: false,
    });
  }
};

const user_info = (req: Request, res: Response) => {
  const { user } = res.locals;
  return res.status(200).json({
    nickname: user.nickname,
    phone: user.phone,
    address: user.address,
    detail_address: user.detail_address,
    dong: user.dong,
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
    const bytes = cryptojs.AES.decrypt(user.password, privateKey!);
    const decrypted = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
    const encrypted = cryptojs.AES.encrypt(JSON.stringify(modifiedPassword), privateKey!).toString();
    db.query('select * from user where nickname=?', user.nickname, (error, result) => {
      if (password === decrypted) {
        db.query('update user set password=? where nickname=?', [encrypted, user.nickname], (error, result) => {
          if (error) {
            return res.status(400).json({
              result: false,
            });
          }
          return res.status(200).json({
            result: true,
          });
        });
      } else {
        return res.status(400).json({
          result: false,
        });
      }
    });
  } catch (error) {
    console.log('catch error in modify_password: ', error);
    return res.status(400).json({
      result: false,
    });
  }
};

const modify_phone = (req: Request, res: Response) => {
  const { user } = res.locals;
  const { phone } = req.body;
  try {
    db.query('update user set phone=? where nickname=?', [phone, user.nickname], (error, result) => {
      if (error)
        return res.status(400).json({
          result: false,
        });
      return res.status(200).json({
        result: true,
      });
    });
  } catch (error) {
    console.log('catch error in modify_phone: ', error);
    return res.status(400).json({
      result: false,
    });
  }
};

const modify_address = (req: Request, res: Response) => {
  const { user } = res.locals;
  const { address, detail_address, dong } = req.body;
  try {
    db.query(
      'update user set address=?, detail_address=?, dong=? where nickname=?',
      [address, detail_address, dong, user.nickname],
      (error, result) => {
        if (error)
          return res.status(400).json({
            result: false,
          });
        return res.status(200).json({
          result: true,
        });
      },
    );
  } catch (error) {
    console.log('catch error in modify_address: ', error);
    return res.status(400).json({
      result: false,
    });
  }
};

const modify_account = (req: Request, res: Response) => {
  const { user } = res.locals;
  const { bank, account, holder } = req.body;
  try {
    db.query(
      'update user set bank=?, account=?, holder=? where nickname=?',
      [bank, account, holder, user.nickname],
      (error, result) => {
        if (error)
          return res.status(400).json({
            result: false,
          });
        return res.status(200).json({
          result: true,
        });
      },
    );
  } catch (error) {
    console.log('catch error in modify_account: ', error);
    return res.status(400).json({
      result: false,
    });
  }
};

const withdraw = (req: Request, res: Response) => {
  const { user } = res.locals;
  try {
    db.query('delete from user where nickname=?', user.nickname, (error) => {
      if (error)
        return res.status(400).json({
          result: false,
        });
      return res.status(200).json({
        result: true,
      });
    });
  } catch (error) {
    console.log('catch error in withdraw: ', error);
    return res.status(400).json({
      result: false,
    });
  }
};

export default { signup, login, user_info, modify_password, modify_phone, modify_address, modify_account, withdraw };
