
var playData = 
{   
    socketListener:function(msg)
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
                        switch(tableData.CMD_GF_GameStatus.cbGameStatus)
                        {
                            case GAME_SCENE_FREE:
                            {
                                var l = function(msg)
                                {   
                                    tableData.gameListener(msg)
                                    playData.socketListener(msg)
                                    playData.socketGameListener(msg)
                                }
                                socket.registSocketListener(l)
                                mainScene.scene.schedule(mainScene.updateTableUser, 1, 9999, 0);
                                if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT)
                                {
                                    socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
                                }
                                var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusFree');
                                if (body.bGameSetEnd == false)
                                {
                                    mainScene.gameSetInfo();
                                }
                                else
                                {
                                    mainScene.onSubGameSetResult(body.bGameSet);
                                }
                                break;
                            }
                            case GAME_SCENE_PLAY: //无此状态
                            {
                                var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusPlay');
                                if(body)
                                {
                                    gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
                                }                           
                                mainScene.onEventScenePlay(body);
                                var l = function(msg)
                                {   
                                    tableData.gameListener(msg)
                                    playData.socketGameListener(msg)
                                }
                                socket.registSocketListener(l)
                                break;
                            }
                        }
                        
                        break
                    }     
                }
                break;
            }
        }
    },
    socketGameListener:function(msg)
    {
        var head = buffer2StructObj(msg.slice(0, 8), 'TCP_Head') 
        switch(head.CommandInfo.wMainCmdID)
        {
            case MDM_GF_GAME:       //游戏消息 200
            {
                switch(head.CommandInfo.wSubCmdID)
                {
                    case SUB_S_GAME_START: 
                    {   
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_GameStart');
                        if(body)
                        {
                            gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
                        }    
                        return mainScene.onSubGameStart(body);
                    }  
                    case SUB_S_OUT_CARD:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_OutCard');
                        if(body)
                        {
                            gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
                        }   
                        return mainScene.onSubOutCard(body);
                    }
                    case SUB_S_OPERATE_NOTIFY:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_OperateNotify');
                        return mainScene.onSubOperateNotify(body);
                    }
                    case SUB_S_OPERATE_RESULT:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_OperateResult');
                        return mainScene.onSubOperateResult(body);
                    }
                    case SUB_S_SEND_CARD:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_SendCard');
                        return mainScene.onSubSendCard(body);
                    }
                    case SUB_S_GAME_END:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_GameEnd');
                        return mainScene.onsubGameEnd(body); 
                    }
                    case SUB_S_GAME_GM:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_GAME_GM');
                        return mainScene.onSubGameGM(body); 
                    }
                    case SUB_S_GAMESET_RESULT:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_GAMESET_RESULT');
                        return mainScene.onSubGameSetResult(body.bGameSet); 
                    }
                }
                break;
            }
        }
    }
}











