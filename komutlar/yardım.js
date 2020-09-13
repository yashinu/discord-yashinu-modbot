const { MessageEmbed } = require("discord.js");
const conf = require("../ayarlar.json");
const qdb =require("quick.db");
const db = new qdb.table("ayarlar");

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(conf.durum).setColor(client.randomColor()).setTimestamp();
  if(!client.kullanabilir(message.author.id)  && !message.member.roles.cache.has(ayar.enAltYetkiliRolu) && !message.member.roles.cache.has(ayar.sahipRolu) && !message.member.roles.cache.has("732302944707543160") && (!message.member.hasPermission("ADMINISTRATOR"))) return message.reply(embed.setDescription(`Bu komutu kullanabilmek için yetkili olman gerekiyor.`)).then(x => x.delete({timeout: 5000}));
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
  message.channel.send(embed.setDescription(yazı).addField('Özel Komutlar', ozelkomutlar.length > 0 ? ozelkomutlar.map(x => "**"+x.isim+"**").join(' \`|\` ') : "Bulunamadı!"));
};
module.exports.configuration = {
  name: "yardım",
  aliases: ['help'],
  usage: "yardım [komut adı]",
  description: "Botta bulunan tüm komutları listeler."
};