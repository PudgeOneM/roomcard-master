//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 167								//游戏 I D
var GAME_NAME = "167_四川麻将血战到底"			//游戏名字

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
var MAX_INDEX = 27	//最大索引 
var MAX_COUNT = 14	//最大手牌数
var MAX_REPERTORY = 108	//最大库存   
var MAX_RIGHT_COUNT = 1	//最大权位DWORD个数 允许几个人同时胡(一炮多响)
var MAX_WEAVE = 4	//最大组合
var HEAP_FULL_COUNT = 26	//堆立全牌 一个玩家面前的牌堆包含的麻将数
var HEAP_FULL_BANKERCOUNT = 30 //庄家牌堆

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
var CHR_HunYiSe = 0x00000002	//混一色  由同一种花色及风牌组成的胡牌 
var CHR_QingYiSe = 0x00000004	//清一色 由同一种花色牌组成的胡牌 
var CHR_PengPengHu = 0x00000008	//碰碰胡 由任意花色及风字组成的碰胡   
var CHR_YaoJiu = 0x00000010	//混碰  由同一种花色及风字组成的碰胡  
var CHR_QingPeng = 0x00000020	//清碰  由同一种花色组成的碰胡
var CHR_QiXiaoDui = 0x00000040	//七小对 任意花色的七个对子组成 
var CHR_JiangDaDui = 0x00000080	//将大对
var CHR_QingQiDui = 0x00000100	//清七对 同一种花色的七个对子组成    
var CHR_DragonQiDui = 0x00000200	//龙七对
var CHR_JiangQiDui = 0x02000000	//将七对
var CHR_QDragonQiDui = 0x00000400	//清龙七对
var CHR_QingYaoJiu = 0x00000800	//清幺九
var CHR_GangShangPao = 0x00001000	//杠上炮
var CHR_GangKai = 0x00002000	//杠上开花（杠开）    开杠抓进的牌成和牌   
var CHR_QiangGang = 0x00004000	//抢杠  和别人自抓开明杠的牌  
var CHR_TianHu = 0x00008000	//天胡
var CHR_DiHu = 0x00010000	//地胡 庄家出第一张点炮下家和是地和，牌型不限。  
var CHR_Gen1 = 0x00020000
var CHR_HaiDiLaoYue = 0x00040000	// 海底捞月 算特殊牌型，即最后一个玩家抓最后一张牌时胡牌，那么就称之为海底捞月。
var CHR_Gen2 = 0x00080000	
var CHR_Gen3 = 0x00100000	
var CHR_Gen4 = 0x00200000	
var CHR_ZiMo = 0x00400000  
var CHR_MenQing = 0x04000000
var CHR_ZhongZhang = 0x08000000
var CHR_JinGouHu = 0x01000000

//////////////////////////////////////////////////////////////////////////
////#ifdef xxxxxx
var map_mask2Name = 
[
	['CHR_PingHu', '平胡 (0番)'],
	['CHR_HunYiSe', '混一色'],
	['CHR_QingYiSe', '清一色 (2番)'],
	['CHR_PengPengHu', '大对子 (1番)'],
	['CHR_YaoJiu', '幺九 (3番)'],
	['CHR_QingPeng', '清大对 (3番)'],
	['CHR_QiXiaoDui', '七小对 (2番)'],
	['CHR_JiangDaDui', '将大对 (3番)'],
	['CHR_QingQiDui', '清七对 (4番)'],
	['CHR_DragonQiDui', '龙七对 (3番)'],
	['CHR_JiangQiDui', '将七对 (4番)'],
	['CHR_QDragonQiDui', '清龙七对 (5番)'],
	['CHR_QingYaoJiu', '清幺九 (4番)'],
	['CHR_GangShangPao', '杠上炮 (1番)'],
	['CHR_GangKai', '杠上花 (1番)'],
	['CHR_QiangGang', '抢杠 (1番)'],
	['CHR_TianHu', '天胡 (3番)'],
	['CHR_DiHu', '地胡 (2番)'],
	['CHR_Gen1', '根 (1番)*1'],
	['CHR_HaiDiLaoYue', '海底捞月 (1番)'],
	['CHR_Gen2', '根 (1番)*2'],
	['CHR_Gen3', '根 (1番)*3'],
	['CHR_Gen4', '根 (1番)*4'],
	['CHR_ZiMo', '自摸 (1番)'],
	['CHR_QiFengLanBaiDa', '七风烂百搭'],
	['CHR_MenQing', '门清 (1番)'],
	['CHR_ZhongZhang', '中张 (1番)'],
	['CHR_JinGouHu', '金钩胡 (1番)'],
]
//#endif
////////////////////////////////////////////////////////////////////////////////

//组合子项
var tagWeaveItem = 
[
	['BYTE', 'cbWeaveKind'],						//组合类型
	['BYTE', 'cbCenterCardData'],					//中心扑克
	['BYTE', 'cbPublicCard'],						//公开标志
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbIsCalScore'],						//组合数据
	['BYTE', 'cbCardData', 4],						//组合数据
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
var SUB_S_OPERATE_RESULT = 104								//操作命令
var SUB_S_GAME_END = 105									//游戏结束
var SUB_S_OPENINGOPERATE = 106								//开局操作
var SUB_S_GANG_SCORE = 108									//用户补牌
var SUB_S_GAME_TYPE = 103
var SUB_S_GAME_CHANGE = 109
var SUB_S_GAME_CHANGESEL = 110
var SUB_S_GAME_RECOMMEND = 111

var CMD_S_Recommend = 
[
	['WORD', 'wRevInfoUser'],
	['BYTE', 'cbRecommend', 3],
]

var CMD_S_Sel = 
[
	['BYTE', 'cbCallRecord', GAME_PLAYER],   
]

var CMD_S_ChangeCardSel = 
[
	['WORD', 'wOperateUser'],
	['BYTE', 'isUserSelChange', GAME_PLAYER],
	['BYTE', 'cbDeleteCards', 3],
]

//游戏开始
var CMD_S_GameStart = 
[
	['BYTE', 'cbSiceCount'],
	['bool', 'bIsRandBanker'],
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbMagicCardData', MAX_MAGIC_COUNT],					
	['BYTE', 'cbLeftCardCount'],	//剩余数目

	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],					//扑克列表
	['WORD', 'wHeapHead'],									//堆立头部
	['WORD', 'wHeapTail'],									//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],				//堆牌信息
	['heapCardItem', 'TurnoverCard', TURNOVER_COUNT_MAGIC],

	['BYTE', 'cbCallRecord', GAME_PLAYER],//下跑 加顶分
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
	['BYTE', 'cbLastCardCount'], 
	['heapCardItem', 'sendCardArray', MAX_SEND_COUNT], //
]

var CMD_S_OpeningMask = 
[
	['WORD', 'wRevInfoUser'],
	['WORD', 'wCurrentUser'],						//当前出牌用户
	['WORD', 'wTakeCardUser'],						//当前出牌用户
	['BYTE', 'cbProvideCardData'],					//供应扑克
	['BYTE', 'cbActionMask'],						//动作掩码
]

//操作命令
var CMD_S_OperateResult = 
[	
	['BYTE', 'cbActionMask'],						//动作后动作 动作掩码
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],						//供应扑克
	['WORD', 'wCurrentUser'],						//当前出牌用户 碰杠会有可能进入动作状态
	['WORD', 'wRevInfoUser'],
	['BYTE', 'cbHandCardCount'],					//手牌数量
	['BYTE', 'cbOperateCode'],						//操作代码
	['WORD', 'wOperateUser'],						//操作用户
	['BYTE', 'cbOperateCardCount'],
	['BYTE', 'cbOperateCardData', MAX_OPERATE_COUNT],					//操作扑克
]

var CMD_S_GangScore =
[
	['SCORE', 'lGangScore', GAME_PLAYER],			//游戏积分
]

//游戏结束
var CMD_S_GameEnd = 
[
	['WORD', 'wWinner'],
	['WORD', 'wExitUser'],							//强退用户
	['BYTE', 'endType'],   							//0强退 1流局 2自摸 3点炮
	['WORD', 'wProvideUser'],						//供应用户
	['WORD',  'wFan'],
	['BYTE', 'cbProvideCardData'],					//供应扑克
	['BYTE', 'isEndGame'],							//结束游戏
	['BYTE', 'cbChengBaoUser', GAME_PLAYER], 		//承包用户
	['DWORD', 'dwChiHuKind', GAME_PLAYER],			//胡牌类型
	['DWORD', 'dwChiHuRight', GAME_PLAYER],			//胡牌类型
	['SCORE', 'lGameScore', GAME_PLAYER],			//游戏积分
	['SCORE', 'lPigScore', GAME_PLAYER],			//游戏积分
	['SCORE', 'lChaJiao', GAME_PLAYER],				//游戏积分
	['SCORE', 'lBuChaJia', GAME_PLAYER],			//游戏积分
	['SCORE', 'lTuiShui', GAME_PLAYER],				//游戏积分
	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],	//扑克数据
	['BYTE', 'cbGameHuType', GAME_PLAYER],			//胡牌类型
	['BYTE', 'cbWinCardData', GAME_PLAYER],
	['BYTE', 'cbWinnerOrder', GAME_PLAYER],

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
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER],//下跑 加顶分
]

var CMD_ChangeCard = 
[
	['BYTE', 'cbDeleteCards', 3],
	['BYTE', 'cbAddCards', 3],
]

var CMD_S_ChangeCards = 
[
	['bool', 'isInit'],
	['CMD_ChangeCard', 'stChangeCard', GAME_PLAYER],
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
	['WORD', 'wProvideUser'],						        //供应用户
	['BYTE', 'cbProvideCardData'],							//动作扑克
	['BYTE', 'cbLeftCardCount'],							//剩余数目
	['CMD_C_GameType', 'stWinType'],					
	['bool', 'bHaveSetType'],

	//出牌信息
	['WORD', 'wOutCardUser'],								//出牌完成用户
	['BYTE', 'cbOutCardData'],								//出牌扑克
	['BYTE', 'cbDiscardCount', GAME_PLAYER],				//丢弃数目
	['BYTE', 'cbDiscardCardData', GAME_PLAYER, 60],			//丢弃记录

	//扑克数据
	['BYTE', 'cbHandCardCount', GAME_PLAYER],				//扑克数目
	['BYTE', 'cbHandCardData', MAX_COUNT],					//扑克列表

	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克

	//财神变量
	['BYTE', 'cbMagicCardData', MAX_MAGIC_COUNT],

	['WORD', 'wHeapHead'],							//堆立头部
	['WORD', 'wHeapTail'],							//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],					//堆牌信息
	['heapCardItem', 'TurnoverCard', TURNOVER_COUNT_MAGIC],

	['BYTE', 'cbCallRecord', GAME_PLAYER],
	['BYTE', 'cbHaveWinUser', GAME_PLAYER],
	['BYTE', 'cbHaveWinCard', GAME_PLAYER],

	['bool', 'bFinishChangeCards'],
	['BYTE', 'isSelChange'],
	['BYTE', 'isUserSelChange', GAME_PLAYER],
	['CMD_ChangeCard', 'stChangeCard', GAME_PLAYER],
	['BYTE', 'cbWinnerOrder', GAME_PLAYER],
]
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1								//出牌命令
var SUB_C_OPERATE_CARD = 3							//操作扑克
var SUB_C_CALL = 4									//操作扑克
var SUB_C_TYPE_SEL = 5							
//出牌命令
var CMD_C_OutCard = 
[
	['BYTE', 'cbOutCardData'],							//扑克数据
]

var CMD_C_ChangeCards = 
[
	['BYTE', 'cbDeleteCards', 3],
]

//操作命令
var CMD_C_OperateCard = 
[
	['BYTE', 'cbOperateCode'],						//操作代码
	['BYTE', 'cbOperateCardCount'],
	['BYTE', 'cbOperateCardData', MAX_OPERATE_COUNT],	//操作扑克 补花操作时不传这个 服务器默认所有花牌补花
]

//游戏设置
var CMD_C_Sel = 
[
	['BYTE', 'cbType'],											
]

var CMD_C_GameType = 
[
	['BYTE', 'cbFengDingType'],						//扑克数据
	['BYTE', 'cbZiMoType'],							//扑克数据
	['BYTE', 'cbGFlowerType'],						//扑克数据
	['BYTE', 'cbChangeCard'],						//扑克数据
	['BYTE', 'YaoJiuJiangDui'],						//扑克数据
	['BYTE', 'cbTianDiHu'],							//扑克数据
	['BYTE', 'cbMenQingZhongZhang'],				//扑克数据
]

//////////////////////////////////////////////////////////////////////////

//#endif