<div align="center">
    <h1>AminoDorksTS</h1>
    <a href="https://t.me/aminodorks"><img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram"></a>
    <a href="https://www.npmjs.com/package/amino.dorks"><img src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt="NPM"></a>
</div>
<div align="center">
    <img src="https://img.shields.io/npm/dm/amino.dorks" alt="Downloads">
    <img src="https://img.shields.io/npm/v/amino.dorks.svg" alt="Version">
    <h2>AminoDorksTS is a TypeScript library that interacts with the AminoApps API.</h2>
</div>

##[README on English](https://github.com/thatcelt/AminoDorksTS/blob/master/README.MD)
##[README на Русском](https://github.com/thatcelt/AminoDorksTS/blob/master/README.RU.MD)

## Table of Contents
-----------------

* [Features](#features)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [API Documentation](#api-documentation)
* [Contributing](#contributing)
* [License](#license)

## Features
--------

AminoDorks contains a many features as a library for AminoApps, for example
* So much methods to interacting with API
* Generation of special signature from Android with KeyStore bypassing
* Non-limited requests rate limit for signatures generation
* Huge priority for creating user bots for stressing
* Supporting of so much types with API interacting
* Huge cache system for your accounts
* [Fully open source code of server-side](https://github.com/thatcelt/dorks_api)

## Getting Started
---------------

To get started with AminoDorks, follow these steps:
1. Initialize npm package: `npm init`
2. Install TypeScript: `npm i -g typescript`
3. Initialize TypeScript config and configure it: `tsc --init`
4. Install package via npm: `npm i amino.dorks`
5. Get your individual API_KEY from our [Telegram Bot](https://t.me/aminodorks_bot)

## Usage
-----
### Basic authorization

```typescript
import { AminoDorks } from 'amino.dorks';

(async () => {
    const aminoDorks = new AminoDorks({
        apiKey: 'API_KEY',
        context: {
            enviroment: 'global'
        }
    });
    const response = await aminoDorks.security.login('email@example.com', 'password');
    console.log(`Logged in ${response.userProfile.nickname}`);
})();
```

### Actions in other communities

```typescript
import { AminoDorks } from 'amino.dorks';

(async () => {
    const aminoDorks = new AminoDorks({
        apiKey: 'API_KEY',
        context: {
            enviroment: 'global'
        }
    });
    await aminoDorks.security.login('email@example.com', 'password');
    
    const ndc = aminoDorks.as('NDC_ID') // now we can use this instance for interacting with community
    await ndc.playLottery() // for example, for play lottery to get some coins
})();
```

### Setup with websockets

```typescript
import { AminoDorks } from 'amino.dorks';
import { MessageEvent } from 'amino.dorks/dist/schemas';

(async () => {
    const aminoDorks = new AminoDorks({
        apiKey: 'API_KEY',
        context: {
            enviroment: 'global'
        }
    });
    await aminoDorks.security.login('email@example.com', 'password');
    
    // setup on start of socket
    aminoDorks.socket.on(async () => {
        // do something
    });

    // setup on message
    aminoDorks.socket.on('message', async (ndc: AminoDorks, message: MessageEvent ) => {
        // do something
    });
})();
```

## Documentation
-----------------

### 1. `AminoDorks(config: AminoDorksConfig)`
A main class to interacting with API in global namespace of app.
config - configuration for library, you can find it in `AminoDorksConfig` type...
`AminoDorksConfig` =>
*    apiKey - API_KEY from [Telegram Bot](https://t.me/aminodorks_bot),
*    context - context for library, you can find it in `EnviromentContext` type,
*    ndcId - default ndc id, if you want to use another ndc id, you can use `as` method,
*    enableLogging - enable logging for library, default value is `false`,
*    deviceId - default device id,
*    proxies - array of proxies, socks4 or socks5, default value is `[]`,

#### AminoDorks Properties

1. `AminoDorks.account: Account` - Your user profile information after authorization
2. `AminoDorks.security: SecurityManager` - Manager for authorization methods and account information
3. `AminoDorks.community: CommunityManager` - Manager for community methods
4. `AminoDorks.wallet: WalletManager` - Manager for wallet methods
5. `AminoDorks.user: UserManager` - Manager for user methods
6. `AminoDorks.post: PostManager` - Manager for post methods
7. `AminoDorks.thread: ThreadManager` - Manager for chat thread methods
8. `AminoDorks.admin: AdminManager` - Manager for admin methods
9. `AminoDorks.acm: ACMManager` - Manager for ACM methods
10. `AminoDorks.socket: SocketWorkflow` - Manager for socket methods

#### AminoDorks Methods

1. `uploadMedia(file: Safe<Buffer>, type: Safe<MediaType>): Promise<UploadMediaResponse>` - Method for uploading media

2. `getLinkResolution(link: string): Promise<LinkInfo>` - Method for getting link resolution

3. `getCommunityResolution(link: Safe<string>): Promise<Community>` - Method for getting community resolution

4. `getElapsedRealtime(): Promise<string>` - Method for getting elapsed realtime. Needs for sockets

5. `as(ndcId: number): AminoDorks` - Method for using another community

-----------------

### 2. `SecurityManager`
Security manager for authorization methods and account information

#### SecurityManager Methods

1. `getAccount(): Promise<MayUndefined<User>>` - Method for getting account information

2. `login(email: Safe<string>, password: Safe<string>, loginType: Safe<number> = 100): Promise<LoginResponse>` - Method for logging in

3. `loginPhone(phone: Safe<string>, password: Safe<string>, loginType: Safe<number> = 100): Promise<LoginResponse>` - Method for logging in with phone number

4. `loginWithSession(sessionId: Safe<string>, deviceId: Safe<string>): Promise<MayUndefined<BasicResponse>>` - Method for logging in with session id

5. `register(token: Safe<string>, password: Safe<string>, nickname: Safe<string>, deviceId?: Safe<string>): Promise<BasicResponse>` - Method for registering account

6. `checkAccountExist(token: Safe<string>, deviceId?: Safe<string>): Promise<BasicResponse>` - Method for checking account existence

7. `requestSecurityValidation(email: Safe<string>): Promise<BasicResponse>` - Method for requesting security validation code

8. `checkSecurityValidation(email: Safe<string>, code: Safe<string>): Promise<BasicResponse>` - Method for checking security validation code

9. `updateEmail(builder: UpdateEmailBuilder): Promise<BasicResponse>` - Method for updating email

10. `deleteAccount(email: Safe<string>, password: Safe<string>): Promise<BasicResponse>` - Method for deleting account

11. `disconnectGoogle(password: Safe<string>): Promise<BasicResponse>` - Method for disconnecting Google account

### 3. `CommunityManager`
Community manager for community methods

#### CommunityManager Methods

1. `get(ndcId: Safe<number>): Promise<Community>` - Method for getting community information

2. `getMany(startSize: StartSize = { start: 0, size: 25 }): Promise<Community[]>` - Method for getting communities information

3. `search(title: Safe<string>): Promise<SearchCommunityResponse>` - Method for searching communities

4. `join(ndcId: Safe<number>): Promise<BasicResponse>` - Method for joining community

5. `leave(ndcId: Safe<number>): Promise<BasicResponse>` - Method for leaving community

6. `sendMembershipRequest(ndcId: Safe<number>, message?: Safe<string>): Promise<BasicResponse>` - Method for sending membership request

7. `identifyInvitation(inviteCode: Safe<string>): Promise<IdentifyInvitationResponse>` - Method for identifying invitation

8. `getInviteCodes(startSize: StartSize): Promise<InviteCode[]>` - Method for retrieving a list of active invite codes for the current community. Requires leader or curator permissions.

9. `createInviteCode(duration: Safe<number> = INVITE_CODE_DEFAULT_DURATION): Promise<InviteCode>` - Method for creating a new invite code for the community. The `duration` parameter specifies the validity period in seconds (default defined by `INVITE_CODE_DEFAULT_DURATION`). Available only to community leaders and curators.

10. `deleteInviteCode(invitationId: Safe<string>): Promise<BasicResponse>` - Method for deleting an existing invite code by its ID. Requires appropriate administrative privileges within the community.

11. `status(online: Safe<boolean>, duration: Safe<number> = ONLINE_DEFAULT_DURATION): Promise<BasicResponse>` - Method for updating the user's online status in the community. Sets the user as online or offline for the specified duration (in seconds, default defined by `ONLINE_DEFAULT_DURATION`).

12. `sendTimeChunks(timers: Timers): Promise<BasicResponse>` - Method for submitting user activity time chunks to the server for analytics and engagement tracking. Includes timezone information and supports batch sending of active time periods.

### 3. `WalletManager`
Wallet manager for wallet methods

#### WalletManager Methods

1. `get(): Promise<Wallet>` - Method for retrieving the current user's wallet information, including coin balance, amino balance, and transaction limits.

2. `history(startSize: StartSize = { start: 0, size: 25 }): Promise<Transaction[]>` - Method for fetching the user's coin transaction history. Returns a paginated list of transactions with details such as amount, type, and timestamp.

3. `tipCoinsBlog(coins: Safe<number>, blogId: Safe<number>): Promise<BasicResponse>` - Method for sending a coin tip to a blog post. The `coins` amount is deducted from the user's wallet, and a unique transaction ID is generated. Requires a valid `ndcId`.

4. `tipCoinsChatThread(coins: Safe<number>, threadId: Safe<number>): Promise<BasicResponse>` - Method for sending a coin tip in a chat thread. Tips are used to show appreciation to chat members. Requires a valid `ndcId`.

5. `playLottery(): Promise<BasicResponse>` - Method for participating in the daily lottery. Can be used once per day and may reward the user with coins. Requires a valid `ndcId` and community context.

6. `purchaseFrame(frameId: Safe<string>): Promise<BasicResponse>` - Method for purchasing a profile frame using coins. The `frameId` corresponds to the frame's ID in the store. The purchase is made from the user's main wallet balance.

### 4. `UserManager`
User manager for user methods

#### UserManager Methods

1. `get(userId: Safe<string>): Promise<User>` - Method for retrieving detailed profile information of a specific user by their user ID.

2. `getMany(startSize: StartSize = { start: 0, size: 50 }, usersType: UsersType = 'recent'): Promise<User[]>` - Method for fetching a list of users within the current community, filtered by type (e.g., recent, banned, leaders). Supports pagination via `startSize`.

3. `getInOnline(startSize: StartSize = { start: 0, size: 50 }): Promise<User[]>` - Method for retrieving users currently online in the community. Requires a valid `ndcId` to identify the community.

4. `getThreadUsers(threadId: Safe<string>, startSize: StartSize = { start: 0, size: 100 }): Promise<User[]>` - Method for fetching the list of users (members) in a specific chat thread. Returns a paginated list of user profiles.

5. `edit(builder: EditProfileBuilder): Promise<BasicResponse>` - Method for editing the current user's profile using an `EditProfileBuilder`. Allows updating nickname, avatar, bio, background media, and background color.

6. `applyFrame(frameId: Safe<string>, applyToAll: Safe<boolean> = false): Promise<BasicResponse>` - Method for applying a purchased avatar frame to the user’s profile. If `applyToAll` is true, the frame will be applied across all communities.

7. `kick(userId: Safe<string>, threadId: Safe<string>, allowRejoin: Safe<boolean> = false): Promise<BasicResponse>` - Method for removing a user from a chat thread. The `allowRejoin` flag determines whether the user can rejoin the thread without an invite.

8. `getFollowing(userId: Safe<string>, startSize: StartSize = { start: 0, size: 25 }): Promise<User[]>` - Method for retrieving the list of users that the specified user is following.

9. `getFollowers(userId: Safe<string>, startSize: StartSize = { start: 0, size: 25 }): Promise<User[]>` - Method for retrieving the list of users following the specified user.

10. `getWallComments(userId: Safe<string>, sorting: CommentsSorting = 'newest', startSize: StartSize = { start: 0, size: 25 }): Promise<Comment[]>` - Method for fetching comments posted on a user's wall.

11. `follow(userId: Safe<string>): Promise<BasicResponse>` - Method for following a user. Increases the follower count of the target user if successful.

12. `followMany(userIds: Safe<string[]>): Promise<BasicResponse>` - Method for following multiple users in a single request. Accepts an array of user IDs.

13. `unfollow(userId: Safe<string>): Promise<BasicResponse>` - Method for unfollowing a user. Removes the current user from the target user's followers list.

14. `sendComment(userId: Safe<string>, content: Safe<string>, respondTo?: Safe<string>): Promise<BasicResponse>` - Method for posting a comment on a user's wall. Optionally, the comment can be a reply to another comment by providing the `respondTo` ID.

### 5. `PostManager`
Post manager for post methods

#### PostManager Methods

1. `getBlog(blogId: Safe<string>): Promise<Blog>` - Method for retrieving detailed information about a specific blog post by its ID, including content, author, and metadata.

2. `getWiki(itemId: Safe<string>): Promise<Item>` - Method for retrieving a specific wiki item (knowledge base article) by its ID, including title, content, icon, and associated media.

3. `blog(builder: BlogBuilder): Promise<Blog>` - Method for creating a new blog post in the current community. The post is built using a `BlogBuilder` and may include text, media, background color, and fans-only visibility.

4. `wiki(builder: WikiBuilder): Promise<Item>` - Method for creating a new wiki item in the community. Supports rich content, keywords, media, and optional fans-only access.

5. `deleteBlog(blogId: Safe<string>): Promise<BasicResponse>` - Method for deleting a blog post authored by the current user. Requires appropriate permissions.

6. `deleteWiki(itemId: Safe<string>): Promise<BasicResponse>` - Method for deleting a wiki item. Only allowed for the item owner or community leaders.

7. `userBlogs(userId: Safe<string>, startSize: StartSize = { start: 0, size: 25 }): Promise<Blog[]>` - Method for fetching a list of blog posts created by a specific user. Supports pagination.

8. `userWikis(userId: Safe<string>, startSize: StartSize = { start: 0, size: 25 }): Promise<Item[]>` - Method for retrieving all wiki items created by a specific user within the community.

9. `manyBlogs(startSize: StartSize = { start: 0, size: 25 }): Promise<PublicBlogsResponse>` - Method for fetching a paginated list of recent public blog posts from the community feed.

10. `pagedBlogs(pageToken: Safe<string>, size: Safe<number> = 25): Promise<PublicBlogsResponse>` - Method for retrieving blog posts using a page token for cursor-based pagination. Used for infinite scroll and feed navigation.

11. `sendComment(objectId: Safe<string>, postType: Safe<PostType>, content: Safe<string>, respondTo?: Safe<string>): Promise<BasicResponse>` - Method for posting a comment on a blog or wiki. The `postType` specifies the content type (e.g., blog, item). Optionally reply to an existing comment via `respondTo`.

12. `likeManyBlogs(blogIds: Safe<string[]>): Promise<BasicResponse>` - Method for liking multiple blog posts in a single request. Each like contributes to the post's engagement count.

### 6. `ThreadManager`
Thread manager for thread methods

#### ThreadManager Methods

1. `get(threadId: Safe<string>): Promise<Thread>` - Method for retrieving detailed information about a specific chat thread by its ID, including title, members, and settings.

2. `getMany(startSize: StartSize = { start: 0, size: 25 }): Promise<Thread[]>` - Method for fetching a list of chat threads the current user is a member of. Supports pagination.

3. `getManyPublic(startSize: StartSize = { start: 0, size: 25 }, threadType: ThreadType = 'recommended'): Promise<Thread[]>` - Method for retrieving public chat threads in the community, filtered by type (e.g., recommended, trending). Supports pagination.

4. `join(threadId: Safe<string>): Promise<BasicResponse>` - Method for joining an open chat thread. Requires no invitation for public threads.

5. `leave(threadId: Safe<string>): Promise<BasicResponse>` - Method for leaving a chat thread. Removes the user from the member list.

6. `create(builder: CreateThreadBuilder): Promise<Thread>` - Method for creating a new chat thread. The builder configures parameters such as title, members, and visibility.

7. `edit(threadId: Safe<string>, builder: EditThreadBuilder): Promise<Thread>` - Method for editing chat thread properties including title, content, icon, keywords, and announcement settings.

8. `setBackground(threadId: Safe<string>, url: Safe<string>): Promise<BasicResponse>` - Method for setting a custom background image for the chat thread for the current user.

9. `addCoHosts(threadId: Safe<string>, coHosts: Safe<string[]>): Promise<BasicResponse>` - Method for promoting one or more members to co-hosts, granting them moderation privileges in the thread.

10. `setViewOnly(threadId: Safe<string>, status: Status): Promise<BasicResponse>` - Method for enabling or disabling view-only mode in the chat. When enabled, only hosts and co-hosts can send messages.

11. `setCanInvite(threadId: Safe<string>, status: Status): Promise<BasicResponse>` - Method for allowing or restricting members from inviting others to the chat.

12. `setCanTip(threadId: Safe<string>, status: Status): Promise<BasicResponse>` - Method for enabling or disabling the ability for members to send coin tips in the chat.

13. `invite(threadId: Safe<string>, userIds: Safe<string[]>): Promise<BasicResponse>` - Method for inviting users to join a chat thread. Requires appropriate permissions.

14. `messages(threadId: Safe<string>, size: Safe<number> = 25): Promise<MessagesResponse>` - Method for retrieving the latest messages from a chat thread using size-based pagination.

15. `pagedMessages(threadId: Safe<string>, pageToken: Safe<string>, size: Safe<number> = 25): Promise<MessagesResponse>` - Method for retrieving older messages using a page token for cursor-based navigation (e.g., infinite scroll).

16. `sendMessage(threadId: Safe<string>, content: Safe<string>, settings: MessageSettings = { messageType: 0 }): Promise<BasicResponse>` - Method for sending a plain text message to a chat. Supports replies, mentions, and custom message types.

17. `sendEmbed(threadId: Safe<string>, content: Safe<string>, embed: Embed, settings: MessageSettings = { messageType: 0 }): Promise<BasicResponse>` - Method for sending a message with an embedded object. The embed displays a rich preview.

18. `sendLinkSnippet(threadId: Safe<string>, content: Safe<string>, linkSnippet: LinkSnippet, settings: MessageSettings = { messageType: 0 }): Promise<BasicResponse>` - Method for sending a message with a link preview (title, image, description). The snippet is generated from the provided URL and media.

19. `sendImage(threadId: Safe<string>, file: Safe<Buffer>): Promise<BasicResponse>` - Method for sending an image to the chat. The image must be provided as a Buffer and is encoded in base64.

20. `sendAudio(threadId: Safe<string>, file: Safe<Buffer>): Promise<BasicResponse>` - Method for sending a voice message or audio clip to the chat. The audio file must be a Buffer and is sent in base64 format.

21. `deleteMessage(threadId: Safe<string>, messageId: Safe<string>): Promise<BasicResponse>` - Method for deleting a message from the chat. Only available to the message author or thread hosts.

22. `transferHost(threadId: Safe<string>, userIds: Safe<string[]>): Promise<BasicResponse>` - Method for initiating a host transfer to one or more users. The recipients must accept the request.

23. `acceptHost(threadId: Safe<string>, requestId: Safe<string>): Promise<BasicResponse>` - Method for accepting a host transfer request in a chat thread.

24. `inviteToVoice(threadId: Safe<string>, userId: Safe<string>): Promise<BasicResponse>` - Method for inviting a user to join the ongoing voice chat (AV chat) in the thread.

### 7. `AdminManager`
Admin manager for admin methods

#### AdminManager Methods

1. `ban(userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse>` - Method for banning a user from the community. An optional reason can be provided and will be visible in moderation logs.

2. `unban(userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse>` - Method for lifting a ban from a user, allowing them to rejoin the community. An optional reason can be included.

3. `hideUser(userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse>` - Method for hiding a user's profile and content from public view (shadowban). The user remains in the community but is restricted in visibility.

4. `unhideUser(userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse>` - Method for restoring a hidden user's profile and content to public visibility.

5. `hideThread(threadId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse>` - Method for hiding a chat thread from public view. The thread becomes inaccessible to non-staff members.

6. `unhideThread(threadId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse>` - Method for unhiding a previously hidden chat thread, restoring its visibility to members.

7. `hidePost(objectId: Safe<string>, postType: PostType, reason?: Safe<string>): Promise<BasicResponse>` - Method for hiding a blog or wiki post. The content is removed from public feeds but remains accessible to staff.

8. `unhidePost(objectId: Safe<string>, postType: PostType, reason?: Safe<string>): Promise<BasicResponse>` - Method for unhiding a previously hidden blog or wiki post, restoring its public visibility.

9. `addFeature(userId: Safe<string>, days: FeatureDuration = 1): Promise<BasicResponse>` - Method for featuring a user on the community's leader list for a specified number of days (default: 1). The duration is automatically converted to seconds.

10. `deleteFeature(userId: Safe<string>): Promise<BasicResponse>` - Method for removing a user from the featured list, reverting their profile to non-featured status.

11. `manageTitles(userId: Safe<string>, titles: Safe<CustomTitle[]>): Promise<BasicResponse>` - Method for assigning or updating custom titles and colors for a user. Accepts an array of title objects with label and color values.

12. `warn(userId: Safe<string>, title: Safe<string>, content: Safe<string>): Promise<BasicResponse>` - Method for sending a warning notice to a user. The notice appears in their inbox and may include a title and detailed message.

13. `strike(userId: Safe<string>, title: Safe<string>, content: Safe<string>, duration: Safe<number> = 86400): Promise<BasicResponse>` - Method for issuing a strike with a time-based penalty. The user may face restrictions (e.g., chat ban) for the specified duration in seconds (default: 24 hours).

### 8. `ACMManager`
Manager for ACM methods

#### ACMManager Methods

1. `setEndpoint(enpoint: Safe<string>): Promise<BasicResponse>` - Method for updating the community's endpoint (domain path). This changes the community's URL identifier. Requires full leadership privileges.

2. `icon(icon: Safe<string>, width: Safe<number>, height: Safe<number>): Promise<BasicResponse>` - Method for changing the community's icon (logo). The image URL must be pre-uploaded, and dimensions must be specified to generate proper media credentials.

3. `media(media: Safe<string>): Promise<BasicResponse>` - Method for setting or updating the community's promotional media (banner). The media URL should point to an uploaded image resource.

4. `name(name: Safe<string>): Promise<BasicResponse>` - Method for renaming the community. Updates the displayed name visible to all members.

5. `tagline(tagline: Safe<string>): Promise<BasicResponse>` - Method for setting or updating the community's tagline (short description) that appears under the name in community listings.

6. `content(content: Safe<string>): Promise<BasicResponse>` - Method for updating the community's full description or about section. Supports rich text formatting where applicable.

7. `giveCuratorship(userId: Safe<string>): Promise<BasicResponse>` - Method for granting curator status to a user. Curators have limited moderation powers but cannot change core community settings.

8. `giveLeadership(userId: Safe<string>): Promise<BasicResponse>` - Method for promoting a user to community leader. Leaders have full administrative access, including the ability to manage staff, settings, and ownership.

### 8. SocketsWorkflow
Specified class for interacting with AminoDorks via Sockets and catching events and commands

#### SocketsWorkflow Methods

1. `open(callback: () => void): void` - Registers a callback function that executes when the WebSocket connection is successfully opened. Logs connection status.

2. `error(callback: (error: Error) => void): void` - Registers a callback to handle WebSocket errors. The provided function is called with the error object whenever a connection or communication error occurs.

3. `close(callback: (code: number) => void): void` - Registers a callback that triggers when the WebSocket connection is closed. Receives the close status code and logs the event.

4. `on<T extends EventName>(eventName: T, callback: (ndc: AminoDorks, data: EventMap[T]) => Promise<void>): void` - Subscribes to a specific WebSocket event (e.g., `chat-message`, `user-join`). The callback is executed whenever the event is received, with parsed data.

5. `command(commandName: Safe<string>, callback: CommandCallback): void` - Registers a command listener that triggers when a chat message starts with the specified command (e.g., `!help`). The callback receives the full message context.

6. `commandArgs(commandName: Safe<string>, callback: CommandArgsCallback): void` - Registers a command listener that parses and splits the message content after the command into an array of arguments. Each argument is wrapped in an `ArgImpl` object for easy handling.

7. `send(data: WebSocket.Data): void` - Sends raw data through the WebSocket connection. Logs the transmitted data for debugging purposes.

8. `joinVoiceThread(ndcId: number, threadId: string): Promise<void>` - Sends a WebSocket request to join a voice chat in the specified thread as a participant.

9. `joinVideoThread(ndcId: number, threadId: string): Promise<void>` - Sends a request to join a video chat in the specified thread with full participation rights.

10. `joinVideoThreadAsViewer(ndcId: number, threadId: string): Promise<void>` - Joins a video chat as a viewer (non-participant), allowing the user to watch without audio/video transmission.

11. `startVoiceChat(ndcId: number, threadId: string): Promise<void>` - Initiates a voice chat in the specified thread by joining the AV channel and starting the internal voice chat loop.

12. `endVoiceChat(ndcId: number, threadId: string): Promise<void>` - Ends an active voice chat by sending a leave signal and removing the thread from the active voice chat list.

13. `sendTyping(ndcId: number, threadId: string): Promise<void>` - Sends a "typing" indicator to the chat, simulating user input activity.

14. `sendRecording(ndcId: Safe<number>, threadId: Safe<string>): void` - Sends a "recording" indicator to show that the user is recording a voice message.

15. `sendEndRecording(ndcId: Safe<number>, threadId: Safe<string>, duration: Safe<number>): void` - Signals the end of a voice recording, including the duration of the recorded audio.

## Contributing
------------

Contributions are welcome! Please submit a pull request with your changes.

## License
-------

AminoDorksTS is licensed under the MIT License. See LICENSE for more information.
If you're will use my generators - write about it to my [DM](https://t.me/celt_is_god)
