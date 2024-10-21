

var mainScene = {
    runThisScene:function(callAfterRun)
    {
        mainScene._registEvent()

        mainScene.scene = new cc.Scene()
    
        if(cc.sys.isMobile)
            mainScene.node = mainNode.getNode(2, this)
        else
            mainScene.node = mainNode.getNode(3, this)
        

        mainScene.scene.addChild(mainScene.node)
        ////
        tableNode.init(resp.tableCCB)
        tableNode.decorateTableNode()
        mainScene.uiTable.addChild(tableNode.node)

        mainScene.decorateTableNode()

        /////
        playNode.init()
        mainScene.uiPlay.addChild(playNode.node)

        ///////
        topUINode.init()
        mainScene.uiTopUI.addChild(topUINode.node)

        mainScene._initListener()

        if(isOpenFocus)
        {
            var hasFocus = wxData && wxData.data.wx_subject
            var haspopToday = getLocalStorage('lastPopTime') && ( new Date().getTime() - getLocalStorage('lastPopTime') < 1000 * 3600 * 1 )

            //有效期
            var endTime = 2018010200    //2018.01.02 00:00
            var nowTime = new Date()
            var nowTimeString = nowTime.getFullYear() * 1000000 + (nowTime.getMonth() + 1) * 10000 + nowTime.getDate() * 100 + nowTime.getHours()
            var bValid = nowTimeString < endTime

            var isNeedpop = !hasFocus && !haspopToday && bValid

            if(isNeedpop)
            {   
                cocos.setTimeout(function()
                    {
                        document.getElementById('focus').style.display = 'block'
                        setLocalStorage('lastPopTime', new Date().getTime())
                    }, 
                    0.1)
            }
        }

        cc.director.runScene(mainScene.scene)

        console.log(333,cc.eventManager) 
    },
    reset:function()
    {
        // cc.eventManager.removeCustomListeners('touchTableBottom')  
    },
    _initListener:function()
    {
        var l = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                return managerTouch.isQuickTouch(target, 200)
            },
            onTouchEnded: function (touch, event) {
            }
        })
        cc.eventManager.addListener(l, mainScene.listenerManagerQuick)
    },
    _registEvent:function()
    {  
        ///////
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "isSelfSitChair",
            callback: function(event)
            {   
                topUINode.limitUINode.setVisible( event.getUserData() )

                // topUINode.voiceNode.setVisible(selfdwUserID == tableData.createrUserID || event.getUserData())
            }
        })
        cc.eventManager.addListener(l, 1)

        ///////
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "userNodeInsetChairInit",
            callback: function(event)
            {   
                var currentRoundNode = new cc.Node()
                currentRoundNode.handCards = new cc.Node()
                currentRoundNode.addChild( currentRoundNode.handCards )

                currentRoundNode.outCards = new cc.Node()
                currentRoundNode.addChild( currentRoundNode.outCards )

                currentRoundNode.scoreChange = new cc.Node()
                currentRoundNode.addChild( currentRoundNode.scoreChange, 1)    

                currentRoundNode.warnNode = new cc.Node()
                currentRoundNode.addChild( currentRoundNode.warnNode, 1)    

                currentRoundNode.handCardsNum = new ccui.TextAtlas()
                currentRoundNode.handCardsNum.setAnchorPoint(cc.p(0.5, 0))
                currentRoundNode.handCardsNum.setProperty("", resp.nums1, 16, 23, "0")
                currentRoundNode.addChild( currentRoundNode.handCardsNum, 1)    

                currentRoundNode.tipsSpr = new cc.Sprite('#empty.png')
                currentRoundNode.addChild( currentRoundNode.tipsSpr)    

                currentRoundNode.scoreTTF = cc.LabelTTF.create('', "Helvetica", 20)
                currentRoundNode.scoreTTF.setFontFillColor( cc.color(244, 230, 159, 255) )
                currentRoundNode.addChild(currentRoundNode.scoreTTF)  
                currentRoundNode.scoreTTF.anchorY = 0


                //////
                var userNodeInsetChair = event.getUserData()
                userNodeInsetChair.addChild(currentRoundNode)
                userNodeInsetChair.currentRoundNode = currentRoundNode  

            }
        })
        cc.eventManager.addListener(l, 1)

        ///////
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "userNodeInsetChairUpdate",
            callback: function(event)
            {   
                var data = event.getUserData()
                var currentRoundNode = data[0].currentRoundNode

                var userId = data[1]
                
                var user = tableData.getUserWithUserId(userId)
                var showChairId = tableData.getShowChairIdWithServerChairId(user.wChairID)

                if(showChairId==0||showChairId==3)
                    sign = -1
                else
                    sign = 1

                currentRoundNode.outCards.setPosition( cc.p(-40 * sign, 0) )
                currentRoundNode.scoreChange.setPosition( cc.p(-50 * sign, 40) )  
                currentRoundNode.tipsSpr.setPosition( cc.p(-45 * sign, 0) )
                currentRoundNode.tipsSpr.setAnchorPoint(cc.p((1 + sign)*0.5, 0.5))


                currentRoundNode.handCardsNum.setPosition( cc.p(-72* sign, 60) )    
                currentRoundNode.warnNode.setPosition( cc.p(-43* sign, 60) )  

                currentRoundNode.scoreTTF.setPosition( cc.p(0, 65) )  

                var size = tableNode.node.getContentSize()
                if(userId == selfdwUserID)
                {
                    currentRoundNode.handCards.setPosition( cc.p( size.width*0.5 - 60, -200) )
                }
                else
                {       
                    currentRoundNode.handCards.setPosition( cc.p( -(size.width*0.5 - 60), 200) )
                } 
            }
        })
        cc.eventManager.addListener(l, 1)
    },
    clearCurrentRoundNode:function()
    {
        var userNodeInsetChair = this
        userNodeInsetChair.currentRoundNode.handCards.removeAllChildren()
        userNodeInsetChair.currentRoundNode.outCards.removeAllChildren()
        userNodeInsetChair.currentRoundNode.scoreChange.removeAllChildren()
        userNodeInsetChair.currentRoundNode.handCardsNum.setString('')
        userNodeInsetChair.currentRoundNode.warnNode.removeAllChildren()
        userNodeInsetChair.currentRoundNode.tipsSpr.setSpriteFrame('empty.png')

        userNodeInsetChair.currentRoundNode.scoreTTF.setString('')

        chairFactory.hideFiredCircle.call(userNodeInsetChair)
    },
    decorateTableNode:function()
    {
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
                var event = new cc.EventCustom("touchTableBottom")
                cc.eventManager.dispatchEvent(event)
            }
        })
        cc.eventManager.addListener(listener, tableNode.listenerBottom)

        tableData.updateOnFree = function(player_allowStart)
        {
            var users = tableData.getUsersInTable(tableData.getUserWithUserId(selfdwUserID).wTableID)
            if(users.length>=player_allowStart)
            {   
                // if(tableData.createrUserID == selfdwUserID)
                // {
                //     tableNode.shareButton.setVisible(false)
                // }
                if(tableData.managerUserID == selfdwUserID)
                {
                    tableNode.shareButton.setVisible(false)
                }
            }  
            if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT)
                socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
        }
        // var size = tableNode.node.getContentSize()
        // var userNode0 = tableData.getChairWithShowChairId(0).userNode
        // userNode0.setPosition(cc.p( -size.width*0.5 + 80, cardFactory.height*0.5 + 80 ))

        // var userNode1 = tableData.getChairWithShowChairId(1).userNode
        // userNode1.setPosition(cc.p( size.width*0.5 - 80, -cardFactory.height*0.5 - 80 ))



        /////////
    }

}






