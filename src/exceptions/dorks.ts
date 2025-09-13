export class DorksAPIError extends Error {

    constructor(message: string) {
        super(message);
        this.name = `DorksApiError`;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DorksAPIError);
        }
    }
};