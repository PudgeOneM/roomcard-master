// //#ifndef RIGHT_DEFINE_HEAD_FILE
// //#define RIGHT_DEFINE_HEAD_FILE

// //////////////////////////////////////////////////////////////////////////////////

// //�û�Ȩ��
// var UR_CANNOT_PLAY = 0x00000001				//���ܽ�����Ϸ
// var UR_CANNOT_LOOKON = 0x00000002				//�����Թ���Ϸ
// var UR_CANNOT_WISPER = 0x00000004				//���ܷ���˽��
// var UR_CANNOT_ROOM_CHAT = 0x00000008				//���ܴ�������
// var UR_CANNOT_GAME_CHAT = 0x00000010				//������Ϸ����
// var UR_CANNOT_BUGLE = 0x00000020				//���ܷ�������

// //��ԱȨ��
// var UR_GAME_DOUBLE_SCORE = 0x00000100				//��Ϸ˫������
// var UR_GAME_KICK_OUT_USER = 0x00000200				//��Ϸ�߳��û�
// var UR_GAME_ENTER_VIP_ROOM = 0x00000400             //����VIP���� 

// //�û����
// var UR_GAME_MATCH_USER = 0x10000000				//��Ϸ�����û�
// var UR_GAME_CHEAT_USER = 0x20000000				//��Ϸ�����û�

// //////////////////////////////////////////////////////////////////////////////////

// //��ͨ����
// var UR_CAN_LIMIT_PLAY = 0x00000001				//�����ֹ��Ϸ
// var UR_CAN_LIMIT_LOOKON = 0x00000002				//�����ֹ�Թ�
// var UR_CAN_LIMIT_WISPER = 0x00000004				//�����ֹ˽��
// var UR_CAN_LIMIT_ROOM_CHAT = 0x00000008				//�����ֹ����
// var UR_CAN_LIMIT_GAME_CHAT = 0x00000010				//�����ֹ����

// //�û�����
// var UR_CAN_KILL_USER = 0x00000100				//�����߳��û�
// var UR_CAN_SEE_USER_IP = 0x00000200				//����鿴��ַ
// var UR_CAN_DISMISS_GAME = 0x00000400				//�����ɢ��Ϸ
// var UR_CAN_LIMIT_USER_CHAT = 0x00000800				//�����ֹ�������

// //�߼�����
// var UR_CAN_CONFINE_IP = 0x00001000				//�����ֹ��ַ
// var UR_CAN_CONFINE_MAC = 0x00002000				//�����ֹ����
// var UR_CAN_SEND_WARNING = 0x00004000				//�����;���
// var UR_CAN_MODIFY_SCORE = 0x00008000				//�����޸Ļ���
// var UR_CAN_FORBID_ACCOUNTS = 0x00010000				//��������ʺ�

// //�󶨹���
// var UR_CAN_BIND_GAME = 0x00100000				//������Ϸ��
// var UR_CAN_BIND_GLOBAL = 0x00200000				//����ȫ�ְ�

// //���ù���
// var UR_CAN_ISSUE_MESSAGE = 0x01000000				//��������Ϣ
// var UR_CAN_MANAGER_SERVER = 0x02000000				//���������
// var UR_CAN_MANAGER_OPTION = 0x04000000				//�����������
// var UR_CAN_MANAGER_ANDROID = 0x08000000				//����������

// //////////////////////////////////////////////////////////////////////////////////

// // //�û�Ȩ��
// // class CUserRight
// // {
// // 	//���Ȩ��
// // public:
// // 	//��ϷȨ��
// // 	var (dwUserRight&UR_CANNOT_PLAY) ==0; }
// // 	//�Թ�Ȩ��
// // 	var (dwUserRight&UR_CANNOT_LOOKON) ==0; }
// // 	//˽��Ȩ��
// // 	var (dwUserRight&UR_CANNOT_WISPER) ==0; }
// // 	//��������
// // 	var (dwUserRight&UR_CANNOT_ROOM_CHAT) ==0; }
// // 	//��Ϸ����
// // 	var (dwUserRight&UR_CANNOT_GAME_CHAT) ==0; }
// // 	//����VIP��
// // 	var (dwUserRight&UR_GAME_ENTER_VIP_ROOM) ==0; }

// // 	//��ԱȨ��
// // public:
// // 	//˫������
// // 	var (dwUserRight&UR_GAME_DOUBLE_SCORE)! =0; }
// // 	//�߳��û�
// // 	var (dwUserRight&UR_GAME_KICK_OUT_USER)! =0; }

// // 	//����Ȩ��
// // public:
// // 	//�����û�
// // 	var (dwUserRight&UR_GAME_MATCH_USER)! =0; }
// // 	//�����û�
// // 	var (dwUserRight&UR_GAME_CHEAT_USER)! =0; }
// // };

// // //////////////////////////////////////////////////////////////////////////////////

// // //����Ȩ��
// // class CMasterRight
// // {
// // 	//��ͨ����
// // public:
// // 	//��ֹ��Ϸ
// // 	var ((dwMasterRight&UR_CAN_LIMIT_PLAY)! =0); }
// // 	//��ֹ�Թ�
// // 	var ((dwMasterRight&UR_CAN_LIMIT_LOOKON)! =0); }
// // 	//��ֹ˽��
// // 	var ((dwMasterRight&UR_CAN_LIMIT_WISPER)! =0); }
// // 	//��ֹ����
// // 	var ((dwMasterRight&UR_CAN_LIMIT_ROOM_CHAT)! =0); }
// // 	//��ֹ����
// // 	var ((dwMasterRight&UR_CAN_LIMIT_GAME_CHAT)! =0); }

// // 	//�û�����
// // public:
// // 	//�߳��û�
// // 	var ((dwMasterRight&UR_CAN_KILL_USER)! =0); }
// // 	//�鿴��ַ
// // 	var ((dwMasterRight&UR_CAN_SEE_USER_IP)! =0); }
// // 	//��ɢ��Ϸ
// // 	var ((dwMasterRight&UR_CAN_DISMISS_GAME)! =0); }
// // 	//��ֹ�������
// // 	var ((dwMasterRight&UR_CAN_LIMIT_USER_CHAT)! =0); }

// // 	//�߼�����
// // public:
// // 	//��ֹ��ַ
// // 	var ((dwMasterRight&UR_CAN_CONFINE_IP)! =0); }
// // 	//��ֹ����
// // 	var ((dwMasterRight&UR_CAN_CONFINE_MAC)! =0); }
// // 	//���;���
// // 	var ((dwMasterRight&UR_CAN_SEND_WARNING)! =0); }
// // 	//�޸Ļ���
// // 	var ((dwMasterRight&UR_CAN_MODIFY_SCORE)! =0); }
// // 	//�����ʺ�
// // 	var ((dwMasterRight&UR_CAN_FORBID_ACCOUNTS)! =0); }

// // 	//�󶨹���
// // public:
// // 	//��Ϸ��
// // 	var ((dwMasterRight&UR_CAN_BIND_GAME)! =0); }
// // 	//ȫ�ְ�
// // 	var ((dwMasterRight&UR_CAN_BIND_GLOBAL)! =0); }

// // 	//���ù���
// // public:
// // 	//������Ϣ
// // 	var ((dwMasterRight&UR_CAN_ISSUE_MESSAGE)! =0); }
// // 	//������
// // 	var ((dwMasterRight&UR_CAN_MANAGER_SERVER)! =0); }
// // 	//�������
// // 	var ((dwMasterRight&UR_CAN_MANAGER_ANDROID)! =0); }
// // };

// //////////////////////////////////////////////////////////////////////////////////

// //#endif
