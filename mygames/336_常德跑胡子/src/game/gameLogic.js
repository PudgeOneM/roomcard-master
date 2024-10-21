var INVALID_CHAIR 		= 0xFFFF;           //无效椅子
var INVALID_INDEX		= 0xFF;
var	MASK_COLOR	  		= 0xF0;				//花色掩码
var	MASK_VALUE	  		= 0x0F;				//数值掩码

var WIK_NULL = 0x00								//没有类型
var WIK_LEFT = 0x01								//左吃类型
var WIK_CENTER = 0x02								//中吃类型
var WIK_RIGHT = 0x04								//右吃类型
var WIK_PENG = 0x08								//碰牌类型
var WIK_PAO = 0x10								//跑牌类型
var WIK_TI = 0x20								//提牌类型
var WIK_CHI_HU = 0x40								//吃胡类型
var WIK_WEI = 0x80
var WIK_BAKUAI = 0x100
var gameLogic = 
{
	getMeChaird:function()
	{
		return tableData.getUserWithUserId(selfdwUserID).wChairID;
	},
	getMeUserItem:function()
	{
		return tableData.getUserWithUserId(selfdwUserID);
	},
	//逻辑索引转换显示索引椅子
	switchViewChairID:function(wChairID)
	{
		if(wChairID == INVALID_CHAIR) return INVALID_CHAIR;
		if(selfdwUserID == null) return INVALID_CHAIR;
		//(要转换的椅子 - 本地玩家的椅子 +  玩家数量) % 玩家数量;
		var wViewChairID = INVALID_CHAIR;
		if(mainScene._wMeChaird == INVALID_CHAIR)
			wViewChairID = (wChairID - 0 + GAME_PLAYER) % GAME_PLAYER;
		else
			wViewChairID = (wChairID - gameLogic.getMeChaird() + GAME_PLAYER) % GAME_PLAYER;
		return wViewChairID;
	},
	//显示索引转换逻辑索引椅子
	switchLogicChairdID:function(wViewChairID)
	{
		var wChaird = INVALID_CHAIR;
		if(wViewChairID == INVALID_CHAIR) return INVALID_CHAIR;
		if(selfdwUserID == null) return INVALID_CHAIR;
		if(mainScene._wMeChaird == INVALID_CHAIR)
			return wViewChairID;
		else
			wChaird = (wViewChairID + mainScene._wMeChaird) % GAME_PLAYER;
		return wChaird;
	},
	//扑克转换
	switchToCardData:function(cbCardIndex)
	{
		cc.assert(cbCardIndex<MAX_INDEX, "Errors: gameLogic.js line 33");
		return ((cbCardIndex/10)<<4)|(cbCardIndex%10+1);
	},
	switchToCardDataEx:function(cbCardIndex, cbCardData)
	{
		var cbCardCount = 0;
		for(var i = 0; i < MAX_INDEX; i++)
		{
			for(var j = 0; j < cbCardIndex[i]; j++)
			{
				cbCardData[cbCardCount++] = gameLogic.switchToCardData(i);
			}
		}
		return cbCardCount;
	},
	switchToCardIndex:function(cbCardData)
	{
		cc.assert(gameLogic.isValidCard(cbCardData), "Errors: gameLogic.js line 41");
		if(!gameLogic.isValidCard(cbCardData)) return 0;
		var cbColor = (cbCardData&MASK_COLOR)>>4;
		return cbColor*10+(cbCardData&MASK_VALUE)-1;
	},
	switchToCardIndexEx:function(cbCardData, cbCardCount, cbCardIndex)
	{
		for(var i = 0; i < MAX_INDEX; i++)
			cbCardIndex[i] = 0;
		//转换扑克
		for (var i=0;i<cbCardCount;i++)
		{
			cc.assert(gameLogic.isValidCard(cbCardData[i]), "Errors: gameLogic.js line 58");
			var nIndex = gameLogic.switchToCardIndex(cbCardData[i]);
			cbCardIndex[nIndex] = cbCardIndex[nIndex]+1;
		}
	},
	getCardCount:function(cbCardIndex)
	{
		var cbCardCount = 0;
		for(var i = 0; i < MAX_INDEX; i++)
		{
			cbCardCount += cbCardIndex[i];
		}
		return cbCardCount;
	},
	//红字判断
	isRedCard:function(cbCardData)
	{
		var cbCardIndex = gameLogic.switchToCardIndex(cbCardData);
		if (cbCardIndex == 1 || cbCardIndex == 6 || cbCardIndex == 9 || cbCardIndex == 11 || cbCardIndex == 16 || cbCardIndex == 19) return true;
		return false;
	},
	//大字判断
	isBigCard:function(cbCardData)
	{
		if(cbCardData > 10)
			return true;
		return false;
	},
	isValidCard:function(cbCardData)
	{
		var cbValue=(cbCardData&MASK_VALUE);
		var cbColor=(cbCardData&MASK_COLOR)>>4;
		if (cbColor <= 2)
		{
			if (cbValue >= 1 && cbValue <= 10)
			{
				return true;
			}
		}
		return false;
	},
	getWeaveCard:function(cbWeaveKind, cbCenterCard, cbCardBuffer)
	{
		//组合扑克
		switch (cbWeaveKind)
		{
		case WIK_LEFT:		//上牌操作
			{
				//设置变量
				cbCardBuffer[0]=cbCenterCard;
				cbCardBuffer[1]=cbCenterCard+1;
				cbCardBuffer[2]=cbCenterCard+2;

				return 3;
			}
		case WIK_RIGHT:		//上牌操作
			{
				//设置变量
				cbCardBuffer[0]=cbCenterCard-2;
				cbCardBuffer[1]=cbCenterCard-1;
				cbCardBuffer[2]=cbCenterCard;

				return 3;
			}
		case WIK_CENTER:	//上牌操作
			{
				//设置变量
				cbCardBuffer[0]=cbCenterCard-1;
				cbCardBuffer[1]=cbCenterCard;
				cbCardBuffer[2]=cbCenterCard+1;

				return 3;
			}
		case WIK_PENG:		//碰牌操作
			{
				//设置变量
				cbCardBuffer[0]=cbCenterCard;
				cbCardBuffer[1]=cbCenterCard;
				cbCardBuffer[2]=cbCenterCard;

				return 3;
			}
		default:
			{
				ASSERT(FALSE);
			}
		}

		return 0;
	},
	playGenderEffect:function(wChaird, cbOperateCode, cbCardData)
    {
        var resPrefix = 'gameRes/sound/' + (isOpenPTH?'normal/':'local/')
        var user = tableData.getUserWithChairId(wChaird);
        //var strPath = resPrefix+(user.cbGender?'man/':'woman/');
        var strPath = resPrefix;
        if(cbCardData > 0)
        	managerAudio.playEffect(strPath + cbCardData + '.mp3')
		if ((cbOperateCode&WIK_LEFT)!=0 || (cbOperateCode&WIK_CENTER)!=0 || (cbOperateCode&WIK_RIGHT)!=0)
		{
			managerAudio.playEffect(strPath + 'chi' + '.mp3')
		}
		else if ((cbOperateCode&WIK_PENG)!=0) 
		{
			managerAudio.playEffect(strPath + 'peng' + '.mp3')
		}
		else if ((cbOperateCode&WIK_WEI)!=0) 
		{
			managerAudio.playEffect(strPath + 'wei' + '.mp3')
		}
		else if ((cbOperateCode&WIK_PAO)!=0) 
		{
			managerAudio.playEffect(strPath + 'pao' + '.mp3')
		}
		else if ((cbOperateCode&WIK_TI)!=0) 
		{
			managerAudio.playEffect(strPath + 'ti' + '.mp3')
		}
		else if ((cbOperateCode&WIK_BAKUAI)!=0) 
		{
			managerAudio.playEffect(strPath + 'bakuai' + '.mp3')
		}
		else if ((cbOperateCode&WIK_CHI_HU)!=0) 
		{
			managerAudio.playEffect(strPath + 'hu' + '.mp3')
		}
    },
    getAllCardIndex:function()
    {
    	var cbCardIndex = handMahJong.getCardIndex().concat();
    	for(var i = 0; i < GAME_PLAYER; i++)
    	{
    		for(var j = 0; j < weaveControl.cbWeaveCount[i]; j++)
    		{
    			var cbWeaveKind = weaveControl.cbWeaveArray[i][j].cbWeaveKind;
    			var cbCardData = weaveControl.cbWeaveArray[i][j].cbCardArray.concat();
    			var cbCenterCard = weaveControl.cbWeaveArray[i][j].cbCenterCard;
    			var bPublicCard = weaveControl.cbWeaveArray[i][j].bPublicCard;
    			if (cbWeaveKind == WIK_TI || cbWeaveKind == WIK_PAO)
    			{
    				cbCardIndex[gameLogic.switchToCardIndex(cbCenterCard)] += 4;
    			}
    			else if (cbWeaveKind == WIK_PENG || (cbWeaveKind == WIK_WEI && (mainScene._wMeChaird != INVALID_CHAIR && i == 0 || bPublicCard)))
    			{
    				cbCardIndex[gameLogic.switchToCardIndex(cbCenterCard)] += 3;
    			}
    			else if(cbWeaveKind != WIK_WEI)
				{
					cbCardIndex[gameLogic.switchToCardIndex(cbCardData[0])] += 1;
					cbCardIndex[gameLogic.switchToCardIndex(cbCardData[1])] += 1;
					cbCardIndex[gameLogic.switchToCardIndex(cbCardData[2])] += 1;
				}
    		}
    	}
    	for(var i = 0; i < disCardControl.node.childrenCount; i++)
    	{
    		var cbCardData = disCardControl.node.children[i].cbCardData;
    		if(cbCardData > 0)
    		{
    			cbCardIndex[gameLogic.switchToCardIndex(cbCardData)]++;
    		}
    	}
    	return cbCardIndex;
    },
    analyseTing:function(wChaird)
    {
    	var tingData = [];
    	if(mainScene._wMeChaird != wChaird || mainScene._wMeChaird == INVALID_CHAIR) return tingData;
    	var wViewChaird = gameLogic.switchViewChairID(wChaird);
    	var cbCardIndex = handMahJong.getCardIndex().concat();
    	var WeaveItem = weaveControl.cbWeaveArray[wViewChaird].concat();
    	var cbWeaveCount = weaveControl.cbWeaveCount[wViewChaird];
    	var cbAllIndex = gameLogic.getAllCardIndex();
    	for(var i = 0; i < MAX_INDEX; i++)
    	{
    		var ting = {};
    		var cbCurrentCard = gameLogic.switchToCardData(i);
    		var wFan = gameLogic.analyseChiHuCard(cbCardIndex, WeaveItem, cbWeaveCount, cbCurrentCard, false);
    		ting.bZimo = false;
    		if (wFan == 0)
    		{
    			wFan = gameLogic.analyseChiHuCard(cbCardIndex, WeaveItem, cbWeaveCount, cbCurrentCard, true);
    			if(wFan > 0) ting.bZimo = true;
    		}
    		if (wFan > 0) 
    		{
    			ting.wBeiShu = wFan;
    			ting.cbCardData = cbCurrentCard;
    			if (cbAllIndex[i] <= 4)
    			{
    				ting.cbLeftNum = 4 - cbAllIndex[i];
    			}
    			else
    			{
    				ting.cbLeftNum = 0;
    			}
    			gameLog.log('听牌: ' + ting.cbCardData + ' 倍数: ' + ting.wBeiShu + ' 剩余: ' + ting.cbLeftNum, ' 是否自摸: ' + ting.bZimo);
    			tingData.push(ting);
    		}
    	}
    	return tingData;
    },
    //吃胡分析
	analyseChiHuCard:function(cbCardIndex, WeaveItem, cbWeaveCount, cbCurrentCard, bZiMo)
	{
		//变量定义
		var AnalyseItemArray = [];

		//构造扑克
		var cbCardIndexTemp = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		cbCardIndexTemp = cbCardIndex.concat();

		if( cbCurrentCard == 0 ) return WIK_NULL;

		//插入扑克
		if (cbCurrentCard!=0)
			cbCardIndexTemp[gameLogic.switchToCardIndex(cbCurrentCard)]++;
		
		//特殊番型

		//分析扑克
		gameLogic.analyseCard(cbCardIndexTemp,WeaveItem,cbWeaveCount,AnalyseItemArray,cbCurrentCard,bZiMo);
		var cbCardCount=gameLogic.getCardCount(cbCardIndexTemp);
		//胡牌分析
		var wFanShu = 0;
		if (AnalyseItemArray.length>0)
		{
			var cbCardIndexEx = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
			cbCardIndexEx = cbCardIndexTemp.concat();
			for (var i = 0; i < cbWeaveCount; i++)
			{
				for (var j = 0; j < 4; j++)
				{
					if(WeaveItem[i].cbCardArray[j] == 0) break;
					cbCardIndexEx[gameLogic.switchToCardIndex(WeaveItem[i].cbCardArray[j])] += 1;
				}
			}
			
			//牌型分析
			for (var i=0;i<AnalyseItemArray.length;i++)
			{
				//变量定义
				var pAnalyseItem=AnalyseItemArray[i];
				var cbHuXi = 0;
				var cbTun = gameLogic.getTunCount(pAnalyseItem, cbHuXi);
				if(cbTun == 0) continue;
				// var cbChihuTypeEx = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
				// cbChihuTypeEx[CHR_DIANHU] = gameLogic.isDianHu(cbCardIndexEx);
				// cbChihuTypeEx[CHR_DUOHONG] = gameLogic.getDuoHong(cbCardIndexEx);
				// cbChihuTypeEx[CHR_WUHU] = gameLogic.isWuHu(cbCardIndexEx);
				// cbChihuTypeEx[CHR_DUIZI] = gameLogic.isPengPeng(pAnalyseItem);
				// cbChihuTypeEx[CHR_DAZI] = gameLogic.isDaZiHu(cbCardIndexEx);
				// cbChihuTypeEx[CHR_XIAOZI] = gameLogic.isXiaoZiHu(cbCardIndexEx);
				// cbChihuTypeEx[CHR_TINGHU] = gameLogic.isTingHu(cbWeaveCount);
				// if (mainScene._cbMingTang == 1)
				// {
				// 	cbChihuTypeEx[CHR_SHUAHOUHU] = gameLogic.isShuaHouHu(cbCardIndexTemp);
				// 	cbChihuTypeEx[CHR_XIANGXIANGHU] = gameLogic.getXiangXiangHu(pAnalyseItem);
				// 	cbChihuTypeEx[CHR_DATUANYUAN] = gameLogic.isDaTuanYuan(pAnalyseItem);
				// }
				// var cbChiHuFan = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
				// var wFanShuNew = gameLogic.getChiHuActionRank(cbChihuTypeEx, cbChiHuFan);
				if (cbTun > wFanShu)
				{
					wFanShu = cbTun;
				}
			}
		}
		return wFanShu;
	},
	//胡牌等级
	getChiHuActionRank:function(cbChiHuType, cbChiHuFan)
	{
		var wFanShu = 0;
		if (mainScene._cbMingTang == 0)
		{
			cbChiHuFan[CHR_DIANHU] = cbChiHuType[CHR_DIANHU]*4;
			cbChiHuFan[CHR_DUOHONG] = cbChiHuType[CHR_DUOHONG];
			cbChiHuFan[CHR_WUHU] = cbChiHuType[CHR_WUHU]*6;
			cbChiHuFan[CHR_DUIZI] = cbChiHuType[CHR_DUIZI]*6;
			cbChiHuFan[CHR_DAZI] = cbChiHuType[CHR_DAZI];
			cbChiHuFan[CHR_XIAOZI] = cbChiHuType[CHR_XIAOZI];
			cbChiHuFan[CHR_HAIDIHU] = cbChiHuType[CHR_HAIDIHU]*6;
			cbChiHuFan[CHR_TIANHU] = cbChiHuType[CHR_TIANHU]*6;
			cbChiHuFan[CHR_DIHU] = cbChiHuType[CHR_DIHU]*6;
			cbChiHuFan[CHR_TINGHU] = cbChiHuType[CHR_TINGHU]*6;
		}
		else
		{
			cbChiHuFan[CHR_DIANHU] = cbChiHuType[CHR_DIANHU]*6;
			cbChiHuFan[CHR_DUOHONG] = cbChiHuType[CHR_DUOHONG];
			cbChiHuFan[CHR_WUHU] = cbChiHuType[CHR_WUHU]*8;
			cbChiHuFan[CHR_DUIZI] = cbChiHuType[CHR_DUIZI]*8;
			cbChiHuFan[CHR_DAZI] = cbChiHuType[CHR_DAZI];
			cbChiHuFan[CHR_XIAOZI] = cbChiHuType[CHR_XIAOZI];
			cbChiHuFan[CHR_HAIDIHU] = cbChiHuType[CHR_HAIDIHU]*6;
			cbChiHuFan[CHR_TIANHU] = cbChiHuType[CHR_TIANHU]*6;
			cbChiHuFan[CHR_DIHU] = cbChiHuType[CHR_DIHU]*6;
			cbChiHuFan[CHR_TINGHU] = cbChiHuType[CHR_TINGHU]*6;
			cbChiHuFan[CHR_SHUAHOUHU] = cbChiHuType[CHR_SHUAHOUHU]*8;
			cbChiHuFan[CHR_XIANGXIANGHU] = cbChiHuType[CHR_XIANGXIANGHU];
			cbChiHuFan[CHR_DATUANYUAN] = cbChiHuType[CHR_DATUANYUAN]*8;
		}
		for (var i = 0; i < MAX_CHR_COUNT; i++)
		{
			wFanShu += cbChiHuFan[i];
		}
		return wFanShu>0?wFanShu:1;
	},
	//囤数
	getTunCount:function(pAnalyseItem, cbHuXi)
	{
		var cbIndex = MAX_WEAVE;
		if(pAnalyseItem.cbCardEye > 0)
		{
			cbIndex = MAX_WEAVE-1;
		}
		for( var i = 0; i < cbIndex; i++ )
		{
			if (pAnalyseItem.cbWeaveKind[i]&(WIK_LEFT|WIK_CENTER|WIK_RIGHT))
			{
				var cbCardData = pAnalyseItem.cbCardData[i].concat();
				cbCardData.sort(function(a, b) {return a < b});
				if ((cbCardData[1] == 0x01 && cbCardData[2] == 0x02 && cbCardData[3] == 0x03) ||
					(cbCardData[1] == 0x02 && cbCardData[2] == 0x07 && cbCardData[3] == 0x0A))
				{
					cbHuXi += 3;
				}
				else if((cbCardData[1] == 0x11 && cbCardData[2] == 0x12 && cbCardData[3] == 0x13) ||
						(cbCardData[1] == 0x12 && cbCardData[2] == 0x17 && cbCardData[3] == 0x1A))
				{
					cbHuXi += 6;
				}
			}
			else if (pAnalyseItem.cbWeaveKind[i]&WIK_PENG)
			{
				if(gameLogic.isBigCard(pAnalyseItem.cbCenterCard[i], false))
				{
					cbHuXi += 3;
				}
				else
				{
					cbHuXi += 1;
				}
			}
			else if (pAnalyseItem.cbWeaveKind[i]&WIK_WEI)
			{
				if(gameLogic.isBigCard(pAnalyseItem.cbCenterCard[i], false))
				{
					cbHuXi += 6;
				}
				else
				{
					cbHuXi += 3;
				}
			}
			else if (pAnalyseItem.cbWeaveKind[i]&WIK_PAO)
			{
				if(gameLogic.isBigCard(pAnalyseItem.cbCenterCard[i], false))
				{
					cbHuXi += 9;
				}
				else
				{
					cbHuXi += 6;
				}
			}
			else if (pAnalyseItem.cbWeaveKind[i]&WIK_TI)
			{
				if(gameLogic.isBigCard(pAnalyseItem.cbCenterCard[i], false))
				{
					cbHuXi += 12;
				}
				else
				{
					cbHuXi += 9;
				}
			}
		}
		if(cbHuXi < 15) return 0;
		var cbTun = Math.floor((cbHuXi-15)/3)+1;
		return cbTun;
	},
	//大字判断
	isBigCard:function(cbCardData, bIsIndex)
	{
		var cbCardIndex = cbCardData;
		if(!bIsIndex) cbCardIndex = gameLogic.switchToCardIndex(cbCardData);
		if(cbCardIndex >= 10) return true;
		return false;
	},
	//点胡
	isDianHu:function(cbCardIndex)
	{
		if (gameLogic.getRedCardCount(cbCardIndex) != 1) return false;
		return true;
	},
	//是否有红字
	getRedCardCount:function(cbCardIndex)
	{
		var cbRedCount = cbCardIndex[1] + cbCardIndex[6] + cbCardIndex[9] + cbCardIndex[11] + cbCardIndex[16] + cbCardIndex[19];
		return cbRedCount;
	},
	//得到多红的个数
	getDuoHong:function(cbCardIndex)
	{
		var cbNum = (mainScene._cbMingTang == 0?2:3);
		var cbDuoHong = gameLogic.getRedCardCount(cbCardIndex);
		if(cbDuoHong >= 10)
			cbDuoHong = (cbDuoHong-10)+cbNum;
		else
			cbDuoHong = 0;
		return cbDuoHong;
	},
	//乌胡
	isWuHu:function(cbCardIndex)
	{
		if (gameLogic.getRedCardCount(cbCardIndex) > 0) return false;
		return true;
	},
	//对子胡
	isPengPeng:function(pAnalyseItem)
	{
		for( var i = 0; i < pAnalyseItem.length; i++ )
		{
			if( pAnalyseItem.cbWeaveKind[i]&(WIK_LEFT|WIK_CENTER|WIK_RIGHT) )
				return false;
		}
		return true;
	},
	//大字胡
	isDaZiHu:function(cbCardIndex)
	{
		var cbCount = 0;
		for (var i = 10; i < MAX_INDEX; i++)
		{
			cbCount += cbCardIndex[i];
		}
		if(cbCount >= 18)
		{
			if(mainScene._cbMingTang == 0)
			{
				return 6;
			}
			else
			{
				return (cbCount-18)+8;
			}
		}
		return 0;
	},
	//小字胡
	isXiaoZiHu:function(cbCardIndex)
	{
		var cbCount = 0;
		for (var i = 0; i < 10; i++)
		{
			cbCount += cbCardIndex[i];
		}
		if(cbCount >= 16)
		{
			if(mainScene._cbMingTang == 0)
			{
				return 8;
			}
			else
			{
				return (cbCount-16)+10;
			}
		}
		return 0;
	},
	//停胡
	isTingHu:function(cbWeaveCount)
	{
		return cbWeaveCount>0 ? false:true;
	},
	//全求人
	isShuaHouHu:function(cbCardIndex)
	{
		if (gameLogic.getCardCount(cbCardIndex) == 2)
		{
			return true;
		}
		return false;
	},
	//项项胡
	getXiangXiangHu:function(pAnalyseItem)
	{
		for( var i = 0; i < pAnalyseItem.length; i++ )
		{
			if( pAnalyseItem.cbWeaveKind[i]&(WIK_LEFT|WIK_CENTER|WIK_RIGHT) )
			{
				var cbCardData = pAnalyseItem.cbCardData[i].concat();
				cbCardData.sort(function(a, b) {return a < b});
				var bHuXi = false;
				if ((cbCardData[1] == 0x01 && cbCardData[2] == 0x02 && cbCardData[3] == 0x03) ||
					(cbCardData[1] == 0x02 && cbCardData[2] == 0x07 && cbCardData[3] == 0x0A) ||
					(cbCardData[1] == 0x11 && cbCardData[2] == 0x12 && cbCardData[3] == 0x13) ||
					(cbCardData[1] == 0x12 && cbCardData[2] == 0x17 && cbCardData[3] == 0x1A))
				{
					bHuXi = true;
				}
				if(!bHuXi) return 0;
			}
		}
		if (pAnalyseItem.cbCardEye == 0)
		{
			return 8;
		}
		return 6;
	},
	//大团圆
	isDaTuanYuan:function(pAnalyseItem)
	{
		var cbCardData = [0,0,0,0,0,0,0];
		var cbWeaveKind = [0,0,0,0,0,0,0];
		var cbCount = 0;
		for( var i = 0; i < pAnalyseItem.length; i++ )
		{
			if( pAnalyseItem.cbWeaveKind[i]&(WIK_PAO|WIK_TI) )
			{
				cbCardData[cbCount] = pAnalyseItem.cbCenterCard[i];
				cbWeaveKind[cbCount++] = pAnalyseItem.cbWeaveKind[i];
			}
		}
		if(cbCount < 2) return false;
		for (var i = 0; i < cbCount-1; i++)
		{
			var cbValue = (cbCardData[i]&MASK_VALUE);
			for (var j = i+1; j < cbCount; j++)
			{
				var cbValueEx = (cbCardData[j]&MASK_VALUE);
				if (cbValue == cbValueEx && cbWeaveKind[i] == cbWeaveKind[j])
				{
					return true;
				}
			}
		}
		return false;
	},
	analyseCard:function(cbCardIndex, WeaveItem, cbWeaveCount, AnalyseItemArray, cbCurrentCard, bZimo)
	{
		var cbCardCount = gameLogic.getCardCount(cbCardIndex);
		if(cbCardCount < 2) return false;
		var bJiang = false;
		for (var i = 0; i < cbWeaveCount; i++)
		{
			var cbWeaveKind = WeaveItem[i].cbWeaveKind;
			if (cbWeaveKind == WIK_TI || cbWeaveKind == WIK_PAO)
			{
				cbCardCount += 4;
				bJiang = true;
			}
			else
				cbCardCount += 3;
		}
		//跑后胡 胡牌张数21   有跑有提   揭牌胡牌张数22
		if(cbCardCount < MAX_COUNT) return false;


		var AnalyseItem = {};
		AnalyseItem.bWeaveInsert = [0,0,0,0,0,0,0];
		AnalyseItem.cbCenterCard = [0,0,0,0,0,0,0];
		AnalyseItem.cbWeaveKind = [0,0,0,0,0,0,0];
		AnalyseItem.cbCardData = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
		var cbCardIndexEx = cbCardIndex.concat();
		var nIndex = 0;
		for (var i = 0; i < MAX_INDEX; i++)
		{
			if (cbCardIndexEx[i] == 4 && (gameLogic.switchToCardData(i) != cbCurrentCard || bZimo))
			{
				cbCardIndexEx[i] = 0;
				AnalyseItem.bWeaveInsert[nIndex] = false;
				AnalyseItem.cbCenterCard[nIndex] = gameLogic.switchToCardData(i);
				AnalyseItem.cbWeaveKind[nIndex] = WIK_TI;
				AnalyseItem.cbCardData[nIndex][0] = gameLogic.switchToCardData(i);
				AnalyseItem.cbCardData[nIndex][1] = gameLogic.switchToCardData(i);
				AnalyseItem.cbCardData[nIndex][2] = gameLogic.switchToCardData(i);
				AnalyseItem.cbCardData[nIndex++][3] = gameLogic.switchToCardData(i);
				bJiang = true;
			}
			else if (cbCardIndexEx[i] >= 3 && (gameLogic.switchToCardData(i) != cbCurrentCard || bZimo))
			{
				cbCardIndexEx[i] -= 3;
				AnalyseItem.bWeaveInsert[nIndex] = false;
				AnalyseItem.cbCenterCard[nIndex] = gameLogic.switchToCardData(i);
				if (gameLogic.switchToCardData(i) == cbCurrentCard)
				{
					if(bZimo)
						AnalyseItem.cbWeaveKind[nIndex] = WIK_WEI;
					else
						AnalyseItem.cbWeaveKind[nIndex] = WIK_PENG;
				}
				else
					AnalyseItem.cbWeaveKind[nIndex] = WIK_WEI;
				AnalyseItem.cbCardData[nIndex][0] = gameLogic.switchToCardData(i);
				AnalyseItem.cbCardData[nIndex][1] = gameLogic.switchToCardData(i);
				AnalyseItem.cbCardData[nIndex][2] = gameLogic.switchToCardData(i);
				AnalyseItem.cbCardData[nIndex++][3] = 0;
			}
		}
		var mKindItem = [];
		for (var i = 0; i < MAX_INDEX; i++)
		{
			if (cbCardIndexEx[i] >= 3)
			{
				var KindItem = {};
				if(cbCardIndexEx[i] == 4)
					KindItem.cbWeaveKind=WIK_PENG;
				else if(gameLogic.switchToCardData(i) != cbCurrentCard || bZimo)
					KindItem.cbWeaveKind=WIK_WEI;
				else
					KindItem.cbWeaveKind=WIK_PENG;
				KindItem.cbCenterCard=gameLogic.switchToCardData(i);
				KindItem.cbValidIndex = [];
				KindItem.cbValidIndex[0] = i;
				KindItem.cbValidIndex[1] = i;
				KindItem.cbValidIndex[2] = i;
				mKindItem.push(KindItem);
			}
			//顺序连牌
			if((i%10) < 8)
			{
				if (cbCardIndexEx[i] > 0 && cbCardIndexEx[i+1] > 0 && cbCardIndexEx[i+2] > 0)
				{
					gameLogic.analyseShun(cbCardIndexEx, mKindItem, i, i+1, i+2);
				}
			}
			//绞牌
			if (i < 10)
			{
				if(cbCardIndexEx[i] > 1 && cbCardIndexEx[i+10] > 0)
				{
					gameLogic.analyseShun(cbCardIndexEx, mKindItem, i, i, i+10);
				}
				else if(cbCardIndexEx[i] > 0 && cbCardIndexEx[i+10] > 1)
				{
					gameLogic.analyseShun(cbCardIndexEx, mKindItem, i, i+10, i+10);
				}

			}
		}
		//2  7 10
		if (cbCardIndexEx[1] > 0 && cbCardIndexEx[6] > 0 && cbCardIndexEx[9] > 0)
		{
			gameLogic.analyseShun(cbCardIndexEx, mKindItem, 1, 6, 9);
		}
		//二 七 十
		if (cbCardIndexEx[11] > 0 && cbCardIndexEx[16] > 0 && cbCardIndexEx[19] > 0)
		{
			gameLogic.analyseShun(cbCardIndexEx, mKindItem, 11, 16, 19);
		}
		var cbCount = gameLogic.getCardCount(cbCardIndexEx);
		if(cbCount < 2)
		{
			return false;
		}
		var cbItemCount = 0;
		if (bJiang)
		{
			cbItemCount = Math.floor((cbCount-2)/3);
		}
		else
		{
			cbItemCount = Math.floor(cbCount/3);
		}
		//组合分析
		if (mKindItem.length>=cbItemCount)
		{
			//变量定义
			var cbIndex = [0, 0, 0, 0, 0, 0, 0];
			for( var i = 0; i < MAX_WEAVE; i++ )
				cbIndex[i] = i;
			var pKindItem = [{},{},{},{},{},{},{}];

			//开始组合
			do
			{
				//变量定义
				var cbCardIndexTemp = cbCardIndexEx.concat();

				for (var i=0;i<cbItemCount;i++)
					pKindItem[i]=mKindItem[cbIndex[i]];

				//数量判断
				var bEnoughCard=true;

				for (var i=0;i<cbItemCount*3;i++)
				{
					//存在判断
					var cbCardIndex=pKindItem[Math.floor(i/3)].cbValidIndex[i%3]; 
					if (cbCardIndexTemp[cbCardIndex]==0)
					{
						bEnoughCard=false;
						break;
					}
					else cbCardIndexTemp[cbCardIndex]--;
				}

				if ((bJiang && gameLogic.getCardCount(cbCardIndexTemp) != 2) || (!bJiang && gameLogic.getCardCount(cbCardIndexTemp) % 3 != 0))
				{
					bEnoughCard = false;
				}

				//胡牌判断
				if (bEnoughCard==true)
				{
					//变量定义
					var AnalyseItemEx = {};
					AnalyseItemEx.bWeaveInsert = [0,0,0,0,0,0,0];
					AnalyseItemEx.cbCenterCard = [0,0,0,0,0,0,0];
					AnalyseItemEx.cbWeaveKind = [0,0,0,0,0,0,0];
					AnalyseItemEx.cbCardData = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];

					//设置组合
					for (var i=0;i<cbWeaveCount;i++)
					{
						AnalyseItemEx.cbWeaveKind[i]=WeaveItem[i].cbWeaveKind;
						AnalyseItemEx.cbCenterCard[i]=WeaveItem[i].cbCenterCard;
						AnalyseItemEx.bWeaveInsert[i] = true;
						AnalyseItemEx.cbCardData[i] = WeaveItem[i].cbCardArray.concat();
					}
					for (var i = 0; i < nIndex; i++)
					{
						AnalyseItemEx.bWeaveInsert[cbWeaveCount+i] = false;
						AnalyseItemEx.cbWeaveKind[cbWeaveCount+i]=AnalyseItem.cbWeaveKind[i];
						AnalyseItemEx.cbCenterCard[cbWeaveCount+i]=AnalyseItem.cbCenterCard[i];
						AnalyseItemEx.cbCardData[cbWeaveCount+i] = AnalyseItem.cbCardData[i].concat();
					}
					//设置牌型
					for (var i=0;i<cbItemCount;i++) 
					{
						AnalyseItemEx.bWeaveInsert[cbWeaveCount+nIndex+i] = false;
						AnalyseItemEx.cbWeaveKind[cbWeaveCount+nIndex+i]=pKindItem[i].cbWeaveKind;
						AnalyseItemEx.cbCenterCard[cbWeaveCount+nIndex+i]=pKindItem[i].cbCenterCard;
						AnalyseItemEx.cbCardData[cbWeaveCount+nIndex+i][0] = gameLogic.switchToCardData(pKindItem[i].cbValidIndex[0]);
						AnalyseItemEx.cbCardData[cbWeaveCount+nIndex+i][1] = gameLogic.switchToCardData(pKindItem[i].cbValidIndex[1]);
						AnalyseItemEx.cbCardData[cbWeaveCount+nIndex+i][2] = gameLogic.switchToCardData(pKindItem[i].cbValidIndex[2]);
					}
					if (bJiang)
					{
						if( gameLogic.getCardCount(cbCardIndexTemp) == 2 && bJiang)
						{
							for (var i=0;i<MAX_INDEX;i++)
							{	//091231JJ 胡牌牌眼判断
								if (cbCardIndexTemp[i]==2)
								{
									AnalyseItemEx.cbCardEye=gameLogic.switchToCardData(i);
									AnalyseItemEx.bMagicEye = true;
									AnalyseItemArray.push(AnalyseItemEx);
									break;
								}
							}
						}
					}
					else
					{
						if (cbWeaveCount + nIndex + cbItemCount == MAX_WEAVE)
						{
							AnalyseItemEx.cbCardEye=0;
							AnalyseItemEx.bMagicEye = false;
							AnalyseItemArray.push(AnalyseItemEx);
						}
					}
				}
				if(cbItemCount == 0)
				{
					//大吊
					return (AnalyseItemArray.length>0);
				}
				//设置索引
				if (cbIndex[cbItemCount-1]==(mKindItem.length-1))
				{
					var i=0;
					for (i=cbItemCount-1;i>0;i--)
					{
						if ((cbIndex[i-1]+1)!=cbIndex[i])
						{
							var cbNewIndex=cbIndex[i-1];
							for (var j=(i-1);j<cbItemCount;j++) 
								cbIndex[j]=cbNewIndex+j-i+2;
							break;
						}
					}
					if (i==0)
						break;
				}
				else
					cbIndex[cbItemCount-1]++;
			} while (true);

		}
		return (AnalyseItemArray.length>0);
	},
	analyseShun:function(cbCardIndex, mKindItem, cbIndex1, cbIndex2, cbIndex3)
	{
		var cbIndex = [cbCardIndex[cbIndex1],cbCardIndex[cbIndex2],cbCardIndex[cbIndex2]];
		var cbIndexEx = [cbIndex1, cbIndex2, cbIndex3];
		var cbValidIndex = [0,0,0];
		while( cbIndex[0]>0&&cbIndex[1]>0&&cbIndex[2]>0 )
		{
			for( var j = 0; j < cbIndex.length; j++ )
			{
				if( cbIndex[j] > 0 ) 
				{
					cbIndex[j]--;
					cbValidIndex[j] = cbIndexEx[j];
				}
			}
			var KindItem = {};
			KindItem.cbWeaveKind=WIK_LEFT;
			KindItem.cbCenterCard=gameLogic.switchToCardData(cbIndex1);
			KindItem.cbValidIndex = [cbValidIndex[0], cbValidIndex[1], cbValidIndex[2]];
			mKindItem.push(KindItem);
		}
		return true;
	}
};