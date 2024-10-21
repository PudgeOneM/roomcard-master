//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 142								//游戏 I D
var GAME_NAME = "天台三阿磨"					//游戏名字

//组件属性
var GAME_PLAYER = 3									//游戏人数
var GAME_PLAYER_SHOW = 4									//显示游戏人数
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
var MAX_REPERTORY = 108	//最大库存 
var MAX_FLOWER_COUNT = 8	//无花时设置为1 m_cbFlowerIndex[MAX_FLOWER_COUNT]不赋值即可   
var MAX_RIGHT_COUNT = 2	//最大权位DWORD个数 允许几个人同时胡(一炮多响)
var MAX_WEAVE = 4	//最大组合
var HEAP_FULL_COUNT = 36	//堆立全牌 一个玩家面前的牌堆包含的麻将数

//假财神
var REPLACE_CARD_DATA = INVALID_CARD_DATA//无假财神时设置为INVALID_CARD_DATA
var REPLACE_CARD_ALLOWSELF = false	

//财神
var MAX_MAGIC_COUNT = 4//无财神时设置为1 m_cbMagicIndex[MAX_MAGIC_COUNT]不赋值即可
var TURNOVER_COUNT_MAGIC = 1//翻财神时翻的麻将数 		
var MAGIC_CARD_ALLOWOUT = true	

//其他
var MAX_SEND_COUNT = 12//摸到所有花补花 要发一样多的牌 MAX_FLOWER_COUNT	
//客户端执行动作时发给服务器的麻将最大数 如果有补花操作 可能出现摸到所有花补花 MAX_FLOWER_COUNT												
var MAX_OPERATE_COUNT = 12
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

var MASK_CHI_HU_RIGHT = 0x0ffffffff
//胡牌定义
var CHR_HunYiSe = 0x000000001	//混一色  由同一种花色及风牌组成的胡牌 
var CHR_QingYiSe = 0x000000002	//清一色 由同一种花色牌组成的胡牌 
var CHR_PengPengHu = 0x000000004	//大对对  碰碰胡 由任意花色及风字组成的碰胡   
var CHR_PangHu = 0x000000008	//旁胡  
var CHR_SiCaiShen = 0x000000010	//四财神
var CHR_ZiMo = 0x000000020	//自摸 
var CHR_GangKai = 0x000000040	//杠上开花（杠开）    开杠抓进的牌成和牌   
var CHR_QiangGang = 0x000000080	//拉杠胡  抢杠  和别人自抓开明杠的牌  
var CHR_SongGang = 0x000000100	//送杠胡
var CHR_DanDiao = 0x000000200	//单吊 不管什么牌型，最后成单调的都算特殊牌型。
var CHR_HaiDiLaoYue = 0x000000400	//海底捞月 算特殊牌型，即最后一个玩家抓最后一张牌时胡牌，那么就称之为海底捞月。 
var CHR_BaHua = 0x000000800	//八花
var CHR_SiHua = 0x000001000	//四花
var CHR_KaoBing = 0x000002000 //靠柄
var CHR_WuCai = 0x000004000	//无财
var CHR_CaiDiao = 0x000008000	//财吊
var CHR_QianHu = 0x000010000	//嵌胡	
var CHR_Zhong = 0x000020000 //红中1番
var CHR_FaCai = 0x000040000 //发财1番
var CHR_MenFeng = 0x000080000 //门风1番
var CHR_BaiBan = 0x000100000 //白板1番
var CHR_ZhongTwo = 0x000200000 //红中2番
var CHR_FaCaiTwo = 0x000400000 //发财2番
var CHR_MenFengTwo = 0x000800000 //门风2番
var CHR_ZuoTai = 0x080000000 //坐台

//#ifdef xxxxxx
var map_mask2Name = 
[
	['CHR_HunYiSe', '混一色'],
	['CHR_QingYiSe', '清一色'],
	['CHR_PengPengHu', '对对胡'],
	['CHR_PangHu', '排胡'],
	['CHR_SiCaiShen', '四财神'],
	['CHR_ZiMo', '自摸'],
	['CHR_GangKai', '杠开'],
	['CHR_QiangGang', '抢杠胡'],
	['CHR_SongGang', '送杠胡'],
	['CHR_DanDiao', '单吊'],
	['CHR_HaiDiLaoYue', '海底捞月'],
	['CHR_BaHua', '八花'],
	['CHR_SiHua', '四花'],
	['CHR_QianHu', '嵌档'],
	['CHR_KaoBing', '倒壁'],
	['CHR_WuCai', '无财'],
]

var map_mask2NameFan = 
[
	['CHR_HunYiSe', '混一色1'],
	['CHR_QingYiSe', '清一色3'],
	['CHR_PengPengHu', '对对胡1'],
	['CHR_PangHu', '排胡1'],
	['CHR_SiCaiShen', '四财神辣子'],
	['CHR_GangKai', '杠开1'],
	['CHR_QiangGang', '抢杠胡1'],
	['CHR_HaiDiLaoYue', '海底捞月1'],
	['CHR_BaHua', '八花辣子'],
	['CHR_SiHua', '四花1'],
	['CHR_WuCai', '无财1'],
	['CHR_Zhong', '红中1'],
	['CHR_FaCai', '发财1'],
	['CHR_MenFeng', '门风1'],
	['CHR_ZhongTwo', '红中2'],
	['CHR_FaCaiTwo', '发财2'],
	['CHR_MenFengTwo', '门风2'],
	['CHR_BaiBan', '白板1'],
]
var map_mask2NameHu = 
[
	['CHR_ZiMo', '自摸2'],
	['CHR_DanDiao', '单吊2'],
	['CHR_QianHu', '嵌档2'],
	['CHR_KaoBing', '倒壁2'],
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
var SUB_S_SELECT_MOPAI = 106									//摸牌选择	
var SUB_S_UPDATE_DATA = 108									//更新数据
var SUB_S_PINGCUO_RESULT = 109									//设置平搓
var SUB_S_OPERATE_NOTIFY = 103									//操作提示
var SUB_S_SENDLOG = 110
var CMD_S_Call = 
[
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],//下跑 加顶分
]

//游戏开始
var CMD_S_GameStart = 
[
	['BYTE', 'cbPlayType'],									//基础设置
	['BYTE', 'cbSBankCount1'],
	['BYTE', 'cbSBankCount2'],
	['BYTE', 'cbSiceCount1'],
	['BYTE', 'cbSiceCount2'],

	['bool', 'bIsRandBanker'],
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbMagicCardData', MAX_MAGIC_COUNT],					
	['BYTE', 'cbFlowerCardData', MAX_FLOWER_COUNT],
	['BYTE', 'cbLeftCardCount'],	//剩余数目
	['BYTE', 'cbEndLeftCount'],		//荒庄数目

	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],		//扑克列表
	['BYTE', 'cbFengPos'],							//风位
	['WORD', 'wHeapHead'],							//堆立头部
	['WORD', 'wHeapTail'],							//堆立尾部
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],					//堆牌信息
	['heapCardItem', 'TurnoverCard', TURNOVER_COUNT_MAGIC],

	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],//下跑 加顶分
]

//出牌命令
var CMD_S_OutCard = 
[
	['WORD', 'wOutCardUser'],						//出牌用户
	['BYTE', 'cbOutCardData'],						//出牌扑克
	['BYTE', 'cbActionMask'],						//动作掩码
]

//发送扑克
var CMD_S_SendCard = 
[
	['BYTE', 'cbActionMask'],						//动作掩码
	['WORD', 'wProvideUser'],
	['BYTE', 'cbProvideCardData'],						//供应扑克
	['WORD', 'wCurrentUser'],						//当前出牌用户
	['WORD', 'wTakeCardUser'],						//拿牌用户
	['BYTE', 'cbSendCardCount'], 
	['heapCardItem', 'sendCardArray', MAX_SEND_COUNT], //
]

//操作命令
var CMD_S_OperateResult = 
[	
	['BYTE', 'cbWeaveGangType', GAME_PLAYER, MAX_WEAVE],			//杠牌数据
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
	['DWORD', 'cbDiHuScore'],						//底胡分数
	['DWORD', 'cbHuaScore', GAME_PLAYER],			//花牌分数
	['DWORD', 'cbHuaFan', GAME_PLAYER],				//花牌番数
	['DWORD', 'cbKeScore', GAME_PLAYER],				//刻子分数
	['DWORD', 'cbGangScore', GAME_PLAYER],			//杠牌分数
	['DWORD', 'cbPengScore', GAME_PLAYER],			//碰牌分数
	['DWORD', 'cbDuiZiScore', GAME_PLAYER],			//对子分数


	['WORD', 'wWinner'],
	['WORD', 'wExitUser'],							//强退用户
	['BYTE', 'endType'],   							//0强退 1流局 2自摸 3点炮
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],						//供应扑克
	['DWORD', 'dwChiHuKind', GAME_PLAYER],			//胡牌类型
	['DWORD', 'dwChiHuRight', GAME_PLAYER],			//胡牌类型
	['DWORD', 'dwChiHuAssist', GAME_PLAYER],			//辅助胡型

	['SCORE', 'lGameScore', GAME_PLAYER],			//游戏积分
	['SCORE', 'IGameScoreRe', GAME_PLAYER],			//游戏积分辅助
	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],	//扑克数据

	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克

	['BYTE', 'cbPlayerFlowerCount', GAME_PLAYER],			//丢弃花牌数目
	['BYTE', 'cbPlayerFlowerCardData', GAME_PLAYER, MAX_FLOWER_COUNT],		//丢弃花牌记录

	['LONGLONG', 'cbTotolScore', GAME_PLAYER],			//总分数
]
//摸牌选择
var CMD_S_SelectMoPai = 
[
	['WORD', 'wCurrentUser'],						//当前用户
	['BYTE', 'cbLeftCardCount'],					//剩余数目
	['WORD', 'wTakeCardUser'],						//拿牌用户
	['BYTE', 'cbSendCardCount'], 
	['heapCardItem', 'sendCardArray', MAX_SEND_COUNT], //
]

var CMD_S_UpdataData = 
[
	['WORD', 'wCurrentUser'],						//当前用户
]
//空闲状态
var CMD_S_StatusFree = 
[
	['BYTE', 'cbPlayType'],							//基础设置
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
	['BYTE', 'cbPlayType'],									//基础设置
	//游戏变量
	['SCORE', 'lCellScore'],									//单元积分
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['WORD', 'wCurrentUser'],								//当前需要出牌用户
	['WORD', 'wSelectUser'],								//选择用户
	//状态变量
	['BYTE', 'cbActionMask'],								//动作掩码
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],								//动作扑克
	['BYTE', 'cbLeftCardCount'],							//剩余数目
	['BYTE', 'cbEndLeftCount'],		//荒庄数目

	//出牌信息
	['WORD', 'wOutCardUser'],								//出牌完成用户
	['BYTE', 'cbOutCardData'],								//出牌扑克
	['BYTE', 'cbDiscardCount', GAME_PLAYER],				//丢弃数目
	['BYTE', 'cbDiscardCardData', GAME_PLAYER, 60],				//丢弃记录

	//扑克数据
	['BYTE', 'cbHandCardCount', GAME_PLAYER],								//扑克数目
	['BYTE', 'cbHandCardData', MAX_COUNT],						//扑克列表
	['BYTE', 'cbFengPos'],							//风位
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

	['BYTE', 'cbWeaveGangType', GAME_PLAYER, MAX_WEAVE],			//杠牌数据
]

//平搓结果
var CMD_S_Ping_Result = 
[
	['BYTE', 'cbPingCuoCuo'],						//是否平挫搓
]
//操作提示
var CMD_S_OperateNotify = 
[
	['WORD', 'wResumeUser'],						//还原用户
	['BYTE', 'cbActionMask'],						//动作掩码
	['BYTE', 'cbProvideCard'],						//供应扑克
]
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3									//操作扑克
var SUB_C_CALL = 4									//操作扑克
var SUB_C_MOPAI = 5									//摸牌选择
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
	['BYTE', 'cbOperateCardCount'],

	['BYTE', 'cbOperateCardData', MAX_OPERATE_COUNT],	//操作扑克 补花操作时不传这个 服务器默认所有花牌补花
]

//游戏设置
var CMD_C_Call = 
[
	['BYTE', 'xiapao'],						
	['BYTE', 'jiading'],					
]
//摸牌选择
var CMD_C_MOPAi = 
[
	['BYTE', 'cbmoPai'],
]
//平挫搓命令
var CMD_C_Ping_Result = 
[
	['BYTE', 'cbPingCuoCuo'],						//是否平挫搓 2 辣子500  1 辣子300
]
//////////////////////////////////////////////////////////////////////////

//#endif