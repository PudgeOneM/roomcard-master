//#ifndef CMD_HEAD_FILE
//#define CMD_HEAD_FILE
//#pragma pack(1)

//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var LOGIC_ARRAY_MAX_LEN = (108+1)
var LOGIC_ARRAY_TAIL_SIGN = (-32768)
var KIND_ID = 19									//游戏 I D
var GAME_NAME = "嘉兴红十"					//游戏名字
var MAX_COUNT = 14									//最大数目
var DICARD_COUNT = 1									
var MAX_REPERTORY = 54									//全牌数目
var GAME_PLAYER = 4	
//////////////////////////////////////////////////////////////////////////////////
//组件属性								//游戏人数
var VERSION_SERVER = PROCESS_VERSION(6,0,3)				//程序版本
var VERSION_CLIENT = PROCESS_VERSION(6,0,3)				//程序版本
//////////////////////////////////////////////////////////////////////////////////
//状态定义
var GAME_SCENE_FREE = GAME_STATUS_FREE					//等待开始
var GAME_SCENE_CALL = (GAME_STATUS_PLAY+1)				//叫分
var GAME_SCENE_PLAY = (GAME_STATUS_PLAY+2)				//游戏进行
//////////////////////////////////////////////////////////////////////////
//命令定义

var SUB_S_GAME_START = 100									//游戏开始
var SUB_S_BANKER_INFO = 102									//庄家信息
var SUB_S_OUT_CARD = 103									//用户出牌
var SUB_S_PASS_CARD = 104									//用户放弃
var SUB_S_GAME_END = 105									//游戏结束
var SUB_S_CALL_NOTIFY = 107									
var SUB_S_CALL_RESULT = 108									

//空闲状态
var CMD_S_StatusFree = 
[	
	//单元积分
	['LONG', 'lCellScore'],							//单元积分
]

//叫分状态
var CMD_S_StatusCall = 
[	
	//base
	//游戏信息
	['LONG', 'lCellScore'],							//单元积分
	['WORD', 'wCurrentUserCall'],						//当前玩家
	['BYTE', 'cbCallRecord', GAME_PLAYER],			//叫分信息
	['BYTE', 'cbHandCardCount', GAME_PLAYER],		//手上扑克数量
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],			//手上扑克
]

//游戏状态
var CMD_S_StatusPlay = 
[
	['BYTE', 'cbShowCount'],
	['BYTE', 'cbCallRecord', GAME_PLAYER],			//叫分信息
	//游戏变量
	['LONG', 'lCellScore'],							//单元积分
	['WORD', 'wCurrentUser'],						//当前玩家
	//胜利信息
	['WORD', 'wWinOrder', GAME_PLAYER],				//胜利列表
	//出牌信息
	['WORD', 'wOutCardUser'],							//本轮胜者
	['BYTE', 'cbOutCardCount'],					//出牌数目
	['BYTE', 'cbOutCardData', MAX_COUNT],			//出牌数据
	['BYTE', 'cbOutCardChange', MAX_COUNT],			//变幻扑克
	//扑克信息
	['BYTE', 'cbHandCardCount', GAME_PLAYER],		//扑克数目
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],			//手上扑克
	['BYTE', 'cbDiCardData', DICARD_COUNT],					//底牌显示
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
	['BYTE', 'cbCallScore'],	
	['WORD', 'wCurrentUserCall'],						//当前玩家				
]

//发送扑克
var CMD_S_GameStart = 
[
	['BYTE', 'cbShowCount'],
	['BYTE', 'cbCallRecord', GAME_PLAYER],			//叫分信息
	['WORD', 'wCurrentUser'],						//当前玩家
	['BYTE', 'cbHandCardCount', GAME_PLAYER],		//手上扑克数量
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],			//扑克列表
]

//庄家信息
var CMD_S_BankerInfo = 
[
	['WORD', 'wBankerUser'],						//庄家玩家
	['WORD', 'wCurrentUser'],						//当前玩家
	['BYTE', 'cbBankerScore'],						//庄家叫分
	['BYTE', 'cbDiCardData', DICARD_COUNT],					//庄家扑克
]

//用户出牌
var CMD_S_OutCard = 
[
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wWinOrder', GAME_PLAYER],				//胜利列表
	['WORD', 'wOutCardUser'],						//出牌玩家
	['BYTE', 'cbOutCardCount'],						//出牌数目
	['BYTE', 'cbOutCardData', MAX_COUNT],			//扑克列表
	['BYTE', 'cbOutCardChange', MAX_COUNT],					//变后牌
	['BYTE', 'cbCallScore'],
]

//放弃出牌
var CMD_S_PassCard = 
[
	//base
	['BYTE', 'cbTurnOver'],							//一轮结束
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wPassCardUser'],						//放弃玩家
]

//游戏结束
var CMD_S_GameEnd = 
[
	['WORD', 'wExitUser'],						//强退用户
	['LONG', 'lGameScore', GAME_PLAYER],			//游戏积分
	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],	//扑克列表	
	['BYTE', 'cbCallRecord', GAME_PLAYER],			//叫分信息		
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
	['BYTE', 'cbOutCardData', MAX_COUNT],				//扑克列表
	['BYTE', 'cbOutCardChange', MAX_COUNT],				//变后牌
]

//游戏设置
var CMD_C_Call = 
[
	['BYTE', 'cbCallScore'],						
]
//////////////////////////////////////////////////////////////////////////

//#endif