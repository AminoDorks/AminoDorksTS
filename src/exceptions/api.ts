export interface ApiErrorData {
  message: string;
  name?: string;
}

export class AminoDorksAPIError extends Error {
    public readonly code: number;

    constructor(code: number, data: ApiErrorData) {
        super(data.message);
        this.name = data.name || `AminoDorksAPIError.${code}`;
        this.code = code;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AminoDorksAPIError);
        }
    }

    static get(code: number): AminoDorksAPIError | null {
        const data = AminoDorksAPIError.errors[code];

        return data ? new AminoDorksAPIError(code, data) : null;
    }

    static throw(code: number): never {
        const error = this.get(code);
        if (error) throw error;

        throw new AminoDorksAPIError(code, { message: `Unknown error code: ${code}.` });
    }

    static readonly errors: Record<number, ApiErrorData> = {
        1: {
            message: 'JSON body parse error.',
            name: 'AminoDorksError.JsonParseError',
        },
        100: {
            message: 'Unsupported service. Your client may be out of date. Please update it to the latest version.',
            name: 'AminoDorksError.UnsupportedService',
        },
        102: {
            message: 'File too large.',
            name: 'AminoDorksError.FileTooLarge'
        },
        103: {
            message: 'Invalid Request. Please update to the latest version. If the problem continues, please contact us.',
            name: 'AminoDorksError.InvalidRequest',
        },
        104: {
            message: 'Invalid Request. Please update to the latest version. If the problem continues, please contact us.',
            name: 'AminoDorksError.InvalidRequest',
        },
        105: {
            message: 'Invalid session.',
            name: 'AminoDorksError.InvalidSession',
        },
        106: {
            message: 'Access denied.',
            name: 'AminoDorksError.AccessDenied',
        },
        107: {
            message: 'The requested data does not exist.',
            name: 'AminoDorksError.UnexistentData',
        },
        110: {
            message: 'Action not allowed.',
            name: 'AminoDorksError.ActionNotAllowed',
        },
        111: {
            message: 'Sorry, this service is under maintenance. Please check back later.',
            name: 'AminoDorksError.ServiceUnderMaintenance',
        },
        113: {
            message: 'Be more specific, please.',
            name: 'AminoDorksError.MessageNeeded',
        },
        200: {
            message: 'Invalid account or password.',
            name: 'AminoDorksError.InvalidAccountOrPassword',
        },
        203: {
            message: 'Login with your Google account failed. Please try again or log in with your email.',
            name: 'AminoDorksError.GoogleLoginFailed',
        },
        207: {
            message: 'Account email update is not allowed.',
            name: 'AminoDorksError.EmailUpdateNotAllowed',
        },
        208: {
            message: 'Google account disconnect is not allowed.',
            name: 'AminoDorksError.GoogleDisconnectNotAllowed',
        },
        210: {
            message: 'This account is disabled.',
            name: 'AminoDorksError.AccountDisabled',
        },
        213: {
            message: 'Invalid email address.',
            name: 'AminoDorksError.InvalidEmail',
        },
        214: {
            message: 'Invalid password. Password must be 6 characters or more and contain no spaces.',
            name: 'AminoDorksError.InvalidPassword',
        },
        215: {
            message: 'This email is already taken or not supported.',
            name: 'AminoDorksError.EmailAlreadyTaken',
        },
        216: {
            message: 'Account does not exist.',
            name: 'AminoDorksError.AccountDoesntExist',
        },
        218: {
            message: 'Error! Your device is currently not supported, or the app is out of date. Please update to the latest version.',
            name: 'AminoDorksError.InvalidDevice',
        },
        219: {
            message: 'A maximum of 3 accounts can be created from this device or too many requests. Try again later.',
            name: 'AminoDorksError.AccountLimitReached',
        },
        221: {
            message: 'You cant follow yourself.',
            name: 'AminoDorksError.CantFollowYourself',
        },
        225: {
            message: 'This user is unavailable.',
            name: 'AminoDorksError.UserUnavailable',
        },
        229: {
            message: 'You are banned.',
            name: 'AminoDorksError.YouAreBanned',
        },
        230: {
            message: 'You have to join this Community first.',
            name: 'AminoDorksError.UserNotMemberOfCommunity',
        },
        235: {
            message: 'Request rejected. You have been temporarily muted (read only mode) because you have received a strike. To learn more, please check the Help Center.',
            name: 'AminoDorksError.RequestRejected',
        },
        238: {
            message: 'Please activate your account first. Check your email, including your spam folder.',
            name: 'AminoDorksError.ActivateAccount',
        },
        239: {
            message: 'Sorry, you can not do this before transferring your Agent status to another member.',
            name: 'AminoDorksError.CantLeaveCommunity',
        },
        240: {
            message: 'Sorry, the max length of members title is limited to 20.',
            name: 'AminoDorksError.ReachedTitleLength',
        },
        241: {
            message: 'This email provider has been flagged for use in spamming.',
            name: 'AminoDorksError.InvalidEmailProvider',
        },
        246: {
            message: 'Account has been deleted.',
            name: 'AminoDorksError.AccountDeleted',
        },
        251: {
            message: 'Email has no password set.',
            name: 'AminoDorksError.ApiErrEmailNoPassword',
        },
        257: {
            message: 'Community creation requires verification.',
            name: 'AminoDorksError.ApiErrCommunityUserCreatedCommunitiesVerify',
        },
        262: {
            message: 'You can only add up to 20 Titles. Please choose the most relevant ones.',
            name: 'AminoDorksError.ReachedMaxTitles',
        },
        270: {
            message: 'Verification Required.',
            name: 'AminoDorksError.VerificationRequired',
        },
        271: {
            message: 'Invalid authentication for new device link.',
            name: 'AminoDorksError.ApiErrInvalidAuthNewDeviceLink',
        },
        291: {
            message: 'Whoa there! Youve done too much too quickly. Take a break and try again later.',
            name: 'AminoDorksError.CommandCooldown',
        },
        293: {
            message: 'Sorry, this user has been banned by Team Amino.',
            name: 'AminoDorksError.UserBannedByTeamAmino',
        },
        300: {
            message: 'Invalid or corrupted image.',
            name: 'AminoDorksError.BadImage',
        },
        313: {
            message: 'Invalid theme pack.',
            name: 'AminoDorksError.InvalidThemepack',
        },
        314: {
            message: 'Invalid voice note.',
            name: 'AminoDorksError.InvalidVoiceNote',
        },
        403: {
            message: 'Forbidden.',
            name: 'AminoDorksError.Forbidden',
        },
        429: {
            message: 'Too many requests. Please try again later.',
            name: 'AminoDorksError.TooManyRequests',
        },
        500: {
            message: 'Sorry, the requested data no longer exists. Try refreshing the view.',
            name: 'AminoDorksError.RequestedNoLongerExists',
        },
        700: {
            message: 'Sorry, the requested data no longer exists. Try refreshing the view.',
            name: 'AminoDorksError.RequestedNoLongerExists',
        },
        1600: {
            message: 'Sorry, the requested data no longer exists. Try refreshing the view.',
            name: 'AminoDorksError.RequestedNoLongerExists',
        },
        503: {
            message: 'Sorry, you have reported this page too recently.',
            name: 'AminoDorksError.PageRepostedTooRecently',
        },
        551: {
            message: 'This post type is restricted to members with a higher level.',
            name: 'AminoDorksError.InsufficientLevel',
        },
        702: {
            message: 'This member has disabled commenting on their wall.',
            name: 'AminoDorksError.WallCommentingDisabled',
        },
        801: {
            message: 'This Community no longer exists.',
            name: 'AminoDorksError.CommunityNoLongerExists',
        },
        802: {
            message: 'Sorry, this code or link is invalid.',
            name: 'AminoDorksError.InvalidCodeOrLink',
        },
        805: {
            message: 'Community name is already taken.',
            name: 'AminoDorksError.CommunityNameAlreadyTaken',
        },
        806: {
            message: 'You have reached the limit for community creation.',
            name: 'AminoDorksError.CommunityCreateLimitReached',
        },
        811: {
            message: 'Media crop out of range.',
            name: 'AminoDorksError.MediaCropOutOfRange',
        },
        814: {
            message: 'This Community is disabled.',
            name: 'AminoDorksError.CommunityDisabled',
        },
        833: {
            message: 'This Community has been deleted.',
            name: 'AminoDorksError.CommunityDeleted',
        },
        1501: {
            message: 'Sorry, you have duplicate poll options.',
            name: 'AminoDorksError.DuplicatePollOption',
        },
        1507: {
            message: 'Sorry, you can only join or add up to 5 of your items per poll.',
            name: 'AminoDorksError.ReachedMaxPollOptions',
        },
        1602: {
            message: 'Sorry, you can only have up to 1000 chat sessions.',
            name: 'AminoDorksError.TooManyChats',
        },
        1605: {
            message: 'Chat is full.',
            name: 'AminoDorksError.ChatFull',
        },
        1606: {
            message: 'Sorry, you can only invite up to 999 people.',
            name: 'AminoDorksError.TooManyInviteUsers',
        },
        1611: {
            message: 'This user has disabled chat invite requests.',
            name: 'AminoDorksError.ChatInvitesDisabled',
        },
        1612: {
            message: 'Youve been removed from this chatroom.',
            name: 'AminoDorksError.RemovedFromChat',
        },
        1613: {
            message: 'Sorry, this user has not joined.',
            name: 'AminoDorksError.UserNotJoined',
        },
        1627: {
            message: 'No more reputations available for voice chat.',
            name: 'AminoDorksError.ApiErrChatVvchatNoMoreReputations',
        },
        1628: {
            message: 'Sorry, you cannot pick this member.',
            name: 'AminoDorksError.CannotPickMember',
        },
        1637: {
            message: 'This member was previously kicked by the organizer and cannot be reinvited.',
            name: 'AminoDorksError.MemberKickedByOrganizer',
        },
        1661: {
            message: 'Level 5 or higher is required to enable props.',
            name: 'AminoDorksError.LevelFiveRequiredToEnableProps',
        },
        1663: {
            message: 'Chat is in view-only mode.',
            name: 'AminoDorksError.ChatViewOnly',
        },
        1664: {
            message: 'Chat message is too big.',
            name: 'AminoDorksError.ChatMessageTooBig'
        },
        1900: {
            message: 'Sorry, the requested data no longer exists. Try refreshing the view.',
            name: 'AminoDorksError.InviteCodeNotFound',
        },
        2001: {
            message: 'Sorry, you have already submitted a membership request.',
            name: 'AminoDorksError.AlreadyRequestedJoinCommunity',
        },
        2501: {
            message: 'Push server limitation: apart.',
            name: 'AminoDorksError.ApiErrPushServerLimitationApart',
        },
        2502: {
            message: 'Push server limitation: count.',
            name: 'AminoDorksError.ApiErrPushServerLimitationCount',
        },
        2503: {
            message: 'Push server link is not in community.',
            name: 'AminoDorksError.ApiErrPushServerLinkNotInCommunity',
        },
        2504: {
            message: 'Push server limitation: time.',
            name: 'AminoDorksError.ApiErrPushServerLimitationTime',
        },
        2601: {
            message: 'Sorry, you cant check in any more.',
            name: 'AminoDorksError.AlreadyCheckedIn',
        },
        2611: {
            message: 'Monthly repair already used.',
            name: 'AminoDorksError.AlreadyUsedMonthlyRepair',
        },
        2800: {
            message: 'Account already restored.',
            name: 'AminoDorksError.AccountAlreadyRestored',
        },
        3102: {
            message: 'Incorrect verification code.',
            name: 'AminoDorksError.IncorrectVerificationCode',
        },
        3905: {
            message: 'You are not the owner of this chat bubble.',
            name: 'AminoDorksError.NotOwnerOfChatBubble',
        },
        4300: {
            message: 'Not enough coins.',
            name: 'AminoDorksError.NotEnoughCoins',
        },
        4400: {
            message: 'You have played the maximum number of lucky draws.',
            name: 'AminoDorksError.AlreadyPlayedLottery',
        },
        4500: {
            message: 'Cannot send coins.',
            name: 'AminoDorksError.CannotSendCoins',
        },
        4501: {
            message: 'Cannot send coins.',
            name: 'AminoDorksError.CannotSendCoins',
        },
        6001: {
            message: 'Amino ID cannot be changed after you set it.',
            name: 'AminoDorksError.AminoIDAlreadyChanged',
        },
        6002: {
            message: 'Invalid Amino ID.',
            name: 'AminoDorksError.InvalidAminoID',
        },
        11001: {
            message: 'Invalid Request. Please update to the latest version. If the problem continues, please contact us.',
            name: 'AminoDorksError.InvalidRequest',
        },
        11102: {
            message: 'Invalid Request. Please update to the latest version. If the problem continues, please contact us.',
            name: 'AminoDorksError.InvalidRequest',
        },
        99001: {
            message: 'Sorry, the name is invalid.',
            name: 'AminoDorksError.InvalidName',
        },
    };
};