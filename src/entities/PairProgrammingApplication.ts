import { Snowflake } from "discord.js";
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
  userID: Snowflake;

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
    name: 'preferred_language_proficiency',
    nullable: false 
  })
  preferredLanguageProficiency: number;

  @Column({ 
    name: 'language_skills',
    nullable: false
  })
  languageSkills: string;
}
