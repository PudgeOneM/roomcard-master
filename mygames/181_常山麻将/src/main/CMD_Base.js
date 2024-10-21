//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 181								//游戏 I D
var GAME_NAME = "常山麻将"					//游戏名字

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
var MAX_INDEX = 34//42	//最大索引 
var MAX_COUNT = 14	//最大手牌数
var MAX_WEAVE = 4	//最大组合
var MAX_FLOWER_COUNT = 1	//无花时设置为1 m_cbFlowerIndex[MAX_FLOWER_COUNT]不赋值即可   
var MAX_RIGHT_COUNT = 1	//最大权位DWORD个数 允许几个人同时胡(一炮多响)

var VAILID_REPERTORY = 136//144	//有效麻将数
var MAX_REPERTORY = 136//144	//最大库存 
var HEAP_FULL_COUNT = 34//36	//堆立全牌 

//假财神
var REPLACE_CARD_DATA = 0x37//无假财神时设置为INVALID_CARD_DATA 假财神可以代替财神吃
var REPLACE_CARD_ALLOWSELF = true	

//财神
var MAX_MAGIC_COUNT = 1//无财神时设置为1 m_cbMagicIndex[MAX_FLOWER_COUNT]不赋值即可    整副麻将里的最大财神麻将数 
var TURNOVER_COUNT_MAGIC = 1//无财神时设置为0 翻财神时翻的麻将数 		
var MAGIC_CARD_ALLOWOUT = true	

//其他
var MAX_SEND_COUNT = 4//摸到所有花补花 要发一样多的牌 MAX_FLOWER_COUNT											
var MAX_OPERATE_COUNT = 4//客户端执行动作时发给服务器的麻将最大数 如果有补花操作 可能出现摸到所有花补花 MAX_FLOWER_COUNT		
var HAS_DISPATCH_CARD_DATA = INVALID_CARD_DATA  //send这个carddata 客户端会以丢弃牌处理(不插入手牌)
///////////////游戏配置 end////////////

//逻辑掩码
var MASK_COLOR = 0xF0								//花色掩码
var MASK_VALUE = 0x0F								//数值掩码

//动作标志 
var WIK_NULL = 0x0000								//没有类型
var WIK_LEFT = 0x0001								//左吃类型
var WIK_CENTER = 0x0002								//中吃类型
var WIK_RIGHT = 0x0004								//右吃类型
var WIK_PENG = 0x0008								//碰牌类型
var WIK_MINGANG = 0x0010								//杠牌类型
var WIK_ANGANG = 0x0020								//杠牌类型
var WIK_PENGGANG = 0x0040								//杠牌类型
var WIK_LISTEN = 0x0080								//吃牌类型
var WIK_CHI_HU = 0x0100								//吃胡类型
var WIK_REPLACE = 0x0200								//花牌替换

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//一个胡型是否存在 由2进制数中的1位来表示
//0xffffffff 可以表示32位的2进制 所以最多支持32种胡型

var MASK_CHI_HU_RIGHT = 0x0fffffff
//胡牌定义
var CHR_PingHu = 0x00000001  //平胡
var CHR_GangKai = 0x00000002	//杠上开花（杠开）    开杠抓进的牌成和牌   
var CHR_HaiDiLaoYue = 0x00000004	// 海底捞月 算特殊牌型，即最后一个玩家抓最后一张牌时胡牌，那么就称之为海底捞月。
var CHR_QiangGang = 0x00000008	//抢杠  和别人自抓开明杠的牌  
// var CHR_TianHu = 0x00000002	//天胡
// var CHR_DiHu = 0x00000002	//地胡 庄家出第一张点炮下家和是地和，牌型不限。 
// var CHR_HasCaiShen = 0x00000010	//胡型里是否有财神
var CHR_SiCaiShen = 0x00000020	//混一色  由同一种花色及风牌组成的胡牌 
var CHR_QingYiSe = 0x00000040	//清一色 由同一种花色牌组成的胡牌 
var CHR_PengPengHu = 0x00000080	//碰碰胡 由任意花色及风字组成的碰胡  
var CHR_SanCaiDao = 0x00000100	//三财倒 牌里包含3张财神（不可吃冲、可自摸）  
//var CHR_QuanFengZi = 0x00004000	//全风字 14张全部由风组成的牌型（可以是乱牌） 
// var CHR_QiFengDao = 0x00000002	//七风倒 牌里包含7张不同风字（不可吃冲、可自摸） 
var CHR_HuDuJia = 0x00000200	//七小对 任意花色的七个对子组成 
var CHR_QiXiaoDuiHaoHua = 0x00000400	
var CHR_TianHu = 0x00000800	
var CHR_DiHu = 0x00001000	
var CHR_DanDiao = 0x00002000	// 单吊 不管什么牌型，最后成单调的都算特殊牌型。
// var CHR_DaDiao = 0x00000002	//大吊
// var CHR_ShiSanYao = 0x00000002	//十三幺：东南西北中发白，一九万，一九饼，一九条，加其中任意一张组成对，混不能做为财神使用，只能按牌面显示使用，例混为三万时，只能做为三万使用。
// var CHR_ShiSanBaiDa = 0x00000002	//十三百搭    147,258,369加5张不同的风可以由不同于前5张风代替147,258,369任意一张或两张牌   
// var CHR_LanBaiDa = 0x00000002  //烂百搭 147、148、149、158、159、169、258、259、269、369任意三花色组成加上单风的牌型


// 小三风
// 2个风成刻或杠+1个风成对+其他牌组成的胡牌。
// 大三风
// 3个风成刻或杠+其他牌组成的胡牌。
// // 大四喜
// 四个风成刻，不计对对胡。
var CHR_QuanFengZi = 0x00004000	
var CHR_XiaoSanFeng = 0x00008000	
var CHR_DaSanFeng = 0x00010000	
var CHR_DaSiXi = 0x00020000	
var CHR_SanZhao = 0x00040000	
var CHR_SiZhao = 0x00080000	
var CHR_MenQing = 0x00100000	
var CHR_WuHuaGuo = 0x00200000	


//#ifdef xxxxxx
var map_mask2Name = 
[
	['CHR_PingHu', '平胡'],
	['CHR_GangKai', '杠开'],
	['CHR_HaiDiLaoYue', '海底捞月'],
	['CHR_QiangGang', '抢杠'],
	['CHR_TianHu', '天胡'],
	['CHR_DiHu', '地胡'],
	['CHR_HuDuJia', '胡独夹'],
	['CHR_HunYiSe', '混一色'],
	['CHR_QingYiSe', '清一色'],
	['CHR_PengPengHu', '碰碰胡'],
	['CHR_SiCaiShen', '四财神'],
	['CHR_QuanFengZi', '包屁股'],
	['CHR_QiFengDao', '七风倒'],
	['CHR_QiXiaoDui', '七小对'],
	['CHR_QiXiaoDuiHaoHua', '豪华七小对'],
	['CHR_QiXiaoDuiShuangHaoHua', '双豪华七小对'],
	['CHR_QiXiaoDuiSanHaoHua', '三豪华七小对'],
	['CHR_DanDiao', '财吊'],
	['CHR_DaDiao', '大吊'],
	['CHR_ShiSanYao', '十三幺'],
	['CHR_ShiSanBaiDa', '十三百搭'],
	['CHR_LanBaiDa', '烂百搭'],
	['CHR_YiTiaoLong', '一条龙'],	
	['CHR_XiaoSanFeng', '财飘'],	
	['CHR_DaSanFeng', '财飘x2'],	
	['CHR_DaSiXi', '财飘x3'],
	['CHR_SanZhao', '三招'],	
	['CHR_SiZhao', '四招'],	
	['CHR_CaiPiao', '财飘'],	
	['CHR_WuHuaGuo', '无花果'],	
]
//#endif

//////////////////////////////////////////////////////////////////////////

//组合子项
var tagWeaveItem = 
[
	['WORD', 'cbWeaveKind'],						//组合类型
	
	['WORD', 'wProvideUserOld'],//动作更新后会记录原来的提供者 比如碰杠
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbValidCardDatas', 4],           //实际扑克
	['BYTE', 'cbChangeCardDatas', 4], //通过对比cbValidIndex cbChangeIndex可以知道财神代替的牌
]

var heapCardIdx = 
[
	['WORD', 'wHeapDir'], //发牌方位
	['WORD', 'wHeapPos'], //
]

var heapCardItem = 
[
	['heapCardIdx', 'heapIdx'],
	['BYTE', 'cbCardData'],	//发牌数据 INVALID_CARD_DATA表示是丢弃牌 客户端不会往手牌塞牌
]
//heapPos
//var 头部第一堆上面一个heapPos =var 尾部第一堆下面一个heapPos =max


var tingDataItem = 
[
	['BYTE', 'cbTingCardData'],
	['BYTE', 'cbHuCardDataCount'],
	['BYTE', 'cbHuCardData', MAX_INDEX],
]


//类型子项
var guoRecordItem = 
[
	['WORD', 'wProvideUser'],
	['BYTE', 'cbProvideCardData'],
]

//////////////////////////////////////////////////////////////////////////
//服务器命令结构
var SUB_S_PLAYER_STATUS_UPDATA = 110									
var SUB_S_CALL_NOTIFY = 107									
var SUB_S_CALL_RESULT = 108	
var SUB_S_CALL = 109									
var SUB_S_GAME_START = 100									//游戏开始
var SUB_S_OUT_CARD = 101									//出牌命令
var SUB_S_SEND_CARD = 102									//发送扑克
var SUB_S_OPERATE_RESULT = 104									//操作命令
var SUB_S_GAME_END = 105									//游戏结束

var SUB_S_TINGDATA = 111									//游戏结束

var SUB_S_REPLACE_RESULT = 112									//操作命令
var SUB_S_LISTEN_RESULT = 113									//操作命令
var SUB_S_MORDEN_RESULT = 114
var SUB_S_AUTO_OUT_CARD = 115
var CMD_S_PlayerStatusUpdata = 
[
	['bool', 'bPlayerStatus', GAME_PLAYER, 4],//杠后状态/听牌状态/财飘状态 这些状态可以在客户端标识出来
]
var CMD_S_MordenResult = 
[
	['bool', 'wBaoPiGuType'],
	['bool', 'wQiangGangType'],
]

var CMD_S_CallNotify = 
[
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['WORD', 'wCurrentUserCall'],						//当前玩家
]

var CMD_S_CallResult = 
[
	['WORD', 'wCallUser'],						
	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],			//叫分信息
	['WORD', 'wCurrentUserCall'],						//当前玩家				
]

//游戏开始
var CMD_S_GameStart = 
[
	['bool', 'wBaoPiGuType'],
	['bool', 'wQiangGangType'],
	['BYTE', 'cbSiceCount', 4],
	['bool', 'bIsRandBanker'],
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbMagicCardData', MAX_MAGIC_COUNT],					
	['BYTE', 'cbFlowerCardData', MAX_FLOWER_COUNT],
	['BYTE', 'cbLeftCardCount'],	//剩余数目

	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],					//扑克列表
	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],					//堆牌信息
	['heapCardItem', 'TurnoverCard', max(1,TURNOVER_COUNT_MAGIC)],

	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],//下跑 加顶分
]

//出牌命令
var CMD_S_OutCard = 
[
	['WORD', 'wOutCardUser'],						//出牌用户
	['BYTE', 'cbOutCardData'],						//出牌扑克
	['WORD', 'cbActionMask'],						//动作掩码
]

//发送扑克
var CMD_S_SendCard = 
[
	['WORD', 'cbActionMask'],						//动作掩码
	['WORD', 'wGetSendCardUser'],
	['BYTE', 'cbSendCardData'],						//供应扑克
	['WORD', 'wCurrentUser'],						//当前出牌用户
	['WORD', 'wTakeCardUser'],						//拿牌用户
	['BYTE', 'cbSendCardCount'], 
	['bool', 'bIsAutoOutCard'],
	['heapCardItem', 'sendCardArray', MAX_SEND_COUNT], //
	
]

//操作命令 吃碰杠 
var CMD_S_OperateResult = 
[	
	['WORD', 'cbOperateCode'],						//操作代码
	['WORD', 'wOperateUser'],						//操作用户
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],						//供应扑克
	['WORD', 'wCurrentUser'],						//当前出牌用户 碰杠会有可能进入动作状态

	//吃碰杠会更新wOperateUser的Weave
	['BYTE', 'cbOperateWeaveIdx'],
	['tagWeaveItem', 'OperateWeaveItem'],	

	//动作后动作
	['WORD', 'cbActionMask'],						//动作后动作 动作掩码
]

//操作命令 补花
var CMD_S_ReplaceResult = 
[	
	['WORD', 'wOperateUser'],						//操作用户
	['BYTE', 'cbReplaceCardCount'],
	['BYTE', 'cbReplaceCardData', MAX_OPERATE_COUNT],					//操作扑克
]

//操作命令 听
var CMD_S_ListenResult = 
[	
	['WORD', 'wOperateUser'],						//操作用户
	['BYTE', 'cbOutCardData'],								//出牌扑克
	['WORD', 'cbActionMask'],						//动作后动作 动作掩码
	['WORD', 'wCurrentUser'],						//当前出牌用户 碰杠会有可能进入动作状态

]

//游戏结束 胡
var CMD_S_GameEnd = 
[
	['WORD', 'wExitUser'],							//强退用户
	['BYTE', 'endType'],   							//0强退 1流局 2自摸 3点炮
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],						//供应扑克
	['DWORD', 'dwChiHuKind', GAME_PLAYER],			//胡牌类型
	['DWORD', 'dwChiHuRight', GAME_PLAYER],			//胡牌类型

	['LONGLONG', 'lGameTaiCount', GAME_PLAYER],			
	['LONGLONG', 'lGameScore', GAME_PLAYER],			//游戏积分
	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],	//扑克数据

	//游戏结束 直接重新传WeaveItemArray 
	//抢杠这类的客户端维护起来麻烦
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克
]

var CMD_S_TINGDATA = 
[
	['BYTE', 'cbTingDataCount'], 
	['tingDataItem', 'tingData', MAX_COUNT],
]

//空闲状态
var CMD_S_StatusFree = 
[
	['LONGLONG', 'lCellScore'],							//基础金币
	['WORD', 'wBaoPiGuType'],
	['WORD', 'wQiangGangType'],
	['WORD', 'bSureMoShi'],
]

var CMD_S_StatusCall = 
[
	['LONGLONG', 'lCellScore'],							//基础金币
	['WORD', 'wCurrentUserCall'],						//当前玩家
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],//下跑 加顶分
]

//游戏状态
var CMD_S_StatusPlay = 
[
	['bool', 'bIsAutoOutCard'],
	['WORD', 'wBaoPiGuType'],
	['WORD', 'wQiangGangType'],
	//游戏变量
	['LONGLONG', 'lCellScore'],									//单元积分
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['WORD', 'wCurrentUser'],								//当前需要出牌用户
	['WORD', 'wTakeCardUser'],						//拿牌用户

	//状态变量
	['WORD', 'cbActionMask'],								//动作掩码
	['WORD', 'wGetSendCardUser'],						//供应用户
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

	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克

	['BYTE', 'cbPlayerFlowerCount', GAME_PLAYER],			//丢弃花牌数目
	['BYTE', 'cbPlayerFlowerCardData', GAME_PLAYER, MAX_FLOWER_COUNT],		//丢弃花牌记录

	//财神变量
	['BYTE', 'cbMagicCardData', MAX_MAGIC_COUNT],
	['BYTE', 'cbFlowerCardData', MAX_FLOWER_COUNT],

	['BYTE', 'cbHeapCardInfo', GAME_PLAYER, 2],					//堆牌信息
	['heapCardItem', 'TurnoverCard', max(1,TURNOVER_COUNT_MAGIC)],

	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],//下跑 加顶分
	['BYTE', 'cbSendCardData'],

	['bool', 'bPlayerStatus', GAME_PLAYER, 4],//杠后状态/听牌状态/财飘状态 这些状态可以在客户端标识出来

	['BYTE', 'cbTingDataCount'], 
	['tingDataItem', 'tingData', MAX_COUNT],
]
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3									//操作扑克
var SUB_C_CALL = 4									//操作扑克
var SUB_C_COMITMORDEN = 5
//出牌命令
var CMD_C_OutCard = 
[
	['BYTE', 'cbOutCardData'],							//扑克数据
]

//操作命令
var CMD_C_OperateCard = 
[
	['WORD', 'cbOperateCode'],						//操作代码
	['BYTE', 'cbOperateCardCount'],

	['BYTE', 'cbOperateCardData', MAX_OPERATE_COUNT],	//操作扑克 补花操作时不传这个 服务器默认所有花牌补花
]

//游戏设置
var CMD_C_Call = 
[
	['BYTE', 'xiapao'],						
	['BYTE', 'jiading'],					
]
var CMD_C_CommitMorden = 
[
	['bool', 'wBaoPiGuType'],
	['bool', 'wQiangGangType'],
]
//////////////////////////////////////////////////////////////////////////

//#endif