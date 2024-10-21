//#ifndef CMD_HEAD_FILE
//#define CMD_HEAD_FILE
//#pragma pack(1)

//////////////////////////////////////////////////////////////////////////////////
//服务定义
var INVALID_CARD_DATA = INVALID_BYTE

//游戏属性
var KIND_ID = 46									//游戏 I D
var GAME_NAME = "湖州十三道"					//游戏名字
var MAX_COUNT = 13									//最大数目
var DICARD_COUNT = 0									
var MAX_REPERTORY = 52									//全牌数目
var GAME_PLAYER = 4	

//如果有癞子出的牌包括两个信息：癞子牌+癞子代替的牌。 
var OUTCARD = BYTE	//无癞子时设置为BYTE 有癞子时设置为WORD

var START_MODE = START_MODE_ALL_READY 

//////////////////////////////////////////////////////////////////////////////////
var VERSION_SERVER = PROCESS_VERSION(6,0,3)				//程序版本
var VERSION_CLIENT = PROCESS_VERSION(6,0,3)				//程序版本
//////////////////////////////////////////////////////////////////////////////////
//状态定义
var GAME_SCENE_FREE = GAME_STATUS_FREE					//等待开始
var GAME_SCENE_CALL = (GAME_STATUS_PLAY+1)				//叫分
var GAME_SCENE_PLAY = (GAME_STATUS_PLAY+2)				//游戏进行

var call_body = 
[
	['BYTE', 'callFlag'],//0普通牌型 1-253特殊牌型  254放弃(无人坐下) 255还没叫

	['BYTE', 'headCardDatas', 3],
	['BYTE', 'headLevel'],
	['DWORD', 'headScore'],

	['BYTE', 'centerCardDatas', 5],
	['BYTE', 'centerLevel'],
	['DWORD', 'centerScore'],

	['BYTE', 'tailCardDatas', 5],
	['BYTE', 'tailLevel'],
	['DWORD', 'tailScore'],
]
//////////////////////////////////////////////////////////////////////////
//命令定义
var SUB_S_CALL_NOTIFY = 107									
var SUB_S_CALL_RESULT = 108	
var SUB_S_GAME_START = 100									//游戏开始
var SUB_S_OUT_CARD = 103									//用户出牌
var SUB_S_PASS_CARD = 104									//用户放弃
var SUB_S_GAME_END = 105									//游戏结束


var CMD_S_CallNotify = 
[
	['WORD', 'wCurrentUserCall'],						//当前玩家
	['BYTE', 'cbHandCardCount', GAME_PLAYER],		//手上扑克数量
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],			//扑克列表
]

var CMD_S_CallResult = 
[
	['WORD', 'wCallUser'],									
	['call_body', 'callBody'],					
]

//发送扑克
var CMD_S_GameStart = 
[
	['WORD', 'wCurrentUser'],						//当前玩家
	['BYTE', 'cbHandCardCount', GAME_PLAYER],		//手上扑克数量
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],			//扑克列表
	['BYTE', 'cbDiCardData', max(1,DICARD_COUNT)],					//底牌显示
]

//用户出牌
var CMD_S_OutCard = 
[
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wOutCardUser'],						//出牌玩家
	['BYTE', 'cbOutCardCount'],						//出牌数目
	['OUTCARD', 'cbOutCardData', MAX_COUNT],			//扑克列表
	['OUTCARD', 'cbOutChangeCard', MAX_COUNT],					//变后牌

	['WORD', 'wWinOrder', GAME_PLAYER],				//胜利列表
	['LONG', 'lTurnData'],
	['LONG', 'lPlayerData', GAME_PLAYER, 2],
]

//放弃出牌
var CMD_S_PassCard = 
[
	['BYTE', 'cbTurnOver'],							//一轮结束
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wPassCardUser'],						//放弃玩家
	
	['LONG', 'lTurnData'],
	['LONG', 'lPlayerData', GAME_PLAYER, 2],
]

//游戏结束
var CMD_S_GameEnd = 
[
	['WORD', 'wExitUser'],						//强退用户
	['LONG', 'lGameScore', GAME_PLAYER],			//游戏积分
	['LONG', 'lBaseScore', GAME_PLAYER, GAME_PLAYER, 3],
	['LONG', 'lExtraScore', GAME_PLAYER, GAME_PLAYER, 3],
	['bool', 'bIsDaqiang', GAME_PLAYER, GAME_PLAYER],   
	['WORD', 'wDa3qiangUser'],

	['call_body', 'cbCallRecord', GAME_PLAYER],
]

//空闲状态
var CMD_S_StatusFree = 
[
	//单元积分
	['LONG', 'lCellScore'],							//单元积分
]

//叫分状态
var CMD_S_StatusCall = 
[	
	['LONG', 'lCellScore'],							//单元积分
	['WORD', 'wCurrentUserCall'],						//当前玩家
	['BYTE', 'cbCallRecord', GAME_PLAYER],			//叫分信息
	['BYTE', 'cbHandCardCount', GAME_PLAYER],		//手上扑克数量
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],			//手上扑克
]

//游戏状态
var CMD_S_StatusPlay = 
[
	//游戏变量
	['LONG', 'lCellScore'],									//单元积分
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],			//手上扑克
	['call_body', 'cbCallRecord', GAME_PLAYER],
	['BYTE','cbResidualCard',MAX_COUNT],					
]


//////////////////////////////////////////////////////////////////////////
//命令定义

var SUB_C_OUT_CARD = 1									//用户出牌
var SUB_C_PASS_CARD = 2									//用户放弃
var SUB_C_CALL = 4									//操作扑克
var SUB_C_MOVE_CARD = 5									//移动扑克

//出牌数据包
var CMD_C_OutCard = 
[
	['BYTE', 'cbOutCardCount'],							//出牌数目
	['OUTCARD', 'cbOutCardData', MAX_COUNT],				//扑克列表
	['OUTCARD', 'cbOutChangeCard', MAX_COUNT],				//变后牌

	['LONG', 'shangCount'],
]
var CMD_C_MoveCard = 
[
	['BYTE', 'headCardDatas', 3],
	['BYTE', 'centerCardDatas', 5],
	['BYTE', 'tailCardDatas', 5],
	['BYTE', 'handCaardDatas', MAX_COUNT],
]

//游戏设置
var CMD_C_Call = 
[
	['call_body', 'callBody'],					
]

//////////////////////////////////////////////////////////////////////////

//#endif