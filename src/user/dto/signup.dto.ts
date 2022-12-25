import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserSignupDto {
  id: number;

  nickname: string;

  password: string;

  phone: string;

  address: string;

  detail_address: string;

  gu: string;

  dong: string;

  bank: string;

  account: string;

  holder: string;

  // @Column()
  // readonly current_point: number;
}
