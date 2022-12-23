import { Column, Entity } from 'typeorm';

@Entity()
export class UserLoginDto {
  @Column()
  readonly nickname: string;

  @Column()
  readonly password: string;
}
