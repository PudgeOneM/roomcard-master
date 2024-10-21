var operateAmt = 
{
	init:function(uiPlay)
	{
		operateAmt.act = new cc.Node();
		uiPlay.addChild(operateAmt.act, ZORDER_MAX);
	},
	setAmtInfo:function(wChaird, cbOperateCode)
	{
		var wOperateViewID = gameLogic.switchViewChairID(wChaird);
		operateAmt.cbOperateCode = cbOperateCode;
		operateAmt.wChaird = wOperateViewID;
		var headX = tableData.getChairWithShowChairId(wOperateViewID).node.x;
		var headY = tableData.getChairWithShowChairId(wOperateViewID).node.y;
		operateAmt.pos = 
		[
			cc.p(mainScene.ctPosX, headY + 50),
			cc.p(headX - 180, headY-30),
			cc.p(headX + 180, headY-30)
		];
		gameLogic.playGenderEffect(wChaird, cbOperateCode, 0);
		var resIndex = 0;
		if ((cbOperateCode&WIK_LEFT)!=0 || (cbOperateCode&WIK_CENTER)!=0 || (cbOperateCode&WIK_RIGHT)!=0)
		{
			resIndex = 0;
		}
		else if ((cbOperateCode&WIK_PENG)!=0) 
		{
			resIndex = 1;
		}
		else if ((cbOperateCode&WIK_CHI_HU)!=0) 
		{
			resIndex = 2;
		}
		else if ((cbOperateCode&WIK_WEI)!=0) 
		{
			resIndex = 3;
		}
		if (!isOpenEffect) return false;
		var res =
		[
			'chi_',
			'peng_',
			'hu_',
			'wei_'
		];
		var spr = actionFactory.getSprWithAnimate(res[resIndex], true, 0.12);
	    spr.setPosition( operateAmt.pos[operateAmt.wChaird] );
	    operateAmt.act.addChild(spr); 
	},
};