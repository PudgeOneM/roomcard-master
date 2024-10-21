var operateAmt = 
{
	init:function(uiPlay)
	{
		operateAmt.act = new cc.Node();
		uiPlay.addChild(operateAmt.act, ZORDER_MAX);
	},
	setAmtInfo:function(wChaird, cbOperateCode, wWinner)
	{
		var wOperateViewID = gameLogic.switchViewChairID(wChaird);
		operateAmt.cbOperateCode = cbOperateCode;
		operateAmt.wChaird = wOperateViewID;
		var headX = tableData.getChairWithShowChairId(wOperateViewID).node.x;
		var headY = tableData.getChairWithShowChairId(wOperateViewID).node.y;
		if (cc.sys.isMobile)
		{
			operateAmt.pos = 
			[
				cc.p(cc.director.getVisibleSize().height/2, headY + 50),
				cc.p(cc.director.getVisibleSize().height/2, headY - 80),
			];
		}
		else
		{
			operateAmt.pos = 
			[
				cc.p(cc.director.getVisibleSize().width/2, headY + 50),
				cc.p(cc.director.getVisibleSize().width/2, headY - 80),
			];
		}
		var user = tableData.getUserWithChairId(wChaird);
		var resIndex = 0;
		if ((cbOperateCode&WIK_LEFT)!=0 || (cbOperateCode&WIK_CENTER)!=0 || (cbOperateCode&WIK_RIGHT)!=0 || (cbOperateCode&WIK_S_CHI)!=0)
		{
			resIndex = 0;
      		if (user.cbGender)
	          managerAudio.playEffect('gameRes/sound/man/chi.wav');
	        else
	          managerAudio.playEffect('gameRes/sound/woman/chi.wav');
		}
		else if ((cbOperateCode&WIK_PENG)!=0 || (cbOperateCode&WIK_S_PENG)!=0 || (cbOperateCode&WIK_D_PENG)!=0) 
		{
			resIndex = 1;
			if (user.cbGender)
	          managerAudio.playEffect('gameRes/sound/man/peng.wav');
	        else
	          managerAudio.playEffect('gameRes/sound/woman/peng.wav');
		}
		else if ((cbOperateCode&WIK_GANG)!=0 || (cbOperateCode&WIK_S_GANG)!=0 || (cbOperateCode&WIK_D_GANG)!=0 || (cbOperateCode&WIK_T_GANG)!=0) 
		{
			resIndex = 2;
			if (user.cbGender)
	          managerAudio.playEffect('gameRes/sound/man/gang.wav');
	        else
	          managerAudio.playEffect('gameRes/sound/woman/gang.wav');
		}
		else if ((cbOperateCode&WIK_ZIMO)!=0) 
		{
			resIndex = 3;
			if (user.cbGender)
	          managerAudio.playEffect('gameRes/sound/man/zimo.wav');
	        else
	          managerAudio.playEffect('gameRes/sound/woman/zimo.wav');
		}
		else if ((cbOperateCode&WIK_DIANPAO)!=0) 
		{
			resIndex = 4;
		}
		else if ((cbOperateCode&WIK_CHI_HU)!=0)
		{
			resIndex = 5;
			if (user.cbGender)
	          managerAudio.playEffect('gameRes/sound/man/hu.wav');
	        else
	          managerAudio.playEffect('gameRes/sound/woman/hu.wav');
		}
		if (!isOpenEffect) return false;
		var res =
		[
			'chi_',
			'peng_',
			'gang_',
			'zim_',
			'dp_',
			'hu_',
		];
		var spr = actionFactory.getSprWithAnimate(res[resIndex], true, 0.12);
	    spr.setPosition( operateAmt.pos[operateAmt.wChaird] );
	    operateAmt.act.addChild(spr); 
	},
};