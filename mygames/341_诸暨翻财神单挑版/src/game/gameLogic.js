var	MASK_COLOR			= 0xF0								//花色掩码
var	MASK_VALUE			= 0x0F								//数值掩码

var WIK_NULL 			= 0x0000			//没有类型
var WIK_LEFT 			= 0x0001			//左吃类型
var WIK_CENTER 			= 0x0002			//中吃类型
var WIK_RIGHT 			= 0x0004			//右吃类型
var WIK_PENG 			= 0x0008			//碰牌类型
var WIK_GANG 			= 0x0010			//杠牌类型
var WIK_CHI_HU 			= 0x0020			//吃胡类型
var WIK_S_CHI 			= 0x0040            //单财吃
var WIK_S_PENG 			= 0x0080			//单财碰
var WIK_D_PENG 			= 0x0100			//双财碰
var WIK_S_GANG 			= 0x0200			//单财杠
var WIK_D_GANG 			= 0x0400			//双财杠
var WIK_T_GANG 			= 0x0800			//三财杠
var WIK_ZIMO      		= 0x1000;           //自摸
var WIK_DIANPAO   		= 0x2000;           //点炮

var CHR_MAX_COUNT       = 11;
var CHK_NULL 			= 0x0000			//非胡
var CHR_WU_CAI 			= 0x00000001		//无财
var CHR_PING_HU 		= 0x00000002		//平胡
var CHR_DUI_DUI_HU 		= 0x00000004		//对对胡
var CHR_QING_YI_SE_HU 	= 0x00000008		//清一色
var CHR_HUN_YI_SE_HU 	= 0x00000010		//混一色
var CHR_GANG_KAI_HU 	= 0x00000020		//杠开
var CHR_TIAN_HU 		= 0x00000040		//天胡
var CHR_DI_HU 			= 0x00000080		//地胡
var CHR_QIANG_GANG_HU 	= 0x00000100		//抢杠
var CHR_LAO_ZHUANG 		= 0x00000200		//老庄
var CHR_QUAN_FENG		= 0x00000400		//全风
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
	switchViewChairID:function(wChairID)
	{
		if(wChairID == INVALID_CHAIR) return INVALID_CHAIR;
		if(selfdwUserID == null) return INVALID_CHAIR;
		//(要转换的椅子 - 本地玩家的椅子 +  玩家数量) % 玩家数量;
		if(wChairID == mainScene._wMeChaird || (wChairID == 0 && mainScene._wMeChaird == INVALID_CHAIR))
			return 0;
		return 1;
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
		if( cbCardIndex < 27 )
			return ((cbCardIndex/9)<<4)|(cbCardIndex%9+1);
		else if (cbCardIndex < 34)
			return (0x30|(cbCardIndex-27+1));
		else 
			return (0x40|(cbCardIndex-34+1));
	},
	switchToCardIndex:function(cbCardData)
	{
		cc.assert(gameLogic.isValidCard(cbCardData), "Errors: gameLogic.js line 41");
		var cbColor = (cbCardData&MASK_COLOR)>>4;
		if (cbColor < 4)
			return cbColor*9+(cbCardData&MASK_VALUE)-1;
		else
			return 33+(cbCardData&MASK_VALUE);
	},
	switchToCardIndexEx:function(cbCardData, cbCardCount, cbCardIndex)
	{
		//转换扑克
		for (var i=0;i<cbCardCount;i++)
		{
			cc.assert(gameLogic.isValidCard(cbCardData[i]), "Errors: gameLogic.js line 58");
			var nIndex = gameLogic.switchToCardIndex(cbCardData[i]);
			cbCardIndex[nIndex] = cbCardIndex[nIndex]+1;
		}
	},
	isValidCard:function(cbCardData)
	{
		var cbValue=(cbCardData&MASK_VALUE);
		var cbColor=(cbCardData&MASK_COLOR)>>4;
		return (((cbValue>=1)&&(cbValue<=9)&&(cbColor<=2))||((cbValue>=1)&&(cbValue<=0x0f)&&(cbColor==3 || cbColor == 4)));
	},	
	isMagicCard:function(cbCardData, bIsIndex)
	{
		var cbCardIndex = cbCardData;
		if (!bIsIndex) 
			cbCardIndex = gameLogic.switchToCardIndex(cbCardData);
		if (cbCardIndex == mainScene._cbMagicIndex[0] || cbCardIndex == mainScene._cbMagicIndex[1])
			return true;
		return false;
	},
	getMagicCardCount:function(cbCardIndex)
	{
		var cbMagicCount = 0;
		cbMagicCount += cbCardIndex[mainScene._cbMagicIndex[0]];
		cbMagicCount += cbCardIndex[mainScene._cbMagicIndex[1]];
		return cbMagicCount;
	}
};