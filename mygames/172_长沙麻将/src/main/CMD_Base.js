//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 172								//游戏 I D
var GAME_NAME = "长沙麻将"					//游戏名字

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
var MAX_INDEX = 27//42	//最大索引 
var MAX_COUNT = 14	//最大手牌数
var MAX_WEAVE = 4	//最大组合
var MAX_FLOWER_COUNT = 1	//无花时设置为1 m_cbFlowerIndex[MAX_FLOWER_COUNT]不赋值即可   
var MAX_RIGHT_COUNT = 3	//最大权位DWORD个数 允许几个人同时胡(一炮多响)

var VAILID_REPERTORY = 108	//有效麻将数
var MAX_REPERTORY = 112	//最大库存 
var HEAP_FULL_COUNT = 28	//堆立全牌 

//假财神
var REPLACE_CARD_DATA = INVALID_CARD_DATA//无假财神时设置为INVALID_CARD_DATA 假财神可以代替财神吃
var REPLACE_CARD_ALLOWSELF = false	

//财神
var MAX_MAGIC_COUNT = 1//无财神时设置为1 m_cbMagicIndex[MAX_FLOWER_COUNT]不赋值即可    整副麻将里的最大财神麻将数 
var TURNOVER_COUNT_MAGIC = 0//无财神时设置为0 翻财神时翻的麻将数 		
var MAGIC_CARD_ALLOWOUT = false	

//其他
var MAX_SEND_COUNT = 2//摸到所有花补花 要发一样多的牌 MAX_FLOWER_COUNT											
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

var WIK_MINBU = 0x0400								//吃牌类型
var WIK_ANBU = 0x0800								//吃胡类型
var WIK_PENGBU = 0x1000								//花牌替换

var WIK_YAO = 0x2000								//花牌替换
var WIK_BUYAO = 0x4000								//花牌替换
var WIK_QISHOUHU = 0x8000								//花牌替换



//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//一个胡型是否存在 由2进制数中的1位来表示
//0xffffffff 可以表示32位的2进制 所以最多支持32种胡型

var MASK_CHI_HU_RIGHT = 0x0fffffff
var CHR_PingHu = 0x00000001	

//胡牌定义
// 起手胡牌：长沙麻将如起牌后有如下牌型，可以直接胡牌，算平胡自摸。
// 板板胡：没有任何序数为258的牌；胡牌时须亮出全手牌

// 四喜：有4张相完全相同的牌；只须亮出该4张牌即可

// 缺一色：缺少万索砣三色中的一色；须亮出全手牌

// 六六顺：有2副暗刻；只须亮出该6张牌即可

// 三同：三色同序数相同的牌各有一对。如：2万、2索、2筒各2张；只须亮出该6张牌即可

// 一支花：有一种花色只有一张牌，而且序数为5；须亮出全手牌
  
var CHR_BanBanHu = 0x00000002 
var CHR_SiXi = 0x00000004  
var CHR_QueYiSe = 0x00000008  
var CHR_LiuLiuShun = 0x00000010 
var CHR_SanTong = 0x00000020  
var CHR_YiZhiHua = 0x00000040 
// 大货
// 清一色：胡牌时，手中只有万索筒三色中的一色

// 七小对：由七个对子组成的胡牌，不能吃碰杠

// 碰碰胡：由4副刻子(杠子)和一对将牌组成的胡牌

// 将将胡：所有牌均是258的将牌，可以是单张、对子、刻子或4张，可以碰。如果愿意杠的话，也可以。

// 杠上开花
// 抢杠
// 海底
// 抢海底：某玩家要了海底牌后不能胡牌，只能将海底牌打出，不能纳入手牌。这时正好有人胡牌，用佯将做将牌也可以抢海底。

// 全求人：即吃碰明杠4副，最后只留1张牌胡牌，自摸或别人放炮均算全求人，相当于北京牌的大吊车(半求人+全求人的混合体)

// 龙七对：龙七对要求垛合子打法才有，即七对中至少有2对4张是完全相同的牌。在只算一合的打法中，龙七对相当于七小对。

var CHR_QingYiSe = 0x00000080	
var CHR_QiXiaoDui = 0x00000100	
var CHR_PengPengHu = 0x00000200	
var CHR_JiangJiangHu = 0x00000400	
var CHR_GangKai = 0x00000800	 
var CHR_QiangGang = 0x00001000	
var CHR_HaiDi = 0x00002000	
var CHR_QiangHaiDi = 0x00004000	
var CHR_QuanQiuRen = 0x00008000	
var CHR_LongQiDui = 0x00010000	


//#ifdef xxxxxx
var map_mask2Name = 
[
	['CHR_PingHu', '平胡'],
	['CHR_BanBanHu', '板板胡'],
	['CHR_SiXi', '四喜'],
	['CHR_QueYiSe', '缺一色'],
	['CHR_LiuLiuShun', '六六顺'],
	['CHR_SanTong', '三同'],
	['CHR_YiZhiHua', '一枝花'],
	['CHR_QingYiSe', '清一色'],
	['CHR_QiXiaoDui', '七小对'],
	['CHR_PengPengHu', '碰碰胡'],
	['CHR_JiangJiangHu', '将将胡'],
	['CHR_GangKai', '杠开'],
	['CHR_QiangGang', '抢杠'],
	['CHR_HaiDi', '海底'],
	['CHR_QiangHaiDi', '抢海底'],
	['CHR_QuanQiuRen', '全求人'],
	['CHR_LongQiDui', '龙七对'],
	
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
var SUB_S_GAME_START = 100									//游戏开始
var SUB_S_OUT_CARD = 101									//出牌命令
var SUB_S_SEND_CARD = 102									//发送扑克
var SUB_S_OPERATE_RESULT = 104									//操作命令
var SUB_S_GAME_END = 105									//游戏结束
var SUB_S_CALL_NOTIFY = 107									
var SUB_S_CALL_RESULT = 108	
var SUB_S_CALL = 109	

var SUB_S_PLAYER_STATUS_UPDATA = 110									
var SUB_S_TINGDATA = 111									//游戏结束
var SUB_S_REPLACE_RESULT = 112									//操作命令
var SUB_S_LISTEN_RESULT = 113									//操作命令
var SUB_S_OUT_CARD_KAIGANG = 114									//开杠后出牌

var SUB_S_GANGDATA = 115									//告诉客户端可以杠哪些牌 杠后要可以听才能杠

var SUB_S_HAIDI_NOTIFY = 116									

var SUB_S_QISHOUHU_RESULT = 117									




// //出牌命令
// struct CMD_S_HaiDi_Notify
// {
// };

var CMD_S_PlayerStatusUpdata = 
[
	['bool', 'bPlayerStatus', GAME_PLAYER, 2],//杠后状态/听牌状态/财飘状态 这些状态可以在客户端标识出来
]


var CMD_S_CallNotify = 
[
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['WORD', 'wCurrentUserCall'],						//当前玩家
	// ['BYTE', 'cbHandCardCount', GAME_PLAYER],		//手上扑克数量
	// ['BYTE', 'cbHandCardDataSelf', MAX_COUNT],			//扑克列表
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
	['BYTE', 'cbSiceCount', 4],
	['bool', 'bIsRandBanker'],
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbMagicCardData', MAX_MAGIC_COUNT],					
	['BYTE', 'cbFlowerCardData', MAX_FLOWER_COUNT],
	['BYTE', 'cbLeftCardCount'],	//剩余数目

	['BYTE', 'cbHandCardData', GAME_PLAYER,MAX_COUNT],					//扑克列表
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

//出牌命令
var CMD_S_OutCard_KaiGang = 
[
	['WORD', 'wOutCardUser'],						//出牌用户
	['BYTE', 'cbKaiGangCardDatas', 2],						//出牌扑克
	['WORD', 'cbActionMask'],						//动作掩码
]

//发送扑克
var CMD_S_SendCard = 
[
	['bool', 'bIsKaiGang'],
	['bool', 'bIsSuccessKaiGang'],
	['BYTE', 'cbKaiGangSiceCount', 2],
	
	['WORD', 'cbActionMask'],						//动作掩码
	['WORD', 'wGetSendCardUser'],
	['BYTE', 'cbSendCardData'],						//供应扑克
	['WORD', 'wCurrentUser'],						//当前出牌用户
	['WORD', 'wTakeCardUser'],						//拿牌用户
	['BYTE', 'cbSendCardCount'], 
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

//操作命令 听
var CMD_S_QishouhuResult = 
[	
	['BYTE', 'cbHandCardCount_qishouhu'],			//扑克数目
	['BYTE', 'cbHandCardData_qishouhu', MAX_COUNT],	//扑克数据
	['DWORD', 'dwChiHuRight_qishouhu'],

	['BYTE', 'cbQishouhuSiceCount', 2],
	['LONGLONG', 'qishouhuGameScore', GAME_PLAYER],			//游戏积分
	
	['WORD', 'wOperateUser'],						//操作用户
	['WORD', 'wCurrentUser'],						//当前出牌用户 碰杠会有可能进入动作状态
	['WORD', 'cbActionMask'],						//动作后动作 动作掩码
]

//游戏结束 胡
var CMD_S_GameEnd = 
[
	['WORD', 'wExitUser'],							//强退用户
	['BYTE', 'endType'],   							//0强退 1流局 2自摸 3点炮
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbHuProvideCardData', 2],						//供应扑克
	['DWORD', 'dwChiHuKind', GAME_PLAYER],			//胡牌类型
	['DWORD', 'dwChiHuRight', GAME_PLAYER],			//胡牌类型

	['LONGLONG', 'lGameTaiCount', GAME_PLAYER],			
	['LONGLONG', 'lGameScore', GAME_PLAYER],			//游戏积分
	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],	//扑克数据

	['BYTE', 'cbHaiDiCardData'],
	['BYTE', 'cbNiaoCardData', 2],
	['BYTE', 'cbKaiGangCardDatas', 2],						//出牌扑克
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

var CMD_S_GANGDATA = 
[
	['BYTE', 'cbGangData', 7],
]

//空闲状态
var CMD_S_StatusFree = 
[
	['LONGLONG', 'lCellScore'],							//基础金币
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
	//游戏变量
	['LONGLONG', 'lCellScore'],									//单元积分
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['WORD', 'wCurrentUser'],								//当前需要出牌用户
	['WORD', 'wTakeCardUser'],						//拿牌用户

	//状态变量
	['WORD', 'cbActionMask'],								//动作掩码
	['WORD', 'wGetSendCardUser'],						//供应用户
	// ['BYTE', 'cbProvideCardData'],								//动作扑克
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

	['bool', 'bPlayerStatus', GAME_PLAYER, 2],//杠后状态/听牌状态/财飘状态 这些状态可以在客户端标识出来


	['WORD', 'wCurrentHaiDiUser'],


	['BYTE', 'cbKaiGangCardDatas', 2],						//出牌扑克

	['BYTE', 'cbKaiGangCardCount'],
	['heapCardItem', 'kaiGangCard', 16, 2],
	['BYTE', 'cbGangData', 7],

	['BYTE', 'cbTingDataCount'], 
	['tingDataItem', 'tingData', MAX_COUNT],
]
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3									//操作扑克
var SUB_C_CALL = 4									//操作扑克

var SUB_C_OUT_CARD_KAIGANG = 5									//开杠后出牌

var SUB_C_HAIDI_NOTIFY = 6									


//出牌命令
var CMD_C_HAIDI_NOTIFY = 
[
	['bool', 'bIsYao'],							//扑克数据
]

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

//////////////////////////////////////////////////////////////////////////

//#endif