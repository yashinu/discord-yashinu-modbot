const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const jdb = new qdb.table("cezalar");
const kdb = new qdb.table("kullanici");
const ms = require('ms');

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("YASHINU ❤️ ALOSHA").setColor(client.randomColor()).setTimestamp();
  if(!ayar.jailRolu || !ayar.jailciRolleri) return message.channel.send("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(embed.setDescription(`Jail komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`)).then(x => x.delete({timeout: 5000}));
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  let jaildekiler = jdb.get(`tempjail`) || [];
  let sure = args[1];
  let reason = args.splice(2).join(" ");
  if(!sure || !ms(sure) || !reason) return message.channel.send(embed.setDescription("Geçerli bir süre (1s/1m/1h/1d) ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  await uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? [ayar.boosterRolu, ayar.jailRolu] : [ayar.jailRolu]).catch();
  if (!jaildekiler.some(j => j.id == uye.id)) {
    jdb.push(`tempjail`, {id: uye.id, kalkmaZamani: Date.now()+ms(sure)});
    kdb.add(`kullanici.${message.author.id}.jail`, 1);
    kdb.push(`kullanici.${uye.id}.sicil`, {
      Yetkili: message.author.id,
      Tip: "TEMP-JAIL",
      Sebep: reason,
      Zaman: Date.now()
    });
  };
  if(uye.voice.channel) uye.voice.kick().catch();
  message.channel.send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından **${sure}** boyunca **${reason}** nedeniyle jaile atıldı!`)).catch();
  if(ayar.jailLogKanali && client.channels.cache.has(ayar.jailLogKanali)) client.channels.cache.get(ayar.jailLogKanali).send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından **${sure}** boyunca **${reason}** nedeniyle jaile atıldı!`)).catch();
};
module.exports.configuration = {
  name: "tempjail",
  aliases: ['tempcezalı', 'süreli-cezalı'],
  usage: "tempjail [üye] [süre] [sebep]",
  description: "Belirtilen üyeyi süreli jaile atar."
};