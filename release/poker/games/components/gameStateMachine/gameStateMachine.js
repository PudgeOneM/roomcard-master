
//三种状态的状态机
var gameStateMachine = 
{
    machine:null,
    playStateQueue:[],
    reset:function()
    {
        gameStateMachine.machine.current = 'none'
        gameStateMachine.machine.transition = null
        gameStateMachine.playStateQueue = []
    },
    initMachine:function(callbacks)
    {   
        if(gameStateMachine.machine)
            return gameStateMachine.machine

        var machine =  StateMachine.create(
        {
            events: [
              { name: 'none2Free', from: 'none',   to: 'free'  },
              { name: 'none2Score', from: 'none', to: 'score' },
              { name: 'none2Count', from: 'none', to: 'count' },
              { name: 'free2Score', from: 'free', to: 'score'    },
              { name: 'score2Count',  from: 'score',    to: 'count' },
              { name: 'count2free', from: 'count',    to: 'free'  },
            ],
            callbacks:callbacks
        })

        gameStateMachine.machine = machine
    },
    goState:function(from, to, args)  
    {
        from = from || gameStateMachine.machine.current //none free score count hide
        gameLog.log('goState:' + from + '-' + to + '-' +  !gameStateMachine.machine.transition)

        if(gameStateMachine.machine.transition)
        {
            gameStateMachine._addState(to, args)
            return;
        }

        var t = 
        {
            nonefree:function(args)
            {
                gameStateMachine.machine.none2Free(args)
            },
            nonescore:function(args)
            {
                gameStateMachine.machine.none2Score(args)
            },
            nonecount:function(args)
            {
                gameStateMachine.machine.none2Count(args)
            },
            freescore:function(args)
            {
                gameStateMachine.machine.free2Score(args)
                var oldcall = gameStateMachine.machine.transition
                gameStateMachine.machine.transition = function()
                {
                    window.setTimeout(function()
                        {
                            gameStateMachine._popState() 
                        })  
                    return oldcall()
                }
            },
            scorecount:function(args)
            {
                gameStateMachine.machine.score2Count(args)
                var oldcall = gameStateMachine.machine.transition
                gameStateMachine.machine.transition = function()
                {
                    window.setTimeout(function()
                        {
                            gameStateMachine._popState() 
                        })  
                    return oldcall()
                }
            },
            countfree:function(args)
            {
                gameStateMachine.machine.count2free(args)
                var oldcall = gameStateMachine.machine.transition
                gameStateMachine.machine.transition = function()
                {
                    window.setTimeout(function()
                        {
                            gameStateMachine._popState() 
                        })  
                    return oldcall()
                }
            },
            freecount:function(args)
            {   
                gameStateMachine.goState('free','score', args)
                gameStateMachine.goState('score','count', args)
            },
            scorefree:function(args)
            {
              gameStateMachine.goState('score','count', args)
              gameStateMachine.goState('count','free', args)
            },
            countscore:function(args)
            {
               gameStateMachine.goState('count','free', args)
               gameStateMachine.goState('free','score', args)
            },
        }

        var f = t[from+to] 
        if(f)
            f(args || {})
        else
            gameStateMachine._popState() 
        
    },
    _addState:function(state, args)
    {
        var s = {}
        s.state = state
        s.args = args
        gameStateMachine.playStateQueue[gameStateMachine.playStateQueue.length] = s
    },
    _popState:function()
    {
        var s = gameStateMachine.playStateQueue[0] 
        if(s)
        {   
            gameStateMachine.playStateQueue = gameStateMachine.playStateQueue.slice(1)
            gameStateMachine.goState(null, s.state, s.args)
        }
    },

}



