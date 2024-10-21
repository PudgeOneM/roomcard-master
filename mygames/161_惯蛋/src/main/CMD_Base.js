//#ifndef CMD_HEAD_FILE
//#define CMD_HEAD_FILE
//#pragma pack(1)

//////////////////////////////////////////////////////////////////////////////////
//服务定义
var INVALID_CARD_DATA = INVALID_BYTE

//游戏属性
var KIND_ID = 161									//游戏 I D
var GAME_NAME = "惯蛋"						//游戏名字
var MAX_COUNT = 27									//最大数目
var DICARD_COUNT = 0									
var MAX_REPERTORY = 108									//全牌数目
var GAME_PLAYER = 4	


var MAX_MAGIC_COUNT = 1//无财神时设置为0 m_cbMagicIndex[MAX_MAGIC_COUNT]不赋值即可
var TURNOVER_COUNT_MAGIC = 1	

//数值掩码
var MASK_COLOR = 0xF0								//花色掩码
var MASK_VALUE = 0x0F								//数值掩码

//排序类型
var ST_ORDER = 0									//大小排序
var ST_COUNT = 1									//数目排序
var ST_VALUE = 2									//数值排序
var ST_COLOR = 3									//花色排序
var ST_CUSTOM = 4									//自定排序
var ST_510K = 5									//510K排序
var ST_TONGHUA = 6									//同花排序
var ST_TYPE = 7									//牌型排序

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
var SUB_S_CALL_NOTIFY = 107									
var SUB_S_CALL_RESULT = 108	
var SUB_S_GAME_START = 100									//游戏开始
var SUB_S_OUT_CARD = 103									//用户出牌
var SUB_S_PASS_CARD = 104									//用户放弃
var SUB_S_GAME_END = 105									//游戏结束
var SUB_S_TRIBUTE_RESULT = 106									//用户贡牌
var SUB_S_SORT_CARD = 102									//用户排序
var SUB_S_ARRANGE_CARD = 101									//整理扑克
var CMD_S_CallNotify = 
[
	['WORD', 'wCurrentUserCall'],						//当前玩家
	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//手上扑克数量
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],			//扑克列表
]

var CMD_S_CallResult = 
[
	['WORD', 'wCallUser'],						
	['BYTE', 'cbCallRecord', GAME_PLAYER],			//叫分信息
	['WORD', 'wCurrentUserCall'],					//当前玩家				
]

//游戏开始
var CMD_S_GameStart = 
[
	['BYTE', 'cbCurTeam'],											//当前队伍
	['BYTE', 'cbTeamProcess', 2],									//队伍进度
	['BYTE', 'cbLastResult', GAME_PLAYER],							//上轮结果
	['WORD', 'wCurrentUser'],										//当前玩家
	['WORD', 'wBankerUser'],										//庄家用户
	['BYTE', 'cbHandCardCount', GAME_PLAYER],						//手上扑克数量
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],						//扑克列表

	['BYTE', 'cbDiCardData', max(1,DICARD_COUNT)],					//底牌显示
	['BYTE', 'cbMagicCardData', max(1,MAX_MAGIC_COUNT)],					
	['BYTE', 'cbTurnoverCardData', max(1,TURNOVER_COUNT_MAGIC)],
	['BYTE', 'cbTributeGiveCard', GAME_PLAYER],						//上贡大牌
	['BYTE', 'cbTributeProgress'],									//上贡进度							
	['BYTE', 'cbChangeChair'],										//座位换人

]

//用户出牌
var CMD_S_OutCard = 
[
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wOutCardUser'],						//出牌玩家
	['BYTE', 'cbOutCardCount'],						//出牌数目
	['OUTCARD', 'cbOutCardData', MAX_COUNT],			//扑克列表

	['WORD', 'wWinOrder', GAME_PLAYER],				//胜利列表
	['LONG', 'lTurnData'],
	['LONG', 'lPlayerData', GAME_PLAYER, 1],

	['BYTE', 'cbArrangeCardCount'],							//整理数目
	['BYTE', 'cbArrangeCardData', MAX_COUNT],				//整理扑克

	['BYTE', 'cbHandCardCount', GAME_PLAYER],						//手上扑克数量
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],						//扑克列表							
]

//放弃出牌
var CMD_S_PassCard = 
[
	['BYTE', 'cbTurnOver'],								//一轮结束
	['WORD', 'wCurrentUser'],							//当前玩家
	['WORD', 'wPassCardUser'],							//放弃玩家
	
	['LONG', 'lTurnData'],
	['LONG', 'lPlayerData', GAME_PLAYER, 1],
]

//游戏结束
var CMD_S_GameEnd = 
[
	['WORD', 'wExitUser'],								//强退用户
	['LONG', 'lGameScore', GAME_PLAYER],				//游戏积分

	['WORD', 'wWinOrder', GAME_PLAYER],					//胜利列表
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
	//单元积分
	['LONG', 'lCellScore'],										//单元积分
	['DWORD', 'dwLastWinner', 2],					
]

//叫分状态
var CMD_S_StatusCall = 
[	
	['LONG', 'lCellScore'],								//单元积分
	['WORD', 'wCurrentUserCall'],						//当前玩家
	['BYTE', 'cbCallRecord', GAME_PLAYER],				//叫分信息
	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//手上扑克数量
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],			//手上扑克
]

var CMD_S_TributeResult = 
[	
	['BYTE', 'cbTributeProgress'],						//上贡进度
	['WORD', 'wTributeUser'],							//当前玩家
	['BYTE', 'cbTributeProCards', GAME_PLAYER],			//提供扑克
	['BYTE', 'cbNewCards', GAME_PLAYER],				//收到新牌
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],			//扑克列表
	['WORD', 'wCurrentUser'],							//当前玩家
]
//游戏状态
var CMD_S_StatusPlay = 
[
	['BYTE', 'cbSortType'],									//排序类型
	['BYTE', 'cbCurTeam'],									//当前队伍
	['BYTE', 'cbTeamProcess', 2],							//队伍进度
	['BYTE', 'cbLastResult', GAME_PLAYER],					//上轮结果
	//游戏变量
	['LONG', 'lCellScore'],									//单元积分
	['WORD', 'wCurrentUser'],								//当前需要出牌用户
	['WORD', 'wBankerUser'],								//庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER],					//叫分信息
	['WORD', 'wWinOrder', GAME_PLAYER],						//胜利列表
	['LONG', 'lTurnData'],
	['LONG', 'lPlayerData', GAME_PLAYER, 1],

	//出牌信息
	['WORD', 'wOutCardUser'],								//本轮胜者
	['BYTE', 'cbOutCardCount'],								//出牌数目
	['OUTCARD', 'cbOutCardData', MAX_COUNT],					//出牌数据
	
	//手牌信息
	['BYTE', 'cbHandCardCount', GAME_PLAYER],				//扑克数目
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],				//手上扑克

	['BYTE', 'cbOutBombCount', GAME_PLAYER],


	['BYTE', 'cbDiCardData', max(1,DICARD_COUNT)],			//底牌显示
	['BYTE', 'cbMagicCardData', max(1,MAX_MAGIC_COUNT)],					
	['BYTE', 'cbTurnoverCardData', max(1,TURNOVER_COUNT_MAGIC)],
	['BYTE', 'cbTributeGiveCard', GAME_PLAYER],						//上贡大牌

	['BYTE', 'cbTributeProgress'],						//上贡进度
	['WORD', 'wTributeUser'],							//当前玩家
	['BYTE', 'cbTributeProCards', GAME_PLAYER],			//提供扑克
	['BYTE', 'cbNewCards', GAME_PLAYER],				//收到新牌
	['BYTE', 'cbArrangeCardCount'],							//整理数目
	['BYTE', 'cbArrangeCardData', MAX_COUNT],				//整理扑克
	
]

var CMD_S_Sort_Card = 
[
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],				//手上扑克
	['BYTE', 'cbHandCardCount', GAME_PLAYER],				//扑克数目
	['BYTE', 'cbSortType'],									//排序类型
]

var CMD_S_Arrange_Card = 
[	
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],				//手上扑克
	['BYTE', 'cbHandCardCount', GAME_PLAYER],				//扑克数目
	['BYTE', 'cbArrangeCardCount'],							//整理数目
	['BYTE', 'cbArrangeCardData', MAX_COUNT],				//整理扑克
]

//////////////////////////////////////////////////////////////////////////
//命令定义

var SUB_C_OUT_CARD = 1									//用户出牌
var SUB_C_PASS_CARD = 2									//用户放弃
var SUB_C_CALL = 4									//操作扑克
var SUB_C_TRIBUTE_BACK = 5									//用户上贡
var SUB_C_SORT_CARD = 6									//用户排序
var SUB_C_ARRANGE_CARD = 3									//用户理牌

//出牌数据包
var CMD_C_OutCard = 
[
	['BYTE', 'cbOutCardCount'],							//出牌数目
	['OUTCARD', 'cbOutCardData', MAX_COUNT],				//扑克列表
	['BYTE', 'cbArrangeCount'],							//理牌数目
	['OUTCARD', 'cbArrangeData', MAX_COUNT],				//理牌列表
	['BYTE', 'cbTypeLevel'],
]

//游戏设置
var CMD_C_Call = 
[
	['BYTE', 'cbCallScore'],						
]

//用户上贡
var CMD_C_Tribute_Back = 
[
	['BYTE', 'cbTributeType'],										//贡牌类型 1上贡 2返回小牌 
	['BYTE', 'cbTributeCard'],										//操作扑克
]
//用户排序
var CMD_C_Sort_Card = 
[
	['BYTE', 'cbSortType'],											//排序类型
]
//用户理牌
var CMD_C_Arrange_Card = 
[
	['BYTE', 'cbArrangeCardCount'],						//整理数目
	['BYTE', 'cbArrangeCardData', MAX_COUNT],						//整理扑克
]
//////////////////////////////////////////////////////////////////////////

//#endif