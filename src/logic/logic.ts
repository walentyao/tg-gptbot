import {openai} from '../openai/openai'
import {IBotContext} from "../context/context.interface";
import {ChatCompletionRequestMessage} from "openai/dist/api";
import {ChatModel, RoleMessage} from "../database/chat.model";
import {code} from "telegraf/format";

export async function processTextToChat(ctx: IBotContext, content: string) {
    try {
        ctx.session.messages.push({role: RoleMessage.User, content});
        const chat = await ChatModel.findById(ctx.session.chatId);
        if (chat) {
            chat.messages.push({role: RoleMessage.User, content});
            const response = await openai.chat(ctx.session.messages as ChatCompletionRequestMessage[]);

            if (response) {
                ctx.session.messages.push({
                    role: RoleMessage.Assistant,
                    content: response.content,
                })
                chat.messages.push({
                    role: RoleMessage.Assistant,
                    content: response.content,
                });
                await ctx.reply(code(response.content))
            }

            chat.save();
        }

    } catch (e: any) {
        await ctx.reply(code("Что-то пошло не так на сервере =("))
        console.log('Error while processing text to gpt', e.message)
    }
}