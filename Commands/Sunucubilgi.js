const { MessageEmbed } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");

// module.exports.onLoad = (client) => {}
module.exports.execute = (client, message, args, ayar, emoji) => {
  let ekipRolu = ayar.ekipRolu || undefined;
  let boosterRolu = ayar.boosterRolu || undefined;
  const embed = new MessageEmbed().setTimestamp().setColor(client.randomColor()).setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true })).setFooter("YASHINU ❤️ ALOSHA")
  .setDescription(`**Toplam Üye:** ${message.guild.memberCount}\n**Aktif Üye:** ${message.guild.members.cache.filter(u => u.presence.status != "offline").size}\n**Kanallar:** ${message.guild.channels.cache.size} (${message.guild.channels.cache.filter(c => c.type === "text").size} yazı, ${message.guild.channels.cache.filter(c => c.type === "voice").size} yazı)\n**Roller:** ${message.guild.roles.cache.size}\n**Oluşturulma Tarihi:** ${moment(message.guild.createdAt).format('DD/MM/YYYY HH.mm.ss')}`);
  message.channel.send(embed);
};

module.exports.configuration = {
    name: "sunucubilgi",
    aliases: [],
    usage: "sunucubilgi",
    description: "Sunucu bilgi."
};