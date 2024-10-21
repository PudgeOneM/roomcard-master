var INVALID_CHAIR 		= 0xFFFF;           //无效椅子
var	MASK_COLOR	  		= 0xF0;				//花色掩码
var	MASK_VALUE	  		= 0x0F;				//数值掩码
var WIK_NULL	  		= 0x00;				//没有类型
var WIK_LEFT	  		= 0x01;				//左吃类型
var WIK_CENTER	  		= 0x02;				//中吃类型
var WIK_RIGHT	  		= 0x04;				//右吃类型
var WIK_PENG	  		= 0x08;				//碰牌类型
var WIK_GANG      		= 0x10;				//杠牌类型
var WIK_LISTEN	  		= 0x20;				//听牌类型
var WIK_CHI_HU	  		= 0x40;				//吃胡类型
var WIK_ZIMO      		= 0x80;             //自摸
var WIK_DIANPAO   		= 0x100;            //点炮
var WIK_BALE	  		= 0x20;				//把了动画
var WIK_HU   			= 0x200;            //仅客户端判断

var CHR_MAX_COUNT       = 4;
var CHR_GANG_KAI 		= 0x00000001		//杠开
var CHR_DAN_DIAO 		= 0x00000002		//大吊车
var CHR_H_D_L_Y 		= 0x00000004		//海底捞月
var CHR_BAO_ZI 			= 0x00000008		//豹子

var CHR_DRAGON			= 0x00000001		//一条龙
var CHR_PURE_COLOR		= 0x00000002		//清一色
var CHR_SEVEN_SUB		= 0x00000004		//七小对
var CHR_ZIMO			= 0x00000008        //自摸

var CHR_NULL			=		0x00000000							//非胡
var CHR_GANG_KAI_HU		=		0x00000001							//杠开
var CHR_DA_DIAO_HU		=		0x00000002							//大吊
var CHR_QI_DUI_HU		=		0x00000008							//七对
var CHR_DRAGON_HU		=		0x00000010							//一条龙
var CHR_LAO_ZHUANG		=	    0x00000020							//老庄
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
		if( cbCardIndex < 27 )
			return ((cbCardIndex/9)<<4)|(cbCardIndex%9+1);
		else if (cbCardIndex < 34)
			return (0x30|(cbCardIndex-27+1));
		else if(cbCardIndex < 42)
			return (0x40|(cbCardIndex-34+1));
		else
			return (0x50|(cbCardIndex-42+1));
	},
	switchToCardIndex:function(cbCardData)
	{
		cc.assert(gameLogic.isValidCard(cbCardData), "Errors: gameLogic.js line 41");
		var cbColor = (cbCardData&MASK_COLOR)>>4;
		if (cbColor < 4)
			return cbColor*9+(cbCardData&MASK_VALUE)-1;
		else if(cbColor == 4)
			return 33+(cbCardData&MASK_VALUE);
		else 
			return 41+(cbCardData&MASK_VALUE);
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
		if (cbColor <= 2)
		{
			if (cbValue >= 1 && cbValue <= 9)
			{
				return true;
			}
		}
		else if (cbColor == 3)
		{
			if (cbValue >= 1 && cbValue <= 7)
			{
				return true;
			}
		}
		else if (cbColor == 4)
		{
			if (cbValue >= 1 && cbValue <= 8)
			{
				return true;
			}
		}
		else if (cbColor == 5)
		{
			if (cbValue >= 1 && cbValue <= 6)
			{
				return true;
			}
		}
		return false;
	},	
	analyseGangCard:function(cbCardIndex, weaveItemArray,cbWeaveCount,gcr )
	{
		//设置变量
		var cbActionMask=WIK_NULL;
		var cbMagicCount = handMahJong.getMagicCount()
		for(var j=0;j<=cbMagicCount;j++)
		for (var i=0;i<MAX_INDEX;i++)
		{
			var cbCard = gameLogic.switchToCardData(i);
			var isMagic =handMahJong.isMagicCard(cbCard);
			
			if(cbCard ==0x31 || cbCard ==0x35 ||cbCard ==0x36 || cbCard==0x37)
			{
				if (cbCardIndex[i]&& cbCardIndex[i]>=4-j && !isMagic)
				{
					cbActionMask = cbActionMask|WIK_GANG;
					var cbCard =gameLogic.switchToCardData(i);
					var isReSave  = false;
					for(var n=0;n<gcr.cbCardCount;n++)
					{
						if(gcr.cbCardData[n]==cbCard)
						{
	  						isReSave=true;
	  						break;      
						}
					}
					if(!isReSave)
					gcr.cbCardData[gcr.cbCardCount++]= cbCard;
				}
			}
			else
			{
				if (cbCardIndex[i]>1&& cbCardIndex[i]>=4-j && !isMagic)
				{
					cbActionMask = cbActionMask|WIK_GANG;
					var cbCard =gameLogic.switchToCardData(i);
					var isReSave  = false;
					for(var n=0;n<gcr.cbCardCount;n++)
					{
						if(gcr.cbCardData[n]==cbCard)
						{
	  						isReSave=true;
	  						break;      
						}
					}
					if(!isReSave)
					gcr.cbCardData[gcr.cbCardCount++]= cbCard;
				}
			}
			
		}
		gameLog.log("可以杠牌的数量"+gcr.cbCardCount);
		//组合杠牌
		for (var i=0;i<cbWeaveCount;i++)
		{
			if (weaveItemArray[i].cbWeaveKind==WIK_PENG)
			{
				var index = gameLogic.switchToCardIndex(weaveItemArray[i].cbCenterCard);
				if (cbMagicCount>0||cbCardIndex[index]==1)
				{
					cbActionMask|=WIK_GANG;
					var isReSave  = false;
					for(var n=0;n<gcr.cbCardCount;n++)
					{
						if(gcr.cbCardData[n]==weaveItemArray[i].cbCenterCard)
						{
	  						isReSave=true;
	  						break;      
						}
					}
					if(!isReSave)
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