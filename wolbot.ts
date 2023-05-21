import { createBot, Intents, sendMessage, startBot } from "https://deno.land/x/discordeno@18.0.1/mod.ts";

const config: {
    token: string;
    channels: {
        channelId: string;
        mac: string;
    }[];
} = JSON.parse(new TextDecoder("utf8").decode(Deno.readFileSync("./config.json")));

const bot = createBot({
    token: config.token,
    intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
    events: {
        ready() {
            console.log("ready");
        },
        messageCreate(_bot, message) {
            if (message.content != "!wol") return;

            const channelId = message.channelId.toString();
            for (const channel of config.channels) {
                if (channel.channelId == channelId) {
                    Deno.run({
                        cmd: ["/usr/bin/wol", channel.mac],
                    });
                    sendMessage(bot, message.channelId, {
                        content: "Starting the computer...",
                    });
                    return;
                }
            }
        },
    },
});

await startBot(bot);
