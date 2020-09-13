const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const conf = require('../ayarlar.json');

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(conf.durum).setColor(client.randomColor()).setTimestamp();
  if(!ayar.teyitsizRolleri || !ayar.teyitciRolleri) return message.channel.send("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!client.kullanabilir(message.author.id)  && !ayar.teyitsizRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu) && !message.member.roles.cache.has("732302944707543160") && (!message.member.hasPermission("ADMINISTRATOR"))) return message.reply(embed.setDescription(`Bu komutu kullanabilmek için yetkili olman gerekiyor.`)).then(x => x.delete({timeout: 5000}));
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  if(uye.manageable) uye.setNickname(uye.user.username).catch();
  await uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? ["737636510719016960", ayar.boosterRolu] : ayar.teyitsizRolleri).catch();
  message.channel.send(embed.setDescription(`${uye} üyesi, ${message.author} tarafından kayıtsıza atıldı!`)).catch();
};
module.exports.configuration = {
  name: "kayıtsız",
  aliases: [],
  usage: "kayıtsız [üye]",
  description: "Belirtilen üyeyi kayıtsıza atar."
};