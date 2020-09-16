const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const jdb = new qdb.table("cezalar");
const db = new qdb.table("ayarlar");

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("YASHINU ❤️ ALOSHA").setColor(client.randomColor()).setTimestamp();
  if(!ayar.muteciRolleri) return message.channel.send("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(embed.setDescription(`Unmute komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`)).then(x => x.delete({timeout: 5000}));
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  let muteler = jdb.get(`mute`) || [];
  let tempmuteler = jdb.get(`tempmute`) || [];
  let tempsmuteler = jdb.get(`tempsmute`) || [];
  uye.roles.remove(ayar.muteRolu).catch();
  if (muteler.some(j => j.includes(uye.id))) jdb.set(`mute`, muteler.filter(x => !x.includes(uye.id)));
  if (tempmuteler.some(j => j.id === uye.id)) jdb.set(`tempmute`, tempmuteler.filter(x => x.id !== uye.id));
  if (tempsmuteler.some(j => j.id === uye.id)) jdb.set(`tempsmute`, tempsmuteler.filter(x => x.id !== uye.id));
  if (uye.voice.channel) uye.voice.setMute(false);
  message.channel.send(embed.setDescription(`${uye} üyesinin, ${message.author} tarafından mutesi kaldırıldı!`)).catch();
  if(ayar.muteLogKanali && client.channels.cache.has(ayar.muteLogKanali)) client.channels.cache.get(ayar.muteLogKanali).send(embed.setDescription(`${uye} üyesinin, ${message.author} tarafından mutesi kaldırıldı!`)).catch();
};
module.exports.configuration = {
  name: "unmute",
  aliases: ['unsusturma', 'susturaç', "açsusturma","susturmaaç"],
  usage: "unmute [üye]",
  description: "Belirtilen üyenin mutesini kaldırır."
};