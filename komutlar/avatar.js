const { MessageEmbed } = require("discord.js");

module.exports.execute = (client, message, args, ayar, emoji) => {
  if(!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(ayar.sahipRolu) && !ayar.ekipRolu.some(r => message.member.roles.cache.has(r)) && !message.member.roles.cache.has("732302944707543160") && (!message.member.hasPermission("ADMINISTRATOR"))) return message.channel.send(embed.setDescription("Bu komutu kullanabilmek için tag alman gerekiyor.")).then(x => x.delete({timeout: 5000}));
	let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
	let avatar = victim.avatarURL({ dynamic: true, size: 2048 });
  let embed = new MessageEmbed()
	.setColor(client.randomColor())
  .setAuthor(victim.tag, avatar)
  .setFooter(`${message.member.displayName} tarafından istendi!`, message.author.avatarURL({ dynamic: true }))
	.setDescription(`[Resim Adresi](${avatar})`)
	.setImage(avatar)
	message.channel.send(embed);
};
module.exports.configuration = {
    name: "avatar",
    aliases: ["pp"],
    usage: "avatar [üye]",
    description: "Belirtilen üyenin avatarını gösterir."
};