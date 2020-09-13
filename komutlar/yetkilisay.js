const { MessageEmbed } = require("discord.js");
const conf = require("../ayarlar.json");

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(conf.durum).setColor(client.randomColor()).setTimestamp();
  if(!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(ayar.sahipRolu)  && (!message.member.hasPermission("ADMINISTRATOR"))) return 
  let enAltYetkiliRolu = message.guild.roles.cache.get(ayar.enAltYetkiliRolu);
  let members = message.guild.members.cache.filter(member => member.roles.highest.position >= enAltYetkiliRolu.position);
  let sesteOlanlar = members.filter(member => member.voice.channel);
  let sesteOlmayanlar = members.filter(member => !member.voice.channel);
  client.splitEmbedWithDesc(`**🟢 Seste Olan Yetkililer**\n\n${sesteOlanlar.map(member => `${member}`).join(", ")}`,
                           {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
                           {name: conf.durum, icon: false},
                           {setColor: [client.randomColor()]}).then(list => {
    list.forEach(item => {
      message.channel.send(item);
    });
  });
  sesteOlmayanlar = sesteOlmayanlar.map(x => x.toString());
  message.channel.send(`${sesteOlmayanlar.slice(0, sesteOlmayanlar.length/2).join(`, `)}`, {split: true});
  message.channel.send(`${sesteOlmayanlar.slice(sesteOlmayanlar.length/2).join(`, `)}`, {split: true});
  message.channel.send(`Sese girmeniz rica olunur aksi takdirde yükseltiminizde göz önünde bulundurulacaktır.`, {split: true});
};
module.exports.configuration = {
  name: "yetkili-say",
  aliases: ['yetkilisay'],
  usage: "yetkili-say",
  description: "Yetkili yoklaması.",
  permLevel: 1
};