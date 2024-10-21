//#ifndef STRUCT_HEAD_FILE
//#define STRUCT_HEAD_FILE


//#pragma pack(1)

//////////////////////////////////////////////////////////////////////////////////
//��Ϸ�б�

//��Ϸ����
var tagGameType = 
[
	['WORD', 'wJoinID'],							//�ҽ�����
	['WORD', 'wSortID'],							//��������
	['WORD', 'wTypeID'],							//��������
	['TCHAR', 'szTypeName', LEN_TYPE],				//��������
]

//��Ϸ����
var tagGameKind = 
[
	['WORD', 'wTypeID'],							//��������
	['WORD', 'wJoinID'],							//�ҽ�����
	['WORD', 'wSortID'],							//��������
	['WORD', 'wKindID'],							//��������
	['WORD', 'wGameID'],							//ģ������
	['DWORD', 'dwOnLineCount'],						//��������
	['DWORD', 'dwFullCount'],						//��Ա����
	['TCHAR', 'szKindName', LEN_KIND],				//��Ϸ����
	['TCHAR', 'szProcessName', LEN_PROCESS],			//��������
]

//��Ϸ�ڵ�
var tagGameNode = 
[
	['WORD', 'wKindID'],							//��������
	['WORD', 'wJoinID'],							//�ҽ�����
	['WORD', 'wSortID'],							//��������
	['WORD', 'wNodeID'],							//�ڵ�����
	['TCHAR', 'szNodeName', LEN_NODE],				//�ڵ�����
]

//��������
var tagGamePage = 
[
	['WORD', 'wPageID'],							//ҳ������
	['WORD', 'wKindID'],							//��������
	['WORD', 'wNodeID'],							//�ڵ�����
	['WORD', 'wSortID'],							//��������
	['WORD', 'wOperateType'],						//��������
	['TCHAR', 'szDisplayName', LEN_PAGE],			//��ʾ����
]

//��Ϸ����
var tagGameServer = 
[
	['WORD', 'wKindID'],							//��������
	['WORD', 'wNodeID'],							//�ڵ�����
	['WORD', 'wSortID'],							//��������
	['WORD', 'wServerID'],							//��������
	['WORD', 'wServerPort'],						//����˿�
	['DWORD', 'dwOnLineCount'],						//��������
	['DWORD', 'dwFullCount'],						//��Ա����
	['TCHAR', 'szServerAddr', 32],					//��������
	['TCHAR', 'szServerName', LEN_SERVER],			//��������
]

//��Ƶ����
var tagAVServerOption = 
[
	['WORD', 'wAVServerPort'],						//��Ƶ�˿�
	['DWORD', 'dwAVServerAddr'],						//��Ƶ��ַ
]

//������Ϣ
var tagOnLineInfoKind = 
[
	['WORD', 'wKindID'],							//���ͱ�ʶ
	['DWORD', 'dwOnLineCount'],						//��������
]

//������Ϣ
var tagOnLineInfoServer = 
[
	['WORD', 'wServerID'],							//�����ʶ
	['DWORD', 'dwOnLineCount'],						//��������
]

//////////////////////////////////////////////////////////////////////////////////
//�û���Ϣ

//����״̬
var tagTableStatus = 
[
	['BYTE', 'cbTableLock'],						//������־
	['BYTE', 'cbPlayStatus'],						//��Ϸ��־
	['BYTE', 'cbRoomOpeningStatus'],				//���ֱ�־
]

//�û�״̬
var tagUserStatus = 
[
	['WORD', 'wTableID'],							//��������
	['WORD', 'wChairID'],							//����λ��
	['BYTE', 'cbUserStatus'],						//�û�״̬
]

//�û�����
var tagUserAttrib = 
[
	['BYTE', 'cbCompanion'],						//�û���ϵ
]

//�û�����
var tagUserScore = 
[
	//������Ϣ
	['SCORE', 'lScore'],								//�û�����
	['SCORE', 'lGrade'],								//�û��ɼ�
	['SCORE', 'lInsure'],							//�û�����
	['SCORE', 'lScoreInGame'],						//�����ֵ

	//��Ӯ��Ϣ
	['DWORD', 'dwWinCount'],							//ʤ������
	['DWORD', 'dwLostCount'],						//ʧ������
	['DWORD', 'dwDrawCount'],						//�;�����
	['DWORD', 'dwFleeCount'],						//��������

	//ȫ����Ϣ
	['DWORD', 'dwUserMedal'],						//�û�����
	['DWORD', 'dwExperience'],						//�û�����
	['LONG', 'lLoveLiness'],						//�û�����
]

//�û�����
var tagMobileUserScore = 
[
	//������Ϣ
	['SCORE', 'lScore'],								//�û�����
	['SCORE', 'lScoreInGame'],						//�����ֵ

	//��Ӯ��Ϣ
	['DWORD', 'dwWinCount'],							//ʤ������
	['DWORD', 'dwLostCount'],						//ʧ������
	['DWORD', 'dwDrawCount'],						//�;�����
	['DWORD', 'dwFleeCount'],						//��������

	//ȫ����Ϣ
	['DWORD', 'dwExperience'],						//�û�����
]


//����ʹ��
var tagUsePropertyInfo = 
[
	['WORD', 'wPropertyCount'],                     //������Ŀ
	['WORD', 'dwValidNum'],						    //��Ч����
	['DWORD', 'dwEffectTime'],                       //��Чʱ��
]


//�û�����
var tagUserProperty = 
[
	['WORD', 'wPropertyUseMark'],                   //���߱�ʾ
	['tagUsePropertyInfo', 'PropertyInfo', MAX_PT_MARK],			//ʹ����Ϣ   
]

//���߰���
var tagPropertyPackage = 
[
	['WORD', 'wTrumpetCount'],                     //С������
	['WORD', 'wTyphonCount'],                      //��������
]

//�û���γ��
var tagUserLocation = 
[
	['TCHAR', 'szLatitude', LEN_LATITUDE],			//γ��
	['TCHAR', 'szLongitude', LEN_LONGITUDE],			//����
]

//�û���Ϣ
var tagUserInfo = 
[
	//��������
	['DWORD', 'dwUserID'],							//�û� I D
	['DWORD', 'dwGameID'],							//��Ϸ I D
	['DWORD', 'dwGroupID'],							//���� I D
	['TCHAR', 'szNickName', LEN_NICKNAME],			//�û��ǳ�
	['TCHAR', 'szGroupName', LEN_GROUP_NAME],		//��������
	['TCHAR', 'szUnderWrite', LEN_UNDER_WRITE],		//����ǩ��

	//ͷ����Ϣ
	['WORD', 'wFaceID'],							//ͷ������
	['DWORD', 'dwCustomID'],							//�Զ���ʶ

	//�û�����
	['BYTE', 'cbGender'],							//�û��Ա�
	['BYTE', 'cbMemberOrder'],						//��Ա�ȼ�
	['SYSTEMTIME', 'SystemMemberOvertime'],				//��Ա����
	['BYTE', 'cbMasterOrder'],						//����ȼ�

	//�û�״̬
	['WORD', 'wTableID'],							//��������
	['WORD', 'wChairID'],							//��������
	['BYTE', 'cbUserStatus'],						//�û�״̬
	['bool', 'bIsSwitch'],							//�û��л��ж�

	//������Ϣ
	['SCORE', 'lScore'],								//�û�����
	['SCORE', 'lGrade'],								//�û��ɼ�
	['SCORE', 'lInsure'],							//�û�����
	['SCORE', 'lScoreInGame'],						//�����ֵ
	['SCORE', 'lDiamond'],							//�û���ʯ

	//��Ϸ��Ϣ
	['DWORD', 'dwWinCount'],							//ʤ������
	['DWORD', 'dwLostCount'],						//ʧ������
	['DWORD', 'dwDrawCount'],						//�;�����
	['DWORD', 'dwFleeCount'],						//��������
	['DWORD', 'dwUserMedal'],						//�û�����
	['DWORD', 'dwExperience'],						//�û�����
	['LONG', 'lLoveLiness'],						//�û�����

	//΢����Ϣ
	['TCHAR', 'szHeadImageUrlPath', MAX_URL_LEN],	//΢��ͷ��url
]

//�û���Ϣ
var tagUserInfoHead = 
[
	//�û�����
	['DWORD', 'dwGameID'],							//��Ϸ I D
	['DWORD', 'dwUserID'],							//�û� I D
	['DWORD', 'dwGroupID'],							//���� I D
	['TCHAR', 'szNickName', LEN_NICKNAME],			//�û��ǳ�

	//ͷ����Ϣ
	['WORD', 'wFaceID'],							//ͷ������
	['DWORD', 'dwCustomID'],							//�Զ���ʶ

	//�û�����
	['BYTE', 'cbGender'],							//�û��Ա�
	['BYTE', 'cbMemberOrder'],						//��Ա�ȼ�
	['BYTE', 'cbMasterOrder'],						//����ȼ�
	['DWORD', 'dwMemberOverTime'],					//��Ա����ʱ��

	//�û�״̬
	['WORD', 'wTableID'],							//��������
	['WORD', 'wChairID'],							//��������
	['BYTE', 'cbUserStatus'],						//�û�״̬

	//������Ϣ
	['SCORE', 'lScore'],								//�û�����
	['SCORE', 'lGrade'],								//�û��ɼ�
	['SCORE', 'lInsure'],							//�û�����
	['SCORE', 'lScoreInGame'],						//�����ֵ
	['SCORE', 'lDiamond'],							//�û���ʯ

	//��Ϸ��Ϣ
	['DWORD', 'dwWinCount'],							//ʤ������
	['DWORD', 'dwLostCount'],						//ʧ������
	['DWORD', 'dwDrawCount'],						//�;�����
	['DWORD', 'dwFleeCount'],						//��������
	['DWORD', 'dwUserMedal'],						//�û�����
	['DWORD', 'dwExperience'],						//�û�����
	['LONG', 'lLoveLiness'],						//�û�����

	//΢����Ϣ
	['TCHAR', 'szHeadImageUrlPath', MAX_URL_LEN],	//΢��ͷ��url
]

//ͷ����Ϣ
var tagCustomFaceInfo = 
[
	['DWORD', 'dwDataSize'],							//���ݴ�С
	['DWORD', 'dwCustomFace', FACE_CX*FACE_CY],		//ͼƬ��Ϣ
]

//�û���Ϣ
var tagUserRemoteInfo = 
[
	//�û���Ϣ
	['DWORD', 'dwUserID'],							//�û���ʶ
	['DWORD', 'dwGameID'],							//��Ϸ��ʶ
	['TCHAR', 'szNickName', LEN_NICKNAME],			//�û��ǳ�

	//�ȼ���Ϣ
	['BYTE', 'cbGender'],							//�û��Ա�
	['BYTE', 'cbMemberOrder'],						//��Ա�ȼ�
	['BYTE', 'cbMasterOrder'],						//����ȼ�

	//λ����Ϣ
	['WORD', 'wKindID'],							//���ͱ�ʶ
	['WORD', 'wServerID'],							//�����ʶ
	['TCHAR', 'szGameServer', LEN_SERVER],			//����λ��
]


var tagTableHistoryRecordInfo = 
[
	['DWORD', 'dwUserID'],							//�û���ʶ
	['TCHAR', 'szNickName', LEN_NICKNAME],			//�û��ǳ�
	['SCORE', 'lScore'],								//�û��÷�
	['SCORE', 'lScoreInGame'],						//�����ֵ
]

var tagUserAddrInfo = 
[
	['DWORD', 'dwUserID'],							//�û���ʶ
	['TCHAR', 'szClientAddr', LEN_IP],				//�û�IP��ַ
	['TCHAR', 'szLatitude', LEN_LATITUDE],			//γ��
	['TCHAR', 'szLongitude', LEN_LONGITUDE],			//����
	['TCHAR', 'szAddr', LEN_ADDR],					//��ַ����
]
//////////////////////////////////////////////////////////////////////////////////

//�㳡����
var tagGamePlaza = 
[
	['WORD', 'wPlazaID'],							//�㳡��ʶ
	['TCHAR', 'szServerAddr', 32],					//�����ַ
	['TCHAR', 'szServerName', 32],					//��������
]

//��������
var tagLevelItem = 
[
	['LONG', 'lLevelScore'],						//�������
	['TCHAR', 'szLevelName', 16],					//��������
]

//��Ա����
var tagMemberItem = 
[
	['BYTE', 'cbMemberOrder'],						//�ȼ���ʶ
	['TCHAR', 'szMemberName', 16],					//�ȼ�����
]

//��������
var tagMasterItem = 
[
	['BYTE', 'cbMasterOrder'],						//�ȼ���ʶ
	['TCHAR', 'szMasterName', 16],					//�ȼ�����
]

//�б�����
var tagColumnItem = 
[
	['BYTE', 'cbColumnWidth'],						//�б���
	['BYTE', 'cbDataDescribe'],						//�ֶ�����
	['TCHAR', 'szColumnName', 16],					//�б�����
]

//��ַ��Ϣ
var tagAddressInfo = 
[
	['TCHAR', 'szAddress', 32],						//�����ַ
]

//������Ϣ
var tagDataBaseParameter = 
[
	['WORD', 'wDataBasePort'],						//���ݿ�˿�
	['TCHAR', 'szDataBaseAddr', 50],					//���ݿ��ַ
	['TCHAR', 'szDataBaseUser', 32],					//���ݿ��û�
	['TCHAR', 'szDataBasePass', 32],					//���ݿ�����
	['TCHAR', 'szDataBaseName', 32],					//���ݿ�����
]

//��������
var tagServerOptionInfo = 
[
	//�ҽ�����
	['WORD', 'wKindID'],							//�ҽ�����
	['WORD', 'wNodeID'],							//�ҽӽڵ�
	['WORD', 'wSortID'],							//���б�ʶ

	//˰������
	['WORD', 'wRevenueRatio'],						//˰�ձ���
	['SCORE', 'lServiceScore'],						//�������

	//��������
	['SCORE', 'lRestrictScore'],						//���ƻ���
	['SCORE', 'lMinTableScore'],						//��ͻ���
	['SCORE', 'lMinEnterScore'],						//��ͻ���
	['SCORE', 'lMaxEnterScore'],						//��߻���

	//��Ա����
	['BYTE', 'cbMinEnterMember'],					//��ͻ�Ա
	['BYTE', 'cbMaxEnterMember'],					//��߻�Ա

	//��������
	['DWORD', 'dwServerRule'],						//�������
	['TCHAR', 'szServerName', LEN_SERVER],			//��������
]

//�û���Ϣ
var tagMobileUserInfoHead = 
[
	//�û�����
	['DWORD', 'dwGameID'],							//��Ϸ I D
	['DWORD', 'dwUserID'],							//�û� I D

	//ͷ����Ϣ
	['WORD', 'wFaceID'],							//ͷ������
	['DWORD', 'dwCustomID'],							//�Զ���ʶ

	//�û�����
	['BYTE', 'cbGender'],							//�û��Ա�
	['BYTE', 'cbMemberOrder'],						//��Ա�ȼ�
	['DWORD', 'dwMemberOverTime'],					//��Ա����ʱ��

	//�û�״̬
	['WORD', 'wTableID'],							//��������
	['WORD', 'wChairID'],							//��������
	['BYTE', 'cbUserStatus'],						//�û�״̬

	//������Ϣ
	['SCORE', 'lScore'],								//�û�����
	['SCORE', 'lScoreInGame'],						//�����ֵ
	['SCORE', 'lDiamond'],							//�û���ʯ

	//��Ϸ��Ϣ
	['DWORD', 'dwWinCount'],							//ʤ������
	['DWORD', 'dwLostCount'],						//ʧ������
	['DWORD', 'dwDrawCount'],						//�;�����
	['DWORD', 'dwFleeCount'],						//��������
	['DWORD', 'dwExperience'],						//�û�����
]
//////////////////////////////////////////////////////////////////////////////////

//�ʼ�
var tagMail = 
[
	['DWORD', 'dwMailID'],							//�ʼ�ID
	['DWORD', 'dwDstUserID'],						//�û�ID
	['TCHAR', 'szSrcNick', LEN_NICKNAME],			//�������ǳ�
	['TCHAR', 'szSystemMessage', LEN_USER_CHAT],		//�ʼ���Ϣ
]

// typedef CList<tagMail *>			CMailList;							//�ʼ���Ϣ
//////////////////////////////////////////////////////////////////////////////////

//#pragma pack()

//#endif