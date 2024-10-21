
var playData = 
{   
    playStateMachine:null,
    //当局发的牌
    handCardIdxs:[],
    lastOutCardType:{},
    // wGiveUpChairID1:null,
    wBankerUser:null,
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
                    if(!gameStateMachine.machine)
                        playData._initPlayStateMachine()

                    switch(tableData.CMD_GF_GameStatus.cbGameStatus)
                    {
                        //等待开始
                        case GS_T_FREE:
                        {
                            var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusFree') 
                            gameStateMachine.goState(null, 'free', body)
                            break
                        }
                        //叫分状态
                        case GS_T_CALL:
                        {
                            var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusCall') 
     
                            playNode.refreshScoreTTF(body.cbBankerScore)
                            for(var i=0;i<GAME_PLAYER;i++)
                            {
                                if(body.cbScoreInfo[i]!=0)
                                    playNode.callCard(i, body.cbScoreInfo[i])
                            }

                            playData.initHandCardIdxs(body.cbHandCardData, [17, 17, 17])
                            if( playData.handCardIdxs.length!=0 )
                                playNode.sendCardsAction(playData.handCardIdxs) 

                            body.cbCurrentScore = body.cbBankerScore
                            gameStateMachine.goState(null, 'score', body)
                            break
                        }
                        //游戏进行
                        case GS_T_PLAY:
                        {
                            var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusPlay') 
                            
                            playNode.refreshJiaopaiTTF(Math.pow(2,body.cbBombCount))
                            playData.wBankerUser = body.wBankerUser

                            playNode.refreshScoreTTF(body.cbBankerScore)

                            playData.initHandCardIdxs(body.cbHandCardData, body.cbHandCardCount)
                            if( playData.handCardIdxs.length!=0 )
                                playNode.sendCardsAction(playData.handCardIdxs) 

                            var idxs = body.cbTurnCardData.slice(0,body.cbTurnCardCount)
                            if(idxs.length!=0)
                            {
                                playData.formatOutCards(cardLogic.sortWithNum(idxs))
                                playNode.outCard(body.wTurnWiner, playData.lastOutCardType, true)
                            }

                            body.wTurnChairID = body.wTurnWiner //出牌玩家
                            gameStateMachine.goState(null, 'count', body)
                            break
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
                case SUB_S_SET_BASESCORE: 
                {   
                    break
                }  
                case SUB_S_GAME_CONCLUDE: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_GameConclude') 

                    // body.lGameScore = body.lGameScore
                    // body.cbHandCardData = body.cbHandCardData
                    // body.cbCardCount = body.cbCardCount
                    body.msg = '底分：' + playNode.scoreTTF.getString() + '*' + Math.pow(2, body.cbBombCount)
                    body.wBankChairID = playData.wBankerUser
                    body.szNickName = []
                    body.cbWinFlag = []
                    var normalEnd = true
                    for(var i=0;i<GAME_PLAYER;i++)
                    {
                        var user = tableData.getUserWithChairId(i)
                        if(user)
                        {
                            body.szNickName[i] = user.szNickName
                        }

                        if(i==body.wUser)
                        {
                            body.cbWinFlag[i] = 6
                            normalEnd = false
                        }
                    }

                    if(normalEnd)
                    {
                       for(var i=0;i<GAME_PLAYER;i++)
                       {
                            if( (i!=playData.wBankerUser && body.bChunTian) || (i==playData.wBankerUser && body.bFanChunTian) )
                                body.cbWinFlag[i] = 7
                            // if(i!=playData.wBankerUser && body.cbCardCount[i] == NORMAL_COUNT && body.lGameScore[i]<0)
                            //     body.cbWinFlag[i] = 7
                       }
                    }

                    gameStateMachine.goState(null, 'free', body)
                    break
                }
                //游戏开始
                case SUB_S_GAME_START: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_GameStart') 
                    body.cbCurrentScore = 0
                    gameStateMachine.goState(null, 'score', body)
                    break
                }
                //庄家信息 
                case SUB_S_BANKER_INFO:
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_BankerInfo') 
                    var self = tableData.getUserWithUserId(selfdwUserID)

                    playData.wBankerUser = body.wBankerUser
                    if(self.wChairID == body.wBankerUser)
                    {
                        playData.handCardIdxs = playData.handCardIdxs.concat(body.cbBankerCard)
                        playNode.sendCardsAction(playData.handCardIdxs)  
                    }
                    else
                        playNode.minusHandCardsNum(tableData.getUserWithChairId(body.wBankerUser), -3)

                    gameStateMachine.goState(null, 'count', body)

                    break
                }
                //用户出牌  
                case SUB_S_OUT_CARD: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_OutCard') 

                    var isFirstOut = !playData.lastOutCardType.idxs

                    //更新 playData.lastOutCardType
                    playData.formatOutCards(cardLogic.sortWithNum(body.cbCardData.slice(0,body.cbCardCount) ))


                    playNode.outCardExit(body.wOutCardUser, false, isFirstOut)
                    ////////
                    var cardsType = playData.lastOutCardType
                    if(cardsType.typeLevel>2)
                    {
                        var spr = actionFactory.getSprWithAnimate('bomb_', true, 0.15)
                        spr.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.6) )
                        mainScene.uiTop.addChild(spr) 
                        managerAudio.playEffect('gameRes/sound/bomb.mp3')

                        playNode.refreshJiaopaiTTF(playNode.jiaopaiTTF.getString() * 2)
                    }

                    var isContinuousOut = body.wOutCardUser == body.wCurrentUser 
                    if(isContinuousOut)
                    {
                        playData.lastOutCardType = {}
                        for(var i=0;i<GAME_PLAYER;i++)
                        {
                            if(i != body.wOutCardUser)
                                playNode.clearOutCards(i)
                        }
                    }

                    playNode.outCardEnter(body.wCurrentUser, null, isContinuousOut)

                    break
                }
                //用户放弃 
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
                //用户叫分   
                case SUB_S_CALL_SCORE: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_CallScore') 
                    playNode.callExit(body.wCallScoreUser, body.cbUserCallScore)
                    playNode.callEnter(body.wCurrentUser, body.cbCurrentScore)
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
    onenterfree:function()
    {
        playData.handCardIdxs = []
        playData.lastOutCardType = {}
    },
    reset:function()
    {
        gameStateMachine.reset()

        playData.handCardIdxs = []
        playData.lastOutCardType = {}
        playData.wBankerUser = null

        if( playData.intervalIdOfStartNewRound )
        {   
            window.clearInterval(playData.intervalIdOfStartNewRound)
            playData.intervalIdOfStartNewRound = null
        }
    },
    hasGetSendCardsWithdwUserID:function(dwUserID)
    {
        var user = tableData.getUserWithUserId(dwUserID)  
        return true
    },
    formatOutCards:function(sortedIdxs)
    {
        playData.lastOutCardType = gameLogic.getCardsType(sortedIdxs) 
    },
    initHandCardIdxs:function(bCardData, bCardCount)
    {   
        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if(self.wChairID == i)
                playData.handCardIdxs = bCardData.slice(0, bCardCount[i])

            var user = tableData.getUserWithChairId(i)
            if(user.dwUserID != selfdwUserID)
                playNode.setHandCardsNum( user, bCardCount[i] )
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

                playNode.refreshScoreTTF(args.lCellScore)
                playNode.refreshJiaopaiTTF(1)


                var call = function()
                {
                    tableData.updateOnFree( 3 )
                }
                //call()
                playData.intervalIdOfStartNewRound = window.setInterval(call, 1000)//每秒判断
              
              },
              onleavefree: function(event, from, to, args) 
              { 
                gameLog.log("onleavefree");  

                window.clearInterval(playData.intervalIdOfStartNewRound)
                // if(args.wStartUser == selfdwUserID)
                // playData.handCardIdxs = args.cbCardData[0]?args.cbCardData:[]
            

                var spr = actionFactory.getSprWithAnimate('start_', true, 0.15, function()
                {   
                    playData.initHandCardIdxs(args.cbCardData, [17, 17, 17])

                    if( playData.handCardIdxs.length!=0 ) //旁观
                    {
                        var callback = function()
                        {

                        }

                        playNode.sendCardsAction(playData.handCardIdxs, callback, true) 
                    }
                    else
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
                gameLog.log("onenterscore");  
                playNode.refreshJiaopaiTTF(1)
                playNode.callEnter(args.wCurrentUser, args.cbCurrentScore)
                
              },
              onleavescore: function(event, from, to, args) //把状态机去掉
              { 
                gameLog.log("onleavescore"); 

                // var self = tableData.getUserWithUserId(selfdwUserID)
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
                tableNode.setBankerIcon(args.wBankerUser, true)
                       
                //wCurrentUser
                if( typeof(args.wCurrentUser) != 'undefined' ) //用户强退
                    playNode.outCardEnter(args.wCurrentUser, args.cbTimeOutCard)
                // //cbBankerCard
                if( typeof(args.cbBankerCard) != 'undefined' ) //用户强退
                {
                    playNode.showDrawCardNode()
                    playNode.updateDiCard(args.cbBankerCard)
                }   
              },
              onleavecount: function(event, from, to, args) 
              { 
                gameLog.log("onleavecount");
                playNode.onleavecount()

                playNode.refreshScoreTTF(args.cbBankerScore)
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



