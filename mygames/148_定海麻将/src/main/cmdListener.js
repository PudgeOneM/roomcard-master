
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
                        case GAME_SCENE_FREE: //等待开始
                        {
                            var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusFree') 
                            cmdBaseWorker.onCMD_StatusFree(body)

                            var event = new cc.EventCustom("cmdEvent")
                            event.setUserData(['onCMD_StatusFree'])
                            cc.eventManager.dispatchEvent(event)
                            break
                        }
                        case GAME_SCENE_CALL:  //叫分
                        {
                            var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusCall') 
                            cmdBaseWorker.onCMD_StatusCall(body)

                            var event = new cc.EventCustom("cmdEvent")
                            event.setUserData(['onCMD_StatusCall'])
                            cc.eventManager.dispatchEvent(event)
                            break
                        }
                        case GAME_SCENE_PLAY: //游戏进行
                        {
                            var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusPlay') //游戏
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
                case SUB_S_CALL_NOTIFY:   //叫分通知?  下跑 加顶分
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_CallNotify') 
                    cmdBaseWorker.onCMD_CallNotify(body)

                    var event = new cc.EventCustom("cmdEvent")
                    event.setUserData(['onCMD_CallNotify'])
                    cc.eventManager.dispatchEvent(event)
                    break
                }  
                case SUB_S_CALL_RESULT:   //叫分结果
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_CallResult') 
                    cmdBaseWorker.onCMD_CallResult(body)

                    var event = new cc.EventCustom("cmdEvent")
                    event.setUserData(['onCMD_CallResult'])
                    cc.eventManager.dispatchEvent(event)
                    break
                } 
                case SUB_S_GAME_START:  //游戏开始
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_GameStart') 
                    cmdBaseWorker.onCMD_GameStart(body)
                    
                    var event = new cc.EventCustom("cmdEvent")
                    event.setUserData(['onCMD_GameStart'])
                    cc.eventManager.dispatchEvent(event)
                    break
                }  
                case SUB_S_OUT_CARD:  //出牌命令
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_OutCard') 
                    cmdBaseWorker.onCMD_OutCard(body)

                    var event = new cc.EventCustom("cmdEvent")
                    event.setUserData(['onCMD_OutCard'])
                    cc.eventManager.dispatchEvent(event)
                    break
                }   
                case SUB_S_SEND_CARD:  //发送扑克
                {  
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_SendCard') 
                    cmdBaseWorker.onCMD_SendCard(body)

                    var event = new cc.EventCustom("cmdEvent")
                    event.setUserData(['onCMD_SendCard'])
                    cc.eventManager.dispatchEvent(event)
                    break
                }
                case SUB_S_OPERATE_RESULT: //操作命令
                {  
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_OperateResult') 
                    cmdBaseWorker.onCMD_OperateResult(body)

                    var event = new cc.EventCustom("cmdEvent")
                    event.setUserData(['onCMD_OperateResult'])
                    cc.eventManager.dispatchEvent(event)
                    break
                }
                case SUB_S_GAME_END: //游戏结束
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



