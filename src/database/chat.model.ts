import {Schema, model, Types} from 'mongoose';
import {IUser} from "./user.model";

export enum RoleMessage {
    System = "system",
    User = "user",
    Assistant = "assistant"
}

export interface IMessage {
    role: RoleMessage;
    content: string;
}


export interface IChat {
    messages: Array<IMessage>;
    userId:Types.ObjectId;
}

const schema = new Schema<IChat>({
    messages:[],
    userId:{type:Schema.Types.ObjectId, ref:'User'}
});

export const ChatModel = model('Chat', schema);