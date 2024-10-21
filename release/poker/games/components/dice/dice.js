var dice = 
{   
    resp:'components/dice/res/',
    getPreLoadRes:function()
    {
        var resp = dice.resp

        return [
            resp + 'dice.plist', 
            resp + 'dice.png'
        ]
    },
    onPreLoadRes:function()
    {
        var resp = dice.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'dice.plist', resp + 'dice.png')
    },
    getThrowedDiceSpr:function(controlPoints, endDiceNum, time, call) 
    {
    	time = time || 1
    	var timePerFrame = 0.1
    	var frameLen =  Math.ceil(time/timePerFrame)
    	time = timePerFrame * frameLen

    	var bezierForward = cc.bezierTo(time, controlPoints)

    	var diceQueue = []
    	var animFrames = []
    	for(var i=0;i<frameLen-1;i++)
    	{
    		if(i>0)
    			var d = dice._getRandNumWithoutOne(diceQueue[diceQueue.length-1])
    		else
    			var d = Math.ceil(Math.random()*100)%6+1

    		diceQueue[diceQueue.length] = d
    		animFrames[animFrames.length] = cc.spriteFrameCache.getSpriteFrame('dice_' + d + '.png')
    	}
    	diceQueue[diceQueue.length] = endDiceNum
    	animFrames[animFrames.length] = cc.spriteFrameCache.getSpriteFrame('dice_' + endDiceNum + '.png')  

		var animation = new cc.Animation(animFrames, timePerFrame)
		var animate = cc.animate(animation)

		var a = cc.sequence(
			cc.spawn(bezierForward, animate).easing(cc.easeSineOut()),
            cc.delayTime(0.8),
			cc.callFunc(function()
                        {
                        	diceSpr.removeFromParent()
                           	call?call():''
                        })
			)

		var diceSpr = new cc.Sprite('#dice_' + diceQueue[0] + '.png')

        diceSpr.runAction(a)

        return diceSpr
    },
    _getRandNumWithoutOne:function(num)
    {
    	var t = [1,2,3,4,5,6]
    	for(var i=0;i<t.length;i++)
    	{
    		if(t[i]==num)
    		{
    			t.splice(i, 1)
    			break
    		}
    	}

    	return t[Math.ceil(Math.random()*100)%5]
    }

}





