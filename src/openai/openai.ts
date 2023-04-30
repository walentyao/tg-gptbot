import { Configuration, OpenAIApi} from 'openai'
import { createReadStream } from 'fs'
import {ChatCompletionRequestMessage} from "openai/dist/api";
import {ConfigService} from "../config/config.service";

class OpenAI {
    roles= {
        System: "system",
        User: "user",
        Assistant: "assistant"
    };
    private openai:OpenAIApi;

    constructor(apiKey:string) {
        const configuration = new Configuration({
            apiKey,
        })
        this.openai = new OpenAIApi(configuration)
    }

    async chat(messages:Array<ChatCompletionRequestMessage>) {
        try {
            const response = await this.openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages,
            })
            return response.data.choices[0].message
        } catch (e:any) {
            console.log('Error while gpt chat', e.message)
        }
    }

    async transcription(filepath:string) {
        try {
            // @ts-ignore
            const file = createReadStream(filepath) as File;
            const response = await this.openai.createTranscription(
                file,
                'whisper-1'
            )
            return response.data.text
        } catch (e:any) {
            console.log('Error while transcription', e.message)
        }
    }
}

export const openai = new OpenAI(new ConfigService().get("GPT_TOKEN"))