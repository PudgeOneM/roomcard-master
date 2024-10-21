var gameEnd = 
{
	setGameEndInfo:function(data)
	{
		//请求战绩
        var record = getObjWithStructName('CMD_GR_C_TableHistoryRecordReq') 
        record.szTableKey = tableKey
        socket.sendMessage(MDM_GR_USER, SUB_GR_USER_TABLE_HISTORY_RECORD_REQ, record)

		//注册按钮事件
		gameEnd.initCallBack();

		gameEnd.result = data;

		//添加结算框
		gameEnd.node  = cc.BuilderReader.load(resp.gameEndCCB, gameEnd );
		gameEnd.node.x = mainScene.ctPosX;
		gameEnd.node.y = mainScene.ctPosY;
		mainScene.top.addChild(gameEnd.node, ZORDER_MAX);

		//癞子皮
		var cbLaiZiPi = gameLogic.switchToCardData(mainScene._cbPiziIndex1);
		var spLaiZiPi = weaveControl.create(0, cbLaiZiPi);
		spLaiZiPi.scale = 0.8;
		gameEnd['laizipi'].addChild(spLaiZiPi);
		var wWinner = INVALID_CHAIR;
		var cbDingCount = 0;
		for (var i = 0; i < GAME_PLAYER; i++) {
			if (data.lGameScore[i] < 0 && data.cbFanCount[i] >= 15)
			{
				cbDingCount++;
			}
		}
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
				gameEnd['jin'+i].setString(data.cbFanCount[wLogicChairID]);
				wWinner = i;
				if (wLogicChairID == mainScene._wMeChaird)
				{
					gameEnd['title'].setSpriteFrame('win.png');
					gameEnd['title'].visible = true;
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
				gameEnd['jin'+i].setString('-'+data.cbFanCount[wLogicChairID]);
				gameEnd['type'+i].setString(gameEnd.getBPMAstr(i));
				if (wLogicChairID == mainScene._wMeChaird)
				{
					gameEnd['title'].setSpriteFrame('lose.png');
					gameEnd['title'].visible = true;
				}
				if(wLogicChairID == data.wChengBaoID)
				{
					gameEnd['result'+i].setSpriteFrame('chengbao.png');
					gameEnd['result'+i].visible = true;
				}
				else if (wLogicChairID == data.wProvideUser)
				{
					gameEnd['result'+i].setSpriteFrame('dianpao.png');
					gameEnd['result'+i].visible = true;
				}
				if (data.cbFanCount[wLogicChairID] >= 15 && data.wChengBaoID == INVALID_CHAIR)
				{
					var res = 
					[
						'fengding.png',
						'fengding.png',
						'yinding.png',
						'jinding.png',
					];
					gameEnd['ding'+i].setSpriteFrame(res[cbDingCount]);
					gameEnd['ding'+i].visible = true;
				}
			}
			else if (data.lGameScore[wLogicChairID] == 0 && data.cbFanCount[wLogicChairID] > 0)
			{
				gameEnd['score'+i].setString(0);
				gameEnd['jin'+i].setString('-'+data.cbFanCount[wLogicChairID]);
				gameEnd['type'+i].setString(gameEnd.getBPMAstr(i));
			}
			else
			{
				gameEnd['score'+i].setString(0);
				gameEnd['jin'+i].setString(0);
				gameEnd['type'+i].setString(gameEnd.getBPMAstr(i));
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
		//牌型  番数
		var chr_type = 
		[
			CHR_XIAO_HU,
			CHR_MEN_QING,
			CHR_QING_SHUI,
			CHR_QI_DUI,
			CHR_QING_YI_SE,
			CHR_FENG_YI_SE,
			CHR_JIANG_YI_SE,
			CHR_PENG_PENG_HU,
			CHR_DAN_DIAO,
			CHR_ZI_MO,
			CHR_GANG_KAI,
			CHR_QIANG_GANG,
			CHR_H_D_L_Y,
		];
		var chr_str = 
		[
			"小胡 ",
			"门前清 ",
			"清水 ",
			"七对 ",
			"清一色 ",
			"风一色 ",
			"将一色 ",
			"碰碰胡 ",
			"全求人 ",
			"自摸 ",
			"杠开 ",
			"抢杠 ",
			"海底捞月 ",
		];
		var chrStr = "";
		for (var i = 0; i < CHR_MAX_COUNT; i++) 
		{
			if (gameEnd.result.dwChiHuRight & chr_type[i])
			{
				chrStr += chr_str[i];
			}
		}
		gameEnd['type'+wWinner].setString(chrStr+' '+gameEnd.getBPMAstr(wWinner));
	},
	getBPMAstr:function(wChaird)
	{
		var str = '宝:'+baopi.baoNum[wChaird]+' 皮:'+baopi.piNum[wChaird]+' 明:'+weaveControl.mingNum[wChaird]+' 暗:'+weaveControl.anNum[wChaird];
		return str;
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
		//清空宝皮数据
		baopi.clearData();
	}
};