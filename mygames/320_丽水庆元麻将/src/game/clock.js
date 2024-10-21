var gameClock = 
{
	init:function()
	{  
		var pos = cc.p(-5, 27);
		gameClock.bg = new cc.Sprite("#clockBg.png");
		gameClock.dct = new cc.Sprite("#clockDct.png");
		gameClock.font = new cc.Sprite("#clockFont_0.png");
		gameClock.num = new ccui.TextAtlas();
        gameClock.num.setProperty("10", resp.clockNum, 18, 25, "0");
        gameClock.num.setAnchorPoint(cc.p(0.5,0.5));
		gameClock.bg.visible = false;
		gameClock.dct.visible = false;
		gameClock.font.visible = false;
		gameClock.num.visible = false;
		tableNode.gameClockNode.addChild(gameClock.bg);
		tableNode.gameClockNode.addChild(gameClock.dct);
		tableNode.gameClockNode.addChild(gameClock.font);
		tableNode.gameClockNode.addChild(gameClock.num);
		gameClock.bg.setPosition(pos);
		gameClock.dct.setPosition(pos);
		gameClock.font.setPosition(pos);
		gameClock.num.setPosition(pos);
		gameClock.timeNum = 10;
	},
	setClockInfo:function()
	{
		var wMeChaird = mainScene._wMeChaird == INVALID_CHAIR ? 0:mainScene._wMeChaird;
		var angle = 90*((GAME_PLAYER-(mainScene._wBankerUser-wMeChaird))%GAME_PLAYER);
		gameClock.bg.setRotation(angle);
	},
	setGameClock:function(wChaird)
	{
		gameClock.num.unschedule(gameClock.updateClockTime);
		gameClock.timeNum = 10;
		gameClock.font.visible = false;
		gameClock.dct.visible = false;
		if (wChaird != INVALID_CHAIR)
		{
			var wMeChaird = mainScene._wMeChaird == INVALID_CHAIR ? 0:mainScene._wMeChaird;
			var angle = 90*((GAME_PLAYER-(wChaird-wMeChaird))%GAME_PLAYER);
			gameClock.dct.visible = true;
			gameClock.dct.setRotation(angle);
			var posFont = 
			[
				cc.p(-5, 27-35),
				cc.p(-5+35, 27),
				cc.p(-5, 27+35),
				cc.p(-5-35, 27),
			];
			var dct = (GAME_PLAYER+wChaird-mainScene._wBankerUser)%GAME_PLAYER;
			gameClock.font.setSpriteFrame('clockFont_'+dct+'.png');
			gameClock.font.visible = true;
			gameClock.font.setPosition(posFont[gameLogic.switchViewChairID(wChaird)]);
			gameClock.font.setRotation(angle);
		}
		gameClock.bg.visible = true;
		gameClock.num.visible = true;
		gameClock.num.schedule(gameClock.updateClockTime, 1);
		gameLog.log('setGameClock');
	},
	updateClockTime:function()
	{
		if (gameClock.timeNum < 4)
		{
			managerAudio.playEffect('gameRes/sound/tick.mp3');
		}
		gameClock.num.setString(gameClock.timeNum);
		gameClock.timeNum = gameClock.timeNum-1;
		if (gameClock.timeNum < 0) 
		{
			gameClock.timeNum = 10;
			//gameClock.num.unschedule(gameClock.updateClockTime);
		}
	},
	hideClock:function()
	{
		gameClock.num.unschedule(gameClock.updateClockTime);
		gameClock.bg.visible = false;
		gameClock.num.visible = false;
		gameClock.dct.visible = false;
		gameClock.font.visible = false;
	},
	
};