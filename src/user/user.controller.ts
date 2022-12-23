import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserLoginDto } from './dto/login.dto';
import { UserSignupDto } from './dto/signup.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers(): Promise<UserSignupDto[]> {
    return await this.userService.findAll();
  }

  @Post('signup')
  async signup(@Body() data: UserSignupDto) {
    return await this.userService.signup(data);
  }

  // @Post('login')
  // async login(@Body() data: UserLoginDto) {
  //   return this.userService.login(data);
  // }
}
