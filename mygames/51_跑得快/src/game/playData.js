
var playData = 
{   
    playStateMachine:null,
    //当局发的牌
    handCardIdxs:[],
    lastOutCardType:{},
    lastOutUser:null,
    wBankerUser:null,
    bIsNewRound:false,
    dwTableOwner:[],
    intervalIdOfStartNewRound:null,
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
                    playData.init()
                    if(!gameStateMachine.machine)
                        playData._initPlayStateMachine()

                    switch(tableData.CMD_GF_GameStatus.cbGameStatus)
                    {
                        case GAME_SCENE_FREE:
                        {
                            var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusFree') 
                            playData.dwTableOwner = body.dwTableOwner
                            gameStateMachine.goState(null, 'free', body)
                            break
                        }
                        case GAME_SCENE_PLAY:
                        {
                            var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusPlay') 
                            playData.dwTableOwner = body.dwTableOwner
                            playData.bIsNewRound = body.bIsNewRound
                            playData.wBankerUser = body.wBankerUser
                            tableNode.setBankerIcon(playData.wBankerUser, true)


                            playData.initHandCardIdxs(body.bCardData, body.bCardCount)

                            // // playNode.refreshScoreTTF(body.lBaseScore)
                            // var self = tableData.getUserWithUserId(selfdwUserID)
                            // var count = body.bCardCount[self.wChairID]   

                            // playData.handCardIdxs = count?body.bCardData.slice(0,count):[]
                            if( playData.handCardIdxs.length!=0 )
                            {
                                gameLogic.sortIdxsWithScore(playData.handCardIdxs, []) 
                                playNode.sendCardsAction(playData.handCardIdxs) 
                            }

                            // for(var i=0;i<GAME_PLAYER;i++)
                            // {
                            //     var user = tableData.getUserWithChairId(i)
                            //     if(user.dwUserID != selfdwUserID)
                            //         playNode.setHandCardsNum(user, body.bCardCount[i] )
                            // }
                            var idxs = body.bTurnCardData.slice(0,body.bTurnCardCount)
                            if(idxs.length!=0)
                            {
                                playData.formatOutCards(cardLogic.sortWithNum(idxs))
                                playNode.outCard(body.wLastOutUser, playData.lastOutCardType, true)
                            }
                
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
                case SUB_S_GAME_END: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_GameEnd') 

                    body.msg = '底分：' + playNode.scoreTTF.getString()
                    body.wBankChairID = playData.wBankerUser
                    body.szNickName = []
                    body.cbWinFlag = []
                    var normalEnd = true
                    for(var i=0;i<GAME_PLAYER;i++)
                    {
                        var user = tableData.getUserWithChairId(i)
                        if(user)
                            body.szNickName[i] = user.szNickName

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
                            if(body.bCardCount[i] == 16)
                                body.cbWinFlag[i] = 7
                       }
                    }
                    gameStateMachine.goState(null, 'free', body)
                    break
                }     
                case SUB_S_GAME_START: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_GameStart') 
                    playData.bIsNewRound = body.bIsNewRound
                    playData.wBankerUser = body.wBankerUser
                    tableNode.setBankerIcon(playData.wBankerUser, true)
                    gameStateMachine.goState(null, 'count', body)
                    break
                }  
                case SUB_S_OUT_CARD: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_OutCard') 
                    //更新 playData.lastOutCardType
                    
                    var isFirstOut = !playData.lastOutCardType.idxs
                    playData.formatOutCards( cardLogic.sortWithNum(body.bCardData.slice(0,body.bCardCount)) )
                    playData.lastOutUser = body.wOutCardUser
                    
                    ////
                    playNode.outCardExit(body.wOutCardUser, false, isFirstOut)
                    playNode.outCardEnter(body.wCurrentUser)

                    ////////
                    var cardsType = playData.lastOutCardType
                    if(cardsType.typeLevel>2)
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
                    var isContinuousOut = body.wCurrentUser == playData.lastOutUser

                    if(body.bNewTurn)
                    {
                        playData.lastOutCardType = {}
                        if(!isContinuousOut)
                        {   
                            for(var i=0;i<GAME_PLAYER;i++)
                                playNode.clearOutCards(i)
                        }
                    }

                    playNode.outCardExit(body.wPassUser, true)
                    playNode.outCardEnter(body.wCurrentUser, null, isContinuousOut)

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
        playData.lastOutCardType = gameLogic.getCardsType(sortedIdxs) 
    },
    getNextUser:function(currentUser)
    {
        return (currentUser+1)%3
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
    reset:function()
    {
        gameStateMachine.reset()

        playData.handCardIdxs = []
        playData.lastOutCardType = {}
        playData.lastOutUser = null
        playData.wBankerUser = null
        playData.bIsNewRound = false
        playData.dwTableOwner = []

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
                // playNode.refreshScoreTTF(args.lBaseScore)
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

                // playData.handCardIdxs = args.cbCardData[0]?args.cbCardData:[]
                // for(var i=0;i<GAME_PLAYER;i++)
                // {
                //     var user = tableData.getUserWithChairId(i)
                //     if(user.dwUserID != selfdwUserID)
                //         playNode.setHandCardsNum(user, 16)
                // }
                
                playData.initHandCardIdxs(args.cbCardData, [16, 16, 16])

                var spr = actionFactory.getSprWithAnimate('start_', true, 0.15, function()
                {   
                    if( playData.handCardIdxs.length!=0 ) //旁观
                    {
                        var callback = function()
                        {

                        }
                                                
                        gameLogic.sortIdxsWithScore(playData.handCardIdxs, []) 
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
              },
              onleavescore: function(event, from, to, args) //把状态机去掉
              { 
                gameLog.log("onleavescore"); 
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

                //wCurrentUser
                if( typeof(args.wCurrentUser) != 'undefined' ) //用户强退
                    playNode.outCardEnter(args.wCurrentUser)
              },
              onleavecount: function(event, from, to, args) 
              { 
                gameLog.log("onleavecount");
                playNode.onleavecount()
                
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


    },
    init:function()
    {
        var t = tableData.isUserSitDownEnable

        tableData.isUserSitDownEnable = function(dwUserID)
        {

            var isOwner = false
            for(var i in playData.dwTableOwner)
            {   
                isOwner =  playData.dwTableOwner[i]==INVALID_WORD || playData.dwTableOwner[i] == dwUserID
                if(isOwner)
                    break
            }
            return isOwner && t(dwUserID)
        }
    }

}



