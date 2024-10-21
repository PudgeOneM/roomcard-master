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
			if (wLogicChairID == data.wChihuUser)
			{
				gameEnd['result'+i].setSpriteFrame('hu.png');
				gameEnd['result'+i].visible = true;
				//胡牌牌型
				gameEnd.setChiHuResult(i);
			}
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
			//一片胡情况下 显示杠分统计
			if (mainScene._bYiPianHu)
			{
				gameEnd['minggangCount'+i].setString(data.cbMingGangCount[wLogicChairID]);
				gameEnd['angangCount'+i].setString(data.cbAnGangCount[wLogicChairID]);
				gameEnd['jifenScore'+i].setString(data.lJiFen[wLogicChairID]);
				gameEnd['gangScore'+i].setString(data.lGangScore[wLogicChairID]);
				gameEnd['gangNode'+i].visible = true;
			}
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
			CHR_TIAN_HU,
			CHR_DI_HU,
			CHR_QIANG_GANG,
			CHR_DADIAO_WUBAIDA,
			CHR_WUBAIDA,
			CHR_SAN_BAIDA,
			CHR_BAO_TOU,
			CHR_DADIAO_BAIDA,
			CHR_YI_PIAN_HU,
		];
		var chr_str = 
		[
			"天胡 ",
			"地胡 ",
			"拉杠 ",
			"大吊无百搭 ",
			"无百搭 2倍 ",
			"三百搭 2倍 ",
			"爆头 2倍 ",
			"大吊百搭 2倍 ",
			"一片胡 1倍 ",
		];
		var chrStr = "";
		for (var i = 0; i < CHR_MAX_COUNT; i++) 
		{
			if (gameEnd.result.dwChiHuRight & chr_type[i])
			{
				chrStr += chr_str[i];
			}
		}
		if (gameEnd.result.cbGangKaiNum > 0)
		{
			var value = Math.pow(2, gameEnd.result.cbGangKaiNum);
			chrStr += "杠开 "+value+"倍 ";
		}
		if (gameEnd.result.cbPiaoCaiNum > 0)
		{
			var value = Math.pow(2, gameEnd.result.cbPiaoCaiNum);
			chrStr += "飘财 "+value+"倍 ";
		}
		if (mainScene._cbTypeFB > 0)
		{
			if (mainScene._cbTypeFB == 1)
				chrStr += "豹子 ";
			else if (mainScene._cbTypeFB == 2)
				chrStr += "十点 ";
			else if (mainScene._cbTypeFB == 3)
				chrStr += "流局 ";
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
				gameEnd['majiang'+wChaird].addChild(card);
			};
		}
	},
	initCallBack:function()
	{
	    gameEnd.goonCall = function()
	    {
	    	mainScene._bSetUserMahJong = false;
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
		tableNode.laizipiNode.visible = false;
		//清空花牌
		huaCardControl.clearCardData();
		tableNode.baoziIcon.visible = false;
	}
};