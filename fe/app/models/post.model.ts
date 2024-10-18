export interface Post {
    id: string;
    title: string;
}

export interface Meta {
    totalCount: number;
}

export interface PostResponseData {
    posts: {
        data: Post[];
        meta: Meta;
    };
}