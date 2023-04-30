import {Command} from "./command.class";
import {Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";
import {message} from "telegraf/filters";
import { processTextToChat} from "../logic/logic";
import {code} from "telegraf/format";

export class TextHandler extends Command{

    constructor(bot:Telegraf<IBotContext>) {
        super(bot);
    }
    handle(): void {
        this.bot.on(message("text"),async (ctx) => {
            try {
                await ctx.reply(code('Сообщение принял. Жду ответ от сервера...'))
                await processTextToChat(ctx, ctx.message.text)
            } catch (e:any) {
                console.log(`Error while voice message`, e.message)
            }
        });
    }
}