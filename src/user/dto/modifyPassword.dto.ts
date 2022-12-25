import { Column, Entity } from 'typeorm';

@Entity()
export class UserModifyPWDto {
  @Column()
  nickname: string;

  @Column()
  password: string;

  @Column()
  modifyPassword: string;
}
