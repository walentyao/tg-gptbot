import {Command} from "./command.class";
import {Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";
import {message} from "telegraf/filters";
import {processTextToChat} from "../logic/logic";
import {code} from "telegraf/format";
import {ogg} from "../converters/ogg.converter";
import {removeFile} from "../utils/utils";
import {openai} from "../openai/openai";

export class VoiceHandler extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.on(message('voice'), async (ctx) => {
            try {
                await ctx.reply(code('Сообщение принял. Жду ответ от сервера...'));
                const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id);
                const userId = String(ctx.message.from.id);
                const oggPath = await ogg.create(link.href, userId);
                if (oggPath){
                    const mp3Path = await ogg.toMp3(oggPath, userId);
                    if (mp3Path)
                    {
                        await removeFile(oggPath);

                        const text = await openai.transcription(mp3Path);

                        await removeFile(mp3Path);

                        if (text) {
                            await ctx.reply(code(`Ваш запрос: ${text}`))
                            await processTextToChat(ctx, text);
                        }
                    }
                }

            } catch (e: any) {
                console.log(`Error while voice message`, e.message)
            }
        });
    }
}