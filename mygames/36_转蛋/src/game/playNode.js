
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
    ArrangeCards:[],
    OutArrangeCardIndexs:[],
    sortCardType:1,
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

        playNode.btnSort1CallBack = function()
        {
            //大小->花色
            playNode.SortCardWithType(2)
        }
        playNode.btnSort2CallBack = function() 
        {
            //花色->牌型
            playNode.SortCardWithType(3)
        }
        playNode.btnSort3CallBack = function() 
        {
            //牌型->大小
            playNode.SortCardWithType(1)
        }
        playNode.btnLiPaiCallBack = function() 
        {
            //理牌
            var upCards = []
            var selfUser = tableData.getUserWithUserId(selfdwUserID)
            var selfShowChairId = tableData.getShowChairIdWithServerChairId(selfUser.wChairID)
            var cardSprs = playNode.handCards4D[selfShowChairId]
            for ( var i = 0; i < cardSprs.length; i++ )
            {
                if ( i >= cardSprs.length - playNode.ArrangeCards.length )
                    continue

                var cardSpr = cardSprs[i]
                if( cardSpr.y != cardSpr.originY )
                    upCards.push(cardSpr.cardData)
            }

            if ( upCards.length == 0 )
                return

            playNode.btnLiPai.setVisible(false)
            playNode.btnRevert.setVisible(true)
            playNode.ArrangeCards = playNode.ArrangeCards.concat(upCards)
            playNode.SortCardWithType(playNode.sortCardType)
        }
        playNode.btnRevertCallBack = function() 
        {
            //恢复
            playNode.btnLiPai.setVisible(true)
            playNode.btnRevert.setVisible(false)

            playNode.ArrangeCards = []
            playNode.SortCardWithType(playNode.sortCardType)
        }
        playNode.btn_tongHuaSsCallBack = function()
        {
            //同花顺
            var selfUser = tableData.getUserWithUserId(selfdwUserID)
            var handCards = clone(cmdBaseWorker.cbHandCardData[selfUser.wChairID])
            var AnalyzeResult = gameLogic.AnalyzeCard(handCards)
            if ( AnalyzeResult.LineFlushWeave.length == 0 )
            {
                showTips({str:'您没有同花顺'}) 
                return
            }

            playNode.btn_tongHuaShun.weaveIndex = playNode.btn_tongHuaShun.weaveIndex || 0
            if ( playNode.btn_tongHuaShun.weaveIndex >= AnalyzeResult.LineFlushWeave.length )
                playNode.btn_tongHuaShun.weaveIndex = 0
            
            playNode.popHandCards(AnalyzeResult.LineFlushWeave[playNode.btn_tongHuaShun.weaveIndex].cards)
            playNode.btn_tongHuaShun.weaveIndex++
        }
    },
    decorateCard:function(cardSpr)
    {
        if( gameLogic.IsMagicCard(cardSpr.cardData) )
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
    
    ///////////////////////sort begin///////////////////////
    //sortType 1-大小; 2-花色; 3-牌型
    SortCardWithType:function(sortType)
    {
        playNode.sortCardType = sortType
        playNode.btnSort1.setVisible(sortType == 1)
        playNode.btnSort2.setVisible(sortType == 2)
        playNode.btnSort3.setVisible(sortType == 3)

        var selfUser = tableData.getUserWithUserId(selfdwUserID)
        var selfChairId = selfUser.wChairID
        var selfShowChairId = tableData.getShowChairIdWithServerChairId(selfChairId)
        var handCards = clone(cmdBaseWorker.cbHandCardData[selfChairId])

        for ( var i = 0; i < playNode.ArrangeCards.length; i++ )
        {
            var index = handCards.indexOf(playNode.ArrangeCards[i])
            if ( index != -1 )
            {
                handCards.splice(index, 1)
            }
            else
            {
                //防多牌
                playNode.ArrangeCards.splice(i, 1)
                i--
            } 
        }

        switch( sortType )
        {
            case 1:
            {
                handCards.sort(function(a,b)
                {
                    var cmpValueA = gameLogic.GetCardLogicValue(a) * 100 + a
                    var cmpValueB = gameLogic.GetCardLogicValue(b) * 100 + b
                    return cmpValueA - cmpValueB
                })
                break
            }
            case 2:
            {
                handCards.sort(function(a,b)
                {
                    var cmpValueA = gameLogic.GetCardColor(a) * 100 + gameLogic.GetCardLogicValue(a)
                    var cmpValueB = gameLogic.GetCardColor(b) * 100 + gameLogic.GetCardLogicValue(b)
                    return cmpValueA - cmpValueB
                })

                break
            }
            case 3:
            {
                var magicCards = gameLogic.GetMagicCards(handCards)
                var tempHandCards = clone(handCards)
                gameLogic.RemoveCard(tempHandCards, magicCards)
                var sameCards = gameLogic.GetSameCards(tempHandCards)
                var getCmpValue = function(cardData)
                {
                    var logicValue = gameLogic.GetCardLogicValue(cardData)
                    var cmpValue = sameCards[logicValue].length * 10000 + logicValue * 100 + cardData
                    if ( (logicValue == WANG_VALUE1 || logicValue == WANG_VALUE2) && sameCards[WANG_VALUE1].length == MAX_SAME_DATA && sameCards[WANG_VALUE2].length == MAX_SAME_DATA )
                        cmpValue += 1000000
                    else if ( gameLogic.IsMagicCard(cardData) )
                        cmpValue += 100000

                    return cmpValue
                }

                handCards.sort(function(a,b)
                {
                    return getCmpValue(a) - getCmpValue(b)
                })
                break
            }
        }

        var handCardDatasArray = []
        for ( var i = 0; i < GAME_PLAYER; i++ )
        {
            var direction = cardFactory.showChairId2Direction(i)
            handCardDatasArray[direction] = []
            var wChairID = tableData.getServerChairIdWithShowChairId(i)

            if ( wChairID == selfChairId )
                handCardDatasArray[direction] = handCards.concat(playNode.ArrangeCards)
            else
                handCardDatasArray[direction] = cmdBaseWorker.cbHandCardData[wChairID]
        }

        playNode.handCards4D = cardFactory.getHandCardsArray(handCardDatasArray)

        for ( var i = 0; i < playNode.ArrangeCards.length; i++ )
        {
            playNode.handCards4D[selfShowChairId][playNode.handCards4D[selfShowChairId].length - 1 - i].color = cc.color( 144, 144, 144 )
        }

        playNode._getHandCardsGroupNode()

        for ( var i = 0; i < GAME_PLAYER; i++ )
        {
            var direction = cardFactory.showChairId2Direction(i)
            var chairId = tableData.getServerChairIdWithShowChairId(i)
            var user = tableData.getUserWithTableIdAndChairId(selfUser.wTableID, chairId)
            if( !user ) 
                continue

            var handCardsNode = user.userNodeInsetChair.currentRoundNode.handCardsNode
            handCardsNode.removeAllChildren()

            handCardsNode.addChild(playNode.handGroupNode4D[direction])
        }
    },
    initSortUi:function()
    {
        var selfUser = tableData.getUserWithUserId(selfdwUserID)
        if ( selfUser.cbUserStatus == US_LOOKON )
            return

        playNode.sortNode.setVisible(true)
        playNode.btnSort1.setVisible(true)
        playNode.btnSort2.setVisible(false)
        playNode.btnSort3.setVisible(false)
        playNode.btnLiPai.setVisible(true)
        playNode.btnRevert.setVisible(false)
        playNode.sortCardType = 1
        playNode.ArrangeCards = []
        playNode.btn_tongHuaShun.weaveIndex = 0
        playNode.OutArrangeCardIndexs = []
    },
    UpdateLiPaiBtn:function()
    {
        var selfUser = tableData.getUserWithUserId(selfdwUserID)
        var selfShowChairId = tableData.getShowChairIdWithServerChairId(selfUser.wChairID)
        var cardSprs = playNode.handCards4D[selfShowChairId]
        var bUp = false
        for ( var i = 0; i < cardSprs.length; i++ )
        {
            var cardSpr = cardSprs[i]
            if( cardSpr.y != cardSpr.originY )
            {
                bUp = true
                break
            }
        }

        playNode.btnLiPai.setVisible(bUp)
        playNode.btnRevert.setVisible(!bUp)
    },
    ///////////////////////sort end///////////////////////

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
        playNode.updateShowChairId2ServerChairIdMap()
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
        //if(callBiggestScore>0)
            //playNode.difenTTF.setString( callBiggestScore   )
        playNode.callEnter(cmdBaseWorker.wCurrentUserCall, callBiggestScore)
    },
    onCMD_StatusPlay:function() 
    {
        playNode.updateShowChairId2ServerChairIdMap()
        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.refreshWinOrder(cmdBaseWorker.wWinOrder)
        playNode.turnDataNode.setVisible(true)
        playNode.refreshPlayerData(cmdBaseWorker.lPlayerData)
        playNode.initSortUi()
        playNode.showFriendCard()

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

        //playNode.difenTTF.setString( biggestScore*Math.pow(2,bombTimes) )


        // var idxs = gameLogic.getIdxWithDataAndChangeData(data, chanegData)
        var cbHandTotalCount = cmdBaseWorker.cbHandCardCount[cmdBaseWorker.wOutCardUser] + cmdBaseWorker.cbOutCardData.length
        originCard = gameLogic.GetCardType(cmdBaseWorker.cbOutCardData, cmdBaseWorker.outCardType.cbType, cbHandTotalCount).cards

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
        playNode.updateShowChairId2ServerChairIdMap()
        playNode.hideGameEndNode ? playNode.hideGameEndNode() : ''
        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.initSortUi()
        playNode.outCardNode.setVisible(false)
        playNode.notOutCard.setVisible(false)

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
            var user = tableData.getUserWithChairId(wChairID)
            playNode.setHandCardsNum( user, cmdBaseWorker.cbHandCardCount[wChairID] )
        }

        playNode.outCardEnter(cmdBaseWorker.wCurrentUser) 
        playNode.showFriendCard()

        var spr = actionFactory.getSprWithAnimate('start_', true, 0.15)
        spr.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.6) )
        mainScene.uiTop.addChild(spr) 
        managerAudio.playEffect('gameRes/sound/start.mp3')
    },
    onCMD_OutCard:function() 
    {
        playNode.outCardExit()
        playNode.outCardEnter(cmdBaseWorker.wCurrentUser)
        playNode.refreshWinOrder(cmdBaseWorker.wWinOrder)

        if ( cmdBaseWorker.outCardType.cbType == CT_BOMB ||
            (typeof(CT_WANG_ZHA) != 'undefined' && cmdBaseWorker.outCardType.cbType == CT_WANG_ZHA) ||
            (typeof(CT_FLUSH_LINE) != 'undefined' && cmdBaseWorker.outCardType.cbType == CT_FLUSH_LINE) )
        {
            var spr = actionFactory.getSprWithAnimate("bomb_", !0, .15);
            spr.setPosition(cc.p(.5 * mainScene.uiTop.getContentSize().width, 0.6 * mainScene.uiTop.getContentSize().height)), 
            mainScene.uiTop.addChild(spr)
        }

        playNode.updatePassFlag()
        //playNode.updatePassSound()
        
        if ( tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wOutCardUser )
        {
            for ( var i = 0; i < playNode.OutArrangeCardIndexs.length; i++ )
            {
                if ( playNode.OutArrangeCardIndexs[i] < playNode.ArrangeCards.length &&
                    cmdBaseWorker.cbOutCardData.indexOf(playNode.ArrangeCards[playNode.OutArrangeCardIndexs[i]]) != -1 )
                {
                    playNode.ArrangeCards[playNode.OutArrangeCardIndexs[i]] = 0
                }
            }

            for ( var i = 0; i < playNode.ArrangeCards.length; i++ )
            {
                if ( playNode.ArrangeCards[i] == 0 )
                {
                    playNode.ArrangeCards.splice(i, 1)
                    i--
                }
            }
            
            playNode.SortCardWithType(playNode.sortCardType)
        }
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
        playNode.sortNode.setVisible(false)
        playNode.stopOutCardClock(true)

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
        // for(var i=0;i<GAME_PLAYER;i++)
        // {       
        //     if( wWinChairId != INVALID_WORD && cmdBaseWorker.cbHandCardCount[i] == MAX_COUNT )
        //     {
        //         playNode.showChunIcon(i)
        //     }
        // }

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
    showFriendCard:function()
    {
        //对家翻牌
        playNode.friendCard.removeAllChildren()
        var friendCard = cardFactory.getOne(cmdBaseWorker.cbFriendCard, 0, 0)
        playNode.friendCard.addChild(friendCard)
        playNode.friendCard.setVisible(true)
    },

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
                selectCardDatas = gameLogic.SortCardList(selectCardDatas)

                var needSelectedCardDatas = cardFactory.getNeedSelectedCardDatas_autoFill(playNode.tipsArray, selectCardDatas)
                playNode.popHandCards(needSelectedCardDatas)
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
        var tempHandCardArray = clone(handCardDatasArray)
        for ( var i = 0; i < tempHandCardArray.length; i++ )
        {
            if( tempHandCardArray[i] )
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
        //
        var control = {}
        control.continueCall = function()
        {
            continueCall()
            node.removeFromParent()
            playNode.hideGameEndNode = null
        }
        playNode.hideGameEndNode = control.continueCall

        var node  = managerRes.loadCCB(resp.gameEndPopCCB, control)

        playNode.gameEndControl = control

        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var gendBar = control['gendBar'+wChairID]
            gendBar.setVisible(true)

            //头像
            var headIcon = new cc.Sprite('#headIcon.png')
            var hnode = getRectNodeWithSpr(headIcon)
            hnode.x = 55
            hnode.y = 50
            var url = userData_gameEnd[wChairID].szHeadImageUrlPath
            if(url)
            { 
                (function(headIcon, url)
                {
                    cc.loader.loadImg(url, {isCrossOrigin : false}, function(err,img){
                            var texture2d = new cc.Texture2D()
                            texture2d.initWithElement(img)
                            texture2d.handleLoadedTexture()

                            var frame = new cc.SpriteFrame(texture2d, cc.rect(0, 0, texture2d.getContentSize().width, texture2d.getContentSize().height))
                            headIcon.setSpriteFrame(frame)
                    })
                }(headIcon, url))
            }

            var userName = getLabel(14, 90, 2)
            userName.setFontFillColor( cc.color(255, 255, 255, 255) )
            userName.x = 0
            userName.y = 52
            userName.setStringNew(userData_gameEnd[wChairID].szNickName)
            hnode.addChild(userName)   

            gendBar.addChild(hnode)

            ///////////
            if(wChairID==cmdBaseWorker.wExitUser)
                control['winflag'+wChairID].setSpriteFrame('gendFlag0.png') 
            else if(cmdBaseWorker.lGameScore[wChairID]>0)
                control['winflag'+wChairID].setSpriteFrame('gendFlag1.png') 
            else
                control['winflag'+wChairID].setSpriteFrame('empty.png') 
  
            control['fenTTF'+wChairID].setString((cmdBaseWorker.lGameScore[wChairID]>0?'+':'') + cmdBaseWorker.lGameScore[wChairID]) 

            var resultTTF = cc.LabelTTF.create('', "Helvetica", 16)
            resultTTF.setFontFillColor( cc.color(244, 230, 159) )
            resultTTF.setString('')
            resultTTF.anchorX = 0
            resultTTF.x = 102
            resultTTF.y = 25
            gendBar.addChild(resultTTF)


            //显示手牌
            var cardsNode = new cc.Node()
            cardsNode.scale = 0.45
            cardsNode.x = 100
            cardsNode.y = gendBar.height/2 + 10
            gendBar.addChild(cardsNode)


            //手牌
            var handCardDatas = cmdBaseWorker.cbHandCardData[wChairID]
            if(handCardDatas.length==0)
            {
                var rank 
                for(var i=0;i<GAME_PLAYER;i++)
                {
                    if(wChairID == cmdBaseWorker.wWinOrder[i])
                    {
                        var tipsSpr = new cc.Sprite('#rankSpr'+i+'.png')
                        tipsSpr.scale = 2
                        tipsSpr.x = 50 * tipsSpr.scale
                        cardsNode.addChild(tipsSpr)
                        break
                    }
                }
            }
            else
            {
                for(var j=0;j<handCardDatas.length;j++)
                {
                    var cardData = handCardDatas[j]
                    var card = cardFactory.getOne(cardData, 0, 0)
                    card.idxInHandCards = j
                    var pos = cardFactory.getHandCardPosAndTag(handCardDatas.length, card.idxInHandCards, 0)
                    card.x = pos.x
                    card.y = 0//pos.y
                    card.setLocalZOrder(pos.zOrder)

                    cardsNode.addChild(card)
                }
            }
        }
       
        mainScene.top.addChild(node)
    },
    ///gameend end////


    /////////////outcard begin/////////
    _initOutCardCall:function()
    {   
        playNode.outCardCallOut = function()
        {             
            playNode.OutArrangeCardIndexs = []
            var selectCardDatas = []
            var cardSprs = playNode.handCards4D[0]
            for(var i=0;i<cardSprs.length;i++)
            {
                var cardSpr = cardSprs[i]
                if(cardSpr.y != cardSpr.originY)
                {
                    selectCardDatas[selectCardDatas.length] = cardSpr.cardData
                    if ( i >= cardSprs.length - playNode.ArrangeCards.length )
                        playNode.OutArrangeCardIndexs.push( i - (cardSprs.length - playNode.ArrangeCards.length) )
                }
            }

            playNode._outCardCall1(selectCardDatas)
        }

        playNode.outCardCallPass = function()
        {               
            playNode.hideOutCardNode(true)
            socket.sendMessage(MDM_GF_GAME, SUB_C_PASS_CARD) 

            if ( playNode.updateCardsOnCancel )
                playNode.updateCardsOnCancel()
        }

        playNode.outCardCallTips = function()
        {        
            playNode.popHandCards(playNode.tipsArray[playNode.outCardButton2.currentTipsIdx])
            playNode.outCardButton2.currentTipsIdx = (playNode.outCardButton2.currentTipsIdx + 1)%playNode.tipsArray.length
        }
    },
    popHandCards:function(cardDatas)
    {
        var cards = clone(cardDatas)
        var cardSprs = playNode.handCards4D[0] 

        for ( var i = 0; i < cardSprs.length; i++ )
        {
            var cardSpr = cardSprs[i] 
            cardSpr.y = cardSpr.originY

            for( var ii = 0; ii < cards.length; ii++ )
            {
                if( cardSpr.cardData == cards[ii] )
                {
                    cardSpr.y = cardSpr.originY + cardFactory.selectCardOffsetY
                    cards.splice(ii, 1)
                    break
                }
            }
        }

        playNode.UpdateLiPaiBtn()
    },
    _outCardCall1: function(cards) 
    {
        cards = gameLogic.SortCardList(cards);
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID;

        var isAllowOut = true
        if ( selfChairId != cmdBaseWorker.wCurrentUser )
            isAllowOut = false
        else 
        {
            var isNotSelfOut = cmdBaseWorker.wOutCardUser != INVALID_WORD && cmdBaseWorker.wOutCardUser != selfChairId
            var lastOutType = isNotSelfOut ? cmdBaseWorker.outCardType.cbType : CT_ERROR
            if ( gameLogic.GetCardType(cards, lastOutType, cmdBaseWorker.cbHandCardCount[selfChairId]).cbType == CT_ERROR )
                isAllowOut = false
            else if ( cmdBaseWorker.outCardType.cbType != CT_ERROR && isNotSelfOut && !gameLogic.CompareCard(cards, cmdBaseWorker.cbHandCardCount[selfChairId], cmdBaseWorker.outCardType) )
                isAllowOut = false
        }

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
        if(wCurrentUser == INVALID_WORD) 
            return 
            
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

        playNode.outCard(cmdBaseWorker.outCardType) 

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
        var cbHandTotalCount = cmdBaseWorker.cbHandCardCount[cmdBaseWorker.wOutCardUser] + cmdBaseWorker.cbOutCardData.length
        var tempOutCards = gameLogic.GetCardType(cmdBaseWorker.cbOutCardData, cardType.cbType, cbHandTotalCount).cards

        playNode.outCard_Show(cmdBaseWorker.wOutCardUser, tempOutCards)

        var operateUser = tableData.getUserWithChairId(cmdBaseWorker.wOutCardUser)
        playNode.playCardTypeEffect(cmdBaseWorker.outCardType, operateUser.cbGender, cmdBaseWorker.cbOutCardData)
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
        var bSelfOut = cmdBaseWorker.outCardType.cbType == CT_ERROR || cmdBaseWorker.wOutCardUser == INVALID_WORD || selfChairId == cmdBaseWorker.wOutCardUser
        var tipsArray = gameLogic.SearchOutCard(handCardDatas, cmdBaseWorker.outCardType, bSelfOut)

        playNode.tipsArray = tipsArray
        playNode.outCardButton2.currentTipsIdx = 0

        playNode.notOutCard.setVisible(playNode.tipsArray.length == 0)
        playNode.commonOutCard.setVisible(playNode.tipsArray.length > 0)
        playNode.outCardButton3.setVisible(!bSelfOut)

        //自动出牌
        // var autoOutCards = []
        // if (cmdBaseWorker.cbHandCardCount[selfChairId] < MAX_COUNT) 
        // {
        //     var AnalyzeResult = gameLogic.AnalyzeCard(handCardDatas);
        //     if ( AnalyzeResult.BombWeave.length == 0 && AnalyzeResult.LineFlushWeave.length == 0 && AnalyzeResult.WangZhaWeave.length == 0 ) //炸弹不自动出
        //     {
        //         for ( var i = 0; i < tipsArray.length; i++ )
        //         {
        //             if ( tipsArray[i].length == cmdBaseWorker.cbHandCardCount[selfChairId] ) 
        //             {
        //                 autoOutCards = tipsArray[i]
        //                 break
        //             }
        //         }

        //         if ( 0 == autoOutCards.length && cmdBaseWorker.wOutCardUser == selfChairId ) 
        //         {
        //             var cardType = gameLogic.GetCardType(handCardDatas, CT_ERROR, cmdBaseWorker.cbHandCardCount[selfChairId])
        //             if ( cardType.cbType != CT_ERROR )
        //                 autoOutCards = handCardDatas
        //         }
        //     }

        //     if ( autoOutCards.length > 0 )
        //     {
        //         playNode.commonOutCard.setVisible(false)
        //         playNode.popHandCards(autoOutCards)

        //         cocos.setTimeout(function() { playNode._outCardCall1(autoOutCards) }, 1000)
        //     }
        // }
    },
    hideOutCardNode:function(isCan)
    {   
        if(!isCan) return;

        playNode.tipsArray = []
        playNode.commonOutCard.setVisible(false)
        playNode.notOutCard.setVisible(false)  
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
        //if(cbCallScore>0)
        //{
            //playNode.difenTTF.setString( cbCallScore   )
        //}

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
    playCardTypeEffect: function(cardType, isMan, outCards) 
    {
        var name = ''
        var logicValue = gameLogic.GetCardNumByLogicValue(cardType.cbLogicValue % 100)

        if ( cardType.cbType == CT_SINGLE )
            name = "danzhang" + logicValue
        else if ( cardType.cbType == CT_PAIR )
            name = "duizi" + logicValue
        else if ( cardType.cbType == CT_THREE )
            name = outCards.length == 3 ? ("sange" + logicValue) : "sandaiyidui"
        else if ( cardType.cbType == CT_BOMB )
            name = "zhadan"
        else if ( cardType.cbType == CT_THREE_LINE )
            name = "feiji"
        else if ( cardType.cbType == CT_PAIR_LINE )
            name = "liandui"
        else if ( cardType.cbType == CT_LINE )
            name = "shunzi"
        else if ( typeof(CT_BOMB_TAKE) != 'undefined' && cardType.cbType == CT_BOMB_TAKE )
            name = "sidaisan"
        else if ( typeof(CT_WANG_ZHA) != 'undefined' && cardType.cbType == CT_WANG_ZHA )
            name = "wangzha"
        else if ( typeof(CT_FLUSH_LINE) != 'undefined' && cardType.cbType == CT_FLUSH_LINE )
            name = "tonghuashun"

        playNode.playGenderEffect(name, isMan)

        if ( cardType.cbType == CT_BOMB || 
            (typeof(CT_FLUSH_LINE) != 'undefined' && cardType.cbType == CT_FLUSH_LINE) ||
            (typeof(CT_WANG_ZHA) != 'undefined' && cardType.cbType == CT_WANG_ZHA) )
        {
            managerAudio.playEffect("gameRes/sound/bomb.mp3")
        }

        if ( cardType.cbType == CT_THREE_LINE )
            managerAudio.playEffect("gameRes/sound/feijiEffect.mp3")
        else if ( typeof(CT_WANG_ZHA) != 'undefined' && cardType.cbType == CT_WANG_ZHA )
            managerAudio.playEffect("gameRes/sound/wangzhaEffect.mp3")
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
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var wChairID = wWinOrder[i]
            if(wChairID == INVALID_WORD)
                continue
            var user = tableData.getUserWithChairId(wChairID)
            if(!user) continue
            var tipsSpr = user.userNodeInsetChair.currentRoundNode.tipsSpr
            tipsSpr.setSpriteFrame('rankSpr'+i+'.png')  
        }
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
            //handCardsNum.setVisible(true)
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
        //else if(showNum<=MAX_COUNT)
            //handCardsNum.setVisible(false)
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

    ////////////////DiCard end/////////////////
    resetPlayNode:function()
    {
        playNode._removeSprsOnGameEnd()
        playNode.turnDataNode.setVisible(false)
        playNode.friendCard.setVisible(false)

        //playNode.difenTTF.setString( 1 )

        for(var i=0;i<GAME_PLAYER;i++)
        {
            tableNode.setBankerIcon(i, false)
        }
        playNode.hideChooseTypeNode()  
    },
    updateShowChairId2ServerChairIdMap:function()
    {
        tableData.updateShowChairId2ServerChairIdMap()
        tableNode._onSelfSitChair()
    },
}

tableData.updateShowChairId2ServerChairIdMap = function(touchedShowChairId)
{
    var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
    var selfOrder = cmdBaseWorker.wOutOrder.indexOf(selfChairId)
    if ( selfOrder == -1 )
        selfOrder = 0

    for( var i = 0; i < GAME_PLAYER; i++ )
    {   
        tableData.showChairId2ServerChairIdMap[i] = cmdBaseWorker.wOutOrder[(selfOrder + i) % GAME_PLAYER]
    }
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
            if ( i >= cards.length - playNode.ArrangeCards.length )
                continue

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
                if ( i < cards.length - playNode.ArrangeCards.length )
                    cards[i].color = cards[i].originColor

                cards[i].y = cards[i].y==cards[i].originY?cards[i].originY + cardFactory.selectCardOffsetY:cards[i].originY
            }
        }

        playNode.UpdateLiPaiBtn()
    }

    var updateCardsOnCancel = function()
    {
        for(var i=0;i<cards.length;i++)
        {
            cards[i].y = cards[i].originY

            if ( i < cards.length - playNode.ArrangeCards.length )
                cards[i].color = cards[i].originColor
        }

        playNode.outCardButton2.currentTipsIdx = 0
        playNode.btn_tongHuaShun.weaveIndex = 0
        playNode.UpdateLiPaiBtn()
    }
    playNode.updateCardsOnCancel = updateCardsOnCancel

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
        
                //if ( cmdBaseWorker.wOutCardUser != INVALID_WORD && cmdBaseWorker.wOutCardUser != tableData.getUserWithUserId(selfdwUserID).wChairID )
                    //touchEndCall?touchEndCall(cards[endIdx]):''  

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

