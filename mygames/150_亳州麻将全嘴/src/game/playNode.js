
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

    ///////////////////////init start///////////////////////
    init:function()
    {   
        playNode._registEvent()
        playNode._initCallBack()
        var node = managerRes.loadCCB(resp.playCCB, this)
        playNode.animationManager = node.animationManager
        playNode.node  = node

        majiangFactory.isShowHeap = true
        //majiangFactory.outCardMode = 3
        majiangFactory.isPublicAnGang = false
        majiangFactory.heapCountOneRow = 26
        majiangFactory.init( playNode.mjTableNode, playNode.decorateMj )

        playNode.timer = majiangTimer4D.getTimer()
        playNode.timerNode.addChild(playNode.timer)
        playNode.timerNode.setScale( majiangFactory.scale_upDown*0.9 )
        majiangFactory.currentDiscardMjNode.setScale(0.8)
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
            currentRoundNode.discardMajiangsNode.y = -chairNodePosInMjTable.y + centerPosY - mjsDiscardHeight*0.5 - 43*majiangFactory.scale_upDown
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
            currentRoundNode.tingNode.setLocalZOrder(2)
            // var ting = new cc.Sprite("#" + 'ting.png')
            // currentRoundNode.tingNode.addChild(ting)
        }
        else if(direction==2)
        {       
            currentRoundNode.scoreChange.setPosition( cc.p(-70, -30) )  

            //discard
            var discardMajiangsNodeWith = (majiangFactory.discardCountOneRow-1)*majiangFactory.up_discardWidth*majiangFactory.scale_upDown
            var mjsDiscardHeight = majiangFactory.up_discardHeight*majiangFactory.scale_upDown

            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - 
            0.5*( majiangFactory.mjTableNode.width - discardMajiangsNodeWith)
            currentRoundNode.discardMajiangsNode.y =  -chairNodePosInMjTable.y + centerPosY + mjsDiscardHeight*0.5 + 43*majiangFactory.scale_upDown
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
            currentRoundNode.tingNode.y = currentRoundNode.flowerMajiangsNode.y - 10
            currentRoundNode.tingNode.setLocalZOrder(2)
        } 
        else if(direction==1)
        { 
            currentRoundNode.scoreChange.setPosition( cc.p(-150, -50) )  
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

            currentRoundNode.tingNode.y = -chairNodePosInMjTable.y + (majiangFactory.mjTableNode.height/2 )
            currentRoundNode.tingNode.x = currentRoundNode.flowerMajiangsNode.x - 10
            currentRoundNode.tingNode.setLocalZOrder(2)
        }
        else if(direction==3)
        {   
            currentRoundNode.scoreChange.setPosition( cc.p(100, 30) )  
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

            currentRoundNode.tingNode.y = -chairNodePosInMjTable.y + (majiangFactory.mjTableNode.height/2 )
            currentRoundNode.tingNode.x = currentRoundNode.flowerMajiangsNode.x + 10
            currentRoundNode.tingNode.setLocalZOrder(2)
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
            eventName: "recordPlayStart",
            callback: function(event)
            {   
                majiangFactory.isShowHeap = false
                tableNode.waitStartTTF.setVisible(false)
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

        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)
    },
    onCMD_StatusCall:function()
    {
    },
    onCMD_StatusPlay:function() 
    {
        playNode.isPlaying = true

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        playNode.scoreTTF.setVisible(true)
        playNode.lastSprite.setVisible(true)
        playNode.showCurDirection()
        
        tableNode.diFenLabel.setVisible(true)
        tableNode.curFengQuan.setVisible(true)
        playNode.setLianZhuangTimes(cmdBaseWorker.cbReBankerTimes)

        if (cmdBaseWorker.cbTingUser != null && cmdBaseWorker.cbTingUser != INVALID_CHAIR)
            majiangFactory.isPublicAnGang = true

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
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var isActioning = sortedActions.length>0
        if(isActioning && self.cbUserStatus == US_PLAYING)
            playNode.showActionBtns(sortedActions)

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
        playNode.sendCardsAction(handIdxsArray, discardIdxsArray, weaveItemArray, heapIdxsArray, cmdBaseWorker.cbPlayerFlowerCardData) 
        cmdBaseWorker.userTing(cmdBaseWorker.cbTingUser)

        if(isActioning == false && cmdBaseWorker.isAutoDisCard == true && self.wChairID == cmdBaseWorker.cbTingUser)
            cmdBaseWorker.autoDisCard(cmdBaseWorker.cbTingUserRev)
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

        tableNode.diFenLabel.setVisible(true)
        tableNode.curFengQuan.setVisible(true)
        playNode.setLianZhuangTimes(cmdBaseWorker.cbReBankerTimes)

        var self = tableData.getUserWithUserId(selfdwUserID)

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
            if(serverChairid==self.wChairID || isRecordScene)
                idxs = cmdBaseWorker.cbHandCardData[serverChairid]

            var oldIdxs = idxs.slice(0, MAX_COUNT-1)
            handIdxsArray[direction] = [oldIdxs, null]
            majiangFactory.sortCardDatasWithScore(handIdxsArray[direction][0])
        }
        cmdBaseWorker.sortHandIdxs(handIdxsArray[0][0]) 

        //get heapIdxsArray 
        var heapIdxsArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard) 
        playNode.sendCardsAction(handIdxsArray, [[],[],[],[]], [[],[],[],[]], heapIdxsArray, []) 

        playNode.setCurrentRoundNodesVisible(false)
        playNode.actionBtns.setVisible(false)

        if ( !isRecordScene )
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
                playNode.showCurDirection()
                playNode.actionBtns.setVisible(true)
                managerTouch.openTouch()

                playNode.scoreTTF.setVisible(true)
                playNode.lastSprite.setVisible(true)
            }
            afterTurnover()
        }

        function bankerPlayDice()
        {
            tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
            var siceNum1 = cmdBaseWorker.cbSiceCount
            var siceNum2 = cmdBaseWorker.cbCaiShenPos
            playNode.playDiceOneDirection(gameStart, siceNum1, siceNum2, bankerShowChairid)
        }

        if(cmdBaseWorker.bIsRandBanker)
            playNode.playDiceForRandBanker(bankerPlayDice, bankerShowChairid)
        else
        {
            bankerPlayDice()
        }

    },
    onCMD_OutCard:function() 
    {
        if (isRecordScene && cmdBaseWorker.wVideoUser != INVALID_WORD)
        {
            var videoUserId = tableData.getUserWithChairId(cmdBaseWorker.wVideoUser)
            if (videoUserId.dwUserID != selfdwUserID)
                return
        }

        var outUser = tableData.getUserWithChairId(cmdBaseWorker.wOutCardUser)
        var outDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)  
        var outIdx = cmdBaseWorker.cbOutCardData

        playNode.timer.switchTimer([])
        playNode.playMajiangEffect(outIdx, outUser.cbGender)
        managerAudio.playEffect('gameRes/sound/discard.mp3')

        var majiangs = playNode.handMajiangs4D[outDir]
        if(outUser.dwUserID==selfdwUserID || isRecordScene)
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

        if (cmdBaseWorker.isInsetFengHeap == false)
        { // 正常插入丢弃排队
            majiangFactory.addDiscardMajiangs(playNode.discardMajiangs4D[outDir], outDir,
            outIdx, outUser.userNodeInsetChair.currentRoundNode.discardMajiangsNode)
        }
        else
        { // 放入单独丢弃风牌堆
            cmdBaseWorker.cbPlayerFlowerCardData[cmdBaseWorker.wOutCardUser] = cmdBaseWorker.cbPlayerFlowerCardData[cmdBaseWorker.wOutCardUser].concat(outIdx)
            playNode.onActionReplace(outIdx, outUser, playNode.flowerMajiangs4D)
        }

        playNode.setCurrentDiscardMj(outIdx, outDir)

        var self = tableData.getUserWithUserId(selfdwUserID)
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && (self.cbUserStatus == US_PLAYING || isRecordScene))
            playNode.showActionBtns(sortedActions)

        cmdBaseWorker.cbTingUserRev = INVALID_BYTE
    },
    onActionReplace:function(cardData, operateUser, flowerMajiangs4D)
    {
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var operateFlowerMajiangs = flowerMajiangs4D[operateUserDir]
        var operateFlowerMajiangsNode = operateUser.userNodeInsetChair.currentRoundNode.flowerMajiangsNode

        playNode.addFlowerMajiangs(operateFlowerMajiangs, operateUserDir, cardData, operateFlowerMajiangsNode)
    },
    addFlowerMajiangs:function(flowerMajiangs, direction, cardData, parent)
    {
        var majiangs = flowerMajiangs
        var majiang = majiangFactory.getOne(cardData, 4, direction, true)
        var i = majiangs.length
        var pos = majiangFactory.getFlowerMajiangPosAndTag(i, direction)
        majiang.x = pos.x
        majiang.y = pos.y
        majiang.setLocalZOrder(pos.zOrder)

        majiangs[i] = majiang
        parent.addChild(majiang)
    },  
    onCMD_SendCard:function() 
    {
        if (isRecordScene && cmdBaseWorker.wVideoUser != INVALID_WORD)
        {
            var videoUserId = tableData.getUserWithChairId(cmdBaseWorker.wVideoUser)
            if (videoUserId.dwUserID != selfdwUserID)
                return
        }

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
            //手牌
            if(item.bDiscard == true)//丢弃牌
            {
                var outUser = tableData.getUserWithChairId(cmdBaseWorker.wTakeCardUser)
                majiangFactory.addDiscardMajiangs(playNode.discardMajiangs4D[takeDir], takeDir,
                    item.cbCardData, outUser.userNodeInsetChair.currentRoundNode.discardMajiangsNode)
                continue
            }

            var idx = (isSelf||isRecordScene)?item.cbCardData:0
            majiangFactory.addHandMajiang(playNode.handMajiangs4D[takeDir], takeDir, idx, playNode.handGroupNode4D[takeDir], playNode.weaveMajiangs4D[takeDir].length)
        }
        /////摸到麻将时有可能出现杠听胡补花
        var self = tableData.getUserWithUserId(selfdwUserID)
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && isSelf && (self.cbUserStatus == US_PLAYING || isRecordScene))
            playNode.showActionBtns(sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
        if (cmdBaseWorker.isAutoDisCard == true && isSelf)
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
    },
    onActionGang:function(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var cardData = cardDatas[0]
        var gangType //0暗杠 1明杠 2增杠
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
        var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
        var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
        var provideDiscardMajiangs = majiangs4W4D.discardMajiangs4D[provideUserDir]
        var provideFlowerMajiangs = playNode.flowerMajiangs4D[provideUserDir]

        var isHasInWeave = false
        for(var i=0;i<operateWeaveMajiangs.length;i++)
        {
            var majiangsOneGroup = operateWeaveMajiangs[i]
            if(majiangsOneGroup.cbWeaveKind == WIK_PENG && majiangsOneGroup[0].cardData == cardData)
            {
                isHasInWeave = true
                break
            }
        }

        if(isHasInWeave)
            gangType = 2
        else if(operateUser==provideUser)
            gangType = 0
        else
            gangType = 1

        var deleteCardData = (operateUser.dwUserID == selfdwUserID || isRecordScene)?cardData:0
        if(gangType==2)
        {
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)
            majiangFactory.moveHandMajiangNew2Old(operateHandMajiangs, operateUserDir, handGroupNode4D[operateUserDir])
            majiangFactory.peng2Gang(cardData, operateWeaveMajiangs, operateUserDir)
        }
        else
        {
            var isQF = false
            var deleteLen = 4
            if(gangType==1)
            {
                if (cmdBaseWorker.cbTingUser == provideUser.wChairID && cardData >= 0x31 && cardData <= 0x37) //如果玩家听牌 且是疯子 则到花牌堆去删除
                {
                    isQF = true
                    playNode.ModifyFlowerMajiangColor(provideFlowerMajiangs)
                }
                else
                    majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
                
                deleteLen = deleteLen - 1
            }
            for(var i=0;i<deleteLen;i++)
            {
                majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)
            }

            var self = tableData.getUserWithUserId(selfdwUserID)
            var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
            playNode.addWeaveMajiangs(isQF, operateWeaveMajiangs, operateUserDir, 
                {
                    'cbCardDatas':[cardData, cardData, cardData, cardData],
                    'provideDirection':provideUserDir,
                    'cbCenterCardData':cardData,
                    'cbWeaveKind':WIK_GANG,
                    'cbPublicCard':gangType,
                }, 
                operateUser.userNodeInsetChair.currentRoundNode.weaveMajiangsNode,
                selfDir,
                majiangFactory.isPublicAnGang
                )
        }
    },
    //‘增删减查’
    addWeaveMajiangs:function(isQF, majiangsOneDirection, direction, weaveItem, parent, selfDirection)
    {
        var isPublicAnGang = majiangFactory.isPublicAnGang
        var groupIdx = majiangsOneDirection.length
        var isSelf = selfDirection == direction
        var majiangsOneGroup = playNode.weaveItem2Majiangs(isQF, groupIdx, direction, weaveItem, isSelf, isPublicAnGang)
        for(var i=0;i<majiangsOneGroup.length;i++)
        {
            parent.addChild(majiangsOneGroup[i])
        }
        majiangsOneDirection[groupIdx] = majiangsOneGroup
    },
    weaveItem2Majiangs:function(isQF, groupIdx, direction, weaveItem, isSelf, isPublicAnGang)
    {
        var cardDatas = weaveItem.cbCardDatas
        var majiangs = []
        var hasAddDirectionSpr = false
        for(var idxInGroup=0;idxInGroup<cardDatas.length;idxInGroup++)
        {
            var cardData = cardDatas[idxInGroup]
            if(weaveItem.cbWeaveKind==WIK_GANG && !weaveItem.cbPublicCard)
            {
                if(idxInGroup<3)
                    cardData = 0
                else if(!isSelf && !isPublicAnGang)
                    cardData = 0
            }
            var isIgnoreHandMajiangTouchEvent = false
            if(weaveItem.provideDirection!=direction && !hasAddDirectionSpr && cardData == weaveItem.cbCenterCardData && isQF)
                isIgnoreHandMajiangTouchEvent = true
            var majiang = majiangFactory.getOne(cardData, 2, direction, isIgnoreHandMajiangTouchEvent)

            var pos = majiangFactory.getWeaveMajiangPosAndTag(groupIdx, idxInGroup, direction)
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
                if (isQF)
                    majiang.color = cc.color(235,213,104,240)
            }
            majiangs[majiangs.length] = majiang
        }  
        majiangs.cbWeaveKind = weaveItem.cbWeaveKind

        return majiangs
    },
    onActionPeng:function(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var cardData = cardDatas[0]
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
        var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
        var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
        var provideDiscardMajiangs = majiangs4W4D.discardMajiangs4D[provideUserDir]
        var provideFlowerMajiangs = playNode.flowerMajiangs4D[provideUserDir]

        var weaveCardDatas = [cardData, cardData, cardData]

        if(operateUser.dwUserID == selfdwUserID || isRecordScene)
            var deleteCardDatas = [cardData, cardData]
        else
            var deleteCardDatas = [0, 0]

        //////
        var isQF = false
        if (cmdBaseWorker.cbTingUser == provideUser.wChairID && cardData >= 0x31 && cardData <= 0x37) //如果玩家听牌 且是疯子 则到花牌堆去删除
        {
            isQF = true
            playNode.ModifyFlowerMajiangColor(provideFlowerMajiangs)
        }
        else
            majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
        for(var i=0;i<deleteCardDatas.length;i++)
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardDatas[i])

        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
        playNode.addWeaveMajiangs(isQF, operateWeaveMajiangs, operateUserDir, 
        {
            'cbCardDatas':weaveCardDatas,
            'provideDirection':provideUserDir,
            'cbCenterCardData':cardData,
            'cbWeaveKind':WIK_PENG,
            'cbPublicCard':1,
        }, 
        operateUser.userNodeInsetChair.currentRoundNode.weaveMajiangsNode,
        selfDir,
        majiangFactory.isPublicAnGang
        )
       
        var maxCardData = operateHandMajiangs[0][operateHandMajiangs[0].length-1].cardData
        majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, maxCardData)
        majiangFactory.addHandMajiangNew(operateHandMajiangs, operateUserDir, maxCardData, 
                handGroupNode4D[operateUserDir])
    },
    //‘增删减查’
    ModifyFlowerMajiangColor:function(flowerMajiangs)
    {
        var majiangs = flowerMajiangs
        if (majiangs.length > 0)
        {
            var majiang = majiangs[majiangs.length-1]
            if (majiang)
            {
                majiang.color = cc.color(235,213,104,240)
                majiang.setUserData('true')
            }
        }
    },
    //处理吃碰杠 主要会调用到手牌堆、丢弃牌堆、吃碰杠牌堆的‘增删减查’
    onActionResult:function(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        if(action==WIK_REPLACE)
            majiangFactory.onActionReplace(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        if(action==WIK_GANG)
            playNode.onActionGang(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_PENG)
            playNode.onActionPeng(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_LEFT)
            majiangFactory.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_CENTER)
            majiangFactory.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_RIGHT)
            majiangFactory.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    },
    onCMD_OperateResult:function() 
    {
        if (isRecordScene && cmdBaseWorker.wVideoUser != INVALID_WORD)
        {
            var videoUserId = tableData.getUserWithChairId(cmdBaseWorker.wVideoUser)
            if (videoUserId.dwUserID != selfdwUserID)
                return
        }

        playNode.hideActionBtns()
        majiangFactory.hideCurrentDiscardMj()
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])

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
            playNode.onActionResult(cmdBaseWorker.cbOperateCode, idxs, operateUser, provideUser,
                majiangs4W4D, playNode.handGroupNode4D)

            playNode.playAction(cmdBaseWorker.cbOperateCode, operateUser)

            if (cmdBaseWorker.cbOperateCode == WIK_LISTEN)
            { // 听牌
                playNode.playGenderEffect('ting0', tableData.getUserWithChairId(cmdBaseWorker.wOperateUser).cbGender)
                cmdBaseWorker.cbTingUser = cmdBaseWorker.wOperateUser
                cmdBaseWorker.userTing(cmdBaseWorker.wOperateUser)
                playNode.showAnGangCards()
                majiangFactory.isPublicAnGang = true
            }
        }
        else
        {
            if (cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID && cmdBaseWorker.cbTingUser == cmdBaseWorker.wCurrentUser)
            {//本人是听牌玩家 自动出牌
                if (cmdBaseWorker.cbTingUserRev != INVALID_BYTE && cmdBaseWorker.isAutoDisCard)
                {
                    var a = cc.sequence( 
                        cc.delayTime(0.8),
                        cc.callFunc(function()
                        {   
                            var item = cmdBaseWorker.sendCardArray[0]
                            var OutCard = getObjWithStructName('CMD_C_OutCard')
                            OutCard.cbOutCardData = cmdBaseWorker.cbTingUserRev
                            socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                            playNode.hideActionBtns()
                        }) 
                    )           
                    playNode.node.runAction(a)
                }
            }
        }
        
        var self = tableData.getUserWithUserId(selfdwUserID)
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && (self.cbUserStatus == US_PLAYING || isRecordScene))
        {
            if((cmdBaseWorker.cbActionMask&WIK_GANG)!=0)
            {
                cmdBaseWorker.wProvideUser    = INVALID_CHAIR
                cmdBaseWorker.cbProvideCardData  = INVALID_CARD_DATA    
            }
            
            playNode.showActionBtns(sortedActions)  //吃碰后杠 idx不确定 需要searchGangIdxs
        }
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
                    playNode.popGameEndNew(continueCall, userData_gameEnd) 
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

            if (cmdBaseWorker.cbListening && cmdBaseWorker.cbTingUser == tableData.getUserWithUserId(selfdwUserID).wChairID)
                isForbid = true

            var isAllowOut = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID && !isForbid && !cmdBaseWorker.isAutoDisCard
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
    getFlowerMajiangsArray:function(flowerCardDatasArray)
    {
        var flowerMajiangs4D = []
        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
        {
            var direction = showChairid

            var cardDatas = flowerCardDatasArray[direction]
            if(!cardDatas || cardDatas.length == 0)
            {
                flowerMajiangs4D[direction] = []
                continue
            }

            var majiangsOneDirection = []
            for(var j=0;j<cardDatas.length;j++)
            {
                var cardData = cardDatas[j]

                var majiang = majiangFactory.getOne(cardData, 4, direction)
                var pos = majiangFactory.getFlowerMajiangPosAndTag(j, direction)
                majiang.x = pos.x
                majiang.y = pos.y
                majiang.setLocalZOrder(pos.zOrder)
                majiangsOneDirection[j] = majiang
            }
            flowerMajiangs4D[direction] = majiangsOneDirection
        }

        return flowerMajiangs4D
    },
    getDiscardMajiangsArray:function(discardCardDatasArray)
    {
        var discardMajiangs4D = []
        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
        {
            var direction = showChairid
            var discardCount = direction%2==0?majiangFactory.discardCountOneRow:majiangFactory.discardCountOneLine

            var cardDatas = discardCardDatasArray[direction]
            if(!cardDatas || cardDatas.length == 0)
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
                var pos = majiangFactory.getDiscardMajiangPosAndTag(row, line, direction)
                majiang.x = pos.x
                majiang.y = pos.y
                majiang.setLocalZOrder(pos.zOrder)
                majiangsOneDirection[j] = majiang
            }
            discardMajiangs4D[direction] = majiangsOneDirection
        }

        return discardMajiangs4D
    },
    sendCardsAction:function(handIdxsArray, discardIdxsArray, weaveItemArray, heapIdxsArray, flowerIdxsArray)
    {   
        // flowerIdxsArray = [ [0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48] ]
        // heapIdxsArray = [ [1,0,0,0,0,0,0,0,0,0,0,0,0,0],[],[],[] ]
        // discardIdxsArray = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
        // weaveIdxsArray = [[[1,2,3,4],[2,3,4],[4,5,6],[7,8,1]],[],[[1,2,3],[2,3,4,5],[4,5,6],[7,8,1]],[]]
        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)

        playNode.flowerMajiangs4D = playNode.getFlowerMajiangsArray(flowerIdxsArray)
        playNode.heapMajiangs4D = majiangFactory.getHeapMajiangsArray(heapIdxsArray)
        playNode.handMajiangs4D = majiangFactory.getHandMajiangsArray(handIdxsArray, tableData.getUserWithUserId(selfdwUserID).wChairID == INVALID_WORD)
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
        playNode.weaveMajiangs4D = majiangFactory.getWeaveMajiangsArray(weaveItemArray, selfDir, true)

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
    popGameEndNew:function(continueCall, userData_gameEnd)
    {
        var control = {}
        var isQiangGang = false
        control.goonCall = function()
        {
            majiangFactory.hideCurrentDiscardMj()
            continueCall()
            node.removeFromParent()
        }
        var node  = managerRes.loadCCB(resp.gameEndPopCCB2, control)
        playNode.gameEndControl = control

        var gendBar = control.mahjong
        var barWidth= (gendBar.getContentSize().width - 55)/14  //单独牌宽度

        for (var i = 0; i <= 11; i++)
        {
            control['type'+i].setString('')
            control['type'+i].setVisible(false)
        }

        var isZiMo = cmdBaseWorker.wProvideUser == cmdBaseWorker.wWinner 
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        var wSelfChairID = tableData.getServerChairIdWithShowChairId(selfChairId)

        if (cmdBaseWorker.endType == 0 || cmdBaseWorker.endType == 1)
        {
            control['fanText'].setVisible(false)
            control['liuju'].setVisible(true)
            control['fanNum'].setVisible(false)
        }
        else
        {
            control['fanNum'].setString(cmdBaseWorker.dwWinZui)
            control['fanText'].setVisible(true)
            control['liuju'].setVisible(false)
            control['fanNum'].setVisible(true)

            control['type'+0].setString('胡牌 2嘴')
            control['type'+0].setVisible(true)
            var chiHuCount = 1
            var type = 1

            if (cmdBaseWorker.cbZhanYiDui[cmdBaseWorker.wWinner] > 0)
            {
                if (cmdBaseWorker.cbZhanYiDui[cmdBaseWorker.wWinner] == 1)
                    control['type'+type].setString('沾一对 ' + '1嘴')
                else
                    control['type'+type].setString('沾一对*' + cmdBaseWorker.cbZhanYiDui[cmdBaseWorker.wWinner] + ' ' + cmdBaseWorker.cbZhanYiDui[cmdBaseWorker.wWinner] + '嘴')
                control['type'+type].setVisible(true)
                type++
            }
            if (cmdBaseWorker.cbZhanErDui[cmdBaseWorker.wWinner] > 0)
            {
                if (cmdBaseWorker.cbZhanErDui[cmdBaseWorker.wWinner] == 1)
                    control['type'+type].setString('沾二对 ' + '2嘴')
                else
                    control['type'+type].setString('沾二对*' + cmdBaseWorker.cbZhanErDui[cmdBaseWorker.wWinner] + ' ' + cmdBaseWorker.cbZhanErDui[cmdBaseWorker.wWinner]*2 + '嘴')
                control['type'+type].setVisible(true)
                type++
            }

            for(var showChairid=0;showChairid<4;showChairid++)
            {
                var wChairID = tableData.getServerChairIdWithShowChairId(showChairid)
                control['name'+wChairID].setString(userData_gameEnd[wChairID].szNickName)

                //胡型
                for (var i = 0; i < map_mask2Name.length; i++) 
                {
                    if (wChairID != cmdBaseWorker.wWinner)
                        break
                    var chr_type = window[ map_mask2Name[i][0] ] 
                    if (cmdBaseWorker.dwChiHuRight[wChairID] & chr_type)
                    {
                        if (chr_type == CHR_QiangGang)
                            isQiangGang = true
                        var typeString = map_mask2Name[i][1]
                        control['type'+type].setString(typeString)
                        control['type'+type].setVisible(true)
                        type++
                        if (chiHuCount >= 12)
                            break;
                        chiHuCount++
                    }
                }

                control['bankerIcon_'+wChairID].setVisible(wChairID == cmdBaseWorker.wBankerUser)

                var scoreSymbal = control['sign'+wChairID]
                if (cmdBaseWorker.lGameScore[wChairID] > 0)
                {
                    scoreSymbal.setSpriteFrame('img_sign_plus.png')
                    scoreSymbal.setVisible(true)
                    control['score'+wChairID].setFontFillColor( cc.color(254, 128, 0) )
                }
                else if (cmdBaseWorker.lGameScore[wChairID] < 0)
                {
                    scoreSymbal.setSpriteFrame('img_sign_sub.png')
                    scoreSymbal.setVisible(true)
                    control['score'+wChairID].setFontFillColor( cc.color( 34, 211, 251) )
                }
                else
                {
                    scoreSymbal.setVisible(false)
                    control['score'+wChairID].setFontFillColor( cc.color(34, 211, 251) )
                }

                control['score'+wChairID].setString(cmdBaseWorker.lGameScore[wChairID]<0?cmdBaseWorker.lGameScore[wChairID]*(-1):cmdBaseWorker.lGameScore[wChairID]) 

                if(cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU)
                {
                    control['playerBg'+wChairID].setSpriteFrame('img_bg_win.png')
                    control['imgHu'+wChairID].setVisible(true)
                    control['dianpao'+wChairID].setVisible(false)
                }
                else if(wChairID==cmdBaseWorker.wProvideUser)
                {
                    control['playerBg'+wChairID].setSpriteFrame('img_bg_dianpao.png')
                    control['imgHu'+wChairID].setVisible(false)
                    control['dianpao'+wChairID].setVisible(true)
                }
                else
                {
                    control['playerBg'+wChairID].setSpriteFrame('img_bg_win.png')
                    control['imgHu'+wChairID].setVisible(false)
                    control['dianpao'+wChairID].setVisible(false)
                }

                if(wChairID != cmdBaseWorker.wWinner)
                    continue

                //显示麻将
                var majiangsNode = new cc.Node()
                majiangsNode.x = 0
                majiangsNode.y = gendBar.height - 12 - 0.5*(majiangFactory.down_handHeight*majiangFactory.scale_upDown*majiangsNode.scale)
                gendBar.addChild(majiangsNode)

                //吃碰杠的牌
                var weaveItems = cmdBaseWorker.WeaveItemArray[wChairID]
                var groupLen = 0 
                var waveCardPos = 0
                for(var groupIdx=0;groupIdx<weaveItems.length;groupIdx++)
                {
                    var weaveItem = weaveItems[groupIdx]
                    if(weaveItem.cbWeaveKind == WIK_NULL)
                        continue

                    groupLen += 1
                    if(weaveItem.cbWeaveKind!=WIK_GANG)
                        weaveItem.cbCardDatas = weaveItem.cbCardDatas.slice(0, 3)

                    weaveItem.provideDirection = 0//这样就不显示箭头了
                    var majiangsOneGroup = majiangFactory.weaveItem2Majiangs(groupIdx, 0, weaveItem, true, true)
                    
                    var waveSep = groupIdx*majiangFactory.scale_upDown*majiangFactory.downHandIntervalX*3

                    for(var idxInGroup=0;idxInGroup<majiangsOneGroup.length;idxInGroup++)
                    {
                        var mj = majiangsOneGroup[idxInGroup]
                        mj.width = barWidth
                        mj.height= mj.width*46/30
                        mj.y += 12+16

                        if (groupIdx > 0)
                        {
                            if (idxInGroup >= 3)
                                mj.x = waveCardPos-mj.width*2
                            else
                            {
                                mj.x = waveCardPos
                                waveCardPos = mj.x+mj.width
                            }
                        }

                        if (idxInGroup == 2)
                            waveCardPos = mj.x+mj.width

                        majiangsNode.addChild(mj)
                    }

                    waveCardPos += 10
                }

                var startPos = (barWidth*3)*groupLen+groupLen*7
                var handCardDatas = cmdBaseWorker.cbHandCardData[wChairID]
                var hasLightProvideMj = false

                var handCardPos = 0
                var cardPos = 0
                for(var j=0;j<handCardDatas.length;j++)
                {
                    var cardData = handCardDatas[j]
                    if (cardData == 0)
                        continue

                    if(!hasLightProvideMj && cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU && cardData == cmdBaseWorker.cbProvideCardData)
                    {
                        hasLightProvideMj = true
                        continue
                    }

                    var majiang = majiangFactory.getOne(cardData, 2, 0)
                    majiang.idxInHandMajiangs = cardPos
                    var pos = majiangFactory.getDisplayHandMajiangPosAndTagAndTag(handCardDatas.length-1, majiang.idxInHandMajiangs, 0, false)

                    if (cardPos == 0)
                         majiang.x = startPos + pos.x
                    else
                        majiang.x = handCardPos

                    majiang.y = 16//pos.y
                    majiang.width = barWidth
                    majiang.height= barWidth*46/30

                    handCardPos = majiang.x+majiang.width

                    majiangsNode.addChild(majiang)
                    cardPos++
                }

                if (cmdBaseWorker.cbProvideCardData)
                {
                    var majiang = majiangFactory.getOne(cmdBaseWorker.cbProvideCardData, 2, 0)
                    majiang.idxInHandMajiangs = cardPos
                    var pos = majiangFactory.getDisplayHandMajiangPosAndTagAndTag(handCardDatas.length, majiang.idxInHandMajiangs, 0, true)
                    majiang.x = handCardPos + 7
                    majiang.y = 16//pos.y
                    majiang.width = barWidth
                    majiang.height= barWidth*46/30
                    majiangsNode.addChild(majiang)
                }
            }

            if (chiHuCount < 12 && cmdBaseWorker.cbWinnerClipValue != 0)
            {
                control['type'+type].setString('夹子 ' + cmdBaseWorker.cbWinnerClipValue + '嘴')
                control['type'+type].setVisible(true)
                type++
            }
            if (chiHuCount < 12 && cmdBaseWorker.isWinnerVastZhang == 1)
            {
                control['type'+type].setString('绝张 40嘴')
                control['type'+type].setVisible(true)
                type++
            }
            if (chiHuCount < 12 && cmdBaseWorker.lGangScore > 0)
            {
                control['type'+type].setString('杠  ' + cmdBaseWorker.lGangScore + '嘴')
                control['type'+type].setVisible(true)
                type++
            }
            if (chiHuCount < 12 && cmdBaseWorker.lFengScore > 0)
            {
                control['type'+type].setString('摸风 ' + cmdBaseWorker.lFengScore + '嘴')
                control['type'+type].setVisible(true)
                type++
            }
            if (chiHuCount < 12 && (isZiMo == true || isQiangGang == true))
            { 
                //if (cmdBaseWorker.wBankerUser == cmdBaseWorker.wWinner || selfChairId == cmdBaseWorker.wWinner || cmdBaseWorker.wBankerUser == selfChairId)
                //{
                    if (isZiMo == true)
                        control['type'+type].setString('自摸 x2')
                    else if (isQiangGang == true)
                        control['type'+type].setString('抢杠胡 x2')
                    control['type'+type].setVisible(true)
                    type++
                //}
            }
            if (chiHuCount < 12 && cmdBaseWorker.cbReBankerTimes > 1)
            {
                if (cmdBaseWorker.wBankerUser == cmdBaseWorker.wWinner || selfChairId == cmdBaseWorker.wWinner || cmdBaseWorker.wBankerUser == selfChairId)
                {
                    var cbTimes = 1
                    if (cmdBaseWorker.cbReBankerTimes <= 4)
                        cbTimes = cmdBaseWorker.cbReBankerTimes*2
                    else
                        cbTimes = 16
                    control['type'+type].setString('连庄 ' + 'x' + cbTimes)
                    control['type'+type].setVisible(true)
                    type++
                }
            }
            else if (chiHuCount < 12)
            {
                if (cmdBaseWorker.wBankerUser == cmdBaseWorker.wWinner)
                {//庄家赢 其余玩家都多付一倍
                    control['type'+type].setString('庄家胡 x2')
                    control['type'+type].setVisible(true)
                    type++
                }
                else if (cmdBaseWorker.wBankerUser == selfChairId || selfChairId == cmdBaseWorker.wWinner)
                { // 闲家赢则庄家用户显示 多输标志
                    control['type'+type].setString('闲家胡 x2')
                    control['type'+type].setVisible(true)
                    type++
                }
            }
            if (chiHuCount < 12)
            {
                if (cmdBaseWorker.cbTingUser == null)
                {
                    control['type'+type].setString('非报听 +5分')
                    control['type'+type].setVisible(true)
                    type++
                }
                else
                {
                    if (cmdBaseWorker.cbTingUser == cmdBaseWorker.wWinner)
                    {// 赢家报听
                        control['type'+type].setString('报听 +10分')
                        control['type'+type].setVisible(true)
                        type++
                    }
                    else
                    {
                        control['type'+type].setString('非报听 +5分')
                        control['type'+type].setVisible(true)
                        type++
                    }
                }
            }
        }
       
        node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5) )
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
           majiangFactory.setCurrentDiscardMj(idx, direction)
    },
    showCurDirection:function()
    {
        var idx = cmdBaseWorker.cbCurFeng
        if(idx == INVALID_CARD_DATA)
            return

        if (idx == 0x31)
            tableNode.curFengQuan.setString('东风圈')
        else if (idx == 0x32)
            tableNode.curFengQuan.setString('南风圈')
        else if (idx == 0x33)
            tableNode.curFengQuan.setString('西风圈')
        else if (idx == 0x34)
            tableNode.curFengQuan.setString('北风圈')
    },
    setLianZhuangTimes:function(times)
    {
        tableNode.reBankerLabel.setVisible(true)
        tableNode.reBankerLabel.setString('连庄：' + times)
    },
    hideLaizi:function()
    {
        playNode.laiziNode.removeAllChildren()
    },
    playAction:function(WIK, user)
    {
        if(cmdBaseWorker.cbOutCardCount == 0 && WIK == WIK_REPLACE)
            return;

        var name = typeof(WIK)=='number'?majiangLogic.wik2Name(WIK):WIK
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
        playNode.scoreTTF.setVisible(false)
        playNode.lastSprite.setVisible(false)
        playNode._removeSprsOnGameEnd()
        playNode.timerNode.setVisible(false)
        playNode.hideLaizi()

        cmdBaseWorker.cbAllowTingCount  = 0
        cmdBaseWorker.cbTingUser        = null
        cmdBaseWorker.isAutoDisCard     = false
        cmdBaseWorker.cbListening       = 0
        cmdBaseWorker.cbTingUserRev     = INVALID_BYTE
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
        for(var k=0; k<4; k++)
        {
            var user = tableData.getUserWithChairId(k)
            var direction = tableData.getShowChairIdWithServerChairId(user.wChairID)
            var operateWeaveMajiangs = playNode.weaveMajiangs4D[direction]  

            var cbGangCount = 0
            var cbCardDatas = cmdBaseWorker.cbAnGangCards[user.wChairID]
            for(var i = 0;i<operateWeaveMajiangs.length;i++)
            {
                var group = operateWeaveMajiangs[i]
                if(group.length == 4&&group[0].cardData==0 && cbGangCount <= 4)
                {
                   var waveMajiangsNode = user.userNodeInsetChair.currentRoundNode.weaveMajiangsNode
                   var majiang = majiangFactory.getOne(cbCardDatas[cbGangCount], 2, direction)
                   majiang.x = group[3].x
                   majiang.y = group[3].y
                   majiang.setLocalZOrder(group[3].zOrder)
                   waveMajiangsNode.removeChild(group[3])
                   group[3] = majiang
                   waveMajiangsNode.addChild(majiang)
                   cbGangCount++
                }
            }
        }
    },
}






















