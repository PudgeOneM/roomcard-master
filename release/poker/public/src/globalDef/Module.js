// //#ifndef MODULE_HEAD_FILE
// //#define MODULE_HEAD_FILE

// //////////////////////////////////////////////////////////////////////////////////
// //ģ��ӿ�

// var VER_IUnknownEx = INTERFACE_VERSION(1,1)
// var IID_IUnknownEx =[0x5feec21e,0xdbf3,0x46f0,0x9f,0x57,0xd1,0xcd,0x71,0x1c,0x46,0xde]

// //�����ӿ�
// var IUnknownEx = ''
// /*{
// 	//�ͷŶ���
// 	var Release() =NULL;
// 	//�ӿڲ�ѯ
// 	var dwQueryVer) =NULL;
// };*/

// //////////////////////////////////////////////////////////////////////////////////
// //�汾�Ƚ�

// //��Ʒ�汾
// var BULID_VER = 0									//��Ȩ�汾
// var PRODUCT_VER = 6									//��Ʒ�汾

// //�ӿڰ汾
// function INTERFACE_VERSION(cbMainVer, cbSubVer)
// {
// /*
// */
// }

//ģ��汾
function PROCESS_VERSION(cbMainVer, cbSubVer, cbBuildVer)
{
/*
*/
}

// //��Ʒ�汾
// function GetProductVer(dwVersion)
// {
// /*
// 	return ((BYTE *)&dwVersion)[3];
// */
// }

// //��Ҫ�汾
// function GetMainVer(dwVersion)
// {
// /*
// 	return ((BYTE *)&dwVersion)[2];
// */
// }

// //��Ҫ�汾
// function GetSubVer(dwVersion)
// {
// /*
// 	return ((BYTE *)&dwVersion)[1];
// */
// }

// //����汾
// function GetBuildVer(dwVersion)
// {
// /*
// 	return ((BYTE *)&dwVersion)[0];
// */
// }

// //�汾�Ƚ�
// function InterfaceVersionCompare(dwQueryVer, dwInterfaceVer)
// {
// /*
// 	if (GetSubVer(dwQueryVer)>GetSubVer(dwInterfaceVer)) return false;
// 	var (GetMainVer(dwQueryVer)! =GetMainVer(dwInterfaceVer)) return false;
// 	var (GetBuildVer(dwQueryVer)! =GetBuildVer(dwInterfaceVer)) return false;
// 	var (GetProductVer(dwQueryVer)! =GetProductVer(dwInterfaceVer)) return false;
// 	return true;
// */
// };

// //////////////////////////////////////////////////////////////////////////////////
// //�ڲ��ӿڲ�ѯ

// //��ѯ�ӿ�
// function QUERYINTERFACE(Interface, Guid, dwQueryVer)
// {
// /*
// */
// }

// //��ѯ�ӿ�
// function QUERYINTERFACE_IUNKNOWNEX(BaseInterface, Guid, dwQueryVer)
// {
// /*
// */
// }

// //////////////////////////////////////////////////////////////////////////////////
// //�ⲿ�ӿڲ�ѯ

// //��ѯ�ӿ�
// function QUERY_ME_INTERFACE(Interface)
// {
// /*
// */
// }

// //��ѯ�ӿ�
// function QUERY_OBJECT_INTERFACE(Object, Interface)
// {
// /*
// */
// }

// //��ѯ�ӿ�
// function QUERY_OBJECT_PTR_INTERFACE(pObject, Interface)
// {
// /*
// */
// }

// //////////////////////////////////////////////////////////////////////////////////
// //���ģ�帨��ģ��

// // //�����������
// // typedef VOID * (ModuleCreateProc)(REFGUID Gudi, DWORD dwInterfaceVer);

// // //���������ģ��
// // template <typename IModeluInterface> class CTempldateHelper
// // {
// // 	//�ӿ�����
// // public:
// // 	REFGUID							m_Guid;								//�ӿڱ�ʶ
// // 	const DWORD						m_dwVersion;						//�ӿڰ汾

// // 	//�������
// // public:
// // 	CHAR							m_szCreateProc[32];					//��������
// // 	TCHAR							m_szModuleDllName[MAX_PATH];		//�������

// // 	//�ں˱���
// // public:
// // 	HINSTANCE						m_hDllInstance;						//DLL ���
// // 	IModeluInterface *				m_pIModeluInterface;				//ģ��ӿ�

// // 	//��������
// // public:
// // 	TCHAR							m_szDescribe[128];					//��������

// // 	//��������
// // public:
// // 	//���캯��
// // 	CTempldateHelper(REFGUID Guid, DWORD dwVersion);
// // 	//���캯��
// // 	CTempldateHelper(REFGUID Guid, DWORD dwVersion, LPCTSTR pszModuleDll, LPCSTR pszCreateProc);
// // 	//��������
// // 	virtual ~CTempldateHelper();

// // 	//������
// // public:
// // 	//�ͷ����
// // 	bool CloseInstance();
// // 	//��������
// // 	bool CreateInstance();

// // 	//���ú���
// // public:
// // 	//������Ϣ
// // 	VOID SetModuleCreateInfo(LPCTSTR pszModuleDllName, LPCSTR pszCreateProc);

// // 	//��������
// // public:
// // 	//��ȡ����
// // 	inline LPCTSTR GetErrorDescribe() const;
// // 	//ָ������
// // 	inline IModeluInterface * operator->() const;
// // 	//��ȡ�ӿ�
// // 	inline IModeluInterface * GetInterface() const;
// // };

// // //////////////////////////////////////////////////////////////////////////////////
// // // CTempldateHelper<IModeluInterface> ��������

// // //���캯��
// // template <typename IModeluInterface>
// // CTempldateHelper<IModeluInterface>::CTempldateHelper(REFGUID Guid, DWORD dwVersion) : m_dwVersion(dwVersion), m_Guid(Guid)
// // {
// // 	//��������
// // 	var m_szDescribe =0;

// // 	//�ں���Ϣ
// // 	var m_hDllInstance =NULL;
// // 	var m_pIModeluInterface =NULL;

// // 	//�������
// // 	ZeroMemory(m_szCreateProc,sizeof(m_szCreateProc));
// // 	ZeroMemory(m_szModuleDllName,sizeof(m_szModuleDllName));

// // 	return;
// // }

// // //���캯��
// // template <typename IModeluInterface>
// // CTempldateHelper<IModeluInterface>::CTempldateHelper(REFGUID Guid, DWORD dwVersion, LPCTSTR pszModuleDll, LPCSTR pszCreateProc) : m_dwVersion(dwVersion), m_Guid(Guid)
// // {
// // 	//��������
// // 	var m_szDescribe =0;

// // 	//�ں���Ϣ
// // 	var m_hDllInstance =NULL;
// // 	var m_pIModeluInterface =NULL;

// // 	//�������
// // 	lstrcpynA(m_szCreateProc,pszCreateProc,CountArray(m_szCreateProc));
// // 	lstrcpyn(m_szModuleDllName,pszModuleDll,CountArray(m_szModuleDllName));

// // 	return;
// // }

// // //��������
// // template <typename IModeluInterface>
// // CTempldateHelper<IModeluInterface>::~CTempldateHelper()
// // {
// // 	CloseInstance();
// // }

// // //�������
// // template <typename IModeluInterface>
// // bool CTempldateHelper<IModeluInterface>::CreateInstance()
// // {
// // 	//�ͷ����
// // 	CloseInstance();

// // 	//�������
// // 	try
// // 	{
// // 		//Ч�����
// // 		var ASSERT(m_szCreateProc =0);
// // 		var ASSERT(m_szModuleDllName =0);

// // 		//����ģ��
// // 		var m_hDllInstance =AfxLoadLibrary(m_szModuleDllName);
// // 		var (m_hDllInstance ==NULL) 
// // 		{
// // 			_sntprintf(m_szDescribe,CountArray(m_szDescribe),"��%s��ģ�����ʧ��",m_szModuleDllName);
// // 			return false;
// // 		}

// // 		//Ѱ�Һ���
// // 		var CreateProc =(ModuleCreateProc *)GetProcAddress(m_hDllInstance,m_szCreateProc);
// // 		var (CreateProc ==NULL) 
// // 		{
// // 			_sntprintf(m_szDescribe,CountArray(m_szDescribe),"�Ҳ����������������%s��",m_szCreateProc);
// // 			return false;
// // 		}

// // 		//�������
// // 		var m_pIModeluInterface =(IModeluInterface *)CreateProc(m_Guid,m_dwVersion);
// // 		var (m_pIModeluInterface ==NULL) 
// // 		{
// // 			_sntprintf(m_szDescribe,CountArray(m_szDescribe),"���ú�����%s�����ɶ���ʧ��",m_szCreateProc);
// // 			return false;
// // 		}
// // 	}
// // 	catch (LPCTSTR pszError)
// // 	{
// // 		_sntprintf(m_szDescribe,CountArray(m_szDescribe),"���ڡ�%s�����������ʧ��",pszError);
// // 		return false;
// // 	}
// // 	catch (...)	
// // 	{ 
// // 		_sntprintf(m_szDescribe,CountArray(m_szDescribe),"�������������%s������δ֪�쳣�����������ʧ��",m_szCreateProc);
// // 		return false;
// // 	}

// // 	return true;
// // }

// // //�ͷ����
// // template <typename IModeluInterface>
// // bool CTempldateHelper<IModeluInterface>::CloseInstance()
// // {
// // 	//���ñ���
// // 	var m_szDescribe =0;

// // 	//���ٶ���
// // 	var (m_pIModeluInterface! =NULL)
// // 	{
// // 		m_pIModeluInterface->Release();
// // 		var m_pIModeluInterface =NULL;
// // 	}

// // 	//�ͷ� DLL
// // 	var (m_hDllInstance! =NULL)
// // 	{
// // 		AfxFreeLibrary(m_hDllInstance);
// // 		var m_hDllInstance =NULL;
// // 	}

// // 	return true;
// // }

// // //������Ϣ
// // template <typename IModeluInterface>
// // VOID CTempldateHelper<IModeluInterface>::SetModuleCreateInfo(LPCTSTR pszModuleDllName, LPCSTR pszCreateProc)
// // {
// // 	//������Ϣ
// // 	lstrcpynA(m_szCreateProc,pszCreateProc,CountArray(m_szCreateProc));
// // 	lstrcpyn(m_szModuleDllName,pszModuleDllName,CountArray(m_szModuleDllName));

// // 	return;
// // }

// // //////////////////////////////////////////////////////////////////////////////////
// // // CTempldateHelper<IModeluInterface> ��������

// // //��ȡ����
// // template <typename IModeluInterface>
// // inline LPCTSTR CTempldateHelper<IModeluInterface>::GetErrorDescribe() const
// // { 
// // 	return m_szDescribe; 
// // }

// // //ָ������
// // template <typename IModeluInterface>
// // inline IModeluInterface * CTempldateHelper<IModeluInterface>::operator->() const
// // { 
// // 	return GetInterface(); 
// // }

// // //��ȡ�ӿ�
// // template <typename IModeluInterface>
// // inline IModeluInterface * CTempldateHelper<IModeluInterface>::GetInterface() const
// // { 
// // 	return m_pIModeluInterface; 
// // }

// //////////////////////////////////////////////////////////////////////////////////
// //���������

// //�����������
// function DECLARE_CREATE_MODULE(OBJECT_NAME)
// {
// /*
// */
// }

// //����������
// function DECLARE_MODULE_DYNAMIC(OBJECT_NAME)
// {
// /*
// */
// }

// //����������
// function DECLARE_MODULE_HELPER(OBJECT_NAME, MODULE_DLL_NAME, CREATE_FUNCTION_NAME)
// {
// /*
// */
// }

// //////////////////////////////////////////////////////////////////////////////////

// //#endif