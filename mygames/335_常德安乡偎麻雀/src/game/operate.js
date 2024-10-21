
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
		operateBtn.hideOperate();
		var posX = tableData.getChairWithShowChairId(1).node.x - 300;
		var bOperate = false;
		if ((cbAcitonMask&WIK_CHI_HU)!=0)
		{
			operateBtn._btnHu.visible = true;
			operateBtn._btnHu.x = posX;
			posX -= 130;
			bOperate = true;
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

		//状态判断
		if (cbOperateCode==WIK_NULL)
		{
			selectChi.hide();
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
				selectChi.setSelectInfo(cbInfoCount, selectCardInfo);
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
			return mahJong;
		};
		var mj = create(1);
		var sx = mainScene.ctPosX-((cbInfoCount-1)*mj.width*lScale+(cbInfoCount-1)*30)/2;
		var sy = 350;
		var bg = new cc.Scale9Sprite("selectChiBg.png");
      	bg.width = mj.width*2.5*lScale+(cbInfoCount-1)*mj.width*lScale+(cbInfoCount-1)*30;
      	bg.height = mj.height*4*lScale;
      	bg.x = mainScene.ctPosX;
      	bg.y = sy;
      	selectChi.node.addChild(bg);
		for(var i = 0; i < cbInfoCount; i++)
		{
	      	var mj1 = null;
	      	var mj2 = null;
	      	var mj3 = null;
	      	var cbCardArray = [info[i].cbActionCard, info[i].cbCardData[0], info[i].cbCardData[1]];
      		if (info[i].wActionMask & WIK_LEFT) 
			{
				mj1 = create(WIK_LEFT, info[i].cbActionCard, cbCardArray);
				mj2 = create(WIK_LEFT, info[i].cbCardData[0], cbCardArray);
				mj3 = create(WIK_LEFT, info[i].cbCardData[1], cbCardArray);
			}
			else if (info[i].wActionMask & WIK_CENTER) 
			{
				mj1 = create(WIK_CENTER, info[i].cbCardData[0], cbCardArray);
				mj2 = create(WIK_CENTER, info[i].cbActionCard, cbCardArray);
				mj3 = create(WIK_CENTER, info[i].cbCardData[1], cbCardArray);
			}
			else if (info[i].wActionMask & WIK_RIGHT) 
			{
				mj1 = create(WIK_RIGHT, info[i].cbCardData[0], cbCardArray);
				mj2 = create(WIK_RIGHT, info[i].cbCardData[1], cbCardArray);
				mj3 = create(WIK_RIGHT, info[i].cbActionCard, cbCardArray);
			}
			mj1.x = sx + i*mj.width*lScale + i*30;
			mj2.x = sx + i*mj.width*lScale + i*30;
			mj3.x = sx + i*mj.width*lScale + i*30;
			mj1.y = sy + mj.height*lScale;
			mj2.y = sy;
			mj3.y = sy - mj.height*lScale;
			selectChi.node.addChild(mj1);
			selectChi.node.addChild(mj2);
			selectChi.node.addChild(mj3);
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
            	var operateMsg = getObjWithStructName('CMD_C_OperateCard');
				operateMsg.cbOperateCode = item.wActionMask;
				operateMsg.cbOperateCard = item.cbCardArray;
				//console.log(111111111, operateMsg);
				socket.sendMessage(MDM_GF_GAME, SUB_C_OPERATE_CARD, operateMsg); 
				selectChi.node.removeAllChildren();
				//隐藏操作控件
				operateBtn.hideOperate();
            }
        })
        return listener;
    },
    hide:function()
    {
    	selectChi.node.removeAllChildren();
    },
};













