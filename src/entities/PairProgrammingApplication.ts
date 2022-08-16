import { 
  Entity, 
  Column, 
  BaseEntity,
  PrimaryGeneratedColumn 
} from "typeorm";

@Entity("pair_programming_application")
export default class PairProgrammingApplication extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  session_date: Date;

  @Column({ nullable: false })
  preferred_language: string;

  @Column({ nullable: false })
  language_skills: string[];
}
