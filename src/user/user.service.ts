import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserLoginDto } from './dto/login.dto';
import { UserSignupDto } from './dto/signup.dto';
import { UserModifyPWDto } from './dto/modifyPassword.dto';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(body: UserSignupDto) {
    if (
      !body.nickname ||
      !body.password ||
      !body.phone ||
      !body.address ||
      !body.detail_address ||
      !body.dong ||
      !body.gu
    ) {
      throw new BadRequestException();
    }
    const isExist = await this.userRepository.query(
      'select nickname from user where nickname=?',
      [body.nickname],
    );
    if (isExist[0]) {
      throw new ForbiddenException();
    }
    const query =
      'insert into user(nickname, password, phone, address, detail_address, gu, dong, bank, account, holder, current_point) ' +
      'values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const value = [
      body.nickname,
      body.password,
      body.phone,
      body.address,
      body.detail_address,
      body.gu,
      body.dong,
      body.bank,
      body.account,
      body.holder,
      1000,
    ];
    return await this.userRepository.query(query, value);
  }

  async login(body: UserLoginDto) {
    const isExist = await this.userRepository.query(
      'select * from user where nickname=?',
      [body.nickname],
    );
    if (!isExist[0] || isExist[0].password !== body.password) {
      throw new NotFoundException();
    }
    if (isExist[0] && isExist[0].password === body.password) {
      const { ...result } = isExist;
      const accessToken = this.jwtService.sign(result);
      result['token'] = accessToken;
      return result['token'];
    }
    return null;
  }

  async userInfo(headers: any) {
    const id = this.jwtService.decode(headers.token);
    const user = await this.userRepository.query(
      'select * from user where id = ?',
      [id['0'].id],
    );
    return user;
  }

  async modifyPW(headers: any, body: UserModifyPWDto) {
    const id = this.jwtService.decode(headers.token);
    if (body.password !== id['0'].password) throw new BadRequestException();
    await this.userRepository.query('update user set password=? where id=?', [
      body.modifyPassword,
      id['0'].id,
    ]);
  }
}
