import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Headers,
  Patch,
} from '@nestjs/common';
import { UserLoginDto } from './dto/login.dto';
import { UserModifyPWDto } from './dto/modifyPassword.dto';
import { UserSignupDto } from './dto/signup.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  signup(@Body() body: UserSignupDto) {
    return this.userService.signup(body);
  }

  @Post('login')
  login(@Body() body: UserLoginDto) {
    return this.userService.login(body);
  }

  @UseGuards()
  @Get('user-info')
  userInfo(@Headers() headers: any) {
    console.log(headers);
    return this.userService.userInfo(headers);
  }

  @UseGuards()
  @Patch('user-info/password')
  modifyPW(@Headers() headers: any, @Body() body: UserModifyPWDto) {
    return this.userService.modifyPW(headers, body);
  }
}
