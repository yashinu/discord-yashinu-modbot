const { MessageEmbed } = require("discord.js");
const qdb = require("quick.db");
const conf = require('../ayarlar.json');
const db = new qdb.table("ayarlar");
const idb = new qdb.table("istatistik");
const ldb = new qdb.table("level");
const kdb = new qdb.table("kullanici");

// module.exports.onLoad = (client) => {}
module.exports.execute = async (client, message, args) => {
  if(!conf.sahip.includes(message.author.id))
    if((message.guild.ownerID != message.author.id)) return message.channel.send("**Bunu yapmak için yeterli yetkin yok!**");
  let ozellikler = [
    { name: "tag", type: "tekil" },
    { name: "ikinciTag", type: "tekil" },
    { name: "embedImage", type: "tekil" },
    { name: "isim-yas", type: "acmali" },
    { name: "yasakTaglar", type: "cogul" },
    { name: "sahipRolu", type: "rol" },
    { name: "enAltYetkiliRolu", type: "rol" },
    { name: "ekipRolu", type: "rol" },
    { name: "ekipLogKanali", type: "kanal" },
    { name: "sesLogKanali", type: "kanal" },
    { name: "chatKanali", type: "kanal" },
    { name: "boosterRolu", type: "rol" },
    { name: "toplantiSesKanali", type: "kanal" },
    { name: "katildiRolu", type: "rol" },
    { name: "botSesKanali", type: "kanal" },
    { name: "teyitKanali", type: "kanal" },
    { name: "teyitsizRolleri", type: "roller" },
    { name: "teyitciRolleri", type: "roller" },
    { name: "erkekRolleri", type: "roller" },
    { name: "kizRolleri", type: "roller" },
    { name: "banciRolleri", type: "roller" },
    { name: "banLogKanali", type: "kanal" },
    { name: "muteciRolleri", type: "roller" },
    { name: "muteRolu", type: "rol" },
    { name: "muteLogKanali", type: "kanal" },
    { name: "jailRolu", type: "rol" },
    { name: "fakeHesapRolu", type: "rol" },
    { name: "fakeHesapLogKanali", type: "kanal" },
    { name: "jailciRolleri", type: "roller" },
    { name: "jailLogKanali", type: "kanal" }
  ];
  let secim = args[0];
  const embed = new MessageEmbed().setColor(client.randomColor()).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setFooter("YASHINU ❤️ ALOSHA");
  if (secim == "liste") {
    let data = await db.get("ayar");
    let ozelliklerListe = Object.keys(data || {}).filter(a => ozellikler.find(v => v.name == a)).map(o => {
      let element = data[o];
      let ozellik = ozellikler.find(z => z.name == o);
      if (ozellik.type == "tekil") return `\`${o}\` - ${element}`
      else if(ozellik.type == "cogul") return `\`${o}\` - ${element.map(tag => `${tag}`).join(', ')}`
      else if(ozellik.type == "roller") return `\`${o}\` - ${element.map(role => message.guild.roles.cache.get(role)).join(', ')}`
      else if(ozellik.type == "rol") return `\`${o}\` - ${message.guild.roles.cache.get(element) || "Rol bulunamadı!"}`
      else if(ozellik.type == "kanal") return `\`${o}\` - ${message.guild.channels.cache.get(element) || "Kanal bulunamadı!"}`
      else if(ozellik.type == "acmali") return `\`${o}\` - ${element ? "Açık!" : "Kapalı!"}`
      
    }).join('\n');
    return message.channel.send(embed.setDescription(ozelliklerListe));
  };
  if (secim === "sıfırla") {
    if (!args[1] || (args[1] !== "ses" && args[1] !== "chat")) return message.channel.send(embed.setDescription("Sıfırlanacak veriyi belirtmelisin! (ses/chat/teyit)")).then(x => x.delete({timeout: 5000}));
    if (args[1] === "ses") {
      idb.delete("sesli");
    } else if (args[1] === "chat") {
      ldb.delete("kanallar");
    } else if (args[1] === "teyit") {
      kdb.delete("teyit");
    };
    return message.channel.send(embed.setDescription("Başarıyla belirtilen istatistik verileri sıfırlandı!"));
  };
  if (!secim || !ozellikler.some(ozellik => ozellik.name.toLowerCase() == secim.toLowerCase())) return message.channel.send(embed.setDescription(`Bir hata yaptın! Ayarları listeletmek istiyorsan; **liste**, ses veya chat istatistiklerini sıfırlamak istiyorsan **sıfırla ses/chat/teyit** bir ayar yapmak istiyorsan aşağıdaki seçimleri kullanmalısın. \n\n ${ozellikler.map(o => `\`${o.name}\``).join(", ")} kullanabilirsin.`));
  let ozellik = ozellikler.find(o => o.name.toLowerCase() === secim.toLowerCase());
  if (ozellik.type == "tekil"){
    let metin = args.splice(1).join(" ");
    if (!metin) return message.channel.send(embed.setDescription("**Özelliğin ayarlanacak yeni halini belirtmelisin!**"));
    db.set(`ayar.${ozellik.name}`, metin);
    return message.channel.send(embed.setDescription("**Ayar başarıyla belirttiğin şekilde ayarlandı!**"));
  }
  else if (ozellik.type == "roller") {
    let roller;
    if(message.mentions.roles.size >= 1)
      roller = message.mentions.roles.map(role => role.id);
    else roller = args.splice(1).filter(role => message.guild.roles.cache.some(role2 => role == role2.id));
    if(roller.length <= 0) return message.channel.send(embed.setDescription("**Rol belirtmeyi unuttun!**"));
    db.set(`ayar.${ozellik.name}`, roller);
    return message.channel.send(embed.setDescription(`Belirttiğin ayar için ${roller.map(role => message.guild.roles.cache.filter(role2 => role == role2.id).map(role => role.toString())).join(", ")} tanımladın.`))
  }
  else if (ozellik.type == "rol") {
    let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args.splice(1)[0]) || message.guild.roles.cache.find(r => r.name === args.splice(1).join(' '));
    if(!rol) return message.channel.send(embed.setDescription("**Rol belirtmeyi unuttun!**"));
    db.set(`ayar.${ozellik.name}`, rol.id);
    return message.channel.send(embed.setDescription(`Belirttiğin ayar için ${rol} tanımladın.`))
  }
  else if (ozellik.type == "kanal"){
    let channel = message.guild.channels.cache.get(args.splice(1)[0]) || message.mentions.channels.first();
    if(!channel) return message.channel.send(embed.setDescription("**Kanal belirtmeyi unuttun!**"));
    db.set(`ayar.${ozellik.name}`, channel.id);
    return message.channel.send(embed.setDescription(`Belirttiğin ayar için ${channel} tanımladın.`));
  }
  else if (ozellik.type == "cogul"){
    let tag = args.splice(1).join(' ');
    if(!tag) return message.channel.send(embed.setDescription("**Değer belirtmeyi unuttun!**"));
    let arr = await db.get(`ayar.${ozellik.name}`) || [];
    let index = arr.find(e => e == tag);
    if(index) arr.splice(arr.indexOf(tag), 1);
    else arr.push(tag);
    db.set(`ayar.${ozellik.name}`, arr);
    return message.channel.send(embed.setDescription(`Belirttiğin ayar tanımlandı. Mevcut ayarında \`${arr.join(", ")}\` bulunmakta.`));
  }
  else if (ozellik.type == "acmali"){
    await db.set(`ayar.${ozellik.name}`, !db.get(`ayar.${ozellik.name}`));
    return message.channel.send(embed.setDescription(`Belirttiğin ayar ${db.get(`ayar.${ozellik.name}`) ? "**açıldı!**" : "**kapatıldı**!"}`));
  }
};

module.exports.configuration = {
    name: "panel",
    aliases: ["ayar","ayarlar"],
    usage: "panel [seçim] [ayar]",
    description: "Sunucu ayarları."
};