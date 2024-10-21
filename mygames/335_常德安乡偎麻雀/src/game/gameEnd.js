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
		if(wWinner == INVALID_CHAIR)
		{
			//流局
			gameEnd["title"].setSpriteFrame('liuju.png');
			managerAudio.playEffect('gameRes/sound/huang.mp3');
		}
		else
		{
			//牌型
			gameEnd.showChiHuType();
		}
		for(var i = 0; i < GAME_PLAYER; i++)
		{
			if (data.lGameScore[i] > 0)
			{
				if(i == mainScene._wMeChaird)
				{
					gameEnd["title"].setSpriteFrame('win.png');
					managerAudio.playEffect('gameRes/sound/win.mp3');
				}
			}
			else if(data.lGameScore[i] < 0)
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
		}
		//分溜子
	    gameEnd["fenliuzi"].setString(data.lFenLiuZi);
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
			"印胡 ",
			"多红 ",
			"对子和 ",
			"乌对 ",
			"乌胡 ",
			"点胡 ",
			"满园花 ",
			"大/小字和 ",
			"纯印 ",
			"卓胡 ",
			"姊妹卓 ",
			"三乱卓 ",
			"姊妹卓带拖 ",
			"祖孙卓 ",
			"四乱卓 ",
			"祖孙卓带拖 ",
			"海底胡 ",
			"单吊 ",
			"八碰头 ",
			"假八碰头 ",
			"背靠背 ",
			"手牵手 ",
			"龙摆尾 ",
			"蛰一蛰 ",
			"摸胡 ",
			"九小对 ",
			"天胡 ",
			"无对胡 ",
			"卡威 ",
			"全黑 ",
			"无息 ",
			"六对红 ",
			"四边对 ",
			"全求人 ",
			"项对 ",
			"飘对 ",
			"鸡丁 ",
			"上下五千年 ",
			"边坎 ",
			"真背靠背 ",
			"凤摆尾 ",
			"卡胡 ",
		];
		var str = "";
		for(var i = 0; i < MAX_CHR_COUNT; i++)
		{
			if(gameEnd.resultData.cbChiHuType[i] > 0)
			{
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
		var wView = gameLogic.switchViewChairID(wChaird);//显示索引
		var cbWeaveCount = weaveControl.cbWeaveCount[wView];
		if(wWinner == wChaird && gameEnd.resultData.sctAnalyseItem.cbCardEye != 0)
		{
			for(var i = 0; i < MAX_WEAVE; i++)
			{
				var cbWeaveKing = gameEnd.resultData.sctAnalyseItem.cbWeaveKind[i];
				var cbCardArray = gameEnd.resultData.sctAnalyseItem.cbCardData[i];
				if(cbWeaveKing == WIK_WEI)
					gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_wei.png');
				else if(cbWeaveKing == WIK_PENG)
					gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_peng.png');
				else 
					gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_chi.png');
				for(var k = 0; k < 3; k++)
				{
					var spValue = new cc.Sprite(('#s'+cbCardArray[k]+'.png'));
					spValue.x = 30;
					spValue.y = 30;
					gameEnd['mj'+wViewChaird+i+k].addChild(spValue);
					if(cbCardArray[k] == gameEnd.resultData.cbProvideCard)
					{
						gameEnd['mj'+wViewChaird+i+k].color = cc.color(125, 125, 125);
						spValue.color = cc.color(125, 125, 125);
					}
				}
			}
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
		else
		{
			for(var i = 0; i < cbWeaveCount; i++)
			{
				var cbWeaveKing = weaveControl.cbWeaveArray[wView][i].cbWeaveKind;
				var cbCardArray = weaveControl.cbWeaveArray[wView][i].cbCardArray;
				if(cbWeaveKing == WIK_WEI)
					gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_wei.png');
				else if(cbWeaveKing == WIK_PENG)
					gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_peng.png');
				else 
					gameEnd['kind'+wViewChaird+i].setSpriteFrame('img_chi.png');
				for(var k = 0; k < 3; k++)
				{
					var spValue = new cc.Sprite(('#s'+cbCardArray[k]+'.png'));
					spValue.x = 30;
					spValue.y = 30;
					gameEnd['mj'+wViewChaird+i+k].addChild(spValue);
				}
			}
			var cbCardIndex = [];
			gameLogic.switchToCardIndexEx(gameEnd.resultData.cbCardData[wChaird], gameEnd.resultData.cbCardCount[wChaird], cbCardIndex);
			for(var i = 0; i < MAX_INDEX; i++)
			{
				if(cbCardIndex[i] >= 3)
				{
					gameEnd['kind'+wViewChaird+cbWeaveCount].setSpriteFrame('img_wei.png');
					for(var j = 0; j < 3; j++)
					{
						var spValue = new cc.Sprite(('#s'+gameLogic.switchToCardData(i)+'.png'));
						spValue.x = 30;
						spValue.y = 30;
						gameEnd['mj'+wViewChaird+cbWeaveCount+j].addChild(spValue);
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
				cbCount++;
				if(cbCount >= 3)
				{
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
		gameEnd.resultData = {};
		topUI.imgResultBtn.visible = false;
	    mainScene._cbActionCard = 0;
	    mainScene._cbActionMask = WIK_NULL;
	    operateBtn.hideOperate();
	    handMahJong.clear();
	    outMahJong.hide();
	    disCardControl.clear();
	    weaveControl.clear();
	    gameClock.hideClock();
	    for(var i = 0; i < GAME_PLAYER; i++)
	    {
	    	mainScene.isXiaoXiangGong(i, false);
	    }
	}
};