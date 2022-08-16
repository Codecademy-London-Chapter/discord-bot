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

  @Column({ 
    name: 'user_id',
    nullable: false
  })
  userID: string;

  @Column({ nullable: false })
  email: string;

  @Column({
    name: 'session_date',
    nullable: false
  })
  sessionDate: Date;

  @Column({ 
    name: 'preferred_language',
    nullable: false 
  })
  preferredLanguage: string;

  @Column({ 
    name: 'language_skills',
    nullable: false
  })
  languageSkills: string[];
}
