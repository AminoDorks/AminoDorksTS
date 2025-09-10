<div align="center">
    <h1>AminoDorksTS</h1>
    <a href="https://t.me/aminodorks"><img src="https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram"></a>
    <a href="https://www.npmjs.com/package/amino.dorks"><img src="https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white" alt="NPM"></a>
</div>
<div align="center">
    <img src="https://img.shields.io/npm/dm/amino.dorks" alt="Downloads">
    <img src="https://img.shields.io/npm/v/amino.dorks.svg" alt="Version">
    <h2>AminoDorksTS это библиотека на TypeScript для взаимодействия с API приложения Amino</h2>
</div>

##[README on English](https://github.com/thatcelt/AminoDorksTS/blob/master/README.MD)
##[README на Русском](https://github.com/thatcelt/AminoDorksTS/blob/master/README.RU.MD)

---

## Оглавление
-----------------

* [Особенности](#особенности)
* [Начало работы](#начало-работы)
* [Использование](#использование)
* [Документация](#документация)
* [Участие в разработке](#участие-в-разработке)
* [Лицензия](#лицензия)

## Особенности
--------

AminoDorks предоставляет множество возможностей как библиотека для AminoApps, например:
* Большое количество методов для взаимодействия с API
* Генерация специальной подписи с Android с обходом KeyStore
* Отсутствие ограничений скорости для генерации подписей
* Высокий приоритет для создания пользовательских ботов для нагрузочного тестирования
* Поддержка множества типов взаимодействия с API
* Обширная система кэширования аккаунтов
* [Полностью открытый исходный код серверной части](https://github.com/thatcelt/dorks_api)

## Начало работы
---------------

Чтобы начать работу с AminoDorks, выполните следующие шаги:
1. Инициализируйте npm-пакет: `npm init`
2. Установите TypeScript: `npm i -g typescript`
3. Инициализируйте и настройте конфигурацию TypeScript: `tsc --init`
4. Установите пакет через npm: `npm i amino.dorks`
5. Получите свой индивидуальный API_KEY у нашего [Telegram-бота](https://t.me/aminodorks_bot)

## Использование
-----

### Базовая авторизация

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

### Действия в других сообществах

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
    
    const ndc = aminoDorks.as('NDC_ID') // теперь можно использовать этот экземпляр для взаимодействия с сообществом
    await ndc.playLottery() // например, сыграть в лотерею и получить монеты
})();
```

### Настройка с использованием WebSocket

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
    
    // обработка при старте сокета
    aminoDorks.socket.on(async () => {
        // do something
    });

    // обработка сообщений
    aminoDorks.socket.on('message', async (ndc: AminoDorks, message: MessageEvent ) => {
        // do something
    });
})();
```

## Документация

### 1. `AminoDorks(config: AminoDorksConfig)`

Главный класс для взаимодействия с API в глобальном пространстве приложения.
config – конфигурация библиотеки, доступна в типе `AminoDorksConfig`...
`AminoDorksConfig` =>

* apiKey – API_KEY, полученный у [Telegram-бота](https://t.me/aminodorks_bot),
* context – контекст для библиотеки, можно найти в типе `EnviromentContext`,
* ndcId – ID сообщества по умолчанию, при необходимости можно использовать метод `as` для смены,
* enableLogging – включает логирование библиотеки (по умолчанию `false`),
* deviceId – ID устройства по умолчанию,
* proxies – массив прокси (socks4 или socks5), по умолчанию `[]`,

#### Свойства AminoDorks

1. `AminoDorks.account: Account` – информация о профиле пользователя после авторизации
2. `AminoDorks.security: SecurityManager` – менеджер авторизации и данных аккаунта
3. `AminoDorks.community: CommunityManager` – менеджер методов для сообществ
4. `AminoDorks.wallet: WalletManager` – менеджер методов кошелька
5. `AminoDorks.user: UserManager` – менеджер методов пользователей
6. `AminoDorks.post: PostManager` – менеджер методов постов
7. `AminoDorks.thread: ThreadManager` – менеджер методов чатов
8. `AminoDorks.admin: AdminManager` – менеджер методов администрирования
9. `AminoDorks.acm: ACMManager` – менеджер методов ACM
10. `AminoDorks.socket: SocketWorkflow` – менеджер работы с сокетами

#### Методы AminoDorks

1. `uploadMedia(file: Safe<Buffer>, type: Safe<MediaType>): Promise<UploadMediaResponse>` – загрузка медиафайлов
2. `getLinkResolution(link: string): Promise<LinkInfo>` – получение информации по ссылке
3. `getCommunityResolution(link: Safe<string>): Promise<Community>` – получение информации о сообществе по ссылке
4. `getElapsedRealtime(): Promise<string>` – получение времени работы (нужно для сокетов)
5. `as(ndcId: number): AminoDorks` – использование другого сообщества

### 2. `SecurityManager`
Менеджер безопасности для методов авторизации и информации об аккаунте

#### Методы SecurityManager

1. `getAccount(): Promise<MayUndefined<User>>` – получение информации об аккаунте  

2. `login(email: Safe<string>, password: Safe<string>, loginType: Safe<number> = 100): Promise<LoginResponse>` – вход по email и паролю  

3. `loginPhone(phone: Safe<string>, password: Safe<string>, loginType: Safe<number> = 100): Promise<LoginResponse>` – вход по номеру телефона  

4. `loginWithSession(sessionId: Safe<string>, deviceId: Safe<string>): Promise<MayUndefined<BasicResponse>>` – вход с использованием sessionId  

5. `register(token: Safe<string>, password: Safe<string>, nickname: Safe<string>, deviceId?: Safe<string>): Promise<BasicResponse>` – регистрация аккаунта  

6. `checkAccountExist(token: Safe<string>, deviceId?: Safe<string>): Promise<BasicResponse>` – проверка существования аккаунта  

7. `requestSecurityValidation(email: Safe<string>): Promise<BasicResponse>` – запрос кода подтверждения безопасности  

8. `checkSecurityValidation(email: Safe<string>, code: Safe<string>): Promise<BasicResponse>` – проверка кода подтверждения  

9. `updateEmail(builder: UpdateEmailBuilder): Promise<BasicResponse>` – обновление email  

10. `deleteAccount(email: Safe<string>, password: Safe<string>): Promise<BasicResponse>` – удаление аккаунта  

11. `disconnectGoogle(password: Safe<string>): Promise<BasicResponse>` – отвязка Google-аккаунта  

### 3. `CommunityManager`
Менеджер для работы с сообществами

#### Методы CommunityManager

1. `get(ndcId: Safe<number>): Promise<Community>` – получение информации о сообществе  

2. `getMany(startSize: StartSize = { start: 0, size: 25 }): Promise<Community[]>` – получение списка сообществ  

3. `search(title: Safe<string>): Promise<SearchCommunityResponse>` – поиск сообществ  

4. `join(ndcId: Safe<number>): Promise<BasicResponse>` – вступление в сообщество  

5. `leave(ndcId: Safe<number>): Promise<BasicResponse>` – выход из сообщества  

6. `sendMembershipRequest(ndcId: Safe<number>, message?: Safe<string>): Promise<BasicResponse>` – отправка запроса на вступление  

7. `identifyInvitation(inviteCode: Safe<string>): Promise<IdentifyInvitationResponse>` – проверка пригласительного кода  

8. `getInviteCodes(startSize: StartSize): Promise<InviteCode[]>` – получение списка активных инвайтов

9. `createInviteCode(duration: Safe<number> = INVITE_CODE_DEFAULT_DURATION): Promise<InviteCode>` – создание нового инвайта (только для лидеров и кураторов)  

10. `deleteInviteCode(invitationId: Safe<string>): Promise<BasicResponse>` – удаление инвайта по ID (нужны админские права)  

11. `status(online: Safe<boolean>, duration: Safe<number> = ONLINE_DEFAULT_DURATION): Promise<BasicResponse>` – обновление статуса «онлайн/оффлайн»  

12. `sendTimeChunks(timers: Timers): Promise<BasicResponse>` – отправка данных об активности пользователя

### 4. `WalletManager`
Менеджер для работы с кошельком

#### Методы WalletManager

1. `get(): Promise<Wallet>` – получение информации о кошельке пользователя (баланс монет, лимиты и пр.)  

2. `history(startSize: StartSize = { start: 0, size: 25 }): Promise<Transaction[]>` – история транзакций  

3. `tipCoinsBlog(coins: Safe<number>, blogId: Safe<number>): Promise<BasicResponse>` – отправка монет блогу  

4. `tipCoinsChatThread(coins: Safe<number>, threadId: Safe<number>): Promise<BasicResponse>` – отправка монет в чат  

5. `playLottery(): Promise<BasicResponse>` – участие в ежедневной лотерее

6. `purchaseFrame(frameId: Safe<string>): Promise<BasicResponse>` – покупка рамки для профиля за монеты  

### 5. `UserManager`
Менеджер для работы с пользователями

#### Методы UserManager

1. `get(userId: Safe<string>): Promise<User>` – получение информации о пользователе  

2. `getMany(startSize: StartSize = { start: 0, size: 50 }, usersType: UsersType = 'recent'): Promise<User[]>` – список пользователей в сообществе  

3. `getInOnline(startSize: StartSize = { start: 0, size: 50 }): Promise<User[]>` – список пользователей онлайн  

4. `getThreadUsers(threadId: Safe<string>, startSize: StartSize = { start: 0, size: 100 }): Promise<User[]>` – пользователи в чате  

5. `edit(builder: EditProfileBuilder): Promise<BasicResponse>` – редактирование профиля  

6. `applyFrame(frameId: Safe<string>, applyToAll: Safe<boolean> = false): Promise<BasicResponse>` – применение рамки аватара  

7. `kick(userId: Safe<string>, threadId: Safe<string>, allowRejoin: Safe<boolean> = false): Promise<BasicResponse>` – удаление пользователя из чата  

8. `getFollowing(userId: Safe<string>, startSize: StartSize = { start: 0, size: 25 }): Promise<User[]>` – список тех, на кого подписан пользователь  

9. `getFollowers(userId: Safe<string>, startSize: StartSize = { start: 0, size: 25 }): Promise<User[]>` – список подписчиков пользователя  

10. `getWallComments(userId: Safe<string>, sorting: CommentsSorting = 'newest', startSize: StartSize = { start: 0, size: 25 }): Promise<Comment[]>` – комментарии на стене пользователя  

11. `follow(userId: Safe<string>): Promise<BasicResponse>` – подписка на пользователя  

12. `followMany(userIds: Safe<string[]>): Promise<BasicResponse>` – массовая подписка на нескольких пользователей  

13. `unfollow(userId: Safe<string>): Promise<BasicResponse>` – отписка от пользователя  

14. `sendComment(userId: Safe<string>, content: Safe<string>, respondTo?: Safe<string>): Promise<BasicResponse>` – отправка комментария на стену пользователя

### 6. `PostManager`
Менеджер для работы с постами и вики

#### Методы PostManager

1. `getBlog(blogId: Safe<string>): Promise<Blog>` – получение информации о блоге по ID  

2. `getWiki(itemId: Safe<string>): Promise<Item>` – получение информации о вики-статье  

3. `blog(builder: BlogBuilder): Promise<Blog>` – создание нового блога  

4. `wiki(builder: WikiBuilder): Promise<Item>` – создание новой вики-статьи  

5. `deleteBlog(blogId: Safe<string>): Promise<BasicResponse>` – удаление блога (только автор или админ)  

6. `deleteWiki(itemId: Safe<string>): Promise<BasicResponse>` – удаление вики (только автор или лидер)  

7. `userBlogs(userId: Safe<string>, startSize: StartSize = { start: 0, size: 25 }): Promise<Blog[]>` – блоги пользователя  

8. `userWikis(userId: Safe<string>, startSize: StartSize = { start: 0, size: 25 }): Promise<Item[]>` – вики пользователя  

9. `manyBlogs(startSize: StartSize = { start: 0, size: 25 }): Promise<PublicBlogsResponse>` – список последних блогов сообщества  

10. `pagedBlogs(pageToken: Safe<string>, size: Safe<number> = 25): Promise<PublicBlogsResponse>` – постраничная загрузка блогов  

11. `sendComment(objectId: Safe<string>, postType: Safe<PostType>, content: Safe<string>, respondTo?: Safe<string>): Promise<BasicResponse>` – комментарий к блогу или вики  

12. `likeManyBlogs(blogIds: Safe<string[]>): Promise<BasicResponse>` – массовые лайки блогов  

### 7. `ThreadManager`
Менеджер для работы с чатами

#### Методы ThreadManager

1. `get(threadId: Safe<string>): Promise<Thread>` – информация о чате  

2. `getMany(startSize: StartSize = { start: 0, size: 25 }): Promise<Thread[]>` – список чатов, где состоит пользователь  

3. `getManyPublic(startSize: StartSize = { start: 0, size: 25 }, threadType: ThreadType = 'recommended'): Promise<Thread[]>` – публичные чаты (рекомендованные, трендовые и др.)  

4. `join(threadId: Safe<string>): Promise<BasicResponse>` – вступление в чат  

5. `leave(threadId: Safe<string>): Promise<BasicResponse>` – выход из чата  

6. `create(builder: CreateThreadBuilder): Promise<Thread>` – создание нового чата  

7. `edit(threadId: Safe<string>, builder: EditThreadBuilder): Promise<Thread>` – редактирование чата  

8. `setBackground(threadId: Safe<string>, url: Safe<string>): Promise<BasicResponse>` – установка фона чата  

9. `addCoHosts(threadId: Safe<string>, coHosts: Safe<string[]>): Promise<BasicResponse>` – назначение соведущих  

10. `setViewOnly(threadId: Safe<string>, status: Status): Promise<BasicResponse>` – включение режима «только просмотр»  

11. `setCanInvite(threadId: Safe<string>, status: Status): Promise<BasicResponse>` – разрешить/запретить приглашения  

12. `setCanTip(threadId: Safe<string>, status: Status): Promise<BasicResponse>` – включить/выключить отправку монет  

13. `invite(threadId: Safe<string>, userIds: Safe<string[]>): Promise<BasicResponse>` – приглашение пользователей в чат  

14. `messages(threadId: Safe<string>, size: Safe<number> = 25): Promise<MessagesResponse>` – последние сообщения  

15. `pagedMessages(threadId: Safe<string>, pageToken: Safe<string>, size: Safe<number> = 25): Promise<MessagesResponse>` – постраничная загрузка сообщений  

16. `sendMessage(threadId: Safe<string>, content: Safe<string>, settings: MessageSettings = { messageType: 0 }): Promise<BasicResponse>` – отправка текстового сообщения  

17. `sendEmbed(threadId: Safe<string>, content: Safe<string>, embed: Embed, settings: MessageSettings = { messageType: 0 }): Promise<BasicResponse>` – сообщение с embed  

18. `sendLinkSnippet(threadId: Safe<string>, content: Safe<string>, linkSnippet: LinkSnippet, settings: MessageSettings = { messageType: 0 }): Promise<BasicResponse>` – сообщение с предпросмотром ссылки  

19. `sendImage(threadId: Safe<string>, file: Safe<Buffer>): Promise<BasicResponse>` – отправка изображения  

20. `sendAudio(threadId: Safe<string>, file: Safe<Buffer>): Promise<BasicResponse>` – отправка аудио/голосового сообщения  

21. `deleteMessage(threadId: Safe<string>, messageId: Safe<string>): Promise<BasicResponse>` – удаление сообщения  

22. `transferHost(threadId: Safe<string>, userIds: Safe<string[]>): Promise<BasicResponse>` – передача хоста  

23. `acceptHost(threadId: Safe<string>, requestId: Safe<string>): Promise<BasicResponse>` – принятие хоста  

24. `inviteToVoice(threadId: Safe<string>, userId: Safe<string>): Promise<BasicResponse>` – приглашение в голосовой чат  

### 8. `AdminManager`
Менеджер для администрирования сообществ

#### Методы AdminManager

1. `ban(userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse>` – бан пользователя  

2. `unban(userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse>` – снятие бана  

3. `hideUser(userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse>` – скрыть профиль (теневой бан)  

4. `unhideUser(userId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse>` – восстановить профиль  

5. `hideThread(threadId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse>` – скрыть чат  

6. `unhideThread(threadId: Safe<string>, reason?: Safe<string>): Promise<BasicResponse>` – восстановить чат  

7. `hidePost(objectId: Safe<string>, postType: PostType, reason?: Safe<string>): Promise<BasicResponse>` – скрыть блог/вики  

8. `unhidePost(objectId: Safe<string>, postType: PostType, reason?: Safe<string>): Promise<BasicResponse>` – восстановить блог/вики  

9. `addFeature(userId: Safe<string>, days: FeatureDuration = 1): Promise<BasicResponse>` – выделить пользователя в списке лидеров  

10. `deleteFeature(userId: Safe<string>): Promise<BasicResponse>` – убрать из списка лидеров  

11. `manageTitles(userId: Safe<string>, titles: Safe<CustomTitle[]>): Promise<BasicResponse>` – задать кастомные тайтлы и цвета  

12. `warn(userId: Safe<string>, title: Safe<string>, content: Safe<string>): Promise<BasicResponse>` – отправить предупреждение  

13. `strike(userId: Safe<string>, title: Safe<string>, content: Safe<string>, duration: Safe<number> = 86400): Promise<BasicResponse>` – выдать страйк с ограничением на время  

### 9. `ACMManager`
Менеджер для управления сообществом (ACM)

#### Методы ACMManager

1. `setEndpoint(enpoint: Safe<string>): Promise<BasicResponse>` – смена адреса сообщества  

2. `icon(icon: Safe<string>, width: Safe<number>, height: Safe<number>): Promise<BasicResponse>` – смена иконки сообщества  

3. `media(media: Safe<string>): Promise<BasicResponse>` – смена баннера  

4. `name(name: Safe<string>): Promise<BasicResponse>` – смена названия  

5. `tagline(tagline: Safe<string>): Promise<BasicResponse>` – смена короткого описания  

6. `content(content: Safe<string>): Promise<BasicResponse>` – смена полного описания  

7. `giveCuratorship(userId: Safe<string>): Promise<BasicResponse>` – назначение куратора  

8. `giveLeadership(userId: Safe<string>): Promise<BasicResponse>` – назначение лидера  

### 10. `SocketsWorkflow`
Класс для работы с сокетами и обработки событий

#### Методы SocketsWorkflow

1. `open(callback: () => void): void` – обработчик при успешном подключении  

2. `error(callback: (error: Error) => void): void` – обработчик ошибок  

3. `close(callback: (code: number) => void): void` – обработчик закрытия соединения  

4. `on<T extends EventName>(eventName: T, callback: (ndc: AminoDorks, data: EventMap[T]) => Promise<void>): void` – подписка на событие  

5. `command(commandName: Safe<string>, callback: CommandCallback): void` – слушатель команды по префиксу  

6. `commandArgs(commandName: Safe<string>, callback: CommandArgsCallback): void` – слушатель команды с аргументами  

7. `send(data: WebSocket.Data): void` – отправка данных через сокет  

8. `joinVoiceThread(ndcId: number, threadId: string): Promise<void>` – присоединение к голосовому чату  

9. `joinVideoThread(ndcId: number, threadId: string): Promise<void>` – присоединение к видеочату  

10. `joinVideoThreadAsViewer(ndcId: number, threadId: string): Promise<void>` – присоединение как зритель  

11. `startVoiceChat(ndcId: number, threadId: string): Promise<void>` – запуск голосового чата  

12. `endVoiceChat(ndcId: number, threadId: string): Promise<void>` – завершение голосового чата  

13. `sendTyping(ndcId: number, threadId: string): Promise<void>` – отправка индикатора «печатает»  

14. `sendRecording(ndcId: Safe<number>, threadId: Safe<string>): void` – отправка индикатора «записывает аудио»  

15. `sendEndRecording(ndcId: Safe<number>, threadId: Safe<string>, duration: Safe<number>): void` – завершение записи аудио  

16. `sendNdcBrowsing(ndcId: Safe<number>, topicIds: Safe<number[]> = []): void` - отправка индикатора активности в сообществе (отображение в списке участников онлайн)

17. `sendNdcEnter(ndcId: Safe<number>): void` - индикатор входа в сообщество

18. `sendChatting(ndcId: Safe<number>, threadId: Safe<string>, topicIds: Safe<number[]> = []): void` - отправка индикатора активности в определённом чате (отображение в списке участников которые сидят в чате)

## Участие в разработке

Приветствуются любые улучшения! Пожалуйста, отправляйте pull request со своими изменениями.

## Лицензия

AminoDorksTS распространяется по лицензии MIT. См. LICENSE для подробностей.
Если вы используете мои генераторы – напишите мне в [личку](https://t.me/celt_is_god).