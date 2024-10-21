//#ifndef CMD_OX_HEAD_FILE
//#define CMD_OX_HEAD_FILE

//////////////////////////////////////////////////////////////////////////
//公共宏定义

var KIND_ID = 27									//游戏 I D
var GAME_PLAYER = 8									//游戏人数
var GAME_NAME = "牛牛"						//游戏名字
var MAX_COUNT = 5									//最大数目
var MAX_JETTON_AREA = 4									//下注区域
var MAX_TIMES = 5									//最大赔率

var VERSION_SERVER = PROCESS_VERSION(6,0,3)				//程序版本
var VERSION_CLIENT = PROCESS_VERSION(6,0,3)				//程序版本

//结束原因
var GER_NO_PLAYER = 0x10								//没有玩家

//游戏状态
var GS_TK_FREE = GAME_STATUS_FREE					//等待开始
var GS_TK_CALL = GAME_STATUS_PLAY					//叫庄状态
var GS_TK_SCORE = GAME_STATUS_PLAY+1					//下注状态
var GS_TK_PLAYING = GAME_STATUS_PLAY+2					//游戏进行


var SERVER_LEN = 32 

var START_MODE = START_MODE_ALL_READY 

//////////////////////////////////////////////////////////////////////////
//服务器命令结构

var SUB_S_GAME_START = 100									//游戏开始
var SUB_S_ADD_SCORE = 101									//加注结果
var SUB_S_PLAYER_EXIT = 102									//用户强退
var SUB_S_SEND_CARD = 103									//发牌消息
var SUB_S_GAME_END = 104									//游戏结束
var SUB_S_OPEN_CARD = 105									//用户摊牌
var SUB_S_CALL_BANKER = 106									//用户叫庄
var SUB_S_ALL_CARD = 107									//发牌消息
var SUB_S_AMDIN_COMMAND = 108									//系统控制
var SUB_S_BANKER_OPERATE = 109									//存取款
var SUB_S_STATIC_BANKER_UP = 110									//申请常庄
var SUB_S_CONFIRM_STATIC_BANKER = 111									//确认常庄
var SUB_S_STATIC_BANKER_DOWN = 112									//常庄退庄

//#ifndef _UNICODE
// var myprintf = _snprintf
// var mystrcpy = strcpy
// var mystrlen = strlen
// var myscanf = _snscanf
// var myLPSTR = LPCSTR
// var myatoi = atoi
// var myatoi64 = _atoi64
// //#else
// var myprintf = swprintf
// var mystrcpy = wcscpy
// var mystrlen = wcslen
// var myscanf = _snwscanf
// var myLPSTR = LPWSTR
// var myatoi = _wtoi
// var myatoi64 = _wtoi64
//#endif


//#pragma pack(push)  
//#pragma pack(1)

//游戏状态
var CMD_S_StatusFree = 
[
	['LONGLONG', 'lCellScore'],							//基础积分

	//历史积分
	['LONGLONG', 'lTurnScore', GAME_PLAYER],			//积分信息
	['LONGLONG', 'lCollectScore', GAME_PLAYER],			//积分信息
	['TCHAR', 'szGameRoomName', SERVER_LEN],			//房间名称
]

//游戏状态
var CMD_S_StatusCall = 
[
	['WORD', 'wCallBanker'],						//叫庄用户
	['BYTE', 'cbDynamicJoin'],                      //动态加入 
	['BYTE', 'cbPlayStatus', GAME_PLAYER],          //用户状态

	//历史积分
	['LONGLONG', 'lTurnScore', GAME_PLAYER],			//积分信息
	['LONGLONG', 'lCollectScore', GAME_PLAYER],			//积分信息
	['TCHAR', 'szGameRoomName', SERVER_LEN],			//房间名称
	['DWORD', 'dwTimeCountDown'],					//倒计时间
]

//游戏状态
var CMD_S_StatusScore = 
[
	//下注信息
	['BYTE', 'cbPlayStatus', GAME_PLAYER],          //用户状态
	['BYTE', 'cbDynamicJoin'],                      //动态加入
	['LONGLONG', 'lTurnMaxScore'],						//最大下注
	['LONGLONG', 'lTableScore', GAME_PLAYER],			//下注数目
	['WORD', 'wBankerUser'],						//庄家用户
	['TCHAR', 'szGameRoomName', SERVER_LEN],			//房间名称

	//历史积分
	['LONGLONG', 'lTurnScore', GAME_PLAYER],			//积分信息
	['LONGLONG', 'lCollectScore', GAME_PLAYER],			//积分信息
	['DWORD', 'dwTimeCountDown'],					//倒计时间
]

//游戏状态
var CMD_S_StatusPlay = 
[
	//状态信息
	['BYTE', 'cbPlayStatus', GAME_PLAYER],          //用户状态
	['BYTE', 'cbDynamicJoin'],                      //动态加入
	['LONGLONG', 'lTurnMaxScore'],						//最大下注
	['LONGLONG', 'lTableScore', GAME_PLAYER],			//下注数目
	['WORD', 'wBankerUser'],						//庄家用户

	//扑克信息
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],//桌面扑克
	['BYTE', 'bOxCard', GAME_PLAYER],				//牛牛数据
	['BYTE', 'cbCardType', GAME_PLAYER],			//是否特殊牌型

	//历史积分
	['LONGLONG', 'lTurnScore', GAME_PLAYER],			//积分信息
	['LONGLONG', 'lCollectScore', GAME_PLAYER],			//积分信息
	['TCHAR', 'szGameRoomName', SERVER_LEN],			//房间名称
	['DWORD', 'dwTimeCountDown'],					//倒计时间
]

//用户叫庄
var CMD_S_CallBanker = 
[
	['WORD', 'wCallBanker'],						//叫庄用户
	['bool', 'bFirstTimes'],						//首次叫庄
]

//游戏开始
var CMD_S_GameStart = 
[
	//下注信息
	['LONGLONG', 'lTurnMaxScore'],						//最大下注
	['WORD', 'wBankerUser'],						//庄家用户
]

//用户下注
var CMD_S_AddScore = 
[
	['WORD', 'wAddScoreUser'],						//加注用户
	['LONGLONG', 'lAddScoreCount'],						//加注数目
]

//游戏结束
var CMD_S_GameEnd = 
[
	['LONGLONG', 'lGameTax', GAME_PLAYER],				//游戏税收
	['LONGLONG', 'lGameScore', GAME_PLAYER],			//游戏得分
	['BYTE', 'cbCardData', GAME_PLAYER, MAX_COUNT],			//用户扑克
]

//发牌数据包
var CMD_S_SendCard = 
[
	['BYTE', 'cbCardData', GAME_PLAYER, MAX_COUNT],	//用户扑克
	['BYTE', 'cbCardType', GAME_PLAYER],			//是否特殊牌型
]

//发牌数据包
var CMD_S_AllCard = 
[
	['bool', 'bAICount', GAME_PLAYER],
	['BYTE', 'cbCardData', GAME_PLAYER, MAX_COUNT],	//用户扑克
]

//用户退出
var CMD_S_PlayerExit = 
[
	['WORD', 'wPlayerID'],							//退出用户
]

//用户摊牌
var CMD_S_Open_Card = 
[
	['WORD', 'wPlayerID'],							//摊牌用户
	['BYTE', 'bOpen'],								//摊牌标志
]

//申请常庄
var CMD_S_Static_Banker_Up = 
[
	['DWORD', 'dwApplicantID'],						//申请者ID
]

//确认常庄
var CMD_S_Confirm_Static_Banker = 
[
	['DWORD', 'dwStaticBanker'],						//常庄ID
]

//常庄退庄
var CMD_S_Static_Banker_Down = 
[
	['DWORD', 'dwPlayerID'],							//退庄用户ID
]

//////////////////////////////////////////////////////////////////////////
//客户端命令结构
var SUB_C_CALL_BANKER = 1									//用户叫庄
var SUB_C_ADD_SCORE = 2									//用户加注
var SUB_C_OPEN_CARD = 3									//用户摊牌
var SUB_C_SPECIAL_CLIENT_REPORT = 4                                   //特殊终端
var SUB_C_AMDIN_COMMAND = 5									//系统控制
var SUB_C_STATIC_BANKER_UP = 6									//申请常庄
var SUB_C_CONFIRM_STATIC_BANKER = 7									//常庄确认
var SUB_C_STATIC_BANKER_DOWN = 8									//常庄退庄

//用户叫庄
var CMD_C_CallBanker = 
[
	['BYTE', 'bBanker'],							//做庄标志
]

//终端类型
var CMD_C_SPECIAL_CLIENT_REPORT = 
[
	['WORD', 'wUserChairID'],                       //用户方位
]

//用户加注
var CMD_C_AddScore = 
[
	['LONGLONG', 'lScore'],								//加注数目
]

//用户摊牌
var CMD_C_OxCard = 
[
	['BYTE', 'bOX'],								//牛牛标志
]

//常庄确认
var CMD_C_Confirm_Static_Banker = 
[
	['DWORD', 'dwStaticBanker'],						//常庄ID
	['BYTE', 'bConfirm'],							//常庄同意标志
]

//常庄退庄
var CMD_C_Static_Banker_Down = 
[
	['DWORD', 'dwPlayerID'],							//退庄用户ID
]

//////////////////////////////////////////////////////////////////////////
var RQ_SET_WIN_AREA = 1
var RQ_RESET_CONTROL = 2
var RQ_PRINT_SYN = 3

var CMD_C_AdminReq = 
[
	['BYTE', 'cbReqType'],
	['BYTE', 'cbExtendData', 20],			//附加数据
]

//请求回复
var ACK_SET_WIN_AREA = 1
var ACK_PRINT_SYN = 2
var ACK_RESET_CONTROL = 3

var CR_ACCEPT = 2			//接受
var CR_REFUSAL = 3			//拒绝

var CMD_S_CommandResult = 
[
	['BYTE', 'cbAckType'],					//回复类型
	['BYTE', 'cbResult'],
	['BYTE', 'cbExtendData', 20],			//附加数据
]

var IDM_ADMIN_COMMDN = WM_USER+1000

//控制区域信息
var tagControlInfo = 
[
	['INT', 'nAreaWin'],		//控制区域
]

//服务器控制返回
var S_CR_FAILURE = 0		//失败
var S_CR_UPDATE_SUCCES = 1		//更新成功
var S_CR_SET_SUCCESS = 2		//设置成功
var S_CR_CANCEL_SUCCESS = 3		//取消成功
var CMD_S_ControlReturns = 
[
	['BYTE', 'cbReturnsType'],				//回复类型
	['BYTE', 'cbControlArea'],	//控制区域
	['BYTE', 'cbControlTimes'],			//控制次数
]


//客户端控制申请
var C_CA_UPDATE = 1		//更新
var C_CA_SET = 2		//设置
var C_CA_CANCELS = 3		//取消
var CMD_C_ControlApplication = 
[
	['BYTE', 'cbControlAppType'],			//申请类型
	['BYTE', 'cbControlArea'],	//控制区域
	['BYTE', 'cbControlTimes'],			//控制次数
]


//#pragma pack(pop)

//#endif
