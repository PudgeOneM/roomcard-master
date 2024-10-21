var gameClock = 
{
	setGameClock:function(wChaird)
	{
		if(wChaird == INVALID_CHAIR)
		{
			for(var i = 0; i < GAME_PLAYER; i++)
			{
				var user = tableData.getUserWithChairId(i);
				if(user)
            		chairFactory.hideFiredCircle.call(user.userNodeInsetChair);
			}
			outAmt.actNode.visible = false;
		}
		else
		{
			for(var i = 0; i < GAME_PLAYER; i++)
			{
				var user = tableData.getUserWithChairId(i);
				if(user)
            		chairFactory.hideFiredCircle.call(user.userNodeInsetChair);
			}
			var user = tableData.getUserWithChairId(wChaird);
        	chairFactory.showFiredCircle.call(user.userNodeInsetChair, 10)
        	if (wChaird == mainScene._wMeChaird) 
        	{
        		if(handMahJong.isEnableOutEx())
        		{
        			outAmt.actNode.visible = true;
        		}
        		else
        		{
        			outAmt.actNode.visible = false;
        		}
        	}
        	else
        	{
        		outAmt.actNode.visible = false;
        	}
		}
	},
};