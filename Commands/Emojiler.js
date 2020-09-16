const { MessageEmbed } = require("discord.js");
const conf = require('../ayarlar.json');

module.exports.execute = async(client, message, args, ayar, emoji) => {
  let guild = message.guild;
	if(args[0] === "kur" || args[0] === "kurulum") {
    if(!conf.sahip.some(x => message.author.id == x) && !message.member.roles.cache.has(ayar.sahipRolu)) return;
    let onay1 = "https://cdn.discordapp.com/emojis/673576575760990227.gif?v=1";
    let onay2 = "https://cdn.discordapp.com/emojis/673576252241608714.gif?v=1";
    let iptal = "https://cdn.discordapp.com/emojis/673576480487506011.gif?v=1";
    let bosta = "https://cdn.discordapp.com/emojis/673576453140512788.png?v=1";
    let rahatsizetmeyin = "https://cdn.discordapp.com/emojis/673576231433797664.png?v=1";
    let gorunmez = "https://cdn.discordapp.com/emojis/673576417224556611.png?v=1";
    let cevrimici = "https://cdn.discordapp.com/emojis/673576292205068314.png?v=1";
    let kalp = "https://cdn.discordapp.com/emojis/671659438712684544.gif?v=1";
    let mavibit = "https://cdn.discordapp.com/emojis/673574012235939850.gif?v=1";
    let alev = "https://cdn.discordapp.com/emojis/671659424481280000.gif?v=1";
    let yuvarlanma = "https://cdn.discordapp.com/emojis/672710947214852131.gif?v=1";
    let sonsuzluk = "https://cdn.discordapp.com/emojis/671154480045228043.gif?v=1";
    let as = "https://cdn.discordapp.com/emojis/667337359100084234.png?v=1";
    let hg = "https://cdn.discordapp.com/emojis/701740708641374209.png?v=1";
    let sayı0 = "https://cdn.discordapp.com/emojis/672098218905174016.gif?v=1";
    let sayı1 = "https://cdn.discordapp.com/emojis/672098250676895744.gif?v=1";
    let sayı2 = "https://cdn.discordapp.com/emojis/672098365252829205.gif?v=1";
    let sayı3 = "https://cdn.discordapp.com/emojis/672098398916182016.gif?v=1";
    let sayı4 = "https://cdn.discordapp.com/emojis/672098440519614474.gif?v=1";
    let sayı5 = "https://cdn.discordapp.com/emojis/672098501752258570.gif?v=1";
    let sayı6 = "https://cdn.discordapp.com/emojis/672098534463373332.gif?v=1";
    let sayı7 = "https://cdn.discordapp.com/emojis/672098564897374218.gif?v=1";
    let sayı8 = "https://cdn.discordapp.com/emojis/672098613668872218.gif?v=1";
    let sayı9 = "https://cdn.discordapp.com/emojis/672098648523538433.gif?v=1";
    
    guild.emojis.create(onay1, "bonay1").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(onay2, "bonay2").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(iptal, "biptal").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(bosta, "bbosta").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(rahatsizetmeyin, "brahatsizetmeyin").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(gorunmez, "bgorunmez").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(cevrimici, "bcevrimici").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(kalp, "bkalp").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(mavibit, "bmavibit").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(alev, "balev").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(yuvarlanma, "byuvarlanma").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(sonsuzluk, "bsonsuzluk").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(as, "bas").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(hg, "bhg").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(sayı0, "bsayi0").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(sayı1, "bsayi1").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(sayı2, "bsayi2").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(sayı3, "bsayi3").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(sayı4, "bsayi4").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(sayı5, "bsayi5").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(sayı6, "bsayi6").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(sayı7, "bsayi7").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(sayı8, "bsayi8").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    guild.emojis.create(sayı9, "bsayi9").then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`)).catch(console.error);
    return;
  };
  
  if(args[0] === "oluştur" || args[0] === "ekle") {
    if(!conf.sahip.some(x => message.author.id == x) && !message.member.roles.cache.has(ayar.sahipRolu)) return;
    let [link, ad] = args.slice(1).join(" ").split(" ");
    if (!link) return message.channel.send(`Bir link yazmalısın. Doğru kullanım: **${this.configuration.name} oluştur <link> <isim>**`);
    if (!ad) return message.channel.send(`Bir isim yazmalısın. Doğru kullanım: **${this.configuration.name} oluştur <link> <isim>**`);
  
    guild.emojis.create(link, ad)
      .then(emoji => message.channel.send(`Başarıyla ${emoji.name} adında emoji oluşturuldu. (${emoji})`))
      .catch(console.error);
    return;
  };
  
  if(args[0] === "sil" || args[0] === "kaldır") {
    if(!conf.sahip.some(x => message.author.id == x) && !message.member.roles.cache.has(ayar.sahipRolu)) return;
    let guild = message.guild;
    let link = args[1];
    if (!link) return message.channel.send(`Silinecek emojinin adını veya ID'sini yazmalısın. \`${this.configuration.name} sil emoji\``);
    let emojisim = guild.emojis.cache.find(e => e.name === link);
    if (!emojisim) return message.channel.send(`\`${link}\` adında emoji bulunamadı.`);
    
    guild.deleteEmoji(emojisim.id || emojisim)
      .then(emoji => message.channel.send(`\`${emojisim.name}\` adlı emoji silindi.`))
      .catch(console.error);
    return;
  };
  
  if(args[0] === "id") {
    try {
      message.channel.send(`Sunucuda Bulunan Emojiler (${message.guild.emojis.cache.size} adet) \n\n${message.guild.emojis.cache.map(emoji => emoji.id + " | " + emoji.toString()).join('\n')}`, {code: 'xl', split: true})
    } catch (err) { };
    return
  };
  
  if (message.guild.emojis.cache.some(x => `${x.name}`.includes(args[0]))) {
    if (!message.guild.emojis.cache.some(x => `${x.name}`.includes(args[0]))) return message.channel.send(`Sunucuda  \`${args[0]}\`  adında bir emoji bulunamadı!`);
    const emoji = new MessageEmbed()
    .setColor('RANDOM')
    .setTimestamp()
    .setFooter(client.user.username, client.user.avatarURL)
    .setDescription(`**Emoji:**  ${message.guild.emojis.cache.find(a => a.name === args[0])} \n**Emoji Adı:**  ${message.guild.emojis.cache.find(a => a.name === args[0]).name} \n**Emoji ID'si:**  ${message.guild.emojis.cache.find(a => a.name === args[0]).id} \n**Emoji Kodu:**  \`${message.guild.emojis.cache.find(x => x.name == args[0]).toString()}\``);
    try {
      message.channel.send(emoji)
    } catch (err) {
      const embed = new MessageEmbed()
      .addField(`Sunucuda Bulunan Emojiler`, `Üzgünüm ama sunucuda ya çok fazla emoji bulunuyor ya da hiç emoji bulunmuyor. Bunları gösteremiyorum. Discord buna izin vermiyor.`)
      .setColor(0x00ffff)
      .setTimestamp()
      message.channel.send({embed})
    };
    return;
  };
  
  try {
    const embed = new MessageEmbed()
    .addField(`Sunucuda Bulunan Emojiler`, message.guild.emojis.cache.map(emoji => emoji).join(' | '))
    .setColor(0x00ffff)
    .setTimestamp()
    .setFooter('Emojileri IDleri ile birlikte görmek için; emojiler id')
    message.channel.send({embed})
  } catch (err) {
    const embed = new MessageEmbed()
    .addField(`Sunucuda Bulunan Emojiler`, `Üzgünüm ama sunucuda ya çok fazla emoji bulunuyor ya da hiç emoji bulunmuyor. Bunları gösteremiyorum. Discord buna izin vermiyor.`)
    .setFooter('Emojilere bakamıyor ve IDleri ile birlikte görmek isterseniz; emojiler id')
    .setColor(0x00ffff)
    .setTimestamp()
    message.channel.send({embed})
  };
};
module.exports.configuration = {
    name: "emojiler",
    aliases: ["emoji"],
    usage: "emojiler",
    description: "Sunucu emojileri."
};