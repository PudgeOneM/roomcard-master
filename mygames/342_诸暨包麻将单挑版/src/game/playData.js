
var playData = cmdListener =
{   
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
                        switch(tableData.CMD_GF_GameStatus.cbGameStatus)
                        {
                            case GAME_SCENE_FREE:
                            {
                                mainScene.scene.schedule(mainScene.updateTableUser, 1, 9999, 0);
                                gameLog.log("玩家状态");
                                if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT)
                                {
                                    //gameLog.log("发送准备");
                                    socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
                                }
                                var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusFree');
                                mainScene.gameSetInfo(body);
                                mainScene.scene.schedule(mainScene.updateOnFree, 1);
                                break;
                            }
                            case GAME_SCENE_PLAY: //无此状态
                            {
                                var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusPlay');                        
                                mainScene.onEventScenePlay(body);
                                mainScene.scene.schedule(mainScene.updateOnFree, 1);
                                break;
                            }
                        }
                        var l = function(msg)
                        {   
                            tableData.gameListener(msg)
                            playData.gameListener(msg)
                        }
                        socket.registSocketListener(l)
                        break
                    }     
                }
                break;
            }
        }
    },
    gameListener:function(msg)
    {
        var head = buffer2StructObj(msg.slice(0, 8), 'TCP_Head') 
        switch(head.CommandInfo.wMainCmdID)
        {
            case MDM_GR_STATUS:
            {
                switch(head.CommandInfo.wSubCmdID)
                {
                    case SUB_GR_TABLE_OWNER:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_GR_TableOwner') 
                        tableData.managerUserID = body.dwTableOwner
                         if(tableData.managerUserID != selfdwUserID)
                         {
                            //topUI.nodeCunType.visible = false;
                         }
                         else
                         {
                            //if(mainScene._cbCun == CUN_NULL)
                                //topUI.nodeCunType.visible = true;
                         }
                        break
                    }
                }
            }
            break;

            case MDM_GF_GAME:       //游戏消息 200
            {
                switch(head.CommandInfo.wSubCmdID)
                {
                    case SUB_S_GAME_START: 
                    {   
                        gameLog.logS = "";
                        gameLog.log("游戏开始");
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
                        if(body)
                        {
                            gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
                        } 
                        return mainScene.onSubOperateNotify(body);
                    }
                    case SUB_S_OPERATE_RESULT:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_OperateResult');
                        if(body)
                        {
                            gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
                        }  
                        return mainScene.onSubOperateResult(body);
                    }
                    case SUB_S_SEND_CARD:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_SendCard');
                        if(body)
                        {
                            gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
                        }  
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
                    case SUB_S_DINGTAI_NOTIFY:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_DINGTAI_NOTIFY');
                        if(body)
                        {
                            gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
                        } 
                        return mainScene.onSubDingTaiNotify(body); 
                    }
                    case SUB_S_DINGTAI_RESULT:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_DINGTAI_RESULT');
                        if(body)
                        {
                            gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
                        } 
                        return mainScene.onSubDingTaiResult(body); 
                    }
                    case SUB_S_DINGCS_NOTIFY:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_DINGCS_NOTIFY');
                        if(body)
                        {
                            gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
                        } 
                        return mainScene.onSubDingCSNotify(body); 
                    }
                    case SUB_S_DINGCS_RESULT:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_DINGCS_RESULT');
                        if(body)
                        {
                            gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
                        } 
                        return mainScene.onSubDingCSResult(body);  
                    }
                    case SUB_S_CUN_RESULT:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_CUN_RESULT');
                        if(body)
                        {
                            gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
                        } 
                        return mainScene.onSubCunResult(body);  
                    }
                    case SUB_S_YI_LUN_RESULT:
                    {

                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_YI_LUN_RESULT');
                        if(body)
                        {
                            gameLog.log('body:' + head.CommandInfo.wMainCmdID + '-' + head.CommandInfo.wSubCmdID, body)
                        } 
                        return mainScene.onSubYiLunResult(body);  
                        
                    }

                }
                break;
            }
        }
    }
}












