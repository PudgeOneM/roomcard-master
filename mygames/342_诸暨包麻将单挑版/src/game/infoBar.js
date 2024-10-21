
var infoBar = 
{
    resp:'components/infoBar/res/',
    getPreLoadRes:function()
    {
        var resp = infoBar.resp

        return [
            resp + 'infoBar_0.plist', 
            resp + 'infoBar_0.png'
        ]
    },
    onPreLoadRes:function()
    {
        var resp = infoBar.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'infoBar_0.plist', resp + 'infoBar_0.png')
    },
    /*
        test:文本
        moveTimer:单程移动时间
        desTroytimer:多长时间后销毁  单位秒
     */
    create:function(text, moveTimer, desTroytimer)
    {
        var clipNode = new cc.ClippingNode();
        uiController.uiTop.addChild(clipNode);

        if(cc.sys.isMobile)
        {
            clipNode.x = cc.director.getVisibleSize().height/2;
            clipNode.y = cc.director.getVisibleSize().width-20;
        }
        else
        {
            clipNode.x = cc.director.getVisibleSize().width/2;
            clipNode.y = cc.director.getVisibleSize().height-20;
        }


        var bar = new cc.Sprite("#infoBar_bar.png");  //裁剪模板
        clipNode.addChild(bar);

        var drawNode=new cc.DrawNode();
        drawNode.drawRect(cc.p(-bar.width/2, -bar.height/2), cc.p(bar.width/2, bar.height/2));
        clipNode.stencil = drawNode;




        var txt = new cc.LabelTTF(text, "Helvetica-bold", 32);
        txt.color = cc.color(221, 212, 180);
        txt.setAnchorPoint(cc.p(0,0.5));
        txt.x = bar.width;
        clipNode.addChild(txt);

        var moveTo = cc.moveTo(moveTimer, cc.p(-(bar.width+txt.width), 0));
        var callback = cc.callFunc(function()
        {
            txt.x = bar.width;
        }, this);
        txt.runAction(cc.sequence(moveTo, callback).repeatForever());

        setTimeout(function()
        {
            clipNode.removeFromParent();
        }, desTroytimer*1000)
    },
}












