import {Command} from "./command.class";
import {Markup, Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";
import {ChatModel} from "../database/chat.model";
import {UserModel} from "../database/user.model";
import {code} from "telegraf/format";
import {databaseService} from "../database/database.service";

export class ListChatCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.command("listchat", async (ctx) => {
            try {
                const chats = await databaseService.findChatsByIdUser(ctx.update.message.from.id.toString());
                if (chats.length > 1) {
                    const buttons = chats.map((chat) => {
                        const chatName = chat.messages.length > 0 ? chat.messages[0].content : "Без названия";
                        return Markup.button.callback(`${chatName}`, `selectedchat:${chat._id}`);
                    });
                    const keyboard = Markup.inlineKeyboard(buttons.map((element) => [element]))
                    ctx.reply("Список чатов:",
                        keyboard
                    )
                } else ctx.reply(code("У вас пока только один чат"));
            } catch (e: any) {
                console.log("Error listchat command", e.message);
                await ctx.reply(code("Что-то на сервере барахлит =("));
            }

        });
        this.bot.action(/selectedchat:.*/, async (ctx) => {
            try {
                // @ts-ignore
                const data = ctx.update.callback_query.data as string;
                const chatId = data.split(':')[1];
                const chat = await databaseService.findChatById(chatId);
                if (chat) {
                    if (chat.messages.length > 0){
                        await ctx.editMessageText(`Чат: ${chat.messages[0].content}`)
                        for (let message of chat.messages) {
                            if (message.role === "user")
                                await ctx.reply(message.content)
                            else await ctx.reply(code(message.content))
                        }
                    }else await ctx.editMessageText("Чат: Без названия");
                    ctx.session = {
                        messages: chat.messages,
                        chatId: chat._id.toString()
                    }
                    await ctx.reply(code("Жду вопроса =)"));
                }
            } catch (e: any) {
                console.log("Error listchat command", e.message);
                await ctx.editMessageText("Что-то на сервере барахлит =(");
            }
        })
    }
}