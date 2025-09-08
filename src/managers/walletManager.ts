import { APIManager } from '../interfaces/manager';
import { HttpWorkflow } from '../core/httpworkflow';
import { MayUndefined, Safe } from '../private';
import { EnviromentContext, StartSize } from '../public';
import { GetWalletHistoryResponse, GetWalletHistoryResponseSchema, GetWalletResponse, GetWalletResponseSchema } from '../schemas/responses/global';
import { Wallet } from '../schemas/aminoapps/wallet';
import { Transaction } from '../schemas/aminoapps/transaction';
import { BasicResponse, BasicResponseSchema } from '../schemas/responses/basic';
import { generateTransactionId } from '../utils/crypt';
import { LOGGER } from '../utils/logger';
import { PlayLotteryResponse, PlayLotteryResponseSchema } from '../schemas/responses/ndc';
import { getTimezone } from '../utils/utils';

export class WalletManager implements APIManager {
    endpoint: Safe<string> = '/g/s';

    private readonly __ndcId: MayUndefined<number>;
    private readonly __httpWorkflow: HttpWorkflow;

    constructor(context: EnviromentContext, httpWorkflow: HttpWorkflow) {
        if (context.ndcId) this.endpoint = `/x${context.ndcId}/s`;
        this.__ndcId = context.ndcId;
        this.__httpWorkflow = httpWorkflow;
    };

    public get = async (): Promise<Wallet> => {
        return (await this.__httpWorkflow.sendGet<GetWalletResponse>({
            path: '/g/s/wallet'
        }, GetWalletResponseSchema)).wallet;
    };

    public history = async (startSize: StartSize = { start: 0, size: 25 }): Promise<Transaction[]> => {
        return (await this.__httpWorkflow.sendGet<GetWalletHistoryResponse>({
            path: `/g/s/wallet/coin/history?start=${startSize.start}&size=${startSize.size}`
        }, GetWalletHistoryResponseSchema)).coinHistoryList;
    };

    public tipCoinsBlog = async (coins: Safe<number>, blogId: Safe<number>): Promise<BasicResponse> => {
        if (!this.__ndcId) LOGGER.fatal('ndcId is not defined. Use .as to set ndcId.');

        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/blog/${blogId}/tipping`,
            body: JSON.stringify({
                coins: Math.abs(coins),
                tippingContext: {transactionId: generateTransactionId()},
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public tipCoinsChatThread = async (coins: Safe<number>, threadId: Safe<number>): Promise<BasicResponse> => {
        if (!this.__ndcId) LOGGER.fatal('ndcId is not defined. Use .as to set ndcId.');

        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/chat/thread/${threadId}/tipping`,
            body: JSON.stringify({
                coins: Math.abs(coins),
                tippingContext: {transactionId: generateTransactionId()},
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public playLottery = async (): Promise<BasicResponse> => {
        if (!this.__ndcId) LOGGER.fatal('ndcId is not defined. Use .as to set ndcId.');

        return await this.__httpWorkflow.sendPost<PlayLotteryResponse>({
            path: `${this.endpoint}/check-in/lottery`,
            body: JSON.stringify({
                timezone: getTimezone(),
                timestamp: Date.now()
            })
        }, PlayLotteryResponseSchema);
    };

    public purchaseFrame = async (frameId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/store/purchase`,
            body: JSON.stringify({
                objectId: frameId,
                objectType: 122,
                v: 1,
                paymentContext: {
                    discountStatus: 0,
                    isAutoRenew: false
                },
                timestamp: Date.now(),
            })
        }, BasicResponseSchema);
    };
};