export class DorksAPIError extends Error {
    public readonly code: number;

    constructor(code: number, message: string) {
        super(message);
        this.name = message || `AminoDorksAPIError.${code}`;
        this.code = code;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DorksAPIError);
        }
    }
};