//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 114								//游戏 I D
var GAME_NAME = "新昌麻将"					//游戏名字

//组件属性
var GAME_PLAYER = 4									//游戏人数
var VERSION_SERVER = PROCESS_VERSION(6,0,3)				//程序版本
var VERSION_CLIENT = PROCESS_VERSION(6,0,3)				//程序版本

//////////////////////////////////////////////////////////////////////////////////
//状态定义

var GAME_SCENE_FREE = GAME_STATUS_FREE					//等待开始
var GAME_SCENE_CALL = (GAME_STATUS_PLAY+1)              //叫分
var GAME_SCENE_PLAY = (GAME_STATUS_PLAY+2)				//游戏进行
//////////////////////////////////////////////////////////////////////////////////

//常量定义
var MAX_WEAVE = 4									//最大组合
var MAX_INDEX = 34									//最大索引 33表示白板（9*3+7-1 从0开始）
// 服务器对一个麻将定义了两个idx 
// 一个用16进制表示(为了方便的表示出麻将的color和num 万条筒)
// 一个用10进制表示 从0开始 方便logic处理 0-8表示1-9万 9-17表示1-9条
// 如：
// 1条 16进制->0x11 10进制->9（1万是0）
var MAX_COUNT = 14									//最大数目
var MAX_REPERTORY = 136									//最大库存 9*4*3 + 7*4
var MAX_HUA_CARD = 0									//花牌个数 无花牌则配置0
var MAX_RIGHT_COUNT = 1									//最大权位DWORD个数 允许几个人同时胡(一炮多响)
		
//逻辑掩码
var MASK_COLOR = 0xF0								//花色掩码
var MASK_VALUE = 0x0F								//数值掩码

//动作标志 
var WIK_NULL = 0x00								//没有类型
var WIK_LEFT = 0x01								//左吃类型
var WIK_CENTER = 0x02								//中吃类型
var WIK_RIGHT = 0x04								//右吃类型
var WIK_PENG = 0x08								//碰牌类型
var WIK_GANG = 0x10								//杠牌类型
var WIK_LISTEN = 0x20								//吃牌类型
var WIK_CHI_HU = 0x40								//吃胡类型
var WIK_REPLACE = 0x80								//花牌替换

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////s////////////////////////
//一个胡型是否存在 由2进制数中的1位来表示
//0x0fffffff 可以表示32位的2进制 所以最多支持32种胡型

var MASK_CHI_HU_RIGHT = 0x0fffffff
//胡牌定义
var CHR_PingHu = 0x00000001  //平胡
var CHR_QueYi = 0x00000002  //缺一
var CHR_QueSan = 0x00000004	//混一色  由同一种花色及风牌组成的胡牌 （缺三）
var CHR_QueWu = 0x00000008	//清一色 由同一种花色牌组成的胡牌 （缺五）
var CHR_QueShi = 0x00000010  //全凤字(缺十)    



//用于财神的转换，如果有牌可以代替财神本身牌使用，则设为该牌索引，否则设为MAX_INDEX. 注:如果替换牌是序数牌,将出错.
var INDEX_REPLACE_CARD_DATA = 0//0	
//////////////////////////////////////////////////////////////////////////

//组合子项
var CMD_WeaveItem = 
[
	['BYTE', 'cbWeaveKind'],						//组合类型
	['BYTE', 'cbCenterCard'],						//中心扑克
	['BYTE', 'cbPublicCard'],						//公开标志
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbCardData', 4],						//组合数据
]

//////////////////////////////////////////////////////////////////////////
//服务器命令结构

var SUB_S_GAME_START = 100									//游戏开始
var SUB_S_OUT_CARD = 101									//出牌命令
var SUB_S_SEND_CARD = 102									//发送扑克
var SUB_S_OPERATE_NOTIFY = 103									//操作提示
var SUB_S_OPERATE_RESULT = 104									//操作命令
var SUB_S_GAME_END = 105									//游戏结束
var SUB_S_REPLACE_CARD = 106									//用户补牌
var SUB_S_LACKYES_RESULT = 107                                 //缺一可胡
var SUB_S_LACKNO_RESULT = 108                                 //缺一不可
var SUB_S_CALL = 109                                 //打子

//空闲状态
var CMD_S_StatusFree = 
[
	['SCORE', 'lCellScore'],							//基础金币
	['BYTE', 'cbPlayType'],                         //基础设置
	['BYTE', 'cbCallRecord', GAME_PLAYER], 
]

//打子
var CMD_S_StatusCall = 
[
	['SCORE', 'lCellScore'],                         //基础金币
	['DWORD', 'dwBankerUserId'],                     //庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER],          //打子
]

//游戏状态
var CMD_S_StatusPlay = 
[
	['BYTE', 'cbPlayType'],                                  //基础设置
	//游戏变量
	['SCORE', 'lCellScore'],									//单元积分
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['WORD', 'wCurrentUser'],								//当前需要出牌用户

	//状态变量
	['BYTE', 'cbActionMask'],								//动作掩码
	['BYTE', 'cbProvideCard'],								//动作扑克
	['BYTE', 'cbLeftCardCount'],							//剩余数目
	['BYTE', 'cbLackYesData', GAME_PLAYER],
	['BYTE', 'cbIsPreStartEnd'],

	//出牌信息
	['WORD', 'wOutCardUser'],								//出牌完成用户
	['BYTE', 'cbOutCardData'],								//出牌扑克
	['BYTE', 'cbDiscardCount', GAME_PLAYER],				//丢弃数目
	['BYTE', 'cbDiscardCard', GAME_PLAYER, 60],				//丢弃记录

	//扑克数据
	['BYTE', 'cbHandCardCount', GAME_PLAYER],								//扑克数目
	['BYTE', 'cbHandCardData', MAX_COUNT],						//扑克列表
	['BYTE', 'cbSendCardData'],								//发送扑克

	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['CMD_WeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克

	//财神变量
	['BYTE', 'cbMagicCardData'],								//财神牌值

	['BYTE', 'cbCallRecord', GAME_PLAYER],                      //打子
]

var CMD_S_Call = 
[
    ['SCORE', 'lCellScore'], 
	['DWORD', 'dwBankerUserId'],                               //庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER],                    //打子
]


//游戏开始
var CMD_S_GameStart = 
[
	['BYTE', 'cbPlayType'],
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['WORD', 'wCurrentUser'],								//当前出牌用户
	['BYTE', 'cbActionMask'],								//用户动作
	['BYTE', 'cbHandCardData', MAX_COUNT],					//扑克列表

	['BYTE', 'cbMagicCardData'],								//财神牌值						
	['bool', 'bIsRandBanker'],
	['BYTE', 'cbLackYesData', GAME_PLAYER],

	['BYTE', 'cbCallRecord', GAME_PLAYER],                   //打子
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
	['BYTE', 'cbSendCardData'],						//扑克数据
	['BYTE', 'cbActionMask'],						//动作掩码
	['WORD', 'wCurrentUser'],						//当前出牌用户
]

//操作提示
var CMD_S_OperateNotify = 
[
	['WORD', 'wResumeUser'],						//还原用户
	['BYTE', 'cbActionMask'],						//动作掩码
	['BYTE', 'cbProvideCard'],						//供应扑克
]

//操作命令
var CMD_S_OperateResult = 
[
	['WORD', 'wOperateUser'],						//操作用户
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbOperateCode'],						//操作代码
	['BYTE', 'cbOperateCard', 3],					//操作扑克
	['BYTE', 'cbActionMask'],						//动作掩码
	['WORD', 'wCurrentUser'],						//当前出牌用户 碰杠会有可能进入动作状态
]

//游戏结束
var CMD_S_GameEnd = 
[
	//结束信息
	['WORD', 'wWinner'],
	['WORD', 'wExitUser'],							//强退用户
	['BYTE', 'endType'],   							//0强退 1流局 2自摸 3点炮
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCard'],						//供应扑克
	['DWORD', 'dwChiHuKind', GAME_PLAYER],			//胡牌类型
	['DWORD', 'dwChiHuRight', GAME_PLAYER],			//胡牌类型

	//积分信息
	['SCORE', 'lGameScore', GAME_PLAYER],			//游戏积分

	//扑克信息
	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],	//扑克数据

	//奖马变量
	['BYTE', 'cbHorseCardData'],                        //奖马牌值
	['BYTE', 'cbHorseIndex'],

	//送杠变量
	['bool', 'cbGangStatus'],                           //送杠状态

	//提供杠的人变量
	['WORD', 'wOutCardUser'],                           //提供送杠者

	//胡的人数变量
	['WORD', 'cbHuCount'],                              //胡牌的人数
	//打子
	['BYTE', 'cbCallRecord', GAME_PLAYER],                        //打子

]
//缺一可胡结果
var CMD_S_LackYes_Result = 
[
	['BYTE', 'cbLackYesData', GAME_PLAYER],    //是否可胡
	['WORD', 'wOperateUser'],                  //操作用户
]
//缺一不可胡结果
var CMD_S_LackNo_Result = 
[
	['BYTE', 'cbLackNo'],                      //是否不可胡
]

//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3									//操作扑克
var SUB_C_CALL = 4                                   //打子
var SUB_C_LACKYES = 6                                   //缺一可胡命令
var SUB_C_LACKNO = 7                                   //缺一不可胡命令

//出牌命令
var CMD_C_OutCard = 
[
	['BYTE', 'cbOutCardData'],							//扑克数据
]

//操作命令
var CMD_C_OperateCard = 
[
	['BYTE', 'cbOperateCode'],						//操作代码
	['BYTE', 'cbOperateCard', 3],					//操作扑克
]

//缺一可胡命令
var CMD_C_LackYes_Result = 
[
	['bool', 'cbLackYes'],                          //缺一是否可放冲
]
//缺一不可胡命令
var CMD_C_LackNo_Result = 
[
	['BYTE', 'cbLackNo'],
]

var CMD_C_Call = 
[
	['BYTE', 'dazi'],                               //打子
]


//////////////////////////////////////////////////////////////////////////

//#endif