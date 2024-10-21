var sMahJongScale = 0.6;
var MAX_COL = 14;
//生成单个麻将
var mahJong = {
	create:function(cbCardData)
	{
		var mahJong = new cc.Sprite("#handBg.png");
		mahJong.row = 0;
		mahJong.col = 0;
		mahJong.cbCardData = cbCardData;

		mahJong.spValue = new cc.Sprite(('#hand'+cbCardData+'.png'));
		mahJong.addChild(mahJong.spValue);
		mahJong.spValue.x = 35;
		mahJong.spValue.y = 50;
		return mahJong;
	},
};
//本地玩家手牌管理器
var handMahJong = 
{
	init:function(uiPlay)
	{
		handMahJong.node = new cc.Node();
		uiPlay.addChild(handMahJong.node);
		var listener = handMahJong.getListener(handMahJong.node);
    	cc.eventManager.addListener(listener, handMahJong.node);
		var mj = mahJong.create(1);
		var leftX = mainScene.ctPosX - Math.floor((MAX_COL-1)/2)*mj.width; 
		var leftY = mj.height/2-5;
		handMahJong.pos = [];
		handMahJong.bMoving = false;
		for (var i = 0; i <MAX_COL; i++)
		{
			handMahJong.pos[i] = [];
			for(var k = 0; k < 3; k++)
			{
				handMahJong.pos[i][k] = {};
				handMahJong.pos[i][k].x = leftX+i*mj.width;
				handMahJong.pos[i][k].y = leftY+k*mj.height - k*20;
			}
		};
	},
	getListener:function(target)
    {   
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
           onTouchBegan: function (touch, event) {
           		if(mainScene._wMeChaird == INVALID_CHAIR) return false;
           		if(handMahJong.bMoving) return false;
           		for(var i = 0; i < handMahJong.node.childrenCount; i++)
           		{
           			var child = handMahJong.node.children[i];
            		var locationInNode = child.convertToNodeSpace(touch.getLocation());
	                var s = child.getContentSize();
	                var rect = cc.rect(0, 0, s.width, s.height);
	                if (cc.rectContainsPoint(rect, locationInNode)) {
	                	child.zIndex = 4;
	                	handMahJong.moveMj = child;
	                	handMahJong.bMoving = true;
	                    return true;
	                }
           		}
                return false;
            },
            onTouchMoved:function(touch, event)
            {
            	var delta = touch.getDelta();
	            var deltaX = delta.y;
	            var deltaY = delta.x;
	            if(!cc.sys.isMobile)
	            {
	            	deltaX = delta.x;
	            	deltaY = delta.y;
	            }
       			if (handMahJong.moveMj)
       			{
       				handMahJong.moveMj.x += deltaX;
       				if(cc.sys.isMobile)
                		handMahJong.moveMj.y -= deltaY; 
                	else
                		handMahJong.moveMj.y += deltaY; 
       			}
            },
            onTouchEnded: function (touch, event) {
            	if (handMahJong.moveMj)
       			{
       				if(handMahJong.moveMj.y > mainScene.ctPosY && mainScene._wMeChaird == mainScene._wCurrentUser)
					{
						if(!handMahJong.isEnableOut(handMahJong.moveMj.cbCardData))
						{
							//某些牌不能出
							var move = cc.moveTo(0.03, handMahJong.pos[handMahJong.moveMj.col][handMahJong.moveMj.row]);
							handMahJong.moveMj.zIndex = 3-handMahJong.moveMj.row;
		   					handMahJong.moveMj.runAction(move);
		   					handMahJong.bMoving = false;
							return true;
						}
						mainScene._wCurrentUser = INVALID_CHAIR;
						//发送出牌消息
				        var outCard = getObjWithStructName('CMD_C_OutCard');
						outCard.cbCardData = handMahJong.moveMj.cbCardData;
						socket.sendMessage(MDM_GF_GAME, SUB_C_OUT_CARD, outCard); 
						handMahJong.moveMj.removeFromParent();
						handMahJong.onActionDown();
						handMahJong.onActionLR();
						handMahJong.bMoving = false;
						//出牌
						return true;
					}
			       	for (var i = 0; i <MAX_COL; i++)
					{
						for(var k = 0; k < 3; k++)
						{
			                var rect = cc.rect(handMahJong.pos[i][k].x-handMahJong.moveMj.width/2, handMahJong.pos[i][k].y-handMahJong.moveMj.height/2, 
			                	handMahJong.moveMj.width, handMahJong.moveMj.height);
			                if (cc.rectContainsPoint(rect, handMahJong.moveMj.getPosition())) 
			                {
			                	var duMJ = handMahJong.node.getChildByName(i+'+'+2);
			                	if (duMJ == null)
			                	{
			                		//三种移动现象 
			                		//1:移动的麻将是本列最上边的麻将 下边还有麻将 或者 移动的麻将是本列唯一的麻将 但是是麻将牌堆的最左边那列或者最右边那列   整个动作只有这一个麻将移动到目标点
			                		//2:移动的麻将那列上边还有麻将 动作分两个 移动的麻将移动到目标点 移动的麻将原来那列上边的麻将下落
			                		//3:移动的麻将是本列唯一的麻将 并且本列左右两边都有麻将列  列数少的那堆麻将平移一格到麻将列数多的那堆
									handMahJong.moveMj.row = null;
									handMahJong.moveMj.col = null;
									handMahJong.moveMj._name = "";
			                		var desRow = handMahJong.getDestRow(i);
			                		var desCol = handMahJong.getDestCol(i);
			                		var move = cc.moveTo(0.03, handMahJong.pos[desCol][desRow]);
									handMahJong.moveMj._name = desCol+'+'+desRow;
									handMahJong.moveMj.row = desRow;
									handMahJong.moveMj.col = desCol;
				   					handMahJong.moveMj.zIndex = 3-desRow;
				   					handMahJong.moveMj.runAction(move);
				   					handMahJong.onActionDown();
			                		handMahJong.onActionLR();
			                		handMahJong.bMoving = false;
			                		return true;
			                	}
			                }
						}
					}
					var move = cc.moveTo(0.05, handMahJong.pos[handMahJong.moveMj.col][handMahJong.moveMj.row]);
   					handMahJong.moveMj.zIndex = 3-handMahJong.moveMj.row;
   					handMahJong.moveMj.runAction(move);
   					handMahJong.bMoving = false;
       			}
            }
        })
        return listener
    },
    isEnableOut:function(cbCardData)
    {
    	var cbCount = 0;
        for(var i = 0; i < handMahJong.node.childrenCount; i++)
   		{
   			var child = handMahJong.node.children[i];
   			if(child.cbCardData == cbCardData)
   			{
   				cbCount++;
   			}
   		}
   		if(cbCount == 3) return false;
   		if(mainScene._cbEnableIndex[gameLogic.switchToCardIndex(cbCardData)] == 1) return false;
    	return true;
    },
    getDestCol:function(col)
    {
    	var mj = handMahJong.node.getChildByName(col+'+'+0);
    	if(mj == null)
    	{
    		var minCol = 0;
    		var maxCol = 10;
    		for(var i = 0; i < MAX_COL; i++)
    		{
    			if(handMahJong.node.getChildByName(i+'+'+0))
    			{
    				minCol = i-1;
    				break;
    			}
    		}
    		for(var i = MAX_COL-1; i >= 0; i--)
    		{
    			if(handMahJong.node.getChildByName(i+'+'+0))
    			{
    				maxCol = i+1;
    				break;
    			}
    		}
    		if (col > maxCol)
    			return maxCol;
    		if(col < minCol)
    			return minCol;
    	}
    	return col;
    },
    getDestRow:function(col)
    {
    	var mj0 = handMahJong.node.getChildByName(col+'+'+0);
    	if(mj0 == null)
    	{
    		return 0;
    	}
    	var mj1 = handMahJong.node.getChildByName(col+'+'+1);
    	if(mj1 == null)
    	{
    		return 1;
    	}
    	return 2;
    },
    onActionDown:function()
    {
    	for(var i = 0; i < MAX_COL; i++)
    	{
    		for(var k = 1; k < 3; k++)
    		{
    			var child = handMahJong.node.getChildByName(i+'+'+k);
    			for(var j = 0; j < k; j++)
    			{
	    			var child1 = handMahJong.node.getChildByName(i+'+'+j);
		    		if(child && child1 == null)
		    		{
		    			var move = cc.moveTo(0.03, handMahJong.pos[i][j]);
						child._name = i+'+'+j;
						child.row = j;
						child.zIndex = 3-j;
						child.runAction(move);
						break;
		    		}
    			}
    		}
    	}
    },
    onActionLR:function()
    {
		for(var i = Math.floor((MAX_COL-1)/2); i >= 1; i--)
		{
			for(var j = i-1; j >= 0; j--)
			{
				var childDes = handMahJong.node.getChildByName(i+'+'+0);
				if(childDes == null)
				{
					for(var k = 0; k < 3; k++)
					{
						var childSour = handMahJong.node.getChildByName(j+'+'+k);
			    		if(childSour)
			    		{
			    			childSour.stopAllActions();
			    			var move = cc.moveTo(0.03, handMahJong.pos[i][k]);
							childSour._name = i+'+'+k;
							childSour.col = i;
							childSour.runAction(move);
			    		}
					}
				}
			}
		}
		for(var i = Math.floor((MAX_COL-1)/2); i < MAX_COL; i++)
		{
			for(var j = i+1; j < MAX_COL; j++)
			{
				var childDes = handMahJong.node.getChildByName(i+'+'+0);
				if(childDes == null)
				{
					for(var k = 0; k < 3; k++)
					{
						var childSour = handMahJong.node.getChildByName(j+'+'+k);
			    		if(childSour)
			    		{
			    			childSour.stopAllActions();
			    			var move = cc.moveTo(0.03, handMahJong.pos[i][k]);
							childSour._name = i+'+'+k;
							childSour.col = i;
							childSour.runAction(move);
			    		}
					}
				}
			}
		}
    },
    //抽取  碰 偎
    onAnalysePeng:function(cbCardIndex, sortData)
    {
    	for(var i = 0; i < MAX_INDEX; i++)
    	{
    		if(cbCardIndex[i] >= 3)
    		{
    			cbCardIndex[i] -= 3;
    			sortData[handMahJong.sortIndex][0] = gameLogic.switchToCardData(i);
    			sortData[handMahJong.sortIndex][1] = gameLogic.switchToCardData(i);
    			sortData[handMahJong.sortIndex++][2] = gameLogic.switchToCardData(i);
    		}
    	}
    },
    //抽取 真吃
    onAnalyseChi:function(cbCardIndex, sortData)
    {
    	var onAnalyse = function(cbCardIndex, sortData, nIndex1,nIndex2, nIndex3)
    	{
    		while(cbCardIndex[nIndex1] > 0 && cbCardIndex[nIndex2] > 0 && cbCardIndex[nIndex3] > 0)
    		{
    			cbCardIndex[nIndex1] -= 1;
	    		cbCardIndex[nIndex2] -= 1;
	    		cbCardIndex[nIndex3] -= 1;
	    		sortData[handMahJong.sortIndex][0] = gameLogic.switchToCardData(nIndex1);
	    		sortData[handMahJong.sortIndex][1] = gameLogic.switchToCardData(nIndex2);
	    		sortData[handMahJong.sortIndex++][2] = gameLogic.switchToCardData(nIndex3);
    		}
    	};
    	for(var i = 0; i < MAX_INDEX; i++)
    	{
    		if((i < 8 || i < 18 && i >= 10))
    		{
    			onAnalyse(cbCardIndex, sortData, i, i+1, i+2);
    		}
    	}
    },
    //抽取  真碰少一张
    onAnalysePengEx:function(cbCardIndex, sortData)
    {
    	for(var i = 0; i < MAX_INDEX; i++)
    	{
    		if(cbCardIndex[i] == 2)
    		{
    			cbCardIndex[i] = 0;
    			sortData[handMahJong.sortIndex][0] = gameLogic.switchToCardData(i);
    			sortData[handMahJong.sortIndex++][1] = gameLogic.switchToCardData(i);
    		}
    	}
    },
    //抽取 真吃 少一张
    onAnalyseChiEx:function(cbCardIndex, sortData)
    {
    	var onAnalyse = function(cbCardIndex, sortData, nIndex1, nIndex2, nIndex3)
    	{
    		if(cbCardIndex[nIndex1] + cbCardIndex[nIndex2] + cbCardIndex[nIndex3]  >= 2)
    		{
    			var cbNum = 0;
    			if(cbCardIndex[nIndex1] > 0)
    			{
    				cbCardIndex[nIndex1] = 0;
    				sortData[handMahJong.sortIndex][cbNum++] = gameLogic.switchToCardData(nIndex1);
    			}
    			if(cbCardIndex[nIndex2] > 0)
    			{
    				cbCardIndex[nIndex2] = 0;
    				sortData[handMahJong.sortIndex][cbNum++] = gameLogic.switchToCardData(nIndex2);
    			}
    			if(cbCardIndex[nIndex3] > 0)
    			{
    				cbCardIndex[nIndex3] = 0;
    				sortData[handMahJong.sortIndex][cbNum++] = gameLogic.switchToCardData(nIndex3);
    			}
    			handMahJong.sortIndex++;
    		}
    	};
    	for(var i = 0; i < MAX_INDEX; i++)
    	{
    		if((i < 8 || i < 18 && i >= 10))
    		{
    			onAnalyse(cbCardIndex, sortData, i, i+1, i+2);
    		}
    	}
    },
    //抽取  剩下的烂牌 一个一组
    onAnalyseLeftCard:function(cbCardIndex, sortData)
    {
    	for(var i = 0; i < MAX_INDEX; i++)
    	{
    		if(cbCardIndex[i] == 1)
    		{
    			cbCardIndex[i] = 0;
	    		sortData[handMahJong.sortIndex++][0] = gameLogic.switchToCardData(i);
    		}
    	}
    },
	setCardData:function(cbCardData, cbCardCount)
	{
		handMahJong.clear();
		//获得手牌索引集合
		handMahJong.sortIndex = 0;
		var cbCardIndex = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		gameLogic.switchToCardIndexEx(cbCardData, cbCardCount, cbCardIndex);
		//创建 手牌牌值队列   3行14列
		var sortData = [];
		for (var i = 0; i < MAX_COL; i++) {
			sortData[i] = [];
			for(var k = 0; k < 3; k++)
			{
				sortData[i][k] = 0;
			}
		};
		//抽取 碰 偎
		handMahJong.onAnalysePeng(cbCardIndex, sortData);
		//抽取 真吃 
		handMahJong.onAnalyseChi(cbCardIndex, sortData);
		//抽取真碰少一张
		handMahJong.onAnalysePengEx(cbCardIndex, sortData);
		//抽取真吃少一张
		handMahJong.onAnalyseChiEx(cbCardIndex, sortData);
		//抽取其他烂牌
		handMahJong.onAnalyseLeftCard(cbCardIndex, sortData);

		//冒泡排序  从左到右升序
		for(var i = 0; i < MAX_COL-1; i++)
		{
			for(var j = i + 1; j < MAX_COL; j++)
			{
				if(sortData[i][0] > sortData[j][0])
				{
					var sortUp = [0, 0, 0];
					sortUp = sortData[i];
					sortData[i] = sortData[j];
					sortData[j] = sortUp;
				}
			}
		}
		var nStartCol = Math.floor((MAX_COL-handMahJong.sortIndex)/2);
		for (var i = 0; i < handMahJong.sortIndex; i++)
		{
			for(var k = 0; k < 3; k++)
			{
				var nIndex = MAX_COL-handMahJong.sortIndex+i;
				if(sortData[nIndex][k] == 0) continue;
				var cbData = (mainScene._wMeChaird == INVALID_CHAIR)?0:sortData[nIndex][k];
				var mj = mahJong.create(cbData);
				mj._name = nStartCol+'+'+k;
				mj.row = k;
				mj.col = nStartCol;
				mj.x = handMahJong.pos[nStartCol][k].x;
				mj.y = handMahJong.pos[nStartCol][k].y;
				mj.zIndex = 3-k;
				handMahJong.node.addChild(mj);
			}
			nStartCol++;
		};
	},
	setOperateCard:function(cbCardData)
	{
		if(mainScene._wMeChaird == INVALID_CHAIR)
		{
			if(handMahJong.node.childrenCount > 2)
			{
				handMahJong.node.children[handMahJong.node.childrenCount-1].removeFromParent;
				handMahJong.node.children[handMahJong.node.childrenCount-2].removeFromParent;
			}
		}
		else
		{
			for(var i = 1; i < 3; i++)
			{
		        for(var k = 0; k < handMahJong.node.childrenCount; k++)
		   		{
		   			var child = handMahJong.node.children[k];
		   			if (child.cbCardData == cbCardData[i])
		   			{
		   				child.removeFromParent();
		   				break;
		   			}
		   		}
			}
		}
		handMahJong.onActionDown();
		handMahJong.onActionLR();
	},
	clear:function()
	{
		handMahJong.node.removeAllChildren();
	}
};
//出牌管理器(吃碰后出牌 与  揭牌)
var outMahJong = 
{
	init:function(uiPlay)
	{
		outMahJong.bg = new cc.Sprite("#outBgY.png");
		outMahJong.card = new cc.Sprite("#out1.png");
		uiPlay.addChild(outMahJong.bg);
		uiPlay.addChild(outMahJong.card);
		outMahJong.bg.visible = false;
		outMahJong.card.visible = false;
	},
	showOutCard:function(wChaird, cbOutCard, bOut, bWei)
	{
		var pos = 
		[
		cc.p(mainScene.ctPosX, mainScene.ctPosY),
		cc.p(tableData.getChairWithShowChairId(1).node.x - 300, tableData.getChairWithShowChairId(1).node.y - 20),
		cc.p(tableData.getChairWithShowChairId(2).node.x + 300, tableData.getChairWithShowChairId(2).node.y - 20),
		];
		if(bWei && ((wChaird == 0 && mainScene._wMeChaird == INVALID_CHAIR) || wChaird != 0))
		{
			outMahJong.bg.setSpriteFrame("out0.png");
			outMahJong.bg.color = cc.color(255, 255, 255);
			outMahJong.card.color = cc.color(255, 255, 255);
		}
		else if(bOut)
		{
			outMahJong.bg.setSpriteFrame("outBgB.png");
			outMahJong.bg.color = cc.color(200, 200, 200);
			outMahJong.card.color = cc.color(200, 200, 200);
		}
		else
		{
			outMahJong.bg.setSpriteFrame("outBgY.png");
			outMahJong.bg.color = cc.color(255, 255, 255);
			outMahJong.card.color = cc.color(255, 255, 255);
		}
		if(!bWei || (wChaird == 0 && mainScene._wMeChaird != INVALID_CHAIR))
		{
			outMahJong.card.setSpriteFrame('out'+cbOutCard+'.png');
			outMahJong.card.setPosition(pos[wChaird]);
			outMahJong.card.visible = true;
			outMahJong.bg.setPosition(pos[wChaird]);
			outMahJong.bg.visible = true;
		}
		else
		{
			outMahJong.card.visible = false;
			outMahJong.bg.visible = false;
		}
	},
	hide:function()
	{
		outMahJong.bg.visible = false;
		outMahJong.card.visible = false;
	},
};
//弃牌管理器
var disCardControl = 
{
	init:function(uiPlay)
	{
		disCardControl.node = new cc.Node();
		uiPlay.addChild(disCardControl.node);
		disCardControl.count = [0,0,0];
	},
	create:function(bOut, cbCardData)
	{
		var mahJong = null;
		if(bOut)
			mahJong = new cc.Sprite("#sOut.png");
		else
			mahJong = new cc.Sprite("#sJie.png");
		mahJong.spValue = new cc.Sprite(('#s'+cbCardData+'.png'));
		mahJong.spValue.x = mahJong.width/2;
		mahJong.spValue.y = mahJong.height/2;
		mahJong.addChild(mahJong.spValue);
		mahJong.scale = sMahJongScale;
		mahJong.cbCardData = cbCardData;
		return mahJong;
	},
	addCardItem:function(wChaird, bOut, cbCardData)
	{
		var item = disCardControl.create(bOut, cbCardData);
		disCardControl.node.addChild(item);
		var sx = 0;
		var sy = 0;
		switch(wChaird)
		{
			case 0:
				sx = mainScene.ctPosX * 2 - 20;
				sy = tableData.getChairWithShowChairId(wChaird).node.y + 200;
				item.x = sx - (disCardControl.count[wChaird]%5)*item.width*sMahJongScale;
			break;
			case 1:
				sx = tableData.getChairWithShowChairId(wChaird).node.x - 130;
				sy = tableData.getChairWithShowChairId(wChaird).node.y + 60;
				item.x = sx - (disCardControl.count[wChaird]%5)*item.width*sMahJongScale;
			break;
			case 2:
				sx = tableData.getChairWithShowChairId(wChaird).node.x + 130;
				sy = tableData.getChairWithShowChairId(wChaird).node.y + 60;
				item.x = sx + (disCardControl.count[wChaird]%5)*item.width*sMahJongScale;
			break;
		}
		item.y = sy - Math.floor((disCardControl.count[wChaird]/5))*item.height*sMahJongScale;
		disCardControl.count[wChaird]++;
	},
	clear:function()
	{
		disCardControl.node.removeAllChildren();
		disCardControl.count = [0,0,0];
	}
};
//吃碰偎管理器
var weaveControl = 
{
	init:function(uiPlay)
	{
		weaveControl.node = new cc.Node();
		uiPlay.addChild(weaveControl.node);
		weaveControl.cbWeaveCount = [0, 0, 0];
		weaveControl.cbWeaveArray = [];
		for(var i = 0; i < GAME_PLAYER; i++)
		{
			weaveControl.cbWeaveArray[i] = [];
			for(var j = 0; j < MAX_WEAVE; j++)
			{
				weaveControl.cbWeaveArray[i][j] = {};
			}
		}
	},
	create:function(wChaird, cbWeaveKind, cbCardData, cbCardIndex)
	{
		var mahJong = null;
		if(cbWeaveKind&(WIK_LEFT | WIK_CENTER | WIK_RIGHT) && cbCardIndex == 0)
			mahJong = new cc.Sprite("#sGray.png");
		else if(cbWeaveKind == WIK_WEI)
			mahJong = new cc.Sprite("#s0.png");
		else
			mahJong = new cc.Sprite("#sJie.png");
		mahJong._name = wChaird+'+'+cbWeaveKind+'+'+cbCardData+'+'+cbCardIndex;
		if (cbWeaveKind != WIK_WEI || (wChaird == 0 && mainScene._wMeChaird != INVALID_CHAIR))
		{
			mahJong.spValue = new cc.Sprite(('#s'+cbCardData+'.png'));
			mahJong.spValue.x = mahJong.width/2;
			mahJong.spValue.y = mahJong.height/2;
			mahJong.addChild(mahJong.spValue);
		}
		mahJong.scale = sMahJongScale;
		return mahJong;
	},
	addWeaveItem:function(wChaird, cbWeaveKind, cbCardArray)
	{
		//更新桌面硬息
	    if(cbWeaveKind == WIK_PENG || cbWeaveKind == WIK_WEI)
	    { 
	    	if(cbWeaveKind == WIK_PENG)
	    	{
		        if(gameLogic.isRedCard(cbCardArray[0]))
		         	mainScene._cbYingXi[wChaird] += 3;
		        else
		            mainScene._cbYingXi[wChaird] += 2;
	    	}
	    	else if(cbWeaveKind == WIK_WEI && (wChaird == 0 && mainScene._wMeChaird != INVALID_CHAIR))
	    	{
		        if(gameLogic.isRedCard(cbCardArray[0]))
		         	mainScene._cbYingXi[wChaird] += 4;
		        else
		            mainScene._cbYingXi[wChaird] += 3;
	    	}
	    }
	    for(var i = 0; i < 3; i++)
	    {
	    	var cbCount = 1;
	    	for(var k = 0; k < weaveControl.cbWeaveCount[wChaird]; k++)
	    	{
	    		var cbCardArrayEx = weaveControl.cbWeaveArray[wChaird][k].cbCardArray;
	    		var cbWeaveKindEx = weaveControl.cbWeaveArray[wChaird][k].cbWeaveKind;
	    		for(var j = 0; j < 3; j++)
	    		{
	    			if(cbCardArray[i] == cbCardArrayEx[j])
	    			{
	    				if((wChaird == 0 && mainScene._wMeChaird != INVALID_CHAIR) || (cbWeaveKind != WIK_WEI && cbWeaveKindEx != WIK_WEI))
	    				{
		    				cbCount++;
		    				if (cbCount == 4)
		    				{
						        if(gameLogic.isRedCard(cbCardArray[i]))
						         	mainScene._cbYingXi[wChaird] += 4;
						        else
						            mainScene._cbYingXi[wChaird] += 3;
		    				}
	    				}
	    			}
	    		}
	    	}
	    }

	    if(mainScene._cbYingXi[wChaird] > 0)
	    {
	        tableNode['lbYingXi'+wChaird].visible = true;
	        tableNode['lbYingXi'+wChaird].setString(mainScene._cbYingXi[wChaird]+'胡息');
	        tableNode['lbYingXi'+wChaird].y = tableData.getChairWithShowChairId(wChaird).node.y+48;
	        if(wChaird == 1)
	        	tableNode['lbYingXi'+wChaird].x = tableData.getChairWithShowChairId(wChaird).node.x-80;
	        else
	        	tableNode['lbYingXi'+wChaird].x = tableData.getChairWithShowChairId(wChaird).node.x+80;
	    }

		weaveControl.cbWeaveArray[wChaird][weaveControl.cbWeaveCount[wChaird]].cbWeaveKind = cbWeaveKind;
		weaveControl.cbWeaveArray[wChaird][weaveControl.cbWeaveCount[wChaird]].cbCardArray = [];
		weaveControl.cbWeaveArray[wChaird][weaveControl.cbWeaveCount[wChaird]].cbCardArray = cbCardArray;
		for(var i = 0; i < 3; i++)
		{
			var item = weaveControl.create(wChaird, cbWeaveKind, cbCardArray[i], i);
			weaveControl.node.addChild(item);
			var sx = 0;
			var sy = 0;
			switch(wChaird)
			{
				case 0:
					sx = 20;
					sy = tableData.getChairWithShowChairId(wChaird).node.y + 200;
					item.x = sx + weaveControl.cbWeaveCount[wChaird]*item.width*sMahJongScale;
				break;
				case 1:
					sx = mainScene.ctPosX * 2 - 20;
					sy = tableData.getChairWithShowChairId(wChaird).node.y - 75;
					item.x = sx - weaveControl.cbWeaveCount[wChaird]*item.width*sMahJongScale;
				break;
				case 2:
					sx = 20;
					sy = tableData.getChairWithShowChairId(wChaird).node.y - 75;
					item.x = sx + weaveControl.cbWeaveCount[wChaird]*item.width*sMahJongScale;
				break;
			}
			item.y = sy - i*item.height*sMahJongScale;
		}
		weaveControl.cbWeaveCount[wChaird]++;
		//删除手牌
		if(wChaird == 0)
		{
			handMahJong.setOperateCard(cbCardArray);
		}
	},
	showWeiItem:function()
	{
		//游戏结束 显示偎
		for(var wChaird = 0; wChaird < GAME_PLAYER; wChaird++)
		{
			for(var cbCount = 0; cbCount < weaveControl.cbWeaveCount[wChaird]; cbCount++)
			{
				var cbWeaveKind = weaveControl.cbWeaveArray[wChaird][cbCount].cbWeaveKind;
				var cbCardArray = [];
				cbCardArray = weaveControl.cbWeaveArray[wChaird][cbCount].cbCardArray; 
				if(cbWeaveKind == WIK_WEI && (wChaird != 0 || (wChaird == 0 && mainScene._wMeChaird == INVALID_CHAIR)))
				{
					for(var i = 0; i < 3; i++)
					{
						var item = weaveControl.node.getChildByName(wChaird+'+'+cbWeaveKind+'+'+cbCardArray[i]+'+'+i);
						if(item)
						{
							var spValue = new cc.Sprite(('#s'+cbCardArray[i]+'.png'));
							spValue.x = mahJong.width/2;
							spValue.y = mahJong.height/2;
							item.addChild(spValue);
						}
					}
				}
			}
		}
	},
	clear:function()
	{
		tableNode['lbYingXi'+0].visible = false;
		tableNode['lbYingXi'+1].visible = false;
		tableNode['lbYingXi'+2].visible = false;
		weaveControl.node.removeAllChildren();
		weaveControl.cbWeaveCount = [0, 0, 0];
		weaveControl.cbWeaveArray = [];
		for(var i = 0; i < GAME_PLAYER; i++)
		{
			weaveControl.cbWeaveArray[i] = [];
			for(var j = 0; j < MAX_WEAVE; j++)
			{
				weaveControl.cbWeaveArray[i][j] = {};
			}
		}
	}
};
//GM管理器
var gameGM = 
{
	create:function()
	{
		if(gameGM.node && gameGM.node._parent) return;
		gameGM.cbCardCount = 0;
		gameGM.cbCardData = [];
		gameGM.node = new cc.Node();
		gameGM.node.x = mainScene.ctPosX;
		gameGM.node.y = mainScene.ctPosY;
		mainScene.top.addChild(gameGM.node, 300);
		gameGM.node.visible = true;
		var bg = new cc.Scale9Sprite("selectChiBg.png");
      	bg.width = 900;
      	bg.height = 640;
      	gameGM.node.addChild(bg);

		gameGM.btnCancel = new ccui.Button(resp.btnPass);
		gameGM.btnCancel.addTouchEventListener(this.onTouchEvent, this);
        gameGM.node.addChild(gameGM.btnCancel);
        gameGM.btnCancel.x = -340;
        gameGM.btnCancel.y = -90;

		gameGM.btnOk = new ccui.Button(resp.btnHu);
		gameGM.btnOk.addTouchEventListener(this.onTouchEvent, this);
        gameGM.node.addChild(gameGM.btnOk);
        gameGM.btnOk.x = 350;
        gameGM.btnOk.y = -90;

        var cbCardData = [1,2,3,4,5,6,7,8,9,10,17,18,19,20,21,22,23,24,25,26];
        var mahjong = mahJong.create(1);
        gameGM.width = mahjong.width;
        gameGM.height = mahjong.height;
        var sx = -mahjong.width*5;
        var sy = 260;
        for(var i = 0; i < 20; i++)
        {
        	var mj = mahJong.create(cbCardData[i]);
        	mj.row = 0;
        	mj.x = sx + (i%10)*mj.width+(i%10)*8;
        	mj.y = sy - Math.floor(i/10)*mj.height - Math.floor(i/10);
        	gameGM.node.addChild(mj);
        	var listener = gameGM.getListener(mj);
        	cc.eventManager.addListener(listener, mj);

        	var mj1 = mahJong.create(cbCardData[i]);
        	mj1.row = 1;
        	mj1.x = sx + (i%10)*mj.width+(i%10)*8;
        	mj1.y = sy - Math.floor(i/10)*mj.height - Math.floor(i/10)-180;
        	gameGM.node.addChild(mj1);
        	var listener1 = gameGM.getListener(mj1);
        	cc.eventManager.addListener(listener1, mj1);
        }
        gameGM.handNode = new cc.Node();
		gameGM.node.addChild(gameGM.handNode);
		gameGM.sendNode = new cc.Node();
		gameGM.node.addChild(gameGM.sendNode);
		gameGM.cbSendCard = 0;
	},
	getListener:function()
    {   
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) 
            {
              	if(gameGM.node.visible == false) return false;
                var target = event.getCurrentTarget();
                if(target.visible == false) return false;

                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true;
                }
            },
            onTouchEnded: function (touch, event)
            {
            	var item = event.getCurrentTarget();
 				if(item.row == 0 || item.row == 2)
 				{
 					if(item.row == 2)
	            	{
	            		for(var i = 0; i < gameGM.cbCardCount; i++)
	            		{
	            			if(item.cbCardData == gameGM.cbCardData[i])
	            			{
	            				gameGM.cbCardData[i] = 255;
	            				break;
	            			}
	            		}
	            		item.removeFromParent();
						gameGM.cbCardCount--;
	            	}
	            	else if(item.row == 0 && gameGM.cbCardCount < handMahJong.node.childrenCount)
	            	{
	            		gameGM.cbCardData[gameGM.cbCardCount] = item.cbCardData;
				        gameGM.cbCardCount++;
	            	}
	            	gameGM.cbCardData.sort(function(a, b){return a-b;});
	            	var sx = -gameGM.width*5;
				    var sy = -180;
				    gameGM.handNode.removeAllChildren();
	            	for(var i = 0; i < gameGM.cbCardCount; i++)
	            	{
				        var mj = mahJong.create(gameGM.cbCardData[i]);
				        mj.x = sx + (i%10)*mj.width+(i%10)*8;
				        mj.y = sy - Math.floor(i/10)*mj.height - Math.floor(i/10);
				        mj.row = 2;
				        gameGM.handNode.addChild(mj);
				        var listener = gameGM.getListener(mj);
		        		cc.eventManager.addListener(listener, mj);
	            	}
 				}
 				else if(item.row == 1)
 				{
 					gameGM.sendNode.removeAllChildren();
					var mj = mahJong.create(item.cbCardData);
			        mj.x = 140;
			        mj.y = -90;
			        mj.row = 4;
			        gameGM.sendNode.addChild(mj);
			        var listener = gameGM.getListener(mj);
	        		cc.eventManager.addListener(listener, mj);
	        		gameGM.cbSendCard = item.cbCardData;
 				}
 				else if(item.row == 4)
 				{
 					gameGM.cbSendCard = 0;
 					gameGM.sendNode.removeAllChildren();
 				}
            }
        })
        return listener;
    },
	onTouchEvent: function (render, type) 
	{
		if(type != ccui.Widget.TOUCH_ENDED) return;
		if (render == gameGM.btnCancel) 
    	{
    		gameGM.node.visible = false;
			gameGM.node.removeFromParent();
    	}
    	else if (render == gameGM.btnOk)
    	{
			if(gameGM.cbCardCount != handMahJong.node.childrenCount) return;
			gameGM.node.removeFromParent();
			var gm = getObjWithStructName('CMD_C_GAME_GM');
			gm.cbCardData = [];
			gm.cbCardData = gameGM.cbCardData;
			gm.cbSendData = gameGM.cbSendCard;
			socket.sendMessage(MDM_GF_GAME, SUB_C_GAME_GM, gm); 
    	}

	},
};