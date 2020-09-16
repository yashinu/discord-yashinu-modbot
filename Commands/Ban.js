const { MessageEmbed } = require("discord.js");
const qdb = require('quick.db');
const kdb = new qdb.table("kullanici");

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter("YASHINU ❤️ ALOSHA").setColor(client.randomColor()).setTimestamp();
  if(!ayar.banciRolleri) return message.channel.send(embed.setDescription("Sunucuda herhangi bir `YASAKLAMA(BAN)` rolü tanımlanmamış. `PANEL` komutunu kullanmayı deneyin.")).then(x => x.delete({timeout: 5000}));
  if(!ayar.banciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.channel.send(embed.setDescription("Bu komutu kullanabilmek için gerekli rollere sahip değilsin!")).then(x => x.delete({timeout: 5000}));
  
  if(args[0] && args[0].includes('list')) {
    try {
      message.guild.fetchBans().then(bans => {
        message.channel.send(`# Sunucudan yasaklanmış kişiler; ⛔\n\n${bans.map(c => `${c.user.id} | ${c.user.tag}`).join("\n")}\n\n# Toplam "${bans.size}" adet yasaklanmış kullanıcı bulunuyor.`, {code: 'xl', split: true});
      });
	  } catch (err) { message.channel.send(`Yasaklı kullanıcı bulunmamakta!`).then(x => x.delete({timeout: 5000}));; }
    return;
  };
  
  if (args[0] && (args[0].includes('bilgi') || args[0].includes('info'))) {
    if(!args[1] || isNaN(args[1])) return message.channel.send(embed.setDescription(`Geçerli bir ban yemiş kullanıcı ID'si belirtmelisin!`)).then(x => x.delete({timeout: 5000}));;
    return message.guild.fetchBan(args.slice(1).join(' ')).then(({ user, reason }) => message.channel.send(embed.setDescription(`**Banlanan Üye:** ${user.tag} (${user.id})\n**Ban Sebebi:** ${reason ? reason : "Belirtilmemiş!"}`))).catch(err => message.channel.send(embed.setDescription("Belirtilen ID numarasına sahip bir ban bulunamadı!")).then(x => x.delete({timeout: 5000})));
  };
  let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  let reason = args.splice(1).join(" ");
  if (!reason) return message.channel.send(embed.setDescription("Geçerli bir üye ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (!victim) {
    let kisi = await client.users.fetch(args[0]);
    if(kisi) {
      message.guild.members.ban(kisi.id, {reason: reason}).catch();
      kdb.add(`kullanici.${message.author.id}.ban`, 1);
      kdb.push(`kullanici.${victim.id}.sicil`, {
        Yetkili: message.author.id,
        Tip: "BAN",
        Sebep: reason,
        Zaman: Date.now()
      });
      message.react(client.emojiler.onay).catch();
      if(ayar.banLogKanali && client.channels.cache.has(ayar.banLogKanali)) client.channels.cache.get(ayar.banLogKanali).send(new MessageEmbed().setColor(client.randomColor()).setTimestamp().setFooter("YASHINU ❤️ ALOSHA").setTitle('Üye Banlandı!').setDescription(`**Banlayan Yetkili:** ${message.author} (${message.author.id})\n**Banlanan Üye:** ${kisi.tag} (${kisi.id})\n**Sebep:** ${reason}`));
    } else {
      message.channel.send(embed.setDescription("Geçerli bir üye ve sebep belirtmelisin!")).then(x => x.delete({timeout: 5000}));
    };
    return message.reply('Geçerli bir üye ve sebep belirtmelisin!').then(x => x.delete({timeout: 5000}));
  };
  if(message.member.roles.highest.position <= victim.roles.highest.position) return message.channel.send(embed.setDescription("Banlamaya çalıştığın üye senle aynı yetkide veya senden üstün!")).then(x => x.delete({timeout: 5000}));
  if(!victim.bannable) return message.channel.send(embed.setDescription("Botun yetkisi belirtilen üyeyi banlamaya yetmiyor!")).then(x => x.delete({timeout: 5000}));
  victim.send(embed.setDescription(`${message.author} tarafından **${reason}** sebebiyle sunucudan banlandın.`)).catch();
  victim.ban({reason: reason}).then(x => message.react(client.emojiler.onay)).catch();
  kdb.add(`kullanici.${message.author.id}.ban`, 1);
  kdb.push(`kullanici.${victim.id}.sicil`, {
      Yetkili: message.author.id,
      Tip: "BAN",
      Sebep: reason,
      Zaman: Date.now()
    });
  message.channel.send(embed.setImage("https://i.pinimg.com/originals/b2/84/33/b28433c392959f923ff0d736cd89dcbd.gif").setDescription(`\`${victim.user.tag}\` üyesi ${message.author} tarafından **${reason}** nedeniyle **banlandı!**`));
  if(ayar.banLogKanali && client.channels.cache.has(ayar.banLogKanali)) client.channels.cache.get(ayar.banLogKanali).send(new MessageEmbed().setColor(client.randomColor()).setTimestamp().setFooter("YASHINU ❤️ ALOSHA").setTitle('Üye Banlandı!').setDescription(`**Banlayan Yetkili:** ${message.author} (${message.author.id})\n**Banlanan Üye:** ${victim.user.tag} (${victim.user.id})\n**Sebep:** ${reason}`));
};
module.exports.configuration = {
  name: "ban",
  aliases: ["yasakla"],
  usage: "ban [üye] [sebep] / liste / bilgi [id]",
  description: "Belirtilen üyeyi sunucudan yasaklar."
};