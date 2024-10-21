
var addScoreTime = 20
var countTime = 20

var playNode = 
{   
    selectedCards:[],
    isUserAddScore:false,
    isUserCount:false,
    tipsArray:[],
    handCardInterval:0,
    idxsGroupNode:null,
    init:function()
    {   
        playNode._initCallBack()
        var node = managerRes.loadCCB(resp.playCCB, this)
        playNode.animationManager = node.animationManager
        playNode.node  = node
        playNode._bindListener()
        playNode._initDrawCardNode()

        var nodeSize = playNode.node.getContentSize()
        playNode.handCardInterval = Math.floor( (nodeSize.width - 150 )/18 )

        playNode.commonCount.setVisible(false)
        playNode.notCount.setVisible(false)
        playNode.addScoreNode.setVisible(false)

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "touchTableBottom",
            callback: function(event)
            {   
                playNode.resetSelectedCards()
                playNode.hideChooseTypeNode()
            }
        })
        cc.eventManager.addListener(l, 1)

        // playNode.tableKeyTTF.setString(tableKey)


        // tableNode.registerCloseClock(playNode.closeClockLabel)
        // var l = cc.EventListener.create({
        //     event: cc.EventListener.CUSTOM,
        //     eventName: "isOpenUpdate",
        //     callback: function(event)
        //     {   
        //         playNode.closeClockTitle.setVisible( tableData.bIsOpened )
        //         tableNode.remainOpenTimeTTF2.setVisible( !tableData.bIsOpened )
        //     }
        // })
        // cc.eventManager.addListener(l, 1)
    },
    _initCallBack:function()
    {   
        playNode._initCountCall()
        playNode._initAddScoreCall()
    },
    _bindListener:function()
    {
    },
    ////////////AddScore start///////////
    _initAddScoreCall:function()
    {
        var callCard = function(cbParam1, cbParam2)
        {
            var CallCard = getObjWithStructName('CMD_C_CallCard') 
            CallCard.cbParam1 = cbParam1
            CallCard.cbParam2 = cbParam2
            socket.sendMessage(MDM_GF_GAME, SUB_C_CALL_CARD, CallCard)
            playNode.isUserAddScore = true
            playNode.hideAddScoreNode()
        }

        playNode.addScoreCall1 = function(){ callCard(1, 3) }
        playNode.addScoreCall2 = function(){ callCard(1, 2) }
        playNode.addScoreCall3 = function(){ callCard(1, 1) }
        playNode.addScoreCall4 = function(){ callCard(0, 0) }
        playNode.addScoreCall5 = function(){ callCard(4, 1) }
        playNode.addScoreCall6 = function(){ callCard(4, 0) }
        playNode.drawCardCall = function(){ callCard(6, 23) }
 
    },
    popAddScoreNode:function(isCan, turnType)
    {
        if(turnType == 6)
            playNode.showDrawCardNode(isCan?1:2)
        else
        {
            if(!isCan) return;

            playNode.addScoreNode.setVisible(true) 
            switch(turnType)
            {
                case 0: //无状态进入 叫三分，叫两分，不叫的状态
                {
                    playNode.addScoreBtn1.setVisible(true)
                    playNode.addScoreBtn2.setVisible(false)
                    playNode.addScoreBtn3.setVisible(true)
                    playNode.addScoreBtn4.setVisible(false)
                    playNode.addScoreBtn5.setVisible(false)
                    playNode.addScoreBtn6.setVisible(false)
                    playNode.addScoreBtn7.setVisible(false)
                    break
                }
                case 1: //反/不反
                {
                    playNode.addScoreBtn1.setVisible(false)
                    playNode.addScoreBtn2.setVisible(false)
                    playNode.addScoreBtn3.setVisible(false)
                    playNode.addScoreBtn4.setVisible(false)
                    playNode.addScoreBtn5.setVisible(true)
                    playNode.addScoreBtn6.setVisible(true)
                    playNode.addScoreBtn7.setVisible(false)
                    break
                }
                case 2: //叫三分 不叫
                {
                    playNode.addScoreBtn1.setVisible(true)
                    playNode.addScoreBtn2.setVisible(false)
                    playNode.addScoreBtn3.setVisible(false)
                    playNode.addScoreBtn4.setVisible(true)
                    playNode.addScoreBtn5.setVisible(false)
                    playNode.addScoreBtn6.setVisible(false)
                    playNode.addScoreBtn7.setVisible(false)
                    break
                }
                case 4: 
                {
                    playNode.addScoreBtn1.setVisible(false)
                    playNode.addScoreBtn2.setVisible(false)
                    playNode.addScoreBtn3.setVisible(false)
                    playNode.addScoreBtn4.setVisible(false)
                    playNode.addScoreBtn5.setVisible(false)
                    playNode.addScoreBtn6.setVisible(true)
                    playNode.addScoreBtn7.setVisible(true)
                    break
                }
            }
        }  
    },
    hideAddScoreNode:function()
    {
        playNode.addScoreNode.setVisible(false)

        playNode.drawerNode.setVisible(false)
        for(var i=1;i<7;i++)
        {
            cardFactory.reset.call(playNode['drawCardSpr'+i])
        }
        playNode.notDrawerNode.setVisible(false)
    },
    showAddScoreFiredCircle:function(user, time)
    {
        time = typeof(time) == 'number'?time:addScoreTime
        if(!user) return;//弃牌的人强退不会结束游戏 
        chairFactory.showFiredCircle.call(user.userNodeInsetChair, time)
    },
    hideAddScoreFiredCircle:function(user)
    {
        if(!user) return;//弃牌的人强退不会结束游戏 
        chairFactory.hideFiredCircle.call(user.userNodeInsetChair)
    },    
    startAddScoreClock:function(isCan, time)
    {   
        time = typeof(time) == 'number'?time:addScoreTime
        if(isCan)
        {
            var c = clock.getOneClock(time, 
            function()
            {
            },
            function()
            {
                if(parseInt( c.clockLabel.getString() ) <= 3 && !playNode.isUserAddScore)
                    managerAudio.playEffect('gameRes/sound/tick.mp3')
            })  
            playNode.clockNode.addChild(c.clockNode)
        }
        else
        {   
            // var c = clock.getOneClock(time)
        }

        // playNode.clockNode.addChild(c.clockNode)
    },
    stopAddScoreClock:function(isCan)
    {   
        if(!isCan) return;
        playNode.clockNode.removeAllChildren()
    },
    ////////////////draw
    _initDrawCardNode:function() 
    {
        var isSelect3 = function()
        {
            var selectNum = 0
            for(var i=1;i<7;i++)
            {
                var isselected = playNode['drawCardSpr'+i].isselected
                selectNum = isselected?selectNum+1:selectNum
            }  
            return selectNum == 3
        }

        var selectedCall = function(target)
        {   
            playNode.drawCardBtn.setEnabled(isSelect3())
        }

        var unSelectedCall = function(target)                                                               
        {
            playNode.drawCardBtn.setEnabled(isSelect3())
        }

        var isEnableFun = function(isselected)
        {
            if(!isselected)
                return !isSelect3() && playNode.drawerNode.isVisible()
            return playNode.drawerNode.isVisible()
        }

        for(var i=1;i<7;i++)
        {
            var card = cardFactory.getOne(null, true, true)
            cardFactory.bindListener(card, selectedCall, unSelectedCall, isEnableFun)
            card.setScale(0.41)
            var s = playNode['drawCardNode'+i].getContentSize()
            card.setPosition(cc.p(s.width*0.5, s.height*0.5))


            card.getChildByTag(101).setScale(1.1)

            playNode['drawCardNode'+i].addChild(card)
            playNode['drawCardSpr'+i] = card
        }
    },
    updateDiCard:function(cbDiCardData)
    {
        for(var i=0;i<6;i++)
        {
            if(cbDiCardData[i])
            {
                playNode['drawCardSpr'+(i+1)].setSpriteFrame('card_'+cbDiCardData[i]+'.png') 
            }
            else
                break          
        }
    },
    showDrawCardNode:function(type)
    {
        playNode.drawCardNode.setVisible(true)
        playNode.drawCardBtn.setEnabled(false)

        switch(type)
        {
            case 1:
            {
                playNode.drawerNode.setVisible(true)
                playNode.notDrawerNode.setVisible(false)
                break
            }
            case 2:
            {
                playNode.drawerNode.setVisible(false)
                playNode.notDrawerNode.setVisible(true)
                break
            }
            case 3:
            {
                playNode.drawerNode.setVisible(false)
                playNode.notDrawerNode.setVisible(false)
                break
            }
        }
    },
    hideDrawCardNode:function()
    {
        playNode.drawCardNode.setVisible(false)
    },
    callCard:function(turnChairID, cbParam1, cbParam2)
    {
        var user = tableData.getUserWithChairId(turnChairID)
        if(!user) return;//弃牌的人强退不会结束游戏 
        var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
        tipsSpr.setSpriteFrame('callSpr_'+cbParam1+cbParam2+'.png') 

        managerAudio.playEffect('gameRes/sound/' + 'call_'+cbParam1+cbParam2+'.mp3')    
    },
    clearCallCard:function(turnChairID)
    {
        var user = tableData.getUserWithChairId(turnChairID)
        if(!user) return;//弃牌的人强退不会结束游戏 
        var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
        tipsSpr.setSpriteFrame('empty.png') 
    },
    callExit:function(wTurnChairID, cbParam1, cbParam2)
    {
        if(wTurnChairID == INVALID_WORD) return 

        var self = tableData.getUserWithUserId(selfdwUserID)
        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, wTurnChairID)
        var isSelf = wTurnChairID == self.wChairID

        playNode.hideAddScoreFiredCircle(user)
        playNode.hideAddScoreNode()
        playNode.stopAddScoreClock(isSelf)

        if(typeof(cbParam1)!='undefined')
            playNode.callCard(wTurnChairID, cbParam1, cbParam2)
    },
    callEnter:function(wCurrentUser, cbTurnType, time)
    {   
        if(wCurrentUser == INVALID_WORD) return 

        var self = tableData.getUserWithUserId(selfdwUserID)
        var isSelf = wCurrentUser == self.wChairID
        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, wCurrentUser)
        playNode.showAddScoreFiredCircle(user, time)
        playNode.startAddScoreClock(isSelf, time)

        if(typeof(cbTurnType)!='undefined')
            playNode.popAddScoreNode(isSelf, cbTurnType)

    },
    ////////////AddScore end///////////



    ////////////count start///////////
    _outCardForCountCall1:function(cardsType)
    {
        var isAllowOut = false
        if(cardsType)
        {
            if(!playData.lastOutCardType.idxs)
                isAllowOut = cardsType.typeIdx > 0
            else
            {
                var cardsType2 = playData.lastOutCardType
                var c = gameLogic.compareTwoCardsType(cardsType, cardsType2) 
                isAllowOut = c == 0
            }
        }

        if(isAllowOut)
        {
            var c = cardsType.idxs
            for(var i in c) //3821只有大小王是癞子 不改类型 可以这样特殊处理下 
            {   
                if(c[i]>=80)
                {
                    c[i] = c[i] - 78*16
                }
            }
            var OutCard = getObjWithStructName('CMD_C_OutCard')
            OutCard.cbCardCount = c.length
            OutCard.cbCardData = c

            socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
            playNode.hideCountNode(true)
            playNode.isUserCount = true
        }
        else
        {
            showTips({str:'您的出牌不合理'}) 
        }
    },
    _initCountCall:function()
    {
        playNode.countCall1 = function()
        {             
            var cards = []
            for(var i in playNode.selectedCards)
                cards[i] = playNode.selectedCards[i].cardIdx
            gameLog.log('cards:', cards)
            var cardsTypeArrray = gameLogic.getCardsTypesWithIdx54s(cardLogic.sortWithNum(cards), [78, 79]) 
                       

            if(cardsTypeArrray.length>1)
            {
                var paramsArray = []

                for(var i in cardsTypeArrray)
                {   
                    (function(i)
                    {
                        var cardsType = cardsTypeArrray[i]
                        var p = {}
                        p.idxs = cardsType.idxs
                        p.id = cardsType.id
                        p.sureCall = function()
                        {
                            playNode._outCardForCountCall1(cardsType)
                        }
                        
                        paramsArray[paramsArray.length] = p
                    }(i))
                }
                playNode.popChooseTypeNode(paramsArray)
            }
            else
                playNode._outCardForCountCall1(cardsTypeArrray[0])

        }

        playNode.countCall3 = function()
        {   
            playNode.resetSelectedCards()
            
            playNode.isUserCount = true
            playNode.hideCountNode(true)
            socket.sendMessage(MDM_GF_GAME, SUB_C_PASS_CARD) 
        }

        playNode.countCall2 = function()
        {         
            playNode.resetSelectedCards()

            var idxs = playNode.tipsArray[playNode.countButton2.currentTipsIdx]
            playNode.selectCards(idxs)

            playNode.countButton2.currentTipsIdx = (playNode.countButton2.currentTipsIdx + 1)%playNode.tipsArray.length
        }

    },
    selectCards:function(idxs)
    {
        for(var i=0;i<idxs.length;i++)
        {
            var idx = idxs[i]
            if(idx>=80)
                idx = cardLogic.getIdx54OfLaiziWithColorAndIdx_laizi(idx, 0) 

            var tag = playNode.idxsGroupNode.cardIdx2Tag[idx]
            var card = playNode.idxsGroupNode.getChildByTag(tag)
            cardFactory.onTouchEnd.call(card)    
        }
    },
    onSelectCard:function(card)
    {
        var isSelect = card.isselected
        var cardIdx = card.cardIdx
        if(isSelect)
        {
            playNode.selectedCards[playNode.selectedCards.length] = card
        }
        else
        {
            for(var i=playNode.selectedCards.length-1;i>=0;i--)
            {
                if(playNode.selectedCards[i].cardIdx == cardIdx)
                {
                    playNode.selectedCards.splice(i,1)
                    break
                }
            }
        }
        playNode.countButton1.setEnabled(playNode.selectedCards.length!=0)
    },
    resetSelectedCards:function()
    {
        var len = playNode.selectedCards.length
        for(var i = len-1;i>=0;i--)
        {
            var c = playNode.selectedCards[i]
            cardFactory.onTouchEnd.call(c)
        }
        // playNode.selectedCards = []
    },
    popCountNode:function(isCan)
    {
        //上一次没人出牌 或者上一次自己出的牌
        if(!isCan) return;
        if(!playData.lastOutCardType.idxs)
        {
            // playNode.tipsArray = gameLogic.getTipsArray({typeIdx:0, typeLevel:0, typeScores:0, typeKind:0}, clone(playData.handCardIdxs), [78, 79])
            // playNode.countButton2.currentTipsIdx = 0
            playNode.tipsArray = gameLogic.getTipsArrayForFirstOut( playData.handCardIdxs )
            playNode.countButton2.currentTipsIdx = 0
        }
        else
        {
            var cardsType = playData.lastOutCardType
            playNode.tipsArray = gameLogic.getTipsArray(cardsType, cardLogic.sortWithNum(clone(playData.handCardIdxs)), [78, 79])
            playNode.countButton2.currentTipsIdx = 0
        }

        var isAllowPass = playData.lastOutCardType.idxs //playData.lastOutCardUser != null && playData.lastOutCardUser!=tableData.getUserWithUserId(selfdwUserID).wChairID
        playNode.countButton3.setEnabled( isAllowPass )

        var isPopCount = !isAllowPass || playNode.tipsArray.length != 0
        playNode.commonCount.setVisible(isPopCount)
        playNode.notCount.setVisible(!isPopCount)

        playNode.countButton1.setEnabled(playNode.selectedCards.length!=0)
        playNode.countButton2.setEnabled(playNode.tipsArray.length>0)

        // if(playNode.tipsArray.length==1)
        //     playNode.selectCards(playNode.tipsArray[0])
    },
    hideCountNode:function(isCan)
    {   
        if(!isCan) return;

        playNode.tipsArray = []
        playNode.commonCount.setVisible(false)
        playNode.notCount.setVisible(false)  
    },
    showCountFiredCircle:function(user, time)
    {   
        time = typeof(time) == 'number'?time:countTime
        if(!user) return;//弃牌的人强退不会结束游戏 
        chairFactory.showFiredCircle.call(user.userNodeInsetChair, time)
    },
    hideCountFiredCircle:function(user)
    {
        if(!user) return;//弃牌的人强退不会结束游戏 
        chairFactory.hideFiredCircle.call(user.userNodeInsetChair)
    },  
    startCountClock:function(isCan, time)
    {   
        time = typeof(time) == 'number'?time:countTime

        if( isCan )
        {
            var c = clock.getOneClock(time, 
            function()
            {
            },
            function()
            {
                if(parseInt( c.clockLabel.getString() ) <= 3 && !playNode.isUserCount)
                    managerAudio.playEffect('gameRes/sound/tick.mp3')
            }
            )  
            playNode.clockNode.addChild(c.clockNode)
        }
        else
        {
            //var c = clock.getOneClock(time)
        }
        
    },
    stopCountClock:function(isCan)
    {
        if(!isCan) return;
        playNode.clockNode.removeAllChildren()
    },
    outCard:function(chairID, outCards)
    {
        var user = tableData.getUserWithChairId(chairID)
        playNode.refreshOutCards(user, outCards)
        managerAudio.playEffect('gameRes/sound/outcard.mp3')
    },
    passCard:function(chairID)
    {
        var user = tableData.getUserWithChairId(chairID)
        if(!user) return;//弃牌的人强退不会结束游戏 
        var outCardsNode = user.userNodeInsetChair.currentRoundNode.outCards
        outCardsNode.removeAllChildren()   

        var spr = new cc.Sprite('#outSpr_1.png')
        var x = 0.5
        if(user.dwUserID != selfdwUserID)
        {
            var chair = tableData.getChairWithServerChairId(user.wChairID)
            x = chairFactory.isRight(chair.node)?1:0
        }
        spr.setAnchorPoint(cc.p(x, 0.5))
        outCardsNode.addChild(spr)

        managerAudio.playEffect('gameRes/sound/passCard.mp3')
    },
    clearOutCards:function(chairID)
    {
        var user = tableData.getUserWithChairId(chairID)
        if(!user) return;//弃牌的人强退不会结束游戏 
        var outCardsNode = user.userNodeInsetChair.currentRoundNode.outCards
        outCardsNode.removeAllChildren()   
    },
    showSingleWinPosition:function(chairID, cbSingleWinPosition)
    {
        var user = tableData.getUserWithChairId(chairID)
        if(!user) return;//弃牌的人强退不会结束游戏 
        var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
        console.log(3333,'singleWinPosition_'+cbSingleWinPosition+'.png')
        tipsSpr.setSpriteFrame('singleWinPosition_'+cbSingleWinPosition+'.png') 
    },
    outCardExit:function(wOutCardUser, isPass)
    {
        if(wOutCardUser == INVALID_WORD) return 

        var self = tableData.getUserWithUserId(selfdwUserID)
        var isSelfOut = self.wChairID == wOutCardUser
        var userOut = tableData.getUserWithChairId(wOutCardUser)

        ////////
        playNode.hideCountFiredCircle(userOut)
        playNode.hideCountNode(isSelfOut)
        playNode.stopCountClock(isSelfOut)

        if(isPass)
        {
            playNode.passCard(wOutCardUser)
            return 
        }
console.log(333333, playData.lastOutCardType)
        playNode.outCard(wOutCardUser, playData.lastOutCardType.idxs)                        
        if(isSelfOut)
        {         
            for(var i in playData.lastOutCardType.idxs)
            {
                for(var j in playData.handCardIdxs)
                {
                    var c = playData.lastOutCardType.idxs[i]
                    c = c>=80?cardLogic.getIdx54OfLaiziWithColorAndIdx_laizi(c, 0):c

                    if(c == playData.handCardIdxs[j])
                    {
                        playData.handCardIdxs.splice(j,1)
                        break
                    }
                }
            }

            if(playData.handCardIdxs.length>0)
                playNode.sendCardsAction(playData.handCardIdxs)  //这里可以优化
            else
                playNode.clearHandCards()
        }
        else
            playNode.minusHandCardsNum(userOut, playData.lastOutCardType.idxs.length)
    },
    outCardEnter:function(wCurrentUser, time)
    {
        if(wCurrentUser == INVALID_WORD) return 
            
        var self = tableData.getUserWithUserId(selfdwUserID)
        playNode.clearOutCards(wCurrentUser)

        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, wCurrentUser)
        playNode.showCountFiredCircle(user, time)

        var iscan = self.wChairID == wCurrentUser
        playNode.popCountNode(iscan)
        playNode.startCountClock(iscan, time)
    },
    ////////////count end///////////

    //////handcards start/////
    clearHandCards:function()
    {
        var user = tableData.getUserWithUserId(selfdwUserID)
        if(!user) return;//弃牌的人强退不会结束游戏 
        user.userNodeInsetChair.currentRoundNode.handCards.removeAllChildren()
    },
    sendCardsAction:function(handCardIdxs, callback, transition)
    {
        playNode._sendCardsAction(handCardIdxs, callback, transition) 
    },
    _sendCardsAction:function(handCardIdxs, callback, transition)
    {   
        var cards = handCardIdxs
        gameLogic.sortIdxsWithScore(cards, [78, 79]) 
        var user = tableData.getUserWithUserId(selfdwUserID)
        if(!user) return;//弃牌的人强退不会结束游戏 
        user.userNodeInsetChair.currentRoundNode.handCards.removeAllChildren()

        var cardSprs = []
        for(var i=0;i<cards.length;i++)
        {   
            var card = playNode._getCardWithSendAction(i, cards[i])
            card.showIdx = i
            cardSprs[i] = card
        }

        playNode.idxsGroupNode = cardFactory.getCardsGroupNode(cardSprs, playNode.handCardInterval, playNode.autoFill)
        user.userNodeInsetChair.currentRoundNode.handCards.addChild( playNode.idxsGroupNode ) 
        
        playNode.selectedCards = []

        gameStateMachine.machine.transition?gameStateMachine.machine.transition():''
    },
    _getCardWithSendAction:function(cardArrayIdx, cardIdx)
    {   
        var card = cardFactory.getOne(cardIdx, false, false)
        card.cardArrayIdx = cardArrayIdx
        var selectedCall = function(target)
        {   
            card.setPositionY(cardFactory.height*0.5 +15)
            playNode.onSelectCard(target)
        }

        var unSelectedCall = function(target)                                                               
        {
            card.setPositionY(cardFactory.height*0.5)
            playNode.onSelectCard(target)
        }

        var isEnableFun = function(isUnSelected)
        {
            return true 
        }
        cardFactory.initSelectedCall(card, selectedCall, unSelectedCall, isEnableFun)

        return card
    },
    //////handcards end/////

    ///gameend start////
    onleavecount:function()
    {
        playNode.hideCountNode(true)
        playNode.stopCountClock(true)
    },
    onenterfree:function()
    {
        playNode.resetSelectedCards()
        playNode.isUserAddScore = false
        playNode.isUserCount = false

        playNode.hideDrawCardNode()
        playNode.updateDiCard([100, 100, 100, 100, 100, 100])
    },
    leaveCountAction:function(callback, args)
    {
        var a = cc.sequence( 
            cc.callFunc(function()
            {
                playNode._showSprsOnGameEnd(args)
            }), 
            cc.delayTime(5), //看牌5秒
            cc.callFunc(function()
            {   
                callback?callback():''
                var continueCall = function()
                {
                    playNode._removeSprsOnGameEnd()
                    gameStateMachine.machine.transition?gameStateMachine.machine.transition():''
                }
                var exitCall = function()
                {
                    var lookon = getObjWithStructName('CMD_GR_UserLookon') 
                    lookon.wTableID = tableData.tableID
                    socket.sendMessage(MDM_GR_USER, SUB_GR_USER_LOOKON, lookon)
                }
                playNode.popGameEnd(args, continueCall, exitCall)  //一直不点 被踢出座位情况？  
            }))            

        playNode.node.runAction(a)
    },
    _showSprsOnGameEnd:function(args)
    {
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithChairId(i)
            if(!user) continue
            var chair = tableData.getChairWithServerChairId(i)
            if(playData.hasGetSendCardsWithdwUserID(user.dwUserID) && tableData.isInTable(user.cbUserStatus))
            {   
                //score
                var score = args.lGameScore[i]
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
                        var sp = score>0?'gameEndWin.png':'gameEndLose.png'
                        playNode.winOrLoseSpr.setSpriteFrame(sp) 
                        managerAudio.playEffect(score>0?'gameRes/sound/win.mp3':'gameRes/sound/lost.mp3')
                    }
                    user.userNodeInsetChair.currentRoundNode.handCards.removeAllChildren()
                }

                var cards = args.cbHandCardData.splice(0, args.cbCardCount[i] )
                if(cards.length>0)
                {
                    var user = tableData.getUserWithChairId(i)
                    playNode.refreshOutCards(user, cards)
                }
            }
        }
    },
    _removeSprsOnGameEnd:function()
    {
        playNode.winOrLoseSpr.setSpriteFrame('empty.png') 
        for(var chairId=0;chairId<GAME_PLAYER;chairId++)
        {   
            var user = tableData.getUserWithTableIdAndChairId(null, chairId)
            if(user)
                mainScene.clearCurrentRoundNode.call(user.userNodeInsetChair)
        }
    },
    popGameEnd:function(args, continueCall, exitCall)
    {
        var control = {}
        control.exitCall = function()
        {
            var UserStandUp = getObjWithStructName('CMD_GR_UserStandUp')
            UserStandUp.wTableID = tableData.getUserWithUserId(selfdwUserID).wTableID
            UserStandUp.wChairID = tableData.getUserWithUserId(selfdwUserID).wChairID || ''
            UserStandUp.cbForceLeave = true
            socket.sendMessage(MDM_GR_USER, SUB_GR_USER_STANDUP, UserStandUp) 

            goHref(appendRefreshtime(hallAddress))
        }

        control.continueCall = function()
        {
            continueCall()
            node.removeFromParent()
        }
        var node  = cc.BuilderReader.load(resp.gameEndPopCCB, control)

        control.resultTTF.setString( args.msg )
        
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var chairid = i
            control['escape'+i].setVisible(args.cbWinFlag[i] == 6)
            
            var score = args.lGameScore[chairid]
            control['name'+i].setString(args.szNickName[chairid])
            control['banker'+i].setVisible(args.wBankChairID == chairid)
            control['win'+i].setVisible(score>0)
            if(score>0)
            {
                control['scoreTTF'+i].setString('+' + score)
                control['scoreTTF'+i].color = cc.color(255, 0, 0)
              //  control['scoreTTF'+i].setFontFillColor( cc.color(255, 0, 0, 255) )
                control['frame'+i].setSpriteFrame('gend5.png')
            }
            else
            {
                control['scoreTTF'+i].setString(score==0?'-'+score:score)
                control['scoreTTF'+i].color = cc.color(0, 255, 0)
                //control['scoreTTF'+i].setFontFillColor( cc.color(0, 255, 0, 255) )
                control['frame'+i].setSpriteFrame('gend6.png')

            }


        }
        node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5) )
        mainScene.top.addChild(node) 
    },
    ///gameend end////

    ////ChooseType start/////
    popChooseTypeNode:function(paramsArray)
    {
        playNode.chooseTypeNode.setVisible(true)
        // playNode.topListener.setSwallowTouches(true)
        for(var i in paramsArray)
        {   
            (function(i)
            {
                var c = paramsArray[i].sureCall
                paramsArray[i].sureCall = function()
                {
                    c()
                    // playNode.topListener.setSwallowTouches(false)
                    playNode.hideChooseTypeNode()
                }
                playNode._addTypeItem(paramsArray[i]) 
            }(i))
        }
    },
    hideChooseTypeNode:function()
    {   
        playNode.chooseTypeNode.setVisible(false)
        if(playNode.typeListView)
        {
            playNode.typeListView.removeAllChildren()
            playNode.typeListView = null
        }
    },
    _addTypeItem:function(params) 
    {
        if(!playNode.typeListView )
        {
            playNode.typeListView = new ccui.ListView()
            var listView = playNode.typeListView
            listView.setDirection(ccui.ScrollView.DIR_VERTICAL)
            listView.setTouchEnabled(true)
            listView.setBounceEnabled(true)
            listView.setScrollBarEnabled(false)
            listView.setBackGroundImage(resp_p.empty)
            listView.setBackGroundImageScale9Enabled(true)

            listView.setContentSize(playNode.chooseTypeNode.getContentSize().width,playNode.chooseTypeNode.getContentSize().height-10)
            listView.x = 0
            listView.y = 0
            playNode.chooseTypeNode.addChild(listView)
        }

        var listView = playNode.typeListView

        listView.pushBackCustomItem(gameLogic.getChooseTypeItem(listView.width, params ) )
        listView.forceDoLayout()

        listView.setTouchEnabled(listView.getItem(0) && listView.getItem(0).getPositionY()+listView.getItem(0).getContentSize().height>listView.height)
    },
    ////ChooseType end/////
    minusHandCardsNum:function(user, outCardCount)
    {
        if(!user) return;//弃牌的人强退不会结束游戏 
        var handCardsNum = user.userNodeInsetChair.currentRoundNode.handCardsNum
        var originStr = handCardsNum.getString()
        showNum = parseInt(originStr) - outCardCount
        playNode.setHandCardsNum(user, showNum)
    },
    setHandCardsNum:function(user, showNum)
    {
        if(!user) return;//弃牌的人强退不会结束游戏 
        var handCardsNum = user.userNodeInsetChair.currentRoundNode.handCardsNum
        handCardsNum.setString(showNum)

        if(showNum<=3 && showNum!=0)
        {   
            handCardsNum.setVisible(true)
            var spr = actionFactory.getSprWithAnimate('warn_', false, 0.15)
            spr.setAnchorPoint(cc.p(0.5,0))
            var warnNode = user.userNodeInsetChair.currentRoundNode.warnNode
            warnNode.addChild(spr)
            managerAudio.playEffect('gameRes/sound/warm.mp3')
        }
        else
        {
            handCardsNum.setVisible(false)
            var warnNode = user.userNodeInsetChair.currentRoundNode.warnNode
            warnNode.removeAllChildren()
        }
    },
    refreshScoreTTF:function(scoreTTF)
    {
        playNode.scoreTTF.setString(scoreTTF)
    },
    refreshJiaopaiTTF:function(cbGameType)
    {   
        var t = [
            '无',
            '隔',
            'error',
            '反',
            '反反',
            '争上游',
        ]
        playNode.jiaopaiTTF.setString(t[cbGameType])
    },
    refreshOutCards:function(user, outCards)
    {
        cardFactory.refreshOutCards(user, outCards, user.dwUserID == selfdwUserID?20:10, user.dwUserID == selfdwUserID)
    },
    autoFill:function(isDownCard)
    {
        var subIdx54s = []
        for(var i in playNode.selectedCards)
            subIdx54s[i] = playNode.selectedCards[i].cardIdx

        var needSelectedIdxs = gameLogic.getNeedSelectedIdx54s_autoFill(isDownCard, playNode.tipsArray, subIdx54s, 
            [78, 79])

        for(var i in needSelectedIdxs)
        {   
            var idx = needSelectedIdxs[i]
            var tag = playNode.idxsGroupNode.cardIdx2Tag[idx]
            var card = playNode.idxsGroupNode.getChildByTag(tag)
            cardFactory.onTouchEnd.call(card)
        }
    },
    reset:function()
    {
        playNode.selectedCards = []
        playNode.isUserAddScore = false
        playNode.isUserCount = false
        playNode.tipsArray = []
        playNode.idxsGroupNode = null
    }
}



