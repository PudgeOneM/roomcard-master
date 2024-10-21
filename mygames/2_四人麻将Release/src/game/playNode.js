
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

        playNode.gamesetNode.setVisible(false)
        // playNode.tingHuCardNode.setVisible(false)

        majiangFactory.getHeapCardDatasArray = playNode.getHeapCardDatasArray
        majiangFactory.weaveItem2Majiangs = playNode.weaveItem2Majiangs
        majiangFactory.isShowHeap = true
        majiangFactory.isPublicAnGang = true
        majiangFactory.heapCountOneRow = 26
        majiangFactory.init( playNode.mjTableNode, playNode.decorateMj )

        /////chooseActionsNode
        playNode.chooseActionsNode = new cc.Node()
        playNode.chooseActionsNode.x = majiangFactory.mjTableNode.width*0.5
        playNode.chooseActionsNode.y = majiangFactory.scale_upDown*majiangFactory.down_handHeight + majiangFactory.scale_upDown*playNode.chooseItemMjScale*majiangFactory.down_handHeight*0.5 + 30 

        majiangFactory.mjTableNode.addChild(playNode.chooseActionsNode)


        playNode.currentMjPoint = actionFactory.getSprWithAnimate('mf_currentMj_', false, 0.4)
        playNode.currentMjPoint.x = -1000
        majiangFactory.mjTableNode.addChild(playNode.currentMjPoint)






        // /////currentDiscardMjNode
        // var currentDiscardMjNode = new cc.Node()

        // var bg = new cc.Scale9Sprite('mf_currentDiscardMjBg.png')
        // bg.width = majiangFactory.scale_upDown*majiangFactory.down_handWidth*playNode.currentDiscardMjScale + 10
        // bg.height = majiangFactory.scale_upDown*majiangFactory.down_handHeight*playNode.currentDiscardMjScale + 10 
        // bg.x = 0
        // bg.y = 0
        // bg.anchorX = 0.5
        // bg.anchorY = 0.5
        // currentDiscardMjNode.addChild(bg)

        // var mj = majiangFactory.getOne(1, 0, 0, true)
        // mj.setCascadeOpacityEnabled(true)

        // mj.setScale(majiangFactory.scale_upDown*playNode.currentDiscardMjScale)
        // currentDiscardMjNode.addChild(mj, 0, 101)

        // currentDiscardMjNode.x = -1000
        // currentDiscardMjNode.setVisible(false)
        // majiangFactory.mjTableNode.addChild(currentDiscardMjNode)

        // playNode.currentDiscardMjNode = currentDiscardMjNode

        playNode.timer = majiangTimer4D.getTimer()
        playNode.timerNode.addChild(playNode.timer)
        playNode.timerNode.setContentSize(playNode.timer.width, playNode.timer.height)
        playNode.timerNode.setScale( majiangFactory.scale_upDown )



      // var UpdateLocation = getObjWithStructName('CMD_GR_UpdateLocation')
      // UpdateLocation.dwUserID = selfdwUserID
      // UpdateLocation.szLatitude = '116.39622'
      // UpdateLocation.szLongitude = '39.934412'
      // socket.sendMessage(MDM_GR_LOGON, SUB_GR_UPDATE_LOCATION, UpdateLocation)

        cocos.setTimeout(playNode.registWxShareMenu, 1000)
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
        
        currentRoundNode.flowerMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.flowerMajiangsNode )

        currentRoundNode.heapMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.heapMajiangsNode )

        //单个方向的丢弃麻将精灵父节点
        currentRoundNode.discardMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.discardMajiangsNode)

        //单个方向的吃碰杠麻将精灵父节点
        currentRoundNode.weaveMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.weaveMajiangsNode )

        //单个方向的手牌麻将精灵父节点 的 父节点
        currentRoundNode.handMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.handMajiangsNode )

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
        currentRoundNode.handMajiangsNode.removeAllChildren()
        currentRoundNode.discardMajiangsNode.removeAllChildren()
        currentRoundNode.weaveMajiangsNode.removeAllChildren()
        currentRoundNode.heapMajiangsNode.removeAllChildren()
        currentRoundNode.flowerMajiangsNode.removeAllChildren()
        currentRoundNode.scoreChange.removeAllChildren()
        currentRoundNode.upTTF.setString('')
        currentRoundNode.playerStatusNode.removeAllChildren()
    },
    setCurrentRoundMajiangsVisible:function(isVisible)
    {
        var users = tableData.getUsersInTable( tableData.getUserWithUserId(selfdwUserID).wTableID )
        for(var i in users)
        {
            users[i].userNodeInsetChair.currentRoundNode.flowerMajiangsNode.setVisible(isVisible)
            users[i].userNodeInsetChair.currentRoundNode.heapMajiangsNode.setVisible(isVisible)
            users[i].userNodeInsetChair.currentRoundNode.discardMajiangsNode.setVisible(isVisible)
            users[i].userNodeInsetChair.currentRoundNode.weaveMajiangsNode.setVisible(isVisible)
            users[i].userNodeInsetChair.currentRoundNode.handMajiangsNode.setVisible(isVisible)
        }
    },
    updateCurrentRoundNode:function(currentRoundNode, userId)
    {
        var user = tableData.getUserWithUserId(userId)
        var showChairId = tableData.getShowChairIdWithServerChairId(user.wChairID)

        currentRoundNode.upTTF.setPositionY(65)

        var chairNode = tableData.getChairWithShowChairId(showChairId).node
        var chairNodeWorldPos = tableNode.uiChair.convertToWorldSpace(chairNode.getPosition())
        var chairNodePosInMjTable = playNode.mjTableNode.convertToNodeSpace(chairNodeWorldPos)

        var centerPosX = playNode.timerNode.x
        var centerPosY = playNode.timerNode.y
        var upHandHeight = majiangFactory.up_handHeight*majiangFactory.scale_upDown
        var downHandHeight = majiangFactory.down_handHeight*majiangFactory.scale_upDown
        var leftRightHandWidth = majiangFactory.left_handWidth*majiangFactory.scale_rightLeft

        // var handWidth_down = (majiangFactory.handCountOneRow*majiangFactory.downHandIntervalX + majiangFactory.downMjAndNewMjInterval)*majiangFactory.scale_upDown
        var handHeght_rightLeft = (majiangFactory.handCountOneRow*majiangFactory.rightHandIntervalY + majiangFactory.rightMjAndNewMjInterval) * majiangFactory.scale_rightLeft
        var distanceHandFromDown = (majiangFactory.mjTableNode.height-upHandHeight-downHandHeight-handHeght_rightLeft)

        var distanceHandFromBorder_rightLeft = majiangFactory.borderDistance_rightLeft + leftRightHandWidth


        var heapsWidth_upDown = HEAP_FULL_COUNT/2*majiangFactory.up_heapWidth*majiangFactory.scale_heap
        var heapsHeight_rightLeft = HEAP_FULL_COUNT/2*majiangFactory.rightHeapIntervalY*majiangFactory.scale_heap + majiangFactory.rightHeapOffset*majiangFactory.scale_heap 

        var direction = showChairid = tableData.getShowChairIdWithServerChairId(user.wChairID)
        //设置三处四方向的麻将位置 
        if(direction==0)
        {
            currentRoundNode.scoreChange.setPosition( cc.p(100, 30) )  
            
            currentRoundNode.playerStatusNode.setPosition( cc.p(40, 20) )  
            //discard
            var discardMajiangsNodeWidth = (majiangFactory.discardCountOneRow-1)*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
            var mjsDiscardHeight = majiangFactory.down_discardHeight*majiangFactory.scale_upDown

            //-chairNodePosInMjTable.x相当于从posx=0开始算起
            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + 
            0.5*( majiangFactory.mjTableNode.width - discardMajiangsNodeWidth)
            currentRoundNode.discardMajiangsNode.y = -chairNodePosInMjTable.y + centerPosY - mjsDiscardHeight*0.5 - playNode.timerNode.height/2*majiangFactory.scale_upDown
            currentRoundNode.discardMajiangsNode.setLocalZOrder(1)
            //hand
            var mjsWidth = majiangFactory.down_handWidth*majiangFactory.scale_upDown
            currentRoundNode.handMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width
            currentRoundNode.handMajiangsNode.y = -chairNodePosInMjTable.y + downHandHeight*0.5
            currentRoundNode.handMajiangsNode.setLocalZOrder(3)
            //weave
            currentRoundNode.weaveMajiangsNode.x = -chairNodePosInMjTable.x
            currentRoundNode.weaveMajiangsNode.y = currentRoundNode.handMajiangsNode.y
            currentRoundNode.discardMajiangsNode.setLocalZOrder(2)

            //heap
            currentRoundNode.heapMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - distanceHandFromBorder_rightLeft - leftRightHandWidth*0.5 - majiangFactory.downHeapFromHandX*majiangFactory.scale_upDown
            // currentRoundNode.heapMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - (majiangFactory.mjTableNode.width-heapsWidth_upDown)*0.5
            currentRoundNode.heapMajiangsNode.y = -chairNodePosInMjTable.y + downHandHeight + majiangFactory.downHeapFromHandY*majiangFactory.scale_rightLeft
            currentRoundNode.heapMajiangsNode.setLocalZOrder(2)
        
            //flower
            currentRoundNode.flowerMajiangsNode.x = -chairNodePosInMjTable.x + distanceHandFromBorder_rightLeft 
            + leftRightHandWidth*0.5 + majiangFactory.leftHeapFromHandX*majiangFactory.scale_upDown 
            + majiangFactory.left_heapWidth*majiangFactory.scale_heap 
            + 5*majiangFactory.scale_upDown 
            currentRoundNode.flowerMajiangsNode.y = currentRoundNode.heapMajiangsNode.y
            currentRoundNode.flowerMajiangsNode.setLocalZOrder(2)
        }
        else if(direction==2)
        {       
            currentRoundNode.scoreChange.setPosition( cc.p(-70, -30) )  
            
            currentRoundNode.playerStatusNode.setPosition( cc.p(-40, 20) )  
            //discard
            var discardMajiangsNodeWidth = (majiangFactory.discardCountOneRow-1)*majiangFactory.up_discardWidth*majiangFactory.scale_upDown
            var mjsDiscardHeight = majiangFactory.up_discardHeight*majiangFactory.scale_upDown

            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - 
            0.5*( majiangFactory.mjTableNode.width - discardMajiangsNodeWidth)
            currentRoundNode.discardMajiangsNode.y =  -chairNodePosInMjTable.y + centerPosY + mjsDiscardHeight*0.5 + playNode.timerNode.height/2*majiangFactory.scale_upDown
            currentRoundNode.discardMajiangsNode.setLocalZOrder(3)

            //hand
            var mjsWidth = majiangFactory.up_handWidth*majiangFactory.scale_upDown
            var handMjsWidth = MAX_COUNT*mjsWidth + majiangFactory.upMjAndNewMjInterval
            var w = (majiangFactory.mjTableNode.width - handMjsWidth)/2
            currentRoundNode.handMajiangsNode.x = -chairNodePosInMjTable.x + w
            currentRoundNode.handMajiangsNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight*0.5
            currentRoundNode.handMajiangsNode.setLocalZOrder(1)

            //weave
            currentRoundNode.weaveMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - (majiangFactory.mjTableNode.width - handMjsWidth)/2
            currentRoundNode.weaveMajiangsNode.y = currentRoundNode.handMajiangsNode.y
            currentRoundNode.weaveMajiangsNode.setLocalZOrder(1)

            //heap
            currentRoundNode.heapMajiangsNode.x = -chairNodePosInMjTable.x + distanceHandFromBorder_rightLeft + leftRightHandWidth*0.5 + majiangFactory.upHeapFromHandX*majiangFactory.scale_upDown
            // currentRoundNode.heapMajiangsNode.x = -chairNodePosInMjTable.x + (majiangFactory.mjTableNode.width-heapsWidth_upDown)*0.5
            currentRoundNode.heapMajiangsNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight - majiangFactory.upHeapFromHandY*majiangFactory.scale_rightLeft
            currentRoundNode.heapMajiangsNode.setLocalZOrder(2)

            //flower
            currentRoundNode.flowerMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width
            - distanceHandFromBorder_rightLeft - leftRightHandWidth*0.5
            - majiangFactory.rightHeapFromHandX*majiangFactory.scale_upDown 
            - majiangFactory.right_heapWidth*majiangFactory.scale_heap 
            - 5*majiangFactory.scale_upDown 
            currentRoundNode.flowerMajiangsNode.y = currentRoundNode.heapMajiangsNode.y - 
            (majiangFactory.up_heapHeight+majiangFactory.upHeapOffset)*majiangFactory.scale_heap
            currentRoundNode.flowerMajiangsNode.setLocalZOrder(2)
        } 
        else if(direction==1)
        { 
            currentRoundNode.scoreChange.setPosition( cc.p(-150, -50) )  

            currentRoundNode.playerStatusNode.setPosition( cc.p(-40, 20) )  
            //discard
            var downDiscardMajiangsNodeWidth = majiangFactory.discardCountOneRow*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
            var discardMajiangsNodeHeight = (majiangFactory.discardCountOneLine-1)*majiangFactory.rightDiscardIntervalY*majiangFactory.scale_rightLeft
            var distanceFromUpDown = 0.5*(majiangFactory.mjTableNode.height - downHandHeight - upHandHeight - discardMajiangsNodeHeight)

            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - 
            0.5*( majiangFactory.mjTableNode.width - downDiscardMajiangsNodeWidth ) + (10 + 0.5*majiangFactory.right_discardWidth*majiangFactory.scale_rightLeft)
            currentRoundNode.discardMajiangsNode.y =  -chairNodePosInMjTable.y + downHandHeight + distanceFromUpDown

            //hand
            currentRoundNode.handMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width -distanceHandFromBorder_rightLeft
            currentRoundNode.handMajiangsNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight
            
            //weave
            currentRoundNode.weaveMajiangsNode.x = currentRoundNode.handMajiangsNode.x 
            currentRoundNode.weaveMajiangsNode.y = -chairNodePosInMjTable.y + downHandHeight + distanceHandFromDown

            //heap
            currentRoundNode.heapMajiangsNode.x = currentRoundNode.handMajiangsNode.x - leftRightHandWidth*0.5 - majiangFactory.rightHeapFromHandX*majiangFactory.scale_upDown
            currentRoundNode.heapMajiangsNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight - majiangFactory.rightHeapFromHandY*majiangFactory.scale_rightLeft
            // currentRoundNode.heapMajiangsNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight - (majiangFactory.mjTableNode.height - upHandHeight - downHandHeight - heapsHeight_rightLeft)*0.5
        
            //flower
            currentRoundNode.flowerMajiangsNode.x = currentRoundNode.heapMajiangsNode.x - majiangFactory.right_heapWidth*majiangFactory.scale_heap
            currentRoundNode.flowerMajiangsNode.y = -chairNodePosInMjTable.y + downHandHeight
            + majiangFactory.downHeapFromHandY*majiangFactory.scale_rightLeft
            + (majiangFactory.down_heapHeight+majiangFactory.downHeapOffset)*majiangFactory.scale_heap
            + 5*majiangFactory.scale_rightLeft 
        }
        else if(direction==3)
        {   
            currentRoundNode.scoreChange.setPosition( cc.p(100, 30) )  
           
            currentRoundNode.playerStatusNode.setPosition( cc.p(40, 20) )  
            //discard
            var downDiscardMajiangsNodeWidth = majiangFactory.discardCountOneRow*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
            var discardMajiangsNodeHeight = (majiangFactory.discardCountOneLine-1)*majiangFactory.leftDiscardIntervalY*majiangFactory.scale_rightLeft
            var distanceFromUpDown = 0.5*(majiangFactory.mjTableNode.height - downHandHeight - upHandHeight - discardMajiangsNodeHeight)

            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x +
            0.5*( majiangFactory.mjTableNode.width - downDiscardMajiangsNodeWidth )  - (10 + 0.5*majiangFactory.left_discardWidth*majiangFactory.scale_rightLeft)
            currentRoundNode.discardMajiangsNode.y =  -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight - distanceFromUpDown

            //hand
            currentRoundNode.handMajiangsNode.x = -chairNodePosInMjTable.x + distanceHandFromBorder_rightLeft
            currentRoundNode.handMajiangsNode.y = -chairNodePosInMjTable.y +  downHandHeight + distanceHandFromDown
            //weave
            currentRoundNode.weaveMajiangsNode.x = currentRoundNode.handMajiangsNode.x 
            currentRoundNode.weaveMajiangsNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight
        
            //heap
            currentRoundNode.heapMajiangsNode.x = currentRoundNode.handMajiangsNode.x + leftRightHandWidth*0.5 + majiangFactory.leftHeapFromHandX*majiangFactory.scale_upDown
            currentRoundNode.heapMajiangsNode.y = -chairNodePosInMjTable.y + downHandHeight + majiangFactory.leftHeapFromHandY*majiangFactory.scale_rightLeft
            // currentRoundNode.heapMajiangsNode.y = -chairNodePosInMjTable.y + downHandHeight + (majiangFactory.mjTableNode.height - upHandHeight - downHandHeight - heapsHeight_rightLeft)*0.5
        
            //flower
            currentRoundNode.flowerMajiangsNode.x = currentRoundNode.heapMajiangsNode.x + majiangFactory.left_heapWidth*majiangFactory.scale_heap
            currentRoundNode.flowerMajiangsNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height
            - upHandHeight
            - majiangFactory.upHeapFromHandY*majiangFactory.scale_rightLeft
            - (majiangFactory.up_heapHeight+majiangFactory.upHeapOffset)*majiangFactory.scale_heap
            - 5*majiangFactory.scale_rightLeft 
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
        var cardData = mj.cardData 
        if( gameLogic.isMagicCard(mj.cardData, cmdBaseWorker.cbMagicCardData) ) 
        {
            var s = new cc.Sprite("#caiShen.png")
            var zi = mj.getChildByTag(101)
            if(zi)
            {
                if(mj.direction == 1)
                {
                    var mjWPosX = mj.convertToWorldSpace(cc.p(mj.width,0)).x
                    var ziWPosX = zi.convertToWorldSpace(cc.p(0,0)).x


                    var ziCenterWPos = zi.convertToWorldSpace(cc.p(0.5*zi.width,0.5*zi.height))
                    var caiShenPosInZi = zi.convertToNodeSpace(cc.p(ziCenterWPos.x+(mjWPosX-ziWPosX), ziCenterWPos.y))

                    s.x = caiShenPosInZi.x - 5
                    s.y = caiShenPosInZi.y + 5
                }
                else if(mj.direction == 3)
                {
                    var mjWPosX = mj.convertToWorldSpace(cc.p(0,0)).x
                    var ziWPosX = zi.convertToWorldSpace(cc.p(0,0)).x

                    var ziCenterWPos = zi.convertToWorldSpace(cc.p(0.5*zi.width,0.5*zi.height))
                    var caiShenPosInZi = zi.convertToNodeSpace(cc.p(ziCenterWPos.x-(ziWPosX-mjWPosX), ziCenterWPos.y))

                    s.x = caiShenPosInZi.x - 5
                    s.y = caiShenPosInZi.y + 5
                }
                else
                {
                    s.x = 0.5*zi.width - 5
                    s.y = 0.5*zi.height + 5
                }
                zi.addChild(s)
            }
        }

        if(mj.id!=1)
        {
            //设置麻将触摸
            if(mj.direction==0 && mj.where==0)
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

            if(mj.where!=0 )
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

        for(var i=0;i<GAME_PLAYER;i++)
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
        playNode.showLaizi()

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
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
            user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] )
        }

        var handCardDatasArray = [[[], null], [[], null], [[], null], [[], null]]
        var discardCardDatasArray = [[],[],[],[]]
        var weaveItemArray = [[],[],[],[]]

        var cbPlayerFlowerCardData = [[],[],[],[]]

        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var isSelf = tableData.getUserWithChairId(wChairID).dwUserID == selfdwUserID
            var direction = tableData.getShowChairIdWithServerChairId(wChairID)
            var weaveItems = cmdBaseWorker.WeaveItemArray[wChairID]
            // //组合牌
            // for(var j=0;j<MAX_WEAVE;j++)
            // {
            //     weaveItems[j].provideDirection = tableData.getShowChairIdWithServerChairId(weaveItems[j].wProvideUser)
            // }
            weaveItemArray[direction] = weaveItems

            var cardDatas = []
            for(var j=0;j<MAX_COUNT;j++)
            {
                cardDatas[j] = 0
            }
            var handCardDatas = cmdBaseWorker.cbHandCardData[wChairID]
            if(cmdBaseWorker.cbHandCardCount[wChairID] + cmdBaseWorker.cbWeaveCount[wChairID]*3 == MAX_COUNT)
            {
                if(isSelf)
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

            discardCardDatasArray[direction] = cmdBaseWorker.cbDiscardCardData[wChairID].slice(0, cmdBaseWorker.cbDiscardCount[wChairID])
       
            cbPlayerFlowerCardData[direction] = cmdBaseWorker.cbPlayerFlowerCardData[wChairID]
        }
        // console.log(6666, handCardDatasArray, discardCardDatasArray, weaveItemArray)
        gameLogic.sortHandCardDatas(handCardDatasArray[0][0]) 
        // get heapCardDatasArray
        var heapCardDatasArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)
        
        playNode.sendCardsAction(handCardDatasArray, discardCardDatasArray, weaveItemArray, heapCardDatasArray, cbPlayerFlowerCardData) 

        if(cmdBaseWorker.wOutCardUser!=INVALID_WORD)
        {
            var d = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)
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

        playNode.timer.initFenwei( tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser) )
        
        //动作中并且不是自摸动作
        var switchUsers = []
        if(cmdBaseWorker.wCurrentUser!=INVALID_WORD)
        {
            var currentDirection = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)
            switchUsers[0] = currentDirection
            playNode.checkHandCardTouch(currentDirection)
        }
        else if(cmdBaseWorker.wGetSendCardUser!=INVALID_WORD 
        && cmdBaseWorker.wGetSendCardUser==cmdBaseWorker.wTakeCardUser)
            switchUsers[0] = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTakeCardUser)        
        playNode.timer.switchTimer(switchUsers)
        playNode.timerNode.setVisible(true)

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
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
            user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] )
        }

        //get handCardDatasArray
        var handCardDatasArray = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var direction = i
            var serverChairid = tableData.getServerChairIdWithShowChairId(direction)

            var cardDatas = []
            for(var ii=0;ii<MAX_COUNT;ii++)
            {
                cardDatas[ii] = 0
            }
            if(serverChairid==self.wChairID)
                cardDatas = cmdBaseWorker.cbHandCardData[serverChairid]

            var oldCardDatas = cardDatas.slice(0, MAX_COUNT-1)
            handCardDatasArray[direction] = [oldCardDatas, null]
        }
        gameLogic.sortHandCardDatas(handCardDatasArray[0][0]) 
        //get heapCardDatasArray 
        var heapCardDatasArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)       
       
        playNode.sendCardsAction(handCardDatasArray, [[],[],[],[]], [[],[],[],[]], heapCardDatasArray, []) 

        playNode.setCurrentRoundMajiangsVisible(false)
        playNode.actionBtns.setVisible(false)
        managerTouch.closeTouch() //避免在不知道牌的情况下 把牌打出去
        //提前保存可能被破坏的数据  掷骰子是庄家出牌破坏数据 因为可能庄家筛子先出完
        var bankerShowChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser)
        
        // var map = [0,0,1,2,3,1,1,2,3,3,1,2,3]
        // var takerChairid = (cmdBaseWorker.wBankerUser + 
        //     map[ cmdBaseWorker.cbSiceCount[0]+cmdBaseWorker.cbSiceCount[1] ])%GAME_PLAYER
        // var takerShowChairid = tableData.getShowChairIdWithServerChairId(takerChairid)

        function gameStart()
        {
            playNode.showLaizi()
            playNode.timer.initFenwei( bankerShowChairid )
            playNode.timerNode.setVisible(true)

            playNode.setCurrentRoundMajiangsVisible(true)
            playNode.actionBtns.setVisible(true)
            managerTouch.openTouch()
        }

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.playDiceOneDirection(gameStart, cmdBaseWorker.cbSiceCount[0], 
            cmdBaseWorker.cbSiceCount[1], tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser))

        // function bankerPlayDice()
        // {
        //     playNode.playDiceOneDirection(takePlayDice, cmdBaseWorker.cbSiceCount[0], 
        //         cmdBaseWorker.cbSiceCount[1], bankerShowChairid)
        // }

        // function takePlayDice()
        // {
        //     tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        //     playNode.playDiceOneDirection(gameStart, cmdBaseWorker.cbSiceCount[2], 
        //         cmdBaseWorker.cbSiceCount[3], takerShowChairid)
        // }

        // if(cmdBaseWorker.bIsRandBanker)
        //     playNode.playDiceForRandBanker(bankerPlayDice, bankerShowChairid)
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
        
        var takeDir =  tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTakeCardUser)   
        ///////
        for(var i=0;i<cmdBaseWorker.cbSendCardCount;i++)
        {
            var item = cmdBaseWorker.sendCardArray[i]
            //牌堆
            var heapMajiangsDir = tableData.getShowChairIdWithServerChairId(item.heapIdx.wHeapDir)  
            majiangFactory.deleteHeapMajiangs(playNode.heapMajiangs4D[heapMajiangsDir], [item.heapIdx.wHeapPos])
           
            //手牌
            if(item.cbCardData == HAS_DISPATCH_CARD_DATA)//丢弃牌
                continue
            var cardData = tableData.getUserWithChairId(cmdBaseWorker.wTakeCardUser).dwUserID == selfdwUserID?item.cbCardData:0
            majiangFactory.addHandMajiang(playNode.handMajiangs4D[takeDir], takeDir, cardData, playNode.handGroupNode4D[takeDir], playNode.weaveMajiangs4D[takeDir].length)
        }

        var switchUsers = []
        if(cmdBaseWorker.wCurrentUser!=INVALID_WORD)
        {
            var currentDirection = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)
            switchUsers[0] = currentDirection
            playNode.checkHandCardTouch(currentDirection)
        }        
        else if(cmdBaseWorker.wGetSendCardUser!=INVALID_WORD 
        && cmdBaseWorker.wGetSendCardUser==cmdBaseWorker.wTakeCardUser)
            switchUsers[0] = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTakeCardUser)        
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
            var currentDirection = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)
            switchUsers[0] = currentDirection
            playNode.checkHandCardTouch(currentDirection)
        }
        else if(cmdBaseWorker.wProvideUser==cmdBaseWorker.wTakeCardUser)
            switchUsers[0] = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTakeCardUser)        
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
        var operateUserDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOperateUser)
        
        var operateHandMajiangs = playNode.handMajiangs4D[operateUserDir]
        var operateFlowerMajiangs = playNode.flowerMajiangs4D[operateUserDir]
        var operateFlowerMajiangsNode = operateUser.userNodeInsetChair.currentRoundNode.flowerMajiangsNode

        for(var i=0;i<cbReplaceCardData.length;i++)
        {
            var deleteCardData = operateUser.dwUserID == selfdwUserID?cbReplaceCardData[i]:0
            var flowerCardData = cbReplaceCardData[i]
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)

            majiangFactory.addFlowerMajiangs(operateFlowerMajiangs, operateUserDir, flowerCardData, operateFlowerMajiangsNode)
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
        }

        if(cmdBaseWorker.endType == 3)
        {
            var provideDiscardMajiangs = playNode.discardMajiangs4D[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser)]
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
                cc.delayTime(1), //看牌5秒
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
        var outDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)  
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
                majiangFactory.addHandMajiangsOld(majiangs, outDir, newMj.cardData, playNode.handGroupNode4D[outDir])
                majiangFactory.deleteHandMajiangNew(majiangs)
            }
        }
        else
            majiangFactory.deleteHandMajiangs(majiangs, outDir, 0)

        majiangFactory.addDiscardMajiangs(playNode.discardMajiangs4D[outDir], outDir,
            outCardData, outUser.userNodeInsetChair.currentRoundNode.discardMajiangsNode)

        playNode.setCurrentDiscardMj(playNode.discardMajiangs4D, outDir)
    },
    updatePlayerStatusNode:function()
    {
        for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
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
    _gethandGroupNodeListener:function(touchEndCall)
    {
        var majiangs = playNode.handMajiangs4D[0]
        var handGroupNode = playNode.handGroupNode4D[0]

        var currentMajiangTipsNode = new cc.Node()
        var bg = new cc.Sprite('#mf_currentMjBg.png')
        bg.setScale(majiangFactory.scale_upDown)
        currentMajiangTipsNode.addChild(bg)

        var mj = majiangFactory.getOne(1, 0, 0, true)
        mj.setScale(majiangFactory.scale_upDown * 1)
        currentMajiangTipsNode.addChild(mj)

        currentMajiangTipsNode.x = - 1000
        currentMajiangTipsNode.y = handGroupNode.height + bg.height*0.5 + 40

        handGroupNode.addChild(currentMajiangTipsNode, 2)

        var mjWidth = majiangFactory.downHandIntervalX*majiangFactory.scale_upDown
        var mjHeight = majiangFactory.down_handHeight*majiangFactory.scale_upDown
        var touchPosX2TouchedMj = function(posX)
        {      
            if(posX>mjWidth*majiangs[0].length)
                return majiangs[1]
            else
            {
                var idx = Math.floor( posX/mjWidth )
                return majiangs[0][idx]
            }
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
        var onTouch = function(locationX)
        {   
            var touchedMj = touchPosX2TouchedMj(locationX)
            if(!touchedMj || !touchedMj.touchEnable)
                return false
            
            if(!currentMajiang)//刚开始触摸麻将
            {
                touchedMjNum = 1

                currentMajiang = touchedMj
                if(currentPopMajiang)
                {
                    isTouchFromPop = currentPopMajiang == currentMajiang

                    currentPopMajiang.y = mjHeight*0.5
                    var event = new cc.EventCustom("handMajiangDown")
                    event.setUserData(currentPopMajiang.cardData)
                    cc.eventManager.dispatchEvent(event) 
                }

                currentMajiang.y = mjHeight*0.5 + 20
                var event = new cc.EventCustom("handMajiangUp")
                event.setUserData(currentMajiang.cardData)
                cc.eventManager.dispatchEvent(event) 

                //////
                currentMajiangTipsNode.x = currentMajiang.x
                currentMajiangTipsNode.y = handGroupNode.height + bg.height*0.5 + 40
                mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 
            }
            else if(currentMajiang && currentMajiang!=touchedMj)//摸到新的麻将 
            {
                touchedMjNum++
                playSelectEffect()

                currentMajiang.y = mjHeight*0.5
                var event = new cc.EventCustom("handMajiangDown")
                event.setUserData(currentMajiang.cardData)
                cc.eventManager.dispatchEvent(event) 


                currentMajiang = touchedMj
                currentMajiang.y = mjHeight*0.5 + 20
                var event = new cc.EventCustom("handMajiangUp")
                event.setUserData(currentMajiang.cardData)
                cc.eventManager.dispatchEvent(event) 

                //////
                currentMajiangTipsNode.x = currentMajiang.x
                currentMajiangTipsNode.y = handGroupNode.height + bg.height*0.5 + 40
                mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 
            }
               
            // playNode.currentDiscardMjNode.setVisible(false)
            return true
        }

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()

                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var locationX = locationInNode.x<0?0:locationInNode.x
  
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) 
                {
                    return onTouch(locationX)
                }
                else
                {
                    if(currentPopMajiang)
                    {                    
                        currentPopMajiang.y = mjHeight*0.5
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
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    onTouch(locationInNode.x<0?0:locationInNode.x)
                }
            },
            onTouchEnded: function (touch, event) 
            {
                var target = event.getCurrentTarget()

                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var locationX = locationInNode.x<0?0:locationInNode.x
                
                if(isTouchFromPop && currentPopMajiang == touchPosX2TouchedMj(locationX) 
                && touchedMjNum==1) //单击弹出的那张麻将
                {
                    touchEndCall?touchEndCall(currentPopMajiang):''
                    currentPopMajiang = null
                    isTouchFromPop = false

                    currentMajiang.y = mjHeight*0.5
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

                // playNode.currentDiscardMjNode.setVisible(true)
            }
        })
            

        return listener
    },
    _getHandMajiangsGroupNode:function()
    {
        var handMajiangs = playNode.handMajiangs4D
        playNode.handGroupNode4D = majiangFactory.getHandGroupNodes(handMajiangs)

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

                var event = new cc.EventCustom("handMajiangOut")
                event.setUserData(majiang.cardData)
                cc.eventManager.dispatchEvent(event) 
            }

            var listener = playNode._gethandGroupNodeListener(touchEndCall)
            cc.eventManager.addListener(listener, playNode.handGroupNode4D[0])
        }
    },
    sendCardsAction:function(handCardDatasArray, discardCardDatasArray, weaveItemArray, heapCardDatasArray, flowerCardDatasArray)
    {   
        // flowerCardDatasArray = [ [0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48] ]
        // heapCardDatasArray = [ [1,0,0,0,0,0,0,0,0,0,0,0,0,0],[],[],[] ]
        // discardCardDatasArray = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
        // weaveCardDatasArray = [[[1,2,3,4],[2,3,4],[4,5,6],[7,8,1]],[],[[1,2,3],[2,3,4,5],[4,5,6],[7,8,1]],[]]
        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)

        playNode.flowerMajiangs4D = majiangFactory.getFlowerMajiangsArray(flowerCardDatasArray)
        playNode.heapMajiangs4D = majiangFactory.getHeapMajiangsArray(heapCardDatasArray)
        playNode.handMajiangs4D = majiangFactory.getHandMajiangsArray(handCardDatasArray, tableData.getUserWithUserId(selfdwUserID).wChairID == INVALID_WORD)
        playNode.discardMajiangs4D = majiangFactory.getDiscardMajiangsArray(discardCardDatasArray)


        playNode.weaveMajiangs4D = majiangFactory.getWeaveMajiangsArray(weaveItemArray, selfDir)

        playNode._getHandMajiangsGroupNode()

        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var showChairid=0;showChairid<4;showChairid++)
        {
            var direction = showChairid
            var chairid = tableData.getServerChairIdWithShowChairId(direction)

            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)

            var flowerMajiangsNode = user.userNodeInsetChair.currentRoundNode.flowerMajiangsNode
            var heapMajiangsNode = user.userNodeInsetChair.currentRoundNode.heapMajiangsNode
            var handMajiangsNode = user.userNodeInsetChair.currentRoundNode.handMajiangsNode
            var discardMajiangsNode = user.userNodeInsetChair.currentRoundNode.discardMajiangsNode
            var weaveMajiangsNode = user.userNodeInsetChair.currentRoundNode.weaveMajiangsNode

            var flowerMajiangs = playNode.flowerMajiangs4D[direction]
            for(var j=0;j<flowerMajiangs.length;j++)
            {
                var mj = flowerMajiangs[j]
                flowerMajiangsNode.addChild(mj)
            }

            var heapMajiangs = playNode.heapMajiangs4D[direction]
            for(var j=0;j<heapMajiangs.length;j++)
            {
                var mj = heapMajiangs[j]
                if(mj)
                    heapMajiangsNode.addChild(mj)
            }

            var discardMajiangs = playNode.discardMajiangs4D[direction]
            for(var j=0;j<discardMajiangs.length;j++)
            {
                var mj = discardMajiangs[j]
                discardMajiangsNode.addChild(mj)
            }

            var weaveMajiangs = playNode.weaveMajiangs4D[direction]
            for(var groupIdx=0;groupIdx<weaveMajiangs.length;groupIdx++)
            {
                var group = weaveMajiangs[groupIdx]
                for(var idxInGroup=0;idxInGroup<group.length;idxInGroup++)
                {
                    var mj = group[idxInGroup]
                    weaveMajiangsNode.addChild(mj)
                }
            }

            handMajiangsNode.addChild(playNode.handGroupNode4D[direction])
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

        var mj = majiangFactory.getOne(cardData, 5, 0, true)
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
    },
    _removeSprsOnGameEnd:function()
    {
        for(var chairId=0;chairId<GAME_PLAYER;chairId++)
        {   
            var user = tableData.getUserWithTableIdAndChairId(null, chairId)
            if(user)
                playNode.clearCurrentRoundNode(user.userNodeInsetChair.currentRoundNode)
        }
    },
    getDisplayHandMajiangPosAndTag:function(length, idxInCardDatas, direction, isNewGetMj)
    {
        var pos = {}
        switch(direction) //越大的牌靠newMj越近
        {
            case 0://down
            {   
                pos.scale = majiangFactory.scale_upDown*majiangFactory.downHandIntervalX/majiangFactory.downWeaveIntervalX

                if(isNewGetMj)
                    pos.x = ( length+0.5 )*pos.scale*majiangFactory.downWeaveIntervalX + majiangFactory.downMjAndNewMjInterval*majiangFactory.scale_upDown
                else
                    pos.x = ( idxInCardDatas+0.5 )*pos.scale*majiangFactory.downWeaveIntervalX
                pos.y = pos.scale*majiangFactory.down_weaveHeight*0.5 
                pos.zOrder = 0
                break
            }
            case 1://right
            {
                pos.scale = majiangFactory.scale_rightLeft*majiangFactory.rightHandIntervalY/majiangFactory.rightWeaveIntervalY

                pos.x = 1.2*(majiangFactory.right_weaveWidth - majiangFactory.right_handWidth)*majiangFactory.scale_rightLeft
                if(isNewGetMj)
                {
                    pos.y = ( length+0.5 )*pos.scale*majiangFactory.rightWeaveIntervalY + majiangFactory.rightMjAndNewMjInterval*majiangFactory.scale_rightLeft
                    pos.zOrder = 0
                }
                else
                {
                    pos.y = ( idxInCardDatas+0.5 )*pos.scale*majiangFactory.rightWeaveIntervalY
                    pos.zOrder = length-idxInCardDatas
                }
                break
            }
            case 2://up
            {
                pos.scale = majiangFactory.scale_upDown*majiangFactory.upHandIntervalX/majiangFactory.upWeaveIntervalX
                if(isNewGetMj)
                    pos.x = ( 0.5 )*pos.scale*majiangFactory.upWeaveIntervalX
                else
                    pos.x = ( length-1-idxInCardDatas+0.5+1 )*pos.scale*majiangFactory.upWeaveIntervalX + majiangFactory.upMjAndNewMjInterval*majiangFactory.scale_upDown
                pos.y = pos.scale*majiangFactory.up_weaveHeight*0.5
                pos.zOrder = 0
                break
            }
            case 3://left
            {
                pos.scale = majiangFactory.scale_rightLeft*majiangFactory.leftHandIntervalY/majiangFactory.leftWeaveIntervalY

                pos.x = -1.2*(majiangFactory.left_weaveWidth - majiangFactory.left_handWidth)*majiangFactory.scale_rightLeft + 0.5*pos.scale*majiangFactory.left_weaveWidth
                if(isNewGetMj)
                {
                    pos.y = ( length+0.5 )*pos.scale*majiangFactory.leftWeaveIntervalY + majiangFactory.leftMjAndNewMjInterval*majiangFactory.scale_rightLeft
                    //pos.zOrder = -1
                    pos.zOrder = 0
                }
                else
                {
                    pos.y = ( idxInCardDatas+0.5 )*pos.scale*majiangFactory.leftWeaveIntervalY
                    // pos.zOrder = idxInCardDatas
                    pos.zOrder = length-idxInCardDatas
                }
                break
            }
        }

        return pos
    },
    popGameEnd:function(continueCall, userData_gameEnd)
    {

        var control = {}
        control.continueCall = function()
        {
            continueCall()
            node.removeFromParent()
        }
        var node  = managerRes.loadCCB(resp.gameEndPopCCB, control)

        playNode.gameEndControl = control

        control.gendTitle.setSpriteFrame('gendTitle'+cmdBaseWorker.endType + '.png')

        for(var showChairid=0;showChairid<4;showChairid++)
        {
            var direction = showChairid
            var wChairID = tableData.getServerChairIdWithShowChairId(showChairid)

            var gendBar = control['gendBar'+wChairID]

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

            var dir = (wChairID-cmdBaseWorker.wBankerUser+GAME_PLAYER)%4
            var dirSpr = new cc.Sprite('#gendDir' + dir + '.png')
            dirSpr.x = 32-13
            dirSpr.y = 32-13
            hnode.addChild(dirSpr)   

            if(wChairID == cmdBaseWorker.wBankerUser)
            {
                var bankerSpr = new cc.Sprite('#gendIcon_banker.png')
                bankerSpr.x = -32
                bankerSpr.y = 32
                hnode.addChild(bankerSpr)   
            }


            //胡型
            var resultTTF = cc.LabelTTF.create('', "Helvetica", 16)
            resultTTF.setFontFillColor( cc.color(244, 230, 159) )
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
            resultTTF.anchorX = 0
            resultTTF.x = 102
            resultTTF.y = 15
            gendBar.addChild(resultTTF, 2)
       


            //显示麻将
            var majiangsNode = new cc.Node()
            majiangsNode.scale = 0.65
            majiangsNode.x = 100
            majiangsNode.y = gendBar.height - 12 - 0.5*(majiangFactory.down_handHeight*majiangFactory.scale_upDown*majiangsNode.scale)
            gendBar.addChild(majiangsNode)

            //吃碰杠的牌
            var weaveItems = cmdBaseWorker.WeaveItemArray[wChairID]

            var groupLen = 0 
            for(var groupIdx=0;groupIdx<weaveItems.length;groupIdx++)
            {
                var weaveItem = weaveItems[groupIdx]
                if(weaveItem.cbWeaveKind == WIK_NULL)
                    continue
                groupLen += 1
                // if(weaveItem.cbWeaveKind!=WIK_GANG)
                //     weaveItem.cbValidCardDatas = weaveItem.cbValidCardDatas.slice(0, 3)

                weaveItem.wProvideUser = tableData.getServerChairIdWithShowChairId(0)//这样就不显示箭头了
                var majiangsOneGroup = majiangFactory.weaveItem2Majiangs(0, groupIdx, weaveItem, true)
                
                for(var idxInGroup=0;idxInGroup<majiangsOneGroup.length;idxInGroup++)
                {
                    var mj = majiangsOneGroup[idxInGroup]
                    majiangsNode.addChild(mj)
                }
            }
            var widthOneGroup = majiangFactory.scale_upDown*majiangFactory.downHandIntervalX*3
            var startPos = groupLen*widthOneGroup
            //手牌
            var handCardDatas = cmdBaseWorker.cbHandCardData[wChairID]
            // var hasLightProvideMj = false
            for(var j=0;j<handCardDatas.length;j++)
            {
                var cardData = handCardDatas[j]
                var majiang = majiangFactory.getOne(cardData, 2, 0)
                majiang.idxInHandMajiangs = j
                var pos = playNode.getDisplayHandMajiangPosAndTag(handCardDatas.length, majiang.idxInHandMajiangs, 0, false)
                majiang.x = startPos + pos.x
                majiang.y = 0//pos.y
                majiang.setScale(pos.scale)
                // majiang.setLocalZOrder(pos.zOrder)

                majiangsNode.addChild(majiang)

                if(j==handCardDatas.length-1)
                {
                    if( cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU
                        && cmdBaseWorker.cbProvideCardData != INVALID_CARD_DATA )
                    {
                        var majiang = majiangFactory.getOne(cmdBaseWorker.cbProvideCardData, 2, 0)
                        majiang.idxInHandMajiangs = j+1
                        var pos = playNode.getDisplayHandMajiangPosAndTag(handCardDatas.length+1, majiang.idxInHandMajiangs, 0, false)
                        majiang.x = startPos + pos.x + 20
                        majiang.y = 0//pos.y
                        majiang.setScale(pos.scale)
                        // majiang.setLocalZOrder(pos.zOrder)
                        majiang.color = cc.color(188, 255, 188)
                        majiangsNode.addChild(majiang)

                    }
                }
            }

            ///花牌
            var flowersNode = new cc.Node()
            flowersNode.scale = 0.7
            flowersNode.x = 100
            flowersNode.y = gendBar.height - 12 - 0.5*(majiangFactory.down_handHeight*majiangFactory.scale_upDown*majiangsNode.scale)
            gendBar.addChild(flowersNode)

            var flowerCardDatas = cmdBaseWorker.cbPlayerFlowerCardData[wChairID]
            for(var j=0;j<flowerCardDatas.length;j++)
            {
                var cardData = flowerCardDatas[j]

                var majiang = majiangFactory.getOne(cardData, 4, 0)
                var pos = majiangFactory.getFlowerMajiangPosAndTag(j, 0)
                majiang.x = pos.x
                majiang.y = 5-0.5*(majiangFactory.down_handHeight*majiangFactory.scale_upDown*majiangsNode.scale)-0.5*majiang.height*majiang.scale
                // majiang.setLocalZOrder(pos.zOrder)
                flowersNode.addChild(majiang)
            }


            ///////////
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
    setCurrentDiscardMj:function(discardMajiangs4D, direction)
    {
        var discardMajiangs = discardMajiangs4D[direction]
        var discardMajiang = discardMajiangs[discardMajiangs.length-1]
        var discardMajiangWorldPos = discardMajiang.getParent().convertToWorldSpace(discardMajiang.getPosition())
        var parent = playNode.currentMjPoint.getParent()
        var discardMajiangPosInParent = parent.convertToNodeSpace(discardMajiangWorldPos)

        playNode.currentMjPoint.x = discardMajiangPosInParent.x
        playNode.currentMjPoint.y = discardMajiangPosInParent.y+18


//         //清掉上次的
//         for(var i=0;i<GAME_PLAYER;i++)
//         {
//             var discardMajiangs = discardMajiangs4D[i]
//             if(discardMajiangs.length>0)
//             {
//                 var tailMj = discardMajiangs[discardMajiangs.length-1]
//                 tailMj.removeChildByTag(1001)
//             }
//         }

//         //加新的
//         var discardMajiangs = discardMajiangs4D[direction]
//         var discardMajiang = discardMajiangs[discardMajiangs.length-1]
        
//         var spr = actionFactory.getSprWithAnimate('currentMj_', false, 0.4)
//         spr.x = discardMajiang.width*0.5
//         spr.y = discardMajiang.height*0.5 + 18
//         discardMajiang.addChild(spr, 0, 1001)

//         // var discardMajiangWorldPos = discardMajiang.convertToWorldSpace(discardMajiang.getParent().getPosition())

//         // var parent = playNode.currentDiscardMjNode.getParent()
//         // var discardMajiangPosInParent = parent.convertToNodeSpace(discardMajiangWorldPos)

//         // playNode.currentDiscardMjNode.x = discardMajiangPosInParent.x
//         // playNode.currentDiscardMjNode.y = discardMajiangPosInParent.y
    },
    hideCurrentDiscardMj:function()
    {
        playNode.currentMjPoint.x = -1000
    },
    // setCurrentDiscardMj:function(discardMajiangs4D, direction)
    // {
    //     var discardMajiangs = discardMajiangs4D[direction]
    //     var discardMajiang = discardMajiangs[discardMajiangs.length-1]
    //     var cardData = discardMajiang.cardData

    //     var self = tableData.getUserWithUserId(selfdwUserID)
    //     var d = tableData.getShowChairIdWithServerChairId(self.wChairID)
    //     if(d == direction)
    //     {
    //         playNode.hideCurrentDiscardMj()
    //         return
    //     }

    //     playNode.currentDiscardMjNode.setVisible(true)
    //     var mj = playNode.currentDiscardMjNode.getChildByTag(101)
    //     mj.getChildByTag(101).setSpriteFrame('mf_' + cardData + '.png') 

    //     var up_handHeight = majiangFactory.up_handHeight*majiangFactory.scale_upDown
    //     var down_handHeight = majiangFactory.down_handHeight*majiangFactory.scale_upDown

    //     switch(direction)
    //     {
    //         case 0://down
    //         {
    //             playNode.currentDiscardMjNode.x = majiangFactory.mjTableNode.width*0.5
    //             // majiangFactory.currentDiscardMjNode.y = down_handHeight + 10*majiangFactory.scale_rightLeft   
    //             playNode.currentDiscardMjNode.y = 0.5*down_handHeight*playNode.currentDiscardMjScale + 10*majiangFactory.scale_rightLeft    
    //             break
    //         }
    //         case 1://right
    //         {
    //             playNode.currentDiscardMjNode.x = majiangFactory.mjTableNode.width - majiangFactory.right_handWidth*majiangFactory.scale_rightLeft - 
    //             0.5*majiangFactory.down_handWidth*playNode.currentDiscardMjScale*majiangFactory.scale_upDown - 60*majiangFactory.scale_upDown
                
    //             playNode.currentDiscardMjNode.y = down_handHeight + 0.5*(majiangFactory.mjTableNode.height-up_handHeight-down_handHeight)
    //             break
    //         }
    //         case 2://up
    //         {
    //             playNode.currentDiscardMjNode.x = majiangFactory.mjTableNode.width*0.5
    //             //majiangFactory.currentDiscardMjNode.y = majiangFactory.mjTableNode.height - 0.5*up_handHeight - 10*majiangFactory.scale_rightLeft    
    //             playNode.currentDiscardMjNode.y = majiangFactory.mjTableNode.height - 0.5*down_handHeight*playNode.currentDiscardMjScale - 10*majiangFactory.scale_rightLeft    
    //             break
    //         }
    //         case 3://left
    //         {
    //             playNode.currentDiscardMjNode.x = majiangFactory.left_handWidth*majiangFactory.scale_rightLeft + 
    //             0.5*majiangFactory.down_handWidth*playNode.currentDiscardMjScale*majiangFactory.scale_upDown + 60*majiangFactory.scale_upDown
    //             playNode.currentDiscardMjNode.y = down_handHeight + 0.5*(majiangFactory.mjTableNode.height-up_handHeight-down_handHeight)
    //             break
    //         }
    //     }  
    // },
    hideLaizi:function()
    {
        playNode.laiziNode.removeAllChildren()
    },
    showLaizi:function()
    {
        for(var i=0;i<TURNOVER_COUNT_MAGIC;i++)
        {
            var cardData = cmdBaseWorker.TurnoverCard[i].cbCardData
            if(cardData == 0)
                continue
            var bg = new cc.Sprite('#bg_top.png')
            bg.x = 50*i + 25
            bg.y = - 30
            var mj = majiangFactory.getOne(cardData, 1, 0, false, 1)
            mj.x = 50*i + 25
            mj.y = - 30
            mj.setScaleX(bg.width/mj.width*0.8)
            mj.setScaleY(bg.height/mj.height*0.8)

            playNode.laiziNode.addChild(bg)
            playNode.laiziNode.addChild(mj)
        }
    },
    playAnimationOfGameEnd:function(call)
    {
        if(cmdBaseWorker.endType == 0)
            call()
        else if(cmdBaseWorker.endType == 1)
        {
            var spr = actionFactory.getSprWithAnimate('lj', true, 0.15, call)
            majiangFactory.mjTableNode.addChild(spr)
            spr.x = majiangFactory.mjTableNode.width*0.5
            spr.y = majiangFactory.mjTableNode.height*0.5
        }
        else if(cmdBaseWorker.endType == 2)
        {
            playNode.playAnimationWithDirection('zim', tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser), call)
            playNode.playGenderEffect('zimo0', tableData.getUserWithChairId(cmdBaseWorker.wProvideUser).cbGender)
        }
        else if(cmdBaseWorker.endType == 3)
        {
            playNode.playAnimationWithDirection('dp', tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser))

            var hasCall = false
            for(var i=0;i<GAME_PLAYER;i++)
            {
                if(cmdBaseWorker.dwChiHuKind[i] == WIK_CHI_HU)
                {
                    if(!hasCall)
                        hasCall = true
                    else
                        call = null
                    playNode.playAnimationWithDirection('hu', tableData.getShowChairIdWithServerChairId(i), call)
                    playNode.playActionEffect(WIK_CHI_HU, tableData.getUserWithChairId(i).cbGender)
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
        var up_handHeight = majiangFactory.up_handHeight*majiangFactory.scale_upDown
        var down_handHeight = majiangFactory.down_handHeight*majiangFactory.scale_upDown
        switch(direction)
        {
            case 0://down
            {
                pos.x = majiangFactory.mjTableNode.width*0.5
                pos.y = down_handHeight + 60
                break
            }
            case 1://right
            {
                pos.x = majiangFactory.mjTableNode.width - majiangFactory.right_handWidth*majiangFactory.scale_rightLeft
                - 150*majiangFactory.scale_upDown
                pos.y = down_handHeight + 0.5*(majiangFactory.mjTableNode.height-up_handHeight-down_handHeight)
                break
            }
            case 2://up
            {
                pos.x = majiangFactory.mjTableNode.width*0.5
                pos.y = majiangFactory.mjTableNode.height - majiangFactory.up_handHeight*majiangFactory.scale_upDown
                 - 60
                break
            }
            case 3://left
            {
                pos.x = majiangFactory.left_handWidth*majiangFactory.scale_rightLeft 
                + 150*majiangFactory.scale_upDown
                pos.y = down_handHeight + 0.5*(majiangFactory.mjTableNode.height-up_handHeight-down_handHeight)
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
        majiangFactory.mjTableNode.addChild(spr)

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
        var w = playNode.mjTableNode.width
        var h = playNode.mjTableNode.height

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


        var chairNode = tableNode['chairNode'+direction] 

        var diceSpr1 = dice.getThrowedDiceSpr(controlPoints1, endNum1, 1.2, function()
        {
            call?call():''
        }) 
        diceSpr1.x = chairNode.x
        diceSpr1.y = chairNode.y
        
        var diceSpr2 = dice.getThrowedDiceSpr(controlPoints2, endNum2, 1.2) 
        diceSpr2.x = chairNode.x
        diceSpr2.y = chairNode.y

        playNode.mjTableNode.addChild(diceSpr1)
        playNode.mjTableNode.addChild(diceSpr2)

        managerAudio.playEffect('gameRes/sound/dice.mp3') 
    },
    resetPlayNode:function()
    {
        playNode._removeSprsOnGameEnd()
        playNode.timerNode.setVisible(false)
        playNode.hideLaizi()
        playNode.tingHuCardNode.setVisible(false)

        for(var i=0;i<GAME_PLAYER;i++)
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

        playNode.playAnimationWithDirection(playNode.wik2Name(WIK), tableData.getShowChairIdWithServerChairId(user.wChairID))
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
                var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
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
            var direction = tableData.getShowChairIdWithServerChairId(selfChairId)
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
            var direction = tableData.getShowChairIdWithServerChairId(selfChairId)
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
            var direction = tableData.getShowChairIdWithServerChairId(selfChairId)
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
                var direction = tableData.getShowChairIdWithServerChairId(selfChairId)
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
                var direction = tableData.getShowChairIdWithServerChairId(selfChairId)
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

            chooseActionMajiangs.x = ( i - (weaveItems.length-1)/2 ) 
            * (majiangFactory.scale_upDown*playNode.chooseItemMjScale*majiangFactory.downHandIntervalX*3 + 30)
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
        
        for(var i=0;i<showDatas.length;i++)
        {
            var cardData = showDatas[i]
            var mj = majiangFactory.getOne(cardData, 0, 0, true)
            mj.setScale(majiangFactory.scale_upDown*playNode.chooseItemMjScale)
            mj.x = ( i - (showDatas.length-1)/2 )*majiangFactory.scale_upDown*playNode.chooseItemMjScale*majiangFactory.downHandIntervalX
            
            chooseActionMajiangs.addChild(mj)

            if(i == iconIdx)
            {
                var s = new cc.Sprite('#chooseIcon_'+ name + '.png')
                var zi = mj.getChildByTag(101)
                s.x = 0.5*zi.width - 5
                s.y = 0.5*zi.height + 5
                zi.addChild(s)

                mj.color = cc.color(122, 122, 122)
            }
        }

        ////////////////////////////
        var bg = new cc.Scale9Sprite('mf_chooseItemBg.png')
        bg.width = majiangFactory.scale_upDown*playNode.chooseItemMjScale*majiangFactory.downHandIntervalX*showDatas.length + 10
        bg.height = majiangFactory.scale_upDown*playNode.chooseItemMjScale*majiangFactory.down_handHeight + 10 
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
        var operateDir = tableData.getShowChairIdWithServerChairId(operateUserChairId)
        var operateUser = tableData.getUserWithChairId(operateUserChairId)

        var provideDir = tableData.getShowChairIdWithServerChairId(provideUserChairId)
        var provideUser = tableData.getUserWithChairId(provideUserChairId)

        var operateHandMajiangs = playNode.handMajiangs4D[operateDir]
        var operateHandGroupNode = playNode.handGroupNode4D[operateDir]

        majiangFactory.popDiscardMajiangs(playNode.discardMajiangs4D[provideDir])

        var addHandCardData = operateUser.dwUserID == selfdwUserID?provideCardData:0
        majiangFactory.addHandMajiang(operateHandMajiangs, operateDir, 
            addHandCardData, operateHandGroupNode, playNode.weaveMajiangs4D[operateDir].length)

        for(var i=0;i<4;i++)
        {
            var deleteCardData = operateUser.dwUserID == selfdwUserID?operateWeaveItem.cbValidCardDatas[i]:0
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, deleteCardData)
        }

        majiangFactory.updateWeaveMajiangs(playNode.weaveMajiangs4D[operateDir], operateDir, operateWeaveIdx, 
            operateWeaveItem, operateUser.userNodeInsetChair.currentRoundNode.weaveMajiangsNode)
 
        var newMajiang = operateHandMajiangs[1]
        if(newMajiang) 
        {
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, newMajiang.cardData)
            majiangFactory.addHandMajiang(operateHandMajiangs, operateDir, newMajiang.cardData, 
                operateHandGroupNode, playNode.weaveMajiangs4D[operateDir].length)
        } 
    },
    onActionAnGang:function(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    {
        var operateDir = tableData.getShowChairIdWithServerChairId(operateUserChairId)
        var operateUser = tableData.getUserWithChairId(operateUserChairId)

        var provideDir = tableData.getShowChairIdWithServerChairId(provideUserChairId)
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
            operateWeaveItem, operateUser.userNodeInsetChair.currentRoundNode.weaveMajiangsNode)

        var newMajiang = operateHandMajiangs[1]
        if(newMajiang) 
        {
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, newMajiang.cardData)
            majiangFactory.addHandMajiang(operateHandMajiangs, operateDir, newMajiang.cardData, 
                operateHandGroupNode, playNode.weaveMajiangs4D[operateDir].length)
        } 
    },
    onActionPengGang:function(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    {
        var operateDir = tableData.getShowChairIdWithServerChairId(operateUserChairId)
        var operateUser = tableData.getUserWithChairId(operateUserChairId)

        var provideDir = tableData.getShowChairIdWithServerChairId(provideUserChairId)
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
            operateWeaveItem, operateUser.userNodeInsetChair.currentRoundNode.weaveMajiangsNode)       
   
        var newMajiang = operateHandMajiangs[1]
        if(newMajiang) 
        {
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, 
                operateDir, newMajiang.cardData)
            majiangFactory.addHandMajiang(operateHandMajiangs, operateDir, newMajiang.cardData, 
                operateHandGroupNode, playNode.weaveMajiangs4D[operateDir].length)
        } 
    },
    onActionPeng:function(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    {        
        var operateDir = tableData.getShowChairIdWithServerChairId(operateUserChairId)
        var operateUser = tableData.getUserWithChairId(operateUserChairId)

        var provideDir = tableData.getShowChairIdWithServerChairId(provideUserChairId)
        var provideUser = tableData.getUserWithChairId(provideUserChairId)

        var operateHandMajiangs = playNode.handMajiangs4D[operateDir]
        var operateHandGroupNode = playNode.handGroupNode4D[operateDir]


        majiangFactory.popDiscardMajiangs(playNode.discardMajiangs4D[provideDir])

        var addHandCardData = operateUser.dwUserID == selfdwUserID?provideCardData:0
        majiangFactory.addHandMajiang(operateHandMajiangs, operateDir, 
            addHandCardData, operateHandGroupNode, playNode.weaveMajiangs4D[operateDir].length)

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
        majiangFactory.addHandMajiangNew(operateHandMajiangs, operateDir, maxRightCardData, operateHandGroupNode)


        majiangFactory.updateWeaveMajiangs(playNode.weaveMajiangs4D[operateDir], operateDir, operateWeaveIdx, 
            operateWeaveItem, operateUser.userNodeInsetChair.currentRoundNode.weaveMajiangsNode)
    },
    onActionChi:function(operateWeaveIdx, operateWeaveItem, operateUserChairId, provideUserChairId, provideCardData)
    {        
        var operateDir = tableData.getShowChairIdWithServerChairId(operateUserChairId)
        var operateUser = tableData.getUserWithChairId(operateUserChairId)

        var provideDir = tableData.getShowChairIdWithServerChairId(provideUserChairId)
        var provideUser = tableData.getUserWithChairId(provideUserChairId)

        var operateHandMajiangs = playNode.handMajiangs4D[operateDir]
        var operateHandGroupNode = playNode.handGroupNode4D[operateDir]

        majiangFactory.popDiscardMajiangs(playNode.discardMajiangs4D[provideDir])

        var addHandCardData = operateUser.dwUserID == selfdwUserID?provideCardData:0
        majiangFactory.addHandMajiang(operateHandMajiangs, operateDir, 
            addHandCardData, operateHandGroupNode, playNode.weaveMajiangs4D[operateDir].length)

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
        majiangFactory.addHandMajiangNew(operateHandMajiangs, operateDir, maxRightCardData, operateHandGroupNode)

        majiangFactory.updateWeaveMajiangs(playNode.weaveMajiangs4D[operateDir], operateDir, operateWeaveIdx, 
            operateWeaveItem, operateUser.userNodeInsetChair.currentRoundNode.weaveMajiangsNode)
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

        for(var i=0;i<GAME_PLAYER;i++)
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

        for(var i=0;i<GAME_PLAYER;i++)
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
    weaveItem2Majiangs:function(operateDirection, weaveIdx, weaveItem, isPublicAnGang)
    {
        var cbValidCardDatas = weaveItem.cbValidCardDatas
        var wProvideUser = weaveItem.wProvideUser
        var provideShowChairId = tableData.getShowChairIdWithServerChairId(wProvideUser)
        var provideDirection = majiangFactory.showChairId2Direction(provideShowChairId)

        var operateUser = tableData.getServerChairIdWithShowChairId(operateDirection)

        var arrowIdx = -1
        if(provideDirection!=operateDirection)
        {
            if(weaveItem.cbWeaveKind == WIK_LEFT)
                arrowIdx = 0
            else if(weaveItem.cbWeaveKind == WIK_CENTER)
                arrowIdx = 1
            else if(weaveItem.cbWeaveKind == WIK_RIGHT)
                arrowIdx = 2      
            else if(weaveItem.cbWeaveKind == WIK_PENG)
                arrowIdx = 1    
            else if(weaveItem.cbWeaveKind&(WIK_MINGANG|WIK_ANGANG|WIK_PENGGANG))
                arrowIdx = 3   
        }
 
        var majiangs = []
        for(var i=0;i<cbValidCardDatas.length;i++)
        {
            var cardData = cbValidCardDatas[i]
            if( weaveItem.cbWeaveKind&(WIK_ANGANG) )
            {
                if(i<3)
                    cardData = 0
                else if( tableData.getUserWithUserId(selfdwUserID).wChairID!=operateUser && !isPublicAnGang)
                    cardData = 0
            }

            var majiang = majiangFactory.getOne(cardData, 2, operateDirection)

            var pos = majiangFactory.getWeaveMajiangPosAndTag(weaveIdx, i, operateDirection)
            majiang.x = pos.x
            majiang.y = pos.y
            majiang.setLocalZOrder(pos.zOrder)

            if(i == arrowIdx)
            {
                var zi = majiang.getChildByTag(101)
                var directionSpr = new cc.Sprite('#mf_weaveDirection.png')
                directionSpr.setRotation(180-provideDirection*90 - zi.getRotation())

                directionSpr.x = zi.width*0.5
                directionSpr.y = zi.height*0.5
                zi.addChild(directionSpr, 0, 101)
            }

            majiangs[majiangs.length] = majiang
        }  
        majiangs.weaveItem = weaveItem

        return majiangs
    },
    getHeapCardDatasArray:function(cbHeapCardInfo, TurnoverCard, kaiGangHeapCardInfo)
    {
        var heapCardDatasArray = []//这个数组以头部方向为准 
        if(!majiangFactory.isShowHeap)
        {
            for(i=0;i<GAME_PLAYER;i++)
            {
                heapCardDatasArray[i] = []
            }
            return heapCardDatasArray;
        }

        var heapCardDatasArray = []
        for(var showChairid=0;showChairid<GAME_PLAYER;showChairid++)
        {
            var direction = showChairid
            var serverChairid = tableData.getServerChairIdWithShowChairId(showChairid)

            heapCardDatasArray[direction] = []
            var wMinusHeadCount = cbHeapCardInfo[serverChairid][0]//从头部方向摸走的麻将数
            var wMinusLastCount = cbHeapCardInfo[serverChairid][1]//从尾部方向摸走的麻将数
                
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

        for(var i=0;i<TURNOVER_COUNT_MAGIC;i++ )//可能翻得牌没摸走的话 就翻开显示
        {
            var cardHeapDir = tableData.getShowChairIdWithServerChairId(TurnoverCard[i].heapIdx.wHeapDir)
            var cardHeapPos = TurnoverCard[i].heapIdx.wHeapPos
            var cardData = TurnoverCard[i].cbCardData

            if(heapCardDatasArray[cardHeapDir][cardHeapPos] == 0)
                heapCardDatasArray[cardHeapDir][cardHeapPos] = HAS_DISPATCH_CARD_DATA//cbTurnoverCardData
        }

        return heapCardDatasArray
    },








}
