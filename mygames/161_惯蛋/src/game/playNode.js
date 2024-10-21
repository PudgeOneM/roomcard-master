
////先理解cardFactory(components/cardFactory/cardFactory)
var callTime = 20
var outCardTime = 20

var playNode = 
{   
    handCards4D:[],//手牌扑克精灵数组 4个方向的
    handGroupNode4D:[],//手牌扑克精灵父节点 4个方向的
    outCards4D:[],//丢弃扑克精灵数组 4个方向的
    tipsArray:[],
    tributeCards4D:[],//上贡扑克数组 4个方向的

    isLookingResult:false,
    gameEndAction:null,
    ///////////////////////init start///////////////////////
    init:function()
    {   
        userSettingPop.itemShowState[2] = false//[true,true,false]//表示玩家设置中的第三个选择功能无效化
        isOpenPTH = 1                           //强制性修改普通话开关，前提是开关无效

        playNode._registEvent()
        playNode._initCallBack()
        var node = managerRes.loadCCB(resp.playCCB, this)
        playNode.animationManager = node.animationManager
        playNode.node  = node

        cardFactory.defaultCardColor = cc.color(255, 255, 255)
        ///
        cardFactory.handCountOneRowMax = MAX_COUNT
        cardFactory.handCountOneRowMin = Math.ceil(cardFactory.handCountOneRowMax*0.6) 
        cardFactory.handGroupNodeHeight = 150
        cardFactory.outCountOneRow_upDown = Math.ceil(cardFactory.handCountOneRowMax*0.5) 
        cardFactory.outCountOneRow_rightLeft = Math.ceil(cardFactory.handCountOneRowMax/3) 
        cardFactory.intervalXRightAndDownOut = 50
        cardFactory.selectCardOffsetY = 10
        cardFactory.handIntervalYScale = 0.45
        cardFactory.outIntervalXScale = 0.36
        cardFactory.outIntervalYScale = 0.45
        //cardFactory.down_handHeight = 260
       // cardFactory.down_handWidth = 200
        

        cardFactory.handGroupNodeWidth = playNode.node.width-20
        cardFactory.init( playNode.decorateCard )

        playNode.adaptUi()
 
 
        //////////
        playNode.turnScore = new ccui.TextAtlas()
        playNode.turnScore.setProperty('0', resp.nums4, 25, 33, "0")
        playNode.turnScore.setAnchorPoint(cc.p(0, 0.5))
        playNode.turnDataNode.addChild( playNode.turnScore  )
    
        playNode.initDiCard()
        playNode.initTurnoverCard()

        
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
        playNode.tributeCards4D = []
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

        //玩家剩余牌数
        var handCardsNumBg = cc.Sprite.create('#cf_left_handBack.png');
        handCardsNumBg.setScale(0.25)
        handCardsNumBg.setVisible(false)
        currentRoundNode.addChild( handCardsNumBg, 1)

        var handSize = handCardsNumBg.getContentSize();
        currentRoundNode.handCardsNum = new cc.LabelAtlas("", resp.nums1, 16, 23, '0')
        currentRoundNode.handCardsNum.setAnchorPoint(cc.p(0.5, 0.5))
        currentRoundNode.handCardsNum.setScale(4)
        currentRoundNode.handCardsNum.setPosition( cc.p( handSize.width/2,handSize.height/2 ) )
        handCardsNumBg.addChild( currentRoundNode.handCardsNum )

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
        currentRoundNode.handCardsNum.getParent().setVisible(false)
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
        currentRoundNode.handCardsNum.getParent().setPosition( cc.p(-84* sign, 60) )    
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
            currentRoundNode.outCardsNode.x = -chairNode.x 
            + tableNode.chairNode3.x
            + cardFactory.intervalXChairAndRightOut_const
            + outWidth_rightLeft
            + cardFactory.intervalXRightAndDownOut*cardFactory.scale_out

            currentRoundNode.outCardsNode.y = 0
        }
        else if(direction==2)
        {       
            //out
            currentRoundNode.outCardsNode.x = -chairNode.x 
            + tableNode.chairNode3.x
            + cardFactory.intervalXChairAndRightOut_const
            + outWidth_rightLeft
            + cardFactory.intervalXRightAndDownOut*cardFactory.scale_out

            currentRoundNode.outCardsNode.y = -20
        } 
        else if(direction==1)
        { 
            //out
            currentRoundNode.outCardsNode.x = -cardFactory.intervalXChairAndRightOut_const-outWidth_rightLeft
            currentRoundNode.outCardsNode.y = -15
        }
        else if(direction==3)
        {   
            //out
            currentRoundNode.outCardsNode.x = cardFactory.intervalXChairAndRightOut_const
            currentRoundNode.outCardsNode.y = -15
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
       


        if(users.length>=GAME_PLAYER)
        {   
            if(tableData.managerUserID == selfdwUserID)
            {
                tableNode.shareButton.setVisible(false);
            }
        } 
        else 
            tableNode.shareButton.setVisible(true);

        if(!playNode.isLookingResult)
        {
            if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT)
                socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
        }

    },
    onCMD_StatusFree:function() 
    {
        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)
        playNode.topNode.setVisible(false)
        topUINode.sortNode.setVisible(false)
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
        
        playNode.callEnter(cmdBaseWorker.wCurrentUserCall, callBiggestScore)
    },
    onCMD_StatusPlay:function() 
    {
        switch( cmdBaseWorker.cbSortType )
        {
            case ST_COUNT:     //数目排序
            {
                topUINode.sortBtnCall(topUINode.btnSort1)
               // topUINode.btnSort1.setVisible(true)
                break;
            }
            case ST_COLOR:     //花色排序
            {
                topUINode.sortBtnCall(topUINode.btnSort2)
               //topUINode.btnSort2.setVisible(true)
                break;
            }
            case ST_TYPE:     //牌型排序
            {
                topUINode.sortBtnCall(topUINode.btnSort3)
               //topUINode.btnSort3.setVisible(true)
                break;
            }
           
        }

        //topUINode.sortNode.setVisible(true)
        playNode.showRoundData()
        playNode.updateDiCard(cmdBaseWorker.cbDiCardData ) 
        //playNode.showTurnoverCard()
        playNode.updateTurnoverCard(cmdBaseWorker.cbTurnoverCardData ) 


        //tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.refreshWinOrder(cmdBaseWorker.wWinOrder)
        playNode.turnDataNode.setVisible(true)
        playNode.turnScore.setString(cmdBaseWorker.lTurnData)
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

        //playNode.difenTTF.setString( biggestScore*Math.pow(2,bombTimes) )


        // var idxs = gameLogic.getIdxWithDataAndChangeData(data, chanegData)
        var originCard = gameLogic.getOriginCard(cmdBaseWorker.cbOutCardData)

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
            
            var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
            if(user.dwUserID != selfdwUserID || selfChairId == INVALID_WORD )
                playNode.setHandCardsNum( user, cmdBaseWorker.cbHandCardCount[wChairID] )
        }

        playNode.outCardEnter(cmdBaseWorker.wCurrentUser) 

      
       
        playNode.resetCardScore();

        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        if ( selfChairId == INVALID_WORD) 
        {
            topUINode.sortNode.setVisible(false)
        }else
        {
             // 上贡
            playNode.setTributeStatus()
            playNode.onCMD_TributeResult()
        }

    },
    onCMD_CallNotify:function()
    {
        //if (cmdBaseWorker.) 
        //{};
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
        if ( cmdBaseWorker.cbChangeChair > 0  ) 
        {
            setTimeout(function()
            {
                var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
                record.szTableKey = tableKey
                socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
            },3000)
            
        };
        for(var i=0;i<GAME_PLAYER;i++)
        {
            playNode.clearCallCard(i)
        }
        
        playNode.showRoundData()
        playNode.updateDiCard(cmdBaseWorker.cbDiCardData ) 
        //playNode.showTurnoverCard()
        playNode.updateTurnoverCard(cmdBaseWorker.cbTurnoverCardData ) 

        //tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
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
        //旁观
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        if ( selfChairId == INVALID_WORD) 
        {
            topUINode.sortNode.setVisible(false)
        }else
        {
            playNode.setTributeStatus()//上贡
        }
        
        //resetScore
        playNode.resetCardScore();
    },
    onCMD_OutCard:function() 
    {

        // playNode.refreshCallRecord()
        playNode.turnDataNode.setVisible(true)
        playNode.turnScore.setString(cmdBaseWorker.lTurnData)
        playNode.refreshPlayerData(cmdBaseWorker.lPlayerData)

        //更新 playData.lastOutCardType

        playNode.outCardExit()
        playNode.outCardEnter(cmdBaseWorker.wCurrentUser)
        
        //addMark
        var nextUser = ( cmdBaseWorker.wOutCardUser+1)%GAME_PLAYER;
        if ( cmdBaseWorker.wCurrentUser != nextUser) 
        {
            playNode.clearOutCardsNode(nextUser)
        };
        ////////
        var cardsType = cmdBaseWorker.outCardType
        if(cardsType.typeLevel>1)
        {
            //add adition
            
            if(isOpenEffect)
            {
                var spr = actionFactory.getSprWithAnimate('bomb_', true, 0.15)
                spr.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.6) )
                mainScene.uiTop.addChild(spr) 
            }
            managerAudio.playEffect('gameRes/sound/bomb.mp3')

           // playNode.difenTTF.setString( parseInt(playNode.difenTTF.getString())*2 )
        }

        playNode.refreshWinOrder(cmdBaseWorker.wWinOrder)

        //出牌后牌型重新排序
        if(cmdBaseWorker.wOutCardUser == tableData.getUserWithUserId(selfdwUserID).wChairID)
            playNode.onCMD_SortCard()
    },
    onCMD_PassCard:function() 
    {
        playNode.passCardExit()
        playNode.turnDataNode.setVisible(true)
        playNode.turnScore.setString(cmdBaseWorker.lTurnData)
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
        //addMark
        var nextUser = ( cmdBaseWorker.wPassCardUser+1)%GAME_PLAYER;
        if ( cmdBaseWorker.wCurrentUser != nextUser ) 
        {
            playNode.clearOutCardsNode(nextUser)
        };
    },
    onCMD_TributeResult:function()
    {
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        if ( selfChairId == INVALID_WORD) 
        {
            return
        }
        
        if (cmdBaseWorker.cbTributeProgress == 9 || cmdBaseWorker.cbTributeProgress == 5) 
        {
            topUINode.sortNode.setVisible(true)
            return;
        };
        var centerX = playNode.node.width/2
        var centerY = playNode.node.height/2
        var markScale = 0.2
       
        if ( cmdBaseWorker.cbTributeProgress == 0 ) 
            return;

        
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        for( var i = 0; i < GAME_PLAYER; i++ )
        {
            if ( cmdBaseWorker.cbTributeProCards[i] == INVALID_BYTE ) continue;
            if ( playNode.tributeCards4D[i]  ) continue;
            
            var showChairId = tableData.getShowChairIdWithServerChairId(i)
            var chairNode = tableData.getChairWithShowChairId(showChairId).node
            var chairNodeWorldPos = tableNode.uiChair.convertToWorldSpace(chairNode.getPosition())
            var user = tableData.getUserWithChairId(i)
            var scalse = 0.4
            gameLog.log('-----创建一张扑克')
            playNode.tributeCards4D[i] = cardFactory.getOne(cmdBaseWorker.cbTributeProCards[i], 0, 0)
            //
            playNode.tributeCards4D[i].setScale(scalse)
            playNode.tributeCards4D[i].x = playNode.tributeCards4D[i].width*scalse+10
            playNode.tributeCards4D[i].y = -10
            chairNode.addChild( playNode.tributeCards4D[i] )
            if ( showChairId == 1 ) 
            {
                playNode.tributeCards4D[i].x = - playNode.tributeCards4D[i].x
            };
            
        }
        if ( cmdBaseWorker.cbTributeProgress == 4 ) 
        {
            //解锁触摸 更新扑克
            topUINode.sortNode.setVisible(true)
            cmdBaseWorker.tributeSelf = 0
            playNode.outCardEnter(cmdBaseWorker.wCurrentUser)
           
            for(var i=0;i<GAME_PLAYER;i++)
            {
               for( var j=0;j<GAME_PLAYER;j++ )
                {
                    if(cmdBaseWorker.cbNewCards[i] == cmdBaseWorker.cbTributeProCards[j] && playNode.tributeCards4D[j] && cmdBaseWorker.cbNewCards[i] != INVALID_BYTE)
                    {
                        cmdBaseWorker.cbNewCards[i] = INVALID_BYTE
                        cmdBaseWorker.cbTributeProCards[j] = INVALID_BYTE
                        var showChairId = tableData.getShowChairIdWithServerChairId(i)
                        var chairNode = tableData.getChairWithShowChairId(showChairId).node
                        var chairNodeWorldPos = chairNode.getPosition()//tableNode.uiChair.convertToWorldSpace(chairNode.getPosition())
                        playNode.tributeCards4D[j].setScale(markScale)
                        playNode.tributeCards4D[j].removeFromParent()
                        playNode.tributeCards4D[j].x = playNode.tributeCards4D[j].width*markScale+10
                        playNode.tributeCards4D[j].y = -10
                        chairNode.addChild(playNode.tributeCards4D[j])
                       // playNode.tributeCards4D[j].setPosition(cc.p( chairNodeWorldPos.x + playNode.tributeCards4D[j].width*markScale+10,chairNodeWorldPos.y -15))
                    }
                }
            }

             //update Card
            var originCard = gameLogic.getOriginCard(cmdBaseWorker.cbOutCardData)
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
        }
        

    },
    onCMD_SortCard:function()
    {

        for( var i=0;i<GAME_PLAYER;i++ )
        {
            var operateUser = tableData.getUserWithChairId(i)
            if(!operateUser) continue;
            var handCardsNum = operateUser.userNodeInsetChair.currentRoundNode.handCardsNum
            
            handCardsNum.setString( cmdBaseWorker.cbHandCardCount[i] )
        }
        var lipaiShow = cmdBaseWorker.cbArrangeCardCount[tableData.getUserWithUserId(selfdwUserID).wChairID] > 0 
        topUINode.btnLiPai.setVisible(!lipaiShow)
        topUINode.btnRevert.setVisible(lipaiShow)
        
        var originCard = gameLogic.getOriginCard(cmdBaseWorker.cbOutCardData)
        var outCardDatasArray = []
        var handCardDatasArray = []
        for(var showChairId=0;showChairId<GAME_PLAYER;showChairId++)
        {
            var direction = cardFactory.showChairId2Direction(showChairId)
            outCardDatasArray[direction] = []
            handCardDatasArray[direction] = []
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairId)
            if(wChairID == cmdBaseWorker.wOutCardUser && !( wChairID ==  tableData.getUserWithUserId(selfdwUserID).wChairID &&  wChairID == cmdBaseWorker.wCurrentUser) )
            {
                outCardDatasArray[direction] = originCard
            }

            handCardDatasArray[direction] = cmdBaseWorker.cbHandCardData[wChairID]
        }

        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfShowChairId = tableData.getShowChairIdWithServerChairId(self.wChairID)
        var selfDir = cardFactory.showChairId2Direction(selfShowChairId)

        playNode.handCards4D = cardFactory.getHandCardsArray(handCardDatasArray)
        playNode.outCards4D = cardFactory.getOutCardsArray(outCardDatasArray)
        playNode._getHandCardsGroupNode()

        for( var i = 0 ; i < playNode.handCards4D[selfShowChairId].length ; i ++ )
        {
            //花色调小 字调大
            var cardNumSp = playNode.handCards4D[selfShowChairId][i].getChildByTag(102)
            var cardFlowerSp = playNode.handCards4D[selfShowChairId][i].getChildByTag(103)
            cardNumSp.setScale(1.1)
            cardFlowerSp.setScale(0.9)
        }
        
        for(var showChairId=0;showChairId<GAME_PLAYER;showChairId++)
        {
            var direction = cardFactory.showChairId2Direction(showChairId)
            var chairId = tableData.getServerChairIdWithShowChairId(showChairId)
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairId)
            if(!user) continue

            var handCardsNode = user.userNodeInsetChair.currentRoundNode.handCardsNode
            handCardsNode.removeAllChildren()
            handCardsNode.addChild(playNode.handGroupNode4D[direction])
        }

        topUINode.btnRevert.setVisible(cmdBaseWorker.cbArrangeCardCount[tableData.getUserWithUserId(selfdwUserID).wChairID]>0)
        for( var i = 0 ; i < playNode.handCards4D[selfShowChairId].length ; i ++ )
        {
            if (i >= playNode.handCards4D[selfShowChairId].length - cmdBaseWorker.cbArrangeCardCount[tableData.getUserWithUserId(selfdwUserID).wChairID]) 
            {
                playNode.handCards4D[selfShowChairId][i].color = cc.color( 144, 144, 144 )
            };
        }
    },
    onCMD_GameEnd:function() 
    {
       
        cardFactory.handCountOneRowMax = MAX_COUNT
       // cardFactory.handGroupNodeHeight = 180

        topUINode.sortNode.setVisible(false)
        playNode.isLookingResult = true   
        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)

      
        playNode.refreshPlayerData(cmdBaseWorker.lPlayerData)
        playNode.refreshWinOrder(cmdBaseWorker.wWinOrder)

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
            }
        }

        playNode.gameEndAction = cc.sequence( 
           // cc.delayTime(2), 
            cc.callFunc(function()
            {     
                playNode._showSprsOnGameEnd()
            }), 
           
            cc.callFunc(function()
            {   
                headIconPop.kickUserOnGameEnd()
                var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
                record.szTableKey = tableKey
                socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
                var continueCall = function()
                {
                    playNode.isLookingResult = false   
                    //var user = tableData.getUserWithUserId(selfdwUserID)
                    //if(user.cbUserStatus == US_SIT)//只有坐下未准备的情况 才会resetPlayNode
                    {
                        playNode.resetPlayNode()
                      
                    } 
                }
                playNode.popGameEnd(continueCall, userData_gameEnd) 
            }) 
        )           
        playNode.node.runAction(playNode.gameEndAction)
        //cardFactory.handCountOneRowMax = 18
       // cardFactory.handGroupNodeHeight = 200
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
                            (cardSpr.cardData) == (needSelectedCardDatas[i]) )
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

        playNode.handGroupNode4D = playNode.getHandGroupNodes(handCards, touchEndCalls)


    },
    //手牌是要处理触摸监听的 GroupNodes是hand麻将的父节点 用于同意处理触摸
    getHandGroupNodes:function(handCards4D, touchEndCalls)
    {
        var handGroupNodes = []
        for(showChairId=0;showChairId<GAME_PLAYER;showChairId++)//direction 0down 1right 2up 3left
        {
            var direction = cardFactory.showChairId2Direction(showChairId)
            var cards = handCards4D[direction]

            //////
            var node = new cc.Node()
            node.ignoreAnchorPointForPosition(false)
            switch(direction) 
            {
                case 0://down
                {
                    node.setAnchorPoint( cc.p(0.5, 0) )
                    break
                }
                case 1://right
                {
                    break
                }
                case 2://up
                {
                    break
                }
                case 3://left
                {
                    break
                }
            }

            var size = cardFactory._getHandGroupNodeSize(cards.length, direction)
            node.width = size.width
            node.height = size.height
            for(var j=0;j<cards.length;j++)
            {
                var card = cards[j]
                node.addChild(card)
            }

            var length = cards.length
            var maxLine = Math.floor((cardFactory.maxHandCount-1)/cardFactory.handCountOneRowMax) 
            var handCountOneRow = 0
            if(length>(maxLine+1)*cardFactory.handCountOneRowMin)
                handCountOneRow = Math.ceil(length/(maxLine+1))
            else
                handCountOneRow = cardFactory.handCountOneRowMin
            var downHandIntervalX = (cardFactory.handGroupNodeWidth - cardFactory.down_handWidth*cardFactory.scale_hand)/(handCountOneRow-1)/cardFactory.scale_hand
            node.handCountOneRow = handCountOneRow
            node.downHandIntervalX = downHandIntervalX

            //////////touch
            var touchEndCall = touchEndCalls[direction]
            if(touchEndCall) 
            {
                var listener = playNode._gethandGroupNodeListener(cards, direction, touchEndCall)
                cc.eventManager.addListener(listener, node)
            }

            handGroupNodes[direction] = node
        }

        return handGroupNodes
    },
    _gethandGroupNodeListener:function(cards, direction, touchEndCall)
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

            var idx = line*handGroupNode.handCountOneRow + row
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

                if (i >= cards.length - cmdBaseWorker.cbArrangeCardCount[tableData.getUserWithUserId(selfdwUserID).wChairID]) 
                {
                   cards[i].color = cc.color( 144, 144, 144 )
                };
            }
        }

        //在手指弹起时    手指按下和弹起的位置 这之间的扑克牌全都弹高
        var updateCardsOnEnd = function(startIdx, endIdx)
        {
            topUINode.btnLiPai.setVisible(true)
            topUINode.btnRevert.setVisible(false)
            for(var i=0;i<cards.length;i++)
            {
                if( (i>=startIdx && i<=endIdx) || (i<=startIdx && i>=endIdx) )
                {
                    cards[i].color = cards[i].originColor
                    cards[i].y = cards[i].y==cards[i].originY?cards[i].originY + cardFactory.selectCardOffsetY:cards[i].originY
                    if (i >= cards.length - cmdBaseWorker.cbArrangeCardCount[tableData.getUserWithUserId(selfdwUserID).wChairID]) 
                    {
                        cards[i].color = cc.color( 144, 144, 144 )
                    };
                }
            }
        }

        var updateCardsOnCancel = function()
        {
            var lipaiShow = cmdBaseWorker.cbArrangeCardCount[tableData.getUserWithUserId(selfdwUserID).wChairID] > 0 
            topUINode.btnRevert.setVisible(lipaiShow)
            topUINode.btnLiPai.setVisible(!lipaiShow)
            for(var i=0;i<cards.length;i++)
            {
                cards[i].y = cards[i].originY
                cards[i].color = cards[i].originColor
                if (i >= cards.length - cmdBaseWorker.cbArrangeCardCount[tableData.getUserWithUserId(selfdwUserID).wChairID]) 
                {
                    cards[i].color = cc.color( 144, 144, 144 )
                };
            }


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
                if (cmdBaseWorker.tributeSelf != 1) 
                    updateCardsOnCancel()
                return false
            },
            onTouchMoved: function (touch, event) 
            {
                if( cmdBaseWorker.tributeSelf == 1  )
                    return true   
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
                topUINode.btnLiPai.setVisible(true)

                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) 
                {
                    var endIdx = pos2Idx(target, locationInNode)
                    if( cmdBaseWorker.tributeSelf == 1 && cards[endIdx].color.b != 255 )
                        return true   

                    if(cards[endIdx])
                    {
                        updateCardsOnEnd(startIdx, endIdx)
                        
                        if ( cmdBaseWorker.tributeSelf > 0 ) 
                        {
                            var selectCardDatas = []
                            var cardSprs = playNode.handCards4D[0]
                            for(var i=0;i<cardSprs.length;i++)
                            {
                                var cardSpr = cardSprs[i]
                                if(cardSpr.y != cardSpr.originY)
                                    selectCardDatas[selectCardDatas.length] = cardSpr.cardData
                            }
                            selectCardDatas = cardLogic.sortWithNum(selectCardDatas)

                            cmdBaseWorker.cbTributeGiveSelectCard = selectCardDatas[0]
                            topUINode.btnTributeBack.setEnabled( selectCardDatas.length == 1 )
                            topUINode.btnTributeGive.setEnabled( selectCardDatas.length == 1 )
                        };
                        //理牌
                        /*{
                            var selectCardDatas = []
                            var cardSprs = playNode.handCards4D[0]
                            for(var i=0;i<cardSprs.length;i++)
                            {
                                var cardSpr = cardSprs[i]
                                if(cardSpr.y != cardSpr.originY)
                                    selectCardDatas[selectCardDatas.length] = cardSpr.cardData
                            }
                            selectCardDatas = cardLogic.sortWithNum(selectCardDatas)

                            cmdBaseWorker.cbTributeGiveSelectCard = selectCardDatas[0]
                            topUINode.btnLiPai.setEnabled( selectCardDatas.length == 1 )
                            topUINode.btnTributeGive.setEnabled( selectCardDatas.length == 1 )

                        }*/

                        touchEndCall?touchEndCall(cards[endIdx]):''  

                        startIdx = null
                        currentIdx = null
                        return; 
                    }
                }

                updateCardsOnCancel()
                startIdx = null
                currentIdx = null
            }
        })

        return listener
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
        
        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfShowChairId = tableData.getShowChairIdWithServerChairId(self.wChairID)
        var selfDir = cardFactory.showChairId2Direction(selfShowChairId)

        topUINode.btnRevert.setVisible(cmdBaseWorker.cbArrangeCardCount[tableData.getUserWithUserId(selfdwUserID).wChairID]>0)
        playNode.handCards4D = cardFactory.getHandCardsArray(handCardDatasArray)
        playNode.outCards4D = cardFactory.getOutCardsArray(outCardDatasArray)
        playNode._getHandCardsGroupNode()
        if (!playNode.handCards4D[selfShowChairId])
            return;
        for( var i = 0 ; i < playNode.handCards4D[selfShowChairId].length ; i ++ )
        {
            //花色调小 字调大
            var cardNumSp = playNode.handCards4D[selfShowChairId][i].getChildByTag(102)
            var cardFlowerSp = playNode.handCards4D[selfShowChairId][i].getChildByTag(103)
            cardNumSp.setScale(1.1)
            cardFlowerSp.setScale(0.9)
            //花色调小 字调大
            if (i >= playNode.handCards4D[selfShowChairId].length - cmdBaseWorker.cbArrangeCardCount[tableData.getUserWithUserId(selfdwUserID).wChairID]) 
            {
                playNode.handCards4D[selfShowChairId][i].color = cc.color( 144, 144, 144 )
            };
        }
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
        //
        for( var i = 0 ; i < GAME_PLAYER;i++ )
        {
            //var user = tableData.getUserWithChairId(i)
            //if(user)
            //    user.userNodeInsetChair.currentRoundNode.outCardsNode.removeAllChildren()

            if (playNode.tributeCards4D[i]) 
            {
                playNode.tributeCards4D[i].removeFromParent();
                playNode.tributeCards4D[i] = null
            };
        }
        //
        var control = {}
        control.continueCall = function()
        {
            continueCall()
            node.removeFromParent()
        }
        var node  = managerRes.loadCCB(resp.gameEndPopCCB, control)

        playNode.gameEndControl = control


        var nongMinChunTian = true
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            if(wChairID==cmdBaseWorker.wBankerUser) continue
            if(cmdBaseWorker.cbOutCardTimes[wChairID]>0)
            {
                nongMinChunTian = false
                break
            }  
        }

        var diZhuChunTian = false
        if(cmdBaseWorker.cbHandCardCount[cmdBaseWorker.wBankerUser]!=0 && 
            cmdBaseWorker.cbOutCardTimes[cmdBaseWorker.wBankerUser]==1)
            diZhuChunTian = true
        
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
            // if(wChairID!=cmdBaseWorker.wBankerUser && nongMinChunTian)
            //    control['winflag'+wChairID].setSpriteFrame('gendFlag2.png') 
            //else if(wChairID==cmdBaseWorker.wBankerUser && diZhuChunTian)
            //    control['winflag'+wChairID].setSpriteFrame('gendFlag2.png') 
            else if(cmdBaseWorker.lGameScore[wChairID]>0)
                control['winflag'+wChairID].setSpriteFrame('gendFlag1.png') 
            else
                control['winflag'+wChairID].setSpriteFrame('empty.png') 
  
            control['fenTTF'+wChairID].setString((cmdBaseWorker.lGameScore[wChairID]>0?'+':'') + cmdBaseWorker.lGameScore[wChairID]) 
           // control['taiTTF'+wChairID].setString(userData_gameEnd[wChairID].lScoreInGame) 


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
            /**/
            /*
              var roundTable = [2,3,4,5,6,7,8,9,10,11,12,13,1];
        
        var mainCard = 2
        if( cmdBaseWorker.cbCurTeam != INVALID_BYTE )
            mainCard = roundTable[cmdBaseWorker.cbTeamProcess[cmdBaseWorker.cbCurTeam]]

        gameLogic.num2Scores  = 
        [
            0,
            12,
            13,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            14,
            15
        ]
        
        var index = 1;
        for( var i = 1;i <= 13;i++ ) //2-K 
        {
            if ( i == mainCard ) 
            {
                gameLogic.num2Scores[mainCard] = 13
            }
            else if(i != mainCard && i==1 )
            {
                gameLogic.num2Scores[i] = 12
            }
            else 
            {
                gameLogic.num2Scores[i] = index
                index++
            }
        }*/
        gameLogic.setCardsScore();
            /**/
            var selectCardDatas = []
            var cardSprs = playNode.handCards4D[0]
            for(var i=0;i<cardSprs.length;i++)
            {
                var cardSpr = cardSprs[i]
                if(cardSpr.y != cardSpr.originY)
                    selectCardDatas[selectCardDatas.length] = cardSpr.cardData
            }
            selectCardDatas = cardLogic.sortWithNum(selectCardDatas)

          

            var cardsTypeArrray = gameLogic.getCardsTypesWithCardDatas( selectCardDatas, cmdBaseWorker.cbMagicCardData ) 

            if(cardsTypeArrray.length>1)
            {
                var paramsArray = []

                for(var i in cardsTypeArrray)
                {   
                    (function(i)
                    {
                        var cardsType = cardsTypeArrray[i]
                        var p = {}
                        p.cardDatas = cardsType.cardDatas
                        p.name = cardsType.name
                        p.sureCall = function()
                        {
                            playNode._outCardCall1(cardsType)
                        }
                        
                        paramsArray[paramsArray.length] = p
                    }(i))
                }
                playNode.popChooseTypeNode(paramsArray)
            }
            else
                playNode._outCardCall1(cardsTypeArrray[0])
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
                    if( (cardSpr.cardData) == (needSelectedCardDatas[ii]) )
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
    _outCardCall1:function(cardsType)
    {

        var test = gameLogic.num2Scores
        var isAllowOut = false
        if(cardsType)
        {
            if(!cmdBaseWorker.outCardType.cardDatas)
                isAllowOut = cardsType.typeLevel > 0
            else
            {
                var cardsType2 = cmdBaseWorker.outCardType
                var c = gameLogic.compareTwoCardsType(cardsType, cardsType2) 
                isAllowOut = c == 0
            }
        }

        if ( cardsType && cardsType && !isAllowOut && cardsType.name == 'tonghuashun'  && cardsType2.name== 'tonghuashun' ) 
        {
            var oldCardColor = gameLogic.getCardsColor( cmdBaseWorker.outCardType.cardDatas )
            var newCardColor = gameLogic.getCardsColor( cardsType.cardDatas )
            if ( cardsType2.typeScores < cardsType.typeScores ) 
            {
                isAllowOut = true;
            }
            else if(cardsType2.typeScores == cardsType.typeScores && ( oldCardColor < newCardColor && cmdBaseWorker.cbTHSCompare == 1 ) )
            {
                isAllowOut = true
            }
        };

        var isSanWang = false
        if(cardsType && cardsType.name == 'duizi' )
        {
            if ( cardsType.cardDatas[0] == 0x4E || cardsType.cardDatas[0] == 0x4F || cardsType.cardDatas[1] == 0x4E || cardsType.cardDatas[1] == 0x4F ) 
            {
                isSanWang = !(cardsType.cardDatas[0] == cardsType.cardDatas[1] )
            };

        }   
        

        isAllowOut = isSanWang?false:isAllowOut;

        if(isAllowOut)
        {
            //加入理牌扑克
            var OutArrangeCard = []
            var cardSprs = playNode.handCards4D[0] 
            for(var i=0;i<cardSprs.length;i++)
            {
                var cardSpr = cardSprs[i] 
                if ( cardSpr.y != cardSpr.originY && cardSpr.color.r == 144 ) 
                {
                    OutArrangeCard[OutArrangeCard.length] = cardSpr.cardData
                };
                
            }
            //

            var OutCard = getObjWithStructName('CMD_C_OutCard')
            cmdBaseWorker.fillCMD_OutCard(OutCard, cardsType,OutArrangeCard)

            socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)

            playNode.hideOutCardNode(true)
        }
        else
        {
            showTips({str:'您的出牌不合理'}) 
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
    outCardEnter:function(wCurrentUser, time, isContinuousOut)
    {
        if(wCurrentUser == INVALID_WORD) return 
            
        var self = tableData.getUserWithUserId(selfdwUserID)
        if(!isContinuousOut)
        {
            playNode.clearOutCardsNode(wCurrentUser)
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
        if(!isSelfOut&&cmdBaseWorker.outCardType.cardDatas)
            playNode.minusHandCardsNum(user, cmdBaseWorker.outCardType.cardDatas.length)
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

        managerAudio.playEffect('gameRes/sound/passCard.mp3')

        //playNode.playGenderEffect('buyao' + (Math.ceil(Math.random()*10))%4, user.cbGender)
    },
    outCard:function(cardType)
    {
        var wOutCardUser = cmdBaseWorker.wOutCardUser
        var originCard = gameLogic.getOriginCard(cmdBaseWorker.cbOutCardData)

        var operateUser = tableData.getUserWithChairId(wOutCardUser)
        var operateShowChairId = tableData.getShowChairIdWithServerChairId(wOutCardUser)
        var operateDir = cardFactory.showChairId2Direction(operateShowChairId)
        var outCardsNode = operateUser.userNodeInsetChair.currentRoundNode.outCardsNode
        var cards2W4D = {
            handCards4D:playNode.handCards4D,
            outCards4D:playNode.outCards4D,
        }

        cardFactory.onActionResult(0, originCard, operateUser, cards2W4D, playNode.handGroupNode4D)

        var user = tableData.getUserWithChairId(wOutCardUser)
        var outCardsNode = user.userNodeInsetChair.currentRoundNode.outCardsNode
        var outCards = playNode.outCards4D[operateDir]
        //if(outCards.length>=4 && outCards[0].cardData<78)
        //    cardFactory.decorateOutCardsNode({id:4, length:outCards.length}, playNode.outCards4D, operateDir, outCardsNode)

        var handCardsNum = operateUser.userNodeInsetChair.currentRoundNode.handCardsNum
        if( operateDir != 0 )
            handCardsNum.getParent().setVisible(true)
        else
            handCardsNum.getParent().setVisible(false)
        if(handCardsNum.getString() != originCard.length)
            playNode.playCardTypeEffect(cmdBaseWorker.outCardType, operateUser.cbGender)
     
        managerAudio.playEffect('gameRes/sound/outcard.mp3')
    },
    popOutCardNode:function(isCan)
    {
        /**/
        var selfChairID = tableData.getUserWithUserId(selfdwUserID).wChairID
        gameLogic.setCardsScore();
        /**/
        if(!isCan) return;
        playNode.outCardNode.setVisible(true)
        playNode.callNode.setVisible(false)
        //上一次没人出牌 或者上一次自己出的牌
        var isFirstOut = !cmdBaseWorker.outCardType.cardDatas

        var handCardDatas = clone(cmdBaseWorker.cbHandCardData[tableData.getUserWithUserId(selfdwUserID).wChairID])
        handCardDatas = cardLogic.sortWithNum(handCardDatas)
        var tipsArray
        if(isFirstOut)
        {
            
            var cardsType = 1
            tipsArray = gameLogic.getTipsArray(cardsType, handCardDatas, cmdBaseWorker.cbMagicCardData)
        }
        else
        {
            var cardsType = cmdBaseWorker.outCardType
            tipsArray = gameLogic.getTipsArray(cardsType, handCardDatas, cmdBaseWorker.cbMagicCardData)
        }

        //
        var handCardDatasTemp = clone(cmdBaseWorker.cbHandCardData[tableData.getUserWithUserId(selfdwUserID).wChairID])
        handCardDatasTemp = cardLogic.sortWithNum(handCardDatasTemp)

        var tipsArrayTemp = gameLogic.getTHuaShunArray( handCardDatasTemp, cmdBaseWorker.cbMagicCardData)
        for( var i = 0 ;i < tipsArrayTemp.length;i++ )
        {
           
            var cardsType2 = cmdBaseWorker.outCardType
            //
            if ( cardLogic.getNum(tipsArrayTemp[i][4]) == 1) 
            {
                var tempCard = tipsArrayTemp[i][0]
                tipsArrayTemp[i][0] = tipsArrayTemp[i][4]
                tipsArrayTemp[i][4] = tempCard
            };
            //

            var cardsType =  gameLogic.getCardsTypesWithCardDatas( tipsArrayTemp[i], cmdBaseWorker.cbMagicCardData ) 
            if(!cardsType2 || !cardsType || !cardsType[0])
            {
                continue
            } 
            var c = gameLogic.compareTwoCardsType(cardsType[0], cardsType2) 
            isAllowOut = c == 0
            if ( cardsType && cardsType[0]  &&  cardsType2  && !isAllowOut && cardsType[0].name == 'tonghuashun'  && cardsType2.name== 'tonghuashun' ) 
            {
                var oldCardColor = gameLogic.getCardsColor( cmdBaseWorker.cbOutCardData )
                var newCardColor = gameLogic.getCardsColor( tipsArrayTemp[i] )
                if ( cardsType2.typeScores < cardsType[0].typeScores ) 
                {
                    isAllowOut = true;
                }
                else if(cardsType2.typeScores == cardsType[0].typeScores && ( oldCardColor < newCardColor && cmdBaseWorker.cbTHSCompare == 1) )
                {
                    isAllowOut = true
                }
            };
            if ( gameLogic.getCardsColor(tipsArrayTemp[i]) != 0xF0 && isAllowOut ) 
            {
                tipsArray[tipsArray.length] = tipsArrayTemp[i];
            };
        }

        //
        if( cmdBaseWorker.outCardType.name == 'duizi' )
        {
            var tempArray = []
            tempArray = tipsArray.slice(0, tipsArray.length)
            tipsArray =  []
            
            for( var i = 0;i<tempArray.length;i++ )
            {
                var array = tempArray[i]
                var isSanWang = false
                if (( array[0] == 0x4E || array[0] == 0x4F || array[1] == 0x4E || array[1] == 0x4F ) &&  array[0]!= array[1] )
                {
                    isSanWang = !(array[0] == array[1] )
                };

                if ( !isSanWang )  //移除
                {
                    tipsArray[tipsArray.length] = array
                };
            }
        }
        //修改1113：炸弹不遵从排序 直接带出所有牌值相同的牌
        var tempArray = []
        tempArray = tipsArray.slice(0, tipsArray.length)
        tipsArray =  []
            
        for( var i = 0;i<tempArray.length;i++ )
        {
            var array = tempArray[i]
            var isXiaoZhaDan = false
            var aType = gameLogic.getCardsType(array)   
            //
            if (aType.name == 'zhadan' ) 
            {
                var card = gameLogic.getCardsRealValue(aType.cardDatas)
                var cardNum = gameLogic.getTypeRealNum(aType.cardDatas)
                var allCardNum = gameLogic.getCardsRealNum( cmdBaseWorker.cbHandCardData[selfChairID] ,card)
                if ( cardNum < allCardNum && cardNum < 8) 
                {
                    isXiaoZhaDan = true
                };
            };

            if ( !isXiaoZhaDan )  //
            {
               tipsArray[tipsArray.length] = array
            };
        }
        //修改1113：炸弹不遵从排序End

        playNode.tipsArray = tipsArray

        playNode.outCardButton2.currentTipsIdx = 0  
        var isAllowPass = cmdBaseWorker.outCardType.cardDatas //&& playNode.tipsArray.length==0  //playData.lastOutCardUser != null && playData.lastOutCardUser!=tableData.getUserWithUserId(selfdwUserID).wChairID
        playNode.outCardButton3.setVisible( isAllowPass )

        var isPopCount = !isAllowPass || playNode.tipsArray.length != 0
       
        playNode.commonOutCard.setVisible(isPopCount)
        gameLog.log('1655出牌按钮设置-----:')
        playNode.notOutCard.setVisible(!isPopCount)
        playNode.outCardButton2.setEnabled(playNode.tipsArray.length>0)
         if (  cmdBaseWorker.cbTributeProgress < 4) 
        {
            playNode.commonOutCard.setVisible(false)
            //关闭时钟
            
        };
        //if(cmdBaseWorker.outCardType.typeLevel == 4)
        //   playNode.outCardCallPass()

        // if(!isPopCount)
        //     playNode.outCardCallPass()
    },
    hideOutCardNode:function(isCan)
    {   
        if(!isCan) return;

        playNode.tipsArray = []
        playNode.commonOutCard.setVisible(false)
        gameLog.log('1671隐藏出牌按钮-----:')
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
        return;
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
           // playNode.difenTTF.setString( cbCallScore   )
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

        var cards = gameLogic.getOriginCard(params.cardDatas)
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
    playCardTypeEffect:function(cardsType, isMan)
    {
        var name
        // if(cardsType.id == 101)
        //     name = cardsType.cardDatas.length==6?'sidaier0':'sidaier1'
        // else
            name = playNode.getSoundName(cardsType)

        if(name=='feiji')
            managerAudio.playEffect('gameRes/sound/feijiEffect.mp3')
        else if(name=='wangzha')
            managerAudio.playEffect('gameRes/sound/wangzhaEffect.mp3')

        name = ( name=='dani'?name+(Math.ceil(Math.random()*10))%3:name )         
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
 
        handCardsNum.getParent().setVisible(tableData.getShowChairIdWithServerChairId(user.wChairID) != 0)
        var originStr = handCardsNum.getString()
        showNum = parseInt(originStr) - outCardCount
        playNode.setHandCardsNum(user, showNum)
    },
    setHandCardsNum:function(user, showNum)
    {

        if ( cmdBaseWorker.cbTributeProgress < 4 ) 
        { 
            showNum = MAX_COUNT;
        };
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        if(user.dwUserID == selfdwUserID && selfChairId != INVALID_WORD ){
            return;
        }

        var handCardsNum = user.userNodeInsetChair.currentRoundNode.handCardsNum
       
        var test1 = tableData.getShowChairIdWithServerChairId(user.wChairID)
        handCardsNum.getParent().setVisible(tableData.getShowChairIdWithServerChairId(user.wChairID) != 0 )
        handCardsNum.setString(showNum)

        
        if(showNum==0)
        {
            handCardsNum.setVisible(true)
            handCardsNum.getParent().setVisible(true)
            var warnNode = user.userNodeInsetChair.currentRoundNode.warnNode
            warnNode.removeAllChildren()
        }
        else if(showNum<=3)
        {
            handCardsNum.setVisible(true)
            handCardsNum.getParent().setVisible(true)
            managerAudio.playEffect('gameRes/sound/warm.mp3')
            if(isOpenEffect)
            {
                var spr = actionFactory.getSprWithAnimate('warn_', false, 0.15)
                spr.setAnchorPoint(cc.p(0.5,0))
                var warnNode = user.userNodeInsetChair.currentRoundNode.warnNode
                warnNode.removeAllChildren()
                warnNode.addChild(spr)
            }
            
        }
        else if(showNum<=MAX_COUNT){
            handCardsNum.setVisible(true)
            handCardsNum.getParent().setVisible(true)
        }
    },
    refreshPlayerData:function(playerData)
    {
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var user = tableData.getUserWithChairId(wChairID)
            if(!user) continue

            var score = playerData[wChairID][0]
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
    ////////////////DiCard start/////////////////
    initDiCard:function() 
    {
        for(var i=0;i<DICARD_COUNT;i++)
        {
            var node = playNode['diCard'+i]
            var card = cardFactory.getOne(0, 1, 0)
            card.scaleX = node.width/card.width
            card.scaleY = node.height/card.height
            card.x = node.width/2
            card.y = node.height/2
            node.addChild(card, 0, 100)
        }
    },
    updateDiCard:function(cbDiCardData)
    {
        for(var i=0;i<DICARD_COUNT;i++)
        {
            var node = playNode['diCard'+i]
            var card = node.getChildByTag(100)
            cardFactory.updateIdxOfCardSpr(card, cbDiCardData[i])  
            cardFactory.decorateCard(card)
        }
    },
    resetCardScore:function()
    {
        var roundTable = [2,3,4,5,6,7,8,9,10,11,12,13,1];
        var mainCard = 2
        if( cmdBaseWorker.cbCurTeam != INVALID_BYTE )
            mainCard = roundTable[cmdBaseWorker.cbTeamProcess[cmdBaseWorker.cbCurTeam]]

        gameLogic.num2Scores  = 
        [
            0,
            12,
            13,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            14,
            15
        ]
        
        var index = 1;
        for( var i = 2;i <= 13;i++ ) //2-K 
        {
            if ( i == mainCard ) 
            {
                gameLogic.num2Scores[mainCard] = 13
            }
            else 
            {
                gameLogic.num2Scores[i] = index
                index++
            }
        }
        
    },
    setTributeStatus:function()
    {
        gameLog.log('开始设置上贡状态-----:')
        if ( cmdBaseWorker.cbTributeProgress == 9 ) 
        {
            if(isOpenEffect)
            {
                var kgSp1 = cc.Sprite.create('#imgKangGong1.png');
                var spr = actionFactory.getSprWithAnimate('imgKangGong', true, 1)
                spr.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.6) )
                mainScene.uiTop.addChild(spr)
            }
            topUINode.sortNode.setVisible(true)
            return
        }else if( cmdBaseWorker.cbTributeProgress == 5 ){
            topUINode.sortNode.setVisible(true)
            return
        }
        //上贡玩家和收贡玩家显示贡牌操作  和 选牌 
        //所有玩家操作后 记录显示贡牌情况到头像框 开始
        var tributeNum = 0;
        var realTributeNum = 0;
        cmdBaseWorker.tributeSelf = 0 ; // 0 不相关 1 上贡 2 收贡
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID

        for( var i = 0 ; i < GAME_PLAYER; i++ )
        {
            if ( cmdBaseWorker.cbTributeGiveCard[i] != INVALID_BYTE && cmdBaseWorker.cbTributeProCards[i] == INVALID_BYTE ) 
            {
                tributeNum++;
                if ( i == selfChairId ) 
                {
                    cmdBaseWorker.tributeSelf = 1;
                };
            };
            if ( cmdBaseWorker.cbTributeGiveCard[i] != INVALID_BYTE ) 
            {
                realTributeNum++;
            };
        }
        

        for( var i = 0; i < GAME_PLAYER;i++ )
        {
            var isWinner = cmdBaseWorker.cbLastResult[i] ==  1 || ( cmdBaseWorker.cbLastResult[i] == INVALID_BYTE && realTributeNum == 2 ) 
            if ( isWinner && i == selfChairId && cmdBaseWorker.cbTributeProCards[i] == INVALID_BYTE ) 
            {
                cmdBaseWorker.tributeSelf = 2;
            };
        }
        cmdBaseWorker.tributeSelf = cmdBaseWorker.cbTributeProgress == 4?0:cmdBaseWorker.tributeSelf
        if( cmdBaseWorker.tributeSelf > 0 ){
            playNode.commonOutCard.setVisible( false )
            gameLog.log('上贡隐藏出牌按钮-----:')
        }
        gameLog.log('--------------------上贡和反贡：' +  cmdBaseWorker.tributeSelf )
        gameLog.log('---------------cbTributeProCards:',cmdBaseWorker.cbTributeProCards[selfChairId] )
        topUINode.tributeSet.setVisible( cmdBaseWorker.tributeSelf > 0 )
        switch(cmdBaseWorker.tributeSelf)
        {
            case 0:     //不相关
            {
                
                break;
            }
            case 1:     //上贡
            {
                var roundTable = [2,3,4,5,6,7,8,9,10,11,12,13,1];
                var mainCard = 2
                if( cmdBaseWorker.cbCurTeam != INVALID_BYTE )
                mainCard = roundTable[cmdBaseWorker.cbTeamProcess[cmdBaseWorker.cbCurTeam]]

                topUINode.btnTributeGive.setVisible( true )
                topUINode.btnTributeBack.setVisible( false )
                topUINode.btnTributeGive.setEnabled( true )
                
                var handCards = playNode.handCards4D[0]
                var maxNum = 0;
                for( var i  = 0 ; i < handCards.length;i++ )
                {
                    var curCard = handCards[i].cardData
                    var maxCard = cmdBaseWorker.cbTributeGiveCard[selfChairId]
                    var curCardValue = gameLogic.getCardValue(curCard) 
                    if( ( playNode.getCardColor( curCard ) != 0x20 || gameLogic.getCardValue(curCard) != mainCard ) && playNode.getCardValue(curCard) == playNode.getCardValue( maxCard )){
                        handCards[i].color = cc.color( 255, 255, 255 )
                        if( maxNum == 0 ){
                            handCards[i].y = handCards[i].y==handCards[i].originY?handCards[i].originY + cardFactory.selectCardOffsetY:handCards[i].originY
                            cmdBaseWorker.cbTributeGiveSelectCard = curCard
                        }
                        maxNum++
                    }
                    else{
                        handCards[i].color = cc.color( 144, 144, 144 )
                       
                    }
                }

                break;
            }
            case 2:     //收贡
            {
                topUINode.btnTributeGive.setVisible( false )
                topUINode.btnTributeBack.setVisible( true  )
                topUINode.btnTributeBack.setEnabled( false )
                break;
            }
        }

    },
    getCardValue:function( cbCardData )
    {
        return  cbCardData & MASK_VALUE;
    },
    getCardColor:function( cbCardData )
    {
        return cbCardData & MASK_COLOR;
    },
    showRoundData:function()
    {
        playNode.topNode.setVisible(true)
        var roundTable = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
        var selfTeamIndex = tableData.getUserWithUserId(selfdwUserID).wChairID%2;
        var enemyTeamIndex = selfTeamIndex == 1 ? 0:1;
        
        playNode.jiFangTTF.setString( roundTable[cmdBaseWorker.cbTeamProcess[selfTeamIndex]])
        playNode.duiFangTTF.setString( roundTable[cmdBaseWorker.cbTeamProcess[enemyTeamIndex]] )
        
        
        var colorSnow = cc.color(255,250,250,255)
        var colorGold = cc.color(255,215,0,255)
        var colorTeam1 = colorSnow
        var colorTeam2 = colorSnow
        if ( cmdBaseWorker.cbCurTeam == selfTeamIndex ) 
        {
            colorTeam1 = colorGold
        }else if ( cmdBaseWorker.cbCurTeam == enemyTeamIndex ) 
            colorTeam2 = colorGold
        playNode.jiFang.setColor( colorTeam1 )
        playNode.jiFangTTF.setColor( colorTeam1 )
        playNode.duiFang.setColor( colorTeam2 )
        playNode.duiFangTTF.setColor( colorTeam2 )

        //上轮结果 
        //cmdBaseWorker.cbLastResult
        //return
        for(var i=0;i<GAME_PLAYER;i++)
        {

            var wChairID = i;

            var tabelId = tableData.getUserWithUserId(selfdwUserID).wTableID
            var user = tableData.getUserWithTableIdAndChairId(tabelId, wChairID)
            if (! user) continue;
            if (! user.userNodeInsetChair)continue;
            if (! user.userNodeInsetChair.dingNode) 
            {
                user.userNodeInsetChair.dingNode = new cc.Node();
                user.userNodeInsetChair.addChild(user.userNodeInsetChair.dingNode);
            };
            user.userNodeInsetChair.bankerNode.setVisible( cmdBaseWorker.cbLastResult[i] != INVALID_BYTE )
            if ( cmdBaseWorker.cbLastResult[i] == INVALID_BYTE ) 
                continue;

            var spriteName = "#lastMark" + cmdBaseWorker.cbLastResult[i] + ".png"
            var fIcon = new cc.Sprite( spriteName )
            user.userNodeInsetChair.bankerNode.addChild(fIcon);
        }

    },
    hideDiCard:function()
    {
        playNode.diCardNode.setVisible(false)
    },

    initTurnoverCard:function() 
    {
        for(var i=0;i<TURNOVER_COUNT_MAGIC;i++)
        {
            var node = playNode['turnoverCard'+i]
            var card = cardFactory.getOne(0, 1, 0)
            card.scaleX = node.width/card.width
            card.scaleY = node.height/card.height
            card.x = node.width/2
            card.y = node.height/2
            node.addChild(card, 0, 100)
        }
    },
    updateTurnoverCard:function(cbTurnoverCardData)
    {
        return;
        for(var i=0;i<TURNOVER_COUNT_MAGIC;i++)
        {
            var node = playNode['turnoverCard'+i]
            var card = node.getChildByTag(100)
            cardFactory.updateIdxOfCardSpr(card, cbTurnoverCardData[i]) 
            cardFactory.decorateCard(card)
        }
    },
    showTurnoverCard:function()
    {
        if(TURNOVER_COUNT_MAGIC>0)
            playNode.turnoverCardNode.setVisible(true)
    },
    hideTurnoverDiCard:function()
    {
        playNode.turnoverCardNode.setVisible(false)
    },

    ////////////////DiCard end/////////////////
    resetPlayNode:function()
    {
        playNode._removeSprsOnGameEnd()
        playNode.turnDataNode.setVisible(false)
        playNode.hideDiCard()
        playNode.hideTurnoverDiCard()


        //for(var i=0;i<GAME_PLAYER;i++)
        //{
        //   tableNode.setBankerIcon(i, false)
        //}
        playNode.hideChooseTypeNode()  
    },
}

