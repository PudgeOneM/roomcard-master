var mainNode = 
{
    resp:'components/mainNode/res/',
    isNeedPopAd:null,
    getIsNeedPopAd:function()
    {
        if(mainNode.isNeedPopAd == null)
        {
            //2.7-2.14  每天弹一次
            //2.15-2.22 每小时弹一次
            var t = new Date().getTime()
            if(t>1517932800000 && t<1518537600000)
            {
                var popHz = 1000 * 3600 * 24
                var hasPopJust= getLocalStorage('lastPopAdTime') && ( t - getLocalStorage('lastPopAdTime') < popHz )
                if(!hasPopJust)
                {
                    mainNode.isNeedPopAd = true
                    setLocalStorage('lastPopAdTime', t)
                }
            }
            else if(t>1518624000000 && t<1519228800000)
            {
                var popHz = 1000 * 3600 * 1
                var hasPopJust= getLocalStorage('lastPopAdTime') && ( t - getLocalStorage('lastPopAdTime') < popHz )
                if(!hasPopJust)
                {
                    mainNode.isNeedPopAd = true
                    setLocalStorage('lastPopAdTime', t)
                }
            }
        }

        return mainNode.isNeedPopAd
    },
    getPreLoadRes:function()
    {
        if( !mainNode.getIsNeedPopAd() )
            return []

        var resp = mainNode.resp
        if(platform == 'zhangqu')
            var pic = resp + 'adZhangqu.png'
        else
            var pic = resp + 'ad.png'

        return[
            pic
        ]
    },
    onPreLoadRes:function()
    {   
    },
    onReStart:function()
    {
        mainNode.isNeedPopAd = null
    },
    getNode:function(sceneIdx) 
    {
        var resp = mainNode.resp

        var parent = uiController
        var s = cc.director.getWinSize()
        var node  = cc.BuilderReader.load(resp + 'mainNode'+sceneIdx+'.ccbi', parent)

        if(isReversalWinSize)
        {
        	var s = node.getContentSize()
        	parent.uiExpression.setContentSize(s.height, s.width)
        	parent.uiTop.setContentSize(s.height, s.width)
        	parent.sysTips.setContentSize(s.height, s.width)
            parent.top.setContentSize(s.height, s.width)
        }

        parent.topListener = cc.EventListener.create({
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
            }
        })
        cc.eventManager.addListener(parent.topListener, parent.listenerTop)

        if(mainNode.getIsNeedPopAd())
        {
            if(platform == 'zhangqu')
                var pic = resp + 'adZhangqu.png'
            else
                var pic = resp + 'ad.png'
            var adSpr = new cc.Sprite( pic )
            var maxAdWidth = node.width
            var maxAdHeight = node.height
            adSpr.setScale( Math.min(maxAdWidth/adSpr.width, maxAdHeight/adSpr.height) )
            adSpr.x = node.width*0.5
            adSpr.y = node.height*0.5
            node.addChild(adSpr)  

            var listener = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    // var target = event.getCurrentTarget()
                    // var locationInNode = target.convertToNodeSpace(touch.getLocation())
                    // var s = target.getContentSize();
                    // var rect = cc.rect(0, 0, s.width, s.height)
                    // if (cc.rectContainsPoint(rect, locationInNode)) {
                        return true
                    // }
                    // return false
                },
                onTouchEnded: function (touch, event) {
                    adSpr.removeFromParent()
                }
            })
            cc.eventManager.addListener(listener, adSpr)
        }

        return node
    }
}