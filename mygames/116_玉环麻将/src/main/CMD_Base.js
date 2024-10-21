//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 116								//游戏 I D
var GAME_NAME = "玉环麻将"					//游戏名字

//组件属性
var GAME_PLAYER = 4									//游戏人数
var VERSION_SERVER = PROCESS_VERSION(6,0,3)				//程序版本
var VERSION_CLIENT = PROCESS_VERSION(6,0,3)				//程序版本

//////////////////////////////////////////////////////////////////////////////////
//状态定义

var GAME_SCENE_FREE = GAME_STATUS_FREE					//等待开始
var GAME_SCENE_CALL = (GAME_STATUS_PLAY+1)				//叫分
var GAME_SCENE_PLAY = (GAME_STATUS_PLAY+2)				//游戏进行
//////////////////////////////////////////////////////////////////////////////////
// 服务器对一个麻将定义了两个idx 
// 一个用16进制表示(为了方便的表示出麻将的color和num 万条筒)
// 一个用10进制表示 从0开始 方便logic处理 0-8表示1-9万 9-17表示1-9条
// 如：
// 1条 16进制->0x11 10进制->9（1万是0）

//常量定义
var MAX_INDEX = 34									//最大索引 33表示白板（9*3+7-1 从0开始）
var INVALID_CARD_INDEX = MAX_INDEX	
var INVALID_CARD_DATA = INVALID_BYTE
//用于财神的转换，如果有牌可以代替财神本身牌使用，则设为该牌索引，否则设为INVALID_CARD_DATA. 注:如果替换牌是序数牌,将出错.
var REPLACE_CARD_DATA = INVALID_CARD_DATA//INVALID_CARD_DATA//0xff	

var MAX_COUNT = 17									//最大数目
var MAX_REPERTORY = 136									//最大库存 9*4*3 + 7*4
var MAX_HUA_CARD = 0									//花牌个数 无花牌则配置0
var MAX_RIGHT_COUNT = 1									//最大权位DWORD个数 允许几个人同时胡(一炮多响)
var MAX_WEAVE = 5									//最大组合
var MAX_KINDITEM_COUNT = 152//连牌组合:7*4*3(可以4个相同的顺子 有条万桶3种) 同牌组合:(27+7)*2 (4个一万2个财神算碰两个一万)	

var REPLACE_CARD_ALLOWSELF = false	
var MAGIC_CARD_ALLOWOUT = true	

var HEAP_FULL_COUNT = 34									//堆立全牌
var MAX_SEND_COUNT = 2									

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
//////////////////////////////////////////////////////////////////////////////////
//一个胡型是否存在 由2进制数中的1位来表示
//0xffffffff 可以表示32位的2进制 所以最多支持32种胡型

var MASK_CHI_HU_RIGHT = 0x0fffffff
//胡牌定义
var CHR_PingHu = 0x00000001  //、平胡
var CHR_HunYiSe = 0x00000002	//、混一色  由同一种花色及风牌组成的胡牌 
var CHR_QingYiSe = 0x00000004	//、清一色 由同一种花色牌组成的胡牌 
var CHR_PengPengHu = 0x00000008	//、碰碰胡 由任意花色及风字组成的碰胡   
var CHR_ZiMo = 0x00000010	//、自摸 
var CHR_QianDang = 0x00000020	//、嵌档  
var CHR_QiXiaoDui = 0x00000040	//七小对 任意花色的七个对子组成 
var CHR_WuDe = 0x00000080	//、无财神 
var CHR_SiFengQuanQi = 0x00000100	//、四风齐全 清七对     
var CHR_TwoCai = 0x00000200	//、两财神  
var CHR_ThreeCai = 0x00000400	//、三财神   
var CHR_LaBanZi = 0x00000800	//、辣板子 七风倒  
var CHR_KaoBing = 0x00001000	//、靠柄  
var CHR_GangKai = 0x00002000	//、杠上开花（杠开）    开杠抓进的牌成和牌   
var CHR_QiangGang = 0x00004000	//、抢杠  和别人自抓开明杠的牌  
var CHR_DuiDao = 0x00008000	//、对到
var CHR_DiHu = 0x00010000	//地胡 庄家出第一张点炮下家和是地和，牌型不限。  
var CHR_DanDiao = 0x00020000	// 单吊 不管什么牌型，最后成单调的都算特殊牌型。
var CHR_HaiDiLaoYue = 0x00040000	// 海底捞月 算特殊牌型，即最后一个玩家抓最后一张牌时胡牌，那么就称之为海底捞月。
var CHR_DaDiao = 0x00080000	//大吊
var CHR_ShiSanBaiDa = 0x00100000	//十三百搭    147,258,369加5张不同的风可以由不同于前5张风代替147,258,369任意一张或两张牌   
var CHR_ZhengBaiDa = 0x00200000	//真百搭 含有7张风字的十三百搭（147,258,369三花色组成）  
var CHR_LanBaiDa = 0x00400000  //烂百搭 147、148、149、158、159、169、258、259、269、369任意三花色组成加上单风的牌型
var CHR_QiFengLanBaiDa = 0x00800000	//七风烂百搭 可自摸可放冲
var CHR_HasCaiShen = 0x01000000	//胡型里是否有财神
var CHR_ShiSanYao = 0x02000000	//十三幺：东南西北中发白，一九万，一九饼，一九条，加其中任意一张组成对，混不能做为财神使用，只能按牌面显示使用，例混为三万时，只能做为三万使用。

//#ifdef xxxxxx
var map_mask2Name = 
[
	['CHR_PingHu', '平胡'],
	['CHR_HunYiSe', '混一色'],
	['CHR_QingYiSe', '清一色'],
	['CHR_PengPengHu', '碰碰胡'],
	['CHR_ZiMo', '自摸'],
	['CHR_QianDang', '嵌档'],
	['CHR_QiXiaoDui', '七小对'],
	['CHR_WuDe', '无财神'],
	['CHR_SiFengQuanQi', '四风齐全'],
	['CHR_TwoCai', '两财神'],
	['CHR_ThreeCai', '三财神'],
	['CHR_LaBanZi', '辣板子'],
	['CHR_KaoBing', '靠壁'],
	['CHR_GangKai', '杠开'],
	['CHR_QiangGang', '拉杠'],
	['CHR_DuiDao', '对倒'],
	['CHR_DiHu', '地胡'],
	['CHR_DanDiao', '单吊'],
	['CHR_HaiDiLaoYue', '海底捞月'],
	['CHR_DaDiao', '大吊'],
	['CHR_ShiSanBaiDa', '十三百搭'],
	['CHR_ZhengBaiDa', '真百搭'],
	['CHR_LanBaiDa', '烂百搭'],
	['CHR_QiFengLanBaiDa', '七风烂百搭'],
	['CHR_ShiSanYao', '十三幺'],
]
//#endif


//////////////////////////////////////////////////////////////////////////

//组合子项
var tagWeaveItem = 
[
	['BYTE', 'cbWeaveKind'],						//组合类型
	['BYTE', 'cbCenterCardData'],						//中心扑克
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
var SUB_S_PINGCUO_RESULT = 108									//设置平搓

var SUB_S_CALL = 107									

//空闲状态
var CMD_S_StatusFree = 
[
	['SCORE', 'lCellScore'],							//基础金币
	['BYTE', 'cbPlayType'],							//基础设置
]

var CMD_S_StatusCall = 
[
	['SCORE', 'lCellScore'],							//基础金币
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],//下跑 加顶分
]

//游戏状态
var CMD_S_StatusPlay = 
[
	['BYTE', 'cbPlayType'],									//基础设置
	//游戏变量
	['SCORE', 'lCellScore'],									//单元积分
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['WORD', 'wCurrentUser'],								//当前需要出牌用户
	['BYTE', 'cbHuaCardData', GAME_PLAYER, 4],				//花牌
	//状态变量
	['BYTE', 'cbActionMask'],								//动作掩码
	['BYTE', 'cbProvideCardData'],								//动作扑克
	['BYTE', 'cbLeftCardCount'],							//剩余数目

	//出牌信息
	['WORD', 'wOutCardUser'],								//出牌完成用户
	['BYTE', 'cbOutCardData'],								//出牌扑克
	['BYTE', 'cbDiscardCount', GAME_PLAYER],				//丢弃数目
	['BYTE', 'cbDiscardCardData', GAME_PLAYER, 60],				//丢弃记录

	//扑克数据
	['BYTE', 'cbHandCardCount', GAME_PLAYER],								//扑克数目
	['BYTE', 'cbHandCardData', MAX_COUNT],						//扑克列表
	['BYTE', 'cbSendCardData'],								//发送扑克

	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克

	//财神变量
	['BYTE', 'cbMagicCardData'],								//财神牌值

	['WORD', 'wHeapHead'],							//堆立头部
	['WORD', 'wHeapTail'],							//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],					//堆牌信息
	['BYTE', 'cbTurnoverCardData'],
	['WORD', 'wTurnoverCardHeapDir'],							//翻牌方位
	['BYTE', 'wTurnoverCardHeapPos'],							//翻牌堆位	(从尾部数起）

	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],//下跑 加顶分
]

var CMD_S_Call = 
[
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],//下跑 加顶分
]

//游戏开始
var CMD_S_GameStart = 
[
	['BYTE', 'cbPlayType'],									//基础设置
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['WORD', 'wCurrentUser'],								//当前出牌用户
	['BYTE', 'cbActionMask'],								//用户动作
	['BYTE', 'cbHandCardData', MAX_COUNT],					//扑克列表

	['BYTE', 'cbMagicCardData'],								//财神牌值						
	['bool', 'bIsRandBanker'],
	['BYTE', 'cbLeftCardCount'],	//剩余数目


	['BYTE', 'cbSiceCount'],
	['WORD', 'wHeapHead'],							//堆立头部
	['WORD', 'wHeapTail'],							//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],					//堆牌信息
	['BYTE', 'cbTurnoverCardData'],
	['WORD', 'wTurnoverCardHeapDir'],							//翻牌方位
	['BYTE', 'wTurnoverCardHeapPos'],							//翻牌堆位	(从尾部数起）

	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],//下跑 加顶分
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
	['BYTE', 'cbLeftCardCount'],	//剩余数目

	['WORD', 'wSendHeapDir'],
	['WORD', 'wSendHeapPosArray', MAX_SEND_COUNT],
]

//操作提示
var CMD_S_OperateNotify = 
[
	['WORD', 'wResumeUser'],						//还原用户
	['BYTE', 'cbActionMask'],						//动作掩码
	['BYTE', 'cbProvideCardData'],						//供应扑克
]

//操作命令
var CMD_S_OperateResult = 
[
	['WORD', 'wOperateUser'],						//操作用户
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbOperateCode'],						//操作代码
	['BYTE', 'cbOperateCardData', 3],					//操作扑克
	['BYTE', 'cbActionMask'],						//动作掩码
	['WORD', 'wCurrentUser'],						//当前出牌用户 碰杠会有可能进入动作状态
	['BYTE', 'cbLeftCardCount'],	//剩余数目
]

//游戏结束
var CMD_S_GameEnd = 
[
	//结束信息
	['WORD', 'wWinner'],
	['WORD', 'wExitUser'],							//强退用户
	['BYTE', 'endType'],   							//0强退 1流局 2自摸 3点炮
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],						//供应扑克
	['DWORD', 'dwChiHuKind', GAME_PLAYER],			//胡牌类型
	['DWORD', 'dwChiHuRight', GAME_PLAYER],			//胡牌类型

	//积分信息
	['SCORE', 'lGameScore', GAME_PLAYER],			//游戏积分

	//扑克信息
	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],	//扑克数据
	['BYTE', 'cbWeaveCount', GAME_PLAYER],				//组合数目
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],	//组合扑克

	['BYTE', 'cbTempTest', GAME_PLAYER, MAX_COUNT],		//临时测试数据
	['WORD', 'cbIGameFan', GAME_PLAYER],					//用户番数
]
//补牌命令
var CMD_S_ReplaceCard = 
[
	['WORD', 'wReplaceUser'],						//补牌用户
	['BYTE', 'cbHuaCard', 4],						//花牌扑克
	['BYTE', 'cbReplaceCard', 4],					//补牌扑克
	['bool', 'bBuHuaUser'],                         //是否有补花用户 没有游戏继续
	['BYTE', 'cbUserAction'],						//用户动作
]
//平搓结果
var CMD_S_Ping_Result = 
[
	['BYTE', 'cbPingCuoCuo'],						//是否平挫搓
]
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3									//操作扑克
var SUB_C_CALL = 4									//操作扑克
var SUB_C_REPLACE_CARD = 5									//用户补牌
var SUB_C_PINGCUO = 7									//平挫搓命令
//出牌命令
var CMD_C_OutCard = 
[
	['BYTE', 'cbOutCardData'],							//扑克数据
]

//操作命令
var CMD_C_OperateCard = 
[
	['BYTE', 'cbOperateCode'],						//操作代码
	['BYTE', 'cbOperateCardData', 3],					//操作扑克
]

//游戏设置
var CMD_C_Call = 
[
	['BYTE', 'xiapao'],						
	['BYTE', 'jiading'],					
]
//平挫搓命令
var CMD_C_Ping_Result = 
[
	['BYTE', 'cbPingCuoCuo'],						//是否平挫搓
]
//////////////////////////////////////////////////////////////////////////

//#endif