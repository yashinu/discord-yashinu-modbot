const { MessageEmbed, Discord } = require("discord.js");
const conf = require('../ayarlar.json');
const qdb =require("quick.db");
const db = new qdb.table("kullanici");

module.exports.onLoad = (client) => {
  client.on("message", (message) => {
    if(!message.guild || message.author.bot || message.content.toLowerCase().includes(`${conf.prefix}afk`)) return;
    let embed = new MessageEmbed().setColor(client.randomColor()).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }));
    if(message.mentions.users.size >= 1){
      let victim = message.mentions.users.first();
      if(db.has(`${victim.id}.afk`)) {
        let data = db.get(`${victim.id}.afk`);
        let tarih = client.tarihHesapla(data.sure);
        return message.channel.send(embed.setDescription(`${victim} adlı üye ${data.sebep ? `**${data.sebep}** sebebiyle ` : ""}${tarih} AFK oldu.`)).then(x => x.delete({timeout: 10000}));;
      };
    };
    if(!db.has(`${message.author.id}.afk`)) return;
    if(message.member.manageable) message.member.setNickname(message.member.displayName.replace("[AFK]", "")).catch();
    db.delete(`${message.author.id}.afk`);
    message.channel.send(embed.setDescription(`${message.author} artık AFK değilsin!`)).then(x => x.delete({timeout: 5000}));
  });
}
module.exports.execute = async (client, message, args, ayar, emoji) => {
  let sebep = args.join(' ');
  if (sebep && (await client.chatKoruma(sebep))) return message.reply('Geçerli bir AFK sebebi belirtmelisin!').then(x => x.delete({timeout: 5000}));;
  if (sebep) db.set(`${message.author.id}.afk.sebep`, sebep);
  db.set(`${message.author.id}.afk.sure`, new Date());
  if (message.member.manageable) message.member.setNickname(`[AFK]${message.member.displayName}`).catch(console.log);
  message.reply(`Başarıyla AFK moduna girdin! Bir şey yazana kadar AFK sayılacaksın!`).then(x => x.delete({timeout: 5000}));
};
module.exports.configuration = {
    name: "afk",
    aliases: [],
    usage: "afk [isterseniz sebep]",
    description: "AFK moduna girmenizi sağlar."
};
