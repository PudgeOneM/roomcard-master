//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 121								//游戏 I D
var GAME_NAME = "温岭麻将"					//游戏名字

//组件属性
var GAME_PLAYER = 4									//游戏人数
var VERSION_SERVER = PROCESS_VERSION(6,0,3)				//程序版本
var VERSION_CLIENT = PROCESS_VERSION(6,0,3)				//程序版本

//////////////////////////////////////////////////////////////////////////////////
//状态定义

var GAME_SCENE_FREE = GAME_STATUS_FREE					//等待开始
var GAME_SCENE_PLAY = (GAME_STATUS_PLAY+1)				//游戏进行
//////////////////////////////////////////////////////////////////////////////////

//常量定义
var MAX_WEAVE = 5									//最大组合
var MAX_INDEX = 42									//最大索引
var MAX_COUNT = 17									//最大数目
var MAX_REPERTORY = 144									//最大库存
var MAX_HUA_CARD = 16									//花牌个数


var MAX_RIGHT_COUNT = 1									//最大权位DWORD个数	
var HEAP_FULL_COUNT = 34									//堆立全牌
var MAX_SEND_COUNT = 2			
//////////////////////////////////////////////////////////////////////////////////
//一个胡型是否存在 由2进制数中的1位来表示
//0x0fffffff 可以表示32位的2进制 所以最多支持32种胡型

var MASK_CHI_HU_RIGHT = 0x0fffffff
//胡牌定义
var CHR_SiFengQuanQi = 0x0001  //四风齐全
var CHR_HunYiSe = 0x0002	//混一色  由同一种花色及风牌组成的胡牌 
var CHR_QingYiSe = 0x0004	//清一色 由同一种花色牌组成的胡牌 

var CHR_PengPengHu = 0x0008	//碰碰胡 由任意花色及风字组成的碰胡   
var CHR_ZhuoGui = 0x0010	//捉鬼  
var CHR_KaoBing = 0x0020	// 靠柄 例：12万胡3万或89万胡7万

var CHR_ZI_MO = 0x0040	//自摸
var CHR_QianDang = 0x0080	//嵌档 例：13万胡2万 
var CHR_H_D_L_Y = 0x0100	//海底捞月   摸牌到最后一张胡牌 

var CHR_PangHu = 0x0200	//旁胡 由顺子+将组成的牌+自摸才算旁胡
var CHR_WuCaiShen = 0x0400	//无财神 

var CHR_LiangCaiShen = 0x0800	//两财神 
var CHR_ZiMoCaiSehn = 0x1000	//自摸财神 
var CHR_CSHuanYuan = 0x2000	//财神还原 

var CHR_CSDoubleBack = 0x4000	//财神双归位
var CHR_CaiShenFoot = 0x8000	//财神脚骨   

var CHR_GangKai = 0x10000	//杠上开花（杠开）    开杠抓进的牌成和牌   
var CHR_QiangGang = 0x20000	//抢杠  和别人自抓开明杠的牌  

var CHR_TianHu = 0x40000	//天胡
var CHR_DiHu = 0x80000	//地胡 庄家出第一张后，下家自摸即是地和，牌型不限。  


//用于财神的转换，如果有牌可以代替财神本身牌使用，则设为该牌索引，否则设为MAX_INDEX. 注:如果替换牌是序数牌,将出错.
var INDEX_REPLACE_CARD = 0x37//		MAX_INDEX
//////////////////////////////////////////////////////////////////////////

//组合子项
var CMD_WeaveItem = 
[
	['BYTE', 'cbWeaveKind'],						//组合类型
	['BYTE', 'cbCenterCard'],						//中心扑克
	['BYTE', 'cbPublicCard'],						//公开标志
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbCardData', 4],						//组合数据
]

//////////////////////////////////////////////////////////////////////////
//服务器命令结构

var SUB_S_GAME_START = 100									//游戏开始
var SUB_S_OUT_CARD = 101									//出牌命令
var SUB_S_SEND_CARD = 102									//发送扑克
var SUB_S_OPERATE_NOTIFY = 103								//操作提示
var SUB_S_OPERATE_RESULT = 104								//操作命令
var SUB_S_GAME_END = 105									//游戏结束
var SUB_S_REPLACE_CARD = 106								//用户补牌
var SUB_S_DINGPENG_RESULT = 107								//顶碰结果
var SUB_S_PINGCUO_RESULT = 108								//设置平搓	
//空闲状态
var CMD_S_StatusFree = 
[
	['SCORE', 'lCellScore'],							//基础金币
	['BYTE','cbPlayType'],								//基础设置
]

//游戏状态
var CMD_S_StatusPlay = 
[
	['BYTE','cbPlayType'],									//基础设置
	//游戏变量
	['SCORE', 'lCellScore'],								//单元积分
	['DWORD', 'dwBankerUserId'],							//庄家用户
	['WORD', 'wCurrentUser'],								//当前需要出牌用户
	['BYTE', 'cbHuaCardData', GAME_PLAYER,MAX_HUA_CARD],	//花牌
	//状态变量
	['BYTE', 'cbActionMask'],								//动作掩码
	['BYTE', 'cbProvideCard'],								//动作扑克
	['BYTE', 'cbLeftCardCount'],							//剩余数目
	['BYTE', 'cbDingPengData',GAME_PLAYER],         		//是否顶碰
	['BYTE', 'cbIsPreStartEnd'],							//设置状态
	//出牌信息
	['WORD', 'wOutCardUser'],								//出牌完成用户
	['BYTE', 'cbOutCardData'],								//出牌扑克
	['BYTE', 'cbDiscardCount', GAME_PLAYER],				//丢弃数目
	['BYTE', 'cbDiscardCard', GAME_PLAYER, 60],				//丢弃记录

	//风牌记录
	['BYTE', 'cbFengCardData', 8],							//风牌记录
	['BYTE', 'cbFengCardCount'],							//风牌记录

	//扑克数据
	['BYTE', 'cbHandCardCount', GAME_PLAYER],				//扑克数目
	['BYTE', 'cbHandCardData', MAX_COUNT],					//扑克列表
	['BYTE', 'cbSendCardData'],								//发送扑克

	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['CMD_WeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克

	//财神变量
	['BYTE', 'cbMagicCardData'],								//财神牌值
]


//游戏开始
var CMD_S_GameStart = 
[
	['BYTE','cbPlayType'],									//基础设置
	['DWORD', 'dwBankerUserId'],							//庄家用户
	['WORD', 'wCurrentUser'],								//当前出牌用户
	['BYTE', 'cbActionMask'],								//用户动作
	['BYTE', 'cbHandCardData', MAX_COUNT],					//扑克列表
	['BYTE', 'cbMagicCardData'],							//财神牌值						
	['bool', 'bIsRandBanker'],
	['bool', 'bBuHuaUser'],									//是否有补花用户
	['BYTE', 'cbDingPengData',GAME_PLAYER],         		//是否顶碰
]

//出牌命令
var CMD_S_OutCard = 
[
	['WORD', 'wOutCardUser'],						//出牌用户
	['BYTE', 'cbOutCardData'],						//出牌扑克
]

//发送扑克
var CMD_S_SendCard = 
[
	['BYTE', 'cbSendCardData'],						//扑克数据
	['BYTE', 'cbActionMask'],						//动作掩码
	['WORD', 'wCurrentUser'],						//当前出牌用户
]

//操作提示
var CMD_S_OperateNotify = 
[
	['WORD', 'wResumeUser'],						//还原用户
	['BYTE', 'cbActionMask'],						//动作掩码
	['BYTE', 'cbProvideCard'],						//供应扑克
]

//操作命令
var CMD_S_OperateResult = 
[
	['WORD', 'wOperateUser'],						//操作用户
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbOperateCode'],						//操作代码
	['BYTE', 'cbOperateCard', 3],					//操作扑克
	['BYTE', 'cbActionMask'],
]

//游戏结束
var CMD_S_GameEnd = 
[
	//结束信息
	['DWORD', 'wWinner',GAME_PLAYER],
	['WORD', 'wExitUser'],							//强退用户
	['BYTE', 'endType'],   							//0强退 1流局 2自摸 3点炮
	['BYTE', 'wLaZi'],   							//辣子
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCard'],						//供应扑克
	['DWORD', 'dwChiHuKind', GAME_PLAYER],			//胡牌类型
	['DWORD', 'dwChiHuRight', GAME_PLAYER],			//胡牌类型

	//积分信息
	['SCORE', 'lGameScore', GAME_PLAYER],			//游戏积分

	//扑克信息
	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],	//扑克数据
	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],								//组合数目
	['CMD_WeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克
	['BYTE', 'cbTempTest', GAME_PLAYER, MAX_COUNT],	//临时测试
	['WORD', 'cbIGameFan',GAME_PLAYER],				//用户番数
	['SCORE', 'cbIGameHu',GAME_PLAYER],				//用户胡数

]
//补牌命令
var CMD_S_ReplaceCard = 
[
	['WORD', 'wReplaceUser'],						//补牌用户
	['BYTE', 'cbHuaCard', MAX_HUA_CARD],			//花牌扑克
	['BYTE', 'cbReplaceCard', MAX_HUA_CARD],		//补牌扑克
	['bool', 'bBuHuaUser'],                         //是否有补花用户 没有游戏继续
	['BYTE', 'cbUserAction'],						//用户动作
]

//顶碰结果
var CMD_S_DingPeng_Result = 
[
	['BYTE', 'cbDingPengData',GAME_PLAYER],         //是否顶碰
	['WORD', 'wOperateUser'],						//操作用户
]
//平搓结果
var CMD_S_Ping_Result = 
[
	['BYTE', 'cbPingCuoCuo'],         				//是否平挫搓
]
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3								//操作扑克
var SUB_C_REPLACE_CARD = 5								//用户补牌
var SUB_C_DINGPENG = 6									//顶碰命令
var SUB_C_PINGCUO = 7									//平挫搓命令
//出牌命令
var CMD_C_OutCard = 
[
	['BYTE', 'cbOutCardData'],							//扑克数据
]

//操作命令
var CMD_C_OperateCard = 
[
	['BYTE', 'cbOperateCode'],						//操作代码
	['BYTE', 'cbOperateCard', 3],					//操作扑克
]

var CMD_C_DINGPENG =
[
	['bool', 'cbDingPeng'],							//是否顶碰
]

var CMD_C_Ping_Result =
[
	['BYTE', 'cbPingCuoCuo'],							//是否平挫搓
]


//////////////////////////////////////////////////////////////////////////

//#endif