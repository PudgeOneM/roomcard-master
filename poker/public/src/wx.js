
// var wxData = null

// function requestWxApi(dwOpenID, wKindID, wServerID, tableKey, successCall, failCall)
// {
//     var adr = hallAddress.replace('http://', '').split('/')[0]

//     var c = function(ret, responseText)
//     {
//         wxData = JSON.parse(responseText)

//         if(wxData.stat != 'ok')
//         {   
//             failCall?failCall():''
//             return 
//         }
//         sharePop.ewmImgUrl = wxData.data.qr
//         if(wxData.data.config)
//         {
//           wx.config({
//           debug: true,
//           appId: wxData.data.config.appId,
//           timestamp: wxData.data.config.timestamp,
//           nonceStr: wxData.data.config.nonceStr,
//           signature: wxData.data.config.signature,
//           jsApiList: [
//             'onMenuShareTimeline',
//             'onMenuShareAppMessage',
//             'onMenuShareQQ',
//             'onMenuShareWeibo',
//             'onMenuShareQZone',
//             'startRecord',
//             'stopRecord',
//             'onVoiceRecordEnd',
//             'playVoice',
//             'onVoicePlayEnd',
//             'pauseVoice',
//             'stopVoice',
//             'uploadVoice',
//             'downloadVoice',
//             'hideAllNonBaseMenuItem',
//             'showMenuItems',
//             'getLocation',
//             'hideOptionMenu'
//           ]
//         })
//         }

//         if ( !isRecordScene )
//         {
//           httpRequest('post', 'http://' + adr + '/api/wechat/game', 
//           function(ret, responseText)
//           {
//               var d = JSON.parse(responseText)
//               hallAddress = d.data.url.home
//               resultAddress = d.data.url.detail
//               rechargeAddress = d.data.url.recharge
//           },
//           'opid=' + dwOpenID + '&kid=' + wKindID + '&sid=' + wServerID + '&roomKey=' + tableKey, 
//           {withCredentials:true})
//         }

//         successCall?successCall():''
//     }

//     if ( isRecordScene )
//     {
//       httpRequest('post', 'http://' + adr + '/api/wechat/jssdk-replay', c, 'opid=' + dwOpenID + '&hcode=' + getCookie('hcode'), {withCredentials:true})
//     }
//     else
//     {
//       httpRequest('post', 'http://' + adr + '/api/wechat/jssdk', c, 'opid=' + dwOpenID + '&kid=' + wKindID + '&sid=' + wServerID + '&roomKey=' + tableKey, {withCredentials:true})
//     }
// }

// wx.ready(function () {

//   wx.hideAllNonBaseMenuItem()

//   wx.showMenuItems({
//       menuList: [
//       "menuItem:share:appMessage",
//       // "menuItem:openWithSafari",
//       // "menuItem:openWithQQBrowser",
//       "menuItem:share:timeline",
//       "menuItem:favorite"
//       ] 
//   })

//   wx.onMenuShareAppMessage({
//     title: wxData.data.share.title,
//     desc: wxData.data.share.desc,
//     link: wxData.data.share.link,
//     imgUrl: wxData.data.share.imgurl.replace(/\/0/, '/64'),
//     trigger: function (res) {
//       // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
//       // alert('用户点击发送给朋友');
//     },
//     success: function (res) {
//     },
//     cancel: function (res) {
//     },
//     fail: function (res) {
//     }
//   });

//   wx.onMenuShareTimeline({
//     title: wxData.data.share.title,
//     desc: wxData.data.share.desc,
//     link: wxData.data.share.link,
//     imgUrl: wxData.data.share.imgurl.replace(/\/0/, '/64'),
//     trigger: function (res) {
//       // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
//       // alert('用户点击发送给朋友');
//     },
//     success: function (res) {
//     },
//     cancel: function (res) {
//     },
//     fail: function (res) {
//     }
//   });

//   wx.getLocation({
//     success: function (res) 
//     {
//       // gameLog.log('成功获取地理位置')
//       var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
//       var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。        
      
//       var UpdateLocation = getObjWithStructName('CMD_GR_UpdateLocation')
//       UpdateLocation.dwUserID = selfdwUserID
//       UpdateLocation.szLatitude = latitude + ''
//       UpdateLocation.szLongitude = longitude + ''
//       socket.sendMessage(MDM_GR_LOGON, SUB_GR_UPDATE_LOCATION, UpdateLocation)
//     },
//     cancel: function (res) 
//     {
//       gameLog.log('用户拒绝授权获取地理位置')
//     }
//   })

//   //录像模式隐藏菜单
//   if ( isRecordScene )
//     wx.hideOptionMenu()

// });

// wx.error(function (res) {
//   alert(res.errMsg);
// });
