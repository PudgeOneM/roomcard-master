//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 169								//游戏 I D
var GAME_NAME = "政和麻将"					//游戏名字


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
var MAX_COUNT = 17						//最大手牌数
var MAX_REPERTORY = 112						//最大库存 
var MAX_FLOWER_COUNT = 1						//无花时设置为1 m_cbFlowerIndex[MAX_FLOWER_COUNT]不赋值即可   
var MAX_RIGHT_COUNT = 1						//最大权位DWORD个数 允许几个人同时胡(一炮多响)
var MAX_WEAVE = 5						//最大组合
var HEAP_FULL_COUNT = 28						//堆立全牌 

//假财神
var REPLACE_CARD_DATA = INVALID_CARD_DATA			//无假财神时设置为INVALID_CARD_DATA
var REPLACE_CARD_ALLOWSELF = false	

//财神
var MAX_MAGIC_COUNT = 1					//无财神时设置为1 m_cbMagicIndex[MAX_MAGIC_COUNT]不赋值即可
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
var WIK_LISTEN = 0x20								//吃牌类型
var WIK_CHI_HU = 0x40								//吃胡类型
var WIK_REPLACE = 0x80								//花牌替换

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//一个胡型是否存在 由2进制数中的1位来表示
//0xffffffff 可以表示32位的2进制 所以最多支持32种胡型

var MASK_CHI_HU_RIGHT = 0x0fffffff
//胡牌定义（注：该部分胡型的大小顺序不能更改，否则胡牌时会出错）
var CHR_PingHu = 0x00000001   //平胡
var CHR_GangKai = 0x00000002	//杠上开花（杠开）    开杠抓进的牌成和牌  
var CHR_QiangGang = 0x00000004	//抢杠  和别人自抓开明杠的牌  
var CHR_QiDuiZi = 0x00000008	//七对子
var CHR_SanJinDao = 0x00000010	//三金倒
var CHR_JinQue = 0x00000020	//金雀
var CHR_SiJinDao = 0x00000040	//四金倒
var CHR_DiHu = 0x00000080	//地胡
var CHR_TianHu = 0x00000100	//天胡
var CHR_JinShu = 0x00000200	//金树
var CHR_QingYiSe = 0x00000400	//清一色
var CHR_JinGang = 0x00000800	//金杠

//#ifdef xxxxxx
var map_mask2Name = 
[
	['CHR_PingHu', '普通胡'],
	['CHR_GangKai', '杠上开花'],
	['CHR_QiangGang', '抢杠'],
	['CHR_QiDuiZi', '七对子'],
	['CHR_SanJinDao', '三金倒'],
	['CHR_JinQue', '金雀'],
	['CHR_SiJinDao', '四金倒'],
	['CHR_DiHu', '地胡'],
	['CHR_TianHu', '天胡'],
	['CHR_JinShu', '金树'],
	['CHR_QingYiSe', '清一色'],
	['CHR_JinGang', '金杠'],
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
var SUB_S_FIRSTROUND = 106									//政和

var CMD_S_Call = 
[
	['DWORD', 'dwBankerUserId'],										//庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],								//下跑 加顶分
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
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],	//扑克列表
	['WORD', 'wHeapHead'],							//堆立头部
	['WORD', 'wHeapTail'],							//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],			//堆牌信息
	['heapCardItem', 'TurnoverCard', TURNOVER_COUNT_MAGIC],
	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],			//下跑 加顶分
]

//出牌命令
var CMD_S_OutCard = 
[
	['WORD', 'wOutCardUser'],						//出牌用户
	['BYTE', 'cbOutCardData'],					//出牌扑克
	['BYTE', 'cbActionMask'],						//动作掩码
	['BYTE', 'cbForbidOutData', GAME_PLAYER, 2],	//政和
	['BYTE', 'cbMaxRightType'],
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
	['BYTE', 'cbFirstRound'],						//政和
	['BYTE', 'cbMaxRightType'],
]

//政和 11.10弃用
var CMD_S_FIRSTROUND = 
[
	['WORD', 'wHCurrentUser'],
	['WORD', 'wHProUser'],
	['BYTE', 'cbHActionMask'],
]

//政和 11.10弃用
//struct CMD_S_AFTERFIRSTROUND
//{
//	WORD							wHCurrentUser;
//};

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
	['BYTE', 'cbForbidOutData', GAME_PLAYER, 2],	 //政和
	['bool', 'bIsWarningQYS'],
	['WORD', 'wWarningUser', GAME_PLAYER],
	['BYTE', 'bIsGangAnOrMn'],
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
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克
	['BYTE', 'cbForbidOutData', GAME_PLAYER, 2],			//政和
	['BYTE', 'cbNextZhuangCount'],
	['bool', 'bIsNeedChengBao'],
	['WORD', 'wWarningUser', GAME_PLAYER],
	['BYTE', 'cbMaxRightType', GAME_PLAYER],
	['bool', 'bComplexHuType', 3],
]

//空闲状态
var CMD_S_StatusFree = 
[
	['SCORE', 'lCellScore'],								//基础金币
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

	['BYTE', 'cbForbidOutData', GAME_PLAYER, 2],//政和
	['BYTE', 'cbFirstRound'],
	['bool', 'bIsWarningQYS'],
	['WORD', 'wWarningUser', GAME_PLAYER],
	['BYTE', 'cbMaxRightType'],
]
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3									//操作扑克
var SUB_C_CALL = 4									//操作扑克

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