import {Schema, model, Types} from 'mongoose';

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
}

const schema = new Schema<IChat>({
    messages:[]
});

export const ChatModel = model('Chat', schema);