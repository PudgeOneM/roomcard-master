//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE

//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 51									//游戏 I D
var GAME_NAME = "湖南跑得快"					//游戏名字

//组件属性
var GAME_PLAYER = 3									//游戏人数
var VERSION_SERVER = PROCESS_VERSION(6,0,3)				//程序版本
var VERSION_CLIENT = PROCESS_VERSION(6,0,3)				//程序版本

//////////////////////////////////////////////////////////////////////////////////
//状态定义

var GAME_SCENE_FREE = GAME_STATUS_FREE					//等待开始
var GAME_SCENE_PLAY = GAME_STATUS_PLAY					//游戏进行

//////////////////////////////////////////////////////////////////////////
//服务器命令结构

var SUB_S_GAME_START = 101									//游戏开始
var SUB_S_OUT_CARD = 102									//用户出牌
var SUB_S_PASS_CARD = 103									//放弃出牌
var SUB_S_GAME_END = 104									//游戏结束

//游戏状态
var CMD_S_StatusFree = 
[
	['DWORD', 'dwTableOwner', 3],						
	['LONGLONG', 'lBaseScore'],							//基础积分
]

//游戏状态
var CMD_S_StatusPlay = 
[
	['DWORD', 'dwTableOwner', 3],						
	['BYTE', 'bIsNewRound'],						//是否首轮
	['LONGLONG', 'lBaseScore'],							//基础积分
	['WORD', 'wBankerUser'],						//庄家用户
	['WORD', 'wLastOutUser'],						//出牌的人
	['WORD', 'wCurrentUser'],						//当前玩家
	['BYTE', 'bCardData', 16],						//手上扑克
	['BYTE', 'bCardCount', 3],						//扑克数目
	['BYTE', 'bBombCount', 3],						//炸弹数目
	['BYTE', 'bTurnCardCount'],						//基础出牌
	['BYTE', 'bTurnCardData', 16],					//出牌列表
	['LONGLONG', 'lAllTurnScore', 3],					//总局得分
	['LONGLONG', 'lLastTurnScore', 3],					//上局得分
]

//发送扑克
var CMD_S_GameStart = 
[
	['BYTE', 'bIsNewRound'],						//是否首轮
	['WORD', 'wBankerUser'],						//庄家用户
	['WORD', 'wCurrentUser'],						//当前玩家
	['BYTE', 'cbCardData', 16],						//扑克列表
]

//用户出牌
var CMD_S_OutCard = 
[
	['BYTE', 'bCardCount'],							//扑克数目
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wOutCardUser'],						//出牌玩家
	['BYTE', 'bCardData', 16],						//扑克列表
]

//放弃出牌
var CMD_S_PassCard = 
[
	['BYTE', 'bNewTurn'],							//一轮开始
	['WORD', 'wPassUser'],							//放弃玩家
	['WORD', 'wCurrentUser'],						//当前玩家
]

//游戏结束
var CMD_S_GameEnd = 
[
	['BYTE', 'bFinishedRound'],				
	['WORD', 'wUser'],		
	['BYTE', 'bBombCount', 3],						//炸弹数目		
	['LONGLONG', 'lGameTax'],							//游戏税收
	['LONGLONG', 'lGameScore', 3],						//游戏积分
	['BYTE', 'bCardCount', 3],						//扑克数目
	['BYTE', 'bCardData', 48],						//扑克列表 
]

//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CART = 2									//用户出牌
var SUB_C_PASS_CARD = 3									//放弃出牌

//出牌数据包
var CMD_C_OutCard = 
[
	['BYTE', 'bCardCount'],							//出牌数目
	['BYTE', 'bCardData', 16],						//扑克列表
]

//////////////////////////////////////////////////////////////////////////

//#endif