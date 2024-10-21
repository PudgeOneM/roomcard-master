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


        playNode.timer = majiangTimer4D.getTimer()
        playNode.timerNode.addChild(playNode.timer)
        playNode.timerNode.setScale( majiangFactory.scale_upDown*0.9 )

        var bUiStyleV1 = getLocalStorage('bUiStyleV1_' + KIND_ID)
        if ( !bUiStyleV1 || !JSON.parse(bUiStyleV1) )
        {
            styleArray = [1, 1]
            setLocalStorage( 'styleArray_' + KIND_ID, JSON.stringify(styleArray) )
            setLocalStorage('bUiStyleV1_' + KIND_ID, true)

            var event = new cc.EventCustom("styleChange")
            cc.eventManager.dispatchEvent(event)
        }

        
// cmdBaseWorker.dwChiHuRight = [
// 0x02000000,
// 0x00008000,
// 0,
// 0
// ]


//     playNode.popGameEnd(null, ['诶我去无群二', '多撒多群多群大所', '大大大大法师的法师大大大大法师的法师', '大大舒服撒发生发我的'])

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

        playNode.showChoosePopOfAction = function(weaveItems, actionCall)
        {
            playNode.btn_chi.setVisible(false)
            playNode.btn_peng.setVisible(false)
            playNode.btn_gang.setVisible(false)
            playNode.btn_ting.setVisible(false)
            playNode.btn_hu.setVisible(false)
            playNode.btn_magic.setVisible(false)

            var len = weaveItems.length
            for( var i = 0; i < len; i++ )
            {
                var chooseItem = playNode._getChooseItemOfAction(weaveItems[i].cardDatas, weaveItems[i].Action, actionCall, i)

                chooseItem.x = ( i % 3 - ( Math.min(len, 3) - 1 ) / 2 ) * ( chooseItem.bg.width + 30)
                chooseItem.y = Math.floor( i / 3 ) * ( chooseItem.bg.height + 20 )
                majiangFactory.chooseItemsNode.addChild(chooseItem)
            }
        }

        playNode._getChooseItemOfAction = function(sortedOperateCardDatas, action, actionCall, index)
        {        
            var chooseItem = new cc.Node()
            // var provideCardData = cardDatas[0]
            ////////////////////////////
            var showLen = sortedOperateCardDatas.length

            //if(action == WIK_GANG)
                //showLen = 1
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
            chooseItem.bg = bg

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
                        actionCall?actionCall(index):''
                    }
                }
            })
            cc.eventManager.addListener(listener, bg)

            return chooseItem
        }

        playNode.CheckOperateForSingleCard = function(cbCardData)
        {
            if ( cbCardData >= 0x35 && cbCardData <= 0x37 )
                return true

            var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
            var cbFengCard = (GAME_PLAYER + selfChairId - cmdBaseWorker.wBankerUser) % GAME_PLAYER + 0x31
            if ( cbCardData == cbFengCard )
                return true

            return false
        }

        playNode.actionCall_Send = function(operateParam, action)
        {
             cmdBaseWorker.sendOperateMessage(operateParam, action)
             playNode.hideActionBtns()
        }

        playNode.actionCall_chi = function()
        {
            var btn = playNode.btn_chi
            var actions = btn.actions
            var provideCardData = cmdBaseWorker.cbProvideCardData
            var chiWeaveItems = []

            var sendChi = function(index)
            {
                playNode.actionCall_Send([provideCardData, chiWeaveItems[index].magicPos], chiWeaveItems[index].Action)
            }

            //分析吃牌组合
            var AnalyseChiWeave = function(action)
            {
                var weaveCardDatas = [] 
                var magicCards = playNode.getMagicCardByHandCard()
                var magicCardData = magicCards.length == 0 ? 0 : magicCards[0]

                if ( action == WIK_LEFT )
                {
                    weaveCardDatas = [provideCardData, provideCardData + 1, provideCardData + 2]
                }
                else if ( action == WIK_CENTER )
                {
                    weaveCardDatas = [provideCardData - 1, provideCardData, provideCardData + 1]
                }
                else if ( action == WIK_RIGHT )
                {
                    weaveCardDatas = [provideCardData - 2, provideCardData - 1, provideCardData]
                }

                var pushWeave = function(magicPos)
                {
                    var weaveItem = 
                    {
                        cardDatas:weaveCardDatas.slice(0),
                        magicPos:magicPos,
                        Action:action
                    }

                    if ( magicPos != INVALID_BYTE )
                        weaveItem.cardDatas[magicPos] = magicCardData

                    chiWeaveItems.push(weaveItem)
                }

                var bHasNullCard = false
                for ( var i = 0; i < weaveCardDatas.length; i++ )
                {
                    if ( weaveCardDatas[i] == provideCardData )
                        continue;

                    if ( playNode.getCardCountByHandCard(weaveCardDatas[i]) == 0 || cmdBaseWorker.isMagicCard(weaveCardDatas[i], cmdBaseWorker.cbMagicCardData) )
                    {
                        pushWeave(i)
                        bHasNullCard = true
                    }
                }

                if ( !bHasNullCard )
                {
                    pushWeave(INVALID_BYTE)

                    if ( magicCardData > 0 )
                    {
                        for ( var i = 0; i < weaveCardDatas.length; i++ )
                        {
                            if ( weaveCardDatas[i] == provideCardData )
                                continue

                            pushWeave(i)
                        }
                    }
                }
            }

            for( var i = 0; i < actions.length; i++ )
            {
                AnalyseChiWeave(actions[i])
            }

            if( chiWeaveItems.length > 1 ) 
                playNode.showChoosePopOfAction(chiWeaveItems, sendChi)  
            else
                sendChi(0)
        }

        playNode.actionCall_peng = function()
        {
            var provideCardData = cmdBaseWorker.cbProvideCardData
            var magicCards = playNode.getMagicCardByHandCard()
            var weaveItems = []

            var sendPeng = function(index)
            {
                playNode.actionCall_Send([provideCardData, weaveItems[index].magicCount], weaveItems[index].Action)
            }

            var pushWeave = function(magicCount)
            {
                magicCount = max(magicCount, 0)

                var weaveItem = 
                {
                    Action:WIK_PENG,
                    magicCount:magicCount,
                    cardDatas:[]
                }

                for ( var i = 0; i < 3; i++ )
                {
                    if ( i < magicCount )
                        weaveItem.cardDatas[i] = magicCards[i]
                    else
                        weaveItem.cardDatas[i] = provideCardData
                }  

                weaveItems.push(weaveItem)
            }

            var handCardCount = playNode.getCardCountByHandCard(provideCardData)
            var magicFlag = [ false, false, false ]
            for ( var i = 0; i <= handCardCount; i++ )
                magicFlag[2 - i] = true

            for ( var i = 0; i < 3; i++ )
            {
                if ( !magicFlag[i] )
                    continue

                if ( i > magicCards.length )
                    continue

                if ( i == 2 && !playNode.CheckOperateForSingleCard(provideCardData) )
                    continue

                pushWeave(i)
            }

            if ( weaveItems.length > 1 )
                playNode.showChoosePopOfAction(weaveItems, sendPeng)
            else
                sendPeng(0)
        }

        playNode.actionCall_gang = function()
        {
            var provideCardData = cmdBaseWorker.cbProvideCardData
            var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
            var magicCards = playNode.getMagicCardByHandCard()
            var direction = tableData.getShowChairIdWithServerChairId(selfChairId)
            var weaveMajiangs = playNode.weaveMajiangs4D[direction]
            var handMajiangs = playNode.handMajiangs4D[direction]
            var weaveItems = []

            var sendGang = function(index)
            {
                playNode.actionCall_Send([weaveItems[index].centerData, weaveItems[index].weaveIndex], weaveItems[index].Action)
            }

            var pushWeave = function(magicCount, weaveIndex, oldCards, cardData)
            {
                var weaveItem = 
                {
                    Action:WIK_GANG,
                    weaveIndex:weaveIndex,
                    centerData:cardData,
                    cardDatas:oldCards
                }

                magicCount = max(magicCount, 0)

                var oldLen = oldCards.length
                for ( var i = oldLen; i < 4; i++ )
                {
                    if ( i - oldLen < magicCount )
                        weaveItem.cardDatas[i] = magicCards[i-oldLen] 
                    else 
                        weaveItem.cardDatas[i] = cardData 
                }  

                weaveItems.push(weaveItem)
            }

            if( cmdBaseWorker.wProvideUser != selfChairId ) 
            {  
                //明杠
                pushWeave(3 - playNode.getCardCountByHandCard(provideCardData), INVALID_BYTE, [], provideCardData)
            }
            else
            {
                //碰杠
                for ( var i = 0; i < weaveMajiangs.length; i++ )
                {
                    if ( weaveMajiangs[i].cbWeaveKind != WIK_PENG )
                        continue

                    for ( var n = 0; n < weaveMajiangs[i].length; n++ )
                    {
                        if ( !cmdBaseWorker.isMagicCard( weaveMajiangs[i][n].cardData, cmdBaseWorker.cbMagicCardData ) )
                        {
                            var cardCount = playNode.getCardCountByHandCard(weaveMajiangs[i][n].cardData)
                            if ( cardCount + magicCards.length >= 1 )
                            {
                                var oldCards = [weaveMajiangs[i][0].cardData, weaveMajiangs[i][1].cardData, weaveMajiangs[i][2].cardData]
                                pushWeave(1 - cardCount, i, oldCards, weaveMajiangs[i][n].cardData)
                            }

                            break
                        }
                    }
                }

                //暗杠
                var handCardDatas = []
                if ( handMajiangs[1] )
                    handCardDatas[0] = handMajiangs[1].cardData
                for( var i = 0; i < handMajiangs[0].length; i++ )
                    handCardDatas[handCardDatas.length] = handMajiangs[0][i].cardData

                var cardCount = []
                for ( var i = 0; i < handCardDatas.length; i++ ) 
                {
                    if ( cardCount[handCardDatas[i]] == null )
                        cardCount[handCardDatas[i]] = 1
                    else
                        cardCount[handCardDatas[i]]++
                }

                for ( var i = 0; i < cardCount.length; i++ )
                {
                    if ( cardCount[i] == null || cardCount[i] == 0 )
                        continue

                    if ( cmdBaseWorker.isMagicCard( i, cmdBaseWorker.cbMagicCardData ) && cardCount[i] < 4 )
                        continue

                    if ( cardCount[i] + magicCards.length < 4 )
                        continue

                    if ( cardCount[i] == 1 && !playNode.CheckOperateForSingleCard(i) )
                        continue

                    pushWeave(4 - cardCount[i], INVALID_BYTE, [], i)
                }
            }

            if ( weaveItems.length > 1 )
                playNode.showChoosePopOfAction(weaveItems, sendGang)
            else
                sendGang(0)
        }

        playNode.actionCall_magic = function()
        {
            var provideCardData = cmdBaseWorker.cbProvideCardData
            var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
            var direction = tableData.getShowChairIdWithServerChairId(selfChairId)
            var weaveMajiangs = playNode.weaveMajiangs4D[direction]
            var weaveItems = []

            var sendMagic = function(index)
            {
                playNode.actionCall_Send([provideCardData, weaveItems[index].weaveIndex], weaveItems[index].Action)
            }

            var pushWeave = function(index, oldCards)
            {
                var weaveItem = 
                {
                    Action:WIK_MAGIC,
                    weaveIndex:index,
                    cardDatas:oldCards.slice(0)
                }

                weaveItems.push(weaveItem)
            }

            for ( var i = 0; i < weaveMajiangs.length; i++ )
            {
                var centerCard = 0
                if ( weaveMajiangs[i].cbWeaveKind == WIK_GANG || weaveMajiangs[i].cbWeaveKind == WIK_PENG )
                {
                    for ( var n = 0; n < weaveMajiangs[i].length; n++ )
                    {
                        if ( !cmdBaseWorker.isMagicCard( weaveMajiangs[i][n].cardData, cmdBaseWorker.cbMagicCardData ) )
                        {
                            centerCard = weaveMajiangs[i][n].cardData;
                            break
                        }
                    }
                }
                else if ( weaveMajiangs[i].cbWeaveKind == WIK_LEFT )
                    centerCard = weaveMajiangs[i][0].cardData
                else if ( weaveMajiangs[i].cbWeaveKind == WIK_CENTER )
                    centerCard = weaveMajiangs[i][1].cardData
                else if ( weaveMajiangs[i].cbWeaveKind == WIK_RIGHT )
                    centerCard = weaveMajiangs[i][2].cardData

                if ( centerCard == 0 )
                    continue

                var magicPos = INVALID_BYTE
                for ( var n = 0; n < weaveMajiangs[i].length; n++ )
                {
                    if ( cmdBaseWorker.isMagicCard( weaveMajiangs[i][n].cardData, cmdBaseWorker.cbMagicCardData ) )
                    {
                        magicPos = n
                        break
                    }
                }

                if ( magicPos == INVALID_BYTE )
                    continue

                var cbHandCard = 0
                if ( weaveMajiangs[i].cbWeaveKind == WIK_GANG )
                    cbHandCard = centerCard
                else if ( weaveMajiangs[i].cbWeaveKind == WIK_PENG )
                    cbHandCard = centerCard
                else if ( weaveMajiangs[i].cbWeaveKind == WIK_LEFT )
                    cbHandCard = centerCard + magicPos
                else if ( weaveMajiangs[i].cbWeaveKind == WIK_CENTER )
                    cbHandCard = centerCard + magicPos - 1
                else if ( weaveMajiangs[i].cbWeaveKind == WIK_RIGHT )
                    cbHandCard = centerCard + magicPos - 2

                if ( playNode.getCardCountByHandCard(cbHandCard) == 0 )
                    continue

                var oldCards = []
                for ( var j = 0; j < weaveMajiangs[i].length; j++ )
                    oldCards.push(weaveMajiangs[i][j].cardData)

                pushWeave(i, oldCards)
            }

            if ( weaveItems.length > 1 )
                playNode.showChoosePopOfAction(weaveItems, sendMagic)
            else
                sendMagic(0)
        }

        playNode.actionCall_ting = function()
        {
            alert('actionCall_ting')
        }

        playNode.actionCall_hu = function()
        {
            playNode.actionCall_Send([], WIK_CHI_HU)
        }

        playNode.actionCall_guo = function()
        {
             playNode.actionCall_Send([], WIK_NULL)
        }

        playNode.actionCall_replace = function()//不需要玩家手动触发 只要收到这个动作 自动执行
        {
            alert('actionCall_replace')  
        }
    },
    getCardCountByHandCard:function(cardData)
    {
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        var direction = tableData.getShowChairIdWithServerChairId(selfChairId)
        var handMajiangs = playNode.handMajiangs4D[direction]
        var handCardDatas = []
        if ( handMajiangs[1] )
            handCardDatas[0] = handMajiangs[1].cardData
        for( var i = 0; i < handMajiangs[0].length; i++ )
            handCardDatas[handCardDatas.length] = handMajiangs[0][i].cardData

        var count = 0
        for ( var i = 0; i < handCardDatas.length; i++ )
        {
            if ( handCardDatas[i] == cardData )
                count++
        }

        return count
    },
    getMagicCardByHandCard:function()
    {
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        var direction = tableData.getShowChairIdWithServerChairId(selfChairId)
        var handMajiangs = playNode.handMajiangs4D[direction]
        var handCardDatas = []
        if ( handMajiangs[1] )
            handCardDatas[0] = handMajiangs[1].cardData
        for( var i = 0; i < handMajiangs[0].length; i++ )
            handCardDatas[handCardDatas.length] = handMajiangs[0][i].cardData

        var magicCardDatas = []
        for ( var i = 0; i < handCardDatas.length; i++ )
        {
            if( cmdBaseWorker.isMagicCard(handCardDatas[i], cmdBaseWorker.cbMagicCardData) ) 
                magicCardDatas.push(handCardDatas[i])
        }

        return magicCardDatas;
    },
    decorateMj:function(mj)
    {
        var cardData = mj.cardData 
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

        playNode.timer.initFenwei( tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wBankerUser) )
        playNode.timer.switchTimer(cmdBaseWorker.wCurrentUser==INVALID_WORD?[]:[tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wCurrentUser)])
        playNode.timerNode.setVisible(true)

        var self = tableData.getUserWithUserId(selfdwUserID)
        //for(var i=0;i<GAME_PLAYER;i++)
        //{
        //    var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
        //    user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] )
        //}

        if(cmdBaseWorker.wOutCardUser!=INVALID_WORD)
        {
            var d = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wOutCardUser)
            playNode.setCurrentDiscardMj(cmdBaseWorker.cbOutCardData, d)
        }

        /////吃碰杠胡
        var sortedActions = playNode.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        var isActioning = sortedActions.length>0
        if(isActioning)
            playNode.showActionBtns(sortedActions)

        var handCardDatasArray = [[[], null], [[], null], [[], null], [[], null]]
        var discardCardDatasArray = [[],[],[],[]]
        var weaveItemArray = [[],[],[],[]]
        var flowerArray = [[],[],[],[]]

        for(var i=0;i<GAME_PLAYER;i++)
        {
            var direction = tableData.getShowChairIdWithServerChairId(i)
            var weaveItems = cmdBaseWorker.WeaveItemArray[i]
            //组合牌
            for(var j=0;j<MAX_WEAVE;j++)
            {
                var t = weaveItems[j].cbCardDatas
                //weaveItems[j].cbCardDatas = cmdBaseWorker.sortWeaveCardDatas(weaveItems[j].cbWeaveKind, t)

                weaveItems[j].provideDirection = tableData.getShowChairIdWithServerChairId(weaveItems[j].wProvideUser)
            }
            weaveItemArray[direction] = weaveItems

            var cardDatas = []
            for(var j=0;j<MAX_COUNT;j++)
            {
                cardDatas[j] = 0
            }
            var handCardDatas = cmdBaseWorker.cbHandCardData[i]
            if(cmdBaseWorker.cbHandCardCount[i] + cmdBaseWorker.cbWeaveCount[i]*3 == MAX_COUNT)
            {
                handCardDatasArray[direction][0] = handCardDatas.slice(0, handCardDatas.length-1)
                handCardDatasArray[direction][1] = handCardDatas[handCardDatas.length-1]
            }
            else
                handCardDatasArray[direction][0] = handCardDatas

            discardCardDatasArray[direction] = cmdBaseWorker.cbDiscardCardData[i].slice(0, cmdBaseWorker.cbDiscardCount[i])
            flowerArray[direction] = cmdBaseWorker.cbPlayerFlowerCardData[i]
        }
        // console.log(6666, handCardDatasArray, discardCardDatasArray, weaveItemArray)
        cmdBaseWorker.sortHandCardDatas(handCardDatasArray[0][0]) 
        // get heapCardDatasArray
        var heapCardDatasArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)
        
        playNode.sendCardsAction(handCardDatasArray, discardCardDatasArray, weaveItemArray, heapCardDatasArray, flowerArray) 

        playNode.UpdateHandOutCardLimit()
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
        //callUser.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[cmdBaseWorker.wCallUser][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[cmdBaseWorker.wCallUser][1] )

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
    // onCMD_Call:function()
    // {
    //     cocos.clearInterval(playNode.updateOnFree, playNode.node)
    //     playNode.node.stopAction(playNode.gameEndAction)
    //     playNode.resetPlayNode()

    //     /////
    //     tableNode.setBankerIcon(cmdBaseWorker.wBankerUser, true)
    //     var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
    //     for (var i=0;i<GAME_PLAYER;i++)
    //     {
    //         if(cmdBaseWorker.cbCallRecord[i][0] == INVALID_BYTE)
    //         {
    //             if(selfChairId == i)
    //                 playNode.showGameset()
    //         }
    //     }

    // },
    onCMD_GameStart:function() 
    {        
        //有叫分的话这里注释
        // cocos.clearInterval(playNode.updateOnFree, playNode.node)
        // playNode.node.stopAction(playNode.gameEndAction)
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
        //for(var i=0;i<GAME_PLAYER;i++)
        //{
        //    var user = tableData.getUserWithTableIdAndChairId(self.wTableID, i)
        //    user.userNodeInsetChair.currentRoundNode.upTTF.setString( '下跑:'+cmdBaseWorker.cbCallRecord[i][0]+' 加顶:' + cmdBaseWorker.cbCallRecord[i][1] )
        //}

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
            if(serverChairid==self.wChairID || isRecordScene)
                cardDatas = cmdBaseWorker.cbHandCardData[serverChairid]

            var oldCardDatas = cardDatas.slice(0, MAX_COUNT-1)
            handCardDatasArray[direction] = [oldCardDatas, null]
            cmdBaseWorker.sortHandCardDatas(handCardDatasArray[direction][0]) 
        }
        
        //get heapCardDatasArray 
        var heapCardDatasArray = majiangFactory.getHeapCardDatasArray(cmdBaseWorker.cbHeapCardInfo, cmdBaseWorker.TurnoverCard)       
       
        playNode.sendCardsAction(handCardDatasArray, [[],[],[],[]], [[],[],[],[]], heapCardDatasArray, []) 

        playNode.setCurrentRoundMajiangsVisible(false)
        playNode.actionBtns.setVisible(false)

        if ( !isRecordScene )
            managerTouch.closeTouch() //避免在不知道牌的情况下 把牌打出去
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

            playNode.setCurrentRoundMajiangsVisible(true)
            playNode.actionBtns.setVisible(true)
            managerTouch.openTouch()
        }

        function bankerPlayDice()
        {
            playNode.playDiceOneDirection(takePlayDice, cmdBaseWorker.cbSiceCount[0], 
                cmdBaseWorker.cbSiceCount[1], bankerShowChairid)
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
        var outCardData = cmdBaseWorker.cbOutCardData

        playNode.timer.switchTimer([])
        playNode.playMajiangEffect(outCardData, outUser.cbGender)
        managerAudio.playEffect('gameRes/sound/discard.mp3')

        var majiangs = playNode.handMajiangs4D[outDir]
        if(outUser.dwUserID==selfdwUserID || isRecordScene)
        {
            majiangFactory.deleteHandMajiangs(majiangs, outDir, outCardData)
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
            outCardData, outUser.userNodeInsetChair.currentRoundNode.discardMajiangsNode)

        playNode.setCurrentDiscardMj(outCardData, outDir)

        var sortedActions = playNode.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
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
            var cardData = (isSelf||isRecordScene)?item.cbCardData:0
            majiangFactory.addHandMajiang(playNode.handMajiangs4D[takeDir], takeDir, cardData, playNode.handGroupNode4D[takeDir], playNode.weaveMajiangs4D[takeDir].length)
        }

        /////摸到麻将时有可能出现杠听胡补花
        var sortedActions = playNode.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
            playNode.showActionBtns(sortedActions)  //自摸杠 cardData不确定 需要searchGangCardDatas
    },
    ///////action start//////
    getSortedActionsWithMask:function(acitonMask)
    {
        var actions = []

        if((acitonMask&WIK_MAGIC)!=0)
            actions[actions.length] = WIK_MAGIC

        if((acitonMask&WIK_RIGHT)!=0)
            actions[actions.length] = WIK_RIGHT

        if((acitonMask&WIK_CENTER)!=0)
            actions[actions.length] = WIK_CENTER

        if((acitonMask&WIK_LEFT)!=0)
            actions[actions.length] = WIK_LEFT

        //////
        if((acitonMask&WIK_PENG)!=0)
            actions[actions.length] = WIK_PENG

        if((acitonMask&WIK_GANG)!=0)
            actions[actions.length] = WIK_GANG

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
            case WIK_GANG:
                return 'gang'
            case WIK_LISTEN:
                return 'ting'
            case WIK_CHI_HU:
                return 'hu'
            case WIK_MAGIC:
                return 'magic'
        }
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
            majiang.cardData = cardDatas[idxInGroup]

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
            }
            majiangs[majiangs.length] = majiang
        }  
        majiangs.cbWeaveKind = weaveItem.cbWeaveKind
        majiangs.cbPublicCard = weaveItem.cbPublicCard

        return majiangs
    },
    // cardDatas数组->spr数组
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

                if(weaveItem.cbWeaveKind!=WIK_GANG)
                    weaveItem.cbCardDatas = weaveItem.cbCardDatas.slice(0, 3)

                var majiangsOneGroup = playNode.weaveItem2Majiangs(groupIdx, direction, weaveItem, isSelf, isPublicAnGang)
                majiangsOneDirection[groupIdx] = majiangsOneGroup
            }
            weaveMajiangs4D[direction] = majiangsOneDirection
        }

        return weaveMajiangs4D
    },
    //‘增删减查’
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
    peng2Gang:function(weaveIndex, cardData, majiangsOneDirection, direction)
    {
        var majiangsOneGroup = majiangsOneDirection[weaveIndex]
        var majiang = majiangFactory.getOne(cardData, 2, direction)
        var pos = majiangFactory.getWeaveMajiangPosAndTag(weaveIndex, 3, direction)
        majiang.x = pos.x
        majiang.y = pos.y
        majiang.setLocalZOrder(pos.zOrder)
        var parent = majiangsOneGroup[0].getParent()
        parent.addChild(majiang)

        majiangsOneGroup[3] = majiang
        majiangsOneGroup.cbWeaveKind = WIK_GANG
    },
    onActionmMagic:function(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var weaveIndex = cmdBaseWorker.cbOperateParam
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
        var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
        var majiangsOneGroup = operateWeaveMajiangs[weaveIndex]

        for ( var i = 0; i < majiangsOneGroup.length; i++ )
        {
            var oldCard = majiangsOneGroup[i].cardData
            if ( cmdBaseWorker.isMagicCard(oldCard, cmdBaseWorker.cbMagicCardData) )
            {
                var majiang = majiangsOneGroup[i]
                var where = majiang.where
                var parent = majiang.getParent()

                majiang.removeFromParent()

                majiang = majiangFactory.getOne((majiangsOneGroup.cbPublicCard || isRecordScene) ? cardDatas[i] : 0, where, operateUserDir)
                majiang.cardData = cardDatas[i]
                var pos = majiangFactory.getWeaveMajiangPosAndTag(weaveIndex, i, operateUserDir)
                majiang.x = pos.x
                majiang.y = pos.y
                majiang.setLocalZOrder(pos.zOrder)
                parent.addChild(majiang)

                majiangsOneGroup[i] = majiang

                if (majiangsOneGroup.length > 3)
                    majiangsOneGroup[3].setLocalZOrder(pos.zOrder+1)

                majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, (operateUser.dwUserID == selfdwUserID || isRecordScene) ? cardDatas[i] : 0)
                majiangFactory.addHandMajiang(operateHandMajiangs, operateUserDir, 
                    (operateUser.dwUserID == selfdwUserID || isRecordScene)? oldCard : 0, 
                    handGroupNode4D[operateUserDir], 
                    operateWeaveMajiangs.length)

                break
            }
        }
    },
    onActionGang:function(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var cardData = cmdBaseWorker.cbProvideCardData
        var gangType = 1//0暗杠 1明杠 2增杠
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
        var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
        var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
        var provideDiscardMajiangs = majiangs4W4D.discardMajiangs4D[provideUserDir]
        var weaveCardDatas = [cardDatas[0], cardDatas[1], cardDatas[2], cardDatas[3]]

        if ( cmdBaseWorker.cbOperateParam != INVALID_BYTE ) //碰杠
        {
            gangType = 1
            var deleteCardData = (operateUser.dwUserID == selfdwUserID || isRecordScene) ? cardDatas[3] : 0
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCardData)
            majiangFactory.moveHandMajiangNew2Old(operateHandMajiangs, operateUserDir, handGroupNode4D[operateUserDir])
            playNode.peng2Gang(cmdBaseWorker.cbOperateParam, cardDatas[3], operateWeaveMajiangs, operateUserDir) 
        }
        else 
        {
            var deleteLen = 0
            if ( operateUser != provideUser ) //明杠
            {
                gangType = 1
                deleteLen = 3

                majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)   
            }
            else //暗杠
            {
                gangType = 0
                deleteLen = 4
            }

            for ( var i = 0;i < deleteLen; i++ )
                majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, (operateUser.dwUserID == selfdwUserID || isRecordScene) ? cardDatas[i] : 0)

            var self = tableData.getUserWithUserId(selfdwUserID)
            var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
            playNode.addWeaveMajiangs(operateWeaveMajiangs, operateUserDir, 
                {
                    'cbCardDatas':weaveCardDatas,
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
        var cardData = cmdBaseWorker.cbProvideCardData
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
        var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
        var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
        var provideDiscardMajiangs = majiangs4W4D.discardMajiangs4D[provideUserDir]
        var weaveCardDatas = [cardDatas[0], cardDatas[1], cardDatas[2]]

        var deleteCards = []
        if ( operateUser.dwUserID != selfdwUserID && !isRecordScene )
            deleteCards = [0, 0]
        else
            deleteCards = [cardDatas[0], cardDatas[1]]

        //////
        majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
        for( var i = 0; i < deleteCards.length; i++ )
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCards[i])

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
        majiangFactory.addHandMajiangNew(operateHandMajiangs, operateUserDir, maxCardData, handGroupNode4D[operateUserDir])
    },
    onActionChi:function(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        var operateUserDir = tableData.getShowChairIdWithServerChairId(operateUser.wChairID)
        var provideUserDir = tableData.getShowChairIdWithServerChairId(provideUser.wChairID)
        var operateWeaveMajiangs = majiangs4W4D.weaveMajiangs4D[operateUserDir]
        var operateHandMajiangs = majiangs4W4D.handMajiangs4D[operateUserDir]
        var provideDiscardMajiangs = majiangs4W4D.discardMajiangs4D[provideUserDir]
        var weaveCardDatas = [cardDatas[0], cardDatas[1], cardDatas[2]]

        var deleteCards = []
        if ( operateUser.dwUserID != selfdwUserID && !isRecordScene )
            deleteCards = [0, 0]
        else if ( action == WIK_LEFT )
            deleteCards = [cardDatas[1], cardDatas[2]]
        else if ( action == WIK_CENTER )
            deleteCards = [cardDatas[0], cardDatas[2]]
        else if ( action == WIK_RIGHT )
            deleteCards = [cardDatas[0], cardDatas[1]]

        //////
        majiangFactory.popDiscardMajiangs(provideDiscardMajiangs)
        for( var i = 0 ; i < deleteCards.length; i++ )
            majiangFactory.deleteHandMajiangs(operateHandMajiangs, operateUserDir, deleteCards[i])
        
        var self = tableData.getUserWithUserId(selfdwUserID)
        var selfDir = tableData.getShowChairIdWithServerChairId(self.wChairID)
        playNode.addWeaveMajiangs(operateWeaveMajiangs, operateUserDir, 
        {
            'cbCardDatas':weaveCardDatas,
            'provideDirection':provideUserDir,
            'cbCenterCardData':cmdBaseWorker.cbProvideCardData,
            'cbWeaveKind':action,
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
    //处理吃碰杠 主要会调用到手牌堆、丢弃牌堆、吃碰杠牌堆的‘增删减查’
    onActionResult:function(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
    {
        if(action==WIK_MAGIC)
            playNode.onActionmMagic(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        if(action==WIK_GANG)
            playNode.onActionGang(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_PENG)
            playNode.onActionPeng(cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
        else if(action == WIK_LEFT || action == WIK_CENTER || action == WIK_RIGHT)
            playNode.onActionChi(action, cardDatas, operateUser, provideUser, majiangs4W4D, handGroupNode4D)
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

            //var cardDatas = cmdBaseWorker.sortWeaveCardDatas(cmdBaseWorker.cbOperateCode, cmdBaseWorker.cbOperateCardData)
            playNode.onActionResult(cmdBaseWorker.cbOperateCode, cmdBaseWorker.cbOperateCardData, operateUser, provideUser, majiangs4W4D, playNode.handGroupNode4D)

            playNode.playAction(cmdBaseWorker.cbOperateCode, operateUser)
        }
        //动作后动作
        var sortedActions = playNode.getSortedActionsWithMask(cmdBaseWorker.cbActionMask)
        if(sortedActions.length>0)
        {
            cmdBaseWorker.wProvideUser = cmdBaseWorker.wOperateUser //执行完上一个动作wProvideUser需要更新
            cmdBaseWorker.cbProvideCardData  = cmdBaseWorker.cbProvideCardData //cbProvideCardData仍有意义 碰杠可能触发胡 
            playNode.showActionBtns(sortedActions)  //吃碰后杠 cardData不确定 需要searchGangCardDatas
        }

        playNode.UpdateHandOutCardLimit()
    },
    onCMD_GameEnd:function() 
    {
        playNode.gamesetNode.setVisible(false)

        // setTimeout(function()
        // {
        //     var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
        //     record.szTableKey = tableKey
        //     socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)
        // },2000)


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
            playNode.gameEndAction = cc.sequence( 
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
    onCMD_ReplaceHua:function()
    {
        var operateUser = tableData.getUserWithChairId(cmdBaseWorker.wOperateUser)
        var provideUser = tableData.getUserWithChairId(cmdBaseWorker.wProvideUser)
        var majiangs4W4D = 
        {
            handMajiangs4D:playNode.handMajiangs4D,
            discardMajiangs4D:playNode.discardMajiangs4D,
            weaveMajiangs4D:playNode.weaveMajiangs4D,
            flowerMajiangs4D:playNode.flowerMajiangs4D,
        }

        majiangFactory.onActionReplace(cmdBaseWorker.cbReplaceHuaCards, operateUser, provideUser, majiangs4W4D, playNode.handGroupNode4D)
    },
    onCMD_OutCardLimit:function()
    {
        playNode.UpdateHandOutCardLimit()
    },
    ///////////////cmdEvent end//////////


    ////////////sendCardsAction start//////////
    UpdateHandOutCardLimit:function()
    {
        var selfChairId = tableData.getUserWithUserId(selfdwUserID).wChairID
        var direction = tableData.getShowChairIdWithServerChairId(selfChairId)
        var handMajiangs = playNode.handMajiangs4D[direction]
        if ( !handMajiangs )
            return
        
        var majiangs = []
        if (handMajiangs[0])
            majiangs = handMajiangs[0].slice(0)
        if (handMajiangs[1])
            majiangs.push(handMajiangs[1])
        for ( var i = 0; i < majiangs.length; i++ )
        {
            var cardColor = cc.color(255, 255, 255)
            for ( var n = 0; n < cmdBaseWorker.cbOutCardLimit.length; n++ )
            {
                if ( majiangs[i].cardData == cmdBaseWorker.cbOutCardLimit[n] )
                {
                    cardColor = cc.color(188, 255, 188)
                    break
                }
            }

            majiangs[i].color = cardColor
        }
    },
    _getHandMajiangsGroupNode:function()
    {
        var handMajiangs = playNode.handMajiangs4D

        var touchEndCall = function(direction, majiang)
        {
            var isAllowOut = cmdBaseWorker.wCurrentUser == tableData.getUserWithUserId(selfdwUserID).wChairID
            for ( var i = 0; i < cmdBaseWorker.cbOutCardLimit.length; i++ )
            {
                if ( majiang.cardData == cmdBaseWorker.cbOutCardLimit[i] )
                {
                    isAllowOut = false
                    break
                }
            }

            if(isAllowOut)
            {
                //cmdBaseWorker.wCurrentUser = INVALID_WORD

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


        playNode.weaveMajiangs4D = playNode.getWeaveMajiangsArray(weaveItemArray, selfDir)

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
        // //score
        // for(var i=0;i<GAME_PLAYER;i++)
        // {
        //     var user = tableData.getUserWithChairId(i)
        //     if(!user) continue

        //     var chair = tableData.getChairWithServerChairId(i)
        //     if(tableData.isInTable(user.cbUserStatus))
        //     {   
        //         //score
        //         var score = cmdBaseWorker.lGameScore[i]
        //         var scoreNode = user.userNodeInsetChair.currentRoundNode.scoreChange

        //         var scoreLabel = new ccui.TextAtlas()
        //         scoreLabel.setProperty(Math.abs(score), score>0?resp.nums2:resp.nums3, 22, 33, "0")
        //         scoreNode.addChild(scoreLabel)
                
        //         var sign = score>0?new cc.Sprite('#plus.png'):new cc.Sprite('#minus.png')
        //         sign.setAnchorPoint(cc.p(0,0.5))
        //         scoreNode.addChild(sign)

        //         var signPosx
        //         var swidth = scoreLabel.getContentSize().width + sign.getContentSize().width
        //         if( chairFactory.isRight(chair.node) )
        //         {
        //             signPosx = - swidth
        //         }
        //         else
        //         {   
        //             signPosx = 0 
        //         }
        //         sign.setPositionX(signPosx) 
        //         scoreLabel.setPositionX(signPosx + scoreLabel.getContentSize().width * 0.5 + sign.getContentSize().width)    
        //     }
        // }

        // if(cmdBaseWorker.endType == 1 || cmdBaseWorker.endType == 0)
        //     return 


        // //删除打出去的牌
        // for(var i=0;i<GAME_PLAYER;i++)
        // {
        //     var user = tableData.getUserWithChairId(i)
        //         if(!user) continue

        //     user.userNodeInsetChair.currentRoundNode.discardMajiangsNode.removeAllChildren()
        // }

        // playNode.timerNode.setVisible(false)


        // var isQiangGang = cmdBaseWorker.dwChiHuRight[cmdBaseWorker.wWinner] & CHR_QiangGang
        // if(isQiangGang) //抢杠需要gang2Peng
        // {
        //     var direction = tableData.getShowChairIdWithServerChairId(cmdBaseWorker.wProvideUser)
        //     majiangFactory.gang2Peng(cmdBaseWorker.cbProvideCardData , playNode.weaveMajiangs4D[direction] )
        // }

        // //摊牌
        // var displayHandCardDatasArray = []
        // var cbProvideCardData = cmdBaseWorker.cbProvideCardData

        // for(var showChairid=0;showChairid<4;showChairid++)
        // {
        //     var direction = showChairid
        //     var chairid = tableData.getServerChairIdWithShowChairId(showChairid)

        //     displayHandCardDatasArray[direction] = [cmdBaseWorker.cbHandCardData[chairid].slice(0, cmdBaseWorker.cbHandCardCount[chairid]), null]

        //     if(cmdBaseWorker.wWinner == chairid)
        //     {   
        //         var displayHandCardDatas = displayHandCardDatasArray[direction]
        //         for(var j=0;j<displayHandCardDatas[0].length;j++)
        //         {
        //             if(displayHandCardDatas[0][j] == cbProvideCardData)
        //             {
        //                displayHandCardDatas[1] = displayHandCardDatas[0].splice(j, 1)[0]
        //                break
        //             }
        //         }
        //     }
        // }

        // playNode.handMajiangs4D = majiangFactory.getDisplayHandMajiangsArray(displayHandCardDatasArray)
  
        // for(var showChairid=0;showChairid<4;showChairid++)
        // {
        //     var direction = showChairid
        //     var chairid = tableData.getServerChairIdWithShowChairId(showChairid)

        //     var user = tableData.getUserWithTableIdAndChairId(self.wTableID, chairid)
        //     var handGroupNode = playNode.handGroupNode4D[direction]
        //     handGroupNode.removeAllChildren()

        //     var handMajiangs = playNode.handMajiangs4D[direction]
        //     var oldMjs = handMajiangs[0]

        //     for(var j=0;j<oldMjs.length;j++)
        //     {
        //         handGroupNode.addChild(oldMjs[j])
        //     }
        //     if(handMajiangs[1])
        //         handGroupNode.addChild(handMajiangs[1])
        // }

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
            resultTTF.x = 320
            resultTTF.y = 25
            gendBar.addChild(resultTTF)
       


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


            ///////////
            if(wChairID==cmdBaseWorker.wExitUser)
                control['winflag'+wChairID].setSpriteFrame('gendFlag0.png') 
            else if(cmdBaseWorker.dwChiHuKind[wChairID] == WIK_CHI_HU)
                control['winflag'+wChairID].setSpriteFrame('gendFlag1.png') 
            else if(wChairID==cmdBaseWorker.wProvideUser)
                control['winflag'+wChairID].setSpriteFrame('gendFlag2.png') 
            else
                control['winflag'+wChairID].setSpriteFrame('empty.png') 
            
            control['taiTTF'+wChairID].setString((cmdBaseWorker.lGameTaiCount[wChairID]>0?'+':'') + cmdBaseWorker.lGameTaiCount[wChairID]) 
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
    setCurrentDiscardMj:function(cardData, direction)
    {
        var self = tableData.getUserWithUserId(selfdwUserID)
        var d = tableData.getShowChairIdWithServerChairId(self.wChairID)
        if(d == direction)
            majiangFactory.hideCurrentDiscardMj()
        else
           majiangFactory.setCurrentDiscardMj(cardData, direction)
    },
    showLaizi:function()
    {
        var LaiZis = [cmdBaseWorker.cbMagicCardData[0], cmdBaseWorker.TurnoverCard[0].cbCardData]
        for(var i = 0 ; i < LaiZis.length; i++ )
        {
            var cardData = LaiZis[i]
            var bg = new cc.Sprite('#bg_top.png')
            bg.x = 50*i + 25
            bg.y = - 30
            var mj = majiangFactory.getOne(cardData, 1, 0, true)
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
        //if(cmdBaseWorker.cbOutCardCount == 0)
            //return;

        var name = typeof(WIK)=='number'?playNode.wik2Name(WIK):WIK
        if( name != 'magic' )
            playNode.playActionEffect(name, user.cbGender)

        managerAudio.playEffect('gameRes/sound/weave.mp3')
        playNode.playAnimationWithDirection(name, tableData.getShowChairIdWithServerChairId(user.wChairID))
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
        playNode.btn_magic.setVisible(false)
    },
    showActionBtns:function(sortedActions)
    {
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
            else if(action == WIK_MAGIC)
                btn = playNode.btn_magic
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
                    playNode.playActionEffect('hu', tableData.getUserWithChairId(i).cbGender)
                }
            }
        }
    },
    /////other ui end////////
    
    getSoundName:function(cardData) 
    {
        return cardData
    },
    getActionSoundName:function(name, num) 
    { 
        num = num || 1
        return name + (Math.ceil(Math.random()*10))%num        
    },
    playMajiangEffect:function(cardData, isMan)
    {
        var name = playNode.getSoundName(cardData)
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

        for(var i=0;i<GAME_PLAYER;i++)
        {
            tableNode.setBankerIcon(i, false)
        }
    }
}

