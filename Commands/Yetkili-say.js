const { MessageEmbed } = require("discord.js");
const conf = require("../ayarlar.json");

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("YASHINU ❤️ ALOSHA").setColor(client.randomColor()).setTimestamp();
  if(!ayar.sahipRolu) return message.channel.send("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(embed.setDescription(`Yoklama komutunu kullanabilmek için herhangi bir yetkiye sahip değilsin.`)).then(x => x.delete({timeout: 5000}));
  let enAltYetkiliRolu = message.guild.roles.cache.get(ayar.enAltYetkiliRolu);
  let members = message.guild.members.cache.filter(member => member.roles.highest.position >= enAltYetkiliRolu.position);
  let sesteOlanlar = members.filter(member => member.voice.channel);
  let sesteOlmayanlar = members.filter(member => !member.voice.channel);
  client.splitEmbedWithDesc(`**🟢 Seste Olan Yetkililer**\n\n${sesteOlanlar.map(member => `${member}`).join(", ")}`,
                           {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
                           {name: "YASHINU ❤️ ALOSHA", icon: false},
                           {setColor: [client.randomColor()]}).then(list => {
    list.forEach(item => {
      message.channel.send(item);
    });
  });
  client.splitEmbedWithDesc(`**🔴 Seste Olmayan Yetkililer**\n\n${sesteOlmayanlar.map(member => `${member}`).join(", ")}`,
                           {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
                           {name: "YASHINU ❤️ ALOSHA", icon: false},
                           {setColor: [client.randomColor()]}).then(list => {
    list.forEach(item => {
      message.channel.send(item);
    });
  });
};
module.exports.configuration = {
  name: "yetkili-say",
  aliases: ['yetkilisay'],
  usage: "yetkili-say",
  description: "Yetkili yoklaması."
};