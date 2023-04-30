import {Command} from "./command.class";
import {Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";
import {IUser, UserModel} from "../database/user.model";
import {ChatModel} from "../database/chat.model";
import {code} from "telegraf/format";

export class NewCommand extends Command{

    constructor(bot:Telegraf<IBotContext>) {
        super(bot);
    }
    handle(): void {
        this.bot.command("new",async (ctx)=>{
            const user = {
                firstname: ctx.update.message.from.first_name,
                telegramId: ctx.update.message.from.id.toString(),
                username: ctx.update.message.from.username
            } as IUser;

            const findUser = await UserModel.findOne({username: user.username});

            if (findUser) {
                const newChat = await ChatModel.create({messages: []});
                newChat.save();
                console.log(newChat.messages)
                ctx.session = {
                    messages:newChat.messages,
                    chatId:newChat.id
                };
                findUser.chats.push(newChat);
                findUser.save();
            }
            ctx.reply(code("Жду вопроса :)"))
        });
    }
}