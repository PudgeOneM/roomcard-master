// //#ifndef SERVER_RULE_HEAD_FILE
// //#define SERVER_RULE_HEAD_FILE

// //////////////////////////////////////////////////////////////////////////////////

// //�������
// var SR_FORFEND_GAME_CHAT = 0x00000001							//��ֹ����
// var SR_FORFEND_ROOM_CHAT = 0x00000002							//��ֹ����
// var SR_FORFEND_WISPER_CHAT = 0x00000004							//��ֹ˽��
// var SR_FORFEND_WISPER_ON_GAME = 0x00000008							//��ֹ˽��

// //�߼�����
// var SR_ALLOW_DYNAMIC_JOIN = 0x00000010							//��̬����
// var SR_ALLOW_OFFLINE_TRUSTEE = 0x00000020							//���ߴ���
// var SR_ALLOW_AVERT_CHEAT_MODE = 0x00000040							//������Ϣ

// //��Ϸ����
// var SR_RECORD_GAME_SCORE = 0x00000100							//��¼����
// var SR_RECORD_GAME_TRACK = 0x00000200							//��¼����
// var SR_DYNAMIC_CELL_SCORE = 0x00000400							//��̬�׷�
// var SR_IMMEDIATE_WRITE_SCORE = 0x00000800							//��ʱд��

// //�������
// var SR_FORFEND_ROOM_ENTER = 0x00001000							//��ֹ����
// var SR_FORFEND_GAME_ENTER = 0x00002000							//��ֹ����
// var SR_FORFEND_GAME_LOOKON = 0x00004000							//��ֹ�Թ�

// //���й���
// var SR_FORFEND_TAKE_IN_ROOM = 0x00010000							//��ֹȡ��
// var SR_FORFEND_TAKE_IN_GAME = 0x00020000							//��ֹȡ��
// var SR_FORFEND_SAVE_IN_ROOM = 0x00040000							//��ֹ��Ǯ
// var SR_FORFEND_SAVE_IN_GAME = 0x00080000							//��ֹ���

// //��������
// var SR_FORFEND_GAME_RULE = 0x00100000							//��ֹ����
// var SR_FORFEND_LOCK_TABLE = 0x00200000							//��ֹ����
// var SR_ALLOW_ANDROID_ATTEND = 0x00400000							//��������
// var SR_ALLOW_ANDROID_SIMULATE = 0x00800000							//����ռλ

// //////////////////////////////////////////////////////////////////////////////////

// //�������
// // class CServerRule
// // {
// // 	//�������
// // public:
// // 	//��ֹ����
// // 	var (dwServerRule&SR_FORFEND_GAME_CHAT)! =0; }
// // 	//��ֹ����
// // 	var (dwServerRule&SR_FORFEND_ROOM_CHAT)! =0; }
// // 	//��ֹ˽��
// // 	var (dwServerRule&SR_FORFEND_WISPER_CHAT)! =0; }
// // 	//��ֹ˽��
// // 	var (dwServerRule&SR_FORFEND_WISPER_ON_GAME)! =0; }

// // 	//ģʽ����
// // public:
// // 	//��̬����
// // 	var (dwServerRule&SR_ALLOW_DYNAMIC_JOIN)! =0; }
// // 	//���ߴ���
// // 	var (dwServerRule&SR_ALLOW_OFFLINE_TRUSTEE)! =0; }
// // 	//������Ϣ
// // 	var (dwServerRule&SR_ALLOW_AVERT_CHEAT_MODE)! =0; }

// // 	//��Ϸ����
// // public:
// // 	//��¼����
// // 	var (dwServerRule&SR_RECORD_GAME_SCORE)! =0; }
// // 	//��¼����
// // 	var (dwServerRule&SR_RECORD_GAME_TRACK)! =0; }
// // 	//��̬�׷�
// // 	var (dwServerRule&SR_DYNAMIC_CELL_SCORE)! =0; }
// // 	//��ʱд��
// // 	var (dwServerRule&SR_IMMEDIATE_WRITE_SCORE)! =0; }

// // 	//�������
// // public:
// // 	//��ֹ����
// // 	var (dwServerRule&SR_FORFEND_ROOM_ENTER)! =0; }
// // 	//��ֹ����
// // 	var (dwServerRule&SR_FORFEND_GAME_ENTER)! =0; }
// // 	//��ֹ�Թ�
// // 	var (dwServerRule&SR_FORFEND_GAME_LOOKON)! =0; }

// // 	//���й���
// // public:
// // 	//��ֹȡ��
// // 	var (dwServerRule&SR_FORFEND_TAKE_IN_ROOM)! =0; }
// // 	//��ֹȡ��
// // 	var (dwServerRule&SR_FORFEND_TAKE_IN_GAME)! =0; }
// // 	//��ֹ��Ǯ
// // 	var (dwServerRule&SR_FORFEND_SAVE_IN_ROOM)! =0; }
// // 	//��ֹ��Ǯ
// // 	var (dwServerRule&SR_FORFEND_SAVE_IN_GAME)! =0; }

// // 	//��������
// // public:
// // 	//��ֹ����
// // 	var (dwServerRule&SR_FORFEND_GAME_RULE)! =0; }
// // 	//��ֹ����
// // 	var (dwServerRule&SR_FORFEND_LOCK_TABLE)! =0; }
// // 	//��������
// // 	var (dwServerRule&SR_ALLOW_ANDROID_ATTEND)! =0; }
// // 	//����ռλ
// // 	var (dwServerRule&SR_ALLOW_ANDROID_SIMULATE)! =0; }

// // 	//�������
// // public:
// // 	//��ֹ����
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_GAME_CHAT:dwServerRule& =~SR_FORFEND_GAME_CHAT; }
// // 	//��ֹ����
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_ROOM_CHAT:dwServerRule& =~SR_FORFEND_ROOM_CHAT; }
// // 	//��ֹ˽��
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_WISPER_CHAT:dwServerRule& =~SR_FORFEND_WISPER_CHAT; }
// // 	//��ֹ˽��
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_WISPER_ON_GAME:dwServerRule& =~SR_FORFEND_WISPER_ON_GAME; }

// // 	//ģʽ����
// // public:
// // 	//��̬����
// // 	var (bEnable =var =true)?dwServerRule| =var SR_ALLOW_DYNAMIC_JOIN:dwServerRule& =~SR_ALLOW_DYNAMIC_JOIN; }
// // 	//���ߴ���
// // 	var (bEnable =var =true)?dwServerRule| =var SR_ALLOW_OFFLINE_TRUSTEE:dwServerRule& =~SR_ALLOW_OFFLINE_TRUSTEE; }
// // 	//������Ϣ
// // 	var (bEnable =var =true)?dwServerRule| =var SR_ALLOW_AVERT_CHEAT_MODE:dwServerRule& =~SR_ALLOW_AVERT_CHEAT_MODE; }

// // 	//��Ϸ����
// // public:
// // 	//��¼����
// // 	var (bEnable =var =true)?dwServerRule| =var SR_RECORD_GAME_SCORE:dwServerRule& =~SR_RECORD_GAME_SCORE; }
// // 	//��¼����
// // 	var (bEnable =var =true)?dwServerRule| =var SR_RECORD_GAME_TRACK:dwServerRule& =~SR_RECORD_GAME_TRACK; }
// // 	//��̬�׷�
// // 	var (bEnable =var =true)?dwServerRule| =var SR_DYNAMIC_CELL_SCORE:dwServerRule& =~SR_DYNAMIC_CELL_SCORE; }
// // 	//��ʱд��
// // 	var (bEnable =var =true)?dwServerRule| =var SR_IMMEDIATE_WRITE_SCORE:dwServerRule& =~SR_IMMEDIATE_WRITE_SCORE; }

// // 	//�������
// // public:
// // 	//��ֹ����
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_ROOM_ENTER:dwServerRule& =~SR_FORFEND_ROOM_ENTER; }
// // 	//��ֹ����
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_GAME_ENTER:dwServerRule& =~SR_FORFEND_GAME_ENTER; }
// // 	//��ֹ�Թ�
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_GAME_LOOKON:dwServerRule& =~SR_FORFEND_GAME_LOOKON; }

// // 	//���й���
// // public:
// // 	//��ֹȡ��
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_TAKE_IN_ROOM:dwServerRule& =~SR_FORFEND_TAKE_IN_ROOM; }
// // 	//��ֹȡ��
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_TAKE_IN_GAME:dwServerRule& =~SR_FORFEND_TAKE_IN_GAME; }
// // 	//��ֹ��Ǯ
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_SAVE_IN_ROOM:dwServerRule& =~SR_FORFEND_SAVE_IN_ROOM; }
// // 	//��ֹ��Ǯ
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_SAVE_IN_GAME:dwServerRule& =~SR_FORFEND_SAVE_IN_GAME; }

// // 	//��������
// // public:
// // 	//��ֹ����
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_GAME_RULE:dwServerRule& =~SR_FORFEND_GAME_RULE; }
// // 	//��ֹ����
// // 	var (bEnable =var =true)?dwServerRule| =var SR_FORFEND_LOCK_TABLE:dwServerRule& =~SR_FORFEND_LOCK_TABLE; }
// // 	//��������
// // 	var (bEnable =var =true)?dwServerRule| =var SR_ALLOW_ANDROID_ATTEND:dwServerRule& =~SR_ALLOW_ANDROID_ATTEND; }
// // 	//����ռλ
// // 	var (bEnable =var =true)?dwServerRule| =var SR_ALLOW_ANDROID_SIMULATE:dwServerRule& =~SR_ALLOW_ANDROID_SIMULATE; }
// // };

// //////////////////////////////////////////////////////////////////////////////////

// //#endif