import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity("events")
export default class Event extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  url: string;

  @Column({
    type: 'timestamp without time zone',
    nullable: false,
    default: () => 'NOW()'
  })
  scheduled_at: Date;

  @Column({
    type: 'timestamp without time zone',
    nullable: false,
    default: () => 'NOW()'
  })
  created_at: Date;

  @Column({
    type: 'timestamp without time zone',
    nullable: true
  })
  deleted_at: Date;
}
