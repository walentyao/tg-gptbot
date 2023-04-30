import {Command} from "./command.class";
import {Telegraf} from "telegraf";
import {IBotContext} from "../context/context.interface";
import {ChatModel} from "../database/chat.model";

export class DebugCommand extends Command{

    constructor(bot:Telegraf<IBotContext>) {
        super(bot);
    }
    handle(): void {
        this.bot.hears("/debug",async (ctx)=>{
            const chat = await ChatModel.find();
            console.log(chat)
        });
    }
}