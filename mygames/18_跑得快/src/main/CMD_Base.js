//#ifndef CMD_HEAD_FILE
//#define CMD_HEAD_FILE
//#pragma pack(1)

//////////////////////////////////////////////////////////////////////////////////
//服务定义
var INVALID_CARD_DATA = INVALID_BYTE

//游戏属性
var KIND_ID = 18									//游戏 I D
var GAME_NAME = "跑得快"						//游戏名字
var MAX_COUNT = 16									//最大数目									
var MAX_REPERTORY = 48									//全牌数目
var GAME_PLAYER = 3									//游戏人数
var BOMB_SCORE = 10									//炸弹分
var OUTCARD = BYTE
var WARM_MAX = 1									//警告牌数

//////////////////////////////////////////////////////////////////////////////////
var VERSION_SERVER = PROCESS_VERSION(6,0,3)				//程序版本
var VERSION_CLIENT = PROCESS_VERSION(6,0,3)				//程序版本
//////////////////////////////////////////////////////////////////////////////////
//状态定义
var GAME_SCENE_FREE = GAME_STATUS_FREE					//等待开始
var GAME_SCENE_CALL = (GAME_STATUS_PLAY+1)				//叫分
var GAME_SCENE_PLAY = (GAME_STATUS_PLAY+2)				//游戏进行
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
	['BYTE', 'cbCallRecord', GAME_PLAYER],			//叫分信息
	['WORD', 'wCurrentUserCall'],						//当前玩家				
]

//发送扑克
var CMD_S_GameStart = 
[
	['WORD', 'wBankerUser'],						//庄家用户
	['WORD', 'wCurrentUser'],						//当前玩家
	['BYTE', 'cbPlayCount'],						//局数
	['BYTE', 'cbCardData', MAX_COUNT],				//扑克列表
]

//用户出牌
var CMD_S_OutCard = 
[
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wOutCardUser'],						//出牌玩家
	['BYTE', 'cbOutCardCount'],						//出牌数目
	['OUTCARD', 'cbOutCardData', MAX_COUNT],			//扑克列表
	['BYTE', 'bPass', GAME_PLAYER],					//过牌记录
]

//放弃出牌
var CMD_S_PassCard = 
[
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wPassCardUser'],						//放弃玩家
	['BYTE', 'bPass', GAME_PLAYER],
]

//游戏结束
var CMD_S_GameEnd = 
[
	['WORD', 'wExitUser'],
	['BYTE', 'cbPlayCount'],									//局数
	['BYTE', 'bBombCount', GAME_PLAYER],						//炸弹数目
	['LONGLONG', 'lGameScore', GAME_PLAYER],						//游戏积分
	['BYTE', 'bCardCount', GAME_PLAYER],						//扑克数目
	['BYTE', 'bCardData', GAME_PLAYER, MAX_COUNT],				//扑克列表 
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
	['LONG', 'lCellScore'],							//单元积分
	['WORD', 'wCurrentUser'],						//当前需要出牌用户
	['WORD', 'wBankerUser'],						//庄家用户
	['BYTE', 'cbPlayCount'],						//局数
	['BYTE', 'bPass', GAME_PLAYER],					//过牌记录

	//出牌信息
	['WORD', 'wOutCardUser'],						//本轮胜者
	['BYTE', 'cbOutCardCount'],						//出牌数目
	['OUTCARD', 'cbOutCardData', MAX_COUNT],			//出牌数据
	
	//手牌信息
	['BYTE', 'cbHandCardCount', GAME_PLAYER],		//扑克数目
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],		//手上扑克

	['BYTE', 'cbOutBombCount', GAME_PLAYER],
]


//////////////////////////////////////////////////////////////////////////
//命令定义

var SUB_C_OUT_CARD = 1									//用户出牌
var SUB_C_PASS_CARD = 2									//用户放弃
var SUB_C_CALL = 4									//操作扑克

//出牌数据包
var CMD_C_OutCard = 
[
	['BYTE', 'cbOutCardCount'],							//出牌数目
	['OUTCARD', 'cbOutCardData', MAX_COUNT],				//扑克列表
]

//游戏设置
var CMD_C_Call = 
[
	['BYTE', 'cbCallScore'],						
]
//////////////////////////////////////////////////////////////////////////

//#endif