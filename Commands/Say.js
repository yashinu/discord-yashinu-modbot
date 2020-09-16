const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");

// module.exports.onLoad = (client) => {}
module.exports.execute = (client, message, args, ayar, emoji) => {
  let ekipRolu = ayar.ekipRolu || undefined;
  let boosterRolu = ayar.boosterRolu || undefined;
  const embed = new MessageEmbed().setTimestamp().setColor(client.randomColor()).setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setFooter("YASHINU ❤️ ALOSHA");
  message.channel.send(embed.setDescription(`**Toplam Üye ・** ${client.emojiSayi(`${message.guild.memberCount}`)}\n**Aktif Üye ・** ${client.emojiSayi(`${message.guild.members.cache.filter(u => u.presence.status != "offline").size}`)}\n**Taglı Üye ・** ${client.emojiSayi(`${message.guild.roles.cache.get(ekipRolu).members.size}`) || "Ayarlanmamış"}\n**Booster Üye ・** ${client.emojiSayi(`${message.guild.roles.cache.get(boosterRolu).members.size}`) || "Ayarlanmamış"}\n**Sesteki Üye ・** ${client.emojiSayi(`${message.guild.channels.cache.filter(channel => channel.type == "voice").map(channel => channel.members.size).reduce((a, b) => a + b)}`)}`));
};

module.exports.configuration = {
    name: "say",
    aliases: ["count","yoklama"],
    usage: "say",
    description: "Sunucu sayımı."
};