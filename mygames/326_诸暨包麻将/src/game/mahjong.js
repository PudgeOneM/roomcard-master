var INVALID_NINDEX = 255;
var SNED_INDEX = 14;
var MAX_DISCARD = 24;
var SHOOT_DISTANCE = 25;
var DISCARD_ROW_COUNT = 11;
var HUACARD_ROW_COUNT = 30;
var MAGIC_COLOR = cc.color(84, 255, 159);

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

		mahJong.baopi = new cc.Sprite("#laizi.png");
		mahJong.addChild(mahJong.baopi);
		mahJong.baopi.x = 45;
		mahJong.baopi.y = 20;
		mahJong.baopi.visible = false;
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
		var mahJongScale = (gameWidth-40)/MAX_COUNT/mahJong.width;
		handMahJong.cbMagicCard=[]
		handMahJong.cbMagicCard[0]=0;
		handMahJong.cbMagicCard[1]=0;
		handMahJong.bMoveX = false;
        handMahJong.bMoveY = false;
		handMahJong.node = new cc.Node();
		uiPlay.addChild(handMahJong.node,2);
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

    	handMahJong.isXuanCS = false;
    	//规则: 吃牌后不可以出吃的牌
    	handMahJong.cbCantEatCard = []
    	handMahJong.cbCantEatCard[0]=0x00
    	handMahJong.cbCantEatCard[1]=0x00
	},
	getListener:function(target)
    {   
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
           onTouchBegan: function (touch, event) {
           		if(mainScene._wMeChaird == INVALID_CHAIR) return false;
           		if(handMahJong.control[1].visible == false) return false;
           		//outMahJong.hideOutCard();
       	        for (var i = 0; i < MAX_COUNT; i++) {
       	        	if(handMahJong.control[i].visible == false) continue;
            		if(handMahJong.control[i].enable == false) continue;
            		if(handMahJong.cbCantEatCard[0] == handMahJong.control[i].cbCardData )continue;
            		if(handMahJong.cbCantEatCard[1] == handMahJong.control[i].cbCardData )continue;

            		var locationInNode = handMahJong.control[i].convertToNodeSpace(touch.getLocation());
	                var s = handMahJong.control[i].getContentSize();
	                var rect = cc.rect(0, 0, s.width, s.height);
	                if (cc.rectContainsPoint(rect, locationInNode)) {
	                    handMahJong.setOnEnter(i);
	                    handMahJong.bTouch = true;

	                    if(!handMahJong.isXuanCS)
	                    {

	                   	 	outMahJong.showOutCard(0, handMahJong.control[i].cbCardData);
	                   	 	handMahJong.setControlPos(INVALID_NINDEX);
	                   	 	//handMahJong.control[i].y += SHOOT_DISTANCE;
	            			handMahJong.setOutCard(i);
	                   	 	return false;
	                    }
	                   
	                    return true;
	                }
        		};
                return false;
            },
            onTouchMoved:function(touch, event)
            {
            	if(handMahJong.isXuanCS)
            		return false;
            	if(!handMahJong.bTouch) return false;
            	if(handMahJong.control[1].visible == false) return false;
            	if(mainScene._wCurrentUser != mainScene._wMeChaird) return;
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
		                	if(!handMahJong.isXuanCS)
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
	                	if(handMahJong.control[i].y >= handMahJong.uy )
	                	{
	                		handMahJong.control[i].bShoot = false;
	                		handMahJong.control[i].y -= SHOOT_DISTANCE;
	                		handMahJong.setControlPos(INVALID_NINDEX);

	                		if(handMahJong.isXuanCS)
	                		{
	                			for(var n=0;n<MAX_CS_TYPE;n++)
		                			handMahJong.cbMagicCard[n] =0;
	                			
	                		}
	                	}
	                	else
	                	{
	                		handMahJong.control[i].bShoot = false;
	              	  		handMahJong.control[i].y -= SHOOT_DISTANCE;
	              	  		if(handMahJong.isXuanCS)
	              	  		{
	              	  			for(var n=0;n<MAX_CS_TYPE;n++)
		                			handMahJong.cbMagicCard[n] =0;
	              	  			handMahJong.setControlPos(INVALID_NINDEX,true);
	              	  		}
	              	  		else
	                			handMahJong.setControlPos(INVALID_NINDEX);
	                	}
                	
	                }
	                else
	                {
	                	if(handMahJong.isXuanCS)
	                	{
	                		var isReset = true
	                		for(var n=0;n<mainScene._cbMagicCount;n++)
	                			if(!handMahJong.cbMagicCard[n])
	                				isReset=false;
	    
	                		if(isReset)
	                		{
	                			handMahJong.setControlPos(INVALID_NINDEX);
	                			for(var n=0;n<MAX_CS_TYPE;n++)
		                			handMahJong.cbMagicCard[n] =0;
	                		}

	                		for(var n=0;n<mainScene._cbMagicCount;n++)
	                		{
	                			if(!handMahJong.cbMagicCard[n])
	                			{
	                				handMahJong.cbMagicCard[n] =  handMahJong.control[i].cbCardData;
	                				break;
	                			}
	                		}

	                		if(handMahJong.cbMagicCard[0])
	                		{
	                			var cbColor = (handMahJong.cbMagicCard[0]&MASK_COLOR)>>4;
	                			var cbValue=(handMahJong.cbMagicCard[0]&MASK_VALUE);
		                		//花色不同，重新选财神
		                		for(var n=1;n<mainScene._cbMagicCount;n++)
		                		if(handMahJong.cbMagicCard[n])
		                			{
		                				var tempColor = (handMahJong.cbMagicCard[n]&MASK_COLOR)>>4;
			                			if(cbColor!= tempColor)
			                			{
						                	isReset = true
						                	break;
			                			}
			                			else 
			                			{
			                				var cbTempValue = (handMahJong.cbMagicCard[n]&MASK_VALUE) -cbValue;
			                				if(!(cbTempValue==1 ||cbTempValue==-1||cbTempValue==8||cbTempValue==-8||cbColor==3))
			                				{
			                					isReset = true;
						                		break;
			                				}

			                			}
		                			}
		                		
		                		if(!isReset&&cbColor ==3)
		                		{
		                			for(var n=1;n<mainScene._cbMagicCount;n++)
		                			{
		                				if(handMahJong.cbMagicCard[n])
			                			{
			                				var tempValue = handMahJong.cbMagicCard[n]&MASK_VALUE;
				                			if(cbValue>=5 &&tempValue<5)
				                			{
							                	isReset = true
							                	break;
				                			}
				                			else if(cbValue<5&&tempValue>=5)
				                			{
												isReset = true
							                	break;
				                			}
				                			else if (cbValue == tempValue)
				                			{
				                				isReset = true
							                	break;
				                			}

				                			var tempValue2 = cbValue - tempValue
				                			if(cbValue<5)
				                			{
				                				if(!(tempValue2==-1|| tempValue2==1||tempValue2==3||tempValue2==-3))
				                				{
				                					isReset = true
							                		break;
				                				}
				                			}
			                			}
		                			}
		                			
		                		}
	                		}
							if(isReset)
	                		{
	                			handMahJong.setControlPos(INVALID_NINDEX);
	                			for(var n=0;n<MAX_CS_TYPE;n++)
		                			handMahJong.cbMagicCard[n] =0;

		                		handMahJong.cbMagicCard[0] =  handMahJong.control[i].cbCardData;
	                		}

	                		handMahJong.setControlPos(i,true);
	                	}
	                	else
	                	{
	                		handMahJong.setControlPos(i);
	                	}
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

    //获取定财的左右可选牌，是否存在
    getNearMagic:function(cbMagicCard)
    {
    	var cbMagicColor = (cbMagicCard&MASK_COLOR)>>4;
	    var cbMagicValue=(cbMagicCard&MASK_VALUE);


	    for (var i = 0; i < MAX_COUNT; i++) 
	    {
	    	if(handMahJong.control[i].visible == false) continue;
            if(handMahJong.control[i].enable == false) continue;
	    	var cbColor = (handMahJong.control[i].cbCardData&MASK_COLOR)>>4;
	    	if(cbColor!= cbMagicColor)
	    		continue;

	    	var cbValue=(handMahJong.control[i].cbCardData&MASK_VALUE);

	    	var cbTempValue = cbMagicValue -cbValue;
	    	//北和中不能组合
	    	if(cbColor ==3)
	    	{
	    		if(cbValue>=5 &&cbMagicValue<5)
				{
	            	continue;
				}
				else if(cbValue<5&&cbMagicValue>=5)
				{
					continue;
				}

				if(cbValue<5)
				{
					if(cbTempValue==-1||cbTempValue==-3)
					{
						return 1;
					}
					if(cbTempValue==1||cbTempValue==3)
					{
						return 2;
					}
				}
	    	}
	    	
	    	if(cbTempValue==-1||cbTempValue==-8)
			{
				return 1;
			}
			if(cbTempValue==1||cbTempValue==8)
			{
				return 2;
			}
	    }
	    return 0;
    },


	//每次操作麻将都要重置位置   参数：抬起的麻将的索引
	setControlPos:function(shootIndex,isRecover)
	{
		var fx = topUI.node.width - handMahJong.mjWidth - 30 - handMahJong.mjWidth/2;
		var fy = 5+handMahJong.control[0].height/2;
		if(!isRecover)
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
	setControlPosOnly:function(shootIndex)
	{
		var fx = topUI.node.width - handMahJong.mjWidth - 30 - handMahJong.mjWidth/2;
		var fy = 5+handMahJong.control[0].height/2;
		if (shootIndex != INVALID_NINDEX) 
		{
			handMahJong.control[shootIndex].bShoot = true;
			handMahJong.control[shootIndex].y = fy + SHOOT_DISTANCE;
		}
	},
	reSetControlPos:function()
	{
		var fx = topUI.node.width - handMahJong.mjWidth - 30 - handMahJong.mjWidth/2;
		var fy = 5+handMahJong.control[0].height/2;
		for (var i = 0; i < MAX_COUNT; i++) 
		{
			handMahJong.control[i].bShoot = false;
			if (i == 0)
				handMahJong.control[i].setPosition(fx + handMahJong.mjWidth + 20, fy);
			else
				handMahJong.control[i].setPosition(fx - (i-1) * handMahJong.mjWidth+1*i, fy);
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
			handMahJong.control[i].baopi.visible = false;
			handMahJong.control[i].color = cc.color(255, 255, 255);
			for (var j = 0; j < handMahJong.control[i].childrenCount; j++) {
				handMahJong.control[i].children[j].color = cc.color(255, 255, 255);
			};
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
				}
				else if (handMahJong.control[i].cbCardData == 81)
				{
					handMahJong.control[i].setSpriteFrame('down_user_bg.png');
					handMahJong.control[i].spValue.visible = false;
				}
				else
				{
					handMahJong.control[i].setSpriteFrame('down_user_bg.png');
					handMahJong.control[i].spValue.setSpriteFrame('value_'+handMahJong.control[i].cbCardData+'.png');
					handMahJong.control[i].spValue.visible = true;
				}
				handMahJong.control[i].visible = true;
				var cbCardIndex =gameLogic.switchToCardIndex(cbCardData[i]);
				if (cbCardIndex == mainScene._cbMagicIndex)
				{
					handMahJong.control[i].baopi.visible = true;
				}
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
				}
				else if (handMahJong.control[i].cbCardData == 81)
				{
					handMahJong.control[i].setSpriteFrame('down_user_bg.png');
					handMahJong.control[i].spValue.visible = false;
				}
				else
				{
					handMahJong.control[i].setSpriteFrame('down_user_bg.png');
					handMahJong.control[i].spValue.setSpriteFrame('value_'+handMahJong.control[i].cbCardData+'.png');
					handMahJong.control[i].spValue.visible = true;
				}
				handMahJong.control[i].visible = true;
				var cbCardIndex =gameLogic.switchToCardIndex(cbCardData[i-1]);
				if (cbCardIndex == mainScene._cbMagicIndex)
				{
					handMahJong.control[i].baopi.visible = true;
				}
			}
		}
	},
	setOperateCard:function(cbCardData, cbCardCount)
	{
		if (mainScene._wMeChaird == INVALID_CHAIR)
		{
			handMahJong.cbCardCount = handMahJong.cbCardCount - cbCardCount;
			handMahJong.setCardData(handMahJong.cbCardData, handMahJong.cbCardCount, false);
			return;
		}
		for (var i = 0; i < cbCardCount; i++) {
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
		mainScene.sortHandCard(handMahJong.cbCardData);
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
	getMagicCount:function()
	{
		var cbMagicCount=0;
		for(var i=0;i<handMahJong.cbCardCount;i++)
		{
			for(var n=0;n<MAX_CS_TYPE;n++)
			{
				if(handMahJong.cbMagicCard[n]&&handMahJong.cbMagicCard[n]==handMahJong.cbCardData[i])
				{
					cbMagicCount++;
					break;
				}
			}
		}
		return cbMagicCount;
	},
	isCardExist:function(card)
	{
		for(var i=0;i<handMahJong.cbCardCount;i++)
		{
			if(handMahJong.cbCardData[i] ==card)
			{
				//判断是否为癞子牌
				for(var n=0;n<MAX_CS_TYPE;n++)
				{
					if(handMahJong.cbMagicCard[n]&&handMahJong.cbMagicCard[n]==card)
					{
						return false;
					}
				}
				return true;
			}
		}

		return false;
	},
	isMagicCard:function(card)
	{
		for(var n=0;n<MAX_CS_TYPE;n++)
		{
			if(handMahJong.cbMagicCard[n]&&handMahJong.cbMagicCard[n]==card)
			{
				return true;
			}
		}
		return false;
	},

	sendCardData:function(cbCardData)
	{
		var cbCardDataNew = [];
		cbCardDataNew[0] = cbCardData;
		for (var i = 0; i < handMahJong.cbCardCount; i++) {
			cbCardDataNew[i+1] = handMahJong.cbCardData[i];
		};
		handMahJong.setCardData(cbCardDataNew, handMahJong.cbCardCount+1, true);
	},
	setHuaCardData:function(cbHuaData, cbBuHuaData)
	{
		for (var i = 0; i < MAX_COUNT; i++) {
			if(cbHuaData[i] == 0) break;
			for (var j = 0; j < handMahJong.cbCardCount; j++) 
			{
				if (cbHuaData[i] == handMahJong.cbCardData[j]) 
				{
					handMahJong.cbCardData[j] = cbBuHuaData[i];
					break;
				}
			}
		};
		handMahJong.setCardData(handMahJong.cbCardData, handMahJong.cbCardCount, handMahJong.control[0].visible);
	},
	setCardEnable:function(bEnable,bSort)
	{
		for (var i = 0; i < MAX_COUNT; i++) 
		{
			handMahJong.control[i].enable = bEnable;
			if(handMahJong.cbCantEatCard[0] == handMahJong.control[i].cbCardData|| handMahJong.cbCantEatCard[1] == handMahJong.control[i].cbCardData)
			{
				handMahJong.control[i].color = cc.color(125, 125, 125);
			}
		};

		if(bEnable == true )
		{
			handMahJong.control[0].enable = true;
			handMahJong.control[0].color = cc.color(255, 255, 255);
		}

		handMahJong.showMagicCard(bEnable,bSort)
	},

	showMagicCard:function(bstate,bSort)
	{
		if(bSort==true)
		{
			mainScene.sortHandCard(handMahJong.cbCardData);
			handMahJong.setCardData(handMahJong.cbCardData, handMahJong.cbCardCount, bstate);
		}
		for (var i = 0; i < MAX_COUNT; i++) 
		{
			for(var n=0;n<MAX_CS_TYPE;n++)
			{
				if(handMahJong.cbMagicCard[n] 
					&&handMahJong.cbMagicCard[n] == handMahJong.control[i].cbCardData)
				{
					handMahJong.control[i].color = MAGIC_COLOR;
					break;
				}
			}

			if(handMahJong.cbCantEatCard[0] == handMahJong.control[i].cbCardData|| handMahJong.cbCantEatCard[1] == handMahJong.control[i].cbCardData)
			{
				handMahJong.control[i].color = cc.color(125, 125, 125);
			}
		}
	},

	setCardEnableFalse:function()
	{
		for (var i = 0; i < MAX_COUNT; i++) 
		{
			handMahJong.control[i].enable = false;
			//handMahJong.control[i].color = cc.color(125, 125, 125);
		}
	},
	setCardEnableTrue:function()
	{
		for (var i = 0; i < MAX_COUNT; i++) 
		{
			handMahJong.control[i].enable = true;
			handMahJong.control[i].color = cc.color(255, 255, 255);
		}
	},

	setCardColorFalse:function()
	{
		for (var i = 0; i < MAX_COUNT; i++) 
		{
			handMahJong.control[i].color = cc.color(125, 125, 125);
		}
	},

	setCardEnableByValue:function(bEnable,value)
	{
		for (var i = 0; i < MAX_COUNT; i++) 
		{
			if(value == handMahJong.control[i].cbCardData)
			{
				handMahJong.control[i].enable = bEnable;
				handMahJong.control[i].color = cc.color(255, 255, 255)
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

		mainScene._wCurrentUser = INVALID_CHAIR;
		operateBtn.hideOperate();
	},
	clearCardData:function()
	{
		handMahJong.node.removeAllChildren();
		handMahJong.cbCardData = [];
		handMahJong.cbCardCount = MAX_COUNT;
		handMahJong.control = [];
	}
}; 
var otherMahJong = {
	init:function(uiPlay)
	{
		otherMahJong.node = new cc.Node();
		uiPlay.addChild(otherMahJong.node,1);
	},
	setControlPos:function(wChaird)
	{
		gameLog.log("getChairWithShowChairId")
		gameLog.log(wChaird)

		var headX = tableData.getChairWithShowChairId(wChaird).node.x;
		var headY = tableData.getChairWithShowChairId(wChaird).node.y;
		switch(wChaird)
		{
			case 1:
			fx = headX - 65;
			fy = headY + 50*SCALE_H_NO_MOBILE+45;
			for (var i = 0; i < MAX_COUNT; i++) {
				otherMahJong.control[wChaird][i].scale = SCALE_H_NO_MOBILE;
				if(i == 0)
					otherMahJong.control[wChaird][i].setPosition(fx, fy + 35*SCALE_H_NO_MOBILE);
				else
					otherMahJong.control[wChaird][i].setPosition(fx, fy - i * 25*SCALE_H_NO_MOBILE);
				
			}
			break;
			case 2:
			fx = headX + 95;;
			fy = headY;
			for (var i = 0; i < MAX_COUNT; i++) {
				if(i == 0)
					otherMahJong.control[wChaird][i].setPosition(fx - 25, fy);
				else
					otherMahJong.control[wChaird][i].setPosition(fx + i * 37, fy);
			}
			break;
			case 3:
			fx = headX + 65;
			fy = headY - 235*SCALE_H_NO_MOBILE-45;
			for (var i = 0; i < MAX_COUNT; i++) {
				otherMahJong.control[wChaird][i].scale = SCALE_H_NO_MOBILE;
				if(i == 0)
					otherMahJong.control[wChaird][i].setPosition(fx, fy - 35*SCALE_H_NO_MOBILE);
				else
					otherMahJong.control[wChaird][i].setPosition(fx, fy + i * 25*SCALE_H_NO_MOBILE);
			}
			break;
		}
	},
	setCardData:function(bAddChild)
	{
		var res = [
		"",
		"#right_user_bg.png",
		"#up_user_bg.png",
		"#left_user_bg.png"
		];
		otherMahJong.control = [];
		otherMahJong.cbCardCount = [];
		for (var i = 1; i < GAME_PLAYER; i++) {
			otherMahJong.control[i] = [];
			otherMahJong.cbCardCount[i] = MAX_COUNT;
			for (var k = 0; k < MAX_COUNT; k++) {
				otherMahJong.control[i][k] = new cc.Sprite(res[i]);
				otherMahJong.control[i][0].visible = false;
				if (bAddChild)
				{
					if (i == 3) 
						otherMahJong.node.addChild(otherMahJong.control[i][k], MAX_COUNT - k);
					else
						otherMahJong.node.addChild(otherMahJong.control[i][k]);
				}
			}
			otherMahJong.setControlPos(i);
		}
		otherMahJong.huaPosLeftY = otherMahJong.control[3][13].y;
		otherMahJong.huaPosRightY = otherMahJong.control[1][13].y;
	},
	sendCardData:function(wChaird, visible)
	{
		otherMahJong.control[wChaird][0].visible = visible;
	},
	removeCard:function(wChaird, cbRemoveCount)
	{
		var nCount = otherMahJong.cbCardCount[wChaird] - cbRemoveCount;
		for (var i = otherMahJong.cbCardCount[wChaird]-1; i >= nCount; i--) {
			otherMahJong.node.removeChild(otherMahJong.control[wChaird][i]);
		}
		otherMahJong.cbCardCount[wChaird] = nCount;
	},
	clearCardData:function()
	{
		otherMahJong.node.removeAllChildren();
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
		"#lr_table_bg.png",
		"#up_table_bg.png",
		"#lr_table_bg.png"
		];

		var resBack =
		[
		"#up_table_0.png",
		"#lr_table_0.png",
		"#up_table_0.png",
		"#lr_table_0.png"
		]
		var angle = [0, 270, -180, 90];
		var pos = 
		[
			cc.p(17, 35),
			cc.p(23, 25),
			cc.p(19, 33),
			cc.p(26, 28),
		];
		var item = null

		if(cbCardData!= 0xFF)
		{
			item = new cc.Sprite(res[wChaird]);
			item.spValue = new cc.Sprite("#"+'value_'+cbCardData+'.png');
		}
		else
		{
			item = new cc.Sprite(resBack[wChaird]);
			item.spValue = new cc.Sprite("#"+'value_'+11+'.png');
			item.spValue.setVisible(false);
			if(wChaird == 0 || wChaird == 2)
			{
				item.scale = 0.95;
			}
		}

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


		var disCard = new cc.Sprite("#up_table_bg.png");
		var handMj = new cc.Sprite("#down_user_bg.png");
		disCardControl.baopiSignScale = disCard.width/handMj.width;
	},
	setControlPos:function(wChaird)
	{
		var headX = tableData.getChairWithShowChairId(wChaird).node.x;
		var headY = tableData.getChairWithShowChairId(wChaird).node.y;
		var i = disCardControl.cbCardCount[wChaird];
		switch(wChaird)
		{
			case 0:
			fx = handMahJong.control[9].x - 30;
			fy = handMahJong.control[0].height/2 + 50 + disCardControl.control[wChaird][i].height/2+40;

			fy += (Math.floor(i/DISCARD_ROW_COUNT))*40;
			disCardControl.control[wChaird][i].setPosition(fx+i%DISCARD_ROW_COUNT*35, fy);
			break;
			case 1:
				fx = headX - 115 - 45;
				fy = headY - 265*SCALE_H_NO_MOBILE;
				fx -= (Math.floor(i/DISCARD_ROW_COUNT))*45*SCALE_H_NO_MOBILE;
				disCardControl.control[wChaird][i].scale = SCALE_H_NO_MOBILE;
				disCardControl.control[wChaird][i].spValue.scale = disCardControl.control[wChaird][i].spValue.scale*SCALE_H_NO_MOBILE;
				disCardControl.control[wChaird][i].setPosition(fx, fy + i%DISCARD_ROW_COUNT*28*SCALE_H_NO_MOBILE);
			break;
			case 2:
				fx = headX + 420;
				fy = headY - 70;
				fy -= (Math.floor(i/DISCARD_ROW_COUNT))*42;
				disCardControl.control[wChaird][i].setPosition(fx-i%DISCARD_ROW_COUNT*34, fy);
				disCardControl.control[wChaird][i].zIndex = DISCARD_ROW_COUNT - i%DISCARD_ROW_COUNT;
			break;
			case 3:
				fx = headX + 115 + 45;
				fy = headY + 40*SCALE_H_NO_MOBILE;
				fx += (Math.floor(i/DISCARD_ROW_COUNT))*45*SCALE_H_NO_MOBILE;
				disCardControl.control[wChaird][i].scale = SCALE_H_NO_MOBILE;
				disCardControl.control[wChaird][i].spValue.scale = disCardControl.control[wChaird][i].spValue.scale*SCALE_H_NO_MOBILE;
				disCardControl.control[wChaird][i].setPosition(fx, fy - i%DISCARD_ROW_COUNT*28*SCALE_H_NO_MOBILE);
				disCardControl.control[wChaird][i].zIndex = i;
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
		switch(wChaird)
		{
			case 0:
				disCardControl.outPointer.y = disCardControl.control[wChaird][disCardControl.cbCardCount[wChaird]].y+35;
			break;
			case 1:
				disCardControl.outPointer.x = disCardControl.control[wChaird][disCardControl.cbCardCount[wChaird]].x-20;
				disCardControl.outPointer.y = disCardControl.control[wChaird][disCardControl.cbCardCount[wChaird]].y+20;
			break;
			case 2:
				disCardControl.outPointer.y = disCardControl.control[wChaird][disCardControl.cbCardCount[wChaird]].y+35;
			break;
			case 3:
				disCardControl.outPointer.x = disCardControl.control[wChaird][disCardControl.cbCardCount[wChaird]].x-20;
				disCardControl.outPointer.y = disCardControl.control[wChaird][disCardControl.cbCardCount[wChaird]].y+20;
			break;
		}

		if(handMahJong.isMagicCard(cbCardData))
			disCardControl.control[wChaird][disCardControl.cbCardCount[wChaird]].color = MAGIC_COLOR

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
//花牌 管理器
var huaCardControl = 
{
	init:function(uiPlay)
	{
		huaCardControl.control = [];
		huaCardControl.cbCardCount = [];
		huaCardControl.node = new cc.Node();
		uiPlay.addChild(huaCardControl.node);
		for (var i = 0; i < GAME_PLAYER; i++)
		{
			huaCardControl.control[i] = [];
			huaCardControl.cbCardCount[i] = 0;
		}
	},
	setControlPos:function(wChaird)
	{
		var headX = tableData.getChairWithShowChairId(wChaird).node.x;
		var headY = tableData.getChairWithShowChairId(wChaird).node.y;
		var i = huaCardControl.cbCardCount[wChaird];
		var fScale = 0.75;
		switch(wChaird)
		{
			case 0:
			fx = handMahJong.control[10].x;
			fy = handMahJong.control[0].y + handMahJong.control[0].height/2 + huaCardControl.control[wChaird][i].height/2;
			fy += (Math.floor(i/HUACARD_ROW_COUNT))*40*fScale;
			huaCardControl.control[wChaird][i].scale = fScale;
			huaCardControl.control[wChaird][i].spValue.scale = huaCardControl.control[wChaird][i].spValue.scale*fScale;
			huaCardControl.control[wChaird][i].setPosition(fx+i%HUACARD_ROW_COUNT*35*fScale, fy);
			break;
			case 1:
				fx = headX - 100;
				fy = otherMahJong.huaPosRightY;
				fx -= (Math.floor(i/HUACARD_ROW_COUNT))*45*SCALE_H_NO_MOBILE*fScale;
				huaCardControl.control[wChaird][i].scale = SCALE_H_NO_MOBILE*fScale;
				huaCardControl.control[wChaird][i].spValue.scale = huaCardControl.control[wChaird][i].spValue.scale*SCALE_H_NO_MOBILE*fScale;
				huaCardControl.control[wChaird][i].setPosition(fx, fy + i%HUACARD_ROW_COUNT*28*SCALE_H_NO_MOBILE*fScale);
			break;
			case 2:
				fx = headX + 570;
				fy = headY + 45;
				fy -= (Math.floor(i/HUACARD_ROW_COUNT))*42*fScale;
				huaCardControl.control[wChaird][i].scale = fScale;
				huaCardControl.control[wChaird][i].spValue.scale = huaCardControl.control[wChaird][i].spValue.scale*fScale;
				huaCardControl.control[wChaird][i].setPosition(fx-i%HUACARD_ROW_COUNT*34*fScale, fy);
				huaCardControl.control[wChaird][i].zIndex = HUACARD_ROW_COUNT - i%HUACARD_ROW_COUNT;
			break;
			case 3:
				fx = headX + 100;
				fy = otherMahJong.huaPosLeftY;
				fx += (Math.floor(i/HUACARD_ROW_COUNT))*45*SCALE_H_NO_MOBILE*fScale;
				huaCardControl.control[wChaird][i].scale = SCALE_H_NO_MOBILE*fScale;
				huaCardControl.control[wChaird][i].spValue.scale = huaCardControl.control[wChaird][i].spValue.scale*SCALE_H_NO_MOBILE*fScale;
				huaCardControl.control[wChaird][i].setPosition(fx, fy - i%HUACARD_ROW_COUNT*28*SCALE_H_NO_MOBILE*fScale);
				huaCardControl.control[wChaird][i].zIndex = i;
			break;
		}
	},
	addCardItem:function(wChaird, cbCardData)
	{
		huaCardControl.control[wChaird][huaCardControl.cbCardCount[wChaird]] = disCardItem.create(wChaird, cbCardData);
		gameLog.log('花牌椅子:' + wChaird + '值：' + cbCardData)
		huaCardControl.node.addChild(huaCardControl.control[wChaird][huaCardControl.cbCardCount[wChaird]], MAX_DISCARD-huaCardControl.cbCardCount[wChaird]);
		huaCardControl.setControlPos(wChaird);
		huaCardControl.cbCardCount[wChaird]++;
	},
	//游戏结束清空弃牌管理器
	clearCardData:function()
	{
		huaCardControl.node.removeAllChildren();
		for (var i = 0; i < GAME_PLAYER; i++) {
			huaCardControl.control[i] = [];
			huaCardControl.cbCardCount[i] = 0;
		};
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
				"#lr_table_0.png",
				"#up_table_0.png",
				"#lr_table_0.png"
			];
			item = new cc.Sprite(res[wChaird]);
			item.cbCardData = cbCardData;
		}
		else
		{
			var res = 
			[
				"#down_weave_bg.png",
				"#lr_table_bg.png",
				"#up_table_bg.png",
				"#lr_table_bg.png"
			];
			var angle = [0, 270, -180, 90];
			var pos = 
			[
				cc.p(26, 55),
				cc.p(23, 27),
				cc.p(19, 34),
				cc.p(25, 27),
			];
			var scale = [0.9, 0.6, 0.6, 0.6];
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
		var mahJongScale = (gameWidth-40)/MAX_COUNT/mahJong.width;
		var mahJongWidth = Math.floor(mahJong.width*mahJongScale);

		weaveControl.mahJongScale = (gameWidth-mahJongWidth*12-35)/3/mahJong.width;
		weaveControl.mjWidth = Math.floor(mahJong.width*weaveControl.mahJongScale);
		weaveControl.mjHeight = Math.floor(mahJong.height*weaveControl.mahJongScale);

		//左右麻将适配
		var target = new cc.Sprite("#right_user_bg.png");
		var targetH = (target.height*3-2*33-10)/3;
		var source = new cc.Sprite("#lr_table_0.png");
		weaveControl.scaleLR = targetH/source.height;

		weaveControl.node = new cc.Node();
		uiPlay.addChild(weaveControl.node);
		weaveControl.cbWeaveCount = [];
		weaveControl.cbWeaveArray = [];
		weaveControl.control = [];
		weaveControl.arrow = [];
		weaveControl.mingNum = [0, 0, 0, 0];
		weaveControl.anNum = [0, 0, 0, 0];
		for (var i = 0; i < GAME_PLAYER; i++) {
		 	weaveControl.control[i] = [];
		 	weaveControl.arrow[i] = [];
		 	weaveControl.cbWeaveArray[i] = [];
		 	weaveControl.cbWeaveCount[i] = 0;
		}
	},
	showAngGangCard:function(wChaird)
	{
		var res = 
		[
			"down_weave_bg.png",
			"lr_table_bg.png",
			"up_table_bg.png",
			"lr_table_bg.png"
		];
		var angle = [0, 270, -180, 90];
		var pos = 
		[
			cc.p(26, 55),
			cc.p(23, 27),
			cc.p(19, 34),
			cc.p(25, 27),
		];
		var scale = [0.9, 0.6, 0.6, 0.6];

		for(var i=0;i<weaveControl.cbWeaveCount[wChaird];i++)
		{
			if(weaveControl.cbWeaveArray[wChaird][i].cbWeaveKind & WIK_GANG)
			{
				if(! weaveControl.cbWeaveArray[wChaird][i].cbPublicCard && !weaveControl.control[wChaird][i][3].spValue)
				{
					var card = weaveControl.cbWeaveArray[wChaird][i].cbCardData[0];
					
					weaveControl.control[wChaird][i][3].setSpriteFrame(res[wChaird]);
					weaveControl.control[wChaird][i][3].spValue = new cc.Sprite("#"+'value_'+card+'.png');
					weaveControl.control[wChaird][i][3].addChild(weaveControl.control[wChaird][i][3].spValue);
					weaveControl.control[wChaird][i][3].spValue.scale = scale[wChaird];
					weaveControl.control[wChaird][i][3].spValue.setRotation(angle[wChaird]);
					weaveControl.control[wChaird][i][3].spValue.setPosition(pos[wChaird]);
				}
			}
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
				fx = headX - 55;
				fy = headY - 300*SCALE_H_NO_MOBILE;
				fy += j*(weaveControl.control[wChaird][j][0].height*3*weaveControl.scaleLR-2*14*weaveControl.scaleLR+8)*SCALE_H_NO_MOBILE;
				for (var k = 0; k < nCount; k++) {
					weaveControl.control[wChaird][j][k].zIndex = 3-k;
					weaveControl.control[wChaird][j][k].scale = weaveControl.scaleLR*SCALE_H_NO_MOBILE;
					if (weaveControl.control[wChaird][j][k].cbCardData != 0)
					{
						weaveControl.control[wChaird][j][k].spValue.scale = weaveControl.control[wChaird][j][k].spValue.scale*weaveControl.scaleLR*SCALE_H_NO_MOBILE;
					}
					if (k == 3)
					{
						weaveControl.control[wChaird][j][k].setPosition(fx, fy+40*weaveControl.scaleLR*SCALE_H_NO_MOBILE);
						weaveControl.control[wChaird][j][k].zIndex = 4;
					}
					else
						weaveControl.control[wChaird][j][k].setPosition(fx, fy + k*29*weaveControl.scaleLR*SCALE_H_NO_MOBILE);
				}
			break;
			case 2:
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
			case 3:
				fx = headX + 55;
				fy = headY + 130*SCALE_H_NO_MOBILE-20;
				fy -= j*(weaveControl.control[wChaird][j][0].height*3*weaveControl.scaleLR-2*14*weaveControl.scaleLR+8)*SCALE_H_NO_MOBILE;
				for (var k = 0; k < nCount; k++) {
					weaveControl.control[wChaird][j][k].scale = weaveControl.scaleLR*SCALE_H_NO_MOBILE;
					if (weaveControl.control[wChaird][j][k].cbCardData != 0)
					{
						weaveControl.control[wChaird][j][k].spValue.scale = weaveControl.control[wChaird][j][k].spValue.scale*weaveControl.scaleLR*SCALE_H_NO_MOBILE;
					}
					if (k == 3)
						weaveControl.control[wChaird][j][k].setPosition(fx, fy-22*weaveControl.scaleLR*SCALE_H_NO_MOBILE);
					else
						weaveControl.control[wChaird][j][k].setPosition(fx, fy - k*30*weaveControl.scaleLR*SCALE_H_NO_MOBILE);
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
		var cbWeaveKind = weaveControl.cbWeaveArray[wChaird][cbWeaveIndex].cbWeaveKind;
		var cbCenterCard = weaveControl.cbWeaveArray[wChaird][cbWeaveIndex].cbCenterCard;
		var cbPublicCard = weaveControl.cbWeaveArray[wChaird][cbWeaveIndex].cbPublicCard;
		var wProvideUser = weaveControl.cbWeaveArray[wChaird][cbWeaveIndex].wProvideUser;
		var cbCardData = weaveControl.cbWeaveArray[wChaird][cbWeaveIndex].cbCardData;

		if (cbWeaveKind & WIK_GANG)
		{
			if (cbPublicCard) 
			{
				weaveControl.mingNum[wChaird]++;
				//明杠
				var bShowArrow = (gameLogic.switchViewChairID(wProvideUser) != wChaird)?true:false;
				weaveControl.addWeaveItem(wChaird, cbWeaveIndex, cbCardData, 4, bShowArrow);
				if (bShowArrow)
				{
					//显示吃碰杠箭头
					weaveControl.arrow[wChaird][cbWeaveIndex].x = weaveControl.control[wChaird][cbWeaveIndex][3].x;
					weaveControl.arrow[wChaird][cbWeaveIndex].y = weaveControl.control[wChaird][cbWeaveIndex][3].y+5;
					weaveControl.arrow[wChaird][cbWeaveIndex].zIndex = weaveControl.control[wChaird][cbWeaveIndex][3].zIndex+1;
					var angle = [180, 90, 0, 270];
					weaveControl.arrow[wChaird][cbWeaveIndex].setRotation(angle[gameLogic.switchViewChairID(wProvideUser)]);
				}
			}
			else
			{
				weaveControl.anNum[wChaird]++;
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
			if(cbPublicCard)
			for(var i=0;i<4;i++)
			{
				if(handMahJong.isMagicCard(cbCardData[i]))
				{
					weaveControl.control[wChaird][cbWeaveIndex][i].color = MAGIC_COLOR;
				}
			}
		}
		else if(cbWeaveKind &WIK_PENG || cbWeaveKind & WIK_CENTER ||cbWeaveKind &WIK_LEFT||cbWeaveKind &WIK_RIGHT) 
		{
			var nIndex = 1;
			//cbCardData.sort(function(a, b){return a-b;});
			if (cbCardData[0] == 0)
			{
				cbCardData[0] = cbCardData[1];
				cbCardData[1] = cbCardData[2];
				cbCardData[2] = cbCardData[3];
				cbCardData[3] = 0;
			}
			if(cbWeaveKind &WIK_PENG|| cbWeaveKind & WIK_CENTER )
			{
				var cbTempCard = cbCardData[0];
				cbCardData[0] = cbCardData[1];
				cbCardData[1] = cbTempCard;
			}
			else if(cbWeaveKind &WIK_RIGHT)
			{
				var cbTempCard = cbCardData[0];
				cbCardData[0] = cbCardData[2];
				cbCardData[2] = cbTempCard;
			}

			weaveControl.addWeaveItem(wChaird, cbWeaveIndex, cbCardData, 3, true);
			//将吃的那张牌变灰
			if(cbWeaveKind & WIK_CENTER )
			{
				weaveControl.control[wChaird][cbWeaveIndex][1].color = cc.color(125, 125, 125);
				weaveControl.control[wChaird][cbWeaveIndex][1].spValue.color = cc.color(125, 125, 125);
			}
			else if(cbWeaveKind &WIK_RIGHT)
			{
				weaveControl.control[wChaird][cbWeaveIndex][2].color = cc.color(125, 125, 125);
				weaveControl.control[wChaird][cbWeaveIndex][2].spValue.color = cc.color(125, 125, 125);
			}
			else if(cbWeaveKind &WIK_LEFT)
			{
				weaveControl.control[wChaird][cbWeaveIndex][0].color = cc.color(125, 125, 125);
				weaveControl.control[wChaird][cbWeaveIndex][0].spValue.color = cc.color(125, 125, 125);
			}

			//显示吃碰杠箭头
			weaveControl.arrow[wChaird][cbWeaveIndex].x = weaveControl.control[wChaird][cbWeaveIndex][nIndex].x;
			weaveControl.arrow[wChaird][cbWeaveIndex].y = weaveControl.control[wChaird][cbWeaveIndex][nIndex].y+5;
			weaveControl.arrow[wChaird][cbWeaveIndex].zIndex = weaveControl.control[wChaird][cbWeaveIndex][nIndex].zIndex+1;
			var angle = [180, 90, 0, 270];
			weaveControl.arrow[wChaird][cbWeaveIndex].setRotation(angle[gameLogic.switchViewChairID(wProvideUser)]);

			for(var i=0;i<3;i++)
			{
				if(handMahJong.isMagicCard(cbCardData[i]))
				{
					weaveControl.control[wChaird][cbWeaveIndex][i].color = MAGIC_COLOR
				}
			}
		}

	},
	clearCardData:function()
	{
		weaveControl.node.removeAllChildren();
		weaveControl.mingNum = [0, 0, 0, 0];
		weaveControl.anNum = [0, 0, 0, 0];
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
	setCardData:function(cbCardData, cbCardCount)
	{
		tableMahJong.node = new cc.Node();
		mainScene.uiPlay.addChild(tableMahJong.node, ZORDER_MAX);

		for (var i = 0; i < GAME_PLAYER; i++) {
			mainScene.sortHandCard(cbCardData[i]);
			var wChaird = gameLogic.switchViewChairID(i);
			//var wChaird = i;
			var headX = tableData.getChairWithShowChairId(wChaird).node.x;
			var headY = tableData.getChairWithShowChairId(wChaird).node.y;
			for (var k = 0; k < cbCardCount[i]; k++) {
				var mahJong = weaveControl.create(wChaird, cbCardData[i][k]);
				tableMahJong.node.addChild(mahJong);
				switch(wChaird)
				{
					case 0:
					mahJong.setPosition(handMahJong.control[0].x - k * 54, handMahJong.control[0].y);
					break;
					case 1:
					fx = headX - 65;
					fy = headY + 85*SCALE_H_NO_MOBILE;
					mahJong.scale = SCALE_H_NO_MOBILE;
					mahJong.spValue.scale = mahJong.spValue.scale*SCALE_H_NO_MOBILE*0.9;
					mahJong.setPosition(fx, fy - k * 27*SCALE_H_NO_MOBILE);
					break;
					case 2:
					fx = headX + 95 - 25;;
					fy = headY;
					mahJong.setPosition(fx + k * 35, fy);
					break;
					case 3:
					fx = headX + 65;
					fy = headY - 270*SCALE_H_NO_MOBILE;
					mahJong.scale = SCALE_H_NO_MOBILE;
					mahJong.spValue.scale = mahJong.spValue.scale*SCALE_H_NO_MOBILE*0.9;
					mahJong.setPosition(fx, fy + k * 27 * SCALE_H_NO_MOBILE);
					mahJong.zIndex = cbCardCount[i]-k;
					break;
				}
			};
		};
	},
	clearCardData:function()
	{
		if(tableMahJong.node)
		{
			if(tableMahJong.node._parent)
				tableMahJong.node.removeFromParent();
		}
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
		cc.p(mainScene.ctPosX + 190, mainScene.ctPosY + 50),
		cc.p(mainScene.ctPosX - 10, mainScene.ctPosY + 150),
		cc.p(mainScene.ctPosX - 190, mainScene.ctPosY + 50)
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

var buHua = 
{
	init:function()
	{
		buHua.buhuaNum = [];
		buHua.nNumber = [];
		for (var i = 0; i < GAME_PLAYER; i++) {
			buHua.buhuaNum[i] = new ccui.TextAtlas();
      		buHua.buhuaNum[i].setProperty("91", resp.clockNum, 18, 25, "0");
      		buHua.buhuaNum[i].visible = false;
      		topUI['buhuaNum'+i].addChild(buHua.buhuaNum[i]);	
      		buHua.nNumber[i] = 0;
		};
	},
	updateBuHua:function(wChaird, nNum)
	{
		var wViewChaird = gameLogic.switchViewChairID(wChaird);
		buHua.nNumber[wViewChaird] = buHua.nNumber[wViewChaird] + nNum;
		buHua.buhuaNum[wViewChaird].setString(buHua.nNumber[wViewChaird]);
		buHua.buhuaNum[wViewChaird].visible = true;
	},
	hideBuHua:function()
	{
		for (var i = 0; i < GAME_PLAYER; i++) {
			buHua.buhuaNum[i].visible = false;
			buHua.nNumber[i] = 0;
			topUI['labelBaoTai'+i].visible = false;
		};
	}
};

var XuanCaiShenMahJong = 
{
	init:function(uiPlay)
	{
		XuanCaiShenMahJong.cbListenCards = []
		XuanCaiShenMahJong.cbListenMouth = [];
		XuanCaiShenMahJong.bIsGetListenMonth = false;
		for (var i = 0; i < MAX_COUNT; i++) 
		{
			XuanCaiShenMahJong.cbListenMouth[i] = []; 
		}

		XuanCaiShenMahJong.outCardBg = [];
		XuanCaiShenMahJong.outCard = [];
		for(var i=0;i< MAX_COUNT;i++)
		{
			XuanCaiShenMahJong.outCardBg[i] = new cc.Sprite("#outcardBg.png");
			XuanCaiShenMahJong.outCardBg[i].visible = false;
			XuanCaiShenMahJong.outCard[i] = weaveControl.create(0, 1)
			XuanCaiShenMahJong.outCard[i].visible = false;
			uiPlay.addChild(XuanCaiShenMahJong.outCardBg[i], ZORDER_MAX);
			uiPlay.addChild(XuanCaiShenMahJong.outCard[i], ZORDER_MAX);
		}
		
	},
	showListenMouthByCard:function(cbCard)
	{
		if(mainScene._bIsListened)
		{
			return true;
		}
		//显示听口
        if(!mainScene._bIsListened && XuanCaiShenMahJong.bIsGetListenMonth)
		{
			var cbIndex = -1;
			for(var j =0;j<MAX_COUNT;j++)
			{
				if(XuanCaiShenMahJong.cbListenCards[j] == cbCard)
				{
					cbIndex = j;
					break;
				}
			}
			if(cbIndex!=-1)
			{
				XuanCaiShenMahJong.showListenMouth(XuanCaiShenMahJong.cbListenMouth[cbIndex]);
				return true;
			}
			else
			{
				XuanCaiShenMahJong.hideListenMouth();
				XuanCaiShenMahJong.setListenMonthState(false);
				return false;
			}
		}
		return false;
	},

	showListenMouth:function(cbListenMouth)
	{
		XuanCaiShenMahJong.hideListenMouth();
		if(cbListenMouth == null)
		{
			return;
		}
		var cblistenNum= 0;
		for(var i=0;i< MAX_COUNT;i++)
		{
			if(cbListenMouth[i])
			{
				cblistenNum++;
			}
		}

		var max = 12;//MAX_COUNT
		var step = mainScene.ctPosX *2 / max;

		var doublepos = 
		[
		cc.p(step*0.5- 10, 			mainScene.ctPosY-140 ),
		cc.p(step*0.5+step- 10, 	mainScene.ctPosY-140 ),
		cc.p(step*0.5+step*2- 10, 	mainScene.ctPosY-140 ),
		cc.p(step*0.5+step*3- 10, 	mainScene.ctPosY-140 ),
		cc.p(step*0.5+step*4- 10, 	mainScene.ctPosY-140 ),
		cc.p(step*0.5+step*5- 10, 	mainScene.ctPosY-140 ),
		cc.p(step*0.5+step*6- 10, 	mainScene.ctPosY-140 ),
		cc.p(step*0.5+step*7- 10, 	mainScene.ctPosY-140 ),
		cc.p(step*0.5+step*8- 10, 	mainScene.ctPosY-140 ),
		cc.p(step*0.5+step*9- 10, 	mainScene.ctPosY-140 ),
		cc.p(step*0.5+step*10- 10, 	mainScene.ctPosY-140),
		cc.p(step*0.5+step*11- 10, 	mainScene.ctPosY-140),
		cc.p(step*0.5+step*12- 10, 	mainScene.ctPosY-140),
		cc.p(step*0.5+step*13- 10, 	mainScene.ctPosY-140),
		];
		for(var i=0;i<cblistenNum&&i<max ;i++)
		{
			XuanCaiShenMahJong.outCard[i].spValue.setSpriteFrame('value_'+cbListenMouth[i]+'.png');
			XuanCaiShenMahJong.outCardBg[i].visible = true;
			XuanCaiShenMahJong.outCard[i].visible = true;
			var pos ;

			if(cblistenNum%2 ==0)
			{
				pos = doublepos[(max-cblistenNum)/2 +i];
			}
			else
			{
				pos = doublepos[(max-cblistenNum-1)/2+i];
				pos.x+= step*0.5;
			}

			XuanCaiShenMahJong.outCardBg[i].setPosition(pos);
			XuanCaiShenMahJong.outCard[i].setPosition(pos);

		}

	},
	hideListenMouth:function()
	{
		for(var i=0;i< MAX_COUNT;i++)
		{
			XuanCaiShenMahJong.outCardBg[i].visible = false;
			XuanCaiShenMahJong.outCard[i].visible = false;
		}

	},
	setListenMonthState:function(bEnable)
	{
		XuanCaiShenMahJong.bIsGetListenMonth = bEnable;
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