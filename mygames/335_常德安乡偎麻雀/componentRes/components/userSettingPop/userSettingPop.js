

//游戏内需要切换普通话 方言时用这个
var userSettingPop = userSettingPop = 
{   
    resp:'components/userSettingPop/res/',
    itemShowState:[true, true, true],
    itemNodes:[],
    itemNamesMap:[
    '动画',
    '音效',
    '语言',
    ],
    getPreLoadRes:function()
    {
        var resp = userSettingPop.resp

        return [
            resp + 'userSettingPop.plist', 
            resp + 'userSettingPop.png'
        ]
    },
    onPreLoadRes:function()
    {
        var resp = userSettingPop.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'userSettingPop.plist', resp + 'userSettingPop.png')

        if(typeof(getLocalStorage('isOpenEffect_' + KIND_ID))  == 'undefined')
            setLocalStorage('isOpenEffect_' + KIND_ID, 'open')

        if(typeof(getLocalStorage('isOpenSound_' + KIND_ID)) == 'undefined')
            setLocalStorage('isOpenSound_' + KIND_ID, 'open')

        isOpenEffect = getLocalStorage('isOpenEffect_' + KIND_ID) == 'open'
        isOpenSound = getLocalStorage('isOpenSound_' + KIND_ID) == 'open'

        isOpenPTH = (getLocalStorage('isOpenPTH_' + KIND_ID) == 'open')
    },
    getPop:function()
    {   
        var resp = userSettingPop.resp
        var control = {}
        var node  = cc.BuilderReader.load(resp + 'userSettingPop.ccbi', control)

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
                userSettingPop._updateData.call(control)
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
                    userSettingPop._updateData.call(control)
                    return false 
                }
            },
            onTouchEnded: function (touch, event) {
            }
        })
        cc.eventManager.addListener(listener, node)

        for(var i=0; i<2; i++)
        {
            (function(i)
            {
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
                        control.styleChoose.x = control['styleSpr'+i].x
                    }
                })
                cc.eventManager.addListener(listener, control['styleSpr'+i])
            })(i)
        }

        ////////
        for(var i=0; i<userSettingPop.itemShowState.length; i++)
        {
            //先这样处理 有时间把这个改下 不要变暗 无用的选择就直接不显示 需要手写ui
            if(!userSettingPop.itemShowState[i])
            {
                control['switchOn' + '_' + i].color = cc.color( 100, 100, 100)
                control['switchOff' + '_' + i].color = cc.color( 100, 100, 100)
                continue  
            }

            (function(i)
            {
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
                        control['switchOn' + '_' + i].setVisible(!control['switchOn' + '_' + i].isVisible())
                        control['switchOff' + '_' + i].setVisible(!control['switchOff' + '_' + i].isVisible())
                    }
                })
                cc.eventManager.addListener(listener, control['switchNode' + '_' + i])
            })(i)
        }

        userSettingPop._refreshUi.call(control)

        if(gameorientation == 'landscape')
            node.setScale(0.8)
        return node
    },
    _updateData:function()
    {
        var currentStyleMode = styleArray[0]
        var chooseStyleMode = 0
        for(var i=0;i<2;i++)
        {
            if( this.styleChoose.x == this['styleSpr'+i].x )
            {
                chooseStyleMode = i
                break
            }
        }

        if(currentStyleMode!=chooseStyleMode)
        {
            if(chooseStyleMode==0)
                styleArray = [0, 0]
            else if(chooseStyleMode==1)
                styleArray = [1, 1]            

            setLocalStorage( 'styleArray_' + KIND_ID, JSON.stringify(styleArray) )

            var event = new cc.EventCustom("styleChange")
            cc.eventManager.dispatchEvent(event)
        }

        isOpenEffect = this.switchOn_0.isVisible()
        setLocalStorage('isOpenEffect_' + KIND_ID, isOpenEffect?'open':'close')

        isOpenSound = this.switchOn_1.isVisible()
        setLocalStorage('isOpenSound_' + KIND_ID, isOpenSound?'open':'close')

        isOpenPTH = this.switchOn_2.isVisible()
        setLocalStorage('isOpenPTH_' + KIND_ID, isOpenPTH?'open':'close')    
        
    },
    _refreshUi:function()
    {   
        var styleMode = styleArray[0]
        console.log(555, this.switchOn_0, this['styleSpr'+0])
        this.styleChoose.x = this['styleSpr'+styleMode].x

        this.switchOn_0.setVisible(isOpenEffect)
        this.switchOff_0.setVisible(!isOpenEffect)

        this.switchOn_1.setVisible(isOpenSound)
        this.switchOff_1.setVisible(!isOpenSound)

        this.switchOn_2.setVisible(isOpenPTH)
        this.switchOff_2.setVisible(!isOpenPTH)
    },  
}

