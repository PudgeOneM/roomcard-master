var clock = 
{   
    resp:'components/clock/res/',
    preLoadRes:[
    ],
    onPreLoadRes:function()
    {   
        //直接用路径创建精灵 第一次加载会有问题
        // var resp = clock.resp
        // var t = new cc.SpriteFrame(resp + 'clockSpr.png', cc.rect(0, 0, 111, 101)) 
        // cc.spriteFrameCache.addSpriteFrame(t, "clockSpr.png")
    },
    getOneClock:function(timeNum, timeOutCallback, perSecondcallBack)
    {   
        var resp = clock.resp
        var control = {}

        var clockNode = new cc.Node()
        var clockSpr =  new cc.Sprite(resp + 'clockSpr.png')
        clockSpr.setPosition(cc.p(1, 10))
        clockNode.addChild(clockSpr) 

        var clockLabel = new ccui.TextAtlas()
        clockLabel.setProperty("1", resp + 'clockNum.png', 18, 26, "0")
        clockLabel.setAnchorPoint(cc.p(0.5,0.5))
        clockNode.addChild(clockLabel)

        var timeOutCallbackX = timeOutCallback
        timeOutCallback = function()
        {
            timeOutCallbackX?timeOutCallbackX():''
            clockNode.removeFromParent()
        }

        // var perSecondcallBackX = perSecondcallBack
        // perSecondcallBack = function()
        // {
        //     perSecondcallBackX?perSecondcallBackX():''
        //     if(isOpenTickFun() && parseInt( clockLabel.getString() ) <= 3)
        //         managerAudio.playEffect(resp + 'tick.mp3')
        // }

        function getStrFun(str)
        {
            return parseInt(str) - 1
        }

        clock.tickLabel(clockLabel, timeNum, 0, getStrFun, timeOutCallback, perSecondcallBack)

        control.clockNode = clockNode
        control.clockSpr = clockSpr
        control.clockLabel = clockLabel
        return control
    },
    tickLabel:function(lable, originStr, endStr, getStrFun, timeOutCallback, perSecondcallBack)
    {   
        if(lable.clearTick)
            lable.clearTick()

        lable.tickFun = function()
        {
            if(lable.getString() == endStr)
            {
                lable.clearTick()
                timeOutCallback?timeOutCallback():''
            }
            var str = getStrFun(lable.getString())
            lable.setString(str)   
            perSecondcallBack?perSecondcallBack():''
        }

        lable.clearTick = function()
        {
            cocos.clearInterval(lable.tickFun, lable)
            lable.clearTick = null
        }

        lable.setString(originStr)
        cocos.setInterval(lable.tickFun, 1000, lable)


        // var t = lable.onExit
        // lable.onExit = function()
        // {
        //     t.apply(lable)
        //     window.clearInterval(setintervalId)
        // }

        // var setintervalId = window.setInterval(
        //     function()
        //     {
        //         if(lable.getString() == endStr)
        //         {   
        //             // lable.clearTick()
        //             if(lable.closeTimeOutCallback)
        //             {
        //                 lable.closeTimeOutCallback = null
        //             }
        //             else
        //                 timeOutCallback?timeOutCallback():''
        //         }
        //         var str = getStrFun(lable.getString())
        //         lable.setString(str)    
        //         perSecondcallBack?perSecondcallBack():''
        //     },1000)

        // lable.clearTick = function()
        // {
        //     window.clearInterval(setintervalId)
        //     lable.clearTick = null
        // }

    }
}






