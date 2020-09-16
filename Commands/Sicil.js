const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const moment = require("moment");
require("moment-duration-format");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");

module.exports.execute = async(client, message, args, ayar, emoji) => {
  let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
  let uye = message.guild.member(kullanici);
  let sicil = kdb.get(`kullanici.${uye.id}.sicil`) || [];
  sicil = sicil.reverse();
  let listedPenal = sicil.length > 0 ? sicil.map((value, index) => `\`${index + 1}.\` **[${value.Tip}]** ${new Date(value.Zaman).toTurkishFormatDate()} tarihinde **${value.Sebep}** nedeniyle ${message.guild.members.cache.has(value.Yetkili) ? message.guild.members.cache.get(value.Yetkili) : value.Yetkili} tarafından cezalandırıldı.`).join("\n") : "Temiz!";
  client.splitEmbedWithDesc(`**${uye} Üyesinin Sicili**\n\n ${listedPenal}`,
                           {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
                           {name: "YASHINU ❤️ ALOSHA", icon: false},
                           {setColor: [client.randomColor()], setTimestamp: [Date.now()]}).then(list => {
    list.forEach(item => {
      message.channel.send(item);
    });
  });
};
module.exports.configuration = {
    name: "sicil",
    aliases: ["geçmiş"],
    usage: "sicil [üye]",
    description: "Belirtilen üyenin tüm sicilini gösterir."
};