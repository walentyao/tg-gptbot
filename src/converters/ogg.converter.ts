import axios from 'axios'
import ffmpeg from 'fluent-ffmpeg'
import installer from '@ffmpeg-installer/ffmpeg'
import { createWriteStream } from 'fs'
import { dirname, resolve } from 'path'

class OggConverter {
    constructor() {
        ffmpeg.setFfmpegPath(installer.path)
    }

    toMp3(input:string, output:string) {
        try {
            const outputPath = resolve(dirname(input), `${output}.mp3`)
            return new Promise<string>((resolve, reject) => {
                ffmpeg(input)
                    .inputOption('-t 30')
                    .output(outputPath)
                    .on('end', () => resolve(outputPath))
                    .on('error', (err) => reject(err.message))
                    .run()
            })
        } catch (e:any) {
            console.log('Error while creating mp3', e.message)
        }
    }

    async create(url:string, filename:string) {
        try {
            const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`)
            const response = await axios({
                method: 'get',
                url,
                responseType: 'stream',
            })
            return new Promise<string>((resolve) => {
                const stream = createWriteStream(oggPath)
                response.data.pipe(stream)
                stream.on('finish', () => resolve(oggPath))
            })
        } catch (e:any) {
            console.log('Error while creating ogg', e.message)
        }
    }
}

export const ogg = new OggConverter()