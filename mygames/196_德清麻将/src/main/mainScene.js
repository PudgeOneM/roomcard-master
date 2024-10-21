
var mainScene = {
    runThisScene:function(callAfterRun)
    {
        mainScene._registEvent()

        mainScene.scene = new cc.Scene()
    
        var is700 = false
        if(cc.sys.isMobile)
        {
            mainScene.node = mainNode.getNode(2, this)
            if(mainScene.main.width<700)
            {
                is700 = true
                mainScene.main.scaleY = mainScene.node.width/700
            }
        }
        else
        {
            mainScene.node = mainNode.getNode(3, this)
            if(mainScene.main.height<700)
            {
                is700 = true
                mainScene.main.scaleY = mainScene.node.height/700
            }
        }


        mainScene.scene.addChild(mainScene.node)
        //
        tableNode.init(resp.tableCCB)
        tableNode.decorateTableNode()
        mainScene.uiTable.addChild(tableNode.node)
        mainScene.decorateTableNode()

        if(is700)
            tableNode.topNode.y = 700

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
                cocos.setTimeout(function()
                    {
                        document.getElementById('focus').style.display = 'block'
                        setLocalStorage('lastPopTime',new Date().getTime())
                    }, 
                    0.1)
            }
        }

        cc.director.runScene(mainScene.scene)
    },
    _initListener:function()
    {
        // var l = cc.EventListener.create({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     swallowTouches: true,
        //     onTouchBegan: function (touch, event) {
        //         var target = event.getCurrentTarget()
        //         return managerTouch.isQuickTouch(target, 100)
        //     },
        //     onTouchEnded: function (touch, event) {
        //     }
        // })
        // cc.eventManager.addListener(l, mainScene.listenerManagerQuick)
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
            eventName: "isSelfSitChair",
            callback: function(event)
            {   
                topUINode.limitUINode.setVisible( event.getUserData() )
            }
        })
        cc.eventManager.addListener(l, 1)
    },
    decorateTableNode:function()
    {
    },

}






