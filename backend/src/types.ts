import {GetCommandOutput, QueryCommandOutput, UpdateCommandOutput} from "@aws-sdk/lib-dynamodb";

declare global {
    namespace Express {
        interface Request {
            subject: string
        }
    }
}

export type IQueryCommandOutput<T> = Omit<QueryCommandOutput, "Items"> & {
    Items?: T;
};

export type IGetCommandOutput<T> = Omit<GetCommandOutput, "Item"> & {
    Item?: T;
};

export type IUpdateCommandOutput<T> = Omit<UpdateCommandOutput, "Attributes"> & {
    Attributes?: T;
};