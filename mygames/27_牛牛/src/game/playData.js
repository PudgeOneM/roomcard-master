
var playData = 
{   
    playStateMachine:null,
    playStateQueue:[],
    //当局发的牌
    sendCards:{},
    //当局压得总分
    totalScore:0,
    lTurnMaxScore:null,
    niuIdxWithChairidArray:[],  //没开牌前这个数组是未经过玩家选择的牌型 开牌后会变成玩家选出的牌型
    gameEndlGameScore:null,
    intervalIdOfStartNewRound:null,
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
                    if(!playData.playStateMachine)
                    {
                        playData._initPlayStateMachine()
                        playData.goState(null, 'free')
                        switch(tableData.CMD_GF_GameStatus.cbGameStatus)
                        {
                            case GS_TK_FREE:
                            {
                                //var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusFree') 
                                //playData.goState(null, 'free') 
                                break
                            }
                            case GS_TK_CALL: //无此状态
                            {
                                //var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusCall') 
                                break
                            }
                            case GS_TK_SCORE:
                            {
                                var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusScore') 
                                playData.goState(null, 'score', body)
                                break
                            }
                            case GS_TK_PLAYING:
                            {
                                var body = buffer2StructObj(msg.slice(8), 'CMD_S_StatusPlay') 
                                body.cbCardData = body.cbHandCardData
                                body.cbHandCardData = null
                                playData.goState(null, 'count', body)
                                break
                            }
                        }
                    }
                    
                    break
                }       
                }
                break
            }
        case MDM_GF_GAME:       //游戏消息 200
            {
                switch(head.CommandInfo.wSubCmdID)
                {
                case SUB_S_CALL_BANKER: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_CallBanker') 
                    var self = tableData.getUserWithUserId(selfdwUserID)
                    if(self.wChairID == body.wCallBanker)
                    {
                        var CallBanker = getObjWithStructName('CMD_C_CallBanker')
                        CallBanker.bBanker = 1
                        socket.sendMessage(MDM_GF_GAME, SUB_C_CALL_BANKER, CallBanker) 
                    }
                    break
                }    
                case SUB_S_GAME_START: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_GameStart') 
                    playData.goState(null, 'score', body)
                    break
                } 
                case SUB_S_ADD_SCORE: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_AddScore') 

                    var addScoreUser = tableData.getUserWithTableIdAndChairId(tableData.getUserWithUserId(selfdwUserID).wTableID, body.wAddScoreUser)
                    playData.totalScore = playData.totalScore + body.lAddScoreCount

                    playNode.onAddScoreMsg(addScoreUser.wChairID, addScoreUser.userNodeInsetChair, playData.totalScore, body.lAddScoreCount)
                    break
                }    
                case SUB_S_SEND_CARD: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_SendCard') 
                    playData.goState(null, 'count', body)
                    break
                }    
                case SUB_S_OPEN_CARD: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_Open_Card') 
                    playData.niuIdxWithChairidArray[body.wPlayerID] = parseInt(body.bOpen) 
                    var user = tableData.getUserWithTableIdAndChairId(null, body.wPlayerID)
                    try
                    {
                        chairFactory.hideFiredCircle.call(user.userNodeInsetChair)
                    }
                    catch(e)
                    {
                        gameLog.log('error-SUB_S_OPEN_CARD:'+e)
                    }
                    
                    break
                }    
                case SUB_S_GAME_END: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_GameEnd') 
                    playData.goState(null, 'free', body)
                    break
                }   
                case SUB_S_STATIC_BANKER_UP: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_Static_Banker_Up') 
                    topUINode.onBankerApply( body.dwApplicantID)
                    break
                }  
                case SUB_S_CONFIRM_STATIC_BANKER: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_Confirm_Static_Banker') 
                    tableData.dwStaticBanker = body.dwStaticBanker
                    topUINode.bankerButton.setVisible( tableData.dwStaticBanker != selfdwUserID )
                    topUINode.bankerDownButton.setVisible( tableData.dwStaticBanker == selfdwUserID )
                    tableNode.bgSpr.setSpriteFrame(tableData.dwStaticBanker == INVALID_DWORD?'unfixbanker.png':'fixbanker.png') 
                    break
                }  
                case SUB_S_STATIC_BANKER_DOWN: 
                {   
                    var body = buffer2StructObj(msg.slice(8), 'CMD_S_Static_Banker_Down') 
                    tableData.dwStaticBanker = INVALID_DWORD
                    topUINode.bankerButton.setVisible( true )
                    topUINode.bankerDownButton.setVisible( false )
                    tableNode.bgSpr.setSpriteFrame(tableData.dwStaticBanker == INVALID_DWORD?'unfixbanker.png':'fixbanker.png') 
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
        return playData.sendCards.cards && playData.sendCards.cards[user.wChairID] && playData.sendCards.cards[user.wChairID][0] != 0 
    },
    updateSendCards:function(cbCardData, cbCardType)
    {
        //cbCardType = [104,105,104,105,106,106,106,106]
        playData.sendCards.cbCardType = cbCardType || []
        //打乱
        playData.sendCards.cards = []
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        for(var i=0;i<GAME_PLAYER;i++)
        {   
            if(selfChairId == i)
            {
                playData.sendCards.cards[i] = []
                for(var j=0;j<MAX_COUNT;j++)
                {
                    var idx = Math.floor(Math.random()*cbCardData[i].length)
                    playData.sendCards.cards[i][j] = cbCardData[i].splice(idx,1)[0]
                }
            }
            else
            {
                playData.sendCards.cards[i] = cbCardData[i]
            }
        }
    },
    reStartGame:function()
    {
        playData.sendCards = {}
        playData.totalScore = 0
        playData.lTurnMaxScore = null
        playData.niuIdxWithChairidArray = []
        playData.gameEndlGameScore = null
    },
    _initPlayStateMachine:function()  
    {
        playData.playStateMachine = StateMachine.create(
        {
            events: [
              { name: 'start', from: 'none',   to: 'free'  },
              { name: 'free2Score', from: 'free', to: 'score'    },
              { name: 'score2Count',  from: 'score',    to: 'count' },
              { name: 'count2free', from: 'count',    to: 'free'  },
            ],

            callbacks: {
              onafterevent: function(event, from, to, args) 
              { 
              },

              //free
              onenterfree: function(event, from, to, args)  //只有在free状态 并且 是坐下状态才会发ready
              { 
                gameLog.log("onenterfree") 
                playNode.reStartGame()
                playNode.onGameEnd()
                playData.reStartGame()

                playData.freeTimeout = setTimeout(function()
                {
                    var users = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
                    if(users.length>=2 && tableData.bIsOpened && !socket.hasClosed)
                    {
                        sendLogToServer(gameLog.logS + 'wtms卡在freewtms')
                    }  
                },
                30000)

                var call = function()
                {
                    tableData.updateOnFree( 2 )
                }
                //call()
                playData.intervalIdOfStartNewRound = window.setInterval(call, 1000)//每秒判断
              },
              onleavefree: function(event, from, to, args) 
              { 
                gameLog.log("onleavefree");  

                window.clearTimeout(playData.freeTimeout)
                window.clearInterval(playData.intervalIdOfStartNewRound)

                // managerRes.loadPlist('animationStart', 
                // function()
                // {
                    var spr = actionFactory.getSprWithAnimate('start_', true, 0.15, function()
                    {   
                        playData.playStateMachine.transition()
                    })
                    spr.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.6) )
                    mainScene.uiTop.addChild(spr) 
                    managerAudio.playEffect('gameRes/sound/start.mp3')
                //},
                // 5000,
                // function()
                // {
                //     playData.playStateMachine.transition()
                // }
                // )
                
                return StateMachine.ASYNC
              },

              //score
              onenterscore: function(event, from, to, args) 
              { 
                playData.scoreTimeout = setTimeout(function()
                {
                    if(!socket.hasClosed)
                        sendLogToServer(gameLog.logS + 'wtms卡在scorewtms')
                },
                30000)

                gameLog.log("onenterscore");  

                playData.lTurnMaxScore = args.lTurnMaxScore
                playData.wBankerUser = args.wBankerUser
                gameLog.log('1' + playData.wBankerUser)
                if(args.lTableScore)
                {
                  for(var i in args.lTableScore)
                      playData.totalScore = playData.totalScore + args.lTableScore[i]
                }
                ///////
                tableNode.setBankerIcon(playData.wBankerUser, true)
                playNode.totalScoreNode.setVisible(true)
                playNode.fixTotalScoreNode(playData.totalScore)

                var self = tableData.getUserWithUserId(selfdwUserID)
                var users = tableData.getUsersWithTableIdAndStatus( self.wTableID, [US_PLAYING, US_OFFLINE] )
                playNode.showAddScoreFiredCircle(users, playData.wBankerUser, args.dwTimeCountDown)


                var bankerUserID = tableData.getUserWithTableIdAndChairId( self.wTableID, playData.wBankerUser ).dwUserID
                var isCan = tableData.isInPlay(self.cbUserStatus) && selfdwUserID != bankerUserID
                if(isOpenAutoPlay)
                {
                    if(isCan)
                    {
                        var AddScore = getObjWithStructName('CMD_C_AddScore') 
                        AddScore.lScore = 1
                        socket.sendMessage(MDM_GF_GAME, SUB_C_ADD_SCORE, AddScore)
                    }
                }
                else
                {
                    playNode.popAddScoreNode(isCan, playData.lTurnMaxScore)
                    playNode.startAddScoreClock(isCan, args.dwTimeCountDown)   
                }
 
              },
              onleavescore: function(event, from, to, args) 
              { 
                window.clearTimeout(playData.scoreTimeout)

                gameLog.log("onleavescore"); 
                playData.updateSendCards(args.cbCardData, args.cbCardType)
                playData.niuIdxWithChairidArray = args.bOxCard || playData.niuIdxWithChairidArray 

                ///////
                var self = tableData.getUserWithUserId(selfdwUserID)
                var users = tableData.getUsersWithTableIdAndStatus( self.wTableID, [US_PLAYING, US_OFFLINE] )
                playNode.hideAddScoreFiredCircle(users, playData.wBankerUser)

                playNode.hideAddScoreNode()
                playNode.stopAddScoreClock()

                var callback = function()
                {
                    for(var i=0;i<GAME_PLAYER;i++)
                    {
                        tableNode.setBankerIcon(i, false)
                    }
                    playNode.totalScoreNode.setVisible(false)
                }

                playNode.sendCardsAction(playData.sendCards, callback)  
                //playNode.sendCardsAction(clone(playData.sendCards), callback)  

                return StateMachine.ASYNC
              },

              //count
              onentercount: function(event, from, to, args) 
              { 
                playData.countTimeout = setTimeout(function()
                {
                    if(!socket.hasClosed)
                        sendLogToServer(gameLog.logS + 'wtms卡在countwtms')
                },
                30000)

                gameLog.log("onentercount");  
                //tableData.cbPlayStatus = true
                var self = tableData.getUserWithUserId(selfdwUserID)
                ///////
                tableNode.setBankerIcon(playData.wBankerUser, true)
                playNode.totalScoreNode.setVisible(true)
                playNode.fixTotalScoreNode(playData.totalScore)

                var users = tableData.getUsersWithTableIdAndStatus( self.wTableID, [US_PLAYING, US_OFFLINE] )
                playNode.showCountFiredCircle(users, args.dwTimeCountDown)

                var isCan = playData.hasGetSendCardsWithdwUserID(selfdwUserID)

                if(isOpenAutoPlay)
                {   
                    if(isCan)
                    {
                        var OxCard = getObjWithStructName('CMD_C_OxCard')
                        OxCard.bOX = 0
                        socket.sendMessage(MDM_GF_GAME, SUB_C_OPEN_CARD, OxCard) 
                    }
                }
                else
                {
                    if(isCan)
                        var cardType = playData.sendCards.cbCardType[self.wChairID]
                    playNode.popCountNode(isCan, cardType)
                    playNode.startCountClock(isCan, args.dwTimeCountDown)   
                }

              },
              onleavecount: function(event, from, to, args) 
              { 
                window.clearTimeout(playData.countTimeout)

                gameLog.log("onleavecount");  

                playData.gameEndlGameScore = args.lGameScore
                ///////
                var tableId = tableData.getUserWithUserId(selfdwUserID).wTableID
                var users = tableData.getUsersWithTableIdAndStatus( tableId, [US_PLAYING, US_OFFLINE] )
                playNode.hideCountFiredCircle(users)

                playNode.stopCountClock()
                playNode.hideCountNode()
                
                var callback = function()
                {
                    headIconPop.kickUserOnGameEnd()
                    for(var i=0;i<GAME_PLAYER;i++)
                    {
                        tableNode.setBankerIcon(i, false)
                    }
                    playNode.totalScoreNode.setVisible(false)
                }
     
                playNode.leaveCountAction(callback, playData.gameEndlGameScore, playData.niuIdxWithChairidArray)
                //playNode.leaveCountAction(callback, clone(playData.gameEndlGameScore), clone(playData.niuIdxWithChairidArray) )

                ///////
                topUINode.refreshLastListNode(args, playData.niuIdxWithChairidArray)
                var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
                record.szTableKey = tableKey
                socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)

                return StateMachine.ASYNC
              },

            }

      })

    },
    //客户端的状态切换 由服务器触发（通过接收协议）
    goState:function(from, to, args)  
    {
        from = from || playData.playStateMachine.current //none free score count hide
        gameLog.log('goState:' + from + '-' + to + '-' +  !playData.playStateMachine.transition)

        if(playData.playStateMachine.transition)
        {
            playData._addState(to, args)
            return;
        }

        var t = 
        {
            nonefree:function(args)
            {
                playData.playStateMachine.start(args)
            },
            freescore:function(args)
            {
                playData.playStateMachine.free2Score(args)
                var oldcall = playData.playStateMachine.transition
                playData.playStateMachine.transition = function()
                {
                    // oldcall()
                    // playData._popState() 
                    window.setTimeout(function()
                        {
                            playData._popState() 
                        })  
                    return oldcall()
                }
            },
            scorecount:function(args)
            {
                playData.playStateMachine.score2Count(args)
                var oldcall = playData.playStateMachine.transition
                playData.playStateMachine.transition = function()
                {
                    // oldcall()
                    // playData._popState() 
                    window.setTimeout(function()
                        {
                            playData._popState() 
                        })  
                    return oldcall()
                }
            },
            countfree:function(args)
            {
                playData.playStateMachine.count2free(args)
                var oldcall = playData.playStateMachine.transition
                playData.playStateMachine.transition = function()
                {
                    // oldcall()
                    // playData._popState() 
                    window.setTimeout(function()
                        {
                            playData._popState() 
                        })  
                    return oldcall()
                }
            },
            freecount:function(args)
            {   
                var a = clone(args)
                a.dwTimeCountDown = 0
                playData.goState('free','score', a)
                playData.goState('score','count', args)
            },
            scorefree:function(args)
            {
              var a = clone(args)
              a.dwTimeCountDown = 0
              playData.goState('score','count', a)
              playData.goState('count','free', args)
            },
            countscore:function(args)
            {
               playData.goState('count','free', args)
               playData.goState('free','score', args)
            },
        }

        var f = t[from+to] 
        f?f(args || {}):''
        
    },
    _addState:function(state, args)
    {
        var s = {}
        s.state = state
        s.args = args
        playData.playStateQueue[playData.playStateQueue.length] = s
    },
    _popState:function()
    {
        var s = playData.playStateQueue[0] 
        if(s)
        {   
            playData.playStateQueue = playData.playStateQueue.slice(1)
            playData.goState(null, s.state, s.args)
        }
    }
}











