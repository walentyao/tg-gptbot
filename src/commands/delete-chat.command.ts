import {Command} from "./command.class";
import {Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";
import {ChatModel} from "../database/chat.model";
import {UserModel} from "../database/user.model";
import {code} from "telegraf/format";
import {databaseService} from "../database/database.service";

export class DeleteChatCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {

        this.bot.command("deletechat", async (ctx) => {
            try {
                if (ctx.session.chatId) {
                    const deletedChat = await databaseService.deleteChat(ctx.session.chatId);
                    const user = await databaseService.findUserById(ctx.update.message.from.id.toString());
                    if (user) {
                        const newChat = await databaseService.createChat(ctx.update.message.from.id.toString());
                        if (newChat)
                            ctx.session = {
                                messages: newChat.messages,
                                chatId: newChat._id.toString()
                            };
                    } else throw new Error("При удалении что-то пошло не так =(")
                    ctx.reply(code("Жду вашего запроса =)"))
                }
            } catch (e: any) {
                ctx.reply(code(e.message));
            }

        });
    }
}