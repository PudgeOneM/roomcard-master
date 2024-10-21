

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
            var haspopToday = getLocalStorage('lastPopTime') && ( new Date().getTime() - getLocalStorage('lastPopTime') < 1000 * 3600 * 24 )
            var isNeedpop = !hasFocus && !haspopToday
            if(isNeedpop)
            {   
                window.setTimeout(function()
                {
                    document.getElementById('focus').style.display = 'block'
                    setLocalStorage('lastPopTime',new Date().getTime())
                },100)
            }
        }

        cc.director.runScene(mainScene.scene)
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
            eventName: "userFace",
            callback: function(event)
            {   
                var data = event.getUserData()
                var user = data[0]
                var faceId = data[1]
                if(faceId>100)
                {
                    if(user.cbGender)
                        managerAudio.playEffect('gameRes/sound/man/faceSound' + faceId + '.mp3')
                    else
                        managerAudio.playEffect('gameRes/sound/woman/faceSound' + faceId + '.mp3')
                }
            }
        })
        cc.eventManager.addListener(l, 1)

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
                currentRoundNode.handCardsNum.setProperty("", resp.nums1, 18, 26, "0")
                currentRoundNode.addChild( currentRoundNode.handCardsNum, 1)    

                currentRoundNode.tipsSpr = new cc.Sprite('#empty.png')
                currentRoundNode.addChild( currentRoundNode.tipsSpr)    

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
                var sign = showChairId==1?1:-1 

                var size = tableNode.node.getContentSize()
                var chair = tableData.getChairWithShowChairId(showChairId)

                if(userId == selfdwUserID)
                {
                    var offsetX = size.width*0.5-65
                    var offsetY = - (240 - 1 - cardFactory.height*0.5)

                    currentRoundNode.handCards.setPosition( cc.p(offsetX, offsetY) )
                    currentRoundNode.outCards.setPosition( cc.p(offsetX, 160 + offsetY) )
                    currentRoundNode.scoreChange.setPosition( cc.p(0, 80) )
                    currentRoundNode.tipsSpr.setPosition( cc.p(offsetX, 150 + offsetY) )


                    // chair.userNode.setPosition( cc.p(size.width*0.5 - 60, 147) )
                }
                else
                {       
                    // currentRoundNode.handCards.setPosition( cc.p(0, -90) )
                    currentRoundNode.outCards.setPosition( cc.p(-40 * sign, 0) )
                    currentRoundNode.scoreChange.setPosition( cc.p(-50 * sign, 30) )  
                    currentRoundNode.tipsSpr.setPosition( cc.p(-120 * sign, 0) )
                    currentRoundNode.tipsSpr.setAnchorPoint(cc.p((1 + sign)*0.5, 0.5))


                    currentRoundNode.handCardsNum.setPosition( cc.p(-80 * sign, 62) )    
                    currentRoundNode.warnNode.setPosition( cc.p(0, 62) )  

                    // chair.userNode.setPosition(cc.p(0, 0))
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
        /////////
    }

}






