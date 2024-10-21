
var operateBtn = 
{
	init:function(uiPlay)
	{
		//吃
        operateBtn._btnChi = new ccui.Button(resp.btnChi);
        operateBtn._btnChi.addTouchEventListener(this.onTouchEvent, this);
        operateBtn._btnChi.visible = false;
        operateBtn._btnChi.y = 180;
        uiPlay.addChild(operateBtn._btnChi,ZORDER_OPERATE_BTN);

        //碰
        operateBtn._btnPeng = new ccui.Button(resp.btnPeng);
        operateBtn._btnPeng.addTouchEventListener(this.onTouchEvent, this);
        operateBtn._btnPeng.visible = false;
        operateBtn._btnPeng.y = 180;
        uiPlay.addChild(operateBtn._btnPeng,ZORDER_OPERATE_BTN);

        //杠
        operateBtn._btnGang = new ccui.Button(resp.btnGang);
        operateBtn._btnGang.addTouchEventListener(this.onTouchEvent, this);
        operateBtn._btnGang.visible = false;
        operateBtn._btnGang.y = 180;
        uiPlay.addChild(operateBtn._btnGang,ZORDER_OPERATE_BTN);

        //胡
        operateBtn._btnHu = new ccui.Button(resp.btnHu);
        operateBtn._btnHu.addTouchEventListener(this.onTouchEvent, this);
        operateBtn._btnHu.visible = false;
        operateBtn._btnHu.y = 180;
        uiPlay.addChild(operateBtn._btnHu,ZORDER_OPERATE_BTN);

        //过
        operateBtn._btnPass = new ccui.Button(resp.btnPass);
        operateBtn._btnPass.addTouchEventListener(this.onTouchEvent, this);
        operateBtn._btnPass.visible = false;
        operateBtn._btnPass.setPosition(cc.p(tableData.getChairWithShowChairId(1).node.x - 100, 180));
        uiPlay.addChild(operateBtn._btnPass,ZORDER_OPERATE_BTN);

	},
	setOperateInfo:function(cbAcitonMask)
	{
		if(mainScene._wMeChaird == INVALID_CHAIR) return false;
		operateBtn.hideOperate();
		var posX = tableData.getChairWithShowChairId(1).node.x - 230;
		var bOperate = false;
		if ((cbAcitonMask&WIK_CHI_HU)!=0)
		{
			operateBtn._btnHu.visible = true;
			operateBtn._btnHu.x = posX;
			posX -= 130;
			bOperate = true;
            operateBtn._btnPass.visible = false;
            handMahJong.setCardEnable(false);
            return
		}
		if ((cbAcitonMask&WIK_GANG)!=0)
		{
			operateBtn._btnGang.visible = true;
			operateBtn._btnGang.x = posX;
			posX -= 130;
			bOperate = true;
		}
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

        if(cbAcitonMask & WIK_CHI_HU)
        {
            operateBtn._btnPass.visible = false;
            handMahJong.setCardEnable(false);
        }
		else operateBtn._btnPass.visible = bOperate;
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
    		cbOperateCode = WIK_LEFT;
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

		//隐藏操作控件

		operateBtn.hideOperate();

		//状态判断
	   if (cbOperateCode==WIK_NULL)
		{
			//设置变量
			mainScene._cbActionMask = WIK_NULL;
			mainScene._cbActionCard = 0;
			if( mainScene._wCurrentUser == INVALID_CHAIR )
			{
                
			}
			var operateMsg = getObjWithStructName('CMD_C_OperateCard');
            operateMsg.cbOperateCode = WIK_NULL;
            operateMsg.cbOperateCard = cbOperateCard;
            socket.sendMessage(MDM_GF_GAME, SUB_C_OPERATE_CARD, operateMsg); 
			return;
		}

		var bDone = false;
		//胡牌
		if( cbOperateCode & WIK_CHI_HU )
		{
			bDone = true;
		}	
		else
		{
			//获取选择组合
			var selectCardInfo = [];
			var cbInfoCount = operateBtn.getSelectCardInfo( cbOperateCode,selectCardInfo );
            gameLog.log("杠牌数目"+cbInfoCount);
			if (cbInfoCount <= 1) 
			{
				cbOperateCode = selectCardInfo[0].wActionMask;
				cbOperateCard[0] = selectCardInfo[0].cbActionCard;
				cbOperateCard[1] = selectCardInfo[0].cbCardData[0];
				cbOperateCard[2] = selectCardInfo[0].cbCardData[1];
				bDone = true;
			}
			else
			{
				if (cbOperateCode & WIK_GANG) 
				{
					//多项选择 杠
					selectGang.setSelectInfo(cbInfoCount, selectCardInfo);
				}
				else if (cbOperateCode & WIK_LEFT || cbOperateCode & WIK_CENTER || cbOperateCode & WIK_RIGHT)
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
			mainScene._wCurrentUser = INVALID_CHAIR;
			mainScene._cbActionMask = WIK_NULL;
			mainScene._cbActionCard = 0;
			var operateMsg = getObjWithStructName('CMD_C_OperateCard');
			operateMsg.cbOperateCode = cbOperateCode;
			operateMsg.cbOperateCard = cbOperateCard;
			socket.sendMessage(MDM_GF_GAME, SUB_C_OPERATE_CARD, operateMsg); 
		}
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
		var cbSelectCount = 0;

		if( cbOperateCode == WIK_NULL ) return 0;

		//吃牌
		if( cbOperateCode&(WIK_LEFT|WIK_CENTER|WIK_RIGHT) )
		{
			//效验
			cc.assert(mainScene._cbActionCard != 0, "Errors: operate.js 189");
			if( mainScene._cbActionCard == 0 ) return 0;

			if( mainScene._cbActionMask & WIK_LEFT )
			{
                gameLog.log("WIK_LEFT");
				SelectInfo[cbSelectCount] = {};
				SelectInfo[cbSelectCount].cbCardData = [];
				SelectInfo[cbSelectCount].cbActionCard = mainScene._cbActionCard;
				SelectInfo[cbSelectCount].wActionMask = WIK_LEFT;
				SelectInfo[cbSelectCount].cbCardCount = 2;
				SelectInfo[cbSelectCount].cbCardData[0] = mainScene._cbActionCard+1;
				SelectInfo[cbSelectCount++].cbCardData[1] = mainScene._cbActionCard+2;
			}
			if( mainScene._cbActionMask & WIK_CENTER )
			{
                gameLog.log("WIK_CENTER");
				SelectInfo[cbSelectCount] = {};
				SelectInfo[cbSelectCount].cbCardData = [];
				SelectInfo[cbSelectCount].cbActionCard = mainScene._cbActionCard;
				SelectInfo[cbSelectCount].wActionMask = WIK_CENTER;
				SelectInfo[cbSelectCount].cbCardCount = 2;
				SelectInfo[cbSelectCount].cbCardData[0] = mainScene._cbActionCard-1;
				SelectInfo[cbSelectCount++].cbCardData[1] = mainScene._cbActionCard+1;
			}
			if( mainScene._cbActionMask & WIK_RIGHT )
			{
                gameLog.log("WIK_RIGHT");
				SelectInfo[cbSelectCount] = {};
				SelectInfo[cbSelectCount].cbCardData = [];
				SelectInfo[cbSelectCount].cbActionCard = mainScene._cbActionCard;
				SelectInfo[cbSelectCount].wActionMask = WIK_RIGHT;
				SelectInfo[cbSelectCount].cbCardCount = 2;
				SelectInfo[cbSelectCount].cbCardData[0] = mainScene._cbActionCard-2;
				SelectInfo[cbSelectCount++].cbCardData[1] = mainScene._cbActionCard-1;
			}
		}
		//碰牌
		else if( cbOperateCode & WIK_PENG )
		{
			//效验
			cc.assert(mainScene._cbActionCard != 0, "Errors: operate.js 223");
			if( mainScene._cbActionCard == 0 ) return 0;

			SelectInfo[cbSelectCount] = {};
			SelectInfo[cbSelectCount].cbCardData = [];
			SelectInfo[cbSelectCount].cbActionCard = mainScene._cbActionCard;
			SelectInfo[cbSelectCount].wActionMask = WIK_PENG;
			SelectInfo[cbSelectCount].cbCardCount = 2;
			SelectInfo[cbSelectCount].cbCardData[0] = mainScene._cbActionCard;
			SelectInfo[cbSelectCount++].cbCardData[1] = mainScene._cbActionCard;
		}
		//杠牌
		else if( cbOperateCode & WIK_GANG )
		{
			//如果是自己杠牌
			if( mainScene._wCurrentUser == mainScene._wMeChaird )
			{
                gameLog.log("自己杠牌");
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
				cc.assert(mainScene._cbActionCard != 0, "Errors: operate.js 263");
				if( mainScene._cbActionCard == 0 ) return 0;

				SelectInfo[cbSelectCount] = {};
				SelectInfo[cbSelectCount].cbCardData = [];
				SelectInfo[cbSelectCount].cbActionCard = mainScene._cbActionCard;
				SelectInfo[cbSelectCount].wActionMask = WIK_GANG;
				SelectInfo[cbSelectCount].cbCardCount = 3;
				SelectInfo[cbSelectCount].cbCardData[0] = mainScene._cbActionCard;
				SelectInfo[cbSelectCount].cbCardData[1] = mainScene._cbActionCard;
				SelectInfo[cbSelectCount++].cbCardData[2] = mainScene._cbActionCard;
			}
		}

		return cbSelectCount;
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
			selectChi.bg[i].y = mainScene.ctPosY - 160;
			uiPlay.addChild(selectChi.bg[i],ZORDER_OPERATE_SECELT);

			selectChi.mj[i] = [];
			for (var k = 0; k < 3; k++) {
				selectChi.mj[i][k] = weaveControl.create(0, 1);
				selectChi.mj[i][k].visible = false;
				selectChi.mj[i][k].y = mainScene.ctPosY - 160;
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
                selectChi.mj[i][0].spValue.setSpriteFrame('value_' + info[i].cbActionCard + '.png');
                selectChi.mj[i][0].spValue.color = cc.color(125, 125, 125);
                selectChi.mj[i][0].color = cc.color(125, 125, 125);
                selectChi.mj[i][1].spValue.setSpriteFrame('value_' + info[i].cbCardData[0] + '.png');
                selectChi.mj[i][1].spValue.color = cc.color(255, 255, 255);
                selectChi.mj[i][1].color = cc.color(255, 255, 255);
                selectChi.mj[i][2].spValue.setSpriteFrame('value_' + info[i].cbCardData[1] + '.png');
                selectChi.mj[i][2].spValue.color = cc.color(255, 255, 255);
                selectChi.mj[i][2].color = cc.color(255, 255, 255);

                if(handMahJong.isMagicCard(info[i].cbCardData[0]))
                    selectChi.mj[i][1].color = MAGIC_COLOR
                if(handMahJong.isMagicCard(info[i].cbCardData[1]))
                    selectChi.mj[i][2].color = MAGIC_COLOR

                if(!handMahJong.isCardExist(info[i].cbCardData[0]))
                {
                    selectChi.mj[i][1].color = MAGIC_COLOR
                }
                if(!handMahJong.isCardExist(info[i].cbCardData[1]))
                {
                    selectChi.mj[i][2].color = MAGIC_COLOR
                }

			}
			else if (info[i].wActionMask & WIK_CENTER) 
			{
				selectChi.mj[i][0].spValue.setSpriteFrame('value_' + info[i].cbCardData[0] + '.png');
				selectChi.mj[i][0].spValue.color = cc.color(255, 255, 255);
				selectChi.mj[i][0].color = cc.color(255, 255, 255);
				selectChi.mj[i][1].spValue.setSpriteFrame('value_' + info[i].cbActionCard + '.png');
				selectChi.mj[i][1].spValue.color = cc.color(125, 125, 125);
				selectChi.mj[i][1].color = cc.color(125, 125, 125);
				selectChi.mj[i][2].spValue.setSpriteFrame('value_' + info[i].cbCardData[1] + '.png');
				selectChi.mj[i][2].spValue.color = cc.color(255, 255, 255);
				selectChi.mj[i][2].color = cc.color(255, 255, 255);

                if(handMahJong.isMagicCard(info[i].cbCardData[0]))
                    selectChi.mj[i][0].color = MAGIC_COLOR
                if(handMahJong.isMagicCard(info[i].cbCardData[2]))
                    selectChi.mj[i][2].color = MAGIC_COLOR

                if(!handMahJong.isCardExist(info[i].cbCardData[0]))
                {
                    selectChi.mj[i][0].color = MAGIC_COLOR
                }
                if(!handMahJong.isCardExist(info[i].cbCardData[1]))
                {
                    selectChi.mj[i][2].color = MAGIC_COLOR
                }
			}
			else if (info[i].wActionMask & WIK_RIGHT) 
			{
                selectChi.mj[i][0].spValue.setSpriteFrame('value_' + info[i].cbCardData[0] + '.png');
                selectChi.mj[i][0].spValue.color = cc.color(255, 255, 255);
                selectChi.mj[i][0].color = cc.color(255, 255, 255);
                selectChi.mj[i][1].spValue.setSpriteFrame('value_' + info[i].cbCardData[1] + '.png');
                selectChi.mj[i][1].spValue.color = cc.color(255, 255, 255);
                selectChi.mj[i][1].color = cc.color(255, 255, 255);
				selectChi.mj[i][2].spValue.setSpriteFrame('value_' + info[i].cbActionCard + '.png');
				selectChi.mj[i][2].spValue.color = cc.color(125, 125, 125);
				selectChi.mj[i][2].color = cc.color(125, 125, 125);

                if(handMahJong.isMagicCard(info[i].cbCardData[0]))
                    selectChi.mj[i][0].color = MAGIC_COLOR
                if(handMahJong.isMagicCard(info[i].cbCardData[1]))
                    selectChi.mj[i][1].color = MAGIC_COLOR

                if(!handMahJong.isCardExist(info[i].cbCardData[0]))
                {
                    selectChi.mj[i][0].color = MAGIC_COLOR
                }
                if(!handMahJong.isCardExist(info[i].cbCardData[1]))
                {
                    selectChi.mj[i][1].color = MAGIC_COLOR
                }
			}
			selectChi.mj[i][0].x = posX + i*220 - 52;
			selectChi.mj[i][1].x = posX + i*220;
			selectChi.mj[i][2].x = posX + i*220 + 52;
			selectChi.mj[i][0].visible = true;
			selectChi.mj[i][1].visible = true;
			selectChi.mj[i][2].visible = true;

			selectChi.bg[i].wActionMask = info[i].wActionMask;
			selectChi.bg[i].cbCardData = [];
			selectChi.bg[i].cbCardData[0] = info[i].cbActionCard;
			selectChi.bg[i].cbCardData[1] = info[i].cbCardData[0];
			selectChi.bg[i].cbCardData[2] = info[i].cbCardData[1];
			
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
		for (var i = 0; i < 14; i++) {
			selectGang.bg[i] = new cc.Sprite("#selectGangBg.png");
			selectGang.bg[i].y = mainScene.ctPosY - 160;
			selectGang.bg[i].visible = false;
			uiPlay.addChild(selectGang.bg[i],ZORDER_OPERATE_SECELT);
			selectGang.mj[i] = weaveControl.create(0, 1);
			selectGang.mj[i].y = mainScene.ctPosY - 160;
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
				operateMsg.cbOperateCode = WIK_GANG;
				operateMsg.cbOperateCard = [];
				operateMsg.cbOperateCard[0] = item.cbCardData.cbCardData[0];
				operateMsg.cbOperateCard[1] = item.cbCardData.cbCardData[1];
				operateMsg.cbOperateCard[2] = item.cbCardData.cbCardData[2];
				socket.sendMessage(MDM_GF_GAME, SUB_C_OPERATE_CARD, operateMsg); 
				selectGang.hideContorl();
            }
        })
        return listener;
    },
	setSelectInfo:function(cbInfoCount, info)
	{
		var posX = mainScene.ctPosX + 50 - cbInfoCount*95/2;
		for (var i = 0; i < cbInfoCount; i++) {
			selectGang.bg[i].visible = true;
			selectGang.bg[i].x = posX + i*95;
			selectGang.bg[i].cbCardData = [];
			selectGang.bg[i].cbCardData = info[i];

			selectGang.mj[i].spValue.setSpriteFrame('value_' + info[i].cbActionCard + '.png');
			selectGang.mj[i].visible = true;
			selectGang.mj[i].x = posX + i*95;
			selectGang.mj[i].nIndex = i;
			
		};
	},
	hideContorl:function()
    {
    	for (var i = 0; i < 14; i++) {
    		selectGang.mj[i].visible = false;
    		selectGang.bg[i].visible = false;
		}
    },
    
};