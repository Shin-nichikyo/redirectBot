const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
app.use(express.json());

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once('ready', () => {
  console.log(`Bot起動完了: ${client.user.tag}`);
});

app.post('/speak', async (req, res) => {
  const { channelId, message } = req.body;
  if (!channelId || !message) return res.status(400).send('channelIdとmessageは必須です');

  try {
    const channel = await client.channels.fetch(channelId);
    await channel.send({ content: `/tts ${message}`, tts: false });
    res.send('TTS送信成功');
  } catch (err) {
    console.error(err);
    res.status(500).send('送信失敗');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`APIサーバー起動 on ${PORT}`));
