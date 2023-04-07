import { Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Group } from './group.entity';

@Entity()
@Index(['user', 'group'], { unique: true })
export class UserGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.groups, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Group, (group) => group.users, { onDelete: 'CASCADE' })
  group: Group;
}
