const { MessageEmbed } = require("discord.js");
const conf = require("../ayarlar.json");
const qdb =require("quick.db");
const db = new qdb.table("ayarlar");

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("YASHINU ❤️ ALOSHA").setColor(client.randomColor()).setTimestamp();
  let command = args[0]
	if (global.commands.has(command)) {
		command = global.commands.get(command)
		embed
			.addField('Komut Adı', command.configuration.name, false)
			.addField('Komut Açıklaması', command.configuration.description, false)
			.addField('Doğru Kullanım', command.configuration.usage)
			.addField('Alternatifler', command.configuration.aliases[0] ? command.configuration.aliases.join(', ') : 'Bulunmuyor')
			.setTimestamp()
			.setColor('0x36393E')
		message.channel.send(embed)
    return;
	}
  let yazı = "";
  let ozelkomutlar = db.get(`özelkomut`) || [];
  global.commands.forEach(command => {
    yazı += `\`${conf.prefix}${command.configuration.usage}\` \n`;
  });
  message.channel.send(embed.setDescription(yazı+`\n${client.komutlar.map(x => `\`${conf.prefix+x.isim}\``).join('\n')}`).addField('Özel Komutlar', ozelkomutlar.length > 0 ? ozelkomutlar.map(x => "**"+x.isim+"**").join(' \`|\` ') : "Bulunamadı!"));
};
module.exports.configuration = {
  name: "yardım",
  aliases: ['help'],
  usage: "yardım [komut adı]",
  description: "Botta bulunan tüm komutları listeler."
};