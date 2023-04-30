import {Context} from "telegraf";
import {ChatCompletionRequestMessage} from "openai/dist/api";

interface ISessionMessage{
    role:string;
    content:string;
}
export interface SessionData {
    chatId:string;
    messages: Array<ISessionMessage>;
}

export interface IBotContext extends Context {
    session: SessionData
}