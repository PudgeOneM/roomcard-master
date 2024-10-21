
var playData = 
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
                                if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT)
                                {
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
                            //topUI.ruleNode.visible = false;
                         }
                         else
                         {
                            //if(mainScene._cbRule == RULE_NULL)
                                //topUI.ruleNode.visible = true;
                         }
                        break
                    }
                }
            }
            break
        }
        switch(head.CommandInfo.wMainCmdID)
        {
            case MDM_GF_GAME:       //游戏消息 200
            {
                switch(head.CommandInfo.wSubCmdID)
                {
                    case SUB_S_GAME_START: 
                    {   
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_GameStart');
                        return mainScene.onSubGameStart(body);
                    }  
                    case SUB_S_OUT_CARD:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_OutCard');
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
                    case SUB_S_REPLACE_CARD:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_ReplaceCard');
                        return mainScene.onSubReplaceCard(body);
                    }  
                    case SUB_S_GAME_GM:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_GAME_GM');
                        return mainScene.onSubGameGM(body); 
                    }

                    case SUB_S_TING_CARDS:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_ListenData');
                        return mainScene.onSubListenCards(body); 
                    }

                    case SUB_S_RULE_RESULT:
                    {
                        var body = buffer2StructObj(msg.slice(8), 'CMD_S_RULE_RESULT');
                        return mainScene.onSubRuleSetResult(body);  
                    }
                }
                break;
            }
        }
    }
}












