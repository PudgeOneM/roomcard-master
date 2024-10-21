//#ifndef CMD_COMMOM_HEAD_FILE
//#define CMD_COMMOM_HEAD_FILE

//#pragma pack(1)

//////////////////////////////////////////////////////////////////////////////////

var MDM_CM_SYSTEM = 1000								//ϵͳ����

var SUB_CM_SYSTEM_MESSAGE = 1									//ϵͳ��Ϣ
var SUB_CM_ACTION_MESSAGE = 2									//������Ϣ
var SUB_CM_DOWN_LOAD_MODULE = 3									//������Ϣ
var SUB_CM_MAIL = 4									//�ʼ���Ϣ

//////////////////////////////////////////////////////////////////////////////////

//��������
var SMT_CHAT = 0x0001								//������Ϣ
var SMT_EJECT = 0x0002								//������Ϣ
var SMT_GLOBAL = 0x0004								//ȫ����Ϣ
var SMT_PROMPT = 0x0008								//��ʾ��Ϣ
var SMT_TABLE_ROLL = 0x0010								//������Ϣ

//��������
var SMT_CLOSE_ROOM = 0x0100								//�رշ���
var SMT_CLOSE_GAME = 0x0200								//�ر���Ϸ
var SMT_CLOSE_LINK = 0x0400								//�ж�����
var SMT_CLOSE_TIMEOUT = 0x0500								//�ƾֽ���

//ϵͳ��Ϣ
var CMD_CM_SystemMessage = 
[
	['WORD', 'wType'],								//��Ϣ����
	['WORD', 'wLength'],							//��Ϣ����
	['TCHAR', 'szString', 1024],						//��Ϣ����
]

//////////////////////////////////////////////////////////////////////////////////

//��������
var ACT_BROWSE = 1									//�������
var ACT_DOWN_LOAD = 2									//���ض���

//������Ϣ
var tagActionHead = 
[
	['UINT', 'uResponseID'],						//��Ӧ��ʶ
	['WORD', 'wAppendSize'],						//���Ӵ�С
	['BYTE', 'cbActionType'],						//��������
]

//�������
var BRT_IE = 0x01								//I E ���
var BRT_PLAZA = 0x02								//�������
var BRT_WINDOWS = 0x04								//�������

//�������
var tagActionBrowse = 
[
	['BYTE', 'cbBrowseType'],						//�������
	['TCHAR', 'szBrowseUrl', 256],					//�����ַ
]

//��������
var DLT_IE = 1									//I E ����
var DLT_MODULE = 2									//����ģ��

//���ض���
var tagActionDownLoad = 
[
	['BYTE', 'cbDownLoadMode'],						//���ط�ʽ
	['TCHAR', 'szDownLoadUrl', 256],					//���ص�ַ
]

//������Ϣ
var CMD_CM_ActionMessage = 
[
	['WORD', 'wType'],								//��Ϣ����
	['WORD', 'wLength'],							//��Ϣ����
	['UINT', 'nButtonType'],						//��ť����
	['TCHAR', 'szString', 1024],						//��Ϣ����
]

//////////////////////////////////////////////////////////////////////////////////

//������Ϣ
var CMD_CM_DownLoadModule = 
[
	['BYTE', 'cbShowUI'],							//��ʾ����
	['BYTE', 'cbAutoInstall'],						//�Զ���װ
	['WORD', 'wFileNameSize'],						//���ֳ���
	['WORD', 'wDescribeSize'],						//��������
	['WORD', 'wDownLoadUrlSize'],					//��ַ����
]

//////////////////////////////////////////////////////////////////////////////////

//#pragma pack()

//#endif