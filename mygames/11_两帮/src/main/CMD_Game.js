//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)

//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 11									//游戏 I D
var GAME_NAME = "两帮"					//游戏名字

//组件属性
var GAME_PLAYER = 4									//游戏人数
var VERSION_SERVER = PROCESS_VERSION(6,0,3)				//程序版本
var VERSION_CLIENT = PROCESS_VERSION(6,0,3)				//程序版本

//////////////////////////////////////////////////////////////////////////////////
//状态定义

var GAME_SCENE_FREE = GAME_STATUS_FREE					//等待开始
var GAME_SCENE_PLAY = GAME_STATUS_PLAY					//游戏进行
var GAME_SCENE_WAIT = (GAME_STATUS_PLAY+1)				//等待开始


//////////////////////////////////////////////////////////////////////////
//数目定义

var MAX_COUNT = 28									//最大数目
var FULL_COUNT = 108									//全牌数目

//////////////////////////////////////////////////////////////////////////

//数值掩码
var MASK_COLOR = 0xF0								//花色掩码
var MASK_VALUE = 0x0F								//数值掩码

//扑克类型
var CT_ERROR = 0									//错误类型
var CT_SINGLE = 1									//单牌类型
var CT_DOUBLE = 2									//对子类型
var CT_SINGLE_LINK = 3									//单连类型
var CT_THREE = 4									//三条类型
var CT_THREE_DOUBLE = 5									//三带二型
var CT_DOUBLE_LINK = 6									//对连类型
var CT_THREE_LINK = 7									//三连类型
var CT_HU_DIE = 8									//蝴蝶类型

var CT_BOMB_4 = 9									//4炸类型
var CT_510K_DC = 10									//杂510K
var CT_510K_SC = 11									//纯510K
var CT_BOMB_5 = 12									//5弹类型
var CT_TONG_HUA_SHUN = 13									//同花顺型
var CT_BOMB_6 = 14									//6炸类型
var CT_BOMB_7 = 15									//7炸类型
var CT_BOMB_8 = 16									//8炸类型
var CT_BOMB_TW = 17									//天王炸弹

//////////////////////////////////////////////////////////////////////////
//命令定义

var SUB_S_GAME_START = 100									//游戏开始
var SUB_S_OUT_CARD = 104									//用户出牌
var SUB_S_PASS_CARD = 105									//用户放弃
var SUB_S_CARD_INFO = 106									//扑克信息
var SUB_S_GAME_END = 107									//游戏结束

//玩家托管事件
var CMD_S_UserAutomatism = 
[
	['WORD', 'wChairID'],
	['bool', 'bTrusee'],
]

//空闲状态
var CMD_S_StatusFree = 
[
	//单元积分
	['LONG', 'lCellScore'],							//单元积分
	['bool', 'bAutoStatus', 4],						//托管状态
	['DWORD', 'dwLastWinner', 2],					//
]

//游戏状态
var CMD_S_StatusPlay = 
[
	//游戏变量
	['LONG', 'lCellScore'],							//单元积分
	['WORD', 'wCurrentUser'],						//当前玩家
	['BYTE', 'b510KCardRecord', 3, 8],

	//胜利信息
	['WORD', 'wWinCount'],							//胜利人数
	['WORD', 'wWinOrder', GAME_PLAYER],				//胜利列表

	//出牌信息
	['WORD', 'wTurnWiner'],							//本轮胜者
	['BYTE', 'cbTurnCardCount'],					//出牌数目
	['BYTE', 'cbTurnCardData', MAX_COUNT],			//出牌数据
	['BYTE', 'cbTurnChangeCard', MAX_COUNT],			//变幻扑克

	//扑克信息
	['BYTE', 'cbHandCardData', MAX_COUNT],			//手上扑克
	['BYTE', 'cbHandCardCount', GAME_PLAYER],		//扑克数目
	['LONG', 'PlayerScore', GAME_PLAYER],
	['LONG', 'TurnScore'],
]

//发送扑克
var CMD_S_GameStart = 
[
	//扑克信息
	['WORD', 'wCurrentUser'],						//当前玩家
	['BYTE', 'cbCardData', MAX_COUNT-1],			//扑克列表
]

//用户出牌
var CMD_S_OutCard = 
[
	['BYTE', 'cbCardCount'],						//出牌数目
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wOutCardUser'],						//出牌玩家
	['LONG', 'TurnScore'],
	['BYTE', 'b510KCardRecord', 3, 8],
	['WORD', 'wWinOrder', GAME_PLAYER],				//胜利列表
	['BYTE', 'cbCardData', MAX_COUNT-1],			//扑克列表
	['BYTE', 'cbChangeCard', MAX_COUNT-1],					//变后牌
]

//放弃出牌
var CMD_S_PassCard = 
[
	['BYTE', 'cbTurnOver'],							//一轮结束
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wPassCardUser'],						//放弃玩家
	['LONG', 'TurnScore'],
	['LONG', 'PlayerScore', GAME_PLAYER],
]

//扑克信息
var CMD_S_CardInfo = 
[
	['BYTE', 'cbCardCount'],						//扑克数目
	['BYTE', 'cbCardData', MAX_COUNT],				//扑克列表
]

//游戏结束
var CMD_S_GameEnd = 
[
	['WORD', 'wUser'],
	['LONG', 'TurnScore'],
	['LONG', 'PlayerScore', GAME_PLAYER],

	//游戏成绩
	['LONG', 'lGameScore', GAME_PLAYER],			//游戏积分

	//扑克信息
	['BYTE', 'cbCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbCardData', GAME_PLAYER, MAX_COUNT],	//扑克列表
	['DWORD', 'dwLastWinner', 2],					//
]

//////////////////////////////////////////////////////////////////////////
//命令定义

var SUB_C_OUT_CARD = 1									//用户出牌
var SUB_C_PASS_CARD = 2									//用户放弃

//用户托管
var CMD_C_Automatism = 
[
	['bool', 'bAutomatism'],
]

//出牌数据包
var CMD_C_OutCard = 
[
	['BYTE', 'cbCardCount'],							//出牌数目
	['BYTE', 'cbCardData', MAX_COUNT],						//扑克列表
	['BYTE', 'cbChangeCard', MAX_COUNT],					//变后牌
]

//////////////////////////////////////////////////////////////////////////

//#endif