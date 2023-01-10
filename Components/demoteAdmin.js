
module.exports = async (client,msg,t) => {

    const chat = await msg.getChat();
    
    if(chat.isGroup){

        let from = msg.author || msg.from
        
        for (let k of chat.participants){
            
            if(from == k.id._serialized){

                if(k.isAdmin){
                    
                    await msg.react('⚡');
                    
                    let commandAuthor = await client.getContactById(from)
    
                    console.log(`${t['main']} called at Group : '${chat.name}' by ${commandAuthor.name} aka ${commandAuthor.number}`);
    
                    if(msg.hasQuotedMsg){
                        let og = await msg.getQuotedMessage()
                        let ogAuth = og.author || og.from
    
                        for ( let p of chat.participants){
    
                            if (p.id._serialized == ogAuth){

                                let mentions = []
                                mentions.push(await client.getContactById(p.id._serialized))
                                mentions.push(await client.getContactById(from));
    
                                if(!p.isAdmin){
                                    msg.reply('alredi not admin vro')
                                }
                                else{
                                    await chat.demoteParticipants([ogAuth])
                                    msg.reply(`demoted @${p.id.user} by @${from.split("@")[0]}`, null,{ mentions});

                                }
                            }
                        }                    
                        
                    }
                    else{
    
                        let mentions = await msg.getMentions()
    
                        let toDemote = []
                        let toDemoteText =[]    
                        let alreadyDemotedText = []
    
    
                        if(mentions.length==0){
                            msg.reply('atleast one member should be mentioned or tagged to promote')
                        }
    
                        else{
    
                            for(let p of chat.participants){
    
                                for ( let i of mentions){
                                    if(i.id._serialized == p.id._serialized){
    
                                        if(!p.isAdmin){
                                            alreadyDemotedText.push( `@${p.id.user}`)
                                        }
                                        else{
                                            toDemote.push(p.id._serialized)
                                            toDemoteText.push( `@${p.id.user}`)
                                        }
                                        
                                    }
                                }
                            }
    
                            
                            mentions.push(await client.getContactById(from));
                            
                            if(toDemoteText.length==0){
                                msg.reply(`Members mentioned are already not admins`);
                            }
                            else{
    
                                await chat.demoteParticipants(toDemote)
    
                                if(alreadyDemotedText.length==0){
                                    msg.reply(`demoted ${toDemoteText.join(', ')} by @${from.split("@")[0]}`, null,{ mentions});
                                }
                                else if(alreadyDemotedText.length.length==1){
                                    msg.reply(`demoted ${toDemoteText.join(', ')} by @${from.split("@")[0]} ~ ${alreadyDemotedText.join(', ')} is already not an admin`, null,{ mentions});
                                }
                                else{
                                    msg.reply(`demoted ${toDemoteText.join(', ')} by @${from.split("@")[0]} ~ ${alreadyDemotedText.join(', ')} are already not admins`, null,{ mentions});
                                }
                            }
                        }
    
                    }
                }
                else{
                    await msg.reply('not an admin vro')
                }
                
            }
        }        
    }
    else{
        msg.reply('use the command in GroupChat vro')
    }
    
}


