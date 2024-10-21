var actionFactory = 
{
    getAnimation:function(framePrefix, delayPerUnit, timePerOnce, totalTime)
    {	  
        delayPerUnit = delayPerUnit || 0.3
        var animFrames = []
        for(var i=1;;i++)
        {   
            var frame = cc.spriteFrameCache.getSpriteFrame(framePrefix + i + '.png')

            if(!frame)
                break
            animFrames[animFrames.length] = frame
        }
        delayPerUnit = timePerOnce?timePerOnce/(animFrames.length-1):delayPerUnit

        var repeatTime = totalTime?Math.ceil( totalTime / (delayPerUnit * (animFrames.length-1)) ) : 1 

        var newAnimFrames  = []
        for(var i=0;i<repeatTime;i++ )
        {
            newAnimFrames = newAnimFrames.concat(animFrames)
        }

        var animation = new cc.Animation(newAnimFrames, delayPerUnit)

        return animation
    },
    getAnimate:function(framePrefix, isOnce, delayPerUnit, onFinish, timePerOnce, totalTime)
    {   
        var animation = actionFactory.getAnimation(framePrefix, delayPerUnit, timePerOnce, totalTime)
        if(isOnce)
        {
            var a1 = cc.animate(animation)
            var a2 = cc.callFunc(function()
                        {
                            onFinish?onFinish():''
                        })
            var a3 = cc.sequence(a1, a2)

            return a3
        }
        else
        {
            return cc.animate(animation).repeatForever()
        }
    },
    getSprWithAnimate:function(framePrefix, isOnce, delayPerUnit, onFinish, timePerOnce, totalTime)
    {   
        var spr = new cc.Sprite(resp_p.empty)
        if(isOnce)
        {
            var fun = function()
            {
                onFinish?onFinish():''
                spr.removeFromParent()
            } 
        }
        spr.runAction( actionFactory.getAnimate(framePrefix, isOnce, delayPerUnit, fun, timePerOnce, totalTime) )   
        return spr
    },
    showLoadAnimation:function()
    {   
        var scene = cc.director.getRunningScene()
        var spr = actionFactory.getSprWithAnimate('load_', false, 0.1)
        spr.setPosition( cc.p(scene.getContentSize().width*0.5, scene.getContentSize().height*0.6) )
        scene.addChild(spr, 100, 100123)
    },
    hideLoadAnimation:function()
    {   
        var scene = cc.director.getRunningScene()
        if(scene.getChildByTag(100123))
            scene.removeChildByTag(100123)
    },
}
