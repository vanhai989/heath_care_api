export class FoodNotFoundError extends Error {
    code: string;

    constructor(code: string) {
        super("Food not found!");
        this.code = code;
    }
}
