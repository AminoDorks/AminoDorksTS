// Basic

export const BASE_URL = 'https://service.aminoapps.com';
export const GENERATORS_URL = 'https://aminodorks.agency';

export const USER_AGENT = 'Dalvik/2.1.0 (Linux; U; Android 10; M2006C3MNG Build/QP1A.190711.020;com.narvii.amino.master/4.3.3121)';
export const ACCEPT_LANGUAGE = 'ru-RU';
export const EMPTY_BODY = '';
export const CACHE_FILENAME = 'cache.json';
export const INVITE_CODE_DEFAULT_DURATION = 259200;
export const ONLINE_DEFAULT_DURATION = 86400;
export const WEBSOCKET_RECONNECT_TIME = 450000;
export const CURRENT_VERSION = '2.17.24';
export const TELEGRAM_URL = 'https://t.me/aminodorks';

// Structures

export const CRYPTO_KEYS = {
    PREFIX: Uint8Array.from(Buffer.from('52', 'hex')),
    SIGNATURE_KEY: Uint8Array.from(Buffer.from('EAB4F1B9E3340CD1631EDE3B587CC3EBEDF1AFA9', 'hex')),
    DEVICE_ID_KEY: Uint8Array.from(Buffer.from('AE49550458D8E7C51D566916B04888BFB8B3CA7D', 'hex')),
    DEVICE_LENGTH: 20
};

export const UTC: number[] = [
  -60, -120, -180, -240, -300, -360, -420, -480, -540, -600, 660, 720, 660, 600,
  540, 480, 420, 360, 300, 240, 180, 120, 60, 0,
];

export const API_HEADERS = {
    'Accept-Language': ACCEPT_LANGUAGE,
    'Host': 'service.aminoapps.com',
    'User-Agent': USER_AGENT,
    'CONNECTION': 'Keep-Alive',
    'NDCLANG': 'ru',
    'Content-Type': 'application/json; charset=utf8',
    'Accept': '*/*'
};

export const GENERATORS_HEADERS = {
    'Content-Type': 'application/json; charset=utf8',
    'CONNECTION': 'Keep-Alive'
};

export const WEBSOCKET_HEADERS = {
    'Accept-Encoding': 'gzip',
    'Accept-Language': ACCEPT_LANGUAGE,
    'User-Agent': USER_AGENT,
    'Connection': 'Upgrade'
};

export const SOCKET_TOPICS = {
    '1000_0': 'message',
    '1000_1': 'strike',
    '1000_100': 'deleteMessage',
    '1000_101': 'memberJoin',
    '1000_102': 'memberLeave',
    '1000_103': 'chatInvite',
    '1000_104': 'backgroundChange',
    '1000_105': 'titleChange',
    '1000_106': 'thumbnailChange',
    '1000_107': 'voiceChat',
    '1000_108': 'videoChat',
    '1000_110': 'voiceChatEnd',
    '1000_111': 'videoChatEnd',
    '1000_113': 'contentChange',
    '1000_114': 'screenRoomStart',
    '1000_115': 'screenRoomEnd',
    '1000_116': 'hostTransfer',
    '1000_118': 'removeMessage',
    '1000_119': 'modRemoveMessage',
    '1000_120': 'tip',
    '1000_121': 'pinAnnounce',
    '1000_125': 'viewOnly',
    '1000_126': 'viewOnlyEnd',
    '1000_127': 'unpinAnnounce',
    '1000_128': 'tipsEnable',
    '1000_129': 'tipsDisable'
};