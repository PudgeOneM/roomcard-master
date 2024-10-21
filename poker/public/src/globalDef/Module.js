// //#ifndef MODULE_HEAD_FILE
// //#define MODULE_HEAD_FILE

// //////////////////////////////////////////////////////////////////////////////////
// //模块接口

// var VER_IUnknownEx = INTERFACE_VERSION(1,1)
// var IID_IUnknownEx =[0x5feec21e,0xdbf3,0x46f0,0x9f,0x57,0xd1,0xcd,0x71,0x1c,0x46,0xde]

// //基础接口
// var IUnknownEx = ''
// /*{
// 	//释放对象
// 	var Release() =NULL;
// 	//接口查询
// 	var dwQueryVer) =NULL;
// };*/

// //////////////////////////////////////////////////////////////////////////////////
// //版本比较

// //产品版本
// var BULID_VER = 0									//授权版本
// var PRODUCT_VER = 6									//产品版本

// //接口版本
// function INTERFACE_VERSION(cbMainVer, cbSubVer)
// {
// /*
// */
// }

//模块版本
function PROCESS_VERSION(cbMainVer, cbSubVer, cbBuildVer)
{
/*
*/
}

// //产品版本
// function GetProductVer(dwVersion)
// {
// /*
// 	return ((BYTE *)&dwVersion)[3];
// */
// }

// //主要版本
// function GetMainVer(dwVersion)
// {
// /*
// 	return ((BYTE *)&dwVersion)[2];
// */
// }

// //次要版本
// function GetSubVer(dwVersion)
// {
// /*
// 	return ((BYTE *)&dwVersion)[1];
// */
// }

// //编译版本
// function GetBuildVer(dwVersion)
// {
// /*
// 	return ((BYTE *)&dwVersion)[0];
// */
// }

// //版本比较
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
// //内部接口查询

// //查询接口
// function QUERYINTERFACE(Interface, Guid, dwQueryVer)
// {
// /*
// */
// }

// //查询接口
// function QUERYINTERFACE_IUNKNOWNEX(BaseInterface, Guid, dwQueryVer)
// {
// /*
// */
// }

// //////////////////////////////////////////////////////////////////////////////////
// //外部接口查询

// //查询接口
// function QUERY_ME_INTERFACE(Interface)
// {
// /*
// */
// }

// //查询接口
// function QUERY_OBJECT_INTERFACE(Object, Interface)
// {
// /*
// */
// }

// //查询接口
// function QUERY_OBJECT_PTR_INTERFACE(pObject, Interface)
// {
// /*
// */
// }

// //////////////////////////////////////////////////////////////////////////////////
// //组件模板辅助模板

// // //组件创建函数
// // typedef VOID * (ModuleCreateProc)(REFGUID Gudi, DWORD dwInterfaceVer);

// // //组件辅助类模板
// // template <typename IModeluInterface> class CTempldateHelper
// // {
// // 	//接口属性
// // public:
// // 	REFGUID							m_Guid;								//接口标识
// // 	const DWORD						m_dwVersion;						//接口版本

// // 	//组件属性
// // public:
// // 	CHAR							m_szCreateProc[32];					//创建函数
// // 	TCHAR							m_szModuleDllName[MAX_PATH];		//组件名字

// // 	//内核变量
// // public:
// // 	HINSTANCE						m_hDllInstance;						//DLL 句柄
// // 	IModeluInterface *				m_pIModeluInterface;				//模块接口

// // 	//辅助变量
// // public:
// // 	TCHAR							m_szDescribe[128];					//错误描述

// // 	//函数定义
// // public:
// // 	//构造函数
// // 	CTempldateHelper(REFGUID Guid, DWORD dwVersion);
// // 	//构造函数
// // 	CTempldateHelper(REFGUID Guid, DWORD dwVersion, LPCTSTR pszModuleDll, LPCSTR pszCreateProc);
// // 	//析构函数
// // 	virtual ~CTempldateHelper();

// // 	//管理函数
// // public:
// // 	//释放组件
// // 	bool CloseInstance();
// // 	//创建函数
// // 	bool CreateInstance();

// // 	//配置函数
// // public:
// // 	//创建信息
// // 	VOID SetModuleCreateInfo(LPCTSTR pszModuleDllName, LPCSTR pszCreateProc);

// // 	//辅助函数
// // public:
// // 	//获取错误
// // 	inline LPCTSTR GetErrorDescribe() const;
// // 	//指针重载
// // 	inline IModeluInterface * operator->() const;
// // 	//获取接口
// // 	inline IModeluInterface * GetInterface() const;
// // };

// // //////////////////////////////////////////////////////////////////////////////////
// // // CTempldateHelper<IModeluInterface> 外联函数

// // //构造函数
// // template <typename IModeluInterface>
// // CTempldateHelper<IModeluInterface>::CTempldateHelper(REFGUID Guid, DWORD dwVersion) : m_dwVersion(dwVersion), m_Guid(Guid)
// // {
// // 	//辅助变量
// // 	var m_szDescribe =0;

// // 	//内核信息
// // 	var m_hDllInstance =NULL;
// // 	var m_pIModeluInterface =NULL;

// // 	//组件属性
// // 	ZeroMemory(m_szCreateProc,sizeof(m_szCreateProc));
// // 	ZeroMemory(m_szModuleDllName,sizeof(m_szModuleDllName));

// // 	return;
// // }

// // //构造函数
// // template <typename IModeluInterface>
// // CTempldateHelper<IModeluInterface>::CTempldateHelper(REFGUID Guid, DWORD dwVersion, LPCTSTR pszModuleDll, LPCSTR pszCreateProc) : m_dwVersion(dwVersion), m_Guid(Guid)
// // {
// // 	//辅助变量
// // 	var m_szDescribe =0;

// // 	//内核信息
// // 	var m_hDllInstance =NULL;
// // 	var m_pIModeluInterface =NULL;

// // 	//组件属性
// // 	lstrcpynA(m_szCreateProc,pszCreateProc,CountArray(m_szCreateProc));
// // 	lstrcpyn(m_szModuleDllName,pszModuleDll,CountArray(m_szModuleDllName));

// // 	return;
// // }

// // //析构函数
// // template <typename IModeluInterface>
// // CTempldateHelper<IModeluInterface>::~CTempldateHelper()
// // {
// // 	CloseInstance();
// // }

// // //创建组件
// // template <typename IModeluInterface>
// // bool CTempldateHelper<IModeluInterface>::CreateInstance()
// // {
// // 	//释放组件
// // 	CloseInstance();

// // 	//创建组件
// // 	try
// // 	{
// // 		//效验参数
// // 		var ASSERT(m_szCreateProc =0);
// // 		var ASSERT(m_szModuleDllName =0);

// // 		//加载模块
// // 		var m_hDllInstance =AfxLoadLibrary(m_szModuleDllName);
// // 		var (m_hDllInstance ==NULL) 
// // 		{
// // 			_sntprintf(m_szDescribe,CountArray(m_szDescribe),"“%s”模块加载失败",m_szModuleDllName);
// // 			return false;
// // 		}

// // 		//寻找函数
// // 		var CreateProc =(ModuleCreateProc *)GetProcAddress(m_hDllInstance,m_szCreateProc);
// // 		var (CreateProc ==NULL) 
// // 		{
// // 			_sntprintf(m_szDescribe,CountArray(m_szDescribe),"找不到组件创建函数“%s”",m_szCreateProc);
// // 			return false;
// // 		}

// // 		//创建组件
// // 		var m_pIModeluInterface =(IModeluInterface *)CreateProc(m_Guid,m_dwVersion);
// // 		var (m_pIModeluInterface ==NULL) 
// // 		{
// // 			_sntprintf(m_szDescribe,CountArray(m_szDescribe),"调用函数“%s”生成对象失败",m_szCreateProc);
// // 			return false;
// // 		}
// // 	}
// // 	catch (LPCTSTR pszError)
// // 	{
// // 		_sntprintf(m_szDescribe,CountArray(m_szDescribe),"由于“%s”，组件创建失败",pszError);
// // 		return false;
// // 	}
// // 	catch (...)	
// // 	{ 
// // 		_sntprintf(m_szDescribe,CountArray(m_szDescribe),"组件创建函数“%s”产生未知异常错误，组件创建失败",m_szCreateProc);
// // 		return false;
// // 	}

// // 	return true;
// // }

// // //释放组件
// // template <typename IModeluInterface>
// // bool CTempldateHelper<IModeluInterface>::CloseInstance()
// // {
// // 	//设置变量
// // 	var m_szDescribe =0;

// // 	//销毁对象
// // 	var (m_pIModeluInterface! =NULL)
// // 	{
// // 		m_pIModeluInterface->Release();
// // 		var m_pIModeluInterface =NULL;
// // 	}

// // 	//释放 DLL
// // 	var (m_hDllInstance! =NULL)
// // 	{
// // 		AfxFreeLibrary(m_hDllInstance);
// // 		var m_hDllInstance =NULL;
// // 	}

// // 	return true;
// // }

// // //创建信息
// // template <typename IModeluInterface>
// // VOID CTempldateHelper<IModeluInterface>::SetModuleCreateInfo(LPCTSTR pszModuleDllName, LPCSTR pszCreateProc)
// // {
// // 	//设置信息
// // 	lstrcpynA(m_szCreateProc,pszCreateProc,CountArray(m_szCreateProc));
// // 	lstrcpyn(m_szModuleDllName,pszModuleDllName,CountArray(m_szModuleDllName));

// // 	return;
// // }

// // //////////////////////////////////////////////////////////////////////////////////
// // // CTempldateHelper<IModeluInterface> 内联函数

// // //获取描述
// // template <typename IModeluInterface>
// // inline LPCTSTR CTempldateHelper<IModeluInterface>::GetErrorDescribe() const
// // { 
// // 	return m_szDescribe; 
// // }

// // //指针重载
// // template <typename IModeluInterface>
// // inline IModeluInterface * CTempldateHelper<IModeluInterface>::operator->() const
// // { 
// // 	return GetInterface(); 
// // }

// // //获取接口
// // template <typename IModeluInterface>
// // inline IModeluInterface * CTempldateHelper<IModeluInterface>::GetInterface() const
// // { 
// // 	return m_pIModeluInterface; 
// // }

// //////////////////////////////////////////////////////////////////////////////////
// //组件辅助宏

// //组件创建函数
// function DECLARE_CREATE_MODULE(OBJECT_NAME)
// {
// /*
// */
// }

// //组件辅助类宏
// function DECLARE_MODULE_DYNAMIC(OBJECT_NAME)
// {
// /*
// */
// }

// //组件辅助类宏
// function DECLARE_MODULE_HELPER(OBJECT_NAME, MODULE_DLL_NAME, CREATE_FUNCTION_NAME)
// {
// /*
// */
// }

// //////////////////////////////////////////////////////////////////////////////////

// //#endif