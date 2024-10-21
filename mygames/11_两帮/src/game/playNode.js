
var countTime = 20

var playNode = 
{   
    selectedCards:[],
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
        playNode.handCardInterval = Math.floor( (nodeSize.width - cardFactory.width - 10 )/26 )

        playNode.commonCount.setVisible(false)
        playNode.notCount.setVisible(false)

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "touchTableBottom",
            callback: function(event)
            {   
                playNode.resetSelectedCards()
            }
        })
        cc.eventManager.addListener(l, 1)
    
        // playNode.uiOperate.y = 96
    },
    ////////////////draw
    _initDrawCardNode:function() 
    {
        for(var i=1;i<7;i++)
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
    showDrawCardNode:function()
    {
        playNode.drawCardNode.setVisible(true)
    },
    hideDrawCardNode:function()
    {
        playNode.drawCardNode.setVisible(false)
    },

    /////
    _initCallBack:function()
    {   
        playNode._initCountCall()
    },
    _bindListener:function()
    {
    },
    ////////////count start///////////
    _outCardForCountCall1:function(cardsType)
    {
        var isAllowOut = false


        if(cardsType)
        {
            if(!playData.lastOutCardType.idxs)
                isAllowOut = cardsType.typeLevel > 0
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

            CMD_C_OutCard[2][2] = c.length
            var OutCard = getObjWithStructName('CMD_C_OutCard')
            OutCard.cbCardCount = c.length
            var t = gameLogic.getDataAndChangeDataWithIdxs(c)
            OutCard.cbCardData = t[0]
            OutCard.cbChangeCard = t[1]
            socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
            CMD_C_OutCard[2][2] = MAX_COUNT

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


            // cards = cardLogic.getReverseArray( cardLogic.sortWithNum(cards) ) 
            // var OutCard = getObjWithStructName('CMD_C_OutCard')
            // OutCard.cbCardCount = cards.length
            // OutCard.cbCardData = cards
            // socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
            // return;

            /////
            var self = tableData.getUserWithUserId(selfdwUserID)

            var cardsTypeArrray = gameLogic.getCardsTypesWithIdx54s( cardLogic.sortWithNum(cards), [78, 79]) 

            if(cardsTypeArrray.length>1)
            {
                var paramsArray = []

                for(var i in cardsTypeArrray)
                {   
                    var cardsType = cardsTypeArrray[i]
                    var p = {}
                    p.idxs = cardsType.idxs
                    p.sureCall = function()
                    {
                        playNode._outCardForCountCall1(cardsType)
                    }
                    
                    paramsArray[paramsArray.length] = p
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
            for(var i=0;i<idxs.length;i++)
            {
                if(idxs[i]>=80)
                    idxs[i] = cardLogic.getIdx54OfLaiziWithColorAndIdx_laizi(idxs[i], 0) 
            }

            playNode.selectCards(idxs)

            playNode.countButton2.currentTipsIdx = (playNode.countButton2.currentTipsIdx + 1)%playNode.tipsArray.length
        }

    },
    selectCards:function(idx54s)
    {
        var sortWithScoreIdx54s =gameLogic.sortIdxsWithScore(idx54s, [78, 79])
        var tags = playNode.idxsGroupNode.getTagsWithIdx54s(sortWithScoreIdx54s)

        for(var i=0;i<tags.length;i++)
        {
            var tag = tags[i]
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
        var isFirstOut = !playData.lastOutCardType.idxs

        if(isFirstOut)
        {
            playNode.tipsArray = gameLogic.getTipsArrayForFirstOut( playData.handCardIdxs )
        }
        else
        {
            var cardsType = playData.lastOutCardType
            playNode.tipsArray = gameLogic.getTipsArray(cardsType, cardLogic.sortWithNum(clone(playData.handCardIdxs)), [78, 79])
        }

        playNode.countButton2.currentTipsIdx = 0  


        //不需要不出按钮了 有要不起按钮
        var isAllowPass = playData.lastOutCardType.idxs //&& playNode.tipsArray.length==0  //playData.lastOutCardUser != null && playData.lastOutCardUser!=tableData.getUserWithUserId(selfdwUserID).wChairID
        playNode.countButton3.setEnabled( isAllowPass )

        var isPopCount = !isAllowPass || playNode.tipsArray.length != 0
        playNode.commonCount.setVisible(isPopCount)
        playNode.notCount.setVisible(!isPopCount)

        playNode.countButton1.setEnabled(playNode.selectedCards.length!=0)
        playNode.countButton2.setEnabled(playNode.tipsArray.length>0)

        // if(playNode.notCount.isVisible())
        //     playNode.countCall3()


        // if( playNode.tipsArray.length == 1 && playNode.tipsArray[0].length == playData.handCardIdxs.length )
        // {
        //     playNode.countCall2()
        //     playNode.countCall1()
        // }

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
    // outCard:function(chairID, outCards)
    // {
    //     var user = tableData.getUserWithChairId(chairID)
    //     playNode.refreshOutCards(user, outCards)
    //     managerAudio.playEffect('gameRes/sound/outcard.mp3')
    // },
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
        // if(user.dwUserID != selfdwUserID)
        // {
            var chair = tableData.getChairWithServerChairId(user.wChairID)
            x = chairFactory.isRight(chair.node)?1:0
        //}
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
    showChunIcon:function(chairID)
    {
        var user = tableData.getUserWithChairId(chairID)
        var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
        tipsSpr.setSpriteFrame('chunIcon.png') 
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
        else
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
        tableNode.turnScoreTTF.setString('')
        playNode.resetSelectedCards()
        playNode.isUserCount = false

        playNode.hideDrawCardNode()
    },
    leaveCountAction:function(callback, args)
    {
        var a = cc.sequence( 
            cc.callFunc(function()
            {              
                playNode._showSprsOnGameEnd(args)
            }), 
            cc.delayTime(2), //看牌5秒
            cc.callFunc(function()
            {   
                // callback?callback():''
                //playData.playStateMachine.transition()
                var continueCall = function()
                {
                    playNode._removeSprsOnGameEnd()
                    // gameStateMachine.machine.transition?gameStateMachine.machine.transition():''
                }
                var exitCall = function()
                {
                    var lookon = getObjWithStructName('CMD_GR_UserLookon') 
                    lookon.wTableID = tableData.tableID
                    socket.sendMessage(MDM_GR_USER, SUB_GR_USER_LOOKON, lookon)
                }
                playNode.popGameEnd(args, continueCall, exitCall)  //一直不点 被踢出座位情况？  
            }),  
            cc.delayTime(3), 
            cc.callFunc(function()
            {   
                callback?callback():''

                var isLastWinner = false
                for(var i in playData.dwLastWinner)
                {   
                    isLastWinner =  playData.dwLastWinner[i] == selfdwUserID
                    if(isLastWinner)
                        break
                }
                if(isLastWinner)
                {
                    var lookon = getObjWithStructName('CMD_GR_UserLookon') 
                    lookon.wTableID = tableData.tableID
                    socket.sendMessage(MDM_GR_USER, SUB_GR_USER_LOOKON, lookon) 
                }
                gameStateMachine.machine.transition?gameStateMachine.machine.transition():''
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

                var cards = args.cbCardData[i].splice(0, args.cbCardCount[i] )
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

            var str = args.PlayerScore[i]==-1?'(两帮)':('(' + args.PlayerScore[i] + '分)')
            control['pScoreTTF'+i].setString(str)
            control['pScoreTTF'+i].x = control['scoreTTF'+i].width
        }

        node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5) )
        mainScene.top.addChild(node) 
    },
    ///gameend end////
    minusHandCardsNum:function(user, outCardCount)
    {
        var handCardsNum = user.userNodeInsetChair.currentRoundNode.handCardsNum
        var originStr = handCardsNum.getString()
        showNum = parseInt(originStr) - outCardCount
        playNode.setHandCardsNum(user, showNum)
    },
    setHandCardsNum:function(user, showNum)
    {

        // if(showNum==1)
        //     playNode.playGenderEffect('baodan1', user.cbGender)
        // else if(showNum==2)
        //     playNode.playGenderEffect('baodan2', user.cbGender)
        // else if(showNum==3)
        //     managerAudio.playEffect('gameRes/sound/warm.mp3')

        if(user.dwUserID == selfdwUserID)
            return;

        var handCardsNum = user.userNodeInsetChair.currentRoundNode.handCardsNum
        handCardsNum.setString(showNum)

        if(showNum==0)
        {
            handCardsNum.setVisible(false)
            var warnNode = user.userNodeInsetChair.currentRoundNode.warnNode
            warnNode.removeAllChildren()
        }
        else if(showNum<=8)
        {
            handCardsNum.setVisible(true)
            managerAudio.playEffect('gameRes/sound/warm.mp3')
            var spr = actionFactory.getSprWithAnimate('warn_', false, 0.15)
            spr.setAnchorPoint(cc.p(0.5,0))
            var warnNode = user.userNodeInsetChair.currentRoundNode.warnNode
            warnNode.removeAllChildren()
            warnNode.addChild(spr)
        }
        else
            handCardsNum.setVisible(false)
        // else if(showNum<=8)
        //     handCardsNum.setVisible(true)
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
        cardFactory.refreshOutCards(user, outCards, user.dwUserID == selfdwUserID?30:15)
    },
    autoFill:function(isDownCard)
    {
        var subIdx54s = []
        for(var i in playNode.selectedCards)
            subIdx54s[i] = playNode.selectedCards[i].cardIdx

        var needSelectedIdx54s = gameLogic.getNeedSelectedIdx54s_autoFill(isDownCard, playNode.tipsArray, subIdx54s, 
            [78, 79])
        playNode.selectCards(needSelectedIdx54s)
    },
    reset:function()
    {
        playNode.selectedCards = []
        playNode.isUserCount = false
        playNode.tipsArray = []
        playNode.idxsGroupNode = null
    },
    playCardTypeEffect:function(cardsType, isFirstOut, isMan)
    {
        var name = gameLogic.getSoundName(cardsType, true)
        if(name=='feiji')
            managerAudio.playEffect('gameRes/sound/feijiEffect.mp3')
        else if(name=='wangzha')
            managerAudio.playEffect('gameRes/sound/wangzhaEffect.mp3')

        name = ( name=='dani'?name+(Math.ceil(Math.random()*10))%3:name ) + '.mp3'            
        if(isMan)
            managerAudio.playEffect('gameRes/sound/man/' + name)
        else
            managerAudio.playEffect('gameRes/sound/woman/' + name)
    },
    playGenderEffect:function(name, isMan)
    {
        if(isMan)
            managerAudio.playEffect('gameRes/sound/man/' + name + '.mp3')
        else
            managerAudio.playEffect('gameRes/sound/woman/' + name + '.mp3') 
    },
    refreshPlayerScore:function(scoreArray)
    {
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var score = scoreArray[i]
            if(score)
            {
                var user = tableData.getUserWithChairId(i)
                var scoreTTF = user.userNodeInsetChair.currentRoundNode.scoreTTF
                scoreTTF.setString(score + '分')
            }
        }
    },
    refreshWinOrder:function(wWinOrder)
    {
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var chairid = wWinOrder[i]
            if(chairid == INVALID_WORD)
                break
            var user = tableData.getUserWithChairId(chairid)
            if(!user) return;
            var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
            tipsSpr.setSpriteFrame('rankSpr'+i+'.png')  
        }
    }

}
