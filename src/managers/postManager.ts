import { APIManager } from '../interfaces/manager';
import { HttpWorkflow } from '../core/httpworkflow';
import { Safe } from '../private';
import { BlogResponse, BlogResponseSchema, BlogsResponse, BlogsResponseSchema, ItemResponse, ItemResponseSchema, ItemsResponse, ItemsResponseSchema, PublicBlogsResponse, PublicBlogsResponseSchema } from '../schemas/responses/ndc';
import { Blog } from '../schemas/aminoapps/blog';
import { Item } from '../schemas/aminoapps/item';
import { BlogBuilder, PostType, StartSize, WikiBuilder } from '../public';
import { formatMediaList } from '../utils/utils';
import { BasicResponse, BasicResponseSchema } from '../schemas/responses/basic';

export class PostManager implements APIManager {
    endpoint: Safe<string>;

    private readonly __httpWorkflow: HttpWorkflow;

    constructor(ndcId: Safe<number>, httpWorkflow: HttpWorkflow) {
        this.endpoint = `/x${ndcId}/s`;
        this.__httpWorkflow = httpWorkflow;
    };

    public getBlog = async (blogId: Safe<string>): Promise<Blog> => {
        return (await this.__httpWorkflow.sendGet<BlogResponse>({
            path: `${this.endpoint}/blog/${blogId}`
        }, BlogResponseSchema)).blog;
    };

    public getWiki = async (itemId: Safe<string>): Promise<Item> => {
        return (await this.__httpWorkflow.sendGet<ItemResponse>({
            path: `${this.endpoint}/item/${itemId}`
        }, ItemResponseSchema)).item;
    };

    public blog = async (builder: BlogBuilder): Promise<Blog> => {
        return (await this.__httpWorkflow.sendPost<BlogResponse>({
            path: `${this.endpoint}/blog`,
            body: JSON.stringify({
                content: builder.content,
                title: builder.label,
                latitude: 0,
                longitude: 0,
                eventSource: 'GlobalComposeMenu',
                timestamp: Date.now(),
                mediaList: formatMediaList(builder.mediaList || []),
                extensions: {
                    fansOnly: builder.fansOnly,
                    style: {
                        backgroundColor: builder.backgroundColor
                    }
                }
            })
        }, BlogResponseSchema)).blog;
    };

    public wiki = async (builder: WikiBuilder): Promise<Item> => {
        return (await this.__httpWorkflow.sendPost<ItemResponse>({
            path: `${this.endpoint}/item`,
            body: JSON.stringify({
                label: builder.label,
                content: builder.content,
                icon: builder.icon,
                eventSource: 'GlobalComposeMenu',
                timestamp: Date.now(),
                keywords: builder.keywords,
                mediaList: formatMediaList(builder.mediaList || []),
                extensions: {
                    fansOnly: builder.fansOnly,
                    style: {
                        backgroundColor: builder.backgroundColor
                    }
                }
            })
        }, ItemResponseSchema)).item;
    };

    public deleteBlog = async (blogId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `${this.endpoint}/blog/${blogId}`
        }, BasicResponseSchema);
    };

    public deleteWiki = async (itemId: Safe<string>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendDelete<BasicResponse>({
            path: `${this.endpoint}/item/${itemId}`
        }, BasicResponseSchema);
    };

    public userBlogs = async (userId: Safe<string>, startSize: StartSize = { start: 0, size: 25 }): Promise<Blog[]> => {
        return (await this.__httpWorkflow.sendGet<BlogsResponse>({
            path: `${this.endpoint}/blog?type=user&q=${userId}&start=${startSize.start}&size=${startSize.size}`
        }, BlogsResponseSchema)).blogList;
    };

    public userWikis = async (userId: Safe<string>, startSize: StartSize = { start: 0, size: 25 }): Promise<Item[]> => {
        return (await this.__httpWorkflow.sendGet<ItemsResponse>({
            path: `${this.endpoint}/item?type=user-all&start=${startSize.start}&size=${startSize.size}&cv=1.2&uid=${userId}`
        }, ItemsResponseSchema)).itemList;
    };

    public manyBlogs = async (startSize: StartSize = { start: 0, size: 25 }): Promise<PublicBlogsResponse> => {
        return await this.__httpWorkflow.sendGet<PublicBlogsResponse>({
            path: `${this.endpoint}/feed/blog-all?pagingType=t&start=${startSize.start}&size=${startSize.size}`
        }, PublicBlogsResponseSchema);
    };

    public pagedBlogs = async (pageToken: Safe<string>, size: Safe<number> = 25): Promise<PublicBlogsResponse> => {
        return await this.__httpWorkflow.sendGet<PublicBlogsResponse>({
            path: `${this.endpoint}/feed/blog-all?pagingType=t&pageToken=${pageToken}&size=${size}`
        }, PublicBlogsResponseSchema);
    };

    public sendComment = async (objectId: Safe<string>, postType: Safe<PostType>, content: Safe<string>, respondTo?: Safe<string>): Promise<BasicResponse> => {
        return this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/${postType}/${objectId}/comment`,
            body: JSON.stringify({
                content: content,
                type: 0,
                eventSource: 'PostDetailView',
                respondTo: respondTo,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };

    public likeManyBlogs = async (blogIds: Safe<string[]>): Promise<BasicResponse> => {
        return await this.__httpWorkflow.sendPost<BasicResponse>({
            path: `${this.endpoint}/feed/vote`,
            body: JSON.stringify({
                value: 4,
                targetIdList: blogIds,
                timestamp: Date.now()
            })
        }, BasicResponseSchema);
    };
};