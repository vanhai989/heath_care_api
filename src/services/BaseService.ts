import {getConnection, Repository} from "typeorm";

export type ObjectType<T> = { new(): T } | Function;

export abstract class BaseService<T> {
    protected genericRepository: Repository<T>;
    private repo: ObjectType<T>;

    protected constructor(repo: ObjectType<T>) {
        this.genericRepository = getConnection().getRepository(repo);
        this.repo = repo;
    }
}
