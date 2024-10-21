var majiangTimer4D = 
{   
    resp:'components/majiangTimer4D/res/',
    getPreLoadRes:function()
    {
        var resp = majiangTimer4D.resp

        return [
            resp + 'majiangTimer4D.plist', 
            resp + 'majiangTimer4D.png'
        ]
    },
    onPreLoadRes:function()
    {
        var resp = majiangTimer4D.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'majiangTimer4D.plist', resp + 'majiangTimer4D.png')
    },
    getTimer:function( directionOfEast, tickTime)
    {
    	var resp = majiangTimer4D.resp
        var node  = cc.BuilderReader.load('components/majiangTimer4D/res/majiangTimer4D.ccbi', majiangTimer4D)
        node.setContentSize(majiangTimer4D.bgSpr.width, majiangTimer4D.bgSpr.height)

       	var tickTime = tickTime || 10

	    var tickText = new ccui.TextAtlas()
	    tickText.setAnchorPoint(cc.p(0.5, 0.5))
	    tickText.setProperty("10", resp + 'num.png', 17.5, 22, "0")
	    majiangTimer4D.tickNode.addChild(tickText)

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
                majiangTimer4D.warm.setVisible(true)
                majiangTimer4D.warm.scheduleOnce(
                    function()
                    {
                        majiangTimer4D.warm.setVisible(false)
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
	    		majiangTimer4D['normalFenwei'+i].setSpriteFrame( 'mt4_normal_' + (4+directionOfEast-i)%4 + '.png' )  
	    		majiangTimer4D['lightFenwei'+i].setSpriteFrame( 'mt4_light_' + (4+directionOfEast-i)%4 + '.png' )  
	    	}
	    }

	    node.resetTimer = function()
	    {
	    	majiangTimer4D.lightNode_0.setVisible(false)
	    	majiangTimer4D.lightNode_1.setVisible(false)
	    	majiangTimer4D.lightNode_2.setVisible(false)
	    	majiangTimer4D.lightNode_3.setVisible(false)
	    }

        node.switchTimer = function(directions)
        {
        	node.resetTimer()
        	tickText.setString(tickTime)

        	for(var i=0;i<directions.length;i++)
        	{	
        		var d = directions[i]
        		majiangTimer4D['lightNode_'+d].setVisible(true)
        	}
        }

        return node
    }


}





