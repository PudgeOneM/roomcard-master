
////先理解majiangFactory(components/majiangFactory/majiangFactory)
var playNode = 
{   
    handMajiangs4D:[],//手牌麻将精灵数组 4个方向的
    handGroupNode4D:[],//手牌麻将精灵父节点 4个方向的
    discardMajiangs4D:[],//丢弃麻将精灵数组 4个方向的
    weaveMajiangs4D:[],//吃碰杠麻将精灵数组 4个方向的
    heapMajiangs4D:[],
    flowerMajiangs4D:[],
    isLookingResult:false,

    gameEndAction:null,
    isInChooseTingCardTime:false,

    chooseActionsNode:null,//用于操作 吃和杠会出现多种情况
    // currentDiscardMjNode:null,
    chooseItemMjScale:0.7,
    chooseItemMjWidth:62,

    currentDiscardMjScale:1.1,
    ///////////////////////init start///////////////////////
    init:function()
    {   
        playNode._registEvent()
        playNode._initCallBack()
        var node = managerRes.loadCCB(resp.playCCB, this)

        playNode.animationManager = node.animationManager
        playNode.node  = node
        playNode._bindListener()

        playNode.scoreTTF = tableNode.scoreTTF
        playNode.laiziNode = tableNode.laiziNode
        playNode.mjsNode = tableNode.mjsNode


        
        playNode.gamesetNode.setVisible(false)
        // playNode.tingHuCardNode.setVisible(false)

        majiangFactory.getHeapCardDatasArray = playNode.getHeapCardDatasArray
        // majiangFactory.weaveItem2Majiangs = playNode.weaveItem2Majiangs
        majiangFactory.isShowHeap = true
        majiangFactory.isPublicAnGang = true
        majiangFactory.init(playNode.decorateMj)

        /////chooseActionsNode
        playNode.chooseActionsNode = new cc.Node()
        playNode.chooseActionsNode.x = playNode.actionNode.width*0.5
        playNode.chooseActionsNode.y = 200

        playNode.actionNode.addChild(playNode.chooseActionsNode)

        /////currentDiscardMjNode
        var currentDiscardMjNode = new cc.Node()
        var bg = new cc.Sprite('#mf_currentDiscardMjBg.png')
        currentDiscardMjNode.addChild(bg)

        var where = {}
        where.name = 'hand'
        where.data = {idx:0}
        var mj = majiangFactory.getOne(1, 0, where)
        mj.x = 0
        mj.y = 0
        mj.isIgnoreDecorate = true
        currentDiscardMjNode.addChild(mj, 0, 101)

        currentDiscardMjNode.x = -1000
        currentDiscardMjNode.setVisible(false)
        playNode.actionNode.addChild(currentDiscardMjNode)
        
        playNode.currentDiscardMjNode = currentDiscardMjNode

        playNode.adaptUi()

        // playNode.timer = majiangTimer4D.getTimer()
        // playNode.timerNode.addChild(playNode.timer)
        // playNode.timerNode.setContentSize(playNode.timer.width, playNode.timer.height)
        // playNode.timerNode.setScale( 0.9 )

// var userData_gameEnd = []
// for(var i=0;i<SERVER_CHAIR;i++)
// {
//     var user = tableData.getUserWithUserId(selfdwUserID)
//     userData_gameEnd[i] = {}

//     if(user)
//     {
//         userData_gameEnd[i].szNickName = user.szNickName
//         userData_gameEnd[i].szHeadImageUrlPath = user.szHeadImageUrlPath
//         userData_gameEnd[i].lScoreInGame = user.lScoreInGame
//     }
// }
// var continueCall = function(){}
//     playNode.popGameEnd(continueCall, userData_gameEnd)

      // var UpdateLocation = getObjWithStructName('CMD_GR_UpdateLocation')
      // UpdateLocation.dwUserID = selfdwUserID
      // UpdateLocation.szLatitude = '116.39622'
      // UpdateLocation.szLongitude = '39.934412'
      // socket.sendMessage(MDM_GR_LOGON, SUB_GR_UPDATE_LOCATION, UpdateLocation)

        cocos.setTimeout(playNode.registWxShareMenu, 1000)
    },
    adaptUi:function()
    {
        if(SHOW_CHAIR == 4)
        {
            tableNode.chairNode0.x = 80
            tableNode.chairNode0.y = 200

            tableNode.chairNode1.x = 1120
            tableNode.chairNode1.y = 550

            tableNode.chairNode2.x = 930
            tableNode.chairNode2.y = tableNode.uiChair.height - 120

            tableNode.chairNode3.x = 80
            tableNode.chairNode3.y = 550

            majiangFactory.showChairId2DirMap = [0, 1, 2, 3]
        }
        else if(SHOW_CHAIR == 3)
        {
            tableNode.chairNode0.x = 80
            tableNode.chairNode0.y = 200

            tableNode.chairNode1.x = 1120
            tableNode.chairNode1.y = 550

            tableNode.chairNode2.x = 80
            tableNode.chairNode2.y = 550

            tableNode.chairNode3.setVisible(false)
            majiangFactory.showChairId2DirMap = [0, 1, 3]
        }
        else if(SHOW_CHAIR == 2)
        {
            tableNode.chairNode0.x = 80
            tableNode.chairNode0.y = 200

            tableNode.chairNode1.x = 930
            tableNode.chairNode1.y = tableNode.uiChair.height - 120

            tableNode.chairNode2.setVisible(false)
            tableNode.chairNode3.setVisible(false)

            majiangFactory.showChairId2DirMap = [0, 2]
        }
    },
    registWxShareMenu:function()
    {
        if(wxData)
        {
          wx.onMenuShareAppMessage({
            title: wxData.data.share.title,
            desc: '高邮跑点子，上限60分，包三嘴，把把双',
            link: wxData.data.share.link,
            imgUrl: wxData.data.share.imgurl.replace(/\/0/, '/64'),
            trigger: function (res) {
              // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
              // alert('用户点击发送给朋友');
            },
            success: function (res) {
            },
            cancel: function (res) {
            },
            fail: function (res) {
            }
          });

          wx.onMenuShareTimeline({
            title: wxData.data.share.title,
            desc: '高邮跑点子，上限60分，包三嘴，把把双',
            link: wxData.data.share.link,
            imgUrl: wxData.data.share.imgurl.replace(/\/0/, '/64'),
            trigger: function (res) {
              // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
              // alert('用户点击发送给朋友');
            },
            success: function (res) {
            },
            cancel: function (res) {
            },
            fail: function (res) {
            }
          });
        }
    },
    onReStart:function()
    {
        playNode.handMajiangs4D = []
        playNode.handGroupNode4D = []
        playNode.discardMajiangs4D = []
        playNode.weaveMajiangs4D = []
        playNode.isLookingResult = false

        cocos.clearInterval(playNode.updateOnFree, playNode.node)
    },
    initCurrentRoundNode:function(currentRoundNode)
    {
        //currentRoundNode是绑定在chair上的一个节点 用于存放当前轮用到的节点
        
        currentRoundNode.scoreChange = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.scoreChange, 10)   

        currentRoundNode.upTTF = cc.LabelTTF.create('', "Helvetica", 16)
        currentRoundNode.upTTF.setFontFillColor( cc.color(242, 226, 142, 255) )
        currentRoundNode.upTTF.enableStroke(cc.color(0, 0, 0, 255), 2)
        currentRoundNode.upTTF.anchorY = 0
        currentRoundNode.addChild( currentRoundNode.upTTF )   
        currentRoundNode.upTTF.setVisible(false)

        currentRoundNode.playerStatusNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.playerStatusNode)   
    },
    clearCurrentRoundNode:function(currentRoundNode)
    {           
        //一轮结束 clearCurrentRoundNode
        currentRoundNode.scoreChange.removeAllChildren()
        currentRoundNode.upTTF.setString('')
        currentRoundNode.playerStatusNode.removeAllChildren()
    },
    setCurrentRoundNodeVisible:function(isVisible)
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

        currentRoundNode.upTTF.setPositionY(65)
        var direction = majiangFactory.serverChairId2Direction(user.wChairID)
        //设置三处四方向的麻将位置 
        if(direction==0)
        {
            currentRoundNode.scoreChange.setPosition( cc.p(100, 30) )  
            currentRoundNode.playerStatusNode.setPosition( cc.p(50, 25) )  
        }
        else if(direction==2)
        {       
            currentRoundNode.scoreChange.setPosition( cc.p(-70, -30) )  
            currentRoundNode.playerStatusNode.setPosition( cc.p(-50, 25) )  
        } 
        else if(direction==1)
        { 
            currentRoundNode.scoreChange.setPosition( cc.p(-150, -50) )  
            currentRoundNode.playerStatusNode.setPosition( cc.p(-50, 25) )  
        }
        else if(direction==3)
        {   
            currentRoundNode.scoreChange.setPosition( cc.p(100, 30) )  
            currentRoundNode.playerStatusNode.setPosition( cc.p(50, 25) )  
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
        eventName: "handMajiangUp",
        callback: function(event)
        {   
            var cardData = event.getUserData()

            if( playNode.isInChooseTingCardTime )
            {
                playNode.tingHuCardNode.setVisible(true)
                playNode.updataTingHuCardNode(cardData)
            }
        }
        })
        cc.eventManager.addListener(l, 1)

        var l = cc.EventListener.create({
        event: cc.EventListener.CUSTOM,
        eventName: "handMajiangDown",
        callback: function(event)
        {   
            playNode.tingHuCardNode.setVisible(false)
        }
        })
        cc.eventManager.addListener(l, 1)   
    },
    _initCallBack:function()
    {   
        //林州规则：
        playNode.minusCall1 = function()
        {
            var s = playNode.gamesetTTF1.getString()
            s = parseInt(s)
            playNode.gamesetTTF1.setString( s==0?0:(s-1) )
        }

        playNode.plusCall1 = function()
        {
            var s = playNode.gamesetTTF1.getString()
            s = parseInt(s)
            playNode.gamesetTTF1.setString( s==2?2:(s+1) )
        }

        playNode.minusCall2 = function()
        {
            var s = playNode.gamesetTTF2.getString()
            s = parseInt(s)
            playNode.gamesetTTF2.setString( s==0?0:(s-1) )
        }

        playNode.plusCall2 = function()
        {
            var s = playNode.gamesetTTF2.getString()
            s = parseInt(s)
            playNode.gamesetTTF2.setString( s==2?2:(s+1) )
        }

        playNode.gamesetSureCall = function()
        {
            var call = getObjWithStructName('CMD_C_Call')
            call.xiapao = playNode.gamesetTTF1.getString()
            call.jiading = playNode.gamesetTTF2.getString()
            socket.sendMessage(MDM_GF_GAME,SUB_C_CALL,call)

            playNode.gamesetNode.setVisible(false)
        }
    },
    _bindListener:function()
    {
        playNode.bindActionListener()
    },
    decorateMj:function(mj)
    {
        if(mj.isIgnoreDecorate)
            return;

        var cardData = mj.cardData 
        if( gameLogic.isMagicCard(mj.cardData, cmdBaseWorker.cbMagicCardData) ) 
        {
            var s = new cc.Sprite("#caiShen.png")
            var zi = mj.getChildByTag(101)
            if(zi)
            {
                s.x = 0.5*zi.width - 5
                s.y = 0.5*zi.height + 5
                zi.addChild(s)
            }
        }

        //设置麻将触摸
        if(mj.direction==0 && mj.where.name == 'hand')
        {
            var self = tableData.getUserWithUserId(selfdwUserID)
            var isSelfDown = self.wChairID != INVALID_WORD && tableData.getShowChairIdWithServerChairId(self.wChairID)==0
            if(isSelfDown)
            {
                if(!MAGIC_CARD_ALLOWOUT && gameLogic.isMagicCard(mj.cardData, cmdBaseWorker.cbMagicCardData))
                {
                    mj.touchEnable = false
                    mj.color = cc.color(155, 155, 155)
                }
                else
                {
                    mj.touchEnable = true
                    mj.color = cc.color(255, 255, 255)                     
                }
            }
            else
            {
                mj.touchEnable = false
                mj.color = cc.color(255, 255, 255)
            }

            var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "confirmTing",
            callback: function(event)
            {   
                mj.touchEnable = gameLogic.isTingCard(mj.cardData, cmdBaseWorker.tingData) 
                mj.color = mj.touchEnable?cc.color(255, 255, 255):cc.color(155, 155, 155)   
            }
            })
            cc.eventManager.addListener(l, 1)

            var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "cancleTing",
            callback: function(event)
            {   
                if(!MAGIC_CARD_ALLOWOUT && gameLogic.isMagicCard(mj.cardData, cmdBaseWorker.cbMagicCardData))
                {
                    mj.touchEnable = false
                    mj.color = cc.color(155, 155, 155)
                }
                else
                {
                    mj.touchEnable = true
                    mj.color = cc.color(255, 255, 255)                     
                }
            }
            })
            cc.eventManager.addListener(l, 1)
        }

        if(mj.where.name!='hand')
        {
            //麻将弹起时高亮，麻将弹下是恢复
            var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "handMajiangUp",
            callback: function(event)
            {   
                var cardData = event.getUserData()
                
                if(mj.cardData == cardData)
                    mj.color = cc.color(150, 150, 220)
                else
                    mj.color = cc.color(255, 255, 255)
            }
            })
            cc.eventManager.addListener(l, 1)

            var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "handMajiangDown",
            callback: function(event)
            {   
                var cardData = event.getUserData()
                if(mj.cardData == cardData)
                    mj.color = cc.color(255, 255, 255)
            }
            })
            cc.eventManager.addListener(l, 1)   
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
        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        var currentUser = tableData.getUserWithChairId(cmdBaseWorker.wCurrentUserCall)
        chairFactory.showFiredCircle.call(currentUser.userNodeInsetChair, 20)
        
        if( tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wCurrentUserCall )
        {
            playNode.gamesetNode.setVisible(true)
            var isBanker = tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wBankerUser
            playNode.jiadingBtn1.setEnabled(!isBanker)
            playNode.jiadingBtn2.setEnabled(!isBanker)

            playNode.gamesetTTF1.setString('0')
            playNode.gamesetTTF2.setString('0')
        }

        for(var i=0;i<SERVER_CHAIR;i++)
        {
            if(cmdBaseWorker.cbCallRecord[i][0]!=INVALID_BYTE)
            {
                var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
                user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] ) 
            }
        }
    },
    onCMD_StatusPlay:function() 
    {
        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        playNode.addLaizi()

        var bankerDirection = majiangFactory.serverChairId2Direction(cmdBaseWorker.wBankerUser)
        
        playNode.timer = majiangTimer4D.getTimer()
        var pos = majiangFactory.getTimerPos()
        playNode.timer.x = pos.x
        playNode.timer.y = pos.y
        playNode.mjsNode.addChild(playNode.timer)
        playNode.timer.initFenwei( bankerDirection )
        majiangFactory.initFenwei( bankerDirection )

        //初始化CardData2ScoreMap
        var cardDatas = []
        var scores = []
        var magicCardData = cmdBaseWorker.cbMagicCardData 
        for(var i=0;i<magicCardData.length;i++)
        {
            if(magicCardData[i] == INVALID_CARD_DATA)
                break
            cardDatas[cardDatas.length] = magicCardData[i]
            scores[scores.length] = -1000+magicCardData[i]
        }
        cardDatas[cardDatas.length] = REPLACE_CARD_DATA
        scores[scores.length] = magicCardData[0]
        majiangFactory.initCardData2ScoreMap( cardDatas, scores )

        var self = tableData.getUserWithUserId(selfdwUserID)
        // for(var i=0;i<SERVER_CHAIR;i++)
        // {
        //     var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
        //     user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] )
        // }

        var weaveItemArray = [[],[],[],[]]
        var handCardDatasArray = [[[], null], [[], null], [[], null], [[], null]]
        var discardCardDatasArray = [[],[],[],[]]
        var cbPlayerFlowerCardData = [[],[],[],[]]

        for(var direction=0;direction<4;direction++)
        {
            var wChairID = majiangFactory.direction2ServerChairId(direction)
            if(typeof(wChairID)!='number')
                continue
            //weave
            var weaveItems = cmdBaseWorker.WeaveItemArray[wChairID]
            weaveItemArray[direction] = weaveItems

            //hand
            var handCardDatas = cmdBaseWorker.cbHandCardData[wChairID]
            if(cmdBaseWorker.cbHandCardCount[wChairID] + cmdBaseWorker.cbWeaveCount[wChairID]*3 == MAX_COUNT)
            {
                if(tableData.getUserWithChairId(wChairID).dwUserID == selfdwUserID)
                {
                    if(cmdBaseWorker.cbSendCardData == INVALID_CARD_DATA)
                        var newGetCardData = handCardDatas[handCardDatas.length-1]
                    else
                        var newGetCardData = cmdBaseWorker.cbSendCardData
                }
                else   
                    var newGetCardData = 0

                for(var j=0;j<handCardDatas.length;j++)
                {
                    if(handCardDatas[j] == newGetCardData)
                    {
                        handCardDatas.splice(j, 1)
                        handCardDatasArray[direction][0] = handCardDatas
                        break
                    }
                }
                handCardDatasArray[direction][1] = newGetCardData
            }
            else
                handCardDatasArray[direction][0] = handCardDatas

            //discard
            discardCardDatasArray[direction] = cmdBaseWorker.cbDiscardCardData[wChairID].slice(0, cmdBaseWorker.cbDiscardCount[wChairID])
       
            //flower
            cbPlayerFlowerCardData[direction] = cmdBaseWorker.cbPlayerFlowerCardData[wChairID]
        }
        gameLogic.sortHandCardDatas(handCardDatasArray[0][0]) 
        var heapCardDatasArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)

        playNode.sendCardsAction(handCardDatasArray, discardCardDatasArray, weaveItemArray, heapCardDatasArray, cbPlayerFlowerCardData) 

        if(cmdBaseWorker.wOutCardUser!=INVALID_WORD)
        {
            var d = majiangFactory.serverChairId2Direction(cmdBaseWorker.wOutCardUser)
            playNode.setCurrentDiscardMj(playNode.discardMajiangs4D, d) 
        }

        playNode.updatePlayerStatusNode()

        if(self.wChairID!=INVALID_WORD && cmdBaseWorker.bPlayerStatus[self.wChairID][1])//听牌时手牌全暗
        {
            var handMajiangs = playNode.handMajiangs4D[0][0]

            for(var i=0;i<handMajiangs.length;i++)
            {
                handMajiangs[i].touchEnable = false
                handMajiangs[i].color = cc.color(155, 155, 155)
            }
        }

        //动作中并且不是自摸动作
        var switchUsers = []
        if(cmdBaseWorker.wCurrentUser!=INVALID_WORD)
        {
            var currentDirection = majiangFactory.serverChairId2Direction(cmdBaseWorker.wCurrentUser) 
            switchUsers[0] = currentDirection
            playNode.checkHandCardTouch(currentDirection)
        }
        else if(cmdBaseWorker.wGetSendCardUser!=INVALID_WORD 
        && cmdBaseWorker.wGetSendCardUser==cmdBaseWorker.wTakeCardUser)
            switchUsers[0] = majiangFactory.serverChairId2Direction(cmdBaseWorker.wTakeCardUser)        
        playNode.timer.switchTimer(switchUsers)

        /////吃碰杠胡
        var sortedActions = playNode.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var isActioning = sortedActions.length>0
        if(isActioning)
            playNode.showActionBtns(sortedActions)
    },
    onCMD_TINGDATA:function() 
    {        
    },
    onCMD_PlayerStatusUpdata:function() 
    {            
        playNode.updatePlayerStatusNode()
    },
    onCMD_CallNotify:function(body) 
    {
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
        playNode.node.stopAction(playNode.gameEndAction)
        playNode.resetPlayNode()

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)

        var user = tableData.getUserWithChairId(cmdBaseWorker.wCurrentUserCall)
        chairFactory.showFiredCircle.call(user.userNodeInsetChair, 20)
        if( tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wCurrentUserCall )
        {
            playNode.gamesetNode.setVisible(true)
            var isBanker = tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wBankerUser
            playNode.jiadingBtn1.setEnabled(!isBanker)
            playNode.jiadingBtn2.setEnabled(!isBanker)

            playNode.gamesetTTF1.setString('0')
            playNode.gamesetTTF2.setString('0')
        }
    },
    onCMD_CallResult:function(body) 
    {     
        var callUser = tableData.getUserWithChairId(cmdBaseWorker.wCallUser)
        chairFactory.hideFiredCircle.call(callUser.userNodeInsetChair)
        callUser.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[cmdBaseWorker.wCallUser][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[cmdBaseWorker.wCallUser][1] )

        if(cmdBaseWorker.wCurrentUserCall!=INVALID_WORD)
        {
            var currentUser = tableData.getUserWithChairId(cmdBaseWorker.wCurrentUserCall)
            chairFactory.showFiredCircle.call(currentUser.userNodeInsetChair, 20)
        }

        if( tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wCurrentUserCall )
        {
            playNode.gamesetNode.setVisible(true)
            var isBanker = tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wBankerUser
            playNode.jiadingBtn1.setEnabled(!isBanker)
            playNode.jiadingBtn2.setEnabled(!isBanker)

            playNode.gamesetTTF1.setString('0')
            playNode.gamesetTTF2.setString('0')
        }
    },
    onCMD_GameStart:function() 
    {        
        //有叫分的话这里注释
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
        playNode.node.stopAction(playNode.gameEndAction)
        playNode.resetPlayNode()

        //提前保存可能被破坏的数据  掷骰子是庄家出牌破坏数据 因为可能庄家筛子先出完
        var bankerDirection = majiangFactory.serverChairId2Direction(cmdBaseWorker.wBankerUser)
        
        playNode.timer = majiangTimer4D.getTimer()
        var pos = majiangFactory.getTimerPos()
        playNode.timer.x = pos.x
        playNode.timer.y = pos.y
        playNode.mjsNode.addChild(playNode.timer)
        playNode.timer.initFenwei( bankerDirection )
        majiangFactory.initFenwei( bankerDirection )

        //初始化CardData2ScoreMap
        var cardDatas = []
        var scores = []
        var magicCardData = cmdBaseWorker.cbMagicCardData 
        for(var i=0;i<magicCardData.length;i++)
        {
            if(magicCardData[i] == INVALID_CARD_DATA)
                break
            cardDatas[cardDatas.length] = magicCardData[i]
            scores[scores.length] = -1000+magicCardData[i]
        }
        cardDatas[cardDatas.length] = REPLACE_CARD_DATA
        scores[scores.length] = magicCardData[0]
        majiangFactory.initCardData2ScoreMap( cardDatas, scores )

        var self = tableData.getUserWithUserId(selfdwUserID)
        // for(var i=0;i<SERVER_CHAIR;i++)
        // {
        //     var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
        //     user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] )
        // }

        //get handCardDatasArray
        var weaveItemArray = [[],[],[],[]]
        var handCardDatasArray = [[[], null], [[], null], [[], null], [[], null]]
        var discardCardDatasArray = [[],[],[],[]]
        var cbPlayerFlowerCardData = [[],[],[],[]] 
        for(var direction=0;direction<4;direction++)
        {
            var wChairID = majiangFactory.direction2ServerChairId(direction)
            if(typeof(wChairID)!='number')
                continue
            var cardDatas = []
            if(wChairID==self.wChairID)
                cardDatas = cmdBaseWorker.cbHandCardData[wChairID]
            else
            {
                for(var ii=0;ii<MAX_COUNT;ii++)
                {
                    cardDatas[ii] = 0
                } 
            }
            var oldCardDatas = cardDatas.slice(0, MAX_COUNT-1)
            handCardDatasArray[direction] = [oldCardDatas, null]
        }
        gameLogic.sortHandCardDatas(handCardDatasArray[0][0]) 

        //get heapCardDatasArray 
        var heapCardDatasArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)       
        playNode.sendCardsAction(handCardDatasArray, discardCardDatasArray, weaveItemArray, heapCardDatasArray, cbPlayerFlowerCardData) 


        managerTouch.closeTouch() //避免在不知道牌的情况下 把牌打出去
        playNode.setCurrentRoundNodeVisible(false)
        playNode.actionNode.setVisible(false)
        playNode.mjsNode.setVisible(false)
        // var map = [0,0,1,2,3,1,1,2,3,3,1,2,3]
        // var takerChairId = (cmdBaseWorker.wBankerUser + 
        //     map[ cmdBaseWorker.cbSiceCount[0]+cmdBaseWorker.cbSiceCount[1] ])%SERVER_CHAIR
        // var takerShowChairId = tableData.getShowChairIdWithServerChairId(takerChairId)

        function gameStart()
        {
            playNode.addLaizi()
            playNode.setCurrentRoundNodeVisible(true)
            playNode.actionNode.setVisible(true)
            playNode.mjsNode.setVisible(true)
            managerTouch.openTouch()
        }

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.playDiceOneDirection(gameStart, cmdBaseWorker.cbSiceCount[0], 
            cmdBaseWorker.cbSiceCount[1], majiangFactory.serverChairId2Direction(cmdBaseWorker.wBankerUser))

        // function bankerPlayDice()
        // {
        //     playNode.playDiceOneDirection(takePlayDice, cmdBaseWorker.cbSiceCount[0], 
        //         cmdBaseWorker.cbSiceCount[1], bankerShowChairId)
        // }

        // function takePlayDice()
        // {
        //     tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        //     playNode.playDiceOneDirection(gameStart, cmdBaseWorker.cbSiceCount[2], 
        //         cmdBaseWorker.cbSiceCount[3], takerShowChairId)
        // }

        // if(cmdBaseWorker.bIsRandBanker)
        //     playNode.playDiceForRandBanker(bankerPlayDice, bankerShowChairId)
        // else
        //     bankerPlayDice()

    },
    onCMD_OutCard:function() 
    {
        playNode.onUserOutCard()

        var sortedActions = playNode.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(sortedActions)
    },
  
    onCMD_SendCard:function() 
    {
        if(cmdBaseWorker.cbOutCardCount != 0)
            managerAudio.playEffect('gameRes/sound/sendcard.mp3')

        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        
        var takeDir = majiangFactory.serverChairId2Direction( cmdBaseWorker.wTakeCardUser ) 
        ///////
        for(var i=0;i<cmdBaseWorker.cbSendCardCount;i++)
        {
            var item = cmdBaseWorker.sendCardArray[i]
            //牌堆
            majiangFactory.deleteHeapMajiangs(playNode.heapMajiangs4D[majiangFactory.fenwei2Direction(item.heapIdx.wHeapFenwei)], [item.heapIdx.wHeapPos])
           
            //手牌
            if(item.cbCardData == HAS_DISPATCH_CARD_DATA)//丢弃牌
                continue
            var cardData = tableData.getUserWithChairId(cmdBaseWorker.wTakeCardUser).dwUserID == selfdwUserID?item.cbCardData:0
            majiangFactory.addHandMajiang(playNode.handMajiangs4D[takeDir], takeDir, cardData, playNode.mjsNode, playNode.weaveMajiangs4D[takeDir].length)



        // var majiang = majiangFactory.getDiscardMajiangs(outDir, playNode.discardMajiangs4D[outDir].length, outCardData)
        // playNode.discardMajiangs4D[outDir][playNode.discardMajiangs4D[outDir].length] = majiang
        // playNode.mjsNode.addChild(majiang)




        }

        var switchUsers = []
        if(cmdBaseWorker.wCurrentUser!=INVALID_WORD)
        {
            var currentDirection = majiangFactory.serverChairId2Direction( cmdBaseWorker.wCurrentUser ) 
            switchUsers[0] = currentDirection
            playNode.checkHandCardTouch(currentDirection)
        }        
        else if(cmdBaseWorker.wGetSendCardUser!=INVALID_WORD 
        && cmdBaseWorker.wGetSendCardUser==cmdBaseWorker.wTakeCardUser)
            switchUsers[0] = majiangFactory.serverChairId2Direction(cmdBaseWorker.wTakeCardUser)        
        playNode.timer.switchTimer(switchUsers)

        /////摸到麻将时有可能出现杠听胡补花
        var sortedActions = playNode.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(sortedActions)  //自摸杠 cardData不确定 需要searchGangCardDatas
        else if(cmdBaseWorker.wCurrentUser!=INVALID_WORD 
            && tableData.getUserWithChairId(cmdBaseWorker.wCurrentUser).dwUserID == selfdwUserID 
            && cmdBaseWorker.bPlayerStatus[cmdBaseWorker.wCurrentUser][1]) 
        {
            cmdBaseWorker.wCurrentUser = INVALID_WORD
            var OutCard = getObjWithStructName('CMD_C_OutCard')
            OutCard.cbOutCardData = playNode.handMajiangs4D[0][1].cardData
            socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
        }
    },
    onCMD_OperateResult:function() 
    {
        playNode.hideActionBtns()
        playNode.hideCurrentDiscardMj()
        
        if(cmdBaseWorker.cbOperateCode != WIK_NULL)
        {
            //动作效果
            var operateUser = tableData.getUserWithChairId(cmdBaseWorker.wOperateUser)
            var provideUser = tableData.getUserWithChairId(cmdBaseWorker.wProvideUser)

            playNode.onActionResult(cmdBaseWorker.cbOperateCode, cmdBaseWorker.cbOperateWeaveIdx, cmdBaseWorker.OperateWeaveItem, 
                cmdBaseWorker.wOperateUser, cmdBaseWorker.wProvideUser, cmdBaseWorker.cbProvideCardData)

            playNode.playAction(cmdBaseWorker.cbOperateCode, operateUser)
        }

        var switchUsers = []
        if(cmdBaseWorker.wCurrentUser!=INVALID_WORD)
        {
            var currentDirection = majiangFactory.serverChairId2Direction(cmdBaseWorker.wCurrentUser)
            switchUsers[0] = currentDirection
            playNode.checkHandCardTouch(currentDirection)
        }
        else if(cmdBaseWorker.wProvideUser==cmdBaseWorker.wTakeCardUser)
            switchUsers[0] = majiangFactory.serverChairId2Direction(cmdBaseWorker.wTakeCardUser)        
        playNode.timer.switchTimer(switchUsers)

        if(tableData.getUserWithUserId(selfdwUserID).wChairID != INVALID_WORD)
        {
            var sortedActions = playNode.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
            if(sortedActions.length>0)
            {
                cmdBaseWorker.wProvideUser = cmdBaseWorker.wOperateUser //执行完上一个动作wProvideUser需要更新
                // cmdBaseWorker.cbProvideCardData  = cmdBaseWorker.cbProvideCardData //cbProvideCardData仍有意义 碰杠可能触发胡 
                playNode.showActionBtns(sortedActions)  //吃碰后杠 cardData不确定 需要searchGangCardDatas
            }
            else if(cmdBaseWorker.wCurrentUser!=INVALID_WORD 
                && tableData.getUserWithChairId(cmdBaseWorker.wCurrentUser).dwUserID == selfdwUserID 
                && cmdBaseWorker.bPlayerStatus[cmdBaseWorker.wCurrentUser][1]) 
            {
                cmdBaseWorker.wCurrentUser = INVALID_WORD
                var OutCard = getObjWithStructName('CMD_C_OutCard')
                OutCard.cbOutCardData = playNode.handMajiangs4D[0][1].cardData
                socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
            }
        }
    },
    onCMD_ReplaceResult:function()
    {    
        playNode.hideActionBtns()
        playNode.hideCurrentDiscardMj()
        
        var cbReplaceCardData = cmdBaseWorker.cbReplaceCardData

        var operateUser = tableData.getUserWithChairId(cmdBaseWorker.wOperateUser)
        var operateUserDir = majiangFactory.serverChairId2Direction( cmdBaseWorker.wOperateUser)
        
        var operateHandMajiangs = playNode.handMajiangs4D[operateUserDir]
        var operateFlowerMajiangs = playNode.flowerMajiangs4D[operateUserDir]

        for(var i=0;i<cbReplaceCardData.length;i++)
        {
            var deleteCardData = operateUser.dwUserID == selfdwUserID?cbReplaceCardData[i]:0
            var flowerCardData = cbReplaceCardData[i]
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)

            majiangFactory.addFlowerMajiangs(operateFlowerMajiangs, operateUserDir, flowerCardData, playNode.mjsNode)
        }    


        if(cmdBaseWorker.cbOutCardCount != 0)//开局补花
        {
            playNode.playAction(WIK_REPLACE, operateUser)
        }
    },
    onCMD_ListenResult:function()
    {
        var operateUser = tableData.getUserWithChairId(cmdBaseWorker.wOperateUser)

        playNode.onUserOutCard()

        if(tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wOperateUser)
        {
            var handMajiangs = playNode.handMajiangs4D[0][0]
            for(var i=0;i<handMajiangs.length;i++)
            {
                handMajiangs[i].touchEnable = false
                handMajiangs[i].color = cc.color(155, 155, 155)
            }     
        }

        var sortedActions = playNode.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(sortedActions)

        playNode.playAction(WIK_LISTEN, operateUser)
    },
    onCMD_GameEnd:function() 
    {
        ////////////////5张牌日志////////////////
        var handCardDatas = playNode.getHandCardDatas( playNode.handMajiangs4D[0] )
        var discardCardDatas = playNode.getDiscardCardDatas( playNode.discardMajiangs4D )
        var weaveCardDatas = playNode.getWeaveCardDatas(cmdBaseWorker.cbWeaveCount, cmdBaseWorker.WeaveItemArray)

        var showCardDatas = (handCardDatas.concat(discardCardDatas)).concat(weaveCardDatas)

        var cardDatas = []
        for(var i=0;i<showCardDatas.length;i++)
        {
            var cardData = showCardDatas[i]
            if(typeof(cardDatas[cardData]) == 'undefined')
                cardDatas[cardData] = 0
            else
                cardDatas[cardData]++
        
            var totalCardData = cardData==cmdBaseWorker.TurnoverCard[0].cbCardData?3:4

            if(cardDatas[cardData]>totalCardData)
            {
               sendLogToServer(gameLog.logS + 'wtms'+KIND_ID+'fiveCard'+selfdwUserID+'-wtms')
               break
            }
        }
        ///////////////////////////////////////

        playNode.gamesetNode.setVisible(false)

        playNode.isLookingResult = true   
        playNode.hideActionBtns()

        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)

        var userData_gameEnd = []
        for(var wChairID=0;wChairID<SERVER_CHAIR;wChairID++)
        {
            var user = tableData.getUserWithChairId(wChairID)
            userData_gameEnd[wChairID] = {}

            if(user)
            {
                userData_gameEnd[wChairID].szNickName = user.szNickName
                userData_gameEnd[wChairID].szHeadImageUrlPath = user.szHeadImageUrlPath
                userData_gameEnd[wChairID].lScoreInGame = user.lScoreInGame
            }
        }

        if(cmdBaseWorker.endType == 3)
        {
            var provideDiscardMajiangs = playNode.discardMajiangs4D[majiangFactory.serverChairId2Direction(cmdBaseWorker.wProvideUser)]
            //抢杠情况不会到丢弃区
            if(provideDiscardMajiangs.length>0 && provideDiscardMajiangs[provideDiscardMajiangs.length-1].cardData == cmdBaseWorker.cbProvideCardData)
                majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
        }

        playNode.playAnimationOfGameEnd(onPlayAnimationOfGameEnd)
        function onPlayAnimationOfGameEnd()
        {
            playNode.gameEndAction = cc.sequence( 
                cc.callFunc(function()
                {     
                    playNode.timer.resetTimer()
                    playNode.hideCurrentDiscardMj()
                    playNode._showSprsOnGameEnd()
                }), 
                cc.delayTime(4), //看牌5秒
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
                    playNode.popGameEnd(continueCall, userData_gameEnd) 
                }) 
            )           
            playNode.node.runAction(playNode.gameEndAction)
        }        
    },
    ///////////////cmdEvent end//////////
    onUserOutCard:function()
    {
        var outUser = tableData.getUserWithChairId(cmdBaseWorker.wOutCardUser)
        var outDir = majiangFactory.serverChairId2Direction( cmdBaseWorker.wOutCardUser) 
        var outCardData = cmdBaseWorker.cbOutCardData

        playNode.timer.switchTimer([])
        playNode.playMajiangEffect(outCardData, outUser.cbGender)
        managerAudio.playEffect('gameRes/sound/discard.mp3')

        var majiangs = playNode.handMajiangs4D[outDir]
        if(outUser.dwUserID==selfdwUserID)
        {
            majiangFactory.deleteHandMajiangs(majiangs, outDir, outCardData)
            var newMj = majiangs[1]
            if(newMj)
            {
                majiangFactory.addHandMajiangsOld(majiangs, outDir, newMj.cardData, playNode.mjsNode)
                majiangFactory.deleteHandMajiangNew(majiangs)
            }
        }
        else
            majiangFactory.deleteHandMajiangs(majiangs, outDir, 0)
        majiangFactory.addDiscardMajiangs(playNode.discardMajiangs4D[outDir], outDir, outCardData, playNode.mjsNode)
        playNode.setCurrentDiscardMj(playNode.discardMajiangs4D, outDir)
    },
    updatePlayerStatusNode:function()
    {
        for(var wChairID=0;wChairID<SERVER_CHAIR;wChairID++)
        {
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, wChairID)
            var playerStatusNode = user.userNodeInsetChair.currentRoundNode.playerStatusNode
            playerStatusNode.removeAllChildren()

            var statusList = cmdBaseWorker.bPlayerStatus[wChairID]
            var posY = 0
            for(var i=0;i<statusList.length;i++)
            {
                if(statusList[i])
                {
                    var icon = new cc.Sprite('#playerStatus_' + i + '.png')
                    icon.y = posY
                    posY -= 20
                    playerStatusNode.addChild(icon)
                }
            }
        } 
    },
    ////////////sendCardsAction start//////////
    _gethandMajiangsListener:function(touchEndCall)
    {
        var majiangs = playNode.handMajiangs4D[0]

        var currentMajiangTipsNode = new cc.Node()
        var bg = new cc.Sprite('#mf_currentMjBg.png')
        currentMajiangTipsNode.addChild(bg)

        var where = {}
        where.name = 'hand'
        where.data = {idx:0}
        var mj = majiangFactory.getOne(1, 0, where)
        mj.x = 0
        mj.y = 0
        mj.isIgnoreDecorate = true
        currentMajiangTipsNode.addChild(mj)

        currentMajiangTipsNode.x = - 1000
        currentMajiangTipsNode.y = 100 + bg.height*0.5 + 80

        playNode.mjsNode.addChild(currentMajiangTipsNode, 1000)

        var mjOriginY = majiangs[0][0].y
        var touchPosX2TouchedMj = function(locationInNode)
        {      
            for(var i=0;i<majiangs[0].length;i++)
            {
                var mj = majiangs[0][i]
                if(locationInNode.x>mj.x-mj.width*0.5 && locationInNode.x<mj.x+mj.width*0.5 
                    && locationInNode.y>mj.y-mj.height*0.5 && locationInNode.y<mj.y+mj.height*0.5 )
                    return mj
            }

            var mj = majiangs[1]
            if(mj && locationInNode.x>mj.x-mj.width*0.5 && locationInNode.x<mj.x+mj.width*0.5
                && locationInNode.y>mj.y-mj.height*0.5 && locationInNode.y<mj.y+mj.height*0.5 )
                return mj

            return null
        }

        var lastPlayTime = null
        var playSelectEffect = function()
        {
            var nowTime = new Date().getTime()

            if(!lastPlayTime || (nowTime - lastPlayTime) > 100)
            {
                lastPlayTime = nowTime
                managerAudio.playEffect('gameRes/sound/selectcard.mp3')
            }
        }

        var currentMajiang = null
        var currentPopMajiang = null
        var touchedMjNum = 0
        var isTouchFromPop = false
        var soundId = null
        var onTouch = function(touchedMj)
        {   
            if(!currentMajiang)//刚开始触摸麻将
            {
                touchedMjNum = 1

                currentMajiang = touchedMj
                if(currentPopMajiang)
                {
                    isTouchFromPop = currentPopMajiang == currentMajiang

                    currentPopMajiang.y = mjOriginY
                    var event = new cc.EventCustom("handMajiangDown")
                    event.setUserData(currentPopMajiang.cardData)
                    cc.eventManager.dispatchEvent(event) 
                }

                currentMajiang.y = mjOriginY + 20
                var event = new cc.EventCustom("handMajiangUp")
                event.setUserData(currentMajiang.cardData)
                cc.eventManager.dispatchEvent(event) 

                //////
                currentMajiangTipsNode.x = currentMajiang.x
                currentMajiangTipsNode.y = 100 + bg.height*0.5 + 80
                mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 
            }
            else if(currentMajiang && currentMajiang!=touchedMj)//摸到新的麻将 
            {
                touchedMjNum++
                playSelectEffect()

                currentMajiang.y = mjOriginY
                var event = new cc.EventCustom("handMajiangDown")
                event.setUserData(currentMajiang.cardData)
                cc.eventManager.dispatchEvent(event) 


                currentMajiang = touchedMj
                currentMajiang.y = mjOriginY + 20
                var event = new cc.EventCustom("handMajiangUp")
                event.setUserData(currentMajiang.cardData)
                cc.eventManager.dispatchEvent(event) 

                //////
                currentMajiangTipsNode.x = currentMajiang.x
                currentMajiangTipsNode.y = 100 + bg.height*0.5 + 80
                mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 
            }
               
            playNode.currentDiscardMjNode.setVisible(false)
            return true
        }

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()

                var locationInNode = target.convertToNodeSpace(touch.getLocation())

                var touchedMj = touchPosX2TouchedMj(locationInNode)
                if(touchedMj && touchedMj.touchEnable)
                {
                    return onTouch(touchedMj)
                }
                else
                {
                    if(currentPopMajiang)
                    {         
                        currentPopMajiang.y = mjOriginY
                        var event = new cc.EventCustom("handMajiangDown")
                        event.setUserData(currentPopMajiang.cardData)
                        cc.eventManager.dispatchEvent(event) 
                        currentPopMajiang = null
                    }

                    return false 
                }
            },
            onTouchMoved: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())

                var touchedMj = touchPosX2TouchedMj(locationInNode)
                if(touchedMj && touchedMj.touchEnable)
                {
                    onTouch(touchedMj)
                }
            },
            onTouchEnded: function (touch, event) 
            {
                var target = event.getCurrentTarget()

                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                
                if(isTouchFromPop && currentPopMajiang == touchPosX2TouchedMj(locationInNode) 
                && touchedMjNum==1) //单击弹出的那张麻将
                {
                    touchEndCall?touchEndCall(currentPopMajiang):''
                    currentPopMajiang = null
                    isTouchFromPop = false

                    currentMajiang.y = mjOriginY
                    var event = new cc.EventCustom("handMajiangDown")
                    event.setUserData(currentMajiang.cardData)
                    cc.eventManager.dispatchEvent(event)  
                }
                else
                {
                    currentPopMajiang = currentMajiang
                }

                currentMajiangTipsNode.x = -1000
                currentMajiang = null
                touchedMjNum = 0
                isTouchFromPop = false

                var event = new cc.EventCustom("handMajiangTouchEnd")
                cc.eventManager.dispatchEvent(event)

                playNode.currentDiscardMjNode.setVisible(true)
            }
        })
            

        return listener
    },
    _bindHandMajiangsListener:function()
    {
        var handMajiangs = playNode.handMajiangs4D
        // playNode.handGroupNode4D = majiangFactory.getHandGroupNodes(handMajiangs)

        if(tableData.getUserWithUserId(selfdwUserID).wChairID == tableData.getServerChairIdWithShowChairId(0))
        {
            var touchEndCall = function(majiang)
            {
                if(playNode.isInChooseTingCardTime)
                {
                    cmdBaseWorker.sendMessage_operateCard([majiang.cardData], WIK_LISTEN )
                    playNode.hideActionBtns()   
                }
                else
                {
                    var isCurrentUser = tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wCurrentUser
                    if(isCurrentUser && majiang.touchEnable)
                    {
                        cmdBaseWorker.wCurrentUser = INVALID_WORD
                        var OutCard = getObjWithStructName('CMD_C_OutCard')
                        OutCard.cbOutCardData = majiang.cardData
                        socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                        // playNode.hideActionBtns()
                    }
                }
            }

            var listener = playNode._gethandMajiangsListener(touchEndCall)
            var mjsListenerNode = new cc.Node
            mjsListenerNode.width = playNode.mjsNode.width
            mjsListenerNode.height = playNode.mjsNode.height
            playNode.mjsNode.addChild(mjsListenerNode)
            cc.eventManager.addListener(listener, mjsListenerNode)
        }
    },
    sendCardsAction:function(handCardDatasArray, discardCardDatasArray, weaveItemArray, heapCardDatasArray, flowerCardDatasArray)
    {   
        // handCardDatasArray = 
        // [
        // [[1,2,3,4,1,2,3,4,1,2,3,4,1], 1], 
        // [[1,2,3,4,1,2,3,4,1,2,3,4,1], 1], 
        // [[1,2,3,4,1,2,3,4,1,2,3,4,1], 1], 
        // [[1,2,3,4,1,2,3,4,1,2,3,4,1], 1]
        // ]

        // flowerCardDatasArray = [ [0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48] ]
        // heapCardDatasArray = [ [1,0,0,0,0,0,0,0,0,0,0,0,0,0],[],[],[] ]
        // discardCardDatasArray = [[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,4,4,55],[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,4,4,55],[4,4,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55],[55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55,55]]
        // weaveCardDatasArray = [[[1,2,3,4],[2,3,4],[4,5,6],[7,8,1]],[],[[1,2,3],[2,3,4,5],[4,5,6],[7,8,1]],[]]
        var self = tableData.getUserWithUserId(selfdwUserID)
        
        playNode.heapMajiangs4D = majiangFactory.getHeapMajiangsArray(heapCardDatasArray)
        playNode.flowerMajiangs4D = majiangFactory.getFlowerMajiangsArray(flowerCardDatasArray)
        playNode.handMajiangs4D = majiangFactory.getHandMajiangsArray(handCardDatasArray, tableData.getUserWithUserId(selfdwUserID).wChairID == INVALID_WORD)
        playNode.discardMajiangs4D = majiangFactory.getDiscardMajiangsArray(discardCardDatasArray)
        playNode.weaveMajiangs4D = majiangFactory.getWeaveMajiangsArray(weaveItemArray, majiangFactory.serverChairId2Direction(self.wChairID) )

        playNode._bindHandMajiangsListener()

        for(var direction=0;direction<4;direction++)
        {
            var heapMajiangs = playNode.heapMajiangs4D[direction]
            for(var j=0;j<heapMajiangs.length;j++)
            {
                var mj = heapMajiangs[j]
                if(mj)
                    playNode.mjsNode.addChild(mj)
            }

            var flowerMajiangs = playNode.flowerMajiangs4D[direction]
            for(var j=0;j<flowerMajiangs.length;j++)
            {
                var mj = flowerMajiangs[j]
                playNode.mjsNode.addChild(mj)
            }

            var discardMajiangs = playNode.discardMajiangs4D[direction]
            for(var j=0;j<discardMajiangs.length;j++)
            {
                var mj = discardMajiangs[j]
                playNode.mjsNode.addChild(mj)
            }

            var handMajiangs = playNode.handMajiangs4D[direction]
            var oldMajiangs = handMajiangs[0]
            for(var j=0;j<oldMajiangs.length;j++)
            {
                var mj = oldMajiangs[j]
                playNode.mjsNode.addChild(mj)
            }
            var newMajiangs = handMajiangs[1]
            if(newMajiangs)
                playNode.mjsNode.addChild(newMajiangs)

            var weaveMajiangs = playNode.weaveMajiangs4D[direction]
            for(var weaveIdx=0;weaveIdx<weaveMajiangs.length;weaveIdx++)
            {
                var weave = weaveMajiangs[weaveIdx]
                for(var idxInWeave=0;idxInWeave<weave.length;idxInWeave++)
                {
                    var mj = weave[idxInWeave]
                    playNode.mjsNode.addChild(mj)
                }
            }
            // handMajiangsNode.addChild(playNode.handWeaveNode4D[direction])
        }

    },
    ////////////sendCardsAction end//////////

    ////////////tingCard start//////////
    updataTingHuCardNode:function(cardData)
    {
        var cardDataArray = []
        for(var i=0;i<cmdBaseWorker.cbTingDataCount;i++)
        {
            var tingDataItem = cmdBaseWorker.tingData[i]
            if(tingDataItem.cbTingCardData == cardData)
            {
                cardDataArray = tingDataItem.cbHuCardData.slice(0, tingDataItem.cbHuCardDataCount)
                break
            }
        }
        var rowNum = Math.min(cardDataArray.length, 7)
        var lineNum = Math.ceil(cardDataArray.length/7)

        var pop = playNode.tingHuCardNode
        pop.removeAllChildren()

        pop.ignoreAnchorPointForPosition(false)
        pop.setAnchorPoint( cc.p(0.5, 0.5) )

        var width = rowNum * 110
        var height = lineNum * 70
        pop.setContentSize( width, height) 

        var bg = new cc.Scale9Sprite('s_sp9_19.png')
        bg.width = width + 10
        bg.height = height + 20
        bg.x = width/2
        bg.y = height/2
        bg.anchorX = 0.5
        bg.anchorY = 0.5
        pop.addChild(bg, -1, 10)

        var listView = new ccui.ListView()
        listView.setDirection(ccui.ScrollView.DIR_VERTICAL)
        listView.setTouchEnabled(true)
        listView.setBounceEnabled(true)
        // listView.setScrollBarEnabled(false)
        listView.setBackGroundImage(resp_p.empty)
        listView.setBackGroundImageScale9Enabled(true)

        listView.setContentSize(width, height)
        listView.x = 0
        listView.y = 0
        pop.addChild(listView)

        for(var i=0;;i++)
        {
            if(cardDataArray.length == 0)
                break
            var s = cardDataArray.splice(0, Math.min(rowNum, cardDataArray.length))
            listView.pushBackCustomItem( playNode._getOneLine_TingHuCard( 
                {
                    cardDatas:s
                } ) )
        }
        listView.forceDoLayout()

        listView.setTouchEnabled(listView.getItem(0) && listView.getItem(0).getPositionY()+listView.getItem(0).getContentSize().height>listView.height)
    },
    _getOneLine_TingHuCard:function(params)
    {
        var default_item = new ccui.Layout()
        default_item.setContentSize(110, 70)
        
        var cardDatas = params.cardDatas

        for(var i=0;i<cardDatas.length;i++)
        {
            var cardData = cardDatas[i]
            var item = playNode._getOneItem_TingHuCard(cardData)


            item.setPosition( cc.p( i*110, 0 ) )
            default_item.addChild(item)
        }

        return default_item
    },
    _getOneItem_TingHuCard:function(cardData)
    {
        var item = new cc.Node()
        item.setAnchorPoint( cc.p(0, 0) )

        var bg = new cc.Scale9Sprite('s_sp9_20.png')
        bg.width = 105
        bg.height = 65
        bg.x = 55
        bg.y = 35
        bg.anchorX = 0.5
        bg.anchorY = 0.5
        item.addChild(bg)

        var where = {}
        where.name = 'paper'
        where.data = {}
        var mj = majiangFactory.getSpecialOne(cardData, where)
        mj.isIgnoreDecorate = true
        mj.x = 30
        mj.y = 35
        item.addChild(mj)

        var tipsTTF = new cc.LabelTTF('还有' + playNode._getCountOfLastCardData(cardData) + '张', "Helvetica", 14)
        tipsTTF.setFontFillColor(cc.color(0, 192, 192, 192) )
        tipsTTF.x = 80
        tipsTTF.y = 20
        item.addChild(tipsTTF)

        return item
    },
    _getCountOfLastCardData:function(cardData)
    {
        var lastCardData = cardData==cmdBaseWorker.TurnoverCard[0].cbCardData?3:4

        var handCardDatas = playNode.getHandCardDatas( playNode.handMajiangs4D[0] )
        var discardCardDatas = playNode.getDiscardCardDatas( playNode.discardMajiangs4D )
        var weaveCardDatas = playNode.getWeaveCardDatas(cmdBaseWorker.cbWeaveCount, cmdBaseWorker.WeaveItemArray)

        var showCardDatas = (handCardDatas.concat(discardCardDatas)).concat(weaveCardDatas)

        for(var i=0;i<showCardDatas.length;i++)
        {
            if(showCardDatas[i] == cardData)
                lastCardData--
        }

        return lastCardData
    },  
    ////////////tingCard end//////////

    ////////////gameend start//////////
    _showSprsOnGameEnd:function()
    {

        for(var direction=0;direction<4;direction++)
        {
            var wChairID = majiangFactory.direction2ServerChairId(direction)
            if(typeof(wChairID) != 'number')
                continue

            var cardDatas = clone(cmdBaseWorker.cbHandCardData[wChairID])
            if( cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU
                && cmdBaseWorker.cbProvideCardData != INVALID_CARD_DATA )
                cardDatas[cardDatas.length] = cmdBaseWorker.cbProvideCardData 

            var handMajiangs = playNode.handMajiangs4D[direction]
            var majiangs = handMajiangs[0]
            if(handMajiangs[1])
                majiangs[majiangs.length] = handMajiangs[1]

            for(var j=0;j<majiangs.length;j++)
            {
                var mj = majiangs[j]
                var where = {}
                where.name = 'handshow'
                where.data = mj.where.data
                mj.where = where
                mj.cardData = cardDatas[j]
                var pos = majiangFactory.getMajiangPos(mj.direction, mj.where)
                
                var styleId = styleArray[0]
                var t = ['d_','r_','u_','l_']
                var frameName = 's' + styleId + '_' + t[mj.direction] + mj.where.name + (mj.cardData==0?'0':'Bg') + pos.frame + '.png'  
                majiangFactory.updateMajiang(mj, frameName, pos)
            }
        }
    },
    _removeSprsOnGameEnd:function()
    {
        for(var chairId=0;chairId<SERVER_CHAIR;chairId++)
        {   
            var user = tableData.getUserWithTableIdAndChairId(null, chairId)
            if(user)
                playNode.clearCurrentRoundNode(user.userNodeInsetChair.currentRoundNode)
        }
    },
    popGameEnd:function(continueCall, userData_gameEnd)
    {
        var control = {}
        control.standCall = function()
        {
            var lookon = getObjWithStructName('CMD_GR_UserLookon') 
            lookon.wTableID = tableData.getUserWithUserId(selfdwUserID).wTableID
            socket.sendMessage(MDM_GR_USER, SUB_GR_USER_LOOKON, lookon)
            continueCall()
            node.removeFromParent()
        }

        control.continueCall = function()
        {
            continueCall()
            node.removeFromParent()
        }
        var node  = managerRes.loadCCB(resp.gameEndPopCCB, control)

        playNode.gameEndControl = control

        control.gendTitle.setSpriteFrame('gendTitle'+cmdBaseWorker.endType + '.png')

        for(var direction=0;direction<4;direction++)
        {
            var wChairID = majiangFactory.direction2ServerChairId(direction)
            if(typeof(wChairID) != 'number')
                continue
            var gendBar = control['gendBar'+wChairID]
            var headNode = control['headNode'+wChairID]
            var handCardNode = control['handCardNode'+wChairID]
            var flowerCardNode = control['flowerCardNode'+wChairID]
            var resultTTF = control['resultTTF'+wChairID]
            
            gendBar.setVisible(true)
            //头像
            var headIcon = new cc.Sprite('#headIcon.png')
            var hnode = getRectNodeWithSpr(headIcon)
            // hnode.x = 70
            // hnode.y = 60
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

            headNode.addChild(hnode)

            var fenwei = majiangFactory.direction2Fenwei(direction)
            var fenweiSpr = new cc.Sprite('#gendFenwei' + fenwei + '.png')
            fenweiSpr.x = 32-13
            fenweiSpr.y = 32-13
            hnode.addChild(fenweiSpr)   

            if(wChairID == cmdBaseWorker.wBankerUser)
            {
                var bankerSpr = new cc.Sprite('#gendIcon_banker.png')
                bankerSpr.x = -32
                bankerSpr.y = 32
                hnode.addChild(bankerSpr)   
            }


            //胡型
            var chrStr = ''
            for (var i = 0; i < map_mask2Name.length; i++) 
            {
                var chr_type = window[ map_mask2Name[i][0] ] 
                if (cmdBaseWorker.dwChiHuRight[wChairID] & chr_type)
                {
                    // if(chrStr == '')
                    //     chrStr += '胡型：'
                    chrStr += map_mask2Name[i][1] + ' ';
                }
            }
            resultTTF.setString(chrStr)

       
            //显示麻将
            
            //吃碰杠 牌
            var cardNode = new cc.Node()
            cardNode.width = 1200
            cardNode.height = 120

            var weaveItems = cmdBaseWorker.WeaveItemArray[wChairID]
            var weaveLen = 0
            for(var weaveIdx=0;weaveIdx<weaveItems.length;weaveIdx++)
            {
                var weaveItem = weaveItems[weaveIdx]
                if(weaveItem.cbWeaveKind == WIK_NULL)
                    continue
                weaveLen++
                weaveItem.wProvideUser = tableData.getServerChairIdWithShowChairId(0)//这样就不显示箭头了
                var majiangsOneWeave = majiangFactory.weaveItem2Majiangs(0, weaveIdx, weaveItem, true)

                for(var idxInWeave=0;idxInWeave<majiangsOneWeave.length;idxInWeave++)
                {
                    var mj = majiangsOneWeave[idxInWeave]
                    cardNode.addChild(mj)
                }
            }

            //手牌            
            var oldHandCardDatas = clone(cmdBaseWorker.cbHandCardData[wChairID])
            var newGetCardData = null

            if( cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU
                && cmdBaseWorker.cbProvideCardData != INVALID_CARD_DATA )
                newGetCardData = cmdBaseWorker.cbProvideCardData 
            else if(oldHandCardDatas.length + weaveLen*3 == MAX_COUNT)//流局 强退
            {
               newGetCardData = oldHandCardDatas.splice(oldHandCardDatas.length-1, 1)[0]
            }

            var handCardDatasArray = [ [oldHandCardDatas, newGetCardData] ]
            var handMajiangs= majiangFactory.getHandMajiangsArray(handCardDatasArray, false, true)[0]
            for(var i=0;i<handMajiangs[0].length;i++)
            {
                cardNode.addChild(handMajiangs[0][i])
            }
            if(handMajiangs[1])
            {
                cardNode.addChild(handMajiangs[1])
                handMajiangs[1].color = cc.color(188, 255, 188)
            }
 
            cardNode.scaleX = handCardNode.width/cardNode.width
            cardNode.scaleY = handCardNode.height/cardNode.height
            cardNode.x = -4
            cardNode.y = 5
            handCardNode.addChild(cardNode)


            //花牌
            var cardNode = new cc.Node()
            cardNode.width = 1200
            cardNode.height = 46

            var flowerCardDatas = cmdBaseWorker.cbPlayerFlowerCardData[wChairID]

            var flowerCardDatasArray = [ flowerCardDatas ]
            var flowerMajiangs= majiangFactory.getFlowerMajiangsArray(flowerCardDatasArray)[0]
            for(var i=0;i<flowerMajiangs.length;i++)
            {
                cardNode.addChild(flowerMajiangs[i])
            }
            cardNode.scaleX = flowerCardNode.height/cardNode.height
            cardNode.scaleY = flowerCardNode.height/cardNode.height
            cardNode.x = -82
            cardNode.y = -90
            flowerCardNode.addChild(cardNode)


            /////////
            if(wChairID==cmdBaseWorker.wExitUser)
                control['winflag'+wChairID].setSpriteFrame('gendFlag0.png') 
            else if(cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU)
                control['winflag'+wChairID].setSpriteFrame('gendFlag1.png') 
            else if(wChairID==cmdBaseWorker.wProvideUser)
                control['winflag'+wChairID].setSpriteFrame('gendFlag2.png') 
            else
                control['winflag'+wChairID].setSpriteFrame('empty.png') 
  

            control['taiTTF'+wChairID].setString(userData_gameEnd[wChairID].lScoreInGame) 
            control['fenTTF'+wChairID].setString((cmdBaseWorker.lGameScore[wChairID]>0?'+':'') + cmdBaseWorker.lGameScore[wChairID]) 

        }
       
        mainScene.top.addChild(node) 
    },
    ///gameend end////


    /////other ui start////////
    showGameset:function()
    {
        var isBanker = tableData.getUserWithUserId(selfdwUserID).wChairID == cmdBaseWorker.wBankerUser
        playNode.jiadingBtn1.setEnabled(!isBanker)
        playNode.jiadingBtn2.setEnabled(!isBanker)

        playNode.gamesetTTF1.setString('0')
        playNode.gamesetTTF2.setString('0')

        playNode.gamesetNode.setVisible(true)
    },
    hideCurrentDiscardMj:function()
    {
        playNode.currentDiscardMjNode.x = -1000
    },
    setCurrentDiscardMj:function(discardMajiangs4D, direction)
    {
        var discardMajiangs = discardMajiangs4D[direction]
        // if(discardMajiangs.length == 0) 
        //     return;

        var discardMajiang = discardMajiangs[discardMajiangs.length-1]
        var cardData = discardMajiang.cardData

        var self = tableData.getUserWithUserId(selfdwUserID)
        var d = majiangFactory.serverChairId2Direction(self.wChairID)
        if(d == direction)
        {
            playNode.hideCurrentDiscardMj()
            return
        }

        playNode.currentDiscardMjNode.setVisible(true)
        var mj = playNode.currentDiscardMjNode.getChildByTag(101)
        mj.getChildByTag(101).setSpriteFrame('mf_' + cardData + '.png') 

        switch(direction)
        {
            case 0://down
            {
                playNode.currentDiscardMjNode.x = 600
                playNode.currentDiscardMjNode.y = 200
                break
            }
            case 1://right
            {
                playNode.currentDiscardMjNode.x = 1050
                playNode.currentDiscardMjNode.y = 480
                break
            }
            case 2://up
            {
                playNode.currentDiscardMjNode.x = 600
                playNode.currentDiscardMjNode.y = 630  
                break
            }
            case 3://left
            {
                playNode.currentDiscardMjNode.x = 150
                playNode.currentDiscardMjNode.y = 480
                break
            }
        }  
    },
    addLaizi:function()
    {
        for(var i=0;i<MAX_MAGIC_COUNT;i++)
        {
            var cardData = cmdBaseWorker.cbMagicCardData[i]
            if(cardData == INVALID_CARD_DATA)
                continue

            var where = {}
            where.name = 'caishen'
            where.data = {}
            var mj = majiangFactory.getSpecialOne(cardData, where)
            mj.x = 50 + i*85
            mj.y = 660
            mj.isIgnoreDecorate = true
            playNode.mjsNode.addChild(mj)
        }
    },
    playAnimationOfGameEnd:function(call)
    {
        if(cmdBaseWorker.endType == 0)
            call()
        else if(cmdBaseWorker.endType == 1)
        {
            var spr = actionFactory.getSprWithAnimate('lj', true, 0.15, call)
            playNode.actionNode.addChild(spr)
            spr.x = playNode.actionNode.width*0.5
            spr.y = playNode.actionNode.height*0.5
        }
        else if(cmdBaseWorker.endType == 2)
        {
            playNode.playAnimationWithDirection('zim', majiangFactory.serverChairId2Direction(cmdBaseWorker.wProvideUser), call)
            playNode.playGenderEffect('zimo0', tableData.getUserWithChairId(cmdBaseWorker.wProvideUser).cbGender)
        }
        else if(cmdBaseWorker.endType == 3)
        {
            playNode.playAnimationWithDirection('dp', majiangFactory.serverChairId2Direction(cmdBaseWorker.wProvideUser))

            var hasCall = false
            for(var wChairID=0;wChairID<SERVER_CHAIR;wChairID++)
            {
                if(cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU)
                {
                    if(!hasCall)
                        hasCall = true
                    else
                        call = null
                    playNode.playAnimationWithDirection('hu', majiangFactory.serverChairId2Direction(wChairID), call)
                    playNode.playActionEffect(WIK_CHI_HU, tableData.getUserWithChairId(wChairID).cbGender)
                }
            }
        }
    },
    /////other ui end////////
    
    getSoundName:function(cardData) 
    {
        return cardData
    },
    playMajiangEffect:function(cardData, isMan)
    {
        var name = playNode.getSoundName(cardData)
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
    getActionPlayNodePos:function(direction)
    {
        var pos = {}
        switch(direction)
        {
            case 0://down
            {
                pos.x = 600
                pos.y = 200
                break
            }
            case 1://right
            {
                pos.x = 1050
                pos.y = 480
                break
            }
            case 2://up
            {
                pos.x = 600
                pos.y = 680  
                break
            }
            case 3://left
            {
                pos.x = 150
                pos.y = 480
                break
            }
        }  
        return pos
    },
    playAnimationWithDirection:function(name, direction, call)
    {
        if(!isOpenEffect)
        {
            call?call():''
            return; 
        }

        var spr = actionFactory.getSprWithAnimate(name + '_', true, 0.15, call)
        playNode.actionNode.addChild(spr)

        var pos = playNode.getActionPlayNodePos(direction)
        spr.x = pos.x
        spr.y = pos.y
    },
    playDiceForRandBanker:function(call, bankerDirection)
    {   
        var numBigger =  getRandNum(6, 12) 
        var numSmaller = getRandNum(5, numBigger-1) 
        var endNum1_banker =  getRandNum(Math.max(1, numBigger-6) , Math.min(6, numBigger-1))
        var endNum2_banker = numBigger - endNum1_banker

        function getEndNums(direction)
        {
            if(direction == bankerDirection)
                return [endNum1_banker, endNum2_banker]
            else
            {
                var endNum1_ubanker = getRandNum(Math.max(1, numSmaller-6), Math.min(6, numSmaller-1))
                var endNum2_ubanker = numSmaller - endNum1_ubanker  
                return [endNum1_ubanker, endNum2_ubanker]
            }
        }

        function playDice(direction)
        {
            var nums = getEndNums(direction)
            if(direction == 3)
                playNode.playDiceOneDirection(call, nums[0], nums[1], direction)
            else
                playNode.playDiceOneDirection(function()
                    {
                        playDice(direction+1)
                    }, nums[0], nums[1], direction)
        }

        playDice(0)
    },
    playDiceOneDirection:function(call, endNum1, endNum2, direction)
    {
        var w = playNode.diceNode.width
        var h = playNode.diceNode.height

        var sign = direction%2==0?1:-1

        var beginHOffset = 120*sign
        var sprPosY = direction%2==0?0+beginHOffset:h+beginHOffset


        var controlPoints1 = [
        cc.p(0.1*w, sprPosY+0.1*h*sign),
        cc.p(0.9*w, sprPosY+0.3*h*sign),
        cc.p(0.55*w, sprPosY+0.45*h*sign),
        ]
        var controlPoints2 = [
        cc.p(0.9*w, sprPosY+0.15*h*sign),
        cc.p(0.1*w, sprPosY+0.3*h*sign),
        cc.p(0.45*w, sprPosY+0.4*h*sign),
        ]


        var chairNode = tableNode['chairNode'+majiangFactory.direction2ShowChairId(direction)] 

        var diceSpr1 = dice.getThrowedDiceSpr(controlPoints1, endNum1, 1.2, function()
        {
            call?call():''
        }) 
        diceSpr1.x = chairNode.x
        diceSpr1.y = chairNode.y
        
        var diceSpr2 = dice.getThrowedDiceSpr(controlPoints2, endNum2, 1.2) 
        diceSpr2.x = chairNode.x
        diceSpr2.y = chairNode.y

        playNode.diceNode.addChild(diceSpr1)
        playNode.diceNode.addChild(diceSpr2)

        managerAudio.playEffect('gameRes/sound/dice.mp3') 
    },
    resetPlayNode:function()
    {
        playNode.mjsNode.removeAllChildren()
        playNode._removeSprsOnGameEnd()
        playNode.tingHuCardNode.setVisible(false)

        for(var wChairID=0;wChairID<SERVER_CHAIR;wChairID++)
        {
            tableNode.setBankerIcon(i, false)
        }
    },

    /////////////////处理吃碰杠 start///////////////
    getSortedActionsWithMask:function(acitonMask)
    {
        var actions = []

        if((acitonMask&WIK_REPLACE)!=0)
            actions[actions.length] = WIK_REPLACE

        if((acitonMask&WIK_RIGHT)!=0)
            actions[actions.length] = WIK_RIGHT

        if((acitonMask&WIK_CENTER)!=0)
            actions[actions.length] = WIK_CENTER

        if((acitonMask&WIK_LEFT)!=0)
            actions[actions.length] = WIK_LEFT

        if((acitonMask&WIK_PENG)!=0)
            actions[actions.length] = WIK_PENG

        if((acitonMask&WIK_MINGANG)!=0)
            actions[actions.length] = WIK_MINGANG
        
        if((acitonMask&WIK_ANGANG)!=0)
            actions[actions.length] = WIK_ANGANG
        
        if((acitonMask&WIK_PENGGANG)!=0)
            actions[actions.length] = WIK_PENGGANG

        if((acitonMask&WIK_LISTEN)!=0)
            actions[actions.length] = WIK_LISTEN

        if((acitonMask&WIK_CHI_HU)!=0)
            actions[actions.length] = WIK_CHI_HU

        return actions
    },
    wik2Name:function(WIK)
    {
        switch(WIK)
        {
            case WIK_LEFT:
                return 'chi'
            case WIK_CENTER:
                return 'chi'
            case WIK_RIGHT:
                return 'chi'
            case WIK_PENG:
                return 'peng'
            case WIK_MINGANG:
                return 'mingang'
            case WIK_ANGANG:
                return 'angang'    
            case WIK_PENGGANG:
                return 'penggang'
            case WIK_LISTEN:
                return 'ting'
            case WIK_CHI_HU:
                return 'hu'
            case WIK_REPLACE:
                return 'replace'
        }
    },
    playActionEffect:function(WIK, isMan)
    {
        var name = playNode.wik2Name(WIK) + (Math.ceil(Math.random()*10))%1      

        playNode.playGenderEffect(name, isMan)
    },
    playAction:function(WIK, user)
    {
        playNode.playActionEffect(WIK, user.cbGender)
        if( WIK & (WIK_LEFT|WIK_CENTER|WIK_RIGHT|WIK_PENG|WIK_MINGANG|WIK_ANGANG|WIK_PENGGANG
            ) )
        {
            managerAudio.playEffect('gameRes/sound/weave.mp3')
        }

        playNode.playAnimationWithDirection(playNode.wik2Name(WIK), majiangFactory.serverChairId2Direction(user.wChairID))
    },
    hideActionBtns:function()
    {
        playNode.chooseActionsNode.removeAllChildren() 

        playNode.btn_cancle.setVisible(false)
        playNode.btn_guo.setVisible(false)
        playNode.btn_chi.setVisible(false)
        playNode.btn_peng.setVisible(false)
        playNode.btn_mingang.setVisible(false)
        playNode.btn_angang.setVisible(false)
        playNode.btn_penggang.setVisible(false)
        playNode.btn_ting.setVisible(false)
        playNode.btn_hu.setVisible(false)

        if(playNode.isInChooseTingCardTime)
        {
            var event = new cc.EventCustom("cancleTing")
            cc.eventManager.dispatchEvent(event)  
            playNode.isInChooseTingCardTime = false
        }
    },
    showActionBtns:function(sortedActions)
    {
        for(var i=sortedActions.length-1;i>=0;i--)
        {
            if(sortedActions[i] == WIK_REPLACE)
            {
                var self = tableData.getUserWithUserId(selfdwUserID)
                var selfDir = majiangFactory.serverChairId2Direction( self.wChairID) 
                var handMajiangs = playNode.handMajiangs4D[selfDir]

                var handCardDatas = handMajiangs[1]?[handMajiangs[1].cardData]:[]
                for(var j=0;j<handMajiangs[0].length;j++)
                {
                    handCardDatas[handCardDatas.length] = handMajiangs[0][j].cardData
                }
                gameLogic.sortWithCardData(handCardDatas)

                var operateCards = []
                for(var j=0;j<handCardDatas.length;j++)
                {
                    if(gameLogic.isFlowerCard(handCardDatas[j], cmdBaseWorker.cbFlowerCardData))
                        operateCards[operateCards.length] = handCardDatas[j]

                } 
                cmdBaseWorker.sendMessage_operateCard(operateCards, WIK_REPLACE)
                return;
            }
        }

        playNode.btn_cancle.setVisible(false)
        playNode.btn_guo.setVisible(true)

        for(var i=sortedActions.length-1;i>=0;i--)
        {   
            var btn = null
            var action = sortedActions[i]
            if(action == WIK_CHI_HU)
                btn = playNode.btn_hu
            else if(action == WIK_LISTEN)
            {
                btn = playNode.btn_ting
                playNode.isInChooseTingCardTime = false
                btn.setSpriteFrame("btn_ting.png") 
            }
            else if(action == WIK_MINGANG)
            {
                btn = playNode.btn_mingang
            }
            else if(action == WIK_ANGANG)
            {
                btn = playNode.btn_angang
            }
            else if(action == WIK_PENGGANG)
            {
                btn = playNode.btn_penggang
            }
            else if(action == WIK_PENG)
                btn = playNode.btn_peng
            else if(action == WIK_LEFT || action == WIK_CENTER || action == WIK_RIGHT)
            {
                btn = playNode.btn_chi
                btn.actions = sortedActions.slice(0, i+1)
            }

            btn.setVisible(true)
            btn.setPositionX(-110 * (sortedActions.length-1-i +1))
            if(btn==playNode.btn_chi)
                break
        }
    },
    //actionChoose
    bindActionListener:function()
    {
        var bindListener = function(callFunc, node)
        {
            var listener = cc.EventListener.create
            ({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: false,
                onTouchBegan: function (touch, event) 
                {
                    var target = event.getCurrentTarget()
                    if(!target.isVisible()) return false
                    var locationInNode = target.convertToNodeSpace(touch.getLocation())
                    var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                    var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                    
                    if(isTouchInNode) {
                        return true
                    }
                    return false
                },
                onTouchEnded: function (touch, event) 
                {
                    var target = event.getCurrentTarget()
                    var locationInNode = target.convertToNodeSpace(touch.getLocation())
                    var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                    var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                    
                    if(isTouchInNode) 
                        callFunc()
                }
            })
            cc.eventManager.addListener(listener, node)
        }

        ////////////////////////吃////////////////////////
        var actionCall_chi = function()
        {
            var sendAction = function(sortedOperateCardDatas, action)
            {
                var operateCardDatas = []
                
                if(action == WIK_LEFT)
                {
                    operateCardDatas[0] = sortedOperateCardDatas[0]
                    operateCardDatas[1] = sortedOperateCardDatas[1]
                    operateCardDatas[2] = sortedOperateCardDatas[2]
                }
                else if(action == WIK_CENTER)
                {
                    operateCardDatas[0] = sortedOperateCardDatas[1]
                    operateCardDatas[1] = sortedOperateCardDatas[0]
                    operateCardDatas[2] = sortedOperateCardDatas[2]
                }
                else if(action == WIK_RIGHT)
                {
                    operateCardDatas[0] = sortedOperateCardDatas[2]
                    operateCardDatas[1] = sortedOperateCardDatas[0]
                    operateCardDatas[2] = sortedOperateCardDatas[1]
                }

                cmdBaseWorker.sendMessage_operateCard(operateCardDatas, action)
                playNode.hideActionBtns()
            }

            var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
            var direction = majiangFactory.serverChairId2Direction(selfChairId)
            var handCardDatas = playNode.getHandCardDatas(playNode.handMajiangs4D[direction])


            var weaveItems = gameLogic.analyseCard_Chi(handCardDatas, cmdBaseWorker.cbOutCardData)
            if(weaveItems.length>1)
            {
                playNode.btn_chi.setVisible(false)
                playNode.btn_peng.setVisible(false)
                playNode.btn_mingang.setVisible(false)
                playNode.btn_angang.setVisible(false)
                playNode.btn_penggang.setVisible(false)
                playNode.btn_ting.setVisible(false)
                playNode.btn_hu.setVisible(false)

                playNode.btn_guo.setVisible(false)
                playNode.btn_cancle.setVisible(true)

                playNode.showChooseActionPop(weaveItems, sendAction)
            }
            else
                sendAction(weaveItems[0].cbValidCardDatas, weaveItems[0].cbWeaveKind)
        }
        bindListener(actionCall_chi, playNode.btn_chi)

        ////////////////////////碰////////////////////////
        var actionCall_peng = function()
        {
            var sendAction = function(operateCardDatas)
            {
                cmdBaseWorker.sendMessage_operateCard(operateCardDatas, WIK_PENG )
                playNode.hideActionBtns()
            }

            var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
            var direction = majiangFactory.serverChairId2Direction(selfChairId)
            var handCardDatas = playNode.getHandCardDatas(playNode.handMajiangs4D[direction])

            var weaveItems = gameLogic.analyseCard_Peng(handCardDatas, cmdBaseWorker.cbOutCardData)
            if(weaveItems.length>1)
            {
                playNode.btn_chi.setVisible(false)
                playNode.btn_peng.setVisible(false)
                playNode.btn_mingang.setVisible(false)
                playNode.btn_angang.setVisible(false)
                playNode.btn_penggang.setVisible(false)
                playNode.btn_ting.setVisible(false)
                playNode.btn_hu.setVisible(false)

                playNode.btn_guo.setVisible(false)
                playNode.btn_cancle.setVisible(true)

                playNode.showChooseActionPop(weaveItems, sendAction)
            }
            else
                sendAction(weaveItems[0].cbValidCardDatas, weaveItems[0].cbWeaveKind)
        }
        bindListener(actionCall_peng, playNode.btn_peng)

        // ////////////////////////杠////////////////////////
        var actionCall_mingang = function()
        {
            var sendAction = function(operateCardDatas)
            {
                cmdBaseWorker.sendMessage_operateCard(operateCardDatas, WIK_MINGANG)
                playNode.hideActionBtns()
            }

            var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
            var direction = majiangFactory.serverChairId2Direction(selfChairId)
            var handCardDatas = playNode.getHandCardDatas(playNode.handMajiangs4D[direction])

            var weaveItems = gameLogic.analyseCard_MinGang(handCardDatas, cmdBaseWorker.cbOutCardData)
            if(weaveItems.length>1)
            {
                playNode.btn_chi.setVisible(false)
                playNode.btn_peng.setVisible(false)
                playNode.btn_mingang.setVisible(false)
                playNode.btn_angang.setVisible(false)
                playNode.btn_penggang.setVisible(false)
                playNode.btn_ting.setVisible(false)
                playNode.btn_hu.setVisible(false)

                playNode.btn_guo.setVisible(false)
                playNode.btn_cancle.setVisible(true)

                playNode.showChooseActionPop(weaveItems, sendAction)
            }
            else
                sendAction(weaveItems[0].cbValidCardDatas, weaveItems[0].cbWeaveKind)
        }
        bindListener(actionCall_mingang, playNode.btn_mingang)

        var actionCall_angang = function()
        {
            var sendAction = function(sortedOperateCardDatas)
            {
                cmdBaseWorker.sendMessage_operateCard(sortedOperateCardDatas, WIK_ANGANG)
                playNode.hideActionBtns()
            }

            var weaveItems = []
            if(cmdBaseWorker.bPlayerStatus[tableData.getUserWithUserId(selfdwUserID).wChairID][1])//听牌状态 暗杠只会判断摸上来的牌能不能暗杠 
            {
                var cardData = cmdBaseWorker.cbSendCardData
                var weaveItem = clone(tagWeaveItem)
                weaveItem.cbValidCardDatas = [cardData, cardData, cardData, cardData]
                weaveItem.cbWeaveKind = WIK_ANGANG
                weaveItems[weaveItems.length] = weaveItem
            }
            else
            {
                var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
                var direction = majiangFactory.serverChairId2Direction(selfChairId)
                var handCardDatas = playNode.getHandCardDatas(playNode.handMajiangs4D[direction])
                weaveItems = gameLogic.analyseCard_AnGang(handCardDatas)
            }

            if(weaveItems.length>1)
            {
                playNode.btn_chi.setVisible(false)
                playNode.btn_peng.setVisible(false)
                playNode.btn_mingang.setVisible(false)
                playNode.btn_angang.setVisible(false)
                playNode.btn_penggang.setVisible(false)
                playNode.btn_ting.setVisible(false)
                playNode.btn_hu.setVisible(false)

                playNode.btn_guo.setVisible(false)
                playNode.btn_cancle.setVisible(true)

                playNode.showChooseActionPop(weaveItems, sendAction)
            }
            else
                sendAction(weaveItems[0].cbValidCardDatas, weaveItems[0].cbWeaveKind) 
        }
        bindListener(actionCall_angang, playNode.btn_angang)

        var actionCall_penggang = function()
        {
            var sendAction = function(sortedOperateCardDatas)
            {
                cmdBaseWorker.sendMessage_operateCard(sortedOperateCardDatas, WIK_PENGGANG)
                playNode.hideActionBtns()
            }

            var weaveItems = []
            if(cmdBaseWorker.bPlayerStatus[tableData.getUserWithUserId(selfdwUserID).wChairID][1])//听牌状态 暗杠只会判断摸上来的牌能不能暗杠 
            {
                var weaveItem = clone(tagWeaveItem)
                weaveItem.cbValidCardDatas = [cmdBaseWorker.cbSendCardData]
                weaveItem.cbWeaveKind = WIK_PENGGANG
                weaveItems[weaveItems.length] = weaveItem
            }
            else
            {
                var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
                var direction = majiangFactory.serverChairId2Direction(selfChairId)
                var handCardDatas = playNode.getHandCardDatas(playNode.handMajiangs4D[direction])

                weaveItems = gameLogic.analyseCard_PengGang(cmdBaseWorker.WeaveItemArray[selfChairId], 
                    handCardDatas)
            }
            
            if(weaveItems.length>1)
            {
                playNode.btn_chi.setVisible(false)
                playNode.btn_peng.setVisible(false)
                playNode.btn_mingang.setVisible(false)
                playNode.btn_angang.setVisible(false)
                playNode.btn_penggang.setVisible(false)
                playNode.btn_ting.setVisible(false)
                playNode.btn_hu.setVisible(false)

                playNode.btn_guo.setVisible(false)
                playNode.btn_cancle.setVisible(true)

                playNode.showChooseActionPop(weaveItems, sendAction)
            }
            else
                sendAction(weaveItems[0].cbValidCardDatas, weaveItems[0].cbWeaveKind) 
        
        }
        bindListener(actionCall_penggang, playNode.btn_penggang)

        ////////////////////////胡////////////////////////
        var actionCall_hu = function()
        {
            var btn = playNode.btn_hu
            cmdBaseWorker.sendMessage_operateCard([], WIK_CHI_HU)
            playNode.hideActionBtns()
        }
        bindListener(actionCall_hu, playNode.btn_hu)

        ////////////////////////取消////////////////////////
        var actionCall_cancle = function()
        {
            var btn = playNode.btn_cancle
            playNode.chooseActionsNode.removeAllChildren() 

            var sortedActions = playNode.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
            playNode.showActionBtns(sortedActions)
        }
        bindListener(actionCall_cancle, playNode.btn_cancle)

        ////////////////////////过////////////////////////
        var actionCall_guo = function()
        {
            var btn = playNode.btn_guo
            cmdBaseWorker.sendMessage_operateCard([], WIK_NULL)
            playNode.hideActionBtns()  
        }
        bindListener(actionCall_guo, playNode.btn_guo)

        ////////////////////////补花////////////////////////
        var actionCall_replace = function()//不需要玩家手动触发 只要收到这个动作 自动执行
        {
            alert('actionCall_replace')  
        }

        ////////////////////////听////////////////////////
        var actionCall_ting = function()
        {
            if(!playNode.isInChooseTingCardTime)
            {
                var event = new cc.EventCustom("confirmTing")
                cc.eventManager.dispatchEvent(event)    
                playNode.btn_ting.setSpriteFrame("btn_buting.png") 
            }
            else
            {   
                var event = new cc.EventCustom("cancleTing")
                cc.eventManager.dispatchEvent(event)  
                playNode.btn_ting.setSpriteFrame("btn_ting.png") 
            }
            playNode.isInChooseTingCardTime = !playNode.isInChooseTingCardTime
        }
        bindListener(actionCall_ting, playNode.btn_ting)
    },
    showChooseActionPop:function(weaveItems, actionCall)
    {
        for(var i=0;i<weaveItems.length;i++)
        {
            var chooseActionMajiangs = playNode.weaveItem2ChooseActionMajiangs(weaveItems[i], actionCall)

            chooseActionMajiangs.x = ( i - (weaveItems.length-1)/2 ) * (playNode.chooseItemMjWidth*3 + 30)
            chooseActionMajiangs.y = 0
            playNode.chooseActionsNode.addChild(chooseActionMajiangs)
        }
    },
    weaveItem2ChooseActionMajiangs:function(weaveItem, actionCall)
    {    
        var chooseActionMajiangs = new cc.Node()
        
        var showDatas
        var provideCardData
        var name
        var iconIdx
        switch(weaveItem.cbWeaveKind)
        {
            case WIK_LEFT:
            {
                showDatas = weaveItem.cbValidCardDatas.slice(0, 3)
                provideCardData = showDatas[0]
                name = 'leftchi'
                iconIdx = 0
                break
            }
            case WIK_CENTER:
            {
                showDatas = weaveItem.cbValidCardDatas.slice(0, 3)
                provideCardData = showDatas[1]
                name = 'centerchi' 
                iconIdx = 1
                break
            }
            case WIK_RIGHT:
            {
                showDatas = weaveItem.cbValidCardDatas.slice(0, 3)
                provideCardData = showDatas[2]
                name = 'rightchi'    
                iconIdx = 2      
                break
            }
            case WIK_PENG:
            {
                showDatas = weaveItem.cbValidCardDatas.slice(0, 3)
                provideCardData = showDatas[0]
                name = 'peng'            
                iconIdx = 1
                break
            }
            case WIK_MINGANG:
            {
                showDatas = weaveItem.cbValidCardDatas.slice(0, 1)
                provideCardData = showDatas[0]
                name = 'mingang'   
                iconIdx = 0
                break
            }
            case WIK_ANGANG:
            {
                showDatas = weaveItem.cbValidCardDatas.slice(0, 1)
                provideCardData = showDatas[0]
                name = 'angang'          
                iconIdx = 0
                break
            }
            case WIK_PENGGANG:
            {
                showDatas = weaveItem.cbValidCardDatas.slice(0, 1)
                provideCardData = showDatas[0]
                name = 'penggang'          
                iconIdx = 0
                break
            }
        }
        
        var mjScale = 0
        var mjHeight = 0
        for(var i=0;i<showDatas.length;i++)
        {
            var cardData = showDatas[i]
            var where = {}
            where.name = 'hand'
            where.data = {idx:0}
            var mj = majiangFactory.getOne(cardData, 0, where)
            mj.isIgnoreDecorate = true
            mjHeight = mj.height
            mjScale = playNode.chooseItemMjWidth/mj.width

            mj.scale = mjScale
            mj.x = ( i - (showDatas.length-1)/2 )*playNode.chooseItemMjWidth
            mj.y = 0//mj.height*mjScale*0.5

            chooseActionMajiangs.addChild(mj)

            if(i == iconIdx)
            {
                var s = new cc.Sprite('#chooseIcon_'+ name + '.png')
                var zi = mj.getChildByTag(101)
                s.x = 0.5*s.width - 5
                s.y = 0.5*s.height + 5
                zi.addChild(s)

                mj.color = cc.color(122, 122, 122)
            }
        }

        ////////////////////////////
        var bg = new cc.Scale9Sprite('mf_chooseItemBg.png')
        bg.width = playNode.chooseItemMjWidth*showDatas.length + 10
        bg.height = mjHeight*mjScale + 10 
        bg.x = 0//bg.width/2
        bg.y = 0//bg.height/2
        bg.anchorX = 0.5
        bg.anchorY = 0.5
        chooseActionMajiangs.addChild(bg, -1)

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                if (isTouchInNode) {
                    return true
                }
                return false
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                if (isTouchInNode) {
                    playNode.chooseActionsNode.removeAllChildren()
                    actionCall?actionCall(weaveItem.cbValidCardDatas, weaveItem.cbWeaveKind):''
                }
            }
        })
        cc.eventManager.addListener(listener, bg)

        return chooseActionMajiangs
    },
    //actionResult
    onActionResult:function(action, operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    {
        if(action==WIK_MINGANG)
            playNode.onActionMinGang(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
        else if(action==WIK_ANGANG)
            playNode.onActionAnGang(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
        else if(action==WIK_PENGGANG)
            playNode.onActionPengGang(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
        else if(action == WIK_PENG)
            playNode.onActionPeng(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
        else if(action == WIK_LEFT)
            playNode.onActionChi(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
        else if(action == WIK_CENTER)
            playNode.onActionChi(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
        else if(action == WIK_RIGHT)
            playNode.onActionChi(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    },
    onActionMinGang:function(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    {
        var operateDir = majiangFactory.serverChairId2Direction( operateUserChairId) 
        var operateUser = tableData.getUserWithChairId(operateUserChairId)

        var provideDir = majiangFactory.serverChairId2Direction(provideUserChairId) 
        var provideUser = tableData.getUserWithChairId(provideUserChairId)

        var operateHandMajiangs = playNode.handMajiangs4D[operateDir]
        var operateHandGroupNode = playNode.handGroupNode4D[operateDir]

        majiangFactory.popDiscardMajiangs(playNode.discardMajiangs4D[provideDir])

        var addHandCardData = operateUser.dwUserID == selfdwUserID?provideCardData:0
        majiangFactory.addHandMajiang(operateHandMajiangs, operateDir, 
            addHandCardData, playNode.mjsNode, playNode.weaveMajiangs4D[operateDir].length)

        for(var i=0;i<4;i++)
        {
            var deleteCardData = operateUser.dwUserID == selfdwUserID?operateWeaveItem.cbValidCardDatas[i]:0
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, deleteCardData)
        }

        majiangFactory.updateWeaveMajiangs(playNode.weaveMajiangs4D[operateDir], operateDir, operateWeaveIdx, 
            operateWeaveItem, playNode.mjsNode)
 
        var newMajiang = operateHandMajiangs[1]
        if(newMajiang) 
        {
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, newMajiang.cardData)
            majiangFactory.addHandMajiang(operateHandMajiangs, operateDir, newMajiang.cardData, 
                playNode.mjsNode, playNode.weaveMajiangs4D[operateDir].length)
        } 
    },
    onActionAnGang:function(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    {
        var operateDir = majiangFactory.serverChairId2Direction( operateUserChairId) 
        var operateUser = tableData.getUserWithChairId(operateUserChairId)

        var provideDir = majiangFactory.serverChairId2Direction( provideUserChairId) 
        var provideUser = tableData.getUserWithChairId(provideUserChairId)

        var operateHandMajiangs = playNode.handMajiangs4D[operateDir]
        var operateHandGroupNode = playNode.handGroupNode4D[operateDir]

        for(var i=0;i<4;i++)
        {
            var deleteCardData = operateUser.dwUserID == selfdwUserID?operateWeaveItem.cbValidCardDatas[i]:0
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, deleteCardData)
        }

        majiangFactory.updateWeaveMajiangs(playNode.weaveMajiangs4D[operateDir], operateDir, operateWeaveIdx, 
            operateWeaveItem, playNode.mjsNode)

        var newMajiang = operateHandMajiangs[1]
        if(newMajiang) 
        {
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, newMajiang.cardData)
            majiangFactory.addHandMajiang(operateHandMajiangs, operateDir, newMajiang.cardData, 
                playNode.mjsNode, playNode.weaveMajiangs4D[operateDir].length)
        } 
    },
    onActionPengGang:function(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    {
        var operateDir = majiangFactory.serverChairId2Direction( operateUserChairId) 
        var operateUser = tableData.getUserWithChairId(operateUserChairId)

        var provideDir = majiangFactory.serverChairId2Direction(provideUserChairId) 
        var provideUser = tableData.getUserWithChairId(provideUserChairId)

        var operateHandMajiangs = playNode.handMajiangs4D[operateDir]
        var operateHandGroupNode = playNode.handGroupNode4D[operateDir]

        for(var i=0;i<1;i++)
        {
            var deleteCardData = operateUser.dwUserID == selfdwUserID?operateWeaveItem.cbValidCardDatas[i]:0
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, deleteCardData)
        }
        majiangFactory.updateWeaveMajiangs(playNode.weaveMajiangs4D[operateDir], operateDir, operateWeaveIdx, 
            operateWeaveItem, playNode.mjsNode)       
   
        var newMajiang = operateHandMajiangs[1]
        if(newMajiang) 
        {
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, newMajiang.cardData)
            majiangFactory.addHandMajiang(operateHandMajiangs, operateDir, newMajiang.cardData, 
                playNode.mjsNode, playNode.weaveMajiangs4D[operateDir].length)
        } 
    },
    onActionPeng:function(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    {        
        var operateDir = majiangFactory.serverChairId2Direction( operateUserChairId) 
        var operateUser = tableData.getUserWithChairId(operateUserChairId)

        var provideDir = majiangFactory.serverChairId2Direction( provideUserChairId) 
        var provideUser = tableData.getUserWithChairId(provideUserChairId)

        var operateHandMajiangs = playNode.handMajiangs4D[operateDir]
        var operateHandGroupNode = playNode.handGroupNode4D[operateDir]


        majiangFactory.popDiscardMajiangs(playNode.discardMajiangs4D[provideDir])

        var addHandCardData = operateUser.dwUserID == selfdwUserID?provideCardData:0
        majiangFactory.addHandMajiang(operateHandMajiangs, operateDir, 
            addHandCardData, playNode.mjsNode, playNode.weaveMajiangs4D[operateDir].length)

        for(var i=0;i<3;i++)
        {
            var deleteCardData = operateUser.dwUserID == selfdwUserID?operateWeaveItem.cbValidCardDatas[i]:0
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, deleteCardData)
        }
        var oldMajiangs = operateHandMajiangs[0]
        var maxRightCardData = oldMajiangs[oldMajiangs.length-1].cardData
        majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, maxRightCardData)
        majiangFactory.addHandMajiangNew(operateHandMajiangs, operateDir, maxRightCardData, playNode.mjsNode)


        majiangFactory.updateWeaveMajiangs(playNode.weaveMajiangs4D[operateDir], operateDir, operateWeaveIdx, 
            operateWeaveItem, playNode.mjsNode)
    },
    onActionChi:function(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    {        
        var operateDir = majiangFactory.serverChairId2Direction( operateUserChairId) 
        var operateUser = tableData.getUserWithChairId(operateUserChairId)

        var provideDir = majiangFactory.serverChairId2Direction( provideUserChairId)
        var provideUser = tableData.getUserWithChairId(provideUserChairId)

        var operateHandMajiangs = playNode.handMajiangs4D[operateDir]
        var operateHandGroupNode = playNode.handGroupNode4D[operateDir]

        majiangFactory.popDiscardMajiangs(playNode.discardMajiangs4D[provideDir])

        var addHandCardData = operateUser.dwUserID == selfdwUserID?provideCardData:0
        majiangFactory.addHandMajiang(operateHandMajiangs, operateDir, 
            addHandCardData, playNode.mjsNode, playNode.weaveMajiangs4D[operateDir].length)

        for(var i=0;i<3;i++)
        {
            var deleteCardData = operateUser.dwUserID == selfdwUserID?operateWeaveItem.cbValidCardDatas[i]:0
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, deleteCardData)
        }

        var oldMajiangs = operateHandMajiangs[0]
        var maxRightCardData = oldMajiangs[oldMajiangs.length-1].cardData
        majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, maxRightCardData)
        majiangFactory.addHandMajiangNew(operateHandMajiangs, operateDir, maxRightCardData, playNode.mjsNode)

        majiangFactory.updateWeaveMajiangs(playNode.weaveMajiangs4D[operateDir], operateDir, operateWeaveIdx, 
            operateWeaveItem, playNode.mjsNode)
    },
    /////////////////处理吃碰杠 end///////////////

    //检测手牌是否全变不可出状态 有的麻将规则存在漏洞
    //onCMD_StatusPlay onCMD_SendCard onCMD_OperateResult
    checkHandCardTouch:function(direction)
    {
        var handMajiangs = playNode.handMajiangs4D[direction]
        var isAllUnTouch = true

        if(handMajiangs[1] && handMajiangs[1].touchEnable)
            isAllUnTouch = false
        else
        {
           for(var i=0;i<handMajiangs[0].length;i++)
           {
                if(handMajiangs[0][i].touchEnable)
                {
                    isAllUnTouch = false
                    break
                }
           }
        }

        if(isAllUnTouch)
        {
            mj = handMajiangs[1]?handMajiangs[1]:handMajiangs[0][0]
            mj.touchEnable = true
            mj.color = cc.color(255, 255, 255)      
        }
    },
    getHandCardDatas:function(handMajiangs)
    {
        var handCardDatas = handMajiangs[1]?[handMajiangs[1].cardData]:[]
        for(var i=0;i<handMajiangs[0].length;i++)
        {
            handCardDatas[handCardDatas.length] = handMajiangs[0][i].cardData
        }

        return handCardDatas
    },
    getDiscardCardDatas:function(discardMajiangs4D)
    {
        var discardCardDatas = []

        for(var i=0;i<4;i++)
        {
            var discardMajiangs = discardMajiangs4D[i]
            for(var j=0;j<discardMajiangs.length;j++)
            {
                discardCardDatas[discardCardDatas.length] = discardMajiangs[j].cardData
            }
        }

        return discardCardDatas
    },
    getWeaveCardDatas:function(cbWeaveCount4D, WeaveItemArray4D)
    {
        var weaveCardDatas = []

        for(var i=0;i<4;i++)
        {
            var weaveCount = cbWeaveCount4D[i]
            var weaveItems = WeaveItemArray4D[i] 
            for(var j=0;j<weaveCount;j++)
            {
                weaveCardDatas = weaveCardDatas.concat(weaveItems[j].cbValidCardDatas)
            }
        }

        return weaveCardDatas
    },
    // weaveItem2Majiangs:function(operateDirection, weaveIdx, weaveItem, isPublicAnGang)
    // {
    //      var cbValidCardDatas = weaveItem.cbValidCardDatas
    //     var wProvideUser = weaveItem.wProvideUser
    //     var provideShowChairId = tableData.getShowChairIdWithServerChairId(wProvideUser)
    //     var provideDirection = majiangFactory.showChairId2Direction(provideShowChairId)

    //     var operateUser = tableData.getServerChairIdWithShowChairId(operateDirection)

    //     var arrowIdx = -1
    //     if(provideDirection!=operateDirection)
    //     {
    //         if(weaveItem.cbWeaveKind == WIK_LEFT)
    //             arrowIdx = 0
    //         else if(weaveItem.cbWeaveKind == WIK_CENTER)
    //             arrowIdx = 1
    //         else if(weaveItem.cbWeaveKind == WIK_RIGHT)
    //             arrowIdx = 2      
    //         else if(weaveItem.cbWeaveKind == WIK_PENG)
    //             arrowIdx = 1    
    //         else if(weaveItem.cbWeaveKind&(WIK_MINGANG|WIK_ANGANG|WIK_PENGGANG))
    //             arrowIdx = 3   
    //     }
 
    //     var majiangs = []
    //     for(var i=0;i<cbValidCardDatas.length;i++)
    //     {
    //         var cardData = cbValidCardDatas[i]
    //         if(weaveItem.cbWeaveKind==WIK_ANGANG)
    //         {
    //             if(i<3)
    //                 cardData = 0
    //             else if( tableData.getUserWithUserId(selfdwUserID).wChairID!=operateUser && !isPublicAnGang)
    //                 cardData = 0
    //         }
    //         var where = {}
    //         where.name = 'weave'
    //         where.data = {weaveIdx:weaveIdx, idxInWeave:i}
    //         var mj = majiangFactory.getOne(cardData, operateDirection, where)

    //         if(i == arrowIdx)
    //         {
    //             var zi = mj.getChildByTag(101)
    //             var directionSpr = new cc.Sprite('#mf_weaveDirection.png')
    //             directionSpr.setRotation(180-provideDirection*90 - zi.getRotation())

    //             directionSpr.x = zi.width*0.5
    //             directionSpr.y = zi.height*0.5
    //             zi.addChild(directionSpr, 0, 101)
    //         }

    //         majiangs[majiangs.length] = mj
    //     }  
    //     majiangs.weaveItem = weaveItem

    //     return majiangs
    // },
    // getHeapCardDatasArray:function(cbHeapCardInfo, TurnoverCard, kaiGangHeapCardInfo)
    // {
    //     var heapCardDatasArray = []//这个数组以头部方向为准 
    //     if(!majiangFactory.isShowHeap)
    //     {
    //         for(i=0;i<SERVER_CHAIR;i++)
    //         {
    //             heapCardDatasArray[i] = []
    //         }
    //         return heapCardDatasArray;
    //     }

    //     var heapCardDatasArray = []
    //     for(var direction=0;direction<4;direction++)
    //     {
    //         var direction = majiangFactory.showChairId2Direction(showChairId) 
    //         if(typeof(direction) != 'number')
    //             continue
    //         var serverChairId = tableData.getServerChairIdWithShowChairId(showChairId)

    //         heapCardDatasArray[direction] = []
    //         var wMinusHeadCount = cbHeapCardInfo[serverChairId][0]//从头部方向摸走的麻将数
    //         var wMinusLastCount = cbHeapCardInfo[serverChairId][1]//从尾部方向摸走的麻将数
                
    //         for(var j=0;j<HEAP_FULL_COUNT;j++)
    //         {
    //             //是否已经从头部方向摸走这张
    //             var hasSendFromHead = j<wMinusHeadCount
    //             //是否已经从尾部部方向摸走这张
    //             var hasSendFromTail = false
    //             if(!hasSendFromHead)
    //             {
    //                 var isUpMj = j%2==0
    //                 var isExist 
    //                 if(isUpMj)
    //                     isExist = (j+1)+1+wMinusLastCount<=HEAP_FULL_COUNT
    //                 else
    //                     isExist = j+wMinusLastCount<=HEAP_FULL_COUNT
    //                 hasSendFromTail = !isExist
    //             }
    //             if(hasSendFromHead||hasSendFromTail)
    //                 heapCardDatasArray[direction][j] = HAS_DISPATCH_CARD_DATA
    //             else
    //                 heapCardDatasArray[direction][j] = 0
    //         }
    //     }

    //     for(var i=0;i<TURNOVER_COUNT_MAGIC;i++ )//可能翻得牌没摸走的话 就翻开显示
    //     {
    //         var cardHeapFenwei = tableData.getShowChairIdWithServerChairId(TurnoverCard[i].heapIdx.wHeapFenwei)
    //         var cardHeapPos = TurnoverCard[i].heapIdx.wHeapPos
    //         var cardData = TurnoverCard[i].cbCardData

    //         if(heapCardDatasArray[cardHeapFenwei][cardHeapPos] == 0)
    //             heapCardDatasArray[cardHeapFenwei][cardHeapPos] = HAS_DISPATCH_CARD_DATA//cbTurnoverCardData
    //     }

    //     return heapCardDatasArray
    // },
    getHeapCardDatasArray:function(cbHeapCardInfo, TurnoverCard)
    {
        var heapCardDatasArray = []//这个数组以头部方向为准 
        if(!majiangFactory.isShowHeap)
        {
            for(i=0;i<4;i++)
            {
                heapCardDatasArray[i] = []
            }
            return heapCardDatasArray;
        }

        var heapCardDatasArray = []
        for(var direction=0;direction<4;direction++)
        {
            var fenwei = majiangFactory.direction2Fenwei(direction)
            heapCardDatasArray[direction] = []
            var wMinusHeadCount = cbHeapCardInfo[fenwei][0]//从头部方向摸走的麻将数
            var wMinusLastCount = cbHeapCardInfo[fenwei][1]//从尾部方向摸走的麻将数
                
            for(var j=0;j<HEAP_FULL_COUNT;j++)
            {
                //是否已经从头部方向摸走这张
                var hasSendFromHead = j<wMinusHeadCount
                //是否已经从尾部部方向摸走这张
                var hasSendFromTail = false
                if(!hasSendFromHead)
                {
                    var isUpMj = j%2==0
                    var isExist 
                    if(isUpMj)
                        isExist = (j+1)+1+wMinusLastCount<=HEAP_FULL_COUNT
                    else
                        isExist = j+wMinusLastCount<=HEAP_FULL_COUNT
                    hasSendFromTail = !isExist
                }
                if(hasSendFromHead||hasSendFromTail)
                    heapCardDatasArray[direction][j] = HAS_DISPATCH_CARD_DATA
                else
                    heapCardDatasArray[direction][j] = 0
            }
        }

        for(var i=0;i<TURNOVER_COUNT_MAGIC;i++ )
        {
            var wTurnoverCardHeapFenwei = TurnoverCard[i].heapIdx.wHeapFenwei
            var wTurnoverCardHeapPos = TurnoverCard[i].heapIdx.wHeapPos
            var cbTurnoverCardData = TurnoverCard[i].cbCardData
            
            var wTurnoverCardHeapDir = majiangFactory.direction2Fenwei(wTurnoverCardHeapFenwei)
            if(heapCardDatasArray[wTurnoverCardHeapDir][wTurnoverCardHeapPos] == 0)//可能翻得牌没摸走的话 就翻开显示
                heapCardDatasArray[wTurnoverCardHeapDir][wTurnoverCardHeapPos] = HAS_DISPATCH_CARD_DATA
        }

        return heapCardDatasArray
    },

}
