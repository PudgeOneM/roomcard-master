var gameEnd = 
{
	setGameEndInfo:function(data)
	{
		mainScene._isReady = false;
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

		//癞子皮
		var cbLaiZiPi = gameLogic.switchToCardData(mainScene._cbMagicIndex);
		var spLaiZiPi = weaveControl.create(0, cbLaiZiPi);
		spLaiZiPi.scale = 0.8;
		gameEnd['laizipi'].addChild(spLaiZiPi);
		var wWinner = INVALID_CHAIR;
		for (var i = 0; i < GAME_PLAYER; i++) {
			var wLogicChairID = gameLogic.switchLogicChairdID(i);
			//姓名
			var name = mainScene._szNickName[wLogicChairID];
			gameEnd['name'+i].setString(name);
			if (wLogicChairID == mainScene._wMeChaird)
			{
				if(data.lGameScore[wLogicChairID]>0)
				{
					gameEnd['title'].setSpriteFrame('win.png');
					gameEnd['title'].visible = true;
					managerAudio.playEffect('gameRes/sound/win.wav');
				}
				else if(data.lGameScore[wLogicChairID]<0)
				{
					gameEnd['title'].setSpriteFrame('lose.png');
					gameEnd['title'].visible = true;
					managerAudio.playEffect('gameRes/sound/loss.wav');
				}
			}

			//积分 番数  牌型
			if (data.lHuScore[wLogicChairID] > 0)
			{
				gameEnd['totalScore'+i].color = cc.color(245, 255, 19);
				gameEnd['huScore'+i].setString(data.lHuScore[wLogicChairID]);
				gameEnd['totalScore'+i].setString(data.lGameScore[wLogicChairID]);
				gameEnd['gangScore'+i].setString(data.lGangScore[wLogicChairID]);
				wWinner = i;
				gameEnd['result'+i].setSpriteFrame('hu.png');
				gameEnd['result'+i].visible = true;
				//胡牌牌型
				gameEnd.setChiHuResult(i);
			}
			else if (data.lHuScore[wLogicChairID] < 0)
			{
				gameEnd['totalScore'+i].color = cc.color(20, 255, 252);
				gameEnd['huScore'+i].setString(data.lHuScore[wLogicChairID]);
				gameEnd['totalScore'+i].setString(data.lGameScore[wLogicChairID]);
				gameEnd['gangScore'+i].setString(data.lGangScore[wLogicChairID]);
				if (wLogicChairID == data.wChengBaoID)
				{
					gameEnd['result'+i].setSpriteFrame('chengbao.png');
					gameEnd['result'+i].visible = true;
				}
				else if (wLogicChairID == data.wProvideUser)
				{
					gameEnd['result'+i].setSpriteFrame('dianpao.png');
					gameEnd['result'+i].visible = true;
				}
			}
			else
			{
				gameEnd['huScore'+i].setString(data.lHuScore[wLogicChairID]);
				gameEnd['totalScore'+i].setString(data.lGameScore[wLogicChairID]);
				gameEnd['gangScore'+i].setString(data.lGangScore[wLogicChairID]);
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
			CHR_DRAGON,
			CHR_PURE_COLOR,
			CHR_SEVEN_SUB,
			CHR_ZIMO,
		];
		var chr_str = 
		[
			"一条龙 番*2  ",
			"清一色 番*2  ",
			"七小对 番*2  ",
			"自摸  番*2  "
		];
		var chrStr = "";
		for (var i = 0; i < 4; i++) 
		{
			if (gameEnd.result.dwChiHuRight[wLogicChairID] & chr_type[i])
			{
				chrStr += chr_str[i];
			}
		}

		gameEnd['type'+wWinner].setString(chrStr);
		gameEnd['type'+wWinner].color = cc.color(245, 255, 19);
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
			if (cbWeaveKind & WIK_GANG)
			{
				if (cbPublicCard)
				{
					for (var j = 0; j < 4; j++) {
						var card = weaveControl.create(0, cbCenterCard);
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
				for (var j = 0; j < 3; j++) {
					var card = weaveControl.create(0, cbCardData[j]);
					card.setAnchorPoint(cc.p(0, 0));
					card.scale = 0.7;
					card.x = posX+cardWidth*0.7*j;
					gameEnd['majiang'+wChaird].addChild(card);
				};
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
				if(handMahJong.isMagicCard(gameEnd.result.cbCardData[wLogicChairID][i]))
				{
					card.baopi = new cc.Sprite("#laizi.png");
					card.addChild(card.baopi);
					card.baopi.x = 35;
					card.baopi.y = 38;
					card.baopi.visible = true;
				}
				gameEnd['majiang'+wChaird].addChild(card);
			};

			posX = posX+cardWidth*0.7+15;
			var card = weaveControl.create(0, gameEnd.result.cbProvideCard);
			card.setAnchorPoint(cc.p(0, 0));
			card.scale = 0.7;
			card.x = posX;
			gameEnd['majiang'+wChaird].addChild(card);
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

				if(handMahJong.isMagicCard(gameEnd.result.cbCardData[wLogicChairID][i]))
				{
					card.baopi = new cc.Sprite("#laizi.png");
					card.addChild(card.baopi);
					card.baopi.x = 35;
					card.baopi.y = 38;
					card.baopi.visible = true;
				}
				gameEnd['majiang'+wChaird].addChild(card);
			};
		}
	},
	initCallBack:function()
	{
	    gameEnd.goonCall = function()
	    {
	    	gameEnd.node.visible = false;
	    	gameEnd.node.removeFromParent();
	    	
     		//tableMahJong.clearCardData();
	    	//发送准备
            if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT && mainScene._wMeChaird != INVALID_CHAIR)
            {
                socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
            }
            mainScene._isReady = true;
	    }
	},
	clearGameData:function()
	{
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
		//清空吃碰杠操作
		operateBtn.hideOperate();
		//隐藏癞子皮
		tableNode.laiziNode.visible = false;
		tableNode.laizipiNode.visible = false;
		buHua.hideBuHua();
		//清空花牌
		huaCardControl.clearCardData();

	}
	
};