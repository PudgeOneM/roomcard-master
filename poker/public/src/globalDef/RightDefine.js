// //#ifndef RIGHT_DEFINE_HEAD_FILE
// //#define RIGHT_DEFINE_HEAD_FILE

// //////////////////////////////////////////////////////////////////////////////////

// //用户权限
// var UR_CANNOT_PLAY = 0x00000001				//不能进行游戏
// var UR_CANNOT_LOOKON = 0x00000002				//不能旁观游戏
// var UR_CANNOT_WISPER = 0x00000004				//不能发送私聊
// var UR_CANNOT_ROOM_CHAT = 0x00000008				//不能大厅聊天
// var UR_CANNOT_GAME_CHAT = 0x00000010				//不能游戏聊天
// var UR_CANNOT_BUGLE = 0x00000020				//不能发送喇叭

// //会员权限
// var UR_GAME_DOUBLE_SCORE = 0x00000100				//游戏双倍积分
// var UR_GAME_KICK_OUT_USER = 0x00000200				//游戏踢出用户
// var UR_GAME_ENTER_VIP_ROOM = 0x00000400             //进入VIP房间 

// //用户身份
// var UR_GAME_MATCH_USER = 0x10000000				//游戏比赛用户
// var UR_GAME_CHEAT_USER = 0x20000000				//游戏作弊用户

// //////////////////////////////////////////////////////////////////////////////////

// //普通管理
// var UR_CAN_LIMIT_PLAY = 0x00000001				//允许禁止游戏
// var UR_CAN_LIMIT_LOOKON = 0x00000002				//允许禁止旁观
// var UR_CAN_LIMIT_WISPER = 0x00000004				//允许禁止私聊
// var UR_CAN_LIMIT_ROOM_CHAT = 0x00000008				//允许禁止聊天
// var UR_CAN_LIMIT_GAME_CHAT = 0x00000010				//允许禁止聊天

// //用户管理
// var UR_CAN_KILL_USER = 0x00000100				//允许踢出用户
// var UR_CAN_SEE_USER_IP = 0x00000200				//允许查看地址
// var UR_CAN_DISMISS_GAME = 0x00000400				//允许解散游戏
// var UR_CAN_LIMIT_USER_CHAT = 0x00000800				//允许禁止玩家聊天

// //高级管理
// var UR_CAN_CONFINE_IP = 0x00001000				//允许禁止地址
// var UR_CAN_CONFINE_MAC = 0x00002000				//允许禁止机器
// var UR_CAN_SEND_WARNING = 0x00004000				//允许发送警告
// var UR_CAN_MODIFY_SCORE = 0x00008000				//允许修改积分
// var UR_CAN_FORBID_ACCOUNTS = 0x00010000				//允许封锁帐号

// //绑定管理
// var UR_CAN_BIND_GAME = 0x00100000				//允许游戏绑定
// var UR_CAN_BIND_GLOBAL = 0x00200000				//允许全局绑定

// //配置管理
// var UR_CAN_ISSUE_MESSAGE = 0x01000000				//允许发布消息
// var UR_CAN_MANAGER_SERVER = 0x02000000				//允许管理房间
// var UR_CAN_MANAGER_OPTION = 0x04000000				//允许管理配置
// var UR_CAN_MANAGER_ANDROID = 0x08000000				//允许管理机器

// //////////////////////////////////////////////////////////////////////////////////

// // //用户权限
// // class CUserRight
// // {
// // 	//玩家权限
// // public:
// // 	//游戏权限
// // 	var (dwUserRight&UR_CANNOT_PLAY) ==0; }
// // 	//旁观权限
// // 	var (dwUserRight&UR_CANNOT_LOOKON) ==0; }
// // 	//私聊权限
// // 	var (dwUserRight&UR_CANNOT_WISPER) ==0; }
// // 	//大厅聊天
// // 	var (dwUserRight&UR_CANNOT_ROOM_CHAT) ==0; }
// // 	//游戏聊天
// // 	var (dwUserRight&UR_CANNOT_GAME_CHAT) ==0; }
// // 	//进入VIP房
// // 	var (dwUserRight&UR_GAME_ENTER_VIP_ROOM) ==0; }

// // 	//会员权限
// // public:
// // 	//双倍积分
// // 	var (dwUserRight&UR_GAME_DOUBLE_SCORE)! =0; }
// // 	//踢出用户
// // 	var (dwUserRight&UR_GAME_KICK_OUT_USER)! =0; }

// // 	//特殊权限
// // public:
// // 	//比赛用户
// // 	var (dwUserRight&UR_GAME_MATCH_USER)! =0; }
// // 	//作弊用户
// // 	var (dwUserRight&UR_GAME_CHEAT_USER)! =0; }
// // };

// // //////////////////////////////////////////////////////////////////////////////////

// // //管理权限
// // class CMasterRight
// // {
// // 	//普通管理
// // public:
// // 	//禁止游戏
// // 	var ((dwMasterRight&UR_CAN_LIMIT_PLAY)! =0); }
// // 	//禁止旁观
// // 	var ((dwMasterRight&UR_CAN_LIMIT_LOOKON)! =0); }
// // 	//禁止私聊
// // 	var ((dwMasterRight&UR_CAN_LIMIT_WISPER)! =0); }
// // 	//禁止聊天
// // 	var ((dwMasterRight&UR_CAN_LIMIT_ROOM_CHAT)! =0); }
// // 	//禁止聊天
// // 	var ((dwMasterRight&UR_CAN_LIMIT_GAME_CHAT)! =0); }

// // 	//用户管理
// // public:
// // 	//踢出用户
// // 	var ((dwMasterRight&UR_CAN_KILL_USER)! =0); }
// // 	//查看地址
// // 	var ((dwMasterRight&UR_CAN_SEE_USER_IP)! =0); }
// // 	//解散游戏
// // 	var ((dwMasterRight&UR_CAN_DISMISS_GAME)! =0); }
// // 	//禁止玩家聊天
// // 	var ((dwMasterRight&UR_CAN_LIMIT_USER_CHAT)! =0); }

// // 	//高级管理
// // public:
// // 	//禁止地址
// // 	var ((dwMasterRight&UR_CAN_CONFINE_IP)! =0); }
// // 	//禁止机器
// // 	var ((dwMasterRight&UR_CAN_CONFINE_MAC)! =0); }
// // 	//发送警告
// // 	var ((dwMasterRight&UR_CAN_SEND_WARNING)! =0); }
// // 	//修改积分
// // 	var ((dwMasterRight&UR_CAN_MODIFY_SCORE)! =0); }
// // 	//封锁帐号
// // 	var ((dwMasterRight&UR_CAN_FORBID_ACCOUNTS)! =0); }

// // 	//绑定管理
// // public:
// // 	//游戏绑定
// // 	var ((dwMasterRight&UR_CAN_BIND_GAME)! =0); }
// // 	//全局绑定
// // 	var ((dwMasterRight&UR_CAN_BIND_GLOBAL)! =0); }

// // 	//配置管理
// // public:
// // 	//发布消息
// // 	var ((dwMasterRight&UR_CAN_ISSUE_MESSAGE)! =0); }
// // 	//管理房间
// // 	var ((dwMasterRight&UR_CAN_MANAGER_SERVER)! =0); }
// // 	//管理机器
// // 	var ((dwMasterRight&UR_CAN_MANAGER_ANDROID)! =0); }
// // };

// //////////////////////////////////////////////////////////////////////////////////

// //#endif
