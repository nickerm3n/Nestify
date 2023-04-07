import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permissions } from '../constants/group.contstans';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('simple-array')
  permissions: Permissions[];

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];
}
