var mahJongRes = 
{
	resp:'components/mahJongRes/res/',
    preLoadRes:
    [
    'components/mahJongRes/res/amtOperate_0.plist', 
    'components/mahJongRes/res/amtOperate_0.png',
    'components/mahJongRes/res/amtOperate_1.plist', 
    'components/mahJongRes/res/amtOperate_1.png',
     'components/mahJongRes/res/amtOperate_2.plist', 
    'components/mahJongRes/res/amtOperate_2.png',
    'components/mahJongRes/res/mahJongRes_0.plist', 
    'components/mahJongRes/res/mahJongRes_0.png'
    ],
    onPreLoadRes:function()
    {
        var resp = mahJongRes.resp
        cc.spriteFrameCache.addSpriteFrames(resp + 'amtOperate_0.plist', resp + 'amtOperate_0.png')
 		cc.spriteFrameCache.addSpriteFrames(resp + 'amtOperate_1.plist', resp + 'amtOperate_1.png')
 		cc.spriteFrameCache.addSpriteFrames(resp + 'amtOperate_2.plist', resp + 'amtOperate_2.png')
 		cc.spriteFrameCache.addSpriteFrames(resp + 'mahJongRes_0.plist', resp + 'mahJongRes_0.png')
    },
}