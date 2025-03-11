import { DataSource } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Projet } from "../projets/entities/projet.entity";
import { Interest } from "../interests/entities/interest.entity";
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    username: process.env.DATABASE_USER || 'user',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'qvema',
    entities: [User, Projet, Interest],
    synchronize: true
});

export default dataSource;