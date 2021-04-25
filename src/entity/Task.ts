import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  status: TaskAPI.Status;

  @Column({ default: () => 'NOW()', type: 'timestamptz' })
  dateCreated: Date;

  @Column({ default: () => 'NOW()', type: 'timestamptz' })
  dateUpdated: Date;

  @Column({ type: 'timestamptz' })
  dueDate: Date;
}
