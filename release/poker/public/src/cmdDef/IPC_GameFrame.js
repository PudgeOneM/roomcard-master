// //#ifndef IPC_GAME_FRAME_HEAD_FILE
// //#define IPC_GAME_FRAME_HEAD_FILE

// //////////////////////////////////////////////////////////////////////////////////
// //网络消息

// var IPC_CMD_GF_SOCKET = 1									//网络消息

// var IPC_SUB_GF_SOCKET_SEND = 1									//网络发送
// var IPC_SUB_GF_SOCKET_RECV = 2									//网络接收

// //网络发送
// var IPC_GF_SocketSend = 
// [
// 	['TCP_Command', 'CommandInfo'],						//命令信息
// 	['BYTE', 'cbBuffer', SOCKET_TCP_PACKET],		//数据缓冲
// ]

// //网络接收
// var IPC_GF_SocketRecv = 
// [
// 	['TCP_Command', 'CommandInfo'],						//命令信息
// 	['BYTE', 'cbBuffer', SOCKET_TCP_PACKET],		//数据缓冲
// ]

// //////////////////////////////////////////////////////////////////////////////////
// //控制消息

// var IPC_CMD_GF_CONTROL = 2									//控制消息

// var IPC_SUB_GF_CLIENT_READY = 1									//准备就绪
// var IPC_SUB_GF_CLIENT_CLOSE = 2									//进程关闭

// var IPC_SUB_GF_CLOSE_PROCESS = 100									//关闭进程
// var IPC_SUB_GF_ACTIVE_PROCESS = 101									//激活进程

// var IPC_SUB_GF_BOSS_COME = 200									//老板来了
// var IPC_SUB_GF_BOSS_LEFT = 201									//老板走了

// //////////////////////////////////////////////////////////////////////////////////
// //配置消息

// var IPC_CMD_GF_CONFIG = 3									//配置消息

// var IPC_SUB_GF_LEVEL_INFO = 100									//等级信息
// var IPC_SUB_GF_COLUMN_INFO = 101									//列表信息
// var IPC_SUB_GF_SERVER_INFO = 102									//房间信息
// var IPC_SUB_GF_PROPERTY_INFO = 103									//道具信息
// var IPC_SUB_GF_CONFIG_FINISH = 104									//配置完成
// var IPC_SUB_GF_USER_RIGHT = 107									//玩家权限

// //房间信息
// var IPC_GF_ServerInfo = 
// [
// 	//用户信息
// 	['WORD', 'wTableID'],							//桌子号码
// 	['WORD', 'wChairID'],							//椅子号码
// 	['DWORD', 'dwUserID'],							//用户 I D

// 	//用户权限
// 	['DWORD', 'dwUserRight'],						//用户权限
// 	['DWORD', 'dwMasterRight'],						//管理权限

// 	//房间信息
// 	['WORD', 'wKindID'],							//类型标识
// 	['WORD', 'wServerID'],							//房间标识
// 	['WORD', 'wServerType'],						//房间类型
// 	['DWORD', 'dwServerRule'],						//房间规则
// 	['TCHAR', 'szServerName', LEN_SERVER],			//房间名称

// 	//视频配置
// 	['WORD', 'wAVServerPort'],						//服务端口
// 	['DWORD', 'dwAVServerAddr'],						//服务地址
// ]

// //等级信息
// var IPC_GF_LevelInfo = 
// [
// 	['BYTE', 'cbItemCount'],						//列表数目
// 	['tagLevelItem', 'LevelItem', 64],						//等级描述
// ]

// //列表配置
// var IPC_GF_ColumnInfo = 
// [
// 	['BYTE', 'cbColumnCount'],						//列表数目
// 	['tagColumnItem', 'ColumnItem', MAX_COLUMN],				//列表描述
// ]

// //道具配置
// var IPC_GF_PropertyInfo = 
// [
// 	['BYTE', 'cbPropertyCount'],					//道具数目
// 	['tagPropertyInfo', 'PropertyInfo', MAX_PROPERTY],			//道具描述
// ]

// //玩家权限
// var IPC_GF_UserRight = 
// [
// 	['DWORD', 'dwUserRight'],						//玩家权限
// ]
// //////////////////////////////////////////////////////////////////////////////////
// //用户消息

// var IPC_CMD_GF_USER_INFO = 4									//用户消息

// var IPC_SUB_GF_USER_ENTER = 100									//用户进入
// var IPC_SUB_GF_USER_SCORE = 101									//用户分数
// var IPC_SUB_GF_USER_STATUS = 102									//用户状态
// var IPC_SUB_GF_USER_ATTRIB = 103									//用户属性
// var IPC_SUB_GF_CUSTOM_FACE = 104									//自定头像
// var IPC_SUB_GR_KICK_USER = 105                                 //用户踢出

// //用户信息
// var IPC_GF_UserInfo = 
// [
// 	['BYTE', 'cbCompanion'],						//用户关系
// 	['tagUserInfoHead', 'UserInfoHead'],						//用户信息
// ]

// //用户积分
// var IPC_GF_UserScore = 
// [
// 	['DWORD', 'dwUserID'],							//用户标识
// 	['tagUserScore', 'UserScore'],							//用户积分
// ]

// //用户状态
// var IPC_GF_UserStatus = 
// [
// 	['DWORD', 'dwUserID'],							//用户标识
// 	['tagUserStatus', 'UserStatus'],							//用户状态
// ]

// //用户属性
// var IPC_GF_UserAttrib = 
// [
// 	['DWORD', 'dwUserID'],							//用户标识
// 	['tagUserAttrib', 'UserAttrib'],							//用户属性
// ]

// //用户头像
// var IPC_GF_CustomFace = 
// [
// 	['DWORD', 'dwUserID'],							//用户标识
// 	['DWORD', 'dwCustomID'],							//自定标识
// 	['tagCustomFaceInfo', 'CustomFaceInfo'],						//自定头像
// ]

// //用户踢出
// var IPC_GF_KickUser = 
// [
// 	['DWORD', 'dwTargetUserID'],                      //目标用户
// ]

// //////////////////////////////////////////////////////////////////////////////////
// //道具消息
// var IPC_CMD_GF_PROPERTY_INFO = 5								//道具消息

// var IPC_SUB_GF_BUY_PROPERTY = 100								//购买道具
// var IPC_SUB_GF_PROPERTY_SUCCESS = 101								//道具成功
// var IPC_SUB_GF_PROPERTY_FAILURE = 102                             //道具失败 
// var IPC_SUB_GR_PROPERTY_MESSAGE = 103                             //道具消息
// var IPC_SUB_GR_PROPERTY_TRUMPET = 104                             //道具喇叭

// //购买道具
// var IPC_GF_BuyProperty = 
// [
// 	['WORD', 'wItemCount'],                         //购买数目  
// 	['WORD', 'wPropertyIndex'],                     //道具索引 
// 	['TCHAR', 'szNickName', LEN_NICKNAME],           //对方昵称
// ]

// //使用道具
// var IPC_GR_PropertySuccess = 
// [
// 	['WORD', 'wPropertyIndex'],                     //道具索引
// 	['WORD', 'wPropertyCount'],                     //道具数目 
// 	['DWORD', 'dwSourceUserID'],                     //用户 ID
// 	['DWORD', 'dwTargetUserID'],                     //用户 ID
// 	['TCHAR', 'szSourceNickName', LEN_NICKNAME],     //用户昵称
// ]

// //道具消息
// var IPC_GR_PropertyMessage = 
// [
// 	['WORD', 'wPropertyIndex'],                     //道具索引
// 	['WORD', 'wPropertyCount'],                     //道具数目 
// 	['TCHAR', 'szSourceNickName', LEN_NICKNAME],     //用户昵称
// 	['TCHAR', 'szTargerNickName', LEN_NICKNAME],     //用户昵称
// ]

// //道具失败
// var IPC_GR_PropertyFailure = 
// [
// 	['LONG', 'lErrorCode'],							//错误代码
// 	['TCHAR', 'szDescribeString', 256],				//描述信息
// ]


// //道具喇叭
// var IPC_GR_PropertyTrumpet = 
// [
// 	['WORD', 'wPropertyIndex'],                      //道具索引 
// 	['DWORD', 'dwSendUserID'],                        //用户 I D
// 	['DWORD', 'TrumpetColor'],                        //喇叭颜色
// 	['TCHAR', 'szSendNickName', 32],				    //玩家昵称 
// 	['TCHAR', 'szTrumpetContent', TRUMPET_MAX_CHAR],  //喇叭内容
// ]

// //////////////////////////////////////////////////////////////////////////////////

// //#endif