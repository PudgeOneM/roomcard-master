//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 315									//游戏 I D
var GAME_NAME = "桐乡麻将"					//游戏名字
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
var MAX_INDEX = 42									//最大索引
var MAX_COUNT = 14									//最大数目
var MAX_REPERTORY = 136									//最大库存
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
var SUB_S_YIPIANHU_RESULT = 107                                 //一片胡结果
var SUB_S_GAME_GM = 111									//换牌结果
//空闲状态
var CMD_S_StatusFree = 
[
	['SCORE', 'lCellScore'],							//基础金币
	['bool', 'bYiPianHu'],
	['bool', 'bGameSetEnd'],
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
	['BYTE', 'cbTypeFB'],                                   //翻倍类型 0不翻倍 1骰子同点 2骰子和大于等于10  3流局
	['bool', 'bOutMagicCard'],							    //是否可以出百搭牌 
	['WORD', 'wPlayerPC'],  
	['BYTE', 'cbEnableCard', 2],							//恶意吃牌后禁止出的牌
	['bool', 'bYiPianHu'],		
]

//游戏开始
var CMD_S_GameStart = 
[
	['WORD', 'wBankerUser'],								//庄家用户s
	['BYTE', 'cbUserAction'],								//用户动作
	['BYTE', 'cbCardData', GAME_PLAYER, MAX_COUNT],						//扑克列表
	['BYTE', 'cbMagicIndex'],                               //财神
	['BYTE', 'cbSice1'],                                    //骰子1
	['BYTE', 'cbSice2'],
	['BYTE', 'cbTypeFB'],                                   //翻倍类型 0不翻倍 1骰子同点 2骰子和大于等于10  3流局
	['bool', 'bOutMagicCard'],							    //是否可以出百搭牌 
]

//出牌命令
var CMD_S_OutCard = 
[
	['WORD', 'wOutCardUser'],						//出牌用户
	['BYTE', 'cbOutCardData'],						//出牌扑克
	['WORD', 'wPlayerPC'], 
]

//发送扑克
var CMD_S_SendCard = 
[
	['BYTE', 'cbCardData'],							//扑克数据
	['BYTE', 'cbActionMask'],						//动作掩码
	['WORD', 'wCurrentUser'],						//当前用户
	['bool', 'bOutMagicCard'],                      //是否可以出百搭牌 
	['WORD', 'wPlayerPC'],                          
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
	['bool', 'bOutMagicCard'],                      //是否可以出百搭牌 
	['BYTE', 'cbEnableCard', 2],                    //恶意吃牌后禁止出的牌
]

//游戏结束
var CMD_S_GameEnd = 
[
	//结束信息
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCard'],						//供应扑克
	['DWORD', 'dwChiHuRight'],						//胡牌类型
	['WORD', 'wChihuUser'],						

	//积分信息
	['SCORE', 'lGameScore', GAME_PLAYER],			//游戏积分

	//扑克信息
	['BYTE', 'cbCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbCardData', GAME_PLAYER, MAX_COUNT],	//扑克数据
	['BYTE', 'cbGangKaiNum'],						//杠开数量
	['BYTE', 'cbPiaoCaiNum'],						//飘财数量
	['BYTE', 'cbMingGangCount', GAME_PLAYER],
	['BYTE', 'cbAnGangCount', GAME_PLAYER],
	['SCORE', 'lJiFen', GAME_PLAYER],
	['SCORE', 'lGangScore', GAME_PLAYER],
]
//换牌
var CMD_S_GAME_GM = 
[
	['BYTE', 'cbCardData', MAX_COUNT],				//扑克列表
	['BYTE', 'cbUserAction'],						//用户动作
]
//一片胡
var CMD_S_YIPIANHU_RESULT = 
[
	['bool', 'bYiPianHu'],
]
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3									//操作扑克
var SUB_C_GAME_GM = 6                                   //GM换牌
var SUB_C_YIPIANHU_RESULT = 7                                   //一片胡结果
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
//一片胡结果
var CMD_C_YIPIANHU_RESUTL = 
[
	['bool', 'bYiPianHu'],
]
//////////////////////////////////////////////////////////////////////////
//#pragma pack()
//#endif