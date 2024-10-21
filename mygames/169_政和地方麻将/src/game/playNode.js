
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

        majiangFactory.isPublicAnGang = false 
        majiangFactory.isShowHeap = true
        majiangFactory.heapCountOneRow = 26
        majiangFactory.init( playNode.mjTableNode, playNode.decorateMj )

        playNode.timer = majiangTimer4D.getTimer()
        playNode.timerNode.addChild(playNode.timer)
        playNode.timerNode.setScale( majiangFactory.scale_upDown*0.9 )
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
            eventName: "recordPlayStart",
            callback: function(event)
            {   
                majiangFactory.isShowHeap = false
                tableNode.waitStartTTF.setVisible(false)
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
            var btn = playNode.btn_gang

            var sendGang = function(sortedOperateIdxs)
            {
                cmdBaseWorker.sendMessage_gang(sortedOperateIdxs)
                playNode.hideActionBtns()
            }

            //var IIDD =tableData.getUserWithUserId(selfdwUserID).wChairID
            var isMinGang = cmdBaseWorker.wProvideUser != tableData.getUserWithUserId(selfdwUserID).wChairID
            if(isMinGang) 
            {  
                sendGang([cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData, cmdBaseWorker.cbProvideCardData])
            }
            else
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
        playNode.isPlaying = true

        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        playNode.showLaizi()
        if(cmdBaseWorker.cbLeftCardCount == 4)
            playNode.warningNode.visible = true   
        else       
            playNode.warningNode.visible = false

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
        if(cmdBaseWorker.wSelfActionUser != INVALID_WORD)
            playNode.timer.switchTimer([tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wSelfActionUser)])

        //11.10弃用
        if(cmdBaseWorker.cbFirstRound)
            playNode.timer.switchTimer([])
        //

        var self = tableData.getUserWithUserId(selfdwUserID)

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
                handIdxsArray[direction][0] = handIdxs.slice(0, handIdxs.length-1)
                handIdxsArray[direction][1] = handIdxs[handIdxs.length-1]
            }
            else
                handIdxsArray[direction][0] = handIdxs

            discardIdxsArray[direction] = cmdBaseWorker.cbDiscardCardData[i].slice(0, cmdBaseWorker.cbDiscardCount[i])
        }
        cmdBaseWorker.sortHandIdxs(handIdxsArray[0][0]) 
        // get heapIdxsArray
        var heapIdxsArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)
        
        playNode.sendCardsAction(handIdxsArray, discardIdxsArray, weaveItemArray, heapIdxsArray, cmdBaseWorker.cbPlayerFlowerCardData) 
    
        playNode.addWarningAction()//吉安
        playNode.setEnabledCardColorAfterEat()
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
        playNode.gameSelectNode.setVisible(false)
        playNode.warningNode.visible = false

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
            cmdBaseWorker.sortHandIdxs(handIdxsArray[direction][0]) 
        }
        //cmdBaseWorker.sortHandIdxs(handIdxsArray[0][0]) 
        //get heapIdxsArray 
        var heapIdxsArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)       
       
        playNode.sendCardsAction(handIdxsArray, [[],[],[],[]], [[],[],[],[]], heapIdxsArray, []) 

        playNode.setCurrentRoundNodesVisible(false)
        playNode.actionBtns.setVisible(false)
        if(!isRecordScene)
            managerTouch.closeTouch() //避免在不知道牌的情况下 把牌打出去

        //managerTouch.closeTouch() //避免在不知道牌的情况下 把牌打出去
        //提前保存可能被破坏的数据  掷骰子是庄家出牌破坏数据 因为可能庄家筛子先出完
        var bankerShowChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser)
        
        var map = [0,0,1,2,3,1,1,2,3,3,1,2,3]
        var takerChairid = (cmdBaseWorker.wBankerUser + 
            map[ cmdBaseWorker.cbSiceCount[0]+cmdBaseWorker.cbSiceCount[1] ])%GAME_PLAYER
        var takerShowChairid = tableData.getShowChairIdWithServerChairId(takerChairid)

        function gameStart()
        {
            playNode.showLaizi()
            playNode.timer.initFenwei( bankerShowChairid )
            playNode.timerNode.setVisible(true)

            playNode.setCurrentRoundNodesVisible(true)
            playNode.actionBtns.setVisible(true)
            managerTouch.openTouch()

            playNode.removeWarningAction()
        }

        function bankerPlayDice()
        {
            tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
            playNode.playDiceOneDirection(gameStart, cmdBaseWorker.cbSiceCount[2], 
                cmdBaseWorker.cbSiceCount[3], bankerShowChairid)
        }

        function takePlayDice()
        {
            tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
            playNode.playDiceOneDirection(gameStart, cmdBaseWorker.cbSiceCount[2], 
                cmdBaseWorker.cbSiceCount[3], takerShowChairid)
        }

        if(cmdBaseWorker.bIsRandBanker)
            playNode.playDiceForRandBanker(bankerPlayDice, bankerShowChairid)
        else
            bankerPlayDice()

    },
    onCMD_OutCard:function() 
    {
        var outUser = tableData.getUserWithChairId(cmdBaseWorker.wOutCardUser)
        var outDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)  
        var outIdx = cmdBaseWorker.cbOutCardData

        if(playNode.warningNode.visible == true){
            playNode.warningNode.visible = false
            if(playNode.warningQYSNode.visible == true)
            {
                playNode.warningNode.y -= 20
                playNode.warningQYSNode.y += 20
                playNode.warningNode.setScale(1)
                playNode.warningQYSNode.setScale(1)
            }
        }

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

        majiangFactory.addDiscardMajiangs(playNode.discardMajiangs4D[outDir], outDir,
            outIdx, outUser.userNodeInsetChair.currentRoundNode.discardMajiangsNode)

        playNode.setCurrentDiscardMj(outIdx, outDir)

        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(sortedActions)
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
            //手牌
            if(item.cbCardData == SEND_DISCARD_CARD_DATA)//丢弃牌
                continue
            var idx = (isSelf || isRecordScene)?item.cbCardData:0
            majiangFactory.addHandMajiang(playNode.handMajiangs4D[takeDir], takeDir, idx, playNode.handGroupNode4D[takeDir], playNode.weaveMajiangs4D[takeDir].length)
            if(playNode.handMajiangs4D[0][1])
                playNode.handMajiangs4D[0][1].x -= 5
        }
        playNode.timer.switchTimer([tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTakeCardUser)])
         //11.10弃用
        if(cmdBaseWorker.cbFirstRound)
            playNode.timer.switchTimer([])
       
        if(cmdBaseWorker.cbLeftCardCount == 4){
            playNode.warningNode.visible = true
            if(playNode.warningQYSNode.visible == true)
            {
                playNode.warningNode.y += 20
                playNode.warningQYSNode.y -= 20
                playNode.warningNode.setScale(0.8)
                playNode.warningQYSNode.setScale(0.8)
            }
        }

        ///摸到麻将时有可能出现杠听胡补花
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
        
    },
    onCMD_FirstRound:function()
    {
        var isSelf = tableData.getUserWithChairId(cmdBaseWorker.wHCurrentUser).dwUserID == selfdwUserID
        
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbHActionMask)
        if(sortedActions.length>0 && isSelf)
            playNode.showActionBtns(sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
    },

    onCMD_OperateResult:function() 
    {
        playNode.hideActionBtns()
        majiangFactory.hideCurrentDiscardMj()
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
        if(cmdBaseWorker.wSelfActionUser != INVALID_WORD)
            playNode.timer.switchTimer([tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wSelfActionUser)])

        // //11.10弃用
        // if(cmdBaseWorker.cbFirstRound)
        //     playNode.timer.switchTimer([])
        // //
        
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
            if(playNode.handMajiangs4D[0][1])
                playNode.handMajiangs4D[0][1].x -= 5
        }
        
        playNode.setEnabledCardColorAfterEat()
        playNode.addWarningAction()
     
        //动作后动作 要把wProvideUser cbProvideCardData 归零
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
        {
            cmdBaseWorker.wProvideUser = cmdBaseWorker.wOperateUser //执行完上一个动作wProvideUser需要更新
            cmdBaseWorker.cbProvideCardData  = cmdBaseWorker.cbProvideCardData //cbProvideCardData仍有意义 碰杠可能触发胡 
            playNode.showActionBtns(sortedActions)  //吃碰后杠 idx不确定 需要searchGangIdxs
        }
    },
    
    onCMD_GameEnd:function() 
    {
        playNode.gamesetNode.setVisible(false)

        playNode.isPlaying = false

        // var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
        // record.szTableKey = tableKey
        // socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)


        setTimeout(function()
        {
            var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
            record.szTableKey = tableKey
            socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
        },2000)

        playNode.isLookingResult = true   
        playNode.hideActionBtns()

        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)

        var szNickName_gameEnd = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithChairId(i)
            if(user)
                szNickName_gameEnd[i] = user.szNickName
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
                    playNode.popGameEnd(continueCall, szNickName_gameEnd) 
                }) 
            )       
            playNode.node.runAction(a)
        }    
    },
    ///////////////cmdEvent end//////////

    /////////////////////////////政和规则，开始////////////////////////////
    setEnabledCardColorAfterEat:function()
    {
        if(cmdBaseWorker.cbFirstRound == true)
            return;

        //吃牌之后，不能打的牌显示灰色
        var selfID = tableData.getUserWithUserId(selfdwUserID).wChairID
        if(cmdBaseWorker.wCurrentUser!=INVALID_WORD && cmdBaseWorker.wCurrentUser == selfID)
        {
            if(!cmdBaseWorker.cbForbidOutData)
                return

            var data0 = cmdBaseWorker.cbForbidOutData[selfID][0]
            var data1 = cmdBaseWorker.cbForbidOutData[selfID][1]
            if(!playNode.handMajiangs4D)
                return

            var handDatas = playNode.handMajiangs4D[0]

            //当手里的牌全部是不能出的牌，不显示灰色
            var count = 0
            if(handDatas[1].cardData == data0 || handDatas[1].cardData == data1)
                count++

            for(var i=0; i<handDatas[0].length; i++)
            {
                if(handDatas[0][i].cardData == data0 || handDatas[0][i].cardData == data1)
                    count++ 
            }

            if(count == handDatas[0].length + 1)
                return;

            //存在可以打的牌时，要变成灰色
            if(handDatas[1].cardData == data0 || handDatas[1].cardData == data1)
                handDatas[1].color = cc.color(180,180,180)

            for(var i=0; i<handDatas[0].length; i++)
            {
                if(handDatas[0][i].cardData == data0 || handDatas[0][i].cardData == data1)
                    handDatas[0][i].color = cc.color(180, 180, 180)
            }            
        }
    },

    setEnabledCardColorAfterOut:function()
    {
        if(cmdBaseWorker.cbFirstRound == true)
            return;
        //当前用户出牌后，将牌的颜色复原
        var selfID = tableData.getUserWithUserId(selfdwUserID).wChairID
        var handDatas = playNode.handMajiangs4D[0]
        if(handDatas[1].color.r == 180)
            handDatas[1].color = cc.color(255,255,255)

        for(var i=0; i<handDatas[0].length; i++)
        {
            if(handDatas[0][i].color.r == 180)
                handDatas[0][i].color = cc.color(255,255,255)
        }
    },
    addWarningAction:function()
    {
        var selfTableID = tableData.getUserWithUserId(selfdwUserID).wTableID
        var mIsHasWarning = false
        for(var i=0; i<GAME_PLAYER; i++)
        {
            var showID = tableData.getShowChairIdWithServerChairId(i);
            var user = tableData.getUserWithTableIdAndChairId(selfTableID, i)
            var userNode = user.userNodeInsetChair.currentRoundNode
            var chairNode = tableNode['chairNode' + showID]
            if(!cmdBaseWorker.wWarningUser)
                continue;

            if(cmdBaseWorker.wWarningUser[i] == 1)
            {   
                mIsHasWarning = true

                if(chairNode.getChildByTag(123)) 
                    continue;      

                managerAudio.playEffect('gameRes/sound/warm.mp3')
                var warningSpr = actionFactory.getSprWithAnimate('warn_', false, 0.1)
                chairNode.addChild(warningSpr) 
                warningSpr.setTag(123)
                warningSpr.setPosition(cc.p(userNode.getPositionX()+32, userNode.getPositionY()-43))
               
            }
            else
            {
                var thisChild = chairNode.getChildByTag(123)
                if(thisChild)
                {
                    thisChild.stopAllActions()                        
                    thisChild.removeFromParent(true)
                }
            }  
        }  
        if(mIsHasWarning){
            playNode.warningQYSNode.visible = true
            if(playNode.warningNode.visible == true)
            {
                playNode.warningNode.y += 20
                playNode.warningQYSNode.y -= 20
                playNode.warningNode.setScale(0.8)
                playNode.warningQYSNode.setScale(0.8)
            }
        }
        else{
            playNode.warningQYSNode.visible = false
            if(playNode.warningNode.visible == true)
            {
                playNode.warningNode.y -= 20
                playNode.warningQYSNode.y += 20
                playNode.warningNode.setScale(1)
                playNode.warningQYSNode.setScale(1)
            }
        }
    },

    removeWarningAction:function()
    {
        playNode.warningQYSNode.visible = false
        for(var i=0; i<GAME_PLAYER; i++)
        {
            var showID = tableData.getShowChairIdWithServerChairId(i);
            var chairNode = tableNode['chairNode' + showID]
            var thisChild = chairNode.getChildByTag(123)
            if(thisChild)
            {
                thisChild.stopAllActions()                        
                thisChild.removeFromParent(true)
            }
        }
    },

    getChiHuTypeButton:function(mHMaxType)
    {
        var mHBtn = null
       
        if(mHMaxType == 1)
            mHBtn = playNode.btnHu_1
        else if(mHMaxType == 2)
            mHBtn = playNode.btnHu_2
        else if(mHMaxType == 3)
            mHBtn = playNode.btnHu_3
        else if(mHMaxType == 4)
            mHBtn = playNode.btnHu_4
        else if(mHMaxType == 5)
            mHBtn = playNode.btnHu_5
        else if(mHMaxType == 6)
            mHBtn = playNode.btnHu_6
        else if(mHMaxType == 7)
            mHBtn = playNode.btnHu_7
        else if(mHMaxType == 8)
            mHBtn = playNode.btnHu_8
        else if(mHMaxType == 9)
            mHBtn = playNode.btnHu_9
        else
            mHBtn = playNode.btn_hu

        return mHBtn
        
    },

    /////////////////////////////政和规则，结束////////////////////////////


    ////////////sendCardsAction start//////////
    _getHandMajiangsGroupNode:function()
    {
        var handMajiangs = playNode.handMajiangs4D

        var touchEndCall = function(direction, majiang)
        {
            //var isAllowOut = !(!MAGIC_CARD_ALLOWOUT && cmdBaseWorker.isMagicCard(majiang.cardData, cmdBaseWorker.cbMagicCardData) ) && cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID           
            var isAllowOut = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
            if(isAllowOut && majiang.color.r == 180 )
                isAllowOut = false
        
            if(isAllowOut)
            {
                playNode.setEnabledCardColorAfterOut()
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
                touchEndCall(0, majiang)
            }
        }

        playNode.handGroupNode4D = majiangFactory.getHandGroupNodes(handMajiangs, touchEndCalls)
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
        playNode.handMajiangs4D = majiangFactory.getHandMajiangsArray(handIdxsArray, tableData.getUserWithUserId(selfdwUserID).wChairID == INVALID_WORD)
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

            user.userNodeInsetChair.currentRoundNode.discardMajiangsNode.removeAllChildren()
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
    popGameEnd:function(continueCall, szNickName_gameEnd)
    {
        playNode.removeWarningAction()

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
            if(typeof(cbWinFlag[i])!='undefined')
            {
                // control['winflag'+i].setVisible(true)
                // control['winflag'+i].setSpriteFrame('winFlag_' + cbWinFlag[i] + '.png')   
                control['winflag'+i].setVisible(true)
                if(cbWinFlag[i] == 7)  //赢家
                {
                    if(cmdBaseWorker.cbMaxRightType && cmdBaseWorker.cbMaxRightType[i] == 0)                    
                        control['winflag'+i].setSpriteFrame('winFlag_' + cbWinFlag[i] + '.png')                      
                    else
                    {
                        if(cmdBaseWorker.cbMaxRightType)
                        {
                            var mHname = 'image_' + cmdBaseWorker.cbMaxRightType[i] + '.png'
                            control['winflag'+i].setSpriteFrame(mHname)
                        }                        
                    }
                }
                else if(cbWinFlag[i] == 8 || cbWinFlag[i] == 6) //放炮者 or 强退                      
                    control['winflag'+i].setSpriteFrame('winFlag_' + cbWinFlag[i] + '.png')   
                 
            }
            else
                control['winflag'+i].setVisible(false)

            //--begin add at 0710-pm
          
            if(cmdBaseWorker.bIsNeedChengBao && i == cmdBaseWorker.wProvideUser)
            {
                var t = new cc.Sprite(resp.chengbao)
                t.setScale(0.4)
                t.setAnchorPoint(cc.p(0, 0.5))
                var t_point = control['score'+i].getPosition()
                t.setPosition(cc.p(t_point.x +  t.getContentSize().width*0.4 + 8, t_point.y-t.getContentSize().height*0.26))
           
                control['score'+i].addChild(t)  
               
            }

            if(cmdBaseWorker.wBankerUser == chairid && i == chairid)
            {
                var LianZhuangLabel = new cc.LabelTTF("", "Arial", 18)
                LianZhuangLabel.setAnchorPoint(cc.p(0, 0.5))
                if(cmdBaseWorker.cbNextZhuangCount == 0)
                    LianZhuangLabel.setString('未连庄')
                else
                    LianZhuangLabel.setString(cmdBaseWorker.cbNextZhuangCount+'连庄')

                if(cmdBaseWorker.endType == 0)
                    LianZhuangLabel.setString('')

                var t_point = control['score'+chairid].getPosition()
                LianZhuangLabel.setPosition(cc.p(t_point.x+45 , t_point.y*0.091))
                control['score'+chairid].addChild(LianZhuangLabel)

            }

            //--end
            
            var score = cmdBaseWorker.lGameScore[chairid]
            control['name'+i].setString(szNickName_gameEnd[chairid])
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
        return;

        for(var i=0;i<TURNOVER_COUNT_MAGIC;i++)
        {
            var idx = cmdBaseWorker.TurnoverCard[i].cbCardData
            if(idx == 0)
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
        playNode.btn_chi.setVisible(false)
        playNode.btn_peng.setVisible(false)
        playNode.btn_gang.setVisible(false)
        playNode.btn_ting.setVisible(false)
        playNode.btn_hu.setVisible(false)
        playNode.hideActionBtns2()
    },
    hideActionBtns2:function()
    {
        playNode.btnHu_1.visible = false
        playNode.btnHu_2.visible = false
        playNode.btnHu_3.visible = false
        playNode.btnHu_4.visible = false
        playNode.btnHu_5.visible = false
        playNode.btnHu_6.visible = false
        playNode.btnHu_7.visible = false
        playNode.btnHu_8.visible = false
        playNode.btnHu_9.visible = false        
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
                btn = playNode.getChiHuTypeButton(cmdBaseWorker.cbMaxRightType)
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
            btn.setPositionX(-110 * (sortedActions.length-1-i +1))
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
            var spr = actionFactory.getSprWithAnimate('lj', true, 0.14, call)
            majiangFactory.mjTableNode.addChild(spr)
            spr.x = majiangFactory.mjTableNode.width*0.5
            spr.y = majiangFactory.mjTableNode.height*0.5
        }
        else if(cmdBaseWorker.endType == 2)
        {

            playNode.playAnimationWithDirection('zim', tableData.getShowChairIdWithServerChairId(winner), call) 
            if(cmdBaseWorker.cbMaxRightType && cmdBaseWorker.cbMaxRightType[winner] != 0)
            {
                setTimeout(function()
                {
                    playNode.playAnimationWithDirection('huMaxRight' + cmdBaseWorker.cbMaxRightType[winner], tableData.getShowChairIdWithServerChairId(winner)) 
                },1600)
            }                        
            playNode.playGenderEffect('zimo0', tableData.getUserWithChairId(winner).cbGender)
        }
        else if(cmdBaseWorker.endType == 3)
        {
            var mName = ""
            if(cmdBaseWorker.cbMaxRightType && cmdBaseWorker.cbMaxRightType[winner] == 0)
                mName = 'hu'
            else
            {
                if(cmdBaseWorker.cbMaxRightType)
                    mName = 'huMaxRight' + cmdBaseWorker.cbMaxRightType[winner]
                else
                    mName = 'hu'
            }
            playNode.playAnimationWithDirection(mName, tableData.getShowChairIdWithServerChairId(winner), call)
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
        /*
         *  注意：政和麻将方言全部是男声,特殊胡型都是男声
         */
        if(isOpenPTH)
            playNode.getGenderEffectNameOnPTH(name, isMan)
        else
            playNode.getGenderEffectNameOnFY(name)
    },

    getGenderEffectNameOnFY:function(name)
    {
        var num = Math.round(Math.random()*1)
        if(name == 'replace0')
            return

        if(cmdBaseWorker.bmyselfGameEndtype && cmdBaseWorker.bmyselfGameEndtype == true && cmdBaseWorker.cbMaxRightType)
        {
            var huType = cmdBaseWorker.cbMaxRightType[cmdBaseWorker.wWinner]
            if(huType==0 || huType==2 || huType==4)
            {
                if(cmdBaseWorker.wProvideUser != cmdBaseWorker.wWinner)
                    name = 'hu' + num
            }
            else if(huType==1 || huType==3 || huType==7 || huType==8)
            {
                if(name == 'zimo0')
                    name = 'chiHuVoice' + huType + '_1'
                else if(name == 'hu0')
                    name = 'chiHuVoice' + huType + '_0'

                if(huType == 7 && cmdBaseWorker.bComplexHuType && cmdBaseWorker.bComplexHuType[0])
                    name = 'chiHuVoice7DJS'
                else if(huType == 3 && cmdBaseWorker.bComplexHuType && cmdBaseWorker.bComplexHuType[1])
                    name = 'chiHuVoice7DJQ'
            }
            else if(huType==5 || huType==6 || huType==9)
                name = 'chiHuVoice' + huType   
        }

        if(name == 'gang0')
        {
            if(cmdBaseWorker.bIsGangAnOrMn == 0 || cmdBaseWorker.bIsGangAnOrMn == 1 || cmdBaseWorker.bIsGangAnOrMn == 3)
                name = 'gangMn'
            else if(cmdBaseWorker.bIsGangAnOrMn == 2)
                name = 'gangAn'
        }
        else if(name=='9' || name=='17' || name=='33' || name=='40')
            name = name + "_" + num

        var resPrefix = 'gameRes/sound/fy/special/'
        managerAudio.playEffect(resPrefix + name + '.mp3')
    },
    getGenderEffectNameOnPTH:function(name, isMan)
    {        
        if(name == 'replace0')
            return
        
        if(cmdBaseWorker.bmyselfGameEndtype && cmdBaseWorker.bmyselfGameEndtype == true && cmdBaseWorker.cbMaxRightType)
        {
            var huType = cmdBaseWorker.cbMaxRightType[cmdBaseWorker.wWinner]
            if(huType==0 || huType==2 || huType==4)
                name = name
            else if(huType==1 || huType==3 || huType==7 || huType==8)
            {
                if(name == 'zimo0')
                    name = 'chiHuVoice' + huType + '_1'
                else if(name == 'hu0')
                    name = 'chiHuVoice' + huType + '_0'

                if(huType == 7 && cmdBaseWorker.bComplexHuType && cmdBaseWorker.bComplexHuType[0])
                    name = 'chiHuVoice7DJS'
                else if(huType == 3 && cmdBaseWorker.bComplexHuType && cmdBaseWorker.bComplexHuType[1])
                    name = 'chiHuVoice7DJQ'
            }
            else if(huType==5 || huType==6 || huType==9)
                name = 'chiHuVoice' + huType              
        }
            
        var resPrefix = 'gameRes/sound/' + 'pth'
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

        var spr = actionFactory.getSprWithAnimate(name + '_', true, 0.14, call)
        majiangFactory.mjTableNode.addChild(spr)

        var pos = majiangFactory.getActionPlayNodePos(direction)
        spr.x = pos.x
        spr.y = pos.y
        if(name == 'zim')
        {
            switch(direction)
            {
                case 0:
                {
                    spr.y = pos.y + 100
                    break
                }
                case 1:
                {
                    spr.x = pos.x - 150
                    break
                }
                case 2:
                {
                    spr.y = pos.y - 100
                    break
                }
                case 3:
                {
                    spr.x = pos.x + 150
                    break
                }
            }            
        }
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
    }
}

recordNode.getPlayInterval=function(subId)
{
    switch(subId)
    {
        case SUB_S_GAME_START: return 3000
        case SUB_S_OPERATE_RESULT: return 2000
    }

    //这个是默认时间
    return 1000;
}

