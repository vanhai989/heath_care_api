export class AreaNotFoundError extends Error {
    code: string;

    constructor(code: string) {
        super("Page not found!");
        this.code = code;
    }
}
