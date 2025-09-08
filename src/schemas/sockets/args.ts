import { Arg } from './sockets';

export class ArgImpl implements Arg {
    readonly rawValue: string;

    constructor(rawValue: string) {
        this.rawValue = rawValue;
    };

    getNumber(): number {
        const num = Number(this.rawValue);
        if (isNaN(num)) {
            return NaN;
        }
        return num;
    };

    getString(): string {
        return this.rawValue;
    };

    getBoolean(): boolean {
        return Boolean(this.rawValue.toLowerCase());
    };
};