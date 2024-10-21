//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 117								//游戏 I D
var GAME_NAME = "岱山麻将"					//游戏名字

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
var MAX_INDEX = 42	//最大索引 
var MAX_COUNT = 14	//最大手牌数
var MAX_REPERTORY = 144	//最大库存 
var MAX_FLOWER_COUNT = 8	//无花时设置为1 m_cbFlowerIndex[MAX_FLOWER_COUNT]不赋值即可   
var MAX_RIGHT_COUNT = 1	//最大权位DWORD个数 允许几个人同时胡(一炮多响)
var MAX_WEAVE = 4	//最大组合
var HEAP_FULL_COUNT = 36	//堆立全牌 一个玩家面前的牌堆包含的麻将数

//假财神
var REPLACE_CARD_DATA = INVALID_CARD_DATA//无假财神时设置为INVALID_CARD_DATA
var REPLACE_CARD_ALLOWSELF = false	

//财神
var MAX_MAGIC_COUNT = 1//无财神时设置为1 m_cbMagicIndex[MAX_MAGIC_COUNT]不赋值即可
var TURNOVER_COUNT_MAGIC = 2//翻财神时翻的麻将数 		
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
var CHR_HunYiSe = 0x00000002	//混一色  由同一种花色及风牌组成的胡牌 
var CHR_QingYiSe = 0x00000004	//清一色 由同一种花色牌组成的胡牌 
var CHR_PengPengHu = 0x00000008	//碰碰胡 由任意花色及风字组成的碰胡   
var CHR_HunPeng = 0x00000010	//混碰  由同一种花色及风字组成的碰胡  
var CHR_QingPeng = 0x00000020	//清碰  由同一种花色组成的碰胡
var CHR_QiXiaoDui = 0x00000040	//七小对 任意花色的七个对子组成 
var CHR_HunQiDui = 0x00000080	//混七对 同一种花色及风牌的七个对子组成 
var CHR_QingQiDui = 0x00000100	//清七对 同一种花色的七个对子组成    
var CHR_QuanFengZiDaPengHu = 0x00000400	//全风字大碰胡  全都是风字组成的碰碰胡 
var CHR_SanCaiDao = 0x00001000	//三财倒 牌里包含3张财神（不可吃冲、可自摸）  
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
var CHR_FengPeng = 0x00000800 //风碰
var CHR_FengQiDui = 0x00000200 // 风七对

//#ifdef xxxxxx
var map_mask2Name = 
[
	['CHR_PingHu', '平胡', '2', '3', '5', '10'],
	['CHR_HunYiSe', '混一色', '4', '6','10', '20'],
	['CHR_QingYiSe', '清一色', '8', '12','20', '40'],
	['CHR_PengPengHu', '碰碰胡', '4', '6','10', '20'],
	['CHR_FengPeng', '风一色碰碰胡', '16', '24','40', '80'],
	['CHR_FengQiDui', '风一色七对子', '32', '48','80', '160'],
	['CHR_HunPeng', '混一色碰碰胡', '8', '12','20', '40'],
	['CHR_QingPeng', '清一色碰碰胡', '12', '18','30', '60'],
	['CHR_HunQiDui', '混一色七对子', '12', '18','30', '60'],
	['CHR_QingQiDui', '清一色七对子', '16', '24','40', '80'],
	['CHR_QiXiaoDui', '七小对', '8', '12','20', '40'],
	['CHR_GangKai', '杠开', '2', '3','5', '10'],
	['CHR_QiangGang', '抢杠', '', '','', ''],
	['CHR_TianHu', '天胡', '8', '12', '20', '40'],
	['CHR_DiHu', '地胡', '4', '6','10', '20'],
	['CHR_HaiDiLaoYue', '海底捞月', '4', '6', '10', '20'],
	['CHR_DaDiao', '大吊', '2', '3', '5', '10'],
	['CHR_QiFengLanBaiDa', '七风乱不搭', '4', '6', '10', '20'],
	['CHR_LanBaiDa', '十三不搭', '2', '3', '5', '10'],
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
	['BYTE', 'cbCardDatas', 4],						//组合数据
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
var SUB_S_GAME_TYPE = 108

var CMD_S_Call = 
[
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],//下跑 加顶分
]

//游戏开始
var CMD_S_GameStart = 
[
	['BYTE', 'cbSiceCount'],
	['bool', 'bIsRandBanker'],
	['DWORD', 'dwBankerUserId'],							//庄家用户
	['BYTE', 'cbMagicCardData', MAX_MAGIC_COUNT],					
	['BYTE', 'cbFlowerCardData', MAX_FLOWER_COUNT],
	['BYTE', 'cbLeftCardCount'],	//剩余数目

	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],		//扑克列表
	['WORD', 'wHeapHead'],									//堆立头部
	['WORD', 'wHeapTail'],									//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],				//堆牌信息
	['heapCardItem', 'TurnoverCard', TURNOVER_COUNT_MAGIC],

	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],//下跑 加顶分
]

//出牌命令
var CMD_S_OutCard = 
[
	['WORD', 'wOutCardUser'],						//出牌用户
	['WORD', 'wRevInfoUser'],
	['BYTE', 'cbOutCardData'],						//出牌扑克
	['BYTE', 'cbActionMask'],						//动作掩码
]

//发送扑克
var CMD_S_SendCard = 
[
	['BYTE', 'cbActionMask'],						//动作掩码
	['WORD', 'wProvideUser'],						//动作掩码
	['BYTE', 'cbProvideCardData'],						//供应扑克
	['WORD', 'wCurrentUser'],						//当前出牌用户
	['WORD', 'wTakeCardUser'],						//拿牌用户
	['WORD', 'wRevInfoUser'],
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
	['WORD', 'wRevInfoUser'],
	['BYTE', 'cbHandCardCount'],
	['BYTE', 'cbOperateCode'],						//操作代码
	['WORD', 'wOperateUser'],						//操作用户
	['BYTE', 'cbOperateCardCount'],
	['BYTE', 'cbOperateCardData', MAX_OPERATE_COUNT],					//操作扑克
]

//游戏类型选择
var CMD_S_GameType = 
[
	['BYTE', 'cbGameType'],						    	//游戏类型
]

var tagHuaScore = 
[
	['WORD', 'wZimoScore'], // 自摸花
	['WORD', 'wQGScore'],   // 抢杠
	['WORD', 'wHuaScore'],  // 花
	['WORD', 'wPTFGScore'], // 风明杠
	['WORD', 'wANFGScore'], // 风暗杠
	['WORD', 'wPMGScore'],  // 普通明杠
	['WORD', 'wPAGScore'],	// 普通暗杠
	['WORD', 'wFPengScore'],// 风碰以及暗刻
]

//游戏结束
var CMD_S_GameEnd = 
[
	['WORD', 'wWinner'],
	['WORD', 'wExitUser'],							//强退用户
	['BYTE', 'endType'],   							//0强退 1流局 2自摸 3点炮
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],						//供应扑克
	['DWORD', 'dwChiHuKind', GAME_PLAYER],			//胡牌类型
	['DWORD', 'dwChiHuRight', GAME_PLAYER],			//胡牌类型

	['SCORE', 'lGameScore', GAME_PLAYER],			//游戏积分
	['BYTE', 'cbQGWinner', GAME_PLAYER],			//多响赢家
	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],	//扑克数据
	['BYTE', 'cbHuaScore', GAME_PLAYER],	
	['tagHuaScore', 'stHuaScore', GAME_PLAYER],	

	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克
]

//空闲状态
var CMD_S_StatusFree = 
[
	['SCORE', 'lCellScore'],							//基础金币
	['BYTE', 'cbGameType'],
	['bool', 'bHaveSetType'],
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
	//游戏变量
	['SCORE', 'lCellScore'],									//单元积分
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['WORD', 'wCurrentUser'],								//当前需要出牌用户

	//状态变量
	['BYTE', 'cbActionMask'],								//动作掩码
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],								//动作扑克
	['BYTE', 'cbLeftCardCount'],							//剩余数目
	['BYTE', 'cbGameType'],					
	['bool', 'bHaveSetType'],

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

	['BYTE', 'cbPlayerFlowerCount', GAME_PLAYER],			//丢弃花牌数目
	['BYTE', 'cbPlayerFlowerCardData', GAME_PLAYER, MAX_FLOWER_COUNT],		//丢弃花牌记录

	//财神变量
	['BYTE', 'cbMagicCardData', MAX_MAGIC_COUNT],
	
	['BYTE', 'cbFlowerCardData', MAX_FLOWER_COUNT],


	['WORD', 'wHeapHead'],							//堆立头部
	['WORD', 'wHeapTail'],							//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],					//堆牌信息
	['heapCardItem', 'TurnoverCard', TURNOVER_COUNT_MAGIC],

	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],
	['BYTE', 'cbAfterEatForbid', 2],
]
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3									//操作扑克
var SUB_C_CALL = 4									//操作扑克
var SUB_C_TYPE_SEL = 5								//类型选择

//游戏类型选择
var CMD_C_GameType = 
[
	['BYTE', 'cbGameType'],						    	//游戏类型
]

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
	['BYTE', 'xiapao'],						
	['BYTE', 'jiading'],					
]

//////////////////////////////////////////////////////////////////////////

//#endif