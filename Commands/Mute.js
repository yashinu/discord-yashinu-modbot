const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const jdb = new qdb.table("cezalar");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("YASHINU ❤️ ALOSHA").setColor(client.randomColor()).setTimestamp();
  if(!ayar.muteRolu || !ayar.muteciRolleri) return message.channel.send("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(embed.setDescription(`Mute komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`)).then(x => x.delete({timeout: 5000}));
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let reason = args.splice(1).join(" ");
  if(!uye || !reason) return message.channel.send(embed.setDescription("Geçerli bir üye ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  let muteler = jdb.get(`mute`) || [];
  await uye.roles.add(ayar.muteRolu || []).catch();
  if (!muteler.some(j => j.includes(uye.id))) {
    jdb.push(`mute`, `m${uye.id}`);
    kdb.add(`kullanici.${message.author.id}.mute`, 1);
    kdb.push(`kullanici.${uye.id}.sicil`, {
      Yetkili: message.author.id,
      Tip: "MUTE",
      Sebep: reason,
      Zaman: Date.now()
    });
  };
  message.channel.send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından **${reason}** nedeniyle mutelendi!`)).catch();
  if(ayar.muteLogKanali && client.channels.cache.has(ayar.muteLogKanali)) client.channels.cache.get(ayar.muteLogKanali).send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından **${reason}** nedeniyle mutelendi!`)).catch();
};
module.exports.configuration = {
  name: "mute",
  aliases: ['sustur'],
  usage: "mute [üye] [sebep]",
  description: "Belirtilen üyeyi muteler."
};