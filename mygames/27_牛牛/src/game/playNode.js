
var unOperateCountMax = 10
var addScoreTime = 15
var countTime = 15
var playNode = 
{   
    selectCardsRecord:[],
    cardSprs:[],
    unOperateCount:0,
    isUserAddScore:false,
    isUserCount:false,
    standOnGameEnd:false,
    init:function()
    {   
        playNode._initCallBack()
        var node  = managerRes.loadCCB(resp.playCCB, this)
        playNode.animationManager = node.animationManager
        playNode.node  = node
        playNode._bindListener()
        var nodeSize = playNode.node.getContentSize()

        playNode.commonCount.setVisible(false)
        playNode.specialCount.setVisible(false)
        playNode.countButton1.isNiu = false
        playNode.addScoreNode.setVisible(false)

        playNode.totalScoreNode = new cc.Node()
        playNode.totalScoreNode.setPosition( cc.p(nodeSize.width * 0.5, nodeSize.height * 0.7) )
        tableNode.uiBg.addChild(playNode.totalScoreNode) 

        playNode.totalScoreBg = new cc.Scale9Sprite('s_sp9_04.png')
        playNode.totalScoreNode.addChild(playNode.totalScoreBg)

        playNode.totalScoreChips = new cc.Sprite('#chip_total.png')
        playNode.totalScoreChips.setAnchorPoint(cc.p(0, 0))
        playNode.totalScoreNode.addChild(playNode.totalScoreChips)

        playNode.totalScoreLabel = new cc.LabelTTF('', "Helvetica", 24)
        playNode.totalScoreLabel.setAnchorPoint(cc.p(1, 0.5))
        playNode.totalScoreLabel.setFontFillColor(cc.color(255, 199, 6, 255) )
        playNode.totalScoreNode.addChild(playNode.totalScoreLabel)

        playNode.totalScoreNode.setVisible(false)
    },
    _initCallBack:function()
    {   
        playNode._initCountCall()
    },
    _bindListener:function()
    {
        playNode._initAddScoreListener()
    },
    ////////////AddScore start///////////
    _initAddScoreListener:function()
    {
        var addScoreListener =  cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if(!playNode.addScoreNode.isVisible() )
                    return false

                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    target.setSpriteFrame('button8_2.png') 
                    return true
                }
                return false
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget()
                target.setSpriteFrame('button8_1.png') 
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    playNode.userAddScore( target.score )
                    playNode.unOperateCount = 0
                }
            },
        })

        for(var i=1;i<5;i++)
        {
            cc.eventManager.addListener( addScoreListener.clone(), playNode['addScore' + i + 'Spr'] )
        }

        playNode.progressBarNode.setVisible(false)
        var score = 0
        var addScoreFreeListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if(!playNode.addScoreNode.isVisible())
                    return false

                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    playNode.progressBarNode.setVisible(true)
                    score = 0
                    return true
                }
                return false
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget()
                var delta = touch.getDelta()

                var posY = playNode.barNode.getPositionY() + delta.y
                posY = posY<0?0:posY
                var maxY = playNode.progressBarNode.getContentSize().height - playNode.barNode.getContentSize().height
                posY = posY>maxY?maxY:posY

                score = Math.ceil(posY/maxY * playData.lTurnMaxScore)

                playNode.barNode.setPositionY(posY)
                playNode.barLabel.setString(score)
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget()
                playNode.progressBarNode.setVisible(false)
                playNode.barNode.setPositionY(0)
                playNode.barLabel.setString(0)
                if(score>0)
                {
                    playNode.userAddScore(score)
                    playNode.unOperateCount = 0
                }
            }
        })

        cc.eventManager.addListener( addScoreFreeListener, playNode.addScoreFreeSpr )
    },
    userAddScore:function(score)
    {
        if(score != null)
        {   
            var AddScore = getObjWithStructName('CMD_C_AddScore') 
            AddScore.lScore = score
            socket.sendMessage(MDM_GF_GAME, SUB_C_ADD_SCORE, AddScore)

            playNode.isUserAddScore = true
            playNode.hideAddScoreNode()
        }
    },
    popAddScoreNode:function(isCan, turnMaxScore)
    {
        if( isCan )
        {   
            playNode.addScoreNode.setVisible(true)
            for(var i=1;i<5;i++)
            {
                var score = Math.ceil(turnMaxScore / 5 * i) 
                playNode['addScore' + i + 'Spr'].score = score
                playNode['addScore' + i + 'Label'].setString(score)
            }
        }   
    },
    hideAddScoreNode:function()
    {
        playNode.addScoreNode.setVisible(false)
    },
    startAddScoreClock:function(isCan, time)
    {   
        time = typeof(time) == 'number'?time:addScoreTime
        if(isCan)
        {
            var c = clock.getOneClock(time, 
            function()
            {
                playNode.hideAddScoreNode()
                if(!playNode.isUserAddScore)
                {
                    playNode.unOperateCount = playNode.unOperateCount + 1
                    if(playNode.unOperateCount >=unOperateCountMax)
                    {
                        socket.closeWithPop(Word_0.w_015, 1, 2)
                    }
                }
            },
            function()
            {
                if(parseInt( c.clockLabel.getString() ) <= 3 && !playNode.isUserAddScore)
                    managerAudio.playEffect('gameRes/sound/tick.mp3')
            })  
        }
        else
        {   
            var c = clock.getOneClock(time)
        }

        playNode.clockNode.addChild(c.clockNode)
    },
    stopAddScoreClock:function()
    {
        playNode.clockNode.removeAllChildren()
    },
    showAddScoreFiredCircle:function(cUsers, bankerUserChairID, time)
    {
        time = typeof(time) == 'number'?time:addScoreTime
        for(var i in cUsers)
        {   
            var user = cUsers[i]
            if(user.dwUserID == selfdwUserID || user.wChairID == bankerUserChairID) continue
            chairFactory.showFiredCircle.call(user.userNodeInsetChair, time)
        }
    },
    hideAddScoreFiredCircle:function(cUsers, bankerUserChairID)
    {
        for(var i in cUsers)
        {   
            var user = cUsers[i]
            if(user.dwUserID == selfdwUserID || user.wChairID == bankerUserChairID) continue
            chairFactory.hideFiredCircle.call(user.userNodeInsetChair)
        }
    },    
    onAddScoreMsg:function(addScoreUserChairID, addScoreUserUserNodeInsetChair, totalScoreNew, addScoreCount)
    {
        var coin = new cc.Sprite('#coin.png')
        tableNode.uiTop.addChild(coin)
        var chair = tableData.getChairWithServerChairId(addScoreUserChairID)
        coin.setPosition( cc.p( chair.node.getPositionX(), chair.node.getPositionY() ) )

        var a1 = cc.sequence(
            cc.moveTo(0.3, cc.p( tableNode.uiTop.getContentSize().width*0.5, tableNode.uiTop.getContentSize().height*0.5 ) ),
            cc.callFunc(
                function()
                {
                    coin.removeFromParent()
                })
            )
        coin.runAction(a1)
        managerAudio.playEffect('gameRes/sound/addscore.mp3')


        chairFactory.hideFiredCircle.call(addScoreUserUserNodeInsetChair)
        playNode.refreshChipNode.call(addScoreUserUserNodeInsetChair,addScoreCount)
        playNode.fixTotalScoreNode(totalScoreNew)  

        var self = tableData.getUserWithUserId(selfdwUserID)
        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, addScoreUserChairID)
        var chair = tableData.getChairWithServerChairId(user.wChairID)       
        chair.userNode.userScore.setString(user.lScoreInGame-addScoreCount)
    },

    //////////sendcardsAction start////////
    sendCardsAction:function(cSendCards, callback)
    {
        playNode._sendCardsAction(cSendCards, callback) 
    },
    _sendCardsAction:function(cSendCards, callback)
    {   
        if(!cSendCards.cards)
            return;

        //////////sendActions
        var sendActions = []
        var self = tableData.getUserWithUserId(selfdwUserID)
        var playingUserNum = 0
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if(cSendCards.cards[i][0] != 0)
                playingUserNum = playingUserNum + 1
        }
        var userIdx = 0
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if( cSendCards.cards[i][0] == 0) continue
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
            playNode.cardSprs[i] = [] 

            userIdx = userIdx + 1  

            var isSelf = self.wChairID == i

            for(var j=0;j<MAX_COUNT;j++)
            {   
                var c = playNode._getCardWithSendAction(i, j, cSendCards.cards[i][j], cSendCards.cbCardType[i])
                var card = c[0]
                var sendAction = c[1]
                playNode.cardSprs[i][j] = card

                var tag = playingUserNum * j + userIdx  //第几个发出的牌
                var pos = user.userNodeInsetChair.currentRoundNode.cards.convertToNodeSpace( cc.p(mainScene.uiTable.width * 0.5, mainScene.uiTable.height * 0.5) )
                card.setPosition(pos)
                user.userNodeInsetChair.currentRoundNode.cards.addChild( card, tag, tag ) 

                if(isSelf)
                {
                    var a = cc.targetedAction( card, cc.sequence(
                    cc.delayTime(0.3 + 0.05 * tag), 
                    cc.callFunc(function()
                    {   
                        managerAudio.playEffect('gameRes/sound/sendCard.mp3')
                    }),
                    sendAction) ) 
                }
                else
                {
                    var a = cc.targetedAction( card, cc.sequence(
                    cc.delayTime(0.3 + 0.05 * tag), 
                    sendAction) ) 
                }

                sendActions[sendActions.length] = a  
            }
        }

        var a1 = cc.spawn(sendActions)

        var a2 = cc.sequence(a1,cc.callFunc(function()
            {
                callback?callback():''
                playData.playStateMachine.transition()

            }))
        playNode.node.runAction(a2)
    },
    _getCardWithSendAction:function(chairId, cardArrayIdx, cardIdx, cardType, afterMoveAction)
    {   
        var isSelfCard = chairId == tableData.getUserWithUserId(selfdwUserID).wChairID
        var card = cardFactory.getOne(cardIdx, true, isSelfCard)
        card.cardArrayIdx = cardArrayIdx
        card.setScale(0.28)
        if(isSelfCard)
        {   
            var endPos = cc.p(cardArrayIdx*80 - 160, 0)
            var endScale = 0.56
            var endCardIdx = cardIdx
            var old = afterMoveAction || cc.callFunc(function(){})
            afterMoveAction = cc.sequence(
                cc.callFunc(
                function()
                {
                        if( cardType <= 10)
                        {   
                            var selectedCall = function()
                            {   
                                card.setPositionY(10)
                                playNode.selectCard(true, cardIdx)
                            }

                            var unSelectedCall = function()                                                               
                            {
                                card.setPositionY(0)
                                playNode.selectCard(false, cardIdx)
                            }

                            var isEnableFun = function(isselected)
                            {
                                if(!isselected)
                                    return playNode.selectCardsRecord.length!=3 && playNode.commonCount.isVisible()

                                return playNode.commonCount.isVisible()
                            }

                            cardFactory.bindListener(card, selectedCall, unSelectedCall, isEnableFun)

                        }
                }),
                old)
        }
        else
        {   
            var endScale = 0.28
            var endPos = cc.p( (cardArrayIdx-2)*card.getContentSize().width * 0.28 * 0.5, 0 ) 
        }
        var sendAction = cardFactory.getSendAction(card, endPos, endScale, endCardIdx, afterMoveAction)
        
        return [card, sendAction]
    },
    //////////sendcardsAction end////////

    ////////////AddScore end///////////

    ////////////count start///////////
    _initCountCall:function()
    {
        playNode.countCall1 = function()
        {   
            if(playNode.countButton1.isNiu)
            {
                playNode.userCount(true)
                playNode.unOperateCount = 0 
            }
            else
            {
                showTips({str:'选择的扑克牌不构成牌型'}) 
            }
        }

        playNode.countCall2 = function()
        {   
            playNode.userCount(false)
            playNode.unOperateCount = 0
        }

        playNode.countCall3 = function()
        {   
            playNode.userCount(true)
            playNode.unOperateCount = 0
        } 
    },
    userCount:function(hasNiu)
    {
        var OxCard = getObjWithStructName('CMD_C_OxCard')
        OxCard.bOX = hasNiu
        socket.sendMessage(MDM_GF_GAME, SUB_C_OPEN_CARD, OxCard) 
        
        playNode.hideCountNode()
        playNode.isUserCount = true

        var cards = playNode.cardSprs[tableData.getUserWithUserId(selfdwUserID).wChairID]
        // if(typeof( cards[0].originPosY ) != 'undefined')
        // {
            for( var i in cards )
            {   
                cards[i].setPositionY(0)
            }
        // }
    },
    selectCard:function(isSelect, cardIdx)
    {
        if(isSelect)
        {
            playNode.selectCardsRecord[playNode.selectCardsRecord.length] = cardIdx
        }
        else
        {
            for(var i=playNode.selectCardsRecord.length-1;i>=0;i--)
            {
                if(playNode.selectCardsRecord[i] == cardIdx)
                {
                    playNode.selectCardsRecord.splice(i,1)
                    break
                }
            }
        }

        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        var selfCards = playData.sendCards.cards[selfChairId]
        playNode.refreshCountNode(playNode.selectCardsRecord, selfCards)
    },
    refreshCountNode:function(selectCards, totalCards)
    {   
        function cardIdx2Num(cardIdx)
        {
            var num = cardFactory.getNumAndColorByCardIdx(cardIdx)[0]
            return num>10?10:num
        }

        if(selectCards.length==3)
        {   
            var n = cardIdx2Num(selectCards[0]) + cardIdx2Num(selectCards[1]) + cardIdx2Num(selectCards[2])
            playNode.countButton1.isNiu = (n%10 == 0)
        }
        else if(selectCards.length==2)
        {
            var n = 0
            for(var i=0;i<MAX_COUNT;i++)
            {
                var num = cardIdx2Num(totalCards[i])
                n = n + num
            }
            n = n - cardIdx2Num(selectCards[0]) - cardIdx2Num(selectCards[1])
            playNode.countButton1.isNiu = (n%10 == 0)
        }
        else
        {
            playNode.countButton1.isNiu = false
        }
    },
    popCountNode:function(isCan, cardType)
    {
        if(!isCan)  return;

        if( cardType > 10)
        {   
            playNode.specialCount.setVisible(true)
            var effect = actionFactory.getSprWithAnimate('playEffect1_', false, 0.2)
            playNode.specialCount.addChild(effect, 0, 10001)

            playNode.specialCountBtn.getBackgroundSpriteForState(cc.CONTROL_STATE_NORMAL).setSpriteFrame(cc.spriteFrameCache.getSpriteFrame('btnBull' + cardType + '_1.png') )
            playNode.specialCountBtn.getBackgroundSpriteForState(cc.CONTROL_STATE_HIGHLIGHTED).setSpriteFrame(cc.spriteFrameCache.getSpriteFrame('btnBull' + cardType + '_2.png') )
        }
        else
        {   
            playNode.commonCount.setVisible(true)
        }
    },
    hideCountNode:function()
    {
        playNode.commonCount.setVisible(false)    
        playNode.countButton1.isNiu = false
        playNode.specialCount.setVisible(false)   
        if(playNode.specialCount.getChildByTag(10001))
            playNode.specialCount.removeChildByTag(10001)
    },
    startCountClock:function(isCan, time)
    {   
        time = typeof(time) == 'number'?time:countTime

        if( isCan )
        {
            var c = clock.getOneClock(time, 
            function()
            {
                playNode.hideCountNode()
                if(!playNode.isUserCount)
                {
                    playNode.unOperateCount = playNode.unOperateCount + 1
                    playNode.standOnGameEnd = true
                    if(playNode.unOperateCount >=unOperateCountMax)
                    {
                        socket.closeWithPop(Word_0.w_015, 1, 2)
                    }
                }
            },
            function()
            {
                if(parseInt( c.clockLabel.getString() ) <= 3 && !playNode.isUserCount)
                    managerAudio.playEffect('gameRes/sound/tick.mp3')
            }
            )  
        }
        else
        {
            var c = clock.getOneClock(time)
        }
        playNode.clockNode.addChild(c.clockNode)
    },
    stopCountClock:function()
    {
        playNode.clockNode.removeAllChildren()
    },
    showCountFiredCircle:function(cUsers, time)
    {   
        time = typeof(time) == 'number'?time:countTime

        for(var i in cUsers)
        {   
            var user = cUsers[i]
            if(user.dwUserID == selfdwUserID ) continue
            chairFactory.showFiredCircle.call(user.userNodeInsetChair, time)
        }
    },
    hideCountFiredCircle:function(cUsers)
    {
        for(var i in cUsers)
        {   
            var user = cUsers[i]
            if(user.dwUserID == selfdwUserID) continue
            chairFactory.hideFiredCircle.call(user.userNodeInsetChair)
        }
    },  

    ///////leaveCountAction start///////
    leaveCountAction:function(callback, cGameEndlGameScore, cNiuIdxWithChairidArray)
    {
        var a = cc.sequence( 
            cc.spawn(playNode._getAllCardsTurnOverActions(playNode.cardSprs)), 
            cc.callFunc(function()
            {
                playNode._showSprsOnGameEnd(cGameEndlGameScore, cNiuIdxWithChairidArray)
            }), 
            cc.delayTime(5), //看牌5秒
            cc.callFunc(function()
            {   
                playNode._removeSprsOnGameEnd()
                callback?callback():''
                playData.playStateMachine.transition()
            }))            

        playNode.node.runAction(a)
    },
    _getAllCardsTurnOverActions:function(cardSprs)
    {
        //翻牌
        var turnOverActions = []

        for(var i in cardSprs)
        {
            if(i == tableData.getUserWithUserId(selfdwUserID).wChairID) continue
    
            for(var j in cardSprs[i])  
            {
                var target = cardSprs[i][j]
                var endCardIdx = target.cardIdx
                var a1 = cardFactory.getTurnOverAction(target, endCardIdx)
                var a2 = cc.sequence(
                    cc.callFunc(function()
                    {   
                        var posx = ( this.cardArrayIdx>2?(this.cardArrayIdx-3.5):
                        (this.cardArrayIdx-1) ) * this.getContentSize().width*this.getScale()
                        var posy = this.cardArrayIdx>2?this.getContentSize().height*this.getScale()*0.5:0
                        this.setPosition( cc.p(posx, posy) )
                        this.setLocalZOrder( this.cardArrayIdx>2?-1:0)
                    },target),
                    a1)

                var a3 = cc.targetedAction( target, a2 )
                turnOverActions[turnOverActions.length] = a3
            }   
        }
        if(turnOverActions.length == 0)
        {
            turnOverActions[turnOverActions.length] = cc.callFunc(function()
            {
                gameLog.log('no cardSprs')
            })
        }

        return turnOverActions
    },
    _showSprsOnGameEnd:function(gameEndlGameScore, niuIdxWithChairidArray)
    {
        var tableId = tableData.getUserWithUserId(selfdwUserID).wTableID
        var scoreChangeScale = 1
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithTableIdAndChairId(tableId, i)
            if(!user) continue
            var chair = tableData.getChairWithServerChairId(user.wChairID)
            if(playData.hasGetSendCardsWithdwUserID(user.dwUserID) && tableData.isInTable(user.cbUserStatus))
            {   
                //score
                var score = gameEndlGameScore[i]
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

                var maxW = mainScene.uiPlay.getContentSize().width * 0.25
                var scale = swidth<maxW?1:maxW/swidth
                scoreChangeScale = Math.min(scoreChangeScale, scale) 

                //niuIdx
                var idx = niuIdxWithChairidArray[i]
                var niuShow 
                if(idx>0&&idx<=10)
                {   
                    var s = '0' + (idx==10?0:idx).toString()
                    niuShow = new ccui.TextAtlas()
                    niuShow.setProperty(s, resp.numsNiu, 45, 50, "0")
                }
                else
                {
                    niuShow = new cc.Sprite("#" + 'niu_' + idx + '.png') 
                }
                user.userNodeInsetChair.currentRoundNode.niuIdxIcon.addChild(niuShow) 


                if(user.dwUserID == selfdwUserID)
                {
                    if(score!= 0)
                    {
                        var sp = score>0?'gameEndWin.png':'gameEndLose.png'
                        playNode.winOrLoseSpr.setSpriteFrame(sp) 
                        managerAudio.playEffect(score>0?'gameRes/sound/win.mp3':'gameRes/sound/lost.mp3')
                    }

                    user.userNodeInsetChair.currentRoundNode.niuIdxIcon.setScale(1.5)
                    managerAudio.playEffect('gameRes/sound/manbull' + idx +'.mp3')

                    if(playData.sendCards.cbCardType[i] != niuIdxWithChairidArray[i] )
                    {
                        var UserExpression = getObjWithStructName('CMD_GF_C_UserExpression')
                        UserExpression.wItemIndex = 12
                        UserExpression.dwTargetUserID = ''

                        socket.sendMessage(MDM_GF_FRAME,SUB_GF_USER_EXPRESSION,UserExpression)
                    }
                }
                else
                {
                    user.userNodeInsetChair.currentRoundNode.niuIdxIcon.setScale(1)
                }
            }
        }
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithTableIdAndChairId(tableId, i)
            if(!user || !playData.hasGetSendCardsWithdwUserID(user.dwUserID) ) continue
            var chair = tableData.getChairWithServerChairId(user.wChairID)
            user.userNodeInsetChair.currentRoundNode.scoreChange.setScale(scoreChangeScale)
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
    //////leaveCountAction end///////

    ////////////count end///////////

    fixTotalScoreNode:function(score)
    {

        playNode.totalScoreLabel.setString(score)

        var chipsWidth = playNode.totalScoreChips.getContentSize().width
        var labelWidth = playNode.totalScoreLabel.getContentSize().width
        var w = chipsWidth + labelWidth + 10

        playNode.totalScoreChips.setPosition( cc.p( - w/2, -10) )
        playNode.totalScoreLabel.setPositionX( w/2 )

        playNode.totalScoreBg.width = w * 1.3
        playNode.totalScoreBg.height = playNode.totalScoreLabel.getContentSize().height 
        playNode.totalScoreBg._updateCapInset()
    },
    reStartGame:function()
    {
        playNode.selectCardsRecord = []
        playNode.cardSprs = []
        playNode.isUserAddScore = false
        playNode.isUserCount = false
    },
    onGameEnd:function()
    {
        if(playNode.standOnGameEnd)
        {
            var lookon = getObjWithStructName('CMD_GR_UserLookon') 
            lookon.wTableID = tableData.getUserWithUserId(selfdwUserID).wTableID
            socket.sendMessage(MDM_GR_USER, SUB_GR_USER_LOOKON, lookon)
            playNode.standOnGameEnd = false
        }
    },
    refreshChipNode:function(lAddScoreCount)
    {
        var userNodeInsetChair = this
        var chips = new cc.Sprite('#cf_chips_1.png')
        chips.setAnchorPoint(cc.p(0.5,0))
        userNodeInsetChair.currentRoundNode.chipNode.addChild(chips)

        var scoreLabel = new cc.LabelTTF(lAddScoreCount, "Helvetica", 22)
        scoreLabel.setFontFillColor( cc.color(255, 199, 6, 255) )
        userNodeInsetChair.currentRoundNode.chipNode.addChild(scoreLabel)

        if(parseInt(lAddScoreCount) > 999)
        {
            var isRight = chairFactory.isRight(userNodeInsetChair.getParent())
            scoreLabel.setAnchorPoint(cc.p(isRight?1:0, 1))
            scoreLabel.setPosition(cc.p(isRight?15:-15, -1))
        }
        else
        {
            scoreLabel.setAnchorPoint(cc.p(0.5, 1))
            scoreLabel.setPosition(cc.p(0, -1))
        }
    },

}





