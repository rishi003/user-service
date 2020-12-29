import {
    BaseEntity,
    Column,
    Entity,
    RedisOrmDecoratorError,
    RedisOrmOperationError,
    RedisOrmQueryError,
    RedisOrmSchemaError,
    redisOrm,
} from "ts-redis-orm";

@Entity({connection: "default", table: "Users", tablePrefix: "Users_"})
export class User extends BaseEntity{
    @Column({autoIncrement:true})
    public id: number = 0;

    @Column({unique:true})
    public username: string = ""

    @Column()
    public password: string = ""
}


