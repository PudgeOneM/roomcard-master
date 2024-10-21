var operateAmt = 
{
	init:function(uiPlay)
	{
		operateAmt.act = new cc.Node();
		uiPlay.addChild(operateAmt.act, ZORDER_MAX);
	},
	setAmtInfo:function(wChaird, cbOperateCode)
	{
		operateAmt.cbOperateCode = cbOperateCode;
		operateAmt.wChaird = wChaird;
		var headX = tableData.getChairWithShowChairId(wChaird).node.x;
		var headY = tableData.getChairWithShowChairId(wChaird).node.y;
		if (cc.sys.isMobile)
		{
			operateAmt.pos = 
			[
				cc.p(cc.director.getVisibleSize().height/2, headY + 50),
				cc.p(headX - 180, cc.director.getVisibleSize().width/2+30),
				cc.p(cc.director.getVisibleSize().height/2, headY - 80),
				cc.p(headX + 180, cc.director.getVisibleSize().width/2+30)
			];
		}
		else
		{
			operateAmt.pos = 
			[
				cc.p(cc.director.getVisibleSize().width/2, headY + 50),
				cc.p(headX - 180, cc.director.getVisibleSize().height/2+30),
				cc.p(cc.director.getVisibleSize().width/2, headY - 80),
				cc.p(headX + 180, cc.director.getVisibleSize().height/2+30)
			];
		}
		var resIndex = 0;
		if ((cbOperateCode&WIK_LEFT)!=0 || (cbOperateCode&WIK_CENTER)!=0 || (cbOperateCode&WIK_RIGHT)!=0)
		{
			resIndex = 0;
      		managerAudio.playEffect('gameRes/sound/chi.wav');
		}
		else if ((cbOperateCode&WIK_PENG)!=0) 
		{
			resIndex = 1;
			managerAudio.playEffect('gameRes/sound/peng.wav');
		}
		else if ((cbOperateCode&WIK_GANG)!=0) 
		{
			resIndex = 2;
			managerAudio.playEffect('gameRes/sound/gang.wav');
		}
		else if ((cbOperateCode&WIK_ZIMO)!=0) 
		{
			resIndex = 3;
			managerAudio.playEffect('gameRes/sound/hu.wav');
		}
		else if ((cbOperateCode&WIK_DIANPAO)!=0) 
			resIndex = 4;
		if (!isOpenEffect) return false;
		var res =
		[
			'chi_',
			'peng_',
			'gang_',
			'zim_',
			'dp_',
		];
		var spr = actionFactory.getSprWithAnimate(res[resIndex], true, 0.12);
	    spr.setPosition( operateAmt.pos[operateAmt.wChaird] );
	    operateAmt.act.addChild(spr); 
	},
};