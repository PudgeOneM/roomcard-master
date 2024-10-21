//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 313									//游戏 I D
var GAME_NAME = "昆山麻将"					//游戏名字
var MAX_TIMES = 5									//最大赔率

//组件属性
var GAME_PLAYER = 4									//游戏人数
var VERSION_SERVER = PROCESS_VERSION(6,0,3)				//程序版本
var VERSION_CLIENT = PROCESS_VERSION(6,0,3)				//程序版本

//////////////////////////////////////////////////////////////////////////////////
//状态定义

var GAME_SCENE_FREE = GAME_STATUS_FREE					//等待开始
var GAME_SCENE_PLAY = (GAME_STATUS_PLAY+1)				//游戏进行
//////////////////////////////////////////////////////////////////////////////////

//常量定义
var MAX_WEAVE = 4									//最大组合
var MAX_INDEX = 48									//最大索引
var MAX_COUNT = 14									//最大数目
var MAX_REPERTORY = 156									//最大库存
var MAX_HUA_CARD = 8									//花牌个数

//扑克定义
var HEAP_FULL_COUNT = 34									//堆立全牌

var MAX_RIGHT_COUNT = 1									//最大权位DWORD个数			

//////////////////////////////////////////////////////////////////////////

//组合子项
var CMD_WeaveItem = 
[
	['BYTE', 'cbWeaveKind'],						//组合类型
	['BYTE', 'cbCenterCard'],						//中心扑克
	['BYTE', 'cbPublicCard'],						//公开标志
	['BYTE', 'wProvideUser'],						//供应用户
	['BYTE', 'cbCardData', 4],						//组合数据
]

//////////////////////////////////////////////////////////////////////////
//服务器命令结构

var SUB_S_GAME_START = 100									//游戏开始
var SUB_S_OUT_CARD = 101									//出牌命令
var SUB_S_SEND_CARD = 102									//发送扑克
var SUB_S_OPERATE_NOTIFY = 104									//操作提示
var SUB_S_OPERATE_RESULT = 105									//操作命令
var SUB_S_GAME_END = 106									//游戏结束
var SUB_S_REPLACE_CARD = 108									//用户补牌
var SUB_S_PAOSHANG_RESULT = 109                                 //跑上不跑上结果
var SUB_S_GAME_GM = 111									//换牌结果S
//空闲状态
var CMD_S_StatusFree = 
[
	['SCORE', 'lCellScore'],							//基础金币
	['bool', 'bGameSetEnd'],
	['bool', 'bPaoShang'],
]

//游戏状态
var CMD_S_StatusPlay = 
[
	//游戏变量
	['SCORE', 'lCellScore'],									//单元积分
	['WORD', 'wBankerUser'],								//庄家用户
	['WORD', 'wCurrentUser'],								//当前用户

	//状态变量
	['BYTE', 'cbActionCard'],								//动作扑克
	['BYTE', 'cbActionMask'],								//动作掩码
	['BYTE', 'cbLeftCardCount'],							//剩余数目

	//出牌信息
	['WORD', 'wOutCardUser'],								//出牌用户
	['BYTE', 'cbOutCardData'],								//出牌扑克
	['BYTE', 'cbDiscardCount', GAME_PLAYER],				//丢弃数目
	['BYTE', 'cbDiscardCard', GAME_PLAYER, 60],				//丢弃记录

	//扑克数据
	['BYTE', 'cbCardCount'],								//扑克数目
	['BYTE', 'cbCardData', MAX_COUNT],						//扑克列表
	['BYTE', 'cbSendCardData'],								//发送扑克

	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['CMD_WeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克
	['BYTE', 'cbMagicIndex'],                               //财神
	['BYTE', 'cbHuaCount', GAME_PLAYER],                    //花数
	['bool', 'bPaoShang'],
	['BYTE', 'cbHuaCardData', GAME_PLAYER, 40],				//花牌记录
	['bool', 'bBaoZi'],
]

//游戏开始
var CMD_S_GameStart = 
[
	['WORD', 'wBankerUser'],								//庄家用户s
	['BYTE', 'cbUserAction'],								//用户动作
	['BYTE', 'cbCardData', MAX_COUNT],						//扑克列表
	['BYTE', 'cbMagicIndex'],                               //财神
	['BYTE', 'cbSice1'],                                    //骰子1
	['BYTE', 'cbSice2'],
	['bool', 'bMustBuHua'],                                 //是否补花
]

//出牌命令
var CMD_S_OutCard = 
[
	['WORD', 'wOutCardUser'],						//出牌用户
	['BYTE', 'cbOutCardData'],						//出牌扑克
]

//发送扑克
var CMD_S_SendCard = 
[
	['BYTE', 'cbCardData'],							//扑克数据
	['BYTE', 'cbActionMask'],						//动作掩码
	['WORD', 'wCurrentUser'],						//当前用户
]

//操作提示
var CMD_S_OperateNotify = 
[
	['WORD', 'wResumeUser'],						//还原用户
	['BYTE', 'cbActionMask'],						//动作掩码
	['BYTE', 'cbActionCard'],						//动作扑克
	['WORD', 'wOperateUser'],                       //操作用户
]

//操作命令
var CMD_S_OperateResult = 
[
	['WORD', 'wOperateUser'],						//操作用户
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbOperateCode'],						//操作代码
	['BYTE', 'cbOperateCard', 3],					//操作扑克
	['BYTE', 'cbActionMask'],						//动作掩码
]

//游戏结束
var CMD_S_GameEnd = 
[
	//结束信息
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCard'],						//供应扑克
	['DWORD', 'dwChiHuRight', GAME_PLAYER],			//胡牌类型
	['BYTE', 'cbFanCount', GAME_PLAYER],			//总番数
	['BYTE', 'cbHuaCount', GAME_PLAYER],            //花数

	//积分信息
	['SCORE', 'lGameScore', GAME_PLAYER],			//游戏积分

	//扑克信息
	['BYTE', 'cbCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbCardData', GAME_PLAYER, MAX_COUNT],	//扑克数据
	['bool', 'bWuHuaGuo', GAME_PLAYER],             //无花果
	['BYTE', 'cbDaSiXi', GAME_PLAYER],              //大四喜数量
	['WORD', 'wChengBaoID'],                        //被抢杠的人承包
]
//补牌命令
var CMD_S_ReplaceCard = 
[
	['WORD', 'wReplaceUser'],						//补牌用户
	['BYTE', 'cbHuaCard', MAX_COUNT],				//花牌扑克
	['BYTE', 'cbReplaceCard', MAX_COUNT],		    //补牌扑克
	['bool', 'bBuHuaUser'],                         //是否有补花用户 没有游戏继续
	['BYTE', 'cbUserAction'],						//用户动作
]
//发送扑克
var CMD_S_PAOSHANG_RESULT = 
[
	['bool', 'bPaoShang'],
]
//换牌
var CMD_S_GAME_GM = 
[
	['BYTE', 'cbCardData', MAX_COUNT],				//扑克列表
	['BYTE', 'cbUserAction'],						//用户动作
]
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3									//操作扑克
var SUB_C_REPLACE_CARD = 5									//用户补牌s
var SUB_C_GAME_GM = 6                                   //GM换牌
var SUB_C_PAOSHANG_RESULT = 7                                   //跑上结果
//出牌命令
var CMD_C_OutCard = 
[
	['BYTE', 'cbCardData'],							//扑克数据
]

//操作命令
var CMD_C_OperateCard = 
[
	['BYTE', 'cbOperateCode'],						//操作代码
	['BYTE', 'cbOperateCard', 3],					//操作扑克
]
//GM换牌
var CMD_C_GAME_GM = 
[
	['BYTE', 'cbCardData', MAX_COUNT],				//扑克数据
]
//跑上结果
var CMD_C_PAOSHANG_RESUTL = 
[
	['bool', 'bPaoShang'],
]
//////////////////////////////////////////////////////////////////////////
//#pragma pack()
//#endif