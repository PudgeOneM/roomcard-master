
var playData = 
{   
    playStateMachine:null,
    //当局发的牌
    handCardIdxs:[],
    wGiveUpChairID1:null,
    lastOutCardType:{},
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
                    if(!gameStateMachine.machine)
                        playData._initPlayStateMachine()
                    switch(tableData.CMD_GF_GameStatus.cbGameStatus)
                    {
                        case GAME_SCENE_FREE:
                        {
                            var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusFree') 
                            gameStateMachine.goState(null, 'free', body)
                            break
                        }
                        case GAME_SCENE_CALL:
                        {
                            var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusCall') 
                            
                            playNode.refreshJiaopaiTTF(body.cbGameType)
                            playNode.callExit( body.wTurnChairID, body.cbParam1, body.cbParam2 )

                            var c = tableData.getUserWithUserId(selfdwUserID).wChairID
                            if(body.cbHandCardCount[c])
                                playData.handCardIdxs = body.cbHandCardData.slice(0, body.cbHandCardCount[c])

                            gameStateMachine.goState(null, 'score', body)
                            break
                        }
                        case GAME_SCENE_PLAY:
                        {
                            var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusPlay')                             

                            playData.initHandCardIdxs(body.cbHandCardData, body.cbHandCardCount)
                            if( playData.handCardIdxs.length!=0 )
                                playNode.sendCardsAction(playData.handCardIdxs) 

                            var idxs = body.cbTurnCardData.slice(0,body.cbTurnCardCount)
                            if(idxs.length!=0)
                            {
                                playData.formatOutCards(cardLogic.sortWithNum(idxs))
                                playNode.outCard(body.wTurnWiner, playData.lastOutCardType.idxs)
                            }

                            for(var i=0;i<GAME_PLAYER;i++)
                            {                        
                                if(body.cbWinPosition[i])
                                    playNode.showSingleWinPosition(i, body.cbWinPosition[i])
                            }
    
                            gameStateMachine.goState(null, 'count', body)
                            break
                        }
                    }
                    
                    break
                }      
                }
                break
            }
        case MDM_GF_GAME:  //游戏消息 200
            {
                switch(head.CommandInfo.wSubCmdID)
                {
                // case SUB_S_USER_COME: 
                // {   
                //     var body = buffer2StructObj(msg.slice(8), 'CMD_S_UserCome') 
                //     break
                // }  
                case SUB_S_GAME_CONCLUDE: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_GameConclude')
                    body.isScore2Free = gameStateMachine.machine.current == 'score'
                    body.msg = (body.cbQinShui?'清水 底分':'混水 底分') + body.lCellScore + '*' + body.lScoreTimes
                    for(var i in body.szNickName)
                    {
                        body.szNickName[i] = body.szNickName[i].join('')
                    }
                    gameStateMachine.goState(null, 'free', body)
                    break
                }     
                case SUB_S_GAME_START: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_GameStart') 
                    body.cbTurnType = 0
                    var c = tableData.getUserWithUserId(selfdwUserID).wChairID
                    if(body.cbCardCount[c])
                        playData.handCardIdxs = body.cbCardData.slice(0,body.cbCardCount[c])

                    gameStateMachine.goState(null, 'score', body)
                    break
                }  
                // case SUB_S_BANKER_INFO:
                // {   
                //     var body = buffer2StructObj(msg.slice(8), 'CMD_S_BankerInfo') 
                //     break
                // }  
                case SUB_S_OUT_CARD: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_OutCard') 

                    //更新 playData.lastOutCardType
                    playData.formatOutCards(cardLogic.sortWithNum(body.cbOutCardData.slice(0,body.cbOutCardCount) ))
                    
                    //刷新基础分X倍数
                    playNode.refreshScoreTTF(body.lCellScore+'X'+body.lScoreTimes)

                    //刷新头家
                    if(body.cbSingleWinPosition)
                        playNode.showSingleWinPosition(body.wOutCardUser, body.cbSingleWinPosition)

                    ////
                    playNode.outCardExit(body.wOutCardUser)
                    playNode.outCardEnter(body.wCurrentUser)

                    ////////
                    if(playData.lastOutCardType.typeLevel>1)
                    {
                        var spr = actionFactory.getSprWithAnimate('bomb_', true, 0.15)
                        spr.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.6) )
                        mainScene.uiTop.addChild(spr) 
                        managerAudio.playEffect('gameRes/sound/bomb.mp3')
                    }
                    break
                }   
                case SUB_S_PASS_CARD: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_PassCard') 
                    if(body.cbTurnOver)
                    {
                        playData.lastOutCardType = {}
                        for(var i=0;i<GAME_PLAYER;i++)
                            playNode.clearOutCards(i)
                    }

                    playNode.outCardExit(body.wPassCardUser, true)
                    playNode.outCardEnter(body.wCurrentUser)

                    break
                }   
                case SUB_S_CALL_CARD: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_CallCard') 
                    playNode.refreshScoreTTF(body.lCellScore+'X'+body.lScoreTimes)
                    playNode.refreshJiaopaiTTF(body.cbGameType)

                    if(!body.bStartGame)
                    {
                        playNode.callExit(body.wTurnChairID, body.cbParam1, body.cbParam2)
                        playNode.callEnter(body.wCurrentUser, body.cbTurnType)
                    } 
                    else
                    {
                        var self = tableData.getUserWithUserId(selfdwUserID)
                        for(var i=0;i<GAME_PLAYER;i++)
                        {
                            cbGetCard = body.cbGetCard[i]
                            if(cbGetCard && cbGetCard[i]!=0)
                            {
                                if(self.wChairID == i)
                                {
                                    playData.handCardIdxs = playData.handCardIdxs.concat(cbGetCard)
                                    playNode.sendCardsAction(playData.handCardIdxs) 
                                }
                                else
                                    playNode.minusHandCardsNum(tableData.getUserWithChairId(i), -3)
                            }
                        }
                        gameStateMachine.goState(null, 'count', body)
                    } 

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
    hasGetSendCardsWithdwUserID:function(dwUserID)
    {
        var user = tableData.getUserWithUserId(dwUserID)  
        return user.wChairID != playData.wGiveUpChairID1
    },
    onenterfree:function()
    {
        playData.handCardIdxs = []
        playData.lastOutCardType = {}
    },
    formatOutCards:function(sortedIdxs)
    {
        for(var i in sortedIdxs) //3821只有大小王是癞子 不改类型 可以这样特殊处理下 
        {
            var c = sortedIdxs[i]
            if(c && c >=80)
            {
                sortedIdxs[i] = c + 78*16
            }
        }

        playData.lastOutCardType = gameLogic.getCardsType(sortedIdxs) 
    },
    initHandCardIdxs:function(bCardData, bCardCount)
    {   
        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if(self.wChairID == i)
                playData.handCardIdxs = bCardData.slice(0, bCardCount[i] )

            var user = tableData.getUserWithChairId(i)
            if(user.dwUserID != selfdwUserID)
                playNode.setHandCardsNum( user, bCardCount[i] )
        }
    },
    reset:function()
    {
        gameStateMachine.reset()

        playData.handCardIdxs = []
        playData.wGiveUpChairID1 = null
        playData.lastOutCardType = {}
        if( playData.intervalIdOfStartNewRound )
        {   
            window.clearInterval(playData.intervalIdOfStartNewRound)
            playData.intervalIdOfStartNewRound = null
        }
    },
    _initPlayStateMachine:function()  
    {
        var callbacks = 
        {
             onafterevent: function(event, from, to, args) 
              { 
              },

              //free
              onenterfree: function(event, from, to, args)  //只有在free状态 并且 是坐下状态才会发ready
              { 
                gameLog.log("onenterfree") 
                playNode.onenterfree()
                playData.onenterfree()

                playNode.refreshScoreTTF(args.lCellScore+'X'+args.lScoreTimes)
                playNode.refreshJiaopaiTTF(0)

                var call = function()
                {
                    tableData.updateOnFree( GAME_PLAYER )
                }
                //call()
                playData.intervalIdOfStartNewRound = window.setInterval(call, 1000)//每秒判断
              },
              onleavefree: function(event, from, to, args) 
              { 
                gameLog.log("onleavefree");  
                window.clearInterval(playData.intervalIdOfStartNewRound)
                playData.intervalIdOfStartNewRound = null

                var spr = actionFactory.getSprWithAnimate('start_', true, 0.15, function()
                {   
                    gameStateMachine.machine.transition()
                })

                spr.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.6) )
                mainScene.uiTop.addChild(spr) 
                managerAudio.playEffect('gameRes/sound/start.mp3')

                return StateMachine.ASYNC
              },

              //score
              onenterscore: function(event, from, to, args) 
              { 
                gameLog.log("onenterscore")  

                for(var i=0;i<GAME_PLAYER;i++)
                {
                    var user = tableData.getUserWithChairId(i)
                    if(user.dwUserID != selfdwUserID)
                        playNode.setHandCardsNum(user, 16)
                }
                if( playData.handCardIdxs.length!=0 )
                    playNode.sendCardsAction(playData.handCardIdxs) 

                playNode.refreshScoreTTF(args.lCellScore+'X'+args.lScoreTimes)
                playNode.callEnter(args.wCurrentUser, args.cbTurnType)
                
              },
              onleavescore: function(event, from, to, args) 
              { 
                gameLog.log("onleavescore"); 

                var self = tableData.getUserWithUserId(selfdwUserID)
                playNode.callExit(args.wTurnChairID)
                for(var i=0;i<GAME_PLAYER;i++)
                    playNode.clearCallCard(i)
                
                setTimeout(function()
                {
                    gameStateMachine.machine.transition()
                })
                return StateMachine.ASYNC
              },

              //count
              onentercount: function(event, from, to, args) 
              { 
                gameLog.log("onentercount");  
                if(!args.isScore2Free)
                {
                    var self = tableData.getUserWithUserId(selfdwUserID)
                    playNode.refreshScoreTTF(args.lCellScore+'X'+args.lScoreTimes)
                    playNode.refreshJiaopaiTTF(args.cbGameType)
                    tableNode.setBankerIcon(args.wBankChairID, true)

                    //wGiveUpChairID1
                    playData.wGiveUpChairID1 = args.wGiveUpChairID1
                    if(playData.wGiveUpChairID1 != INVALID_WORD && playData.wGiveUpChairID1 == self.wChairID)
                    {
                        playData.handCardIdxs = []
                        playNode.clearHandCards()
                    }

                    playNode.outCardEnter(args.wCurrentUser, args.cbTimeOutCard)
                    playNode.showDrawCardNode(3)
                    playNode.updateDiCard(args.cbDiCardData)
                }

              },
              onleavecount: function(event, from, to, args) 
              { 
                gameLog.log("onleavecount");
                playNode.onleavecount()

                playNode.refreshScoreTTF(args.lCellScore+'X'+args.lScoreTimes)
                playNode.refreshJiaopaiTTF(args.cbGameType)
                
                var callback = function()
                {
                    headIconPop.kickUserOnGameEnd()
                    for(var i=0;i<GAME_PLAYER;i++)
                    {
                        tableNode.setBankerIcon(i, false)
                    }
                }

                playNode.leaveCountAction(callback, args)
                setTimeout(function()
                {
                    var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
                    record.szTableKey = tableKey
                    socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
                },2000)
                
                return StateMachine.ASYNC  
              },
        }

        gameStateMachine.initMachine(callbacks)
    }
}



