var mahJongRes = 
{
	resp:'components/mahJongRes/res/',
    getPreLoadRes:function()
    {
        var resp = mahJongRes.resp

        return [
            resp + 'amtOperate_0.plist', 
            resp + 'amtOperate_0.png',
            resp + 'amtOperate_1.plist', 
            resp + 'amtOperate_1.png',
            resp + 'amtOperate_2.plist', 
            resp + 'amtOperate_2.png',
            resp + 'mahJongRes_0.plist', 
            resp + 'mahJongRes_0.png'
        ]
    },
    onPreLoadRes:function()
    {
        var resp = mahJongRes.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'amtOperate_0.plist', resp + 'amtOperate_0.png')
 		cc.spriteFrameCache.addSpriteFrames(resp + 'amtOperate_1.plist', resp + 'amtOperate_1.png')
 		cc.spriteFrameCache.addSpriteFrames(resp + 'amtOperate_2.plist', resp + 'amtOperate_2.png')
 		cc.spriteFrameCache.addSpriteFrames(resp + 'mahJongRes_0.plist', resp + 'mahJongRes_0.png')
    },
}