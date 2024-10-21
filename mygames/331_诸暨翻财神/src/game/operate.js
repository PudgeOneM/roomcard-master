
var operateBtn = 
{
	init:function(uiPlay)
	{
        operateBtn._btnChi = new ccui.Button(resp.btnChi);
        operateBtn._btnChi.addTouchEventListener(this.onTouchEvent, this);
        operateBtn._btnChi.visible = false;
        operateBtn._btnChi.y = 180;
        uiPlay.addChild(operateBtn._btnChi,ZORDER_OPERATE_BTN);

        operateBtn._btnPeng = new ccui.Button(resp.btnPeng);
        operateBtn._btnPeng.addTouchEventListener(this.onTouchEvent, this);
        operateBtn._btnPeng.visible = false;
        operateBtn._btnPeng.y = 180;
        uiPlay.addChild(operateBtn._btnPeng,ZORDER_OPERATE_BTN);

        operateBtn._btnGang = new ccui.Button(resp.btnGang);
        operateBtn._btnGang.addTouchEventListener(this.onTouchEvent, this);
        operateBtn._btnGang.visible = false;
        operateBtn._btnGang.y = 180;
        uiPlay.addChild(operateBtn._btnGang,ZORDER_OPERATE_BTN);

        operateBtn._btnHu = new ccui.Button(resp.btnHu);
        operateBtn._btnHu.addTouchEventListener(this.onTouchEvent, this);
        operateBtn._btnHu.visible = false;
        operateBtn._btnHu.y = 180;
        uiPlay.addChild(operateBtn._btnHu,ZORDER_OPERATE_BTN);

        operateBtn._btnPass = new ccui.Button(resp.btnPass);
        operateBtn._btnPass.addTouchEventListener(this.onTouchEvent, this);
        operateBtn._btnPass.visible = false;
        operateBtn._btnPass.setPosition(cc.p(tableData.getChairWithShowChairId(1).node.x - 100, 180));
        uiPlay.addChild(operateBtn._btnPass,ZORDER_OPERATE_BTN);

        operateBtn._cbAcitonMask = WIK_NULL;
	},
	setOperateInfo:function(cbAcitonMask)
	{
		if(mainScene._wMeChaird == INVALID_CHAIR) return false;
		operateBtn.hideOperate();
		var posX = tableData.getChairWithShowChairId(1).node.x - 230;
		var bOperate = false;
		operateBtn._cbAcitonMask = cbAcitonMask;
		if ((cbAcitonMask&WIK_CHI_HU)!=0)
		{
			operateBtn._btnHu.visible = true;
			operateBtn._btnHu.x = posX;
			posX -= 130;
			bOperate = true;
		}
		if ((cbAcitonMask&WIK_GANG)!=0 || (cbAcitonMask&WIK_S_GANG)!=0 || (cbAcitonMask&WIK_D_GANG)!=0 || (cbAcitonMask&WIK_T_GANG)!=0)
		{
			operateBtn._btnGang.visible = true;
			operateBtn._btnGang.x = posX;
			posX -= 130;
			bOperate = true;
		}
		if ((cbAcitonMask&WIK_PENG)!=0 || (cbAcitonMask&WIK_S_PENG)!=0 || (cbAcitonMask&WIK_D_PENG)!=0)
		{
			operateBtn._btnPeng.visible = true;
			operateBtn._btnPeng.x = posX;
			posX -= 130;
			bOperate = true;
		}
		if ((cbAcitonMask&WIK_LEFT)!=0 || (cbAcitonMask&WIK_CENTER)!=0 || (cbAcitonMask&WIK_RIGHT)!=0 || (cbAcitonMask&WIK_S_CHI)!=0)
		{
			operateBtn._btnChi.visible = true;
			operateBtn._btnChi.x = posX;
			posX -= 130;
			bOperate = true;
		}
		operateBtn._btnPass.visible = bOperate;
	},
	hideOperate:function()
	{
		operateBtn._btnChi.visible = false;
		operateBtn._btnPeng.visible = false;
		operateBtn._btnGang.visible = false;
		operateBtn._btnHu.visible = false;
		operateBtn._btnPass.visible = false;
		selectChi.hideContorl();
		selectGang.hideContorl();
	},
    onTouchEvent: function (render, type) {
    	if(type != ccui.Widget.TOUCH_ENDED) return;
    	var cbOperateCode = 0;
    	if (render == operateBtn._btnChi) 
    	{
    		if ((operateBtn._cbAcitonMask&WIK_LEFT)!=0 || (operateBtn._cbAcitonMask&WIK_CENTER)!=0 || (operateBtn._cbAcitonMask&WIK_RIGHT)!=0)
				cbOperateCode = WIK_LEFT;
			else
				cbOperateCode = WIK_S_CHI;
    	}
    	else if (render == operateBtn._btnPeng) 
    	{
    		if((operateBtn._cbAcitonMask&WIK_PENG)!=0)
    			cbOperateCode = WIK_PENG;
    		else if((operateBtn._cbAcitonMask&WIK_S_PENG)!=0)
    			cbOperateCode = WIK_S_PENG;
    		else
    			cbOperateCode = WIK_D_PENG;
    	}
    	else if (render == operateBtn._btnGang) 
    	{  		
    		if((operateBtn._cbAcitonMask&WIK_GANG)!=0)
    			cbOperateCode = WIK_GANG;
    		else if((operateBtn._cbAcitonMask&WIK_S_GANG)!=0)
    			cbOperateCode = WIK_S_GANG;
    		else if((operateBtn._cbAcitonMask&WIK_D_GANG)!=0)
    			cbOperateCode = WIK_D_GANG;
    		else
    			cbOperateCode = WIK_T_GANG;
    	}
    	else if (render == operateBtn._btnHu) 
    	{ 		
    		cbOperateCode = WIK_CHI_HU;
    	}
    	else if (render == operateBtn._btnPass) 
    	{	
    		cbOperateCode = WIK_NULL;
    	}
		var cbOperateCard = [0,0,0,0];

		//状态判断
		if (cbOperateCode==WIK_NULL)
		{
			//设置变量
			mainScene._cbActionMask = WIK_NULL;
			mainScene._cbActionCard = 0;
			if( mainScene._wCurrentUser == INVALID_CHAIR )
			{
				//删除定时器
				//发送消息
				var operateMsg = getObjWithStructName('CMD_C_OperateCard');
				operateMsg.cbOperateCode = WIK_NULL;
				operateMsg.cbOperateCard = cbOperateCard;
				socket.sendMessage(MDM_GF_GAME, SUB_C_OPERATE_CARD, operateMsg); 
			}
			//隐藏操作控件
			operateBtn.hideOperate();
			return;
		}

		var bDone = false;
		//胡牌
		if( cbOperateCode & WIK_CHI_HU )
			bDone = true;
		else
		{
			//获取选择组合
			var selectCardInfo = [];
			var cbInfoCount = operateBtn.getSelectCardInfo( cbOperateCode,selectCardInfo );
			if (cbInfoCount <= 1) 
			{
				cbOperateCode = selectCardInfo[0].wActionMask;
				cbOperateCard = selectCardInfo[0].cbCardData;
				bDone = true;
			}
			else
			{
				if (cbOperateCode & WIK_GANG || cbOperateCode & WIK_S_GANG || cbOperateCode & WIK_D_GANG || cbOperateCode & WIK_T_GANG) 
				{
					//多项选择 杠
					selectGang.setSelectInfo(cbInfoCount, selectCardInfo);
				}
				else if (cbOperateCode & WIK_LEFT || cbOperateCode & WIK_CENTER || cbOperateCode & WIK_RIGHT || cbOperateCode & WIK_S_CHI)
				{
					//多项选择 吃
					selectChi.setSelectInfo(cbInfoCount, selectCardInfo);
				}
				return;
			}
		}

		//如果操作完成，直接发送操作命令
		if( bDone )
		{
			//删除定时器

			//设置变量
			mainScene._wCurrentUser = INVALID_CHAIR;
			mainScene._cbActionMask = WIK_NULL;
			mainScene._cbActionCard = 0;

			var operateMsg = getObjWithStructName('CMD_C_OperateCard');
			operateMsg.cbOperateCode = cbOperateCode;
			operateMsg.cbOperateCard = cbOperateCard;
			socket.sendMessage(MDM_GF_GAME, SUB_C_OPERATE_CARD, operateMsg); 
			//隐藏操作控件
			operateBtn.hideOperate();
		}
    },
    addSelectInfo:function(SelectInfo, cbActionCard, cbAcitonMask, cbCardCount, cbCardData1, cbCardData2, cbCardData3, bGreen)
    {
		SelectInfo[operateBtn.cbSelectCount] = {};
		SelectInfo[operateBtn.cbSelectCount].cbCardData = [];
		SelectInfo[operateBtn.cbSelectCount].cbActionCard = cbActionCard;
		SelectInfo[operateBtn.cbSelectCount].wActionMask = cbAcitonMask;
		SelectInfo[operateBtn.cbSelectCount].cbCardCount = cbCardCount;
		SelectInfo[operateBtn.cbSelectCount].cbCardData[0] = cbActionCard;
		SelectInfo[operateBtn.cbSelectCount].cbCardData[1] = cbCardData1;
		SelectInfo[operateBtn.cbSelectCount].cbCardData[2] = cbCardData2;
		SelectInfo[operateBtn.cbSelectCount].cbCardData[3] = cbCardData3;
		SelectInfo[operateBtn.cbSelectCount++].bGreen = bGreen;
    },
    getSelectCardInfo:function( cbOperateCode,SelectInfo )
    {
		//选择扑克信息
		// var SelectInfo = 
		// {
		// 	wActionMask:null,      操作行为 吃 碰 杠 胡
		// 	cbActionCard:null,     操作的哪张麻将
		// 	cbCardCount:null,      自己需要付出几张麻将
		// 	cbCardData:[],         自己付出的麻将数据
		// };
		//初始化
		operateBtn.cbSelectCount = 0;

		if( cbOperateCode == WIK_NULL ) return 0;
		
		var cbCardIndex = [];
		cbCardIndex = handMahJong.getCardIndex();
		var cbMagicCard = [];
		cbMagicCard[0] = 0;
		cbMagicCard[1] = 0;
		cbMagicCard[2] = 0;
		var nMagicCount = 0;
		for (var i = 0; i < cbCardIndex[mainScene._cbMagicIndex[0]] && nMagicCount < 3; i++) {
			cbMagicCard[nMagicCount++] = gameLogic.switchToCardData(mainScene._cbMagicIndex[0]);
		};
		for (var i = 0; i < cbCardIndex[mainScene._cbMagicIndex[1]] && nMagicCount < 3; i++) {
			cbMagicCard[nMagicCount++] = gameLogic.switchToCardData(mainScene._cbMagicIndex[1]);
		};
		//吃牌
		if( cbOperateCode&(WIK_LEFT|WIK_CENTER|WIK_RIGHT) )
		{

			if( mainScene._cbActionMask & WIK_LEFT )
			{
				operateBtn.addSelectInfo(SelectInfo, mainScene._cbActionCard, WIK_LEFT, 2, mainScene._cbActionCard+1, mainScene._cbActionCard+2, 0);
			}
			if( mainScene._cbActionMask & WIK_CENTER )
			{
				operateBtn.addSelectInfo(SelectInfo, mainScene._cbActionCard, WIK_CENTER, 2, mainScene._cbActionCard-1, mainScene._cbActionCard+1, 0);
			}
			if( mainScene._cbActionMask & WIK_RIGHT )
			{
				operateBtn.addSelectInfo(SelectInfo, mainScene._cbActionCard, WIK_RIGHT, 2, mainScene._cbActionCard-2, mainScene._cbActionCard-1, 0);
			}
		}
		else if( cbOperateCode&WIK_S_CHI )
		{
			var cbActionIndex = gameLogic.switchToCardIndex(mainScene._cbActionCard);
			for (var i = 0; i < MAX_INDEX; i++) {
				if(cbCardIndex[i] == 0) continue;
				if(cbActionIndex == i) continue;
				if(gameLogic.isMagicCard(i, true)) continue;
				if (Math.floor(i/9) == Math.floor(cbActionIndex/9))
				{
					if (Math.abs(i - cbActionIndex) <= 2)
					{
						operateBtn.addSelectInfo(SelectInfo, mainScene._cbActionCard, WIK_S_CHI, 2, gameLogic.switchToCardData(i), cbMagicCard[0], 0);
					}
				}	
			};
		}
		//碰牌
		else if( cbOperateCode & WIK_PENG )
		{
			operateBtn.addSelectInfo(SelectInfo, mainScene._cbActionCard, WIK_PENG, 2, mainScene._cbActionCard, mainScene._cbActionCard, 0);
		}
		else if ( cbOperateCode & WIK_S_PENG )
		{
			operateBtn.addSelectInfo(SelectInfo, mainScene._cbActionCard, WIK_S_PENG, 2, mainScene._cbActionCard, cbMagicCard[0], 0);
		}
		else if ( cbOperateCode & WIK_D_PENG )
		{
			operateBtn.addSelectInfo(SelectInfo, mainScene._cbActionCard, WIK_D_PENG, 2, cbMagicCard[0], cbMagicCard[1], 0);
		}
		//杠牌
		else if( cbOperateCode & WIK_GANG || cbOperateCode & WIK_S_GANG || cbOperateCode & WIK_D_GANG || cbOperateCode & WIK_T_GANG)
		{
			//如果是自己杠牌
			if( mainScene._wCurrentUser == mainScene._wMeChaird )
			{
				//寻找是否有多个杠牌
				var wMeChairId = gameLogic.switchViewChairID(mainScene._wMeChaird);
				var cbMagicCount = gameLogic.getMagicCardCount(cbCardIndex);
				//手上杠牌
				for (var i=0;i<MAX_INDEX;i++)
				{
					if(gameLogic.isMagicCard(i, true)) continue;
					var cbCardData = gameLogic.switchToCardData(i);
					var bPeng = false;
					for (var k=0;k<weaveControl.cbWeaveCount[wMeChairId];k++)
					{
						var cbWeaveKind = weaveControl.cbWeaveArray[wMeChairId][k].cbWeaveKind;
						if (cbWeaveKind==WIK_PENG || cbWeaveKind == WIK_S_PENG || cbWeaveKind == WIK_D_PENG)
						{
							if (cbCardData == weaveControl.cbWeaveArray[wMeChairId][k].cbCenterCard) 
							{
								bPeng = true;
								break;
							}
						}
					}
					if (cbCardIndex[i]==4)
					{
						operateBtn.addSelectInfo(SelectInfo, cbCardData, WIK_GANG, 4, cbCardData, cbCardData, cbCardData);
					}
					if(!bPeng)
					{
						//这张牌没有补杠 才算财杠
						if (cbCardIndex[i]==3 && cbMagicCount >= 1)
						{
							operateBtn.addSelectInfo(SelectInfo, cbCardData, WIK_S_GANG, 4, cbCardData, cbCardData, cbMagicCard[0]);
						}
						else if (cbCardIndex[i]==2 && cbMagicCount >= 2)
						{
							operateBtn.addSelectInfo(SelectInfo, cbCardData, WIK_D_GANG, 4, cbCardData, cbMagicCard[0], cbMagicCard[1]);
						}
						else if (cbCardIndex[i]==1 && cbMagicCount >= 3)
						{
							operateBtn.addSelectInfo(SelectInfo, cbCardData, WIK_T_GANG, 4, cbMagicCard[0], cbMagicCard[1], cbMagicCard[2]);
						}
					}
				}

				//组合杠牌
				for (var i=0;i<weaveControl.cbWeaveCount[wMeChairId];i++)
				{
					var cbWeaveKind = weaveControl.cbWeaveArray[wMeChairId][i].cbWeaveKind;
					if (cbWeaveKind==WIK_PENG || cbWeaveKind == WIK_S_PENG || cbWeaveKind == WIK_D_PENG)
					{
						var bHave = false;
						for (var k = 0; k < i; k++)
						{
							var cbWeaveKind1 = weaveControl.cbWeaveArray[wMeChairId][k].cbWeaveKind;
							if (cbWeaveKind1==WIK_PENG || cbWeaveKind1 == WIK_S_PENG || cbWeaveKind1 == WIK_D_PENG)
							{
								if (weaveControl.cbWeaveArray[wMeChairId][i].cbCenterCard == weaveControl.cbWeaveArray[wMeChairId][k].cbCenterCard) 
								{
									bHave = true;
									break;
								}
							}
						}
						if (!bHave)
						{
							if (cbCardIndex[gameLogic.switchToCardIndex(weaveControl.cbWeaveArray[wMeChairId][i].cbCenterCard)]>=1)
							{
								if (cbWeaveKind==WIK_PENG) 
								{
									operateBtn.addSelectInfo(SelectInfo, weaveControl.cbWeaveArray[wMeChairId][i].cbCenterCard, WIK_GANG, 1, weaveControl.cbWeaveArray[wMeChairId][i].cbCenterCard, 0, 0);
								}
								else if (cbWeaveKind==WIK_S_PENG) 
								{
									operateBtn.addSelectInfo(SelectInfo, weaveControl.cbWeaveArray[wMeChairId][i].cbCenterCard, WIK_S_GANG, 1, weaveControl.cbWeaveArray[wMeChairId][i].cbCenterCard, 0, 0);
								}
								else
								{
									operateBtn.addSelectInfo(SelectInfo, weaveControl.cbWeaveArray[wMeChairId][i].cbCenterCard, WIK_D_GANG, 1, weaveControl.cbWeaveArray[wMeChairId][i].cbCenterCard, 0, 0);
								}

							}
							if (cbMagicCount >= 1)
							{
								if (cbWeaveKind==WIK_PENG) 
								{
									operateBtn.addSelectInfo(SelectInfo, weaveControl.cbWeaveArray[wMeChairId][i].cbCenterCard, WIK_S_GANG, 1, cbMagicCard[0], 0, 0, true);
								}
								else if (cbWeaveKind==WIK_S_PENG) 
								{
									operateBtn.addSelectInfo(SelectInfo, weaveControl.cbWeaveArray[wMeChairId][i].cbCenterCard, WIK_D_GANG, 1, cbMagicCard[0], 0, 0, true);
								}
								else  if (cbWeaveKind==WIK_D_PENG) 
								{
									operateBtn.addSelectInfo(SelectInfo, weaveControl.cbWeaveArray[wMeChairId][i].cbCenterCard, WIK_T_GANG, 1, cbMagicCard[0], 0, 0, true);
								}
							}
						}
					}
				}
			}
			else
			{
				if (cbOperateCode & WIK_GANG)
				{
					operateBtn.addSelectInfo(SelectInfo, mainScene._cbActionCard, WIK_GANG, 3, mainScene._cbActionCard, mainScene._cbActionCard, mainScene._cbActionCard);
				}
				else if (cbOperateCode & WIK_S_GANG) 
				{
					operateBtn.addSelectInfo(SelectInfo, mainScene._cbActionCard, WIK_S_GANG, 3, mainScene._cbActionCard, mainScene._cbActionCard, cbMagicCard[0]);
				}
				else if (cbOperateCode & WIK_D_GANG) 
				{
					operateBtn.addSelectInfo(SelectInfo, mainScene._cbActionCard, WIK_D_GANG, 3, mainScene._cbActionCard, cbMagicCard[0], cbMagicCard[1]);
				}
				else if (cbOperateCode & WIK_T_GANG) 
				{
					operateBtn.addSelectInfo(SelectInfo, mainScene._cbActionCard, WIK_T_GANG, 3, cbMagicCard[0], cbMagicCard[1], cbMagicCard[2]);
				}
			}
		}

		return operateBtn.cbSelectCount;
    },
};
var selectChi = 
{
	init:function(uiPlay)
	{
		selectChi.bg = [];
		selectChi.mj = [];
		for (var i = 0; i < MAX_WEAVE; i++) {
			selectChi.bg[i] = new cc.Sprite("#selectChiBg.png");
			selectChi.bg[i].visible = false;
			selectChi.bg[i].y = mainScene.ctPosY - 60;
			uiPlay.addChild(selectChi.bg[i],ZORDER_OPERATE_SECELT);

			selectChi.mj[i] = [];
			for (var k = 0; k < 3; k++) {
				selectChi.mj[i][k] = weaveControl.create(0, 1);
				selectChi.mj[i][k].visible = false;
				selectChi.mj[i][k].y = mainScene.ctPosY - 60;
				uiPlay.addChild(selectChi.mj[i][k],ZORDER_OPERATE_SECELT);

			};
			//添加触摸事件
			selectChi.bg[i].listener = selectChi.getListener();
	    	cc.eventManager.addListener(selectChi.bg[i].listener, selectChi.bg[i]);
		};
	},
	setSelectInfo:function(cbInfoCount, info)
	{
		var posX = mainScene.ctPosX + 50 - cbInfoCount*220/2;
		for (var i = 0; i < cbInfoCount; i++) {
			selectChi.bg[i].visible = true;
			selectChi.bg[i].x = posX + i*220;

			if (info[i].wActionMask & WIK_LEFT) 
			{
				selectChi.mj[i][0].spValue.setSpriteFrame('value_' + info[i].cbCardData[0] + '.png');
				selectChi.mj[i][0].spValue.color = cc.color(125, 125, 125);
				selectChi.mj[i][0].color = cc.color(125, 125, 125);
				selectChi.mj[i][1].spValue.setSpriteFrame('value_' + info[i].cbCardData[1] + '.png');
				selectChi.mj[i][1].spValue.color = cc.color(255, 255, 255);
				selectChi.mj[i][1].color = cc.color(255, 255, 255);
				selectChi.mj[i][2].spValue.setSpriteFrame('value_' + info[i].cbCardData[2] + '.png');
				selectChi.mj[i][2].spValue.color = cc.color(255, 255, 255);
				selectChi.mj[i][2].color = cc.color(255, 255, 255);
			}
			else if (info[i].wActionMask & WIK_CENTER) 
			{
				selectChi.mj[i][0].spValue.setSpriteFrame('value_' + info[i].cbCardData[1] + '.png');
				selectChi.mj[i][0].spValue.color = cc.color(255, 255, 255);
				selectChi.mj[i][0].color = cc.color(255, 255, 255);
				selectChi.mj[i][1].spValue.setSpriteFrame('value_' + info[i].cbCardData[0] + '.png');
				selectChi.mj[i][1].spValue.color = cc.color(125, 125, 125);
				selectChi.mj[i][1].color = cc.color(125, 125, 125);
				selectChi.mj[i][2].spValue.setSpriteFrame('value_' + info[i].cbCardData[2] + '.png');
				selectChi.mj[i][2].spValue.color = cc.color(255, 255, 255);
				selectChi.mj[i][2].color = cc.color(255, 255, 255);
			}
			else if (info[i].wActionMask & WIK_RIGHT) 
			{
				selectChi.mj[i][0].spValue.setSpriteFrame('value_' + info[i].cbCardData[1] + '.png');
				selectChi.mj[i][0].spValue.color = cc.color(255, 255, 255);
				selectChi.mj[i][0].color = cc.color(255, 255, 255);
				selectChi.mj[i][1].spValue.setSpriteFrame('value_' + info[i].cbCardData[2] + '.png');
				selectChi.mj[i][1].spValue.color = cc.color(255, 255, 255);
				selectChi.mj[i][1].color = cc.color(255, 255, 255);
				selectChi.mj[i][2].spValue.setSpriteFrame('value_' + info[i].cbCardData[0] + '.png');
				selectChi.mj[i][2].spValue.color = cc.color(125, 125, 125);
				selectChi.mj[i][2].color = cc.color(125, 125, 125);
			}
			else if (info[i].wActionMask & WIK_S_CHI) 
			{
				var cbCardData = [];
				if (info[i].cbCardData[1] - info[i].cbCardData[0] == 1)
				{
					cbCardData[0] = info[i].cbCardData[2];
					cbCardData[1] = info[i].cbCardData[0];
					cbCardData[2] = info[i].cbCardData[1];
				}
				else if (info[i].cbCardData[1] - info[i].cbCardData[0] == 2)
				{
					cbCardData[0] = info[i].cbCardData[0];
					cbCardData[1] = info[i].cbCardData[2];
					cbCardData[2] = info[i].cbCardData[1];
				}
				else if (info[i].cbCardData[0] - info[i].cbCardData[1] == 1)
				{
					cbCardData[0] = info[i].cbCardData[2];
					cbCardData[1] = info[i].cbCardData[1];
					cbCardData[2] = info[i].cbCardData[0];
				}
				else if (info[i].cbCardData[0] - info[i].cbCardData[1] == 2)
				{
					cbCardData[0] = info[i].cbCardData[1];
					cbCardData[1] = info[i].cbCardData[2];
					cbCardData[2] = info[i].cbCardData[0];
				}
				selectChi.mj[i][0].spValue.setSpriteFrame('value_' + cbCardData[0] + '.png');
				selectChi.mj[i][0].spValue.color = cc.color(255, 255, 255);
				selectChi.mj[i][0].color = cc.color(255, 255, 255);
				selectChi.mj[i][1].spValue.setSpriteFrame('value_' + cbCardData[1] + '.png');
				selectChi.mj[i][1].spValue.color = cc.color(255, 255, 255);
				selectChi.mj[i][1].color = cc.color(255, 255, 255);
				selectChi.mj[i][2].spValue.setSpriteFrame('value_' + cbCardData[2] + '.png');
				selectChi.mj[i][2].spValue.color = cc.color(125, 125, 125);
				selectChi.mj[i][2].color = cc.color(125, 125, 125);
			}
			selectChi.mj[i][0].x = posX + i*220 - 52;
			selectChi.mj[i][1].x = posX + i*220;
			selectChi.mj[i][2].x = posX + i*220 + 52;
			selectChi.mj[i][0].visible = true;
			selectChi.mj[i][1].visible = true;
			selectChi.mj[i][2].visible = true;

			selectChi.bg[i].wActionMask = info[i].wActionMask;
			selectChi.bg[i].cbCardData = [];
			selectChi.bg[i].cbCardData = info[i].cbCardData;
		}
	},
	getListener:function()
    {   
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
           onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                if(target.visible == false) return false;

                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true;
                }
                return false;
            },
            onTouchEnded: function (touch, event) {
            	var item = event.getCurrentTarget();
            	var operateMsg = getObjWithStructName('CMD_C_OperateCard');
				operateMsg.cbOperateCode = item.wActionMask;
				operateMsg.cbOperateCard = item.cbCardData;
				socket.sendMessage(MDM_GF_GAME, SUB_C_OPERATE_CARD, operateMsg); 
				selectChi.hideContorl();
				//隐藏操作控件
				operateBtn.hideOperate();
            }
        })
        return listener;
    },
    hideContorl:function()
    {
    	for (var i = 0; i < MAX_WEAVE; i++) {
    		selectChi.mj[i][0].visible = false;
    		selectChi.mj[i][1].visible = false;
    		selectChi.mj[i][2].visible = false;
    		selectChi.bg[i].visible = false;
		}
    },
};
var selectGang = 
{
	init:function(uiPlay)
	{
		selectGang.bg = [];
		selectGang.mj = [];
		for (var i = 0; i < 11; i++) {
			selectGang.bg[i] = new cc.Sprite("#selectGangBg.png");
			selectGang.bg[i].y = mainScene.ctPosY - 60;
			selectGang.bg[i].visible = false;
			uiPlay.addChild(selectGang.bg[i],ZORDER_OPERATE_SECELT);
			selectGang.mj[i] = weaveControl.create(0, 1);
			selectGang.mj[i].y = mainScene.ctPosY - 60;
			selectGang.mj[i].visible = false;
			uiPlay.addChild(selectGang.mj[i],ZORDER_OPERATE_SECELT);
			selectGang.bg[i].listener = selectGang.getListener();
	    	cc.eventManager.addListener(selectGang.bg[i].listener, selectGang.bg[i]);
		};
	},
	getListener:function()
    {   
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
           onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                if(target.visible == false) return false;

                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true;
                }
                return false;
            },
            onTouchEnded: function (touch, event) {
            	var item = event.getCurrentTarget();
            	var operateMsg = getObjWithStructName('CMD_C_OperateCard');
            	operateMsg.cbOperateCode = item.wActionMask;
				operateMsg.cbOperateCard = item.cbCardData;
				socket.sendMessage(MDM_GF_GAME, SUB_C_OPERATE_CARD, operateMsg); 
				selectGang.hideContorl();
				//隐藏操作控件
				operateBtn.hideOperate();
            }
        })
        return listener;
    },
	setSelectInfo:function(cbInfoCount, info)
	{
		var posX = mainScene.ctPosX + 50 - cbInfoCount*100/2;
		for (var i = 0; i < cbInfoCount; i++) {
			selectGang.bg[i].visible = true;
			selectGang.bg[i].x = posX + i*100;
			selectGang.bg[i].cbCardData = [];
			selectGang.bg[i].cbCardData = info[i].cbCardData;
			selectGang.bg[i].wActionMask = info[i].wActionMask;

			selectGang.mj[i].spValue.setSpriteFrame('value_' + info[i].cbActionCard + '.png');
			selectGang.mj[i].visible = true;
			selectGang.mj[i].x = posX + i*100;
			selectGang.mj[i].nIndex = i;
			if (info[i].bGreen)
			{
				selectGang.mj[i].spValue.color = cc.color(0, 255, 0);
				selectGang.mj[i].color = cc.color(0, 255, 0);
			}
			else
			{
				selectGang.mj[i].spValue.color = cc.color(255, 255, 255);
				selectGang.mj[i].color = cc.color(255, 255, 255);
			}
		};
	},
	hideContorl:function()
    {
    	for (var i = 0; i < 11; i++) {
    		selectGang.mj[i].visible = false;
    		selectGang.bg[i].visible = false;
		}
    },
};