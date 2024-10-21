var gameEnd = 
{
	setGameEndInfo:function(data)
	{
		//请求战绩
        var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
        record.szTableKey = tableKey
        socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)


		//添加结算框
		//注册按钮事件
		gameEnd.initCallBack();
		gameEnd.node = null;
		gameEnd.node  = cc.BuilderReader.load(resp.gameEndCCB, gameEnd );
		gameEnd.node.x = mainScene.ctPosX;
		gameEnd.node.y = mainScene.ctPosY;
		topUI.node.addChild(gameEnd.node, ZORDER_MAX);
		gameEnd.resultData = {};
		gameEnd.resultData = data;
		var wWinner = INVALID_CHAIR;
		for(var i = 0; i < GAME_PLAYER; i++)
		{
			if (data.lGameScore[i] > 0)
			{
				wWinner = i;
			}
		}
		if(wWinner == INVALID_CHAIR || data.bLiuJu)
		{
			//流局
			gameEnd["title"].setSpriteFrame('liuju.png');
			managerAudio.playEffect('gameRes/sound/huangzhuang.mp3');
		}
		else
		{
			//牌型
			gameEnd.showChiHuType();
		}
		for(var i = 0; i < GAME_PLAYER; i++)
		{
			if (data.lGameScore[i] > 0 && !data.bLiuJu)
			{
				if(i == mainScene._wMeChaird)
				{
					gameEnd["title"].setSpriteFrame('win.png');
					managerAudio.playEffect('gameRes/sound/win.mp3');
				}
			}
			else if(data.lGameScore[i] < 0 && !data.bLiuJu)
			{
				if(i == mainScene._wMeChaird)
				{
					gameEnd["title"].setSpriteFrame('lose.png');
					managerAudio.playEffect('gameRes/sound/lose.mp3');
				}
			}
			var wViewChaird = gameEnd.getViewChaird(wWinner,i);
	        gameEnd['headIcon'+wViewChaird].setSpriteFrame('headIcon.png');
    	    gameEnd['name'+wViewChaird].setString(mainScene._szNickName[i]);
    	    var url = mainScene._szHeadImageUrl[i];
            if(url)
          	{ 
          		var head = gameEnd['headIcon'+wViewChaird];
              	(
              		function(head, url)
	              	{
	                  	cc.loader.loadImg
	                  	(	
	                  		url, 
	                  		{isCrossOrigin : false}, 
	                  		function(err,img)
		                  	{
		                        var texture2d = new cc.Texture2D()
		                        texture2d.initWithElement(img)
		                        texture2d.handleLoadedTexture()
		                        var frame = new cc.SpriteFrame(texture2d, cc.rect(0, 0, texture2d.getContentSize().width, texture2d.getContentSize().height))
		                        head.setSpriteFrame(frame)
		                	}
	            		)
            		}
            		(head, url)
            	)
          	}
	        //硬息
	        gameEnd['yingxi'+wViewChaird].setString(data.cbYingxi[i]);
	        //分数
	        gameEnd['score'+wViewChaird].setString(data.lGameScore[i]);
	        //手牌
	        gameEnd.setCardView(i, wViewChaird, wWinner);
	        //强退
	        if (i == data.wQiangTuiUser)
	        {
	        	gameEnd['imgQT'+wViewChaird].visible = true;
	        }
		}
		//庄家图标
		var wBankerView = gameEnd.getViewChaird(wWinner,mainScene._wBankerUser);
		gameEnd['bankerIcon'+wBankerView].visible = true;
	    //总息
	    gameEnd["zongxi"].setString(data.wZongXi);
	    //底牌
	    gameEnd.showDiCard();
	    topUI.imgResultBtn.zIndex = ZORDER_MAX+1;
	    topUI.imgResultBtn.visible = true;
	    topUI.imgResultBtn.x = gameEnd.node.x-250;
	    topUI.imgResultBtn.y = gameEnd.node.y-210;
	},
	showChiHuType:function()
	{
		var chihuType = 
		[
			"点胡 ",
			"红胡 ",
			"乌胡 ",
			"对对胡 ",
			"大字胡 ",
			"小字胡 ",
			"海底胡 ",
			"停胡 ",
			"耍猴胡 ",
			"项项胡 ",
			"团团胡 ",
			"黄番 ",
			"天胡 ",
			"地胡 ",
			"自摸 ",
			"三提五坎 ",
		];
		var str = "";
		for(var i = 0; i < MAX_CHR_COUNT; i++)
		{
			if(gameEnd.resultData.cbChiHuType[i] > 0)
			{
				if (i == MAX_CHR_COUNT-2)
					str += chihuType[i] + '+' + '1囤 ';
				else if (i == MAX_CHR_COUNT-5 || i == MAX_CHR_COUNT-1)
					str += chihuType[i];
				else
					str += chihuType[i] + '+' + gameEnd.resultData.cbChiHuScore[i] + ' ';
			}
		}
		gameEnd["lbMingTang"].setString(str);
	},
	showDiCard:function()
	{
		var lScale = 0.5;
		for(var i = 0; i < 22; i++)
		{
			if(gameEnd.resultData.cbDiPai[i] > 0)
			{
				var mahJong = new cc.Sprite("#sJie.png");
				var spValue = new cc.Sprite(('#s'+gameEnd.resultData.cbDiPai[i]+'.png'));
				spValue.x = mahJong.width/2;
				spValue.y = mahJong.height/2;
				mahJong.addChild(spValue);
				mahJong.y = mahJong.height*lScale-Math.floor(i/10)*mahJong.height*lScale;
				mahJong.x = mahJong.width*lScale+(i%10)*mahJong.width*lScale;
				mahJong.scale = lScale;
				gameEnd["dipai"].addChild(mahJong);
			}
		}
	},
	setCardView:function(wChaird, wViewChaird, wWinner)//逻辑索引  结算框上显示索引 有赢家  最左边是赢家  右下是赢家下家 右上是赢家上家
	{
		var getHuXi = function(cbWeaveKind, cbCardArray)
		{
	    	if(cbWeaveKind == WIK_PENG)
	    	{
		        if(gameLogic.isBigCard(cbCardArray[0]))
		         	return "3";
		        else
		            return "1";
	    	}
	    	else if(cbWeaveKind == WIK_WEI)
	    	{
		        if(gameLogic.isBigCard(cbCardArray[0]))
		         	return "6";
		        else
		            return "3";
	    	}
	    	else if(cbWeaveKind == WIK_TI)
	    	{
		        if(gameLogic.isBigCard(cbCardArray[0]))
		         	return "12";
		        else
		            return "9";
	    	}
	    	else if(cbWeaveKind == WIK_PAO)
	    	{
		        if(gameLogic.isBigCard(cbCardArray[0]))
		         	return "9";
		        else
		            return "6";
	    	}
	    	else
	    	{
	    		var cbCardData = cbCardArray.concat();
	    		cbCardData.sort(function(a, b) {return b > a});
	    		if (cbCardData[2] == 1 && cbCardData[1] == 2 && cbCardData[0] == 3 ||
	    			cbCardData[2] == 2 && cbCardData[1] == 7 && cbCardData[0] == 10) 
	    		{
	    			return "3";
	    		}
	    		if (cbCardData[2] == 0x11 && cbCardData[1] == 0x12 && cbCardData[0] == 0x13 ||
	    			cbCardData[2] == 0x12 && cbCardData[1] == 0x17 && cbCardData[0] == 0x1A) 
	    		{
	    			return "6";
	    		}
	    	}
	    	return "0";
		}
		var wView = gameLogic.switchViewChairID(wChaird);//显示索引
		var cbWeaveCount = weaveControl.cbWeaveCount[wView];
		if(wWinner == wChaird && gameEnd.resultData.sctAnalyseItem.cbCardData[0][0] != 0)
		{
			for(var i = 0; i < MAX_WEAVE; i++)
			{
				var cbWeaveKing = gameEnd.resultData.sctAnalyseItem.cbWeaveKind[i];
				var cbCardArray = gameEnd.resultData.sctAnalyseItem.cbCardData[i];
				var bWeaveInsert = gameEnd.resultData.sctAnalyseItem.bWeaveInsert[i];
				if(cbWeaveKing == WIK_WEI)
				{
					if (bWeaveInsert)
						gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_wei.png');
					else
						gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_kan.png');
				}
				else if(cbWeaveKing == WIK_PENG)
					gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_peng.png');
				else if(cbWeaveKing & (WIK_LEFT | WIK_CENTER | WIK_RIGHT))
				{
					if (bWeaveInsert)
						gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_chi.png');
					else
					{
						if (cbCardArray[0] == cbCardArray[1] || cbCardArray[1] == cbCardArray[2])
						{
							gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_jiao.png');
						}
						else
						{
							gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_shun.png');
						}
					}
				}
				else if(cbWeaveKing == WIK_TI)
					gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_ti.png');
				else if(cbWeaveKing == WIK_PAO)
					gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_pao.png');
				for(var k = 0; k < 4; k++)
				{
					if(cbCardArray[k] === undefined || cbCardArray[k] == 0)
					{
						gameEnd['mj'+wViewChaird+i+k].visible = false;
						break;
					}
					var spValue = new cc.Sprite(('#s'+cbCardArray[k]+'.png'));
					spValue.x = 30;
					spValue.y = 30;
					gameEnd['mj'+wViewChaird+i+k].addChild(spValue);
					if(cbCardArray[k] == gameEnd.resultData.cbProvideCard)
					{
						gameEnd['mj'+wViewChaird+i+k].color = cc.color(125, 125, 125);
						spValue.color = cc.color(125, 125, 125);
					}
					gameEnd['mj'+wViewChaird+i+k].visible = true;
				}
				gameEnd['hx'+wViewChaird+i].setString(getHuXi(cbWeaveKing, cbCardArray));
			}
			if(gameEnd.resultData.sctAnalyseItem.cbCardEye != 0)
			{
				gameEnd['kind'+wViewChaird+6].setSpriteFrame('img_jiang.png');
				for(var i = 0; i < 2; i++)
				{
					var spValue = new cc.Sprite(('#s'+gameEnd.resultData.sctAnalyseItem.cbCardEye+'.png'));
					spValue.x = 30;
					spValue.y = 30;
					gameEnd['mj'+wViewChaird+6+i].addChild(spValue);
					gameEnd['mj'+wViewChaird+6+i].visible = true;
					if(gameEnd.resultData.sctAnalyseItem.cbCardEye == gameEnd.resultData.cbProvideCard)
					{
						gameEnd['mj'+wViewChaird+6+i].color = cc.color(125, 125, 125);
						spValue.color = cc.color(125, 125, 125);
					}
				}
			}
		}
		else
		{
			for(var i = 0; i < MAX_WEAVE; i++)
			{
				gameEnd['mj'+wViewChaird+i+0].visible = false;
				gameEnd['mj'+wViewChaird+i+1].visible = false;
				gameEnd['mj'+wViewChaird+i+2].visible = false;
				gameEnd['mj'+wViewChaird+i+3].visible = false;
				gameEnd['kind'+wViewChaird+i].visible = false;
			}
			for(var i = 0; i < cbWeaveCount; i++)
			{
				var cbWeaveKing = weaveControl.cbWeaveArray[wView][i].cbWeaveKind;
				var cbCardArray = weaveControl.cbWeaveArray[wView][i].cbCardArray;
				if(cbWeaveKing == WIK_WEI)
					gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_wei.png');
				else if(cbWeaveKing == WIK_PENG)
					gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_peng.png');
				else if(cbWeaveKing & (WIK_LEFT | WIK_CENTER | WIK_RIGHT))
				{
					if (bWeaveInsert)
						gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_chi.png');
					else
					{
						if (cbCardArray[0] == cbCardArray[1] || cbCardArray[1] == cbCardArray[2])
						{
							gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_jiao.png');
						}
						else
						{
							gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_shun.png');
						}
					}
				}
				else if(cbWeaveKing == WIK_TI)
					gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_ti.png');
				else if(cbWeaveKing == WIK_PAO)
					gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_pao.png');
				gameEnd['kind'+wViewChaird+i].visible = true;
				for(var k = 0; k < 4; k++)
				{
					if(cbCardArray[k] === undefined || cbCardArray[k] == 0)
					{
						gameEnd['mj'+wViewChaird+i+k].visible = false;
						break;
					}
					var spValue = new cc.Sprite(('#s'+cbCardArray[k]+'.png'));
					spValue.x = 30;
					spValue.y = 30;
					gameEnd['mj'+wViewChaird+i+k].addChild(spValue);
					gameEnd['mj'+wViewChaird+i+k].visible = true;
				}
				gameEnd['hx'+wViewChaird+i].setString(getHuXi(cbWeaveKing, cbCardArray));
			}
			var cbCardIndex = [];
			gameLogic.switchToCardIndexEx(gameEnd.resultData.cbCardData[wChaird], gameEnd.resultData.cbCardCount[wChaird], cbCardIndex);
			for(var i = 0; i < MAX_INDEX; i++)
			{
				if(cbCardIndex[i] == 4)
				{
					var cbCardArray = [gameLogic.switchToCardData(i), gameLogic.switchToCardData(i), gameLogic.switchToCardData(i), gameLogic.switchToCardData(i)];
					gameEnd['hx'+wViewChaird+cbWeaveCount].setString(getHuXi(WIK_TI, cbCardArray));
					gameEnd['kind'+wViewChaird+cbWeaveCount].setSpriteFrame('img_ti.png');
					gameEnd['kind'+wViewChaird+cbWeaveCount].visible = true;
					for(var j = 0; j < 4; j++)
					{
						var spValue = new cc.Sprite(('#s'+gameLogic.switchToCardData(i)+'.png'));
						spValue.x = 30;
						spValue.y = 30;
						gameEnd['mj'+wViewChaird+cbWeaveCount+j].addChild(spValue);
						gameEnd['mj'+wViewChaird+cbWeaveCount+j].visible = true;
					}
					cbCardIndex[i] -= 4;
					cbWeaveCount++;
				}
				if(cbCardIndex[i] == 3)
				{
					var cbCardArray = [gameLogic.switchToCardData(i), gameLogic.switchToCardData(i), gameLogic.switchToCardData(i), 0];
					gameEnd['hx'+wViewChaird+cbWeaveCount].setString(getHuXi(WIK_WEI, cbCardArray));
					gameEnd['kind'+wViewChaird+cbWeaveCount].setSpriteFrame('img_kan.png');
					gameEnd['kind'+wViewChaird+cbWeaveCount].visible = true;
					gameEnd['mj'+wViewChaird+cbWeaveCount+3].visible = false;
					for(var j = 0; j < 3; j++)
					{
						var spValue = new cc.Sprite(('#s'+gameLogic.switchToCardData(i)+'.png'));
						spValue.x = 30;
						spValue.y = 30;
						gameEnd['mj'+wViewChaird+cbWeaveCount+j].addChild(spValue);
						gameEnd['mj'+wViewChaird+cbWeaveCount+j].visible = true;
					}
					cbCardIndex[i] -= 3;
					cbWeaveCount++;
				}
			}
			var cbCount = 0;
			var cbCardCount = 0;
			var cbCardData = [];
			cbCardCount = gameLogic.switchToCardDataEx(cbCardIndex, cbCardData);
			for(var i = 0; i < cbCardCount; i++)
			{
				var spValue = new cc.Sprite(('#s'+cbCardData[i]+'.png'));
				spValue.x = 30;
				spValue.y = 30;
				gameEnd['mj'+wViewChaird+cbWeaveCount+cbCount].addChild(spValue);
				gameEnd['mj'+wViewChaird+cbWeaveCount+cbCount].visible = true;
				gameEnd['kind'+wViewChaird+cbWeaveCount].visible = true;
				cbCount++;
				if(cbCount >= 3)
				{
					gameEnd['mj'+wViewChaird+cbWeaveCount+3].visible = false;
					cbCount = 0;
					cbWeaveCount++;
				}
			}
		}
	},
	getViewChaird:function(wWinner, wChaird)
	{
		if(wWinner == INVALID_CHAIR)
		{
			return gameLogic.switchViewChairID(wChaird);
		}
		else
		{
			return (wChaird+GAME_PLAYER-wWinner)%GAME_PLAYER;
		}
	},
	initCallBack:function()
	{
	    gameEnd.goonCall = function()
	    {
	    	gameEnd.node.removeAllChildren();
	    	gameEnd.node.removeFromParent();
	    	gameEnd.node.visible = false;
	    	gameEnd.clearGameData();
	    	//发送准备
            if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT && mainScene._wMeChaird != INVALID_CHAIR)
                socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
	    }
	},
	clearGameData:function()
	{
		if(mainScene._wMeChaird == INVALID_CHAIR)
	    {
	        if(gameEnd.node)
	        {
	          if(gameEnd.node._parent)
	          {
	            gameEnd.node.visible = false;
	            gameEnd.node.removeFromParent();
	          }
	        }
	    }
		gameEnd.resultData = {};
		topUI.imgResultBtn.visible = false;
	    mainScene._cbActionCard = 0;
	    mainScene._cbActionMask = WIK_NULL;
	    operateBtn.hideOperate();
	    handMahJong.clear();
	    outMahJong.hide();
	    disCardControl.clear();
	    weaveControl.clear();
	    disPatchAmt.clear();
	    tingWnd.clear();
	    for(var i = 0; i < GAME_PLAYER; i++)
	    {
	    	mainScene.isXiaoXiangGong(i, false);
	    }
	}
};