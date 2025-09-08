import { SocksProxies } from 'fetch-socks';
import { UTC } from '../constants';

export const getTimezone = () => UTC[new Date().getUTCMinutes() % UTC.length];

export const formatMediaList = (rawMediaList: string[]) => rawMediaList.map((media) => [100, media, null]);

export const formatMedia = (media?: string) => media ? [[100, media, null]] : null;

export const convertProxy = (proxy: string): SocksProxies => {
    const [host, port] = proxy.slice(9).split(':');
    return {
        host,
        type: Number(proxy.slice(5, 6)) as 5 | 4,
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

export const getMediaCredentials = async (thumbnail: string) => {
    return [
        {
            height: 736.0,
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
            width: 413.6767883300781,
            x: 161.16159057617188,
            y: 0.0
        }
    ];
};