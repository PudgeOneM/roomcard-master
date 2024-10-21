
////先理解cardFactory(components/cardFactory/cardFactory)
var callTime = 20
var outCardTime = 20

var playNode = 
{   
    isLookingResult:false,

    //如果在动画执行期间游戏开始了 则强制终止动画 
    gameEndAction:null,
    ///////////////////////init start///////////////////////
    init:function()
    {   
        playNode._registEvent()
        playNode._initCallBack()
        var node = managerRes.loadCCB(resp.playCCB, this)
        playNode.animationManager = node.animationManager
        playNode.node  = node

        playNode.addChooseType()
    },
    adaptUi:function()
    {
    },
    onReStart:function()
    {
        playNode.isLookingResult = false
        playNode.lastOutCardType = {}

        cocos.clearInterval(playNode.updateOnFree, playNode.node)
    },
    initCurrentRoundNode:function(currentRoundNode)
    {
        //currentRoundNode是绑定在chair上的一个节点 用于存放当前轮用到的节点
        currentRoundNode.scoreChange = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.scoreChange, 1)    
    },
    clearCurrentRoundNode:function(currentRoundNode)
    {           
        //一轮结束 clearCurrentRoundNode
        currentRoundNode.scoreChange.removeAllChildren()
    },
    setCurrentRoundNodesVisible:function(isVisible)
    {
        var users = tableData.getUsersInTable( tableData.getUserWithUserId(selfdwUserID).wTableID )
        for(var i in users)
        {
            users[i].userNodeInsetChair.currentRoundNode.setVisible(isVisible)
        }
    },
    updateCurrentRoundNode:function(currentRoundNode, userId)
    {
        var user = tableData.getUserWithUserId(userId)
        var showChairId = tableData.getShowChairIdWithServerChairId(user.wChairID)
        
        if(showChairId==0||showChairId==2||showChairId==3)
            sign = -1
        else
            sign = 1

        currentRoundNode.scoreChange.setPosition( cc.p(-50 * sign, 40) )  
    },
    _registEvent:function() 
    {
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "userNodeInsetChairInit",
            callback: function(event)
            {   
                var currentRoundNode = new cc.Node()
                playNode.initCurrentRoundNode(currentRoundNode)
                //////
                var userNodeInsetChair = event.getUserData()
                userNodeInsetChair.addChild(currentRoundNode)
                userNodeInsetChair.currentRoundNode = currentRoundNode  
            }
        })
        cc.eventManager.addListener(l, 1)

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "userNodeInsetChairUpdate",
            callback: function(event)
            {   
                var data = event.getUserData()
                var currentRoundNode = data[0].currentRoundNode
                var userId = data[1]
                playNode.updateCurrentRoundNode(currentRoundNode, userId)   
            }
        })
        cc.eventManager.addListener(l, 1)

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "cmdEvent",
            callback: function(event)
            {   
                var data = event.getUserData()
                var callFunName = data[0]
                playNode[callFunName]()
            }
        })
        cc.eventManager.addListener(l, 1)
    },
    _initCallBack:function()
    {   
    },
    decorateCard:function(card)
    {
    },
    ///////////////////////init end///////////////////////

    ///////////////cmdEvent start//////////
    updateOnFree:function()
    {
        if(!playNode.isLookingResult)
        {            
            if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT)
            {
                socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
            }
        }
    },
    onCMD_StatusFree:function() 
    {
        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)
    },
    onCMD_StatusCall:function()
    {
    },
    onCMD_StatusPlay:function() 
    {      
        for(var showChairid=0;showChairid<GAME_PLAYER;showChairid++)
        {
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairid)
            var user = tableData.getUserWithChairId(wChairID)
            var callBody = cmdBaseWorker.cbCallRecord[wChairID]
            var outCardsNode = playNode['outCards' + showChairid]

            if(callBody.callFlag==255) //未出牌 
            {
                if(user.dwUserID == selfdwUserID)
                    playNode.showChooseType(cmdBaseWorker.cbHandCardData[wChairID])            
                else
                    chairFactory.showFiredCircle.call(user.userNodeInsetChair, 20)
            }
            else if(callBody.callFlag!=254)
            {
                outCardsNode.setVisible(true)
                var typeSpr = outCardsNode.getChildByTag(100)
                if(callBody.callFlag!=0)
                {
                    typeSpr.setSpriteFrame('special_words.png')
                    typeSpr.y = 60
                }
                else
                    typeSpr.setSpriteFrame('empty.png')

                var cardDatas = ( callBody.headCardDatas.concat(callBody.centerCardDatas) ).concat(callBody.tailCardDatas)
                for(var i=0;i<13;i++)
                {
                    var cardData = cardDatas[i]
                    outCardsNode.getChildByTag(i).setSpriteFrame('out_'+cardData+'.png')
                }
            }
        }


    },
    onCMD_CallNotify:function()
    {
    },
    onCMD_CallResult:function()
    {
        var showChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCallUser)
        var user = tableData.getUserWithChairId(cmdBaseWorker.wCallUser)

        var outCardsNode = playNode['outCards' + showChairid]
        outCardsNode.setVisible(true)
        chairFactory.hideFiredCircle.call(user.userNodeInsetChair)

        var callBody = cmdBaseWorker.callBody

        var typeSpr = outCardsNode.getChildByTag(100)
        if(callBody.callFlag!=0)
        {
            typeSpr.setSpriteFrame('special_words.png')
            typeSpr.y = 60
        }
        else
            typeSpr.setSpriteFrame('empty.png')


        var cardDatas = ( callBody.headCardDatas.concat(callBody.centerCardDatas) ).concat(callBody.tailCardDatas)
        for(var i=0;i<13;i++)
        {
            var cardData = cardDatas[i]
            outCardsNode.getChildByTag(i).setSpriteFrame('out_'+cardData+'.png')
        }

    },
    onCMD_GameStart:function() 
    {
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
        playNode.node.stopAction(playNode.gameEndAction)
        playNode.resetPlayNode()

        
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var user = tableData.getUserWithChairId(wChairID)
            if(user && user.dwUserID!=selfdwUserID)
                chairFactory.showFiredCircle.call(user.userNodeInsetChair, 20)
        }

        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            if(tableData.getUserWithUserId(selfdwUserID).wChairID == wChairID)
               playNode.showChooseType(cmdBaseWorker.cbHandCardData[wChairID])
        }

    },
    onCMD_OutCard:function() 
    {
    },
    onCMD_PassCard:function() 
    {
    },
    onCMD_GameEnd:function() 
    {
        // var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
        // record.szTableKey = tableKey
        // socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)

        playNode.isLookingResult = true   
        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)

        var users_cbGender = []
        var szNickName_gameEnd = []
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var user = tableData.getUserWithChairId(wChairID)
            if(user)
            {
                users_cbGender[wChairID] = user.cbGender
                szNickName_gameEnd[wChairID] = user.szNickName
            }
        }

        if(cmdBaseWorker.wExitUser != INVALID_WORD) 
        {
            playNode.gameEndAction = cc.sequence( 
                cc.callFunc(function()
                {     
                    headIconPop.kickUserOnGameEnd()
                    var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
                    record.szTableKey = tableKey
                    socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
                    var continueCall = function()
                    {
                        playNode.isLookingResult = false   
                        var user = tableData.getUserWithUserId(selfdwUserID)
                        if(user.cbUserStatus == US_SIT)//只有坐下未准备的情况 才会resetPlayNode
                        {
                            playNode.resetPlayNode()
                            var isLastWinner = false
                            for(var i=0;i<cmdBaseWorker.dwLastWinner.length;i++)
                            {   
                                isLastWinner =  cmdBaseWorker.dwLastWinner[i] == selfdwUserID
                                if(isLastWinner)
                                    break
                            }

                            if(isLastWinner)//有的游戏需要上轮赢得玩家站起
                            {
                                var lookon = getObjWithStructName('CMD_GR_UserLookon') 
                                lookon.wTableID = tableData.tableID
                                socket.sendMessage(MDM_GR_USER, SUB_GR_USER_LOOKON, lookon) 
                            }
                        } 
                    }
                    playNode.popGameEnd(continueCall, szNickName_gameEnd) 
                }) 
            )

            playNode.node.runAction(playNode.gameEndAction)  
            return 
        }
        // ////////////////////////////////////////////////////////

        var baseScoreChair0 = [0, 0, 0]
        var extraScoreChair0 = [0, 0, 0]
        var chairid = tableData.getServerChairIdWithShowChairId(0)
        for(var showChairid = 1;showChairid<GAME_PLAYER;showChairid++)
        {
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairid)
            for(var ii=0;ii<3;ii++)
            {
                baseScoreChair0[ii] += cmdBaseWorker.lBaseScore[chairid][wChairID][ii]
                extraScoreChair0[ii] += cmdBaseWorker.lExtraScore[chairid][wChairID][ii]
            }
        }

        var actions_campareHead = [cc.delayTime(0)]
        var actions_campareCenter = [cc.delayTime(0)]
        var actions_campareTail = [cc.delayTime(0)]
        var actions_daqiang = [cc.delayTime(0)]
        var actions_special = [cc.delayTime(0)]

        var callBodys = clone(cmdBaseWorker.cbCallRecord)
        for(var wChairID=GAME_PLAYER-1;wChairID>=0;wChairID--)
        {
            var callBody = callBodys[wChairID]
            callBody.wChairID = wChairID
            if(callBody.callFlag!=0) callBodys.splice(wChairID ,1)
        }


        //头道动画
        callBodys.sort( function(a, b)
        {
            return gameLogic.compareType({level:a.headLevel, score:a.headScore}, 
                {level:b.headLevel, score:b.headScore})
        })

        for(var i=0;i<callBodys.length;i++)
        {
            var callBody = callBodys[i]
            var wChairID = callBody.wChairID
            var showChairid = tableData.getShowChairIdWithServerChairId(wChairID)
            var outCardsNode = playNode['outCards' + showChairid]

            var cardSprs = [outCardsNode.getChildByTag(0), outCardsNode.getChildByTag(1), outCardsNode.getChildByTag(2)]
            var cardDatas = callBody.headCardDatas
            var daoNum = 0
            var level = callBody.headLevel
            var typeSpr = outCardsNode.getChildByTag(100)
            var isMan = users_cbGender[wChairID].cbGender
            actions_campareHead[actions_campareHead.length] = playNode.getTurnCardAction(cardSprs, cardDatas, daoNum, level, typeSpr, isMan)
        }

        actions_campareHead[actions_campareHead.length] = cc.callFunc(
                function()
                {   
                      var baseScore =  baseScoreChair0[0] 
                      var extraScore =  extraScoreChair0[0] 

                      var baseScorePng = baseScore>=0?resp.nums5:resp.nums4
                      var extraScorePng = extraScore>=0?resp.nums5:resp.nums4


                      var baseScoreLabel = new ccui.TextAtlas(':' + Math.abs(baseScore), baseScorePng, 24.6, 32, "0")
                      var extraScoreLabel = new ccui.TextAtlas(';:' + Math.abs(extraScore) + '<', extraScorePng, 24.6, 32, "0")

                      playNode.headScoreNode.addChild(baseScoreLabel)
                      extraScoreLabel.x = 80
                      playNode.headScoreNode.addChild(extraScoreLabel)
                })
        //中道动画
        callBodys.sort( function(a, b)
        {
            return gameLogic.compareType({level:a.centerLevel, score:a.centerScore}, 
                {level:b.centerLevel, score:b.centerScore})
        } )

        for(var i=0;i<callBodys.length;i++)
        {
            var callBody = callBodys[i]
            var wChairID = callBody.wChairID
            var showChairid = tableData.getShowChairIdWithServerChairId(wChairID)
            var outCardsNode = playNode['outCards' + showChairid]

            var cardSprs = []
            for(var ii=0;ii<5;ii++)
            {
                cardSprs[ii] = outCardsNode.getChildByTag(3+ii)
            }
            var cardDatas = callBody.centerCardDatas
            var daoNum = 1
            var level = callBody.centerLevel
            var typeSpr = outCardsNode.getChildByTag(100)
            var isMan = users_cbGender[wChairID].cbGender
            actions_campareCenter[actions_campareCenter.length] = playNode.getTurnCardAction(cardSprs, cardDatas, daoNum, level, typeSpr, isMan)
        }

        actions_campareCenter[actions_campareCenter.length] = cc.callFunc(
                function()
                {   
                      var baseScore =  baseScoreChair0[1] 
                      var extraScore =  extraScoreChair0[1] 

                      var baseScorePng = baseScore>=0?resp.nums5:resp.nums4
                      var extraScorePng = extraScore>=0?resp.nums5:resp.nums4


                      var baseScoreLabel = new ccui.TextAtlas(':' + Math.abs(baseScore), baseScorePng, 24.6, 32, "0")
                      var extraScoreLabel = new ccui.TextAtlas(';:' + Math.abs(extraScore) + '<', extraScorePng, 24.6, 32, "0")

                      playNode.centerScoreNode.addChild(baseScoreLabel)
                      extraScoreLabel.x = 80
                      playNode.centerScoreNode.addChild(extraScoreLabel)
                })
        //尾道动画
        callBodys.sort( function(a, b)
        {
            return gameLogic.compareType({level:a.tailLevel, score:a.tailScore}, 
                {level:b.tailLevel, score:b.tailScore})
        } )

        for(var i=0;i<callBodys.length;i++)
        {
            var callBody = callBodys[i]
            var wChairID = callBody.wChairID
            var showChairid = tableData.getShowChairIdWithServerChairId(wChairID)
            var outCardsNode = playNode['outCards' + showChairid]

            var cardSprs = []
            for(var ii=0;ii<5;ii++)
            {
                cardSprs[ii] = outCardsNode.getChildByTag(8+ii)
            }
            var cardDatas = callBody.tailCardDatas
            var daoNum = 2
            var level = callBody.tailLevel
            var typeSpr = outCardsNode.getChildByTag(100)
            var isMan = users_cbGender[wChairID].cbGender
            actions_campareTail[actions_campareTail.length] = playNode.getTurnCardAction(cardSprs, cardDatas, daoNum, level, typeSpr, isMan)
        }

        actions_campareTail[actions_campareTail.length] = cc.callFunc(
                function()
                {   
                      var baseScore =  baseScoreChair0[2] 
                      var extraScore =  extraScoreChair0[2] 

                      var baseScorePng = baseScore>=0?resp.nums5:resp.nums4
                      var extraScorePng = extraScore>=0?resp.nums5:resp.nums4


                      var baseScoreLabel = new ccui.TextAtlas(':' + Math.abs(baseScore), baseScorePng, 24.6, 32, "0")
                      var extraScoreLabel = new ccui.TextAtlas(';:' + Math.abs(extraScore) + '<', extraScorePng, 24.6, 32, "0")

                      playNode.tailScoreNode.addChild(baseScoreLabel)
                      extraScoreLabel.x = 80
                      playNode.tailScoreNode.addChild(extraScoreLabel)
                

                      var totalScore = 0
                      for(var i=0;i<3;i++)
                      {
                          totalScore += baseScoreChair0[i] 
                          totalScore += extraScoreChair0[i] 
                      } 

                      var totalScorePng = totalScore>=0?resp.nums5:resp.nums4
                      var totalScoreLabel = new ccui.TextAtlas(':' + Math.abs(totalScore), totalScorePng, 24.6, 32, "0")
                      totalScoreLabel.totalScore = totalScore
                      playNode.totalScoreNode.addChild(totalScoreLabel, 0, 101)
                })

        //打枪动画
        for(var wChairID1=0;wChairID1<GAME_PLAYER;wChairID1++)
        {
            for(var wChairID2=0;wChairID2<GAME_PLAYER;wChairID2++)
            {
                if(wChairID1==wChairID2) continue

                if(cmdBaseWorker.bIsDaqiang[wChairID1][wChairID2])
                {
                    var showChairid1 = tableData.getShowChairIdWithServerChairId(wChairID1)
                    var showChairid2 = tableData.getShowChairIdWithServerChairId(wChairID2)
                    actions_daqiang[actions_daqiang.length] = playNode.getDaqiangAction(showChairid1, showChairid2)
                }
            }
        }

        //
        if(cmdBaseWorker.wDa3qiangUser!=INVALID_WORD)
        {
            var showChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wDa3qiangUser)
            actions_special[actions_special.length] = playNode.getSpecialAction(0, showChairid, users_cbGender[cmdBaseWorker.wDa3qiangUser])
        }



        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var callBody = cmdBaseWorker.cbCallRecord[wChairID]
            if(callBody.callFlag!=0 && callBody.callFlag!=254)
            {
                var showChairid = tableData.getShowChairIdWithServerChairId(wChairID)
                var cardDatas = ( callBody.headCardDatas.concat(callBody.centerCardDatas) ).concat(callBody.tailCardDatas)

                actions_special[actions_special.length] = playNode.getSpecialAction(callBody.callFlag, showChairid, users_cbGender[wChairID], cardDatas)
            }
        }


        playNode.gameEndAction = cc.sequence( 
            cc.callFunc(function()
            {   
                // managerTouch.closeTouch()
                playNode.playGenderEffect('start_compare', tableData.getUserWithUserId(selfdwUserID).cbGender)
                for(var i=0;i<GAME_PLAYER;i++)
                {
                    var chair = tableData.getChairWithServerChairId(i)
                    var scoreTTF = chair.userNode.userScore

                    var t = parseInt(scoreTTF.getString()) - cmdBaseWorker.lGameScore[i]
                    scoreTTF.setString(  t  )
                }
            }),
            cc.delayTime(1),
            cc.sequence(actions_campareHead),
            cc.sequence(actions_campareCenter),
            cc.sequence(actions_campareTail),
            cc.sequence(actions_daqiang),
            cc.sequence(actions_special),
            cc.callFunc(function()
            {     
                playNode._showSprsOnGameEnd()
            }), 
            cc.delayTime(5), //看牌5秒
            cc.callFunc(function()
            {   
                headIconPop.kickUserOnGameEnd()
                var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
                record.szTableKey = tableKey
                socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
                var continueCall = function()
                {
                    playNode.isLookingResult = false   
                    var user = tableData.getUserWithUserId(selfdwUserID)
                    if(user.cbUserStatus == US_SIT)//只有坐下未准备的情况 才会resetPlayNode
                    {
                        // playNode.resetPlayNode()
                        var isLastWinner = false
                        for(var i=0;i<cmdBaseWorker.dwLastWinner.length;i++)
                        {   
                            isLastWinner =  cmdBaseWorker.dwLastWinner[i] == selfdwUserID
                            if(isLastWinner)
                                break
                        }

                        if(isLastWinner)//有的游戏需要上轮赢得玩家站起
                        {
                            var lookon = getObjWithStructName('CMD_GR_UserLookon') 
                            lookon.wTableID = tableData.tableID
                            socket.sendMessage(MDM_GR_USER, SUB_GR_USER_LOOKON, lookon) 
                        }
                    } 
                }
                continueCall()
                //playNode.popGameEnd(continueCall, szNickName_gameEnd) 
            }) 
        )           
        playNode.node.runAction(playNode.gameEndAction)
    },
    // ///////////////cmdEvent end//////////



    ////////////gameend start//////////
    _showSprsOnGameEnd:function()
    {
        for(var showChairid=0;showChairid<GAME_PLAYER;showChairid++)
        {
            var direction = showChairid
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairid)

            var user = tableData.getUserWithChairId(wChairID)
            if(!user) continue

            var chair = tableData.getChairWithServerChairId(wChairID)
            
            var scoreTTF = chair.userNode.userScore
            scoreTTF.setString(  user.lScoreInGame  )

            // if(playData.hasGetSendCardsWithdwUserID(user.dwUserID) && tableData.isInTable(user.cbUserStatus))
            // if(tableData.isInTable(user.cbUserStatus))
            // {   
            var score = cmdBaseWorker.lGameScore[wChairID]
            var scoreNode = user.userNodeInsetChair.currentRoundNode.scoreChange

            var scoreLabel = new ccui.TextAtlas()
            scoreLabel.setProperty(Math.abs(score), score>0?resp.nums2:resp.nums3, 22, 33, "0")
            scoreNode.addChild(scoreLabel)
            
            var sign = score>0?new cc.Sprite('#plus.png'):new cc.Sprite('#minus.png')
            sign.setAnchorPoint(cc.p(0,0.5))
            scoreNode.addChild(sign)

            var signPosx
            var swidth = scoreLabel.getContentSize().width + sign.getContentSize().width
            if( chairFactory.isRight(chair.node) )
            {
                signPosx = - swidth
            }
            else
            {   
                signPosx = 0 
            }
            sign.setPositionX(signPosx) 
            scoreLabel.setPositionX(signPosx + scoreLabel.getContentSize().width * 0.5 + sign.getContentSize().width)    

            if(user.dwUserID == selfdwUserID)
            {
                if(score!= 0)
                {
                    // var sp = score>0?'gameEndWin.png':'gameEndLose.png'
                    // playNode.winOrLoseSpr.setSpriteFrame(sp) 
                    managerAudio.playEffect(score>0?'gameRes/sound/win.mp3':'gameRes/sound/lost.mp3')
                }
            }

        }

    },
    _removeSprsOnGameEnd:function()
    {
        playNode.winOrLoseSpr.setSpriteFrame('empty.png') 
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {   
            var user = tableData.getUserWithChairId(wChairID)
            if(!user) continue

            playNode.clearCurrentRoundNode(user.userNodeInsetChair.currentRoundNode)
            chairFactory.hideFiredCircle.call(user.userNodeInsetChair)
        }
    },
    popGameEnd:function(continueCall, szNickName_gameEnd)
    {
        var cbWinFlag = []
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            if(wChairID==cmdBaseWorker.wExitUser)
                cbWinFlag[wChairID] = 6
        }

        var control = {}
        control.exitCall = function()
        {
        }

        control.continueCall = function()
        {
            continueCall()
            node.removeFromParent()
        }
        var node  = cc.BuilderReader.load(resp.gameEndPopCCB, control)

        // control.resultTTF.setString( args.msg )
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            if(typeof(cbWinFlag[wChairID])!='undefined')
            {
                control['winflag'+wChairID].setVisible(true)
                control['winflag'+wChairID].setSpriteFrame('winFlag_' + cbWinFlag[wChairID] + '.png') 
            }
            else
                control['winflag'+wChairID].setVisible(false)
            var score = cmdBaseWorker.lGameScore[wChairID]
            control['name'+wChairID].setString(szNickName_gameEnd[wChairID])
            control['win'+wChairID].setVisible(score>0)
            if(score>0)
            {
                control['scoreTTF'+wChairID].setString('+' + score)
                control['scoreTTF'+wChairID].color = cc.color(255, 0, 0)
                control['frame'+wChairID].setSpriteFrame('gend5.png')
            }
            else
            {
                control['scoreTTF'+wChairID].setString(score==0?'-'+score:score)
                control['scoreTTF'+wChairID].color = cc.color(0, 255, 0)
                control['frame'+wChairID].setSpriteFrame('gend6.png')
            }

            // var str = args.PlayerData[i]==-1?'(两帮)':('(' + args.PlayerData[i] + '分)')
            // control['pScoreTTF'+i].setString(str)
            // control['pScoreTTF'+i].x = control['scoreTTF'+i].width
        }

        node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5) )
        mainScene.top.addChild(node) 
    },
    ///gameend end////
    playGenderEffect:function(name, isMan)
    {
        if(isMan)
            managerAudio.playEffect('gameRes/sound/man/' + name + '.mp3')
        else
            managerAudio.playEffect('gameRes/sound/woman/' + name + '.mp3') 
    },
    resetPlayNode:function()
    {
        for(var i=0;i<GAME_PLAYER;i++)
        {
            tableNode.setBankerIcon(i, false)
        }

        for(var i=0;i<GAME_PLAYER;i++)
        {
            playNode['outCards' + i].setVisible(false)
        }
 
        playNode.headScoreNode.removeAllChildren()
        playNode.centerScoreNode.removeAllChildren()
        playNode.tailScoreNode.removeAllChildren()
        playNode.totalScoreNode.removeAllChildren()  

        playNode._removeSprsOnGameEnd()

        //同步数据
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var user = tableData.getUserWithChairId(wChairID)
            if(!user) continue

            var chair = tableData.getChairWithServerChairId(wChairID)
            var scoreTTF = chair.userNode.userScore
            scoreTTF.setString(  user.lScoreInGame  )
        }
    },
    /////////
    addChooseType:function()
    {
        var control = {}
        control.sureCall = function()
        {
            var isAllow = true
            var callFlag = 0
            var headCardDatas = []
            var centerCardDatas = []
            var tailCardDatas = []
            var headType = {}
            var centerType = {}
            var tailType = {}
            if(playNode.chooseTypeControl.sureBtn.specialType)
            {
                var specialType = playNode.chooseTypeControl.sureBtn.specialType
                
                callFlag = specialType.specialType
                headCardDatas = specialType.head.cardDatas
                centerCardDatas = specialType.center.cardDatas
                tailCardDatas = specialType.tail.cardDatas

                playNode.chooseTypeControl.sureNode.removeChildByTag(10001)
                playNode.chooseTypeControl.sureBtn.getBackgroundSpriteForState(cc.CONTROL_STATE_NORMAL).setSpriteFrame(cc.spriteFrameCache.getSpriteFrame('dc_sureBtn.png') )
                playNode.chooseTypeControl.sureBtn.getBackgroundSpriteForState(cc.CONTROL_STATE_HIGHLIGHTED).setSpriteFrame(cc.spriteFrameCache.getSpriteFrame('dc_sureBtn.png') )

                playNode.chooseTypeControl.sureBtn.specialType = null
            }
            else
            {
                for(var i=0;i<13;i++)
                {
                    if(i<3)
                      headCardDatas[i] = playNode.chooseTypeControl.bg.getChildByTag(i).cardData
                    else if(i<8)
                      centerCardDatas[i-3] = playNode.chooseTypeControl.bg.getChildByTag(i).cardData
                    else
                      tailCardDatas[i-8] = playNode.chooseTypeControl.bg.getChildByTag(i).cardData
                }
                headType = gameLogic.getType(cardLogic.sortWithNum(headCardDatas))
                centerType = gameLogic.getType(cardLogic.sortWithNum(centerCardDatas))
                tailType = gameLogic.getType(cardLogic.sortWithNum(tailCardDatas))
                
                isAllow = gameLogic.compareType(tailType, centerType)>=0 && gameLogic.compareType(centerType, headType)>=0 
            }

            if(isAllow)
            {
                var call = getObjWithStructName('CMD_C_Call')
                call.callBody.callFlag = callFlag
                call.callBody.headCardDatas = headCardDatas
                call.callBody.headLevel = headType.level
                call.callBody.headScore = headType.score

                call.callBody.centerCardDatas = centerCardDatas
                call.callBody.centerLevel = centerType.level
                call.callBody.centerScore = centerType.score

                call.callBody.tailCardDatas = tailCardDatas
                call.callBody.tailLevel = tailType.level
                call.callBody.tailScore = tailType.score

                socket.sendMessage(MDM_GF_GAME,SUB_C_CALL,call)

                playNode.chooseTypeControl.frame.x = -2000
                // control.bg.removeAllChildren()
                control.itemListNode.removeAllChildren()
                playNode.chooseTypeNode.setVisible(false)
            }
            else
            {
                showTipsTTF({str:'相公啦!', color:cc.color(222, 222, 22), size:24})              
            }
        }

        var node  = cc.BuilderReader.load(resp.chooseTypeCCB, control)
        node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5) )
        mainScene.uiTop.addChild(node) 
        node.setVisible(false)

        var listener = playNode.getChooseTypeBgListener()
        cc.eventManager.addListener(listener, control.bg)

        playNode.chooseTypeNode = node
        playNode.chooseTypeControl = control
    },
    getChooseTypeBgListener:function()
    {
        var pos2Idx = function(bg, posInBg)//assert pos不会超出bg
        {    
           var row = Math.floor( posInBg.x/(bg.width/5) ) 
           var line = 2 - Math.floor( posInBg.y/(bg.height/3) ) 

           if(line==0&&row>2)
                return -1

           return line==0?row:(line*5+row-2)
        }

        var chooseIdx = null;
        var touchBeganIdx = null;
        var listener = cc.EventListener.create
        ({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) 
            {
                var target = event.getCurrentTarget()
                if(!playNode.chooseTypeNode.isVisible())
                    return false
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) 
                {
                    var idx = pos2Idx(target, locationInNode)
                    if(idx!=-1) 
                    {
                        touchBeganIdx = idx
                        if(chooseIdx == null)
                        {
                            var spr = target.getChildByTag(touchBeganIdx)
                            spr.color = cc.color(144, 144, 144)
                        }

                        return true
                    }
                }

                return false
            },
            onTouchMoved: function (touch, event) 
            {
            },
            onTouchEnded: function (touch, event) 
            {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                var spr = target.getChildByTag(touchBeganIdx)
                if (cc.rectContainsPoint(rect, locationInNode)) 
                {
                    var idx = pos2Idx(target, locationInNode)
                    if(idx==-1 || (chooseIdx==null&&idx!=touchBeganIdx) )
                    {
                        spr.color = cc.color(255, 255, 255)
                        touchBeganIdx = null 
                    }
                    else
                    {
                        if(chooseIdx!=null)
                        {
                            var chooseSpr = target.getChildByTag(chooseIdx)
                            if(chooseIdx != touchBeganIdx)
                            {
                                var currentSpr = target.getChildByTag(touchBeganIdx)

                                var x1 = chooseSpr.x
                                var y1 = chooseSpr.y
                                var tag1 = chooseSpr.tag

                                var x2 = currentSpr.x
                                var y2 = currentSpr.y
                                var tag2 = currentSpr.tag

                                managerTouch.closeTouch()
                                chooseSpr.color = cc.color(255, 255, 255)
                                chooseSpr.zIndex = 1
                                currentSpr.zIndex = 1

                                var action = cc.sequence(
                                    cc.spawn(
                                        cc.targetedAction(chooseSpr, cc.moveTo(0.2, cc.p(x2, y2))),
                                        cc.targetedAction(currentSpr, cc.moveTo(0.2, cc.p(x1, y1)))
                                    ),
                                    cc.callFunc(
                                    function()
                                    {   
                                        chooseSpr.tag = tag2
                                        currentSpr.tag = tag1
                                        chooseSpr.zIndex = 0
                                        currentSpr.zIndex = 0
                                        chooseIdx = null
                                        touchBeganIdx = null 
                                        managerTouch.openTouch()
                                    }))

                                target.runAction(action)
                            }
                            else
                            {
                                chooseSpr.color = cc.color(255, 255, 255)
                                chooseIdx = null
                                touchBeganIdx = null 
                            }
                        }
                        else
                            chooseIdx = touchBeganIdx
                    }
                }
                else
                    spr.color = cc.color(255, 255, 255)
            }
        })


        return listener
    },
    showChooseType:function(cardDatas)
    {
        playNode.playGenderEffect('start_poker', tableData.getUserWithUserId(selfdwUserID).cbGender)
        // var cardDatas = [1,17,3,4,5,6,7,8,9,10,11,12,28]
        playNode.chooseTypeNode.setVisible(true)
        var typeList = gameLogic.getTypeList(cardDatas)
        /////draw cardspr
        // var bgWidth = playNode.chooseTypeControl.bg.width
        // var bgHeight = playNode.chooseTypeControl.bg.height

        // var intervalX = (bgWidth)/5
        // var intervalY = (bgHeight)/3
        
        for(var i=0;i<13;i++)
        {
            if(i<3)
                var cardData = typeList[0].head.cardDatas[i]
            else if(i<8)
                var cardData = typeList[0].center.cardDatas[i-3]
            else
                var cardData = typeList[0].tail.cardDatas[i-8] 

            var spr = playNode.chooseTypeControl.bg.getChildByTag(i)
            spr.setSpriteFrame('hand_' + cardData + '.png')
            spr.cardData = cardData
            spr.color = spr.color//没这句 spr.setSpriteFrame不生效。。。

            // var spr = cardFactory.getOne(cardData, 0, 0)
            // spr.scaleX = bgWidth/5/spr.width *0.9
            // spr.scaleY = bgHeight/3/spr.height *0.9
            // if(i<3)
            // {
            //     var row = i
            //     var line = 0
            // }
            // else
            // {
            //     var row = (i-3)%5
            //     var line = Math.ceil( (i-2)/5 ) 
            // }

            // spr.x = intervalX/2 + row*intervalX
            // spr.y = intervalY/2 + (2-line)*intervalY

            // playNode.chooseTypeControl.bg.addChild(spr, 0, i)
        }


        if( typeList[0].specialType )
        {
            var effect = actionFactory.getSprWithAnimate('playEffect1_', false, 0.2)
            playNode.chooseTypeControl.sureNode.addChild(effect, 0, 10001)
            playNode.chooseTypeControl.sureBtn.getBackgroundSpriteForState(cc.CONTROL_STATE_NORMAL).setSpriteFrame(cc.spriteFrameCache.getSpriteFrame('btnType' + typeList[0].specialType + '_1.png') )
            playNode.chooseTypeControl.sureBtn.getBackgroundSpriteForState(cc.CONTROL_STATE_HIGHLIGHTED).setSpriteFrame(cc.spriteFrameCache.getSpriteFrame('btnType' + typeList[0].specialType + '_2.png') )
           
            playNode.chooseTypeControl.sureBtn.specialType = typeList[0]

            return 
        }


        // if(typeof(typeList) == 'number')
        // {
        //     playNode.specialCount.setVisible(true)
        //     playNode.specialCountBtn.specialType = typeList

        //     var effect = actionFactory.getSprWithAnimate('playEffect1_', false, 0.2)
        //     playNode.specialCount.addChild(effect, 0, 10001)
        //     playNode.specialCountBtn.getBackgroundSpriteForState(cc.CONTROL_STATE_NORMAL).setSpriteFrame(cc.spriteFrameCache.getSpriteFrame('btnType' + typeList + '_1.png') )
        //     playNode.specialCountBtn.getBackgroundSpriteForState(cc.CONTROL_STATE_HIGHLIGHTED).setSpriteFrame(cc.spriteFrameCache.getSpriteFrame('btnType' + typeList + '_2.png') )
        //     return;
        // }




        //item
        var listView = new ccui.ListView()
        listView.setDirection(ccui.ScrollView.DIR_HORIZONTAL)
        listView.setTouchEnabled(true)
        listView.setBounceEnabled(true)
        listView.setBackGroundImage(resp_p.empty)
        listView.setBackGroundImageScale9Enabled(true)

        listView.setContentSize(playNode.chooseTypeControl.itemListNode.getContentSize().width,playNode.chooseTypeControl.itemListNode.getContentSize().height)
        listView.x = 0
        listView.y = 0
        playNode.chooseTypeControl.itemListNode.addChild(listView)

        var frame = new cc.Sprite('#dc_listBg2.png')
        var listViewHeight = listView.getContentSize().height
        var itemWidth = 180
        for(var i=0;i<typeList.length;i++)
        {   
            var type = typeList[i]
            var default_item = new ccui.Layout()
            default_item.setContentSize(itemWidth, listViewHeight)
            if(i==0)
            {
                default_item.addChild(frame)
                frame.x = itemWidth/2
                frame.y = listViewHeight/2
            }

            var itemIconBtn = new ccui.Button('dc_listBg1.png', 'dc_listBg1.png', 'dc_listBg1.png', ccui.Widget.PLIST_TEXTURE)
            itemIconBtn.x = itemWidth/2
            itemIconBtn.y = listViewHeight/2
            itemIconBtn.tag = i
            itemIconBtn.addClickEventListener(function(itemIconBtn) {
                var tag = itemIconBtn.tag
                var type = typeList[tag]

                frame.removeFromParent()
                itemIconBtn.getParent().addChild(frame)
                frame.x = itemIconBtn.x
                frame.y = itemIconBtn.y

                for(var ii=0;ii<13;ii++)
                {
                    if(ii<3)
                        var cardData = type.head.cardDatas[ii]
                    else if(ii<8)
                        var cardData = type.center.cardDatas[ii-3]
                    else
                        var cardData = type.tail.cardDatas[ii-8] 
                    var spr = playNode.chooseTypeControl.bg.getChildByTag(ii)
                    spr.setSpriteFrame('hand_' + cardData + '.png')
                    spr.cardData = cardData
                    spr.color = spr.color

                    // cardFactory.updateIdxOfCardSpr(playNode.chooseTypeControl.bg.getChildByTag(ii), cardData)
                }
            }.bind(this))
            default_item.addChild(itemIconBtn)



            var headLabel = cc.LabelTTF.create('头道', "Helvetica", 20)
            // headLabel.enableStroke(cc.color(0, 0, 0, 255), 2)
            headLabel.x = itemWidth/2
            headLabel.y = listViewHeight/2 + 38
            default_item.addChild(headLabel)


            var centerLabel = cc.LabelTTF.create('中道', "Helvetica", 20)
            // centerLabel.setFontFillColor( cc.color(222, 44, 44, 255) )
            // centerLabel.enableStroke(cc.color(0, 0, 0, 255), 2)
            centerLabel.x = itemWidth/2
            centerLabel.y = listViewHeight/2
            default_item.addChild(centerLabel)


            var tailLabel = cc.LabelTTF.create('尾道', "Helvetica", 20)
            // tailLabel.setFontFillColor( cc.color(222, 44, 44, 255) )
            // tailLabel.enableStroke(cc.color(0, 0, 0, 255), 2)
            tailLabel.x = itemWidth/2
            tailLabel.y = listViewHeight/2 - 38
            default_item.addChild(tailLabel)

            headLabel.setString( gameLogic.level2Name[type.head.type.level] )
            centerLabel.setString( gameLogic.level2Name[type.center.type.level] )
            tailLabel.setString( gameLogic.level2Name[type.tail.type.level] )

            var color1 = cc.color(0, 101, 59, 255)
            var color2 = cc.color(222, 44, 44, 255)
            headLabel.color = type.head.type.level==3?color2:color1
            centerLabel.color = type.center.type.level>5?color2:color1
            tailLabel.color = type.tail.type.level>6?color2:color1

            listView.pushBackCustomItem(default_item)
        }
        listView.forceDoLayout()

        listView.setTouchEnabled(listView.getItem(listView._items.length-1) && listView.getItem(listView._items.length-1).getPositionX()+listView.getItem(0).getContentSize().width>listView.width)
    },
    getTurnCardAction:function(cardSprs, cardDatas, daoNum, level, typeSpr, isMan)
    {
        var levelName = 'level_' + level
        if(level==3 && daoNum==0)//0头1中2尾
            levelName += '_y'
        if(level==6 && daoNum==1)
            levelName += '_y'
        var actions = []
        for(var i=0;i<cardSprs.length;i++)
        {    
            var target = cardSprs[i]
            var endCardIdx = cardDatas[i]
            var a1 = playNode.getTurnOverAction(target, endCardIdx)
            actions[actions.length] = cc.targetedAction( target, a1 )   
        }

        var spawn = cc.spawn(actions)

        var sequence = cc.sequence(spawn,
            cc.callFunc(
            function()
            {   
                typeSpr.setSpriteFrame(levelName + '.png')
                typeSpr.y = 65*(3-daoNum)
                playNode.playGenderEffect(levelName, isMan)
            }),
            cc.delayTime(1),
            cc.callFunc(
            function()
            {   
                typeSpr.setSpriteFrame('empty.png') 
            })
            )
        return sequence
    },
    getTurnOverAction:function(target, endCardIdx, endAction, scale)
    {
        scale = scale || target.getScale()
        // //var a1 = cc.orbitCamera(0.2, 1, 0, 0, 90, 0, 0) 安卓不支持
        var a1 = cc.delayTime(0.3)   //cc.scaleTo(0.5, scale*1.8, scale*1.8)
        var a2 = cc.callFunc(
                    function()
                    {   
                        target.setSpriteFrame('out_' + endCardIdx + '.png') 
                        // target.setFlippedX(true) 
                    })
        // var a3 = cc.orbitCamera(0.2, 1, 0, 90, 90, 0, 0)
        var a3 = cc.delayTime(0.3)  //cc.scaleTo(0.5, scale, scale)
        var a4 = cc.sequence(a1, a2, a3)

        return endAction?cc.sequence(a4, endAction):a4
    },
    getDaqiangAction:function(showChairid1, showChairid2)
    {
        var outCardsNode1 = playNode['outCards' + showChairid1]
        var outCardsNode2 = playNode['outCards' + showChairid2]


        var qiang = new cc.Sprite('#shoot_gun.png')

        var isFlip = outCardsNode1.x>outCardsNode2.x

        var tan = Math.abs(outCardsNode1.y-outCardsNode2.y)/Math.abs(outCardsNode1.x-outCardsNode2.x)
        var rotation = (isFlip?-1:1)*(outCardsNode1.y>outCardsNode2.y?1:-1)*Math.atan(tan)/3.14*180

        qiang.setFlippedX(isFlip)
        qiang.rotation = rotation


        var sequence = cc.sequence(
            cc.callFunc(
            function()
            {   
                outCardsNode1.addChild(qiang)
                managerAudio.playEffect('gameRes/sound/daqiang2.mp3')
            }),
            cc.delayTime(0.3),
            cc.callFunc(
            function()
            {   
                managerAudio.playEffect('gameRes/sound/daqiang2.mp3')
            }),
            cc.delayTime(0.3),
            cc.callFunc(
            function()
            {   
                managerAudio.playEffect('gameRes/sound/daqiang2.mp3')
            }),
            cc.delayTime(0.8),
            cc.callFunc(
            function()
            {   
                qiang.removeFromParent()
                if(showChairid1==0 || showChairid2==0)
                {
                    var wChairID1 = tableData.getServerChairIdWithShowChairId(showChairid1)
                    var wChairID2 = tableData.getServerChairIdWithShowChairId(showChairid2)

                    var totalScoreLabel = playNode.totalScoreNode.getChildByTag(101)
                    var totalScore = totalScoreLabel.totalScore 

                    for(var i=0;i<3;i++)
                    {
                        totalScore += cmdBaseWorker.lBaseScore[wChairID1][wChairID2][i]*(showChairid1==0?1:-1)
                        totalScore += cmdBaseWorker.lExtraScore[wChairID1][wChairID2][i]*(showChairid1==0?1:-1)
                    }

                    playNode.totalScoreNode.removeAllChildren()

                    var totalScorePng = totalScore>=0?resp.nums5:resp.nums4
                    var totalScoreLabel = new ccui.TextAtlas(':' + Math.abs(totalScore), totalScorePng, 24.6, 32, "0")
                    totalScoreLabel.totalScore = totalScore
                    playNode.totalScoreNode.addChild(totalScoreLabel, 0, 101)
                }


            })
            )


        return sequence
    },
    getSpecialAction:function(specialType, showChairid, isMan, cardDatas)
    {
        var outCardsNode = playNode['outCards' + showChairid]
        var spr = new cc.Sprite('#special_'+specialType+'.png')

        var sequence = cc.sequence(
                cc.callFunc(
                function()
                {   
                    outCardsNode.getChildByTag(100).setSpriteFrame('empty.png')   
                    outCardsNode.addChild(spr)
                    playNode.playGenderEffect('special_'+specialType, isMan)

                    if(specialType==0)//全垒打
                    {
                        var totalScoreLabel = playNode.totalScoreNode.getChildByTag(101)
                        var totalScore = totalScoreLabel.totalScore 

                        if(showChairid==0)
                        {
                            var chairid0 = tableData.getServerChairIdWithShowChairId(0)
                            for(showid=1;showid<GAME_PLAYER;showid++)
                            {
                                var wChairID = tableData.getServerChairIdWithShowChairId(showid)
                                for(var i=0;i<3;i++)
                                {
                                    totalScore += cmdBaseWorker.lBaseScore[chairid0][wChairID][i]*2
                                    totalScore += cmdBaseWorker.lExtraScore[chairid0][wChairID][i]*2
                                }
                            }
                        }
                        else
                        {
                            var chairid = tableData.getServerChairIdWithShowChairId(showChairid)
                            var chairid0 = tableData.getServerChairIdWithShowChairId(0)
                            for(var i=0;i<3;i++)
                            {
                                totalScore -= cmdBaseWorker.lBaseScore[chairid][chairid0][i]*2
                                totalScore -= cmdBaseWorker.lExtraScore[chairid][chairid0][i]*2
                            }
                        }

                        playNode.totalScoreNode.removeAllChildren()

                        var totalScorePng = totalScore>=0?resp.nums5:resp.nums4
                        var totalScoreLabel = new ccui.TextAtlas(':' + Math.abs(totalScore), totalScorePng, 24.6, 32, "0")
                        totalScoreLabel.totalScore = totalScore
                        playNode.totalScoreNode.addChild(totalScoreLabel, 0, 101)
                    }
                    else
                    {
                        for(var i=0;i<13;i++)
                        {
                            var cardData = cardDatas[i]
                            outCardsNode.getChildByTag(i).setSpriteFrame('out_'+cardData+'.png')
                        }
                        var joinNum = 0
                        for(wChairID=0;wChairID<GAME_PLAYER;wChairID++)
                        {
                            if(cmdBaseWorker.cbCallRecord[wChairID].callFlag!=254)
                                joinNum += 1
                        }

                        var totalScoreLabel = playNode.totalScoreNode.getChildByTag(101)
                        var totalScore = totalScoreLabel.totalScore 

                        var map = [6, 6, 6, 12, 12, 12, 12, 13, 26]

                        totalScore += map[specialType-1]*(showChairid==0?(joinNum-1):-1)

                        playNode.totalScoreNode.removeAllChildren()

                        var totalScorePng = totalScore>=0?resp.nums5:resp.nums4
                        var totalScoreLabel = new ccui.TextAtlas(':' + Math.abs(totalScore), totalScorePng, 24.6, 32, "0")
                        totalScoreLabel.totalScore = totalScore

                        playNode.totalScoreNode.addChild(totalScoreLabel, 0, 101)
                    }
                }),
                cc.delayTime(1),
                cc.callFunc(
                function()
                {   
                    spr.removeFromParent()
                })
                )

        
        return sequence

    }




}

