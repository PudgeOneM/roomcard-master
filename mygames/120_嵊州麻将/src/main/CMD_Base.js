//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 120							//游戏 I D
var GAME_NAME = "嵊州麻将"					//游戏名字

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

//常量
var INVALID_CARD_DATA = INVALID_BYTE

///////////////游戏配置 begin////////////
var MAX_INDEX = 34	//最大索引 
var MAX_COUNT = 14	//最大手牌数
var MAX_REPERTORY = 136	//最大库存 
var MAX_FLOWER_COUNT = 1	//无花时设置为1 m_cbFlowerIndex[MAX_FLOWER_COUNT]不赋值即可   
var MAX_RIGHT_COUNT = 1	//最大权位DWORD个数 允许几个人同时胡(一炮多响)
var MAX_WEAVE = 4	//最大组合
var HEAP_FULL_COUNT = 34	//堆立全牌 一个玩家面前的牌堆包含的麻将数

//假财神
var REPLACE_CARD_DATA = INVALID_CARD_DATA//无假财神时设置为INVALID_CARD_DATA
var REPLACE_CARD_ALLOWSELF = false	

//财神
var MAX_MAGIC_COUNT = 1//无财神时设置为1 m_cbMagicIndex[MAX_MAGIC_COUNT]不赋值即可
var TURNOVER_COUNT_MAGIC = 1//翻财神时翻的麻将数 		
var MAGIC_CARD_ALLOWOUT = true	

//其他
var MAX_SEND_COUNT = 8//摸到所有花补花 要发一样多的牌 MAX_FLOWER_COUNT	
//客户端执行动作时发给服务器的麻将最大数 如果有补花操作 可能出现摸到所有花补花 MAX_FLOWER_COUNT												
var MAX_OPERATE_COUNT = 8
///////////////游戏配置 end////////////

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
var CHR_PingHu = 0x00000001  //平胡
var CHR_CaiNiao = 0x00000002	//财鸟
var CHR_FeiNiao = 0x00000004	//飞鸟
var CHR_FeiNiao2 = 0x00000008	//飞鸟2
var CHR_FeiNiao3 = 0x00000010	//飞鸟3  
var CHR_RBanker = 0x00000020	//连庄
var CHR_GangKaiTimes1 = 0x00000040	//一次连杠
var CHR_GangKaiTimes2 = 0x00000080	//
var CHR_GangKaiTimes3 = 0x00000100	//
var CHR_JiaFei = 0x00000200	//假飞*1
var CHR_JiaFei2 = 0x00000400	//假飞*2
var CHR_JiaFei3 = 0x00000800	//假飞*3
var CHR_JiaFei4 = 0x00001000	//假飞*4 
var CHR_GangKai = 0x00002000	//杠上开花（杠开）    开杠抓进的牌成和牌   
var CHR_QiangGang = 0x00004000	//抢杠  和别人自抓开明杠的牌  
var CHR_TianHu = 0x00008000	//天胡
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
	['CHR_CaiNiao', '财鸟'],
	['CHR_FeiNiao', '飞鸟'],
	['CHR_FeiNiao2', '飞鸟*2'],
	['CHR_FeiNiao3', '飞鸟*3'],
	['CHR_RBanker', '连庄'],
	['CHR_GangKaiTimes1', '连续杠*1'],
	['CHR_GangKaiTimes2', '连续杠*2'],
	['CHR_GangKaiTimes3', '连续杠*3'],
	['CHR_JiaFei', '假飞'],
	['CHR_JiaFei2', '假飞*2'],
	['CHR_JiaFei3', '假飞*3'],
	['CHR_JiaFei4', '假飞*4'],
	['CHR_GangKai', '杠开'],
	['CHR_QiangGang', '抢杠'],
	['CHR_TianHu', '天胡'],
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

//类型子项
var heapCardItem = 
[
	['WORD', 'wHeapDir'], //发牌方位
	['WORD', 'wHeapPos'], //发牌位置	
	['BYTE', 'cbCardData'],	//发牌数据 INVALID_CARD_DATA表示是丢弃牌 客户端不会往手牌塞牌
	['bool', 'bDiscard'],
]
//heapPos
//var 头部第一堆上面一个heapPos =var 尾部第一堆下面一个heapPos =max

//////////////////////////////////////////////////////////////////////////
//服务器命令结构
var SUB_S_CALL = 107									
var SUB_S_GAME_START = 100									//游戏开始
var SUB_S_OUT_CARD = 101									//出牌命令
var SUB_S_SEND_CARD = 102									//发送扑克
var SUB_S_OPERATE_RESULT = 104								//操作命令
var SUB_S_GAME_END = 105									//游戏结束
var SUB_S_GAME_TYPE = 103


var CMD_S_Call = 
[
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbReBanker'],
	['BYTE', 'cbCallRecord', GAME_PLAYER,1],//下跑 加顶分
]

//游戏开始
var CMD_S_GameStart = 
[
	['BYTE', 'cbSiceCount'],
	['bool', 'bIsRandBanker'],
	['BYTE', 'cbReBanker'],
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbMagicCardData', MAX_MAGIC_COUNT],					
	['BYTE', 'cbLeftCardCount'],	//剩余数目

	['BYTE', 'cbHandCardData', MAX_COUNT],					//扑克列表
	['WORD', 'wHeapHead'],							//堆立头部
	['WORD', 'wHeapTail'],							//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],					//堆牌信息
	['heapCardItem', 'TurnoverCard', TURNOVER_COUNT_MAGIC],

	['BYTE', 'cbCallRecord', GAME_PLAYER,1],//下跑 加顶分
]

//出牌命令
var CMD_S_OutCard = 
[
	['WORD', 'wOutCardUser'],						//出牌用户
	['BYTE', 'cbOutCardData'],						//出牌扑克
	['BYTE', 'cbActionMask'],						//动作掩码
	['BYTE', 'cbWarnTimes'],						//播报次数
]

//发送扑克
var CMD_S_SendCard = 
[
	['BYTE', 'cbActionMask'],						//动作掩码
	['WORD', 'wProvideUser'],						//当前出牌用户
	['BYTE', 'cbProvideCardData'],						//供应扑克
	['WORD', 'wCurrentUser'],						//当前出牌用户
	['WORD', 'wTakeCardUser'],						//拿牌用户
	['BYTE', 'cbSendCardCount'], 
	['heapCardItem', 'sendCardArray', MAX_SEND_COUNT], //
]

//操作命令
var CMD_S_OperateResult = 
[	
	['BYTE', 'cbActionMask'],						//动作后动作 动作掩码
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],						//供应扑克
	['WORD', 'wCurrentUser'],						//当前出牌用户 碰杠会有可能进入动作状态
	['BYTE', 'cbWarnTimes'],						//播报次数

	['BYTE', 'cbHandCardCount'],
	['BYTE', 'cbOperateCode'],						//操作代码
	['WORD', 'wOperateUser'],						//操作用户
	['BYTE', 'cbOperateCardCount'],
	['BYTE', 'cbOperateCardData', MAX_OPERATE_COUNT],					//操作扑克
]

//游戏结束
var CMD_S_GameEnd = 
[
	['WORD', 'wWinner'],
	['WORD', 'wExitUser'],							//强退用户
	['BYTE', 'endType'],   							//0强退 1流局 2自摸 3点炮
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],					//供应扑克
	['BYTE', 'cbChengBaoUser', GAME_PLAYER],		//承包
	['DWORD', 'dwChiHuKind', GAME_PLAYER],			//胡牌类型
	['DWORD', 'dwChiHuRight', GAME_PLAYER],			//胡牌类型

	['SCORE', 'lGameScore', GAME_PLAYER],			//游戏积分
	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],	//扑克数据

	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克
]

//空闲状态
var CMD_S_StatusFree = 
[
	['SCORE', 'lCellScore'],							//基础金币
	['CMD_C_GameType', 'stWinType'],
	['bool', 'bHaveSetType'],
]

var CMD_S_StatusCall = 
[
	['SCORE', 'lCellScore'],							//基础金币
	['DWORD', 'dwBankerUserId'],						//庄家用户
	['BYTE', 'cbReBanker'],
	['BYTE', 'cbCallRecord', GAME_PLAYER,1],			//下跑 加顶分
]

//游戏状态
var CMD_S_StatusPlay = 
[
	//游戏变量
	['SCORE', 'lCellScore'],								//单元积分
	['DWORD', 'dwBankerUserId'],							//庄家用户
	['WORD', 'wCurrentUser'],								//当前需要出牌用户

	//状态变量
	['BYTE', 'cbActionMask'],								//动作掩码
	['WORD', 'wProvideUser'],								//供应用户
	['BYTE', 'cbProvideCardData'],							//动作扑克
	['BYTE', 'cbLeftCardCount'],							//剩余数目
	['CMD_C_GameType', 'stWinType'],					
	['bool', 'bHaveSetType'],
	['BYTE', 'cbReBanker'],

	//出牌信息
	['WORD', 'wOutCardUser'],								//出牌完成用户
	['BYTE', 'cbOutCardData'],								//出牌扑克
	['BYTE', 'cbDiscardCount', GAME_PLAYER],				//丢弃数目
	['BYTE', 'cbDiscardCardData', GAME_PLAYER, 60],				//丢弃记录

	//扑克数据
	['BYTE', 'cbHandCardCount', GAME_PLAYER],								//扑克数目
	['BYTE', 'cbHandCardData', MAX_COUNT],						//扑克列表

	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克

	//财神变量
	['BYTE', 'cbMagicCardData', MAX_MAGIC_COUNT],

	['WORD', 'wHeapHead'],							//堆立头部
	['WORD', 'wHeapTail'],							//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],					//堆牌信息
	['heapCardItem', 'TurnoverCard', TURNOVER_COUNT_MAGIC],

	['BYTE', 'cbCallRecord', GAME_PLAYER, 1],//下跑 加顶分
	['BYTE', 'cbAfterEatForbid', 2],
]
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3								//操作扑克
var SUB_C_CALL = 4									    //操作扑克
var SUB_C_TYPE_SEL = 5

//出牌命令
var CMD_C_OutCard = 
[
	['BYTE', 'cbOutCardData'],							//扑克数据
]

//操作命令
var CMD_C_OperateCard = 
[
	['BYTE', 'cbOperateCode'],						//操作代码
	['BYTE', 'cbOperateCardCount'],

	['BYTE', 'cbOperateCardData', MAX_OPERATE_COUNT],	//操作扑克 补花操作时不传这个 服务器默认所有花牌补花
]

//游戏设置
var CMD_C_Call = 
[
	['BYTE', 'cbMoPao'],										
]

var CMD_C_GameType = 
[
	['BYTE', 'cbThreeCaiDiao'],						
	['BYTE', 'cbFiveZiMo'],							
	['BYTE', 'cbFiveBei'],						
	['BYTE', 'cbThreeOneOne'],						
	['BYTE', 'YaoFiveOneOne'],							
]

//////////////////////////////////////////////////////////////////////////

//#endif