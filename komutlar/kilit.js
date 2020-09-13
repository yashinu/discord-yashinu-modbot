const { MessageEmbed } = require("discord.js");
const conf = require("../ayarlar.json");

module.exports.execute = async(client, message, args, ayar, emoji) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(conf.durum).setColor(client.randomColor()).setTimestamp();
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription("Bu komutu kullanabilmek için **Yönetici** iznine sahip olmalısın!")).then(x => x.delete({timeout: 5000}));
  let everyone = message.guild.roles.cache.find(a => a.name === "@everyone");
  console.log(message.channel.permissionsFor(everyone).has("SEND_MESSAGES"))
  if(message.channel.permissionsFor(everyone).has('SEND_MESSAGES')) {
    message.channel.createOverwrite(everyone, {
      SEND_MESSAGES: false,
    });
    message.channel.send(embed.setDescription("Kanal kilitlendi!"))
  } else {
    message.channel.createOverwrite(everyone, {
      SEND_MESSAGES: null,
    });
    message.channel.send(embed.setDescription("Kanal kilidi açıldı!"));
  };
};
module.exports.configuration = {
    name: "kilit",
    aliases: ["lock"],
    usage: "kilit",
    description: "Komutun kullanıldığı chat kanalını kilitler."
};
