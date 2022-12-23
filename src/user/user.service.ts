import { Injectable, ForbiddenException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserRepository } from 'src/user/repositories/user.repository';
import { UserLoginDto } from './dto/login.dto';
import { UserSignupDto } from './dto/signup.dto';
import { bcryptConstant } from './bcryptConstant';
import bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async signup(data: UserSignupDto) {
    // return this.userRepository.save(data);
    console.log(data);
    const isExist = await this.userRepository.findOne({
      where: [{ nickname: data.nickname }],
    });
    if (isExist) {
      throw new ForbiddenException({
        statusCode: HttpStatus.FORBIDDEN,
        message: [`이미 등록된 사용자입니다.`],
        error: 'Forbidden',
      });
    }
    // eslint-disable-next-line prettier/prettier
    UserSignupDto.password = await bcrypt.hash(
      UserSignupDto.password,
      bcryptConstant.saltOrRounds,
    );
    return this.userRepository.save(UserSignupDto);
  }

  // login(data: UserLoginDto) {
  //   return this.userRepository.findOne((user) => user.nickname === data.nickname && )
  // }
}
