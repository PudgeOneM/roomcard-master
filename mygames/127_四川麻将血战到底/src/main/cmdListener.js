
var cmdListener = 
{   
    init:function()
    {
        cmdBaseWorker.init()
    },
    //当局发的牌
    enterListener:function(msg)
    {
        var head = buffer2StructObj(msg.slice(0, 8), 'TCP_Head') 
        switch(head.CommandInfo.wMainCmdID)
        {
        case MDM_GF_FRAME: //100
            {   
                switch(head.CommandInfo.wSubCmdID)
                {
                case SUB_GF_GAME_SCENE://在发出SUB_GF_GAME_OPTION时会收到这条协议  
                {   
                    cmdListener.init()
                    switch(tableData.CMD_GF_GameStatus.cbGameStatus)
                    {
                        case GAME_SCENE_FREE:
                        {
                            var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusFree') 
                            cmdBaseWorker.onCMD_StatusFree(body)

                            var event = new cc.EventCustom("cmdEvent")
                            event.setUserData(['onCMD_StatusFree'])
                            cc.eventManager.dispatchEvent(event)
                            break
                        }
                        case GAME_SCENE_CALL:
                        {
                            var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusCall') 
                            cmdBaseWorker.onCMD_StatusCall(body)

                            var event = new cc.EventCustom("cmdEvent")
                            event.setUserData(['onCMD_StatusCall'])
                            cc.eventManager.dispatchEvent(event)
                            break
                        }
                        case GAME_SCENE_PLAY:
                        {
                            var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusPlay') 
                            cmdBaseWorker.onCMD_StatusPlay(body)

                            var event = new cc.EventCustom("cmdEvent")
                            event.setUserData(['onCMD_StatusPlay'])
                            cc.eventManager.dispatchEvent(event)
                            break
                        }
                    }
                    
                    var l = function(msg)
                    {   
                        tableData.gameListener(msg)
                        cmdListener.gameListener(msg)
                    }
                    socket.registSocketListener(l)
                    break
                }      
                }
                break
            }
        }
        if(body)
        {
            gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
        }
    },
    gameListener:function(msg)
    {
        var head = buffer2StructObj(msg.slice(0, 8), 'TCP_Head') 
        switch(head.CommandInfo.wMainCmdID)
        {
        case MDM_GF_GAME:  //游戏消息 200
            {
                switch(head.CommandInfo.wSubCmdID)
                { 
                case SUB_S_CALL: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_Sel') 
                    cmdBaseWorker.onCMD_Call(body)

                    var event = new cc.EventCustom("cmdEvent")
                    event.setUserData(['onCMD_Call'])
                    cc.eventManager.dispatchEvent(event)
                    break
                } 
                case SUB_S_OPENINGOPERATE: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_OpeningMask') 
                    cmdBaseWorker.onCMD_OpeningMask(body)

                    var event = new cc.EventCustom("cmdEvent")
                    event.setUserData(['onCMD_OpeningMask'])
                    cc.eventManager.dispatchEvent(event)
                    break
                }   
                case SUB_S_GAME_START: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_GameStart') 
                    cmdBaseWorker.onCMD_GameStart(body)
                    
                    var event = new cc.EventCustom("cmdEvent")
                    event.setUserData(['onCMD_GameStart'])
                    cc.eventManager.dispatchEvent(event)
                    break
                }  
                case SUB_S_OUT_CARD: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_OutCard') 
                    cmdBaseWorker.onCMD_OutCard(body)

                    var event = new cc.EventCustom("cmdEvent")
                    event.setUserData(['onCMD_OutCard'])
                    cc.eventManager.dispatchEvent(event)
                    break
                }   
                case SUB_S_SEND_CARD: 
                {  
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_SendCard') 
                    cmdBaseWorker.onCMD_SendCard(body)

                    var event = new cc.EventCustom("cmdEvent")
                    event.setUserData(['onCMD_SendCard'])
                    cc.eventManager.dispatchEvent(event)
                    break
                }
                case SUB_S_OPERATE_RESULT: 
                {  
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_OperateResult') 
                    cmdBaseWorker.onCMD_OperateResult(body)

                    var event = new cc.EventCustom("cmdEvent")
                    event.setUserData(['onCMD_OperateResult'])
                    cc.eventManager.dispatchEvent(event)
                    break
                }
                case SUB_S_GANG_SCORE:
                {
                    gameLog.log("!~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_GangScore') 
                    cmdBaseWorker.onCMD_GangScore(body)

                    var event = new cc.EventCustom("cmdEvent")
                    event.setUserData(['onCMD_GangScore'])
                    cc.eventManager.dispatchEvent(event)
                    break
                }
                case SUB_S_GAME_END: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_GameEnd') 
                    cmdBaseWorker.onCMD_GameEnd(body)

                    var event = new cc.EventCustom("cmdEvent")
                    event.setUserData(['onCMD_GameEnd'])
                    cc.eventManager.dispatchEvent(event)
                    break
                }   
                }
                break
            }
        }

        if(body)
        {
            gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
        }
    },

}



