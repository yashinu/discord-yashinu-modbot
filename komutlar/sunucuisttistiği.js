const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("istatistik");
const conf = require('../ayarlar.json');

module.exports.execute = async(client, message, args, ayar, emoji) => {
  if(!client.kullanabilir(message.author.id)  && !message.member.roles.cache.has(ayar.enAltYetkiliRolu) && !message.member.roles.cache.has(ayar.sahipRolu) && !message.member.roles.cache.has("732302944707543160") && (!message.member.hasPermission("ADMINISTRATOR"))) return message.reply(embed.setDescription(`Bu komutu kullanabilmek için yetkili olman gerekiyor.`)).then(x => x.delete({timeout: 5000}));
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(conf.durum).setColor(client.randomColor()).setTimestamp();
  let raw = db.get("raw");
  let data = db.get("stats");
  let previousDay = raw.day - 1 == 0 ? 1 : raw.day - 1;
  let previous = data.server[previousDay].members;
  let nextDay = raw.day;
  let next = data.server[nextDay].members;
};
module.exports.configuration = {
    name: "sistatistik",
    aliases: ["sunucu"],
    usage: "sistatistik",
    description: "Belirtilen mesaj sayısı kadar mesaj temizler."
};

  // Sunucuda bir önceki gün atılan mesaj sayısı 300, bugün atılan mesaj sayısı 500 ise bu sayılar arasındaki yüzde artışı nedir?
  // 300 - 500
  // 500 - 300 = 200
  // 200 / 500 = 0,4
  // 0,4 * 100 = 40
  // %40