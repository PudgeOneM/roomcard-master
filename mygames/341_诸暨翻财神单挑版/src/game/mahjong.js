var INVALID_NINDEX = 255;
var SNED_INDEX = 14;
var MAX_DISCARD = 24;
var SHOOT_DISTANCE = 25;
var DISCARD_ROW_COUNT = 19;
var HUACARD_ROW_COUNT = 30;
//生成单个麻将
var mahJongNode = {
	create:function(nIndex)
	{
		var mahJong = new cc.Sprite("#down_user_bg.png");
		mahJong.bShoot = false;
		mahJong.bGray = false;
		mahJong.nIndex = nIndex;
		mahJong.enable = true;
		mahJong.visible = false;
		mahJong.cbCardData = 0;
		mahJong.bEnter = false;

		mahJong.spValue = new cc.Sprite("#value_1.png");
		mahJong.addChild(mahJong.spValue);
		mahJong.spValue.x = 30;
		mahJong.spValue.y = 40;
		return mahJong;
	},
};
//本地
var handMahJong = {
	init:function(uiPlay)
	{
		//麻将适配
		var mahJong = new cc.Sprite("#down_user_bg.png");
		var gameWidth = topUI.node.width;
		var mahJongScale = (gameWidth-40)/(MAX_COUNT+1)/mahJong.width;


		handMahJong.bMoveX = false;
        handMahJong.bMoveY = false;
		handMahJong.node = new cc.Node();
		uiPlay.addChild(handMahJong.node);
		handMahJong.cbCardData = [];
		handMahJong.cbCardCount = MAX_COUNT;
		handMahJong.control = [];
		for (var i = 0; i < MAX_COUNT; i++) {
			handMahJong.control[i] = mahJongNode.create(i);
			handMahJong.control[i].scale = mahJongScale;
			handMahJong.node.addChild(handMahJong.control[i]);
		}
		handMahJong.mjWidth = Math.floor(handMahJong.control[0].width*mahJongScale);
		handMahJong.setControlPos(INVALID_NINDEX);
		handMahJong.lx = handMahJong.control[13].x - handMahJong.mjWidth/2;
		handMahJong.rx = handMahJong.control[0].x + handMahJong.mjWidth/2;
		handMahJong.uy = handMahJong.control[0].y + SHOOT_DISTANCE;
		handMahJong.dy = handMahJong.control[0].y - SHOOT_DISTANCE;

		var listener = handMahJong.getListener(handMahJong.node);
    	cc.eventManager.addListener(listener, handMahJong.node);
	},
	getListener:function(target)
    {   
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
           onTouchBegan: function (touch, event) {
           		if ( isRecordScene ) return false;
           		if(mainScene._wMeChaird == INVALID_CHAIR) return false;
           		if(handMahJong.control[1].visible == false) return false;
       	        for (var i = 0; i < MAX_COUNT; i++) {
       	        	if(handMahJong.control[i].visible == false) continue;
            		if(handMahJong.control[i].enable == false) continue;
            		var locationInNode = handMahJong.control[i].convertToNodeSpace(touch.getLocation());
	                var s = handMahJong.control[i].getContentSize();
	                var rect = cc.rect(0, 0, s.width, s.height);
	                if (cc.rectContainsPoint(rect, locationInNode)) {
	                    handMahJong.setOnEnter(i);
	                    handMahJong.bTouch = true;
	                    //outMahJong.showOutCard(0, handMahJong.control[i].cbCardData);
	                    //单击出牌
	                    handMahJong.setControlPos(i);
	                    handMahJong.control[i].bShoot = true;
	                    return true;
	                }
        		};
                return false;
            },
            onTouchMoved:function(touch, event)
            {
            	if(!handMahJong.bTouch) return false;
            	if(handMahJong.control[1].visible == false) return false;
	            var delta = touch.getDelta();
	            var deltaX = delta.y;
	            var deltaY = delta.x;
	            if(!cc.sys.isMobile)
	            {
	            	deltaX = delta.x;
	            	deltaY = delta.y;
	            }
            	if (Math.abs(deltaX) > 2 && Math.abs(deltaY) < Math.abs(deltaX))
            	{
            		handMahJong.bMoveX = true;
            		handMahJong.bMoveY = false;
            	}
            	else if (Math.abs(deltaY) > 3)
            	{
            		handMahJong.bMoveX = false;
            		handMahJong.bMoveY = true;
            	} 

	            if (handMahJong.bMoveX)
	            {
	            	//手机版本横向钢琴拖
	            	for (var i = 0; i < MAX_COUNT; i++) {
            			if(handMahJong.control[i].visible == false) continue;
                		if(handMahJong.control[i].enable == false) continue;
                		var locationInNode = handMahJong.control[i].convertToNodeSpace(touch.getLocation());
		                var s = handMahJong.control[i].getContentSize();
		                var rect = cc.rect(0, 0, s.width, s.height);
		                if (cc.rectContainsPoint(rect, locationInNode) && handMahJong.control[i].y < handMahJong.uy) {
		                	handMahJong.setControlPos(i);
		                	handMahJong.setOnEnter(i);
		                	handMahJong.control[i].bShoot = false;
		                	outMahJong.showOutCard(0, handMahJong.control[i].cbCardData);
		                    return true;
		                }
            		};
	            }
	            else if (handMahJong.bMoveY)
	            {
	            	//手机版本竖向拖动出牌
	            	for (var i = 0; i < MAX_COUNT; i++) {
            			if(handMahJong.control[i].visible == false) continue;
                		if(handMahJong.control[i].enable == false) continue;
                		if(handMahJong.control[i].bEnter == false) continue;
                		handMahJong.control[i].x += deltaX;
                		if(cc.sys.isMobile)
	                		handMahJong.control[i].y -= deltaY; 
	                	else
	                		handMahJong.control[i].y += deltaY; 
	                	handMahJong.control[i].bShoot = true;
                		return true;
            		};
	            }
            },
            onTouchEnded: function (touch, event) {
            	handMahJong.bMoveX = false;
            	handMahJong.bMoveY = false;
            	handMahJong.bTouch = false;
            	if(handMahJong.control[1].visible == false) return false;
        	    for (var i = 0; i < MAX_COUNT; i++) {
        			if(handMahJong.control[i].visible == false) continue;
            		if(handMahJong.control[i].enable == false) continue;
            		if(handMahJong.control[i].bEnter == false) continue;
	                if(handMahJong.control[i].bShoot) 
	                {
	                	//出牌
	                	if(handMahJong.control[i].y >= handMahJong.uy)
	                	{
	                		handMahJong.control[i].bShoot = false;
	                		handMahJong.control[i].y -= SHOOT_DISTANCE;
	                		handMahJong.setControlPos(INVALID_NINDEX);
	                		handMahJong.setOutCard(i);
	                	}
	                	else
	                	{
	                		handMahJong.control[i].bShoot = false;
	              	  		handMahJong.control[i].y -= SHOOT_DISTANCE;
	                		handMahJong.setControlPos(INVALID_NINDEX);
	                	}
	                }
	                else
	                {
	                	handMahJong.setControlPos(i);
	                }
	                break;
        		}
            }
        })
        return listener
    },
    setOnEnter:function(nIndex)
    {
    	for (var i = 0; i < MAX_COUNT; i++) {
    		handMahJong.control[i].bEnter = false;
    	};
    	handMahJong.control[nIndex].bEnter = true;
    },
	//每次操作麻将都要重置位置   参数：抬起的麻将的索引
	setControlPos:function(shootIndex)
	{
		var fx = topUI.node.width - handMahJong.mjWidth - 30 - handMahJong.mjWidth/2 - handMahJong.mjWidth/2;
		var fy = 5+handMahJong.control[0].height/2;
		for (var i = 0; i < MAX_COUNT; i++) 
		{
			handMahJong.control[i].bShoot = false;
			if (i == 0)
				handMahJong.control[i].setPosition(fx + handMahJong.mjWidth + 20, fy);
			else
				handMahJong.control[i].setPosition(fx - (i-1) * handMahJong.mjWidth+1*i, fy);
		}
		if (shootIndex != INVALID_NINDEX) 
		{
			handMahJong.control[shootIndex].bShoot = true;
			handMahJong.control[shootIndex].y = fy + SHOOT_DISTANCE;
		}
	},
	setCardData:function(cbCardData, cbCardCount, bSend)
	{
		if (mainScene._wMeChaird == INVALID_CHAIR)
		{
			for (var i = 0; i < cbCardCount; i++) {
				cbCardData[i] = 0;
			};
		};
		for (var i = 0; i < MAX_COUNT; i++) 
		{
			handMahJong.control[i].visible = false;
			handMahJong.control[i].cbCardData = 0;
			handMahJong.control[i].color = cc.color(255, 255, 255);
			handMahJong.control[i].spValue.color = cc.color(255, 255, 255);
		}
		handMahJong.cbCardData = [];
		handMahJong.cbCardData = cbCardData;
		handMahJong.cbCardCount = cbCardCount;
		if (bSend)
		{
			for (var i = 0; i < handMahJong.cbCardCount; i++) 
			{
				handMahJong.control[i].cbCardData = cbCardData[i];
				if (handMahJong.control[i].cbCardData == 0)
				{
					handMahJong.control[i].setSpriteFrame('down_user_0.png');
					handMahJong.control[i].spValue.visible = false;
					if (mainScene._wMeChaird != INVALID_CHAIR)
					{
					 	managerTouch.openTouch();
	                 	socket.closeWithPop(null, 1, 2, true);
	                	return true;
					}
				}
				else
				{
					handMahJong.control[i].setSpriteFrame('down_user_bg.png');
					handMahJong.control[i].spValue.setSpriteFrame('value_'+handMahJong.control[i].cbCardData+'.png');
					handMahJong.control[i].spValue.visible = true;
				}
				handMahJong.control[i].visible = true;
			}
		}
		else
		{
			for (var i = 1; i <= handMahJong.cbCardCount; i++) 
			{
				handMahJong.control[i].cbCardData = cbCardData[i-1];
				if (handMahJong.control[i].cbCardData == 0)
				{
					handMahJong.control[i].setSpriteFrame('down_user_0.png');
					handMahJong.control[i].spValue.visible = false;
					if (mainScene._wMeChaird != INVALID_CHAIR)
					{
					 	managerTouch.openTouch();
	                 	socket.closeWithPop(null, 1, 2, true);
	                	return true;
					}
				}
				else
				{
					handMahJong.control[i].setSpriteFrame('down_user_bg.png');
					handMahJong.control[i].spValue.setSpriteFrame('value_'+handMahJong.control[i].cbCardData+'.png');
					handMahJong.control[i].spValue.visible = true;
				}
				handMahJong.control[i].visible = true;
			}
		}
	},
	setOperateCard:function(cbCardData, cbPublicCard, cbCardCount)
	{
		if (mainScene._wMeChaird == INVALID_CHAIR)
		{
			handMahJong.cbCardCount = handMahJong.cbCardCount - cbCardCount;
			handMahJong.setCardData(handMahJong.cbCardData, handMahJong.cbCardCount, false);
			return;
		}
		var nIndex = cbPublicCard?1:0;
		for (var i = nIndex; i < 4; i++) {
			if(cbCardData[i] == 0) continue;
			for (var k = 0; k < MAX_COUNT; k++) {
				if (handMahJong.cbCardData[k] == cbCardData[i]) 
				{
					handMahJong.cbCardData[k] = 0;
					handMahJong.cbCardCount--;
					break;
				}
			}
		}
		//排序，保留最右边的牌
		handMahJong.handDataExcEx(" setOperateCard1: ", cbCardData, cbCardCount);
		mainScene.sortHandCard(handMahJong.cbCardData);
		handMahJong.handDataExcEx(" setOperateCard2: ", handMahJong.cbCardData, handMahJong.cbCardCount);
		handMahJong.setCardData(handMahJong.cbCardData, handMahJong.cbCardCount, false);
	},
	getCardIndex:function()
	{
		handMahJong.cbCardIndex = [];
		for (var i = 0; i < MAX_INDEX; i++) {
			handMahJong.cbCardIndex[i] = 0;
		};
		gameLogic.switchToCardIndexEx(handMahJong.cbCardData, handMahJong.cbCardCount, handMahJong.cbCardIndex);
		return handMahJong.cbCardIndex;
	},
	sendCardData:function(cbCardData)
	{
		var cbCardDataNew = [];
		cbCardDataNew[0] = cbCardData;
		for (var i = 0; i < handMahJong.cbCardCount; i++) {
			cbCardDataNew[i+1] = handMahJong.cbCardData[i];
		};
		handMahJong.handDataExcEx(" sendCardData: ", cbCardDataNew, handMahJong.cbCardCount+1);
		handMahJong.setCardData(cbCardDataNew, handMahJong.cbCardCount+1, true);
	},
	setCardEnable:function(bEnable)
	{
		for (var i = 0; i < MAX_COUNT; i++) {
			//handMahJong.control[i].color = bEnable?cc.color(255, 255, 255):cc.color(125, 125, 125);
			handMahJong.control[i].enable = bEnable;
			// for (var j = 0; j < handMahJong.control[i].childrenCount; j++) {
			// 	handMahJong.control[i].children[j].color = bEnable?cc.color(255, 255, 255):cc.color(125, 125, 125);
			// };
		};
		//百搭牌灰色不可点击
		for (var i = 0; i < MAX_COUNT; i++) {
			var cbCardIndex = gameLogic.switchToCardIndex(handMahJong.control[i].cbCardData);
			if(!gameLogic.isMagicCard(cbCardIndex, true)) continue;
			handMahJong.control[i].color = cc.color(0, 255, 0);
			//handMahJong.control[i].enable = false;
			for (var j = 0; j < handMahJong.control[i].childrenCount; j++) {
				handMahJong.control[i].children[j].color = cc.color(0, 255, 0);
			};
		};
	},
	setCardEnableEx:function(cbCardData)
	{
		//恶意吃牌后 禁止出牌吃牌关联牌
		for (var i = 0; i < MAX_COUNT; i++) {
			if (handMahJong.control[i].cbCardData == cbCardData[0] || handMahJong.control[i].cbCardData == cbCardData[1])
			{
				handMahJong.control[i].color = cc.color(125, 125, 125);
				handMahJong.control[i].spValue.color = cc.color(125, 125, 125);
				handMahJong.control[i].enable = false;
			}
		};
	},
	setOutCard:function(nIndex)
	{
		if(mainScene._wCurrentUser != mainScene._wMeChaird) return;
		//发送出牌消息
        var outCard = getObjWithStructName('CMD_C_OutCard');
		outCard.cbCardData = handMahJong.control[nIndex].cbCardData;
		socket.sendMessage(MDM_GF_GAME, SUB_C_OUT_CARD, outCard); 

		//修改本地手牌等数据
		mainScene._wCurrentUser = INVALID_CHAIR;
		operateBtn.hideOperate();
		for (var i = 0; i < handMahJong.cbCardCount; i++) {
			if (handMahJong.cbCardData[i] == handMahJong.control[nIndex].cbCardData)
			{
				handMahJong.cbCardData[i] = 0;
				handMahJong.cbCardCount--;
				break;
			}
		};
		handMahJong.handDataExcEx(" setOutCard1: ", handMahJong.cbCardData, handMahJong.cbCardCount);
		mainScene.sortHandCard(handMahJong.cbCardData);
		handMahJong.handDataExcEx(" setOutCard2: ", handMahJong.cbCardData, handMahJong.cbCardCount);
		handMahJong.setCardData(handMahJong.cbCardData, handMahJong.cbCardCount, false);
		handMahJong.setCardEnable(false);
		//handMahJong.handDataExcEx(' 出牌 ');
	},
	clearCardData:function()
	{
		handMahJong.node.removeAllChildren();
		handMahJong.cbCardData = [];
		handMahJong.cbCardCount = MAX_COUNT;
		handMahJong.control = [];
	},
	getHexCardData:function(cardData)
	{
		var dataStr = '';
		if (cardData > 0)
		{
			var color = (cardData&MASK_COLOR)>>4;
			var value = cardData&MASK_VALUE;
			dataStr += '0x' + color + value + ' ';
			return dataStr;
		}
		else if (cardData == 0)
		{
			return "0x00 ";
		}
		else
		{
			return "0xError "
		}
	},
	//日志
	handDataExcEx:function(str, cardData, cardCount)
	{
		var dataStr = '';
		for (var i = 0; i < cardCount; i++) {
			var color = (cardData[i]&MASK_COLOR)>>4;
			var value = cardData[i]&MASK_VALUE;
			dataStr += '0x' + color + value + ' ';
		};
		gameLog.log(str + ':' + ' cardCount: ' + cardCount + '  data: ' + dataStr);
	},
	//5张牌检测日志
	checkMoreMahJong:function()
	{
		var cbCardIndex = [];
		for(var i = 0; i < MAX_INDEX; i++)
		{
			cbCardIndex[i] = 0;
		}
		gameLogic.switchToCardIndexEx(handMahJong.cbCardData, handMahJong.cbCardCount,cbCardIndex);

		var strHand = "";
		for(var i = 0; i < MAX_INDEX; i++)
		{
			var cbCardData = gameLogic.switchToCardData(i);
			var color = (cbCardData)>>4;
			var value = cbCardData&MASK_VALUE;
			strHand += '0x' + color + value + ': ' + cbCardIndex[i] + '  ';
		}
		
		for(var i = 0; i < disCardControl.node.childrenCount; i++)
		{
			if(disCardControl.node.children[i].cbCardData && disCardControl.node.children[i].cbCardData > 0)
			{
				var nIndex = gameLogic.switchToCardIndex(disCardControl.node.children[i].cbCardData);
				cbCardIndex[nIndex]++;
			}
		}
		var strDis = "";
		for(var i = 0; i < MAX_INDEX; i++)
		{
			var cbCardData = gameLogic.switchToCardData(i);
			var color = (cbCardData)>>4;
			var value = cbCardData&MASK_VALUE;
			strDis += '0x' + color + value + ': ' + cbCardIndex[i] + '  ';
		}

		for(var i = 0; i < weaveControl.node.childrenCount; i++)
		{
			if(weaveControl.node.children[i].cbCardData && weaveControl.node.children[i].cbCardData > 0)
			{
				var nIndex = gameLogic.switchToCardIndex(weaveControl.node.children[i].cbCardData);
				cbCardIndex[nIndex]++;
			}
		}
		var strWeave = "";
		for(var i = 0; i < MAX_INDEX; i++)
		{
			var cbCardData = gameLogic.switchToCardData(i);
			var color = (cbCardData)>>4;
			var value = cbCardData&MASK_VALUE;
			strWeave += '0x' + color + value + ': ' + cbCardIndex[i] + '  ';
		}

		for(var i = 0; i < MAX_INDEX; i++)
		{
			if(cbCardIndex[i] > 4)
			{
				gameLog.log(' 手牌: ' + strHand);
				gameLog.log(' 出牌: ' + strDis);
				gameLog.log(' 进牌: ' + strWeave);
				var dataStr = '';
				var cbCardData = gameLogic.switchToCardData(i);
				var color = (cbCardData)>>4;
				var value = cbCardData&MASK_VALUE;
				dataStr += '0x' + color + value + ' ';
				gameLog.log(' 多牌: ' + dataStr);
				//sendLogToServer(gameLog.logS + 'wtms331 wtms');
			}
		}
	}
}; 
var otherMahJong = {
	init:function(uiPlay)
	{
		otherMahJong.node = new cc.Node();
		uiPlay.addChild(otherMahJong.node,1);

		otherMahJong.cbCardData = [];
		otherMahJong.wSendChaird = INVALID_CHAIR;
	},
	setControlPos:function(wChaird)
	{
		var headX = tableNode["chairNode2"].x;
		var headY = tableNode["chairNode2"].y;
		switch(wChaird)
		{	case 1:
			fx = headX + 95;;
			fy = headY;
			for (var i = 0; i < MAX_COUNT; i++) {
				if(i == 0)
					otherMahJong.control[wChaird][i].setPosition(fx - 25, fy);
				else
					otherMahJong.control[wChaird][i].setPosition(fx + i * 37, fy);
			}
			break;
		}
	},
	setCardData:function(bAddChild)
	{
		var res = [
		"",
		"#up_user_bg.png",
		];
		otherMahJong.control = [];
		otherMahJong.cbCardCount = [];
		for (var i = 1; i < GAME_PLAYER; i++) {
			otherMahJong.control[i] = [];
			otherMahJong.cbCardCount[i] = MAX_COUNT;
			for (var k = 0; k < MAX_COUNT; k++) {
				otherMahJong.control[i][k] = new cc.Sprite(res[i]);
				otherMahJong.control[i][0].visible = false;
				if (bAddChild && !isRecordScene)
				{
					if (i == 3) 
						otherMahJong.node.addChild(otherMahJong.control[i][k], MAX_COUNT - k);
					else
						otherMahJong.node.addChild(otherMahJong.control[i][k]);
				}
			}
			otherMahJong.setControlPos(i);
		}
	},
	setRecordData:function(wChaird, cbCardData)
	{
		if (isRecordScene) 
		{
			otherMahJong.wSendChaird = wChaird;
			otherMahJong.node.removeAllChildren();
			otherMahJong.cbCardData = cbCardData;
			for (var i = 1; i < GAME_PLAYER; i++) 
			{
				var headX = tableNode["chairNode2"].x;
				var headY = tableNode["chairNode2"].y;
				var nCount = 0;
				for (var k = 0; k < otherMahJong.cbCardData[i].length; k++) {
					if(otherMahJong.cbCardData[i][k] == 0) continue;
					var mahJong = weaveControl.create(i, otherMahJong.cbCardData[i][k]);
					otherMahJong.node.addChild(mahJong);
					switch(i)
					{
						case 1:
						fx = headX + 95 - 25;;
						fy = headY;
						if (wChaird == 1 && k == 0) 
						{
							mahJong.setPosition(fx - 35 - 20, fy);
						}
						else
						{
							mahJong.setPosition(fx + nCount * 35, fy);
							nCount++;
						}
						break;
					}
				};
			};
		}
	},
	setHuaCard:function(wChaird, cbHuaCard, cbReplaceCard)
	{
		if (isRecordScene) 
		{
			for(var i = 0; i < MAX_HUA_CARD; i++)
			{
				if(cbHuaCard[i] == 0) break;
				for(var k = 0; k < otherMahJong.cbCardData[wChaird].length; k++)
				{
					if(otherMahJong.cbCardData[wChaird][k] == cbHuaCard[i])
					{
						otherMahJong.cbCardData[wChaird][k] = cbReplaceCard[i];
						break;
					}
				}
			}
			otherMahJong.setRecordData(otherMahJong.wSendChaird, otherMahJong.cbCardData);
			return;
		}
	},
	sendCardData:function(wChaird, visible, cbSendCard)
	{
		if (isRecordScene && visible && cbSendCard > 0) 
		{
			otherMahJong.cbCardData[wChaird].sort(function(a,b){return b-a;});
			otherMahJong.cbCardData[wChaird].unshift(cbSendCard);
			otherMahJong.setRecordData(wChaird, otherMahJong.cbCardData);
			return;
		}
		otherMahJong.control[wChaird][0].visible = visible;
	},
	removeCard:function(wChaird, cbRemoveCount, cbRemoveData)
	{
		if (isRecordScene) 
		{
			for(var i = 0; i < cbRemoveCount; i++)
			{
				otherMahJong.cbCardData[wChaird].sort(function(a,b){return b-a;});		
				for(var k = 0; k < otherMahJong.cbCardData[wChaird].length; k++)
				{
					if(otherMahJong.cbCardData[wChaird][k] == 0) break;
					if(otherMahJong.cbCardData[wChaird][k] == cbRemoveData[i])
					{
						otherMahJong.cbCardData[wChaird][k] = 0;
						break;
					}
				}
			}
			otherMahJong.cbCardData[wChaird].sort(function(a,b){return b-a;});
			otherMahJong.setRecordData(INVALID_CHAIR, otherMahJong.cbCardData);
			return;
		}
		var nCount = otherMahJong.cbCardCount[wChaird] - cbRemoveCount;
		for (var i = otherMahJong.cbCardCount[wChaird]-1; i >= nCount; i--) {
			otherMahJong.control[wChaird][i].visible = false;
		}
		otherMahJong.cbCardCount[wChaird] = nCount;
	},
	clearCardData:function()
	{
		otherMahJong.node.removeAllChildren();
		otherMahJong.wSendChaird = INVALID_CHAIR;
	}
};
//打出去的牌元素
var disCardItem = 
{
	create:function(wChaird, cbCardData)
	{
		var res = 
		[
		"#up_table_bg.png",
		"#up_table_bg.png",
		];
		var angle = [0, -180];
		var pos = 
		[
			cc.p(17, 35),
			cc.p(19, 33),
		];
		var item = new cc.Sprite(res[wChaird]);
		item.spValue = new cc.Sprite("#"+'value_'+cbCardData+'.png');
		item.cbCardData = cbCardData;
		item.addChild(item.spValue);
		item.spValue.scale = 0.6;
		item.spValue.setRotation(angle[wChaird]);
		item.spValue.setPosition(pos[wChaird]);
		return item;
	},
};
//打出去的牌 管理器
var disCardControl = 
{
	init:function(uiPlay)
	{
		disCardControl.control = [];
		disCardControl.cbCardCount = [];
		disCardControl.node = new cc.Node();
		uiPlay.addChild(disCardControl.node);
		for (var i = 0; i < GAME_PLAYER; i++)
		{
			disCardControl.control[i] = [];
			disCardControl.cbCardCount[i] = 0;
		}
		disCardControl.outPointer = actionFactory.getSprWithAnimate('outpointer', false, 0.3);
		disCardControl.outPointer.visible = false;
		uiPlay.addChild(disCardControl.outPointer, MAX_DISCARD);
	},
	setControlPos:function(wChaird)
	{
		var headX = tableData.getChairWithShowChairId(wChaird).node.x;
		var headY = tableData.getChairWithShowChairId(wChaird).node.y;
		var i = disCardControl.cbCardCount[wChaird];
		switch(wChaird)
		{
			case 0:
			fx = handMahJong.control[11].x+10;
			fy = handMahJong.control[0].y + handMahJong.control[0].height/2 + 10 + disCardControl.control[wChaird][i].height/2+40;
			fy += (Math.floor(i/DISCARD_ROW_COUNT))*40;
			disCardControl.control[wChaird][i].setPosition(fx+i%DISCARD_ROW_COUNT*35, fy);
			break;
			case 1:
				headX = tableNode["chairNode2"].x;
				headY = tableNode["chairNode2"].y;
				fx = headX + 580;
				fy = headY - 70;
				fy -= (Math.floor(i/DISCARD_ROW_COUNT))*42;
				disCardControl.control[wChaird][i].setPosition(fx-i%DISCARD_ROW_COUNT*34, fy);
				disCardControl.control[wChaird][i].zIndex = DISCARD_ROW_COUNT - i%DISCARD_ROW_COUNT;
			break;
		}
	},
	addCardItem:function(wChaird, cbCardData)
	{
		disCardControl.control[wChaird][disCardControl.cbCardCount[wChaird]] = disCardItem.create(wChaird, cbCardData);
		disCardControl.node.addChild(disCardControl.control[wChaird][disCardControl.cbCardCount[wChaird]], MAX_DISCARD-disCardControl.cbCardCount[wChaird]);
		disCardControl.setControlPos(wChaird);
		//显示打出去的牌上的箭头
		disCardControl.outPointer.visible = true;
		disCardControl.outPointer.x = disCardControl.control[wChaird][disCardControl.cbCardCount[wChaird]].x;

	 	if (gameLogic.isMagicCard(cbCardData,false))
		{
			disCardControl.control[wChaird][disCardControl.cbCardCount[wChaird]].color = cc.color(0, 255, 0);
			disCardControl.control[wChaird][disCardControl.cbCardCount[wChaird]].spValue.color = cc.color(0, 255, 0);
		}
		switch(wChaird)
		{
			case 0:
				disCardControl.outPointer.y = disCardControl.control[wChaird][disCardControl.cbCardCount[wChaird]].y+35;
			break;
			case 1:
				disCardControl.outPointer.y = disCardControl.control[wChaird][disCardControl.cbCardCount[wChaird]].y+35;
			break;
		}
		disCardControl.cbCardCount[wChaird]++;
	},
	//断线重连回来后隐藏弃牌上的箭头
	hideOutPointer:function()
	{
		disCardControl.outPointer.visible = false;
	},
	//游戏结束清空弃牌管理器
	clearCardData:function()
	{
		disCardControl.node.removeAllChildren();
		for (var i = 0; i < GAME_PLAYER; i++) {
			disCardControl.control[i] = [];
			disCardControl.cbCardCount[i] = 0;
		};
		disCardControl.outPointer.visible = false;
	},

};
//吃碰杠的组合麻将
var weaveControl = 
{
	create:function(wChaird, cbCardData)
	{
		var item = null;
		if (cbCardData == 0)
		{
			var res = 
			[
				"#down_weave_0.png",
				"#up_table_0.png",
			];
			item = new cc.Sprite(res[wChaird]);
			item.cbCardData = cbCardData;
		}
		else
		{
			var res = 
			[
				"#down_weave_bg.png",
				"#up_table_bg.png",
			];
			var angle = [0, -180];
			var pos = 
			[
				cc.p(26, 55),
				cc.p(19, 34),
			];
			var scale = [0.9, 0.6];
			item = new cc.Sprite(res[wChaird]);
			item.cbCardData = cbCardData;
			item.spValue = new cc.Sprite("#"+'value_'+cbCardData+'.png');
			item.addChild(item.spValue);
			item.spValue.scale = scale[wChaird];
			item.spValue.setRotation(angle[wChaird]);
			item.spValue.setPosition(pos[wChaird]);
		}
		return item;
	},
	init:function(uiPlay)
	{
		//麻将适配
		var mahJong = new cc.Sprite("#down_weave_bg.png");
		var gameWidth = topUI.node.width;
		weaveControl.mahJongScale = (gameWidth-handMahJong.mjWidth*13-35)/3/mahJong.width;
		weaveControl.mjWidth = Math.floor(mahJong.width*weaveControl.mahJongScale);
		weaveControl.mjHeight = Math.floor(mahJong.height*weaveControl.mahJongScale);

		//左右麻将适配
		var target = new cc.Sprite("#right_user_bg.png");
		var targetH = (target.height*3-2*38-10)/3;
		var source = new cc.Sprite("#lr_table_0.png");
		weaveControl.scaleLR = targetH/source.height;

		weaveControl.node = new cc.Node();
		uiPlay.addChild(weaveControl.node);
		weaveControl.cbWeaveCount = [];
		weaveControl.cbWeaveArray = [];
		weaveControl.control = [];
		weaveControl.arrow = [];
		for (var i = 0; i < GAME_PLAYER; i++) {
		 	weaveControl.control[i] = [];
		 	weaveControl.arrow[i] = [];
		 	weaveControl.cbWeaveArray[i] = [];
		 	weaveControl.cbWeaveCount[i] = 0;
		}
	},
	setControlPos:function(wChaird, nCount, cbWeaveIndex)
	{
		var headX = tableData.getChairWithShowChairId(wChaird).node.x;
		var headY = tableData.getChairWithShowChairId(wChaird).node.y;
		var j = cbWeaveIndex;
		switch(wChaird)
		{
			case 0:
				fx = 5+weaveControl.mjWidth/2;
				fy = 5+weaveControl.mjHeight/2;
				fx += (weaveControl.mjWidth*3+10)*j;
				for (var k = 0; k < nCount; k++) {
					if (k == 3)
						weaveControl.control[wChaird][j][k].setPosition(fx + weaveControl.mjWidth-2, fy+18);
					else
						weaveControl.control[wChaird][j][k].setPosition(fx + k*weaveControl.mjWidth-k*2, fy);
				}
			break;
			case 1:
				headX = tableNode["chairNode2"].x;
				headY = tableNode["chairNode2"].y;
				fx = headX + 580;
				fy = headY - 7;
				fx -= 113*j;
				for (var k = 0; k < nCount; k++) {
					if (k == 3)
						weaveControl.control[wChaird][j][k].setPosition(fx - 36, fy+15);
					else
						weaveControl.control[wChaird][j][k].setPosition(fx - k*36, fy);
				}
			break;
		}
	},
	addWeaveItem:function(wChaird, cbWeaveIndex, cbCardData, cbCardCount, visible)
	{
 		var nPlusCount = 1;
 		if (cbWeaveIndex < weaveControl.cbWeaveCount[wChaird])
 		{
 			weaveControl.node.removeChild(weaveControl.control[wChaird][cbWeaveIndex][0]);
 			weaveControl.node.removeChild(weaveControl.control[wChaird][cbWeaveIndex][1]);
 			weaveControl.node.removeChild(weaveControl.control[wChaird][cbWeaveIndex][2]);
 			weaveControl.node.removeChild(weaveControl.arrow[wChaird][cbWeaveIndex]);
 			nPlusCount = 0;
 		}
 		if (visible)
 		{
 			 if(wChaird == 0)
	 			weaveControl.arrow[wChaird][cbWeaveIndex] = new cc.Sprite("#weaveDctB.png");
			else
	 			weaveControl.arrow[wChaird][cbWeaveIndex] = new cc.Sprite("#weaveDctS.png");
	 		weaveControl.node.addChild(weaveControl.arrow[wChaird][cbWeaveIndex]);
 		}
 		weaveControl.control[wChaird][cbWeaveIndex] = [];
 		for (var k = 0; k < cbCardCount; k++) {
 			weaveControl.control[wChaird][cbWeaveIndex][k] = weaveControl.create(wChaird, cbCardData[k]);
 			if (gameLogic.isMagicCard(cbCardData[k],false))
			{
				weaveControl.control[wChaird][cbWeaveIndex][k].color = cc.color(0, 255, 0);
				weaveControl.control[wChaird][cbWeaveIndex][k].spValue.color = cc.color(0, 255, 0);
			}
 			weaveControl.node.addChild(weaveControl.control[wChaird][cbWeaveIndex][k]);
 			if (wChaird == 0)
 			{
 				weaveControl.control[wChaird][cbWeaveIndex][k].scale = weaveControl.mahJongScale;
 			}
 		}
	 	weaveControl.setControlPos(wChaird, cbCardCount, cbWeaveIndex);
	 	weaveControl.cbWeaveCount[wChaird] += nPlusCount;
	},
	setCardData:function(wChaird, cbWeaveIndex)
	{
		//组合子项
		// var tagWeaveItem =
		// {
		// 	cbWeaveKind:null,						//组合类型
		// 	cbCenterCard:null,						//中心扑克
		// 	cbPublicCard:null,						//明杠 暗杠
		// 	wProvideUser:null,				        //供应用户
		// 	cbCardData:[]      
		// };
		var cbWeaveKind = weaveControl.cbWeaveArray[wChaird][cbWeaveIndex].cbWeaveKind;
		var cbCenterCard = weaveControl.cbWeaveArray[wChaird][cbWeaveIndex].cbCenterCard;
		var cbPublicCard = weaveControl.cbWeaveArray[wChaird][cbWeaveIndex].cbPublicCard;
		var wProvideUser = weaveControl.cbWeaveArray[wChaird][cbWeaveIndex].wProvideUser;
		var cbCardData = weaveControl.cbWeaveArray[wChaird][cbWeaveIndex].cbCardData;
		if (cbWeaveKind & WIK_GANG || cbWeaveKind & WIK_S_GANG || cbWeaveKind & WIK_D_GANG || cbWeaveKind & WIK_T_GANG)
		{
			if (cbPublicCard) 
			{
				//明杠
				var bShowArrow = (gameLogic.switchViewChairID(wProvideUser) != wChaird)?true:false;
				var cbGang = [];
				cbGang[0] = cbCardData[1];
				cbGang[1] = cbCardData[2];
				cbGang[2] = cbCardData[3];
				cbGang[3] = cbCardData[0];
				weaveControl.addWeaveItem(wChaird, cbWeaveIndex, cbGang, 4, bShowArrow);
				if (bShowArrow)
				{
					//显示吃碰杠箭头
					weaveControl.arrow[wChaird][cbWeaveIndex].x = weaveControl.control[wChaird][cbWeaveIndex][3].x;
					weaveControl.arrow[wChaird][cbWeaveIndex].y = weaveControl.control[wChaird][cbWeaveIndex][3].y+5;
					weaveControl.arrow[wChaird][cbWeaveIndex].zIndex = weaveControl.control[wChaird][cbWeaveIndex][3].zIndex+1;
					var angle = [180, 0];
					weaveControl.arrow[wChaird][cbWeaveIndex].setRotation(angle[gameLogic.switchViewChairID(wProvideUser)]);
				}
			}
			else
			{
				//暗杠
				if (wChaird == 0) 
				{
					var cbGang = [];
					cbGang[0] = 0;
					cbGang[1] = 0;
					cbGang[2] = 0;
					cbGang[3] = cbCardData[0];
					weaveControl.addWeaveItem(wChaird, cbWeaveIndex, cbGang, 4, false);
				}
				else
				{
					var cbGang = [];
					cbGang[0] = 0;
					cbGang[1] = 0;
					cbGang[2] = 0;
					cbGang[3] = 0;
					weaveControl.addWeaveItem(wChaird, cbWeaveIndex, cbGang, 4, false);
				}

			}
		}
		else
		{
			var nIndex = 1;
			if (cbWeaveKind & WIK_LEFT || cbWeaveKind & WIK_CENTER || cbWeaveKind & WIK_RIGHT)
			{
				cbCardData.sort(function(a, b){return a-b;});
				if (cbCardData[0] == 0)
				{
					cbCardData[0] = cbCardData[1];
					cbCardData[1] = cbCardData[2];
					cbCardData[2] = cbCardData[3];
					cbCardData[3] = 0;
				}
				weaveControl.addWeaveItem(wChaird, cbWeaveIndex, cbCardData, 3, true);
			}
			else if (cbWeaveKind & WIK_S_CHI)
			{
				var cbCardData1 = [];
				if (cbCardData[1] - cbCardData[0] == 1)
				{
					cbCardData1[0] = cbCardData[2];
					cbCardData1[1] = cbCardData[0];
					cbCardData1[2] = cbCardData[1];
				}
				else if (cbCardData[1] - cbCardData[0] == 2)
				{
					cbCardData1[0] = cbCardData[0];
					cbCardData1[1] = cbCardData[2];
					cbCardData1[2] = cbCardData[1];
				}
				else if (cbCardData[0] - cbCardData[1] == 1)
				{
					cbCardData1[0] = cbCardData[2];
					cbCardData1[1] = cbCardData[1];
					cbCardData1[2] = cbCardData[0];
				}
				else if (cbCardData[0] - cbCardData[1] == 2)
				{
					cbCardData1[0] = cbCardData[1];
					cbCardData1[1] = cbCardData[2];
					cbCardData1[2] = cbCardData[0];
				}
				weaveControl.addWeaveItem(wChaird, cbWeaveIndex, cbCardData1, 3, true);
			}
			else
				weaveControl.addWeaveItem(wChaird, cbWeaveIndex, cbCardData, 3, true);

			//将吃的那张牌变灰
			if ((cbWeaveKind&WIK_LEFT)!=0 || (cbWeaveKind&WIK_CENTER)!=0 || (cbWeaveKind&WIK_RIGHT)!=0)
			{
				for (var i = 0; i < 3; i++) {
					if (cbCardData[i] == cbCenterCard) 
					{	
						nIndex = i;
						weaveControl.control[wChaird][cbWeaveIndex][i].color = cc.color(125, 125, 125);
						weaveControl.control[wChaird][cbWeaveIndex][i].spValue.color = cc.color(125, 125, 125);
						break;
					}
				}
			}
			//显示吃碰杠箭头
			weaveControl.arrow[wChaird][cbWeaveIndex].x = weaveControl.control[wChaird][cbWeaveIndex][nIndex].x;
			weaveControl.arrow[wChaird][cbWeaveIndex].y = weaveControl.control[wChaird][cbWeaveIndex][nIndex].y+5;
			weaveControl.arrow[wChaird][cbWeaveIndex].zIndex = weaveControl.control[wChaird][cbWeaveIndex][nIndex].zIndex+1;
			var angle = [180, 0];
			weaveControl.arrow[wChaird][cbWeaveIndex].setRotation(angle[gameLogic.switchViewChairID(wProvideUser)]);
		}
	},
	clearCardData:function()
	{
		weaveControl.node.removeAllChildren();

		for (var i = 0; i < GAME_PLAYER; i++) {
		 	weaveControl.control[i] = [];
		 	weaveControl.arrow[i] = [];
		 	weaveControl.cbWeaveArray[i] = [];
		 	weaveControl.cbWeaveCount[i] = 0;
			for (var j = 0; j < MAX_WEAVE; j++) {
				weaveControl.cbWeaveArray[i][j] = {};
				weaveControl.cbWeaveArray[i][j].cbCardData = [];
			};
		};
	},
};
var tableMahJong = 
{
	init:function()
	{
		tableMahJong.bMengPai = false;
		tableMahJong.node = new cc.Node();
		mainScene.uiPlay.addChild(tableMahJong.node, ZORDER_MAX);
	},
	setCardData:function(cbCardData, cbCardCount)
	{
		if (tableMahJong.bMengPai) 
		{
			tableMahJong.clearCardData();
		};

		for (var i = 0; i < GAME_PLAYER; i++) {
			mainScene.sortHandCard(cbCardData[i]);
			var wChaird = gameLogic.switchViewChairID(i);
			//var wChaird = i;
			var	headX = tableNode["chairNode2"].x;
			var	headY = tableNode["chairNode2"].y;
			for (var k = 0; k < cbCardCount[i]; k++) {
				var mahJong = weaveControl.create(wChaird, cbCardData[i][k]);
				tableMahJong.node.addChild(mahJong);
				switch(wChaird)
				{
					case 0:
					mahJong.setPosition(handMahJong.control[0].x - k * 54, handMahJong.control[0].y);
					break;
					case 1:
					fx = headX + 95 - 25;;
					fy = headY;
					mahJong.setPosition(fx + k * 35, fy);
					break;
				}
			};
		};
	},
	clearCardData:function()
	{
		tableMahJong.node.removeAllChildren();
	},
};
var outMahJong = 
{
	init:function(uiPlay)
	{
		outMahJong.outCardBg = new cc.Sprite("#outcardBg.png");
		outMahJong.outCardBg.visible = false;
		outMahJong.outCard = weaveControl.create(0, 1)
		outMahJong.outCard.visible = false;
		uiPlay.addChild(outMahJong.outCardBg, ZORDER_MAX);
		uiPlay.addChild(outMahJong.outCard, ZORDER_MAX);
	},
	showOutCard:function(wChaird, cbOutCard)
	{
		var pos = 
		[
		cc.p(mainScene.ctPosX - 10, mainScene.ctPosY - 140),
		cc.p(mainScene.ctPosX - 10, mainScene.ctPosY + 150),
		];
		outMahJong.outCard.spValue.setSpriteFrame('value_'+cbOutCard+'.png');
		outMahJong.outCardBg.setPosition(pos[wChaird]);
		outMahJong.outCard.setPosition(pos[wChaird]);
		outMahJong.outCardBg.visible = true;
		outMahJong.outCard.visible = true;
		disCardControl.outPointer.visible = false;
	},
	hideOutCard:function()
	{
		outMahJong.outCardBg.visible = false;
		outMahJong.outCard.visible = false;
	},
};
var gameGM = 
{
	create:function()
	{
		gameGM.cbCardCount = 0;
		gameGM.cbCardData = [];
		gameGM.node = new cc.Node();
		gameGM.node.x = mainScene.ctPosX;
		gameGM.node.y = mainScene.ctPosY;
		mainScene.uiPlay.addChild(gameGM.node, 300);
		var gameGMBg = new cc.Sprite( "#gameEndBg.png");
		gameGM.node.addChild(gameGMBg);
		gameGM.btn = [];
		var cbCardIndex = 
		[
			1,2,3,4,5,6,7,8,9,
			17,18,19,20,21,22,23,24,25,
			33,34,35,36,37,38,39,40,41,
			49,50,51,52,53,54,55,
			65,66,67,68,69,70,71,72
		];
		var posX =  -240;
		var posY =  200;
		var nIndex = 0;
		for (var i = 0; i < MAX_INDEX; i++) {
			if(i < 9)
			{
				nIndex = 0;
			}
			else if(i < 18)
			{
				nIndex = 9;
				posY = 120;
			}
			else if(i < 27)
			{
				nIndex = 18;
				posY = 40;
			}
			else if(i < 34)
			{
				nIndex = 27;
				posY = -40;
			}
			else
			{
				nIndex = 34;
				posY = -120;
			}
			gameGM.btn[i] = weaveControl.create(0, cbCardIndex[i]);
	        gameGM.node.addChild(gameGM.btn[i]);
	        gameGM.btn[i].x = posX+62*(i-nIndex);
	        gameGM.btn[i].y = posY;
	        gameGM.btn[i].scale = 0.8;
	        gameGM.btn[i].listener = gameGM.getListener();
	    	cc.eventManager.addListener(gameGM.btn[i].listener, gameGM.btn[i]);
		}

		gameGM.control = [];
		for (var i = 0; i < MAX_COUNT; i++) {
			gameGM.control[i] = new cc.Sprite("#down_weave_bg.png");
			gameGM.control[i].spValue = new cc.Sprite("#"+'value_'+1+'.png');
			gameGM.control[i].addChild(gameGM.control[i].spValue);
			gameGM.control[i].spValue.scale = 0.9;
			gameGM.control[i].spValue.visible = false;
			gameGM.control[i].spValue.setPosition(cc.p(28, 55));

	        gameGM.node.addChild(gameGM.control[i]);
	        gameGM.control[i].x = -350 + i*55;
	        gameGM.control[i].y = -200;
	        gameGM.control[i].scale = 0.9;
	        gameGM.cbCardData[i] = 0;
	        gameGM.control[i].listener = gameGM.getListener();
	    	cc.eventManager.addListener(gameGM.control[i].listener, gameGM.control[i]);
		};
		gameGM.btnCancel = new ccui.Button("gameRes/pic/btnCancel.png");
		gameGM.btnCancel.addTouchEventListener(this.onTouchCancel, this);
        gameGM.node.addChild(gameGM.btnCancel);
        gameGM.btnCancel.x = -340;
        gameGM.btnCancel.y = 40;
        gameGM.btnCancel.scale = 0.8;

		gameGM.btnOk = new ccui.Button("gameRes/pic/btnOk.png");
		gameGM.btnOk.addTouchEventListener(this.onTouchOK, this);
        gameGM.node.addChild(gameGM.btnOk);
        gameGM.btnOk.x = 350;
        gameGM.btnOk.y = 40;
        gameGM.btnOk.scale = 0.8;
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
            	gameGM.onTouchEventEx(item);
            }
        })
        return listener;
    },
	onTouchEventEx: function (render) 
	{
		var cbCardIndex = 
		[
			1,2,3,4,5,6,7,8,9,
			17,18,19,20,21,22,23,24,25,
			33,34,35,36,37,38,39,40,41,
			49,50,51,52,53,54,55,
			65,66,67,68,69,70,71,72
		]; 
		for (var i = 0; i < MAX_INDEX; i++) {
			if (render == gameGM.btn[i] && gameGM.cbCardCount < handMahJong.cbCardCount) 
			{
				gameGM.cbCardData[gameGM.cbCardCount++] = cbCardIndex[i];
				break;
			}
		}
		for (var i = MAX_COUNT-1; i > MAX_COUNT-1-handMahJong.cbCardCount; i--) {
			if (render == gameGM.control[i]) 
			{
				gameGM.cbCardData[MAX_COUNT-1-i] = 0;
				gameGM.cbCardCount--;
				break;
			}
		};
		gameGM.cbCardData.sort(function(a, b){return b-a;});
		for (var i = 0; i < MAX_COUNT; i++) {
			if (gameGM.cbCardData[i] != 0)
			{
				gameGM.control[MAX_COUNT-1-i].spValue.setSpriteFrame('value_'+gameGM.cbCardData[i]+'.png');
				gameGM.control[MAX_COUNT-1-i].spValue.visible = true;
			}
			else
			{
				gameGM.control[MAX_COUNT-1-i].spValue.visible = false;
			}
		};
	},
	onTouchCancel: function (render, type) 
	{
		gameGM.node.removeFromParent();
	},
	onTouchOK: function (render, type) 
	{
		if(type != ccui.Widget.TOUCH_ENDED) return;
		if(gameGM.cbCardCount != handMahJong.cbCardCount) return;
		gameGM.node.removeFromParent();
		var gm = getObjWithStructName('CMD_C_GAME_GM');
		gm.cbCardData = [];
		gm.cbCardData = gameGM.cbCardData;
		socket.sendMessage(MDM_GF_GAME, SUB_C_GAME_GM, gm); 
	},
};