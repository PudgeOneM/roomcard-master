


gameLogic.getTipsArrayForFirstOut = function(cardDatas)
{
    var cardsType = {typeLevel:0, typeScores:0, typeKind:0}
    var tipsArray =  gameLogic.getTipsArray(cardsType, cardLogic.sortWithNum(cardDatas), cmdBaseWorker.cbMagicCardData)

    return tipsArray
}

gameLogic.num2Scores  = 
[
    0,
    12,
    13,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    14,
    15
]

//4正4副8王为16星（10奖） > 4正3副为14星（8奖）> 4副三正为14星(8奖) > 4正两副为12星（6奖）> 3正3副为12星（6奖）> 4副2正为12星（6奖）
//> 4正1副为10星（4奖）> 4副1正为10星（4奖）> 3正2副为8星（2奖）> 
//2正3副为8星（2奖）> 3正1副为7星（1奖）> 2正2副为7星（1奖）> 1正3副为7星（1奖）
cardsParserConf[5] = 
{
    id:5,
    name:'王炸',
    _78Num:0,
    _79Num:0,
    getType:function(typeScores)
    {
        if(typeScores>1 || typeScores < 1)
            return false
        else 
            return {typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:typeScores,typeKind:this.typeKind}
    },
    parser:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
    {
        var l = c_sortedCardDatasExcludeLazi.length + c_sortedCardDatasOfLaizi.length
        var is = l == this._78Num + this._79Num
        if(!is)
            return false

        var cardDatas = this.getCardDatasIfHas(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
        if(cardDatas)
            return {id:this.id, cardDatas:cardDatas, typeIdx:this.typeIdx, typeLevel:this.typeLevel, typeScores:1,typeKind:this.typeKind} 
        
        return false
    },  
    getCardDatasIfHas:function(c_sortedCardDatasExcludeLazi, c_sortedCardDatasOfLaizi)
    {
        var t = c_sortedCardDatasExcludeLazi.concat(c_sortedCardDatasOfLaizi)
        var _78Num = 0
        var _79Num = 0
        for(var i=0;i<t.length;i++)
        {
            if(t[i] == 78)
                _78Num = _78Num + 1

            if(t[i] == 79)
                _79Num = _79Num + 1
        }

        if(_78Num<this._78Num || _79Num<this._79Num)
            return false

        var cardDatas = []
        for(var i=0;i<this._78Num+this._79Num;i++)
        {
            if(i<this._79Num)
               cardDatas[i] = 79 
           else
               cardDatas[i] = 78 
        }
        return cardDatas
    }
}


gameLogic.initCardsParser(
[ 
    [
        {id:1, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15},
        {id:2, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15}, 
        {id:3, minLen:1, maxLen:1, minCardNum:1, maxCardNum:15},
    ], 
    //任意四张、五张或六张同样的牌称为炸弹；
    [
        {id:4, length:4}, //level2
    ],
    [
        {id:4, length:5},
    ], 
    [
        {id:4, length:6},
    ], 

    //任意七张或七张以上同样的牌，或4个以上的王（不分大小王，如2个大王2个小王）都为星，
    //普通牌：7个同张为7星得1奖，8个为8星2奖，9个为9星得3奖，最多16个为16星得10奖。
    //7星 
    [
        {id:4, length:7},  //level5
    ],
    //3正1副为7星（1奖）> 2正2副为7星（1奖）> 1正3副为7星（1奖）
    [
        {id:5, _78Num:3, _79Num:1},  //level6
    ],
    [
        {id:5, _78Num:2, _79Num:2},
    ],
    [
        {id:5, _78Num:1, _79Num:3},
    ],
    //8星 
    [
        {id:4, length:8},  //level9
    ], 
    //3正2副为8星（2奖）> 2正3副为8星（2奖）>4正为8星（2奖）>4副为8星（2将）
    [
        {id:5, _78Num:4, _79Num:0},  //level10
    ],
    [
        {id:5, _78Num:0, _79Num:4},
    ],
    [
        {id:5, _78Num:3, _79Num:2},
    ],
    [
        {id:5, _78Num:2, _79Num:3},
    ],
    //9星 
    [
        {id:4, length:9},  //level14
    ], 
    [
        {id:5, _78Num:3, _79Num:3},
    ],
    //10星 
    [
        {id:4, length:10},  //level16
    ], 
    //4正1副为10星（4奖）> 4副1正为10星（4奖）
    [
        {id:5, _78Num:4, _79Num:1},  //level17
    ],
    [
        {id:5, _78Num:1, _79Num:4},
    ],
    //11星 
    [
        {id:4, length:11},  //level19
    ], 
    //12星 
    [
        {id:4, length:12},  //level20
    ],
    //4正两副为12星（6奖）> 3正3副为12星（6奖）> 4副2正为12星（6奖）
    [
        {id:5, _78Num:4, _79Num:2},  //level21
    ],
    [
        {id:5, _78Num:2, _79Num:4},
    ],
    //13星 
    [
        {id:4, length:13},  //level23
    ], 
    //14星 
    [
        {id:4, length:14},  //level24
    ], 
    //4正3副为14星（8奖）> 4副三正为14星(8奖)
    [
        {id:5, _78Num:4, _79Num:3},  //level25
    ],
    [
        {id:5, _78Num:3, _79Num:4},
    ],
    //15星
    [
        {id:4, length:15},  //level27
    ], 
    //16星
    [
        {id:4, length:16},  //level28
    ],
    //4正4副8王为16星（10奖） 
    [
        {id:5, _78Num:4, _79Num:4}, //level29
    ],
])




