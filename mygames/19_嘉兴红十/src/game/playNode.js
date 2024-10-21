
var callTime = 20
var outCardTime = 20

var playNode = 
{   
    selectedCards:[],
    tipsArray:[],
    idxsGroupNode:null,  
    handCardIdxs:[],
    lastOutCardType:{},
    isLookingResult:false,
    isPlaying:false,  
    init:function()
    {   
        playNode._registEvent()
        playNode._initCallBack()
        var node = managerRes.loadCCB(resp.playCCB, this)
        playNode.animationManager = node.animationManager
        playNode.node  = node
        playNode._initDiCardNode()

        // playNode.uiOperate.y = 96
    },
    onReStart:function()
    {
        playNode.selectedCards = []
        playNode.tipsArray = []
        playNode.idxsGroupNode = null
        playNode.handCardIdxs = []
        playNode.lastOutCardType = {}

        playNode.isLookingResult = false
        playNode.isPlaying = false
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
    },
    initCurrentRoundNode:function(currentRoundNode)
    {
        //currentRoundNode是绑定在chair上的一个节点 用于存放当前轮用到的节点
        currentRoundNode.handCards = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.handCards )

        currentRoundNode.outCards = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.outCards )

        currentRoundNode.scoreChange = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.scoreChange, 1)    

        currentRoundNode.warnNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.warnNode, 1)    

        currentRoundNode.handCardsNum = new ccui.TextAtlas()
        currentRoundNode.handCardsNum.setAnchorPoint(cc.p(0.5, 0))
        currentRoundNode.handCardsNum.setProperty("", resp.nums1, 16, 23, "0")
        currentRoundNode.addChild( currentRoundNode.handCardsNum, 1)    

        currentRoundNode.tipsSpr = new cc.Sprite('#empty.png')
        currentRoundNode.addChild( currentRoundNode.tipsSpr)    

        currentRoundNode.scoreTTF = cc.LabelTTF.create('', "Helvetica", 20)
        currentRoundNode.scoreTTF.setFontFillColor( cc.color(244, 230, 159, 255) )
        currentRoundNode.addChild(currentRoundNode.scoreTTF)  
        currentRoundNode.scoreTTF.anchorY = 0

        ////////////
        currentRoundNode.flowerNode = new cc.Node()
        currentRoundNode.flowerNode.setVisible(false)
        currentRoundNode.addChild(currentRoundNode.flowerNode)  

        var flowerSpr = new cc.Sprite('#redFlower.png')
        currentRoundNode.flowerNode.addChild(flowerSpr)  
        flowerSpr.x = -13

        var flowerTTF = cc.LabelTTF.create('', "Helvetica", 18)
        flowerTTF.setFontFillColor( cc.color(244, 230, 159, 255) )
        currentRoundNode.flowerNode.addChild(flowerTTF)  
        flowerTTF.x = 0
        flowerTTF.anchorX = 0
        currentRoundNode.flowerTTF = flowerTTF
    },
    clearCurrentRoundNode:function(currentRoundNode)
    {           
        //一轮结束 clearCurrentRoundNode
        currentRoundNode.handCards.removeAllChildren()
        currentRoundNode.outCards.removeAllChildren()
        currentRoundNode.scoreChange.removeAllChildren()
        currentRoundNode.handCardsNum.setString('')
        currentRoundNode.warnNode.removeAllChildren()
        currentRoundNode.tipsSpr.setSpriteFrame('empty.png')

        currentRoundNode.scoreTTF.setString('')
        currentRoundNode.flowerNode.setVisible(false)

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

        if(showChairId==0||showChairId==3||showChairId==2)
            sign = -1
        else
            sign = 1
        currentRoundNode.flowerNode.setPosition( cc.p(0, 75) )  
        currentRoundNode.outCards.setPosition( cc.p(-40 * sign, 0) )
        currentRoundNode.scoreChange.setPosition( cc.p(-50 * sign, 40) )  
        currentRoundNode.tipsSpr.setPosition( cc.p(-45 * sign, 0) )
        currentRoundNode.tipsSpr.setAnchorPoint(cc.p((1 + sign)*0.5, 0.5))

        currentRoundNode.handCardsNum.setPosition( cc.p(-72* sign, 60) )    
        currentRoundNode.warnNode.setPosition( cc.p(-43* sign, 60) )  

        currentRoundNode.scoreTTF.setPosition( cc.p(0, 65) )  

        var size = tableNode.node.getContentSize()
        if(userId == selfdwUserID)
        {
            currentRoundNode.handCards.setPosition( cc.p( size.width*0.5 - 60, -210) )
        }
        else
        {       
            currentRoundNode.handCards.setPosition( cc.p( -(size.width*0.5 - 60), 210) )
        } 
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

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "touchTableBottom",
            callback: function(event)
            {   
                playNode.resetSelectedCards()
            }
        })
        cc.eventManager.addListener(l, 1)
    },
    _initCallBack:function()
    {
        playNode._initOutCardCall()
        playNode._initCallCall()
    },
    ///////////////cmdEvent start//////////
    updateOnFree:function()
    {
        var users = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
        if(!playNode.isLookingResult)
        {
            if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT)
                socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
        }
    },
    onCMD_StatusFree:function() 
    {
        tableNode.turnScoreTTF.setString('')
        playNode.jiaopaiTTF2.setVisible(cmdBaseWorker.cbShowCount==2) 
        playNode.resetSelectedCards()
        playNode.hideDiCardNode()
        playNode.isPlaying = false
        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)
    },
    onCMD_StatusCall:function() 
    {
        playNode.isPlaying = true
        playNode.jiaopaiTTF2.setVisible(cmdBaseWorker.cbShowCount==2) 

        playNode.initHandCardIdxs(cmdBaseWorker.cbHandCardDataSelf, cmdBaseWorker.cbHandCardCount)

        if( playNode.handCardIdxs.length!=0 ) //旁观
        {
            playNode.sortHandIdxs(playNode.handCardIdxs) 
            playNode.sendCardsAction(playNode.handCardIdxs) 
        }

        var self = tableData.getUserWithUserId(selfdwUserID)
        if(cmdBaseWorker.cbCallRecord[self.wChairID] == INVALID_BYTE)
        {
            playNode.popCallNode(true)
        }

        // playNode.callEnter(cmdBaseWorker.wCurrentUserCall) 
    },
    onCMD_StatusPlay:function() 
    {   
        playNode.isPlaying = true
        playNode.updateCallRecord()
        playNode.jiaopaiTTF2.setVisible(cmdBaseWorker.cbShowCount==2) 

        playNode.refreshWinOrder(cmdBaseWorker.wWinOrder)
        ///////
        playNode.initHandCardIdxs(cmdBaseWorker.cbHandCardDataSelf, cmdBaseWorker.cbHandCardCount)
        if( playNode.handCardIdxs.length!=0 ) //旁观
        {
            playNode.sortHandIdxs(playNode.handCardIdxs) 
            playNode.sendCardsAction(playNode.handCardIdxs) 
        }

        var idxs = cmdBaseWorker.cbOutCardData.slice(0,cmdBaseWorker.cbOutCardCount)
        if(idxs.length!=0)
        {
            //更新 playData.lastOutCardType
            var data = cmdBaseWorker.cbOutCardData.slice(0,cmdBaseWorker.cbOutCardCount)
            var chanegData = cmdBaseWorker.cbOutCardChange.slice(0,cmdBaseWorker.cbOutCardCount)
            //服务器有bug四个癞子的炸弹时 bChangeCard会和bCardData不一样 四个癞子的炸不应该作为癞子处理
            var isAllLazi = true
            for(var i=0;i<chanegData.length;i++)
            {   
                if( chanegData[i] <14 )
                {
                    isAllLazi = false
                    break
                }
            }
            if(isAllLazi)
                chanegData = data
            
            var idxs = gameLogic.getIdxWithDataAndChangeData(data, chanegData)
            playNode.lastOutCardType = gameLogic.getCardsType(cardLogic.sortWithNum(idxs)) 

            playNode.outCard(cmdBaseWorker.wOutCardUser, playNode.lastOutCardType, false)
        }
        
        playNode.outCardEnter(cmdBaseWorker.wCurrentUser) 
    },
    onCMD_CallNotify:function()
    {
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
        playNode.isPlaying = true

        if(playNode.isLookingResult)
        {
            playNode.resetPlayNode()
        } 

        playNode.initHandCardIdxs(cmdBaseWorker.cbHandCardDataSelf, cmdBaseWorker.cbHandCardCount)

        if( playNode.handCardIdxs.length!=0 ) //旁观
        {
            playNode.sortHandIdxs(playNode.handCardIdxs) 
            playNode.sendCardsAction(playNode.handCardIdxs) 
        
            if( gameLogic.getRed10Count(playNode.handCardIdxs) > 0 )
                playNode.popCallNode(true)
        }

        playNode.jiaopaiTTF2.setVisible(cmdBaseWorker.cbShowCount==2) 
    },
    onCMD_CallResult:function()
    {
        playNode.callExit(cmdBaseWorker.wCallUser, cmdBaseWorker.cbCallScore)

        if(cmdBaseWorker.wCurrentUserCall!=INVALID_WORD)
            playNode.callEnter(cmdBaseWorker.wCurrentUserCall)
    },
    onCMD_GameStart:function() 
    {
        for(var i=0;i<GAME_PLAYER;i++)
            playNode.clearCallCard(i)

        if(!playNode.isPlaying)//有的游戏有call状态
        {
            cocos.clearInterval(playNode.updateOnFree, playNode.node)
            playNode.isPlaying = true

            if(playNode.isLookingResult)
            {
                playNode.resetPlayNode()
            } 
        }
        
        playNode.updateCallRecord()
        playNode.jiaopaiTTF2.setVisible(cmdBaseWorker.cbShowCount==2) 
        playNode.outCardEnter(cmdBaseWorker.wCurrentUser) 

        // var spr = actionFactory.getSprWithAnimate('start_', true, 0.15, function()
        // {   
        //     playNode.initHandCardIdxs(cmdBaseWorker.cbHandCardDataSelf, cmdBaseWorker.cbHandCardCount)

        //     if( playNode.handCardIdxs.length!=0 ) //旁观
        //     {
        //         gameLogic.sortIdxsWithScore(playNode.handCardIdxs, [78, 79]) 
        //         playNode.sendCardsAction(playNode.handCardIdxs) 
        //     }

        //     playNode.outCardEnter(cmdBaseWorker.wCurrentUser) 
        // })

        // spr.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.6) )
        // mainScene.uiTop.addChild(spr) 
        // managerAudio.playEffect('gameRes/sound/start.mp3')
    },
    onCMD_BankerInfo:function() 
    {
    },
    onCMD_OutCard:function() 
    {
        var isFirstOut = !playNode.lastOutCardType.idxs
        playNode.updateCallRecord()

        //更新 playData.lastOutCardType
        var data = cmdBaseWorker.cbOutCardData.slice(0,cmdBaseWorker.cbOutCardCount)
        var chanegData = cmdBaseWorker.cbOutCardChange.slice(0,cmdBaseWorker.cbOutCardCount)
        //服务器有bug四个癞子的炸弹时 bChangeCard会和bCardData不一样 四个癞子的炸不应该作为癞子处理
        var isAllLazi = true
        for(var i=0;i<chanegData.length;i++)
        {   
            if( chanegData[i] <14 )
            {
                isAllLazi = false
                break
            }
        }
        if(isAllLazi)
            chanegData = data
        
        var idxs = gameLogic.getIdxWithDataAndChangeData(data, chanegData)
        playNode.lastOutCardType = gameLogic.getCardsType(cardLogic.sortWithNum(idxs)) 

        playNode.outCardExit(cmdBaseWorker.wOutCardUser, false, isFirstOut)
        playNode.outCardEnter(cmdBaseWorker.wCurrentUser)

        ////////
        var cardsType = playNode.lastOutCardType
        if(cardsType.typeLevel>1)
        {
            var spr = actionFactory.getSprWithAnimate('bomb_', true, 0.15)
            spr.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.6) )
            mainScene.uiTop.addChild(spr) 
            managerAudio.playEffect('gameRes/sound/bomb.mp3')
        }

        playNode.refreshWinOrder(cmdBaseWorker.wWinOrder)

    },
    onCMD_PassCard:function() 
    {
        var isContinuousOut = cmdBaseWorker.wCurrentUser == cmdBaseWorker.wOutCardUser
        if(cmdBaseWorker.cbTurnOver)
        {
            playNode.lastOutCardType = {}
            for(var i=0;i<GAME_PLAYER;i++)
            {
                var isUnNeedClear = isContinuousOut && cmdBaseWorker.wCurrentUser == i
                if(!isUnNeedClear)
                    playNode.clearOutCards(i)
            }
        }

        playNode.outCardExit(cmdBaseWorker.wPassCardUser, true)
        playNode.outCardEnter(cmdBaseWorker.wCurrentUser, null, isContinuousOut)

    },
    onCMD_GameEnd:function() 
    {
        setTimeout(function()
        {
            var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
            record.szTableKey = tableKey
            socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
        },2000)

        playNode.isLookingResult = true   
        playNode.isPlaying = false
        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)


        playNode.hideOutCardNode(true)
        playNode.hideCallNode()
        playNode.startOutCardClock(true)
        playNode.updateCallRecord()

        tableNode.turnScoreTTF.setString('')
        playNode.resetSelectedCards()
        playNode.hideDiCardNode()
        playNode.lastOutCardType = {}

        var szNickName_gameEnd = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithChairId(i)
            if(user)
                szNickName_gameEnd[i] = user.szNickName
        }

        var a = cc.sequence( 
            cc.callFunc(function()
            {     
                playNode._showSprsOnGameEnd()
            }), 
            cc.delayTime(2), //看牌5秒
            cc.callFunc(function()
            {   
                var continueCall = function()
                {
                    playNode.isLookingResult = false   
                    if(!playNode.isPlaying)   
                    {
                        playNode.resetPlayNode()
                    }
                }
                playNode.popGameEnd(continueCall, szNickName_gameEnd) 
            }),  
            cc.delayTime(3), 
            cc.callFunc(function()
            {   
                headIconPop.kickUserOnGameEnd()
                for(var i=0;i<GAME_PLAYER;i++)
                {
                    tableNode.setBankerIcon(i, false)
                }

                var isLastWinner = false

                if(isLastWinner)
                {
                    var lookon = getObjWithStructName('CMD_GR_UserLookon') 
                    lookon.wTableID = tableData.tableID
                    socket.sendMessage(MDM_GR_USER, SUB_GR_USER_LOOKON, lookon) 
                }
            }))            

        playNode.node.runAction(a)
    },
    ///////////////cmdEvent end//////////



    ////////////sendCardsAction start//////////
    initHandCardIdxs:function(bCardData, bCardCount)
    {   
        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if(self.wChairID == i)
                playNode.handCardIdxs = bCardData.slice(0, bCardCount[i] )

            var user = tableData.getUserWithChairId(i)
            if(user.dwUserID != selfdwUserID)
                playNode.setHandCardsNum( user, bCardCount[i] )
        }
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
    sendCardsAction:function(handCardIdxs)
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

        var nodeSize = playNode.node.getContentSize()
        var handCardInterval = Math.floor( (nodeSize.width - cardFactory.width - 10 )/(MAX_COUNT-1) )
        var autoFill = function(isDownCard)
        {
            var subIdx54s = []
            for(var i in playNode.selectedCards)
                subIdx54s[i] = playNode.selectedCards[i].cardIdx

            var needSelectedIdx54s = gameLogic.getNeedSelectedIdx54s_autoFill(isDownCard, playNode.tipsArray, subIdx54s, 
                [])
            playNode.selectCards(needSelectedIdx54s)
        }

        playNode.idxsGroupNode = cardFactory.getCardsGroupNode(cardSprs, handCardInterval, autoFill)
        user.userNodeInsetChair.currentRoundNode.handCards.addChild( playNode.idxsGroupNode ) 
        
        playNode.selectedCards = []
    },

    ////////////sendCardsAction end//////////

    ////////////gameend start//////////
    clearHandCards:function()
    {
        var user = tableData.getUserWithUserId(selfdwUserID)
        user.userNodeInsetChair.currentRoundNode.handCards.removeAllChildren()
    },
    _showSprsOnGameEnd:function()
    {
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithChairId(i)
            if(!user) continue

            var chair = tableData.getChairWithServerChairId(i)
            // if(playData.hasGetSendCardsWithdwUserID(user.dwUserID) && tableData.isInTable(user.cbUserStatus))
            // if(tableData.isInTable(user.cbUserStatus))
            // {   
            var score = cmdBaseWorker.lGameScore[i]
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

            var cards = cmdBaseWorker.cbHandCardData[i].splice(0, cmdBaseWorker.cbHandCardCount[i] )
            if(cards.length>0)
            {
                var user = tableData.getUserWithChairId(i)
                cardFactory.refreshOutCards(user, playNode.sortHandIdxs(cards), user.dwUserID == selfdwUserID?30:15)
            }
            // }
        }
    },
    _removeSprsOnGameEnd:function()
    {
        playNode.winOrLoseSpr.setSpriteFrame('empty.png') 
        for(var chairId=0;chairId<GAME_PLAYER;chairId++)
        {   
            var user = tableData.getUserWithTableIdAndChairId(null, chairId)
            if(user)
            {
                playNode.clearCurrentRoundNode(user.userNodeInsetChair.currentRoundNode)
                chairFactory.hideFiredCircle.call(user.userNodeInsetChair)
            }
        }
    },
    popGameEnd:function(continueCall, szNickName_gameEnd)
    {
        // var szNickName = []
        // for(var i=0;i<GAME_PLAYER;i++)
        // {
        //     var user = tableData.getUserWithChairId(i)
        //     if(user)
        //         szNickName[i] = user.szNickName
        // }

        var cbWinFlag = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if(i==cmdBaseWorker.wExitUser)
                cbWinFlag[i] = 6
        }

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

        // control.resultTTF.setString( args.msg )
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var chairid = i
            if(typeof(cbWinFlag[i])!='undefined')
            {
                control['winflag'+i].setVisible(true)
                control['winflag'+i].setSpriteFrame('winFlag_' + cbWinFlag[i] + '.png') 
            }
            else
                control['winflag'+i].setVisible(false)
            
            var score = cmdBaseWorker.lGameScore[chairid]
            control['name'+i].setString(szNickName_gameEnd[chairid])
            control['banker'+i].setVisible(cmdBaseWorker.wBankerUser == chairid)
            control['win'+i].setVisible(score>0)
            if(score>0)
            {
                control['scoreTTF'+i].setString('+' + score)
                control['scoreTTF'+i].color = cc.color(255, 0, 0)
                control['frame'+i].setSpriteFrame('gend5.png')
            }
            else
            {
                control['scoreTTF'+i].setString(score==0?'-'+score:score)
                control['scoreTTF'+i].color = cc.color(0, 255, 0)
                control['frame'+i].setSpriteFrame('gend6.png')
            }

            // var str = args.PlayerScore[i]==-1?'(两帮)':('(' + args.PlayerScore[i] + '分)')
            // control['pScoreTTF'+i].setString(str)
            // control['pScoreTTF'+i].x = control['scoreTTF'+i].width
        }

        node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5) )
        mainScene.top.addChild(node) 
    },
    ////////////gameend end//////////



    /////////////outcard begin/////////
    _initOutCardCall:function()
    {   
        playNode.outCardCallOut = function()
        {             
            var cards = []
            for(var i in playNode.selectedCards)
                cards[i] = playNode.selectedCards[i].cardIdx
            var cardsTypeArrray = gameLogic.getCardsTypesWithIdx54s( cardLogic.sortWithNum(cards), []) 

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
                        playNode._outCardCall1(cardsType)
                    }
                    
                    paramsArray[paramsArray.length] = p
                }
                playNode.popChooseTypeNode(paramsArray)
            }
            else
                playNode._outCardCall1(cardsTypeArrray[0])

        }

        playNode.outCardCallPass = function()
        {   
            playNode.resetSelectedCards()
            
            playNode.hideOutCardNode(true)
            socket.sendMessage(MDM_GF_GAME, SUB_C_PASS_CARD) 
        }

        playNode.outCardCallTips = function()
        {         
            playNode.resetSelectedCards()

            var idxs = playNode.tipsArray[playNode.outCardButton2.currentTipsIdx]
            for(var i=0;i<idxs.length;i++)
            {
                if(idxs[i]>=80)
                    idxs[i] = cardLogic.getIdx54OfLaiziWithColorAndIdx_laizi(idxs[i], 0) 
            }
            playNode.selectCards(idxs)
            playNode.outCardButton2.currentTipsIdx = (playNode.outCardButton2.currentTipsIdx + 1)%playNode.tipsArray.length
        }
    },
    _outCardCall1:function(cardsType)
    {
        var isAllowOut = false
        if(cardsType)
        {
            if(!playNode.lastOutCardType.idxs)
                isAllowOut = cardsType.typeLevel > 0
            else
            {
                var cardsType2 = playNode.lastOutCardType
                var c = gameLogic.compareTwoCardsType(cardsType, cardsType2) 
                isAllowOut = c == 0
            }
        }
        
        if(isAllowOut)
        {
            var OutCard = getObjWithStructName('CMD_C_OutCard')
            cmdBaseWorker.fillCMD_OutCard(OutCard, cardsType.idxs)
            socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)

            playNode.hideOutCardNode(true)
        }
        else
        {
            showTips({str:'您的出牌不合理'}) 
        }
    },
    outCardEnter:function(wCurrentUser, time, isContinuousOut)
    {
        if(wCurrentUser == INVALID_WORD) return 
            
        var self = tableData.getUserWithUserId(selfdwUserID)
        if(!isContinuousOut)
            playNode.clearOutCards(wCurrentUser)

        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, wCurrentUser)
        playNode.showOutCardFiredCircle(user, time)
        
        var iscan = self.wChairID == wCurrentUser
        if(iscan)
            playNode.clearOutCards(wCurrentUser)
        playNode.popOutCardNode(iscan)
        playNode.startOutCardClock(iscan, time)
    },
    outCardExit:function(wOutCardUser, isPass, isFirstOut)
    {
        if(wOutCardUser == INVALID_WORD) return 

        var self = tableData.getUserWithUserId(selfdwUserID)
        var isSelfOut = self.wChairID == wOutCardUser
        var userOut = tableData.getUserWithChairId(wOutCardUser)

        ////////
        playNode.hideOutCardFiredCircle(userOut)
        playNode.hideOutCardNode(isSelfOut)
        playNode.startOutCardClock(isSelfOut)

        if(isPass)
        {
            playNode.passCard(wOutCardUser)
            return 
        }

        playNode.outCard(wOutCardUser, playNode.lastOutCardType, isFirstOut)                        
        if(isSelfOut)
        {         
            for(var i in playNode.lastOutCardType.idxs)
            {
                for(var j in playNode.handCardIdxs)
                {
                    var c = playNode.lastOutCardType.idxs[i]
                    c = c>=80?cardLogic.getIdx54OfLaiziWithColorAndIdx_laizi(c, 0):c

                    if(c == playNode.handCardIdxs[j])
                    {
                        playNode.handCardIdxs.splice(j,1)
                        break
                    }
                }
            }

            if(playNode.handCardIdxs.length>0)
                playNode.sendCardsAction(playNode.handCardIdxs)  //这里可以优化
            else
                playNode.clearHandCards()
        }
        else
            playNode.minusHandCardsNum(userOut, playNode.lastOutCardType.idxs.length)
    },
    passCard:function(chairID)
    {
        var user = tableData.getUserWithChairId(chairID)
        var outCardsNode = user.userNodeInsetChair.currentRoundNode.outCards
        outCardsNode.removeAllChildren()   

        var spr = new cc.Sprite('#outSpr_1.png')
        var x = 0.5

        var chair = tableData.getChairWithServerChairId(user.wChairID)
        x = chairFactory.isRight(chair.node)?1:0
        
        spr.setAnchorPoint(cc.p(x, 0.5))
        outCardsNode.addChild(spr)
        playNode.playGenderEffect('buyao' + (Math.ceil(Math.random()*10))%3, user.cbGender)
    },
    outCard:function(chairID, cardType, isFirstOut)
    {
        var user = tableData.getUserWithChairId(chairID)

        cardFactory.refreshOutCards(user, cardType.idxs, user.dwUserID == selfdwUserID?30:15)

        var handCardsNum = user.userNodeInsetChair.currentRoundNode.handCardsNum
        if(handCardsNum.getString() != cardType.idxs.length)
            playNode.playCardTypeEffect(cardType, isFirstOut, user.cbGender)
     
        managerAudio.playEffect('gameRes/sound/outcard.mp3')
    },
    popOutCardNode:function(isCan)
    {
        if(!isCan) return;
        playNode.outCardNode.setVisible(true)
        playNode.callNode.setVisible(false)
        //上一次没人出牌 或者上一次自己出的牌
        var isFirstOut = !playNode.lastOutCardType.idxs

        if(isFirstOut)
        {
            playNode.tipsArray = gameLogic.getTipsArrayForFirstOut( playNode.handCardIdxs )
        }
        else
        {
            var cardsType = playNode.lastOutCardType
            playNode.tipsArray = gameLogic.getTipsArray(cardsType, cardLogic.sortWithNum(clone(playNode.handCardIdxs)), [])
        }

        playNode.outCardButton2.currentTipsIdx = 0  


        //不需要不出按钮了 有要不起按钮
        var isAllowPass = playNode.lastOutCardType.idxs //&& playNode.tipsArray.length==0  //playData.lastOutCardUser != null && playData.lastOutCardUser!=tableData.getUserWithUserId(selfdwUserID).wChairID
        playNode.outCardButton3.setEnabled( isAllowPass )

        var isPopCount = !isAllowPass || playNode.tipsArray.length != 0
        playNode.commonOutCard.setVisible(isPopCount)
        playNode.notOutCard.setVisible(!isPopCount)

        playNode.outCardButton1.setEnabled(playNode.selectedCards.length!=0)
        playNode.outCardButton2.setEnabled(playNode.tipsArray.length>0)
    },
    hideOutCardNode:function(isCan)
    {   
        if(!isCan) return;

        playNode.tipsArray = []
        playNode.commonOutCard.setVisible(false)
        playNode.notOutCard.setVisible(false)  
    },
    showOutCardFiredCircle:function(user, time)
    {   
        time = typeof(time) == 'number'?time:outCardTime
        chairFactory.showFiredCircle.call(user.userNodeInsetChair, time)
    },
    hideOutCardFiredCircle:function(user)
    {
        if(user)
            chairFactory.hideFiredCircle.call(user.userNodeInsetChair)
    },  
    startOutCardClock:function(isCan, time)
    {   
        time = typeof(time) == 'number'?time:outCardTime

        if( isCan )
        {
            var c = clock.getOneClock(time, 
            function()
            {
            },
            function()
            {
                if(parseInt( c.clockLabel.getString() ) <= 3 )
                    managerAudio.playEffect('gameRes/sound/tick.mp3')
            }
            )  
            playNode.clockNode.addChild(c.clockNode)
        }  
    },
    startOutCardClock:function(isCan)
    {
        if(!isCan) return;
        playNode.clockNode.removeAllChildren()
    },

    /////////////outcard end/////////

    /////////////call begin/////////
    _initCallCall:function()
    {
        var callCard = function(cbParam1)
        {
            var CallCard = getObjWithStructName('CMD_C_Call') 
            CallCard.cbCallScore = cbParam1
            socket.sendMessage(MDM_GF_GAME, SUB_C_CALL, CallCard)
            playNode.hideCallNode()

        }
        playNode.callCall1 = function(){ callCard(1) }
        playNode.callCall2 = function(){ callCard(2) }
        playNode.callCall3 = function(){ callCard(0) }
        playNode.callCall4 = function(){ callCard(gameLogic.getRed10Count(playNode.handCardIdxs)) }
    },
    popCallNode:function(isCan) // 0 当前0分
    {
        if(!isCan) return;
        playNode.outCardNode.setVisible(false)
        playNode.callNode.setVisible(true)

        // var red10Count = gameLogic.getRed10Count(playNode.handCardIdxs)
        // playNode.callBtn1.setEnabled(red10Count>=1)
        // playNode.callBtn2.setEnabled(red10Count>=2)
    },
    callCard:function(callUser, cbParam1)
    {
        var user = tableData.getUserWithChairId(callUser)
        var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
        tipsSpr.setSpriteFrame('callSpr_'+cbParam1+'.png') 

        // playNode.playGenderEffect('jiaofen'+cbParam1, user.cbGender)
    },
    clearCallCard:function(userChair)
    {
        var user = tableData.getUserWithChairId(userChair)
        var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
        tipsSpr.setSpriteFrame('empty.png') 
    },
    callExit:function(callUser, cbParam1)
    {
        var self = tableData.getUserWithUserId(selfdwUserID)
        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, callUser)
        var isSelf = callUser == self.wChairID

        playNode.hideCallFiredCircle(user)
        playNode.hideCallNode()
        playNode.stopCallClock(isSelf)

        playNode.callCard(callUser, cbParam1)
    },
    callEnter:function(wCurrentUserCall, time)
    {   
        var self = tableData.getUserWithUserId(selfdwUserID)
        var isSelf = wCurrentUserCall == self.wChairID
        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, wCurrentUserCall)
        playNode.showCallFiredCircle(user, time)
        playNode.startCallClock(isSelf, time)

        playNode.popCallNode(isSelf)
    },
    hideCallNode:function()
    {
        playNode.callNode.setVisible(false)
    },
    showCallFiredCircle:function(user, time)
    {
        time = typeof(time) == 'number'?time:callTime
        chairFactory.showFiredCircle.call(user.userNodeInsetChair, time)
    },
    hideCallFiredCircle:function(user)
    {
        if(user)
            chairFactory.hideFiredCircle.call(user.userNodeInsetChair)
    },    
    startCallClock:function(isCan, time)
    {   
        time = typeof(time) == 'number'?time:callTime
        if(isCan)
        {
            var c = clock.getOneClock(time, 
            function()
            {
            },
            function()
            {
                if(parseInt( c.clockLabel.getString() ) <= 3)
                    managerAudio.playEffect('gameRes/sound/tick.mp3')
            })  
            playNode.clockNode.addChild(c.clockNode)
        }
    },
    stopCallClock:function(isCan)
    {   
        if(!isCan) return;
        playNode.clockNode.removeAllChildren()
    },
    /////////////call end/////////

    //////////diCardNode begin///////
    _initDiCardNode:function() 
    {
        for(var i=1;i<7;i++)
        {
            var card = cardFactory.getOne(null, true, true)
            card.setScale(0.41)
            var s = playNode['diCardNode'+i].getContentSize()
            card.setPosition(cc.p(s.width*0.5, s.height*0.5))


            card.getChildByTag(101).setScale(1.1)

            playNode['diCardNode'+i].addChild(card)
            playNode['diCardSpr'+i] = card
        }
    },
    updateDiCard:function(cbDiCardData)
    {
        for(var i=0;i<6;i++)
        {
            if(cbDiCardData[i])
            {
                playNode['diCardSpr'+(i+1)].setSpriteFrame('card_'+cbDiCardData[i]+'.png') 
            }
            else
                break          
        }
    },
    showDiCardNode:function()
    {
        playNode.diCardNode.setVisible(true)
    },
    hideDiCardNode:function()
    {
        playNode.diCardNode.setVisible(false)
    },
    //////////diCardNode end///////
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
        else if(showNum<=3)
        {
            handCardsNum.setVisible(true)
            managerAudio.playEffect('gameRes/sound/warm.mp3')
            var spr = actionFactory.getSprWithAnimate('warn_', false, 0.15)
            spr.setAnchorPoint(cc.p(0.5,0))
            var warnNode = user.userNodeInsetChair.currentRoundNode.warnNode
            warnNode.removeAllChildren()
            warnNode.addChild(spr)
        }
        else if(showNum<=18)
            handCardsNum.setVisible(true)
    },


    clearOutCards:function(chairID)
    {
        var user = tableData.getUserWithChairId(chairID)
        var outCardsNode = user.userNodeInsetChair.currentRoundNode.outCards
        outCardsNode.removeAllChildren()   
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

    ////////////selectCards start///////////
    selectCards:function(idx54s)
    {
        var sortWithScoreIdx54s = playNode.sortHandIdxs(idx54s) 
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
        playNode.outCardButton1.setEnabled(playNode.selectedCards.length!=0)
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
    ////////////selectCards end///////////

    ///////////////playEffect start////////
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
    ///////////////playEffect end////////
    popChooseTypeNode:function(paramsArray)
    {
        playNode.chooseTypeNode.setVisible(true)
        for(var i in paramsArray)
        {   
            (function(i)
            {
                var c = paramsArray[i].sureCall
                paramsArray[i].sureCall = function()
                {
                    c()
                    playNode.hideChooseTypeNode()
                }
                playNode._addTypeItem(paramsArray[i]) 
            }(i))
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
    resetPlayNode:function()
    {
        playNode._removeSprsOnGameEnd()
    },
    sortHandIdxs:function(handCardIdxs)
    {
       return gameLogic.sortIdxsWithScore(handCardIdxs, [0x0A, 0x2A])   
    },
    updateCallRecord:function()
    {
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if(cmdBaseWorker.cbCallRecord[i] == 0)
                continue
            var user = tableData.getUserWithChairId(i)
            user.userNodeInsetChair.currentRoundNode.flowerNode.setVisible(true)
            user.userNodeInsetChair.currentRoundNode.flowerTTF.setString('x'+cmdBaseWorker.cbCallRecord[i])
        }
    }
}
