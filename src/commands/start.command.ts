import {Command} from "./command.class";
import { Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";

import {code} from "telegraf/format";
import {databaseService} from "../database/database.service";

export class StartCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        try {
            this.bot.start(async (ctx) => {

                const user = await databaseService.findUserById(ctx.update.message.from.id.toString())

                if (user) {
                    const newChat = await databaseService.createChat(ctx.update.message.from.id.toString());
                    if (newChat)
                        ctx.session = {
                            messages: newChat.messages,
                            chatId: newChat._id.toString()
                        };
                } else {
                    const newUser = await databaseService.createUser({
                        username: ctx.update.message.from.username,
                        telegramId: ctx.update.message.from.id.toString(),
                        firstname: ctx.update.message.from.first_name
                    });
                    const newChat = await databaseService.createChat(newUser.telegramId);
                    if (newChat)
                        ctx.session = {
                            messages: newChat.messages,
                            chatId: newChat._id.toString()
                        };
                }

                await ctx.reply(code('Жду вашего голосового или текстового сообщения :)'));

            });


        } catch (e: any) {
            console.log("Error start handler");
        }
    }
}