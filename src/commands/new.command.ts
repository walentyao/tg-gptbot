import {Command} from "./command.class";
import {Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";

import {code} from "telegraf/format";
import {databaseService} from "../database/database.service";

export class NewCommand extends Command {

    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.command("new", async (ctx) => {

            const user = await databaseService.findUserById(ctx.update.message.from.id.toString());

            if (user) {
                const newChat = await databaseService.createChat(user.telegramId);
                if (newChat)
                    ctx.session = {
                        messages: newChat.messages,
                        chatId: newChat._id.toString()
                    };
            }
            ctx.reply(code("Жду вопроса :)"))
        });
    }
}