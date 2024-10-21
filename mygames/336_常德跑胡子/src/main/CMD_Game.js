//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 336									//游戏 I D
var GAME_NAME = "常德跑胡子"					//游戏名字
var MAX_TIMES = 5									//最大赔率

//组件属性
var GAME_PLAYER = 3									//游戏人数
var VERSION_SERVER = PROCESS_VERSION(6,0,3)				//程序版本
var VERSION_CLIENT = PROCESS_VERSION(6,0,3)				//程序版本

//////////////////////////////////////////////////////////////////////////////////
//状态定义

var GAME_SCENE_FREE = GAME_STATUS_FREE					//等待开始
var GAME_SCENE_PLAY = (GAME_STATUS_PLAY+1)				//游戏进行
//////////////////////////////////////////////////////////////////////////////////

//常量定义
var MAX_WEAVE = 7									//最大组合
var MAX_INDEX = 20									//最大索引
var MAX_COUNT = 21									//最大数目
var MAX_REPERTORY = 80									//最大库存

var MAX_CHR_COUNT = 16									//最大胡法
var CHR_DIANHU = 0									//点胡
var CHR_DUOHONG = 1									//红胡
var CHR_WUHU = 2									//乌胡
var CHR_DUIZI = 3									//对子胡
var CHR_DAZI = 4									//大字胡
var CHR_XIAOZI = 5									//小字胡
var CHR_HAIDIHU = 6									//海底胡
var CHR_TINGHU = 7									//停胡
var CHR_SHUAHOUHU = 8									//耍猴胡
var CHR_XIANGXIANGHU = 9									//项项胡
var CHR_DATUANYUAN = 10									//大团圆
var CHR_HUANGFAN = 11									//黄番
var CHR_TIANHU = 12									//天胡
var CHR_DIHU = 13									//地胡
var CHR_ZIMO = 14									//自摸
var CHR_SANTIWUKAN = 15									//三提五坎
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
//分析子项
var tagAnalyseItem = 
[
	['bool', 'bWeaveInsert', MAX_WEAVE],
	['BYTE', 'cbCardEye'],							//牌眼扑克
	['bool', 'bMagicEye'],                          //牌眼是否是王霸
	['BYTE', 'cbWeaveKind', MAX_WEAVE],				//组合类型
	['BYTE', 'cbCenterCard', MAX_WEAVE],			//中心扑克
	['BYTE', 'cbCardData', MAX_WEAVE, 4],           //实际扑克
]
//////////////////////////////////////////////////////////////////////////
//服务器命令结构

var SUB_S_GAME_START = 100									//游戏开始
var SUB_S_OUT_CARD = 101									//出牌命令
var SUB_S_SEND_CARD = 102									//发送扑克
var SUB_S_OPERATE_TPW = 103                                 //提 偎结果
var SUB_S_OPERATE_NOTIFY = 104									//操作提示
var SUB_S_OPERATE_RESULT = 105									//操作命令
var SUB_S_GAME_END = 106									//游戏结束
var SUB_S_GAMEOPTION_RESULT = 107                                 //设置结果
var SUB_S_OPERATE_PAO = 108                                 //跑  结果
var SUB_CONTINUE_GAME = 109                                 //继续游戏
var SUB_S_GAME_GM = 111									//换牌结果
//继续游戏
var CMD_S_CONTINUE_GAME = 
[
	['WORD', 'wChaird'],
]
//空闲状态
var CMD_S_StatusFree = 
[
	['SCORE', 'lCellScore'],							//基础金币
	['bool', 'bGameSetEnd'],
	['bool', 'bGameOption'],
	['DWORD', 'dwUserID', GAME_PLAYER],
	['BYTE', 'cbHuangZhuang'],
]

//游戏状态
var CMD_S_StatusPlay = 
[
	//游戏变量
	['WORD', 'wBankerUser'],								//庄家用户
	['WORD', 'wCurrentUser'],								//当前用户

	//状态变量
	['BYTE', 'cbActionMask'],								//动作掩码
	['BYTE', 'cbActionCard'],								//动作扑克
	['BYTE', 'cbLeftCardCount'],							//剩余数目

	//出牌信息
	['WORD', 'wOutCardUser'],								//出牌用户
	['BYTE', 'cbOutCardData'],								//出牌扑克
	['BYTE', 'cbDiscardCount', GAME_PLAYER],				//丢弃数目
	['BYTE', 'cbDiscardCard', GAME_PLAYER, 20],				//丢弃记录
	['BYTE', 'cbJiePaiData', GAME_PLAYER, 20],
	//扑克数据
	['BYTE', 'cbCardCount'],								//扑克数目
	['BYTE', 'cbCardData', MAX_COUNT],						//扑克列表
	['BYTE', 'cbSendCardData'],								//发送扑克
	['WORD', 'wSendChaird'],

	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['CMD_WeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克
	['DWORD', 'dwUserID', GAME_PLAYER],
	['bool', 'bGameOption'],
	['bool', 'bXiaoXiangGong', GAME_PLAYER],
	['BYTE', 'cbHuangZhuang'],
	['bool', 'bSanTiWuKan'],					
]

//游戏开始
var CMD_S_GameStart = 
[
	['WORD', 'wBankerUser'],								//庄家用户
	['WORD', 'wCurrentUser'],
	['BYTE', 'cbUserAction'],								//用户动作
	['BYTE', 'cbUserActionBk'],								//庄家动作
	['BYTE', 'cbCardData', MAX_COUNT],						//扑克列表
	['BYTE', 'cbSendCard'],
	['BYTE', 'cbCardTi', MAX_WEAVE],
	['BYTE', 'cbHuangZhuang'],
	['bool', 'bSanTiWuKan'],
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
	['WORD', 'wCurrentUser'],						//当前用户
	['BYTE', 'cbUserAction'],						//用户动作
	['BYTE', 'cbCardTi', MAX_WEAVE],
	['bool', 'bNextJiePai'],
	['bool', 'bChouWei'],
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
	['BYTE', 'cbOperateCode'],						//操作代码
	['BYTE', 'cbOperateCard', 3],					//操作扑克
	['BYTE', 'cbOperateCard1', 3],					//操作扑克
	['BYTE', 'cbOperateCard2', 3],					//操作扑克
	['bool', 'bXiaoXiangGong'],
	['BYTE', 'cbCardTi', MAX_WEAVE],
	['BYTE', 'cbEnableOut'],
]
//提  偎
var CMD_S_OperateTPW = 
[
	['WORD', 'wOperateUser'],
	['BYTE', 'cbOperateCode'],
	['BYTE', 'cbCardTi', MAX_WEAVE],
	['bool', 'bInsert'],
]

//跑
var CMD_S_OperatePao = 
[
	['WORD', 'wOperateUser'],
	['BYTE', 'cbActionMask'],
	['BYTE', 'cbWeaveIndex'],
	['BYTE', 'cbCardTi', MAX_WEAVE],
	['bool', 'bXiaoXiangGong'],
	['bool', 'bZhenPao'],
]

//游戏结束
var CMD_S_GameEnd = 
[
	//结束信息
	['BYTE', 'cbProvideCard'],						//供应扑克
	['tagAnalyseItem', 'sctAnalyseItem'],						//胡牌人的牌型

	//积分信息
	['SCORE', 'lGameScore', GAME_PLAYER],			//游戏积分

	//扑克信息
	['BYTE', 'cbCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbCardData', GAME_PLAYER, MAX_COUNT],	//扑克数据
	['BYTE', 'cbYingxi', GAME_PLAYER],
	['WORD', 'wZongXi'],
	['BYTE', 'cbDiPai', 22],
	['BYTE', 'cbChiHuType', MAX_CHR_COUNT],
	['WORD', 'cbChiHuScore', MAX_CHR_COUNT],
	['bool', 'bLiuJu'],
	['WORD', 'wQiangTuiUser'],
]
//换牌
var CMD_S_GAME_GM = 
[
	['BYTE', 'cbCardData', MAX_COUNT],				//扑克列表
	['BYTE', 'cbUserAction'],						//用户动作
	['bool', 'bSanTiWuKan'],
]
//
var CMD_S_GAMEOPTION_RESULT = 
[
	['bool', 'bGameOption'],						//false 全名堂1  true全名堂2
]
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3									//操作扑克
var SUB_C_GAME_GM = 6                                   //GM换牌
var SUB_C_GAMEOPTION_RESULT = 7                                   //设置结果
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
	['BYTE', 'cbOperateCard1', 3],					//操作扑克
	['BYTE', 'cbOperateCard2', 3],					//操作扑克
]
//GM换牌
var CMD_C_GAME_GM = 
[
	['BYTE', 'cbCardData0', MAX_COUNT-1],			//扑克数据
	['BYTE', 'cbCardData1', MAX_COUNT-1],			//扑克数据
	['BYTE', 'cbCardData2', MAX_COUNT-1],			//扑克数据
	['BYTE', 'cbSendData'],
]
//封顶设置结果
var CMD_C_GAMEOPTION_RESUTL = 
[
	['bool', 'bGameOption'],						
]
//////////////////////////////////////////////////////////////////////////
//#pragma pack()
//#endif