//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE
//#pragma pack(1)
//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 155								//游戏 I D
var GAME_NAME = "奉化麻将"					//游戏名字

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
var MAX_FLOWER_COUNT = 12	//无花时设置为1 m_cbFlowerIndex[MAX_FLOWER_COUNT]不赋值即可   
var MAX_RIGHT_COUNT = 1	//最大权位DWORD个数 允许几个人同时胡(一炮多响)
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
var CHR_AnQiXing = 0x000000001 //大大胡 暗七星
var CHR_HunYiSe = 0x000000002	//混一色  由同一种花色及风牌组成的胡牌 
var CHR_QingYiSe = 0x000000004	//清一色 由同一种花色牌组成的胡牌 
var CHR_PengPengHu = 0x000000008	//大对对  碰碰胡 由任意花色及风字组成的碰胡   
var CHR_PangHu = 0x000000010	//旁胡  
var CHR_WuDa = 0x000000020	//无搭
var CHR_QiXiaoDui = 0x000000040	//七对头七小对 任意花色的七个对子组成 
var CHR_YiDa = 0x000000080	//一搭 
var CHR_ErDa = 0x000000100	//二搭    
var CHR_SanDa = 0x000000200	//三百搭 
var CHR_HaiDa = 0x000000400	//还搭 
var CHR_ZiMo = 0x000000800	//自摸 
var CHR_MingQiXing = 0x000001000	//大大胡 明七星  
var CHR_GangKai = 0x000002000	//杠上开花（杠开）    开杠抓进的牌成和牌   
var CHR_QiangGang = 0x000004000	//拉杠胡  抢杠  和别人自抓开明杠的牌  
var CHR_TianHu = 0x000008000	//天胡
var CHR_DiHu = 0x000010000	//地胡 庄家出第一张点炮下家和是地和，牌型不限。  
var CHR_DanDiao = 0x000020000	//单吊 不管什么牌型，最后成单调的都算特殊牌型。
var CHR_HaiDiLaoYue = 0x000040000	//海底捞月 算特殊牌型，即最后一个玩家抓最后一张牌时胡牌，那么就称之为海底捞月。
var CHR_DaDiao = 0x000080000	//大吊车
var CHR_QiXingQueSe = 0x000100000	//七星缺色   
var CHR_LuanLaoTou = 0x000200000	//乱老头  
var CHR_LanBaiDa = 0x000400000  //大大胡烂百搭 147、148、149、158、159、169、258、259、269、369任意三花色组成加上单风的牌型
var CHR_BaHuaCuo = 0x000800000	//八花（搓胡）
//var CHR_SiHua = 0x001000000	//四花
var CHR_BaHuaZhi = 0x002000000	//八花(直胡)
var CHR_BianHu = 0x004000000	//边胡
var CHR_QianHu = 0x008000000	//嵌胡
var CHR_DuiDao = 0x010000000	//对倒	
var CHR_QingLaoTou = 0x020000000	//清老头
var CHR_DadaHuQueSe = 0x040000000	//大大胡 缺色
var CHR_ZuoTai = 0x080000000 //坐台

//第二组

var CHR_DaDuiDuiYDa = 0x000000001 //大对对(有搭)50
var CHR_DaDuiDuiWDa = 0x000000002	//大对对(无搭)100
var CHR_DaDiaoChYDa = 0x000000004	//大吊车(有搭)50
var CHR_DaDiaoChWDa = 0x000000008	//大吊车(无搭)100
var CHR_QiDuiTouYDa = 0x000000010	//七对头(有搭)70  
var CHR_QiDuiTouWDa = 0x000000020	//七对头(无搭)150
var CHR_QiDuiTouAZ = 0x000000040	//七对头(暗炸)100
var CHR_QiDuiTouMZ = 0x000000080	//七对头(明炸) 50
var CHR_ZhiGangBKH = 0x000000100	//直杠(不开花) 50   
var CHR_ZhiGangKH = 0x000000200	//直杠(开花)100  
var CHR_AnGangBKH = 0x000000400	//暗杠(不开花)100 
var CHR_AnGangKH = 0x000000800	//暗杠(开花)150  
var CHR_FXGangBKH = 0x000001000	//风险杠(不开花)100  
var CHR_FXGangKH = 0x000002000	//风险杠(开花)200  
var CHR_HGangKH = 0x000004000	//花杠杠开50 

var CHR_PTSanDa = 0x000008000	//普通三百搭150
var CHR_SHSanDa = 0x000010000	//三花三百搭300
var CHR_SHua = 0x000020000	//四花150
var CHR_ZFB1 = 0x000040000	//中发白1
var CHR_ZFB2 = 0x000080000	//中发白2
var CHR_ZFB3 = 0x000100000	//中发白3   
var CHR_ZhengFeng = 0x000200000	//正风2
var CHR_QuanFneg = 0x000400000 //圈风1
var CHR_DDHQSZiMo = 0x000800000	//七星缺色300
var CHR_DDHQSDianPao = 0x001000000	//七星缺色250
var CHR_SHuaRe = 0x002000000	//四花300
var CHR_CZhengFeng = 0x004000000	//财正风
//#ifdef xxxxxx
var map_mask2Name2 = 
[
	['CHR_DaDuiDuiYDa', '大对对(有搭)50'],
	['CHR_DaDuiDuiWDa', '大对对(无搭)100'],
	['CHR_DaDiaoChYDa', '大吊车(有搭)50'],
	['CHR_DaDiaoChWDa', '大吊车(无搭)100'],
	['CHR_QiDuiTouYDa', '七对头(有搭)70'],
	['CHR_QiDuiTouWDa', '七对头(无搭)150'],
	['CHR_QiDuiTouAZ', '七对头(暗炸)100'],
	['CHR_QiDuiTouMZ', '七对头(明炸)50'],
	['CHR_ZhiGangBKH', '直杠(不开花)50'],  
	['CHR_ZhiGangKH', '直杠(开花)100'],  
	['CHR_AnGangBKH', '暗杠(不开花)100'], 
	['CHR_AnGangKH', '暗杠(开花)150'],  
	['CHR_FXGangBKH', '风险杠(不开花)100'],  
	['CHR_FXGangKH', '风险杠(开花)200'],  
	['CHR_HGangKH', '花杠杠开50'], 
	['CHR_PTSanDa', '普通三百搭150'],
	['CHR_SHSanDa', '三花三百搭300'],
	['CHR_SHua', '四花150'],
	['CHR_ZFB1', '中发白1'],
	['CHR_ZFB2', '中发白2'],
	['CHR_ZFB3', '中发白3'],  
	['CHR_ZhengFeng', '正风2'],
	['CHR_QuanFneg', '圈风1'],
	['CHR_DDHQSZiMo', '七星缺色300'],
	['CHR_DDHQSDianPao', '七星缺色250'],
	['CHR_SHuaRe', '四花150X2'],
	['CHR_CZhengFeng', '正风(财)2'],
]

var map_mask2Name = 
[
	['CHR_AnQiXing', '暗七星150'],
	['CHR_HunYiSe', '混一色70'],
	['CHR_QingYiSe', '清一色150'],
	['CHR_PengPengHu', '大对对'],
	['CHR_PangHu', '朋胡1'],
	['CHR_WuDa', '无搭1'],
	['CHR_QiXiaoDui', '七对头'],
	['CHR_YiDa', '一搭1'],
	['CHR_ErDa', '二搭2'],
	['CHR_SanDa', '三百搭'],
	['CHR_HaiDa', '还搭1'],
	['CHR_ZiMo', '自摸1'],
	['CHR_MingQiXing', '明七星100'],
	['CHR_GangKai', '杠开'],
	['CHR_QiangGang', '拉杠胡100'],
	['CHR_TianHu', '天胡150'],
	['CHR_DiHu', '地胡150'],
	['CHR_DanDiao', '单吊1'],
	['CHR_HaiDiLaoYue', '海底捞月150'],
	['CHR_DaDiao', '大吊车'],
	['CHR_QiXingQueSe', '七星缺色'],
	['CHR_LuanLaoTou', '乱老头500'],
	['CHR_LanBaiDa', '十三不搭50'],
	['CHR_BaHuaCuo', '八花(搓胡)1000'],
	['//CHR_SiHua', '四花'],
	['CHR_BaHuaZhi', '八花(直胡)500'],
	['CHR_BianHu', '边胡1'],
	['CHR_QianHu', '嵌胡1'],
	['CHR_DuiDao', '对倒1'],
	['CHR_QingLaoTou', '清老头1000'],
	['CHR_DadaHuQueSe', '大大胡(缺色)200'],
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

var CMD_S_Call = 
[
	['DWORD', 'dwBankerUserId'],								//庄家用户
	['BYTE', 'cbCallRecord', GAME_PLAYER, 2],//下跑 加顶分
]

//游戏开始
var CMD_S_GameStart = 
[
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

	['BYTE', 'cbHandCardData', MAX_COUNT],					//扑克列表
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
		['WORD', 'wProvideUser'],						//供应用户

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
	['WORD', 'wWinner'],
	['WORD', 'wExitUser'],							//强退用户
	['BYTE', 'endType'],   							//0强退 1流局 2自摸 3点炮
	['WORD', 'wProvideUser'],						//供应用户
	['BYTE', 'cbProvideCardData'],						//供应扑克
	['DWORD', 'dwChiHuKind', GAME_PLAYER],			//胡牌类型
	['DWORD', 'dwChiHuRight', GAME_PLAYER],			//胡牌类型
	['DWORD', 'dwChiHuAssist', GAME_PLAYER],			//辅助胡型

	['SCORE', 'lGameScore', GAME_PLAYER],			//游戏积分
	['BYTE', 'cbHandCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbHandCardData', GAME_PLAYER, MAX_COUNT],	//扑克数据

	//组合扑克
	['BYTE', 'cbWeaveCount', GAME_PLAYER],					//组合数目
	['tagWeaveItem', 'WeaveItemArray', GAME_PLAYER, MAX_WEAVE],		//组合扑克

	['BYTE', 'cbPlayerFlowerCount', GAME_PLAYER],			//丢弃花牌数目
	['BYTE', 'cbPlayerFlowerCardData', GAME_PLAYER, MAX_FLOWER_COUNT],		//丢弃花牌记录
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
//////////////////////////////////////////////////////////////////////////
//客户端命令结构

var SUB_C_OUT_CARD = 1									//出牌命令
var SUB_C_OPERATE_CARD = 3									//操作扑克
var SUB_C_CALL = 4									//操作扑克
var SUB_C_MOPAI = 5									//摸牌选择
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
//////////////////////////////////////////////////////////////////////////

//#endif