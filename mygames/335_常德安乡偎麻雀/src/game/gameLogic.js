var INVALID_CHAIR 		= 0xFFFF;           //无效椅子
var	MASK_COLOR	  		= 0xF0;				//花色掩码
var	MASK_VALUE	  		= 0x0F;				//数值掩码


var WIK_NULL = 0x00								//没有类型
var WIK_LEFT = 0x01								//左吃类型
var WIK_CENTER = 0x02								//中吃类型
var WIK_RIGHT = 0x04								//右吃类型
var WIK_PENG = 0x08								//碰牌类型
var WIK_GANG = 0x10								//杠牌类型
var WIK_LISTEN = 0x20								//吃牌类型
var WIK_CHI_HU = 0x40								//吃胡类型
var WIK_WEI = 0x80								

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
        if(cbCardData > 0)
        	managerAudio.playEffect(resPrefix + cbCardData + '.mp3')
		if ((cbOperateCode&WIK_LEFT)!=0 || (cbOperateCode&WIK_CENTER)!=0 || (cbOperateCode&WIK_RIGHT)!=0)
		{
			managerAudio.playEffect(resPrefix + 'chi' + '.mp3')
		}
		else if ((cbOperateCode&WIK_PENG)!=0) 
		{
			managerAudio.playEffect(resPrefix + 'peng' + '.mp3')
		}
		else if ((cbOperateCode&WIK_WEI)!=0) 
		{
			managerAudio.playEffect(resPrefix + 'wei' + '.mp3')
		}
		else if ((cbOperateCode&WIK_CHI_HU)!=0) 
		{
			managerAudio.playEffect(resPrefix + 'hu' + '.mp3')
		}
    },
};