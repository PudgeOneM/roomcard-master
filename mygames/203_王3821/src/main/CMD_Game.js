//#ifndef CMD_GAME_HEAD_FILE
//#define CMD_GAME_HEAD_FILE

//#pragma pack(1)

//////////////////////////////////////////////////////////////////////////////////
//服务定义

//游戏属性
var KIND_ID = 203									//游戏 I D
var GAME_NAME = "王3821三人"					//游戏名字

//组件属性
var GAME_PLAYER = 3									//游戏人数
var VERSION_SERVER = PROCESS_VERSION(6,0,3)				//程序版本
var VERSION_CLIENT = PROCESS_VERSION(6,0,3)				//程序版本

//////////////////////////////////////////////////////////////////////////////////

//数目定义
var MAX_COUNT = 19									//最大数目
var FULL_COUNT = 54									//全牌数目

//逻辑数目
var NORMAL_COUNT = 16									//常规数目
var DISPATCH_COUNT = 48									//派发数目

//数值掩码
var MASK_COLOR = 0xF0								//花色掩码
var MASK_VALUE = 0x0F								//数值掩码

//逻辑类型
var CT_ERROR = 0									//错误类型
var CT_SINGLE = 1									//单牌类型
var CT_DOUBLE = 2									//对牌类型
var CT_SINGLE_LINE = 3									//单连类型
var CT_DOUBLE_LINE = 4									//对连类型
var CT_XBOMB_CARD = 5									//小炮三个3、三个8、三个2、三个A、三个K、三个Q、三个J、三个10、三个9、三个7、三个6、三个5、三个4
var CT_DBOMB_CARD = 6									//大炮四个3、四个8、四个2、四个A、四个K、四个Q、四个J、四个10、四个9、四个7、四个6、四个5、四个4；
var CT_XW3821_CARD = 7									//2、王三八二一：大王三八二一、小王三八二一；
var CT_DW3821_CARD = 8									//2、王三八二一：大王三八二一、小王三八二一；
var CT_MISSILE_CARD = 9									//1、天剑：一大王一小王；

//////////////////////////////////////////////////////////////////////////////////
//状态定义

var GAME_SCENE_FREE = GAME_STATUS_FREE					//等待开始
var GAME_SCENE_CALL = GAME_STATUS_PLAY					//叫牌状态
var GAME_SCENE_PLAY = GAME_STATUS_PLAY+1					//游戏进行

//空闲状态
var CMD_S_StatusFree = 
[
	//游戏属性
	['LONG', 'lCellScore'],							//基础积分
	['LONG', 'lScoreTimes'],						//翻倍数
	//时间信息
	['BYTE', 'cbTimeOutCard'],						//出牌时间
	['BYTE', 'cbTimeCallCard'],						//叫牌时间
	['BYTE', 'cbTimeStartGame'],					//开始时间
	['BYTE', 'cbTimeHeadOutCard'],					//首出时间
	['bool', 'bTrustee', GAME_PLAYER],				//用户托管信息
	//历史积分
	['SCORE', 'lTurnScore', GAME_PLAYER],			//积分信息
	['SCORE', 'lCollectScore', GAME_PLAYER],			//积分信息
]

//叫牌状态
var CMD_S_StatusCall = 
[
	//时间信息
	['BYTE', 'cbTimeOutCard'],						//出牌时间
	['BYTE', 'cbTimeCallCard'],						//叫牌时间
	['BYTE', 'cbTimeStartGame'],					//开始时间
	['BYTE', 'cbTimeHeadOutCard'],					//首出时间
	['bool', 'bTrustee', GAME_PLAYER],				//用户托管信息

	['bool', 'bStartGame'],							//是否开始游戏
	['WORD', 'wTurnChairID'],						//上一轮操作玩家
	['WORD', 'wBankChairID'],						//庄家椅号
	['WORD', 'wGiveUpChairID1'],					//放弃玩家
	['WORD', 'wHong4ChairID'],						//红4玩家
	['WORD', 'wHong4Pos'],							//红黑梅方45
	['BYTE', 'cbGameType'],							//是否明包 0明包 1争上游
	['BYTE', 'cbTurnType'],							//当前类型
	['BYTE', 'cbCallCard'],							//庄家叫的牌
	['int', 'cbParam1'],							//参数1
	['int', 'cbParam2'],							//参数2
	
	//游戏信息
	['WORD', 'wCurrentUser'],						//当前玩家
	['LONG', 'lCellScore'],							//单元积分
	['LONG', 'lScoreTimes'],						//翻倍数

	['BYTE', 'cbDiCardData', 6],					//底牌显示
	['TCHAR', 'szDiCardName1', LEN_NICKNAME],		//抽底牌用户1
	['TCHAR', 'szDiCardName2', LEN_NICKNAME],		//抽底牌用户2
	['BYTE', 'cbHandCardData', MAX_COUNT],			//手上扑克
	['BYTE', 'cbHandCardCount', GAME_PLAYER],		//手上扑克数量

	//历史积分
	['SCORE', 'lTurnScore', GAME_PLAYER],			//积分信息
	['SCORE', 'lCollectScore', GAME_PLAYER],			//积分信息
]

//游戏状态
var CMD_S_StatusPlay = 
[
	//时间信息
	['BYTE', 'cbTimeOutCard'],						//出牌时间
	['BYTE', 'cbTimeCallCard'],						//叫牌时间
	['BYTE', 'cbTimeStartGame'],					//开始时间
	['BYTE', 'cbTimeHeadOutCard'],					//首出时间
	['bool', 'bTrustee', GAME_PLAYER],				//用户托管信息
	//游戏变量
	['LONG', 'lCellScore'],							//单元积分
	['LONG', 'lScoreTimes'],						//倍数

	['WORD', 'wBankChairID'],						//庄家椅号
	['WORD', 'wGiveUpChairID1'],					//放弃玩家
	['WORD', 'wHong4BankChairID'],					//红4先打的椅号
	['BYTE', 'cbGameType'],							//是否明包 0明包 1争上游
	['BYTE', 'cbCallCard'],							//庄家叫的牌
	['BYTE', 'cbBombCount'],						//炸弹次数
	['WORD', 'wBankUser'],							//庄家用户
	['WORD', 'wCurrentUser'],						//当前玩家
	['BYTE', 'cbWinPosition', GAME_PLAYER],			//玩家名次

	//出牌信息
	['WORD', 'wTurnWiner'],							//胜利玩家
	['BYTE', 'cbTurnCardCount'],					//出牌数目
	['BYTE', 'cbTurnCardData', MAX_COUNT],			//出牌数据

	//扑克信息
	['BYTE', 'cbDiCardData', 6],					//底牌显示
	['TCHAR', 'szDiCardName1', LEN_NICKNAME],		//抽底牌用户1
	['TCHAR', 'szDiCardName2', LEN_NICKNAME],		//抽底牌用户2
	['BYTE', 'cbHandCardData', MAX_COUNT],			//手上扑克
	['BYTE', 'cbHandCardCount', GAME_PLAYER],		//扑克数目

	//历史积分
	['SCORE', 'lTurnScore', GAME_PLAYER],			//积分信息
	['SCORE', 'lCollectScore', GAME_PLAYER],			//积分信息
]

//////////////////////////////////////////////////////////////////////////////////
//命令定义

var SUB_S_GAME_START = 100									//游戏开始
var SUB_S_CALL_CARD = 101									//用户叫牌
var SUB_S_BANKER_INFO = 102									//庄家信息
var SUB_S_OUT_CARD = 103									//用户出牌
var SUB_S_PASS_CARD = 104									//用户放弃
var SUB_S_GAME_CONCLUDE = 105									//游戏结束
var SUB_S_SET_BASESCORE = 106									//设置基数
var SUB_S_TRUSTEE = 107									//用户托管
var SUB_S_SEE_CARD = 108                                 //请求看牌
var SUB_S_SEE_CARD_NO = 109                                 //不同意看牌
var SUB_S_SEE_CARD_OK = 110                                 //同意看牌
var SUB_S_USER_COME = 112									//用户重连进来
var SUB_S_HAND_CARD = 113									//重新发送用户扑克
var SUB_S_TIPMESSAGE = 114									//用户语音

//发送扑克
var CMD_S_GameStart = 
[
	['WORD', 'wStartUser'],							//开始玩家
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wHong4ChairID'],						//红4玩家
	['WORD', 'wHong4Pos'],							//红黑梅方45
	['BYTE', 'cbValidCardData'],					//明牌扑克
	['BYTE', 'cbValidCardIndex'],					//明牌位置
	['LONG', 'lCellScore'],							//底分
	['LONG', 'lScoreTimes'],						//倍数
	['BYTE', 'cbCardData', MAX_COUNT],				//扑克列表
	['BYTE', 'cbCardCount', GAME_PLAYER],			//牌的数量
]

//发送超时用户扑克
var CMD_S_GameHandCard = 
[
	['WORD', 'wChairID'],							//当前玩家
	['BYTE', 'cbCardData', MAX_COUNT],				//扑克列表
	['BYTE', 'cbCardCount'],						//牌的数量
]

//机器人扑克
var CMD_S_AndroidCard = 
[
	['BYTE', 'cbHandCard', GAME_PLAYER, MAX_COUNT],//手上扑克
	['WORD', 'wCurrentUser'],						//当前玩家
]

//用户叫牌
var CMD_S_CallCard = 
[
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wTurnChairID'],						//上一轮操作玩家
	['WORD', 'wBankChairID'],						//庄家椅号
	['WORD', 'wGiveUpChairID1'],					//放弃玩家
	['WORD', 'wHong4BankChairID'],					//红4庄家
	['BYTE', 'cbGameType'],							//是否明包 0明包 1争上游
	['BYTE', 'cbTurnType'],							//当前类型
	['BYTE', 'cbCallCard'],							//庄家叫的牌
	['int', 'cbParam1'],							//参数1
	['int', 'cbParam2'],							//参数2
	['bool', 'bStartGame'],							//是否开始游戏
	['LONG', 'lCellScore'],							//底分
	['LONG', 'lScoreTimes'],						//倍数
	['BYTE', 'cbGetCard', GAME_PLAYER, 3],			//抽取扑克
	['BYTE', 'cbDiCardData', 6],					//底牌显示
	['TCHAR', 'szDiCardName1', LEN_NICKNAME],		//抽底牌用户1
	['TCHAR', 'szDiCardName2', LEN_NICKNAME],		//抽底牌用户2
	['TCHAR', 'szNormalString', 128],				//叫牌内容
]

//用户进来
var CMD_S_UserCome = 
[
	['WORD', 'wChairID'],							//当前玩家
	['int', 'iTimeID'],							//游戏时钟
	['int', 'iTimeNum'],							//上一轮操作玩家
]

//庄家信息
var CMD_S_BankerInfo = 
[
	['WORD', 'wBankUser'],							//庄家玩家
	['WORD', 'wCurrentUser'],						//当前玩家
]

//用户托管
var CMD_S_Trustee = 
[
	['WORD', 'wChairID'],							//玩家椅号
	['bool', 'bTrustee'],							//是否托管
]

//用户语音
var CMD_S_TipMessage = 
[
	['WORD', 'wChairID'],							//玩家椅号
	['int', 'iTipMessage'],						//用户语音
	['TCHAR', 'szTipMessage', 64],					//用户语音内容
]

//用户出牌
var CMD_S_OutCard = 
[
	['BYTE', 'cbOutCardCount'],						//出牌数目
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wOutCardUser'],						//出牌玩家
	['WORD', 'wShunFenParChairID'],					//己出完给顺风的玩家
	['WORD', 'wShunFenChairID'],					//最后一手王炸，顺风的椅号
	['BYTE', 'cbCallCard'],							//庄家所叫的牌
	['WORD', 'cbBankChairID'],						//庄家ID号
	['BYTE', 'cbSingleWinPosition'],				//赢的名次0代表无，1代表首家，2代表二家。
	['LONG', 'lCellScore'],							//底分
	['LONG', 'lScoreTimes'],						//倍数
	['BYTE', 'cbOutCardData', MAX_COUNT],				//扑克列表
]

//放弃出牌
var CMD_S_PassCard = 
[
	['BYTE', 'cbTurnOver'],							//一轮结束
	['WORD', 'wCurrentUser'],						//当前玩家
	['WORD', 'wPassCardUser'],						//放弃玩家
]

//游戏结束
var CMD_S_GameConclude = 
[
	//积分变量
	['LONG', 'lCellScore'],							//单元积分
	['LONG', 'lScoreTimes'],						//倍数
	['SCORE', 'lGameScore', GAME_PLAYER],			//游戏铜钱
	['SCORE', 'lGrade', GAME_PLAYER],				//游戏积分
	['BYTE', 'cbGameType'],							//游戏类型
	['BYTE', 'cbQinShui'],							//清水 1清水 0混水
	['WORD', 'wWinChairID', GAME_PLAYER],			//排名顺序
	//用户信息
	['WORD', 'wFaceID', GAME_PLAYER],
	['DWORD', 'wUserID', GAME_PLAYER],
	['TCHAR', 'szNickName', GAME_PLAYER, LEN_NICKNAME],
	['BYTE', 'cbWinFlag', GAME_PLAYER],				//用户输赢标记
	['BYTE', 'cbGameEndFlag'],						//本局游戏结束标记
	['WORD', 'wBankChairID'],						//庄家椅号

	//炸弹信息
	['BYTE', 'cbBombCount'],						//炸弹个数
	['BYTE', 'cbEachBombCount', GAME_PLAYER],		//炸弹个数

	//游戏信息
	['BYTE', 'cbDiCardData', 6],					//扑克底牌
	['BYTE', 'cbCardCount', GAME_PLAYER],			//扑克数目
	['BYTE', 'cbHandCardData', FULL_COUNT],			//扑克列表
]

//////////////////////////////////////////////////////////////////////////////////
//命令定义

var SUB_C_CALL_CARD = 1									//用户叫牌
var SUB_C_OUT_CARD = 2									//用户出牌
var SUB_C_PASS_CARD = 3									//用户放弃
var SUB_C_TRUSTEE = 4									//用户托管
var SUB_C_SEE_CARD = 5                                   //请求看牌
var SUB_C_SEE_CARD_OK = 6									//同意看牌
var SUB_C_SEE_CARD_NO = 7									//不同意看牌
var SUB_C_TIPMESSAGE = 8									//用户语音

var CMD_C_SEE_CARD_RESULT = 
[
	['DWORD', 'dwTargetID'],    //请求看牌结果的目标
]

var CMD_S_SEE_CARD = 
[
	['TCHAR', 'szName', 256],
	['DWORD', 'dwUserID'],
]

var CMD_S_SendFriendCard = 
[
	['BYTE', 'bCardData', MAX_COUNT],
	['BYTE', 'bCardCount'],
]

//用户叫牌
var CMD_C_CallCard = 
[
	['int', 'cbParam1'],						//类型1
	['int', 'cbParam2'],						//类型2
]

//用户叫牌
var CMD_C_Trustee = 
[
	['WORD', 'wChairID'],						//用户椅号
	['bool', 'bTrustee'],						//是否托管
]

//用户语音
var CMD_C_TipMessage = 
[
	['WORD', 'wChairID'],						//用户椅号
	['int', 'iTipMessage'],					//语音
	['TCHAR', 'szTipMessage', 64],					//用户语音内容
]

//用户出牌
var CMD_C_OutCard = 
[
	['BYTE', 'cbCardCount'],						//出牌数目
	['BYTE', 'cbCardData', MAX_COUNT],				//扑克数据
]

//////////////////////////////////////////////////////////////////////////////////

//#pragma pack()

//#endif