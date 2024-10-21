var INVALID_CHAIR 		= 0xFFFF;           //无效椅子
var	MASK_COLOR	  		= 0xF0;				//花色掩码
var	MASK_VALUE	  		= 0x0F;				//数值掩码
var WIK_NULL	  		= 0x00;				//没有类型
var WIK_LEFT	  		= 0x01;				//左吃类型
var WIK_CENTER	  		= 0x02;				//中吃类型
var WIK_RIGHT	  		= 0x04;				//右吃类型
var WIK_PENG	  		= 0x08;				//碰牌类型
var WIK_GANG      		= 0x10;				//杠牌类型
var WIK_LISTEN	  		= 0x20;				//吃牌类型
var WIK_CHI_HU	  		= 0x40;				//吃胡类型
var WIK_ZIMO      		= 0x80;             //自摸
var WIK_DIANPAO   		= 0X100;            //点炮

var CHR_MAX_COUNT       = 26;
var CHK_NULL 			= 0x0000			//非胡
var CHR_BIAN_DAO 		= 0x00000001		//边倒
var CHR_DUI_DAO 		= 0x00000002		//对倒
var CHR_QIAN_DAO 		= 0x00000004		//嵌倒
var CHR_DAN_DIAO 		= 0x00000008		//单吊
var CHR_DA_DIAO 		= 0x00000010		//大吊
var CHR_DA_DUI_ZI 		= 0x00000020        //对对胡
var CHR_GANG_KAI 		= 0x00000040		//杠上花
var CHR_QIANG_GANG 		= 0x00000080		//拉杠
var CHR_TIAN_HU 		= 0x00000100		//天胡
var CHR_DI_HU 			= 0x00000200		//地胡
var CHR_QING_YI_SE 		= 0x00000400		//清一色
var CHR_HUN_YI_SE 		= 0x00000800        //混一色
var CHR_ZI_YI_SE 		= 0x00001000        //字一色
var CHR_H_D_L_Y 		= 0x00002000        //海底捞月
var CHR_BA_HUA 			= 0x00004000        //八花
var CHR_SI_HUA 			= 0x00008000        //四花
var CHR_ZHONG_FA_BAI 	= 0x00010000        //中发白
var CHR_ZHENG_FENG 		= 0x00020000        //正风
var CHR_QUAN_FENG 		= 0x00040000        //圈风
var CHR_ZHENG_HUA 		= 0x00080000        //正花
var CHR_YE_HUA 			= 0x00100000        //野花
var CHR_MEN_QING 		= 0x00200000        //门清
var CHR_ZI_MO 			= 0x00800000        //自摸
var CHR_PING_HU         = 0x02000000		//平胡
var CHR_QUAN_ZHENG_FENG = 0x04000000		//圈正风
var CHR_SONG_GANG 		= 0x01000000		//送杠
var CHR_HUAN_GANG 		= 0x08000000		//还杠
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
	analyseGangCard:function(cbCardIndex, weaveItemArray,cbWeaveCount,gcr )
	{
		//设置变量
		var cbActionMask=WIK_NULL;

		//手上杠牌
		for (var i=0;i<MAX_INDEX;i++)
		{
			if (cbCardIndex[i]==4)
			{
				cbActionMask = cbActionMask|WIK_GANG;
				gcr.cbCardData[gcr.cbCardCount++]=gameLogic.switchToCardData(i);
			}
		}

		//组合杠牌
		for (var i=0;i<cbWeaveCount;i++)
		{
			if (weaveItemArray[i].cbWeaveKind==WIK_PENG)
			{
				if (cbCardIndex[gameLogic.switchToCardIndex(weaveItemArray[i].cbCenterCard)]==1)
				{
					cbActionMask|=WIK_GANG;
					gcr.cbCardData[gcr.cbCardCount++]=weaveItemArray[i].cbCenterCard;
				}
			}
		}

		return cbActionMask;
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
		case WIK_GANG:		//杠牌操作
			{
				//设置变量
				cbCardBuffer[0]=cbCenterCard;
				cbCardBuffer[1]=cbCenterCard;
				cbCardBuffer[2]=cbCenterCard;
				cbCardBuffer[3]=cbCenterCard;

				return 4;
			}
		default:
			{
				ASSERT(FALSE);
			}
		}

		return 0;
	},
	analyseGameEndCard:function(cbCardData, cbCardCount, analyseCard)
	{
		cc.assert(cbCardCount >= 2 && cbCardCount <= MAX_COUNT && (cbCardCount-2)%3 == 0, "Errors: gameLogic.js line 186");
		if(cbCardCount < 2 || cbCardCount > MAX_COUNT || (cbCardCount-2)%3 != 0) return false;
		var cbCardIndex = [];
		for (var i = 0; i < MAX_INDEX; i++) {
			cbCardIndex[i] = 0;
		};
		gameLogic.switchToCardIndexEx(cbCardData, cbCardCount, cbCardIndex);
		if (cbCardCount == 2)
		{
			//单吊
			analyseCard.nCount = 1;
			analyseCard.card[0][0] = cbCardData[0];
			analyseCard.card[0][1] = cbCardData[0];
		}
		else
		{
			for (var i = 0; i < MAX_INDEX; i++) {
				if ((i > 1 && i < 8) || (i > 9 && i < 17) || (i > 18 && i < 26))
				{
					//顺子
					if(cbCardIndex[i-1] > 0 && cbCardIndex[i] > 0 && cbCardIndex[i+1] > 0)
					{
						analyseCard.card[analyseCard.nCount][0] = gameLogic.switchToCardData(i-1);
						analyseCard.card[analyseCard.nCount][1] = gameLogic.switchToCardData(i);
						analyseCard.card[analyseCard.nCount++][2] = gameLogic.switchToCardData(i+1);
						cbCardIndex[i-1] = cbCardIndex[i-1]-1;
						cbCardIndex[i] = cbCardIndex[i]-1;
						cbCardIndex[i+1] = cbCardIndex[i+1]-1;
					}
				}
			}
			for (var i = 0; i < MAX_INDEX; i++) {
				if (cbCardIndex[i] >= 3) 
				{
					//刻子
					var cbCard = gameLogic.switchToCardData(i);
					analyseCard.card[analyseCard.nCount][0] = cbCard;
					analyseCard.card[analyseCard.nCount][1] = cbCard;
					analyseCard.card[analyseCard.nCount++][2] = cbCard;
					cbCardIndex[i] = cbCardIndex[i]-3;
				}
			};
			var bJiang = false;
			for (var i = 0; i < MAX_INDEX; i++) {
				if (cbCardIndex[i] >= 2)
				{
					//将对
					var cbCard = gameLogic.switchToCardData(i);
					analyseCard.card[analyseCard.nCount][0] = cbCard;
					analyseCard.card[analyseCard.nCount++][1] = cbCard;
					cbCardIndex[i] = cbCardIndex[i]-2;
					bJiang = true;
					break;
				} 
			}
			if(!bJiang) return false;
			for (var i = 0; i < MAX_INDEX; i++) {
				if (cbCardIndex[i] > 0)
					return false;
			}
			if(analyseCard.nCount * 3 - 1 != cbCardCount)
				return false;
		}
		return true;
	},
};