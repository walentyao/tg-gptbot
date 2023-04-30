import {ConfigService} from "./config/config.service";
import {IConfigService} from "./config/config.interface";
import {Telegraf} from "telegraf";
import {IBotContext} from "./context/context.interface";
import {Command} from "./commands/command.class";
import {StartCommand} from "./commands/start.command";
import LocalSession from "telegraf-session-local";
import {NewCommand} from "./commands/new.command";
import {TextHandler} from "./commands/text.handler";
import {VoiceHandler} from "./commands/voice.handler";
import mongoose from "mongoose";
import {DebugCommand} from "./commands/debug.command";
import {ListChatCommand} from "./commands/list-chat.command";
import {DeleteChatCommand} from "./commands/delete-chat.command";

class Bot {
    bot: Telegraf<IBotContext>;
    commands: Command[] = [];

    constructor(private readonly configService: IConfigService) {
        this.bot = new Telegraf<IBotContext>(this.configService.get("TG_TOKEN"));
        this.bot.use(new LocalSession({database: "sessions.json"}).middleware());
    }

    async init() {
        try {
            await mongoose.connect(this.configService.get("MONGODB_URI"));
            this.commands = [new StartCommand(this.bot),new ListChatCommand(this.bot), new NewCommand(this.bot),new DeleteChatCommand(this.bot), new TextHandler(this.bot), new VoiceHandler(this.bot)];
            for (const command of this.commands) {
                command.handle();
            }
            console.log("Bot started");
            await this.bot.launch();
        } catch (e: any) {
            console.log("Bot failed ", e.message);
        }
    }
}

const bot = new Bot(new ConfigService());
bot.init();