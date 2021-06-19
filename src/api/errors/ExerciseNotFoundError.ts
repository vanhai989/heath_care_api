export class ExerciseNotFoundError extends Error {
    code: string;

    constructor(code: string) {
        super("Exercise not found!");
        this.code = code;
    }
}
