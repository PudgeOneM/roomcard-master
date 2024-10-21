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
			gameEnd['genBankerScore'+i].visible = false;
			if (data.bGenCardScore)
			{
				gameEnd['genBankerScore'+i].visible = true;
				if (wLogicChairID == mainScene._wBankerUser)
				{
					gameEnd['genBankerScore'+i].setString("跟庄：-3");
				}
				else
				{
					gameEnd['genBankerScore'+i].setString("跟庄：1");
				}
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
			CHR_TIAN_HU,
			CHR_DI_HU,
			CHR_WUBAIDA,
			CHR_QI_DUI,
			CHR_QI_DUI_H,
			CHR_QI_DUI_HH,
			CHR_QI_DUI_HHH,
			CHR_BAO_TOU,
			CHR_PING_HU,
			CHR_DA_DIAO,
			CHR_SI_CAI_SHEN,
			CHR_GANG_BAO,
			CHR_13_BUDA,
			CHR_13_BUDA_EX,
		];
		var chr_str = 
		[
			"天胡 10倍 ",
			"地胡 10倍 ",
			"无财神 2倍 ",
			"七对 2倍 ",
			"豪华七对 4倍 ",
			"双豪华七对 8倍 ",
			"三豪华七对 16倍 ",
			"爆头 2倍 ",
			"平胡 10倍 ",
			"大吊 10倍 ",
			"四财神 10倍 ",
			"杠爆 4倍 ",
			"13不搭5风 2倍 ",
			"13不搭6风 7倍 ",
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
			chrStr += "杠开 "+"3倍 ";
		}
		if (gameEnd.result.cbPiaoCaiNum > 0)
		{
			var value = Math.pow(2, gameEnd.result.cbPiaoCaiNum);
			chrStr += "飘财 "+value+"倍 ";
		}
		if (gameEnd.result.cbHuaCardCount > 0)
		{
			chrStr += "补花 "+gameEnd.result.cbHuaCardCount;
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
		tableNode.laizipiNode.visible = false;
      	tableNode.laizipi.visible = false;
		//清空吃碰杠操作
		operateBtn.hideOperate();
		//清空花牌
		huaCardControl.clearCardData();
	}
};