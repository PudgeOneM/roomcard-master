
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
        //
        
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






