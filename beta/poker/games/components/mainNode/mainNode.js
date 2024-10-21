var mainNode = 
{
    getNode:function(sceneIdx) 
    {
        var parent = uiController
        var s = cc.director.getWinSize()
        var node  = cc.BuilderReader.load('components/mainNode/res/mainNode'+sceneIdx+'.ccbi', parent)

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

        return node
    }
}