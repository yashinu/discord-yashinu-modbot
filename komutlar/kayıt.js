const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const db = new qdb.table("ayarlar");
const kdb = new qdb.table("kullanici");
const conf = require('../ayarlar.json');

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(conf.durum).setColor(client.randomColor()).setTimestamp();
  if((!ayar.erkekRolleri && !ayar.kizRolleri) || !ayar.teyitciRolleri) return message.channel.send("**Roller ayarlanmamış!**").then(x => x.delete({timeout: 5000}));
  if(!client.kullanabilir(message.author.id)  && !ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.roles.cache.has(ayar.sahipRolu) && !message.member.roles.cache.has("732302944707543160") && (!message.member.hasPermission("ADMINISTRATOR"))) return message.reply(embed.setDescription(`Bu komutu kullanabilmek için yetkili olman gerekiyor.`)).then(x => x.delete({timeout: 5000}));
  let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send(embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({timeout: 5000}));
  if (message.member.roles.highest.position <= uye.roles.highest.position) return message.channel.send(embed.setDescription(`Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!`)).then(x => x.delete({timeout: 5000}));
  args = args.filter(a => a !== "" && a !== " ").splice(1);
  let yazilacakIsim;
  if (db.get(`ayar.isim-yas`)) {
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if(!isim || !yaş) return message.channel.send(embed.setDescription("Geçerli bir isim ve yaş belirtmelisin!")).then(x => x.delete({timeout: 5000}));
    yazilacakIsim = `${uye.user.username.includes(ayar.tag) ? ayar.tag : (ayar.ikinciTag ? ayar.ikinciTag : (ayar.tag || ""))} ${isim} | ${yaş}`;
  } else {
    let isim = args.join(' ');
    if(!isim) return message.channel.send(embed.setDescription("Geçerli bir isim belirtmelisin!")).then(x => x.delete({timeout: 5000}));
    yazilacakIsim = `${uye.user.username.includes(ayar.tag) ? ayar.tag : (ayar.ikinciTag ? ayar.ikinciTag : (ayar.tag || ""))} ${isim}`;
  };
  await uye.setNickname(`${yazilacakIsim}`).catch();
  let islemEmbed = await message.channel.send(embed.setDescription(`${uye} üyesinin cinsiyetini emojilerle belirt!`));
  await islemEmbed.react(client.emojiler.erkekEmoji).catch();
  await islemEmbed.react(client.emojiler.kizEmoji).catch();
  const reactionFilter = (reaction, user) => {
    return [client.emojiler.erkekEmoji, client.emojiler.kizEmoji].includes(reaction.emoji.id) && user.id === message.author.id;
  };
  islemEmbed.awaitReactions(reactionFilter, {max: 1, time: 10000, error: ["time"]}).then(async (res) => {
    let r = res.first();
    if (r.emoji.id == client.emojiler.erkekEmoji) {
      if (ayar.teyitsizRolleri && ayar.teyitsizRolleri.some(rol => uye.roles.cache.has(rol)))  kdb.add(`teyit.${message.author.id}.erkek`, 1);
      await uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? [ "737636514346827837","737636516335058965" , ayar.boosterRolu] : ayar.erkekRolleri).catch();
    } else if (r.emoji.id == client.emojiler.kizEmoji) {
      if (ayar.teyitsizRolleri && ayar.teyitsizRolleri.some(rol => uye.roles.cache.has(rol)))  kdb.add(`teyit.${message.author.id}.kiz`, 1);
      await uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? [ "737636517245091870","737636514867052616" , ayar.boosterRolu] : ayar.kizRolleri).catch();

    };
    uye.setNickname(`${yazilacakIsim}`).catch();
    islemEmbed.reactions.removeAll();
    if(ayar.tag && uye.user.username.includes(ayar.tag)) uye.roles.add(ayar.ekipRolu).catch();
    islemEmbed.edit(new MessageEmbed().setColor(client.randomColor()).setTitle("Kayıt Sistemi").setThumbnail(uye.user.avatarURL({dynamic: true, size: 2048})).setFooter(conf.durum).setTimestamp().setDescription(`${emoji("gif1")} Kayıt Olan Kullanıcı: ${uye}\n${emoji("gif1")} Verilen Roller: ${uye.roles.cache.filter(a => a.name !== "@everyone").map(x => x).join(', ')}\n${emoji("gif1")} Kayıt Eden: ${message.author}\n${emoji("gif1")} Güncellenen İsim: \`${yazilacakIsim}\``)).catch();
    if (ayar.chatKanali && client.channels.cache.has(ayar.chatKanali)) client.channels.cache.get(ayar.chatKanali).send(embed.setAuthor(uye.displayName, uye.user.avatarURL({dynamic: true})).setDescription(`${uye} aramıza hoş geldin! Seninle birlikte \`${client.sayilariCevir(message.guild.memberCount)}\` kişiyiz.`)).catch();
  }).catch(err => {
    islemEmbed.delete();
    message.reply("10 saniye içerisinde cinsiyet belirtilmediği için kayıt işlemi iptal edildi!").then(x => x.delete({timeout: 5000}));
  });
};
module.exports.configuration = {
  name: "kayıt",
  aliases: ["e", "man", "boy", "k", "woman", "girl", "register"],
  usage: "kayıt [üye] [isim] [yaş]",
  description: "Belirtilen üyeyi kaydeder."
};