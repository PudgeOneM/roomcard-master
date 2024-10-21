//#ifndef CMD_HEAD_FILE
//#define CMD_HEAD_FILE
//#pragma pack(1)

//////////////////////////////////////////////////////////////////////////////////
//服务定义
var INVALID_CARD_DATA = INVALID_BYTE

//游戏属性
var KIND_ID = 33									//游戏 I D
var GAME_NAME = "两副头"					//游戏名字
var MAX_COUNT = 27									//最大数目
var DICARD_COUNT = 0									
var MAX_REPERTORY = 108									//全牌数目
var GAME_PLAYER = 4	
var PK_COUNT = 16									//一种色牌加大小王从一开始到15数目
var MAX_BOMB = 6									//最大炸弹数

var MAX_MAGIC_COUNT = 4//无财神时设置为0 m_cbMagicIndex[MAX_MAGIC_COUNT]不赋值即可
var TURNOVER_COUNT_MAGIC = 1	


//如果有癞子出的牌包括两个信息：癞子牌+癞子代替的牌。 
var OUTCARD = WORD//BYTE	//无癞子时设置为BYTE 有癞子时设置为WORD

var START_MODE = START_MODE_FULL_READY//START_MODE_ALL_READY 

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
var SUB_S_RULE_RESULT = 106
var SUB_S_CALL_NOTIFY = 107									
var SUB_S_CALL_RESULT = 108	
var SUB_S_GAME_START = 100									//游戏开始
var SUB_S_OUT_CARD = 103									//用户出牌
var SUB_S_PASS_CARD = 104									//用户放弃
var SUB_S_GAME_END = 105									//游戏结束


var CMD_S_Rule = 
[
	['bool', 'isChoose'],//是否已经选择
	['bool', 'isPingju'],//是否平局
	['bool', 'isQuantao'],//是否全讨
]

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
	['BYTE', 'cbCallData'],							//朋友牌
	['bool', 'isPingju'],	
	['bool', 'isQuantao'],
]

//发送扑克
var CMD_S_GameStart = 
[
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wBankerUser'],								//庄家用户
	['BYTE', 'cbHandCardCount', GAME_PLAYER],		//手上扑克数量
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],			//扑克列表
	['BYTE', 'cbHandCardDataMing', MAX_COUNT],			//明牌扑克

	['BYTE', 'cbDiCardData', max(1,DICARD_COUNT)],					//底牌显示
	['BYTE', 'cbMagicCardData', max(1,MAX_MAGIC_COUNT)],					
	['BYTE', 'cbTurnoverCardData', max(1,TURNOVER_COUNT_MAGIC)],
]

//用户出牌
var CMD_S_OutCard = 
[
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wOutCardUser'],						//出牌玩家
	['BYTE', 'cbOutCardCount'],						//出牌数目
	['OUTCARD', 'cbOutCardData', MAX_COUNT],			//扑克列表
	['BYTE', 'cbHandCardDataMing', MAX_COUNT],			//明牌扑克
	['BYTE', 'cbHandCardCount', GAME_PLAYER],		//手上扑克数量
	['LONG', 'wSpecialScore'],						//特殊分
	['bool', 'showfriend', GAME_PLAYER],		//显示朋友

	['WORD', 'wWinOrder', GAME_PLAYER],				//胜利列表
	['LONG', 'lTurnData'],
	['LONG', 'lPlayerData', GAME_PLAYER, 1],
]

//放弃出牌
var CMD_S_PassCard = 
[
	['BYTE', 'cbTurnOver'],							//一轮结束
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wPassCardUser'],						//放弃玩家
	
	['LONG', 'lTurnData'],
	['LONG', 'lPlayerData', GAME_PLAYER, 1],
]

//游戏结束
var CMD_S_GameEnd = 
[
	['WORD', 'wExitUser'],						//强退用户
	['LONG', 'lGameScore', GAME_PLAYER],			//游戏积分

	['WORD', 'wWinOrder', GAME_PLAYER],				//胜利列表
	['LONG', 'lTurnData'],
	['LONG', 'lPlayerData', GAME_PLAYER, 1],

	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],	//扑克列表	
	['DWORD', 'dwLastWinner', 2],					
	['BYTE', 'cbOutCardTimes', GAME_PLAYER],
]

//空闲状态
var CMD_S_StatusFree = 
[
	['bool', 'isChoose'],//是否已经选择
	['bool', 'isPingju'],//是否平局
	['bool', 'isQuantao'],//是否全讨		
	//单元积分
	['LONG', 'lCellScore'],							//单元积分
	['DWORD', 'dwLastWinner', 2],	
	
]

//叫分状态
var CMD_S_StatusCall = 
[	
	['LONG', 'lCellScore'],							//单元积分
	['WORD', 'wCurrentUserCall'],						//当前玩家
	['BYTE', 'cbCallRecord', GAME_PLAYER],			//叫分信息
	['BYTE', 'cbHandCardCount', GAME_PLAYER],		//手上扑克数量
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],			//手上扑克
	['BYTE', 'cbCallData'],							//朋友牌
	['bool', 'isPingju'],	
	['bool', 'isQuantao'],
]

//游戏状态
var CMD_S_StatusPlay = 
[
	//游戏变量
	['LONG', 'lCellScore'],									//单元积分
	['WORD', 'wCurrentUser'],								//当前需要出牌用户
	['WORD', 'wBankerUser'],								//庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER],			//叫分信息
	['WORD', 'wWinOrder', GAME_PLAYER],				//胜利列表
	['LONG', 'lTurnData'],
	['LONG', 'lPlayerData', GAME_PLAYER, 1],
	['BYTE', 'cbCallData'],							//朋友牌
	['bool', 'isPingju'],	
	['bool', 'isQuantao'],
	['bool', 'showfriend', GAME_PLAYER],							//显示朋友
	//出牌信息
	['WORD', 'wOutCardUser'],							//本轮胜者
	['BYTE', 'cbOutCardCount'],					//出牌数目
	['OUTCARD', 'cbOutCardData', MAX_COUNT],			//出牌数据
	
	//手牌信息
	['BYTE', 'cbHandCardCount', GAME_PLAYER],		//扑克数目
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],			//手上扑克
	['BYTE', 'cbHandCardDataMing', MAX_COUNT],			//明牌扑克

	['BYTE', 'cbOutBombCount', GAME_PLAYER],


	['BYTE', 'cbDiCardData', max(1,DICARD_COUNT)],					//底牌显示
	['BYTE', 'cbMagicCardData', max(1,MAX_MAGIC_COUNT)],					
	['BYTE', 'cbTurnoverCardData', max(1,TURNOVER_COUNT_MAGIC)],
]


//////////////////////////////////////////////////////////////////////////
//命令定义

var SUB_C_OUT_CARD = 1									//用户出牌
var SUB_C_PASS_CARD = 2									//用户放弃
var SUB_C_CALL = 4									//操作扑克
var SUB_C_RULE = 0									//选择规则
//出牌数据包
var CMD_C_OutCard = 
[
	['BYTE', 'cbOutCardCount'],							//出牌数目
	['OUTCARD', 'cbOutCardData', MAX_COUNT],				//扑克列表
	['BYTE', 'cbTypeLevel'],
]

//游戏设置
var CMD_C_Call = 
[
	['BYTE', 'cbCallScore'],	//2 边报，3 独报 0 不报
	['BYTE', 'cbCallData'],
	['bool', 'isPingju'],	
	['bool', 'isQuantao'],
]
var CMD_C_Rule = 
[
	['bool', 'isPingju'],//是否平局
	['bool', 'isQuantao'],//是否全讨
]

//////////////////////////////////////////////////////////////////////////

//#endif