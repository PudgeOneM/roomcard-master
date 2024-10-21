var majiangTimer4D = 
{   
    resp:'components/majiangTimer4D/res/',
    preLoadRes:
    [
    'components/majiangTimer4D/res/majiangTimer4D.plist', 
    'components/majiangTimer4D/res/majiangTimer4D.png'
    ],
    onPreLoadRes:function()
    {
        var resp = majiangTimer4D.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'majiangTimer4D.plist', resp + 'majiangTimer4D.png')
    },
    getTimer:function( directionOfEast, tickTime)
    {
    	var resp = majiangTimer4D.resp
    	var control = {}
        var node  = cc.BuilderReader.load('components/majiangTimer4D/res/majiangTimer4D.ccbi', control)

       	var tickTime = tickTime || 10

	    var tickText = new ccui.TextAtlas()
	    tickText.setAnchorPoint(cc.p(0.5, 0.5))
	    tickText.setProperty("10", resp + 'num.png', 17.5, 22, "0")
	    control.tickNode.addChild(tickText)

    	function getStrFun(str)
        {   
        	if(str == 0)
        		return tickTime
        	else
        		return str-1
        }

        function perSecondcallBack()
        {   
        	var s = tickText.getString()
        	if(s<=4)
        	{
                control.warm.setVisible(true)
                control.warm.scheduleOnce(
                    function()
                    {
                        control.warm.setVisible(false)
                    }, 
                    0.5)
        		// managerAudio.playEffect(resp + 'tick.mp3')
        	}  
        }
    	clock.tickLabel(tickText, tickTime, -1, getStrFun, null, perSecondcallBack)

	    node.initFenwei = function(directionOfEast)
	    {
	    	for(var i=0;i<4;i++)
	    	{
	    		control['normalFenwei'+i].setSpriteFrame( 'mt4_normal_' + (4+directionOfEast-i)%4 + '.png' )  
	    		control['lightFenwei'+i].setSpriteFrame( 'mt4_light_' + (4+directionOfEast-i)%4 + '.png' )  
	    	}
	    }

	    node.resetTimer = function()
	    {
	    	control.lightNode_0.setVisible(false)
	    	control.lightNode_1.setVisible(false)
	    	control.lightNode_2.setVisible(false)
	    	control.lightNode_3.setVisible(false)
	    }

        node.switchTimer = function(directions)
        {
        	node.resetTimer()
        	tickText.setString(tickTime)

        	for(var i=0;i<directions.length;i++)
        	{	
        		var d = directions[i]
        		control['lightNode_'+d].setVisible(true)
        	}
        }

        return node
    }


}





