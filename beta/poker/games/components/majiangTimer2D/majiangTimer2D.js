var majiangTimer2D = 
{   
    resp:'components/majiangTimer2D/res/',
    onPreLoadRes:function()
    {
        var resp = majiangTimer2D.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'majiangTimer2D.plist', resp + 'majiangTimer2D.png')
    },
    getTimer:function(isEastTapDown)
    {
    	var resp = majiangTimer2D.resp
    	var control = {}
        var node  = cc.BuilderReader.load('components/majiangTimer2D/res/majiangTimer2D.ccbi', control)

	    var tickText = new ccui.TextAtlas()
	    tickText.setAnchorPoint(cc.p(0.5, 0.5))
	    tickText.setProperty("", resp + 'num.png', 25, 32, "0")
	    control.tickNode.addChild(tickText)    

	    node.initFenwei = function(isEastTapDown)
	    {
	    	var upNomal = isEastTapDown?'mt2_westNormal.png':'mt2_eastNormal.png'
	    	var downNomal = isEastTapDown?'mt2_eastNormal.png':'mt2_westNormal.png'
	    	var upLight = isEastTapDown?'mt2_westLight.png':'mt2_eastLight.png'
	    	var downLight = isEastTapDown?'mt2_eastLight.png':'mt2_westLight.png'


	    	control.upNomalFenwei.setSpriteFrame(upNomal)               
	    	control.downNomalFenwei.setSpriteFrame(downNomal)   
	    	control.upLightFenwei.setSpriteFrame(upLight)  
	    	control.downLightFenwei.setSpriteFrame(downLight)   
 
	    }

	    node.resetTimer = function()
	    {
	    	control.lightNode_0.setVisible(false)
	    	control.lightNode_2.setVisible(false)
	    	if(tickText.clearTick)
            	tickText.clearTick()
	    }

        node.switchTimer = function(directions, tickTime)
        {
        	tickTime = tickTime || 10
        	node.resetTimer()
        	for(var i=0;i<directions.length;i++)
        	{	
        		var d = directions[i]
        		control['lightNode_'+d].setVisible(true)
        	}

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
	        		setTimeout(function()
	        		{
	        			control.warm.setVisible(false)
	        		},500)
	        		// managerAudio.playEffect(resp + 'tick.mp3')
	        	}  
	        }
        	clock.tickLabel(tickText, tickTime, -1, getStrFun, null, perSecondcallBack)
        }

        return node
    }


}





