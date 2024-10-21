//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 150										//游戏 I D
var GAME_NAME = "亳州麻将全嘴"							//游戏名字

//组件属性
var GAME_PLAYER = 4										//游戏人数
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
var MAX_FENG_COUNT	= 28

//假财神
var REPLACE_CARD_DATA = INVALID_CARD_DATA//无假财神时设置为INVALID_CARD_DATA
var REPLACE_CARD_ALLOWSELF = false	

//财神
var MAX_MAGIC_COUNT = 1//无财神时设置为1 m_cbMagicIndex[MAX_MAGIC_COUNT]不赋值即可
var TURNOVER_COUNT_MAGIC = 1//翻财神时翻的麻将数 			

//其他
var MAX_SEND_COUNT = 14//摸到所有花补花 要发一样多的牌 MAX_FLOWER_COUNT	
//客户端执行动作时发给服务器的麻将最大数 如果有补花操作 可能出现摸到所有花补花 MAX_FLOWER_COUNT												
var MAX_OPERATE_COUNT = 14
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
var CHR_QueYiSe = 0x00000002	//缺一色
var CHR_TongTian = 0x00000004	//通天
var CHR_HunYiSe = 0x00000010	//混一色
var CHR_QingYiSe = 0x00000020	//清一色
var CHR_EvenSix = 0x00000040	//连六
var CHR_DEvenSix = 0x00000080	//双连六
var CHR_QPSanDui = 0x00000100	//青浦三对
var CHR_QPSiDui = 0x00000200	//青浦四对
var CHR_QPDbSanDui = 0x00000400	//青浦六对 双三对
var CHR_GangKai = 0x00002000	//杠开  
var CHR_QiangGang = 0x00004000	//抢杠  和别人自抓开明杠的牌  
var CHR_SingleColor5 = 0x00008000	//十二张一色
var CHR_EvenSix2 = 0x00010000	//2连六
var CHR_HaiDiLaoYue = 0x00040000	//海底捞月 算特殊牌型，即最后一个玩家抓最后一张牌时胡牌，那么就称之为海底捞月。
var CHR_SingleColor1 = 0x01000000	//八张一色
var CHR_SingleColor2 = 0x02000000	//九张一色
var CHR_SingleColor3 = 0x04000000	//十张一色
var CHR_SingleColor4 = 0x08000000	//十一张一色
var CHR_ZhanTou3 = 0x00000008  //沾三头
var CHR_ZhanTou4 = 0x00080000  //沾四头
var CHR_ZhanTou7 = 0x00000001  //沾七头
var CHR_ZhanTou8 = 0x00800000  //沾八
var CHR_ZhanTou11 = 0x00000800  //沾十一头
var CHR_ZhanTou12 = 0x00100000  //沾十二头
//////////////////////////////////////////////////////////////////////////

//#ifdef xxxxxx
var map_mask2Name = 
[
	['CHR_SingleColor1', '八张一色 1嘴'],
	['CHR_SingleColor2', '九张一色 2嘴'],
	['CHR_SingleColor3', '十张一色 3嘴'],
	['CHR_SingleColor4', '十一张一色 4嘴'],
	['CHR_SingleColor5', '十二张一色 5嘴'],
	['CHR_HunYiSe', '混一色 50嘴'],
	['CHR_QingYiSe', '清一色 70嘴'],
	['CHR_QueYiSe', '缺一门 5嘴'],
	['CHR_QPSanDui', '青浦三对 20嘴'],
	['CHR_QPSiDui', '青浦四对 30嘴'],
	['CHR_QPDbSanDui', '青浦三对*2 40嘴'],
	['CHR_EvenSix', '连六 20嘴'],
	['CHR_EvenSix2', '连六*2 40嘴'],
	['CHR_DEvenSix', '双连六 60嘴'],
	['CHR_TongTian', '通天 50嘴'],
	['CHR_GangKai', '杠开 40嘴'],
	['CHR_QiangGang', '抢杠 40嘴'],
	['CHR_ZhanTou3', '沾三头 10嘴'],
	['CHR_ZhanTou4', '沾四头 20嘴'],
	['CHR_ZhanTou7', '沾七头 40嘴'],
	['CHR_ZhanTou8', '沾八头 60嘴'],
	['CHR_ZhanTou11', '沾十一头 100嘴'],
	['CHR_ZhanTou12', '沾十二头 200嘴'],
	['CHR_HaiDiLaoYue', '海底捞月 40嘴'],
]
//#endif


//组合子项
var tagWeaveItem = 
[
	['BYTE', 'cbCardDatas', 4],						//组合数据
	['BYTE', 'cbWeaveKind'],						//组合类型
	['BYTE', 'cbCenterCardData'],					//中心扑克
	['BYTE', 'cbPublicCard'],						//公开标志
	['WORD', 'wProvideUser'],						//供应用户
]

//类型子项
var heapCardItem = 
[
	['WORD', 'wHeapDir'],	//发牌方位
	['WORD', 'wHeapPos'],	//发牌位置	
	['BYTE', 'cbCardData'],	//发牌数据 INVALID_CARD_DATA表示是丢弃牌 客户端不会往手牌塞牌
	['bool', 'bDiscard'],   //丢弃标志
]
//heapPos
//var 头部第一堆上面一个heapPos =var 尾部第一堆下面一个heapPos =max

//////////////////////////////////////////////////////////////////////////
//服务器命令结构
var SUB_S_CALL = 107									
var SUB_S_GAME_START = 100									//游戏开始
var SUB_S_OUT_CARD = 101									//出牌命令
var SUB_S_SEND_CARD = 102									//发送扑克
var SUB_S_OPERATE_RESULT = 104									//操作命令
var SUB_S_GAME_END = 105									//游戏结束



var CMD_S_Call = 
[
	['DWORD', 'dwBankerUserId'],				 //庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER],//下跑 加顶分
]
//游戏开始
var CMD_S_GameStart = 
[
	['BYTE', 'cbSiceCount'],
	['BYTE', 'cbCaiShenPos'],
	['bool', 'bIsRandBanker'],
	['DWORD', 'dwBankerUserId'],							//庄家用户
	['DWORD', 'dwEastUser'],								//东家用户
	['BYTE', 'cbMagicCardData', MAX_MAGIC_COUNT],	
	['BYTE', 'cbFlowerCardData', MAX_FLOWER_COUNT],
	['BYTE', 'cbLeftCardCount'],	//剩余数目
	['BYTE', 'cbCurFeng'],	
	['BYTE', 'cbReBankerTimes'],	

	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],		//扑克列表
	['WORD', 'wHeapHead'],									//堆立头部
	['WORD', 'wHeapTail'],									//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],				//堆牌信息
	['heapCardItem', 'TurnoverCard', TURNOVER_COUNT_MAGIC],
	['BYTE', 'cbCallRecord', GAME_PLAYER, 1],//下跑 加顶分
]

//出牌命令
var CMD_S_OutCard = 
[
	['WORD', 'wVideoUser'],
	['WORD', 'wOutCardUser'],						//出牌用户
	['BYTE', 'cbOutCardData'],						//出牌扑克
	['BYTE', 'cbActionMask'],						//动作掩码
	['bool', 'isFinishTing'],		
	['bool', 'isInsetFengHeap'],				
]

//发送扑克
var CMD_S_SendCard = 
[
	['WORD', 'wVideoUser'],
	['BYTE', 'cbActionMask'],						//动作掩码
	['WORD', 'wProvideUser'],						//当前出牌用户
	['BYTE', 'cbProvideCardData'],						//供应扑克
	['WORD', 'wCurrentUser'],						//当前出牌用户
	['WORD', 'wTakeCardUser'],						//拿牌用户
	['BYTE', 'cbSendCardCount'], 
	['bool', 'isAutoDisCard'],
	['heapCardItem', 'sendCardArray', MAX_SEND_COUNT], //
]

//操作命令
var CMD_S_OperateResult = 
[	
	['WORD', 'wVideoUser'],
	['BYTE', 'cbActionMask'],						 //动作后动作 动作掩码
	['WORD', 'wProvideUser'],						 //供应用户
	['BYTE', 'cbProvideCardData'],					 //供应扑克
	['WORD', 'wCurrentUser'],						 //当前出牌用户 碰杠会有可能进入动作状态

	['BYTE', 'cbHandCardCount'],					 //手牌数量
	['BYTE', 'cbOperateCode'],						 //操作代码
	['WORD', 'wOperateUser'],						 //操作用户
	['BYTE', 'cbOperateCardCount'],
	['BYTE', 'cbAnGangCard', GAME_PLAYER, MAX_WEAVE],//暗杠
	['BYTE', 'cbTingUserRev'],
	['bool', 'isAutoDisCard'],
	['BYTE', 'cbAllowTingCount'],					
	['BYTE', 'cbAllowTing', MAX_INDEX],				 //出牌听口
	['BYTE', 'cbOperateCardData', MAX_OPERATE_COUNT],//操作扑克
]

//游戏结束
var CMD_S_GameEnd = 
[
	['WORD', 'wWinner'],
	['WORD', 'wExitUser'],							//强退用户
	['BYTE', 'endType'],   							//0强退 1流局 2自摸 3点炮
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],					//供应扑克
	['BYTE', 'cbReBankerTimes'],	
	['BYTE', 'cbWinnerClipValue'],	
	['bool', 'isWinnerVastZhang'],	

	['BYTE', 'cbChengBaoUser', GAME_PLAYER], 		//承包用户
	['DWORD', 'dwChiHuKind', GAME_PLAYER],			//胡牌类型
	['DWORD', 'dwChiHuRight', GAME_PLAYER],			//胡牌类型
	['DWORD', 'dwWinZui'],
	['BYTE', 'cbZhanYiDui', GAME_PLAYER],
	['BYTE', 'cbZhanErDui', GAME_PLAYER],
	['SCORE', 'lFengScore'],
	['SCORE', 'lGangScore'],
	['SCORE', 'lGameScore', GAME_PLAYER],			//游戏积分
	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],	//扑克数据

	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],				//组合数目
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],	//组合扑克
]

//空闲状态
var CMD_S_StatusFree = 
[
	['SCORE', 'lCellScore'],							//基础金币
]

var CMD_S_StatusCall = 
[
	['SCORE', 'lCellScore'],							//基础金币
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER, 1],//下跑 加顶分
]

//游戏状态
var CMD_S_StatusPlay = 
[
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克
	//游戏变量
	['WORD', 'wCurrentUser'],								//当前需要出牌用户
	['LONGLONG', 'lCellScore'],									//单元积分

	['WORD', 'wUserListen'],
	['bool', 'isFinishTing'],
	['BYTE', 'cbAllowTingCount'],
	['BYTE', 'cbAllowTing', MAX_INDEX],	
	['BYTE', 'cbTingUserRev'],
	['bool', 'isAutoDiscard'],

	//状态变量
	['BYTE', 'cbActionMask'],								//动作掩码
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],								//动作扑克
	['BYTE', 'cbLeftCardCount'],							//剩余数目
	['BYTE', 'cbCurFeng'],

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

	['BYTE', 'cbPlayerFlowerCount', GAME_PLAYER],			//丢弃花牌数目
	['BYTE', 'cbPlayerFlowerCardData', GAME_PLAYER, max(1,20)],		//丢弃花牌记录

	['BYTE', 'cbFengCardCount'],							//丢弃风牌数目
	['BYTE', 'cbFengCardData', MAX_FENG_COUNT],	//丢弃花牌记录

	//财神变量
	['BYTE', 'cbMagicCardData', max(1,MAX_MAGIC_COUNT)],
	['BYTE', 'cbFlowerCardData', max(1,MAX_FLOWER_COUNT)],

	['WORD', 'wHeapHead'],							//堆立头部
	['WORD', 'wHeapTail'],							//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],					//堆牌信息
	['heapCardItem', 'TurnoverCard', max(1,TURNOVER_COUNT_MAGIC)],

	['DWORD', 'rrr'],								//庄家用户
	['DWORD', 'dwEastUser'],
	['BYTE', 'cbReBankerTimes'],	
]

//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3									//操作扑克
var SUB_C_CALL = 4									//操作扑克

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

//////////////////////////////////////////////////////////////////////////

//#endif