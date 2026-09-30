export class MissingPermissionsError extends Error {
    constructor(message: string) {
        super(message);
    }
}
