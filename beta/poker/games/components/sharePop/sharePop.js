var sharePop = 
{   
    ewmImgUrl:null,
    arrow:null,
    resp:'components/sharePop/res/',
    getPreLoadRes:function()
    {
        var resp = sharePop.resp

        return [
            resp + 'sharePop.plist', 
            resp + 'sharePop.png'
        ]
    },
    onPreLoadRes:function()
    {
        var resp = sharePop.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'sharePop.plist', resp + 'sharePop.png')
    },
    onReStart:function()
    {  
        sharePop.arrow = null
    },
    getPop:function(pos, parent)
    {  
        var node  = cc.BuilderReader.load('components/sharePop/res/sharePop.ccbi', sharePop)
        sharePop.linkLabel.setString(wxData.data.share.title +  '\n' + wxData.data.share.desc)    
        sharePop._showArrow()

        var url = tableData.getUserWithUserId(selfdwUserID).szHeadImageUrlPath
        cc.loader.loadImg(url, {isCrossOrigin : false}, function(err,img){
                var texture2d = new cc.Texture2D()
                texture2d.initWithElement(img)
                texture2d.handleLoadedTexture()

                var frame = new cc.SpriteFrame(texture2d, cc.rect(0, 0, texture2d.getContentSize().width, texture2d.getContentSize().height))
                sharePop.headIcon.setSpriteFrame(frame)
        })

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true
                }
                return false
            },
            onTouchEnded: function (touch, event) {
                node.removeFromParent()
                sharePop.arrow.removeFromParent()
                sharePop.arrow = null
            }
        })
        cc.eventManager.addListener(listener, sharePop.closeIcon)

        ///
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true
                }
                node.removeFromParent()
                sharePop.arrow.removeFromParent()
                sharePop.arrow = null
                return false
            },
            onTouchEnded: function (touch, event) {
                // node.removeFromParent()
            }
        })
        cc.eventManager.addListener(listener, node)


        ///
        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if(sharePop.linkNode.isVisible()) return false
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true
                }
                return false
            },
            onTouchEnded: function (touch, event) {
                sharePop.linkNode.setVisible(true)
                sharePop._showArrow()
                sharePop.ewmNode.setVisible(false)
                sharePop.linkBtn.setSpriteFrame('sp_shareBtn1_2.png') 
                sharePop.ewmBtn.setSpriteFrame('sp_shareBtn2_0.png') 
            }
        })
        cc.eventManager.addListener(listener, sharePop.linkBtn)


        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                if(!sharePop.linkNode.isVisible()) return false
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height)
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true
                }
                return false
            },
            onTouchEnded: function (touch, event) {
                sharePop.linkNode.setVisible(false)
                sharePop._hideArrow()
                sharePop.ewmNode.setVisible(true)
                sharePop.linkBtn.setSpriteFrame('sp_shareBtn1_0.png') 
                sharePop.ewmBtn.setSpriteFrame('sp_shareBtn2_2.png') 

                function showEwmImg(url)
                {
                    cc.loader.loadImg(url, {isCrossOrigin : false}, function(err,img){
                            var texture2d = new cc.Texture2D()
                            texture2d.initWithElement(img)
                            texture2d.handleLoadedTexture()

                            var frame = new cc.SpriteFrame(texture2d, cc.rect(0, 0, texture2d.getContentSize().width, texture2d.getContentSize().height))
                            sharePop.ewmImg.setSpriteFrame(frame)
                            sharePop.ewmImg.setScale(225/texture2d.getContentSize().width)
                            cc.spriteFrameCache.addSpriteFrame(frame, "sp_sharePopEWM")
                    })
                }

                var f = cc.spriteFrameCache.getSpriteFrame('sp_sharePopEWM')
                if(f)
                {
                    sharePop.ewmImg.setSpriteFrame(f)
                    sharePop.ewmImg.setScale(225/f.getTexture().getContentSize().width)
                }
                else
                {
                    if(sharePop.ewmImgUrl)
                    {
                        showEwmImg(sharePop.ewmImgUrl )
                    }
                    else
                    {

                        sharePop.ewmImgUrl = tableData.getUserWithUserId(selfdwUserID).szHeadImageUrlPath.replace(/\/0/, '/64')
                        showEwmImg(sharePop.ewmImgUrl )
                        
                    }
                }


            }
        })
        cc.eventManager.addListener(listener, sharePop.ewmBtn)

        if(gameorientation == 'landscape')
            node.setScale(0.8)
        return node
    },
    _showArrow:function()
    {
        if(!sharePop.arrow)
        {
            sharePop.arrow = actionFactory.getSprWithAnimate('sp_arrow_')
            // var t = sharePop.arrow.onExit
            // sharePop.arrow.onExit = function()
            // {
            //     t.apply(sharePop.arrow)
            //     sharePop.arrow = null
            // }
            
            uiController.uiTop.addChild(sharePop.arrow)
            if(gameorientation == 'landscape')
            {
                var pos = cc.p(uiController.uiTop.getContentSize().width - 50, 70)
                sharePop.arrow.setPosition( pos ) 
                sharePop.arrow.setRotation(90)
            }
            else
            {
                var pos = cc.p(uiController.uiTop.getContentSize().width - 50, uiController.uiTop.getContentSize().height - 70)
                sharePop.arrow.setPosition( pos ) 
            }
        }
        sharePop.arrow.setVisible(true)

    },
    _hideArrow:function()
    {
        sharePop.arrow.setVisible(false)
    }

}