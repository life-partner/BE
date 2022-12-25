import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column()
  detail_address: string;

  @Column()
  gu: string;

  @Column()
  dong: string;

  @Column()
  bank: string;

  @Column()
  account: string;

  @Column()
  holder: string;

  @Column()
  current_point: number;
}
