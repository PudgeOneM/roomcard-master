//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 131								//游戏 I D
var GAME_NAME = "海宁敲响麻将"					//游戏名字

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
var MAX_MAGIC_COUNT = 4//无财神时设置为1 m_cbMagicIndex[MAX_MAGIC_COUNT]不赋值即可
var TURNOVER_COUNT_MAGIC = 1//翻财神时翻的麻将数 		
var MAGIC_CARD_ALLOWOUT = true	

//其他
var MAX_SEND_COUNT = 4//摸到所有花补花 要发一样多的牌 MAX_FLOWER_COUNT	
//客户端执行动作时发给服务器的麻将最大数 如果有补花操作 可能出现摸到所有花补花 MAX_FLOWER_COUNT												
var MAX_OPERATE_COUNT = 4
var SEND_DISCARD_CARD_DATA = INVALID_CARD_DATA  //send这个carddata 客户端会以丢弃牌处理(不插入手牌)
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
var CHR_SanHaoHuaQiDui = 0x00000002 //三豪华七对  由同一种花色及风牌组成的胡牌 
var CHR_BaoTou = 0x00000004 //暴头 由同一种花色牌组成的胡牌 
var CHR_CaiPiao = 0x00000008 //财飘 由任意花色及风字组成的碰胡   
var CHR_GangBao = 0x00000010 //杠暴  由同一种花色及风字组成的碰胡  
var CHR_GangPiao = 0x00000020 //杠飘  由同一种花色组成的碰胡
var CHR_QiXiaoDui = 0x00000040 //七对 任意花色的七个对子组成 
var CHR_PiaoGang = 0x00000080 //飘杠 同一种花色及风牌的七个对子组成 
var CHR_QingQiDui = 0x00000100 //清七对 同一种花色的七个对子组成    
var CHR_QuanFengZi = 0x00000200 //全风字 14张全部由风组成的牌型（可以是乱牌） 
var CHR_QuanFengZiDaPengHu = 0x00000400 //全风字大碰胡  全都是风字组成的碰碰胡 
var CHR_QiFengDao = 0x00000800 //七风倒 牌里包含7张不同风字（不可吃冲、可自摸） 
var CHR_SanCaiDao = 0x00001000 //三财倒 牌里包含3张财神（不可吃冲、可自摸）  
var CHR_GangKai = 0x00002000 //杠上开花（杠开）    开杠抓进的牌成和牌   
var CHR_QiangGang = 0x00004000 //抢杠  和别人自抓开明杠的牌  
var CHR_QingHaoHuaQiDui = 0x00008000 //天胡
var CHR_QingErHaoHuaQiDui = 0x00010000 //地胡 庄家出第一张点炮下家和是地和，牌型不限。  
var CHR_QingSanHaoHuaQiDui = 0x00020000 // 单吊 不管什么牌型，最后成单调的都算特殊牌型。
var CHR_HaiDiLaoYue = 0x00040000 // 海底捞月 算特殊牌型，即最后一个玩家抓最后一张牌时胡牌，那么就称之为海底捞月。
var CHR_DaDiao = 0x00080000 //大吊
var CHR_SanBaiDa = 0x00100000 //三百搭      
var CHR_SiBaiDa = 0x00200000 //四百搭   
var CHR_QuanLaoTou = 0x00400000 //全老头
var CHR_QuanLaoTouCaiPiao = 0x00800000 //全老头财飘
var CHR_HasCaiShen = 0x01000000 //胡型里是否有财神
var CHR_ShiSanYao = 0x02000000 //十三幺：东南西北中发白，一九万，一九饼，一九条，加其中任意一张组成对，混不能做为财神使用，只能按牌面显示使用，例混为三万时，只能做为三万使用。
var CHR_HaoHuaQiDui = 0x04000000 //豪华七对
var CHR_ErHaoHuaQiDui = 0x08000000 //二豪华七对


//#ifdef xxxxxx
var map_mask2Name = 
[
 ['CHR_PingHu', '自摸'],
 ['CHR_SanHaoHuaQiDui', '三豪华七对'],
 ['CHR_BaoTou', '暴头'],
 ['CHR_CaiPiao', '财飘'],
 ['CHR_GangBao', '杠暴'],
 ['CHR_GangPiao', '杠飘'],
 ['CHR_QiXiaoDui', '七小对'],
 ['CHR_PiaoGang', '飘杠'],
 ['CHR_QingQiDui', '清七对'],
 ['CHR_QuanFengZi', '全风字'],
 ['CHR_QuanFengZiDaPengHu', '全风字大碰胡'],
 ['CHR_QiFengDao', '七风倒'],
 ['CHR_SanCaiDao', '四混'],
 ['CHR_GangKai', '杠开'],
 ['CHR_QiangGang', '抢杠'],
 ['CHR_QingHaoHuaQiDui', '清豪华七对'],
 ['CHR_QingErHaoHuaQiDui', '清二豪华七对'],
 ['CHR_QingSanHaoHuaQiDui', '清三豪华七对'],
 ['CHR_HaiDiLaoYue', '海底捞月'],
 ['CHR_DaDiao', '大吊'],
 ['CHR_SanBaiDa', '三百搭'],
 ['CHR_SiBaiDa', '四百搭'],
 ['CHR_QuanLaoTou', '全老头'],
 ['CHR_QuanLaoTouCaiPiao', '全老头财飘'],
 ['CHR_ShiSanYao', '十三幺'],
 ['CHR_HaoHuaQiDui', '豪华七对'],
 ['CHR_ErHaoHuaQiDui', '二豪华七对'],
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
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],//下跑 加顶分
]

//游戏开始
var CMD_S_GameStart = 
[
	['BYTE', 'cbSiceCount'],
	['bool', 'bIsRandBanker'],
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbMagicCardData', MAX_MAGIC_COUNT],					
	['BYTE', 'cbFlowerCardData', MAX_FLOWER_COUNT],
	['BYTE', 'cbLeftCardCount'],	//剩余数目

	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],					//扑克列表
	['WORD', 'wHeapHead'],							//堆立头部
	['WORD', 'wHeapTail'],							//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],					//堆牌信息
	['heapCardItem', 'TurnoverCard', TURNOVER_COUNT_MAGIC],

	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],//下跑 加顶分
	['BYTE', 'dicerandom1'],
	['BYTE', 'dicerandom2'],
]

//出牌命令
var CMD_S_OutCard = 
[
	['WORD', 'cbAutocard', 2],
	['bool', 'cbAutocardUser', GAME_PLAYER],
	['WORD', 'wOutCardUser'],						//出牌用户
	['BYTE', 'cbOutCardData'],						//出牌扑克
	['BYTE', 'cbActionMask'],						//动作掩码
	['bool', 'cbcaipiao'],
]

//发送扑克
var CMD_S_SendCard = 
[
	['WORD', 'cbAutocard', 2],
	['bool', 'cbAutocardUser', GAME_PLAYER],
	['BYTE', 'cbActionMask'],						//动作掩码
	['BYTE', 'cbProvideCardData'],						//供应扑克
	['WORD', 'wCurrentUser'],						//当前出牌用户
	['WORD', 'wTakeCardUser'],						//拿牌用户
	['BYTE', 'cbSendCardCount'], 
	['heapCardItem', 'sendCardArray', MAX_SEND_COUNT], //
	['bool', 'cbcaipiao'],
	
]

//操作命令
var CMD_S_OperateResult = 
[	
	['WORD', 'cbAutocard', 2],
	['bool', 'cbAutocardUser', GAME_PLAYER],
	['BYTE', 'cbActionMask'],						//动作后动作 动作掩码
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],						//供应扑克
	['WORD', 'wCurrentUser'],						//当前出牌用户 碰杠会有可能进入动作状态
	['BYTE', 'cbOperateCode'],						//操作代码
	['WORD', 'wOperateUser'],						//操作用户
	['BYTE', 'cbOperateCardCount'],
	['BYTE', 'cbOperateCardData', MAX_OPERATE_COUNT],					//操作扑克
]

//游戏结束
var CMD_S_GameEnd = 
[

	['bool', 'cblianzhuang'],
	['WORD', 'wWinner'],
	['WORD', 'wExitUser'],							//强退用户
	['BYTE', 'endType'],   							//0强退 1流局 2自摸 3点炮
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],						//供应扑克
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
	['WORD', 'cbAutocard', 2],
	['bool', 'cbAutocardUser', GAME_PLAYER],
	//游戏变量
	['SCORE', 'lCellScore'],									//单元积分
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['WORD', 'wCurrentUser'],								//当前需要出牌用户
	['WORD', 'wTakeCardUser'],						//拿牌用户
	//状态变量
	['BYTE', 'cbActionMask'],								//动作掩码
	['WORD', 'wProvideUser'],						//供应用户
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
	['BYTE', 'cbEatPengCargData1'],
	['BYTE', 'cbEatPengCargData2'],
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

	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],//下跑 加顶分

	['BYTE', 'dicerandom1'],
	['BYTE', 'dicerandom2'],
]
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3									//操作扑克
var SUB_C_CALL = 4									//操作扑克
var SUB_C_SEND_CARD = 5
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