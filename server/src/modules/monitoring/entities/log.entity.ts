import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  timestamp!: Date;

  @Column({
    type: 'enum',
    enum: ['info', 'warn', 'error'],
    default: 'info'
  })
  level!: 'info' | 'warn' | 'error';

  @Column('text')
  message!: string;

  @Column({ nullable: true })
  path?: string;

  @Column({ nullable: true })
  method?: string;

  @Column({ nullable: true })
  statusCode?: number;

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  userRole?: string;

  @Column({ type: 'float', nullable: true })
  duration?: number;

  @Column('text', { nullable: true })
  error?: string;

  @Column('text', { nullable: true })
  stack?: string;
}
