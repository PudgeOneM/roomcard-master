//#ifndef CMD_COMMOM_HEAD_FILE
//#define CMD_COMMOM_HEAD_FILE

//#pragma pack(1)

//////////////////////////////////////////////////////////////////////////////////

var MDM_CM_SYSTEM = 1000								//系统命令

var SUB_CM_SYSTEM_MESSAGE = 1									//系统消息
var SUB_CM_ACTION_MESSAGE = 2									//动作消息
var SUB_CM_DOWN_LOAD_MODULE = 3									//下载消息
var SUB_CM_MAIL = 4									//邮件消息

//////////////////////////////////////////////////////////////////////////////////

//类型掩码
var SMT_CHAT = 0x0001								//聊天消息
var SMT_EJECT = 0x0002								//弹出消息
var SMT_GLOBAL = 0x0004								//全局消息
var SMT_PROMPT = 0x0008								//提示消息
var SMT_TABLE_ROLL = 0x0010								//滚动消息

//控制掩码
var SMT_CLOSE_ROOM = 0x0100								//关闭房间
var SMT_CLOSE_GAME = 0x0200								//关闭游戏
var SMT_CLOSE_LINK = 0x0400								//中断连接
var SMT_CLOSE_TIMEOUT = 0x0500								//牌局结束

//系统消息
var CMD_CM_SystemMessage = 
[
	['WORD', 'wType'],								//消息类型
	['WORD', 'wLength'],							//消息长度
	['TCHAR', 'szString', 1024],						//消息内容
]

//////////////////////////////////////////////////////////////////////////////////

//动作类型
var ACT_BROWSE = 1									//浏览动作
var ACT_DOWN_LOAD = 2									//下载动作

//动作信息
var tagActionHead = 
[
	['UINT', 'uResponseID'],						//响应标识
	['WORD', 'wAppendSize'],						//附加大小
	['BYTE', 'cbActionType'],						//动作类型
]

//浏览类型
var BRT_IE = 0x01								//I E 浏览
var BRT_PLAZA = 0x02								//大厅浏览
var BRT_WINDOWS = 0x04								//窗口浏览

//浏览动作
var tagActionBrowse = 
[
	['BYTE', 'cbBrowseType'],						//浏览类型
	['TCHAR', 'szBrowseUrl', 256],					//浏览地址
]

//下载类型
var DLT_IE = 1									//I E 下载
var DLT_MODULE = 2									//下载模块

//下载动作
var tagActionDownLoad = 
[
	['BYTE', 'cbDownLoadMode'],						//下载方式
	['TCHAR', 'szDownLoadUrl', 256],					//下载地址
]

//动作消息
var CMD_CM_ActionMessage = 
[
	['WORD', 'wType'],								//消息类型
	['WORD', 'wLength'],							//消息长度
	['UINT', 'nButtonType'],						//按钮类型
	['TCHAR', 'szString', 1024],						//消息内容
]

//////////////////////////////////////////////////////////////////////////////////

//下载信息
var CMD_CM_DownLoadModule = 
[
	['BYTE', 'cbShowUI'],							//显示界面
	['BYTE', 'cbAutoInstall'],						//自动安装
	['WORD', 'wFileNameSize'],						//名字长度
	['WORD', 'wDescribeSize'],						//描述长度
	['WORD', 'wDownLoadUrlSize'],					//地址长度
]

//////////////////////////////////////////////////////////////////////////////////

//#pragma pack()

//#endif