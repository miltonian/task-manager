import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: () => 'NOW()', type: 'timestamptz' })
  dateCreated: Date;

  @Column({ default: () => 'NOW()', type: 'timestamptz' })
  dateUpdated: Date;
}
