
var locationPop = 
{
    resp:'components/locationPop/res/',
    pop:null,
    getPreLoadRes:function()
    {
        var resp = locationPop.resp

        return [
            resp + 'locationPop.plist', 
            resp + 'locationPop.png'
        ]
    },
    onPreLoadRes:function()
    {
        var resp = locationPop.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'locationPop.plist', resp + 'locationPop.png')
    },
    onReStart:function()
    {  
        locationPop.pop = null
        //无论wx.config执行多少次 wx.ready只执行一次 所以要在这里主动调用 
        if(wxData)
        {
            wx.getLocation({
              success: function (res) 
              {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。        
                
                var UpdateLocation = getObjWithStructName('CMD_GR_UpdateLocation')
                UpdateLocation.dwUserID = selfdwUserID
                UpdateLocation.szLatitude = latitude + ''
                UpdateLocation.szLongitude = longitude + ''
                socket.sendMessage(MDM_GR_LOGON, SUB_GR_UPDATE_LOCATION, UpdateLocation)
              },
              cancel: function (res) 
              {
                gameLog.log('用户拒绝授权获取地理位置')
              }
          })
        }
    },
    getButton:function()
    {  
        var resp = locationPop.resp
        
        var button = new ccui.Button( resp + 'btn1.png', resp + 'btn2.png' )
        button.setTouchEnabled(true)
        button.addClickEventListener(function(button) {
            managerAudio.playEffect('publicRes/sound/click.mp3')
            if(!locationPop.pop)
            {
                var pop =  locationPop._getPop()
                pop.setPosition( cc.p( uiController.uiTop.getContentSize().width * 0.5, uiController.uiTop.getContentSize().height * 0.5) )
                uiController.uiTop.addChild(pop)
                locationPop.pop = pop
            }

            var GetLocation = getObjWithStructName('CMD_GR_C_GetLocation')
            GetLocation.szTableKey = tableKey
            socket.sendMessage(MDM_GR_USER, SUB_GR_USER_GET_LOCATION, GetLocation)
            locationPop.pop.setVisible(true)
        }.bind(this))

        return button
    },
    _getPop:function(uc_faceIdArray, rowNum, lineNum)
    {  
        var control = {}
        var pop  = cc.BuilderReader.load('components/locationPop/res/locationPop.ccbi', control)

        //////////
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                var isTouchInNode = cc.rectContainsPoint(rect, locationInNode)
                
                if (isTouchInNode) {
                    return false
                }
                
                return true
            },
            onTouchEnded: function (touch, event) { 
                locationPop.pop.setVisible(false)
            }
        })
        cc.eventManager.addListener(listener, pop)



        var l = cc.EventListener.create({
            event: cc.EventListener.CUSTOM,
            eventName: "locationResult",
            callback: function(event)
            {   

                var users = []
                for(var direction=0;direction<4;direction++)
                {
                    var showChairId = direction
                    var serverChairId = tableData.getServerChairIdWithShowChairId(showChairId)
                    var user = tableData.getUserWithChairId(serverChairId)
                    users[direction] = user
                    if(!user) 
                    {
                        control['userNode_'+direction].setVisible(false)
                    }
                    else
                    {
                        control['userNode_'+direction].setVisible(true)
                        control['name_'+direction].setString(user.szNickName.slice(0,8))
                        control['adr_'+direction].setString(user.szAddr)
                        control['ip_'+direction].setString('IP:'+user.szClientAddr)


                        var headIcon = new cc.Sprite('#headIcon.png')
                        var hnode = getCircleNodeWithSpr(headIcon)
                        var url = user.szHeadImageUrlPath
                        if(url)
                        { 
                            (function(headIcon, url)
                            {
                                cc.loader.loadImg(url, {isCrossOrigin : false}, function(err,img){
                                        var texture2d = new cc.Texture2D()
                                        texture2d.initWithElement(img)
                                        texture2d.handleLoadedTexture()

                                        var frame = new cc.SpriteFrame(texture2d, cc.rect(0, 0, texture2d.getContentSize().width, texture2d.getContentSize().height))
                                        headIcon.setSpriteFrame(frame)
                                })
                            }(headIcon, url))
                        }

                        control['headNode_'+direction].removeAllChildren()
                        control['headNode_'+direction].addChild(hnode)
                    }
                }

                for(var direction1=0;direction1<4;direction1++)
                {
                    for(var direction2=direction1+1;direction2<4;direction2++)
                    {
                        var user1 = users[direction1]
                        var user2 = users[direction2]
                        if( user1 && user1.szLatitude && user2 && user2.szLatitude)
                        {
                            control['distance_'+direction1+direction2].setVisible(true)

                            var distance = locationPop._getFlatternDistance(user1.szLatitude, user1.szLongitude,
                                user2.szLatitude, user2.szLongitude)

                            var str = ''
                            if(distance>1000)
                                str = '距' + Math.ceil(distance/100)/10 + '公里'
                            else
                                str = '距' + Math.ceil(distance) + '米'

                            control['distance_'+direction1+direction2].setString(str)
                        }
                        else
                        {

                            control['distance_'+direction1+direction2].setVisible(false)
                        }
                    }
                }
            }
        })
        cc.eventManager.addListener(l, 1)


        if(gameorientation == 'portrait')
            pop.setScale(0.8)
        return pop
    },
    _getFlatternDistance:function(lat1,lng1,lat2,lng2)
    {
        if(lat1==lat2 && lng1==lng2)
            return 0

        var EARTH_RADIUS = 6378137.0;    //单位M
        var PI = Math.PI;

        function getRad(d){
            return d*PI/180.0;
        }

        var f = getRad((lat1 + lat2)/2);
        var g = getRad((lat1 - lat2)/2);
        var l = getRad((lng1 - lng2)/2);
        
        var sg = Math.sin(g);
        var sl = Math.sin(l);
        var sf = Math.sin(f);
        
        var s,c,w,r,d,h1,h2;
        var a = EARTH_RADIUS;
        var fl = 1/298.257;
        
        sg = sg*sg;
        sl = sl*sl;
        sf = sf*sf;
        
        s = sg*(1-sl) + (1-sf)*sl;
        c = (1-sg)*(1-sl) + sf*sl;
        
        w = Math.atan(Math.sqrt(s/c));
        r = Math.sqrt(s*c)/w;
        d = 2*w*a;
        h1 = (3*r -1)/2/c;
        h2 = (3*r +1)/2/s;
        
        return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
    }
}