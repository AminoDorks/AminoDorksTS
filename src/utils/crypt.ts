import { randomBytes, createHash, createHmac } from 'crypto';
import { v4 } from 'uuid';

import { CRYPTO_KEYS } from '../constants';
import { Safe } from '../private';
import { SessionData, SessionDataSchema } from '../schemas/crypt';

export const generateTransactionId = () => v4({ random: Uint8Array.from(Buffer.from(randomBytes(16).toString('hex'), 'hex')) });

export const decodeSession = (session: Safe<string>): SessionData => {
    let base64Str = session.replace(/[-+]/g, (m) => m === '-' ? '+' : '-');
    base64Str = base64Str.replace(/[_/]/g, (m) => m === '_' ? '/' : '_');
    base64Str = base64Str.padEnd(base64Str.length + (-base64Str.length % 4), '=');

    const decoded = Buffer.from(base64Str, 'base64');
    const jsonString = decoded.subarray(1, decoded.length - 20).toString('utf-8');
    const parsedString = JSON.parse(jsonString);

    return SessionDataSchema.parse(parsedString);
};

export const generateDeviceId = (): string => {
    const sha1Hash = Uint8Array.from(
        createHash(
            'sha1'
        ).update(randomBytes(CRYPTO_KEYS.DEVICE_LENGTH).toString('hex'), 'utf-8').digest()
    );
    const data = Buffer.concat([CRYPTO_KEYS.PREFIX, sha1Hash]);
    const hmacHash = createHmac('sha1', CRYPTO_KEYS.DEVICE_ID_KEY)
                            .update(Uint8Array.from(data))
                            .digest('hex');

    return (data.toString('hex') + hmacHash).toUpperCase();
};

export const generateHMAC = (buffer: Safe<Buffer>): string => {
    const hmac = createHmac('sha1', CRYPTO_KEYS.SIGNATURE_KEY);
    hmac.update(Uint8Array.from(buffer));

    const signatureArray: number[] = [CRYPTO_KEYS.PREFIX[0], ...Array.from(hmac.digest())];
    const signatureBuffer: Buffer = Buffer.from(signatureArray);

    return signatureBuffer.toString('base64');
};
