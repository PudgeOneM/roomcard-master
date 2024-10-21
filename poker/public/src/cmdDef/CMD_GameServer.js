//#ifndef CMD_GAME_SERVER_HEAD_FILE
//#define CMD_GAME_SERVER_HEAD_FILE

//#pragma pack(1)

//////////////////////////////////////////////////////////////////////////////////
//登录命令

var MDM_GR_LOGON = 1									//登录信息

//登录模式
var SUB_GR_LOGON_USERID = 1									//I D 登录
var SUB_GR_COOKIE_CONFIRM = 4									//cookie验证
var SUB_GR_UPDATE_LOCATION = 5									//上传定位
var SUB_REQUEST_RECORD_VEDIO = 6							//请求录像

//登录结果
var SUB_GR_LOGON_SUCCESS = 100								//登录成功
var SUB_GR_LOGON_FAILURE = 101								//登录失败
var SUB_GR_LOGON_FINISH = 102								//登录完成
var SUB_GR_COOKIE_CONFIRM_RESULT = 103								//cookie验证结果

//升级提示
var SUB_GR_UPDATE_NOTIFY = 200									//升级提示

//////////////////////////////////////////////////////////////////////////////////

//I D 登录
var CMD_GR_LogonUserID = 
[
	//版本信息
	['DWORD', 'dwPlazaVersion'],						//广场版本
	['DWORD', 'dwFrameVersion'],						//框架版本
	['DWORD', 'dwProcessVersion'],					//进程版本

	//登录信息
	['DWORD', 'dwUserID'],							//用户 I D
	['TCHAR', 'szPassword', LEN_MD5],				//登录密码
	['TCHAR', 'szMachineID', LEN_MACHINE_ID],		//机器序列
	['WORD', 'wKindID'],							//类型索引
]

//cookie验证
var CMD_GR_CookieConfirm = 
[
	['UCHAR', 'szCookie', LEN_COOKIE],				//cookie加密串
]

//上传定位
var CMD_GR_UpdateLocation = 
[
	['DWORD', 'dwUserID'],							//用户 I D
	['TCHAR', 'szLatitude', LEN_LATITUDE],			//纬度
	['TCHAR', 'szLongitude', LEN_LONGITUDE],			//经度
]

//请求录像
var CMD_GR_RequestRecordVedio = 
[
 ['DWORD', 'dwOpenID'],       //开局ID
 ['WORD', 'wRecordNum'],       //第几局
]

//登录成功
var CMD_GR_LogonSuccess = 
[
	['DWORD', 'dwUserRight'],						//用户权限
	['DWORD', 'dwMasterRight'],						//管理权限
	['WORD', 'wKindID'],							//挂接类型(相当于游戏ID)
]

//登录失败
var CMD_GR_LogonFailure = 
[
	['LONG', 'lErrorCode'],							//错误代码
	['TCHAR', 'szDescribeString', 128],				//描述消息
]

//升级提示
var CMD_GR_UpdateNotify = 
[
	//升级标志
	['BYTE', 'cbMustUpdatePlaza'],					//强行升级
	['BYTE', 'cbMustUpdateClient'],					//强行升级
	['BYTE', 'cbAdviceUpdateClient'],				//建议升级

	//当前版本
	['DWORD', 'dwCurrentPlazaVersion'],				//当前版本
	['DWORD', 'dwCurrentFrameVersion'],				//当前版本
	['DWORD', 'dwCurrentClientVersion'],				//当前版本
]

//cookie验证结果
var CMD_GR_CookieConfirmResult = 
[
	['bool', 'bIsSuccess'],							//是否通过
	['DWORD', 'dwUserID'],							//用户 I D
]
//////////////////////////////////////////////////////////////////////////////////
//配置命令

var MDM_GR_CONFIG = 2									//配置信息

var SUB_GR_CONFIG_COLUMN = 100									//列表配置
var SUB_GR_CONFIG_SERVER = 101									//房间配置
var SUB_GR_CONFIG_PROPERTY = 102									//道具配置
var SUB_GR_CONFIG_FINISH = 103									//配置完成
var SUB_GR_CONFIG_USER_RIGHT = 104									//玩家权限

//////////////////////////////////////////////////////////////////////////////////

//列表配置
var CMD_GR_ConfigColumn = 
[
	['BYTE', 'cbColumnCount'],						//列表数目
	['tagColumnItem', 'ColumnItem', MAX_COLUMN],				//列表描述
]

//房间配置
var CMD_GR_ConfigServer = 
[
	//房间属性
	['WORD', 'wTableCount'],						//桌子数目
	['WORD', 'wChairCount'],						//椅子数目

	//房间配置
	['WORD', 'wServerType'],						//房间类型
	['DWORD', 'dwServerRule'],						//房间规则

	['WORD', 'wServerID'],							//房间标识
]

//道具配置
var CMD_GR_ConfigProperty = 
[
	['BYTE', 'cbPropertyCount'],					//道具数目
	['tagPropertyInfo', 'PropertyInfo', MAX_PROPERTY],			//道具描述
]

//玩家权限
var CMD_GR_ConfigUserRight = 
[
	['DWORD', 'dwUserRight'],						//玩家权限
]
//////////////////////////////////////////////////////////////////////////////////
//用户命令

var MDM_GR_USER = 3									//用户信息

//用户动作
var SUB_GR_USER_RULE = 1						//用户规则
var SUB_GR_USER_LOOKON = 2						//旁观请求
var SUB_GR_USER_SITDOWN = 3						//坐下请求
var SUB_GR_USER_STANDUP = 4						//起立请求
var SUB_GR_USER_INVITE = 5						//用户邀请
var SUB_GR_USER_INVITE_REQ = 6						//邀请请求
var SUB_GR_USER_REPULSE_SIT = 7						//拒绝玩家坐下
var SUB_GR_USER_KICK_USER = 8                       //踢出用户
var SUB_GR_USER_INFO_REQ = 9                       //请求用户信息
var SUB_GR_USER_CHAIR_REQ = 10                      //请求更换位置
var SUB_GR_USER_CHAIR_INFO_REQ = 11                      //请求椅子用户信息
var SUB_GR_USER_OPENING_ONE = 12						//开局1
var SUB_GR_USER_OPENING_TWO = 13						//开局2（紧接着开局1，如果开局步骤1返回成功就直接进行开局步骤2）
var SUB_GR_USER_TABLE_HISTORY_RECORD_REQ = 14						//本局历史战况
var SUB_GR_USER_ADD_SCORE = 15						//补分
var SUB_GR_USER_ADD_SCORE_CONFIRM = 16						//补分确认
var SUB_GR_USER_MAIL_CONFIRM = 17						//邮件确认
var SUB_GR_USER_GET_LOCATION = 18						//获取定位

//用户状态
var SUB_GR_USER_ENTER = 100									//用户进入
var SUB_GR_USER_SCORE = 101									//用户分数
var SUB_GR_USER_STATUS = 102									//用户状态
var SUB_GR_REQUEST_FAILURE = 103									//请求失败
var SUB_GR_SITDOWN_SUCCESS = 104									//坐下成功
var SUB_GR_SITDOWN_FAILURE = 105									//坐下失败
var SUB_GR_USER_DIAMOND = 106									//用户钻石
var SUB_GR_USER_INFO_UPDATE = 107									//用户信息更新
var SUB_GR_USER_CHAIR_MIX = 108									//座位打乱
var SUB_GR_USER_GET_LOCATION_RESULT = 109									//获取其他玩家的定位

//聊天命令
var SUB_GR_USER_CHAT = 201									//聊天消息
var SUB_GR_USER_EXPRESSION = 202									//表情消息
var SUB_GR_WISPER_CHAT = 203									//私聊消息
var SUB_GR_WISPER_EXPRESSION = 204									//私聊表情
var SUB_GR_COLLOQUY_CHAT = 205									//会话消息
var SUB_GR_COLLOQUY_EXPRESSION = 206									//会话表情
var SUB_GR_USER_WECHAT = 207									//微信语音

//道具命令
var SUB_GR_PROPERTY_BUY = 300									//购买道具
var SUB_GR_PROPERTY_SUCCESS = 301									//道具成功
var SUB_GR_PROPERTY_FAILURE = 302									//道具失败
var SUB_GR_PROPERTY_MESSAGE = 303                                 //道具消息
var SUB_GR_PROPERTY_EFFECT = 304                                 //道具效应
var SUB_GR_PROPERTY_TRUMPET = 305                                 //喇叭消息

//房间处理结果
var SUB_GR_USER_OPENING_SUCCESSS = 400						//房间开局成功
var SUB_GR_USER_OPENING_FAILURE = 401						//房间开局失败
var SUB_GR_USER_TABLE_HISTORY_RECORD_RESULT = 402						//本局历史战况结果
var SUB_GR_USER_ADD_SCORE_NOTIFY = 403						//带入值补分通知
var SUB_GR_USER_ADD_SCORE_SUCCESSS = 404						//补分成功
var SUB_GR_USER_ADD_SCORE_FAILURE = 405						//补分失败
var SUB_GR_USER_ADD_SCORE_SUGGEST = 406						//补分建议
var SUB_GR_USER_ADD_SCORE_APPLY = 407						//补分申请
var SUB_GR_USER_MAIL_CONFIRM_RESULT = 408						//邮件确认结果

//////////////////////////////////////////////////////////////////////////////////

//旁观请求
var CMD_GR_UserLookon = 
[
	['WORD', 'wTableID'],							//桌子位置
]

//坐下请求
var CMD_GR_UserSitDown = 
[
	['WORD', 'wTableID'],							//桌子位置
	['WORD', 'wChairID'],							//椅子位置
	['TCHAR', 'szPassword', LEN_PASSWORD],			//桌子密码
]

//起立请求
var CMD_GR_UserStandUp = 
[
	['WORD', 'wTableID'],							//桌子位置
	['WORD', 'wChairID'],							//椅子位置
	['BYTE', 'cbForceLeave'],						//强行离开
]

//邀请用户 
var CMD_GR_UserInvite = 
[
	['WORD', 'wTableID'],							//桌子号码
	['DWORD', 'dwUserID'],							//用户 I D
]

//邀请用户请求 
var CMD_GR_UserInviteReq = 
[
	['WORD', 'wTableID'],							//桌子号码
	['DWORD', 'dwUserID'],							//用户 I D
]

//用户分数
var CMD_GR_UserScore = 
[
	['DWORD', 'dwUserID'],							//用户标识
	['tagUserScore', 'UserScore'],							//积分信息
]

//用户分数
var CMD_GR_MobileUserScore = 
[
	['DWORD', 'dwUserID'],							//用户标识
	['tagMobileUserScore', 'UserScore'],							//积分信息
]

//用户状态
var CMD_GR_UserStatus = 
[
	['DWORD', 'dwUserID'],							//用户标识
	['tagUserStatus', 'UserStatus'],							//用户状态
]

//请求失败
var CMD_GR_RequestFailure = 
[
	['LONG', 'lErrorCode'],							//错误代码
	['TCHAR', 'szDescribeString', 256],				//描述信息
]

//用户钻石
var CMD_GR_UserDiamond = 
[
	['DWORD', 'dwUserID'],							//用户标识
	['SCORE', 'lDiamond'],							//用户钻石
]

//用户聊天
var CMD_GR_C_UserChat = 
[
	['WORD', 'wChatLength'],						//信息长度
	['DWORD', 'dwChatColor'],						//信息颜色
	['DWORD', 'dwTargetUserID'],						//目标用户
	['TCHAR', 'szChatString', LEN_USER_CHAT],		//聊天信息
]

//用户聊天
var CMD_GR_S_UserChat = 
[
	['WORD', 'wChatLength'],						//信息长度
	['DWORD', 'dwChatColor'],						//信息颜色
	['DWORD', 'dwSendUserID'],						//发送用户
	['DWORD', 'dwTargetUserID'],						//目标用户
	['TCHAR', 'szChatString', LEN_USER_CHAT],		//聊天信息
]

//用户表情
var CMD_GR_C_UserExpression = 
[
	['WORD', 'wItemIndex'],							//表情索引
	['DWORD', 'dwTargetUserID'],						//目标用户
]

//用户表情
var CMD_GR_S_UserExpression = 
[
	['WORD', 'wItemIndex'],							//表情索引
	['DWORD', 'dwSendUserID'],						//发送用户
	['DWORD', 'dwTargetUserID'],						//目标用户
]

//用户私聊
var CMD_GR_C_WisperChat = 
[
	['WORD', 'wChatLength'],						//信息长度
	['DWORD', 'dwChatColor'],						//信息颜色
	['DWORD', 'dwTargetUserID'],						//目标用户
	['TCHAR', 'szChatString', LEN_USER_CHAT],		//聊天信息
]

//用户私聊
var CMD_GR_S_WisperChat = 
[
	['WORD', 'wChatLength'],						//信息长度
	['DWORD', 'dwChatColor'],						//信息颜色
	['DWORD', 'dwSendUserID'],						//发送用户
	['DWORD', 'dwTargetUserID'],						//目标用户
	['TCHAR', 'szChatString', LEN_USER_CHAT],		//聊天信息
]

//私聊表情
var CMD_GR_C_WisperExpression = 
[
	['WORD', 'wItemIndex'],							//表情索引
	['DWORD', 'dwTargetUserID'],						//目标用户
]

//私聊表情
var CMD_GR_S_WisperExpression = 
[
	['WORD', 'wItemIndex'],							//表情索引
	['DWORD', 'dwSendUserID'],						//发送用户
	['DWORD', 'dwTargetUserID'],						//目标用户
]

//微信语音
var CMD_GR_C_WeChat = 
[
	['DWORD', 'dwUserID'],							//用户标识
	['WORD', 'wTableID'],							//桌子号码
	['TCHAR', 'szVoiceID', LEN_USER_CHAT],			//语音标识
	['WORD', 'wTime'],								//语音时常
]

//微信语音
var CMD_GR_S_WeChat = 
[
	['DWORD', 'dwUserID'],							//用户标识
	['WORD', 'wTableID'],							//桌子号码
	['TCHAR', 'szVoiceID', LEN_USER_CHAT],			//语音标识
	['WORD', 'wTime'],								//语音时常
]

//用户会话
var CMD_GR_ColloquyChat = 
[
	['WORD', 'wChatLength'],						//信息长度
	['DWORD', 'dwChatColor'],						//信息颜色
	['DWORD', 'dwSendUserID'],						//发送用户
	['DWORD', 'dwConversationID'],					//会话标识
	['DWORD', 'dwTargetUserID', 16],					//目标用户
	['TCHAR', 'szChatString', LEN_USER_CHAT],		//聊天信息
]

//邀请用户
var CMD_GR_C_InviteUser = 
[
	['WORD', 'wTableID'],							//桌子号码
	['DWORD', 'dwSendUserID'],						//发送用户
]

//邀请用户
var CMD_GR_S_InviteUser = 
[
	['DWORD', 'dwTargetUserID'],						//目标用户
]

//购买道具
var CMD_GR_C_PropertyBuy = 
[
	['BYTE', 'cbRequestArea'],						//请求范围
	['BYTE', 'cbConsumeScore'],						//积分消费
	['WORD', 'wItemCount'],							//购买数目
	['WORD', 'wPropertyIndex'],						//道具索引	
	['DWORD', 'dwTargetUserID'],						//使用对象
]

//道具成功
var CMD_GR_S_PropertySuccess = 
[
	['BYTE', 'cbRequestArea'],						//使用环境
	['WORD', 'wItemCount'],							//购买数目
	['WORD', 'wPropertyIndex'],						//道具索引
	['DWORD', 'dwSourceUserID'],						//目标对象
	['DWORD', 'dwTargetUserID'],						//使用对象
]

//道具失败
var CMD_GR_PropertyFailure = 
[
	['WORD', 'wRequestArea'],                       //请求区域
	['LONG', 'lErrorCode'],							//错误代码
	['TCHAR', 'szDescribeString', 256],				//描述信息
]

//道具消息
var CMD_GR_S_PropertyMessage = 
[
	//道具信息
	['WORD', 'wPropertyIndex'],                     //道具索引
	['WORD', 'wPropertyCount'],                     //道具数目
	['DWORD', 'dwSourceUserID'],                     //目标对象
	['DWORD', 'dwTargerUserID'],                     //使用对象
]


//道具效应
var CMD_GR_S_PropertyEffect = 
[
	['DWORD', 'wUserID'],					        //用 户I D
	['BYTE', 'cbMemberOrder'],						//会员等级
]

//发送喇叭
var CMD_GR_C_SendTrumpet = 
[
	['BYTE', 'cbRequestArea'],                        //请求范围 
	['WORD', 'wPropertyIndex'],                      //道具索引 
	['DWORD', 'TrumpetColor'],                        //喇叭颜色
	['TCHAR', 'szTrumpetContent', TRUMPET_MAX_CHAR],  //喇叭内容
]

//发送喇叭
var CMD_GR_S_SendTrumpet = 
[
	['WORD', 'wPropertyIndex'],                      //道具索引 
	['DWORD', 'dwSendUserID'],                         //用户 I D
	['DWORD', 'TrumpetColor'],                        //喇叭颜色
	['TCHAR', 'szSendNickName', 32],				    //玩家昵称 
	['TCHAR', 'szTrumpetContent', TRUMPET_MAX_CHAR],  //喇叭内容
]


//用户拒绝黑名单坐下
var CMD_GR_UserRepulseSit = 
[
	['WORD', 'wTableID'],							//桌子号码
	['WORD', 'wChairID'],							//椅子位置
	['DWORD', 'dwUserID'],							//用户 I D
	['DWORD', 'dwRepulseUserID'],					//用户 I D
]

//开局步骤1
var CMD_GR_C_OpeningOne = 
[
	['WORD', 'wTableID'],							//桌子号码
	['DWORD', 'dwUserID'],							//用户标识(创局人)
]

//开局步骤1
var CMD_GR_S_OpeningOne = 
[
	['WORD', 'wTableID'],							//桌子号码
	['DWORD', 'dwUserID'],							//用户标识
	['DWORD', 'dwEndTime'],							//牌局结束时间
	['bool', 'bIsSucess'],							//是否成功
	['TCHAR', 'szDescribeString', 128],				//描述消息
]

//开局步骤2
var CMD_GR_C_OpeningTwo = 
[
	['WORD', 'wTableID'],							//桌子号码
]

//本局历史战况请求
var CMD_GR_C_TableHistoryRecordReq = 
[
	['TCHAR', 'szTableKey', LEN_KEYTABLE],			//房间口令
]

//本局历史战况
var CMD_GR_S_TableHistoryRecord = 
[
	['WORD', 'wRoundCount'],								//总的轮数
	['SCORE', 'lTatalTakeInScore'],							//总带入值
	['WORD', 'wRecordCount'],								//战绩条数
	['tagTableHistoryRecordInfo', 'TableHistoryRecordInfo', MAX_TABALE_RECORD],	//本局战绩信息
]

//补分通知
var CMD_GR_S_AddScoreNotify = 
[
	['DWORD', 'dwUserID'],							//用户 I D
	['SCORE', 'lTakeInScore'],						//玩家带入数
]

//补分
var CMD_GR_AddScore = 
[
	['SCORE', 'lAddScore'],							//补充的分值
	['TCHAR', 'szTableKey', LEN_KEYTABLE],			//房间口令
]

//补分时向房主申请
var CMD_GR_AddScore_Apply = 
[
	['DWORD', 'dwUserID'],							//用户 I D
	['SCORE', 'lAddScore'],							//补充的分值
	['TCHAR', 'szTableKey', LEN_KEYTABLE],			//房间口令
	['DWORD', 'dwOpenID'],							//开局标识（不同于房间口令，房间口令可以回收）
]

//补分确认
var CMD_GR_AddScore_Confirm = 
[
	['DWORD', 'dwUserID'],							//用户 I D
	['SCORE', 'lAddScore'],							//补充的分值
	['TCHAR', 'szTableKey', LEN_KEYTABLE],			//房间口令
	['DWORD', 'dwOpenID'],							//开局标识（不同于房间口令，房间口令可以回收）
	['BYTE', 'bConfirm'],							//补分同意标志
]

//补分建议
var CMD_GR_S_AddScoreSuggest = 
[
	['DWORD', 'dwUserID'],							//用户 I D
]

//邮件确认
var CMD_GR_C_Mail_Confirm = 
[
	['DWORD', 'dwUserID'],							//用户 I D
	['DWORD', 'dwMailID'],							//邮件ID
]

//邮件确认结果
var CMD_GR_S_Mail_Confirm = 
[
	['DWORD', 'dwUserID'],							//用户 I D
	['DWORD', 'dwMailID'],							//邮件ID
	['bool', 'bIsSucess'],							//是否成功
	['TCHAR', 'szDescribeString', 128],				//错误消息
]

//获取IP
var CMD_GR_C_GetLocation = 
[
	['TCHAR', 'szTableKey', LEN_KEYTABLE],			//房间口令
]

//获取IP结果
var CMD_GR_S_GetLocation = 
[
	['DWORD', 'dwUserCount'],						//用户个数
	['tagUserAddrInfo', 'UserAddrInfo', MAX_CHAIR],			//地址信息				
]

//////////////////////////////////////////////////////////////////////////////////

//规则标志
var UR_LIMIT_SAME_IP = 0x01								//限制地址
var UR_LIMIT_WIN_RATE = 0x02								//限制胜率
var UR_LIMIT_FLEE_RATE = 0x04								//限制逃率
var UR_LIMIT_GAME_SCORE = 0x08								//限制积分

//用户规则
var CMD_GR_UserRule = 
[
	['BYTE', 'cbRuleMask'],							//规则掩码
	['WORD', 'wMinWinRate'],						//最低胜率
	['WORD', 'wMaxFleeRate'],						//最高逃率
	['LONG', 'lMaxGameScore'],						//最高分数 
	['LONG', 'lMinGameScore'],						//最低分数
]

//请求用户信息
var CMD_GR_UserInfoReq = 
[
	['DWORD', 'dwUserIDReq'],                        //请求用户
	['WORD', 'wTablePos'],							//桌子位置
]

//请求用户信息
var CMD_GR_ChairUserInfoReq = 
[
	['WORD', 'wTableID'],							//桌子号码
	['WORD', 'wChairID'],							//椅子位置
]
//////////////////////////////////////////////////////////////////////////////////
//状态命令

var MDM_GR_STATUS = 4									//状态信息

var SUB_GR_TABLE_INFO = 100									//桌子信息
var SUB_GR_TABLE_STATUS = 101									//桌子状态

var SUB_GR_TABLE_OWNER = 200									//当前房主

//////////////////////////////////////////////////////////////////////////////////

//桌子信息
var CMD_GR_TableInfo = 
[
	['tagTableStatus', 'TableStatusArray'],					//桌子状态（MAX_TABLE）
]

//桌子状态
var CMD_GR_TableStatus = 
[
	['WORD', 'wTableID'],							//桌子号码
	['tagTableStatus', 'TableStatus'],						//桌子状态
]

//当前房主
var CMD_GR_TableOwner = 
[
	['DWORD', 'dwTableOwner'],						//房主uid
]

//////////////////////////////////////////////////////////////////////////////////

//管理命令

var MDM_GR_MANAGE = 6									//管理命令

var SUB_GR_SEND_WARNING = 1									//发送警告
var SUB_GR_SEND_MESSAGE = 2									//发送消息
var SUB_GR_LOOK_USER_IP = 3									//查看地址
var SUB_GR_KILL_USER = 4									//踢出用户
var SUB_GR_LIMIT_ACCOUNS = 5									//禁用帐户
var SUB_GR_SET_USER_RIGHT = 6									//权限设置

//房间设置
var SUB_GR_QUERY_OPTION = 7									//查询设置
var SUB_GR_OPTION_SERVER = 8									//房间设置
var SUB_GR_OPTION_CURRENT = 9									//当前设置

var SUB_GR_LIMIT_USER_CHAT = 10									//限制聊天

var SUB_GR_KICK_ALL_USER = 11									//踢出用户
var SUB_GR_DISMISSGAME = 12									//解散游戏

var SUB_GR_ALLOCATE_TABLE = 13									//创建房间（其实就是分配一个桌子）
var SUB_GR_ACCESS_TABLE_BY_KEY = 14									//通过口令获取桌子号

var SUB_GR_GET_TAKE_IN_SCORE = 15									//获取带入值

//房主功能
var SUB_GR_SET_CONTROL_TAKEIN = 16									//设置控制带入
var SUB_GR_SET_MAX_TIMES_TAKEIN = 17									//设置带入最大倍数

var SUB_GR_GET_PAYINFO_IN_GAME = 18									//获取游戏内是否付过费
var SUB_GR_PAY_IN_GAME = 19									//游戏付费

var SUB_GR_ALLOCATE_TABLE_RESULT = 100						//创建房间结果（分配桌子结果）
var SUB_GR_ACCESS_TABLE_BY_KEY_RESULT = 101						//通过口令获取房间信息结果

var SUB_GR_GET_TAKE_IN_SCORE_RESULT = 102						//获取带入值结果

var SUB_GR_SET_CONTROL_TAKEIN_SUCCESSS = 200						//设置控制带入成功
var SUB_GR_SET_CONTROL_TAKEIN_FAILURE = 201						//设置控制带入失败

var SUB_GR_SET_MAX_TIMES_TAKEIN_RESULT = 202						//设置带入最大倍数结果
var SUB_GR_GET_PAYINFO_RESULT = 203						//付费信息查询结果
var SUB_GR_PAY_IN_GAME_RESULT = 204						//付费结果

//////////////////////////////////////////////////////////////////////////////////

//发送警告
var CMD_GR_SendWarning = 
[
	['WORD', 'wChatLength'],						//信息长度
	['DWORD', 'dwTargetUserID'],						//目标用户
	['TCHAR', 'szWarningMessage', LEN_USER_CHAT],	//警告消息
]

//系统消息
var CMD_GR_SendMessage = 
[
	['BYTE', 'cbGame'],								//游戏消息
	['BYTE', 'cbRoom'],								//游戏消息
	['BYTE', 'cbAllRoom'],							//游戏消息
	['WORD', 'wChatLength'],						//信息长度
	['TCHAR', 'szSystemMessage', LEN_USER_CHAT],		//系统消息
]

//邮件推送
var CMD_GR_SendMail = 
[
	['DWORD', 'dwMailID'],							//邮件ID
	['TCHAR', 'szSrcNick', LEN_NICKNAME],			//发件人昵称
	['TCHAR', 'szSystemMessage', LEN_USER_CHAT],		//邮件消息
]

//查看地址
var CMD_GR_LookUserIP = 
[
	['DWORD', 'dwTargetUserID'],						//目标用户
]

//踢出用户
var CMD_GR_KickUser = 
[
	['DWORD', 'dwTargetUserID'],						//目标用户
]

//禁用帐户
var CMD_GR_LimitAccounts = 
[
	['DWORD', 'dwTargetUserID'],						//目标用户
]

//权限设置
var CMD_GR_SetUserRight = 
[
	//目标用户
	['DWORD', 'dwTargetUserID'],						//目标用户

	//绑定变量
	['BYTE', 'cbGameRight'],						//帐号权限
	['BYTE', 'cbAccountsRight'],					//帐号权限

	//权限变化
	['BYTE', 'cbLimitRoomChat'],					//大厅聊天
	['BYTE', 'cbLimitGameChat'],					//游戏聊天
	['BYTE', 'cbLimitPlayGame'],					//游戏权限
	['BYTE', 'cbLimitSendWisper'],					//发送消息
	['BYTE', 'cbLimitLookonGame'],					//旁观权限
]

//房间设置
var CMD_GR_OptionCurrent = 
[
	['DWORD', 'dwRuleMask'],							//规则掩码
	['tagServerOptionInfo', 'ServerOptionInfo'],					//房间配置
]

//房间设置
var CMD_GR_ServerOption = 
[
	['tagServerOptionInfo', 'ServerOptionInfo'],					//房间配置
]

//踢出所有用户
var CMD_GR_KickAllUser = 
[
	['TCHAR', 'szKickMessage', LEN_USER_CHAT],		//踢出提示
]

//解散游戏
var CMD_GR_DismissGame = 
[
	['WORD', 'wDismissTableNum'],		            //解散桌号
]

//开房间（其实就是一个桌子）
var CMD_GR_C_AllocateTable = 
[
	['TCHAR', 'szTableName', LEN_SERVER],			//房间名称
	['WORD', 'wRoundTime'],							//牌局时间
	['SCORE', 'lTakeInScore'],						//玩家带入数
	['bool', 'bIsControlOpen'],						//是否开启控制
	['bool', 'bIsTableOwnerFixed'],					//是否固定房主
	['DWORD', 'dwRtID'],								//关系表ID
]

//房间分配结果
var CMD_GR_S_AllocateTableResult = 
[
	['LONG', 'lResultCode'],						//结果代码
	['TCHAR', 'szDescribeString', 128],				//描述消息
	['TCHAR', 'szTableKey', LEN_KEYTABLE],			//房间口令
	['TCHAR', 'szTableName', LEN_SERVER],			//房间名称
	['DWORD', 'dwUserID'],							//用户标识(创局人)
	['WORD', 'wTableID'],							//桌子号码
	['DWORD', 'dwEndTime'],							//牌局结束时间
	['SCORE', 'lTakeInScore'],						//玩家带入数
	['bool', 'bIsControlOpen'],						//是否开启控制
	['bool', 'bIsOpened'],							//是否已经开局
	['WORD', 'wMaxTimes'],							//最大带入值倍数
	['bool', 'bIsTableOwnerFixed'],					//是否固定房主
]

//房间口令访问
var CMD_GR_C_AccessTableByKey = 
[
	['DWORD', 'dwUserID'],							//用户标识
	['TCHAR', 'szTableKey', LEN_KEYTABLE],			//房间口令
]

//房间口令访问结果
var CMD_GR_S_AccessTableInfo = 
[
	['bool', 'bIsSucess'],							//是否成功访问
	['TCHAR', 'szTableName', LEN_SERVER],			//房间名称
	['WORD', 'wRoundTime'],							//牌局时间
	['DWORD', 'dwEndTime'],							//牌局结束时间
	['DWORD', 'dwUserID'],							//用户标识(创局人)
	['WORD', 'wTableID'],							//桌子号码
	['DWORD', 'dwOpenID'],							//开局标识（不同于房间口令，房间口令可以回收）
	['SCORE', 'lTakeInScore'],						//玩家带入数
	['bool', 'bIsControlOpen'],						//是否开启控制
	['bool', 'bIsOpened'],							//是否已经开局
	['DWORD', 'dwStaticBanker'],						//常庄ID
	['WORD', 'wMaxTimes'],							//最大带入值倍数
	['DWORD', 'dwTableOwner'],						//房主uid
	['bool', 'bIsTableOwnerFixed'],					//是否固定房主
	['WORD', 'wTotalPlayFees'],						//总费用
	['TCHAR', 'szDescribeString', 128],				//描述消息
]

//获取带入值
var CMD_GR_C_GetTakeInScore = 
[
	['TCHAR', 'szTableKey', LEN_KEYTABLE],			//房间口令
]

//带入值获取结果
var CMD_GR_S_GetTakeInScoreResult = 
[
	['bool', 'bIsSucess'],							//是否成功访问
	['SCORE', 'lTakeInScore'],						//玩家带入数
	['DWORD', 'dwUserID'],							//用户标识
]

//设置控制带入
var CMD_GR_C_SetControlTakeIn = 
[
	['bool', 'bOpen'],								//打开标识
	['TCHAR', 'szTableKey', LEN_KEYTABLE],			//房间口令
]

//设置最大带入倍数
var CMD_GR_C_SetMaxTimesTakeIn = 
[
	['WORD', 'wMaxTimes'],							//最大带入值倍数
	['TCHAR', 'szTableKey', LEN_KEYTABLE],			//房间口令
]

//设置最大带入倍数结果
var CMD_GR_S_SetMaxTimesTakeInResult = 
[
	['bool', 'bIsSucess'],							//是否成功
	['WORD', 'wTableID'],							//桌子号码
	['WORD', 'wMaxTimes'],							//最大带入值倍数
]

//查询游戏内是否付过费
var CMD_GR_C_GetPayInfo = 
[
	['TCHAR', 'szTableKey', LEN_KEYTABLE],			//房间口令
	['DWORD', 'dwUserID'],							//用户标识
]

//查询游戏内付费结果
var CMD_GR_S_GetPayInfoResult = 
[
	['bool', 'bIsSucess'],							//是否成功
	['WORD', 'wTableID'],							//桌子号码
	['DWORD', 'dwUserID'],							//用户标识
	['bool', 'bIsPayed'],							//是否已付费
]

//游戏付费
var CMD_GR_C_PayInGame = 
[
	['TCHAR', 'szTableKey', LEN_KEYTABLE],			//房间口令
	['DWORD', 'dwUserID'],							//用户标识
]

//付费结果
var CMD_GR_S_PayInGameResult = 
[
	['WORD', 'wTableID'],							//桌子号码
	['DWORD', 'dwUserID'],							//用户标识
	['bool', 'bIsSucess'],							//是否成功
	['TCHAR', 'szDescribeString', 128],				//描述消息
]

//////////////////////////////////////////////////////////////////////////////////

//设置标志
var OSF_ROOM_CHAT = 1									//大厅聊天
var OSF_GAME_CHAT = 2									//游戏聊天
var OSF_ROOM_WISPER = 3									//大厅私聊
var OSF_ENTER_TABLE = 4									//进入游戏
var OSF_ENTER_SERVER = 5									//进入房间
var OSF_SEND_BUGLE = 12									//发送喇叭

//房间设置
var CMD_GR_OptionServer = 
[
	['BYTE', 'cbOptionFlags'],						//设置标志
	['BYTE', 'cbOptionValue'],						//设置标志
]

//限制聊天
var CMD_GR_LimitUserChat = 
[
	['DWORD', 'dwTargetUserID'],						//目标用户
	['BYTE', 'cbLimitFlags'],						//限制标志
	['BYTE', 'cbLimitValue'],						//限制与否
]
//////////////////////////////////////////////////////////////////////////////////
//比赛命令

var MDM_GR_MATCH = 7									//比赛命令

var SUB_GR_MATCH_FEE = 400									//报名费用
var SUB_GR_MATCH_NUM = 401									//等待人数
var SUB_GR_LEAVE_MATCH = 402									//退出比赛
var SUB_GR_MATCH_INFO = 403									//比赛信息
var SUB_GR_MATCH_WAIT_TIP = 404									//等待提示
var SUB_GR_MATCH_RESULT = 405									//比赛结果
var SUB_GR_MATCH_STATUS = 406									//比赛状态
var SUB_GR_MATCH_USER_COUNT = 407									//参赛人数
var SUB_GR_MATCH_DESC = 408									//比赛描述
//比赛人数
var CMD_GR_Match_Num = 
[
	['DWORD', 'dwWaitting'],							//等待人数
	['DWORD', 'dwTotal'],							//开赛人数
	['DWORD', 'dwMatchTotal'],						//总人数
]

//赛事信息
var CMD_GR_Match_Info = 
[
	['TCHAR', 'szTitle', 4, 64],						//信息标题
    ['WORD', 'wGameCount'],							//游戏局数
]

//提示信息
var CMD_GR_Match_Wait_Tip = 
[
	['SCORE', 'lScore'],								//当前积分
	['WORD', 'wRank'],								//当前名次
	['WORD', 'wCurTableRank'],						//本桌名次
	['WORD', 'wUserCount'],							//当前人数
	['WORD', 'wPlayingTable'],						//游戏桌数
	['TCHAR', 'szMatchName', LEN_SERVER],			//比赛名称
]

//比赛结果
var CMD_GR_MatchResult = 
[
	['TCHAR', 'szDescribe', 256],					//得奖描述
	['DWORD', 'dwGold'],								//金币奖励
	['DWORD', 'dwMedal'],							//奖牌奖励
	['DWORD', 'dwExperience'],						//经验奖励
]

var MAX_MATCH_DESC = 4									//最多描述
//比赛描述
var CMD_GR_MatchDesc = 
[
	['TCHAR', 'szTitle', MAX_MATCH_DESC, 16],		//信息标题
	['TCHAR', 'szDescribe', MAX_MATCH_DESC, 64],		//描述内容
	['COLORREF', 'crTitleColor'],						//标题颜色
	['COLORREF', 'crDescribeColor'],					//描述颜色
]

//////////////////////////////////////////////////////////////////////////////////
//框架命令

var MDM_GF_FRAME = 100									//框架命令

//////////////////////////////////////////////////////////////////////////////////
//框架命令

//用户命令
var SUB_GF_GAME_OPTION = 1									//游戏配置
var SUB_GF_USER_READY = 2									//用户准备
var SUB_GF_LOOKON_CONFIG = 3									//旁观配置

//聊天命令
var SUB_GF_USER_CHAT = 10									//用户聊天
var SUB_GF_USER_EXPRESSION = 11									//用户表情

//游戏信息
var SUB_GF_GAME_STATUS = 100									//游戏状态
var SUB_GF_GAME_SCENE = 101									//游戏场景
var SUB_GF_LOOKON_STATUS = 102									//旁观状态

//系统消息
var SUB_GF_SYSTEM_MESSAGE = 200									//系统消息
var SUB_GF_ACTION_MESSAGE = 201									//动作消息

//////////////////////////////////////////////////////////////////////////////////

//游戏配置
var CMD_GF_GameOption = 
[
	['BYTE', 'cbAllowLookon'],						//旁观标志
	['DWORD', 'dwFrameVersion'],						//框架版本
	['DWORD', 'dwClientVersion'],					//游戏版本
]

//旁观配置
var CMD_GF_LookonConfig = 
[
	['DWORD', 'dwUserID'],							//用户标识
	['BYTE', 'cbAllowLookon'],						//允许旁观
]

//旁观状态
var CMD_GF_LookonStatus = 
[
	['BYTE', 'cbAllowLookon'],						//允许旁观
]

//游戏环境
var CMD_GF_GameStatus = 
[
	['BYTE', 'cbGameStatus'],						//游戏状态
	['BYTE', 'cbAllowLookon'],						//旁观标志
]

//用户聊天
var CMD_GF_C_UserChat = 
[
	['WORD', 'wChatLength'],						//信息长度
	['DWORD', 'dwChatColor'],						//信息颜色
	['DWORD', 'dwTargetUserID'],						//目标用户
	['TCHAR', 'szChatString', LEN_USER_CHAT],		//聊天信息
]

//用户聊天
var CMD_GF_S_UserChat = 
[
	['WORD', 'wChatLength'],						//信息长度
	['DWORD', 'dwChatColor'],						//信息颜色
	['DWORD', 'dwSendUserID'],						//发送用户
	['DWORD', 'dwTargetUserID'],						//目标用户
	['TCHAR', 'szChatString', LEN_USER_CHAT],		//聊天信息
]

//用户表情
var CMD_GF_C_UserExpression = 
[
	['WORD', 'wItemIndex'],							//表情索引
	['DWORD', 'dwTargetUserID'],						//目标用户
]

//用户表情
var CMD_GF_S_UserExpression = 
[
	['WORD', 'wItemIndex'],							//表情索引
	['DWORD', 'dwSendUserID'],						//发送用户
	['DWORD', 'dwTargetUserID'],						//目标用户
]

//////////////////////////////////////////////////////////////////////////////////
//游戏命令

var MDM_GF_GAME = 200									//游戏命令

//////////////////////////////////////////////////////////////////////////////////
//携带信息

//其他信息
var DTP_GR_TABLE_PASSWORD = 1									//桌子密码

//用户属性
var DTP_GR_NICK_NAME = 10									//用户昵称
var DTP_GR_GROUP_NAME = 11									//社团名字
var DTP_GR_UNDER_WRITE = 12									//个性签名

//附加信息
var DTP_GR_USER_NOTE = 20									//用户备注
var DTP_GR_CUSTOM_FACE = 21									//自定头像

//////////////////////////////////////////////////////////////////////////////////

//请求错误
var REQUEST_FAILURE_NORMAL = 0									//常规原因
var REQUEST_FAILURE_NOGOLD = 1									//金币不足
var REQUEST_FAILURE_NOSCORE = 2									//积分不足
var REQUEST_FAILURE_PASSWORD = 3									//密码错误
var REQUEST_FAILURE_NOTABLE = 4									//桌子不足
var REQUEST_FAILURE_STATUS_ERROR = 5									//状态错误
var REQUEST_FAILURE_CREATE_ENOUGH = 6									//超过额定	

//////////////////////////////////////////////////////////////////////////////////

//#pragma pack()

//#endif