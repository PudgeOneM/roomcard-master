var roomOwnerPop = 
{   
    resp:'components/roomOwnerPop/res/',
    getPreLoadRes:function()
    {
        var resp = roomOwnerPop.resp

        return [
            resp + 'roomOwnerPop.plist', 
            resp + 'roomOwnerPop.png'
        ]
    },
    onPreLoadRes:function()
    {
        var resp = roomOwnerPop.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'roomOwnerPop.plist', resp + 'roomOwnerPop.png')
    },
    getPop:function(bIsControlOpen, wMaxTimes)
    {   
        var resp = roomOwnerPop.resp
        var control = {}
        var node  = cc.BuilderReader.load(resp + 'roomOwnerPop.ccbi', control)

        control.slider = new ccui.Slider()
        var slider = control.slider
        slider.setTouchEnabled(true)
        slider.loadBarTexture(resp + 'roomOwner_bar0.png')
        slider.loadProgressBarTexture(resp + 'roomOwner_bar1.png')
        slider.loadSlidBallTextures(resp + 'roomOwner_rchip.png',resp + 'roomOwner_rchip.png',"")
        slider.x = 0
        slider.y = 0
        control.sliderNode.addChild(slider)
        slider.addEventListener(function(slider, type)
            {
                if (type == ccui.Slider.EVENT_PERCENT_CHANGED){
                    var percent = slider.getPercent();
                    control.times = Math.floor( percent/100*(10) )
                    roomOwnerPop._refreshwMaxTimesLabel.call(control, control.times)
                }
            }, control)

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
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
                control.switchOn.setVisible(!control.switchOn.isVisible())
                control.switchOff.setVisible(!control.switchOff.isVisible())
            }
        })
        cc.eventManager.addListener(listener, control.switchNode)


        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
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
                node.removeFromParent()
                roomOwnerPop._sendMsg.call(control, bIsControlOpen, wMaxTimes)
            }
        })
        cc.eventManager.addListener(listener, control.closeIcon)


        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) 
                {
                    return true
                }
                else
                {
                    node.removeFromParent()
                    roomOwnerPop._sendMsg.call(control, bIsControlOpen, wMaxTimes)
                    return false 
                }
            },
            onTouchEnded: function (touch, event) {
            }
        })
        cc.eventManager.addListener(listener, node)

        roomOwnerPop._refreshSwicth.call(control, bIsControlOpen)
        roomOwnerPop._refreshSlider.call(control, wMaxTimes)
        roomOwnerPop._refreshwMaxTimesLabel.call(control, wMaxTimes)

        if(gameorientation == 'landscape')
            node.setScale(0.8)
        return node
    },
    _sendMsg:function(bIsControlOpen, wMaxTimes)
    {
        var times = this.times
        var isControlOpen = this.switchOn.isVisible()?1:0

        if( typeof(times) != 'undefined' && parseInt(times) != parseInt(wMaxTimes) )
        {
            var obj = getObjWithStructName('CMD_GR_C_SetMaxTimesTakeIn') 
            obj.wMaxTimes = times
            obj.szTableKey = tableKey
            socket.sendMessage(MDM_GR_MANAGE, SUB_GR_SET_MAX_TIMES_TAKEIN, obj)
        }
        if( parseInt(isControlOpen) != parseInt(bIsControlOpen) )
        {
            var obj = getObjWithStructName('CMD_GR_C_SetControlTakeIn') 
            obj.bOpen = isControlOpen
            obj.szTableKey = tableKey
            socket.sendMessage(MDM_GR_MANAGE, SUB_GR_SET_CONTROL_TAKEIN, obj)
        }
    },
    _refreshSwicth:function(bIsControlOpen)
    {   
        this.switchOn.setVisible(bIsControlOpen)
        this.switchOff.setVisible(!bIsControlOpen)
    },  
    _refreshSlider:function(wMaxTimes)
    {
        this.slider.setPercent((wMaxTimes)/(10) * 100)
    },
    _refreshwMaxTimesLabel:function(times)
    {
        // gameLog.log(times)
        if(this['times' + times].getScale() == 1.5)
            return;

        for(var i=0;i<11;i++)
        {   
            var l = this['times' + i]
            if(i == times)
            {
                l.setScale(1.5)
                l.setColor(cc.color(122,222,222))
            }
            else
            {
                l.setScale(1) 
                l.setColor(cc.color(222,222,222))
            }
        }
        
    }
}




