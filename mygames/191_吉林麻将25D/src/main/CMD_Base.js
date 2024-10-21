//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 191										//游戏 I D
var GAME_NAME = "191_吉林麻将25D"							//游戏名字

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
var MAGIC_CARD_ALLOWOUT = false	

//其他
var MAX_SEND_COUNT = 14//摸到所有花补花 要发一样多的牌 MAX_FLOWER_COUNT	
//客户端执行动作时发给服务器的麻将最大数 如果有补花操作 可能出现摸到所有花补花 MAX_FLOWER_COUNT												
var MAX_OPERATE_COUNT = 14
///////////////游戏配置 end////////////

//逻辑掩码
var MASK_COLOR = 0xF0							//花色掩码
var MASK_VALUE = 0x0F							//数值掩码

//动作标志 
var WIK_NULL = 0x00								//没有类型
var WIK_LEFT = 0x01								//左吃类型
var WIK_CENTER = 0x02							//中吃类型
var WIK_RIGHT = 0x04							//右吃类型
var WIK_PENG = 0x08								//碰牌类型
var WIK_GANG = 0x10								//杠牌类型
var WIK_LISTEN = 0x20							//吃牌类型
var WIK_CHI_HU = 0x40							//吃胡类型
var WIK_REPLACE = 0x1000						//花牌替换
var WIK_SHOWEGG = 0x80

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//一个胡型是否存在 由2进制数中的1位来表示
//0xffffffff 可以表示32位的2进制 所以最多支持32种胡型

var MASK_CHI_HU_RIGHT = 0x0fffffff
//胡牌定义
var CHR_QingYiSe = 0x00000020	//清一色
var CHR_QiXiaoDui = 0x00000080	//七小对
var CHR_DiHu = 0x00000400	//地胡
var CHR_GangKai = 0x00002000	//杠开  
var CHR_QiangGang = 0x00004000	//抢杠  和别人自抓开明杠的牌  
var CHR_BianZhang = 0x00000008  //边张
var CHR_ShouBaYi = 0x00080000  //手把一
var CHR_JiaZhang = 0x00000001  //夹张
var CHR_TianHu = 0x00800000  //天胡
var CHR_PengHu = 0x00000800  //碰碰胡
var CHR_BiMen = 0x00100000  //闭门
//////////////////////////////////////////////////////////////////////////

//#ifdef xxxxxx
var map_mask2Name = 
[
	['CHR_JiaZhang', ' 夹胡 (1番)'],
	['CHR_BiMen', ' 闭门 (1番)'],
	['CHR_QingYiSe', ' 清一色 (1番)'],
	['CHR_PengHu', ' 飘 (3番)'],
	['CHR_GangKai', ' 杠上开花 (1番)'],
	['CHR_ShouBaYi', ' 把一 (1番)'],
	['CHR_BianZhang', ' 边胡 (2番)'],
	['CHR_QiXiaoDui', ' 七小对 (5番)'],
	['CHR_TianHu', ' 天湖 (6番)'],
	['CHR_DiHu', ' 地胡 (6番)'],
]
//#endif

var tag_AddEggInfo =
[
	['bool', 'bIsQEgg'],						
	['BYTE', 'cbCurEggCount'],					
	['BYTE', 'cbOperateEggData'],					
	['BYTE', 'cbWaveItem'],				
	['BYTE', 'cbPosInWave'],					
	['WORD', 'wOperateEggUser'],					
]

//组合子项
var tagWeaveItem = 
[
	['BYTE', 'cbCardDatas', 5],						//组合数据
	['BYTE', 'cbCardCount', 5],						//麻将数量
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
	['bool', 'bOutCard'],   //出牌标志
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
var SUB_S_GAME_TYPE = 108
var SUB_S_LOOK_BAO = 109
var SUB_S_CHANGE_BAO = 106
var SUB_S_OPERATE_EGG = 103
var SUB_S_OPERATEEGG_END = 110



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

	['BYTE', 'cbHandCardData', MAX_COUNT],					//扑克列表
	['WORD', 'wHeapHead'],									//堆立头部
	['WORD', 'wHeapTail'],									//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],				//堆牌信息
	['heapCardItem', 'TurnoverCard', TURNOVER_COUNT_MAGIC],
	['BYTE', 'cbCallRecord', GAME_PLAYER, 1],//下跑 加顶分
]

//出牌命令
var CMD_S_OutCard = 
[
	['WORD', 'wOutCardUser'],						//出牌用户
	['BYTE', 'cbOutCardData'],						//出牌扑克
	['BYTE', 'cbActionMask'],						//动作掩码
	['BYTE', 'cbUserTingMode'],
	['bool', 'isFinishTing', GAME_PLAYER],						
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
	['bool', 'isLastFourCard'],
	['bool', 'isAutoDisCard'],
	['BYTE', 'cbListenUserEggItem', GAME_PLAYER, 2],
	['heapCardItem', 'sendCardArray', MAX_SEND_COUNT], //
]

//看bao
var CMD_S_LookBao = 
[
	['BYTE', 'cbActionMask'],						//动作掩码
	['WORD', 'wLookBaoUser'],						//看但玩家
]

//换宝
var CMD_S_ChangeBao = 
[
	['bool', 'bLookedBao'],		
	['bool', 'bExistBao'],							
	['heapCardItem', 'TurnoverCard', TURNOVER_COUNT_MAGIC],
]

var CMD_S_OperateEggEnd = 
[
	['WORD', 'wCurrentUser'],						
]

//操dan命令	
var CMD_S_OperateEggRes = 
[
	['BYTE', 'cbActionMask'],						 //动作后动作 动作掩码
	['BYTE', 'cbOperateCode'],						 //操作代码
	['WORD', 'wOperateUser'],						 //操作用户
	['BYTE', 'cbOperateCardCount'],
	['BYTE', 'cbOperateCardData', MAX_OPERATE_COUNT],//操作扑克
]

//操作命令
var CMD_S_OperateResult = 
[
	['BYTE', 'cbActionMask'],						 //动作后动作 动作掩码
	['WORD', 'wProvideUser'],						 //供应用户
	['BYTE', 'cbProvideCardData'],					 //供应扑克
	['WORD', 'wCurrentUser'],						 //当前出牌用户 碰杠会有可能进入动作状态
	['BYTE', 'cbListenUserEggItem', GAME_PLAYER, 2], //听后补蛋数据
	['BYTE', 'cbEggStatus'],						 //补蛋类型
	['tag_AddEggInfo', 'stAddEggInfo'],
	['heapCardItem', 'TurnoverCard', TURNOVER_COUNT_MAGIC],
	['BYTE', 'cbHandCardCount'],					 //手牌数量
	['BYTE', 'cbOperateCode'],						 //操作代码
	['WORD', 'wOperateUser'],						 //操作用户
	['BYTE', 'cbOperateCardCount'],
	['bool', 'isShowEggTime'],
	['BYTE', 'cbUserTingMode'],						 //听牌模式

	['BYTE', 'cbTingUserRev', GAME_PLAYER],
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
	['BYTE', 'cbWinnerClipValue'],	
	['bool', 'isWinnerVastZhang'],	

	['BYTE', 'cbChengBaoUser', GAME_PLAYER], 		//承包用户
	['DWORD', 'dwChiHuKind', GAME_PLAYER],			//胡牌类型
	['DWORD', 'dwChiHuRight', GAME_PLAYER],			//胡牌类型
	['BYTE', 'cbWinType'],
	['DWORD', 'dwWinFan'],
	['DWORD', 'dwWinFan2'],
	['bool', 'isBaoZhuang'],
	['SCORE', 'lGameScore', GAME_PLAYER],			//游戏积分
	['SCORE', 'lGangScore', GAME_PLAYER],
	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],	//扑克数据

	['tag_AddEggInfo', 'stAddEggInfo'],
	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],				//组合数目
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],	//组合扑克
]

//空闲状态
var CMD_S_StatusFree = 
[
	['SCORE', 'lCellScore'],							//基础金币
	['BYTE', 'cbGameType'],
	['bool', 'bHaveSetType'],
]

//游戏类型选择
var CMD_S_GameType = 
[
	['BYTE', 'cbGameType'],						    	//游戏类型
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

	['BYTE', 'cbUserListen', GAME_PLAYER],
	['bool', 'isFinishTing', GAME_PLAYER],
	['BYTE', 'cbAllowTingCount'],
	['BYTE', 'cbAllowTing', MAX_INDEX],	
	['BYTE', 'cbTingUserRev', GAME_PLAYER],
	['bool', 'isAutoDiscard'],
	['BYTE', 'cbListenUserEggItem', GAME_PLAYER, 2],
	['bool', 'bLookedBao', GAME_PLAYER],

	//状态变量
	['BYTE', 'cbActionMask'],								//动作掩码
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],								//动作扑克
	['BYTE', 'cbLeftCardCount'],							//剩余数目
	['BYTE', 'cbCurFeng'],
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
	['bool', 'isLastFourCard'],
	['bool', 'isAutoDisCard2'],
	['bool', 'isShowEggTime'],
]

//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3								//操作扑克
var SUB_C_CALL = 4										//操作扑克
var SUB_C_TYPE_SEL = 5

//出牌命令
var CMD_C_OutCard = 
[
	['BYTE', 'cbOutCardData'],							//扑克数据
]

var CMD_C_GameType = 
[
	['BYTE', 'cbGameType'],						    	//游戏类型
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