//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 162								//游戏 I D
var GAME_NAME = "吉安推精麻将"					//游戏名字


//组件属性
var GAME_PLAYER = 4								//游戏人数
var VERSION_SERVER = PROCESS_VERSION(6,0,3)					//程序版本
var VERSION_CLIENT = PROCESS_VERSION(6,0,3)					//程序版本

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
var MAX_INDEX = 34						//最大索引 
var MAX_COUNT = 14						//最大手牌数
var MAX_REPERTORY = 136						//最大库存 
var MAX_FLOWER_COUNT = 1						//无花时设置为1 m_cbFlowerIndex[MAX_FLOWER_COUNT]不赋值即可   
var MAX_RIGHT_COUNT = 1						//最大权位DWORD个数 允许几个人同时胡(一炮多响)
var MAX_WEAVE = 4						//最大组合
var HEAP_FULL_COUNT = 34						//堆立全牌 

//假财神
var REPLACE_CARD_DATA = INVALID_CARD_DATA			//无假财神时设置为INVALID_CARD_DATA
var REPLACE_CARD_ALLOWSELF = false	

//财神
var MAX_MAGIC_COUNT = 2					//无财神时设置为1 m_cbMagicIndex[MAX_MAGIC_COUNT]不赋值即可
var TURNOVER_COUNT_MAGIC = 1					//无财神时设置为1 翻财神时翻的麻将数 		
var MAGIC_CARD_ALLOWOUT = false	

//其他
var MAX_SEND_COUNT = 12						//摸到所有花补花 要发一样多的牌 MAX_FLOWER_COUNT											
var MAX_OPERATE_COUNT = 12						//客户端执行动作时发给服务器的麻将最大数 如果有补花操作 可能出现摸到所有花补花 MAX_FLOWER_COUNT		
var SEND_DISCARD_CARD_DATA = INVALID_CARD_DATA				//send这个carddata 客户端会以丢弃牌处理(不插入手牌)
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
var WIK_CHI_A = 0x20								//风字吃
var WIK_CHI_HU = 0x40								//吃胡类型
var WIK_CHI_B = 0x80								//风字吃

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//一个胡型是否存在 由2进制数中的1位来表示
//0xffffffff 可以表示32位的2进制 所以最多支持32种胡型

var MASK_CHI_HU_RIGHT = 0x0fffffff
//胡牌定义
var CHR_PingHu = 0x00000001   //平胡
var CHR_GangKai = 0x00000002	//杠上开花
var CHR_HaiDiLaoYue = 0x00000004	//海底捞月
var CHR_QiangGang = 0x00000008	//抢杠
var CHR_Zimo = 0x00000010	//自摸
var CHR_DianPao = 0x00000020	//点炮
var CHR_DeGuo = 0x00000040	//德国
var CHR_DeZhongDe = 0x00000080	//德中德
var CHR_JingDiao = 0x00000100	//精吊
var CHR_DaQiDui = 0x00000200	//大七对
var CHR_XoQiDui = 0x00000400	//小七对
var CHR_ShiSanLan = 0x00000800	//十三烂
var CHR_QiXingShiSanLan = 0x00001000	//七星十三烂

//#ifdef xxxxxx
var map_mask2Name = 
[
	['CHR_PingHu', '平胡'],
	['CHR_GangKai', '杠上开花'],
	['CHR_HaiDiLaoYue', '海底捞月'],
	['CHR_QiangGang', '抢杠'],
	['CHR_Zimo', '自摸'],
	['CHR_DianPao', '点炮'],
	['CHR_DeGuo', '德国'],
	['CHR_DeZhongDe', '德中德'],
	['CHR_JingDiao', '精吊'],
	['CHR_DaQiDui', '大七对'],
	['CHR_XoQiDui', '小七对'],
	['CHR_ShiSanLan', '十三烂'],
	['CHR_QiXingShiSanLan', '七星十三烂'],
]
//#endif

//////////////////////////////////////////////////////////////////////////

//组合子项
var tagWeaveItem = 
[
	['BYTE', 'cbWeaveKind'],						//组合类型
	['BYTE', 'cbCenterCardData'],					//中心扑克
	['BYTE', 'cbPublicCard'],						//公开标志
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbCardData', 4],					//组合数据
]

//类型子项
var heapCardItem = 
[
	['WORD', 'wHeapDir'],						//发牌方位
	['WORD', 'wHeapPos'],						//发牌位置	
	['BYTE', 'cbCardData'],						//发牌数据 INVALID_CARD_DATA表示是丢弃牌 客户端不会往手牌塞牌
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
var SUB_S_SELECT = 111

var CMD_S_SELECT_RESULT = 
[
	['BYTE', 'bGameSetResult', 8],	
	['bool', 'bGameHasSelect'],
]

var CMD_S_Call = 
[
	['DWORD', 'dwBankerUserId'],										//庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],							//下跑 加顶分
]

//游戏开始
var CMD_S_GameStart = 
[
	['BYTE', 'cbSiceCount', 4],
	['bool', 'bIsRandBanker'],
	['DWORD', 'dwBankerUserId'],						//庄家用户
	['BYTE', 'cbMagicCardData', MAX_MAGIC_COUNT],					
	['BYTE', 'cbFlowerCardData', MAX_FLOWER_COUNT],
	['BYTE', 'cbLeftCardCount'],						//剩余数目

	['BYTE', 'cbHandCardData', MAX_COUNT],				//扑克列表
	['WORD', 'wHeapHead'],							//堆立头部
	['WORD', 'wHeapTail'],							//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],			//堆牌信息
	['heapCardItem', 'TurnoverCard', TURNOVER_COUNT_MAGIC],

	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],			//下跑 加顶分
	['BYTE', 'bGameSetResult', 8],
	['bool', 'bGameHasSelect'],
]

//出牌命令
var CMD_S_OutCard = 
[
	['WORD', 'wOutCardUser'],						//出牌用户
	['BYTE', 'cbOutCardData'],					//出牌扑克
	['BYTE', 'cbActionMask'],						//动作掩码
]

//发送扑克
var CMD_S_SendCard = 
[
	['BYTE', 'cbActionMask'],						//动作掩码
	['BYTE', 'cbProvideCardData'],				//供应扑克
	['WORD', 'wCurrentUser'],						//当前出牌用户
	['WORD', 'wTakeCardUser'],					//拿牌用户
	['BYTE', 'cbSendCardCount'], 
	['heapCardItem', 'sendCardArray', MAX_SEND_COUNT], 
]

//操作命令
var CMD_S_OperateResult = 
[	
	['BYTE', 'cbActionMask'],						//动作后动作 动作掩码
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],				//供应扑克
	['WORD', 'wCurrentUser'],						//当前出牌用户 碰杠会有可能进入动作状态


	['BYTE', 'cbOperateCode'],					//操作代码
	['WORD', 'wOperateUser'],						//操作用户
	['BYTE', 'cbOperateCardCount'],
	['BYTE', 'cbOperateCardData', MAX_OPERATE_COUNT],//操作扑克
	['WORD', 'wSelfActionUser'],
]

//游戏结束
var CMD_S_GameEnd = 
[
	['WORD', 'wWinner'],
	['WORD', 'wExitUser'],								//强退用户
	['BYTE', 'endType'],   								//0强退 1流局 2自摸 3点炮
	['WORD', 'wProvideUser'],								//供应用户
	['BYTE', 'cbProvideCardData'],						//供应扑克
	['DWORD', 'dwChiHuKind', GAME_PLAYER],					//胡牌类型
	['DWORD', 'dwChiHuRight', GAME_PLAYER],					//胡牌类型

	['SCORE', 'lGameScore', GAME_PLAYER],					//游戏积分
	['BYTE', 'cbHandCardCount', GAME_PLAYER],				//扑克数目
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],		//扑克数据

	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克

	//吉安规则
	['BYTE', 'cbMagicCount', GAME_PLAYER, 5],
	['BYTE', 'cbNextGangCount'],
	['WORD', 'wBaWangUser'],
	['BYTE', 'cbChongGuanFlag', GAME_PLAYER],
	['SCORE', 'lEveryScore', GAME_PLAYER, 2],
	['SCORE', 'lGangScore', GAME_PLAYER],
	['bool', 'bIsChaoZhuang'],
]

//空闲状态
var CMD_S_StatusFree = 
[
	['SCORE', 'lCellScore'],								//基础金币
	['bool', 'bGameHasSelect'],
	['BYTE', 'bGameSetResult', 8],	
]

var CMD_S_StatusCall = 
[
	['SCORE', 'lCellScore'],												//基础金币
	['DWORD', 'dwBankerUserId'],											//庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],								//下跑 加顶分
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
	['BYTE', 'cbProvideCardData'],						//动作扑克
	['BYTE', 'cbLeftCardCount'],							//剩余数目

	//出牌信息
	['WORD', 'wOutCardUser'],								//出牌完成用户
	['BYTE', 'cbOutCardData'],							//出牌扑克
	['BYTE', 'cbDiscardCount', GAME_PLAYER],				//丢弃数目
	['BYTE', 'cbDiscardCardData', GAME_PLAYER, 60],			//丢弃记录

	//扑克数据
	['BYTE', 'cbHandCardCount', GAME_PLAYER],				//扑克数目
	['BYTE', 'cbHandCardData', MAX_COUNT],					//扑克列表

	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克

	['BYTE', 'cbPlayerFlowerCount', GAME_PLAYER],			//丢弃花牌数目
	['BYTE', 'cbPlayerFlowerCardData', GAME_PLAYER, MAX_FLOWER_COUNT],		//丢弃花牌记录

	//财神变量
	['BYTE', 'cbMagicCardData', MAX_MAGIC_COUNT],
	['BYTE', 'cbFlowerCardData', MAX_FLOWER_COUNT],

	['WORD', 'wHeapHead'],									//堆立头部
	['WORD', 'wHeapTail'],									//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],					//堆牌信息
	['heapCardItem', 'TurnoverCard', TURNOVER_COUNT_MAGIC],

	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],					//下跑 加顶分
	['WORD', 'wSelfActionUser'],
	['BYTE', 'bGameSetResult', 8],
	['bool', 'bGameHasSelect'],
]
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3									//操作扑克
var SUB_C_CALL = 4									//操作扑克
var SUB_C_SELECT = 10

var CMD_C_SELECT_RESULT = 
[
	['BYTE', 'bGameSetResult', 8],
	['bool', 'bGameHasSelect'],
]

//出牌命令
var CMD_C_OutCard = 
[
	['BYTE', 'cbOutCardData'],						//扑克数据
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