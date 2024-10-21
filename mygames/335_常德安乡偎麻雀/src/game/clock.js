var gameClock = 
{
	setGameClock:function(wChaird)
	{
		tableNode.lbClockTime.unschedule(gameClock.updateClockTime);
		gameClock.timeNum = 10;
		if (wChaird != INVALID_CHAIR)
		{
			var wViewChairID = gameLogic.switchViewChairID(wChaird);
			switch(wViewChairID)
			{
				case 0:
				tableNode.clock.x = mainScene.ctPosX;
				tableNode.clock.y = 270;
				break;
				case 1:
				tableNode.clock.x = tableData.getChairWithShowChairId(1).node.x - 300;
				tableNode.clock.y = tableData.getChairWithShowChairId(1).node.y;
				break;
				case 2:
				tableNode.clock.x = tableData.getChairWithShowChairId(2).node.x + 300;
				tableNode.clock.y = tableData.getChairWithShowChairId(2).node.y;
				break;
			}
		}
		else
		{
			tableNode.clock.x = mainScene.ctPosX;
			tableNode.clock.y = mainScene.ctPosY+130;
		}
		tableNode.clock.visible = true;
		tableNode.lbClockTime.schedule(gameClock.updateClockTime, 1);
	},
	updateClockTime:function()
	{
		if (gameClock.timeNum < 4)
		{
			managerAudio.playEffect('gameRes/sound/tick.mp3');
		}
		tableNode.lbClockTime.setString(gameClock.timeNum);
		gameClock.timeNum = gameClock.timeNum-1;
		if (gameClock.timeNum < 0) 
		{
			gameClock.timeNum = 10;
			//gameClock.num.unschedule(gameClock.updateClockTime);
		}
	},
	hideClock:function()
	{
		tableNode.lbClockTime.unschedule(gameClock.updateClockTime);
		tableNode.clock.visible = false;
	},
};