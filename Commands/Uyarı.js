const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const jdb = new qdb.table("cezalar");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("YASHINU ❤️ ALOSHA").setColor(client.randomColor()).setTimestamp();
  if(!ayar.enAltYetkiliRolu) return message.channel.send("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(message.member.roles.highest.position < message.guild.roles.cache.get(ayar.enAltYetkiliRolu).position && !message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(embed.setDescription(`Uyarı komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`)).then(x => x.delete({timeout: 5000}));
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let reason = args.splice(1).join(" ");
  if(!uye || !reason) return message.channel.send(embed.setDescription("Geçerli bir üye ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
    kdb.add(`kullanici.${message.author.id}.uyari`, 1);
    kdb.push(`kullanici.${uye.id}.sicil`, {
      Yetkili: message.author.id,
      Tip: "UYARI",
      Sebep: reason,
      Zaman: Date.now()
    });
  message.channel.send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından **${reason}** nedeniyle uyarıldı!`)).catch();
  if(ayar.uyariLogKanali && client.channels.cache.has(ayar.uyariLogKanali)) client.channels.cache.get(ayar.uyariLogKanali).send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından **${reason}** nedeniyle uyarıldı!`)).catch();
};
module.exports.configuration = {
  name: "uyarı",
  aliases: ['sustur'],
  usage: "uyarı [üye] [sebep]",
  description: "Belirtilen üyeyi uyarır."
};