//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 335									//游戏 I D
var GAME_NAME = "常德安乡偎麻雀"					//游戏名字
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
var MAX_WEAVE = 6									//最大组合
var MAX_INDEX = 20									//最大索引
var MAX_COUNT = 20									//最大数目
var MAX_REPERTORY = 80									//最大库存

var MAX_CHR_COUNT = 42									//最大胡法
var CHR_YINHU = 0
var CHR_DUOHONG = 1
var CHR_DUIZI = 2
var CHR_WUDUI = 3
var CHR_WUHU = 4
var CHR_DIANHU = 5
var CHR_MANYUANHUA = 6
var CHR_DAXIAOZIHU = 7
var CHR_CHUNYIN = 8
var CHR_ZHUOHU = 9
var CHR_JIEMEIZHUO = 10
var CHR_SANLUANZHUO = 11
var CHR_JIEMEIZHUODAITUO = 12
var CHR_ZUSUNZHUO = 13
var CHR_SILUANZHUO = 14
var CHR_ZUSUNZHUODAITUO = 15
var CHR_HAIDIHU = 16
var CHR_DANDIAO = 17
var CHR_BAPENGTOU = 18
var CHR_JIABAPENGTOU = 19
var CHR_BEIKAOBEI = 20
var CHR_SHOUQIANSHOU = 21
var CHR_LONGBAIWEI = 22
var CHR_ZHEYIZHE = 23
var CHR_MOHU = 24
var CHR_JIUXIAODUI = 25
var CHR_TIANHU = 26
var CHR_WUDUIHU = 27
var CHR_KAWEI = 28
var CHR_QUANHEI = 29
var CHR_WUXI = 30
var CHR_LIUDUIHONG = 31
var CHR_SIBIANDUI = 32
var CHR_QUANQIUREN = 33
var CHR_XIANGDUI = 34
var CHR_PIAODUI = 35
var CHR_JIDING = 36
var CHR_SHANGXIAWUQIANNIAN = 37
var CHR_BIANKAN = 38
var CHR_ZHENBEIKAOBEI = 39
var CHR_FENGBAIWEI = 40
var CHR_KAHU = 41
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
var SUB_S_OPERATE_NOTIFY = 104									//操作提示
var SUB_S_OPERATE_RESULT = 105									//操作命令
var SUB_S_GAME_END = 106									//游戏结束
var SUB_S_GAMESET_RESULT = 107                                 //封顶设置结果
var SUB_S_GAME_GM = 111									//换牌结果
//空闲状态
var CMD_S_StatusFree = 
[
	['SCORE', 'lCellScore'],							//基础金币
	['bool', 'bGameSetEnd'],
	['BYTE', 'cbMingTang'],							//0小卓  1大卓  2全名堂
	['bool', 'bDouLiuZi'],
	['BYTE', 'cbZXScore'],							//  0(20/10/10) 1(30/20/20) 2(40/30/30)
	['BYTE', 'cbDeng'],								//0(80) 1(100) 2(200)
	['SCORE', 'lLiuZi'],	
	['DWORD', 'dwUserID', GAME_PLAYER],
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
	['BYTE', 'cbEnableIndex', 20],
	['BYTE', 'cbMingTang'],							//0小卓  1大卓  2全名堂
	['bool', 'bDouLiuZi'],
	['BYTE', 'cbZXScore'],							//  0(20/10/10) 1(30/20/20) 2(40/30/30)
	['BYTE', 'cbDeng'],								//0(80) 1(100) 2(200)
	['SCORE', 'lLiuZi'],
	['bool', 'bWei'],
	['DWORD', 'dwUserID', GAME_PLAYER],
	['bool', 'bXiaoXiangGong', GAME_PLAYER],
]

//游戏开始
var CMD_S_GameStart = 
[
	['WORD', 'wBankerUser'],								//庄家用户
	['BYTE', 'cbUserAction'],								//用户动作
	['BYTE', 'cbCardData', MAX_COUNT],						//扑克列表
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
	['bool', 'bWei'],
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
	['BYTE', 'cbEnableIndex', 20],
	['bool', 'bXiaoXiangGong'],
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
	['SCORE', 'lFenLiuZi'],
	['BYTE', 'cbDiPai', 22],
	['BYTE', 'cbChiHuType', MAX_CHR_COUNT],
	['WORD', 'cbChiHuScore', MAX_CHR_COUNT],
	['SCORE', 'lLiuZi'],
]
//换牌
var CMD_S_GAME_GM = 
[
	['BYTE', 'cbCardData', MAX_COUNT],				//扑克列表
	['BYTE', 'cbUserAction'],						//用户动作
]
//
var CMD_S_GAMESET_RESULT = 
[
	['BYTE', 'cbMingTang'],							//0小卓  1大卓  2全名堂
	['bool', 'bDouLiuZi'],
	['BYTE', 'cbZXScore'],							//  0(20/10/10) 1(30/20/20) 2(40/30/30)
	['BYTE', 'cbDeng'],								//0(80) 1(100) 2(200)
]
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3									//操作扑克
var SUB_C_GAME_GM = 6                                   //GM换牌
var SUB_C_GAMESET_RESULT = 7                                   //封顶设置结果
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
	['BYTE', 'cbSendData'],
]
//封顶设置结果
var CMD_C_GAMESET_RESUTL = 
[
	['BYTE', 'cbMingTang'],							//0小卓  1大卓  2全名堂
	['bool', 'bDouLiuZi'],
	['BYTE', 'cbZXScore'],							//  0(20/10/10) 1(30/20/20) 2(40/30/30)
	['BYTE', 'cbDeng'],								//0(80) 1(100) 2(200)
]
//////////////////////////////////////////////////////////////////////////
//#pragma pack()
//#endif