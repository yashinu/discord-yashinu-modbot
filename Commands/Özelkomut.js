const { MessageEmbed, Discord } = require("discord.js");
const conf = require('../ayarlar.json');
const qdb =require("quick.db");
const db = new qdb.table("ayarlar");

module.exports.onLoad = (client) => {
  client.on("message", (message) => {
    if (!message.guild || message.channel.type === "dm") return;
    let komutlar = db.get("özelkomut");
    if (komutlar && komutlar.length) {
      for (let komut of komutlar) {
        let isim = false;
        if (komut.prefix) {
          if (message.content.startsWith(conf.prefix+komut.isim)) isim = true;
        } else {
          if (message.content.startsWith(komut.isim)) isim = true;
        }
        if (isim) {
          if (komut.karalisteKanallari && komut.karalisteKanallari.length && komut.karalisteKanallari.filter(item => message.guild.channels.cache.has(item)).some(item => message.channel.id == item)) return message.channel.send("Bu komut "+komut.karalisteKanallari.map(e => message.guild.channels.cache.get(e).toString()).join(", ")+" kanal(lar)ında kullanılamaz!");
          if (komut.yetki.kisiler && komut.yetki.kisiler.filter(item => client.users.cache.has(item)).some(e => message.author.id == e)) çalıştır();
          else if (komut.yetki.roller && komut.yetki.roller.filter(item => message.guild.roles.cache.has(item)).some(e => message.member.roles.cache.has(e))) çalıştır();
          else if (komut.yetki.izinler && komut.yetki.izinler.filter(item => client.perms[item]).some(e => message.member.hasPermission(e))) çalıştır();
          else if (!komut.yetki.kisiler && !komut.yetki.roller && !komut.yetki.izinler) çalıştır();
          else return message.channel.send("Bu komutu kullanmak için yeterli yetkiniz yok!");
        function çalıştır() {
          let argümanlar = message.content.split(" ").slice(1);
          let hedef = komut.hedefKisi == 1 ? message.member : (message.mentions.members.first() || message.guild.members.cache.get(argümanlar[0]));
          if (komut.tur == "mesaj") {
            if (komut.parametreler.gonderilecekMesaj.length) return message.channel.send(komut.parametreler.gonderilecekMesaj);
          } else if (komut.tur == "özel kod") {
            if (komut.parametreler.ozelKod) return eval(komut.parametreler.ozelKod.replace(new RegExp(client.token, "g"), ""))
          } else {
            if (!hedef) return message.channel.send("Bir kişiyi etiketle!");
            if (komut.parametreler.verilecekRoller.filter(a => message.guild.roles.cache.has(a)).length) for (let id of komut.parametreler.verilecekRoller) hedef.roles.add(id);
            if (komut.parametreler.alinacakRoller.filter(a => message.guild.roles.cache.has(a)).length) for (let id of komut.parametreler.alinacakRoller) hedef.roles.remove(id);
            if (komut.parametreler.gonderilecekMesaj.length) message.channel.send(komut.parametreler.gonderilecekMesaj);
          }
        }
        }
      }
    }
  });
};
module.exports.execute = async (client, message, args, ayar, emoji) => {
  if(!conf.sahip.some(x => message.author.id == x) && !message.member.roles.cache.has(ayar.sahipRolu)) return message.reply('Bot yapımcılarına ve sunucu sahibine özeldir!').then(x => x.delete({timeout: 5000}));
  if (!db.get("özelkomut")) await db.set("özelkomut", []);
  if (args[0] == "ekle") {
    await message.delete();
    let mesaj = await message.channel.send("Özel komutun ismini yaz! (**10 saniye**, iptal etmek için **iptal**)");
    let komut = {};
    
    // özel komutun ismi; 
    message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 10000, errors: ["time"]})
      .then(async isim => {
      if (isim.first().content == ("iptal" || "i")) {
        isim.first().delete();
        mesaj.delete();
        return message.channel.send("İptal edildi.")
      };
      if (isim.first().content.includes(" ")) {
        mesaj.delete();
        isim.first().content;
        return message.channel.send("Komut ismi **boşluk** içeremez!");
      }
      if (db.get("özelkomut").find(a => a.isim == isim.first().content) || global.commands.has(isim.first().content)) {
        mesaj.delete();
        isim.first().content;
        return message.channel.send("**"+isim.first().content+"** isimli bir komut zaten var!");
      }
      if (isim.first().content.length > 20) return message.channel.send("Uzunluk 20'dan fazla olmamalı, işlem iptal edildi!");
      komut.isim = isim.first().content;
      isim.first().delete();
      await mesaj.edit("Özel komut prefix ile kullanılacaksa **evet**, prefixsiz kullanılacak ise **hayır** yazın. (**10 saniye**, iptal etmek için **iptal**)");
      
      // prefixli mi prefixsiz mi;
    message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 30000, errors: ["time"]})
      .then(prefix => {
      if (prefix.first().content == ("iptal" || "i")) {
        prefix.first().delete();
        mesaj.delete();
        return message.channel.send("İptal edildi.")
      } else if (prefix.first().content == ("evet" || "Evet" || "e" || "E" || "yes" || "ye" || "Yes")) {
        komut.prefix = true;
        prefix.first().delete();
        mesaj.edit("Özel komutun türünü yaz! (**rol/mesaj/özel kod**) (**10 saniye**, iptal etmek için **iptal**)");
      } else if (prefix.first().content == ("hayır" || "Hayır" || "h" || "n" || "no" || "No")) {
        komut.prefix = false;
        prefix.first().delete();
        mesaj.edit("Özel komutun türünü yaz! (**rol/mesaj/özel kod**) (**10 saniye**, iptal etmek için **iptal**)");
      } else {
        mesaj.delete();
        prefix.first().delete();
        return message.channel.send("**evet** veya **hayır** yazmadığınız için işlem iptal edildi!")
      }
      prefix.first().delete();
      
      // türü rol mesaj özel kod;
      message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 10000, errors: ["time"]})
      .then(tür => {
        if (tür.first().content == ("iptal" || "i")) {
        tür.first().delete();
        mesaj.delete();
        return message.channel.send("İptal edildi.")
      } else if (tür.first().content == "rol") {
        komut.tur = "rol";
        tür.first().delete();
        mesaj.edit("Tür **mesaj** ise gönderilecek mesajı, tür **rol** ise verilecek/alınacak rolleri ve gönderilecek mesajı, tür **özel kod** ise istediğiniz kodu yazın! (discord.js) İstemediğiniz seçenekler için **yok** yazabilirsiniz. Verilecek ve alınacak rollerden **en az 1 tanesine yok** yazabilirsiniz! Örneklerde verilen parametre sıralarını lütfen atlamayın. (**120 saniye**, iptal etmek için **iptal**)\n**Örnek(tür -> rol):**\n`gönderilecek mesaj: Başarılı! verilecek roller: 705472548430807172, 705472608782516305 alınacak roller: yok`\n**Örnek(tür -> mesaj):**\n`Bu bir tehdit mesajıdır!`\n**Örnek(tür -> özel kod):**\n```js\nlet embed = new Discord.MessageEmbed()\n.setTitle('Deneme embed başlığı')\n.setThumbnail(message.author.avatarURL({dynamic: true}))\n.setFooter(message.author.tag, message.author.avatarURL({dynamic: true}));\n\nmessage.channel.send(embed);```")      
      } else if (tür.first().content == "mesaj") {
        komut.tur = "mesaj";
        tür.first().delete();
        mesaj.edit("Tür **mesaj** ise gönderilecek mesajı, tür **rol** ise verilecek/alınacak rolleri ve gönderilecek mesajı, tür **özel kod** ise istediğiniz kodu yazın! (discord.js) İstemediğiniz seçenekler için **yok** yazabilirsiniz. Verilecek ve alınacak rollerden **en az 1 tanesine yok** yazabilirsiniz! Örneklerde verilen parametre sıralarını lütfen atlamayın. (**120 saniye**, iptal etmek için **iptal**)\n**Örnek(tür -> rol):**\n`gönderilecek mesaj: Başarılı! verilecek roller: 705472548430807172, 705472608782516305 alınacak roller: yok`\n**Örnek(tür -> mesaj):**\n`Bu bir tehdit mesajıdır!`\n**Örnek(tür -> özel kod):**\n```js\nlet embed = new Discord.MessageEmbed()\n.setTitle('Deneme embed başlığı')\n.setThumbnail(message.author.avatarURL({dynamic: true}))\n.setFooter(message.author.tag, message.author.avatarURL({dynamic: true}));\n\nmessage.channel.send(embed);```")      
      } else if (tür.first().content == ("özel kod" || "özel" || "ozel kod" || "kod")) {
        komut.tur = "özel kod";
        tür.first().delete();
        mesaj.edit("Tür **mesaj** ise gönderilecek mesajı, tür **rol** ise verilecek/alınacak rolleri ve gönderilecek mesajı, tür **özel kod** ise istediğiniz kodu yazın! (discord.js) İstemediğiniz seçenekler için **yok** yazabilirsiniz. Verilecek ve alınacak rollerden **en az 1 tanesine yok** yazabilirsiniz! Örneklerde verilen parametre sıralarını lütfen atlamayın. (**120 saniye**, iptal etmek için **iptal**)\n**Örnek(tür -> rol):**\n`gönderilecek mesaj: Başarılı! verilecek roller: 705472548430807172, 705472608782516305 alınacak roller: yok`\n**Örnek(tür -> mesaj):**\n`Bu bir tehdit mesajıdır!`\n**Örnek(tür -> özel kod):**\n```js\nlet embed = new Discord.MessageEmbed()\n.setTitle('Deneme embed başlığı')\n.setThumbnail(message.author.avatarURL({dynamic: true}))\n.setFooter(message.author.tag, message.author.avatarURL({dynamic: true}));\n\nmessage.channel.send(embed);```")
      } else {
        mesaj.delete();
        tür.first().delete();
        return message.channel.send("**rol**, **mesaj** veya **özel kod** yazmadığınız için işlem iptal edildi!")
      }
        
      //parametreler verilecek, alınacak roller, gönderilecek mesaj;
      message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 60000, errors: ["time"]})
        .then(parametreler => {
        if (parametreler.first().content == ("iptal" || "i")) {
          parametreler.first().delete();
          mesaj.delete();
          return message.channel.send("İptal edildi.")
        };
        if (tür.first().content == "rol") {
          if (parametreler.first().content.split(/gönderilecek mesaj: |verilecek roller: |alınacak roller: /).slice(1).length != 3) {
          parametreler.first().delete();
          mesaj.delete();
          return message.channel.send("Parametreleri verilen örnekteki gibi kullanmadığınız için iptal edildi!");
          } else {
            let içerik = parametreler.first().content.split(/gönderilecek mesaj: |verilecek roller: |alınacak roller: /).slice(1);
            komut.parametreler = {
              gonderilecekMesaj: içerik[0].includes("yok") ? null : içerik[0],
              verilecekRoller: içerik[1].split(", ").temizle(),
              alinacakRoller: içerik[2].split(", ").temizle()
            };
            parametreler.first().delete();
            mesaj.edit("Yapılacak işlemler komutu kullanan kişiye yapılacaksa **1**, belirtilen (etiketlenen, id girilen vb.) kişiye yapılacaksa **2** yazın.");
          } 
        } else if (tür.first().content == "mesaj") {
          komut.parametreler = {
            gonderilecekMesaj: parametreler.first().content
          };
          mesaj.edit("Yapılacak işlemler komutu kullanan kişiye yapılacaksa **1**, belirtilen (etiketlenen, id girilen vb.) kişiye yapılacaksa **2** yazın. (**15 saniye**, iptal etmek için **iptal**)");;
        } else if (tür.first().content == ("özel kod" || "özel" || "ozel kod" || "kod")) {
          parametreler.first().delete();
          komut.parametreler = {
            ozelKod: parametreler.first().content
          };
          mesaj.edit("Yapılacak işlemler komutu kullanan kişiye yapılacaksa **1**, belirtilen (etiketlenen, id girilen vb.) kişiye yapılacaksa **2** yazın.");
        }
        
      // işlemler kime yapılacak;
      message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 15000, errors: ["time"]})
        .then(işlemler => {
        if (işlemler.first().content == ("iptal" || "i")) {
        işlemler.first().delete();
        mesaj.delete();
        return message.channel.send("İptal edildi.")
      } else if (işlemler.first().content.includes("1")) {
        komut.hedefKisi = 1;
        işlemler.first().delete();
        mesaj.edit("Komutu kimlerin kullanabileceğini yazmalısın! Eğer herkes kullansın istiyorsanız sadece **yok** yazmanız yeterli. İstemediğiniz seçenekler için **yok** yazabilirsiniz. Örneklerde verilen parametre sıralarını lütfen atlamayın. (**30 saniye**, iptal etmek için **iptal**)\n**Örnek =>**\n`kişiler: 460813657811582986, 343496705196556288 roller: 656149441710915604 izinler: MANAGE_GUILD, MANAGE_CHANNELS`")
      } else if (işlemler.first().content.includes("2")) {
        komut.hedefKisi = 2;
        işlemler.first().delete();
        mesaj.edit("Komutu kimlerin kullanabileceğini yazmalısın! Eğer herkes kullansın istiyorsanız sadece **yok** yazmanız yeterli. İstemediğiniz seçenekler için **yok** yazabilirsiniz. Örneklerde verilen parametre sıralarını lütfen atlamayın. (**30 saniye**, iptal etmek için **iptal**)\n**Örnek =>**\n`kişiler: 460813657811582986, 343496705196556288 roller: 656149441710915604 izinler: MANAGE_GUILD, MANAGE_CHANNELS`")
      } else {
        mesaj.delete();
        işlemler.first().delete();
        return message.channel.send("**1** veya **2** yazmadığınız için işlem iptal edildi!");
      }
      
      // kimler kullanabilecek;
      message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 60000, errors: ["time"]})
        .then(kimler => {
        if (kimler.first().content == ("iptal" || "i")) {
          kimler.first().delete();
          mesaj.delete();
          return message.channel.send("İptal edildi.")
        };
        if (kimler.first().content.split(/kişiler: |roller: |izinler: /).slice(1).length != 3) {
          kimler.first().delete();
          mesaj.delete();
          return message.channel.send("Parametreleri verilen örnekteki gibi kullanmadığınız için iptal edildi!");
        } else {
          let içerik = kimler.first().content.split(/kişiler: |roller: |izinler: /).slice(1);
          komut.yetki = {
            kisiler: içerik[0].includes("yok") ? null : içerik[0].split(", ").temizle(),
            roller: içerik[1].includes("yok") ? null : içerik[1].split(", ").temizle(),
            izinler: içerik[2].includes("yok") ? null : içerik[2].split(", ").temizle()
          };
          kimler.first().delete();
          mesaj.edit("Komutun kullanılamayacak kanalları etiketle veya id belirt! Eğer bütün kanallarda kullanılsın istiyorsanız **yok** yazın. (**60 saniye**, iptal etmek için **iptal**)\n**Örnek =>** `#sohbet #öneri #destek`");
        };
        
      // hangi kanallarda kullanılabilecek;
      message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 30000, errors: ["time"]})
        .then(kanallar => {
        if (kanallar.first().content == ("iptal" || "i")) {
          kanallar.first().delete();
          mesaj.delete();
          return message.channel.send("İptal edildi.")
        };
        if (kanallar.first().content.includes("yok")) komut.karalisteKanallari = null;
        else komut.karalisteKanallari = kanallar.first().mentions.channels.filter(a => message.guild.channels.cache.has(a.id)).map(e => e.id).temizle();
        kanallar.first().delete();
        mesaj.edit("Özel komut başarıyla oluşturuldu detaylara bakmak için `özelkomut liste`!");
        db.push("özelkomut", komut);
          }).catch(err => { f(err, mesaj, 30); });
         }).catch(err => { f(err, mesaj, 60); });
        }).catch(err => { f(err, mesaj, 15); });
       }).catch(err => { f(err, mesaj, 60); });
      }).catch(err => { f(err, mesaj, 10); });
     }).catch(err => { f(err, mesaj, 10) });
    }).catch(err => { f(err, mesaj, 10) });
  } else if (args[0] == "sil") {
    let komutlar = db.get("özelkomut");
    if (!komutlar.length) return message.channel.send("Hiç özel komut bulunmuyor!");
    if (!args[1] || !komutlar.some(e => e.isim == args[1])) return message.channel.send(args[1] ? "**"+args[1]+"** isimli bir özel komutum yok!" : "Bir özel komut ismi yaz!");
    db.set("özelkomut", await db.get("özelkomut").filter(komut => komut.isim != args[1]));
    message.channel.send("**"+args[1]+"** isimli komut silindi!");
  } else if (args[0] == "liste") {
    let komutlar = db.get("özelkomut");
    if (!komutlar.length) return message.channel.send("Hiç özel komut bulunmuyor!");
    if (!args[1]) {
      message.channel.send(`# Özel komutun bilgilerine bakmak için "özelkomut liste <numara>" yazın!\n\n${komutlar.map((e, i) => `["${i}"] => İsim: "${e.isim}" | Tür: "${e.tur}" `).join("\n")}`, { code: "xl", split: true })
    } else {
      if (isNaN(args[1]) || !komutlar[args[1]]) return message.channel.send("**"+args[1]+"** numaralı bir özel komut yok!");
      let komut = komutlar[args[1]];
      let str = "", str2 = "";
      if (komut.tur == "mesaj") {
        str += `| Gönderilecek mesaj: ${komut.parametreler.gonderilecekMesaj}`
      } else if (komut.tur == "özel kod") {
      } else {
        if (komut.parametreler.gonderilecekMesaj) str += `\n | Gönderilecek mesaj: ${komut.parametreler.gonderilecekMesaj}\n`;
        if (komut.parametreler.verilecekRoller && komut.parametreler.verilecekRoller.length > 0) str += ` | Verilecek roller: ${komut.parametreler.verilecekRoller.filter(a => message.guild.roles.cache.has(a)).length ? komut.parametreler.verilecekRoller.filter(a => message.guild.roles.cache.has(a)).map(e => message.guild.roles.cache.get(e).name).join(", ") : "Yok!"}\n`
        if (komut.parametreler.alinacakRoller && komut.parametreler.alinacakRoller.length > 0) str += ` | Alınacak roller: ${komut.parametreler.alinacakRoller.filter(a => message.guild.roles.cache.has(a)).length ? komut.parametreler.alinacakRoller.filter(a => message.guild.roles.cache.has(a)).map(e => message.guild.roles.cache.get(e).name).join(", ") : "Yok!"}`
      }
      if (komut.yetki.kisiler && komut.yetki.kisiler.length > 0) str2 += `| Kişiler: ${komut.yetki.kisiler.filter(a => client.users.cache.has(a)).length ? komut.yetki.kisiler.filter(a => client.users.cache.has(a)).map(e => client.users.cache.get(e).tag).join(", ").replace(/'/, "").replace(/"/, "") : "Yok!"}\n`;
      if (komut.yetki.roller && komut.yetki.roller.length > 0) str2 += ` | Roller: ${komut.yetki.roller.filter(a => message.guild.roles.cache.has(a)).length ? komut.yetki.roller.filter(a => message.guild.roles.cache.has(a)).map(e => message.guild.roles.cache.get(e).name).join(", ").replace(/'/, "").replace(/"/, "") : "Yok!"}\n`;
      if (komut.yetki.izinler && komut.yetki.izinler.length > 0) str2 += ` | İzinler: ${komut.yetki.izinler.filter(a => client.perms.hasOwnProperty(a)).length ? komut.yetki.izinler.filter(a => client.perms.hasOwnProperty(a)).map(e => client.perms[e]).join(", ").replace(/'/, "").replace(/"/, "") : "Yok!"}`;
      message.channel.send(
`"İsim": ${komut.isim}
"Tür": ${komut.tur}
"Prefixli mi?": ${komut.prefix ? "Evet" : "Hayır"}
"İşlemler kime yapılacak?": ${komut.hedefKisi == 1 ? "Komutu kullanan kişiye" : "Belirtilen kişiye (etiket, id)"}
"Kullanılamayacak kanallar": ${komut.karalisteKanallari && komut.karalisteKanallari.length > 0 ? komut.karalisteKanallari.filter(a => message.guild.channels.cache.has(a)).map(e => message.guild.channels.cache.get(e).name).join(", ") : "Yok!"}
"Yapılacak işlemler": ${str.length ? str.replace(/'/, "").replace(/"/, "") : "Bu komut özel bir kod ile çalışıyor! ('discord.js')"}
"Kullanabilecek yetkiler:" ${str2.length ? "\n "+str2.replace(/'/, "").replace(/"/, "") : "Herkese açık!"}`, { code: "py", split: true })
    }
  } else {
    return message.channel.send("**ekle**, **sil** veya **liste** yazmalısın!");
  }
  function f(b, c, d) {
    console.log(b); 
    c.delete(); 
    message.channel.send(`Bir hata oluştu, muhtemelen **${d} saniye** içinde cevap vermediğiniz için iptal edildi.`);
    return true;
  }
};
module.exports.configuration = {
    name: "özelkomut",
    aliases: ['özel-komut'],
    usage: "özelkomut ekle/sil/liste",
    description: "Sunucuya özel komut."
};