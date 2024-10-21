
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
    ZhuDongAction:null,
    DELAYTIME:null,

    ///////////////////////init start///////////////////////
    init:function()
    {   
        // userSettingPop.itemShowState[2] = false//[true,true,false]//表示玩家设置中的第三个选择功能无效化
        // isOpenPTH = 1               //强制性修改普通话开关，前提是开关无效
        
        playNode._registEvent()
        playNode._initCallBack()
        var node = managerRes.loadCCB(resp.playCCB, this)
        playNode.animationManager = node.animationManager
        playNode.node  = node
        majiangFactory.isShowHeap = false
        majiangFactory.isPublicAnGang = true
        majiangFactory.heapCountOneRow = 26
        playNode.DELAYTIME = 1
        majiangFactory.init( playNode.mjTableNode, playNode.decorateMj )


        playNode.timer = majiangTimer4D.getTimer()
        playNode.timerNode.addChild(playNode.timer)
        playNode.timerNode.setScale( majiangFactory.scale_upDown*0.9 )

        majiangFactory.isShowHeap = false
    },
    onReStart:function()
    {
        playNode.handMajiangs4D = []
        playNode.handGroupNode4D = []
        playNode.discardMajiangs4D = []
        playNode.weaveMajiangs4D = []
        playNode.isLookingResult = false
        playNode.isPlaying = false

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
        
        // if(showChairId==0||showChairId==3)
        //     sign = -1
        // else
        //     sign = 1

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

            //discard
            var discardMajiangsNodeWith = (majiangFactory.discardCountOneRow-1)*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
            var mjsDiscardHeight = majiangFactory.down_discardHeight*majiangFactory.scale_upDown

            //-chairNodePosInMjTable.x相当于从posx=0开始算起
            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + 
            0.5*( majiangFactory.mjTableNode.width - discardMajiangsNodeWith)
            currentRoundNode.discardMajiangsNode.y = -chairNodePosInMjTable.y + centerPosY - mjsDiscardHeight*0.5 - 40 
            currentRoundNode.discardMajiangsNode.setLocalZOrder(1)
            //hand
            var mjsWidth = majiangFactory.down_handWidth*majiangFactory.scale_upDown
            currentRoundNode.handMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - 8
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

            //discard
            var discardMajiangsNodeWith = (majiangFactory.discardCountOneRow-1)*majiangFactory.up_discardWidth*majiangFactory.scale_upDown
            var mjsDiscardHeight = majiangFactory.up_discardHeight*majiangFactory.scale_upDown

            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - 
            0.5*( majiangFactory.mjTableNode.width - discardMajiangsNodeWith)
            currentRoundNode.discardMajiangsNode.y =  -chairNodePosInMjTable.y + centerPosY + mjsDiscardHeight*0.5 + 40
            currentRoundNode.discardMajiangsNode.setLocalZOrder(3)

            //hand
            var mjsWidth = majiangFactory.up_handWidth*majiangFactory.scale_upDown
            var handMjsWidth = MAX_COUNT*mjsWidth + majiangFactory.upMjAndNewMjInterval
            var w = (majiangFactory.mjTableNode.width - handMjsWidth)/2
            currentRoundNode.handMajiangsNode.x = -chairNodePosInMjTable.x + w
            currentRoundNode.handMajiangsNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight*0.5 - 10
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
            //discard
            var downDiscardMajiangsNodeWidth = majiangFactory.discardCountOneRow*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
            var discardMajiangsNodeHeight = (majiangFactory.discardCountOneLine-1)*majiangFactory.rightDiscardIntervalY*majiangFactory.scale_rightLeft
            var distanceFromUpDown = 0.5*(majiangFactory.mjTableNode.height - downHandHeight - upHandHeight - discardMajiangsNodeHeight)

            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - 
            0.5*( majiangFactory.mjTableNode.width - downDiscardMajiangsNodeWidth ) + (10 + 0.5*majiangFactory.right_discardWidth*majiangFactory.scale_rightLeft)
            currentRoundNode.discardMajiangsNode.y =  -chairNodePosInMjTable.y + downHandHeight + distanceFromUpDown

            //hand
            currentRoundNode.handMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width -distanceHandFromBorder_rightLeft + 20
            currentRoundNode.handMajiangsNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight - 30
            
            //weave
            currentRoundNode.weaveMajiangsNode.x = currentRoundNode.handMajiangsNode.x 
            currentRoundNode.weaveMajiangsNode.y = -chairNodePosInMjTable.y + downHandHeight + distanceHandFromDown - 30

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
            //discard
            var downDiscardMajiangsNodeWidth = majiangFactory.discardCountOneRow*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
            var discardMajiangsNodeHeight = (majiangFactory.discardCountOneLine-1)*majiangFactory.leftDiscardIntervalY*majiangFactory.scale_rightLeft
            var distanceFromUpDown = 0.5*(majiangFactory.mjTableNode.height - downHandHeight - upHandHeight - discardMajiangsNodeHeight)

            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x +
            0.5*( majiangFactory.mjTableNode.width - downDiscardMajiangsNodeWidth )  - (10 + 0.5*majiangFactory.left_discardWidth*majiangFactory.scale_rightLeft)
            currentRoundNode.discardMajiangsNode.y =  -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight - distanceFromUpDown

            //hand
            currentRoundNode.handMajiangsNode.x = -chairNodePosInMjTable.x + distanceHandFromBorder_rightLeft - 20
            currentRoundNode.handMajiangsNode.y = -chairNodePosInMjTable.y +  downHandHeight + distanceHandFromDown - 30
            //weave
            currentRoundNode.weaveMajiangsNode.x = currentRoundNode.handMajiangsNode.x 
            currentRoundNode.weaveMajiangsNode.y = -chairNodePosInMjTable.y + majiangFactory.mjTableNode.height - upHandHeight - 30
        
            //heap
            currentRoundNode.heapMajiangsNode.x = currentRoundNode.handMajiangsNode.x + leftRightHandWidth*0.5 + majiangFactory.leftHeapFromHandX*majiangFactory.scale_upDown
            currentRoundNode.heapMajiangsNode.y = -chairNodePosInMjTable.y + downHandHeight + majiangFactory.leftHeapFromHandY*majiangFactory.scale_rightLeft + 30
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

                //playNode.checkTableCards(callFunName)
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
            playNode.ZhuDongAction = true
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
                    playNode.showChoosePopOfAction(idxsArray, actions, sendGang)
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
            alert('actionCall_ting')
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
            cmdBaseWorker.sendMessage_guo([cmdBaseWorker.cbProvideCardData])
            playNode.hideActionBtns()  
            majiangFactory.chooseItemsNode.removeAllChildren() 
        }

        playNode.actionCall_replace = function()//不需要玩家手动触发 只要收到这个动作 自动执行
        {
            alert('actionCall_replace')  
        }
    },
    showChoosePopOfAction:function(cardDatasArray, actionArray, actionCall)
    {
        var len = actionArray.length
        for(var i=0;i<len;i++)
        {
            var cardDatas = cardDatasArray[i]
            var chooseItem = playNode._getChooseItemOfAction(cardDatas, actionArray[i], actionCall)

            chooseItem.x = ( i - (len-1)/2 ) * (majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.downHandIntervalX*3 + 80)
            chooseItem.y = 0
            majiangFactory.chooseItemsNode.addChild(chooseItem)
        }
    },
    _getChooseItemOfAction:function(sortedOperateCardDatas, action, actionCall)
    {        
        var chooseItem = new cc.Node()
        // var provideCardData = cardDatas[0]
        ////////////////////////////
        var showLen = sortedOperateCardDatas.length
        if(action == WIK_GANG)
            showLen = 4
        for(var i=0;i<showLen;i++)
        {
            var mj = majiangFactory.getOne(sortedOperateCardDatas[i], 0, 0)
            mj.setScale(majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale)
            mj.x = ( i - (showLen-1)/2 )*majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.downHandIntervalX
            
            if( (action == WIK_LEFT && i==0) || (action == WIK_CENTER && i==1) || (action == WIK_RIGHT && i==2) )
            {
                // provideCardData = i
                mj.color = cc.color(122, 122, 122)
            }

            chooseItem.addChild(mj)
        }

        ////////////////////////////
        var bg = new cc.Scale9Sprite('mf_chooseItemBg.png')
        bg.width = majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.downHandIntervalX*showLen + 10
        bg.height = majiangFactory.scale_upDown*majiangFactory.chooseItemMjScale*majiangFactory.down_handHeight + 10 
        bg.x = 0//bg.width/2
        bg.y = 0//bg.height/2
        bg.anchorX = 0.5
        bg.anchorY = 0.5
        chooseItem.addChild(bg, -1)

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
                    majiangFactory.chooseItemsNode.removeAllChildren()
                    actionCall?actionCall(sortedOperateCardDatas, action):''
                }
            }
        })
        cc.eventManager.addListener(listener, bg)

        return chooseItem
    },
    decorateMj:function(mj)
    {
        var idx = mj.cardData 
        if( cmdBaseWorker.isMagicCard(mj.cardData, cmdBaseWorker.cbMagicCardData) ) //|| mj.cardData == REPLACE_CARD_DATA)
        {
            // if(mj.cardData == cmdBaseWorker.cbMagicCardData)
            //     var s = new cc.Sprite("#caiShen.png")
            // else 
            //     var s = new cc.Sprite("#bao.png")

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
        playNode.isPlaying = true

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
        playNode.resetPlayNode()

        playNode.isPlaying = true

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        playNode.showLaizi()
        
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

        playNode.timer.initFenwei( tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser) )
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
        playNode.timerNode.setVisible(true)

        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
            //user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] )
        }

        if(cmdBaseWorker.wOutCardUser!=INVALID_WORD)
        {
            var d = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)
            playNode.setCurrentDiscardMj(cmdBaseWorker.cbOutCardData, d)
        }

        /////吃碰杠胡
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var isActioning = sortedActions.length>0
        if(isActioning)
            playNode.showActionBtns(sortedActions)

        var handIdxsArray = [[[], null], [[], null], [[], null], [[], null]]
        var discardIdxsArray = [[],[],[],[]]
        var weaveItemArray = [[],[],[],[]]

        for(var i=0;i<GAME_PLAYER;i++)
        {
            var isSelf = tableData.getUserWithChairId(i).dwUserID == selfdwUserID
            var direction = tableData.getShowChairIdWithServerChairId(i)
            var weaveItems = cmdBaseWorker.WeaveItemArray[i]
            //组合牌
            for(var j=0;j<MAX_WEAVE;j++)
            {
                var t = weaveItems[j].cbCardData
                weaveItems[j].cbCardData = cmdBaseWorker.sortWeaveIdxs(weaveItems[j].cbWeaveKind, t)

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
                if (isSelf)
                {
                    if (cmdBaseWorker.cbSendCardData == INVALID_CARD_DATA)
                        var newMJ = handIdxs[handIdxs.length-1]
                    else
                        var newMJ = cmdBaseWorker.cbSendCardData
                }
                else
                    var newMJ = 0
                for (var j=0;j<handIdxs.length;j++)
                {
                    if (handIdxs[j] == newMJ)
                    {
                        handIdxs.splice(j,1)
                        handIdxsArray[direction][0] = handIdxs
                        break
                    }
                }
                //handIdxsArray[direction][0] = handIdxs.slice(0, handIdxs.length-1)
                handIdxsArray[direction][1] = newMJ//handIdxs[handIdxs.length-1]
            }
            else
                handIdxsArray[direction][0] = handIdxs

            discardIdxsArray[direction] = cmdBaseWorker.cbDiscardCardData[i].slice(0, cmdBaseWorker.cbDiscardCount[i])
        }
        // console.log(6666, handIdxsArray, discardIdxsArray, weaveItemArray)
        cmdBaseWorker.sortHandIdxs(handIdxsArray[0][0]) 
        // get heapIdxsArray
        //var heapIdxsArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)
        playNode.sendCardsAction(handIdxsArray, discardIdxsArray, weaveItemArray, [], cmdBaseWorker.cbPlayerFlowerCardData) 
    },
    onCMD_Call:function()
    {
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
        playNode.isPlaying = true

        if(playNode.isLookingResult)
        {
            playNode.resetPlayNode()
        } 

        /////
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
    onCMD_GameStart:function() 
    {
        // if(!playNode.isPlaying)//有的游戏有call状态
        // {
        //     cocos.clearInterval(playNode.updateOnFree, playNode.node)
        //     playNode.isPlaying = true

        //     if(playNode.isLookingResult)
        //     {
        //         playNode.resetPlayNode()
        //     } 
        // }

        playNode.isPlaying = true
        playNode.resetPlayNode()

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
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
            //user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] )
        }

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
        //var heapIdxsArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)       
       
        playNode.sendCardsAction(handIdxsArray, [[],[],[],[]], [[],[],[],[]], [], []) 
        playNode.setCurrentRoundNodesVisible(false)
        playNode.actionBtns.setVisible(false)
        managerTouch.closeTouch() //避免在不知道牌的情况下 把牌打出去
        //提前保存可能被破坏的数据  掷骰子是庄家出牌破坏数据 因为可能庄家筛子先出完
        var bankerShowChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser)
        function gameStart()
        {
            playNode.showLaizi()
            playNode.timer.initFenwei( bankerShowChairid )
            playNode.timerNode.setVisible(true)

            playNode.setCurrentRoundNodesVisible(true)
            playNode.actionBtns.setVisible(true)
            managerTouch.openTouch()
        }

        function bankerPlayDice()
        {
            tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
            var siceNum1 = cmdBaseWorker.Randomnum[0]//getRandNum(Math.max(cmdBaseWorker.cbSiceCount-6, 1), Math.min(cmdBaseWorker.cbSiceCount-1, 6))
            var siceNum2 = cmdBaseWorker.Randomnum[1]//cmdBaseWorker.cbSiceCount - siceNum1
            playNode.playDiceOneDirection(gameStart, siceNum1, siceNum2, bankerShowChairid)
        }

        // if(cmdBaseWorker.bIsRandBanker)
        //     playNode.playDiceForRandBanker(bankerPlayDice, bankerShowChairid)
        // else
            bankerPlayDice()

    },
    onCMD_OutCard:function() 
    {
        //playNode.ZhuDongAction = false
        var outUser = tableData.getUserWithChairId(cmdBaseWorker.wOutCardUser)
        var outDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)  
        var outIdx = cmdBaseWorker.cbOutCardData

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

        majiangFactory.addDiscardMajiangs(playNode.discardMajiangs4D[outDir], outDir,
            outIdx, outUser.userNodeInsetChair.currentRoundNode.discardMajiangsNode)

        //杭州麻将  当出完牌后变为本来的颜色
        // var isSelf = tableData.getUserWithChairId(cmdBaseWorker.wTakeCardUser).dwUserID == selfdwUserID
        var isSelf = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
        var majiang = playNode.handMajiangs4D[outDir]
        //console.log(2323232323,majiangs[0].length)
        for(var id = 0; id<majiang[0].length;id++)
        {
            majiang[0][id].color = cc.color(255,255,255)
        }
        
    
        playNode.setCurrentDiscardMj(outIdx, outDir)

        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(sortedActions)
    },
    onCMD_SendCard:function() 
    {
        playNode.ZhuDongAction = false
        if(cmdBaseWorker.cbOutCardCount != 0)
            managerAudio.playEffect('gameRes/sound/sendcard.mp3')

        var isSelf = tableData.getUserWithChairId(cmdBaseWorker.wTakeCardUser).dwUserID == selfdwUserID

        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])

        var takeDir =  tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTakeCardUser)   
        ///////
        
        //杭州麻将  当别人打财神的时候除了摸来的牌，其他牌都变色
        var self = tableData.getUserWithUserId(selfdwUserID).wChairID
        var outDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser)
        if ((cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[0]] || cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[1]]) 
            && (!(cmdBaseWorker.ForbidUserAction[0] == self) || !(cmdBaseWorker.ForbidUserAction[1] == self))
            && (cmdBaseWorker.ForbidUserAction[0] != self || cmdBaseWorker.ForbidUserAction[1] != self)&&isSelf)
        {
            var majiang = playNode.handMajiangs4D[outDir]
            for(var id = 0; id<majiang[0].length;id++)
            {
                majiang[0][id].color = cc.color(180,180,180)
            }
        }
        else if(isSelf)
        {
            var majiang = playNode.handMajiangs4D[outDir]
            for(var id = 0; id<majiang[0].length;id++)
            {
                majiang[0][id].color = cc.color(255,255,255)
            }
        }

        for(var i=0;i<cmdBaseWorker.cbSendCardCount;i++)
        {
            var item = cmdBaseWorker.sendCardArray[i]
            //牌Ï
            var heapMajiangsDir = tableData.getShowChairIdWithServerChairId(item.wHeapDir)  
            //majiangFactory.deleteHeapMajiangs(playNode.heapMajiangs4D[heapMajiangsDir], [item.wHeapPos])
            //手牌
            if(item.cbCardData == SEND_DISCARD_CARD_DATA)//丢弃牌
                continue
            var idx = isSelf?item.cbCardData:0
            majiangFactory.addHandMajiang(playNode.handMajiangs4D[takeDir], takeDir, idx, playNode.handGroupNode4D[takeDir], playNode.weaveMajiangs4D[takeDir].length)
        }

        /////摸到麻将时有可能出现杠听胡补花
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
        {
            playNode.ZhuDongAction = true
            playNode.showActionBtns(sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
        }
        // else if (isSelf && sortedActions.length == 0)
        // {
        //     var a = cc.sequence(cc.delayTime(playNode.DELAYTIME), cc.callFunc(function(){
        //         //playNode.Auto_Card(cmdBaseWorker.wProvideUser)
        //         }
        //     ))
        //     playNode.node.runAction(a)
        //     playNode.ZhuDongAction = false
        // }

    },
    onCMD_OperateResult:function() 
    {
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
            majiangFactory.onActionResult(cmdBaseWorker.cbOperateCode, idxs, operateUser, provideUser,
                majiangs4W4D, playNode.handGroupNode4D)

            playNode.playAction(cmdBaseWorker.cbOperateCode, operateUser)
        }

        ///动作后动作 要把wProvideUser cbProvideCardData 归零
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
        {
            cmdBaseWorker.wProvideUser    = cmdBaseWorker.wOperateUser
            //cmdBaseWorker.cbProvideCardData  = INVALID_CARD_DATA
            playNode.showActionBtns(sortedActions)  //吃碰后杠 idx不确定 需要searchGangIdxs
        }
        // else if (sortedActions.length==0)
        // {
        //     var isSelf = tableData.getUserWithChairId(cmdBaseWorker.wTakeCardUser).dwUserID == selfdwUserID
        //     if (!playNode.ZhuDongAction && isSelf)
        //     {
        //         var a = cc.sequence(cc.delayTime(playNode.DELAYTIME), cc.callFunc(function()
        //         {
        //             //playNode.Auto_Card(cmdBaseWorker.wOperateUser)
        //         }
        //         ))
        //         playNode.node.runAction(a)
        //         //playNode.ZhuDongAction = false
        //     }
        // }
        // else
        // {}
    },

    // Auto_Card:function(User)
    // {
    //     var isSelf = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
    //     if (isSelf && (cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[0]] || cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[1]]) && (!(cmdBaseWorker.ForbidUserAction[0] == User) || !(cmdBaseWorker.ForbidUserAction[1] == User)))
    //     {
    //         // var OutCard = getObjWithStructName('CMD_C_AutoOutCard')
    //         // OutCard.cbOutCardData = cmdBaseWorker.PreviousCard
    //         // OutCard.AUTO_OUT_CARD_USER = cmdBaseWorker.wCurrentUser
    //         // cmdBaseWorker.wCurrentUser = INVALID_WORD
    //         // socket.sendMessage(MDM_GF_GAME,SUB_C_AUTO_OUT_CARD,OutCard)
    //         cmdBaseWorker.wCurrentUser = INVALID_WORD
    //         var OutCard = getObjWithStructName('CMD_C_OutCard')
    //         OutCard.cbOutCardData = cmdBaseWorker.cbProvideCardData
    //         //OutCard.AUTO_OUT_CARD_USER = cmdBaseWorker.wCurrentUser
    //         socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
    //     }
    // },

    onCMD_GameEnd:function() 
    {
        playNode.gamesetNode.setVisible(false)

        playNode.isPlaying = false

        

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
                    majiangFactory.hideCurrentDiscardMj()
                    playNode._showSprsOnGameEnd()
                }), 
                cc.delayTime(1), //看牌5秒
                cc.callFunc(function()
                {   
                    headIconPop.kickUserOnGameEnd()
                    for(var i=0;i<GAME_PLAYER;i++)
                    {
                        tableNode.setBankerIcon(i, false)
                    }

                    var continueCall = function()
                    {
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
            var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
            record.szTableKey = tableKey
            socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
        }        
    },
    ///////////////cmdEvent end//////////

    ////////////sendCardsAction start//////////
    _getHandMajiangsGroupNode:function()
    {
        var handMajiangs = playNode.handMajiangs4D

        var touchEndCall = function(direction, majiang)
        {
            //var isAllowOut = majiang.cardData != cmdBaseWorker.cbMagicCardData && cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
            var isAllowOut = !(!MAGIC_CARD_ALLOWOUT && !cmdBaseWorker.isMagicCard(majiang.cardData, cmdBaseWorker.cbMagicCardData) ) && cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
            for (var i = 0; i < cmdBaseWorker.ActionChiCardDate.length; i++)
            {
                if (cmdBaseWorker.ActionChiCardDate[i] != INVALID_CARD_DATA && cmdBaseWorker.ActionChiCardDate[i] == majiang.cardData)
                {
                    isAllowOut = false
                    break
                }
            }

            

            if(isAllowOut)
            {
                cmdBaseWorker.wCurrentUser = INVALID_WORD

                var OutCard = getObjWithStructName('CMD_C_OutCard')
                OutCard.cbOutCardData = majiang.cardData

                socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
                playNode.hideActionBtns()
            }
        }

        var touchEndCalls = []
        if(tableData.getUserWithUserId(selfdwUserID).wChairID == tableData.getServerChairIdWithShowChairId(0))
        {
            touchEndCalls[0] = function(majiang)
            {
                //if (majiang.cardData == cmdBaseWorker.cbProvideCardData)
               // {
                    touchEndCall(0, majiang)
                    //console.log(99999999999)
                //}
            }
        }

        //playNode.handGroupNode4D = majiangFactory.getHandGroupNodes(handMajiangs, touchEndCalls)
        playNode.handGroupNode4D = playNode.getHandGroupNodes(handMajiangs, touchEndCalls)
    },

    // getHandMajiangsArray:function(handCardDatasArray, isLookon)
    // {
    //     var handMajiangs4D = []
    //     for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
    //     {
    //         var direction = showChairid
    //         var oldHandCardDatas = handCardDatasArray[direction][0]
    //         var oldHandMjs = []
    //         for(var j=0;j<oldHandCardDatas.length;j++)
    //         {
    //             var cardData = isLookon?0:oldHandCardDatas[j]
    //             var majiang = majiangFactory.getOne(cardData, 0, direction)
    //             var isSelf = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID

    //             if (isSelf&&(cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[0]] || cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[1]]) 
    //                 && (!(cmdBaseWorker.ForbidUserAction[0] == cmdBaseWorker.wCurrentUser) || !(cmdBaseWorker.ForbidUserAction[1] == cmdBaseWorker.wCurrentUser))
    //                 &&majiang.cardData!=cmdBaseWorker.cbProvideCardData)
    //                 majiang.setColor(cc.color(180,180,180))
    //             majiang.idxInHandMajiangs = j
    //             var pos = majiangFactory.getHandMajiangPosAndTag(oldHandCardDatas.length, majiang.idxInHandMajiangs, direction, false)
    //             majiang.x = pos.x
    //             majiang.y = pos.y
    //             majiang.setLocalZOrder(pos.zOrder)
    //     //         if(direction==1)
    //             //console.log(222222,pos)
        
    //             oldHandMjs[j] = majiang
    //         }

    //         var newGetMj = null
    //         var newGetCardData = handCardDatasArray[direction][1]
    //         if(typeof(newGetCardData) == 'number')          
    //         {
    //             newGetCardData = isLookon?0:newGetCardData
    //             newGetMj = majiangFactory.getOne(newGetCardData, 0, direction)
    //             var pos = majiangFactory.getHandMajiangPosAndTag(oldHandCardDatas.length, null, direction, true)
    //             newGetMj.x = pos.x
    //             newGetMj.y = pos.y
    //             newGetMj.setLocalZOrder(pos.zOrder)
    //             newGetMj.idxInHandMajiangs = null
    //             var isSelf = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
    //             if (isSelf&&(cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[0]] || cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[1]]) 
    //                 && (!(cmdBaseWorker.ForbidUserAction[0] == cmdBaseWorker.wCurrentUser) || !(cmdBaseWorker.ForbidUserAction[1] == cmdBaseWorker.wCurrentUser))
    //                 &&newGetMj.cardData!=cmdBaseWorker.cbProvideCardData)
    //                 newGetMj.setColor(cc.color(180,180,180))
    //         }  
    //         handMajiangs4D[direction] = [oldHandMjs, newGetMj]
    //     }

    //     return handMajiangs4D
    // },
    getHandGroupNodes:function(handMajiangs4D, outCardCalls)
    {
        var handGroupNodes = []
        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
        {
            var direction = showChairid
            var majiangs = handMajiangs4D[direction]

            //////
            var node = new cc.Node()
            node.ignoreAnchorPointForPosition(false)
            switch(direction) //越大的牌靠newMj越近
            {
                case 0://down
                {
                    node.setAnchorPoint( cc.p(1, 0.5) )
                    break
                }
                case 1://right
                {
                    node.setAnchorPoint( cc.p(0.5, 1) )
                    break
                }
                case 2://up
                {
                    node.setAnchorPoint( cc.p(0, 0.5) )
                    break
                }
                case 3://left
                {
                    node.setAnchorPoint( cc.p(0.5, 0) )
                    break
                }
            }

            var oldHandMjs = majiangs[0]
            var newGetMj = majiangs[1] 

            var size = majiangFactory._getHandGroupNodeSize(direction, oldHandMjs.length)
            node.width = size.width
            node.height = size.height

            for(var j=0;j<oldHandMjs.length;j++)
            {
                var mj = oldHandMjs[j]
                // var tag = direction==1?oldHandMjs.length-j:j
                node.addChild(mj)//, tag)
            }

            if(newGetMj)
            {
                // var tag = direction==3?100:0
                node.addChild(newGetMj)//, tag)
            }
            //////////touch
            var outCardCall = outCardCalls[direction]
            if(outCardCall) 
            {
                //var listener = majiangFactory._gethandGroupNodeListener(majiangs, node, direction, outCardCall)
                var listener = playNode._gethandGroupNodeListener(majiangs, node, direction, outCardCall)
                cc.eventManager.addListener(listener, node)
            }

            handGroupNodes[direction] = node
        }

        return handGroupNodes
    },
    _getHandGroupNodeSize:function(direction, oldHandMjCount)
    {
        var size = {}
        switch(direction) //越大的牌靠newMj越近
        {
            case 0://down
            {
                size.width =  majiangFactory.downHandIntervalX*majiangFactory.scale_upDown*(oldHandMjCount+1) + majiangFactory.downMjAndNewMjInterval*majiangFactory.scale_upDown 
                size.height = majiangFactory.down_handHeight*majiangFactory.scale_upDown
                break
            }
            case 1://right
            {
                size.width = majiangFactory.right_handWidth*majiangFactory.scale_rightLeft
                size.height = majiangFactory.rightHandIntervalY*majiangFactory.scale_rightLeft*(oldHandMjCount+1) + majiangFactory.rightMjAndNewMjInterval*majiangFactory.scale_rightLeft
                break
            }
            case 2://up
            {
                var w = majiangFactory.upMjAndNewMjInterval*majiangFactory.scale_upDown//*majiangFactory.down_handWidth/majiangFactory.up_handWidth
                size.width = majiangFactory.upHandIntervalX*majiangFactory.scale_upDown*(oldHandMjCount+1) + w
                size.height = majiangFactory.up_handHeight*majiangFactory.scale_upDown
                break
            }
            case 3://left
            {
                size.width = majiangFactory.left_handWidth*majiangFactory.scale_rightLeft
                size.height = majiangFactory.leftHandIntervalY*majiangFactory.scale_rightLeft*(oldHandMjCount+1) + majiangFactory.leftMjAndNewMjInterval*majiangFactory.scale_rightLeft
                break
            }
        }
        return size
    },
    _gethandGroupNodeListener:function(majiangs, handGroupNode, direction, outCardCall)
    {
        if(direction!=0)//only0 123todo
            return 

        var currentMajiangTipsNode = new cc.Node()
        var bg = new cc.Sprite('#mf_currentMjBg.png')
        bg.setScale(majiangFactory.scale_upDown)
        currentMajiangTipsNode.addChild(bg)

        var mj = majiangFactory.getOne(1, 0, 0, true, true)
        mj.setScale(majiangFactory.scale_upDown * 1)
        currentMajiangTipsNode.addChild(mj)

        currentMajiangTipsNode.x = - 1000
        currentMajiangTipsNode.y = handGroupNode.height + bg.height*0.5 + 40

        handGroupNode.addChild(currentMajiangTipsNode)

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
                managerAudio.playEffect(majiangFactory.resp + 'selectcard.mp3')
            }
        }

        switch(1)
        {
            case 1:
            {
                var currentMajiang = null
                var touchedMjNum = 0
                var soundId = null
                var onTouch = function(locationX)
                {   
                    var touchedMj = touchPosX2TouchedMj(locationX)
                    if(!touchedMj)
                        return 
                    
                    if(currentMajiang)
                        currentMajiang.y = mjHeight*0.5
                
                    if(!currentMajiang || currentMajiang!=touchedMj) 
                    {
                        touchedMjNum++
                        if(touchedMjNum>1)
                            playSelectEffect()
                        // managerAudio.stopEffect(soundId)
                        //soundId = managerAudio.playEffect(majiangFactory.resp + 'selectcard.mp3')
                    }

                    currentMajiang = touchedMj

                    currentMajiangTipsNode.x = currentMajiang.x
                    mj.getChildByTag(101).setSpriteFrame('mf_' + currentMajiang.cardData + '.png') 

                    currentMajiang.y = mjHeight*0.5 + 10
                       
                    // majiangFactory.currentDiscardMjNode.setVisible(false)
                    var event = new cc.EventCustom("handMajiangTouched")
                    event.setUserData(currentMajiang.cardData)
                    cc.eventManager.dispatchEvent(event)            
                }

                var listener = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function (touch, event) {
                        //console.log("case1")
                        var isopen = true
                        var isSelf = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
                        var self = tableData.getUserWithUserId(selfdwUserID)
                        var isopen = ( (self.wChairID==cmdBaseWorker.ForbidUserAction[0] || !cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[0]]) && !(cmdBaseWorker.ForbidUserAction[0]==cmdBaseWorker.ForbidUserAction[1]?false:cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[1]]) )

                        var target = event.getCurrentTarget()

                        var locationInNode = target.convertToNodeSpace(touch.getLocation())
                        var s = target.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height)
                        if (!isopen&&locationInNode.x<(majiangs[0].length*65*majiangFactory.scale_upDown) && isSelf)
                            return false
                        if (cc.rectContainsPoint(rect, locationInNode)) {
                            onTouch(locationInNode.x<0?0:locationInNode.x)
                            return true
                        }
                        return false
                    },
                    onTouchMoved: function (touch, event) {
                        var target = event.getCurrentTarget()
                        var locationInNode = target.convertToNodeSpace(touch.getLocation())
                        var s = target.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height)

                        var isopen = true
                        var isSelf = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
                        var self = tableData.getUserWithUserId(selfdwUserID)
                        var isopen = ( (self.wChairID==cmdBaseWorker.ForbidUserAction[0] || !cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[0]]) && !(cmdBaseWorker.ForbidUserAction[0]==cmdBaseWorker.ForbidUserAction[1]?false:cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[1]]) )
                        if (!isopen&&locationInNode.x<(majiangs[0].length*65*majiangFactory.scale_upDown) && isSelf)
                            return false
                        if (cc.rectContainsPoint(rect, locationInNode)) {
                            onTouch(locationInNode.x<0?0:locationInNode.x)
                        }
                    },
                    onTouchEnded: function (touch, event) {
                        var target = event.getCurrentTarget()

                        var locationInNode = target.convertToNodeSpace(touch.getLocation())
                        var s = target.getContentSize();
                        var rect = cc.rect(0, 0, s.width, s.height)
                        if (cc.rectContainsPoint(rect, locationInNode)) {
                            if(currentMajiang && touchedMjNum == 1)
                                outCardCall?outCardCall(currentMajiang):''
                        }    

                        if(currentMajiang)
                        {
                            currentMajiang.y = mjHeight*0.5
                            currentMajiang = null
                        }
                        currentMajiangTipsNode.x = -1000

                        // majiangFactory.currentDiscardMjNode.setVisible(true)
                        var event = new cc.EventCustom("handMajiangTouchEnd")
                        cc.eventManager.dispatchEvent(event)

                        touchedMjNum = 0
                    }
                })
                break
            }
        }

        return listener
    },
    getHandMajiangsArray:function(handCardDatasArray, isLookon)
    {
        //var isSelf = tableData.getUserWithChairId(cmdBaseWorker.wTakeCardUser).dwUserID == selfdwUserID
        var isSelf = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
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
                var isSelf = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID

                //杭州麻将    重连后将不能出的的牌变色
                var self = tableData.getUserWithUserId(selfdwUserID)
                var change = ( (self.wChairID==cmdBaseWorker.ForbidUserAction[0] || !cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[0]]) && !(cmdBaseWorker.ForbidUserAction[0]==cmdBaseWorker.ForbidUserAction[1]?false:cmdBaseWorker.MagicAction[cmdBaseWorker.ForbidUserAction[1]]) )
                if (change == false && isSelf)
                    majiang.setColor(cc.color(180,180,180))
                majiang.idxInHandMajiangs = j
                var pos = majiangFactory.getHandMajiangPosAndTag(oldHandCardDatas.length, majiang.idxInHandMajiangs, direction, false)
                majiang.x = pos.x
                majiang.y = pos.y
                majiang.setLocalZOrder(pos.zOrder)
        //         if(direction==1)
                //console.log(222222,pos)
        
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
                newGetMj.setLocalZOrder(pos.zOrder)
                newGetMj.idxInHandMajiangs = null

                var self = tableData.getUserWithUserId(selfdwUserID)
                // var change = ( (self.wChairID==cmdBaseWorker.bIsForbidActionUser[0] || !cmdBaseWorker.bIsOutMagic[cmdBaseWorker.bIsForbidActionUser[0]]) && !(cmdBaseWorker.bIsForbidActionUser[0]==cmdBaseWorker.bIsForbidActionUser[1]?false:cmdBaseWorker.bIsOutMagic[cmdBaseWorker.bIsForbidActionUser[1]]) )
                // if (change == false && isSelf)
                //     newGetMj.setColor(cc.color(180,180,180))
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
        //playNode.handMajiangs4D = majiangFactory.getHandMajiangsArray(handIdxsArray, tableData.getUserWithUserId(selfdwUserID).wChairID == INVALID_WORD)
        playNode.handMajiangs4D = playNode.getHandMajiangsArray(handIdxsArray, tableData.getUserWithUserId(selfdwUserID).wChairID == INVALID_WORD)
        playNode.discardMajiangs4D = majiangFactory.getDiscardMajiangsArray(discardIdxsArray)

        for(direction=0;direction<GAME_PLAYER;direction++)
        {
            var weaveItems = weaveItemArray[direction]
            for(var groupIdx=0;groupIdx<weaveItems.length;groupIdx++)
            {
                var weaveItem = weaveItems[groupIdx]
                if(weaveItem.cbWeaveKind == WIK_NULL)
                    continue
                weaveItem.cbCardDatas = weaveItem.cbCardData

            }
        }
        playNode.weaveMajiangs4D = majiangFactory.getWeaveMajiangsArray(weaveItemArray, selfDir, true)

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
            //console.log(22222222222,playNode.handGroupNode4D[direction])
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
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithChairId(i)
                if(!user) continue

            //user.userNodeInsetChair.currentRoundNode.discardMajiangsNode.removeAllChildren()
        }

        playNode.timerNode.setVisible(false)


        var isQiangGang = cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner] & CHR_QiangGang
        if(isQiangGang) //抢杠需要gang2Peng
        {
            var direction = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser)
            majiangFactory.gang2Peng(cmdBaseWorker.cbProvideCardData , playNode.weaveMajiangs4D[direction] )
        }

        //摊牌
        var displayHandIdxsArray = []
        var cbProvideCardData = cmdBaseWorker.cbProvideCardData
        for(var showChairid=0;showChairid<4;showChairid++)
        {
            var direction = showChairid
            var chairid = tableData.getServerChairIdWithShowChairId(showChairid)

            displayHandIdxsArray[direction] = [cmdBaseWorker.cbHandCardData[chairid].slice(0, cmdBaseWorker.cbHandCardCount[chairid]), null]

            if(cmdBaseWorker.wWinner == chairid)
            {   
                var displayHandIdxs = displayHandIdxsArray[direction]
                for(var j=0;j<displayHandIdxs[0].length;j++)
                {
                    console.log(displayHandIdxs[0].length)
                    if(displayHandIdxs[0][j] == cbProvideCardData)
                    {
                       displayHandIdxs[1] = displayHandIdxs[0].splice(j, 1)[0]
                       break
                    }
                }
            }
        }

        playNode.handMajiangs4D = majiangFactory.getDisplayHandMajiangsArray(displayHandIdxsArray)
  
        for(var showChairid=0;showChairid<4;showChairid++)
        {
            var direction = showChairid
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

    // popGameEnd:function(continueCall, userData_gameEnd)
    // {

    //     var control = {}
    //     control.continueCall = function()
    //     {
    //         continueCall()
    //         node.removeFromParent()
    //     }
    //     var node  = managerRes.loadCCB(resp.gameEndPopCCB, control)

    //     playNode.gameEndControl = control

    //     console.log(2222222,cmdBaseWorker.endType)
    //     //control.gendTitle.setSpriteFrame('gendTitle'+cmdBaseWorker.endType + '.png')
    //     control.gendTitle.setSpriteFrame('gendTitle'+cmdBaseWorker.endType + '.png')
    //     for(var showChairid=0;showChairid<4;showChairid++)
    //     {
    //         var direction = showChairid
    //         var wChairID = tableData.getServerChairIdWithShowChairId(showChairid)

    //         var gendBar = control['gendBar'+wChairID]

    //         //头像
    //         var headIcon = new cc.Sprite('#headIcon.png')
    //         var hnode = getRectNodeWithSpr(headIcon)
    //         hnode.x = 55
    //         hnode.y = 50
    //         var url = userData_gameEnd[wChairID].szHeadImageUrlPath
    //         if(url)
    //         { 
    //             (function(headIcon, url)
    //             {
    //                 cc.loader.loadImg(url, {isCrossOrigin : false}, function(err,img){
    //                         var texture2d = new cc.Texture2D()
    //                         texture2d.initWithElement(img)
    //                         texture2d.handleLoadedTexture()

    //                         var frame = new cc.SpriteFrame(texture2d, cc.rect(0, 0, texture2d.getContentSize().width, texture2d.getContentSize().height))
    //                         headIcon.setSpriteFrame(frame)
    //                 })
    //             }(headIcon, url))
    //         }

    //         var userName = getLabel(14, 90, 2)
    //         userName.setFontFillColor( cc.color(255, 255, 255, 255) )
    //         userName.x = 0
    //         userName.y = 52
    //         userName.setStringNew(userData_gameEnd[wChairID].szNickName)
    //         hnode.addChild(userName)   

    //         gendBar.addChild(hnode)

    //         var dir = (wChairID-cmdBaseWorker.wBankerUser+GAME_PLAYER)%4
    //         var dirSpr = new cc.Sprite('#gendDir' + dir + '.png')
    //         dirSpr.x = 32-13
    //         dirSpr.y = 32-13
    //         hnode.addChild(dirSpr)   

    //         if(wChairID == cmdBaseWorker.wBankerUser)
    //         {
    //             var bankerSpr = new cc.Sprite('#gendIcon_banker.png')
    //             bankerSpr.x = -32
    //             bankerSpr.y = 32
    //             hnode.addChild(bankerSpr)   
    //         }


    //         //胡型
    //         var resultTTF = cc.LabelTTF.create('', "Helvetica", 16)
    //         resultTTF.setFontFillColor( cc.color(244, 230, 159) )
    //         var chrStr = ''
    //         for (var i = 0; i < map_mask2Name.length; i++) 
    //         {
    //             var chr_type = window[ map_mask2Name[i][0] ] 
    //             if (cmdBaseWorker.dwChiHuRight[wChairID] & chr_type)
    //             {
    //                 // if(chrStr == '')
    //                 //     chrStr += '胡型：'
    //                 chrStr += map_mask2Name[i][1] + ' ';
    //             }
    //         }
    //         resultTTF.setString(chrStr)
    //         resultTTF.anchorX = 0
    //         resultTTF.x = 102
    //         resultTTF.y = 25
    //         gendBar.addChild(resultTTF)
       


    //         //显示麻将
    //         var majiangsNode = new cc.Node()
    //         majiangsNode.scale = 0.65
    //         majiangsNode.x = 100
    //         majiangsNode.y = gendBar.height - 12 - 0.5*(majiangFactory.down_handHeight*majiangFactory.scale_upDown*majiangsNode.scale)
    //         gendBar.addChild(majiangsNode)

    //         //吃碰杠的牌
    //         var weaveItems = cmdBaseWorker.WeaveItemArray[wChairID]
    //         var groupLen = 0 
    //         for(var groupIdx=0;groupIdx<weaveItems.length;groupIdx++)
    //         {
    //             var weaveItem = weaveItems[groupIdx]
    //             if(weaveItem.cbWeaveKind == WIK_NULL)
    //                 continue
    //             groupLen += 1
    //             if(weaveItem.cbWeaveKind!=WIK_GANG)
    //                 weaveItem.cbCardDatas = weaveItem.cbCardData.slice(0, 3)

    //             weaveItem.provideDirection = 0//这样就不显示箭头了
    //             var majiangsOneGroup = majiangFactory.weaveItem2Majiangs(groupIdx, 0, weaveItem, true, true)
                
    //             for(var idxInGroup=0;idxInGroup<majiangsOneGroup.length;idxInGroup++)
    //             {
    //                 var mj = majiangsOneGroup[idxInGroup]
    //                 majiangsNode.addChild(mj)
    //             }
    //         }
    //         var widthOneGroup = majiangFactory.scale_upDown*majiangFactory.downHandIntervalX*3
    //         var startPos = groupLen*widthOneGroup
    //         //手牌
    //         var handCardDatas = cmdBaseWorker.cbHandCardData[wChairID]
    //         var hasLightProvideMj = false
    //         for(var j=0;j<handCardDatas.length;j++)
    //         {
    //             var cardData = handCardDatas[j]
    //             var majiang = majiangFactory.getOne(cardData, 2, 0)
    //             majiang.idxInHandMajiangs = j
    //             var pos = majiangFactory.getDisplayHandMajiangPosAndTagAndTag(handCardDatas.length, majiang.idxInHandMajiangs, 0, false)
    //             majiang.x = startPos + pos.x
    //             majiang.y = 0//pos.y
    //             majiang.setScale(pos.scale)
    //             // majiang.setLocalZOrder(pos.zOrder)

    //             majiangsNode.addChild(majiang)

    //             if(!hasLightProvideMj && cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU && majiang.cardData == cmdBaseWorker.cbProvideCardData)
    //             {
    //                 majiang.color = cc.color(188, 255, 188)
    //                 hasLightProvideMj = true 
    //             }
    //         }

    //         ///花牌
    //         var flowersNode = new cc.Node()
    //         flowersNode.scale = 0.9
    //         flowersNode.x = 100
    //         flowersNode.y = gendBar.height - 12 - 0.5*(majiangFactory.down_handHeight*majiangFactory.scale_upDown*majiangsNode.scale)
    //         gendBar.addChild(flowersNode)

    //         var flowerCardDatas = cmdBaseWorker.cbPlayerFlowerCardData[wChairID]
    //         for(var j=0;j<flowerCardDatas.length;j++)
    //         {
    //             var cardData = flowerCardDatas[j]

    //             var majiang = majiangFactory.getOne(cardData, 4, 0)
    //             var pos = majiangFactory.getFlowerMajiangPosAndTag(j, 0)
    //             majiang.x = pos.x
    //             majiang.y = 5-0.5*(majiangFactory.down_handHeight*majiangFactory.scale_upDown*majiangsNode.scale)-0.5*majiang.height*majiang.scale
    //             // majiang.setLocalZOrder(pos.zOrder)
    //             flowersNode.addChild(majiang)
    //         }


    //         ///////////
    //         if(wChairID==cmdBaseWorker.wExitUser)
    //             control['winflag'+wChairID].setSpriteFrame('gendFlag0.png') 
    //         else if(cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU)
    //             control['winflag'+wChairID].setSpriteFrame('gendFlag1.png') 
    //         else if(wChairID==cmdBaseWorker.wProvideUser)
    //             control['winflag'+wChairID].setSpriteFrame('gendFlag2.png') 
    //         else
    //             control['winflag'+wChairID].setSpriteFrame('empty.png') 
  
    //         control['taiTTF'+wChairID].setString((cmdBaseWorker.lGameScore[wChairID]>0?'+':'') + cmdBaseWorker.lGameScore[wChairID]) 
    //         control['fenTTF'+wChairID].setString((cmdBaseWorker.lGameScore[wChairID]>0?'+':'') + cmdBaseWorker.lGameScore[wChairID]) 

    //     }
       
    //     mainScene.top.addChild(node) 
    // },

    popGameEnd:function(continueCall, szNickName_gameEnd)
    {
        var cbWinFlag = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if(cmdBaseWorker.endType==0 && i==cmdBaseWorker.wExitUser)
                cbWinFlag[i] = 6
            else 

            if((cmdBaseWorker.endType==2||cmdBaseWorker.endType==3) && cmdBaseWorker.wWinner == i)
                cbWinFlag[i] = 7

            if(cmdBaseWorker.endType==3 && cmdBaseWorker.wProvideUser==i)
                cbWinFlag[i] = 8
        }

        var control = {}
        control.continueCall = function()
        {
            continueCall()
            node.removeFromParent()
        }
        var node  = cc.BuilderReader.load(resp.gameEndPopCCB, control)

        playNode.gameEndControl = control

        // control.resultTTF.setString( args.msg )
        if(cmdBaseWorker.endType == 1 || cmdBaseWorker.endType == 0)
        {
            if(cmdBaseWorker.endType == 1)
                control.endType.setSpriteFrame('gendType'+cmdBaseWorker.endType + '.png')
            else
                control.endType.setVisible(false)

            control.resultTTF.setVisible(false)
        }
        else
        {
            control.resultTTF.setVisible(true)
            var chrStr = "胡型："
            for (var i = 0; i < map_mask2Name.length; i++) 
            {
                var chr_type = window[ map_mask2Name[i][0] ] 
                if (cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner] & chr_type)
                {
                    chrStr += map_mask2Name[i][1] + ' ';
                }
            }
            if (cmdBaseWorker.IsFeng != INVALID_CARD_DATA)
                chrStr += "风牌*️" + cmdBaseWorker.IsFeng + ' '
            if (cmdBaseWorker.GangNum != 0)
                chrStr += "杠*" + cmdBaseWorker.GangNum + ' '
            control.resultTTF.setString(chrStr)
            control.endType.setVisible(false)
        }

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
            control['name'+i].setString(szNickName_gameEnd[chairid].szNickName)
            control['banker'+i].setVisible(cmdBaseWorker.wBankerUser == chairid)
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
        }

        node.setPosition( cc.p( mainScene.uiTop.getContentSize().width * 0.5, mainScene.uiTop.getContentSize().height * 0.5) )
        mainScene.top.addChild(node) 
    },
    popGameEnd2:function(continueCall, szNickName_gameEnd)
    {
        var cbWinFlag = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            if(cmdBaseWorker.endType==0 && i==cmdBaseWorker.wExitUser)
                cbWinFlag[i] = 6
            else 

            if((cmdBaseWorker.endType==2||cmdBaseWorker.endType==3) && cmdBaseWorker.wWinner == i)
                cbWinFlag[i] = 7

            if(cmdBaseWorker.endType==3 && cmdBaseWorker.wProvideUser==i)
                cbWinFlag[i] = 8
        }

        var control = {}
        control.continueCall = function()
        {
            continueCall()
            node.removeFromParent()
        }
        var node  = cc.BuilderReader.load(resp.gameEndPopCCB, control)

        playNode.gameEndControl = control

        // control.resultTTF.setString( args.msg )
        if(cmdBaseWorker.endType == 1 || cmdBaseWorker.endType == 0)
        {
            if(cmdBaseWorker.endType == 1)
                control.endType.setSpriteFrame('gendType'+cmdBaseWorker.endType + '.png')
            else
                control.endType.setVisible(false)

            control.resultTTF.setVisible(false)
        }
        else
        {
            control.resultTTF.setVisible(true)
            var chrStr = "胡型："
            for (var i = 0; i < map_mask2Name.length; i++) 
            {
                var chr_type = window[ map_mask2Name[i][0] ] 
                if (cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner] & chr_type)
                {
                    chrStr += map_mask2Name[i][1] + ' ';
                }
            }
            control.resultTTF.setString(chrStr)
            control.endType.setVisible(false)
        }

        for(var i=0;i<GAME_PLAYER;i++)
        {

            var chairid = i
            if(typeof(cbWinFlag[chairid])!='undefined')
            {
                control['winflag'+chairid].setVisible(true)
                control['winflag'+chairid].setSpriteFrame('winFlag_' + cbWinFlag[chairid] + '.png') 
            }
            else
                control['winflag'+chairid].setVisible(false)
            
            var score = cmdBaseWorker.lGameScore[chairid]
            control['name'+chairid].setString(szNickName_gameEnd[chairid])
            control['banker'+chairid].setVisible(cmdBaseWorker.wBankerUser == chairid)
            if(score>0)
            {
                control['scoreTTF'+chairid].setString('+' + score)
                control['scoreTTF'+chairid].color = cc.color(255, 0, 0)
              //  control['scoreTTF'+chairid].setFontFillColor( cc.color(255, 0, 0, 255) )
                control['frame'+chairid].setSpriteFrame('gend5.png')
            }
            else
            {
                control['scoreTTF'+chairid].setString(score==0?'-'+score:score)
                control['scoreTTF'+chairid].color = cc.color(0, 255, 0)
                //control['scoreTTF'+chairid].setFontFillColor( cc.color(0, 255, 0, 255) )
                control['frame'+chairid].setSpriteFrame('gend6.png')

            }
        }

        //显示手牌
        // bool isQiangGang = cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner] & CHR_QiangGang
        for(var chairid=0;chairid<GAME_PLAYER;chairid++)
        {
            var cParent = control['resultNode'+chairid]
            var weaveItems = cmdBaseWorker.WeaveItemArray[chairid]

            var cardIndex = -1
            for(var i = 0;i<MAX_WEAVE;i++)
            {
                for(var j = 0;j<4;j++)
                {
                    if(weaveItems.length == 0)
                        continue

                    if (j == 0 ) cardIndex+=0.3
                    var cardIdx = weaveItems[i].cbCardData[j]
                    if (cardIdx>0) 
                    {
                        var aCard
                        if (weaveItems[i].cbPublicCard == false && j < 3)
                        {
                            aCard = new cc.Sprite('#down_discard0.png')
                            aCard.setScale(0.96)
                        }
                        else
                        {
                            aCard = majiangFactory.getOne(cardIdx, 1, 0, true)
                            aCard.setScale(1)
                        }
                        aCard.setLocalZOrder(-1)
                        if (weaveItems[i].cbWeaveKind == WIK_GANG && j == 3 ) 
                        {
                            cardIndex -=2;
                            aCard.x = 150+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                            aCard.y = 45 +10
                            cardIndex++
                        }
                        else
                        {
                            aCard.x = 150+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                            aCard.y = 45
                        }
                        
                        cParent.addChild(aCard)
                        cardIndex++;
                    }
                }
            }
            cardIndex += 0.2
            for(var i = 0;i<MAX_COUNT;i++)
            {
                var cardIdx = cmdBaseWorker.cbHandCardData[chairid][i]
                if (cardIdx>0 ) 
                {
                    var aCard = majiangFactory.getOne(cardIdx, 1, 0, true)
                    aCard.setScale(1)
                    aCard.setLocalZOrder(-1)
                    aCard.x = 150+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                    aCard.y = 45
                    if (cardIdx == cmdBaseWorker.cbProvideCard && cmdBaseWorker.cbHandCardCount[chairid] + cmdBaseWorker.cbWeaveCount[chairid]*3 == MAX_COUNT) 
                    {
                        cardIndex--
                        cmdBaseWorker.cbHandCardCount[chairid]--;
                        aCard.x = 150+( MAX_COUNT+1.5)*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                    }
                    cParent.addChild(aCard)
                    cardIndex++
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
    showLaizi:function()
    {
        for(var i=0;i<TURNOVER_COUNT_MAGIC;i++)
        {
            var idx = cmdBaseWorker.cbMagicCardData[0]//cmdBaseWorker.TurnoverCard[i].cbCardData
            if(idx == INVALID_CARD_DATA)
                continue
            var bg = new cc.Sprite('#bg_top.png')
            bg.x = 50*i + 25
            bg.y = - 30
            var mj = majiangFactory.getOne(idx, 1, 0, true)
            mj.x = 50*i + 25
            mj.y = - 30
            mj.setScaleX(bg.width/mj.width*0.8)
            mj.setScaleY(bg.height/mj.height*0.8)

            playNode.laiziNode.addChild(bg)
            playNode.laiziNode.addChild(mj)
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
                    if(cmdBaseWorker.isFlowerCard(handIdxs[j], cmdBaseWorker.cbFlowerCardData))
                        operateCards[operateCards.length] = handIdxs[j]

                } 
                cmdBaseWorker.sendMessage_replace(operateCards)
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
            btn.setPositionX(-130 * (sortedActions.length-1-i +1))
            if(btn==playNode.btn_chi)
                break
        }
    },
    playAnimationOfGameEnd:function(call)
    {
        var winner = cmdBaseWorker.wWinner
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
            if (cmdBaseWorker.type_hu != 0)
            {
                var type = 'hu' + cmdBaseWorker.type_hu
                playNode.playAnimationWithDirection('zim', tableData.getShowChairIdWithServerChairId(winner), call)
                playNode.playGenderEffect(type, tableData.getUserWithChairId(winner).cbGender)
            }
            else
            {
                playNode.playAnimationWithDirection('zim', tableData.getShowChairIdWithServerChairId(winner), call)
                playNode.playGenderEffect('zimo0', tableData.getUserWithChairId(winner).cbGender)
            }
        }
        else if(cmdBaseWorker.endType == 3)
        {
            playNode.playAnimationWithDirection('hu', tableData.getShowChairIdWithServerChairId(winner), call)
            playNode.playAnimationWithDirection('dp', tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser))
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
    },
    checkTableCards:function(des)
    {   
        //---------------------
        //注意：要换行的用逗号
        //---------------------
        
        var self = this

        var selfUser = tableData.getUserWithUserId(selfdwUserID)
        if( selfUser.cbUserStatus != US_PLAYING )
            return

        var bReset = des == 'onCMD_StatusPlay'
        var bStart = des == 'onCMD_GameStart'

        //上个记录
        if ( !this.tableCardInfo || bStart )
            this.tableCardInfo = {cardInfo:[], des:'', totalCount:0, leftCount:0, bServerError:false}
        
        var errorStr = '牌桌数据出错：tableId=' + tableData.tableID + ';selfdwUserID=' + selfdwUserID + '; selfChairId=' + selfUser.wChairID + ','
        if ( this.tableCardInfo.bServerError )
        {
            errorStr += '服务器数据异常, 不再处理'
            gameLog.log(errorStr)
            return
        }

        var cardInfo = []
        var pushCard = function(wChairID, cardData, src, groupIndex, index)
        {
            if ( cardData <= 0 )
                return

            var srcStr = src + '_' + wChairID + '_' + groupIndex
            if ( index )
                srcStr += '_' + index

            if ( cardInfo[cardData] )
            {
                cardInfo[cardData].count++
                cardInfo[cardData].src += ';' + srcStr
            }
            else
            {
                cardInfo[cardData] = { count:1, src:srcStr }
            }
        }

        var pushGroup = function(wChairID, group, src)
        {
            if ( !group )
                return

            for( var j = 0; j < group.length; j++ )
            {
                if ( !group[j] )
                    continue 

                if ( cc.isArray(group[j]) )
                {
                    for ( var n = 0; n < group[j].length; n++ )
                    {
                        pushCard(wChairID, group[j][n].cardData, src, j, n)
                        totalCount++
                    }

                    //杠牌多丢一张
                    if (group[j].cbWeaveKind && group[j].cbWeaveKind == WIK_GANG)
                        totalCount++
                }
                else
                {
                    pushCard(wChairID, group[j].cardData, src, j)
                    totalCount++
                }
            }
        }

        var totalCount = 0
        for ( var i = 0; i < GAME_PLAYER; i++ )
        {
            pushGroup(i, this.flowerMajiangs4D[i],  'flower')
            pushGroup(i, this.heapMajiangs4D[i],    'heap')
            pushGroup(i, this.discardMajiangs4D[i], 'discard')
            pushGroup(i, this.weaveMajiangs4D[i],   'weave')

            if ( this.handMajiangs4D[i] )
            {
                pushGroup(i, this.handMajiangs4D[i][0],     'hand[0]')
                pushGroup(i, [this.handMajiangs4D[i][1]],   'hand[1]')
            }
        }

        var bError = false
        errorStr += 'des=' + des + ';'

        for ( var i = 0; i < cardInfo.length; i++ )
        {
            if ( !cardInfo[i] )
                continue

            if ( cardInfo[i].count > 4 )
            {
                errorStr += '本次记录:cardData=' + i + '; count=' + cardInfo[i].count + '; src=' + cardInfo[i].src + ','
                if ( this.tableCardInfo.cardInfo[i] )
                    errorStr += '上次记录：des=' + this.tableCardInfo.des + '; count=' + this.tableCardInfo.cardInfo[i].count + '; src=' + this.tableCardInfo.cardInfo[i].src + ','

                bError = true
            }
        }

        //当前的杠不加，丢牌是发牌时候丢的
        if ( des == 'onCMD_OperateResult' && cmdBaseWorker.cbOperateCode == WIK_GANG )
            totalCount--

        if ( totalCount + cmdBaseWorker.cbLeftCardCount != MAX_REPERTORY )
        {
            errorStr += '牌数不对：totalCount=' + totalCount + ',leftCount=' + cmdBaseWorker.cbLeftCardCount + ',MAX_REPERTORY=' + MAX_REPERTORY + ','
            errorStr += '上次记录：totalCount=' + this.tableCardInfo.totalCount + ',leftCount=' + this.tableCardInfo.leftCount + ','

            bError = true
        }

        var sendLog = function(msg)
        {
            var writeCards = function(wChairID, group, groupName)
            {
                if ( !group )
                    return

                msg += groupName + '_' + wChairID + ':'
                for( var j = 0; j < group.length; j++ )
                {
                    if ( !group[j] )
                        continue 

                    if ( cc.isArray(group[j]) )
                    {
                        for ( var n = 0; n < group[j].length; n++ )
                        {
                            msg += group[j][n].cardData + ';'
                        }

                        msg += '  '
                    }
                    else
                    {
                        msg += group[j].cardData + ';'
                    }
                }

                msg += ','
            }

            for ( var i = 0; i < GAME_PLAYER; i++ )
            {
                writeCards(i, self.flowerMajiangs4D[i],  'flower')
                writeCards(i, self.heapMajiangs4D[i],    'heap')
                writeCards(i, self.discardMajiangs4D[i], 'discard')
                writeCards(i, self.weaveMajiangs4D[i],   'weave')

                if ( self.handMajiangs4D[i] )
                {
                    writeCards(i, self.handMajiangs4D[i][0],     'hand[0]')
                    writeCards(i, [self.handMajiangs4D[i][1]],   'hand[1]')
                }
            }

            msg += "本次记录的所有牌:," 
            for ( var i = 0; i < cardInfo.length; i++ )
            {
                if ( !cardInfo[i] )
                    continue

                msg += 'cardData=' + i + '; count=' + cardInfo[i].count + '; src=' + cardInfo[i].src + ','
            }

            msg += ",上次记录的所有牌:," 
            for ( var i = 0; i < self.tableCardInfo.cardInfo.length; i++ )
            {
                if ( !self.tableCardInfo.cardInfo[i] )
                    continue

                msg += 'cardData=' + i + '; count=' + self.tableCardInfo.cardInfo[i].count + '; src=' + self.tableCardInfo.cardInfo[i].src + ','
            }

            msg += "cmdBaseWorker = " 
            a = clone(cmdBaseWorker)
            for(var ii in a)
            {   
                if(typeof(a[ii]) == 'object')
                    a[ii] = xToString(a[ii], 300)
            }

            msg += xToString(a, null,['"\\\\u0000","\\\\u0000"', '\\\\u0000','null,null,'])

            gameLog.log(msg)

            playNode.checkTableIndex = playNode.checkTableIndex || 0
            sendLogToServer(msg + ',wtms' + KIND_ID + ' v2 ' + selfdwUserID + ' ' + playNode.checkTableIndex + ' wtms')
            playNode.checkTableIndex++
        }

        //数据出错，重置牌桌
        if ( bError )
        {
            if ( bReset )
            {
                errorStr += '服务器数据异常,'
                if ( !this.tableCardInfo.bServerError )
                    sendLog(errorStr)

                this.tableCardInfo.bServerError = true
            }
            
            //重置牌桌(服务器出错不再处理)
            if ( !this.tableCardInfo.bServerError )
            {
                sendLog(errorStr)

                socket.sendMessage(MDM_GF_GAME,888)
            }
        }

        this.tableCardInfo.cardInfo = cardInfo
        this.tableCardInfo.des = des
        this.tableCardInfo.totalCount = totalCount
        this.tableCardInfo.leftCount = cmdBaseWorker.cbLeftCardCount
    },
}

