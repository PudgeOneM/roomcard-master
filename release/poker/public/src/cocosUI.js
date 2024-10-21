
var cocos = {}
function createNameEditBox(inputBox, placeHolder, maxLength, fontColor)
{   
    maxLength = maxLength || 8
    //editbox
    var editBoxSize = cc.size(inputBox.getContentSize().width-30, 40)
    var editBox  = cc.EditBox.create(editBoxSize, cc.Scale9Sprite.create())
    editBox.setPosition(15, inputBox.getContentSize().height / 2)
    editBox.setFontSize(30)
    editBox.setPlaceHolder(placeHolder)
    editBox.setMaxLength(maxLength)
    editBox.setAnchorPoint(cc.p(0, 0.5))
    editBox.setFontColor(fontColor || cc.color(63, 51, 43, 255) )
    editBox.setPlaceholderFontColor(fontColor || cc.color(63, 51, 43, 255) )
    editBox.setPlaceholderFontSize(30)
    editBox.setReturnType(cc.KEYBOARD_RETURNTYPE_DONE)
    editBox.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE)
    inputBox.addChild(editBox)
    inputBox.data = ''
    var handler = {
        editBoxEditingDidBegin: function (editBox) {
            // cc.log("editBox editBoxEditingDidBegin");
        },
        editBoxEditingDidEnd: function (editBox) {
            // cc.log("editBox editBoxEditingDidEnd");
        },

        editBoxTextChanged: function (editBox, text) {
            // cc.log("editBox editBoxTextChanged:",text,editBox.getString());
            inputBox.data = editBox.getString()
        },
        editBoxReturn: function (editBox) {
            // cc.log("editBox editBoxReturn");
        },
    }
    editBox.setDelegate(handler)
    return editBox
}

function showTipsTTF(args) // 每次都新建 并加入数组
{
    var parent 
    parent = hasEnterMainScene?uiController.sysTips:cc.director.getRunningScene()

    var str = args.str
    // var parent = args.parent || cc.director.getRunningScene()
    var pos = args.pos || {x:parent.getContentSize().width * 0.5, y:parent.getContentSize().height * 0.6} 
    var color = args.color || cc.color(255, 255, 255, 255) 
    var size = args.size || 28

    if(typeof(tipsTTF) == "undefined" || !tipsTTF.isRunning())
    {   
        tipsTTF = new cc.LabelTTF('', "Helvetica")
        parent.addChild(tipsTTF,100)    
    }

    tipsTTF.setOpacity(255)
    tipsTTF.stopAllActions()

    //
    tipsTTF.setString(str)
    tipsTTF.setFontSize(size)
    tipsTTF.setDimensions(500, 500)
    tipsTTF.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER)
    tipsTTF.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
    tipsTTF.setFontFillColor(color)
    tipsTTF.setPosition(cc.p(pos.x, pos.y))
    // label.align(cc.p(0.5, 0.5), pos.x, pos.y)
    //     :addTo(parent)

    var seq = cc.sequence(cc.FadeOut.create(3),cc.callFunc(
        function()
        {
            args.callBack?args.callBack():''
        },
        tipsTTF)
    )
    tipsTTF.runAction(seq)
}

function getCircleNodeWithSpr(spr)
{
    var node = new cc.Node()
    var radius = Math.min(spr.getContentSize().width, spr.getContentSize().height) / 2

    var stencil = new cc.DrawNode()
    stencil.drawCircle(cc.p(0, 0), radius, cc.degreesToRadians(90), 50, false, radius, cc.color(0, 255, 255, 255))

    var clipper = new cc.ClippingNode()
    clipper.anchorX = 0.5
    clipper.anchorY = 0.5
    clipper.stencil = stencil
    clipper.addChild(spr)

    node.addChild(clipper)


    var circleFrame = new cc.DrawNode()
    circleFrame.drawCircle(cc.p(0, 0), radius, cc.degreesToRadians(90), 50, false, 2, cc.color(0, 255, 255, 255))
    node.addChild(circleFrame)

    return node
}

function getRectNodeWithSpr(spr, noFrame)
{
    var node = new cc.Node()
    var radius = Math.min(spr.getContentSize().width, spr.getContentSize().height) / 2
    var stencil = new cc.DrawNode()
    
    stencil.drawRect(cc.p(-radius, -radius), cc.p(radius, radius), 
        cc.color(255, 255, 255, 255), radius, cc.color(255, 255, 255, 255))

    var clipper = new cc.ClippingNode()
    clipper.anchorX = 0.5
    clipper.anchorY = 0.5
    clipper.stencil = stencil
    clipper.addChild(spr)

    node.addChild(clipper)

    if(!noFrame)
    {
        var circleFrame = new cc.DrawNode()
        circleFrame.drawRect(cc.p(-radius, -radius), cc.p(radius, radius), 
            cc.color(255, 255, 255, 0), 2, cc.color(0, 255, 255, 255))
        node.addChild(circleFrame) 
    }
    return node
}

function getLabel(fontSize, width, maxLineNum)
{
    maxLineNum = maxLineNum || 1
    var label = cc.LabelTTF.create('', "Helvetica", fontSize)

    label.textAlign = cc.TEXT_ALIGNMENT_CENTER
    label.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_CENTER

    label.setDimensions(cc.size(width, maxLineNum * label.getLineHeight()))
    label.setStringNew = function(str)
    {
        var l = cc.LabelTTF.create(str, "Helvetica", fontSize)
        var lineNum = Math.ceil(l.getContentSize().width / width) 
        if(lineNum > maxLineNum)
            label.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP
        else
            label.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_CENTER

        label.setString(str)
    }

    return label
}


var popBox = 
{   
    getOneTwoBtn:function(leftCall, rightCall, cancleCall)
    {   
        cc.BuilderReader.registerController('popBox1', {})
        var control = {}
        control.leftCall = leftCall
        control.rightCall = rightCall || function()
        {   
            node.removeFromParent()
        }  
        control.cancleCall = cancleCall || function()
        {   
            node.removeFromParent()
        }    
    
        var node  = cc.BuilderReader.load(resp_p.popBox1, control)

        // var listener = cc.EventListener.create({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     swallowTouches: true,
        //     onTouchBegan: function (touch, event) {
        //         var target = event.getCurrentTarget()
        //         var locationInNode = target.convertToNodeSpace(touch.getLocation())
        //         var s = target.getContentSize();
        //         var rect = cc.rect(0, 0, s.width, s.height)
        //         if (cc.rectContainsPoint(rect, locationInNode)) {
        //             return false
        //         }
        //         isOpenLogOnMobile?control.cancleCall():''
        //         return true
        //     },
        //     onTouchEnded: function (touch, event) {
        //         isOpenLogOnMobile?control.cancleCall():''
        //     }
        // })
        // cc.eventManager.addListener(listener, node)

        return [node,control]
    },
    getOneSingleBtn:function(call, cancleCall)
    {   
        cc.BuilderReader.registerController('popBox2', {})
        var control = {}
        control.call = call
        control.cancleCall = cancleCall || function()
        {   
            node.removeFromParent()
        }    
    
        var node  = cc.BuilderReader.load(resp_p.popBox2, control)

        // var listener = cc.EventListener.create({
        //     event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //     swallowTouches: true,
        //     onTouchBegan: function (touch, event) {
        //         var target = event.getCurrentTarget()
        //         var locationInNode = target.convertToNodeSpace(touch.getLocation())
        //         var s = target.getContentSize();
        //         var rect = cc.rect(0, 0, s.width, s.height)
        //         if (cc.rectContainsPoint(rect, locationInNode)) {
        //             return false
        //         }
        //         isOpenLogOnMobile?control.cancleCall():''
        //         return true
        //     },
        //     onTouchEnded: function (touch, event) {
        //         isOpenLogOnMobile?control.cancleCall():''
        //     }
        // })
        // cc.eventManager.addListener(listener, node)

        return [node,control]
    }
}

popTips = function(tips, leftbtnIdx, rightbtnIdx)
{
    function getObjWithidx(idx)
    {
        switch(idx)
        {
            case 1:
            {
                var str = '重新连接'
                var call = function()
                {   
                    goHref(appendRefreshtime(window.location.href))
                } 
                break
            }
            case 2:
            {
                var str = '进入大厅'
                var call = function()
                {
                    goHref(appendRefreshtime(hallAddress))
                }
                break
            }
            case 3:
            {
                var str = '查看战绩'
                var call = function()
                {   
                    goHref(appendRefreshtime(resultAddress))
                }

                break
            }
            case 4:
            {
                var str = '去充值'
                var call = function()
                {   
                    goHref(appendRefreshtime(rechargeAddress))
                }

                break
            }
        }

        return {str:str, call:call}
    }

    var cancleCall = null
    // var cancleCall = function(){}

    if(rightbtnIdx)
    {
        var left = getObjWithidx(leftbtnIdx)
        var right = getObjWithidx(rightbtnIdx)

        var call1 = function()
        {   
            node.removeFromParent()
            left.call()
        }
        var call2 = function()
        {   
            node.removeFromParent()
            right.call()
        }

        var pop = popBox.getOneTwoBtn(call1, call2, cancleCall)
        var node = pop[0]
        var control = pop[1]
        control.mainLabel.setString( tips )
        control.leftBtnLabel.setString( left.str )
        control.rightBtnLabel.setString( right.str )
    }
    else
    {   
        var left = getObjWithidx(leftbtnIdx)
        var call = function()
        {   
            node.removeFromParent()
            left.call()
        }
        var pop = popBox.getOneSingleBtn(call, cancleCall)
        var node = pop[0]
        var control = pop[1]
        control.mainLabel.setString( tips )
        control.btnLabel.setString( left.str )
    }

    if(hasEnterMainScene)
    {   
        node.setPosition( cc.p( uiController.sysTips.getContentSize().width * 0.5, uiController.sysTips.getContentSize().height * 0.6) )
        uiController.sysTips.addChild(node) 
    }
    else
    {   
        var scene = cc.director.getRunningScene()
        node.setPosition( cc.p( scene.getContentSize().width * 0.5, scene.getContentSize().height * 0.6) )
        scene.addChild(node)
    }
}

function isRealVisible(node)
{
    if(!node.getParent())
        return node.isVisible()
    else if(!node.isVisible())
        return false

    return isRealVisible(node.getParent())
}


cocos.setTimeout = function(call, time, target)
{
    target = target || uiController.scene
    if(target && target.isRunning)
        target.scheduleOnce(call, time/1000)
    return call
}

cocos.clearTimeout = function(call, target)
{
    target = target || uiController.scene
    if(target && target.isRunning)
        target.unschedule(call)  
}

cocos.setInterval = function(call, time, target)
{
    target = target || uiController.scene
    if(target && target.isRunning)
        target.schedule(call, time/1000)
    // cc.director.getScheduler().unscheduleCallbackForTarget(lable.tickFun, lable)
    return call
}

cocos.clearInterval = function(call, target)
{   
    target = target || uiController.scene
    if(target && target.isRunning)
        target.unschedule(call)  
    // cc.director.getScheduler().schedule(lable.tickFun, lable, 1)            
}

cocos.bindListener = function(callFunc, node)
{
    var listener = cc.EventListener.create
    ({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: false,
        onTouchBegan: function (touch, event) 
        {
            var target = event.getCurrentTarget()
            if(!isRealVisible(target)) return false
            var locationInNode = target.convertToNodeSpace(touch.getLocation())
            var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
            var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
            
            if(isTouchInNode) {
                return true
            }
            return false
        },
        onTouchEnded: function (touch, event) 
        {
            var target = event.getCurrentTarget()
            var locationInNode = target.convertToNodeSpace(touch.getLocation())
            var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
            var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
            
            if(isTouchInNode) 
                callFunc()
        }
    })
    cc.eventManager.addListener(listener, node)
}