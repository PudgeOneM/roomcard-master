
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
    isPlaying:false,
    isRevSence:false,
    mjTurnOver:null,
    ///////////////////////init start///////////////////////
    init:function()
    {   
        playNode._registEvent()
        playNode._initCallBack()
        var node = managerRes.loadCCB(resp.playCCB, this)
        playNode.animationManager = node.animationManager
        playNode.node  = node

        isOpenPTH = false

        majiangFactory.isShowHeap = false
        //majiangFactory.outCardMode = 3
        majiangFactory.isPublicAnGang = false
        majiangFactory.heapCountOneRow = 26
        majiangFactory.init( playNode.mjTableNode, playNode.decorateMj )
        majiangFactory.scale_rightLeft -= 0.1
        majiangFactory.downMjAndNewMjInterval = 22
        majiangFactory.rightMjAndNewMjInterval= 22
        majiangFactory.leftMjAndNewMjInterval = 22
        majiangFactory.upMjAndNewMjInterval   = 10
        majiangFactory.discardCountOneLine = 7
        majiangFactory.discardCountOneRow = 7

        playNode.timer = majiangTimer4D.getTimer()
        playNode.timerNode.addChild(playNode.timer)
        playNode.timerNode.setScale( majiangFactory.scale_upDown*0.9 )

        majiangFactory.currentDiscardMjNode.setScale(0.75)
    },
    onReStart:function()
    {
        playNode.handMajiangs4D = []
        playNode.handGroupNode4D = []
        playNode.discardMajiangs4D = []
        playNode.weaveMajiangs4D = []
        playNode.isLookingResult = false
        playNode.isPlaying = false
        majiangFactory.isPublicAnGang = false

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

        //单个方向的听牌父节点
        currentRoundNode.tingNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.tingNode)

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
    },
    clearCurrentRoundNode:function(currentRoundNode)
    {           
        //一轮结束 clearCurrentRoundNode
        currentRoundNode.tingNode.removeAllChildren()
        currentRoundNode.handMajiangsNode.removeAllChildren()
        currentRoundNode.discardMajiangsNode.removeAllChildren()
        currentRoundNode.weaveMajiangsNode.removeAllChildren()
        currentRoundNode.heapMajiangsNode.removeAllChildren()
        currentRoundNode.flowerMajiangsNode.removeAllChildren()
        currentRoundNode.scoreChange.removeAllChildren()
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

        var direction = tableData.getShowChairIdWithServerChairId(user.wChairID)
        //设置三处四方向的麻将位置 
        if(direction==0)
        {
            currentRoundNode.scoreChange.setPosition( cc.p(100, 30) )  

            //discard
            var discardMajiangsNodeWith = (majiangFactory.discardCountOneRow-1)*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
            var mjsDiscardHeight = majiangFactory.down_discardHeight*majiangFactory.scale_upDown

            //-chairNodePosInMjTable.x相当于从posx=0开始算起
            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + 
            0.5*( majiangFactory.mjTableNode.width - discardMajiangsNodeWith)
            //currentRoundNode.discardMajiangsNode.y = -chairNodePosInMjTable.y + centerPosY - mjsDiscardHeight*0.5 - 43*majiangFactory.scale_upDown
            currentRoundNode.discardMajiangsNode.y = -chairNodePosInMjTable.y + centerPosY - mjsDiscardHeight - 42
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

            currentRoundNode.tingNode.x = -chairNodePosInMjTable.x + (majiangFactory.mjTableNode.width/2)
            currentRoundNode.tingNode.y = currentRoundNode.flowerMajiangsNode.y + 50
            currentRoundNode.tingNode.setLocalZOrder(10)
        }
        else if(direction==2)
        {       
            currentRoundNode.scoreChange.setPosition( cc.p(-70, -30) )  

            //discard
            var discardMajiangsNodeWith = (majiangFactory.discardCountOneRow-1)*majiangFactory.up_discardWidth*majiangFactory.scale_upDown
            var mjsDiscardHeight = majiangFactory.up_discardHeight*majiangFactory.scale_upDown

            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - 
            0.5*( majiangFactory.mjTableNode.width - discardMajiangsNodeWith)
            //currentRoundNode.discardMajiangsNode.y =  -chairNodePosInMjTable.y + centerPosY + mjsDiscardHeight*0.5 + 43*majiangFactory.scale_upDown
            currentRoundNode.discardMajiangsNode.y =  -chairNodePosInMjTable.y + centerPosY + mjsDiscardHeight + 34
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

            currentRoundNode.tingNode.x = -chairNodePosInMjTable.x + (majiangFactory.mjTableNode.width/2 )
            currentRoundNode.tingNode.y = currentRoundNode.flowerMajiangsNode.y
            currentRoundNode.tingNode.setLocalZOrder(10)
        } 
        else if(direction==1)
        { 
            currentRoundNode.scoreChange.setPosition( cc.p(-150, -50) )  
            //discard
            var downDiscardMajiangsNodeWidth = majiangFactory.discardCountOneRow*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
            var discardMajiangsNodeHeight = (majiangFactory.discardCountOneLine-1)*majiangFactory.rightDiscardIntervalY*majiangFactory.scale_rightLeft
            var distanceFromUpDown = 0.5*(majiangFactory.mjTableNode.height - downHandHeight - upHandHeight - discardMajiangsNodeHeight)

            // currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - 
            // 0.5*( majiangFactory.mjTableNode.width - downDiscardMajiangsNodeWidth ) + (10 + 0.5*majiangFactory.right_discardWidth*majiangFactory.scale_rightLeft)
            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - 
            0.5*( majiangFactory.mjTableNode.width - downDiscardMajiangsNodeWidth ) + (30 + 0.5*majiangFactory.right_discardWidth*majiangFactory.scale_rightLeft)
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

            currentRoundNode.tingNode.y = -chairNodePosInMjTable.y + (majiangFactory.mjTableNode.height/2 )
            currentRoundNode.tingNode.x = currentRoundNode.flowerMajiangsNode.x - 10
            currentRoundNode.tingNode.setLocalZOrder(10)
        }
        else if(direction==3)
        {   
            currentRoundNode.scoreChange.setPosition( cc.p(100, 30) )  
            //discard
            var downDiscardMajiangsNodeWidth = majiangFactory.discardCountOneRow*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
            var discardMajiangsNodeHeight = (majiangFactory.discardCountOneLine-1)*majiangFactory.leftDiscardIntervalY*majiangFactory.scale_rightLeft
            var distanceFromUpDown = 0.5*(majiangFactory.mjTableNode.height - downHandHeight - upHandHeight - discardMajiangsNodeHeight)

            // currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x +
            // 0.5*( majiangFactory.mjTableNode.width - downDiscardMajiangsNodeWidth )  - (10 + 0.5*majiangFactory.left_discardWidth*majiangFactory.scale_rightLeft)
            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x +
            0.5*( majiangFactory.mjTableNode.width - downDiscardMajiangsNodeWidth )  - (30 + 0.5*majiangFactory.left_discardWidth*majiangFactory.scale_rightLeft)
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

            currentRoundNode.tingNode.y = -chairNodePosInMjTable.y + (majiangFactory.mjTableNode.height/2 )
            currentRoundNode.tingNode.x = currentRoundNode.flowerMajiangsNode.x + 10
            currentRoundNode.tingNode.setLocalZOrder(10)
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
    },
    getAfterChiForbidCard:function(provideIdx, action)
    {
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
            call.cbMoPao = 1
            socket.sendMessage(MDM_GF_GAME,SUB_C_CALL,call)

            playNode.gamesetNode.setVisible(false)
        }

        playNode.gamesetSureCancel = function()
        {
            var call = getObjWithStructName('CMD_C_Call')
            call.cbMoPao = 0
            socket.sendMessage(MDM_GF_GAME,SUB_C_CALL,call)

            playNode.gamesetNode.setVisible(false)
        }

        playNode.actionCall_chi = function()
        {
            var btn = playNode.btn_chi
            var actions = btn.actions
            var provideIdx = cmdBaseWorker.cbProvideCardData

            var sendChi = function(sortedOperateIdxs, action)
            {
                var operateIdxs = cmdBaseWorker.sortedOperateIdxs2OperateIdxs(provideIdx, sortedOperateIdxs)
                cmdBaseWorker.sendMessage_chi(operateIdxs, action)
                playNode.hideActionBtns()

                playNode.getAfterChiForbidCard(provideIdx, action)
            }

            if(actions.length>1)
            {
                playNode.btn_chi.setVisible(false)
                playNode.btn_peng.setVisible(false)
                playNode.btn_gang.setVisible(false)
                playNode.btn_ting.setVisible(false)
                playNode.btn_hu.setVisible(false)
                playNode.btn_egg.setVisible(false)

                var idxsArray = []
                for(var i=0;i<actions.length;i++)
                {
                    idxsArray[i] = cmdBaseWorker.getSortedOperateIdxs(provideIdx, actions[i])
                }

                majiangFactory.showChoosePopOfAction(idxsArray, actions, sendChi)
            }
            else
            {
                var sortedOperateIdxs = cmdBaseWorker.getSortedOperateIdxs(provideIdx, actions[0])
                sendChi(sortedOperateIdxs, actions[0])
            }
        }
        playNode.actionCall_egg = function()
        {
            var sendShowEgg = function(sortedOperateIdxs)
            {
                cmdBaseWorker.sendMessage_ShowEgg(sortedOperateIdxs)
                playNode.hideActionBtns()
            }

            //判断egg选项个数
            var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
            var direction = tableData.getShowChairIdWithServerChairId(selfChairId)
            var idxs = cmdBaseWorker.searchEggIdxs(playNode.handMajiangs4D[direction], playNode.weaveMajiangs4D[direction])
           
            gameLog.log("actionCall_egg结果:::", idxs)
            if(idxs.length>1)
            {
                playNode.btn_chi.setVisible(false)
                playNode.btn_peng.setVisible(false)
                playNode.btn_gang.setVisible(false)
                playNode.btn_ting.setVisible(false)
                playNode.btn_egg.setVisible(false)
                playNode.btn_hu.setVisible(false)

                var idxsArray = []
                var actions = []
                for(var i=0;i<idxs.length;i++)
                {
                    idxsArray[i] = idxs[i]
                    actions[i] = WIK_SHOWEGG
                }
                cmdBaseWorker.showChoosePopOfAction(idxsArray, actions, sendShowEgg)
            }
            else
            {
                sendShowEgg(idxs[0])
            }
        }
        playNode.actionCall_peng = function()
        {
            var btn = playNode.btn_peng
            cmdBaseWorker.sendMessage_peng([cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData] )
            playNode.hideActionBtns()
        }

        playNode.actionCall_gang = function()
        {
            var btn = playNode.btn_gang

            var sendGang = function(sortedOperateIdxs)
            {
                cmdBaseWorker.sendMessage_gang(sortedOperateIdxs)
                playNode.hideActionBtns()
            }

            //吃碰后cmdBaseWorker.wProvideUser == INVALID_CHAIR 或自摸 都要searchGangIdxs
            if(cmdBaseWorker.wProvideUser == INVALID_CHAIR || cmdBaseWorker.wProvideUser == tableData.getUserWithUserId(selfdwUserID).wChairID) 
            {
                var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
                var direction = tableData.getShowChairIdWithServerChairId(selfChairId)
                var idxs = cmdBaseWorker.searchGangIdxs(playNode.handMajiangs4D[direction], playNode.weaveMajiangs4D[direction])
                if(idxs.length>1)
                {
                    playNode.btn_chi.setVisible(false)
                    playNode.btn_peng.setVisible(false)
                    playNode.btn_gang.setVisible(false)
                    playNode.btn_ting.setVisible(false)
                    playNode.btn_hu.setVisible(false)
                    playNode.btn_egg.setVisible(false)

                    var idxsArray = []
                    var actions = []
                    for(var i=0;i<idxs.length;i++)
                    {
                        idxsArray[i] = [idxs[i], idxs[i], idxs[i], idxs[i]]
                        actions[i] = WIK_GANG
                    }
                    majiangFactory.showChoosePopOfAction(idxsArray, actions, sendGang)
                }
                else
                {
                    sendGang([idxs[0], idxs[0], idxs[0], idxs[0]])
                }
            }
            else
            {   
                sendGang([cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData])
            }
        }

        playNode.actionCall_ting = function()
        {
            //alert('actionCall_ting')
            var btn = playNode.btn_ting
            cmdBaseWorker.sendMessage_Ting([cmdBaseWorker.cbProvideCardData])
            playNode.hideActionBtns()
        }

        playNode.actionCall_hu = function()
        {
            var btn = playNode.btn_hu
            cmdBaseWorker.sendMessage_hu([cmdBaseWorker.cbProvideCardData])
            playNode.hideActionBtns()
        }

        playNode.actionCall_guo = function()
        {
            var btn = playNode.btn_guo
            cmdBaseWorker.sendMessage_guo()
            playNode.hideActionBtns()  
            majiangFactory.chooseItemsNode.removeAllChildren() 
        }

        playNode.actionCall_replace = function()//不需要玩家手动触发 只要收到这个动作 自动执行
        {
            alert('actionCall_replace')  
        }
    },
    decorateMj:function(mj)
    {
        var idx = mj.cardData 
        var isMagic = cmdBaseWorker.isCaiHua(idx)

        if( cmdBaseWorker.isMagicCard(mj.cardData, cmdBaseWorker.cbMagicCardData) ||  isMagic==true)
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
                s.setTag(139)
                zi.addChild(s)
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
        playNode.isPlaying = false
        playNode.isRevSence = true

        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)

        if (typeSelNode.haveSetGameType == false)
            typeSelNode.userUpdate()

        if (cmdBaseWorker.cbGameType == 0)
            playNode.gameTypeTTF.setString("16 番")
        else if (cmdBaseWorker.cbGameType == 1)
            playNode.gameTypeTTF.setString("32 番")

        typeSelNode.startBtnEnabled()
    },
    onCMD_StatusCall:function()
    {
        playNode.isPlaying = true
        playNode.isRevSence = true

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        for (var i=0;i<GAME_PLAYER;i++)
        {
            if(cmdBaseWorker.cbCallRecord[i][0] == INVALID_BYTE)
            {
                if(selfChairId == i)
                    playNode.showGameset()
            }
        }
    },
    onCMD_StatusPlay:function() 
    {
        playNode.isPlaying = true

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)

        typeSelNode.startBtnEnabled()

        if (typeSelNode.haveSetGameType == false)
            typeSelNode.userUpdate()

        //初始化Idx2ScoreMap
        var idxs = []
        var scores = []
        var magicCardData = cmdBaseWorker.cbMagicCardData 
        for(var i=0;i<magicCardData.length;i++)
        {
            if(magicCardData[i] == INVALID_CARD_DATA)
                break
            idxs[idxs.length] = magicCardData[i]
            scores[scores.length] = -1000+magicCardData[i]
        }
        idxs[idxs.length] = REPLACE_CARD_DATA
        scores[scores.length] = magicCardData[0]
        majiangFactory.initCardData2ScoreMap( idxs, scores )

        playNode.timer.initFenwei( tableData.getShowChairIdWithServerChairId(cmdBaseWorker.cbEastUser) )
        // playNode.timer.initFenwei( tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser) )
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
        playNode.timerNode.setVisible(true)

        if(cmdBaseWorker.wOutCardUser!=INVALID_WORD)
        {
            var d = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)
            playNode.setCurrentDiscardMj(cmdBaseWorker.cbOutCardData, d)
        }

        var self = tableData.getUserWithUserId(selfdwUserID)

        /////吃碰杠胡
        var sortedActions = cmdBaseWorker.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var isActioning = sortedActions.length>0
        if(isActioning && self.cbUserStatus == US_PLAYING)
            playNode.showActionBtns(sortedActions)

        if (cmdBaseWorker.cbGameType == 0)
            playNode.gameTypeTTF.setString("16 番")
        else if (cmdBaseWorker.cbGameType == 1)
            playNode.gameTypeTTF.setString("32 番")

        var handIdxsArray = [[[], null], [[], null], [[], null], [[], null]]
        var discardIdxsArray = [[],[],[],[]]
        var weaveItemArray = [[],[],[],[]]

        for(var i=0;i<GAME_PLAYER;i++)
        {
            var direction = tableData.getShowChairIdWithServerChairId(i)
            var weaveItems = cmdBaseWorker.WeaveItemArray[i]
            //组合牌
            for(var j=0;j<MAX_WEAVE;j++)
            {
                var t = weaveItems[j].cbCardDatas
                weaveItems[j].cbCardDatas = cmdBaseWorker.sortWeaveIdxs(weaveItems[j].cbWeaveKind, t)

                weaveItems[j].provideDirection = tableData.getShowChairIdWithServerChairId(weaveItems[j].wProvideUser)
            }
            weaveItemArray[direction] = weaveItems

            var idxs = []
            for(var j=0;j<MAX_COUNT;j++)
            {
                idxs[j] = 0
            }
            var handIdxs = cmdBaseWorker.cbHandCardData[i]
            if(cmdBaseWorker.cbHandCardCount[i] + cmdBaseWorker.cbWeaveCount[i]*3 == MAX_COUNT)
            {
                handIdxsArray[direction][0] = handIdxs.slice(0, handIdxs.length-1)
                handIdxsArray[direction][1] = handIdxs[handIdxs.length-1]
            }
            else
                handIdxsArray[direction][0] = handIdxs

            discardIdxsArray[direction] = cmdBaseWorker.cbDiscardCardData[i].slice(0, cmdBaseWorker.cbDiscardCount[i])
        }
        // console.log(6666, handIdxsArray, discardIdxsArray, weaveItemArray)
        cmdBaseWorker.sortHandIdxs(handIdxsArray[0][0]) 

        // get heapIdxsArray
        var heapIdxsArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)
        heapIdxsArray[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.TurnoverCard[0].wHeapDir)][cmdBaseWorker.TurnoverCard[0].wHeapPos] = 0      
        playNode.sendCardsAction(handIdxsArray, discardIdxsArray, weaveItemArray, heapIdxsArray, cmdBaseWorker.cbPlayerFlowerCardData) 

        var isHaveTing = false
        for (var k = 0; k < GAME_PLAYER; k++)
        {
            if (cmdBaseWorker.cbTingUser[k] != 0)
            {
                isHaveTing = true
                break
            }
        }

        if (cmdBaseWorker.cbTingUser[self.wChairID] != 0 && cmdBaseWorker.bLookedBao[self.wChairID] == true)
        {
            playNode.setBaoHeap(0)
            playNode.setBaoHeap(cmdBaseWorker.TurnoverCard[0].cbCardData)
        }
        else if (isHaveTing)
            playNode.setBaoHeap(0)

        for (var i = 0; i < GAME_PLAYER; i++)
        {
            if (cmdBaseWorker.cbTingUser[i] != 0)
                cmdBaseWorker.userTing(i)
        }
        
        if(isActioning == false && cmdBaseWorker.isAutoDisCard == true && cmdBaseWorker.cbTingUser[self.wChairID] != 0)
            cmdBaseWorker.autoDisCard(cmdBaseWorker.cbTingUserRev[self.wChairID])
        else if (cmdBaseWorker.isAutoDisCard2 == true && isActioning == false)
            cmdBaseWorker.autoDisCard(0x12)
    },
    onCMD_Call:function()
    {
    },
    onCMD_GameStart:function() 
    {
        if(!playNode.isPlaying)//有的游戏有call状态
        {
            cocos.clearInterval(playNode.updateOnFree, playNode.node)
            playNode.isPlaying = true

            if(playNode.isLookingResult)
            {
                playNode.resetPlayNode()
            } 
        }

        cmdBaseWorker.isShowEggTime = false
        cmdBaseWorker.isLastFourCard = false
        cmdBaseWorker.cbUserTingMode = 1
        //初始化Idx2ScoreMap
        var idxs = []
        var scores = []
        var magicCardData = cmdBaseWorker.cbMagicCardData 
        for(var i=0;i<magicCardData.length;i++)
        {
            if(magicCardData[i] == INVALID_CARD_DATA)
                break
            idxs[idxs.length] = magicCardData[i]
            scores[scores.length] = -1000+magicCardData[i]
        }
        idxs[idxs.length] = REPLACE_CARD_DATA
        scores[scores.length] = magicCardData[0]
        majiangFactory.initCardData2ScoreMap( idxs, scores )

        var self = tableData.getUserWithUserId(selfdwUserID)

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)

        //get handIdxsArray
        var handIdxsArray = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var direction = i
            var serverChairid = tableData.getServerChairIdWithShowChairId(direction)

            var idxs = []
            for(var ii=0;ii<MAX_COUNT;ii++)
            {
                idxs[ii] = 0
            }
            if(serverChairid==self.wChairID)
                idxs = cmdBaseWorker.cbHandCardData[serverChairid]

            var oldIdxs = idxs.slice(0, MAX_COUNT-1)
            handIdxsArray[direction] = [oldIdxs, null]
        }
        cmdBaseWorker.sortHandIdxs(handIdxsArray[0][0]) 

        //get heapIdxsArray 
        var heapIdxsArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard) 
        playNode.sendCardsAction(handIdxsArray, [[],[],[],[]], [[],[],[],[]], heapIdxsArray, []) 

        playNode.setCurrentRoundNodesVisible(false)
        playNode.actionBtns.setVisible(false)
        managerTouch.closeTouch() //避免在不知道牌的情况下 把牌打出去
        //提前保存可能被破坏的数据  掷骰子是庄家出牌破坏数据 因为可能庄家筛子先出完
        var bankerShowChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser)
        function gameStart()
        {
            var EastShowChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.cbEastUser)
            playNode.timer.initFenwei( EastShowChairid )
            // playNode.timer.initFenwei( bankerShowChairid )
            playNode.setCurrentRoundNodesVisible(true)

            function afterTurnover()
            {                              
                playNode.timerNode.setVisible(true)
                playNode.actionBtns.setVisible(true)
                managerTouch.openTouch()
            }
            afterTurnover()
        }

        function bankerPlayDice(cbSlice, call)
        { //抓牌方位
            var siceNum1 = getRandNum(Math.max(cbSlice-6, 1), Math.min(cbSlice-1, 6))
            var siceNum2 = cbSlice - siceNum1
            playNode.playDiceOneDirection(call, siceNum1, siceNum2, bankerShowChairid)
        }

        var a = cc.sequence( 
            cc.callFunc(function()
            {   
                bankerPlayDice(cmdBaseWorker.cbSiceCount, '')
            }),
            cc.delayTime(2.1),
            cc.callFunc(function()
            {   
                bankerPlayDice(cmdBaseWorker.cbCaiShenPos, gameStart)
            }) 
        )           
        playNode.node.runAction(a)
    },
    onCMD_OutCard:function() 
    {
        var outUser = tableData.getUserWithChairId(cmdBaseWorker.wOutCardUser)
        var outDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)  
        var outIdx = cmdBaseWorker.cbOutCardData

        if (cmdBaseWorker.isShowEggTime == true)
        {
            playNode.hideActionBtns()
            cmdBaseWorker.cbFiveSTime = true
        }

        playNode.timer.switchTimer([])
        playNode.playMajiangEffect(outIdx, outUser.cbGender)
        managerAudio.playEffect('gameRes/sound/discard.mp3')

        var majiangs = playNode.handMajiangs4D[outDir]
        if(outUser.dwUserID==selfdwUserID)
        {
            majiangFactory.deleteHandMajiangs(majiangs, outDir, outIdx)
            var newMj = majiangs[1]
            if(newMj)
            {
                majiangFactory.insertHandMajiangsOld(majiangs, outDir, newMj.cardData, playNode.handGroupNode4D[outDir])
                majiangFactory.deleteHandMajiangNew(majiangs)
            }
        }
        else
            majiangFactory.deleteHandMajiangs(majiangs, outDir, 0)

        cmdBaseWorker.addDiscardMajiangs(playNode.discardMajiangs4D[outDir], outDir,
        outIdx, outUser.userNodeInsetChair.currentRoundNode.discardMajiangsNode)

        playNode.setCurrentDiscardMj(outIdx, outDir)

        var self = tableData.getUserWithUserId(selfdwUserID)
        var sortedActions = cmdBaseWorker.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && self.cbUserStatus == US_PLAYING)
            playNode.showActionBtns(sortedActions)

        cmdBaseWorker.cbTingUserRev[cmdBaseWorker.wOutCardUser] = INVALID_BYTE

        if (cmdBaseWorker.cbTingUser[cmdBaseWorker.wOutCardUser] != 0 && cmdBaseWorker.cbUserTingMode != 0)
        { //&& self.wChairID == cmdBaseWorker.wOutCardUser
            cmdBaseWorker.cbTingUser[cmdBaseWorker.wOutCardUser] = cmdBaseWorker.cbUserTingMode
            cmdBaseWorker.setTingLogo(cmdBaseWorker.wOutCardUser)
        }
    },
    onActionReplace:function(cardData, operateUser, flowerMajiangs4D)
    {
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var operateFlowerMajiangs = flowerMajiangs4D[operateUserDir]
        var operateFlowerMajiangsNode = operateUser.userNodeInsetChair.currentRoundNode.flowerMajiangsNode

        majiangFactory.addFlowerMajiangs(operateFlowerMajiangs, operateUserDir, cardData, operateFlowerMajiangsNode)
    },
    addHandMajiangNew:function(handMajiangs, direction, cardData, parent)
    {
        majiangFactory.moveHandMajiangNew2Old(handMajiangs, direction, parent)
        var oldMajiangs = handMajiangs[0]
        var majiang = majiangFactory.getOne(cardData, 0, direction)
        var pos = majiangFactory.getHandMajiangPosAndTag(oldMajiangs.length, null, direction, true)
        majiang.x = pos.x
        majiang.y = pos.y
        if (direction == 0)
            majiang.x -= 15*majiangFactory.scale_upDown

        majiang.setLocalZOrder(pos.zOrder)
        majiang.idxInHandMajiangs = null
        parent.addChild(majiang)

        handMajiangs[1] = majiang
    },
    addHandMajiang:function(handMajiangs, direction, cardData, parent, weaveCount)
    {
        var handMajiangsLen = 0
        handMajiangsLen += handMajiangs[0].length
        handMajiangsLen += handMajiangs[1]?1:0
        if(handMajiangsLen + weaveCount*3 == MAX_COUNT-1)
            playNode.addHandMajiangNew(handMajiangs, direction, cardData, parent)
        else
            majiangFactory.insertHandMajiangsOld(handMajiangs, direction, cardData, parent)
    },
    onCMD_SendCard:function() 
    {
        if(cmdBaseWorker.cbOutCardCount != 0)
            managerAudio.playEffect('gameRes/sound/sendcard.mp3')

        var isSelf = tableData.getUserWithChairId(cmdBaseWorker.wTakeCardUser).dwUserID == selfdwUserID

        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])

        var takeDir =  tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTakeCardUser)   
        ///////
        for(var i=0;i<cmdBaseWorker.cbSendCardCount;i++)
        {
            var item = cmdBaseWorker.sendCardArray[i]
            //牌堆
            var heapMajiangsDir = tableData.getShowChairIdWithServerChairId(item.wHeapDir)  
            majiangFactory.deleteHeapMajiangs(playNode.heapMajiangs4D[heapMajiangsDir], [item.wHeapPos])

            var idx = isSelf?item.cbCardData:0
            playNode.addHandMajiang(playNode.handMajiangs4D[takeDir], takeDir, idx, playNode.handGroupNode4D[takeDir], playNode.weaveMajiangs4D[takeDir].length)
        }
        /////摸到麻将时有可能出现杠听胡补花
        var sortedActions = cmdBaseWorker.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && isSelf)
            playNode.showActionBtns(sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
        else if (isSelf)
        {
            if (cmdBaseWorker.isAutoDisCard == true || cmdBaseWorker.isLastFourCard == true)
            { // 如果听牌自动出牌
                var a = cc.sequence( 
                    cc.delayTime(0.8),
                    cc.callFunc(function()
                    {   
                        var item = cmdBaseWorker.sendCardArray[0]
                        var OutCard = getObjWithStructName('CMD_C_OutCard')
                        OutCard.cbOutCardData = item.cbCardData
                        socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                        playNode.hideActionBtns()
                    }) 
                )           
                playNode.node.runAction(a)
            }
        }
    },
    CMD_S_LookBao:function()
    {
        if (cmdBaseWorker.wLookBaoUser == INVALID_WORD)
            return

        var isSelf = tableData.getUserWithChairId(cmdBaseWorker.wLookBaoUser).dwUserID == selfdwUserID
        var sortedActions = cmdBaseWorker.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && isSelf)
            playNode.showActionBtns(sortedActions)  
        if (isSelf && cmdBaseWorker.cbTingUser[cmdBaseWorker.wLookBaoUser] != 0)
            playNode.setBaoHeap(cmdBaseWorker.TurnoverCard[0].cbCardData)
    },
    CMD_S_ChangeBao:function()
    {
        if (cmdBaseWorker.bExistBao)
        {
            if (cmdBaseWorker.bLookedBao == true)
                playNode.setBaoHeap(cmdBaseWorker.TurnoverCard[0].cbCardData)
            else
                playNode.setBaoHeap(0)
        }
        
        topUINode.warnNode.setVisible(true)
        if (cmdBaseWorker.bExistBao == false)
        {
            topUINode.warn_label.setString('宝牌已取消')
            playNode.clearBaoNode()
            if (majiangFactory.isShowHeap == true)
            {
                if (playNode.mjTurnOver && playNode.mjTurnOver.cardData != null)
                        playNode.mjTurnOver.setVisible(true)
            }
        }
        else
            topUINode.warn_label.setString('宝牌已更换')
        var a = cc.sequence( 
            cc.delayTime(3.5),
            cc.callFunc(function()
            {   
                topUINode.warnNode.setVisible(false)
            }) 
        )           
        playNode.node.runAction(a)
    },
    showBao:function(idx)
    {
        if(idx == INVALID_CARD_DATA)
            return

        if (idx != 0)
        {
            var majiang = playNode.baoNode.getChildByTag(4410)
            if (majiang)
            {
                if (majiang.cardData == idx)
                    return
            }
        }

        playNode.baoNode.removeAllChildren()
        var mj = majiangFactory.getOne(idx, 1, 0, true)
        mj.x = 25
        mj.y = 0
        mj.setTag(4410)
        mj.setScale(1.3)
        playNode.baoNode.addChild(mj)

        if (idx == 0)
        {
            var bg = new cc.Sprite('#baoPic.png')
            bg.setScaleX(mj.height*0.6/bg.height)
            bg.setScaleY(mj.height*0.6/bg.height)
            bg.y = mj.height - bg.height - 2
            bg.x = 25 + (mj.width - bg.width)/2 + 4
            
            playNode.baoNode.addChild(bg)
        }
    },
    clearBaoNode:function()
    {
        playNode.baoNode.removeAllChildren()
    },
    setBaoHeap:function(cardData)
    {
        if (majiangFactory.isShowHeap == true)
        {
            var self = tableData.getUserWithUserId(selfdwUserID)                        
            var mjPos = cmdBaseWorker.TurnoverCard[0].wHeapPos
            var dir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.TurnoverCard[0].wHeapDir)
            var heapMajiangs = playNode.heapMajiangs4D[dir]
            var mj = heapMajiangs[mjPos]
            if (mj && mj.parent != null)
            {
                if (cardData == 0)
                {
                    if (playNode.mjTurnOver && playNode.mjTurnOver.cardData != null)
                        playNode.mjTurnOver.setVisible(true)
                    mj.setVisible(false)
                    playNode.mjTurnOver = mj
                }
                else if (playNode.mjTurnOver && playNode.mjTurnOver.cardData != cardData)
                {
                    playNode.mjTurnOver.setVisible(true)
                    playNode.mjTurnOver = mj
                    mj.setVisible(false)
                }
            }
        }
        
        playNode.showBao(cardData)
    },
    onCMD_S_OperateEggRes:function()
    {
        var selfUser = tableData.getUserWithUserId(selfdwUserID)
        var isSelf = selfUser.wChairID == cmdBaseWorker.wOperateUser
        if (isSelf)
        {
            playNode.hideActionBtns()
        }

        if(cmdBaseWorker.cbOperateCode != WIK_NULL)
        {
            //动作效果
            var operateUser = tableData.getUserWithChairId(cmdBaseWorker.wOperateUser)
            var provideUser = tableData.getUserWithChairId(cmdBaseWorker.wOperateUser)
            var majiangs4W4D = {
                handMajiangs4D:playNode.handMajiangs4D,
                discardMajiangs4D:playNode.discardMajiangs4D,
                weaveMajiangs4D:playNode.weaveMajiangs4D,
                flowerMajiangs4D:playNode.flowerMajiangs4D,
            }

            var idxs = cmdBaseWorker.sortWeaveIdxs(cmdBaseWorker.cbOperateCode, cmdBaseWorker.cbOperateCardData)
            cmdBaseWorker.onActionResult(cmdBaseWorker.cbOperateCode, idxs, operateUser, provideUser,
                majiangs4W4D, playNode.handGroupNode4D)     

            playNode.playAction(cmdBaseWorker.cbOperateCode, operateUser) //音效动画
        }
        if (isSelf)
        {
            var sortedActions = cmdBaseWorker.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
            if(sortedActions.length>0 && selfUser.cbUserStatus == US_PLAYING)
            {
                if((cmdBaseWorker.cbActionMask&WIK_GANG)!=0)
                {
                    cmdBaseWorker.wProvideUser    = INVALID_CHAIR
                    if (cmdBaseWorker.cbOperateCode == WIK_SHOWEGG && cmdBaseWorker.cbTingUser[selfUser.wChairID] != 0)
                    {
                        //
                    }
                    else
                        cmdBaseWorker.cbProvideCardData  = INVALID_CARD_DATA    
                }
                
                playNode.showActionBtns(sortedActions)  //吃碰后杠 idx不确定 需要searchGangIdxs
            }
        }
    },
    onCMD_S_OperateEggEnd:function()
    {
        if (cmdBaseWorker.cbFiveSTime == false)
            playNode.hideActionBtns()
        topUINode.showEggTime.setVisible(false)
        cmdBaseWorker.isShowEggTime = false
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
        cmdBaseWorker.cbFiveSTime = false
    },
    setTimeFiveS:function()
    {
        if (cmdBaseWorker.isShowEggTime==true)
            topUINode.showEggTime.setVisible(true)
        var time = 3
        topUINode.label_Time.setString('3')
        function recordTime()
        {
            var a = cc.sequence( 
                cc.delayTime(1),
                cc.callFunc(function()
                {   
                    if (time > 0)
                    {
                        time -= 1
                        topUINode.label_Time.setString(time)
                        recordTime()
                    }
                    else
                        topUINode.showEggTime.setVisible(false)
                }) 
            )           
            playNode.node.runAction(a)
        }
        if (cmdBaseWorker.isShowEggTime==true)
        {
            cmdBaseWorker.cbFiveSTime = false
            recordTime()
        }
    },
    onCMD_OperateResult:function() 
    {
        playNode.hideActionBtns()
        majiangFactory.hideCurrentDiscardMj()
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
        var self = tableData.getUserWithUserId(selfdwUserID)

        if(cmdBaseWorker.cbOperateCode != WIK_NULL)
        {
            //动作效果
            var operateUser = tableData.getUserWithChairId(cmdBaseWorker.wOperateUser)
            var provideUser = tableData.getUserWithChairId(cmdBaseWorker.wProvideUser)
            var majiangs4W4D = {
                handMajiangs4D:playNode.handMajiangs4D,
                discardMajiangs4D:playNode.discardMajiangs4D,
                weaveMajiangs4D:playNode.weaveMajiangs4D,
                flowerMajiangs4D:playNode.flowerMajiangs4D,
            }

            var idxs = cmdBaseWorker.sortWeaveIdxs(cmdBaseWorker.cbOperateCode, cmdBaseWorker.cbOperateCardData)
            cmdBaseWorker.onActionResult(cmdBaseWorker.cbOperateCode, idxs, operateUser, provideUser,
                majiangs4W4D, playNode.handGroupNode4D)     

            playNode.playAction(cmdBaseWorker.cbOperateCode, operateUser) //音效动画

            if (cmdBaseWorker.cbOperateCode == WIK_LISTEN)
            { // 听牌
                playNode.playGenderEffect('ting0', tableData.getUserWithChairId(cmdBaseWorker.wOperateUser).cbGender)
                cmdBaseWorker.cbTingUser[cmdBaseWorker.wOperateUser] = cmdBaseWorker.cbUserTingMode
                cmdBaseWorker.userTing(cmdBaseWorker.wOperateUser)
                //playNode.showAnGangCards()
                var tingCount = 0
                for (var i = 0; i < GAME_PLAYER; i++)
                {
                    if (cmdBaseWorker.cbTingUser[i] != 0)
                        tingCount++
                }
                if (tingCount == 1)
                {
                    playNode.setBaoHeap(0)
                    topUINode.warnNode.setVisible(true)
                    topUINode.warn_label.setString('宝牌已选取')
                    var a = cc.sequence( 
                        cc.delayTime(3.5),
                        cc.callFunc(function()
                        {   
                            topUINode.warnNode.setVisible(false)
                        }) 
                    )           
                    playNode.node.runAction(a)
                }
            }
        }

        var sortedActions = cmdBaseWorker.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(cmdBaseWorker.cbOperateCode == WIK_NULL || cmdBaseWorker.cbOperateCode == WIK_LISTEN || (cmdBaseWorker.cbOperateCode == WIK_SHOWEGG && sortedActions.length<=0 && cmdBaseWorker.cbEggStatus==1))
        {
            if (cmdBaseWorker.isLastFourCard == true && cmdBaseWorker.wOperateUser == tableData.getUserWithUserId(selfdwUserID).wChairID)
            { // 最后四张牌 要随便出张牌
                var a = cc.sequence( 
                    cc.delayTime(0.8),
                    cc.callFunc(function()
                    {   
                        var item = cmdBaseWorker.sendCardArray[0]
                        var OutCard = getObjWithStructName('CMD_C_OutCard')
                        OutCard.cbOutCardData = 0x12
                        socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                        playNode.hideActionBtns()
                    }) 
                )           
                playNode.node.runAction(a)
            }
            else
            {
                if (cmdBaseWorker.wOperateUser == tableData.getUserWithUserId(selfdwUserID).wChairID && cmdBaseWorker.cbTingUser[cmdBaseWorker.wOperateUser] != 0)
                {//本人是听牌玩家 自动出牌
                    if (cmdBaseWorker.cbTingUserRev[cmdBaseWorker.wOperateUser] != INVALID_BYTE && cmdBaseWorker.isAutoDisCard)
                    {
                        var a = cc.sequence( 
                            cc.delayTime(0.8),
                            cc.callFunc(function()
                            {   
                                var item = cmdBaseWorker.sendCardArray[0]
                                var OutCard = getObjWithStructName('CMD_C_OutCard')
                                OutCard.cbOutCardData = cmdBaseWorker.cbTingUserRev[cmdBaseWorker.wOperateUser]
                                socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                                playNode.hideActionBtns()
                            }) 
                        )           
                        playNode.node.runAction(a)
                    }
                }
            }
        }
        
        if(sortedActions.length>0 && self.cbUserStatus == US_PLAYING)
        {
            if((cmdBaseWorker.cbActionMask&WIK_GANG)!=0)
            {
                cmdBaseWorker.wProvideUser    = INVALID_CHAIR
                if (cmdBaseWorker.cbOperateCode == WIK_SHOWEGG && cmdBaseWorker.cbTingUser[self.wChairID] != 0)
                {
                    //
                }
                else
                    cmdBaseWorker.cbProvideCardData  = INVALID_CARD_DATA    
            }
            
            playNode.showActionBtns(sortedActions)  //吃碰后杠 idx不确定 需要searchGangIdxs
        }

        playNode.setTimeFiveS()
    },
    onSMD_GameType:function()
    {
        if (cmdBaseWorker.cbGameType == 0)
            playNode.gameTypeTTF.setString("16 番")
        else if (cmdBaseWorker.cbGameType == 1)
            playNode.gameTypeTTF.setString("32 番")

        typeSelNode.startBtnEnabled()
        //cmdBaseWorker.onListerMenuShare()
    },
    onCMD_GameEnd:function() 
    {
        playNode.gamesetNode.setVisible(false)

        playNode.isPlaying = false

        setTimeout(function()
        {
            var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
            record.szTableKey = tableKey
            socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
        },2000)

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
            }
        }

        if (cmdBaseWorker.stAddEggInfo.bIsQEgg == true)
            cmdBaseWorker.toDealQEgg(cmdBaseWorker.stAddEggInfo)

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
            var a = cc.sequence( 
                cc.callFunc(function()
                {     
                    playNode.timer.resetTimer()
                    // majiangFactory.hideCurrentDiscardMj()
                    playNode._showSprsOnGameEnd()
                }), 
                cc.delayTime(2),
                cc.callFunc(function()
                {   
                    var continueCall = function()
                    {
                        headIconPop.kickUserOnGameEnd()
                        for(var i=0;i<GAME_PLAYER;i++)
                        {
                            tableNode.setBankerIcon(i, false)
                        }

                        playNode.isLookingResult = false   
                        if(!playNode.isPlaying)   
                        {
                            playNode.resetPlayNode()
                        }
                    }
                    playNode.popGameEnd(continueCall, userData_gameEnd) 
                }) 
            )           
            playNode.node.runAction(a)
        }        
    },
    ///////////////cmdEvent end//////////

    ////////////sendCardsAction start//////////
    _getHandMajiangsGroupNode:function()
    {
        var handMajiangs = playNode.handMajiangs4D

        var touchEndCall = function(direction, majiang)
        {      
            var isForbid = false
            var isTing   = false
            if (cmdBaseWorker.cbAllowTingCount != 0) // 判断听牌后禁出牌型
            {
                if (cmdBaseWorker.isForbidMajiang(majiang, cmdBaseWorker.wCurrentUser) == true)
                    isForbid = true
                isTing = true
            }

            if (cmdBaseWorker.cbListening[tableData.getUserWithUserId(selfdwUserID).wChairID] && cmdBaseWorker.cbTingUser[tableData.getUserWithUserId(selfdwUserID).wChairID] != 0)
                isForbid = true

            var isAllowOut = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID && !isForbid && !cmdBaseWorker.isAutoDisCard && cmdBaseWorker.isLastFourCard==false && cmdBaseWorker.isShowEggTime==false
            if(isAllowOut)
            {
                cmdBaseWorker.cbAllowTingCount = 0
                cmdBaseWorker.cbAllowTing      = []
                cmdBaseWorker.wCurrentUser = INVALID_WORD

                var OutCard = getObjWithStructName('CMD_C_OutCard')
                OutCard.cbOutCardData = majiang.cardData
                socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                playNode.hideActionBtns()
                if (isTing == true)
                    cmdBaseWorker.setMajiangColorNor()
            }
        }

        var touchEndCalls = []
        if(tableData.getUserWithUserId(selfdwUserID).wChairID == tableData.getServerChairIdWithShowChairId(0))
        {
            touchEndCalls[0] = function(majiang)
            {
                touchEndCall(0, majiang)
            }
        }

        playNode.handGroupNode4D = majiangFactory.getHandGroupNodes(handMajiangs, touchEndCalls)
    },

////////////////////////////////////@@@@@@@@@@@@
    // getHandGroupNodes:function(handMajiangs4D, outCardCalls)
    // {
    //     var handGroupNodes = []
    //     for(i=0;i<GAME_PLAYER;i++)//direction 0down 1right 2up 3left
    //     {
    //         var direction = i
    //         var majiangs = handMajiangs4D[i]
    //         //////
    //         var node = new cc.Node()
    //         node.ignoreAnchorPointForPosition(false)
    //         switch(direction) //越大的牌靠newMj越近
    //         {
    //             case 0://down
    //             {
    //                 node.setAnchorPoint( cc.p(1, 0.5) )
    //                 break
    //             }
    //             case 1://right
    //             {
    //                 node.setAnchorPoint( cc.p(0.5, 1) )
    //                 break
    //             }
    //             case 2://up
    //             {
    //                 node.setAnchorPoint( cc.p(0, 0.5) )
    //                 break
    //             }
    //             case 3://left
    //             {
    //                 node.setAnchorPoint( cc.p(0.5, 0) )
    //                 break
    //             }
    //         }

    //         var oldHandMjs = majiangs[0]
    //         var newGetMj = majiangs[1] 

    //         var size = majiangFactory._getHandGroupNodeSize(direction, oldHandMjs.length)
    //         node.width = size.width
    //         node.height = size.height

    //         for(var j=0;j<oldHandMjs.length;j++)
    //         {
    //             var mj = oldHandMjs[j]
    //             // var tag = direction==1?oldHandMjs.length-j:j
    //             node.addChild(mj)//, tag)
    //         }

    //         if(newGetMj)
    //         {
    //             // var tag = direction==3?100:0
    //             node.addChild(newGetMj)//, tag)
    //         }
    //         //////////touch
    //         var outCardCall = outCardCalls[direction]
    //         if(outCardCall) 
    //         {
    //             var listener = playNode._gethandGroupNodeListener(majiangs, node, direction, outCardCall)
    //             cc.eventManager.addListener(listener, node)
    //         }

    //         handGroupNodes[direction] = node
    //     }

    //     return handGroupNodes
    // },
    // _gethandGroupNodeListener:function(majiangs, handGroupNode, direction, outCardCall)
    // {
    //     if(direction!=0)//only0 123todo
    //         return 
    //     var currentMajiangTipsNode = new cc.Node()
    //     var bg = new cc.Sprite('#mf_currentMjBg.png')
    //     bg.setScale(majiangFactory.scale_upDown)
    //     currentMajiangTipsNode.addChild(bg)
    //     var mj = majiangFactory.getOne(1, 0, 0, true, true)
    //     mj.setScale(majiangFactory.scale_upDown * 1)
    //     currentMajiangTipsNode.addChild(mj)

    //     currentMajiangTipsNode.x = - 1000
    //     currentMajiangTipsNode.y = handGroupNode.height + bg.height*0.5 + 40

    //     handGroupNode.addChild(currentMajiangTipsNode)

    //     var mjWidth = majiangFactory.downHandIntervalX*majiangFactory.scale_upDown
    //     var mjHeight = majiangFactory.down_handHeight*majiangFactory.scale_upDown
    //     var juli_1 = null
    //     var juli_2 = null
    //     var oldPosX= null
    //     var oldPosY= null
    //     var touchPosX2TouchedMj = function(posX)
    //     {      
    //         if(playNode.istianhubahua)
    //         {
    //             return false
    //         }
    //         if(majiangs[1])
    //         {
    //             juli_1 = majiangs[1].getPosition().x
    //             juli_2 = majiangs[1].getPosition().y
    //         }
    //         if(posX>mjWidth*majiangs[0].length)
    //         {
    //             return majiangs[1]
    //         }
    //         else if(posX<=mjWidth*majiangs[0].length && majiangs[1])
    //         {
    //             var idx = Math.floor( posX/mjWidth )
    //             juli_1 = majiangs[0][idx].getPosition().x
    //             juli_2 = majiangs[0][idx].getPosition().y

    //             return majiangs[0][idx]
    //         }
    //     }

    //     var lastPlayTime = null
    //     var playSelectEffect = function()
    //     {
    //         var nowTime = new Date().getTime()

    //         if(!lastPlayTime || (nowTime - lastPlayTime) > 100)
    //         {
    //             lastPlayTime = nowTime
    //             managerAudio.playEffect(majiangFactory.resp + 'selectcard.mp3')
    //         }
    //     }
    //     var currentMajiang = null
    //     var currentPopMajiang = null
    //     var touchedMjNum = 0
    //     var isTouchFromPop = false
    //     var soundId = null
    //     var ismoved = false
    //     var isclick = 0
    //     var onTouch = function(locationX)
    //     {   
    //         var touchedMj = touchPosX2TouchedMj(locationX)
    //         if(!touchedMj)
    //             return 
                
    //         if(currentMajiang)
    //             currentMajiang.y = mjHeight*0.5
    //         if(!currentMajiang || currentMajiang!=touchedMj) 
    //         {
    //             touchedMjNum++
                
    //             console.log(touchedMjNum)
    //             if(touchedMjNum>1)
    //                 playSelectEffect()
    //         }
    //         currentMajiang = touchedMj
    //         currentMajiangTipsNode.x = currentMajiang.x
    //         mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 
    //         currentMajiang.y = mjHeight*0.5 + 20

    //         oldPosY = currentMajiang.y
    //         oldPosX = currentMajiang.x

    //         var event = new cc.EventCustom("handMajiangTouched")
    //         event.setUserData(currentMajiang.cardData)
    //         cc.eventManager.dispatchEvent(event)            
    //     }
    //     var listener = cc.EventListener.create({
    //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
    //     swallowTouches: true,
    //     onTouchBegan: function (touch, event) {
    //         var target = event.getCurrentTarget()
    //         var locationInNode = target.convertToNodeSpace(touch.getLocation())
    //         var locationX = locationInNode.x<0?0:locationInNode.x
    //         if(currentPopMajiang)
    //         {
    //             var touchedMj = touchPosX2TouchedMj(locationX)
    //             isTouchFromPop = currentPopMajiang == touchedMj
    //             currentPopMajiang.y = mjHeight*0.5
    //         }
    //         var s = target.getContentSize();
    //         var rect = cc.rect(0, 0, s.width, s.height)
    //         if (cc.rectContainsPoint(rect, locationInNode)) {
    //             onTouch(locationX)
    //             return true
    //         }
    //         else
    //         {
    //             currentPopMajiang = null
    //             isTouchFromPop = false
    //             touchedMjNum = 0
    //         }

    //             return false
    //         },
    //         onTouchMoved: function (touch, event) {
    //             var target = event.getCurrentTarget()
                
    //             if(currentMajiang)
    //             {   
    //                 var delta = touch.getDelta()
    //                 var deltaX = delta.x
    //                 var deltaY = delta.y
    //                 var locationInNode = target.convertToNodeSpace(touch.getLocation())
    //                 ismoved = true
    //                 currentMajiang.setPosition(locationInNode.x + deltaX,locationInNode.y + deltaY)
    //                 currentPopMajiang = currentMajiang
    //             }
    //         },
    //         onTouchEnded: function (touch, event) {
    //             var target = event.getCurrentTarget()
    //             if(currentMajiang)
    //             {  
    //                 if((isTouchFromPop && touchedMjNum==1) || (ismoved && oldPosY!=null && (oldPosY+22) < currentMajiang.y) )
    //                 {
    //                     if(juli_1 != null && juli_2 != null )
    //                     {
    //                         currentMajiang.setPosition(juli_1,juli_2)
    //                         juli_1 = null
    //                         juli_2 = null
    //                     }
    //                     outCardCall?outCardCall(currentPopMajiang):''
    //                     currentPopMajiang = null     
    //                     isTouchFromPop = false            
    //                 }
    //                 else if (ismoved == false)
    //                 {
    //                     currentPopMajiang = currentMajiang
    //                 }
    //                 else
    //                 {
    //                     currentPopMajiang = currentMajiang
    //                     currentMajiang.setPosition(oldPosX,oldPosY)
    //                     // juli_1 = null
    //                     // juli_2 = null
    //                     oldPosY= null
    //                     oldPosX= null
    //                     // currentPopMajiang = null  
    //                     // isTouchFromPop = false
    //                 }
    //             }

    //             var event = new cc.EventCustom("handMajiangTouchEnd")
    //             cc.eventManager.dispatchEvent(event)
    //             ismoved = false
    //             currentMajiangTipsNode.x = -1000
    //             currentMajiang = null
    //             touchedMjNum = 0
    //         }
    //     })
    //     return listener
    // },
/////////////////////////@@@@@@@@@@@@@@@@@@@@@@@@
    getWeaveMajiangsArray:function(weaveItemArray, selfDirection)
    {
        var isPublicAnGang = majiangFactory.isPublicAnGang
        var weaveMajiangs4D = []
        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)
        {
            var direction = showChairid
            var weaveItems = weaveItemArray[direction]

            var isSelf = selfDirection == direction
            var majiangsOneDirection = []
            for(var groupIdx=0;groupIdx<weaveItems.length;groupIdx++)
            {
                var weaveItem = weaveItems[groupIdx]
                if(weaveItem.cbWeaveKind == WIK_NULL)
                    continue

                if(weaveItem.cbWeaveKind!=WIK_GANG && weaveItem.cbWeaveKind!=WIK_SHOWEGG)
                    weaveItem.cbCardDatas = weaveItem.cbCardDatas.slice(0, 3)
                if (weaveItem.cbWeaveKind!=WIK_SHOWEGG)
                {
                    var majiangsOneGroup = cmdBaseWorker.weaveItem2Majiangs1(majiangsOneDirection, groupIdx, direction, weaveItem, isSelf, isPublicAnGang)
                    majiangsOneDirection[groupIdx] = majiangsOneGroup
                }
                else
                {
                    var majiangsOneGroup = cmdBaseWorker.weaveItem2Majiangs(majiangsOneDirection, groupIdx, direction, weaveItem, isSelf)
                    majiangsOneDirection[groupIdx] = majiangsOneGroup
                }
            }
            weaveMajiangs4D[direction] = majiangsOneDirection
        }

        return weaveMajiangs4D
    },
    getDiscardMajiangsArray:function(discardCardDatasArray)
    {
        var discardMajiangs4D = []
        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
        {
            var direction = showChairid
            var discardCount = direction%2==0?majiangFactory.discardCountOneRow:majiangFactory.discardCountOneLine

            var cardDatas = discardCardDatasArray[direction]
            if(!cardDatas)
            {
                discardMajiangs4D[direction] = []
                continue
            }

            var majiangsOneDirection = []
            for(var j=0;j<cardDatas.length;j++)
            {
                var cardData = cardDatas[j]
                var majiang = majiangFactory.getOne(cardData, 1, direction)
                
                var row = j%discardCount
                var line = Math.floor(j/discardCount) 
                var pos = cmdBaseWorker.getDiscardMajiangPosAndTag(row, line, direction)
                majiang.x = pos.x
                majiang.y = pos.y
                majiang.setLocalZOrder(pos.zOrder)
                majiangsOneDirection[j] = majiang
            }
            discardMajiangs4D[direction] = majiangsOneDirection
        }

        return discardMajiangs4D
    },
    getHandMajiangsArray:function(handCardDatasArray, isLookon)
    {
        var handMajiangs4D = []
        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
        {
            var direction = showChairid
            var oldHandCardDatas = handCardDatasArray[direction][0]
            var oldHandMjs = []
            for(var j=0;j<oldHandCardDatas.length;j++)
            {
                var cardData = isLookon?0:oldHandCardDatas[j]
                var majiang = majiangFactory.getOne(cardData, 0, direction)
                majiang.idxInHandMajiangs = j
                var pos = majiangFactory.getHandMajiangPosAndTag(oldHandCardDatas.length, majiang.idxInHandMajiangs, direction, false)
                majiang.x = pos.x
                majiang.y = pos.y
                majiang.setLocalZOrder(pos.zOrder)
                oldHandMjs[j] = majiang
            }

            var newGetMj = null
            var newGetCardData = handCardDatasArray[direction][1]
            if(typeof(newGetCardData) == 'number')          
            {
                newGetCardData = isLookon?0:newGetCardData
                newGetMj = majiangFactory.getOne(newGetCardData, 0, direction)
                var pos = majiangFactory.getHandMajiangPosAndTag(oldHandCardDatas.length, null, direction, true)
                newGetMj.x = pos.x
                newGetMj.y = pos.y
                if (direction == 0)
                    newGetMj.x -= 15*majiangFactory.scale_upDown

                newGetMj.setLocalZOrder(pos.zOrder)
                newGetMj.idxInHandMajiangs = null
            }  
            handMajiangs4D[direction] = [oldHandMjs, newGetMj]
        }

        return handMajiangs4D
    },
    sendCardsAction:function(handIdxsArray, discardIdxsArray, weaveItemArray, heapIdxsArray, flowerIdxsArray)
    {   
        // flowerIdxsArray = [ [0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48] ]
        // heapIdxsArray = [ [1,0,0,0,0,0,0,0,0,0,0,0,0,0],[],[],[] ]
        // discardIdxsArray = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
        // weaveIdxsArray = [[[1,2,3,4],[2,3,4],[4,5,6],[7,8,1]],[],[[1,2,3],[2,3,4,5],[4,5,6],[7,8,1]],[]]
        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)

        playNode.flowerMajiangs4D = majiangFactory.getFlowerMajiangsArray(flowerIdxsArray)
        playNode.heapMajiangs4D = majiangFactory.getHeapMajiangsArray(heapIdxsArray)
        playNode.handMajiangs4D = playNode.getHandMajiangsArray(handIdxsArray, tableData.getUserWithUserId(selfdwUserID).wChairID == INVALID_WORD)
        playNode.discardMajiangs4D = playNode.getDiscardMajiangsArray(discardIdxsArray)


        for(direction=0;direction<GAME_PLAYER;direction++)
        {
            var weaveItems = weaveItemArray[direction]
            for(var groupIdx=0;groupIdx<weaveItems.length;groupIdx++)
            {
                var weaveItem = weaveItems[groupIdx]
                if(weaveItem.cbWeaveKind == WIK_NULL)
                    continue
                weaveItem.cbCardDatas = weaveItem.cbCardDatas
                ////////////////////////log
            }
        }
        playNode.weaveMajiangs4D = playNode.getWeaveMajiangsArray(weaveItemArray, selfDir, true)

        playNode._getHandMajiangsGroupNode()

        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var i=0;i<4;i++)
        {
            var direction = i
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

    ////////////gameend start//////////
    _showSprsOnGameEnd:function()
    {
        //score
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithChairId(i)
            if(!user) continue

            var chair = tableData.getChairWithServerChairId(i)
            if(tableData.isInTable(user.cbUserStatus))
            {   
                //score
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
            }
        }

        if(cmdBaseWorker.endType == 1 || cmdBaseWorker.endType == 0)
            return 

        //删除打出去的牌
        // for(var i=0;i<GAME_PLAYER;i++)
        // {
        //     var user = tableData.getUserWithChairId(i)
        //         if(!user) continue

        //     user.userNodeInsetChair.currentRoundNode.discardMajiangsNode.removeAllChildren()
        // }

        // playNode.timerNode.setVisible(false)

        var isQiangGang = cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner] & CHR_QiangGang
        if(isQiangGang) //抢杠需要gang2Peng
        {
            var direction = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser)
            majiangFactory.gang2Peng(cmdBaseWorker.cbProvideCardData , playNode.weaveMajiangs4D[direction] )
        }

        //摊牌
        var displayHandIdxsArray = []
        var cbProvideCardData = cmdBaseWorker.cbProvideCardData

        var isZiMo = cmdBaseWorker.wWinner == cmdBaseWorker.wProvideUser
        for(var i=0;i<4;i++)
        {
            var direction = i
            var chairid = tableData.getServerChairIdWithShowChairId(direction)

            displayHandIdxsArray[direction] = [cmdBaseWorker.cbHandCardData[chairid].slice(0, cmdBaseWorker.cbHandCardCount[chairid]), null]

            if(cmdBaseWorker.wWinner == chairid)
            {   
                var displayHandIdxs = displayHandIdxsArray[direction]
                for(var j=0;j<displayHandIdxs[0].length;j++)
                {
                    if(displayHandIdxs[0][j] == cbProvideCardData)
                    {
                       displayHandIdxs[1] = displayHandIdxs[0].splice(j, 1)[0]
                       break
                    }
                }
            }
        }

        playNode.handMajiangs4D = majiangFactory.getDisplayHandMajiangsArray(displayHandIdxsArray)
  
        for(var i=0;i<4;i++)
        {
            var direction = i

            var showChairid = direction//==0?0:1
            var chairid = tableData.getServerChairIdWithShowChairId(showChairid)

            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)
            var handGroupNode = playNode.handGroupNode4D[direction]
            handGroupNode.removeAllChildren()

            var handMajiangs = playNode.handMajiangs4D[direction]
            var oldMjs = handMajiangs[0]

            for(var j=0;j<oldMjs.length;j++)
            {
                handGroupNode.addChild(oldMjs[j])
            }
            if(handMajiangs[1])
                handGroupNode.addChild(handMajiangs[1])
        }

        // playNode.playAction('hu', tableData.getUserWithChairId(args.winner))
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
    weaveItemMajiangs3:function(groupIdx, direction, weaveItem, isSelf, isPublicAnGang, eggNum, isEgg)
    {
        var cardDatas = weaveItem.cbCardDatas
        var cardCounts = weaveItem.cbCardCount
        var majiangs = []
        var hasAddDirectionSpr = false
        var idxs = cmdBaseWorker.sortWeaveIdxs(weaveItem.cbWeaveKind, cardDatas)
        for(var idxInGroup=0;idxInGroup<idxs.length;idxInGroup++)
        {
            var cardData = idxs[idxInGroup]
            var cardCount= cardCounts[idxInGroup]
            if (cardData == 0)
                continue
            if(weaveItem.cbWeaveKind==WIK_GANG && !weaveItem.cbPublicCard)
            {
                if(idxInGroup<3)
                    cardData = 0
                else if(!isSelf && !isPublicAnGang)
                    cardData = 0
            }

            var majiang = majiangFactory.getOne(cardData, 2, 0)
            var extralScal = 1          
            var waveWidth = majiang.width
            var handWidth = majiangFactory.downHandIntervalX
            var extralWidth = 3
            extralScal = (3*majiangFactory.scale_upDown*handWidth+extralWidth)/(5*(majiangFactory.scale_upDown*waveWidth))
            extralScal = extralScal>1?1:extralScal

            majiang.setScale(extralScal)
            var waveSep = cmdBaseWorker.getWaveSeption(0, majiang, extralScal)

            var pos = cmdBaseWorker.getWeaveMajiangPosAndTag(groupIdx, idxInGroup, 0, extralScal, majiang, isEgg, waveSep, eggNum)
            majiang.x = pos.x
            majiang.y = pos.y
            majiang.setLocalZOrder(pos.zOrder)
            if(weaveItem.provideDirection!=direction && !hasAddDirectionSpr && cardData == weaveItem.cbCenterCardData)
            {
                var zi = majiang.getChildByTag(101)
                var directionSpr = new cc.Sprite('#mf_weaveDirection.png')
                directionSpr.setRotation(180-weaveItem.provideDirection*90 - zi.getRotation())

                directionSpr.x = zi.width*0.5
                directionSpr.y = zi.height*0.5
                zi.addChild(directionSpr, 0, 101)
                hasAddDirectionSpr = true
            }
            majiangs[majiangs.length] = majiang

            if (isEgg && cardCount>0)
            {
                var amountTTF = cc.LabelTTF.create('', "Helvetica")
                amountTTF.setFontFillColor( cc.color(242, 226, 142, 255) )
                amountTTF.x = majiang.width/2
                amountTTF.y = majiang.height + 11
                amountTTF.setString('x' + cardCount)
                amountTTF.setFontSize(26)
                majiang.addChild(amountTTF)
            }
        }  
        majiangs.cbWeaveKind = weaveItem.cbWeaveKind

        return majiangs
    },
    popGameEnd:function(continueCall, userData_gameEnd)
    {
        var control = {}
        control.continueCall = function()
        {
            majiangFactory.hideCurrentDiscardMj()
            continueCall()
            node.removeFromParent()
        }
        var node  = managerRes.loadCCB(resp.gameEndPopCCB, control)
        playNode.gameEndControl = control
        control.gendTitle.setSpriteFrame('gendTitle'+cmdBaseWorker.endType + '.png')

        for (var i = 0; i < GAME_PLAYER; i++)
        {
            control['baozhuangLabel'+i].setVisible(false)
            control['picFan0_'+i].setVisible(false)
            control['labelFan0_'+i].setVisible(false)
            control['picFan1_'+i].setVisible(false)
            control['labelFan1_'+i].setVisible(false)
        }

        var isTianDiHu = false
        if ((cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner] & CHR_TianHu) || (cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner] & CHR_DiHu))
            isTianDiHu = true

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

            var isZiMo = cmdBaseWorker.wProvideUser == cmdBaseWorker.wWinner 

            //显示麻将
            var majiangsNode = new cc.Node()
            majiangsNode.scale = 0.6
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

                var eggNum  = cmdBaseWorker.getEggNum2(weaveItems, weaveItems.length-groupIdx)
                groupLen += 1
                if(weaveItem.cbWeaveKind!=WIK_GANG && weaveItem.cbWeaveKind!=WIK_SHOWEGG)
                    weaveItem.cbCardDatas = weaveItem.cbCardDatas.slice(0, 3)

                weaveItem.provideDirection = 0//这样就不显示箭头了
                var majiangsOneGroup = playNode.weaveItemMajiangs3(groupIdx, 0, weaveItem, true, false, eggNum, weaveItem.cbWeaveKind==WIK_SHOWEGG)
                
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
            var hasLightProvideMj = false
            for(var j=0;j<handCardDatas.length;j++)
            {
                var cardData = handCardDatas[j]
                if (cardData == 0)
                    continue

                var majiang = majiangFactory.getOne(cardData, 2, 0)
                majiang.idxInHandMajiangs = j
                var pos = majiangFactory.getDisplayHandMajiangPosAndTagAndTag(handCardDatas.length, majiang.idxInHandMajiangs, 0, false)
                majiang.x = startPos + pos.x
                majiang.y = 0//pos.y
                majiang.setScale(pos.scale)
                // majiang.setLocalZOrder(pos.zOrder)

                majiangsNode.addChild(majiang)

                if(!hasLightProvideMj && cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU && majiang.cardData == cmdBaseWorker.cbProvideCardData)
                {
                    majiang.color = cc.color(188, 255, 188)
                    hasLightProvideMj = true 
                }
            }

            //胡型
            var resultTTF = cc.LabelTTF.create('', "Helvetica", 16)
            resultTTF.setFontFillColor( cc.color(244, 230, 159) )
            var chrStr = ''
            chrStr += ' 杠分 ('+cmdBaseWorker.lGangScore[wChairID]+'分)'
            chrStr += ' '
            if(cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU && isTianDiHu==false)
            {
                if (cmdBaseWorker.cbWinType == 1)
                {
                    chrStr += ' 自摸'+' (1番)'
                    chrStr += ' '
                }
                else if (cmdBaseWorker.cbWinType == 2)
                {
                    chrStr += ' 自摸'+' (1番)'
                    chrStr += ' '
                    chrStr += ' 摸宝'+' (1番)'
                    chrStr += ' '
                }
                else if (cmdBaseWorker.cbWinType == 3)
                {
                    chrStr += ' 自摸'+' (1番)'
                    chrStr += ' '
                    chrStr += ' 对宝'+' (2番)'
                    chrStr += ' '
                }

                if (wChairID == cmdBaseWorker.wBankerUser)
                {
                    chrStr += ' 坐庄胡'+' (1番)'
                    chrStr += ' '
                }
            }

            if(isZiMo == false && wChairID==cmdBaseWorker.wProvideUser)
            {
                chrStr += ' 点炮'+' (1番)'
                chrStr += ' '
            }

            for (var i = 0; i < map_mask2Name.length; i++) 
            {
                var chr_type = window[ map_mask2Name[i][0] ] 
                if (cmdBaseWorker.dwChiHuRight[wChairID] & chr_type)
                {
                    chrStr += map_mask2Name[i][1];
                    chrStr += ' '
                }
            }

            resultTTF.setString(chrStr)
            resultTTF.x = 100
            resultTTF.y = 16
            resultTTF.setAnchorPoint(cc.p(0, 0))
            gendBar.addChild(resultTTF)

            ///////////
            if(wChairID==cmdBaseWorker.wExitUser)
                control['winflag'+wChairID].setSpriteFrame('gendFlag0.png') 
            else if(cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU)
            {
                // control['picFan0_'+wChairID].setVisible(true)
                // control['labelFan0_'+wChairID].setVisible(true)
                // control['labelFan0_'+wChairID].setString(cmdBaseWorker.dwWinFan)
                // control['picFan1_'+wChairID].setVisible(true)
                // control['labelFan1_'+wChairID].setVisible(true)
                // control['labelFan1_'+wChairID].setString(cmdBaseWorker.dwWinFan2)
                control['winflag'+wChairID].setSpriteFrame('gendFlag1.png') 
            }
            else if(wChairID==cmdBaseWorker.wProvideUser)
            {
                if (cmdBaseWorker.isBaoZhuang == true)
                    control['baozhuangLabel'+wChairID].setVisible(true)
                control['winflag'+wChairID].setSpriteFrame('gendFlag2.png') 
            }
            else
                control['winflag'+wChairID].setSpriteFrame('empty.png') 
  
            // control['taiTTF'+wChairID].setString((cmdBaseWorker.lGameTaiCount[wChairID]>0?'+':'') + cmdBaseWorker.lGameTaiCount[wChairID]) 
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
    setCurrentDiscardMj:function(idx, direction)
    {
        var self = tableData.getUserWithUserId(selfdwUserID)
        var d = tableData.getShowChairIdWithServerChairId(self.wChairID)
        if(d == direction)
            majiangFactory.hideCurrentDiscardMj()
        else
           playNode.setCurrentDiscardMj2(idx, direction)
    },
    setCurrentDiscardMj2:function(cardData, direction)
    {   
        majiangFactory.currentDiscardMjNode.setVisible(true)
        var mj = majiangFactory.currentDiscardMjNode.getChildByTag(101)
        mj.getChildByTag(101).setSpriteFrame('mf_' + cardData + '.png') 

        var up_handHeight = majiangFactory.up_handHeight*majiangFactory.scale_upDown
        var down_handHeight = majiangFactory.down_handHeight*majiangFactory.scale_upDown

        switch(direction)
        {
            case 0://down
            {
                majiangFactory.currentDiscardMjNode.x = majiangFactory.mjTableNode.width*0.5
                // majiangFactory.currentDiscardMjNode.y = down_handHeight + 10*majiangFactory.scale_rightLeft   
                majiangFactory.currentDiscardMjNode.y = 0.5*down_handHeight*majiangFactory.currentDiscardMjScale + 10*majiangFactory.scale_rightLeft    
                break
            }
            case 1://right
            {
                majiangFactory.currentDiscardMjNode.x = majiangFactory.mjTableNode.width - majiangFactory.right_handWidth*majiangFactory.scale_rightLeft - 
                0.5*majiangFactory.down_handWidth*majiangFactory.currentDiscardMjScale*majiangFactory.scale_upDown - 90*majiangFactory.scale_upDown
                
                majiangFactory.currentDiscardMjNode.y = down_handHeight + 0.5*(majiangFactory.mjTableNode.height-up_handHeight-down_handHeight)
                break
            }
            case 2://up
            {
                majiangFactory.currentDiscardMjNode.x = majiangFactory.mjTableNode.width*0.5
                //majiangFactory.currentDiscardMjNode.y = majiangFactory.mjTableNode.height - 0.5*up_handHeight - 10*majiangFactory.scale_rightLeft    
                majiangFactory.currentDiscardMjNode.y = majiangFactory.mjTableNode.height - 0.5*down_handHeight*majiangFactory.currentDiscardMjScale - 30*majiangFactory.scale_rightLeft    
                break
            }
            case 3://left
            {
                majiangFactory.currentDiscardMjNode.x = majiangFactory.left_handWidth*majiangFactory.scale_rightLeft + 
                0.5*majiangFactory.down_handWidth*majiangFactory.currentDiscardMjScale*majiangFactory.scale_upDown + 90*majiangFactory.scale_upDown
                majiangFactory.currentDiscardMjNode.y = down_handHeight + 0.5*(majiangFactory.mjTableNode.height-up_handHeight-down_handHeight)
                break
            }
        }
    },
    hideLaizi:function()
    {
        playNode.laiziNode.removeAllChildren()
    },
    playAction:function(WIK, user)
    {
        if(cmdBaseWorker.cbOutCardCount == 0 && WIK == WIK_REPLACE)
            return;

        var name = typeof(WIK)=='number'?cmdBaseWorker.wik2Name(WIK):WIK
        playNode.playActionEffect(name, user.cbGender)

        if(name!='replace')
        {
            managerAudio.playEffect('gameRes/sound/weave.mp3')
            playNode.playAnimationWithDirection(name, tableData.getShowChairIdWithServerChairId(user.wChairID))
        }
    },
    hideActionBtns:function()
    {
        majiangFactory.chooseItemsNode.removeAllChildren()
        playNode.btn_guo.setVisible(false)
        playNode.btn_egg.setVisible(false)
        playNode.btn_chi.setVisible(false)
        playNode.btn_peng.setVisible(false)
        playNode.btn_gang.setVisible(false)
        playNode.btn_ting.setVisible(false)
        playNode.btn_hu.setVisible(false)
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

                var handIdxs = handMajiangs[1]?[handMajiangs[1].cardData]:[]
                for(var j=0;j<handMajiangs[0].length;j++)
                {
                    handIdxs[handIdxs.length] = handMajiangs[0][j].cardData
                }
                majiangLogic.sortWithCardData(handIdxs)

                var operateCards = []
                for(var j=0;j<handIdxs.length;j++)
                {
                    var isHuaMagic = cmdBaseWorker.isCaiHua(handIdxs[j])
                    var isMagic = cmdBaseWorker.isMagicCard(handIdxs[j], cmdBaseWorker.cbMagicCardData)

                    if(cmdBaseWorker.isFlowerCard(handIdxs[j], cmdBaseWorker.cbFlowerCardData) && isHuaMagic==false && isMagic==false)
                        operateCards[operateCards.length] = handIdxs[j]

                } 

                if(cmdBaseWorker.cbOutCardCount == 0)
                {
                    cmdBaseWorker.sendMessage_replace(operateCards)
                }
                else
                {
                    var a = cc.sequence( 
                        cc.delayTime(0.8),
                        cc.callFunc(function()
                        {   
                            cmdBaseWorker.sendMessage_replace(operateCards)
                        }) 
                    )           
                    playNode.node.runAction(a)
                }

                return;
            }
        }

        playNode.btn_guo.setVisible(true)
        for(var i=sortedActions.length-1;i>=0;i--)
        {   
            var btn = null
            var action = sortedActions[i]
            if(action == WIK_CHI_HU)
                btn = playNode.btn_hu
            else if(action == WIK_LISTEN)
                btn = playNode.btn_ting
            else if(action == WIK_GANG)
                btn = playNode.btn_gang
            else if(action == WIK_PENG)
                btn = playNode.btn_peng
            else if (action == WIK_SHOWEGG)
                btn = playNode.btn_egg
            else if(action == WIK_LEFT || action == WIK_CENTER || action == WIK_RIGHT)
            {
                btn = playNode.btn_chi
                btn.actions = sortedActions.slice(0, i+1)
            }

            btn.setVisible(true)
            btn.setPositionX(-180 * (sortedActions.length-1-i +1))
            if(btn==playNode.btn_chi)
                break
        }
    },
    playAnimationOfGameEnd:function(call)
    {
        var winner = cmdBaseWorker.wWinner
        var cbChiHuRight=cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner]
        if(cmdBaseWorker.endType == 0)
            call()
        else if(cmdBaseWorker.endType == 1)
        {
            var spr = actionFactory.getSprWithAnimate('lj', true, 0.15, call)
            majiangFactory.mjTableNode.addChild(spr)
            spr.x = majiangFactory.mjTableNode.width*0.5
            spr.y = majiangFactory.mjTableNode.height*0.5
            if (isOpenPTH == false)
                playNode.playGenderEffect('lj0', tableData.getUserWithChairId(0).cbGender)
        }
        else if(cmdBaseWorker.endType == 2)
        {
            playNode.playAnimationWithDirection('zim', tableData.getShowChairIdWithServerChairId(winner), call)
            //playNode.playGenderEffect('zimo0', tableData.getUserWithChairId(winner).cbGender)
            if (cbChiHuRight&CHR_GangKai && isOpenPTH == false) //杠开
                playNode.playGenderEffect('gk0', tableData.getUserWithChairId(winner).cbGender)
            else
                playNode.playActionEffect('zimo', tableData.getUserWithChairId(winner).cbGender)
        }
        else if(cmdBaseWorker.endType == 3)
        {
            playNode.playAnimationWithDirection('hu', tableData.getShowChairIdWithServerChairId(winner), call)
            playNode.playAnimationWithDirection('dp', tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser))
            if (cbChiHuRight&CHR_QiangGang && isOpenPTH == false) //抢杠
                playNode.playGenderEffect('qg0', tableData.getUserWithChairId(winner).cbGender)
            else
                playNode.playActionEffect('hu', tableData.getUserWithChairId(winner).cbGender)
        }
    },
    /////other ui end////////
    
    getSoundName:function(idx) 
    {
        return idx
    },
    getActionSoundName:function(name, num) 
    { 
        num = num || 1
        return name + (Math.ceil(Math.random()*10))%num        
    },
    playMajiangEffect:function(idx, isMan)
    {
        var name = playNode.getSoundName(idx)
        playNode.playGenderEffect(name, isMan)
    },
    playActionEffect:function(name, isMan)
    {
        var name = playNode.getActionSoundName(name)
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
    playAnimationWithDirection:function(name, direction, call)
    {
        if(!isOpenEffect)
        {
            call?call():''
            return; 
        }

        var spr = actionFactory.getSprWithAnimate(name + '_', true, 0.15, call)
        majiangFactory.mjTableNode.addChild(spr)

        var pos = majiangFactory.getActionPlayNodePos(direction)
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
            // call?call():''
            if (call)
            {
                playNode.node.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function(){
                            call?call():''
                        }
                        )
                    )
                )
            }
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
        majiangFactory.isPublicAnGang = false
        playNode.scoreTTF.setString('0')
        playNode._removeSprsOnGameEnd()
        playNode.timerNode.setVisible(false)
        playNode.hideLaizi()
        playNode.clearBaoNode()
        playNode.mjTurnOver = null

        cmdBaseWorker.cbAllowTingCount  = 0
        cmdBaseWorker.isAutoDisCard     = false
        for (var i = 0; i < GAME_PLAYER; i++)
        {
            cmdBaseWorker.cbTingUserRev[i] = INVALID_BYTE
            cmdBaseWorker.cbListening[i]   = false
            cmdBaseWorker.cbTingUser[i]    = 0
        }
        
        cmdBaseWorker.cbAllowTing       = []
        cmdBaseWorker.cbCurFeng         = INVALID_BYTE
    },
    isCaiVisible:function(visible)
    {
        var self = tableData.getUserWithUserId(selfdwUserID)
        var curDir = tableData.getShowChairIdWithServerChairId(self.wChairID)  
        var majiangs = playNode.handMajiangs4D[curDir]
        gameLog.log(majiangs)
        for(var i=0;i<majiangs[0].length;i++)
        {
            var majiang = majiangs[0][i]
            var zi = majiang.getChildByTag(101)
            if (zi)
            {
                var caiShen = zi.getChildByTag(139)
                if (caiShen)
                {
                    caiShen.setVisible(visible)
                }
            }
        }
    },
    showAnGangCards:function()
    { 
        // for(var k=0; k<4; k++)
        // {
        //     var user = tableData.getUserWithChairId(k)
        //     var direction = tableData.getShowChairIdWithServerChairId(user.wChairID)
        //     var operateWeaveMajiangs = playNode.weaveMajiangs4D[direction]  

        //     var cbGangCount = 0
        //     var cbCardDatas = cmdBaseWorker.cbAnGangCards[user.wChairID]
        //     for(var i = 0;i<operateWeaveMajiangs.length;i++)
        //     {
        //         var group = operateWeaveMajiangs[i]
        //         if(group.length == 4&&group[0].cardData==0 && cbGangCount <= 4)
        //         {
        //            var waveMajiangsNode = user.userNodeInsetChair.currentRoundNode.weaveMajiangsNode
        //            var majiang = majiangFactory.getOne(cbCardDatas[cbGangCount], 2, direction)
        //            majiang.x = group[3].x
        //            majiang.y = group[3].y
        //            majiang.setLocalZOrder(group[3].zOrder)
        //            waveMajiangsNode.removeChild(group[3])
        //            group[3] = majiang
        //            waveMajiangsNode.addChild(majiang)
        //            cbGangCount++
        //         }
        //     }
        // }
    },
}






















