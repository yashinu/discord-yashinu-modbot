const {MessageEmbed}= require("discord.js");
const qdb = require("quick.db");
const cdb = new qdb.table("cezalar");
const db = new qdb.table("ayarlar");

module.exports = (oldState, newState) => {
  if((!oldState.channel && newState.channel) || (oldState.channel && newState.channel)){ // Kanal değiştirmek ya da kanaldan çıkmak.
    let data = cdb.get("tempsmute") || [{id: null,kalkmaZamani: null}];
    let member = newState.member;
    if(!member) return;
    if(data.some(d => d.id == member.id)){
      let d = data.find(x => x.id == member.id);
      if(Date.now() >= d.kalkmaZamani){
        data = data.filter(d => d.id != member.id);
        member.roles.remove("721069802784948247");
        uye.voice.setMute(false)
        cdb.set("tempsmute", data);
      } else if(member.voice.channel && !member.voice.serverMute){
        member.roles.add("721069802784948247");
        uye.voice.setMute(true)
      }
    }
  }
}

module.exports.configuration = {
  name: "voiceStateUpdate"
}