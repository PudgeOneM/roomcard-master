//#ifndef DEFINE_HEAD_FILE
//#define DEFINE_HEAD_FILE

//////////////////////////////////////////////////////////////////////////////////
//数值定义

//头像大小
var FACE_CX = 48									//头像宽度
var FACE_CY = 48									//头像高度

//长度定义
var LEN_LESS_ACCOUNTS = 6									//最短帐号
var LEN_LESS_NICKNAME = 6									//最短昵称
var LEN_LESS_PASSWORD = 6									//最短密码

//人数定义
var MAX_CHAIR = 8									//最大椅子
var MAX_TABLE = 2000								//最大桌子
var MAX_COLUMN = 32									//最大列表
var MAX_ANDROID = 256									//最大机器
var MAX_PROPERTY = 128									//最大道具
var MAX_WHISPER_USER = 16									//最大私聊
var MAX_URL_LEN = 255									//最大url长度
var MAX_TABALE_RECORD = 128									//最大战绩记录条数
var MAX_WRITE_SCORE_RECORD = 128									//最大写分记录数


//列表定义
var MAX_KIND = 128									//最大类型
var MAX_SERVER = 1024								//最大房间

//参数定义
var INVALID_CHAIR = 0xFFFF								//无效椅子
var INVALID_TABLE = 0xFFFF								//无效桌子

//税收定义
var REVENUE_BENCHMARK = 0								    //税收起点
var REVENUE_DENOMINATOR = 1000								//税收分母

//////////////////////////////////////////////////////////////////////////////////
//系统参数

//积分类型
var SCORE = LONGLONG							//积分类型
var SCORE_STRING = "%I64d"						//积分类型

//游戏状态
var GAME_STATUS_FREE = 0									//空闲状态
var GAME_STATUS_PLAY = 100									//游戏状态
var GAME_STATUS_WAIT = 200									//等待状态

//系统参数
var LEN_USER_CHAT = 128									//聊天长度
var TIME_USER_CHAT = 1									//聊天间隔
var TRUMPET_MAX_CHAR = 128									//喇叭长度

//////////////////////////////////////////////////////////////////////////////////
//索引质数

//列表质数
var PRIME_TYPE = 11									//种类数目
var PRIME_KIND = 53									//类型数目
var PRIME_NODE = 101								//节点数目
var PRIME_PAGE = 53									//自定数目
var PRIME_SERVER = 1009								//房间数目

//人数质数
var PRIME_SERVER_USER = 503								//房间人数
var PRIME_ANDROID_USER = 503								//机器人数
var PRIME_PLATFORM_USER = 100003								//平台人数

//////////////////////////////////////////////////////////////////////////////////
//数据长度

//cookie数据
var LEN_COOKIE = 256									//cookie数据最大长度

//资料数据
var LEN_MD5 = 33									//加密密码
var LEN_USERNOTE = 32									//备注长度
var LEN_ACCOUNTS = 32									//帐号长度
var LEN_NICKNAME = 32									//昵称长度
var LEN_PASSWORD = 33									//密码长度
var LEN_GROUP_NAME = 32									//社团名字
var LEN_UNDER_WRITE = 32									//个性签名
var LEN_ADDR = 32									//地址名称

//数据长度
var LEN_QQ = 16									//Q Q 号码
var LEN_EMAIL = 33									//电子邮件
var LEN_USER_NOTE = 256									//用户备注
var LEN_SEAT_PHONE = 33									//固定电话
var LEN_MOBILE_PHONE = 12									//移动电话
var LEN_PASS_PORT_ID = 19									//证件号码
var LEN_COMPELLATION = 16									//真实名字
var LEN_DWELLING_PLACE = 128									//联系地址
var LEN_IP = 16									//IP长度

//机器标识
var LEN_NETWORK_ID = 13									//网卡长度
var LEN_MACHINE_ID = 33									//序列长度

//列表数据
var LEN_TYPE = 32									//种类长度
var LEN_KIND = 32									//类型长度
var LEN_NODE = 32									//节点长度
var LEN_PAGE = 32									//定制长度
var LEN_SERVER = 32									//房间长度
var LEN_PROCESS = 32									//进程长度
var LEN_KEYTABLE = 7									//房间口令长度

//经纬度
var LEN_LATITUDE = 32									//纬度
var LEN_LONGITUDE = 32									//经度

//////////////////////////////////////////////////////////////////////////////////

//用户关系
var CP_NORMAL = 0									//未知关系
var CP_FRIEND = 1									//好友关系
var CP_DETEST = 2									//厌恶关系
var CP_SHIELD = 3									//屏蔽聊天

//////////////////////////////////////////////////////////////////////////////////

//性别定义
var GENDER_FEMALE = 0									//女性性别
var GENDER_MANKIND = 1									//男性性别

//////////////////////////////////////////////////////////////////////////////////

//游戏模式
var GAME_GENRE_GOLD = 0x0001								//金币类型
var GAME_GENRE_SCORE = 0x0002								//点值类型
var GAME_GENRE_MATCH = 0x0004								//比赛类型
var GAME_GENRE_EDUCATE = 0x0008								//训练类型

//分数模式
var SCORE_GENRE_NORMAL = 0x0100								//普通模式
var SCORE_GENRE_POSITIVE = 0x0200								//非负模式

//////////////////////////////////////////////////////////////////////////////////

//用户状态
var US_NULL = 0x00								//没有状态
var US_FREE = 0x01								//站立状态
var US_SIT = 0x02								//坐下状态
var US_READY = 0x03								//同意状态
var US_LOOKON = 0x04								//旁观状态
var US_PLAYING = 0x05								//游戏状态
var US_OFFLINE = 0x06								//断线状态

//////////////////////////////////////////////////////////////////////////////////

//比赛状态
var MS_NULL = 0x00								//没有状态
var MS_SIGNUP = 0x01								//报名状态
var MS_MATCHING = 0x02								//比赛状态
var MS_OUT = 0x03								//淘汰状态

//////////////////////////////////////////////////////////////////////////////////

//房间规则
var SRL_LOOKON = 0x00000001							//旁观标志
var SRL_OFFLINE = 0x00000002							//断线标志
var SRL_SAME_IP = 0x00000004							//同网标志

//房间规则
var SRL_ROOM_CHAT = 0x00000100							//聊天标志
var SRL_GAME_CHAT = 0x00000200							//聊天标志
var SRL_WISPER_CHAT = 0x00000400							//私聊标志
var SRL_HIDE_USER_INFO = 0x00000800							//隐藏标志

//////////////////////////////////////////////////////////////////////////////////
//列表数据

//无效属性
var UD_NULL = 0									//无效子项
var UD_IMAGE = 100									//图形子项
var UD_CUSTOM = 200									//自定子项

//基本属性
var UD_GAME_ID = 1									//游戏标识
var UD_USER_ID = 2									//用户标识
var UD_NICKNAME = 3									//用户昵称

//扩展属性
var UD_GENDER = 10									//用户性别
var UD_GROUP_NAME = 11									//社团名字
var UD_UNDER_WRITE = 12									//个性签名

//状态信息
var UD_TABLE = 20									//游戏桌号
var UD_CHAIR = 21									//椅子号码

//积分信息
var UD_SCORE = 30									//用户分数
var UD_GRADE = 31									//用户成绩
var UD_USER_MEDAL = 32									//用户经验
var UD_EXPERIENCE = 33									//用户经验
var UD_LOVELINESS = 34									//用户魅力
var UD_WIN_COUNT = 35									//胜局盘数
var UD_LOST_COUNT = 36									//输局盘数
var UD_DRAW_COUNT = 37									//和局盘数
var UD_FLEE_COUNT = 38									//逃局盘数
var UD_PLAY_COUNT = 39									//总局盘数

//积分比率
var UD_WIN_RATE = 40									//用户胜率
var UD_LOST_RATE = 41									//用户输率
var UD_DRAW_RATE = 42									//用户和率
var UD_FLEE_RATE = 43									//用户逃率
var UD_GAME_LEVEL = 44									//游戏等级

//扩展信息
var UD_NOTE_INFO = 50									//用户备注
var UD_LOOKON_USER = 51									//旁观用户

//图像列表
var UD_IMAGE_FLAG = (UD_IMAGE+1)						//用户标志
var UD_IMAGE_GENDER = (UD_IMAGE+2)						//用户性别
var UD_IMAGE_STATUS = (UD_IMAGE+3)						//用户状态

//////////////////////////////////////////////////////////////////////////////////
//数据库定义

var DB_ERROR = -1  								//处理失败
var DB_SUCCESS = 0  									//处理成功
var DB_NEEDMB = 18 									//处理失败
var DB_CONTINUE = 19									//继续处理

//////////////////////////////////////////////////////////////////////////////////
//道具标示
var PT_USE_MARK_DOUBLE_SCORE = 0x0001								//双倍积分
var PT_USE_MARK_FOURE_SCORE = 0x0002								//四倍积分
var PT_USE_MARK_GUARDKICK_CARD = 0x0010								//防踢道具
var PT_USE_MARK_POSSESS = 0x0020								//附身道具 

var MAX_PT_MARK = 4                                   //标识数目

//有效范围
var VALID_TIME_DOUBLE_SCORE = 3600                                //有效时间
var VALID_TIME_FOUR_SCORE = 3600                                //有效时间
var VALID_TIME_GUARDKICK_CARD = 3600                                //防踢时间
var VALID_TIME_POSSESS = 3600                                //附身时间
var VALID_TIME_KICK_BY_MANAGER = 3600                                //游戏时间 
var VALID_TIME_PREPARE = 1200								//准备时间

//////////////////////////////////////////////////////////////////////////////////
//设备类型
var DEVICE_TYPE_PC = 0x00                                //PC
var DEVICE_TYPE_ANDROID = 0x10                                //Android
var DEVICE_TYPE_ITOUCH = 0x20                                //iTouch
var DEVICE_TYPE_IPHONE = 0x40                                //iPhone
var DEVICE_TYPE_IPAD = 0x80                                //iPad

/////////////////////////////////////////////////////////////////////////////////
//手机定义

//视图模式
var VIEW_MODE_ALL = 0x0001								//全部可视
var VIEW_MODE_PART = 0x0002								//部分可视

//信息模式
var VIEW_INFO_LEVEL_1 = 0x0010								//部分信息
var VIEW_INFO_LEVEL_2 = 0x0020								//部分信息
var VIEW_INFO_LEVEL_3 = 0x0040								//部分信息
var VIEW_INFO_LEVEL_4 = 0x0080								//部分信息

//其他配置
var RECVICE_GAME_CHAT = 0x0100								//接收聊天
var RECVICE_ROOM_CHAT = 0x0200								//接收聊天
var RECVICE_ROOM_WHISPER = 0x0400								//接收私聊

//行为标识
var BEHAVIOR_LOGON_NORMAL = 0x0000                              //普通登录
var BEHAVIOR_LOGON_IMMEDIATELY = 0x1000                              //立即登录

/////////////////////////////////////////////////////////////////////////////////
//处理结果
var RESULT_ERROR = -1  								//处理错误
var RESULT_SUCCESS = 0  									//处理成功
var RESULT_FAIL = 1  									//处理失败

/////////////////////////////////////////////////////////////////////////////////
//变化原因
var SCORE_REASON_WRITE = 0                                   //写分变化
var SCORE_REASON_INSURE = 1                                   //银行变化
var SCORE_REASON_PROPERTY = 2                                   //道具变化

/////////////////////////////////////////////////////////////////////////////////

//登录房间失败原因
var LOGON_FAIL_SERVER_INVALIDATION = 200                                 //房间失效

////////////////////////////////////////////////////////////////////////////////

//站立原因
var STANDUP_REASON_NORMAL = 0									//正常站立
var STANDUP_REASON_LEAVE = 1									//离开
var STANDUP_REASON_OFFLINE = 2									//断线

////////////////////////////////////////////////////////////////////////////////

//支付类型
var DEFALUT_PAY = 0									//默认
var CREATE_PAY = 1									//创建房间
var GAME_PAY = 2									//坐下付费
var PROPERTY_PAY = 3									//道具使用

////////////////////////////////////////////////////////////////////////////////
//#endif