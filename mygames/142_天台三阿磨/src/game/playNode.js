
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
        majiangFactory.isShowHeap = false
       // majiangFactory.isPublicAnGang = false
        majiangFactory.heapCountOneRow = 26
        majiangFactory.init( playNode.mjTableNode, playNode.decorateMj )


        playNode.timer = majiangTimer4D.getTimer()
        playNode.timerNode.addChild(playNode.timer)
        playNode.timerNode.setScale( majiangFactory.scale_upDown*0.9 )
        playNode.timerNode.setVisible(false)
        //剩余牌数节点
        var posX = playNode.scoreTTF.x;
        var posY = playNode.scoreTTF.y;
        playNode.scoreTTF.removeFromParent()
        playNode.scoreTTF = new ccui.TextAtlas();
        playNode.scoreTTF.setProperty("0", resp.clockNum, 18, 25, "0");
        playNode.scoreTTF.setAnchorPoint(cc.p(0,0.5));
        playNode.scoreTTF.visible = true;
        playNode.scoreTTF.x = posX;
        playNode.scoreTTF.y = posY;
        playNode.topNode.addChild(playNode.scoreTTF);

        //重新调整花牌缩放比例
        if (majiangFactory.scale_flower < 0.4) 
        {
            majiangFactory.scale_flower = majiangFactory.scale_upDown - 0.2
        };

    },
    onReStart:function()
    {
        playNode.handMajiangs4D = []
        playNode.handGroupNode4D = []
        playNode.discardMajiangs4D = []
        playNode.weaveMajiangs4D = []
        playNode.isLookingResult = false
        playNode.isPlaying = false
        //topUINode.setMoPai.setVisible( false )
        cocos.clearInterval(playNode.updateOnFree, playNode.node)
    },
    initCurrentRoundNode:function(currentRoundNode)
    {
        //currentRoundNode是绑定在chair上的一个节点 用于存放当前轮用到的节点
        
        currentRoundNode.flowerMajiangsNode = new cc.Sprite()
        currentRoundNode.flowerMajiangsNode.setScale(1.2)
        currentRoundNode.addChild( currentRoundNode.flowerMajiangsNode )

        currentRoundNode.heapMajiangsNode = new cc.Node()
        currentRoundNode.addChild( currentRoundNode.heapMajiangsNode )
        currentRoundNode.heapMajiangsNode.setVisible(false)
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
        playNode.isPlaying = false
        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)

         if (cmdBaseWorker.cbPlayType == 0  && tableData.createrUserID == selfdwUserID) 
        {
            topUINode.pingCuoSet.setVisible(true)
        }else
            topUINode.pingCuoSet.setVisible(false)

        playNode.onCMD_Ping_Result();
        playNode.onListerMenuShare()

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
    //微信分享函数（本地测试的时候注释掉）
    onListerMenuShare:function()
    {
        return;
        setTimeout(function()
        {
        //var strTitle = wxData.data.share.title;
       // if (cmdBaseWorker.cbPlayType > 0) 
        //    strTitle = wxData.data.share.title + '---' + tableNode.pengSetTTF.getString()
        


        var strTitle = wxData.data.share.title 
        if (cmdBaseWorker.cbPlayType == 1) 
            strTitle = wxData.data.share.title + '-辣子:300' //+ tableNode.pengSetTTF.getString()
        else if(cmdBaseWorker.cbPlayType == 2)
            strTitle = wxData.data.share.title + '-辣子:500' 
        wx.onMenuShareAppMessage({
        title: strTitle,
        //显示是几马和牌局时间
        desc:wxData.data.share.desc,
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
        title: strTitle,
        //显示是几马和牌局时间
        desc: wxData.data.share.desc,
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

      },2000)
    },
    onCMD_SelectMoPai:function()
    {
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        //if(  selfChairId == cmdBaseWorker.wSelectUser && selfChairId <  GAME_PLAYER)
           // topUINode.setMoPai.setVisible( true )
        //else
           // topUINode.setMoPai.setVisible( false )
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)

        //
       /* var takeDir =  tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wTakeCardUser)   
        ///////
        for(var i=0;i<cmdBaseWorker.cbSendCardCount;i++)
        {
            var item = cmdBaseWorker.sendCardArray[i]
            //牌堆
            var heapMajiangsDir = tableData.getShowChairIdWithServerChairId(item.wHeapDir)  
            if(playNode.heapMajiangs4D[heapMajiangsDir]  )
                majiangFactory.deleteHeapMajiangs(playNode.heapMajiangs4D[heapMajiangsDir], [item.wHeapPos])
            //手牌
            if(item.cbCardData == SEND_DISCARD_CARD_DATA)//丢弃牌
                continue
            var idx = isSelf?item.cbCardData:0
            majiangFactory.addHandMajiang(playNode.handMajiangs4D[takeDir], takeDir, idx, playNode.handGroupNode4D[takeDir], playNode.weaveMajiangs4D[takeDir].length)
        }
        */
    },
    onCMD_StatusPlay:function() 
    {
        playNode.onCMD_Ping_Result();
        topUINode.pingCuoSet.setVisible(false)
        playNode.updateTableSeat()
        playNode.isPlaying = true
      //  playNode.onCMD_SelectMoPai()
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        //if(  selfChairId == cmdBaseWorker.wSelectUser && selfChairId <  GAME_PLAYER)
          //  topUINode.setMoPai.setVisible( true )
       // else
          //  topUINode.setMoPai.setVisible( false )
        playNode.scoreTTF.setString(cmdBaseWorker.cbLeftCardCount)
        //
        tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
        
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
        //playNode.initFenwei()
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
        playNode.timerNode.setVisible(true)

        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var i=0;i<GAME_PLAYER;i++)
        {
            playNode.setSeatFeng(i)
            //var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
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
            playNode.showActionBtns(sortedActions,false)

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
        // console.log(6666, handIdxsArray, discardIdxsArray, weaveItemArray)
        cmdBaseWorker.sortHandIdxs(handIdxsArray[0][0]) 
        // get heapIdxsArray
        var heapIdxsArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)
        
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        

        //重新排花牌数组
        var tempFlowerCards = []
        for( var i = 0 ; i < GAME_PLAYER;i++ )
        {
           tempFlowerCards[i] = cmdBaseWorker.cbPlayerFlowerCardData[i].slice(0, cmdBaseWorker.cbPlayerFlowerCardData[i].length)
        }
        

        for( var i = 0 ; i < GAME_PLAYER;i++ )
        {
            var chairId = tableData.getShowChairIdWithServerChairId(i)
            cmdBaseWorker.cbPlayerFlowerCardData[ chairId ] = tempFlowerCards[i] 
            
        }

        playNode.sendCardsAction(handIdxsArray, discardIdxsArray, weaveItemArray, heapIdxsArray, cmdBaseWorker.cbPlayerFlowerCardData) 
        
        /////摸到麻将时有可能出现杠听胡补花
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(sortedActions,false)  //自摸杠 idx不确定 需要searchGangIdxs

        playNode.buHuaCheck();
        
    },
    onCMD_UpdataData:function()
    {
        if ( cmdBaseWorker.wCurrentUser != INVALID_CHAIR ) 
        {
            playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
            //playNode.timerNode.setVisible(true)
        }else
        {
            playNode.timer.switchTimer([])
        }
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
    updateTableSeat:function()
    {
        return
        playNode.tableSeats = []
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        if ( selfChairId == 0 || selfChairId == INVALID_CHAIR){
            playNode.tableSeats = [0,1,2]
        }else if( selfChairId == 1 ){
            playNode.tableSeats = [0,1,3]
        }else if( selfChairId == 2 )
        {
            playNode.tableSeats = [0,2,3]
        }
    },
    onCMD_GameStart:function() 
    {
        //playNode.buHuaCheck();
        topUINode.pingCuoSet.setVisible(false)
        playNode.updateTableSeat()
        playNode.resetPlayNode()
        playNode.timerNode.setVisible(false)
        //topUINode.setMoPai.setVisible( false )
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
        for(var i=0;i<GAME_PLAYER;i++)
        {
            playNode.setSeatFeng(i)
            //var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
           // user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] )
        }

        //get handIdxsArray
        var handIdxsArray = []
        for(var i=0;i<GAME_PLAYER_SHOW;i++)
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
            playNode.showLaizi()
            playNode.timer.initFenwei( bankerShowChairid )
            //playNode.initFenwei()
            playNode.timerNode.setVisible(true)

            playNode.setCurrentRoundNodesVisible(true)
            playNode.actionBtns.setVisible(true)
            managerTouch.openTouch()

            //if ( isRecordScene )
            //managerTouch.closeTouch() //避免在不知道牌的情况下 把牌打出去

        }

        function bankerPlayDice()
        {
            tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
            var siceNum1 = cmdBaseWorker.cbSiceCount1   //getRandNum(Math.max(cmdBaseWorker.cbSiceCount-6, 1), Math.min(cmdBaseWorker.cbSiceCount-1, 6))
            var siceNum2 = cmdBaseWorker.cbSiceCount2   //cmdBaseWorker.cbSiceCount - siceNum1
            playNode.playDiceOneDirection(gameStart, siceNum1, siceNum2, bankerShowChairid)
        }
        
        cmdBaseWorker.bIsRandBanker = !(cmdBaseWorker.cbSBankCount1 == 0);
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
        playNode.hideActionBtns();
        
        playNode.timer.switchTimer([])
        playNode.playMajiangEffect(outIdx, outUser.cbGender)
        managerAudio.playEffect('gameRes/sound/discard.mp3')

        var majiangs = playNode.handMajiangs4D[outDir]
        if(outUser.dwUserID==selfdwUserID|| isRecordScene)
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
            playNode.showActionBtns(sortedActions,false)
       // else
       //     playNode.buHuaCheck();

        /*//从服务器判断谁该选择是否摸牌
        var isSelf = tableData.getUserWithChairId(cmdBaseWorker.wTakeCardUser).dwUserID == selfdwUserID
        if(cmdBaseWorker.cbLeftCardCount - 1 == cmdBaseWorker.cbEndLeftCount && isSelf)
            topUINode.setMoPai.setVisible( true )
        else
            topUINode.setMoPai.setVisible( false )*/
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
            if(playNode.heapMajiangs4D[heapMajiangsDir]  )
                majiangFactory.deleteHeapMajiangs(playNode.heapMajiangs4D[heapMajiangsDir], [item.wHeapPos])
            //手牌
            if(item.cbCardData == SEND_DISCARD_CARD_DATA)//丢弃牌
                continue
            var idx = (isSelf||isRecordScene)?item.cbCardData:0
            majiangFactory.addHandMajiang(playNode.handMajiangs4D[takeDir], takeDir, idx, playNode.handGroupNode4D[takeDir], playNode.weaveMajiangs4D[takeDir].length)
        }

        /////摸到麻将时有可能出现杠听胡补花
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)

        if(sortedActions.length>0)
            playNode.showActionBtns(sortedActions,false)  //自摸杠 idx不确定 需要searchGangIdxs
        //else
            playNode.buHuaCheck();
    },
    onCMD_OperateNotify:function() 
    {
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var idx = cmdBaseWorker.cbProvideCardData
        playNode.showActionBtns( sortedActions,true)
    },
    onCMD_Ping_Result:function()
    {
        if (cmdBaseWorker.cbPlayType == 2) 
            tableNode.pengSetTTF.setString('辣子:500')
        else
            tableNode.pengSetTTF.setString('辣子:300')  
        playNode.onListerMenuShare()
    },
    onCMD_OperateResult:function() 
    {
        majiangFactory.chooseItemsNode.removeAllChildren()
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
            var curChair = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOperateUser)
            //
            var flowerMajiangs = playNode.flowerMajiangs4D[curChair]
            for(var j=0;j<flowerMajiangs.length;j++)
            {
                var mj = flowerMajiangs[j]
                var mjFace = mj.getChildByTag(101)
                var textureName = 'mfNew_'+ mj.cardData + '.png'
                mjFace.setSpriteFrame( textureName )
               // flowerMajiangsNode.addChild(mj)
            }
            //
            playNode.playAction(cmdBaseWorker.cbOperateCode, operateUser)

            //外部添加杠牌的标记
            
            var curNum = playNode.weaveMajiangs4D[curChair].length
            //if ( markName>0 )
            //{
                for(var i = 0;i<curNum;i++)
                {
                    var curWeave = playNode.weaveMajiangs4D[curChair][i]
                    var markName = cmdBaseWorker.cbWeaveGangType[cmdBaseWorker.wOperateUser][i]
                    if ( curWeave.cbWeaveKind == WIK_GANG && curWeave[1].cardData >0 && markName>0 && curWeave[3]&&!curWeave[3].getChildByTag(110)) 
                    {
                        playNode.addGangMark(curWeave[3],markName)
                        break;
                    };
                };
            //};

        }
        
        ///动作后动作 要把wProvideUser cbProvideCardData 归零
        var sortedActions = majiangLogic.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
        {
            cmdBaseWorker.wProvideUser    = INVALID_CHAIR
            cmdBaseWorker.cbProvideCardData  = INVALID_CARD_DATA
            playNode.showActionBtns(sortedActions,false)  //吃碰后杠 idx不确定 需要searchGangIdxs
        }
        //else
        {
            //playNode.buHuaCheck();
        }
    },
    onCMD_GameEnd:function() 
    {
        playNode.tableSeats = []
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        if ( selfChairId == 0 || selfChairId == INVALID_CHAIR){
            playNode.tableSeats = [0,1,2]
        }else if( selfChairId == 1 ){
            playNode.tableSeats = [0,1,3]
        }else if( selfChairId == 2 )
        {
            playNode.tableSeats = [0,2,3]
        }

        playNode.gamesetNode.setVisible(false)
        //topUINode.setMoPai.setVisible( false )
        playNode.isPlaying = false

        //var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
        //record.szTableKey = tableKey
        //socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)

        //
         setTimeout(function()
         {
             var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
             record.szTableKey = tableKey
             socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
         },2000)
        //
        playNode.isLookingResult = true   
        playNode.hideActionBtns()

        cocos.setInterval(playNode.updateOnFree, 1000, playNode.node)

        /*var szNickName_gameEnd = []
        for(var i=0;i<GAME_PLAYER;i++)
        {
            var user = tableData.getUserWithChairId(i)
            if(user)
                szNickName_gameEnd[i] = user.szNickName
        }*/
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
            var isAllowOut = !(!MAGIC_CARD_ALLOWOUT && cmdBaseWorker.isMagicCard(majiang.cardData, cmdBaseWorker.cbMagicCardData) ) && cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
            
          
         //   if(isAllowOut)
            {

                cmdBaseWorker.wCurrentUser = INVALID_WORD

                var OutCard = getObjWithStructName('CMD_C_OutCard')
                OutCard.cbOutCardData = majiang.cardData
                socket.sendMessage(MDM_GF_GAME,SUB_C_OUT_CARD,OutCard)
               // playNode.hideActionBtns()
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
        SERVER_CHAIR = 4
        playNode.handGroupNode4D = majiangFactory.getHandGroupNodes(handMajiangs, touchEndCalls)
        SERVER_CHAIR = 3
    },
    resetFlowerScale:function()
    {

        return ;
        var test = majiangFactory.scale_flower
        for( var direction=0;direction<GAME_PLAYER_SHOW;direction++)
            {
                var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)

                if (!user) 
                {
                    continue;
                };
                var flowerMajiangsNode = user.userNodeInsetChair.currentRoundNode.flowerMajiangsNode
                var fScalse = playNode.flowerMajiangs4D[direction][i].getScale()
                if (fScalse < 0.5) 
                {
                    flowerMajiangsNode.scale()
                };
            }
        ///////////////////////////////
        var handScale = playNode.handMajiangs4D[0][0][0].getScale()-0.2
        for( var direction=0;direction<GAME_PLAYER_SHOW;direction++)
        {
           // var distance = 0;
            if ( playNode.flowerMajiangs4D[direction].length ) {};
           // if (playNode.flowerMajiangs4D[direction].length > 1) 
           // {
            //    distance = playNode.flowerMajiangs4D[direction][1].x
            //};
            for( var i = 0; i < playNode.flowerMajiangs4D[direction].length; i++ )
            {
                var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)

                if (!user) 
                {
                    continue;
                };
                //var flowerMajiangsNode = user.userNodeInsetChair.currentRoundNode.flowerMajiangsNode

                var fScalse = playNode.flowerMajiangs4D[direction][i].getScale()
                playNode.flowerMajiangs4D[direction][i].setScale(handScale)
                playNode.flowerMajiangs4D[direction][i].x = playNode.flowerMajiangs4D[direction][i].x*(1+handScale-fScalse)
            }
        }
    },
    sendCardsAction:function(handIdxsArray, discardIdxsArray, weaveItemArray, heapIdxsArray, flowerIdxsArray)
    {   
        // flowerIdxsArray = [ [0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48],[0x41,0x42,0x43,0x44,0x45,0x46,0x47,0x48] ]
        // heapIdxsArray = [ [1,0,0,0,0,0,0,0,0,0,0,0,0,0],[],[],[] ]
        // discardIdxsArray = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]
        // weaveIdxsArray = [[[1,2,3,4],[2,3,4],[4,5,6],[7,8,1]],[],[[1,2,3],[2,3,4,5],[4,5,6],[7,8,1]],[]]
        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)

        SERVER_CHAIR = 4
        playNode.flowerMajiangs4D = majiangFactory.getFlowerMajiangsArray(flowerIdxsArray)
        playNode.heapMajiangs4D = majiangFactory.getHeapMajiangsArray(heapIdxsArray)
        playNode.handMajiangs4D = majiangFactory.getHandMajiangsArray(handIdxsArray, tableData.getUserWithUserId(selfdwUserID).wChairID == INVALID_WORD)
        playNode.discardMajiangs4D = majiangFactory.getDiscardMajiangsArray(discardIdxsArray)

        playNode.resetFlowerScale()
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
        SERVER_CHAIR = 3
        playNode._getHandMajiangsGroupNode()


        var self = tableData.getUserWithUserId(selfdwUserID)
        for(var showChairid=0;showChairid<GAME_PLAYER_SHOW;showChairid++)
        {
            var direction = showChairid//playNode.tableSeats[showChairid]// showChairid
            var chairid = tableData.getServerChairIdWithShowChairId(direction)

            var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)

            if (!user) 
            {
                continue;
            };
            var flowerMajiangsNode = user.userNodeInsetChair.currentRoundNode.flowerMajiangsNode
            var heapMajiangsNode = user.userNodeInsetChair.currentRoundNode.heapMajiangsNode
            var handMajiangsNode = user.userNodeInsetChair.currentRoundNode.handMajiangsNode
            var discardMajiangsNode = user.userNodeInsetChair.currentRoundNode.discardMajiangsNode
            var weaveMajiangsNode = user.userNodeInsetChair.currentRoundNode.weaveMajiangsNode

            var flowerMajiangs = playNode.flowerMajiangs4D[direction]
            for(var j=0;j<flowerMajiangs.length;j++)
            {
                var mj = flowerMajiangs[j]
                var mjFace = mj.getChildByTag(101)
                var textureName = 'mfNew_'+ mj.cardData + '.png'
                mjFace.setSpriteFrame( textureName )
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

                     //加标记
                    var markName = cmdBaseWorker.cbWeaveGangType[chairid][groupIdx]
                    if ( markName>0 && idxInGroup == 3) 
                    {
                        playNode.addGangMark(mj,markName)
                    };

                } 
            }

            handMajiangsNode.addChild(playNode.handGroupNode4D[direction])
        }

    },
    addGangMark:function(mj,markName)
    {
        var gangNames = []
        gangNames[1] =  "#gangFlag1.png"
        gangNames[3] =  "#gangFlag2.png"

        if (!gangNames[markName] )
            return 
        
        var mark = new cc.Sprite(gangNames[markName])
        var scale =0.5
        mark.setScaleX( mj.getScale()*scale )
        mark.setScaleY( mj.getScale()*scale )
        mark.x = mj.width*mj.getScale()*0.5;
        mark.y = -mark.height*mark.getScale()*0.1;
        mark.setTag(110)
        //mark.setRotation(mj.getRotation())
        mj.addChild(mark)
        return mark;
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

        for(var showChairid=0;showChairid<GAME_PLAYER;showChairid++)
        {
            var direction =  playNode.tableSeats[showChairid]
            var chairid = tableData.getServerChairIdWithShowChairId(direction)

            displayHandIdxsArray[showChairid] = [cmdBaseWorker.cbHandCardData[chairid].slice(0, cmdBaseWorker.cbHandCardCount[chairid]), null]

            if(cmdBaseWorker.wWinner == chairid)
            {   
                var displayHandIdxs = displayHandIdxsArray[showChairid]
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

        for(var showChairid=0;showChairid<GAME_PLAYER;showChairid++)
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
        for(var chairId=0;chairId<GAME_PLAYER_SHOW;chairId++)
        {   
            var user = tableData.getUserWithTableIdAndChairId(null, chairId)
            if(user)
                playNode.clearCurrentRoundNode(user.userNodeInsetChair.currentRoundNode)
        }
    },
    popGameEnd:function(continueCall, userData_gameEnd)
    {

        for(wChairID=0;wChairID<GAME_PLAYER;wChairID++)
        {
            var weaveItems = cmdBaseWorker.WeaveItemArray[wChairID]
            for(var groupIdx=0;groupIdx<weaveItems.length;groupIdx++)
            {
                var weaveItem = weaveItems[groupIdx]
                if(weaveItem.cbWeaveKind == WIK_NULL)
                    continue
                weaveItem.cbCardDatas = weaveItem.cbCardData
            }
        }


        var control = {}
        control.continueCall = function()
        {
            continueCall()
            node.removeFromParent()
        }
        var node  = managerRes.loadCCB(resp.gameEndPopCCB, control)

        playNode.gameEndControl = control

        control.gendTitle.setSpriteFrame('gendTitle'+cmdBaseWorker.endType + '.png')

        
        for(var showChairid=0;showChairid<GAME_PLAYER;showChairid++)
        {
            var direction =  playNode.tableSeats[showChairid]
            var wChairID = tableData.getServerChairIdWithShowChairId(direction)

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

          //  var dir = (wChairID-cmdBaseWorker.wBankerUser+GAME_PLAYER)%4    //
            var fengPos = playNode.getUserFeng( wChairID ) - 27
            var dirSpr = new cc.Sprite('#gendDir' + fengPos + '.png')           //
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


            //胡型 胡数
            var resultTTF = cc.LabelTTF.create('', "Helvetica", 16)
            resultTTF.setFontFillColor( cc.color(244, 230, 159) )
            var chrStr = '胡数：底胡'

            //底胡
            var diHuNum = 20
            if (cmdBaseWorker.cbPlayType == 2) 
            {
                diHuNum = 30
            };
            chrStr += diHuNum + ' ';
            //花胡
            if( cmdBaseWorker.cbHuaScore[wChairID] > 0 )
            {
                chrStr += '花牌' + cmdBaseWorker.cbHuaScore[wChairID] + ' '
            }
            //刻子
            if ( cmdBaseWorker.cbKeScore[wChairID] > 0 ) 
            {
                chrStr += '刻子' + cmdBaseWorker.cbKeScore[wChairID] + ''
            };
            //杠牌
            if ( cmdBaseWorker.cbGangScore[wChairID] > 0 ) 
            {
                chrStr += '杠牌' + cmdBaseWorker.cbGangScore[wChairID] + ''
            };
            //碰牌
            if ( cmdBaseWorker.cbPengScore[wChairID] > 0  ) 
            {
                chrStr += '碰牌' + cmdBaseWorker.cbPengScore[wChairID] + ''
            };
            //对子
            if ( cmdBaseWorker.cbDuiZiScore[wChairID] > 0 ) 
            {
                chrStr += '对子' + cmdBaseWorker.cbDuiZiScore[wChairID]
            };
            
            for (var i = 0; i < map_mask2NameHu.length; i++) 
            {
                var chr_type = window[ map_mask2NameHu[i][0] ] 
                if (cmdBaseWorker.dwChiHuRight[wChairID] & chr_type)
                {
                    chrStr += map_mask2NameHu[i][1] + ' ';
                }
            }

            //总胡数
            chrStr += '（总计' + cmdBaseWorker.cbTotolScore[wChairID] +'胡）'
            resultTTF.setString(chrStr)
            resultTTF.anchorX = 0
            resultTTF.x = 102
            resultTTF.y = -10
            gendBar.addChild(resultTTF)
            //胡型 番数----------------
            var resultTTFFan = cc.LabelTTF.create('', "Helvetica", 16)
            resultTTFFan.setFontFillColor( cc.color(244, 230, 159) )
            var fanStr = '番数：'

            
            //花番
            if( cmdBaseWorker.cbHuaFan[wChairID] > 0 )
            {
                fanStr += '花牌' + cmdBaseWorker.cbHuaFan[wChairID] + ' '
            }
            

            for (var i = 0; i < map_mask2NameFan.length; i++) 
            {
                var chr_type = window[ map_mask2NameFan[i][0] ] 
                if (cmdBaseWorker.dwChiHuRight[wChairID] & chr_type)
                {
                    fanStr += map_mask2NameFan[i][1] + ' ';
                }
            }
            if (fanStr == '番数：') 
            {
                fanStr = ""
            };
            resultTTFFan.setString(fanStr)
            resultTTFFan.anchorX = 0
            resultTTFFan.x = 102
            resultTTFFan.y = -37
            gendBar.addChild(resultTTFFan)

            if (cmdBaseWorker.dwChiHuRight[wChairID] == 0) 
            {
                resultTTF.setString('')
                resultTTFFan.setString('')
            };
            //-------------------------


            //显示麻将fl
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
                groupLen += 1
                if(weaveItem.cbWeaveKind!=WIK_GANG)
                    weaveItem.cbCardDatas = weaveItem.cbCardDatas.slice(0, 3)

                weaveItem.provideDirection = 0//这样就不显示箭头了
                var majiangsOneGroup = majiangFactory.weaveItem2Majiangs(groupIdx, 0, weaveItem, true, true)
                
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
                if(cardData == 0)
                    continue;
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

            ///花牌
            /*
            var flowersNode = new cc.Node()
            flowersNode.scale = 0.9
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
            */

            var huaNames = []
            huaNames[53] =  "中"
            huaNames[54] =  "发"
            huaNames[55] =  "白"
            huaNames[65] =  "春"
            huaNames[66] =  "夏"
            huaNames[67] =  "秋"
            huaNames[68] =  "冬"
            huaNames[69] =  "梅"
            huaNames[70] =  "兰"
            huaNames[71] =  "菊"
            huaNames[72] =  "竹"

            for(var i = 0;i<MAX_FLOWER_COUNT;i++)
            {
                if(cmdBaseWorker.cbPlayerFlowerCardData[wChairID][i]>0 && cmdBaseWorker.cbPlayerFlowerCardData[wChairID][i]<100)
                {
                    var huaCards = huaNames[cmdBaseWorker.cbPlayerFlowerCardData[wChairID][i] ]
                    var huaText = cc.LabelTTF.create('', "Helvetica", 18)
                    if (playNode.isMenFeng(playNode.getUserFeng(wChairID),cmdBaseWorker.cbPlayerFlowerCardData[wChairID][i]))
                        huaText.setFontFillColor( cc.color(66, 255, 0, 255) )
                    else
                        huaText.setFontFillColor( cc.color(288, 161, 0, 255) )
                    huaText.setString(huaCards);
                    huaText.x = (i) * 40 +100
                    huaText.y = 20
                    gendBar.addChild(huaText)
                }
            }


            ///////////
            if(wChairID==cmdBaseWorker.wExitUser)
                control['winflag'+wChairID].setSpriteFrame('gendFlag0.png') 
            else if(cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU)
                control['winflag'+wChairID].setSpriteFrame('gendFlag1.png') 
            else if(wChairID==cmdBaseWorker.wProvideUser && cmdBaseWorker.endType > 1) //且不是流局或强退
                control['winflag'+wChairID].setSpriteFrame('gendFlag2.png') 
            else
                control['winflag'+wChairID].setSpriteFrame('empty.png') 
            
            //流局
            if ( cmdBaseWorker.endType == 1 ) 
            {
                control['winflag'+wChairID].setVisible(false);
            };
            control['taiTTF'+wChairID].setString((cmdBaseWorker.IGameScoreRe[wChairID]>0?'+':'') + cmdBaseWorker.IGameScoreRe[wChairID]) 
            control['taiTTF'+wChairID].setVisible(true)
            control['fenTTF'+wChairID].setString((cmdBaseWorker.lGameScore[wChairID]>0?'+':'') + cmdBaseWorker.lGameScore[wChairID]) 

        }
       
        mainScene.top.addChild(node) 
    },
    addAPlayerCard:function(index,cParent)
    {
        var direction = index
        var chairid = tableData.getServerChairIdWithShowChairId(direction)
        var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)
        var weaveItems = cmdBaseWorker.WeaveItemArray[chairid]
        var cardIndex = -1
        var sPosX = 160-150 + 5
        var oPosY = 20

        /*var fanText = cc.LabelTTF.create('', "Helvetica", 24)
        fanText.setFontFillColor( cc.color(255, 255, 255, 255) )
        fanText.setString(cmdBaseWorker.cbIGameFan[chairid] + "台")
        fanText.x = 0*40 +160+5;
        fanText.y = 85
        cParent.addChild(fanText)
*/
        
        var huaNames = []
        huaNames[53] =  "中"
        huaNames[54] =  "发"
        huaNames[55] =  "白"
        huaNames[65] =  "春"
        huaNames[66] =  "夏"
        huaNames[67] =  "秋"
        huaNames[68] =  "冬"
        huaNames[69] =  "梅"
        huaNames[70] =  "兰"
        huaNames[71] =  "菊"
        huaNames[72] =  "竹"

        for(var i = 0;i<MAX_FLOWER_COUNT;i++)
        {
            if(cmdBaseWorker.cbPlayerFlowerCardData[chairid][i]>0 && cmdBaseWorker.cbPlayerFlowerCardData[chairid][i]<100)
            {
                var huaCards = huaNames[cmdBaseWorker.cbPlayerFlowerCardData[chairid][i] ]
                var huaText = cc.LabelTTF.create('', "Helvetica", 24)
                if (playNode.isMenFeng(playNode.getUserFeng(chairid),cmdBaseWorker.cbPlayerFlowerCardData[chairid][i]))
                    huaText.setFontFillColor( cc.color(255, 0, 36, 255) )
                else
                    huaText.setFontFillColor( cc.color(255, 127, 36, 255) )
                huaText.setString(huaCards);
                huaText.x = (i) * 40 +160
                huaText.y = 80
                cParent.addChild(huaText)
            }
        }
        //////
        if (cmdBaseWorker.cbProvideCardData != 0) cmdBaseWorker.cbEndCard = cmdBaseWorker.cbProvideCardData;
        for(var i = 0;i<MAX_WEAVE;i++)
        {
            var midPos = 0;
            for(var j = 0;j<4;j++){
            if (j == 0 ) cardIndex+=0.3
           
            var cardIdx = weaveItems[i].cbCardData[j]
            if(j<3&&cardIdx==0)
            {
                cardIdx = weaveItems[i].cbCenterCardData
            }
            if (cardIdx>0) {
                var aCard
                if (weaveItems[i].cbPublicCard == false && j < 3){
                    aCard = new cc.Sprite('#down_discard0.png')
                    aCard.setScale(0.96+0.2)
                }
                else{
                    aCard = majiangFactory.getOne(cardIdx, 1, 0, true)
                    aCard.setScale(1+0.2)
                }
                aCard.setLocalZOrder(-1)
                if (j == 3 ) 
                {
                    cardIndex -=2;
                    aCard.x = midPos//sPosX+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                    aCard.y = oPosY +10
                    cardIndex++

                    var markName = cmdBaseWorker.cbWeaveGangType[chairid][i]
                    if ( markName>0 && aCard)
                    {
                        playNode.addGangMark(aCard,markName)
                    };


                }else{
                    aCard.x = sPosX+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                    aCard.y = oPosY
                    if (j == 1) 
                    {
                        midPos = aCard.x
                    };
                }
                
              //  if (!(isQiang && cardIdx == cmdBaseWorker.cbProvideCard)) 
                    cParent.addChild(aCard)
                cardIndex++;
            };
        }
        }
        if (cardIndex<1) {cardIndex-=1};
        cardIndex += 0.2;
        for(var i = 0;i<MAX_COUNT;i++)
        {
            var cardIdx = cmdBaseWorker.cbHandCardData[chairid][i]
            if (cardIdx>0 ) 
            {

                var aCard = majiangFactory.getOne(cardIdx, 1, 0, true)
                aCard.setScale(1+0.2)
                aCard.setLocalZOrder(-1)
                aCard.x = sPosX+( cardIndex+1 )*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                aCard.y = oPosY
                if (cardIdx == cmdBaseWorker.cbEndCard && cmdBaseWorker.cbHandCardCount[chairid] + cmdBaseWorker.cbWeaveCount[chairid]*3 == MAX_COUNT) 
                {
                    cardIndex--
                    cmdBaseWorker.cbHandCardCount[chairid]--;
                    aCard.x = sPosX+( MAX_COUNT+1.5)*(aCard.getContentSize().width*aCard.getScale() - 2), aCard.getContentSize().height /2 *aCard.getScale()  
                };
                cParent.addChild(aCard)
                cardIndex++;
            };
        }
        
            
        
    },
    switchSpriteImg:function( newFrameName )
    {
        var newFrame 
        if(cc.isString(newFrameName))
        {
            newFrame = cc.spriteFrameCache.getSpriteFrame(newFrameName);
            cc.assert(newFrame, cc._LogInfos.Sprite_setSpriteFrame)
        }
        return newFrame
    },
    //本局风位
    initFenwei:function()
    {
        
        var bg = playNode.timer.children[0] 

        for(var i=0;i<GAME_PLAYER;i++)
        {
            var chairId =  tableData.getServerChairIdWithShowChairId(i)
            var fengPos = playNode.getUserFeng( chairId ) - 27

            var curChairNormal = bg.children[i+1]
            curChairNormal.setSpriteFrame('normal_' + fengPos + '.png')

            var curLightNode = playNode.timer.children[i+1]
            var curChairLight = curLightNode.children[1]
            curChairLight.setSpriteFrame('light_' + fengPos + '.png')    
        }

        var lastFeng = 0
        for(var n = 0 ;n < 4;n++)
        {
            var isHave = false
            for(var i=0;i<GAME_PLAYER;i++)
            {
                var chairId =  tableData.getServerChairIdWithShowChairId(i)
                var fengPos = playNode.getUserFeng( chairId ) - 27
                if (n == fengPos) 
                {
                    isHave = true;
                    break;
                };
            } 
            if (!isHave) 
            {
                var curChairNormal = bg.children[3+1]
                curChairNormal.setSpriteFrame('normal_' + n + '.png') 

                var curLightNode = playNode.timer.children[3+1]
                var curChairLight = curLightNode.children[1]
                curChairLight.setSpriteFrame('light_' + n + '.png') 

                break;   
            };

        }
    }
    ,
    isMenFeng:function(cbCardData,cbCurCard)
    {
        var fengWei = cbCardData-27;
        var direction = []
        direction[0] = []
        direction[1] = []
        direction[2] = []
        direction[3] = []
        direction[0][0] =65;
        direction[0][1] =69;
        direction[0][2] =49;

        direction[1][0] =66;
        direction[1][1] =70;
        direction[1][2] =50;

        direction[2][0] =67;
        direction[2][1] =71;
        direction[2][2] =51;

        direction[3][0] =68;
        direction[3][1] =72;
        direction[3][2] =52;

        for (var j = 0;j<3;j++)
        {
            if (direction[fengWei][j] == (cbCurCard) )
            {
                return true;
            }
        }
        return false;
    },
    getUserFeng:function(wChairID)
    {
        var changeChair = wChairID - cmdBaseWorker.wBankerUser 
        if (changeChair>=0)
            return 27 + changeChair;
        else
            return 27 + (4 + changeChair);
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

       // playNode.gamesetNode.setVisible(true)
    },
    setSeatFeng:function(wChairID)
    {
        var tabelId = tableData.getUserWithUserId(selfdwUserID).wTableID
        var user = tableData.getUserWithTableIdAndChairId(tabelId, wChairID)
        
        if (! user) return;
        if (! user.userNodeInsetChair)return;
        if (! user.userNodeInsetChair.dingNode) 
        {
            user.userNodeInsetChair.dingNode = new cc.Node();
            user.userNodeInsetChair.addChild(user.userNodeInsetChair.dingNode);
        };

        var fNames = []
        fNames[0] = "#bankerIcon.png"
        fNames[1] = "#img_nan.png"
        fNames[2] = "#img_xi.png"
        fNames[3] = "#img_bei.png"


        var fIcon = new cc.Sprite(fNames[playNode.getUserFeng(wChairID)-27])
        //fIcon.x = 25;
        //fIcon.y = 25
        user.userNodeInsetChair.bankerNode.addChild(fIcon);
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
        playNode.laiziNode.setVisible(true)
        for(var i=0;i<TURNOVER_COUNT_MAGIC;i++)
        {
            var idx = 55
            if(idx == INVALID_CARD_DATA)
                continue
            //var bg = new cc.Sprite('#bg_top.png')
            //bg.x = 50*i + 25
            //bg.y = - 30
            var mj = majiangFactory.getOne(idx, 1, 0, true)
            mj.setScale(1.3)
            mj.x = playNode.laiziNode.width/2;// 50*i + 25
            mj.y = playNode.laiziNode.height/2;//- 30
           // mj.setScaleX(mj.width/playNode.laiziNode.width)
           // mj.setScaleY(mj.height/playNode.laiziNode.height)

            //playNode.laiziNode.addChild(bg)
            playNode.laiziNode.addChild(mj)
            playNode.laiziNode.setScale(1.1)
        }
        var feng= []
        feng[0] = "东圈风"
        feng[1] = "南圈风" 
        feng[2] = "西圈风" 
        feng[3] = "北圈风" 
       // playNode.fengTTF.setVisible(true)
       // playNode.fengTTF.setString(feng[cmdBaseWorker.cbFengPos])
    },
    hideLaizi:function()
    {
        //playNode.fengTTF.setVisible(false)
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
        playNode.btn_guo.setVisible(false)
        playNode.btn_chi.setVisible(false)
        playNode.btn_peng.setVisible(false)
        playNode.btn_gang.setVisible(false)
        playNode.btn_ting.setVisible(false)
        playNode.btn_hu.setVisible(false)
    },
    buHuaCheck:function()
    {
        return
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        if (selfChairId==INVALID_CHAIR) {return;};


        //开局不补花
        if ( cmdBaseWorker.cbLeftCardCount >= ( MAX_REPERTORY - 13*3 - 1 )  ) 
        {
            return 
        };
        //
        
        var operateCards = []
        for (var i = 0; i < MAX_COUNT; i++)
        {
            var card = playNode.handMajiangs4D[0][0][i]
            if(!card ) 
                continue;
            if(cmdBaseWorker.isFlowerCard(card.cardData, cmdBaseWorker.cbFlowerCardData))
                        operateCards[operateCards.length] = card.cardData
        }

        var lastCard = playNode.handMajiangs4D[0][1]
        if ( lastCard && cmdBaseWorker.isFlowerCard(lastCard.cardData, cmdBaseWorker.cbFlowerCardData) ) 
        {
            operateCards[operateCards.length] = lastCard.cardData
        };

        if (operateCards.length>0) 
        {
            cmdBaseWorker.sendMessage_replace(operateCards)
            
        };
    },
    showActionBtns:function(sortedActions,highWin)
    {
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        if (selfChairId>3) 
            return;

        for(var i=sortedActions.length-1;i>=0;i--)
        {
            if(sortedActions[i] == WIK_REPLACE)
            {
                var self = tableData.getUserWithUserId(selfdwUserID)
                var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
                var handMajiangs = playNode.handMajiangs4D[selfDir]
                if (! handMajiangs)
                    return;
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
       //  if ( cmdBaseWorker.cbOutCardCount == 0 && !highWin ) 
       // {
       //    // return
       // };
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
            playNode.playAnimationWithDirection('zim', tableData.getShowChairIdWithServerChairId(winner), call)
            playNode.playGenderEffect('zimo0', tableData.getUserWithChairId(winner).cbGender)
        }
        else if(cmdBaseWorker.endType == 3)
        {
            playNode.playGenderEffect('hu0', tableData.getUserWithChairId(winner).cbGender)
            //一炮多响时动画播多家
            for(var wChairID=0;wChairID<GAME_PLAYER;wChairID++)
            {
                //var direction = showChairid
               // var wChairID = tableData.getServerChairIdWithShowChairId(showChairid)
                if ( cmdBaseWorker.dwChiHuRight[wChairID] > 0  ) 
                {
                    playNode.playAnimationWithDirection('hu', tableData.getShowChairIdWithServerChairId(wChairID))
                    playNode.playActionEffect('hu0', tableData.getUserWithChairId(wChairID).cbGender)
                };
            }
            //多响时一个弹出就够了
            playNode.playAnimationWithDirection('dp', tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser),call)
            /*
            playNode.playAnimationWithDirection('hu', tableData.getShowChairIdWithServerChairId(winner), call)
            playNode.playAnimationWithDirection('dp', tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser))
            playNode.playActionEffect('hu', tableData.getUserWithChairId(winner).cbGender)*/
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
        var names = []
            names[0] = "65"
            names[1] = "66"
            names[2] = "67"
            names[3] = "68"
            names[4] = "69"
            names[5] = "70"
            names[6] = "71"
            names[7] = "72"
        
        for(var i = 0;i<8;i++)
        {
            if(name == names[i])
                return
        }
       
        var resPrefix = 'gameRes/sound/' + (isOpenPTH?'pth':'fy')
        var suffix = isOpenPTH?'.mp3':'.mp3'
        if(isMan)
            managerAudio.playEffect(resPrefix + '/man/' + name + suffix)
        else
            managerAudio.playEffect(resPrefix + '/woman/' + name + suffix) 
    },
    playAnimationWithDirection:function(name, direction, call)
    {
        if(!true)
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
            //if(direction == 3)
                playNode.playDiceOneDirection(call, cmdBaseWorker.cbSBankCount1, cmdBaseWorker.cbSBankCount2, direction)
            //else
            //    playNode.playDiceOneDirection(function()
            //        {
             //           playDice(direction+1)
              //      }, nums[0], nums[1], direction)
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

