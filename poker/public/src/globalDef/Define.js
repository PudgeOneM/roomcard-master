//#ifndef DEFINE_HEAD_FILE
//#define DEFINE_HEAD_FILE

//////////////////////////////////////////////////////////////////////////////////
//��ֵ����

//ͷ���С
var FACE_CX = 48									//ͷ����
var FACE_CY = 48									//ͷ��߶�

//���ȶ���
var LEN_LESS_ACCOUNTS = 6									//����ʺ�
var LEN_LESS_NICKNAME = 6									//����ǳ�
var LEN_LESS_PASSWORD = 6									//�������

//��������
var MAX_CHAIR = 8									//�������
var MAX_TABLE = 2000								//�������
var MAX_COLUMN = 32									//����б�
var MAX_ANDROID = 256									//������
var MAX_PROPERTY = 128									//������
var MAX_WHISPER_USER = 16									//���˽��
var MAX_URL_LEN = 255									//���url����
var MAX_TABALE_RECORD = 128									//���ս����¼����
var MAX_WRITE_SCORE_RECORD = 128									//���д�ּ�¼��


//�б���
var MAX_KIND = 128									//�������
var MAX_SERVER = 1024								//��󷿼�

//��������
var INVALID_CHAIR = 0xFFFF								//��Ч����
var INVALID_TABLE = 0xFFFF								//��Ч����

//˰�ն���
var REVENUE_BENCHMARK = 0								    //˰�����
var REVENUE_DENOMINATOR = 1000								//˰�շ�ĸ

//////////////////////////////////////////////////////////////////////////////////
//ϵͳ����

//��������
var SCORE = LONGLONG							//��������
var SCORE_STRING = "%I64d"						//��������

//��Ϸ״̬
var GAME_STATUS_FREE = 0									//����״̬
var GAME_STATUS_PLAY = 100									//��Ϸ״̬
var GAME_STATUS_WAIT = 200									//�ȴ�״̬

//ϵͳ����
var LEN_USER_CHAT = 128									//���쳤��
var TIME_USER_CHAT = 1									//������
var TRUMPET_MAX_CHAR = 128									//���ȳ���

//////////////////////////////////////////////////////////////////////////////////
//��������

//�б�����
var PRIME_TYPE = 11									//������Ŀ
var PRIME_KIND = 53									//������Ŀ
var PRIME_NODE = 101								//�ڵ���Ŀ
var PRIME_PAGE = 53									//�Զ���Ŀ
var PRIME_SERVER = 1009								//������Ŀ

//��������
var PRIME_SERVER_USER = 503								//��������
var PRIME_ANDROID_USER = 503								//��������
var PRIME_PLATFORM_USER = 100003								//ƽ̨����

//////////////////////////////////////////////////////////////////////////////////
//���ݳ���

//cookie����
var LEN_COOKIE = 256									//cookie������󳤶�

//��������
var LEN_MD5 = 33									//��������
var LEN_USERNOTE = 32									//��ע����
var LEN_ACCOUNTS = 32									//�ʺų���
var LEN_NICKNAME = 32									//�ǳƳ���
var LEN_PASSWORD = 33									//���볤��
var LEN_GROUP_NAME = 32									//��������
var LEN_UNDER_WRITE = 32									//����ǩ��
var LEN_ADDR = 32									//��ַ����

//���ݳ���
var LEN_QQ = 16									//Q Q ����
var LEN_EMAIL = 33									//�����ʼ�
var LEN_USER_NOTE = 256									//�û���ע
var LEN_SEAT_PHONE = 33									//�̶��绰
var LEN_MOBILE_PHONE = 12									//�ƶ��绰
var LEN_PASS_PORT_ID = 19									//֤������
var LEN_COMPELLATION = 16									//��ʵ����
var LEN_DWELLING_PLACE = 128									//��ϵ��ַ
var LEN_IP = 16									//IP����

//������ʶ
var LEN_NETWORK_ID = 13									//��������
var LEN_MACHINE_ID = 33									//���г���

//�б�����
var LEN_TYPE = 32									//���೤��
var LEN_KIND = 32									//���ͳ���
var LEN_NODE = 32									//�ڵ㳤��
var LEN_PAGE = 32									//���Ƴ���
var LEN_SERVER = 32									//���䳤��
var LEN_PROCESS = 32									//���̳���
var LEN_KEYTABLE = 7									//��������

//��γ��
var LEN_LATITUDE = 32									//γ��
var LEN_LONGITUDE = 32									//����

//////////////////////////////////////////////////////////////////////////////////

//�û���ϵ
var CP_NORMAL = 0									//δ֪��ϵ
var CP_FRIEND = 1									//���ѹ�ϵ
var CP_DETEST = 2									//����ϵ
var CP_SHIELD = 3									//��������

//////////////////////////////////////////////////////////////////////////////////

//�Ա���
var GENDER_FEMALE = 0									//Ů���Ա�
var GENDER_MANKIND = 1									//�����Ա�

//////////////////////////////////////////////////////////////////////////////////

//��Ϸģʽ
var GAME_GENRE_GOLD = 0x0001								//�������
var GAME_GENRE_SCORE = 0x0002								//��ֵ����
var GAME_GENRE_MATCH = 0x0004								//��������
var GAME_GENRE_EDUCATE = 0x0008								//ѵ������

//����ģʽ
var SCORE_GENRE_NORMAL = 0x0100								//��ͨģʽ
var SCORE_GENRE_POSITIVE = 0x0200								//�Ǹ�ģʽ

//////////////////////////////////////////////////////////////////////////////////

//�û�״̬
var US_NULL = 0x00								//û��״̬
var US_FREE = 0x01								//վ��״̬
var US_SIT = 0x02								//����״̬
var US_READY = 0x03								//ͬ��״̬
var US_LOOKON = 0x04								//�Թ�״̬
var US_PLAYING = 0x05								//��Ϸ״̬
var US_OFFLINE = 0x06								//����״̬

//////////////////////////////////////////////////////////////////////////////////

//����״̬
var MS_NULL = 0x00								//û��״̬
var MS_SIGNUP = 0x01								//����״̬
var MS_MATCHING = 0x02								//����״̬
var MS_OUT = 0x03								//��̭״̬

//////////////////////////////////////////////////////////////////////////////////

//�������
var SRL_LOOKON = 0x00000001							//�Թ۱�־
var SRL_OFFLINE = 0x00000002							//���߱�־
var SRL_SAME_IP = 0x00000004							//ͬ����־

//�������
var SRL_ROOM_CHAT = 0x00000100							//�����־
var SRL_GAME_CHAT = 0x00000200							//�����־
var SRL_WISPER_CHAT = 0x00000400							//˽�ı�־
var SRL_HIDE_USER_INFO = 0x00000800							//���ر�־

//////////////////////////////////////////////////////////////////////////////////
//�б�����

//��Ч����
var UD_NULL = 0									//��Ч����
var UD_IMAGE = 100									//ͼ������
var UD_CUSTOM = 200									//�Զ�����

//��������
var UD_GAME_ID = 1									//��Ϸ��ʶ
var UD_USER_ID = 2									//�û���ʶ
var UD_NICKNAME = 3									//�û��ǳ�

//��չ����
var UD_GENDER = 10									//�û��Ա�
var UD_GROUP_NAME = 11									//��������
var UD_UNDER_WRITE = 12									//����ǩ��

//״̬��Ϣ
var UD_TABLE = 20									//��Ϸ����
var UD_CHAIR = 21									//���Ӻ���

//������Ϣ
var UD_SCORE = 30									//�û�����
var UD_GRADE = 31									//�û��ɼ�
var UD_USER_MEDAL = 32									//�û�����
var UD_EXPERIENCE = 33									//�û�����
var UD_LOVELINESS = 34									//�û�����
var UD_WIN_COUNT = 35									//ʤ������
var UD_LOST_COUNT = 36									//�������
var UD_DRAW_COUNT = 37									//�;�����
var UD_FLEE_COUNT = 38									//�Ӿ�����
var UD_PLAY_COUNT = 39									//�ܾ�����

//���ֱ���
var UD_WIN_RATE = 40									//�û�ʤ��
var UD_LOST_RATE = 41									//�û�����
var UD_DRAW_RATE = 42									//�û�����
var UD_FLEE_RATE = 43									//�û�����
var UD_GAME_LEVEL = 44									//��Ϸ�ȼ�

//��չ��Ϣ
var UD_NOTE_INFO = 50									//�û���ע
var UD_LOOKON_USER = 51									//�Թ��û�

//ͼ���б�
var UD_IMAGE_FLAG = (UD_IMAGE+1)						//�û���־
var UD_IMAGE_GENDER = (UD_IMAGE+2)						//�û��Ա�
var UD_IMAGE_STATUS = (UD_IMAGE+3)						//�û�״̬

//////////////////////////////////////////////////////////////////////////////////
//���ݿⶨ��

var DB_ERROR = -1  								//����ʧ��
var DB_SUCCESS = 0  									//����ɹ�
var DB_NEEDMB = 18 									//����ʧ��
var DB_CONTINUE = 19									//��������

//////////////////////////////////////////////////////////////////////////////////
//���߱�ʾ
var PT_USE_MARK_DOUBLE_SCORE = 0x0001								//˫������
var PT_USE_MARK_FOURE_SCORE = 0x0002								//�ı�����
var PT_USE_MARK_GUARDKICK_CARD = 0x0010								//���ߵ���
var PT_USE_MARK_POSSESS = 0x0020								//������� 

var MAX_PT_MARK = 4                                   //��ʶ��Ŀ

//��Ч��Χ
var VALID_TIME_DOUBLE_SCORE = 3600                                //��Чʱ��
var VALID_TIME_FOUR_SCORE = 3600                                //��Чʱ��
var VALID_TIME_GUARDKICK_CARD = 3600                                //����ʱ��
var VALID_TIME_POSSESS = 3600                                //����ʱ��
var VALID_TIME_KICK_BY_MANAGER = 3600                                //��Ϸʱ�� 
var VALID_TIME_PREPARE = 1200								//׼��ʱ��

//////////////////////////////////////////////////////////////////////////////////
//�豸����
var DEVICE_TYPE_PC = 0x00                                //PC
var DEVICE_TYPE_ANDROID = 0x10                                //Android
var DEVICE_TYPE_ITOUCH = 0x20                                //iTouch
var DEVICE_TYPE_IPHONE = 0x40                                //iPhone
var DEVICE_TYPE_IPAD = 0x80                                //iPad

/////////////////////////////////////////////////////////////////////////////////
//�ֻ�����

//��ͼģʽ
var VIEW_MODE_ALL = 0x0001								//ȫ������
var VIEW_MODE_PART = 0x0002								//���ֿ���

//��Ϣģʽ
var VIEW_INFO_LEVEL_1 = 0x0010								//������Ϣ
var VIEW_INFO_LEVEL_2 = 0x0020								//������Ϣ
var VIEW_INFO_LEVEL_3 = 0x0040								//������Ϣ
var VIEW_INFO_LEVEL_4 = 0x0080								//������Ϣ

//��������
var RECVICE_GAME_CHAT = 0x0100								//��������
var RECVICE_ROOM_CHAT = 0x0200								//��������
var RECVICE_ROOM_WHISPER = 0x0400								//����˽��

//��Ϊ��ʶ
var BEHAVIOR_LOGON_NORMAL = 0x0000                              //��ͨ��¼
var BEHAVIOR_LOGON_IMMEDIATELY = 0x1000                              //������¼

/////////////////////////////////////////////////////////////////////////////////
//������
var RESULT_ERROR = -1  								//�������
var RESULT_SUCCESS = 0  									//����ɹ�
var RESULT_FAIL = 1  									//����ʧ��

/////////////////////////////////////////////////////////////////////////////////
//�仯ԭ��
var SCORE_REASON_WRITE = 0                                   //д�ֱ仯
var SCORE_REASON_INSURE = 1                                   //���б仯
var SCORE_REASON_PROPERTY = 2                                   //���߱仯

/////////////////////////////////////////////////////////////////////////////////

//��¼����ʧ��ԭ��
var LOGON_FAIL_SERVER_INVALIDATION = 200                                 //����ʧЧ

////////////////////////////////////////////////////////////////////////////////

//վ��ԭ��
var STANDUP_REASON_NORMAL = 0									//����վ��
var STANDUP_REASON_LEAVE = 1									//�뿪
var STANDUP_REASON_OFFLINE = 2									//����

////////////////////////////////////////////////////////////////////////////////

//֧������
var DEFALUT_PAY = 0									//Ĭ��
var CREATE_PAY = 1									//��������
var GAME_PAY = 2									//���¸���
var PROPERTY_PAY = 3									//����ʹ��

////////////////////////////////////////////////////////////////////////////////
//#endif