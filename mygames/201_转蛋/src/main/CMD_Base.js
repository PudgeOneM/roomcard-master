//#ifndef CMD_HEAD_FILE
//#define CMD_HEAD_FILE
//#pragma pack(1)

//////////////////////////////////////////////////////////////////////////////////
//游戏属性
var KIND_ID = 201									//游戏 I D
var GAME_NAME = "转蛋"						//游戏名字

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

//////////////////////////////////////////////////////////////////////////
//数值掩码
var LOGIC_MASK_COLOR = 0xF0								//花色掩码
var LOGIC_MASK_VALUE = 0x0F								//数值掩码

//////////////////////////////////////////////////////////////////////////
//扑克类型
var CT_ERROR = 0										//错误类型
var CT_SINGLE = 1										//单牌
var CT_PAIR = 2										//对子
var CT_THREE = 3										//三张
var CT_LINE = 4										//单连
var CT_PAIR_LINE = 5										//对连
var CT_THREE_LINE = 6										//三连
var CT_BOMB = 7										//炸弹
//var CT_BOMB_TAKE = 8										//炸弹带牌
var CT_FLUSH_LINE = 9										//同花顺
var CT_WANG_ZHA = 10										//王炸

//////////////////////////////////////////////////////////////////////////
//带牌类型
var TAKE_ERROR = 0x0000									//错误类型
var TAKE_NONE = 0x0001									//不带
var TAKE_SINGLE = 0x0002									//带1个单牌
var TAKE_SINGLE2 = 0x0004									//带2个单牌
var TAKE_SINGLE3 = 0x0008									//带3个单牌
var TAKE_PAIR = 0x0010									//带1个对子
var TAKE_PAIR2 = 0x0020									//带2个对子

//////////////////////////////////////////////////////////////////////////////////
//基础配置
var GAME_PLAYER = 4												//游戏人数
var MAX_COUNT = 27												//最大数目									
var MAX_REPERTORY = 108												//全牌数目
var WARM_MAX = 2												//报警数
var MAX_MAGIC = 1												//财神数量(最少保留1)		
var MAX_BASE_COLOR = 4												//最大基础色
var MAX_SAME_DATA = 2												//几副牌
var MAX_SAME = (MAX_BASE_COLOR + MAX_MAGIC) * MAX_SAME_DATA	//同值牌最大数量
var MAX_INDEX = 17												//最大索引
var WANG_VALUE1 = (MAX_INDEX - 2)									//小王
var WANG_VALUE2 = (MAX_INDEX - 1)									//大王		
var MAX_WANG_COUNT = (MAX_SAME_DATA * 2)								//最大王数量			

var MIN_LINE_VALUE = 0												//最小连牌值
var MAX_LINE_VALUE = 13												//最大连牌值

var MIN_LINE_LEN = 5												//最小顺子长度
var MIN_LINE_PAIR_LEN = 4												//最小连对长度
var MIN_LINE_THREE_LEN = 6												//最小飞机长度

var MAX_LINE_LEN = 5												//最大顺子长度(上限：MAX_LINE_VALUE - MIN_LINE_VALUE + 1)
var MAX_LINE_PAIR_LEN = 4												//最大连对长度(上限：顺子上限*2)
var MAX_LINE_THREE_LEN = 6												//最大飞机长度(上限：顺子上限*3)

var MAX_LINE_WEAVE = (MAX_LINE_VALUE - MIN_LINE_VALUE + 1 - MIN_LINE_LEN + 1)				//最大顺子组合
var MAX_LINE_PAIR_WEAVE = (MAX_LINE_VALUE - MIN_LINE_VALUE + 1 - MIN_LINE_PAIR_LEN / 2 + 1)		//最大连队组合
var MAX_LINE_THREE_WEAVE = (MAX_LINE_VALUE - MIN_LINE_VALUE + 1 - MIN_LINE_THREE_LEN / 3 + 1)		//最大飞机组合

var THREE_TAKE_TYPE = (TAKE_NONE | TAKE_PAIR)	//三张带牌类型
var LINE_THREE_TAKE_TYPE = (TAKE_NONE)				//飞机带牌类型
var BOMB_TAKE_TYPE = (TAKE_NONE)				//炸弹带牌类型

//////////////////////////////////////////////////////////////////////////////////
//子游戏配置

//////////////////////////////////////////////////////////////////////////////////
var s_cbLogicValue = 
[ 
	13, 14, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, WANG_VALUE1, WANG_VALUE2,
]

//牌型
var tagCardType = 
[
	['BYTE', 'cbType'],
	['WORD', 'cbLogicValue'],
	['BYTE', 'cbLength'],
	['WORD', 'wTakeType'],
]


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
	['BYTE', 'cbMagicCard', MAX_MAGIC],				//财神
	['WORD', 'wOutOrder', GAME_PLAYER],				//出牌顺序
]

//用户出牌
var CMD_S_OutCard = 
[
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wOutCardUser'],						//出牌玩家
	['BYTE', 'cbOutCardCount'],						//出牌数目
	['BYTE', 'cbOutCardData', MAX_COUNT],			//扑克列表
	['tagCardType', 'outCardType'],						//出牌类型
]

//放弃出牌
var CMD_S_PassCard = 
[
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wPassCardUser'],						//放弃玩家
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
	['BYTE', 'cbOutCardData', MAX_COUNT],			//出牌数据
	['tagCardType', 'outCardType'],						//出牌类型
	
	//手牌信息
	['BYTE', 'cbHandCardCount', GAME_PLAYER],		//扑克数目
	['BYTE', 'cbHandCardDataSelf', MAX_COUNT],		//手上扑克

	['BYTE', 'cbOutBombCount', GAME_PLAYER],
	['BYTE', 'cbMagicCard', MAX_MAGIC],				//财神
	['WORD', 'wOutOrder', GAME_PLAYER],				//出牌顺序
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
]

//游戏设置
var CMD_C_Call = 
[
	['BYTE', 'cbCallScore'],						
]
//////////////////////////////////////////////////////////////////////////

//#endif