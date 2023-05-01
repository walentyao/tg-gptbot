import {IUser, UserModel} from "./user.model";
import {ChatModel, IChat} from "./chat.model";
import {Types} from "mongoose";

class DatabaseService {
    async findUserById(telegramId: string) {
        const user = await UserModel.findOne({telegramId});
        return user ? user : undefined;
    }

    async findChatsByIdUser(telegramId: string) {
        const user = await UserModel.findOne({telegramId});
        if (user) {
            const chats = await ChatModel.find({userId: user._id});
            return chats ? chats : [];
        }
        return [];
    }

    async findChatById(chatId: string) {
        const chat = await ChatModel.findOne({_id: chatId});
        return chat ? chat : undefined;
    }

    async createUser(user: IUser) {
        const createdUser = await UserModel.create(user);
        createdUser.save();
        return createdUser;
    }

    async createChat(telegramId: string) {
        const user = await this.findUserById(telegramId);
        if (user) {
            const chat = await ChatModel.create({messages: [], userId: user._id});
            chat.save();
            return chat;
        } else return undefined;
    }

    async deleteChat(chatId: string) {
        const chat = await ChatModel.findByIdAndDelete(chatId);
        return chat ? chat : undefined;
    }
}

export const databaseService = new DatabaseService();