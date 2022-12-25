import { Column, Entity } from 'typeorm';

@Entity()
export class UserLoginDto {
  @Column()
  nickname: string;

  @Column()
  password: string;
}
