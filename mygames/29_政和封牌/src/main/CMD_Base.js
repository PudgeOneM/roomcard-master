//#ifndef CMD_HEAD_FILE
//#define CMD_HEAD_FILE
//#pragma pack(1)

//////////////////////////////////////////////////////////////////////////////////
//游戏属性
var KIND_ID = 29									//游戏 I D
var GAME_NAME = "政和封牌"					//游戏名字
var MAX_COUNT = 16									//最大数目	
var MAX_REPERTORY = 48									//全牌数目
var GAME_PLAYER = 3									//游戏人数
var BOMB_SCORE = 5									//炸弹分
var OUTCARD = BYTE
var WARM_MAX = 1									//警告牌数
var BLACK_3 = 0x33								//黑桃3

//////////////////////////////////////////////////////////////////////////
//扑克类型
var CT_ERROR = 0										//错误类型
var CT_SINGLE = 1										//单牌类型
var CT_DOUBLE = 2										//对子类型
var CT_THREE = 3										//三张类型
var CT_SINGLE_LINE = 4										//单连类型
var CT_DOUBLE_LINE = 5										//对连类型
var CT_THREE_LINE = 6										//三连类型
var CT_BOMB = 7										//炸弹类型
var CT_BOMB_TAKE = 8										//炸弹带牌

//////////////////////////////////////////////////////////////////////////
//逻辑值
var MAX_SAME = 4										//同牌最大数量
var MAX_DOUBLE = (MAX_COUNT / 2)							//对子最大数量
var MAX_THREE = (MAX_COUNT / 3)							//三张最大数量
var MAX_FOUR = (MAX_COUNT / 4)							//四张最大数量
var MIN_LINE_SINGLE_LEN = 5										//顺子最小牌数
var MIN_LINE_DOUBLE_LEN = 4										//连对最小牌数
var MIN_LINE_THREE_LEN = 6										//飞机最小牌数
var MAX_LINE_SINGLE = (MAX_COUNT / MIN_LINE_SINGLE_LEN)		//顺子最大数量
var MAX_LINE_DOUBLE = (MAX_COUNT / MIN_LINE_DOUBLE_LEN)		//连对最大数量
var MAX_LINE_THREE = (MAX_COUNT / MIN_LINE_THREE_LEN)		//飞机最大数量
var MAX_THREE_TAKE = 2										//三张最大带牌数
var MAX_FOUR_TAKE = 3										//四张最大带牌数

//////////////////////////////////////////////////////////////////////////
//数值掩码
var LOGIC_MASK_COLOR = 0xF0								//花色掩码
var LOGIC_MASK_VALUE = 0x0F								//数值掩码

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