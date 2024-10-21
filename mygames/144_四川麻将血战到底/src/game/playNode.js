
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
    haveAllSel:false,

    ///////////////////////init start///////////////////////
    init:function()
    {   
        playNode._registEvent()
        playNode._initCallBack()
        var node = managerRes.loadCCB(resp.playCCB, this)
        playNode.animationManager = node.animationManager
        playNode.node  = node

        majiangFactory.isPublicAnGang = true
        majiangFactory.heapCountOneRow = 26
        majiangFactory.init( playNode.mjTableNode, playNode.decorateMj )


        playNode.timer = playNode.getTimer()
        playNode.timerNode.addChild(playNode.timer)
        playNode.timerNode.setScale( majiangFactory.scale_upDown*0.9 )

        majiangFactory.currentDiscardMjNode.setScale(0.75)
    },
    getTimer:function( directionOfEast, tickTime)
    {
        var resp = majiangTimer4D.resp
        var control = {}
        var node  = cc.BuilderReader.load('components/majiangTimer4D/res/majiangTimer4D.ccbi', control)

        var tickTime = tickTime || 10

        var tickText = new ccui.TextAtlas()
        tickText.setAnchorPoint(cc.p(0.5, 0.5))
        tickText.setProperty("10", resp + 'num.png', 17.5, 22, "0")
        control.tickNode.addChild(tickText)

        function getStrFun(str)
        {   
            if(str == 0)
                return tickTime
            else
                return str-1
        }

        function perSecondcallBack()
        {   
            var s = tickText.getString()
            if(s<=4)
            {
                control.warm.setVisible(true)
                control.warm.scheduleOnce(
                    function()
                    {
                        control.warm.setVisible(false)
                    }, 
                    0.5)
                if (playNode.timerNode.isVisible())
                    managerAudio.playEffect('gameRes/sound/tick.mp3')
            }  
        }
        clock.tickLabel(tickText, tickTime, -1, getStrFun, null, perSecondcallBack)

        node.initFenwei = function(directionOfEast)
        {
            for(var i=0;i<4;i++)
            {
                control['normalFenwei'+i].setSpriteFrame( 'mt4_normal_' + (4+directionOfEast-i)%4 + '.png' )  
                control['lightFenwei'+i].setSpriteFrame( 'mt4_light_' + (4+directionOfEast-i)%4 + '.png' )  
            }
        }

        node.resetTimer = function()
        {
            control.lightNode_0.setVisible(false)
            control.lightNode_1.setVisible(false)
            control.lightNode_2.setVisible(false)
            control.lightNode_3.setVisible(false)
        }

        node.switchTimer = function(directions)
        {
            node.resetTimer()
            tickText.setString(tickTime)

            for(var i=0;i<directions.length;i++)
            {   
                var d = directions[i]
                control['lightNode_'+d].setVisible(true)
            }
        }

        return node
    },
    onReStart:function()
    {
        playNode.handMajiangs4D = []
        playNode.handGroupNode4D = []
        playNode.discardMajiangs4D = []
        playNode.weaveMajiangs4D = []
        playNode.isLookingResult = false
        playNode.isPlaying = false
        playNode.haveAllSel = false

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
            //currentRoundNode.discardMajiangsNode.y = -chairNodePosInMjTable.y + centerPosY - mjsDiscardHeight*0.5 - 40
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
        }
        else if(direction==2)
        {       
            currentRoundNode.scoreChange.setPosition( cc.p(-70, -30) )  

            //discard
            var discardMajiangsNodeWith = (majiangFactory.discardCountOneRow-1)*majiangFactory.up_discardWidth*majiangFactory.scale_upDown
            var mjsDiscardHeight = majiangFactory.up_discardHeight*majiangFactory.scale_upDown

            currentRoundNode.discardMajiangsNode.x = -chairNodePosInMjTable.x + majiangFactory.mjTableNode.width - 
            0.5*( majiangFactory.mjTableNode.width - discardMajiangsNodeWith)
            currentRoundNode.discardMajiangsNode.y =  -chairNodePosInMjTable.y + centerPosY + mjsDiscardHeight + 42
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
        }
        else if(direction==3)
        {   
            currentRoundNode.scoreChange.setPosition( cc.p(100, 30) )  
            //discard
            var downDiscardMajiangsNodeWidth = majiangFactory.discardCountOneRow*majiangFactory.down_discardWidth*majiangFactory.scale_upDown
            var discardMajiangsNodeHeight = (majiangFactory.discardCountOneLine-1)*majiangFactory.leftDiscardIntervalY*majiangFactory.scale_rightLeft
            var distanceFromUpDown = 0.5*(majiangFactory.mjTableNode.height - downHandHeight - upHandHeight - discardMajiangsNodeHeight)

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

        playNode.gameSetWan = function()
        {
            var call = getObjWithStructName('CMD_C_Sel')
            call.cbType = 0
            socket.sendMessage(MDM_GF_GAME,SUB_C_CALL,call)

            playNode.gamesetNode.setVisible(false)
        }

        playNode.gameSetSuo = function()
        {
            var call = getObjWithStructName('CMD_C_Sel')
            call.cbType = 1
            socket.sendMessage(MDM_GF_GAME,SUB_C_CALL,call)

            playNode.gamesetNode.setVisible(false)
        }

        playNode.gameSetTong = function()
        {
            var call = getObjWithStructName('CMD_C_Sel')
            call.cbType = 2
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
        playNode.shengYuTTF.setVisible(true)
        playNode.showLaizi()
        tableNode.fangzhuNode.setVisible(false)
        
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
        if(cmdBaseWorker.cbCallRecord[self.wChairID] != INVALID_BYTE)
            cmdBaseWorker.reSortScore(self.wChairID)

        playNode.timer.initFenwei( tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser) )
        playNode.timerNode.setVisible(true)

        if(cmdBaseWorker.wOutCardUser!=INVALID_WORD)
        {
            var d = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)
            playNode.setCurrentDiscardMj(cmdBaseWorker.cbOutCardData, d)
        }

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
                if (cmdBaseWorker.cbHaveWinUser[i] == 0)
                {
                    handIdxsArray[direction][0] = handIdxs.slice(0, handIdxs.length-1)
                    handIdxsArray[direction][1] = handIdxs[handIdxs.length-1]
                }
                else
                {
                    var isSelf = tableData.getUserWithChairId(i).dwUserID == selfdwUserID
                    if (isSelf == true)
                    {
                        handIdxsArray[direction] = [handIdxs, null]
                        for(var j=0;j<handIdxsArray[direction][0].length;j++)
                        {
                            if(handIdxsArray[direction][0][j] == cmdBaseWorker.cbHaveWinCard[i])
                            {
                               handIdxsArray[direction][1] = handIdxsArray[direction][0].splice(j, 1)[0]
                               break
                            }
                        }
                    }
                    else
                    {
                        handIdxsArray[direction][0] = handIdxs.slice(0, handIdxs.length-1)
                        handIdxsArray[direction][1] = cmdBaseWorker.cbHaveWinCard[i]
                    }
                }
            }
            else
                handIdxsArray[direction][0] = handIdxs

            discardIdxsArray[direction] = cmdBaseWorker.cbDiscardCardData[i].slice(0, cmdBaseWorker.cbDiscardCount[i])
        }

        // console.log(6666, handIdxsArray, discardIdxsArray, weaveItemArray)
        cmdBaseWorker.sortHandIdxs(handIdxsArray[0][0]) 
        // get heapIdxsArray
        var heapIdxsArray = playNode.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo)
        playNode.sendCardsAction(handIdxsArray, discardIdxsArray, weaveItemArray, heapIdxsArray, []) 

        for (var k = 0; k < GAME_PLAYER; k++)
        {
            if (cmdBaseWorker.cbHaveWinUser[k] == 1)
            { // 去把牌给他扣上
                var direction = tableData.getShowChairIdWithServerChairId(k)
                var cbWinCard = cmdBaseWorker.cbHaveWinCard[k]
                playNode.setWinnerHandMajiang(handIdxsArray, cbWinCard, k, k)
            }
        }

        var isSelAll = true
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        for (var i=0;i<GAME_PLAYER;i++)
        {
            if(cmdBaseWorker.cbCallRecord[i] == INVALID_BYTE)
            {
                isSelAll = false
                if(selfChairId == i)
                    playNode.showGameset()
            }
            else 
            {
                var direction = tableData.getShowChairIdWithServerChairId(i)

                var showSel = tableNode['type_Sel'+direction] 
                showSel.setVisible(true)
                if (cmdBaseWorker.cbCallRecord[i] == 2)
                    showSel.setSpriteFrame("tong_small.png")
                else if (cmdBaseWorker.cbCallRecord[i] == 1)
                    showSel.setSpriteFrame("tiao_small.png")
                else
                    showSel.setSpriteFrame("wan_small.png")

                if(selfChairId == i)
                {
                    var curDir = tableData.getShowChairIdWithServerChairId(selfChairId)  
                    var majiangs = playNode.handMajiangs4D[curDir]
                    for(var j=0;j<majiangs[0].length;j++)
                    {
                        var majiang = majiangs[0][j]
                        if (majiang)
                            cmdBaseWorker.setSelMajiangColor(majiang, selfChairId)
                    }

                    var majiang = playNode.handMajiangs4D[curDir][1]
                    if (majiang)
                        cmdBaseWorker.setSelMajiangColor(majiang, selfChairId)
                }
            }
        }

        if (isSelAll)
        {
            /////吃碰杠胡
            playNode.gamesetNode.setVisible(false)
            playNode.haveAllSel = true
            playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
            var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
            var isActioning = sortedActions.length>0
            if(isActioning && self.cbUserStatus == US_PLAYING)
                playNode.showActionBtns(sortedActions)
        }
        else
            playNode.timer.switchTimer([])
    },
    getHeapCardDatasArray:function(cbHeapCardInfo)
    {
        var heapIdxsArray = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var direction = i
            var serverChairid = tableData.getServerChairIdWithShowChairId(direction)

            heapIdxsArray[direction] = []
            var wMinusHeadCount = cbHeapCardInfo[serverChairid][0]
            var wMinusLastCount = cbHeapCardInfo[serverChairid][1]

            var wHeapCount = HEAP_FULL_BANKERCOUNT

            for(var j=0;j<wHeapCount;j++)
            {
                if (cmdBaseWorker.wBankerUser != serverChairid && j>=HEAP_FULL_COUNT-wMinusLastCount)
                {
                    heapIdxsArray[direction][j] = INVALID_BYTE
                    continue
                }

                if(j>=wMinusHeadCount && j<wHeapCount-wMinusLastCount)
                    heapIdxsArray[direction][j] = 0
                else
                    heapIdxsArray[direction][j] = INVALID_BYTE
            }
        }

        return heapIdxsArray
    },
    onCMD_Call:function()
    {
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
        playNode.isPlaying = true

        if(playNode.isLookingResult)
        {
            playNode.resetPlayNode()
        } 
        
        var isAllSel = true
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID

        for (var i=0;i<GAME_PLAYER;i++)
        {
            if(cmdBaseWorker.cbCallRecord[i] == INVALID_BYTE)
            {
                if(selfChairId == i)
                    playNode.showGameset()
                isAllSel = false
            }
            else 
            {
                var direction = tableData.getShowChairIdWithServerChairId(i)

                var showSel = tableNode['type_Sel'+direction] 
                //showSel.setVisible(true)
                if (cmdBaseWorker.cbCallRecord[i] == 2)
                    showSel.setSpriteFrame("tong_small.png")
                else if (cmdBaseWorker.cbCallRecord[i] == 1)
                    showSel.setSpriteFrame("tiao_small.png")
                else
                    showSel.setSpriteFrame("wan_small.png")

                if(selfChairId == i)
                {
                    ////////////////////////
                    cmdBaseWorker.reSortScore(i)
                    cmdBaseWorker.reSortHandMjs(i)
                    ////////////////////////



                    showSel.setVisible(true)
                    var curDir = tableData.getShowChairIdWithServerChairId(selfChairId)  
                    var majiangs = playNode.handMajiangs4D[curDir]
                    for(var j=0;j<majiangs[0].length;j++)
                    {
                        var majiang = majiangs[0][j]
                        if (majiang)
                            cmdBaseWorker.setSelMajiangColor(majiang, selfChairId)
                    }

                    var majiang = playNode.handMajiangs4D[curDir][1]
                    if (majiang)
                        cmdBaseWorker.setSelMajiangColor(majiang, selfChairId)
                }
            }
        }

        if (isAllSel == true)
        {
            playNode.gamesetNode.setVisible(false)
            playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
            playNode.haveAllSel = true
            playNode.actionBtns.setVisible(true)
        }
    },
    onCMD_OpeningMask:function()
    {
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs

        playNode.haveAllSel = true
        playNode.gamesetNode.setVisible(false)
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

        tableNode.fangzhuNode.setVisible(false)

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
            if(serverChairid==self.wChairID)
                idxs = cmdBaseWorker.cbHandCardData[serverChairid]

            var oldIdxs = idxs.slice(0, MAX_COUNT-1)
            handIdxsArray[direction] = [oldIdxs, null]
        }
        cmdBaseWorker.sortHandIdxs(handIdxsArray[0][0]) 
        //get heapIdxsArray 
      
        var heapIdxsArray = playNode.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo) 
        
        playNode.sendCardsAction(handIdxsArray, [[],[],[],[]], [[],[],[],[]], heapIdxsArray, []) 

        playNode.setCurrentRoundNodesVisible(false)
        playNode.actionBtns.setVisible(false)
        managerTouch.closeTouch() //避免在不知道牌的情况下 把牌打出去
        //提前保存可能被破坏的数据  掷骰子是庄家出牌破坏数据 因为可能庄家筛子先出完
        var bankerShowChairid = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser)
        function gameStart()
        {
            playNode.timer.initFenwei( bankerShowChairid )
            playNode.setCurrentRoundNodesVisible(true)

            // playNode.actionBtns.setVisible(true)
            playNode.timerNode.setVisible(true)
            managerTouch.openTouch()
            playNode.showGameset()
            playNode.haveAllSel = false
            playNode.scoreTTF.setVisible(true)
            playNode.shengYuTTF.setVisible(true)
        }

        function bankerPlayDice()
        {
            tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
            var siceNum1 = getRandNum(Math.max(cmdBaseWorker.cbSiceCount-6, 1), Math.min(cmdBaseWorker.cbSiceCount-1, 6))
            var siceNum2 = cmdBaseWorker.cbSiceCount - siceNum1
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
        var outUser = tableData.getUserWithChairId(cmdBaseWorker.wOutCardUser)
        var outDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)  
        var outIdx = cmdBaseWorker.cbOutCardData

        playNode.timer.switchTimer([])
        playNode.playMajiangEffect(outIdx, outUser.cbGender)
        managerAudio.playEffect('gameRes/sound/discard.mp3')

        if (cmdBaseWorker.isHaveShowSelCard == false)
        {
            cmdBaseWorker.isHaveShowSelCard = true
            for (var player = 0; player < GAME_PLAYER; player++)
            {
                var showSel = tableNode['type_Sel'+player] 
                if (showSel)
                    showSel.setVisible(true)
            }
        }

        var majiangs = playNode.handMajiangs4D[outDir]
        if(outUser.dwUserID==selfdwUserID)
        {
            majiangFactory.deleteHandMajiangs(majiangs, outDir, outIdx)
            var newMj = majiangs[1]
            if(newMj)
            {
                majiangFactory.insertHandMajiangsOld(majiangs, outDir, newMj.cardData, playNode.handGroupNode4D[outDir])
                majiangFactory.deleteHandMajiangNew(majiangs)

                for(var j=0;j<majiangs[0].length;j++)
                {
                    var majiang = majiangs[0][j]
                    if (majiang && majiang.cardData == newMj.cardData)
                        cmdBaseWorker.setSelMajiangColor(majiang, cmdBaseWorker.wOutCardUser)
                }
            }
        }
        else
            majiangFactory.deleteHandMajiangs(majiangs, outDir, 0)

        cmdBaseWorker.addDiscardMajiangs(playNode.discardMajiangs4D[outDir], outDir,
            outIdx, outUser.userNodeInsetChair.currentRoundNode.discardMajiangsNode)

        playNode.setCurrentDiscardMj(outIdx, outDir)

        var self = tableData.getUserWithUserId(selfdwUserID)
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && self.cbUserStatus == US_PLAYING)
            playNode.showActionBtns(sortedActions)
    },
    onCMD_SendCard:function() 
    {
        if(cmdBaseWorker.cbOutCardCount != 0)
            managerAudio.playEffect('gameRes/sound/sendcard.mp3')

        var isSelf = tableData.getUserWithChairId(cmdBaseWorker.wTakeCardUser).dwUserID == selfdwUserID
        var isAllCall = cmdBaseWorker.isAllCall()

        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        playNode.timer.switchTimer(!isAllCall || cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
        
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
                cmdBaseWorker.addDiscardMajiangs(playNode.discardMajiangs4D[takeDir], takeDir,
                    item.cbCardData, outUser.userNodeInsetChair.currentRoundNode.discardMajiangsNode)
                // playNode.setCurrentDiscardMj(item.cbCardData, takeDir)
                continue
            }

            var idx = isSelf?item.cbCardData:0
            var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
            if (isSelf)
            {
                var majiangNew = playNode.handMajiangs4D[takeDir][1]
                if (majiangNew)
                {
                    var CardData = majiangNew.cardData
                    majiangFactory.addHandMajiangNew(playNode.handMajiangs4D[takeDir], takeDir, idx, playNode.handGroupNode4D[takeDir])
                    if ((CardData&MASK_COLOR)>>4 == cmdBaseWorker.cbCallRecord[cmdBaseWorker.wTakeCardUser])
                    {
                        var majiangs = playNode.handMajiangs4D[takeDir]
                        for(var j=0;j<majiangs[0].length;j++)
                        {
                            var majiangold = majiangs[0][j]
                            if (majiangold)
                                cmdBaseWorker.setSelMajiangColor(majiangold, selfChairId)
                        }
                    }
                }
                else
                    majiangFactory.addHandMajiang(playNode.handMajiangs4D[takeDir], takeDir, idx, playNode.handGroupNode4D[takeDir], playNode.weaveMajiangs4D[takeDir].length)
                
                var majiangs = playNode.handMajiangs4D[takeDir]
                for(var j=0;j<majiangs[0].length;j++)
                {
                    var majiangold = majiangs[0][j]
                    if (majiangold)
                        cmdBaseWorker.setSelMajiangColor(majiangold, selfChairId)
                }

                var majiangNew1 = playNode.handMajiangs4D[takeDir][1]
                if (majiangNew1)
                    cmdBaseWorker.setSelMajiangColor(majiangNew1, selfChairId)

                var majiang = playNode.handMajiangs4D[takeDir][1]
                if (majiang)
                    cmdBaseWorker.setSelMajiangColor(majiang, cmdBaseWorker.wTakeCardUser)
            }
            else
                majiangFactory.addHandMajiang(playNode.handMajiangs4D[takeDir], takeDir, idx, playNode.handGroupNode4D[takeDir], playNode.weaveMajiangs4D[takeDir].length)
            
        }
        /////摸到麻将时有可能出现杠听胡补花
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && isSelf)
            playNode.showActionBtns(sortedActions)  //自摸杠 idx不确定 需要searchGangIdxs
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
            playNode.onActionResult(cmdBaseWorker.cbOperateCode, idxs, operateUser, provideUser,
                majiangs4W4D, playNode.handGroupNode4D)

            playNode.playAction(cmdBaseWorker.cbOperateCode, operateUser)

            var operateDir = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOperateUser)  
            var majiang = playNode.handMajiangs4D[operateDir][1]
            if (majiang)
                cmdBaseWorker.setSelMajiangColor(majiang, cmdBaseWorker.wOperateUser)
        }
        
        var self = tableData.getUserWithUserId(selfdwUserID)
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0 && self.cbUserStatus == US_PLAYING)
        {
            if((cmdBaseWorker.cbActionMask&WIK_GANG)!=0)
            {
                cmdBaseWorker.wProvideUser    = INVALID_CHAIR
                cmdBaseWorker.cbProvideCardData  = INVALID_CARD_DATA    
            }
            
            playNode.showActionBtns(sortedActions)  //吃碰后杠 idx不确定 需要searchGangIdxs
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
    onActionGang:function(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var cardData = cardDatas[0]
        var gangType //0暗杠 1明杠 2增杠
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
        var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
        var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
        var provideDiscardMajiangs = majiangs4W4D.discardMajiangs4D[provideUserDir]

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

        var deleteCardData = operateUser.dwUserID == selfdwUserID?cardData:0
        if(gangType==2)
        {
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)
            majiangFactory.moveHandMajiangNew2Old(operateHandMajiangs, operateUserDir, handGroupNode4D[operateUserDir])
            playNode.peng2Gang(cardData, operateWeaveMajiangs, operateUserDir)
        }
        else
        {
            var deleteLen = 4
            if(gangType==1)
            {
                majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
                deleteLen = deleteLen - 1
            }
            for(var i=0;i<deleteLen;i++)
            {
                majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)
            }

            var self = tableData.getUserWithUserId(selfdwUserID)
            var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
            majiangFactory.addWeaveMajiangs(operateWeaveMajiangs, operateUserDir, 
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
    onActionPeng:function(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var cardData = cardDatas[0]
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
        var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
        var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
        var provideDiscardMajiangs = majiangs4W4D.discardMajiangs4D[provideUserDir]

        var weaveCardDatas = [cardData, cardData, cardData]

        if(operateUser.dwUserID == selfdwUserID)
        {
            var deleteCardDatas = [cardData, cardData]
        }
        else
            var deleteCardDatas = [0, 0]

        //////
        majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
        for(var i=0;i<deleteCardDatas.length;i++)
        {
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardDatas[i])
        }

        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
        playNode.addWeaveMajiangs(operateWeaveMajiangs, operateUserDir, 
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
    addWeaveMajiangs:function(majiangsOneDirection, direction, weaveItem, parent, selfDirection)
    {
        var isPublicAnGang = majiangFactory.isPublicAnGang
        var groupIdx = majiangsOneDirection.length
        var isSelf = selfDirection == direction
        var majiangsOneGroup = playNode.weaveItem2Majiangs(groupIdx, direction, weaveItem, isSelf, isPublicAnGang)
        for(var i=0;i<majiangsOneGroup.length;i++)
        {
            parent.addChild(majiangsOneGroup[i])
        }
        majiangsOneDirection[groupIdx] = majiangsOneGroup
    },
    weaveItem2Majiangs:function(groupIdx, direction, weaveItem, isSelf, isPublicAnGang)
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

            var majiang = majiangFactory.getOne(cardData, 2, direction)

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
                directionSpr.setVisible(false)
                hasAddDirectionSpr = true
            }
            majiangs[majiangs.length] = majiang
        }  
        majiangs.cbWeaveKind = weaveItem.cbWeaveKind

        return majiangs
    },
    peng2Gang:function(cardData ,majiangsOneDirection, direction)
    {
        for(var i=0;i<majiangsOneDirection.length;i++)
        {
            var majiangsOneGroup = majiangsOneDirection[i]
            if(majiangsOneGroup.cbWeaveKind == WIK_PENG && majiangsOneGroup[0].cardData == cardData)
            {
                var zi = majiangsOneGroup[0].getChildByTag(101) 
                if (zi)
                {
                    var directionSpr = zi.getChildByTag(101)
                    if (directionSpr)
                        directionSpr.setVisible(true)
                }
                var majiang = majiangFactory.getOne(cardData, 2, direction)
                var pos = majiangFactory.getWeaveMajiangPosAndTag(i, 3, direction)
                majiang.x = pos.x
                majiang.y = pos.y
                majiang.setLocalZOrder(pos.zOrder)
                var parent = majiangsOneGroup[0].getParent()
                parent.addChild(majiang)

                majiangsOneGroup[3] = majiang
                majiangsOneGroup.cbWeaveKind = WIK_GANG
                break
            }
        }
    },
    onCMD_GangScore:function() 
    {
        playNode._scoreShowToHide(cmdBaseWorker.lGangScore)
    },
    onCMD_GameEnd:function() 
    {
        playNode.gamesetNode.setVisible(false)
        var cbProvideCardData = cmdBaseWorker.cbProvideCardData //记录一下 要不然会被再发牌改变

        var isEndGame = cmdBaseWorker.isEndGame
        var wWinner = cmdBaseWorker.wWinner
        var wProvideUser = cmdBaseWorker.wProvideUser
        var wFan = cmdBaseWorker.wFan

        var dwChiHuRight = []
        var cbHandCardData = []
        var cbHandCardCount = []
        for(var k=0;k<4;k++)
        {
            cbHandCardData[k] = cmdBaseWorker.cbHandCardData[k]
            cbHandCardCount[k] = cmdBaseWorker.cbHandCardCount[k]
        }

        if (isEndGame == 1)
        {
            playNode.isLookingResult = true   
            playNode.isPlaying = false

            setTimeout(function()
            {
                var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
                record.szTableKey = tableKey
                socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
            },2000)

            playNode.hideActionBtns()
            cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)  

        }
        else
        {
            for (var j = 0; j < GAME_PLAYER; j++)
                dwChiHuRight[j] = cmdBaseWorker.dwChiHuRight[j]

            playNode.btn_chi.setVisible(false)
            playNode.btn_peng.setVisible(false)
            playNode.btn_gang.setVisible(false)
            var isSelf = tableData.getUserWithChairId(cmdBaseWorker.wWinner).dwUserID == selfdwUserID
            if (isSelf == true)
            {
                playNode.btn_hu.setVisible(false)
                playNode.btn_guo.setVisible(false)
            }
            else
            {
                if (playNode.btn_hu.isVisible() == false)
                    playNode.btn_guo.setVisible(false)
            }

            if(cmdBaseWorker.endType == 3)
            {
                var provideDiscardMajiangs = playNode.discardMajiangs4D[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser)]
                //抢杠情况不会到丢弃区
                if(provideDiscardMajiangs.length>0 && provideDiscardMajiangs[provideDiscardMajiangs.length-1].cardData == cmdBaseWorker.cbProvideCardData)
                    majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
            }
        }

        var lCurGameScore = []
        for (var lscore = 0; lscore < cmdBaseWorker.lGameScore.length; lscore++)
            lCurGameScore[lscore] = cmdBaseWorker.lGameScore[lscore]

        function onPlayAnimationOfGameEnd()
        {
            if (isEndGame == 1)
            {//把牌亮出来 隐藏打出牌
                playNode.timer.resetTimer()
                majiangFactory.hideCurrentDiscardMj()  //清除打出的那张牌 凸起的
                playNode._showSprsOnGameEnd() //真正结束 
            }
            else
                playNode._dealWinnerSprsBeforeEnd(cbProvideCardData, lCurGameScore, wWinner, wProvideUser, dwChiHuRight, cbHandCardData, cbHandCardCount)
        }  

        if (isEndGame == 1) // 结束
            onPlayAnimationOfGameEnd()
        else // 有人赢
        {
            var chrStr = playNode._getHuType(dwChiHuRight, wWinner, wProvideUser, wWinner==wProvideUser, wFan)
            var nodeTimes = playNode._getNodeWarnLayer()
            if (nodeTimes == 0)
            {
                topUINode.node_warn0.unschedule(playNode.hideWarnNode0)
                topUINode.node_warn0.setVisible(true)
                topUINode.label_warn0.setString(chrStr)
                topUINode.node_warn0.schedule(playNode.hideWarnNode0, 8)
            }
            else if (nodeTimes == 1)
            {
                topUINode.node_warn1.unschedule(playNode.hideWarnNode1)
                topUINode.node_warn1.setVisible(true)
                topUINode.label_warn1.setString(chrStr)
                topUINode.node_warn1.schedule(playNode.hideWarnNode1, 8)
            }
            else if (nodeTimes == 2)
            {
                topUINode.node_warn2.unschedule(playNode.hideWarnNode2)
                topUINode.node_warn2.setVisible(true)
                topUINode.label_warn2.setString(chrStr)
                topUINode.node_warn2.schedule(playNode.hideWarnNode2, 8)
            }

            playNode.playAnimationOfGameEnd(onPlayAnimationOfGameEnd)      
        }
    },
    hideWarnNode0:function()
    {
       topUINode.node_warn0.setVisible(false)
       topUINode.node_warn0.unschedule(playNode.hideWarnNode0)
    },
    hideWarnNode1:function()
    {
       topUINode.node_warn1.setVisible(false)
       topUINode.node_warn1.unschedule(playNode.hideWarnNode1)
    },
    hideWarnNode2:function()
    {
       topUINode.node_warn2.setVisible(false)
       topUINode.node_warn2.unschedule(playNode.hideWarnNode2)
    },
    _getNodeWarnLayer:function()
    {
        var node = 0
        if (topUINode.node_warn0.isVisible() == false)
            node = 0
        else if (topUINode.node_warn1.isVisible() == false)
            node = 1
        else if (topUINode.node_warn2.isVisible() == false)
            node = 2
        if (topUINode.node_warn0.isVisible() && topUINode.node_warn1.isVisible() && topUINode.node_warn2.isVisible())
            node = 0

        return node
    },
    _getHuType:function(dwChiHuRight,wWinner,wProvideUser,isZimo,wFan)
    {
        var winUser = tableData.getUserWithChairId(wWinner)
        var provideUser = tableData.getUserWithChairId(wProvideUser)
        var chrStr = "玩家" + winUser.szNickName
        if (isZimo)
            chrStr += "自摸："
        else
            chrStr += "胡了："
        for (var i = 0; i < map_mask2Name.length; i++) 
        {
            var chr_type = window[ map_mask2Name[i][0] ] 
            if (dwChiHuRight[wWinner] & chr_type)
            {
                chrStr += map_mask2Name[i][1] + ' ';
            }
        }

        //添加放冲数
        chrStr += "  " + wFan + "番"
        if (isZimo == false)
            chrStr += "  " + "点炮玩家：" + provideUser.szNickName

        return chrStr
    },
    _warnNodeSet:function()
    {

    },
    ///////////////cmdEvent end//////////
    ///////////////end by wsh///////////////////
    _showScore:function(lCurGameScore)
    {
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithChairId(i)
            if(!user) continue

            var chair = tableData.getChairWithServerChairId(i)
            if(tableData.isInTable(user.cbUserStatus))
            {   
                //score
                var score = lCurGameScore[i]
                if (score == 0) continue
                
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
    },

    _dealWinnerSprsBeforeEnd:function(cbProvideCardData, lCurGameScore, wWinner, wProvideUser, dwChiHuRight, cbHandCardData, cbHandCardCount)
    {
        playNode._scoreShowToHide(lCurGameScore)

        var isQiangGang = dwChiHuRight[wWinner] & CHR_QiangGang
        if(isQiangGang) //抢杠需要gang2Peng
        {
            var direction = tableData.getShowChairIdWithServerChairId(wProvideUser)
            majiangFactory.gang2Peng(cbProvideCardData , playNode.weaveMajiangs4D[direction] )
        }

        //摊牌
        var displayHandIdxsArray = []
        for(var i=0;i<4;i++)
        {
            var direction = i
            var chairid = tableData.getServerChairIdWithShowChairId(direction)

            displayHandIdxsArray[direction] = [cbHandCardData[chairid].slice(0, cbHandCardCount[chairid]), null]

            if(wWinner == chairid)
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
        var handMajiangs4D = playNode.getCoverHandMajiangsArray(displayHandIdxsArray, wWinner)
        var isSelf = tableData.getUserWithChairId(wWinner).dwUserID == selfdwUserID
  
        for(var i=0;i<4;i++)
        {
            var direction = i

            var showChairid = direction//==0?0:1
            var chairid = tableData.getServerChairIdWithShowChairId(showChairid)

            if (wWinner == chairid)
            {
                var handGroupNode = playNode.handGroupNode4D[direction]
                
                var handMajiangs = handMajiangs4D[0]
                if (isSelf == false && showChairid != 0)
                {
                    handGroupNode.removeAllChildren()
                    var oldMjs = handMajiangs[0]
                    for(var j=0;j<oldMjs.length;j++)
                        handGroupNode.addChild(oldMjs[j])
                }

                if(handMajiangs[1])
                    handGroupNode.addChild(handMajiangs[1])
            }
        }
        var self = tableData.getUserWithUserId(selfdwUserID)
        if ((isSelf || (self.cbUserStatus == US_LOOKON && 0 == wWinner)) && wWinner == wProvideUser)
        { // 自摸需要把自己摸得牌删除 要不然会出现两张牌重合
            var curDir = tableData.getShowChairIdWithServerChairId(wWinner) 
            var majiangGroup = playNode.handMajiangs4D[curDir]
            if (self.cbUserStatus == US_LOOKON && 0 == wWinner)
                majiangFactory.deleteHandMajiangs(majiangGroup, curDir, 0)
            else
            {
                if (majiangGroup[1] && majiangGroup[1].cardData == cbProvideCardData)
                    majiangFactory.deleteHandMajiangs(majiangGroup, curDir, cbProvideCardData)
                else if (majiangGroup[1])
                {
                    majiangFactory.deleteHandMajiangs(majiangGroup, curDir, cbProvideCardData)
                    majiangFactory.addHandMajiang(majiangGroup, curDir, majiangGroup[1].cardData, playNode.handGroupNode4D[curDir], playNode.weaveMajiangs4D[curDir].length)
                    majiangGroup[1].removeFromParent()
                }

                //majiangFactory.deleteHandMajiangs(majiangGroup, curDir, cbProvideCardData)
                //if (majiangGroup[1])
                //   majiangGroup[1].removeFromParent()
                //   majiangFactory.insertHandMajiangsOld(majiangs, outDir, newMj.cardData, playNode.handGroupNode4D[outDir])
                //   majiangFactory.deleteHandMajiangNew(majiangs)
            }
        }

        // playNode.playAction('hu', tableData.getUserWithChairId(args.winner))
    },
    setWinnerHandMajiang:function(handIdxsArray, cbProvideCardData, wWinner, wProvideUser)
    {
        var handMajiangs4D = playNode.getCoverHandMajiangsArray(handIdxsArray, wWinner)
        var isSelf = tableData.getUserWithChairId(wWinner).dwUserID == selfdwUserID

        for(var i=0;i<4;i++)
        {
            var direction = i

            var showChairid = direction//==0?0:1
            var chairid = tableData.getServerChairIdWithShowChairId(showChairid)

            if (wWinner == chairid)
            {
                var handGroupNode = playNode.handGroupNode4D[direction]
                
                var handMajiangs = handMajiangs4D[0]
                if (isSelf == false && showChairid!=0)
                {
                    handGroupNode.removeAllChildren()
                    var oldMjs = handMajiangs[0]
                    for(var j=0;j<oldMjs.length;j++)
                        handGroupNode.addChild(oldMjs[j])
                }

                if(handMajiangs[1])
                    handGroupNode.addChild(handMajiangs[1])
            }
        }
        var self = tableData.getUserWithUserId(selfdwUserID)
        if ((isSelf || (self.cbUserStatus == US_LOOKON && 0 == wWinner)) && wWinner == wProvideUser)
        { // 自摸需要把自己摸得牌删除 要不然会出现两张牌重合
            var curDir = tableData.getShowChairIdWithServerChairId(wWinner) 
            var majiangGroup = playNode.handMajiangs4D[curDir]
            if (self.cbUserStatus == US_LOOKON && 0 == wWinner)
                majiangFactory.deleteHandMajiangs(majiangGroup, curDir, 0)
            else
                majiangFactory.deleteHandMajiangs(majiangGroup, curDir, cbProvideCardData)
        }
    },

    getCoverHandMajiangsArray:function(displayHandIdxsArray, wWinner)
    {
        var handMajiangs4D = []

        for(showChairid=0;showChairid<GAME_PLAYER;showChairid++)//direction 0down 1right 2up 3left
        {
            var chairid = tableData.getServerChairIdWithShowChairId(showChairid)
            if (wWinner == chairid)
            {
                var direction = showChairid
                var oldHandIdxs = displayHandIdxsArray[direction][0]
                var oldHandMjs = []
                for(var j=0;j<oldHandIdxs.length;j++)
                {
                    var idx = oldHandIdxs[j]

                    var majiang = majiangFactory.getOne(0, 3, direction)
                    majiang.cardDataInHandMajiangs = j
                    var pos = majiangFactory.getDisplayHandMajiangPosAndTagAndTag(oldHandIdxs.length, majiang.cardDataInHandMajiangs, direction, false)
                    majiang.x = pos.x
                    majiang.y = pos.y
                    majiang.setScale(pos.scale)
                    majiang.setLocalZOrder(pos.zOrder)
                    oldHandMjs[j] = majiang
                }

                var newGetMj = null
                var newGetIdx = displayHandIdxsArray[direction][1]
                if(typeof(newGetIdx) == 'number')          
                {
                    newGetMj = majiangFactory.getOne(newGetIdx, 2, direction)
                    var pos = majiangFactory.getDisplayHandMajiangPosAndTagAndTag(oldHandIdxs.length, null, direction, true)
                    newGetMj.x = pos.x
                    newGetMj.y = pos.y
                    newGetMj.setScale(pos.scale)
                    newGetMj.setLocalZOrder(pos.zOrder)
                    newGetMj.cardDataInHandMajiangs = null
                }  
                handMajiangs4D[0] = [oldHandMjs, newGetMj]
            }
        }

        return handMajiangs4D
    },


    ///////////////end by wsh///////////////////

    ////////////sendCardsAction start//////////
    _getHandMajiangsGroupNode:function()
    {
        var handMajiangs = playNode.handMajiangs4D

        var touchEndCall = function(direction, majiang)
        {
            var isHaveSelCard = false
            var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID

            if (((majiang.cardData&MASK_COLOR)>>4) != cmdBaseWorker.cbCallRecord[selfChairId])
            {
                if(cmdBaseWorker.cbCallRecord[i] != INVALID_BYTE)
                {
                    var curDir = tableData.getShowChairIdWithServerChairId(selfChairId)  
                    var majiangs = playNode.handMajiangs4D[curDir]
                    for(var j=0;j<majiangs[0].length;j++)
                    {
                        var curMajiang = majiangs[0][j]
                        if (curMajiang)
                        {
                            var CardData = curMajiang.cardData
                            if ((CardData&MASK_COLOR)>>4 == cmdBaseWorker.cbCallRecord[selfChairId])
                            {
                                isHaveSelCard = true
                                break
                            }
                        }
                    }

                    var curMajiang = playNode.handMajiangs4D[curDir][1]
                    if (curMajiang)
                    {
                        var CardData = curMajiang.cardData
                        if ((CardData&MASK_COLOR)>>4 == cmdBaseWorker.cbCallRecord[selfChairId])
                        {
                            isHaveSelCard = true
                        }
                    }
                }
            }

            //var isAllowOut = majiang.cardData != cmdBaseWorker.cbMagicCardData && cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
            var isAllowOut = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID && playNode.haveAllSel && !isHaveSelCard

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
                touchEndCall(0, majiang)
            }
        }

        playNode.handGroupNode4D = majiangFactory.getHandGroupNodes(handMajiangs, touchEndCalls)
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
    sendCardsAction:function(handIdxsArray, discardIdxsArray, weaveItemArray, heapIdxsArray, flowerIdxsArray)
    {   
        // flowerIdxsArray = [ [0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48] ]
        // heapIdxsArray = [ [1,0,0,0,0,0,0,0,0,0,0,0,0,0],[],[],[] ]
        // discardIdxsArray = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
        // weaveIdxsArray = [[[1,2,3,4],[2,3,4],[4,5,6],[7,8,1]],[],[[1,2,3],[2,3,4,5],[4,5,6],[7,8,1]],[]]
        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)

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
                weaveItem.cbCardDatas = weaveItem.cbCardData

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
            var heapMajiangsNode = user.userNodeInsetChair.currentRoundNode.heapMajiangsNode
            var handMajiangsNode = user.userNodeInsetChair.currentRoundNode.handMajiangsNode
            var discardMajiangsNode = user.userNodeInsetChair.currentRoundNode.discardMajiangsNode
            var weaveMajiangsNode = user.userNodeInsetChair.currentRoundNode.weaveMajiangsNode

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
        // if(cmdBaseWorker.endType == 0)
        //     return 

        playNode.timerNode.setVisible(false)

        //摊牌
        var displayHandIdxsArray = []
        var cbProvideCardData = cmdBaseWorker.cbProvideCardData

        for(var i=0;i<4;i++)
        {
            var direction = i
            var chairid = tableData.getServerChairIdWithShowChairId(direction)

            displayHandIdxsArray[direction] = [cmdBaseWorker.cbHandCardData[chairid].slice(0, cmdBaseWorker.cbHandCardCount[chairid]), null]

            var handCardCount = cmdBaseWorker.cbHandCardCount[chairid]
            gameLog.log("XXXXX:", cmdBaseWorker.cbWinCardData[chairid])
            if(cmdBaseWorker.wWinner == chairid || cmdBaseWorker.cbWinCardData[chairid] != 0)
            {   
                var displayHandIdxs = displayHandIdxsArray[direction]
                for(var j=0;j<displayHandIdxs[0].length;j++)
                {
                    if(displayHandIdxs[0][j] == cmdBaseWorker.cbWinCardData[chairid])
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

        var isHuaPig  = false
        var isBuChaJia=false
        var isChaJiao =false
        var isTuiShui =false
        if (cmdBaseWorker.endType == 1) // 流局
        {
            for (var j = 0; j < GAME_PLAYER; j++)
            {
                if (cmdBaseWorker.lPigScore[j] != 0)
                    isHuaPig = true
                if (cmdBaseWorker.lChaJiao[j] != 0)
                    isChaJiao = true
                if (cmdBaseWorker.lTuiShui[j] != 0)
                    isTuiShui = true
            }
        }

        var amountShow = 0
        if (isHuaPig == true)
        {
            var i = 0
            topUINode['node_liuju'+i].setVisible(true)
            topUINode['title_liuju'+i].setString("查花猪")
            var strHuaPig = ""
            for (var j = 0; j < GAME_PLAYER; j++)
            {
                if (cmdBaseWorker.lPigScore[j] != 0)
                {
                     var User = tableData.getUserWithChairId(j)
                     strHuaPig += User.szNickName + ":" + cmdBaseWorker.lPigScore[j] + "    "
                }
            }
            topUINode['label_liuju'+i].setString(strHuaPig)

            playNode._scoreShowToHide(cmdBaseWorker.lPigScore)
            amountShow+=1
        }

        if (isChaJiao == true)
        {
            var chajia = 0
            if (amountShow == 1)
                chajia = 1
            topUINode['title_liuju'+chajia].setString("查叫")
            var strChaJiao = ""
            for (var j = 0; j < GAME_PLAYER; j++)
            {
                if (cmdBaseWorker.lChaJiao[j] != 0)
                {
                     var User = tableData.getUserWithChairId(j)
                     strChaJiao += User.szNickName + ":" + cmdBaseWorker.lChaJiao[j] + "   "
                }
            }
            topUINode['label_liuju'+chajia].setString(strChaJiao)

            if (amountShow != 0)
            {
                var b = cc.sequence( 
                    cc.delayTime(4), 
                    cc.callFunc(function()
                    {
                        topUINode['node_liuju'+chajia].setVisible(true)
                        playNode._scoreShowToHide(cmdBaseWorker.lChaJiao)
                    }
                    )
                )           
                playNode.node.runAction(b)
            }
            else
            {
                topUINode['node_liuju'+chajia].setVisible(true)
                playNode._scoreShowToHide(cmdBaseWorker.lChaJiao)
            }

            amountShow++
        }

        if (isTuiShui == true)
        {
            var tuishui = 0
            if (amountShow == 1)
                tuishui = 1
            else if (amountShow == 2)
                tuishui = 2
            else if (amountShow == 3)
                tuishui = 3
            topUINode['title_liuju'+tuishui].setString("退税")
            var strTuiShui = ""
            for (var j = 0; j < GAME_PLAYER; j++)
            {
                if (cmdBaseWorker.lTuiShui[j] != 0)
                {
                     var User = tableData.getUserWithChairId(j)
                     strTuiShui += User.szNickName + ":" + cmdBaseWorker.lTuiShui[j] + "   "
                }
            }
            topUINode['label_liuju'+tuishui].setString(strTuiShui)
            
            var time = 0
            if (amountShow == 1)
               time = 4
            else if (amountShow == 2)
                time = 8
            else if (amountShow == 3)
                time = 12
            if (amountShow != 0)
            {
                var k = cc.sequence( 
                    cc.delayTime(time), 
                    cc.callFunc(function()
                    {
                        topUINode['node_liuju'+tuishui].setVisible(true)
                        playNode._scoreShowToHide(cmdBaseWorker.lTuiShui)
                    }
                    )
                )           
                playNode.node.runAction(k)
            }
            else
            {
                topUINode['node_liuju'+tuishui].setVisible(true)
                playNode._scoreShowToHide(cmdBaseWorker.lTuiShui)
            }

            amountShow++
        }

        var afterShowLiuJu = function()
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
            var szNickName_gameEnd = []
            for(var l=0;l<GAME_PLAYER;l++)
            {
                var user = tableData.getUserWithChairId(l)
                if(user)
                    szNickName_gameEnd[l] = user.szNickName
            }
            playNode.popGameEnd(continueCall, szNickName_gameEnd) 
        }

        if (amountShow != 0)
        {
            var timeToHide = amountShow*4+1
            var b = cc.sequence( 
                cc.delayTime(timeToHide), 
                cc.callFunc(function()
                {
                    playNode.hideLiuJuDlg()
                    afterShowLiuJu()
                    //删除打出去的牌
                    for(var i=0;i<GAME_PLAYER;i++)
                    {
                        var user = tableData.getUserWithChairId(i)
                            if(!user) continue

                        user.userNodeInsetChair.currentRoundNode.discardMajiangsNode.removeAllChildren()
                    }
                }
                )
            )           
            playNode.node.runAction(b)
        }
        else
        {
            for(var i=0;i<GAME_PLAYER;i++)
            {
                var user = tableData.getUserWithChairId(i)
                    if(!user) continue

                user.userNodeInsetChair.currentRoundNode.discardMajiangsNode.removeAllChildren()
            }
            afterShowLiuJu()
        }
    },
    _scoreShowToHide:function(score)
    {
         // 先清一下飘分
        for(var i=0;i<GAME_PLAYER;i++)
        {
           var user = tableData.getUserWithChairId(i)
           if(!user) continue

           if(tableData.isInTable(user.cbUserStatus))
           {   
               var scoreNode = user.userNodeInsetChair.currentRoundNode.scoreChange
               scoreNode.removeAllChildren()
           }
        }

        var p = cc.sequence( 
            cc.callFunc(function()
            {     
                playNode._showScore(score)
            }), 
            cc.delayTime(3), 
            cc.callFunc(function()
            {
                 for(var i=0;i<GAME_PLAYER;i++)
                 {
                    var user = tableData.getUserWithChairId(i)
                    if(!user) continue

                    if(tableData.isInTable(user.cbUserStatus))
                    {   
                        var scoreNode = user.userNodeInsetChair.currentRoundNode.scoreChange
                        scoreNode.removeAllChildren()
                    }
                 }
            }
            )
        )    
        playNode.node.runAction(p)  
    },
    hideLiuJuDlg:function()
    {
        for (var i = 0; i < 4; i++)
        {
            var node = topUINode['node_liuju'+i]
            if (node)
            {
                node.setVisible(false)
            }
        }
    },
    _removeSprsOnGameEnd:function()
    {
        for(var chairId=0;chairId<GAME_PLAYER;chairId++)
        {   
            var user = tableData.getUserWithTableIdAndChairId(null, chairId)
            if(user)
            {
                playNode.clearCurrentRoundNode(user.userNodeInsetChair.currentRoundNode)

                var direction = tableData.getShowChairIdWithServerChairId(chairId)
                var showSel = tableNode['type_Sel'+direction] 
                showSel.setVisible(false)
            }
        }

        cmdBaseWorker.isHaveShowSelCard = false
    },
    popGameEnd:function(continueCall, szNickName_gameEnd)
    {
        var cbWinFlag = []
        var control = {}
        control.continueCall = function()
        {
            continueCall()
            node.removeFromParent()
        }
        var node  = cc.BuilderReader.load(resp.gameEndPopCCB, control)

        playNode.gameEndControl = control

        for(var i=0;i<GAME_PLAYER;i++)
        {
            if(cmdBaseWorker.endType==0 && i==cmdBaseWorker.wExitUser)
                cbWinFlag[i] = 6
            else if((cmdBaseWorker.endType==2||cmdBaseWorker.endType==3) && cmdBaseWorker.wWinner == i)
                cbWinFlag[i] = 7

            if(cmdBaseWorker.endType==3 && cmdBaseWorker.wProvideUser==i)
                cbWinFlag[i] = 8

            if (cmdBaseWorker.cbGameHuType[i]!=INVALID_BYTE && cmdBaseWorker.cbGameHuType[i] != 0)
            {
                control['huType'+i].setVisible(true)
                if (cmdBaseWorker.cbGameHuType[i] == 1)
                    control['huType'+i].setString('花猪')
                else if (cmdBaseWorker.cbGameHuType[i] == 2)
                    control['huType'+i].setString('自摸')
                else if (cmdBaseWorker.cbGameHuType[i] == 3)
                    control['huType'+i].setString('点炮')
                else if (cmdBaseWorker.cbGameHuType[i] == 4)
                    control['huType'+i].setString('下叫')
                else if (cmdBaseWorker.cbGameHuType[i] == 5)
                    control['huType'+i].setString('未下叫')
            }
            else
               control['huType'+i].setVisible(false) 

            control['huDescribe'+i].setString('')
            if (cmdBaseWorker.endType != 0 && (cmdBaseWorker.cbGameHuType[i] == 2 || cmdBaseWorker.cbGameHuType[i] == 3 || cmdBaseWorker.cbGameHuType[i] == 4 || cmdBaseWorker.lBuChaJia[i]!=0))
            {
                var chrStr = ''
                if (cmdBaseWorker.cbGameHuType[i] == 4)
                     chrStr += "最大可能番："
                 else if (cmdBaseWorker.cbGameHuType[i] == 3 || cmdBaseWorker.cbGameHuType[i] == 2)
                    chrStr += "胡型："
                for (var j = 0; j < map_mask2Name.length; j++) 
                {
                    var chr_type = window[ map_mask2Name[j][0] ] 
                    if (cmdBaseWorker.dwChiHuRight[i] & chr_type)
                    {
                        chrStr += map_mask2Name[j][1] + '  ';
                    }
                }
                if (cmdBaseWorker.lBuChaJia[i] != 0)
                {
                    chrStr += "杠分："
                    chrStr += cmdBaseWorker.lBuChaJia[i]
                }

                control['huDescribe'+i].setString(chrStr)
            }
        }

        if(cmdBaseWorker.endType == 1 || cmdBaseWorker.endType == 0)
        {
            if(cmdBaseWorker.endType == 1)
                control.endType.setSpriteFrame('gendType'+ '0' + '.png')
            else
            { //强退显示荒庄
                control.endType.setSpriteFrame('gendType'+ '1' + '.png')
            }
        }
        else 
        { // 点炮 自摸
            var curChair = tableData.getUserWithUserId(selfdwUserID).wChairID
            var score = cmdBaseWorker.lGameScore[curChair]
            if (score > 0)
                control.endType.setSpriteFrame('gendType' + '5' + '.png') //赢
            else if (score == 0)
                control.endType.setSpriteFrame('gendType' + '6' + '.png') //平
            else
                control.endType.setSpriteFrame('gendType' + '4' + '.png') //输
        }

        for(var i=0;i<GAME_PLAYER;i++)
        {
            var chairid = i
            if(cmdBaseWorker.cbGameHuType[i]==0)
            {
                control['winflag'+i].setVisible(true)
                control['winflag'+i].setSpriteFrame('winFlag_' + '6' + '.png') 
            }
            else
                control['winflag'+i].setVisible(false)
            
            var score = cmdBaseWorker.lGameScore[chairid]
            control['name'+i].setString(szNickName_gameEnd[chairid])
            control['banker'+i].setVisible(cmdBaseWorker.wBankerUser == chairid)
            if(score>0)
            {
                control['scoreTTF'+i].setString('+' + score)
                control['scoreTTF'+i].color = cc.color(255, 0, 0)
                
                var newFrame = 'gend5.png'
                if(cc.isString(newFrame))
                {
                    newFrame = cc.spriteFrameCache.getSpriteFrame(newFrame);
                    cc.assert(newFrame, cc._LogInfos.Sprite_setSpriteFrame)
                }
                control['frame'+i].setSpriteFrame(newFrame)
                control['frame'+i].width = 550
            }
            else
            {
                control['scoreTTF'+i].setString(score==0?'-'+score:score)
                control['scoreTTF'+i].color = cc.color(0, 255, 0)

                var newFrame = 'gend6.png'
                if(cc.isString(newFrame))
                {
                    newFrame = cc.spriteFrameCache.getSpriteFrame(newFrame);
                    cc.assert(newFrame, cc._LogInfos.Sprite_setSpriteFrame)
                }
                control['frame'+i].setSpriteFrame(newFrame)
                control['frame'+i].width = 550
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
                0.5*majiangFactory.down_handWidth*majiangFactory.currentDiscardMjScale*majiangFactory.scale_upDown - 100*majiangFactory.scale_upDown
                
                majiangFactory.currentDiscardMjNode.y = down_handHeight + 0.5*(majiangFactory.mjTableNode.height-up_handHeight-down_handHeight)
                break
            }
            case 2://up
            {
                majiangFactory.currentDiscardMjNode.x = majiangFactory.mjTableNode.width*0.5
                //majiangFactory.currentDiscardMjNode.y = majiangFactory.mjTableNode.height - 0.5*up_handHeight - 10*majiangFactory.scale_rightLeft    
                majiangFactory.currentDiscardMjNode.y = majiangFactory.mjTableNode.height - 0.5*down_handHeight*majiangFactory.currentDiscardMjScale - 40*majiangFactory.scale_rightLeft    
                break
            }
            case 3://left
            {
                majiangFactory.currentDiscardMjNode.x = majiangFactory.left_handWidth*majiangFactory.scale_rightLeft + 
                0.5*majiangFactory.down_handWidth*majiangFactory.currentDiscardMjScale*majiangFactory.scale_upDown + 100*majiangFactory.scale_upDown
                majiangFactory.currentDiscardMjNode.y = down_handHeight + 0.5*(majiangFactory.mjTableNode.height-up_handHeight-down_handHeight)
                break
            }
        }
    },
    showLaizi:function()
    {
        for(var i=0;i<MAX_MAGIC_COUNT;i++)
        {
            var idx = cmdBaseWorker.cbMagicCardData[i]
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
        var isHuPai = false
        for(var i=sortedActions.length-1;i>=0;i--)
        {   
            var btn = null
            var action = sortedActions[i]
            if(action == WIK_CHI_HU)
            {
                isHuPai = true
                btn = playNode.btn_hu
            }
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
            btn.setPositionX(-160 * (sortedActions.length-1-i +1))
            if(btn==playNode.btn_chi)
                break
        }

        if (cmdBaseWorker.cbLeftCardCount <= 4 && isHuPai==true)
            playNode.btn_guo.setVisible(false)
        else
            playNode.btn_guo.setVisible(true)
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
            playNode.playAnimationWithDirection('zim', tableData.getShowChairIdWithServerChairId(winner), call)
            playNode.playGenderEffect('zimo0', tableData.getUserWithChairId(winner).cbGender)
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
                var endNum2_ubanker = getRandNum(1, numSmaller - endNum1_ubanker)  
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
        playNode._removeSprsOnGameEnd()
        playNode.timerNode.setVisible(false)
        playNode.hideLaizi()
        playNode.scoreTTF.setVisible(false)
        playNode.shengYuTTF.setVisible(false)
    },
}

