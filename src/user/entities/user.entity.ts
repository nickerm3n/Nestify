import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Group } from '../../group/entities/group.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column()
  age: number;

  @Column()
  isDeleted: boolean;

  @ManyToMany(() => Group, (group) => group.users)
  @JoinTable()
  groups: Group[];
}
