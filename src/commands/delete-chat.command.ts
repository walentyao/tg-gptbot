import {Command} from "./command.class";
import {Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";
import {ChatModel} from "../database/chat.model";
import {UserModel} from "../database/user.model";
import {code} from "telegraf/format";

export class DeleteChatCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.command("deletechat", async (ctx) => {
            if (ctx.session.chatId) {
                const deletedChat = await ChatModel.findByIdAndDelete(ctx.session.chatId);
                const user = await UserModel.findOne({username: ctx.from.username});
                console.log(user)
                const newChat = await ChatModel.create({messages: []});
                newChat.save();
                console.log(newChat.messages)
                ctx.session = {
                    messages: newChat.messages,
                    chatId: newChat.id
                };
                if (user) {
                    user.chats.push(newChat);
                    user.save();
                }
                ctx.reply(code("Жду вашего запроса =)"))
            }
        });
    }
}