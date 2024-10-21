
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

        playNode.scoreTTF = tableNode.scoreTTF
        playNode.laiziNode = tableNode.laiziNode
        playNode.mjsNode = tableNode.mjsNode
        playNode.mjTableNode = tableNode.mjsNode
        playNode.timerNode = tableNode.timerNode

        /////
        playNode.init()
        mainScene.uiPlay.addChild(playNode.node)

        ///////
        topUINode.init()
        mainScene.uiTopUI.addChild(topUINode.node)

        mainScene._initListener()

        // if(isOpenFocus)
        // {
        //     var hasFocus = wxData && wxData.data.wx_subject
        //     var haspopToday = getLocalStorage('lastPopTime') && ( new Date().getTime() - getLocalStorage('lastPopTime') < 1000 * 3600 * 24 )
        //     var isNeedpop = !hasFocus && !haspopToday
        //     if(isNeedpop)
        //     {   
        //         cocos.setTimeout(function()
        //             {
        //                 document.getElementById('focus').style.display = 'block'
        //                 setLocalStorage('lastPopTime',new Date().getTime())
        //             }, 
        //             0.1)
        //     }
        // }
        
        //1.19-1.28 3D麻将打5折
        var t = new Date().getTime()
        var is = gameKind == '25D4P14' && t>1516291200000 && t<1517068800000
        if(isOpenFocus && is)
        {
            var hasFocus = wxData && wxData.data.wx_subject
            var haspopToday = getLocalStorage('lastPopTime') && ( new Date().getTime() - getLocalStorage('lastPopTime') < 1000 * 3600 * 1 )

            var isNeedpop = !hasFocus && !haspopToday

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
    },
    _initListener:function()
    {
        var l = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                return managerTouch.isQuickTouch(target, 50)
            },
            onTouchEnded: function (touch, event) {
            }
        })
        cc.eventManager.addListener(l, mainScene.listenerManagerQuick)
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
                var talkName //= chatPop.talkNameArray[talkIndex]
                 var voiceArray = [
                    '别吵了搓麻将专心点',  
                    '吃吃吃就知道吃小心变猪头', 
                    '动作快点行么',  
                    '麻将这么差不来了', 
                    '你牌打不打的来', 
                    '小胡先胡下 运气快点来',
                    '这么厉害连庄好几副啊', 
                ]
                var voiceArray1 = [
                    '快点啊，等的睡着了', 
                    '别吵了专心打麻将', 
                    '别催啦 我还没想好呢',  
                    '技术太差回家练练再来', 
                    '你今天手气太差了',  
                    '佩服还是你水平高',
                    '碰到你们就是缘分', 
                    '上家别小气 打一张吃一下',
            
                ]

                if (user.cbGender) 
                {
                    talkName = voiceArray[talkIndex]
                }
                else
                {
                    talkName = voiceArray1[talkIndex]
                }
                
                
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
    }

}






