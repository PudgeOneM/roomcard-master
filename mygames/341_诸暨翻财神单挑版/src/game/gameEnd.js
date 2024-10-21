var gameEnd = 
{
	setGameEndInfo:function(data)
	{
		//请求战绩
        var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
        record.szTableKey = tableKey
        socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)

		gameEnd.result = data;

		//添加结算框
		//注册按钮事件
		gameEnd.initCallBack();
		gameEnd.node  = cc.BuilderReader.load(resp.gameEndCCB, gameEnd );
		gameEnd.node.x = mainScene.ctPosX;
		gameEnd.node.y = mainScene.ctPosY;
		mainScene.top.addChild(gameEnd.node, ZORDER_MAX);
		var lWinScore = 0;
		for (var i = 0; i < GAME_PLAYER; i++) {
			if (data.lGameScore[i] > 0)
				lWinScore = data.lGameScore[i];
		};
		var wWinner = INVALID_CHAIR;
		for (var i = 0; i < GAME_PLAYER; i++) {
			var wLogicChairID = gameLogic.switchLogicChairdID(i);
			//姓名
			var name = mainScene._szNickName[wLogicChairID];
			gameEnd['name'+i].setString(name);
			//积分 番数  牌型
			if (data.lGameScore[wLogicChairID] > 0)
			{
				gameEnd['score'+i].color = cc.color(245, 255, 19);
				gameEnd['score'+i].setString(data.lGameScore[wLogicChairID]);
				wWinner = i;
				if (wLogicChairID == mainScene._wMeChaird)
				{
					gameEnd['title'].setSpriteFrame('win.png');
					gameEnd['title'].visible = true;
					managerAudio.playEffect('gameRes/sound/win.wav');
				}
				gameEnd['result'+i].setSpriteFrame('hu.png');
				gameEnd['result'+i].visible = true;
				//胡牌牌型
				gameEnd.setChiHuResult(i);
			}
			else if (data.lGameScore[wLogicChairID] < 0)
			{
				gameEnd['score'+i].color = cc.color(20, 255, 252);
				gameEnd['score'+i].setString(data.lGameScore[wLogicChairID]);
				if (wLogicChairID == mainScene._wMeChaird)
				{
					gameEnd['title'].setSpriteFrame('lose.png');
					gameEnd['title'].visible = true;
					managerAudio.playEffect('gameRes/sound/loss.wav');
				}
				if (wLogicChairID == data.wProvideUser)
				{
					gameEnd['result'+i].setSpriteFrame('dianpao.png');
					gameEnd['result'+i].visible = true;
				}
			}
			else
			{
				gameEnd['score'+i].setString(0);
			}
			//麻将牌
			gameEnd.setCardData(i, wWinner);
		};
		//荒庄
		if (wWinner == INVALID_CHAIR)
		{
			gameEnd['title'].setSpriteFrame('huangzhuang.png');
			gameEnd['title'].visible = true;
		}
	},
	setChiHuResult:function(wWinner)
	{
		var wLogicChairID = gameLogic.switchLogicChairdID(wWinner);
		//牌型  番数
		var chr_type = 
		[
			CHR_WU_CAI,
			CHR_PING_HU, 		
			CHR_DUI_DUI_HU, 		
			CHR_QING_YI_SE_HU, 	
			CHR_HUN_YI_SE_HU, 	
			CHR_GANG_KAI_HU, 	
			CHR_TIAN_HU, 		
			CHR_DI_HU, 			
			CHR_QIANG_GANG_HU, 	
			CHR_LAO_ZHUANG, 	
			CHR_QUAN_FENG,
		];
		var chr_str = 
		[
			"无财 1台 ",
			"平胡 1台 ",
			"对对胡 1台 ",
			"清一色 3台 ",
			"混一色 1台 ",
			"杠开 1台 ",
			"天胡 辣子 ",
			"地胡 辣子 ",
			"抢杠 1台 ",
			"老庄 ",
			"全风 辣子 ",
		];
		var chrStr = "";
		for (var i = 0; i < CHR_MAX_COUNT; i++) 
		{
			if (gameEnd.result.dwChiHuRight & chr_type[i])
			{
				chrStr += chr_str[i];
			}
		}
		if (gameEnd.result.cbZhongFaBai > 0) 
		{
			chrStr += "中发白 "+gameEnd.result.cbZhongFaBai+"台 ";
		}
		if (gameEnd.result.cbDongCount > 0) 
		{
			chrStr += "东风 "+gameEnd.result.cbDongCount*2+"台 ";
		}
		gameEnd['type'+wWinner].setString("");
		gameEnd['type'+wWinner].setString(chrStr);
		gameEnd['type'+wWinner].visible = true;
	},
	setCardData:function(wChaird, wWinner)
	{
		var cardWidth = (new cc.Sprite("#down_weave_0.png")).width;
		var posX = 0;
		for (var i = 0; i < weaveControl.cbWeaveCount[wChaird]; i++) {
			var cbWeaveKind = weaveControl.cbWeaveArray[wChaird][i].cbWeaveKind;
			var cbCenterCard = weaveControl.cbWeaveArray[wChaird][i].cbCenterCard;
			var cbPublicCard = weaveControl.cbWeaveArray[wChaird][i].cbPublicCard;
			var cbCardData = weaveControl.cbWeaveArray[wChaird][i].cbCardData;
			if (cbWeaveKind & WIK_GANG || cbWeaveKind & WIK_S_GANG || cbWeaveKind & WIK_D_GANG || cbWeaveKind & WIK_T_GANG)
			{
				if (cbPublicCard)
				{
					var cbWeaveCardData = [];
					cbWeaveCardData[0] = cbCardData[1];
					cbWeaveCardData[1] = cbCardData[2];
					cbWeaveCardData[2] = cbCardData[3];
					cbWeaveCardData[3] = cbCardData[0];
					for (var j = 0; j < 4; j++) {
						var card = weaveControl.create(0, cbWeaveCardData[j]);
						card.scale = 0.7;
						card.setAnchorPoint(cc.p(0, 0));
						if (j == 3)
						{
							card.x = posX+cardWidth*0.7;
							card.y = 16;
						}
						else
							card.x = posX+cardWidth*0.7*j;
						gameEnd['majiang'+wChaird].addChild(card);
						if (gameLogic.isMagicCard(cbWeaveCardData[j],false))
						{
							card.color = cc.color(0, 255, 0);
							card.spValue.color = cc.color(0, 255, 0);
						}
					};
					posX += cardWidth*0.7*3 + 15;
				}
				else
				{
					for (var j = 0; j < 4; j++) {
						var card = null;
						if (j == 3)
						{
							card = weaveControl.create(0, cbCenterCard);
							card.setAnchorPoint(cc.p(0, 0));
							card.x = posX+cardWidth*0.7;
							card.y = 16;
						}
						else
						{
							card = weaveControl.create(0, 0);
							card.setAnchorPoint(cc.p(0, 0));
							card.x = posX+cardWidth*0.7*j;
						}
						card.scale = 0.7;
						gameEnd['majiang'+wChaird].addChild(card);
					};
					posX += cardWidth*0.7*3 + 15;
				}
			}
			else
			{
				if (cbWeaveKind & WIK_S_CHI) 
				{
					var cbWeaveCardData = [];
					if (cbCardData[1] - cbCardData[0] == 1)
					{
						cbWeaveCardData[0] = cbCardData[2];
						cbWeaveCardData[1] = cbCardData[0];
						cbWeaveCardData[2] = cbCardData[1];
					}
					else if (cbCardData[1] - cbCardData[0] == 2)
					{
						cbWeaveCardData[0] = cbCardData[0];
						cbWeaveCardData[1] = cbCardData[2];
						cbWeaveCardData[2] = cbCardData[1];
					}
					else if (cbCardData[0] - cbCardData[1] == 1)
					{
						cbWeaveCardData[0] = cbCardData[2];
						cbWeaveCardData[1] = cbCardData[1];
						cbWeaveCardData[2] = cbCardData[0];
					}
					else if (cbCardData[0] - cbCardData[1] == 2)
					{
						cbWeaveCardData[0] = cbCardData[1];
						cbWeaveCardData[1] = cbCardData[2];
						cbWeaveCardData[2] = cbCardData[0];
					}
					for (var j = 0; j < 3; j++) {
						var card = weaveControl.create(0, cbWeaveCardData[j]);
						card.setAnchorPoint(cc.p(0, 0));
						card.scale = 0.7;
						card.x = posX+cardWidth*0.7*j;
						gameEnd['majiang'+wChaird].addChild(card);
						if (gameLogic.isMagicCard(cbWeaveCardData[j],false))
						{
							card.color = cc.color(0, 255, 0);
							card.spValue.color = cc.color(0, 255, 0);
						}
					};
				}
				else
				{
					for (var j = 0; j < 3; j++) {
						var card = weaveControl.create(0, cbCardData[j]);
						card.setAnchorPoint(cc.p(0, 0));
						card.scale = 0.7;
						card.x = posX+cardWidth*0.7*j;
						gameEnd['majiang'+wChaird].addChild(card);
						if (gameLogic.isMagicCard(cbCardData[j],false))
						{
							card.color = cc.color(0, 255, 0);
							card.spValue.color = cc.color(0, 255, 0);
						}
					};
				}
				posX += cardWidth*0.7*3 + 15;
			}
		};
		var wLogicChairID = gameLogic.switchLogicChairdID(wChaird);
		if (wChaird == wWinner)
		{
			for (var i = 0; i < gameEnd.result.cbCardCount[wLogicChairID]; i++) {
				if (gameEnd.result.cbCardData[wLogicChairID][i] == gameEnd.result.cbProvideCard)
				{
					gameEnd.result.cbCardData[wLogicChairID][i] = 0;
					break;
				};
			};
			mainScene.sortHandCard(gameEnd.result.cbCardData[wLogicChairID]);
			posX += cardWidth*0.7*(gameEnd.result.cbCardCount[wLogicChairID]-2);
			for (var i = 0; i < gameEnd.result.cbCardCount[wLogicChairID]-1; i++) {
				var card = weaveControl.create(0, gameEnd.result.cbCardData[wLogicChairID][i]);
				card.setAnchorPoint(cc.p(0, 0));
				card.scale = 0.7;
				card.x = posX-cardWidth*0.7*i;
				gameEnd['majiang'+wChaird].addChild(card);
				if (gameLogic.isMagicCard(gameEnd.result.cbCardData[wLogicChairID][i],false))
				{
					card.color = cc.color(0, 255, 0);
					card.spValue.color = cc.color(0, 255, 0);
				}
			};

			posX = posX+cardWidth*0.7+15;
			var card = weaveControl.create(0, gameEnd.result.cbProvideCard);
			card.setAnchorPoint(cc.p(0, 0));
			card.scale = 0.7;
			card.x = posX;
			gameEnd['majiang'+wChaird].addChild(card);
			if (gameLogic.isMagicCard(gameEnd.result.cbProvideCard,false))
			{
				card.color = cc.color(0, 255, 0);
				card.spValue.color = cc.color(0, 255, 0);
			}
		}
		else
		{
			mainScene.sortHandCard(gameEnd.result.cbCardData[wLogicChairID]);
			posX = posX+cardWidth*0.7*(gameEnd.result.cbCardCount[wLogicChairID]-1);
			for (var i = 0; i < gameEnd.result.cbCardCount[wLogicChairID]; i++) {
				var card = weaveControl.create(0, gameEnd.result.cbCardData[wLogicChairID][i]);
				card.setAnchorPoint(cc.p(0, 0));
				card.scale = 0.7;
				card.x = posX-cardWidth*0.7*i;
				gameEnd['majiang'+wChaird].addChild(card);
				if (gameLogic.isMagicCard(gameEnd.result.cbCardData[wLogicChairID][i],false))
				{
					card.color = cc.color(0, 255, 0);
					card.spValue.color = cc.color(0, 255, 0);
				}
			};
		}
	},
	initCallBack:function()
	{
	    gameEnd.goonCall = function()
	    {
	    	gameEnd.node.visible = false;
	    	gameEnd.node.removeFromParent();
	    	gameEnd.clearGameData();
     		tableMahJong.clearCardData();
	    	//发送准备
            if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT && mainScene._wMeChaird != INVALID_CHAIR)
                socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
	    }
	},
	clearGameData:function()
	{
		//如果旁观用户没关闭结算框   程序主动给他关闭
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
		//隐藏计时器
		gameClock.hideClock();
		//清空手牌
		var cbCardData = [];
		handMahJong.setCardData(cbCardData, 0, true);
		//清空其他玩家牌
		otherMahJong.clearCardData();
		//清空弃牌
		disCardControl.clearCardData();
		//清空吃碰杠牌堆
		weaveControl.clearCardData();
		//清空出牌
		outMahJong.hideOutCard();
		//清空剩余牌数
		tableNode.leftCardBg.visible = false;
		mainScene.leftNum.visible = false;
		tableNode.laizipiNode.visible = false;
      	tableNode.laizipi.visible = false;
      	tableNode.laizipiNode2.visible = false;
      	tableNode.laizipi2.visible = false;
		//清空吃碰杠操作
		operateBtn.hideOperate();
	}
};