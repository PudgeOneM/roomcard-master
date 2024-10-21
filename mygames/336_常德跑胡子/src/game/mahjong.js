var sMahJongScale = 0.6;
//发牌动画
var disPatchAmt = 
{
	init:function(uiPlay)
	{
		disPatchAmt.node = new cc.Node();
		uiPlay.addChild(disPatchAmt.node);
		disPatchAmt.node.x = tableNode.leftCardNode._parent.x;
		disPatchAmt.node.y = tableNode.leftCardNode._parent.y-50;
		disPatchAmt.disIndex = 0;
		disPatchAmt.showIndex = 0;
		var cbRotation = 0;
		for(var i = 0; i < 20; i++)
		{
			var item = new cc.Sprite("#out0.png");
			item.visible = false;
			item.scale = 0.5;
			item.setRotation(105);
			cbRotation += 18;
			disPatchAmt.node.addChild(item);
		}
	},
	onActionMove:function()
	{
		var mahjongEnd = handMahJong.getCardWithIndex(MAX_COUNT-2);
		if(mahjongEnd && mahjongEnd.visible) 
		{
			mainScene._cbLeftCardCount = 19;
			mainScene.leftNum.setString(mainScene._cbLeftCardCount);
			disPatchAmt.node.unschedule(disPatchAmt.onActionMove);
			//亮张
			var wViewChairID = gameLogic.switchViewChairID(mainScene._wBankerUser);
			outMahJong.showOutCard(wViewChairID, mainScene._cbDisCardData, false, false);
			//计时器
      		//gameClock.setGameClock(mainScene._wBankerUser);
      		disPatchAmt.clear();
      		//设置吃碰杠操作
      		operateBtn.setOperateInfo(mainScene._cbActionMask);
      		setTimeout(function()
		    {
	      		//亮张插入手牌
	      		if (mainScene._wCurrentUser != INVALID_CHAIR) 
	      		{
	      			if (mainScene._cbActionBk == WIK_NULL)
	      			{
	      				handMahJong.insertCard();
	      				gameClock.setGameClock(mainScene._wBankerUser);
	      			}
	      			else
	      			{
	      				//庄家 提 偎 操作
	      				//添加吃碰杠牌堆
	      				var bInsert = true;
	      				if(mainScene._cbActionBk & WIK_WEI)
	      				{
	      					var cbCardArray = [mainScene._cbDisCardData, mainScene._cbDisCardData, mainScene._cbDisCardData, 0];
			          		weaveControl.addWeaveItem(wViewChairID, WIK_WEI, cbCardArray, 1);
			          		bInsert = false;
	      				}
	      				var cbNextJiePai = 0;
	      				if(mainScene._cbActionBk & WIK_TI)
	      				{
	  						for(var k = 0; k < MAX_WEAVE; k++)
	  						{
	  							if(mainScene._cbCardTi[k] == 0) break;
	  							cbNextJiePai++;
	  							var cbCardArray = [mainScene._cbCardTi[k], mainScene._cbCardTi[k], mainScene._cbCardTi[k], mainScene._cbCardTi[k]];
		          				if(mainScene._cbCardTi[k] == mainScene._cbDisCardData)
		          				{
		          					bInsert = false;
		          				}
		          				var nIndex = 0;
		          				if (mainScene._wMeChaird == INVALID_CHAIR) 
		          				{
		          					if (mainScene._cbCardTi[k] != mainScene._cbDisCardData) 
		          					{
		          						nIndex = 2;
		          					}
		          				}
		          				weaveControl.addWeaveItem(wViewChairID, WIK_TI, cbCardArray, nIndex);
	  						}
	      				}
	      				gameClock.setGameClock(mainScene._wBankerUser);	
			          	//播放动画
			          	if (mainScene._cbActionBk & WIK_WEI)
			          	{
			          		operateAmt.setAmtInfo(mainScene._wCurrentUser, WIK_WEI, 0);
			          	}
			          	else
			          	{
			          		operateAmt.setAmtInfo(mainScene._wCurrentUser, WIK_TI, 0);
			          	}
			          	outMahJong.hide();
			          	if(bInsert)
			          	{
			          		handMahJong.insertCard();
			          	}
	      			}
	      		}
		   	},500);
			return ;
		}
		var mahjong = handMahJong.getCardWithIndex(disPatchAmt.disIndex);
		if (mahjong)
		{
			var child = disPatchAmt.node.children[disPatchAmt.disIndex];
			child.visible = true;
			var p  = handMahJong.node.convertToWorldSpace(mahjong.getPosition());
			var pp = disPatchAmt.node.convertToNodeSpace(p);
			var actionTo = cc.moveTo(0.8, pp);
			var actionScale = cc.scaleTo(0.8, 1);
			var actionRotate = cc.rotateTo(0.8, 720);
			var onActionEnd = function()
			{
				child.visible = false;
				mahjong.visible = true;
				var actionScale = cc.scaleTo(0.2, 1);
				mahjong.runAction(actionScale);
				managerAudio.playEffect('gameRes/sound/fapai.mp3');
			};
			mainScene._cbLeftCardCount -= 3;
			mainScene.leftNum.setString(mainScene._cbLeftCardCount);
			var callback = cc.callFunc(onActionEnd, this);
			child.runAction(cc.sequence(cc.spawn(actionTo, actionScale, actionRotate), callback));
			disPatchAmt.node.schedule(disPatchAmt.onActionMove,0.05);
			disPatchAmt.disIndex++;
		}
	},
	clear:function()
	{
		disPatchAmt.node.removeAllChildren();
		disPatchAmt.disIndex = 0;
		disPatchAmt.showIndex = 0;
		var cbRotation = 0;
		for(var i = 0; i < 20; i++)
		{
			var item = new cc.Sprite("#out0.png");
			item.visible = false;
			item.scale = 0.5;
			item.setRotation(105);
			cbRotation += 18;
			disPatchAmt.node.addChild(item);
		}
	}
};

//出牌动画
var outAmt = {
	init:function(uiPlay)
	{
		outAmt.lineNode = new cc.Node();
		uiPlay.addChild(outAmt.lineNode);
		var gameWidth = mainScene.ctPosX*2;
		var cbLineCount = Math.ceil(gameWidth/40);
		for(var i = 0; i < cbLineCount; i++)
		{
			var line = new cc.Sprite("#outAmt_line.png");
			line.x = i*line.width+line.width/2;
			line.y = mainScene.ctPosY - 45;
			outAmt.lineNode.addChild(line);
		}
		outAmt.lineNode.visible = false;
		outAmt.actNode = new cc.Node();
		uiPlay.addChild(outAmt.actNode);
		outAmt.actNode.visible = false;
		
		var cardBg = new cc.Sprite("#outAmt_card.png");
		cardBg.x = mainScene.ctPosX*2*0.7;
		cardBg.y = mainScene.ctPosY - 120;
		outAmt.actNode.addChild(cardBg);

		var animation = function(y)
		{
			var actmb = cc.moveBy(1.2, cc.p(0, y));
			var actmbEnd = function()
			{
				this.y = this.y-y;
			}
			this.runAction(cc.sequence(actmb, cc.delayTime(0.2), cc.callFunc(actmbEnd, this)).repeatForever());
		}
		animation.call(cardBg, 40);



		var hand = new cc.Sprite("#outAmt_hand.png");
		hand.x = mainScene.ctPosX*2*0.73;
		hand.y = mainScene.ctPosY - 195;
		outAmt.actNode.addChild(hand);

		animation.call(hand, 120);

		var tip = new cc.Sprite("#outAmt_tip.png");
		tip.x = mainScene.ctPosX*2*0.76;
		tip.y = mainScene.ctPosY - 180;
		outAmt.actNode.addChild(tip);
		outAmt.actNode.x = 70;
		outAmt.actNode.y = 10;
	},
};

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
		var leftX = mainScene.ctPosX - 5*mj.width; 
		var leftY = mj.height/2-5;
		handMahJong.pos = [];
		handMahJong.bMoving = false;
		for (var i = 0; i <11; i++)
		{
			handMahJong.pos[i] = [];
			for(var k = 0; k < 4; k++)
			{
				handMahJong.pos[i][k] = {};
				handMahJong.pos[i][k].x = leftX+i*mj.width;
				handMahJong.pos[i][k].y = leftY+k*mj.height - k*20;
			}
		};
		handMahJong._cbCardData = [];
		handMahJong._cbCardCount = 0;
	},
	insertCard:function()
	{
		setTimeout(function()
	    {
	    	var wViewChairID = gameLogic.switchViewChairID(mainScene._wBankerUser);
			var onActionEnd = function()
			{
				if(wViewChairID == 0)
				{
					handMahJong._cbCardData[handMahJong._cbCardCount] = mainScene._cbDisCardData;
					handMahJong.setCardData(handMahJong._cbCardData, handMahJong._cbCardCount+1, true);
				}
			};
			var pos = cc.p(0, 0);
			if(wViewChairID == 0)
			{
				pos.x = mainScene.ctPosX;
				pos.y = 0;
			}
			else
			{
				pos = tableData.getChairWithShowChairId(wViewChairID).node.getPosition();
			}
			outMahJong.onActionMove(wViewChairID, pos, onActionEnd);
	   	},500);
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
	                	if(mainScene._wCurrentUser !== undefined && mainScene._wCurrentUser == mainScene._wMeChaird)
		           		{
		           			outAmt.lineNode.visible = true;
		           		}
	                	child.zIndex = 5;
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
       				outAmt.lineNode.visible = false;
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
						for(var i = 0; i < handMahJong._cbCardCount; i++)
						{
							if(handMahJong.moveMj.cbCardData == handMahJong._cbCardData[i])
							{
								handMahJong._cbCardData[i] = 0;
								handMahJong._cbCardCount -= 1;
		   						handMahJong._cbCardData.sort(function(a,b){return b-a;});
		   						break;
							}
						}
						outAmt.actNode.visible = false;
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
			       	for (var i = 0; i <11; i++)
					{
						for(var k = 0; k < 4; k++)
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
				   					handMahJong.moveMj.zIndex = 4-desRow;
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
   					handMahJong.moveMj.zIndex = 4-handMahJong.moveMj.row;
   					handMahJong.moveMj.runAction(move);
   					handMahJong.bMoving = false;
       			}
            }
        })
        return listener
    },
    isEnableOutEx:function()
    {
    	//手上是否还有可出牌
    	if(handMahJong.node.childrenCount == 0) return false;
    	var cbCardIndex = handMahJong.getCardIndex();
    	for(var i = 0; i < MAX_INDEX; i++)
    	{
    		if(cbCardIndex[i] < 3 && cbCardIndex[i] > 0) return true;
    	}
    	return false;
    },
    isEnableOut:function(cbCardData)
    {
    	//这张牌是否可出
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
    	return true;
    },
    getDestCol:function(col)
    {
    	var mj = handMahJong.node.getChildByName(col+'+'+0);
    	if(mj == null)
    	{
    		var minCol = 0;
    		var maxCol = 10;
    		for(var i = 0; i < 11; i++)
    		{
    			if(handMahJong.node.getChildByName(i+'+'+0))
    			{
    				minCol = i-1;
    				break;
    			}
    		}
    		for(var i = 10; i >= 0; i--)
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
    	for(var i = 0; i < 11; i++)
    	{
    		for(var k = 1; k < 4; k++)
    		{
    			var child = handMahJong.node.getChildByName(i+'+'+k);
    			for(var j = 0; j < k; j++)
    			{
	    			var child1 = handMahJong.node.getChildByName(i+'+'+j);
		    		if(child && child1 == null)
		    		{
		    			child.stopAllActions();
		    			var move = cc.moveTo(0.03, handMahJong.pos[i][j]);
						child._name = i+'+'+j;
						child.row = j;
						child.zIndex = 4-j;
						child.runAction(move);
						break;
		    		}
    			}
    		}
    	}
    },
    onActionLR:function()
    {
		for(var i = 5; i >= 1; i--)
		{
			for(var j = i-1; j >= 0; j--)
			{
				var childDes = handMahJong.node.getChildByName(i+'+'+0);
				if(childDes == null)
				{
					for(var k = 0; k < 4; k++)
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
		for(var i = 5; i < 10; i++)
		{
			for(var j = i+1; j < 11; j++)
			{
				var childDes = handMahJong.node.getChildByName(i+'+'+0);
				if(childDes == null)
				{
					for(var k = 0; k < 4; k++)
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
    //抽取  提   跑 (明杠  暗杠)
    onAnalyseTi:function(cbCardIndex, sortData)
    {
    	for(var i = 0; i < MAX_INDEX; i++)
    	{
    		if(cbCardIndex[i] == 4)
    		{
    			cbCardIndex[i] = 0;
    			sortData[handMahJong.sortIndex][0] = gameLogic.switchToCardData(i);
    			sortData[handMahJong.sortIndex][1] = gameLogic.switchToCardData(i);
    			sortData[handMahJong.sortIndex][2] = gameLogic.switchToCardData(i);
    			sortData[handMahJong.sortIndex++][3] = gameLogic.switchToCardData(i);
    		}
    	}
    },
    //抽取  碰   偎
    onAnalysePeng:function(cbCardIndex, sortData)
    {
    	for(var i = 0; i < MAX_INDEX; i++)
    	{
    		if(cbCardIndex[i] == 3)
    		{
    			cbCardIndex[i] = 0;
    			sortData[handMahJong.sortIndex][0] = gameLogic.switchToCardData(i);
    			sortData[handMahJong.sortIndex][1] = gameLogic.switchToCardData(i);
    			sortData[handMahJong.sortIndex++][2] = gameLogic.switchToCardData(i);
    		}
    	}
    },
    //抽取 真吃(123 一二三  2 7 10  二七十  其他顺子)
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
    	onAnalyse(cbCardIndex, sortData, 0, 1, 2);
    	onAnalyse(cbCardIndex, sortData,	10, 11, 12);
    	onAnalyse(cbCardIndex, sortData, 1, 6, 9);
    	onAnalyse(cbCardIndex, sortData, 11, 16, 19);
    	for(var i = 0; i < MAX_INDEX; i++)
    	{
    		if((i < 8 || i < 18 && i >= 10))
    		{
    			onAnalyse(cbCardIndex, sortData, i, i+1, i+2);
    		}
    	}
    },
    //抽取 假碰
    onAnalyseJiaPeng:function(cbCardIndex, sortData)
    {
    	for(var i = 0; i < 10; i++)
    	{
    		if(cbCardIndex[i] == 2 && cbCardIndex[i+10] == 1)
    		{
    			cbCardIndex[i] -= 2;
    			cbCardIndex[i+10] -= 1;
	    		sortData[handMahJong.sortIndex][0] = gameLogic.switchToCardData(i);
	    		sortData[handMahJong.sortIndex][1] = gameLogic.switchToCardData(i);
	    		sortData[handMahJong.sortIndex++][2] = gameLogic.switchToCardData(i+10);
    		}
    		else if (cbCardIndex[i] == 1 && cbCardIndex[i+10] == 2)
    		{
    			cbCardIndex[i] -= 1;
    			cbCardIndex[i+10] -= 2;
	    		sortData[handMahJong.sortIndex][0] = gameLogic.switchToCardData(i);
	    		sortData[handMahJong.sortIndex][1] = gameLogic.switchToCardData(i+10);
	    		sortData[handMahJong.sortIndex++][2] = gameLogic.switchToCardData(i+10);
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
    	cc.delayTime
    	onAnalyse(cbCardIndex, sortData, 1, 6, 9);
    	onAnalyse(cbCardIndex, sortData, 11, 16, 19);
    	for(var i = 0; i < MAX_INDEX; i++)
    	{
    		if((i < 8 || i < 18 && i >= 10))
    		{
    			onAnalyse(cbCardIndex, sortData, i, i+1, i+2);
    		}
    	}
    },
    //抽取  假碰 少一张
    onAnalyseJiaPengEx:function(cbCardIndex, sortData)
    {
    	for(var i = 0; i < 10; i++)
    	{
    		if(cbCardIndex[i] == 1 && cbCardIndex[i+10] == 1)
    		{
    			cbCardIndex[i] = 0;
    			cbCardIndex[i+10] = 0;
	    		sortData[handMahJong.sortIndex][0] = gameLogic.switchToCardData(i);
	    		sortData[handMahJong.sortIndex++][1] = gameLogic.switchToCardData(i+10);
    		}
    	}
    },
    //抽取  剩下的烂牌 三个一组
    onAnalyseLeftCard:function(cbCardIndex, sortData)
    {
    	var cbCount = 0;
    	for(var i = 0; i < MAX_INDEX; i++)
    	{
    		if(cbCardIndex[i] == 1)
    		{
    			cbCardIndex[i] = 0;
	    		sortData[handMahJong.sortIndex][cbCount++] = gameLogic.switchToCardData(i);
	    		if(cbCount == 3)
	    		{
	    			cbCount = 0;
	    			handMahJong.sortIndex++;
	    		}
    		}
    	}
    	if(cbCount != 3)
		{
			handMahJong.sortIndex++;
		}
    },
	setCardData:function(cbCardData, cbCardCount, bShow)
	{
		handMahJong.clear();
		handMahJong._cbCardData = cbCardData;
		handMahJong._cbCardCount = cbCardCount;
		//获得手牌索引集合
		handMahJong.sortIndex = 0;
		var cbCardIndex = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		gameLogic.switchToCardIndexEx(cbCardData, cbCardCount, cbCardIndex);
		//创建 手牌牌值队列   4行11列
		var sortData = [];
		for (var i = 0; i < 11; i++) {
			sortData[i] = [];
			for(var k = 0; k < 4; k++)
			{
				sortData[i][k] = 0;
			}
		};

		//抽取  提 跑
		handMahJong.onAnalyseTi(cbCardIndex, sortData);
		//抽取 碰 偎
		handMahJong.onAnalysePeng(cbCardIndex, sortData);
		//抽取 真吃 123 2 7 10  其他序列
		handMahJong.onAnalyseChi(cbCardIndex, sortData);
		//抽取假碰
		handMahJong.onAnalyseJiaPeng(cbCardIndex, sortData);
		//抽取真碰少一张
		handMahJong.onAnalysePengEx(cbCardIndex, sortData);
		//抽取真吃少一张
		handMahJong.onAnalyseChiEx(cbCardIndex, sortData);
		//抽取假碰少一张
		handMahJong.onAnalyseJiaPengEx(cbCardIndex, sortData);
		//抽取其他烂牌
		handMahJong.onAnalyseLeftCard(cbCardIndex, sortData);

		var nStartCol = Math.ceil((11-handMahJong.sortIndex)/2);
		for (var i = 0; i < handMahJong.sortIndex; i++)
		{
			for(var k = 0; k < 4; k++)
			{
				if(sortData[i][k] == 0) continue;
				var cbData = (mainScene._wMeChaird == INVALID_CHAIR)?0:sortData[i][k];
				var mj = mahJong.create(cbData);
				if(handMahJong.getCardCount(cbData) > 2)
				{
					mj.color = cc.color(125, 125, 125);
				}
				mj.scale = bShow?1:0.1;
				mj.visible = bShow;
				mj._name = nStartCol+'+'+k;
				mj.row = k;
				mj.col = nStartCol;
				mj.x = handMahJong.pos[nStartCol][k].x;
				mj.y = handMahJong.pos[nStartCol][k].y;
				mj.zIndex = 4-k;
				handMahJong.node.addChild(mj);
			}
			nStartCol++;
		};
	},
	getCardWithIndex:function(nIndex)
	{
		var child = null;
		var cbCount = 0;
		for(var k = 0; k < 4; k++)
		{
			for(var i = 0; i < 11; i++)
			{
				var child = handMahJong.node.getChildByName(i+'+'+k);
				if(child)
				{
					if(cbCount == nIndex)
					{
						return child;
					}
					cbCount++;
				}
			}
		}
		return child;
	},
	getCardCount:function(cardData)
	{
		var cbCardIndex = handMahJong.getCardIndex();
		return cbCardIndex[gameLogic.switchToCardIndex(cardData)];
	},
	getCardIndex:function()
	{
		var cbCardIndex = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		gameLogic.switchToCardIndexEx(handMahJong._cbCardData, handMahJong._cbCardCount, cbCardIndex);
		return cbCardIndex;
	},
	setOperateCard:function(cbCardData, nIndex)
	{
		if(mainScene._wMeChaird == INVALID_CHAIR)
		{
			if(nIndex == 0)
			{
				if(handMahJong.node.childrenCount >= 3)
				{
					for(var i = 0; i < 3; i++)
					{
						var child = handMahJong.node.children[handMahJong.node.childrenCount-1];
						child.visible = false;
						child.removeFromParent();
					}
				}
			}
			else if(nIndex == 2)
			{
				if(handMahJong.node.childrenCount >= 4)
				{
					for(var i = 0; i < 4; i++)
					{
						var child = handMahJong.node.children[handMahJong.node.childrenCount-1];
						child.visible = false;
						child.removeFromParent();
					}
				}
			}
			else
			{
				if(handMahJong.node.childrenCount >= 2)
				{
					for(var i = 0; i < 2; i++)
					{
						var child = handMahJong.node.children[handMahJong.node.childrenCount-1];
						child.visible = false;
						child.removeFromParent();
					}
				}
			}
		}
		else
		{
			for(var i = nIndex; i < 4; i++)
			{
		        for(var k = 0; k < handMahJong.node.childrenCount; k++)
		   		{
		   			var child = handMahJong.node.children[k];
		   			if (child.cbCardData == cbCardData[i])
		   			{
		   				child.removeFromParent();
		   				for(var j = 0; j < handMahJong._cbCardCount; j++)
		   				{
		   					if (handMahJong._cbCardData[j] == cbCardData[i])
		   					{
		   						handMahJong._cbCardData[j] = 0;
		   						handMahJong._cbCardCount -= 1;
		   						handMahJong._cbCardData.sort(function(a,b){return b-a;});
		   						break;
		   					}
		   				}
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
		handMahJong._cbCardData = [];
		handMahJong._cbCardCount = 0;
	}
};
//出牌管理器(吃碰后出牌 与  揭牌)
var outMahJong = 
{
	init:function(uiPlay)
	{
		outMahJong._bActEnd = false;
		outMahJong.node = [];
		outMahJong.bg = [];
		outMahJong.card = [];
		for(var i = 0; i < GAME_PLAYER; i++)
		{
			outMahJong.node[i] = new cc.Node();
			outMahJong.bg[i] = new cc.Sprite("#outBgY.png");
			outMahJong.card[i] = new cc.Sprite("#out1.png");
			outMahJong.node[i].visible = false;
			uiPlay.addChild(outMahJong.node[i], 2);
			outMahJong.node[i].addChild(outMahJong.bg[i]);
			outMahJong.node[i].addChild(outMahJong.card[i]);
		}
	},
	showOutCard:function(wChaird, cbOutCard, bOut, bWei, bTi)
	{
		outMahJong._bActEnd = false;
		var pos = 
		[
		cc.p(mainScene.ctPosX, mainScene.ctPosY),
		cc.p(tableData.getChairWithShowChairId(1).node.x - 300, tableData.getChairWithShowChairId(1).node.y - 20),
		cc.p(tableData.getChairWithShowChairId(2).node.x + 300, tableData.getChairWithShowChairId(2).node.y - 20),
		];
		if(bWei && !mainScene._bChouWei && ((wChaird == 0 && mainScene._wMeChaird == INVALID_CHAIR) || wChaird != 0))
		{
			outMahJong.bg[wChaird].setSpriteFrame("out0.png");
			outMahJong.bg[wChaird].color = cc.color(255, 255, 255);
			outMahJong.card[wChaird].color = cc.color(255, 255, 255);
		}
		else if(bOut)
		{
			outMahJong.bg[wChaird].setSpriteFrame("outBgB.png");
			outMahJong.bg[wChaird].color = cc.color(200, 200, 200);
			outMahJong.card[wChaird].color = cc.color(200, 200, 200);
		}
		else
		{
			outMahJong.bg[wChaird].setSpriteFrame("outBgY.png");
			outMahJong.bg[wChaird].color = cc.color(255, 255, 255);
			outMahJong.card[wChaird].color = cc.color(255, 255, 255);
		}
		if(bWei && !mainScene._bChouWei && gameLogic.switchViewChairID(mainScene._wMeChaird) != wChaird)
		{
			outMahJong.card[wChaird].setSpriteFrame('out'+0+'.png');
		}
		else
		{
			outMahJong.card[wChaird].setSpriteFrame('out'+cbOutCard+'.png');
		}
		outMahJong.node[wChaird].visible = true;
		outMahJong.node[wChaird].scale = 0;
		if (bOut) 
		{	
			if (wChaird == 0)
			{
				outMahJong.node[wChaird].scale = 1;
				outMahJong.node[wChaird].setPosition(pos[wChaird]);
			}
			else
			{
				outMahJong.node[wChaird].setPosition(tableData.getChairWithShowChairId(wChaird).node.getPosition());
			}
		}
		else
		{
			outMahJong.node[wChaird].setPosition(tableNode.leftCardNode._parent.getPosition());
		}
		var actionTo = cc.moveTo(0.25, pos[wChaird]);
		var actionScale = cc.scaleTo(0.25, 1);
		var func = function()
		{
			outMahJong._bActEnd = true;
			if (mainScene._bPao)
			{
				outMahJong.hide();
				mainScene.onSubOperatePao(mainScene._dataPao);
			}
			if(bTi || bWei)
			{
				mainScene.onSubOperateTPW(mainScene._newData);
			}
		}
		var callback = cc.callFunc(func, this);
		outMahJong.node[wChaird].runAction(cc.sequence(cc.spawn(actionTo, actionScale), cc.delayTime(0.2), callback));
	},
	onActionMove:function(wChaird, pos, func)
	{
		var actionTo = cc.moveTo(0.35, pos);
		var actionScale = cc.scaleTo(0.35, 0);
		var callback = cc.callFunc(func, this);
		outMahJong.node[wChaird].runAction(cc.sequence(cc.spawn(actionTo, actionScale), callback));
	},
	hide:function()
	{
		outMahJong.node[0].visible = false;
		outMahJong.node[1].visible = false;
		outMahJong.node[2].visible = false;
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
	addCardItem:function(wChaird, bOut, cbCardData, bShow)
	{
		var item = disCardControl.create(bOut, cbCardData);
		item.visible = bShow;
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
		if (!bShow)
		{
			var onActionEnd = function()
			{
				item.visible = true;
			};
			outMahJong.onActionMove(wChaird, item.getPosition(), onActionEnd);
		}
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
	create:function(wChaird, cbWeaveKind, cbCardData, cbCardIndex, bPublicCard)
	{
		var mahJong = null;
		var bShow = true;
		if(cbWeaveKind&(WIK_LEFT | WIK_CENTER | WIK_RIGHT) && cbCardIndex == 0)
			mahJong = new cc.Sprite("#sGray.png");
		else if(cbWeaveKind == WIK_TI && cbCardIndex != 0)
		{
			mahJong = new cc.Sprite("#s0.png");
			bShow = false;
		}
		else if(cbWeaveKind == WIK_WEI && cbCardIndex == 0 && (mainScene._bChouWei || bPublicCard))
		{
			mahJong = new cc.Sprite("#sJie.png");
			bShow = true;
		}
		else if(cbWeaveKind == WIK_WEI)
		{
			mahJong = new cc.Sprite("#s0.png");
			bShow = false;
		}
		else
			mahJong = new cc.Sprite("#sJie.png");
		mahJong._name = wChaird+'+'+cbWeaveKind+'+'+cbCardData+'+'+cbCardIndex;
		mahJong.spValue = new cc.Sprite(('#s'+cbCardData+'.png'));
		mahJong.spValue.x = mahJong.width/2;
		mahJong.spValue.y = mahJong.height/2;
		mahJong.addChild(mahJong.spValue);
		mahJong.spValue.visible = false;
		mahJong.cbCardIndex = cbCardIndex;
		mahJong.cbWeaveKind = cbWeaveKind;
		mahJong.cbCardData = cbCardData;
		if (bShow || (cbWeaveKind != WIK_TI && wChaird == 0 && mainScene._wMeChaird != INVALID_CHAIR))
		{
			mahJong.spValue.visible = true;
		}
		mahJong.scale = sMahJongScale;
		return mahJong;
	},
	modifyWeaveItem:function(wChaird, cbWeaveIndex, cbWeaveKind, cbCenterCard)
	{
		if(weaveControl.cbWeaveCount[wChaird] < cbWeaveIndex) return;
		if(weaveControl.cbWeaveArray[wChaird][cbWeaveIndex].cbCardArray[0] != cbCenterCard) return;
		//更新桌面胡息
		var cbWeaveKindSelf = weaveControl.cbWeaveArray[wChaird][cbWeaveIndex].cbWeaveKind;
		var cbCenterCardSelf = weaveControl.cbWeaveArray[wChaird][cbWeaveIndex].cbCardArray[0];
    	if(cbWeaveKindSelf == WIK_PENG)
    	{
	        if(gameLogic.isBigCard(cbCenterCardSelf))
	         	mainScene._cbYingXi[wChaird] -= 3;
	        else
	            mainScene._cbYingXi[wChaird] -= 1;
    	}
    	else if(cbWeaveKindSelf == WIK_WEI && (wChaird == 0 && mainScene._wMeChaird != INVALID_CHAIR))
    	{
	        if(gameLogic.isBigCard(cbCenterCardSelf))
	         	mainScene._cbYingXi[wChaird] -= 6;
	        else
	            mainScene._cbYingXi[wChaird] -= 3;
    	}
		weaveControl.cbWeaveArray[wChaird][cbWeaveIndex].cbWeaveKind = cbWeaveKind;
		weaveControl.cbWeaveArray[wChaird][cbWeaveIndex].cbCardArray[3] = cbCenterCard;
		var item = weaveControl.create(wChaird, cbWeaveKind, cbCenterCard, 3);
		weaveControl.node.addChild(item);
		var x = 0;
		var y = 0;
		for(var i = 0; i < weaveControl.node.childrenCount; i++)
		{
			var child = weaveControl.node.children[i];
			if (child.cbCardData == cbCenterCard && (child.cbWeaveKind == WIK_WEI || child.cbWeaveKind == WIK_PENG))
			{
				if (cbWeaveKind == WIK_PAO || (cbWeaveKind == WIK_TI && child.cbCardIndex == 0))
				{
					child.setSpriteFrame("sJie.png");
					child.spValue.visible = true;
				}
				else
					child.spValue.visible = false;
				if (child.cbCardIndex == 2)
				{
					x = child.x;
					y = child.y;
				}
			}
		}	
		item.x = x;
		item.y = y - item.height*sMahJongScale;

    	if(cbWeaveKind == WIK_TI)
    	{
	        if(gameLogic.isBigCard(cbCenterCard))
	         	mainScene._cbYingXi[wChaird] += 12;
	        else
	            mainScene._cbYingXi[wChaird] += 9;
    	}
    	else if(cbWeaveKind == WIK_PAO)
    	{
	        if(gameLogic.isBigCard(cbCenterCard))
	         	mainScene._cbYingXi[wChaird] += 9;
	        else
	            mainScene._cbYingXi[wChaird] += 6;
    	}
		tableNode['lbYingXi'+wChaird].setString(mainScene._cbYingXi[wChaird]);
	},
	addWeaveItem:function(wChaird, cbWeaveKind, cbCardArray, nIndex, bPublicCard)
	{
		if(cbCardArray[0] == 0) return;
		//更新桌面胡息
    	if(cbWeaveKind == WIK_PENG)
    	{
	        if(gameLogic.isBigCard(cbCardArray[0]))
	         	mainScene._cbYingXi[wChaird] += 3;
	        else
	            mainScene._cbYingXi[wChaird] += 1;
    	}
    	else if(cbWeaveKind == WIK_WEI && (wChaird == 0 && mainScene._wMeChaird != INVALID_CHAIR))
    	{
	        if(gameLogic.isBigCard(cbCardArray[0]))
	         	mainScene._cbYingXi[wChaird] += 6;
	        else
	            mainScene._cbYingXi[wChaird] += 3;
    	}
    	else if(cbWeaveKind == WIK_TI)
    	{
	        if(gameLogic.isBigCard(cbCardArray[0]))
	         	mainScene._cbYingXi[wChaird] += 12;
	        else
	            mainScene._cbYingXi[wChaird] += 9;
    	}
    	else if(cbWeaveKind == WIK_PAO)
    	{
	        if(gameLogic.isBigCard(cbCardArray[0]))
	         	mainScene._cbYingXi[wChaird] += 9;
	        else
	            mainScene._cbYingXi[wChaird] += 6;
    	}
    	else
    	{
    		var cbCardData = cbCardArray.concat();
    		cbCardData.sort(function(a, b) {return b > a});
    		if (cbCardData[2] == 1 && cbCardData[1] == 2 && cbCardData[0] == 3 ||
    			cbCardData[2] == 2 && cbCardData[1] == 7 && cbCardData[0] == 10) 
    		{
    			mainScene._cbYingXi[wChaird] += 3;
    		}
    		if (cbCardData[2] == 0x11 && cbCardData[1] == 0x12 && cbCardData[0] == 0x13 ||
    			cbCardData[2] == 0x12 && cbCardData[1] == 0x17 && cbCardData[0] == 0x1A) 
    		{
    			mainScene._cbYingXi[wChaird] += 6;
    		}
    	}
    	tableNode['lbYingXi'+wChaird].setString(mainScene._cbYingXi[wChaird]);
    	tableNode['huxiNode'+wChaird].visible = true;
    	weaveControl.cbWeaveArray[wChaird][weaveControl.cbWeaveCount[wChaird]].bPublicCard = bPublicCard;
		weaveControl.cbWeaveArray[wChaird][weaveControl.cbWeaveCount[wChaird]].cbWeaveKind = cbWeaveKind;
		weaveControl.cbWeaveArray[wChaird][weaveControl.cbWeaveCount[wChaird]].cbCardArray = [];
		weaveControl.cbWeaveArray[wChaird][weaveControl.cbWeaveCount[wChaird]].cbCardArray = cbCardArray;
		weaveControl.cbWeaveArray[wChaird][weaveControl.cbWeaveCount[wChaird]].cbCenterCard = cbCardArray[0];
		var cbCount = 3;
		if(cbWeaveKind == WIK_TI || cbWeaveKind == WIK_PAO)
		{
			cbCount = 4;
		}
		for(var i = 0; i < cbCount; i++)
		{
			var item = weaveControl.create(wChaird, cbWeaveKind, cbCardArray[i], i, bPublicCard);
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
		if(wChaird == 0 && nIndex != INVALID_CHAIR)
		{
			handMahJong.setOperateCard(cbCardArray, nIndex);
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
		tableNode['lbYingXi'+0].setString('0');
		tableNode['lbYingXi'+1].setString('0');
		tableNode['lbYingXi'+2].setString('0');
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
//听牌管理器
var tingWnd = 
{
	init:function(uiPlay)
	{
		tingWnd.node = new cc.Node();
		tingWnd.node.visible = false;
		tingWnd.node.x = mainScene.ctPosX;
		tingWnd.node.y = mainScene.ctPosY;
		uiPlay.addChild(tingWnd.node, ZORDER_MAX);
		tingWnd._tingData = [];
	},
	updataTing:function(wChaird)
	{
		return;
		// var tingData = []
		// for(var i = 0; i < 6; i++)
		// {
		// 	tingData[i] = {};
		// 	tingData[i].cbCardData = i+1;
		// 	tingData[i].wBeiShu = i;
		// 	tingData[i].cbLeftNum = i;
		// 	tingData[i].bZimo = i;
		// }
		if (wChaird == mainScene._wMeChaird &&  mainScene._wMeChaird != INVALID_CHAIR) 
		{
			tingWnd._tingData = gameLogic.analyseTing(wChaird);
			tingWnd.node.removeAllChildren();
			if (tingWnd._tingData.length > 0) 
			{
				var bg = new cc.Scale9Sprite("tingBg.png");
		      	bg.width = 180 + tingWnd._tingData.length*90;
		      	bg.height = 210;
		      	tingWnd.node.addChild(bg);

		      	var	sprHu = new cc.Sprite("#tingHu.png");
		      	sprHu.x = 90;
		      	sprHu.y = 170;
		      	var	sprBs = new cc.Sprite("#tingBeiShu.png");
		      	sprBs.x = 90;
		      	sprBs.y = 120;
		      	var	sprSz = new cc.Sprite("#tingSZ.png");
		      	sprSz.x = 90;
		      	sprSz.y = 80;
		      	var	sprZm = new cc.Sprite("#tingZM.png");
		      	sprZm.x = 90;
		      	sprZm.y = 40;
		      	bg.addChild(sprHu);
		      	bg.addChild(sprBs);
		      	bg.addChild(sprSz);
		      	bg.addChild(sprZm);

		      	for(var i = 0; i < tingWnd._tingData.length; i++)
		      	{
		      		var card = disCardControl.create(false, tingWnd._tingData[i].cbCardData);
		      		card.x = 180+i*90;
		      		card.y = 170;
		      		bg.addChild(card);

			        var lbBeiShu = new cc.LabelTTF(tingWnd._tingData[i].wBeiShu, "Helvetica-bold", 24);
			        lbBeiShu.setString(tingWnd._tingData[i].wBeiShu);
			        lbBeiShu.color = cc.color(244, 230, 159);
			        lbBeiShu.x = 180+i*90;
			        lbBeiShu.y = 120;
			        bg.addChild(lbBeiShu);

			        var lbLeftNum = new cc.LabelTTF(tingWnd._tingData[i].cbLeftNum, "Helvetica-bold", 24);
			        lbLeftNum.setString(tingWnd._tingData[i].cbLeftNum);
			        lbLeftNum.color = cc.color(244, 230, 159);
			        lbLeftNum.x = 180+i*90;
			        lbLeftNum.y = 80;
			        lbLeftNum._name = 'lbLeftNum'+i;
			        bg.addChild(lbLeftNum);

			        var lbZiMo = new cc.LabelTTF('是', "Helvetica-bold", 24);
			        if (!tingWnd._tingData[i].bZimo) 
			        	lbZiMo.setString("否");
			        lbZiMo.color = cc.color(244, 230, 159);
			        lbZiMo.x = 180+i*90;
			        lbZiMo.y = 40;
			        bg.addChild(lbZiMo);
		      	}
				tingWnd.node.visible = true;
				tableNode.btnTingNode.visible = true;
			}
			else
			{
				tingWnd.node.visible = false;
				tableNode.btnTingNode.visible = false;
			}
		}
	},
	updataLeftCard:function()
	{
		return;
		var cbCardIndex = gameLogic.getAllCardIndex().concat();
		for(var i = 0; i < tingWnd._tingData.length; i++)
		{
			var child = tingWnd.node.children[0].getChildByName('lbLeftNum'+i);
			if (child) 
			{
				if (cbCardIndex[gameLogic.switchToCardIndex(tingWnd._tingData[i].cbCardData)] < 4) 
				{
					child.setString(4-cbCardIndex[gameLogic.switchToCardIndex(tingWnd._tingData[i].cbCardData)]);
				}
				else
				{
					child.setString('0');
				}
			}
		}
	},
	clear:function()
	{
		tingWnd.node.removeAllChildren();
		tingWnd._tingData = [];
	}
};
//GM管理器
var gameGM = 
{
	create:function()
	{
		if(gameGM.node && gameGM.node._parent) return;
		gameGM.wChaird = 0;
		gameGM.cbCardCount = [0, 0, 0];
		gameGM.cbCardData = [
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		];
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
        gameGM.btnCancel.x = -430;
        gameGM.btnCancel.y = 250;

        gameGM.btnUser0 = new ccui.Button(resp.btnChi);
		gameGM.btnUser0.addTouchEventListener(this.onTouchEvent, this);
        gameGM.node.addChild(gameGM.btnUser0);
        gameGM.btnUser0.x = -430;
        gameGM.btnUser0.y = 150;

        gameGM.btnUser1 = new ccui.Button(resp.btnPeng);
		gameGM.btnUser1.addTouchEventListener(this.onTouchEvent, this);
        gameGM.node.addChild(gameGM.btnUser1);
        gameGM.btnUser1.x = -430;
        gameGM.btnUser1.y = 50;

        gameGM.btnUser2 = new ccui.Button(resp.btnGang);
		gameGM.btnUser2.addTouchEventListener(this.onTouchEvent, this);
        gameGM.node.addChild(gameGM.btnUser2);
        gameGM.btnUser2.x = -430;
        gameGM.btnUser2.y = -50;

        gameGM.btnSendCard = new ccui.Button(resp.btnPass);
		gameGM.btnSendCard.addTouchEventListener(this.onTouchEvent, this);
        gameGM.node.addChild(gameGM.btnSendCard);
        gameGM.btnSendCard.x = -430;
        gameGM.btnSendCard.y = -150;

		gameGM.btnOk = new ccui.Button(resp.btnHu);
		gameGM.btnOk.addTouchEventListener(this.onTouchEvent, this);
        gameGM.node.addChild(gameGM.btnOk);
        gameGM.btnOk.x = -430;
        gameGM.btnOk.y = -250;

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
        }
        gameGM.handNode = [];
        gameGM.handNode[0] = new cc.Node();
        gameGM.handNode[1] = new cc.Node();
        gameGM.handNode[2] = new cc.Node();
		gameGM.node.addChild(gameGM.handNode[0]);
		gameGM.node.addChild(gameGM.handNode[1]);
		gameGM.node.addChild(gameGM.handNode[2]);
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
 				if((item.row == 0 || item.row > 2) && gameGM.wChaird != INVALID_CHAIR)
 				{
 					var fScale = 0.8;
 					if (mainScene._bGameStart) 
 					{
 						if(item.row == 3)
		            	{
		            		for(var i = 0; i < gameGM.cbCardCount[0]; i++)
		            		{
		            			if(item.cbCardData == gameGM.cbCardData[0][i])
		            			{
		            				gameGM.cbCardData[0][i] = 0;
		            				break;
		            			}
		            		}
		            		item.removeFromParent();
							gameGM.cbCardCount[0]--;
		            	}
		            	else if(item.row == 0 && gameGM.cbCardCount[0] < handMahJong.node.childrenCount)
		            	{
		            		gameGM.cbCardData[0][gameGM.cbCardCount[0]] = item.cbCardData;
					        gameGM.cbCardCount[0]++;
		            	}
		            	gameGM.cbCardData[0].sort(function(a, b){return b-a;});
		            	var sx = -gameGM.width*5;
					    var sy = -80;
					    gameGM.handNode[0].removeAllChildren();
		            	for(var i = 0; i < gameGM.cbCardCount[0]; i++)
		            	{
					        var mj = mahJong.create(gameGM.cbCardData[0][i]);
					        mj.x = sx + (i%10)*mj.width+(i%10)*8;
					        mj.y = sy - Math.floor(i/10)*mj.height*fScale - Math.floor(i/10);
					        mj.row = 3;
					        mj.scale = fScale;
					        gameGM.handNode[0].addChild(mj);
					        var listener = gameGM.getListener(mj);
			        		cc.eventManager.addListener(listener, mj);
		            	}
 					}
 					else
 					{
 						if(item.row == 3+gameGM.wChaird)
		            	{
		            		for(var i = 0; i < MAX_COUNT-1; i++)
		            		{
		            			if(item.cbCardData == gameGM.cbCardData[gameGM.wChaird][i])
		            			{
		            				gameGM.cbCardData[gameGM.wChaird][i] = 0;
		            				break;
		            			}
		            		}
		            		item.removeFromParent();
							gameGM.cbCardCount[gameGM.wChaird]--;
		            	}
		            	else if(item.row == 0 && gameGM.cbCardCount[gameGM.wChaird] < MAX_COUNT-1)
		            	{
		            		gameGM.cbCardData[gameGM.wChaird][gameGM.cbCardCount[gameGM.wChaird]] = item.cbCardData;
					        gameGM.cbCardCount[gameGM.wChaird]++;
		            	}
		            	gameGM.cbCardData[gameGM.wChaird].sort(function(a, b){return b-a;});
		            	var sx = -gameGM.width*5;
					    var sy = [80, -60, -200];
					    gameGM.handNode[gameGM.wChaird].removeAllChildren();
		            	for(var i = 0; i < gameGM.cbCardCount[gameGM.wChaird]; i++)
		            	{
					        var mj = mahJong.create(gameGM.cbCardData[gameGM.wChaird][i]);
					        mj.x = sx + (i%10)*mj.width+(i%10)*8;
					        mj.y = sy[gameGM.wChaird] - Math.floor(i/10)*mj.height*fScale - Math.floor(i/10);
					        mj.row = 3+gameGM.wChaird;
					        mj.scale = fScale;
					        gameGM.handNode[gameGM.wChaird].addChild(mj);
					        var listener = gameGM.getListener(mj);
			        		cc.eventManager.addListener(listener, mj);
		            	}
 					}
 				}
 				else if(gameGM.wChaird == INVALID_CHAIR && item.row == 0)
 				{
 					gameGM.sendNode.removeAllChildren();
					var mj = mahJong.create(item.cbCardData);
			        mj.x = 450;
			        mj.y = 0;
			        mj.row = 2;
			        gameGM.sendNode.addChild(mj);
			        var listener = gameGM.getListener(mj);
	        		cc.eventManager.addListener(listener, mj);
	        		gameGM.cbSendCard = item.cbCardData;
 				}
 				else if(item.row == 2)
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
			gameGM.node.removeFromParent();
			var gm = getObjWithStructName('CMD_C_GAME_GM');
			gm.cbCardData0 = [];
			gm.cbCardData1 = [];
			gm.cbCardData2 = [];
			gm.cbCardData0 = gameGM.cbCardData[0];
			gm.cbCardData1 = gameGM.cbCardData[1];
			gm.cbCardData2 = gameGM.cbCardData[2];
			gm.cbSendData = gameGM.cbSendCard;
			socket.sendMessage(MDM_GF_GAME, SUB_C_GAME_GM, gm); 
    	}
    	else if (render == gameGM.btnUser0) 
    	{
    		gameGM.wChaird = 0;
    	}
    	else if (render == gameGM.btnUser1) 
    	{
    		gameGM.wChaird = 1;
    	}
    	else if (render == gameGM.btnUser2) 
    	{
    		gameGM.wChaird = 2;
    	}
    	else if (render == gameGM.btnSendCard) 
    	{
    		gameGM.wChaird = INVALID_CHAIR;
    	}

	},
};