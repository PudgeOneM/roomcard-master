
var addScoreTime = 20
var countTime = 20

var playNode = 
{   
    selectedCards:[],
    isUserAddScore:false,
    isUserCount:false,
    tipsArray:[],
    handCardInterval:0,
    cardsGroupNode:null,
    init:function()
    {   
        playNode._initCallBack()
        var node = managerRes.loadCCB(resp.playCCB, this)
        playNode.animationManager = node.animationManager
        playNode.node  = node
        playNode._bindListener()
        playNode._initDrawCardNode()

        var nodeSize = playNode.node.getContentSize()
        playNode.handCardInterval = Math.floor( (nodeSize.width - 150 )/19 )

        playNode.commonCount.setVisible(false)
        playNode.notCount.setVisible(false)
        playNode.addScoreNode.setVisible(false)

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "touchTableBottom",
            callback: function(event)
            {   
                playNode.resetSelectedCards()
            }
        })
        cc.eventManager.addListener(l, 1)

        playNode.uiOperate.y = 96
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
        var callCard = function(cbParam1)
        {
            var CallCard = getObjWithStructName('CMD_C_CallScore') 
            CallCard.cbCallScore = cbParam1
            socket.sendMessage(MDM_GF_GAME, SUB_C_CALL_SCORE, CallCard)
            playNode.isUserAddScore = true
            playNode.hideAddScoreNode()

        }
        playNode.addScoreCall1 = function(){ callCard(1) }
        playNode.addScoreCall2 = function(){ callCard(2) }
        playNode.addScoreCall3 = function(){ callCard(3) }
        playNode.addScoreCall4 = function(){ callCard(0) }
    },
    popAddScoreNode:function(isCan, cbCurrentScore) // 0 当前0分
    {
        if(!isCan) return;
        // playData.handCardIdxs = [2, 3,4,18, 19,20, ,31 , 32, 34, 35, 36, 36, 50, 51, 52, 78, 79]
        //解析王炸
        var parser = gameLogic.cardsParser[4][0];
        var hasWangzha = parser.getIdxsIfHas(playData.handCardIdxs, [])
        //解析四个2
        var parser1 = gameLogic.cardsParser[3][0];
        var hasZhadan2 = parser1.getIdxsIfHas(playData.handCardIdxs, [], gameLogic.num2Scores[2])
        //解析含有两个炸弹
        var num = 0;
        for (var j = 1; j <= 13; ++j) 
        {
            if (parser1.getIdxsIfHas(playData.handCardIdxs, [], gameLogic.num2Scores[j]))
                {
                    num++;
                }
        }
            console.log(33333333333333, hasWangzha, hasZhadan2, num);
            playNode.addScoreNode.setVisible(true)
            playNode.addScoreBtn1.setVisible(true)
            playNode.addScoreBtn2.setVisible(true)
            playNode.addScoreBtn3.setVisible(true)
            playNode.addScoreBtn4.setVisible(true)
            if (hasWangzha || hasZhadan2 || (num > 1))
            {
            playNode.addScoreNode.setVisible(true)
            playNode.addScoreBtn1.setVisible(false)
            playNode.addScoreBtn2.setVisible(false)
            playNode.addScoreBtn4.setVisible(false)
            } 
            else{
                   playNode.addScoreNode.setVisible(true) 
                   playNode.addScoreBtn1.setEnabled(cbCurrentScore<=0)
                   playNode.addScoreBtn2.setEnabled(cbCurrentScore<=1)
                   playNode.addScoreBtn3.setEnabled(cbCurrentScore<=2)
                }
 
    },
    hideAddScoreNode:function()
    {
        playNode.addScoreNode.setVisible(false)

        for(var i=1;i<4;i++)
        {
            cardFactory.reset.call(playNode['drawCardSpr'+i])
        }
    },
    showAddScoreFiredCircle:function(user, time)
    {
        time = typeof(time) == 'number'?time:addScoreTime
        chairFactory.showFiredCircle.call(user.userNodeInsetChair, time)
    },
    hideAddScoreFiredCircle:function(user)
    {
        if(user)
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
        for(var i=1;i<4;i++)
        {
            var card = cardFactory.getOne(null, true, true)
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
        for(var i=0;i<3;i++)
        {
            if(cbDiCardData[i])
            {
                playNode['drawCardSpr'+(i+1)].setSpriteFrame('card_'+cbDiCardData[i]+'.png') 
            }
            else
                break          
        }
    },
    showDrawCardNode:function()
    {
        playNode.drawCardNode.setVisible(true)
    },
    hideDrawCardNode:function()
    {
        playNode.drawCardNode.setVisible(false)
    },
    callCard:function(turnChairID, cbParam1)
    {
        var user = tableData.getUserWithChairId(turnChairID)
        var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
        tipsSpr.setSpriteFrame('callSpr_'+cbParam1+'.png') 

        if(cbParam1!=255)
            playNode.refreshScoreTTF(cbParam1)

        cbParam1 = cbParam1==255?0:cbParam1
        playNode.playGenderEffect('jiaofen'+cbParam1, user.cbGender)
    },
    clearCallCard:function(turnChairID)
    {
        var user = tableData.getUserWithChairId(turnChairID)
        var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
        tipsSpr.setSpriteFrame('empty.png') 
    },
    callExit:function(wTurnChairID, cbParam1)
    {
        if(wTurnChairID == INVALID_WORD) return 

        var self = tableData.getUserWithUserId(selfdwUserID)
        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, wTurnChairID)
        var isSelf = wTurnChairID == self.wChairID

        playNode.hideAddScoreFiredCircle(user)
        playNode.hideAddScoreNode()
        playNode.stopAddScoreClock(isSelf)

        if(typeof(cbParam1)!='undefined')
            playNode.callCard(wTurnChairID, cbParam1)
    },
    callEnter:function(wCurrentUser, cbCurrentScore, time)
    {   
        if(wCurrentUser == INVALID_WORD) return 

        var self = tableData.getUserWithUserId(selfdwUserID)
        var isSelf = wCurrentUser == self.wChairID
        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, wCurrentUser)
        playNode.showAddScoreFiredCircle(user, time)
        playNode.startAddScoreClock(isSelf, time)

        // if(typeof(cbTurnType)!='undefined')
            playNode.popAddScoreNode(isSelf, cbCurrentScore)

    },
    ////////////AddScore end///////////

    ////////////count start///////////
    _outCardForCountCall1:function(cardsType)
    {
        var isAllowOut = false
        if(cardsType)
        {
            if(!playData.lastOutCardType.idxs)
                isAllowOut = cardsType.typeLevel > 1 || (cardsType.typeLevel==1&&cardsType.idxs.length==playData.handCardIdxs.length)
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
            CMD_C_OutCard[1][2] = c.length
            var OutCard = getObjWithStructName('CMD_C_OutCard')
            OutCard.cbCardCount = c.length
            OutCard.cbCardData = c
            socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
            CMD_C_OutCard[1][2] = MAX_COUNT

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
            var cardsTypeArrray = gameLogic.getCardsTypesWithIdx54s( cardLogic.sortWithNum(cards), []) 

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
        if(!isCan) return;
        if(!playData.lastOutCardType.idxs)
        {
            // playNode.tipsArray = gameLogic.getTipsArray({typeIdx:0, typeLevel:0, typeScores:0, typeKind:0}, clone(playData.handCardIdxs), [])
            // playNode.countButton2.currentTipsIdx = 0
            playNode.tipsArray = gameLogic.getTipsArrayForFirstOut( playData.handCardIdxs )
            playNode.countButton2.currentTipsIdx = 0
        }
        else
        {
            var cardsType = playData.lastOutCardType
            playNode.tipsArray = gameLogic.getTipsArray(cardsType, cardLogic.sortWithNum(clone(playData.handCardIdxs)), [])
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
        chairFactory.showFiredCircle.call(user.userNodeInsetChair, time)
    },
    hideCountFiredCircle:function(user)
    {
        if(user)
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
    outCard:function(chairID, cardType, isFirstOut)
    {
        var user = tableData.getUserWithChairId(chairID)
        playNode.refreshOutCards(user, cardType.idxs)

        var handCardsNum = user.userNodeInsetChair.currentRoundNode.handCardsNum
        if(handCardsNum.getString() != cardType.idxs.length)
            playNode.playCardTypeEffect(cardType, isFirstOut, user.cbGender)
     
        managerAudio.playEffect('gameRes/sound/outcard.mp3')
    },
    passCard:function(chairID)
    {
        var user = tableData.getUserWithChairId(chairID)
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

        playNode.playGenderEffect('buyao' + (Math.ceil(Math.random()*10))%3, user.cbGender)
    },
    clearOutCards:function(chairID)
    {
        var user = tableData.getUserWithChairId(chairID)
        var outCardsNode = user.userNodeInsetChair.currentRoundNode.outCards
        outCardsNode.removeAllChildren()   
    },
    showSingleWinPosition:function(chairID, cbSingleWinPosition)
    {
        var user = tableData.getUserWithChairId(chairID)
        var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
        console.log(3333,'singleWinPosition_'+cbSingleWinPosition+'.png')
        tipsSpr.setSpriteFrame('singleWinPosition_'+cbSingleWinPosition+'.png') 
    },
    getCardsPosArray:function(cardSize, cardsLen, maxLenOneRow) 
    {
        var spaceX = cardSize.width/3
        var spaceY= cardSize.height/2
        var cardsPos = []
        for(var i=0;i<cardsLen;i++)
        {   
            var pos = []
            pos[0] = i%maxLenOneRow*spaceX
            pos[1] = -spaceY * Math.floor(i/maxLenOneRow)
            cardsPos[cardsPos.length] = pos
        }

        return cardsPos
    },
    outCardExit:function(wOutCardUser, isPass, isFirstOut)
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

        playNode.outCard(wOutCardUser, playData.lastOutCardType, isFirstOut)                        
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
        
        playNode.minusHandCardsNum(userOut, playData.lastOutCardType.idxs.length)
    },
    outCardEnter:function(wCurrentUser, time, isContinuousOut)
    {
        if(wCurrentUser == INVALID_WORD) return 
            
        var self = tableData.getUserWithUserId(selfdwUserID)
        if(!isContinuousOut)
            playNode.clearOutCards(wCurrentUser)

        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, wCurrentUser)
        playNode.showCountFiredCircle(user, time)
        var iscan = self.wChairID == wCurrentUser
        if(iscan)
            playNode.clearOutCards(wCurrentUser)
        playNode.popCountNode(iscan)
        playNode.startCountClock(iscan, time)
    },
    ////////////count end///////////

    //////handcards start/////
    clearHandCards:function()
    {
        var user = tableData.getUserWithUserId(selfdwUserID)
        user.userNodeInsetChair.currentRoundNode.handCards.removeAllChildren()
    },
    sendCardsAction:function(handCardIdxs, callback, transition)
    {
        playNode._sendCardsAction(handCardIdxs, callback, transition) 
    },
    _sendCardsAction:function(handCardIdxs, callback, transition)
    {   
        var cards = handCardIdxs
        gameLogic.sortIdxsWithScore(cards, []) 
        var user = tableData.getUserWithUserId(selfdwUserID)
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
                // playData.playStateMachine.transition()
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
        
        var hasZha
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var chairid = i
            if(typeof(args.cbWinFlag[i])!='undefined')
            {
                control['winflag'+i].setVisible(true)
                control['winflag'+i].setSpriteFrame('winFlag_' + args.cbWinFlag[i] + '.png') 
            }
            else
                control['winflag'+i].setVisible(false)
            
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
    ////ChooseType end/////
    minusHandCardsNum:function(user, outCardCount)
    {
        var handCardsNum = user.userNodeInsetChair.currentRoundNode.handCardsNum
        var originStr = handCardsNum.getString()
        showNum = parseInt(originStr) - outCardCount
        playNode.setHandCardsNum(user, showNum)
    },
    //剩余牌的数目
    setHandCardsNum:function(user, showNum)
    {
        if(showNum==1)
            playNode.playGenderEffect('baodan1', user.cbGender)
        else if(showNum==2)
            playNode.playGenderEffect('baodan2', user.cbGender)
        else if(showNum==3)
            managerAudio.playEffect('gameRes/sound/warm.mp3')

        if(user.dwUserID == selfdwUserID)
            return;

        var handCardsNum = user.userNodeInsetChair.currentRoundNode.handCardsNum
        handCardsNum.setString(showNum)

        if(showNum==0)
        {
            // handCardsNum.setVisible(false)
            // var warnNode = user.userNodeInsetChair.currentRoundNode.warnNode
            // warnNode.removeAllChildren()
        }
        else if(showNum<=2)
        {
            handCardsNum.setVisible(true)
            var spr = actionFactory.getSprWithAnimate('warn_', false, 0.15)
            spr.setAnchorPoint(cc.p(0.5,0))
            var warnNode = user.userNodeInsetChair.currentRoundNode.warnNode
            warnNode.removeAllChildren()
            warnNode.addChild(spr)
        }
        else if(showNum<=17)
            handCardsNum.setVisible(false)


    },
    refreshScoreTTF:function(scoreTTF)
    {
        playNode.scoreTTF.setString(scoreTTF)
    },
    refreshJiaopaiTTF:function(str)
    {   
        playNode.jiaopaiTTF.setString(str)
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
            [])

        for(var i in needSelectedIdxs)
        {   
            var idx = needSelectedIdxs[i]
            var tag = playNode.idxsGroupNode.cardIdx2Tag[idx]
            var card = playNode.idxsGroupNode.getChildByTag(tag)
            cardFactory.onTouchEnd.call(card)
        }
    },
    playCardTypeEffect:function(cardsType, isFirstOut, isMan)
    {
        var name
        if(cardsType.id == 101)
            name = cardsType.idxs.length==6?'sidaier0':'sidaier1'
        else
            name = gameLogic.getSoundName(cardsType, true)

        if(name=='feiji')
            managerAudio.playEffect('gameRes/sound/feijiEffect.mp3')
        else if(name=='wangzha')
            managerAudio.playEffect('gameRes/sound/wangzhaEffect.mp3')
        else if(name=='dani')
            name = name+(Math.ceil(Math.random()*10))%3         
        
        playNode.playGenderEffect(name, isMan)
    },
    playGenderEffect:function(name, isMan)
    {
        var resPrefix = 'gameRes/sound/' + (isOpenPTH?'pth':'fy')
        
        if(isMan)
            managerAudio.playEffect(resPrefix + '/man/' + name + '.mp3')
        else
            managerAudio.playEffect(resPrefix + '/woman/' + name + '.mp3') 
    },
    reset:function()
    {
        playNode.selectedCards = []
        playNode.isUserAddScore = false
        playNode.isUserCount = false
        playNode.tipsArray = []
        playNode.cardsGroupNode = null
    },

}



