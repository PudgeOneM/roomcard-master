// //#ifndef PROPERTY_HEAD_FILE
// //#define PROPERTY_HEAD_FILE

// //#pragma pack(1)

// //////////////////////////////////////////////////////////////////////////////////

// //���з�Χ
// var PT_ISSUE_AREA_WEB = 0x01								//�̳ǵ���
// var PT_ISSUE_AREA_GAME = 0x02								//��Ϸ����
// var PT_ISSUE_AREA_SERVER = 0x04								//�������

// //ʹ�÷�Χ
// var PT_SERVICE_AREA_MESELF = 0x0001								//�Լ���Χ
// var PT_SERVICE_AREA_PLAYER = 0x0002								//��ҷ�Χ
// var PT_SERVICE_AREA_LOOKON = 0x0004								//�Թ۷�Χ

// //��������
// var PT_TYPE_ERROR = 0                                   //�������� 
// var PT_TYPE_PROPERTY = 1	                                //��������  
// var PT_TYPE_PRESENT = 2                                   //��������

// //���߶���
// var PROPERTY_ID_CAR = 1									//��������
// var PROPERTY_ID_EGG = 2									//��������
// var PROPERTY_ID_CLAP = 3									//��������
// var PROPERTY_ID_KISS = 4									//��������
// var PROPERTY_ID_BEER = 5									//ơ������
// var PROPERTY_ID_CAKE = 6									//��������
// var PROPERTY_ID_RING = 7									//�������
// var PROPERTY_ID_BEAT = 8									//��������
// var PROPERTY_ID_BOMB = 9									//ը������
// var PROPERTY_ID_SMOKE = 10									//��������
// var PROPERTY_ID_VILLA = 11									//��������
// var PROPERTY_ID_BRICK = 12									//שͷ����
// var PROPERTY_ID_FLOWER = 13									//�ʻ�����

// var PROPERTY_ID_TWO_CARD = 14				                    //���ֵ��� 
// var PROPERTY_ID_FOUR_CARD = 15			                        //���ֵ���  
// var PROPERTY_ID_SCORE_CLEAR = 16									//��������
// var PROPERTY_ID_ESCAPE_CLEAR = 17									//��������
// var PROPERTY_ID_TRUMPET = 18									//���ȵ���
// var PROPERTY_ID_TYPHON = 19									//���ȵ���
// var PROPERTY_ID_GUARDKICK_CARD = 20									//���ߵ���
// var PROPERTY_ID_POSSESS = 21									//�������
// var PROPERTY_ID_BLUERING_CARD = 22									//�������
// var PROPERTY_ID_YELLOWRING_CARD = 23									//�������
// var PROPERTY_ID_WHITERING_CARD = 24  								//������� 
// var PROPERTY_ID_REDRING_CARD = 25									//�������
// var PROPERTY_ID_VIPROOM_CARD = 26									//VIP������

// //////////////////////////////////////////////////////////////////////////////////

//������Ϣ
var tagPropertyInfo = 
[
	//������Ϣ
	['WORD', 'wIndex'],								//���߱�ʶ
	['WORD', 'wDiscount'],							//��Ա�ۿ�
	['WORD', 'wIssueArea'],							//������Χ

	//���ۼ۸�
	['SCORE', 'lPropertyGold'],						//���߽��
	['DOUBLE', 'dPropertyCash'],						//���߼۸�

	//��������
	['SCORE', 'lSendLoveLiness'],					//��������
	['SCORE', 'lRecvLoveLiness'],					//��������
]


//��������
var tagPropertyAttrib = 
[
	['WORD', 'wIndex'],								//���߱�ʶ
	['WORD', 'wPropertyType'],                      //��������
	['WORD', 'wServiceArea'],						//ʹ�÷�Χ
	['TCHAR', 'szMeasuringunit', 8],					//������λ 
	['TCHAR', 'szPropertyName', 32],					//��������
	['TCHAR', 'szRegulationsInfo', 256],				//ʹ����Ϣ
]

//��������
var tagPropertyItem = 
[
	['tagPropertyInfo', 'PropertyInfo'],						//������Ϣ
	['tagPropertyAttrib', 'PropertyAttrib'],						//��������
]

// //////////////////////////////////////////////////////////////////////////////////

// //#pragma pack()

// //#endif