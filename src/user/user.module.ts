import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      //토큰 서명 값 설정
      secret: 'secret',
      //토큰 유효시간 (임의 60초)
      signOptions: { expiresIn: '30m' },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
// import { Module } from '@nestjs/common';
// import { LocalStrategy } from './strategies/auth.local.strategy';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserRepository } from 'src/repository/user.repository';
// import { jwtConstants } from './constants';

// @Module({
//   imports: [TypeOrmModule.forFeature([UserRepository])],
//   providers: [AuthService, LocalStrategy, JwtStrategy],
//   exports: [AuthService],
// })
// export class AuthModule {}
