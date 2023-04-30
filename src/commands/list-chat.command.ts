import {Command} from "./command.class";
import {Markup, Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";
import {ChatModel} from "../database/chat.model";
import {UserModel} from "../database/user.model";
import {message} from "telegraf/filters";
import {code} from "telegraf/format";
import {log} from "util";

export class ListChatCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.command("listchat", async (ctx) => {
            try {
                const user = await UserModel.findOne({username: ctx.from.username}).populate("chats");
                if (user) {
                    const buttons = user.chats.map((chat) => {
                        return Markup.button.callback(`${chat.messages[0]?.content ?? "Без названия"}`, `selectedchat:${chat._id}`);
                    });
                    const keyboard = Markup.inlineKeyboard(buttons.map((element) => [element]))
                    ctx.reply("Список чатов:",
                        keyboard
                    )
                }
            }
            catch (e:any) {
                console.log("Error listchat command", e.message);
                await ctx.reply(code("Что-то на сервере барахлит =("));
            }

        });
        this.bot.action(/selectedchat:.*/, async (ctx) => {
            try {
                // @ts-ignore
                const data = ctx.update.callback_query.data as string;
                const chatId = data.split(':')[1];
                const chat = await ChatModel.findById(chatId);
                if (chat) {
                    ctx.editMessageText(`Чат \n:${chat.messages[0].content}`)
                    chat.messages.forEach((message) => {
                        if (message.role === "user")
                            ctx.reply(message.content)
                        else ctx.reply(code(message.content))
                    });
                    ctx.session = {
                        messages: chat.messages,
                        chatId: chat._id.toString()
                    }
                }
            } catch (e:any) {
                console.log("Error listchat command", e.message);
                await ctx.editMessageText("Что-то на сервере барахлит =(");
            }
        })
    }
}