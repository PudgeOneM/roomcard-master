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
		var wWinner = 0;
		for (var i = 0; i < GAME_PLAYER; i++) {
			if (data.dwChiHuKind[i] == WIK_CHI_HU)
        	{
        		wWinner = i;
        	}
		};
		//玩家结算信息
		for (var i = 0; i < GAME_PLAYER; i++) {
			var name = mainScene._szNickName[i];
			//姓名
			gameEnd['name'+i].setString(name);
			//积分
			var score = new ccui.TextAtlas();
        	score.setAnchorPoint(cc.p(0,0.5));
        	if (data.dwChiHuKind[i] == WIK_CHI_HU)
        	{
        		gameEnd['btnResult'+i].visible = true;
        		wWinner = i;
        		gameEnd['imgHu'+i].visible = true;
        	}
			if (data.lGameScore[i] > 0)
			{
				gameEnd['sign'+i].visible = true;
				score.setProperty("0", resp.winNum, 20, 28, "0");
				
				if (i == mainScene._wMeChaird)
					managerAudio.playEffect('gameRes/sound/win.wav');
			}
			else if (data.lGameScore[i] < 0)
			{
				gameEnd['sign'+i].setSpriteFrame('img_sign_sub.png');
				gameEnd['sign'+i].visible = true;
				score.setProperty("0", resp.loseNum, 20, 28, "0");
				//点炮
				if (data.wProvideUser == i) 
				{
					if (data.dwChiHuRight[wWinner] & CHR_HUAN_GANG)
						gameEnd['dianpao'+i].setSpriteFrame('img_huangang.png');
					else
						gameEnd['dianpao'+i].setSpriteFrame('img_dianpao.png');
					gameEnd['dianpao'+i].visible = true;
				}
				if (data.dwChiHuRight[wWinner] & CHR_SONG_GANG && data.wSongGangID[wWinner] == i)
				{
					gameEnd['dianpao'+i].setSpriteFrame('img_songgang.png');
					gameEnd['dianpao'+i].visible = true;
				}
				if (i == mainScene._wMeChaird)
					managerAudio.playEffect('gameRes/sound/loss.wav');
			}
			else
			{
				score.setProperty("0", resp.loseNum, 20, 28, "0");
			}
			score.setString(data.lGameScore[i]);
			gameEnd['score'+i].addChild(score);
		}
		if (data.dwChiHuKind[mainScene._wMeChaird] == WIK_CHI_HU)
			wWinner = mainScene._wMeChaird;
		gameEnd.setGameResult(wWinner);
	},
	setGameResult:function(wWinner)
	{
		//胡牌麻将
		//牌型  番数
		var chr_type = 
		[
			CHK_NULL,
			CHR_PING_HU,
			CHR_BIAN_DAO,
			CHR_DUI_DAO,
			CHR_QIAN_DAO,
			CHR_DAN_DIAO,
			CHR_ZI_MO,
			CHR_DA_DIAO,
			CHR_DA_DUI_ZI,
			CHR_GANG_KAI,
			CHR_QIANG_GANG,
			CHR_TIAN_HU,
			CHR_DI_HU,
			CHR_QING_YI_SE,
			CHR_HUN_YI_SE,
			CHR_ZI_YI_SE,
			CHR_H_D_L_Y,
			CHR_BA_HUA,
			CHR_SI_HUA,
			CHR_ZHENG_FENG,
			CHR_QUAN_FENG,
			CHR_QUAN_ZHENG_FENG,
			CHR_MEN_QING,
			CHR_ZHONG_FA_BAI,
			CHR_ZHENG_HUA,
			CHR_YE_HUA,
		];
		var chr_str = 
		[
			"流局",
			"平胡  1台",
			"边倒  1台",
			"对倒  1台",
			"嵌倒  1台",
			"单吊  1台",
			"自摸  1台",
			"大吊  1台",
			"对对胡  2台",
			"杠开  1台",
			"拉杠  1台",
			"天胡  4台",
			"地胡  2台",
			"清一色  4台",
			"混一色  2台",
			"字一色  8台",
			"海底捞月 1台",
			"八花  4台",
			"四花  2台",
			"正风  1台",
			"圈风  1台",
			"圈正风  2台",
			"门清  1台",
			"中发白  ",
			"正花  ",
			"野花  ",
		];
		gameEnd['baoInfo'].setString("");
		if (gameEnd.result.wProvideUser == INVALID_CHAIR)
		{
			//流局
			gameEnd['liuju'].visible = true;
		}
		else
		{
			for (var i = 0; i < 12; i++) {
				gameEnd['type'+i].setString("");
				gameEnd['type'+i].visible = false;
			}
			var baoStr = "";
			if(gameEnd.result.cbBao[wWinner][(wWinner+1)%GAME_PLAYER] >= 3 || 
				gameEnd.result.cbBao[(wWinner+1)%GAME_PLAYER][wWinner] >= 3)
			{
				if (gameEnd.result.cbBao[wWinner][(wWinner+1)%GAME_PLAYER] >= 3 &&
				gameEnd.result.cbBao[(wWinner+1)%GAME_PLAYER][wWinner] >= 3) 
				{
					baoStr += "与下家互包  "
				}
				else
				{
					baoStr += "与下家做生意  "
				}
			}
			if(gameEnd.result.cbBao[wWinner][(wWinner+2)%GAME_PLAYER] >= 3 || 
				gameEnd.result.cbBao[(wWinner+2)%GAME_PLAYER][wWinner] >= 3)
			{
				if (gameEnd.result.cbBao[wWinner][(wWinner+2)%GAME_PLAYER] >= 3 &&
				gameEnd.result.cbBao[(wWinner+2)%GAME_PLAYER][wWinner] >= 3) 
				{
					baoStr += "与对家互包  "
				}
				else
				{
					baoStr += "与对家做生意  "
				}
			}
			if(gameEnd.result.cbBao[wWinner][(wWinner+3)%GAME_PLAYER] >= 3 || 
				gameEnd.result.cbBao[(wWinner+3)%GAME_PLAYER][wWinner] >= 3)
			{
				if (gameEnd.result.cbBao[wWinner][(wWinner+3)%GAME_PLAYER] >= 3 &&
				gameEnd.result.cbBao[(wWinner+3)%GAME_PLAYER][wWinner] >= 3) 
				{
					baoStr += "与上家互包  "
				}
				else
				{
					baoStr += "与上家做生意  "
				}
			}
			gameEnd['baoInfo'].setString(baoStr);
			var nType = 0;
			for (var i = 0; i < CHR_MAX_COUNT; i++) {
				//暂时CCB只做了12个牌型LABEL
				if (gameEnd.result.dwChiHuRight[wWinner] & chr_type[i] && nType < 12)
				{

					if (i == 23)
					{
						//中发白
						gameEnd['type'+nType].setString(chr_str[i]+gameEnd.result.cbZhongFaBai[wWinner]+'台');
					}
					else if (i == 24)
					{
						//正花
						gameEnd['type'+nType].setString(chr_str[i]+gameEnd.result.cbZhengHua[wWinner]*1+'台');
					}
					// else if (i == 25)
					// {
					// 	//野花
					// 	gameEnd['type'+nType].setString(chr_str[i]+gameEnd.result.cbYeHua[wWinner]+'台');
					// }
					else
					{
						gameEnd['type'+nType].setString(chr_str[i]);
					}
					gameEnd['type'+nType].visible = true;
					nType = nType + 1;
				}
			}
			gameEnd['fanText'].visible = true;
			gameEnd['fanNum'].visible = true;
			gameEnd['fanNum'].setString(gameEnd.result.cbFanCount[wWinner]);
					//麻将牌
			gameEnd.setCardData(wWinner);
		}
	},
	setCardData:function(wWinner)
	{
		gameEnd.mahjong.removeAllChildren();
		var wViewChaird = gameLogic.switchViewChairID(wWinner);
		var cardWidth = (new cc.Sprite("#down_weave_0.png")).width;
		var posX = 0;
		var lScale = 0.9;
		for (var i = 0; i < weaveControl.cbWeaveCount[wViewChaird]; i++) {
			var cbWeaveKind = weaveControl.cbWeaveArray[wViewChaird][i].cbWeaveKind;
			var cbCenterCard = weaveControl.cbWeaveArray[wViewChaird][i].cbCenterCard;
			var cbPublicCard = weaveControl.cbWeaveArray[wViewChaird][i].cbPublicCard;
			var cbCardData = weaveControl.cbWeaveArray[wViewChaird][i].cbCardData;
			if (cbWeaveKind & WIK_GANG)
			{
				if (cbPublicCard)
				{
					for (var j = 0; j < 4; j++) {
						var card = weaveControl.create(0, cbCenterCard);
						card.scale = lScale;
						card.setAnchorPoint(cc.p(0, 0));
						if (j == 3)
						{
							card.x = posX+cardWidth*lScale;
							card.y = 16;
						}
						else
							card.x = posX+cardWidth*lScale*j;
						gameEnd['mahjong'].addChild(card);
					};
					posX += cardWidth*lScale*3 + 15;
				}
				else
				{
					for (var j = 0; j < 4; j++) {
						var card = null;
						if (j == 3)
						{
							card = weaveControl.create(0, cbCenterCard);
							card.setAnchorPoint(cc.p(0, 0));
							card.x = posX+cardWidth*lScale;
							card.y = 16;
						}
						else
						{
							card = weaveControl.create(0, 0);
							card.setAnchorPoint(cc.p(0, 0));
							card.x = posX+cardWidth*lScale*j;
						}
						card.scale = lScale;
						gameEnd['mahjong'].addChild(card);
					};
					posX += cardWidth*lScale*3 + 15;
				}
			}
			else
			{
				for (var j = 0; j < 3; j++) {
					var card = weaveControl.create(0, cbCardData[j]);
					card.setAnchorPoint(cc.p(0, 0));
					card.scale = lScale;
					card.x = posX+cardWidth*lScale*j;
					gameEnd['mahjong'].addChild(card);
				};
				posX += cardWidth*lScale*3 + 15;
			}
		};
		gameEnd.result.cbCardData[wWinner].sort(function(a, b) {return b-a});
		for (var i = 0; i < gameEnd.result.cbCardCount[wWinner]; i++) {
			if (gameEnd.result.cbCardData[wWinner][i] == 0)
			{
				gameEnd.result.cbCardData[wWinner][i] = gameEnd.result.cbProvideCard;
				break;
			}
		};
		for (var i = 0; i < gameEnd.result.cbCardCount[wWinner]; i++) {
			if (gameEnd.result.cbCardData[wWinner][i] == gameEnd.result.cbProvideCard)
			{
				gameEnd.result.cbCardData[wWinner][i] = 0;
				break;
			}
		};
		gameEnd.result.cbCardData[wWinner].sort(function(a, b) {return b-a});
		posX += cardWidth*lScale*(gameEnd.result.cbCardCount[wWinner]-2);
		for (var i = 0; i < gameEnd.result.cbCardCount[wWinner]-1; i++) {
			var card = weaveControl.create(0, gameEnd.result.cbCardData[wWinner][i]);
			card.setAnchorPoint(cc.p(0, 0));
			card.scale = lScale;
			card.x = posX-cardWidth*lScale*i;
			gameEnd['mahjong'].addChild(card);
		};

		posX = posX+cardWidth*lScale+15;
		var card = weaveControl.create(0, gameEnd.result.cbProvideCard);
		card.setAnchorPoint(cc.p(0, 0));
		card.scale = lScale;
		card.x = posX;
		gameEnd['mahjong'].addChild(card);
	},
	initCallBack:function()
	{
		gameEnd.exitCall = function()
	    {
	        var UserStandUp = getObjWithStructName('CMD_GR_UserStandUp')
	        UserStandUp.wTableID = tableData.getUserWithUserId(selfdwUserID).wTableID
	        UserStandUp.wChairID = tableData.getUserWithUserId(selfdwUserID).wChairID || ''
	        UserStandUp.cbForceLeave = true
	        socket.sendMessage(MDM_GR_USER, SUB_GR_USER_STANDUP, UserStandUp) 
	        goHref(appendRefreshtime(hallAddress))
	    }
	    gameEnd.goonCall = function()
	    {
	    	mainScene._bSetUserMahJong = false;
	    	gameEnd.killGameEndNode();
	    	//发送准备
            if(tableData.getUserWithUserId(selfdwUserID).cbUserStatus == US_SIT && mainScene._wMeChaird != INVALID_CHAIR)
                socket.sendMessage(MDM_GF_FRAME, SUB_GF_USER_READY)
	    }
	    gameEnd.resultCall0 = function()
	    {
	    	gameEnd.setGameResult(0);
	    }
	    gameEnd.resultCall1 = function()
	    {
	    	gameEnd.setGameResult(1);
	    }
	    gameEnd.resultCall2 = function()
	    {
	    	gameEnd.setGameResult(2);
	    }
	    gameEnd.resultCall3 = function()
	    {
	    	gameEnd.setGameResult(3);
	    }
	},
	killGameEndNode:function()
	{
		gameEnd.node.removeFromParent();
	},
	clearGameData:function()
	{
		//删除结算框
		//gameEnd.killGameEndNode();
		//隐藏计时器
		gameClock.hideClock();
		//隐藏花数量
		buHua.hideBuHua();
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
		//清空花牌
		huaCardControl.clearCardData();
	}
};