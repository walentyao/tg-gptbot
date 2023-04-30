import {Schema, model, Types} from 'mongoose';
import { IChat} from "./chat.model";
export interface IUser{
    firstname:string;
    username:string;
    telegramId:string;
    chats:Types.DocumentArray<IChat>
}

const schema = new Schema<IUser>({
    firstname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    telegramId: { type: String, required: true, unique: true },
    chats:[{type:Schema.Types.ObjectId, ref:'Chat'}]
});

export const UserModel = model('User', schema);