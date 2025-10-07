import { SocksProxies } from 'fetch-socks';
import { UTC } from '../constants';

export const isStatusOk = (status: number) => status >= 200 && status < 300;

export const getTimezone = () => UTC[new Date().getUTCMinutes() % UTC.length];

export const formatMediaList = (rawMediaList: string[]) => rawMediaList.map((media) => [100, media, null]);

export const formatMedia = (media?: string) => media ? [[100, media, null]] : null;

export const generateElapsedTime = (): string => (performance.now() / 1000 + Math.floor(Math.random() * 101)).toString();

export const convertProxy = (proxy: string): SocksProxies => {
    const match = proxy.match(/socks([45])/);

    if (proxy.includes('@')) {
        const splittedPart = proxy.split('@');
        const [, userId, password] = splittedPart[0].split(':');
        const [host, port] = splittedPart[1].split(':');

        return {
            host,
            type: match ? Number(match[1]) as 4 | 5 : 5,
            port: Number(port),
            userId,
            password
        };
    };

    const [host, port] = proxy.slice(9).split(':');

    return {
        host,
        type: match ? Number(match[1]) as 4 | 5 : 5,
        port: Number(port)
    };
};

export const getIconCredentials = (icon: string, width: number, height: number) => {
    return {
        height: height.toFixed(1),
        imageMatrix: [
            0.6521739363670349,
            0.0,
            119.99998474121094,
            0.0,
            0.6521739363670349,
            474.0,
            0.0,
            0.0,
            1.0
        ],
        path: icon,
        width: width.toFixed(1),
        x: 2.3396809410769492E-5,
        y: 0.0
    };
};

export const getCoverCredentials = async (thumbnail: string, width: number, height: number) => {
    return [
        {
            height: height.toFixed(1),
            imageMatrix: [
                1.1603261232376099,
                0.0,
                -67.0,
                0.0,
                1.1603261232376099,
                287.0,
                0.0,
                0.0,
                1.0
            ],
            path: thumbnail,
            width: width.toFixed(1),
            x: 0.0,
            y: 0.0
        }
    ];
};