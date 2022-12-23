import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column()
  readonly nickname: string;

  @Column()
  readonly password: string;

  @Column()
  readonly phone: string;

  @Column()
  readonly address: string;

  @Column()
  readonly detail_address: string;

  @Column()
  readonly gu: string;

  @Column()
  readonly dong: string;

  @Column()
  readonly bank: string;

  @Column()
  readonly account: string;

  @Column()
  readonly holder: string;

  @Column({ default: 1000 })
  readonly current_point: number;
}
