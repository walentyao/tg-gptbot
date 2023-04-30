import {Command} from "./command.class";
import {Context, Telegraf} from "telegraf";
import {Markup} from 'telegraf';
import {IBotContext} from "../context/context.interface";
import {IUser, UserModel} from "../database/user.model";
import {ChatModel} from "../database/chat.model";
import {code} from "telegraf/format";
export class StartCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        try {
            this.bot.start(async (ctx) => {
                const user = {
                    firstname: ctx.update.message.from.first_name,
                    telegramId: ctx.update.message.from.id.toString(),
                    username: ctx.update.message.from.username
                } as IUser;

                const findUser = await UserModel.findOne({username: user.username});

                if (findUser) {
                    const newChat = await ChatModel.create({messages: []});
                    newChat.save();
                    ctx.session = {
                      messages:newChat.messages,
                      chatId:newChat.id
                    };
                    findUser.chats.push(newChat);
                    findUser.save();
                } else {
                    const newUser = await UserModel.create(user);
                    const newChat = await ChatModel.create({messages: []});
                    newChat.save();
                    ctx.session = {
                        messages:newChat.messages,
                        chatId:newChat.id
                    };
                    newUser.chats.push(newChat);
                    newUser.save();
                }

                await ctx.reply(code('Жду вашего голосового или текстового сообщения :)'));

            });


        } catch (e: any) {
            console.log("Error start handler");
        }
    }
}