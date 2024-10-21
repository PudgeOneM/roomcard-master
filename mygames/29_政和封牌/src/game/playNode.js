
////先理解cardFactory(components/cardFactory/cardFactory)
var callTime = 20
var outCardTime = 20

var playNode = 
{   
    handCards4D:[],//手牌扑克精灵数组 4个方向的
    handGroupNode4D:[],//手牌扑克精灵父节点 4个方向的
    outCards4D:[],//丢弃扑克精灵数组 4个方向的
    tipsArray:[],

    isLookingResult:false,
    gameEndAction:null,
    hideGameEndNode: null,
    ///////////////////////init start///////////////////////
    init:function()
    {   
        playNode._registEvent()
        playNode._initCallBack()
        var node = managerRes.loadCCB(resp.playCCB, this)
        playNode.animationManager = node.animationManager
        playNode.node  = node

        cardFactory.defaultCardColor = cc.color(255, 255, 255)
        ///
        cardFactory.handCountOneRowMax = MAX_COUNT
        cardFactory.handCountOneRowMin = Math.ceil(cardFactory.handCountOneRowMax*1) 
        cardFactory.handGroupNodeHeight = 180//200
        cardFactory.outCountOneRow_upDown = Math.ceil(cardFactory.handCountOneRowMax*0.5) 
        cardFactory.outCountOneRow_rightLeft = Math.ceil(cardFactory.handCountOneRowMax/3) 
        cardFactory.intervalXRightAndDownOut = 50
        cardFactory.selectCardOffsetY = 10
        cardFactory.handIntervalYScale = 0.45
        cardFactory.outIntervalXScale = 0.36
        cardFactory.outIntervalYScale = 0.45

        cardFactory.handGroupNodeWidth = playNode.node.width-20
        cardFactory.init( playNode.decorateCard )

        playNode.adaptUi()
    },
    adaptUi:function()
    {
        if(GAME_PLAYER == 4)
        {
            tableNode.chairNode0.x = 60
            tableNode.chairNode0.y = cardFactory.handGroupNodeHeight + cardFactory.selectCardOffsetY + 0.5*cardFactory.down_outHeight*cardFactory.scale_out + 5

            tableNode.chairNode1.x = tableNode.uiChair.width - 60
            tableNode.chairNode1.y = tableNode.uiChair.height - 170 
            
            tableNode.chairNode3.x = 60
            tableNode.chairNode3.y = tableNode.chairNode1.y

            var outWidth_rightLeft = cardFactory.right_outWidth*cardFactory.scale_out
            + (cardFactory.outCountOneRow_rightLeft-1)*cardFactory.right_outWidth*cardFactory.outIntervalXScale*cardFactory.scale_out  
            var outWidth_upDown = cardFactory.up_outWidth*cardFactory.scale_out
            + (cardFactory.outCountOneRow_upDown-1)*cardFactory.right_outWidth*cardFactory.outIntervalXScale*cardFactory.scale_out  

            tableNode.chairNode2.x = tableNode.chairNode3.x
            + cardFactory.intervalXChairAndRightOut_const
            + outWidth_rightLeft
            + cardFactory.intervalXRightAndDownOut*cardFactory.scale_out
            + outWidth_upDown
            + cardFactory.intervalXChairAndRightOut_const
            tableNode.chairNode2.y = tableNode.uiChair.height - 85 
        }
        else if(GAME_PLAYER == 3)
        {
            tableNode.chairNode0.x = 60
            tableNode.chairNode0.y = cardFactory.handGroupNodeHeight + cardFactory.selectCardOffsetY + 0.5*cardFactory.down_outHeight*cardFactory.scale_out + 5

            tableNode.chairNode1.x = tableNode.uiChair.width - 60
            tableNode.chairNode1.y = tableNode.uiChair.height - 170 
            
            tableNode.chairNode2.x = 60
            tableNode.chairNode2.y = tableNode.chairNode1.y
        }


        //play
        playNode.turnDataNode.y = -1000//cardFactory.handGroupNodeHeight + cardFactory.selectCardOffsetY + 20
        playNode.uiOperate.y = cardFactory.handGroupNodeHeight + cardFactory.selectCardOffsetY + 35

        //topui
        topUINode.voiceNode.y = cardFactory.handGroupNodeHeight + cardFactory.selectCardOffsetY + 30
        topUINode.faceNode.y = topUINode.voiceNode.y + 82

    },
    onReStart:function()
    {
        playNode.handCards4D = []
        playNode.handGroupNode4D = []
        playNode.outCards4D = []
        playNode.isLookingResult = false

        cocos.clearInterval(playNode.updateOnFree, playNode.node)
    },
    initCurrentRoundNode:function(currentRoundNode)
    {
        //currentRoundNode是绑定在chair上的一个节点 用于存放当前轮用到的节点
        
        //单个方向的手牌扑克精灵父节点 的 父节点
        currentRoundNode.handCardsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.handCardsNode )

        //单个方向的丢弃扑克精灵父节点
        currentRoundNode.outCardsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.outCardsNode )

        // var outCardSpr = new cc.Sprite('#linebg.png')
        // currentRoundNode.addChild(outCardSpr)  
        // var linebg2 = new cc.Sprite('#linebg2.png')
        // linebg2.x = 20
        // outCardSpr.addChild(linebg2)  
        // var starNum = new ccui.TextAtlas()
        // starNum.setProperty('0', resp.nums4, 25, 33, "0")
        // outCardSpr.addChild( starNum  )
        // currentRoundNode.outCardSpr = outCardSpr
        // currentRoundNode.starNum = starNum

        currentRoundNode.notOutSpr = new cc.Sprite('#empty.png')
        currentRoundNode.addChild( currentRoundNode.notOutSpr)    

        currentRoundNode.scoreChange = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.scoreChange, 1)    

        currentRoundNode.warnNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.warnNode, 1)    

        //最后一个参数决定起始字符ascii值
        currentRoundNode.handCardsNum = new cc.LabelAtlas("", resp.nums1, 16, 23, '0')
        currentRoundNode.handCardsNum.setAnchorPoint(cc.p(0.5, 0))
        currentRoundNode.addChild( currentRoundNode.handCardsNum, 1)    

        currentRoundNode.tipsSpr = new cc.Sprite('#empty.png')
        currentRoundNode.addChild( currentRoundNode.tipsSpr)    

        currentRoundNode.scoreTTF = cc.LabelTTF.create('', "Helvetica", 20)
        currentRoundNode.scoreTTF.setFontFillColor( cc.color(244, 230, 159, 255) )
        currentRoundNode.addChild(currentRoundNode.scoreTTF)  
        currentRoundNode.scoreTTF.anchorY = 0

        ////////////
        var flowerNode = new cc.Node() 
        flowerNode.setVisible(false)
        currentRoundNode.addChild(flowerNode)  
        currentRoundNode.flowerNode = flowerNode

        // //////
        // var flowerSpr1 = new cc.Sprite('#redFlower.png')
        // flowerSpr1.x = -45
        // flowerNode.addChild(flowerSpr1)  
        // var flowerTTF1 = cc.LabelTTF.create('', "Helvetica", 18)
        // flowerTTF1.setFontFillColor( cc.color(244, 230, 159, 255) )
        // flowerTTF1.x = -32
        // flowerTTF1.anchorX = 0
        // flowerNode.addChild(flowerTTF1)  

        // var flowerSpr2 = new cc.Sprite('#redFlower.png')
        // flowerSpr2.x = 25
        // flowerNode.addChild(flowerSpr2)  
        // var flowerTTF2 = cc.LabelTTF.create('', "Helvetica", 18)
        // flowerTTF2.setFontFillColor( cc.color(244, 230, 159, 255) )
        // flowerTTF2.x = 38
        // flowerTTF2.anchorX = 0
        // flowerNode.addChild(flowerTTF2) 

        // currentRoundNode.flowerTTF1 = flowerTTF1
        // currentRoundNode.flowerTTF2 = flowerTTF2


        currentRoundNode.upTTF = cc.LabelTTF.create('', "Helvetica", 16)
        currentRoundNode.upTTF.setFontFillColor( cc.color(242, 226, 142, 255) )
        currentRoundNode.upTTF.enableStroke(cc.color(0, 0, 0, 255), 2)
        currentRoundNode.upTTF.anchorY = 0
        currentRoundNode.addChild( currentRoundNode.upTTF ) 

    },
    clearCurrentRoundNode:function(currentRoundNode)
    {           
        //一轮结束 clearCurrentRoundNode
        currentRoundNode.handCardsNode.removeAllChildren()
        currentRoundNode.outCardsNode.removeAllChildren()
        currentRoundNode.scoreChange.removeAllChildren()
        currentRoundNode.warnNode.removeAllChildren()
        currentRoundNode.handCardsNum.setString('')
        currentRoundNode.tipsSpr.setSpriteFrame('empty.png')
        currentRoundNode.notOutSpr.setSpriteFrame('empty.png')


        currentRoundNode.scoreTTF.setString('')
        currentRoundNode.flowerNode.setVisible(false)
        currentRoundNode.upTTF.setString('')
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
        var direction = cardFactory.showChairId2Direction(showChairId)
        if(direction==0||direction==3)
            sign = -1
        else
            sign = 1

        currentRoundNode.scoreChange.setPosition( cc.p(-50 * sign, 70) )  
        currentRoundNode.warnNode.setPosition( cc.p(-55* sign, 60) )  
        currentRoundNode.handCardsNum.setPosition( cc.p(-84* sign, 60) )    
        currentRoundNode.tipsSpr.setPosition( cc.p(-45 * sign, 0) )
        currentRoundNode.tipsSpr.setAnchorPoint(cc.p((1 + sign)*0.5, 0.5))

        currentRoundNode.notOutSpr.setPosition( cc.p(-45 * sign, 0) )
        currentRoundNode.notOutSpr.setAnchorPoint(cc.p((1 + sign)*0.5, 0.5))

        // currentRoundNode.outCardSpr.setPosition( cc.p(-45 * sign, 0) )
        // currentRoundNode.outCardSpr.setAnchorPoint(cc.p((1 + sign)*0.5, 0.5))

        currentRoundNode.scoreTTF.setPosition( cc.p(0, 65) )  
        currentRoundNode.flowerNode.setPosition( cc.p(0, 75) )  
        currentRoundNode.upTTF.setPositionY(65)

        var chairNode = tableData.getChairWithShowChairId(showChairId).node
        var chairNodeWorldPos = tableNode.uiChair.convertToWorldSpace(chairNode.getPosition())

        var outWidth_rightLeft = cardFactory.right_outWidth*cardFactory.scale_out
        + (cardFactory.outCountOneRow_rightLeft-1)*cardFactory.right_outWidth*cardFactory.outIntervalXScale*cardFactory.scale_out  

        var outHeight_rightLeft = cardFactory.right_outHeight*cardFactory.scale_out
        + (Math.ceil(cardFactory.maxHandCount/cardFactory.outCountOneRow_rightLeft)-1)*cardFactory.right_outHeight*cardFactory.outIntervalYScale*cardFactory.scale_out  
        
        var outWidth_upDown = cardFactory.up_outWidth*cardFactory.scale_out
        + (cardFactory.outCountOneRow_upDown-1)*cardFactory.right_outWidth*cardFactory.outIntervalXScale*cardFactory.scale_out  

        var outHeight_upDown = cardFactory.up_outHeight*cardFactory.scale_out
        + (Math.ceil(cardFactory.maxHandCount/cardFactory.outCountOneRow_upDown)-1)*cardFactory.up_outHeight*cardFactory.outIntervalYScale*cardFactory.scale_out  

        //设置三处四方向的扑克位置 
        if(direction==0)
        {
            //hand
            currentRoundNode.handCardsNode.x = -chairNode.x + playNode.node.width*0.5
            currentRoundNode.handCardsNode.y = -chairNode.y

            //out
            if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_LOOKON)
            {
                currentRoundNode.outCardsNode.x = cardFactory.intervalXChairAndRightOut_const
            }
            else
            {
                currentRoundNode.outCardsNode.x = -chairNode.x 
                + tableNode.chairNode3.x
                + cardFactory.intervalXChairAndRightOut_const
                + outWidth_rightLeft
                + cardFactory.intervalXRightAndDownOut*cardFactory.scale_out
            }

            currentRoundNode.outCardsNode.y = 0

            var pos = cardFactory.getOutCardPosAndTag(MAX_COUNT, 8, direction)
            currentRoundNode.tipsSpr.setPosition( cc.p(currentRoundNode.outCardsNode.x + pos.x - 30, pos.y) )
        }
        else if(direction==2)
        {       
            //out
            currentRoundNode.outCardsNode.x = -chairNode.x 
            + tableNode.chairNode3.x
            + cardFactory.intervalXChairAndRightOut_const
            + outWidth_rightLeft
            + cardFactory.intervalXRightAndDownOut*cardFactory.scale_out

            currentRoundNode.outCardsNode.y = 0
        } 
        else if(direction==1)
        { 
            //out
            currentRoundNode.outCardsNode.x = -cardFactory.intervalXChairAndRightOut_const-outWidth_rightLeft
            currentRoundNode.outCardsNode.y = 0
        }
        else if(direction==3)
        {   
            //out
            currentRoundNode.outCardsNode.x = cardFactory.intervalXChairAndRightOut_const
            currentRoundNode.outCardsNode.y = 0
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
                playNode.hideChooseTypeNode()
            }
        })
        cc.eventManager.addListener(l, 1)
    },
    _initCallBack:function()
    {   
        playNode._initOutCardCall()
        playNode._initCallCall()
    },
    decorateCard:function(cardSpr)
    {
        if( cmdBaseWorker.isMagicCard(cardSpr.cardData, cmdBaseWorker.cbMagicCardData) )
        {
            ///////
            var color_cSpr = cardSpr.getChildByTag(101)
            var numSpr = cardSpr.getChildByTag(102)
            var color_tSpr = cardSpr.getChildByTag(103)

            var num = cardLogic.getNum(cardSpr.cardData)
            if(num<=13)
            {
                color_cSpr.setSpriteFrame('cf_lz_color_c.png')
                numSpr.setSpriteFrame('cf_num_y' + num + '.png')
                color_tSpr.setSpriteFrame('cf_lz_color_t.png')
            }
            else
            {
                color_cSpr.setSpriteFrame('cf_lz_color_c.png')
            }

        }
    },
    ///////////////////////init end///////////////////////

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
        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)
    },
    onCMD_StatusCall:function()
    {
        playNode.refreshCallRecord()

        //统一用sendCardsAction todo
        var outCardDatasArray = []
        var handCardDatasArray = []
        for(var showChairId=0;showChairId<GAME_PLAYER;showChairId++)
        {
            var direction = cardFactory.showChairId2Direction(showChairId)
            outCardDatasArray[direction] = []
            handCardDatasArray[direction] = []
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairId)
            handCardDatasArray[direction] = cmdBaseWorker.cbHandCardData[wChairID]
        }
        playNode.sendCardsAction(handCardDatasArray, outCardDatasArray)

        var callBiggestScore = 0
        for (var i=0;i<GAME_PLAYER;i++)
        {
            if(cmdBaseWorker.cbCallRecord[i] == INVALID_BYTE) continue;
            if(cmdBaseWorker.cbCallRecord[i] > callBiggestScore)
                callBiggestScore = cmdBaseWorker.cbCallRecord[i]
        }
        if(callBiggestScore>0)
            playNode.difenTTF.setString( callBiggestScore   )
        playNode.callEnter(cmdBaseWorker.wCurrentUserCall, callBiggestScore)
    },
    onCMD_StatusPlay:function() 
    {
        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.refreshWinOrder(cmdBaseWorker.wWinOrder)
        playNode.turnDataNode.setVisible(true)
        playNode.refreshPlayerData(cmdBaseWorker.lPlayerData)

        //difen
        var biggestScore = 0
        for(var i=0;i<cmdBaseWorker.cbCallRecord.length;i++)
        {
            if(cmdBaseWorker.cbCallRecord[i] == INVALID_BYTE) continue

            biggestScore = biggestScore<cmdBaseWorker.cbCallRecord[i]?cmdBaseWorker.cbCallRecord[i]:biggestScore
        }

        var bombTimes = 0
        for(var i=0;i<GAME_PLAYER;i++)
        {
            bombTimes += cmdBaseWorker.cbOutBombCount[i]  
        }

        playNode.difenTTF.setString( biggestScore*Math.pow(2,bombTimes) )


        // var idxs = gameLogic.getIdxWithDataAndChangeData(data, chanegData)
        var originCard = cmdBaseWorker.cbOutCardData

        //统一用sendCardsAction todo
        var outCardDatasArray = []
        var handCardDatasArray = []
        for(var showChairId=0;showChairId<GAME_PLAYER;showChairId++)
        {
            var direction = cardFactory.showChairId2Direction(showChairId)
            outCardDatasArray[direction] = []
            handCardDatasArray[direction] = []
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairId)
            if(wChairID == cmdBaseWorker.wOutCardUser)
            {
                outCardDatasArray[direction] = originCard
            }

            handCardDatasArray[direction] = cmdBaseWorker.cbHandCardData[wChairID]
        }
        playNode.sendCardsAction(handCardDatasArray, outCardDatasArray)


        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var user = tableData.getUserWithChairId(wChairID)
            if(!user) continue

            var showChairId = tableData.getShowChairIdWithServerChairId(wChairID)
            var direction = cardFactory.showChairId2Direction(showChairId)
            var outCards = playNode.outCards4D[direction]
            var outCardsNode = user.userNodeInsetChair.currentRoundNode.outCardsNode

            //if(outCards.length>=4 && outCards[0].cardData<78)
            //    cardFactory.decorateOutCardsNode({id:4, length:outCards.length}, playNode.outCards4D, direction, outCardsNode)
            
            if(user.dwUserID != selfdwUserID)
                playNode.setHandCardsNum( user, cmdBaseWorker.cbHandCardCount[wChairID] )
        }

        playNode.outCardEnter(cmdBaseWorker.wCurrentUser) 
        playNode.updatePassFlag()
    },
    onCMD_CallNotify:function()
    {
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
        playNode.node.stopAction(playNode.gameEndAction)
        playNode.resetPlayNode()

        var outCardDatasArray = []
        var handCardDatasArray = []
        for(var showChairId=0;showChairId<GAME_PLAYER;showChairId++)
        {
            var direction = cardFactory.showChairId2Direction(showChairId)
            outCardDatasArray[direction] = []
            handCardDatasArray[direction] = []
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairId)

            handCardDatasArray[direction] = cmdBaseWorker.cbHandCardData[wChairID]
        }
        playNode.sendCardsAction(handCardDatasArray, outCardDatasArray)

        playNode.callEnter(cmdBaseWorker.wCurrentUserCall, 0)
    },
    onCMD_CallResult:function()
    {
        playNode.callExit(cmdBaseWorker.wCallUser, cmdBaseWorker.cbCallRecord[cmdBaseWorker.wCallUser])

        var biggestScore = 0
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if(cmdBaseWorker.cbCallRecord[i] == INVALID_BYTE) continue

            biggestScore = biggestScore<cmdBaseWorker.cbCallRecord[i]?cmdBaseWorker.cbCallRecord[i]:biggestScore
        }

        if(cmdBaseWorker.wCurrentUserCall!=INVALID_WORD)
            playNode.callEnter(cmdBaseWorker.wCurrentUserCall, biggestScore)  
    },
    onCMD_GameStart:function() 
    {
        playNode.hideGameEndNode ? playNode.hideGameEndNode() : ''

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        //统一用sendCardsAction todo
        var outCardDatasArray = []
        var handCardDatasArray = []
        for(var showChairId=0;showChairId<GAME_PLAYER;showChairId++)
        {
            var direction = cardFactory.showChairId2Direction(showChairId)
            outCardDatasArray[direction] = []
            handCardDatasArray[direction] = []
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairId)

            handCardDatasArray[direction] = cmdBaseWorker.cbHandCardData[wChairID]
        }
        playNode.sendCardsAction(handCardDatasArray, outCardDatasArray)

        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            if(cmdBaseWorker.cbHandCardCount[wChairID] == 0)
                continue
            var user = tableData.getUserWithChairId(wChairID)
            if(user.dwUserID != selfdwUserID)
                playNode.setHandCardsNum( user, cmdBaseWorker.cbHandCardCount[wChairID] )
        }

        playNode.outCardEnter(cmdBaseWorker.wCurrentUser) 

        var spr = actionFactory.getSprWithAnimate('start_', true, 0.15)
        spr.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.6) )
        mainScene.uiTop.addChild(spr) 
        managerAudio.playEffect('gameRes/sound/start.mp3')
    },
    onCMD_OutCard:function() 
    {
        playNode.outCardExit()
        playNode.outCardEnter(cmdBaseWorker.wCurrentUser)

        if (cmdBaseWorker.outCardType.cbType == CT_BOMB) 
        {
            var spr = actionFactory.getSprWithAnimate("bomb_", !0, .15);
            spr.setPosition(cc.p(.5 * mainScene.uiTop.getContentSize().width, 0.6 * mainScene.uiTop.getContentSize().height)), 
            mainScene.uiTop.addChild(spr)
        }

        playNode.updatePassFlag()
        playNode.updatePassSound()
    },
    onCMD_PassCard:function() 
    {
        playNode.passCardExit()
        playNode.turnDataNode.setVisible(true)
        playNode.refreshPlayerData(cmdBaseWorker.lPlayerData)

        var isContinuousOut = cmdBaseWorker.wCurrentUser == cmdBaseWorker.wOutCardUser
        if(cmdBaseWorker.cbTurnOver)
        {
            for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
            {
                var user = tableData.getUserWithChairId(wChairID)
                if(!user) continue

                var isUnNeedClear = isContinuousOut && cmdBaseWorker.wCurrentUser == wChairID
                if(!isUnNeedClear)
                {
                    playNode.clearOutCardsNode(wChairID)
                    user.userNodeInsetChair.currentRoundNode.notOutSpr.setSpriteFrame('empty.png')
                }
            }
        }

        playNode.outCardEnter(cmdBaseWorker.wCurrentUser, null, isContinuousOut)
        playNode.updatePassFlag()
        managerAudio.playEffect('gameRes/sound/passCard.mp3')
    },
    onCMD_GameEnd:function() 
    {
        playNode.isLookingResult = true   
        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)

        playNode.hideOutCardNode(true)
        playNode.hideCallNode()

        var userData_gameEnd = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithChairId(i)
            userData_gameEnd[i] = {}

            if(user)
            {
                userData_gameEnd[i].szNickName = user.szNickName
                userData_gameEnd[i].szHeadImageUrlPath = user.szHeadImageUrlPath
                userData_gameEnd[i].lScoreInGame = user.lScoreInGame
            }

            user.userNodeInsetChair.currentRoundNode.handCardsNum.setVisible(true)
            if ( cmdBaseWorker.cbHandCardCount[i] > 0 )
                playNode.outCard_Show(i, cmdBaseWorker.cbHandCardData[i])
        }

        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        if( selfChairId != INVALID_CHAIR && cmdBaseWorker.lGameScore[selfChairId] != 0 )
        {
            var sp = cmdBaseWorker.lGameScore[selfChairId] > 0 ? 'gameEndWin.png' : 'gameEndLose.png'
            playNode.winOrLoseSpr.setSpriteFrame(sp) 
            managerAudio.playEffect(cmdBaseWorker.lGameScore[selfChairId] > 0 ? 'gameRes/sound/win.mp3' : 'gameRes/sound/lost.mp3')
        }

        var wWinChairId = INVALID_WORD
        for ( var i = 0; i < GAME_PLAYER; i++ )
        {
            if ( cmdBaseWorker.cbHandCardCount[i] == 0 )
            {
                wWinChairId = i
                break
            }
        }

        //全封标记
        for(var i=0;i<GAME_PLAYER;i++)
        {       
            if( wWinChairId != INVALID_WORD && cmdBaseWorker.cbHandCardCount[i] == MAX_COUNT )
            {
                playNode.showChunIcon(i)
            }
        }

        playNode.gameEndAction = cc.sequence( 
            cc.delayTime(2), 
            cc.callFunc(function()
            {     
                playNode._showSprsOnGameEnd()
            }), 
            // cc.delayTime(5), //看牌5秒
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
                    if(user.cbUserStatus == US_SIT || user.cbUserStatus == US_LOOKON)//只有坐下未准备的情况 才会resetPlayNode
                    {
                        playNode.resetPlayNode()
                    } 
                }
                playNode.popGameEnd(continueCall, userData_gameEnd) 
            }) 
        )           
        playNode.node.runAction(playNode.gameEndAction)

    },
    ///////////////cmdEvent end//////////


    ////////////sendCardsAction start//////////
    _getHandCardsGroupNode:function()
    {
        var handCards = playNode.handCards4D

        var touchEndCall = function(endCardSpr)
        {
            var cardSprs = playNode.handCards4D[0]
            if(endCardSpr.y == endCardSpr.originY)
            {
                // for(var i=0;i<cardSprs.length;i++)
                // {
                //     var cardSpr = cardSprs[i]
                //     cardSpr.y = cardSpr.originY
                //     cardSpr.color = cardSpr.originColor
                // }
            }
            else
            {
                //autoFill
                var selectCardDatas   = []
                for(var i=0;i<cardSprs.length;i++)
                {
                    var cardSpr = cardSprs[i]
                    if(cardSpr.y != cardSpr.originY)
                        selectCardDatas[selectCardDatas.length] = cardSpr.cardData
                }
                selectCardDatas = cardLogic.sortWithNum(selectCardDatas)

                var needSelectedCardDatas = cardFactory.getNeedSelectedCardDatas_autoFill(playNode.tipsArray, selectCardDatas)
                for(var i=0;i<needSelectedCardDatas.length;i++)
                {
                    for(var ii=0;ii<cardSprs.length;ii++)
                    {
                        var cardSpr = cardSprs[ii]
                        if(cardSpr.y == cardSpr.originY && 
                            cardLogic.getNum(cardSpr.cardData) == cardLogic.getNum(needSelectedCardDatas[i]) )
                        {
                            cardSpr.y = cardSpr.originY + cardFactory.selectCardOffsetY
                            break
                        }
                    }
                }
            }
        }

        var touchEndCalls = []
        if(tableData.getUserWithUserId(selfdwUserID).wChairID == tableData.getServerChairIdWithShowChairId(0))
        {
            touchEndCalls[0] = function(endCardSpr)
            {
                touchEndCall(endCardSpr)
            }
        }

        playNode.handGroupNode4D = cardFactory.getHandGroupNodes(handCards, touchEndCalls)

    },
    sendCardsAction:function(handCardDatasArray, outCardDatasArray)
    {   
// handCardDatasArray = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[],[],[]]
// outCardDatasArray = [
// [1,1,1,1,1,1,1,1,1,1,1,1,1],
// [1,1,1,1,1,1,1,1,1,1,1,1,1],
// [1,1,1,1,1,1,1,1,1,1,1,1,1],
// [1,1,1,1,1,1,1,1,1,1,1,1,1],
// ]
        
        var tempHandCardArray = clone(handCardDatasArray)
        for ( var i = 0; i < tempHandCardArray.length; i++ )
        {
            if( tempHandCardArray[i])
                tempHandCardArray[i].reverse()
        }

        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfShowChairId = tableData.getShowChairIdWithServerChairId(self.wChairID)
        var selfDir = cardFactory.showChairId2Direction(selfShowChairId)

        playNode.handCards4D = cardFactory.getHandCardsArray(tempHandCardArray)
        playNode.outCards4D = cardFactory.getOutCardsArray(outCardDatasArray)
        playNode._getHandCardsGroupNode()

        for(var showChairId=0;showChairId<GAME_PLAYER;showChairId++)
        {
            var direction = cardFactory.showChairId2Direction(showChairId)
            var chairId = tableData.getServerChairIdWithShowChairId(showChairId)
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairId)
            if(!user) continue

            var handCardsNode = user.userNodeInsetChair.currentRoundNode.handCardsNode
            var outCardsNode = user.userNodeInsetChair.currentRoundNode.outCardsNode
            handCardsNode.removeAllChildren()
            outCardsNode.removeAllChildren()

            var outCards = playNode.outCards4D[direction]
            for(var j=0;j<outCards.length;j++)
            {
                var card = outCards[j]
                outCardsNode.addChild(card)
            }

            // if(outCards.length>=4 && outCards[0].cardData<78)
            //     cardFactory.decorateOutCardsNode({id:4, length:outCards.length}, playNode.outCards4D, direction, outCardsNode)
            
            handCardsNode.addChild(playNode.handGroupNode4D[direction])
        }

    },
    ////////////sendCardsAction end//////////


    ////////////gameend start//////////
    _showSprsOnGameEnd:function()
    {
        // var outCardDatasArray = []
        // var handCardDatasArray = []
        // for(var showChairId=0;showChairId<GAME_PLAYER;showChairId++)
        // {
        //     var direction = cardFactory.showChairId2Direction(showChairId)
        //     outCardDatasArray[direction] = []
        //     handCardDatasArray[direction] = []
        //     var wChairID = tableData.getServerChairIdWithShowChairId(showChairId)

        //     var user = tableData.getUserWithChairId(wChairID)
        //     if(!user) continue
        //     user.userNodeInsetChair.currentRoundNode.notOutSpr.setSpriteFrame('empty.png')

        //     user.userNodeInsetChair.currentRoundNode.handCardsNum.setString('')
        //     user.userNodeInsetChair.currentRoundNode.warnNode.removeAllChildren()

        //     var chair = tableData.getChairWithServerChairId(wChairID)
        //     // if(playData.hasGetSendCardsWithdwUserID(user.dwUserID) && tableData.isInTable(user.cbUserStatus))
        //     // if(tableData.isInTable(user.cbUserStatus))
        //     // {   
        //     var score = cmdBaseWorker.lGameScore[wChairID]
        //     var scoreNode = user.userNodeInsetChair.currentRoundNode.scoreChange

        //     var scoreLabel = new ccui.TextAtlas()
        //     scoreLabel.setProperty(Math.abs(score), score>0?resp.nums2:resp.nums3, 22, 33, "0")
        //     scoreNode.addChild(scoreLabel)
            
        //     var sign = score>0?new cc.Sprite('#plus.png'):new cc.Sprite('#minus.png')
        //     sign.setAnchorPoint(cc.p(0,0.5))
        //     scoreNode.addChild(sign)

        //     var signPosx
        //     var swidth = scoreLabel.getContentSize().width + sign.getContentSize().width
        //     if( chairFactory.isRight(chair.node) )
        //     {
        //         signPosx = - swidth
        //     }
        //     else
        //     {   
        //         signPosx = 0 
        //     }
        //     sign.setPositionX(signPosx) 
        //     scoreLabel.setPositionX(signPosx + scoreLabel.getContentSize().width * 0.5 + sign.getContentSize().width)    

        //     if(user.dwUserID == selfdwUserID)
        //     {
        //         if(score!= 0)
        //         {
        //             var sp = score>0?'gameEndWin.png':'gameEndLose.png'
        //             playNode.winOrLoseSpr.setSpriteFrame(sp) 
        //             managerAudio.playEffect(score>0?'gameRes/sound/win.mp3':'gameRes/sound/lost.mp3')
        //         }
        //     }

        //     var cards = cmdBaseWorker.cbHandCardData[wChairID]
        //     if(cards.length>0)
        //     {
        //         outCardDatasArray[direction] = cards
        //         user.userNodeInsetChair.currentRoundNode.tipsSpr.setSpriteFrame('empty.png') 
        //     }
        // }

        // playNode.sendCardsAction(handCardDatasArray, outCardDatasArray)
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
    popGameEnd:function(continueCall, userData_gameEnd)
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
            playNode.hideGameEndNode = null
        }

        playNode.hideGameEndNode = control.continueCall

        var node  = cc.BuilderReader.load(resp.gameEndPopCCB, control)

        var wWinChairId = INVALID_WORD
        for ( var i = 0; i < GAME_PLAYER; i++ )
        {
            if ( cmdBaseWorker.cbHandCardCount[i] == 0 )
            {
                wWinChairId = i
                break
            }
        }

        var hasZha = false
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if ( i == cmdBaseWorker.wExitUser )
            {
                control['winflag'+i].setVisible(true)
                control['winflag'+i].setSpriteFrame('winFlag_6.png') 
            }
            else if( wWinChairId != INVALID_WORD && cmdBaseWorker.cbHandCardCount[i] == MAX_COUNT )
            {
                control['winflag'+i].setVisible(true)
                control['winflag'+i].setSpriteFrame('winFlag_7.png') 
            }
            else
            {
                control['winflag'+i].setVisible(false)
            }
            
            var score = cmdBaseWorker.lGameScore[i]
            control['name'+i].setString(userData_gameEnd[i].szNickName)
            control['banker'+i].setVisible(cmdBaseWorker.wBankerUser == i)
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

            if(cmdBaseWorker.cbOutBombCount[i] > 0)
                hasZha = true
        }

        var bombScore = []
        for( var i = 0; i < GAME_PLAYER; i++ )
        {
            if ( cmdBaseWorker.cbOutBombCount[i] > 0 )
            {   
                bombScore[i] = bombScore[i] || 0
                bombScore[i] += cmdBaseWorker.cbOutBombCount[i] * (GAME_PLAYER - 1) * BOMB_SCORE
                for( var j = 0; j < GAME_PLAYER; j++ )
                {
                    if ( i != j )
                    {
                        bombScore[j] = bombScore[j] || 0    
                        bombScore[j] -= cmdBaseWorker.cbOutBombCount[i] * BOMB_SCORE
                    }
                }
            }
        } 

        for(var i=0;i<GAME_PLAYER;i++)
        {   
            control['bombScoreTTF'+i].setVisible(hasZha)
            if(bombScore[i] >= 0)
            {
                control['bombScoreTTF'+i].setString( '+' + bombScore[i] )
                control['bombScoreTTF'+i].color = cc.color(255, 0 , 0)
            }
            else
            {
                control['bombScoreTTF'+i].setString( bombScore[i] )
                control['bombScoreTTF'+i].color = cc.color(0, 255 , 0)
            }
            control['bombScoreTTF'+i].setPositionX( control['scoreTTF'+i].getContentSize().width + 2)       

            if(cmdBaseWorker.cbOutBombCount[i]>0)
            {
                control['bombNode'+i].setVisible(true)
                control['bombNode'+i].setVisible(true)
                control['bombNode'+i].setPositionX( control['bombScoreTTF'+i].getPositionX() + control['bombScoreTTF'+i].getContentSize().width + 2)
                control['bombNumTTF'+i].setString('X' + cmdBaseWorker.cbOutBombCount[i] + ')') 
                control['win'+i].setPositionX(185)
            }
        }

        control.finishedRoundTTF.setString('当前第 ' + cmdBaseWorker.cbPlayCount + ' 轮')

        node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5) )
        mainScene.top.addChild(node) 
    },
    ///gameend end////


    /////////////outcard begin/////////
    _initOutCardCall:function()
    {   
        playNode.outCardCallOut = function()
        {             
            var selectCardDatas = []
            var cardSprs = playNode.handCards4D[0]
            for(var i=0;i<cardSprs.length;i++)
            {
                var cardSpr = cardSprs[i]
                if(cardSpr.y != cardSpr.originY)
                    selectCardDatas[selectCardDatas.length] = cardSpr.cardData
            }

            playNode._outCardCall1(selectCardDatas)
        }

        playNode.outCardCallPass = function()
        {               
            playNode.hideOutCardNode(true)
            socket.sendMessage(MDM_GF_GAME, SUB_C_PASS_CARD) 
        }

        playNode.outCardCallTips = function()
        {        
            var needSelectedCardDatas = clone(playNode.tipsArray[playNode.outCardButton2.currentTipsIdx])
            var cardSprs = playNode.handCards4D[0] 

            for(var i=0;i<cardSprs.length;i++)
            {
                var cardSpr = cardSprs[i] 
                cardSpr.y = cardSpr.originY

                for(var ii=0;ii<needSelectedCardDatas.length;ii++)
                {
                    if( cardSpr.cardData == needSelectedCardDatas[ii] )
                    {
                        cardSpr.y = cardSpr.originY + cardFactory.selectCardOffsetY
                        needSelectedCardDatas.splice(ii, 1)
                        break
                    }
                }
            }
            playNode.outCardButton2.currentTipsIdx = (playNode.outCardButton2.currentTipsIdx + 1)%playNode.tipsArray.length
        }
    },
    _outCardCall1: function(cards) 
    {
        cards = gameLogic.SortCardList(cards);
        var t = tableData.getUserWithUserId(selfdwUserID).wChairID;
        if (1 == cmdBaseWorker.cbPlayCount && t == cmdBaseWorker.wBankerUser && cmdBaseWorker.cbHandCardCount[t] == MAX_COUNT && cards.indexOf(BLACK_3) == -1) 
        {
            showTips({str: "第一手牌必须带黑桃3"})
            return
        }

        var isAllowOut = true
        if ( t != cmdBaseWorker.wCurrentUser )
            isAllowOut = false
        else if ( gameLogic.GetCardType(cards, cmdBaseWorker.cbHandCardCount[t]).cbType == CT_ERROR )
            isAllowOut = false
        else if ( cmdBaseWorker.wOutCardUser != INVALID_WORD && cmdBaseWorker.wOutCardUser != t && !gameLogic.CompareCard(cards, cmdBaseWorker.cbOutCardData, cmdBaseWorker.cbHandCardCount[t]) )
            isAllowOut = false
        else if ( playNode.FiltrateOutCardArray([cards]) == 0 )
            isAllowOut = false

        if(isAllowOut)
        {
            var OutCard = getObjWithStructName('CMD_C_OutCard')
            cmdBaseWorker.fillCMD_OutCard(OutCard, cards)
            socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
            playNode.hideOutCardNode(true)
        }
        else
        {
            showTips({str:'您的出牌不合理'}) 
            playNode.commonOutCard.setVisible(true)
        }
    },
    clearOutCardsNode:function(chairID)
    {
        var user = tableData.getUserWithChairId(chairID)
        user.userNodeInsetChair.currentRoundNode.outCardsNode.removeAllChildren()

        var showChairId = tableData.getShowChairIdWithServerChairId(chairID)
        var direction = cardFactory.showChairId2Direction(showChairId)

        playNode.outCards4D[direction] = []
    },
    showChunIcon:function(chairID)
    {
        var user = tableData.getUserWithChairId(chairID)
        var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
        tipsSpr.setSpriteFrame('chunIcon.png') 
    },    
    outCardEnter:function(wCurrentUser, time, isContinuousOut)
    {
        if(wCurrentUser == INVALID_WORD) return 
            
        var self = tableData.getUserWithUserId(selfdwUserID)
        if(!isContinuousOut)
        {
            //playNode.clearOutCardsNode(wCurrentUser)
            var user = tableData.getUserWithChairId(wCurrentUser)
            user.userNodeInsetChair.currentRoundNode.notOutSpr.setSpriteFrame('empty.png')
        }

        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, wCurrentUser)
        chairFactory.showFiredCircle.call(user.userNodeInsetChair, time?time:outCardTime)
        
        var iscan = self.wChairID == wCurrentUser
        if(iscan)
        {
            if ( wCurrentUser == cmdBaseWorker.wOutCardUser )
                cocos.setTimeout(function() { playNode.clearOutCardsNode(wCurrentUser) }, 1000)
            else 
                playNode.clearOutCardsNode(wCurrentUser)
            
            var user = tableData.getUserWithChairId(wCurrentUser)
            user.userNodeInsetChair.currentRoundNode.notOutSpr.setSpriteFrame('empty.png')
        }

        playNode.popOutCardNode(iscan)

        if ( wCurrentUser == cmdBaseWorker.wOutCardUser )
            cocos.setTimeout(function() { playNode.startOutCardClock(iscan, time) }, 1000)
        else
            playNode.startOutCardClock(iscan, time)
    },
    passCardExit:function()
    {
        var wPassUser = cmdBaseWorker.wPassCardUser
        if(wPassUser == INVALID_WORD) return 

        var self = tableData.getUserWithUserId(selfdwUserID)
        var isSelfOut = self.wChairID == wPassUser
        var user = tableData.getUserWithChairId(wPassUser)
        if(user)
            chairFactory.hideFiredCircle.call(user.userNodeInsetChair)
        playNode.hideOutCardNode(isSelfOut)
        playNode.stopOutCardClock(isSelfOut)

        playNode.passCard(wPassUser)
    },
    outCardExit:function()
    {
        var wOutCardUser = cmdBaseWorker.wOutCardUser

        if(wOutCardUser == INVALID_WORD) return 

        var self = tableData.getUserWithUserId(selfdwUserID)
        var isSelfOut = self.wChairID == wOutCardUser
        var user = tableData.getUserWithChairId(wOutCardUser)
        if(user)
            chairFactory.hideFiredCircle.call(user.userNodeInsetChair)
        playNode.hideOutCardNode(isSelfOut)
        playNode.stopOutCardClock(isSelfOut)

        playNode.outCard(wOutCardUser, cmdBaseWorker.outCardType) 

        playNode.minusHandCardsNum(user, cmdBaseWorker.cbOutCardData.length)     
    },
    updatePassFlag:function()
    {
        for ( var i = 0; i < GAME_PLAYER; i++ )
        {
            if ( cmdBaseWorker.bPass[i] )
            {
                playNode.passCard(i)
                playNode.clearOutCardsNode(i)
            }
            else
            {
                var user = tableData.getUserWithChairId(i)
                user.userNodeInsetChair.currentRoundNode.notOutSpr.setSpriteFrame('empty.png')
            }
        }
    },
    updatePassSound: function() 
    {
        var passCount = 0
        for (var t = 0; t < GAME_PLAYER; t++) 
        {
            if( cmdBaseWorker.bPass[t])
            {
                cocos.setTimeout(function() { managerAudio.playEffect("gameRes/sound/passCard.mp3") }, 400 * passCount)
                passCount++
            }
        }
    },
    passCard:function(chairID)
    {
        var user = tableData.getUserWithChairId(chairID)
        user.userNodeInsetChair.currentRoundNode.notOutSpr.setSpriteFrame('outSpr_1.png')

        //var chair = tableData.getChairWithServerChairId(chairID)
        // var outCardsNode = user.userNodeInsetChair.currentRoundNode.outCardsNode
        // outCardsNode.removeAllChildren()   

        // var spr = new cc.Sprite('#outSpr_1.png')
        // spr.anchorX = chairFactory.isRight(chair.node)?1:0
        // spr.x = (chairFactory.isRight(chair.node)?-1:1) * 60 

        // var worldPos = chair.node.convertToWorldSpace( cc.p(spr.x, 0) )
        // var posInOutCardsNode = outCardsNode.convertToNodeSpace(worldPos)
        // spr.x = posInOutCardsNode.x
        // spr.y = posInOutCardsNode.y

        // outCardsNode.addChild(spr)

        //managerAudio.playEffect('gameRes/sound/passCard.mp3')

        //playNode.playGenderEffect('buyao' + (Math.ceil(Math.random()*10))%4, user.cbGender)
    },
    outCard:function(cardType)
    {
        playNode.outCard_Show(cmdBaseWorker.wOutCardUser, cmdBaseWorker.cbOutCardData)

        var operateUser = tableData.getUserWithChairId(cmdBaseWorker.wOutCardUser)
        playNode.playCardTypeEffect(cmdBaseWorker.outCardType, operateUser.cbGender)
        managerAudio.playEffect('gameRes/sound/outcard.mp3')
    },
    outCard_Show:function(wOutCardUser, cbOutCardData)
    {
        var originCard = cbOutCardData
        var operateUser = tableData.getUserWithChairId(wOutCardUser)
        var operateShowChairId = tableData.getShowChairIdWithServerChairId(wOutCardUser)
        var operateDir = cardFactory.showChairId2Direction(operateShowChairId)
        var outCardsNode = operateUser.userNodeInsetChair.currentRoundNode.outCardsNode
        var cards2W4D = {
            handCards4D:playNode.handCards4D,
            outCards4D:playNode.outCards4D,
        }

        cardFactory.onActionResult(0, originCard, operateUser, cards2W4D, playNode.handGroupNode4D)
    },
    popOutCardNode: function(isCan) 
    {
        if ( !isCan )
            return 

        playNode.outCardNode.setVisible(true)
        playNode.callNode.setVisible(false)

        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        var handCardDatas = clone(cmdBaseWorker.cbHandCardData[selfChairId])
        var bSelfOut = cmdBaseWorker.wOutCardUser == INVALID_WORD || selfChairId == cmdBaseWorker.wOutCardUser
        var bWarn = cmdBaseWorker.cbHandCardCount[(selfChairId + 1) % GAME_PLAYER] <= WARM_MAX
        var tipsArray = gameLogic.SearchOutCard(handCardDatas, cmdBaseWorker.outCardType, bSelfOut, bWarn)

        tipsArray = playNode.FiltrateOutCardArray(tipsArray)

        playNode.tipsArray = tipsArray
        playNode.outCardButton2.currentTipsIdx = 0

        if ( selfChairId == cmdBaseWorker.wOutCardUser )
            cocos.setTimeout(function() { playNode.commonOutCard.setVisible(true) }, 1000)
        else
            playNode.commonOutCard.setVisible(true)
        
        playNode.outCardButton2.setEnabled(true);

        //自动出牌
        var autoOutCards = []
        if (cmdBaseWorker.cbHandCardCount[selfChairId] < MAX_COUNT) 
        {
            var AnalyzeResult = gameLogic.AnalyzeCard(handCardDatas);
            if ( AnalyzeResult.cbFourCardData.length == 0 && !gameLogic.Has3ABomb(AnalyzeResult.cbThreeCardData) ) //炸弹不自动出
            {
                for ( var i = 0; i < tipsArray.length; i++ )
                {
                    if ( tipsArray[i].length == cmdBaseWorker.cbHandCardCount[selfChairId] ) 
                    {
                        autoOutCards = tipsArray[i]
                        break
                    }
                }

                if ( 0 == autoOutCards.length && cmdBaseWorker.wOutCardUser == selfChairId ) 
                {
                    var cardType = gameLogic.GetCardType(handCardDatas, cmdBaseWorker.cbHandCardCount[selfChairId])
                    if ( cardType.cbType != CT_ERROR )
                        autoOutCards = handCardDatas
                }
            }

            if ( autoOutCards.length > 0 )
            {
                playNode.commonOutCard.setVisible(false)

                var selectCardDatas = []
                var cardSprs = playNode.handCards4D[0] 
                for(var i=0;i<cardSprs.length;i++)
                {
                    var cardSpr = cardSprs[i] 
                    cardSpr.y = cardSpr.originY

                    for(var ii=0;ii<autoOutCards.length;ii++)
                    {
                        if( cardSpr.cardData == autoOutCards[ii] )
                        {
                            selectCardDatas.push(autoOutCards[ii])
                            cardSpr.y = cardSpr.originY + cardFactory.selectCardOffsetY
                            autoOutCards.splice(ii, 1)
                            break
                        }
                    }
                }

                cocos.setTimeout(function() { playNode._outCardCall1(selectCardDatas) }, 1000)
            }
        }
    },
    hideOutCardNode:function(isCan)
    {   
        if(!isCan) return;

        playNode.tipsArray = []
        playNode.commonOutCard.setVisible(false)
        //playNode.notOutCard.setVisible(false)  
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
    stopOutCardClock:function(isCan)
    {
        if(!isCan) return;
        playNode.clockNode.removeAllChildren()
    },

    /////////////outcard end/////////

    
    /////////////call begin/////////
    _initCallCall:function()
    {
        var call = function(cbParam1)
        {
            var CallCard = getObjWithStructName('CMD_C_Call') 
            CallCard.cbCallScore = cbParam1
            socket.sendMessage(MDM_GF_GAME, SUB_C_CALL, CallCard)
            playNode.hideCallNode()

        }
        playNode.callScore1 = function(){ call(1) }
        playNode.callScore2 = function(){ call(2) }
        playNode.callScore3 = function(){ call(3) }
        playNode.callScore0 = function(){ call(0) }
    },
    popCallNode:function(isCan, cbCallScore) // 0 当前0分
    {
        if(!isCan) return;
        playNode.outCardNode.setVisible(false)
        playNode.callNode.setVisible(true)

        playNode.callButton1.setEnabled(cbCallScore<1)
        playNode.callButton2.setEnabled(cbCallScore<2)
        playNode.callButton3.setEnabled(cbCallScore<3)
    },
    callCard:function(callUser, cbCallScore)
    {
        var user = tableData.getUserWithChairId(callUser)
        var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
        tipsSpr.setSpriteFrame('callSpr_'+cbCallScore+'.png') 
        if(cbCallScore>0)
        {
            playNode.difenTTF.setString( cbCallScore   )
        }

        playNode.playGenderEffect('jiaofen'+cbCallScore, user.cbGender)
    },
    clearCallCard:function(userChair)
    {
        var user = tableData.getUserWithChairId(userChair)
        var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
        tipsSpr.setSpriteFrame('empty.png') 
    },
    callExit:function(callUser, cbCallScore)
    {
        var self = tableData.getUserWithUserId(selfdwUserID)
        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, callUser)
        var isSelf = callUser == self.wChairID

        if(user)
            chairFactory.hideFiredCircle.call(user.userNodeInsetChair)
        playNode.hideCallNode()
        playNode.stopCallClock(isSelf)

        playNode.callCard(callUser, cbCallScore)
    },
    callEnter:function(wCurrentUserCall, cbCallScore, time)
    {   
        var self = tableData.getUserWithUserId(selfdwUserID)
        var isSelf = wCurrentUserCall == self.wChairID
        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, wCurrentUserCall)

        chairFactory.showFiredCircle.call(user.userNodeInsetChair, time?time:callTime)

        playNode.startCallClock(isSelf, time)

        playNode.popCallNode(isSelf, cbCallScore)
    },
    hideCallNode:function()
    {
        playNode.callNode.setVisible(false)
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



    /////////////chooseTypeNode start/////////
    hideChooseTypeNode:function()
    {   
        playNode.chooseTypeNode.setVisible(false)
        if(playNode.typeListView)
        {
            playNode.typeListView.removeAllChildren()
            playNode.typeListView = null
        }
    },
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
                playNode.addTypeItem(paramsArray[i]) 
            }(i))
        }
    },
    addTypeItem:function(params) 
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

        listView.pushBackCustomItem(playNode.getChooseTypeItem(listView.width, params ) )
        listView.forceDoLayout()

        listView.setTouchEnabled(listView.getItem(0) && listView.getItem(0).getPositionY()+listView.getItem(0).getContentSize().height>listView.height)
    },
    getChooseTypeItem:function(listViewWidth, params)
    {
        var default_item = new ccui.Layout();
        default_item.setContentSize(listViewWidth-10, 120)
        
        var scrollView = new ccui.ScrollView()
        scrollView.setDirection(ccui.ScrollView.DIR_HORIZONTAL)
        scrollView.setTouchEnabled(true)
        scrollView.setBounceEnabled(true)

        scrollView.setScrollBarEnabled(false)
        scrollView.setContentSize(cc.size(listViewWidth-140, 120))
        scrollView.x = 15
        scrollView.y = 5
        default_item.addChild(scrollView)

        var cards = params.cardDatas
        for(var i=0;i<cards.length;i++)
        {
            var cardData = cards[i]
            var card = cardFactory.getOne(cardData, 1, 0)
            card.setScale(90/card.height)

            card.setPosition(cc.p( (i*0.4+0.5)*card.width*card.scaleX, 55))
            scrollView.addChild(card)
        }

        var scrollViewRect = scrollView.getContentSize()
        var width = ((cards.length-1)*0.4 + 1)*card.width*card.scaleX
        scrollView.setInnerContainerSize(cc.size(width + 10 ,scrollViewRect.height))

        var cardTypeSpr = new cc.Sprite("#" + 'typeName_' + params.name + '.png')
        cardTypeSpr.setPosition(cc.p( 35, 85) )
        default_item.addChild(cardTypeSpr)


        var cardType = params.cardType
        var btn = new ccui.Button(resp.yes, resp.yes)
        btn.setTouchEnabled(true)
        btn.setPosition(cc.p( listViewWidth-65, 60 ))
        btn.addClickEventListener(function(btn) {
            params.sureCall() 
        }.bind(this))
        default_item.addChild(btn)

        return default_item
    },
    /////////////chooseTypeNode end/////////


    ///////////////playEffect start////////
    playCardTypeEffect: function(cardType, isMan) 
    {
        var name = ''
        var logicValue = gameLogic.GetCardNumByLogicValue(cardType.cbLogicValue)

        if ( cardType.cbType == CT_SINGLE )
            name = "danzhang" + logicValue
        else if ( cardType.cbType == CT_DOUBLE )
            name = "duizi" + logicValue
        else if ( cardType.cbType == CT_THREE )
        {
            if (!isMan)
                name = "sange" + logicValue
            else
                name = "sandaier"
        }
        else if ( cardType.cbType == CT_BOMB )
            name = "zhadan"
        else if ( cardType.cbType == CT_THREE_LINE )
            name = "feiji"
        else if ( cardType.cbType == CT_DOUBLE_LINE )
            name = "liandui"
        else if ( cardType.cbType == CT_SINGLE_LINE )
            name = "shunzi"
        else if ( cardType.cbType == CT_BOMB_TAKE )
            name = "sidaisan"

        playNode.playGenderEffect(name, isMan)

        if ( cardType.cbType == CT_BOMB )
            managerAudio.playEffect("gameRes/sound/bomb.mp3")
        else if ( cardType.cbType == CT_THREE_LINE )
            managerAudio.playEffect("gameRes/sound/feijiEffect.mp3")
    },
    playGenderEffect:function(name, isMan)
    {
        var resPrefix = 'gameRes/sound/' + (isOpenPTH?'pth':'fy')
        
        if(isMan)
            managerAudio.playEffect(resPrefix + '/man/' + name + '.mp3')
        else
            managerAudio.playEffect(resPrefix + '/woman/' + name + '.mp3') 
    },
    ///////////////playEffect end////////
    refreshCallRecord:function()
    {
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if(cmdBaseWorker.cbCallRecord[i] == INVALID_BYTE)   continue
            var user = tableData.getUserWithChairId(i)
            var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
            tipsSpr.setSpriteFrame('callSpr_'+cmdBaseWorker.cbCallRecord[i]+'.png') 
        }
    },
    refreshWinOrder:function(wWinOrder)
    {
        // for(var i=0;i<GAME_PLAYER;i++)
        // {
        //     var wChairID = wWinOrder[i]
        //     if(wChairID == INVALID_WORD)
        //         continue
        //     var user = tableData.getUserWithChairId(wChairID)
        //     if(!user) continue
        //     var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
        //     tipsSpr.setSpriteFrame('rankSpr'+i+'.png')  
        // }
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
        if(user.dwUserID == selfdwUserID)
            return;

        var handCardsNum = user.userNodeInsetChair.currentRoundNode.handCardsNum
        handCardsNum.setString(showNum)

        // handCardsNum.setVisible(false)
        if(showNum==0)
        {
            handCardsNum.setVisible(true)
            var warnNode = user.userNodeInsetChair.currentRoundNode.warnNode
            warnNode.removeAllChildren()
        }
        else if(showNum<=WARM_MAX)
        {
            handCardsNum.setVisible(true)
            managerAudio.playEffect('gameRes/sound/warm.mp3')
            playNode.playGenderEffect('baodan1', user.cbGender)
            var spr = actionFactory.getSprWithAnimate('warn_', false, 0.15)
            spr.setAnchorPoint(cc.p(0.5,0))
            var warnNode = user.userNodeInsetChair.currentRoundNode.warnNode
            warnNode.removeAllChildren()
            warnNode.addChild(spr)
        }
        else if(showNum<=MAX_COUNT)
            handCardsNum.setVisible(false)
    },
    refreshPlayerData:function(playerData)
    {
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var user = tableData.getUserWithChairId(wChairID)
            if(!user) continue

            //var score = playerData[wChairID][0]
            // var shangCount = playerData[wChairID][1]

            // user.userNodeInsetChair.currentRoundNode.flowerNode.setVisible(true)
            // user.userNodeInsetChair.currentRoundNode.flowerTTF1.setString('x'+score)
            // user.userNodeInsetChair.currentRoundNode.flowerTTF2.setString('x'+shangCount)
        
            // user.userNodeInsetChair.currentRoundNode.upTTF.setString('分:'+score)
            user.userNodeInsetChair.currentRoundNode.upTTF.setString('')
        }
    },
    getSoundName:function(cardsType)
    {
        var name = cardsType.name
        if(name == 'danzhang') 
            name = name + cardLogic.getNum(cardsType.cardDatas[0])
        else if(name == 'duizi')
            name = name + cardLogic.getNum(cardsType.cardDatas[0])
        else if(name == 'sange')
            name = name + cardLogic.getNum(cardsType.cardDatas[0])
        return name
    },

    ////////////////DiCard end/////////////////
    resetPlayNode:function()
    {
        playNode._removeSprsOnGameEnd()
        playNode.turnDataNode.setVisible(false)

        playNode.difenTTF.setString( 1 )

        for(var i=0;i<GAME_PLAYER;i++)
        {
            tableNode.setBankerIcon(i, false)
        }
        playNode.hideChooseTypeNode()  
    },
    FiltrateOutCardArray: function(weave) 
    {
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        var tempWeave = []
        if (1 == cmdBaseWorker.cbPlayCount && selfChairId == cmdBaseWorker.wBankerUser && cmdBaseWorker.cbHandCardCount[selfChairId] == MAX_COUNT)
        {
            for (var r = 0; r < weave.length; r++) 
            {
                if ( weave[r].indexOf(BLACK_3) != -1 )
                    tempWeave.push(weave[r]);
            }
        }
        else if (cmdBaseWorker.cbHandCardCount[(selfChairId + 1) % GAME_PLAYER] <= WARM_MAX) 
        {
            var maxLogicValue = 0
            for (var r = 0; r < cmdBaseWorker.cbHandCardCount[selfChairId]; r++) 
            {
                var n = gameLogic.GetCardLogicValue(cmdBaseWorker.cbHandCardData[selfChairId][r]);
                if ( n > maxLogicValue )
                    maxLogicValue = n
            }

            for (var r = 0; r < weave.length; r++)
            {
                if ( weave[r].length > 1 || gameLogic.GetCardLogicValue(weave[r][0]) == maxLogicValue )
                    tempWeave.push(weave[r]);
            }
        } 
        else 
        {
            tempWeave = weave;
        }

        return tempWeave
    },
}

cardFactory._gethandGroupNodeListener = function(cards, direction, touchEndCall)
{
    if(direction!=0)//only0 123todo
        return 

    var pos2Idx = function(handGroupNode, posInHandGroupNode)//assert pos不会超出HandGroupNode
    {     
        //自右往左row递增 自下往上line递增
        var row = Math.ceil( (handGroupNode.width-posInHandGroupNode.x-cardFactory.down_handWidth*cardFactory.scale_hand)/
            (handGroupNode.downHandIntervalX*cardFactory.scale_hand) )
        row = row<0?0:row

        var line = ( (posInHandGroupNode.y - cardFactory.down_handHeight*cardFactory.scale_hand)/   
        (cardFactory.down_handHeight*cardFactory.handIntervalYScale*cardFactory.scale_hand) ) 
        line = line<=0?0:Math.ceil(line)

        var idx = row //line*handGroupNode.handCountOneRow + row
        return idx
    }

    //手指移动时 手指按下和手指当前的位置间的扑克牌全都高亮
    var updateCardsOnMove = function(startIdx, endIdx)
    {
        for(var i=0;i<cards.length;i++)
        {
            if( (i>=startIdx && i<=endIdx) || (i<=startIdx && i>=endIdx) )
                cards[i].color = cc.color(144, 144, 144)
            else
                cards[i].color = cards[i].originColor
        }
    }

    //在手指弹起时    手指按下和弹起的位置 这之间的扑克牌全都弹高
    var updateCardsOnEnd = function(startIdx, endIdx)
    {
        for(var i=0;i<cards.length;i++)
        {
            if( startIdx != endIdx && cc.colorEqual(cards[i].color, cards[i].originColor) )
                continue 

            if( (i>=startIdx && i<=endIdx) || (i<=startIdx && i>=endIdx) )
            {
                cards[i].color = cards[i].originColor
                cards[i].y = cards[i].y==cards[i].originY?cards[i].originY + cardFactory.selectCardOffsetY:cards[i].originY
            }
        }
    }

    var updateCardsOnCancel = function()
    {
        for(var i=0;i<cards.length;i++)
        {
            cards[i].y = cards[i].originY
            cards[i].color = cards[i].originColor
        }

        playNode.outCardButton2.currentTipsIdx = 0
    }

    var startIdx;
    var currentIdx;
    var listener = cc.EventListener.create
    ({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function (touch, event) 
        {
            var target = event.getCurrentTarget()

            var locationInNode = target.convertToNodeSpace(touch.getLocation())
            var s = target.getContentSize();
            var rect = cc.rect(0, 0, s.width, s.height)
            if (cc.rectContainsPoint(rect, locationInNode)) 
            {
                var idx = pos2Idx(target, locationInNode)
                if(cards[idx]) 
                {
                    startIdx = idx
                    return true
                }
            }

            updateCardsOnCancel()
            return false
        },
        onTouchMoved: function (touch, event) 
        {
            var target = event.getCurrentTarget()
            var locationInNode = target.convertToNodeSpace(touch.getLocation())
            var s = target.getContentSize();
            var rect = cc.rect(0, 0, s.width, s.height)
            if (cc.rectContainsPoint(rect, locationInNode)) 
            {
                var idx = pos2Idx(target, locationInNode)
                if(cards[idx])
                {
                    if(currentIdx!=idx)
                    {
                        currentIdx = idx
                        updateCardsOnMove(startIdx, currentIdx)
                    }
                }
            }
        },
        onTouchEnded: function (touch, event) 
        {
            var target = event.getCurrentTarget()
            var locationInNode = target.convertToNodeSpace(touch.getLocation())
            var endIdx = pos2Idx(target, locationInNode)
            if(cards[endIdx])
            {
                updateCardsOnEnd(startIdx, endIdx)
        
                if ( cmdBaseWorker.wOutCardUser != INVALID_WORD && cmdBaseWorker.wOutCardUser != tableData.getUserWithUserId(selfdwUserID).wChairID )
                    touchEndCall?touchEndCall(cards[endIdx]):''  

                startIdx = null
                currentIdx = null
                return; 
            }

            updateCardsOnCancel()
            startIdx = null
            currentIdx = null
        }
    })

    return listener
}

cardFactory.getOutCardPosAndTag = function(length, idxInCardDatas, direction)
{
    var outCountOneRow = direction%2==0?cardFactory.outCountOneRow_upDown:cardFactory.outCountOneRow_rightLeft
    
    var row = idxInCardDatas%outCountOneRow
    var line = Math.floor(idxInCardDatas/outCountOneRow) 

    var pos = {}
    //4个方向都遵循 按自上往下自左往右得方向(手牌是自下往上自左往右) outCardDatas数组头摆到数组尾(outCardDatas是按牌型排列)
    switch(direction)
    {
        case 0://down
        {   
            var downOutIntervalX = cardFactory.down_outWidth*cardFactory.outIntervalXScale
            var downOutIntervalY = cardFactory.down_outHeight*cardFactory.outIntervalYScale

            //如果只有一行则居中 
            if(length<=outCountOneRow && tableData.getUserWithUserId(selfdwUserID).cbUserStatus != US_LOOKON)
            {
                var centerX = 0.5*(cardFactory.down_outWidth*cardFactory.scale_out + (outCountOneRow-1)*downOutIntervalX*cardFactory.scale_out)
                pos.x = (row+0.5-length/2)*downOutIntervalX*cardFactory.scale_out + centerX
            }
            else
                pos.x = 0.5*cardFactory.down_outWidth*cardFactory.scale_out + row*downOutIntervalX*cardFactory.scale_out
            pos.y = line*downOutIntervalY*cardFactory.scale_out
            pos.zOrder = -line*100 + row
            break
        }
        case 1://right
        {       
            var rightOutIntervalX = cardFactory.right_outWidth*cardFactory.outIntervalXScale
            var rightOutIntervalY = cardFactory.right_outHeight*cardFactory.outIntervalYScale

            //如果只有一行则靠右 
            if(length<=outCountOneRow)
                pos.x = 0.5*cardFactory.right_outWidth*cardFactory.scale_out + (outCountOneRow-length+row)*rightOutIntervalX*cardFactory.scale_out
            else
                pos.x = 0.5*cardFactory.right_outWidth*cardFactory.scale_out + row*rightOutIntervalX*cardFactory.scale_out
            pos.y =  - line*rightOutIntervalY*cardFactory.scale_out
            pos.zOrder = line*100 + row
            break
        }
        case 2://up
        {
            var upOutIntervalX = cardFactory.up_outWidth*cardFactory.outIntervalXScale
            var upOutIntervalY = cardFactory.up_outHeight*cardFactory.outIntervalYScale

            //如果只有一行则靠右  
            if(length<=outCountOneRow)
                pos.x = 0.5*cardFactory.up_outWidth*cardFactory.scale_out + (outCountOneRow-length+row)*upOutIntervalX*cardFactory.scale_out
            else
                pos.x = 0.5*cardFactory.up_outWidth*cardFactory.scale_out + row*upOutIntervalX*cardFactory.scale_out
            pos.y = - line*upOutIntervalY*cardFactory.scale_out
            
            pos.zOrder = line*100 + row
           break
        }
        case 3://left
        {
            var leftOutIntervalX = cardFactory.left_outWidth*cardFactory.outIntervalXScale
            var leftOutIntervalY = cardFactory.left_outHeight*cardFactory.outIntervalYScale

            pos.x = 0.5*cardFactory.left_outWidth*cardFactory.scale_out + row*leftOutIntervalX*cardFactory.scale_out
            pos.y = - line*leftOutIntervalY*cardFactory.scale_out
            pos.zOrder = line*100 + row
            break
        }
    }
    return pos
}

