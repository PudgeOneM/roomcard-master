
var operateBtn = 
{
	init:function(uiPlay)
	{
        operateBtn._btnChi = new ccui.Button(resp.btnChi);
        operateBtn._btnChi.addTouchEventListener(this.onTouchEvent, this);
        operateBtn._btnChi.visible = false;
        operateBtn._btnChi.y = 280;
        uiPlay.addChild(operateBtn._btnChi,ZORDER_OPERATE_BTN);

        operateBtn._btnPeng = new ccui.Button(resp.btnPeng);
        operateBtn._btnPeng.addTouchEventListener(this.onTouchEvent, this);
        operateBtn._btnPeng.visible = false;
        operateBtn._btnPeng.y = 280;
        uiPlay.addChild(operateBtn._btnPeng,ZORDER_OPERATE_BTN);

        operateBtn._btnGang = new ccui.Button(resp.btnGang);
        operateBtn._btnGang.addTouchEventListener(this.onTouchEvent, this);
        operateBtn._btnGang.visible = false;
        operateBtn._btnGang.y = 280;
        uiPlay.addChild(operateBtn._btnGang,ZORDER_OPERATE_BTN);

        operateBtn._btnHu = new ccui.Button(resp.btnHu);
        operateBtn._btnHu.addTouchEventListener(this.onTouchEvent, this);
        operateBtn._btnHu.visible = false;
        operateBtn._btnHu.y = 280;
        uiPlay.addChild(operateBtn._btnHu,ZORDER_OPERATE_BTN);

        operateBtn._btnPass = new ccui.Button(resp.btnPass);
        operateBtn._btnPass.addTouchEventListener(this.onTouchEvent, this);
        operateBtn._btnPass.visible = false;
        operateBtn._btnPass.setPosition(cc.p(tableData.getChairWithShowChairId(1).node.x - 170, 280));
        uiPlay.addChild(operateBtn._btnPass,ZORDER_OPERATE_BTN);
	},
	setOperateInfo:function(cbAcitonMask)
	{
		if(mainScene._wMeChaird == INVALID_CHAIR) return false;
		if (cbAcitonMask & WIK_PAO) 
		{
			//删除定时器
			//发送消息
			var operateMsg = getObjWithStructName('CMD_C_OperateCard');
			operateMsg.cbOperateCode = WIK_PAO;
			socket.sendMessage(MDM_GF_GAME, SUB_C_OPERATE_CARD, operateMsg); 
			return ;
		}
		operateBtn.hideOperate();
		var posX = tableData.getChairWithShowChairId(1).node.x - 300;
		var bOperate = false;
		if ((cbAcitonMask&WIK_CHI_HU)!=0)
		{
			operateBtn._btnHu.visible = true;
			operateBtn._btnHu.x = posX;
			posX -= 130;
			bOperate = true;
			mainScene._wCurrentUser = INVALID_CHAIR;
		}
		// if ((cbAcitonMask&WIK_GANG)!=0)
		// {
		// 	operateBtn._btnGang.visible = true;
		// 	operateBtn._btnGang.x = posX;
		// 	posX -= 130;
		// 	bOperate = true;
		// }
		if ((cbAcitonMask&WIK_PENG)!=0)
		{
			operateBtn._btnPeng.visible = true;
			operateBtn._btnPeng.x = posX;
			posX -= 130;
			bOperate = true;
		}
		if ((cbAcitonMask&WIK_LEFT)!=0 || (cbAcitonMask&WIK_CENTER)!=0 || (cbAcitonMask&WIK_RIGHT)!=0)
		{
			operateBtn._btnChi.visible = true;
			operateBtn._btnChi.x = posX;
			posX -= 130;
			bOperate = true;
		}
		if(!mainScene._bSanTiWuKan)
			operateBtn._btnPass.visible = bOperate;
	},
	hideOperate:function()
	{
		operateBtn._btnChi.visible = false;
		operateBtn._btnPeng.visible = false;
		operateBtn._btnGang.visible = false;
		operateBtn._btnHu.visible = false;
		operateBtn._btnPass.visible = false;
		// selectChi.hideContorl();
		// selectGang.hideContorl();
	},
    onTouchEvent: function (render, type) {
    	if(type != ccui.Widget.TOUCH_ENDED) return;
    	var cbOperateCode = 0;
    	if (render == operateBtn._btnChi) 
    	{
    		if( mainScene._cbActionMask & WIK_LEFT )
			{
				cbOperateCode |= WIK_LEFT;
			}
			if( mainScene._cbActionMask & WIK_CENTER )
			{
				cbOperateCode |= WIK_CENTER;
			}
			if( mainScene._cbActionMask & WIK_RIGHT )
			{
				cbOperateCode |= WIK_RIGHT;
			}
    	}
    	else if (render == operateBtn._btnPeng) 
    	{
    		cbOperateCode = WIK_PENG;
    	}
    	else if (render == operateBtn._btnGang) 
    	{  		
    		cbOperateCode = WIK_GANG;
    	}
    	else if (render == operateBtn._btnHu) 
    	{ 		
    		cbOperateCode = WIK_CHI_HU;
    	}
    	else if (render == operateBtn._btnPass) 
    	{	
    		cbOperateCode = WIK_NULL;
    	}
		var cbOperateCard = [0,0,0];

		//状态判断
		if (cbOperateCode==WIK_NULL)
		{
			selectChi.hide();
			selectBi.hide();
			//删除定时器
			//发送消息
			var operateMsg = getObjWithStructName('CMD_C_OperateCard');
			operateMsg.cbOperateCode = WIK_NULL;
			operateMsg.cbOperateCard = cbOperateCard;
			socket.sendMessage(MDM_GF_GAME, SUB_C_OPERATE_CARD, operateMsg); 
			//设置变量
			mainScene._cbActionMask = WIK_NULL;
			mainScene._cbActionCard = 0;
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
			var cbInfoCount = operateBtn.getSelectCardInfo( cbOperateCode,mainScene._cbActionCard, selectCardInfo,null );
			if (cbOperateCode & WIK_PENG) 
			{
				cbOperateCode = selectCardInfo[0].wActionMask;
				cbOperateCard[0] = selectCardInfo[0].cbActionCard;
				cbOperateCard[1] = selectCardInfo[0].cbCardData[0];
				cbOperateCard[2] = selectCardInfo[0].cbCardData[1];
				bDone = true;
			}
			else
			{
				var selectCardInfoEx = [];
				var cbInfoCountEx = 0;
				for(var i = 0; i < cbInfoCount; i++)
				{
					var cbCardData = handMahJong._cbCardData.concat();
					var cbCardCount = handMahJong._cbCardCount;
					var cbCardIndex = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
					gameLogic.switchToCardIndexEx(cbCardData, cbCardCount, cbCardIndex);
					for(var k = 0; k < 2; k++)
					{
						var nIndex = gameLogic.switchToCardIndex(selectCardInfo[i].cbCardData[k]);
						cbCardIndex[nIndex]--;
					}
					if(cbCardIndex[gameLogic.switchToCardIndex(mainScene._cbActionCard)] > 0)
					{
						cbCardIndex[gameLogic.switchToCardIndex(mainScene._cbActionCard)]--;
						var info = [];
						var cbActionMask = selectChi.estimateEatCard(cbCardIndex, mainScene._cbActionCard);
						var infoCount = operateBtn.getSelectCardInfo(cbActionMask, mainScene._cbActionCard,info, cbCardIndex);
						if (cbActionMask != WIK_NULL) 
						{
							if(cbCardIndex[gameLogic.switchToCardIndex(mainScene._cbActionCard)] > 0)
							{
								cbCardIndex[gameLogic.switchToCardIndex(mainScene._cbActionCard)]--;
								for(var k = 0; k < infoCount; k++)
								{
									for(var j = 0; j < 2; j++)
									{
										var nIndex = gameLogic.switchToCardIndex(info[k].cbCardData[j]);
										cbCardIndex[nIndex]--;
									}
									var info1 = [];
									var cbActionMask1 = selectChi.estimateEatCard(cbCardIndex, mainScene._cbActionCard);
									var infoCount1 = operateBtn.getSelectCardInfo(cbActionMask1, mainScene._cbActionCard,info1, cbCardIndex);
									if (cbActionMask1 != WIK_NULL && infoCount1 > 0) 
									{
										selectCardInfoEx[cbInfoCountEx++] = selectCardInfo[i];
										break;
									}
								}
							}
							else
							{
								selectCardInfoEx[cbInfoCountEx++] = selectCardInfo[i];
							}
						}
					}
					else
					{
			            selectCardInfoEx[cbInfoCountEx++] = selectCardInfo[i];
					}
				}
				selectChi.setSelectInfo(cbInfoCountEx, selectCardInfoEx);
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
    getSelectCardInfo:function(cbOperateCode, cbActionCard, SelectInfo, cardIndexEx)
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
		var cbSelectCount = 0;

		if( cbOperateCode == WIK_NULL ) return 0;

		//吃牌
		if( cbOperateCode&(WIK_LEFT|WIK_CENTER|WIK_RIGHT) )
		{
			//效验
			cc.assert(cbActionCard != 0, "Errors: operate.js 189");

			if( cbActionCard == 0 ) return 0;

			var cardIndex = [];
			if (cardIndexEx == null)
			{
				cardIndex = handMahJong.getCardIndex();
			}
			else
			{
				cardIndex = cardIndexEx;
			}
			if( cbOperateCode & WIK_LEFT && (cbActionCard <= 8 || cbActionCard >= 0x11 && cbActionCard <= 0x18) && 
				cardIndex[gameLogic.switchToCardIndex(cbActionCard+1)] > 0 && cardIndex[gameLogic.switchToCardIndex(cbActionCard+1)] < 3 &&
				cardIndex[gameLogic.switchToCardIndex(cbActionCard+2)] > 0 && cardIndex[gameLogic.switchToCardIndex(cbActionCard+2)] < 3)
			{
				SelectInfo[cbSelectCount] = {};
				SelectInfo[cbSelectCount].cbCardData = [];
				SelectInfo[cbSelectCount].cbActionCard = cbActionCard;
				SelectInfo[cbSelectCount].wActionMask = WIK_LEFT;
				SelectInfo[cbSelectCount].cbCardCount = 2;
				SelectInfo[cbSelectCount].cbCardData[0] = cbActionCard+1;
				SelectInfo[cbSelectCount++].cbCardData[1] = cbActionCard+2;
			}
			if( cbOperateCode & WIK_CENTER && (cbActionCard <= 9 || cbActionCard >= 0x12 && cbActionCard <= 0x19) &&
				cardIndex[gameLogic.switchToCardIndex(cbActionCard-1)] > 0 && cardIndex[gameLogic.switchToCardIndex(cbActionCard-1)] < 3 &&
				cardIndex[gameLogic.switchToCardIndex(cbActionCard+1)] > 0 && cardIndex[gameLogic.switchToCardIndex(cbActionCard+1)] < 3)
			{
				SelectInfo[cbSelectCount] = {};
				SelectInfo[cbSelectCount].cbCardData = [];
				SelectInfo[cbSelectCount].cbActionCard = cbActionCard;
				SelectInfo[cbSelectCount].wActionMask = WIK_CENTER;
				SelectInfo[cbSelectCount].cbCardCount = 2;
				SelectInfo[cbSelectCount].cbCardData[0] = cbActionCard-1;
				SelectInfo[cbSelectCount++].cbCardData[1] = cbActionCard+1;
			}
			if( cbOperateCode & WIK_RIGHT && (cbActionCard <= 10 || cbActionCard >= 0x13 && cbActionCard <= 0x1A) &&
				cardIndex[gameLogic.switchToCardIndex(cbActionCard-2)] > 0 && cardIndex[gameLogic.switchToCardIndex(cbActionCard-2)] < 3 &&
				cardIndex[gameLogic.switchToCardIndex(cbActionCard-1)] > 0 && cardIndex[gameLogic.switchToCardIndex(cbActionCard-1)] < 3)
			{
				SelectInfo[cbSelectCount] = {};
				SelectInfo[cbSelectCount].cbCardData = [];
				SelectInfo[cbSelectCount].cbActionCard = cbActionCard;
				SelectInfo[cbSelectCount].wActionMask = WIK_RIGHT;
				SelectInfo[cbSelectCount].cbCardCount = 2;
				SelectInfo[cbSelectCount].cbCardData[0] = cbActionCard-2;
				SelectInfo[cbSelectCount++].cbCardData[1] = cbActionCard-1;
			}
			var insertInfo = function(cbActionCard, cbCardData1, cbCardData2)
			{
				SelectInfo[cbSelectCount] = {};
				SelectInfo[cbSelectCount].cbCardData = [];
				SelectInfo[cbSelectCount].cbActionCard = cbActionCard;
				SelectInfo[cbSelectCount].wActionMask = WIK_LEFT;
				SelectInfo[cbSelectCount].cbCardCount = 2;
				SelectInfo[cbSelectCount].cbCardData[0] = cbCardData1;
				SelectInfo[cbSelectCount++].cbCardData[1] = cbCardData2;
			}
			var isEat2_7_10 = function(cbEatData, cbCardData1, cbCardData2)
			{
				if (cbActionCard == cbEatData && cardIndex[gameLogic.switchToCardIndex(cbCardData1)] > 0 && cardIndex[gameLogic.switchToCardIndex(cbCardData1)] < 3 
					&& cardIndex[gameLogic.switchToCardIndex(cbCardData2)] > 0 && cardIndex[gameLogic.switchToCardIndex(cbCardData2)] < 3) 
				{
					insertInfo(cbEatData, cbCardData1, cbCardData2);
					return true;
				}
				return false;
			}
			isEat2_7_10(0x02, 0x07, 0x0A);
			isEat2_7_10(0x07, 0x02, 0x0A);
			isEat2_7_10(0x0A, 0x02, 0x07);
			isEat2_7_10(0x12, 0x17, 0x1A);
			isEat2_7_10(0x17, 0x12, 0x1A);
			isEat2_7_10(0x1A, 0x12, 0x17);

			//绞牌吃牌
			
			if (cbActionCard <= 10)
			{
				if (cardIndex[gameLogic.switchToCardIndex(cbActionCard)] > 0 && cardIndex[gameLogic.switchToCardIndex(cbActionCard)] < 3
					&& cardIndex[gameLogic.switchToCardIndex(cbActionCard+16)] > 0 && cardIndex[gameLogic.switchToCardIndex(cbActionCard+16)] < 3) 
				{
					insertInfo(cbActionCard, cbActionCard, cbActionCard+16);
				}
				if (cardIndex[gameLogic.switchToCardIndex(cbActionCard+16)] == 2) 
				{
					insertInfo(cbActionCard, cbActionCard+16, cbActionCard+16);
				}
			}
			else
			{
				if (cardIndex[gameLogic.switchToCardIndex(cbActionCard)] > 0 && cardIndex[gameLogic.switchToCardIndex(cbActionCard-16)] > 0 &&
					cardIndex[gameLogic.switchToCardIndex(cbActionCard)] < 3 && cardIndex[gameLogic.switchToCardIndex(cbActionCard-16)] < 3) 
				{
					insertInfo(cbActionCard, cbActionCard, cbActionCard-16);
				}
				if (cardIndex[gameLogic.switchToCardIndex(cbActionCard-16)] == 2) 
				{
					insertInfo(cbActionCard, cbActionCard-16, cbActionCard-16);
				}
			}
		}
		//碰牌
		else if( cbOperateCode & WIK_PENG )
		{
			//效验
			cc.assert(cbActionCard != 0, "Errors: operate.js 223");
			if( cbActionCard == 0 ) return 0;

			SelectInfo[cbSelectCount] = {};
			SelectInfo[cbSelectCount].cbCardData = [];
			SelectInfo[cbSelectCount].cbActionCard = cbActionCard;
			SelectInfo[cbSelectCount].wActionMask = WIK_PENG;
			SelectInfo[cbSelectCount].cbCardCount = 2;
			SelectInfo[cbSelectCount].cbCardData[0] = cbActionCard;
			SelectInfo[cbSelectCount++].cbCardData[1] = cbActionCard;
		}
		//杠牌
		else if( cbOperateCode & WIK_GANG )
		{
			//如果是自己杠牌
			if( mainScene._wCurrentUser == mainScene._wMeChaird )
			{
				//寻找是否有多个杠牌
				var wMeChairId = gameLogic.switchViewChairID(mainScene._wMeChaird);
				var gcr = {};
				gcr.cbCardCount = 0;
				gcr.cbCardData = [];
				var cardIndex = [];
				cardIndex = handMahJong.getCardIndex();
				gameLogic.analyseGangCard( cardIndex,weaveControl.cbWeaveArray[wMeChairId],weaveControl.cbWeaveCount[wMeChairId],gcr );
				cc.assert(gcr.cbCardCount > 0, "Errors: operate.js line 244");
				for( var i = 0; i < gcr.cbCardCount; i++ )
				{
					SelectInfo[cbSelectCount] = {};
					SelectInfo[cbSelectCount].cbCardData = [];
					SelectInfo[cbSelectCount].cbActionCard = gcr.cbCardData[i];
					SelectInfo[cbSelectCount].wActionMask = WIK_GANG;				
					if( cardIndex[gameLogic.switchToCardIndex(gcr.cbCardData[i])] == 1 )
					{
						SelectInfo[cbSelectCount].cbCardCount = 1;
						SelectInfo[cbSelectCount].cbCardData[0] = gcr.cbCardData[i];
					}
					else
					{
						SelectInfo[cbSelectCount].cbCardCount = gameLogic.getWeaveCard(WIK_GANG,gcr.cbCardData[i],
							SelectInfo[cbSelectCount].cbCardData);
					}
					cbSelectCount++;
				}
			}
			else
			{
				//效验
				cc.assert(cbActionCard != 0, "Errors: operate.js 263");
				if( cbActionCard == 0 ) return 0;

				SelectInfo[cbSelectCount] = {};
				SelectInfo[cbSelectCount].cbCardData = [];
				SelectInfo[cbSelectCount].cbActionCard = cbActionCard;
				SelectInfo[cbSelectCount].wActionMask = WIK_GANG;
				SelectInfo[cbSelectCount].cbCardCount = 3;
				SelectInfo[cbSelectCount].cbCardData[0] = cbActionCard;
				SelectInfo[cbSelectCount].cbCardData[1] = cbActionCard;
				SelectInfo[cbSelectCount++].cbCardData[2] = cbActionCard;
			}
		}

		return cbSelectCount;
    },
};
var selectChi = 
{
	init:function(uiPlay)
	{
		selectChi.node = new cc.Node();
		uiPlay.addChild(selectChi.node, ZORDER_OPERATE_SECELT);
	},
	setSelectInfo:function(cbInfoCount, info)
	{
		selectChi.node.removeAllChildren();
		var lScale = 1.0;
		var create = function(wActionMask, cbCardData, cbCardArray, pos)
		{
			var mahJong = new cc.Sprite("#sJie.png");
			mahJong.spValue = new cc.Sprite(('#s'+cbCardData+'.png'));
			mahJong.spValue.x = mahJong.width/2;
			mahJong.spValue.y = mahJong.height/2;
			mahJong.wActionMask = wActionMask;
			mahJong.cbCardArray = [0,0,0];
			mahJong.cbCardArray = cbCardArray;
			mahJong.addChild(mahJong.spValue);
			mahJong.setScale(lScale);
			mahJong.pos = pos;
			return mahJong;
		};
		var mj = create(1);
		var sy = mainScene.ctPosY;
		selectChi.bg = new cc.Scale9Sprite("selectChiBg.png");
      	selectChi.bg.width = 40+cbInfoCount*mj.width*lScale+(cbInfoCount-1)*15;
      	selectChi.bg.height = mj.height*5*lScale;
      	selectChi.bg.x = (selectChi.bg.width+50)/2;
      	selectChi.bg.y = sy;
      	selectChi.node.addChild(selectChi.bg);

      	selectChi.box = new cc.Scale9Sprite("selectChiBg.png");
      	selectChi.box.width = mj.width*lScale*1.5;
      	selectChi.box.height = mj.height*lScale*3.6;
      	selectChi.box.visible = false;
      	selectChi.bg.addChild(selectChi.box);


      	var title = new cc.Sprite("#title_chi.png");
      	title.x = selectChi.bg.width/2;
      	title.y = selectChi.bg.height-title.height + 10;
      	selectChi.bg.addChild(title);
      	var sx = ((cbInfoCount-1)*mj.width*lScale+(cbInfoCount-1)*15)/2;
		for(var i = 0; i < cbInfoCount; i++)
		{
			var pos = cc.p(title.x - sx + i*mj.width*lScale + i*15, title.y - mj.height*lScale*2 - 10);
			var cbCardArray = [info[i].cbActionCard, info[i].cbCardData[0], info[i].cbCardData[1]];
	      	var mj1 = create(info[i].wActionMask, info[i].cbActionCard, cbCardArray, pos);
	      	var mj2 = create(info[i].wActionMask, info[i].cbCardData[0], cbCardArray, pos);
	      	var mj3 = create(info[i].wActionMask, info[i].cbCardData[1], cbCardArray, pos);
			mj1.x = title.x - sx + i*mj.width*lScale + i*15;
			mj2.x = title.x - sx + i*mj.width*lScale + i*15;
			mj3.x = title.x - sx + i*mj.width*lScale + i*15;
			mj1.y = title.y - mj.height*lScale - 10;
			mj2.y = title.y - mj.height*lScale*2 - 10;
			mj3.y = title.y - mj.height*lScale*3 - 10;
			selectChi.bg.addChild(mj1);
			selectChi.bg.addChild(mj2);
			selectChi.bg.addChild(mj3);
	    	cc.eventManager.addListener(selectChi.getListener(), mj1);
	    	cc.eventManager.addListener(selectChi.getListener(), mj2);
	    	cc.eventManager.addListener(selectChi.getListener(), mj3);
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
				var cbCardData = handMahJong._cbCardData.concat();
				var cbCardCount = handMahJong._cbCardCount;
				var cbCardIndex = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				gameLogic.switchToCardIndexEx(cbCardData, cbCardCount, cbCardIndex);
				for(var i = 1; i < 3; i++)
				{
					var nIndex = gameLogic.switchToCardIndex(item.cbCardArray[i]);
					cbCardIndex[nIndex]--;
				}
				if(cbCardIndex[gameLogic.switchToCardIndex(mainScene._cbActionCard)] > 0)
				{
					cbCardIndex[gameLogic.switchToCardIndex(mainScene._cbActionCard)]--;
					var selectCardInfo = [];
					var cbActionMask = selectChi.estimateEatCard(cbCardIndex, mainScene._cbActionCard);
					var cbInfoCount = operateBtn.getSelectCardInfo(cbActionMask, mainScene._cbActionCard,selectCardInfo, cbCardIndex);
					if (cbInfoCount == 0) 
					{
						var operateMsg = getObjWithStructName('CMD_C_OperateCard');
						operateMsg.cbOperateCode = item.wActionMask;
						operateMsg.cbOperateCard = item.cbCardArray;
						socket.sendMessage(MDM_GF_GAME, SUB_C_OPERATE_CARD, operateMsg); 
						selectChi.node.removeAllChildren();
						selectBi.node.removeAllChildren();
						//隐藏操作控件
						operateBtn.hideOperate();

					}
					else if(cbInfoCount == 1)
					{
						var cbCardDataEx = [selectCardInfo[0].cbActionCard, selectCardInfo[0].cbCardData[0], selectCardInfo[0].cbCardData[1]];
		            	var operateMsg = getObjWithStructName('CMD_C_OperateCard');
						operateMsg.cbOperateCode = item.wActionMask;
						operateMsg.cbOperateCard = item.cbCardArray;
						operateMsg.cbOperateCard1 = cbCardDataEx;
						socket.sendMessage(MDM_GF_GAME, SUB_C_OPERATE_CARD, operateMsg); 
						selectChi.node.removeAllChildren();
						selectBi.node.removeAllChildren();
						//隐藏操作控件
						operateBtn.hideOperate();
					}
					else
					{
						selectChi.box.visible = true;
						selectChi.box.setPosition(item.pos);
						selectBi.setSelectInfo(cbCardIndex, cbInfoCount, selectCardInfo, item.wActionMask, item.cbCardArray);
						return;
					}
				}
				else
				{
		            	var operateMsg = getObjWithStructName('CMD_C_OperateCard');
						operateMsg.cbOperateCode = item.wActionMask;
						operateMsg.cbOperateCard = item.cbCardArray;
						socket.sendMessage(MDM_GF_GAME, SUB_C_OPERATE_CARD, operateMsg); 
						selectChi.node.removeAllChildren();
						selectBi.node.removeAllChildren();
						//隐藏操作控件
						operateBtn.hideOperate();
				}
            }
        })
        return listener;
    },
    estimateEatCard:function(cbCardIndex,cbCurrentCard)
    {
		//变量定义
		var cbExcursion = [0, 1, 2];
		var cbItemKind = [WIK_LEFT, WIK_CENTER, WIK_RIGHT];
		var cbInsteadCard = cbCurrentCard;
		var cbInsteadIndex = cbCardIndex.concat();
		//吃牌判断
		var cbEatKind=0,cbFirstIndex=0;
		var cbCurrentIndex=gameLogic.switchToCardIndex(cbInsteadCard);
		for (var i=0;i<cbItemKind.length;i++)
		{
			var cbValueIndex=cbCurrentIndex%10;
			if ((cbValueIndex>=cbExcursion[i])&&((cbValueIndex-cbExcursion[i])<=7))
			{
				//吃牌判断
				cbFirstIndex=cbCurrentIndex-cbExcursion[i];

				if ((cbCurrentIndex!=cbFirstIndex)&&(cbInsteadIndex[cbFirstIndex]==0 || cbInsteadIndex[cbFirstIndex] > 2))
					continue;
				if ((cbCurrentIndex!=(cbFirstIndex+1))&&(cbInsteadIndex[cbFirstIndex+1]==0 || cbInsteadIndex[cbFirstIndex+1] > 2))
					continue;
				if ((cbCurrentIndex!=(cbFirstIndex+2))&&(cbInsteadIndex[cbFirstIndex+2]==0 || cbInsteadIndex[cbFirstIndex+2] > 2))
					continue;

				//设置类型
				cbEatKind|=cbItemKind[i];
			}
		}
		var isEat2_7_10 = function(cbCardIndex, cbCurrentCard, cbEatCard, cbCardData1, cbCardData2)
		{
			if (cbCurrentCard == cbEatCard && cbCardIndex[gameLogic.switchToCardIndex(cbCardData1)] > 0 && cbCardIndex[gameLogic.switchToCardIndex(cbCardData2)] > 0
				&& cbCardIndex[gameLogic.switchToCardIndex(cbCardData1)] < 3 && cbCardIndex[gameLogic.switchToCardIndex(cbCardData2)] < 3)
			{
				return true;
			}
			return false;
		}
		//2 7 10
		if (isEat2_7_10(cbCardIndex, cbCurrentCard, 0x02, 0x07, 0x0A))
		{
			cbEatKind|=WIK_LEFT;
		}
		else if (isEat2_7_10(cbCardIndex, cbCurrentCard, 0x07, 0x02, 0x0A))
		{
			cbEatKind|=WIK_LEFT;
		}
		else if (isEat2_7_10(cbCardIndex, cbCurrentCard, 0x0A, 0x02, 0x07))
		{
			cbEatKind|=WIK_LEFT;
		}
		else if (isEat2_7_10(cbCardIndex, cbCurrentCard, 0x12, 0x17, 0x1A))
		{
			cbEatKind|=WIK_LEFT;
		}
		else if (isEat2_7_10(cbCardIndex, cbCurrentCard, 0x17, 0x12, 0x1A))
		{
			cbEatKind|=WIK_LEFT;
		}
		else if (isEat2_7_10(cbCardIndex, cbCurrentCard, 0x1A, 0x12, 0x17))
		{
			cbEatKind|=WIK_LEFT;
		}


		//绞牌  两张小字 一个大字 或者两个大字一个小字
		if (cbCurrentCard <= 10)
		{
			if ((cbCardIndex[gameLogic.switchToCardIndex(cbCurrentCard)] > 0 && cbCardIndex[gameLogic.switchToCardIndex(cbCurrentCard+16)] > 0 &&
				cbCardIndex[gameLogic.switchToCardIndex(cbCurrentCard)] < 3 && cbCardIndex[gameLogic.switchToCardIndex(cbCurrentCard+16)] < 3) ||
				cbCardIndex[gameLogic.switchToCardIndex(cbCurrentCard+16)] == 2)
			{
				cbEatKind|=WIK_LEFT;
			}
		}
		else
		{
			if ((cbCardIndex[gameLogic.switchToCardIndex(cbCurrentCard)] > 0 && cbCardIndex[gameLogic.switchToCardIndex(cbCurrentCard-16)] > 0 &&
				cbCardIndex[gameLogic.switchToCardIndex(cbCurrentCard)] < 3 && cbCardIndex[gameLogic.switchToCardIndex(cbCurrentCard-16)] < 3) ||
				cbCardIndex[gameLogic.switchToCardIndex(cbCurrentCard-16)] == 2)
			{
				cbEatKind|=WIK_LEFT;
			}
		}

		return cbEatKind;
    },
    hide:function()
    {
    	if(selectChi.node!== undefined)
    		selectChi.node.removeAllChildren();
    },
};
var selectBi = 
{
	init:function(uiPlay)
	{
		selectBi.node = new cc.Node();
		uiPlay.addChild(selectBi.node, ZORDER_OPERATE_SECELT);
	},
	setSelectInfo:function(cbCardIndex, cbInfoCount, info, wActionMask,cbCardChi)
	{
		selectBi.node.removeAllChildren();
		var listBi = {};
		listBi.cbArray = [];
		listBi.cbCount = 0;
		var compareList = function(cbCardArray1, cbCardArray2)
		{
			var bHave = false;
	      	for(var k = 0; k < listBi.cbCount; k++)
	      	{
	      		var cbCardArrayOld1 = listBi.cbArray[k].cbCardArray1.concat();
	      		var cbCardArrayOld2 = listBi.cbArray[k].cbCardArray2.concat();
	      		var cbCardArrayNew1 = cbCardArray1.concat();
	      		var cbCardArrayNew2 = cbCardArray2.concat();
	      		cbCardArrayOld1.sort(function(a, b) {return a<b});
	      		cbCardArrayOld2.sort(function(a, b) {return a<b});
	      		cbCardArrayNew1.sort(function(a, b) {return a<b});
	      		cbCardArrayNew2.sort(function(a, b) {return a<b});
	      		if (cbCardArrayOld1[0] == cbCardArrayNew2[0] && cbCardArrayOld1[1] == cbCardArrayNew2[1] && cbCardArrayOld1[2] == cbCardArrayNew2[2] &&
	      			cbCardArrayOld2[0] == cbCardArrayNew1[0] && cbCardArrayOld2[1] == cbCardArrayNew1[1] && cbCardArrayOld2[2] == cbCardArrayNew1[2])
	      		{
	      			bHave = true;
	      		}
	      	}
	      	if (!bHave)
	      	{
	      		listBi.cbArray[listBi.cbCount] = {};
	      		listBi.cbArray[listBi.cbCount].cbCardArray1 = [0, 0, 0, 0];
				listBi.cbArray[listBi.cbCount].cbCardArray2 = [0, 0, 0, 0];
				listBi.cbArray[listBi.cbCount].cbCardArray1 = cbCardArray1.concat();
				listBi.cbArray[listBi.cbCount].cbCardArray2 = cbCardArray2.concat();
				listBi.cbCount++;
	      	}
		}
		for(var i = 0; i < cbInfoCount; i++)
		{
			var cbCardArray1 = [info[i].cbActionCard, info[i].cbCardData[0], info[i].cbCardData[1]];
			var cbCardArray2 = [0,0,0];
			var cbCardIndexEx = cbCardIndex.concat();
			for(var k = 1; k < 3; k++)
			{
				var nIndex = gameLogic.switchToCardIndex(cbCardArray1[k]);
				cbCardIndexEx[nIndex]--;
			}
			if(cbCardIndexEx[gameLogic.switchToCardIndex(mainScene._cbActionCard)] == 1)
			{
				cbCardIndexEx[gameLogic.switchToCardIndex(mainScene._cbActionCard)]--;
				var selectCardInfo = [];
				var cbActionMask = selectChi.estimateEatCard(cbCardIndexEx, mainScene._cbActionCard);
				var cbInfoCountEx = operateBtn.getSelectCardInfo(cbActionMask, mainScene._cbActionCard,selectCardInfo, cbCardIndexEx);
				if (cbActionMask != WIK_NULL)
				{
					if (cbInfoCountEx == 1) 
					{
						cbCardArray2[0] = selectCardInfo[0].cbActionCard;
						cbCardArray2[1] = selectCardInfo[0].cbCardData[0];
						cbCardArray2[2] = selectCardInfo[0].cbCardData[1];
						compareList(cbCardArray1, cbCardArray2);
					}
					else
					{
						var cbCardDataEx = [selectCardInfo[0].cbActionCard, selectCardInfo[0].cbCardData[0], selectCardInfo[0].cbCardData[1]];
						compareList(cbCardArray1, cbCardDataEx);
						for(var j = 1; j < cbInfoCountEx; j++)
						{
							var cbCardArray2 = [selectCardInfo[j].cbActionCard, selectCardInfo[j].cbCardData[0], selectCardInfo[j].cbCardData[1]];
							compareList(cbCardArray1, cbCardArray2);
						}
					}
				}
			}
			else
			{
				listBi.cbArray[listBi.cbCount] = {};
				listBi.cbArray[listBi.cbCount].cbCardArray1 = [0, 0, 0, 0];
				listBi.cbArray[listBi.cbCount].cbCardArray2 = [0, 0, 0, 0];
				listBi.cbArray[listBi.cbCount].cbCardArray1 = cbCardArray1.concat();
				listBi.cbArray[listBi.cbCount].cbCardArray2 = cbCardArray2.concat();
				listBi.cbCount++;
			}
		}

		var lScale = 1.0;
		var create = function(cbCardData, cbCardChi, cbCardArray1, cbCardArray2)
		{
			var mahJong = new cc.Sprite("#sJie.png");
			mahJong.spValue = new cc.Sprite(('#s'+cbCardData+'.png'));
			mahJong.spValue.x = mahJong.width/2;
			mahJong.spValue.y = mahJong.height/2;
			mahJong.wActionMask = wActionMask;
			mahJong.cbCardChi = [0,0,0];
			mahJong.cbCardChi = cbCardChi;
			mahJong.cbCardArray1 = [0,0,0];
			mahJong.cbCardArray1 = cbCardArray1;
			mahJong.cbCardArray2 = [0,0,0];
			mahJong.cbCardArray2 = cbCardArray2;
			mahJong.addChild(mahJong.spValue);
			mahJong.setScale(lScale);
			return mahJong;
		};
		var createList = function(cbCardData, cbCardChi, cbCardArray1, cbCardArray2, bThrow)
		{
			if(cbCardData[0] == 0) return;
			var disPos = bThrow?mj.width*lScale:0;
	      	var mj1 = create(cbCardData[0], cbCardChi, cbCardArray1, cbCardArray2);
	      	var mj2 = create(cbCardData[1], cbCardChi, cbCardArray1, cbCardArray2);
	      	var mj3 = create(cbCardData[2], cbCardChi, cbCardArray1, cbCardArray2);
			mj1.x = posX + disPos;
			mj2.x = posX + disPos;
			mj3.x = posX + disPos;
			mj1.y = title.y - mj.height*lScale - 10;
			mj2.y = title.y - mj.height*lScale*2 - 10;
			mj3.y = title.y - mj.height*lScale*3 - 10;
			bg.addChild(mj1);
			bg.addChild(mj2);
			bg.addChild(mj3);
	    	cc.eventManager.addListener(selectBi.getListener(), mj1);
	    	cc.eventManager.addListener(selectBi.getListener(), mj2);
	    	cc.eventManager.addListener(selectBi.getListener(), mj3);
		}
		var mj = create(1);
		var sy = mainScene.ctPosY;
		var bg = new cc.Scale9Sprite("selectChiBg.png");
      	bg.width = 40+listBi.cbCount*2*mj.width*lScale+(listBi.cbCount-1)*15;
      	bg.height = mj.height*5*lScale;
      	bg.x = (bg.width+20)/2+selectChi.bg.width/2+selectChi.bg.x;
      	bg.y = sy;
      	selectBi.node.addChild(bg);
      	var title = new cc.Sprite("#title_bi.png");
      	title.x = bg.width/2;
      	title.y = bg.height-title.height + 10;
      	bg.addChild(title);
      	var sx = ((listBi.cbCount-1)*mj.width*2*lScale+mj.width*lScale+(listBi.cbCount-1)*15)/2;
      	var posX = title.x - sx;
      	for(var i = 0; i < listBi.cbCount; i++)
		{
			createList(listBi.cbArray[i].cbCardArray1, cbCardChi, listBi.cbArray[i].cbCardArray1, listBi.cbArray[i].cbCardArray2, false);
			createList(listBi.cbArray[i].cbCardArray2, cbCardChi, listBi.cbArray[i].cbCardArray1, listBi.cbArray[i].cbCardArray2, true);
			posX += mj.width*lScale*2 + 15;
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
				operateMsg.cbOperateCard = item.cbCardChi;
				operateMsg.cbOperateCard1 = item.cbCardArray1;
				operateMsg.cbOperateCard2 = item.cbCardArray2;
				socket.sendMessage(MDM_GF_GAME, SUB_C_OPERATE_CARD, operateMsg); 
				selectChi.node.removeAllChildren();
				selectBi.node.removeAllChildren();
				//隐藏操作控件
				operateBtn.hideOperate();
            }
        })
        return listener;
    },
    hide:function()
    {
    	if(selectBi.node!== undefined)
    		selectBi.node.removeAllChildren();
    },
};













