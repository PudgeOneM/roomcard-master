

var mainScene = {
    runThisScene:function(callAfterRun)
    {
        mainScene._registEvent()
        mainScene.scene = new cc.Scene()

        mainScene.node = mainNode.getNode(1, this)
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

        mainScene.topListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true
                }
                return false
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget()
            }
        })
        cc.eventManager.addListener(mainScene.topListener, mainScene.listenerTop)
    },
    _registEvent:function()
    {   

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "userFace",
            callback: function(event)
            {   
                var data = event.getUserData()
                var user = data[0]
                var faceIndex = data[1]
                var faceName = chatPop.faceNameArray[faceIndex]
                var spr = actionFactory.getSprWithAnimate('face' + faceName + '_', true, null, null, null, 2)
                var user = tableData.getUserWithUserId(user.dwUserID)
                user.userNodeInsetChair.faceNode.removeAllChildren()
                user.userNodeInsetChair.faceNode.addChild(spr)
            }
        })
        cc.eventManager.addListener(l, 1)
        
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "userTalk",
            callback: function(event)
            {   
                var data = event.getUserData()
                var user = data[0]
                var talkIndex = data[1]
                var talkName = chatPop.talkNameArray[talkIndex]
                
                managerAudio.playEffect('gameRes/sound/chatPop/' + (user.cbGender?'man/':'woman/')  + talkName + '.mp3')

                var isRight = chairFactory.isRight(tableData.getChairWithServerChairId(user.wChairID).node)
                var talkNode = new cc.Node
                talkNode.scale = 0.8
                talkNode.x = isRight?-190:190
                talkNode.y = 45
                user.userNodeInsetChair.faceNode.addChild(talkNode)
                var bg = new cc.Sprite('#talkbox' + (isRight?2:1) + '.png')
                bg.y = -13
                talkNode.addChild(bg)
                var talkText = cc.LabelTTF.create(talkName, "Helvetica", 26)
                talkText.textAlign = cc.TEXT_ALIGNMENT_CENTER
                talkText.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_CENTER
                talkText.setDimensions(cc.size(290, 75))
                talkText.setFontFillColor( cc.color(64, 20, 0, 255) )
                talkNode.addChild(talkText)
                var seq = cc.sequence(cc.delayTime(2), cc.callFunc(
                function()
                {
                    talkNode.removeFromParent()
                })
                )
                talkNode.runAction(seq)
            }
        })
        cc.eventManager.addListener(l, 1)

        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "userItem",
            callback: function(event)
            {   
                var data = event.getUserData()
                var sourceUser = data[0]
                var targerUser = data[1]
                var itemId = data[2]

                var sourceChair = tableData.getChairWithServerChairId(sourceUser.wChairID)
                var targerChair = tableData.getChairWithServerChairId(targerUser.wChairID)
                var sourcePos = sourceChair.node.convertToWorldSpace(sourceChair.userNode.getPosition())
                var targerPos = targerChair.node.convertToWorldSpace(targerChair.userNode.getPosition())

                sourcePos = uiController.uiTop.convertToNodeSpace(sourcePos)
                targerPos = uiController.uiTop.convertToNodeSpace(targerPos)

                var spr = new cc.Sprite('gameRes/pic/headIconPop/item'+itemId+'.png')
                spr.setPosition( cc.p(sourcePos.x,sourcePos.y) )
                uiController.uiTop.addChild(spr)

                var distance = Math.sqrt( Math.pow(targerPos.x - sourcePos.x, 2) + Math.pow(targerPos.y - sourcePos.y, 2) )
                var actionTime = distance/900

                var moveto = cc.moveTo( actionTime, cc.p(targerPos.x, targerPos.y) )
                moveto = cc.EaseSineOut.create(moveto)
                var anima = actionFactory.getAnimate('item' + itemId + '_', true, null, function()
                    {
                        spr.removeFromParent()
                    }, 2)

                spr.runAction( cc.sequence(
                    moveto,
                    cc.callFunc(function()
                    {
                        managerAudio.playEffect('gameRes/sound/headIconPop/item' + itemId + '.mp3')
                    }),
                    anima) )
            }
        })
        cc.eventManager.addListener(l, 1)

        ///////
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "replenish_apply",
            callback: function(event)
            {   
                var data = event.getUserData()
                topUINode.onReplenishApply(data[0], data[1], data[2])
            }
        })
        cc.eventManager.addListener(l, 1)
        
        ///////
        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "payresult",
            callback: function(event)
            {   
                topUINode.controlButton7.setVisible( tableData.hasPay || tableData.getUserWithUserId(selfdwUserID).cbMemberOrder)
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
                currentRoundNode.cards = new cc.Node()
                currentRoundNode.addChild( currentRoundNode.cards )

                currentRoundNode.niuIdxIcon = new cc.Node()
                currentRoundNode.addChild( currentRoundNode.niuIdxIcon )

                currentRoundNode.chipNode = new cc.Node()
                currentRoundNode.addChild( currentRoundNode.chipNode )

                currentRoundNode.scoreChange = new cc.Node()
                currentRoundNode.addChild( currentRoundNode.scoreChange, 1)    

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
                var sign = showChairId>4?1:-1 
                
                if(userId == selfdwUserID)
                {
                    currentRoundNode.cards.setPosition( cc.p(0, 12) )
                    currentRoundNode.niuIdxIcon.setPosition( cc.p(0, -20) )
                    currentRoundNode.chipNode.setPosition( cc.p(220, 0) )
                    currentRoundNode.scoreChange.setPosition( cc.p(0, 80) )
                }
                else
                {       
                    currentRoundNode.cards.setPosition( cc.p(0, -90) )
                    currentRoundNode.niuIdxIcon.setPosition( cc.p(0, -110) )
                    currentRoundNode.chipNode.setPosition( cc.p(-60 * sign, -12) )
                    currentRoundNode.scoreChange.setPosition( cc.p(-50 * sign, 20) )          
                } 
            }
        })
        cc.eventManager.addListener(l, 1)
    },
    clearCurrentRoundNode:function()
    {
        var userNodeInsetChair = this
        userNodeInsetChair.currentRoundNode.cards.removeAllChildren()
        userNodeInsetChair.currentRoundNode.niuIdxIcon.removeAllChildren()
        userNodeInsetChair.currentRoundNode.chipNode.removeAllChildren()
        userNodeInsetChair.currentRoundNode.scoreChange.removeAllChildren()
    },
    decorateTableNode:function()
    {
        tableNode.bgLabel.setString( cc.formatStr(Word_0.w_014, tableKey ) )
        tableNode.bgSpr.setSpriteFrame(tableData.dwStaticBanker == INVALID_DWORD?'unfixbanker.png':'fixbanker.png') 
        ///////////
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

    }

}






