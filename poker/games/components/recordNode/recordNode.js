var recordNode = 
{
	resp:'components/recordNode/res/',
	speedValue:[0.5, 1, 2, 4],
	preLoadRes:
    [	
    	'components/recordNode/res/recordRes.plist',
    	'components/recordNode/res/recordRes.png',
    ],
	onPreLoadRes:function()
	{
		cc.spriteFrameCache.addSpriteFrames(this.resp + 'recordRes.plist', this.resp + 'recordRes.png')
	},
	onReStart:function()
	{
	},
	init:function()
	{	
		this.playIndex = 0
		this.speed = 1
		this.isPlaying = false
	},
	openPop:function(topNode)
	{
		if ( this.pop )
			this.pop.removeFromParent()

		this.init()
		
		var self = this
		var topSize = topNode.getContentSize()

		this.pop = new cc.Node()
		this.pop.setContentSize(topSize)
        topNode.addChild(this.pop, 100)

        var l = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget()
                var locationInNode = target.convertToNodeSpace(touch.getLocation())
                var rect = cc.rect(0, 0, target.getContentSize().width, target.getContentSize().height)
                return cc.rectContainsPoint(rect, locationInNode)
            },
            onTouchEnded: function (touch, event) {
            }
        })
        cc.eventManager.addListener(l, this.pop)

        var bg = new cc.Sprite("#record_bg.png")
        //bg.setPosition( cc.p( topSize.width * 0.5, topSize.height * 0.5) )
        bg.setPosition( cc.p( topSize.width * 0.5, topSize.height * 0.2) )
        bg.setScale(0.8)
        this.pop.addChild(bg)

        //停止按钮
        this.stopBtn = new ccui.Button('record_stop.png', '', '', ccui.Widget.PLIST_TEXTURE)
		this.stopBtn.setPosition(185, 55)
		this.stopBtn.setVisible(true)
		this.stopBtn.addClickEventListener(function(button){ self.playStop() }.bind(this))
		bg.addChild(this.stopBtn)

		//播放按钮
		this.playBtn = new ccui.Button('record_play.png', '', '', ccui.Widget.PLIST_TEXTURE)
		this.playBtn.setPosition(185, 55)
		this.playBtn.setVisible(false)
		this.playBtn.addClickEventListener(function(button){ self.playContinue() }.bind(this))
		bg.addChild(this.playBtn)

		//减速按钮
		this.downBtn = new ccui.Button('record_down.png', '', '', ccui.Widget.PLIST_TEXTURE)
		this.downBtn.setPosition(72, 55)
		this.downBtn.addClickEventListener(function(button){ self.playSpeedDown() }.bind(this))
		bg.addChild(this.downBtn)
		
		//加速按钮
		this.upBtn = new ccui.Button('record_up.png', '', '', ccui.Widget.PLIST_TEXTURE)
		this.upBtn.setPosition(295, 55)
		this.upBtn.addClickEventListener(function(button){ self.playSpeedUp() }.bind(this))
		bg.addChild(this.upBtn)

		//返回按钮
		this.backBtn = new ccui.Button('record_back.png', '', '', ccui.Widget.PLIST_TEXTURE)
		this.backBtn.setPosition(398, 55)
		this.backBtn.addClickEventListener(function(button){ self.plyaBack() }.bind(this))
		bg.addChild(this.backBtn)

		//速度标记
		this.speedFlag = new cc.Sprite("#record_speed1.png")
		this.speedFlag.setPosition(bg.width / 2, bg.height + 10)
		bg.addChild(this.speedFlag)
	},
	//-----------------------------------------------
	playStop:function()
	{
		this.playBtn.setVisible(true) 
		this.stopBtn.setVisible(false) 
		this.isPlaying = false
	},
	playContinue:function()
	{
		this.playBtn.setVisible(false) 
		this.stopBtn.setVisible(true) 

		this.isPlaying = true
		this.playing()
	},	
	playSpeedDown:function()
	{
		this.setSpeed(this.speed - 1)
	},
	playSpeedUp:function()
	{
		this.setSpeed(this.speed + 1)
	},
	plyaBack:function()
	{
		//goHref(appendRefreshtime(hallAddress))
		window.history.back()
	},

	//-----------------------------------------------
	setSpeed:function(speed)
	{
		if ( speed < 0 || speed >= this.speedValue.length )
			return

		this.speed = speed

		this.speedFlag.setSpriteFrame("record_speed" + speed + ".png")

    	cc.director.getScheduler().setTimeScale(this.speedValue[speed]); //实现加速效果
	},

	//-----------------------------------------------
	playStart:function()
	{
		if ( recordData.getRecordLength() == 0 )
			return

		//子游戏初始化
		var event = new cc.EventCustom("recordPlayStart")
        cc.eventManager.dispatchEvent(event)

		this.playIndex = 0
		this.isPlaying = true
		cocos.clearTimeout(this.playing)

		this.playing()
	},
	playing:function()
	{
		var self = this

		if ( !this.isPlaying || this.playIndex >= recordData.getRecordLength() )
			return

		var data = recordData.getRecordData(this.playIndex)
		cmdListener.gameListener(data)
		this.playIndex++

		if ( this.playIndex < recordData.getRecordLength() )
		{
			var playInterval = this.getPlayInterval(data.wSubCmdID)
			cocos.setTimeout(function(){ self.playing() }, playInterval)
		}
		else
		{
			this.isPlaying = false
		}
	},

	//----------------------【有需求请重写】----------------------
	//获取间隔
	getPlayInterval:function(subId)
	{
		switch(subId)
		{
			case SUB_S_GAME_START: return 3000
			case SUB_S_OPERATE_RESULT: return 2000
		}

		//这个是默认时间
		return 1000;
	},
}