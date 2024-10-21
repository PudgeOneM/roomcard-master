

function clone(obj){  
    var o;  
    switch(typeof obj){  
    case 'undefined': break;  
    case 'string'   : o = obj + '';break;  
    case 'number'   : o = obj - 0;break;  
    case 'boolean'  : o = obj;break;  
    case 'object'   :  
        if(obj === null){  
            o = null;  
        }else{  
            if(obj instanceof Array){  
                o = [];  
                for(var i = 0, len = obj.length; i < len; i++){  
                    o.push(clone(obj[i]));  
                }  
            }else{  
                o = {};  
                for(var k in obj){  
                    o[k] = clone(obj[k]);  
                }  
            }  
        }  
        break;  
    default:          
        o = obj;break;  
    }  
    return o;     
}  

function isParent(obj, parentObj)
{
    for(var i in parentObj)
    {
        if(parentObj[i] === obj)
            return true
    }
    return false
}

function xToString(obj, maxLength, ignoreStrArray)
{
    var s = ''
    if (typeof(obj) == 'undefined' || obj==null);
    else if(typeof(obj) == "string")
        s = obj
    else if (typeof(obj) == "boolean")
        if(obj === true)
            s ='true'
        else
            s = 'false'
    else if (typeof(obj) == "number")
        s = obj.toString()
    else if (typeof(obj) == "object")
    {
        if (obj instanceof Array == true)
        {
            var str = ''
            for (var i=0;i<obj.length;i++)
            {    
                if (i==0) 
                {
                    str = str + xToString(obj[i], maxLength, ignoreStrArray)
                }
                else
                {
                    str = str + ',' + xToString(obj[i], maxLength, ignoreStrArray)
                }
            }   
            //str = str + ']'
            s = str
        }
        else
        {
            s = JSON.stringify(obj)  //json对象转换成json对符串  这个函数只适用于json对象，转化别的类型会出错 
        }
    }

    for(var i in ignoreStrArray)
    {   
        var reg = new RegExp(ignoreStrArray[i],'g')
        s = s.replace(reg, '')
    }
    if(maxLength && s.length>maxLength)
        return s.slice(0, maxLength)
    else
        return s

}




// function stringToUint(string, asciiOrucs2) {
//     var charList = string.split(''),
//         uintArray = []
//     for (var i = 0; i < charList.length; i++) {
//         uintArray.push(charList[i].charCodeAt(0))
//     }
//     if(asciiOrucs2)
//         return new Uint8Array(uintArray)
//     else
//         return new Uint16Array(uintArray)
// }

// function uintToString(uintArray) {
//     var string = String.fromCharCode.apply(null, uintArray)
//     return string
// }



// [2,2,3]->[ [[], []], [[], []], [[], []] ]
function createMultiArray(sizeArray, defaultValue)
{
   function createArray(length, subMember)
   {    
        var a = new Array(length)
        for(var i=0;i<length;i++)
        {
            a[i] = clone(subMember)
        }
        return a
   }

   var array = defaultValue
   for(var i=sizeArray.length-1;i>=0;i--)
   {
        array = createArray(sizeArray[i], array)
   }
    
   return array
}

//[2,2,3]
// 0 -> 1   -> [1,1,1] ->[0,0,0]
// 1 -> 2   -> [1,1,2] ->[0,0,1]
// 2 -> 3   -> [1,1,3]
// 3 -> 4   -> [1,2,1]
// 4 -> 5   -> [1,2,2]
// 5 -> 6   -> [1,2,3]
// 6 -> 7   -> [2,1,1]
// 7 -> 8   -> [2,1,2]
// 8 -> 9   -> [2,1,3]
// 9 -> 10   -> [2,2,1]
// 10-> 11   -> [2,2,2]
// 11-> 12   -> [2,2,3] -> [1,1,2]
function idx2IdxArray(idx, sizeArray)
{
    idx = idx + 1
    var idxArray = []
    for(var i=0;i<sizeArray.length;i++)
        idxArray[i] = 0

    for(var i=sizeArray.length-1;i>=0;i--)
    {   
        idx = Math.ceil(idx)
        idxArray[i] = (idx%sizeArray[i]==0?sizeArray[i]:idx%sizeArray[i]) - 1
        idx =  idx/sizeArray[i]
        if(idx<=1)
        {
            break
        }
    }
    return idxArray
}

function getWithIdxArray(idxArray, array)
{
    var a = array
    for(var i=0;i<idxArray.length;i++)
        a = a[ idxArray[i] ]

    return a
}

//js 没指针的 赋值只能用eval了
function setWithIdxArray(idxArray, array, value)
{
    var expression = 'array'
    for(var i=0;i<idxArray.length;i++)
        expression = expression + '[idxArray[' + i + ']]'
    expression = expression + '=value'
    eval(expression)
}

function getStrWithSeconds(seconds)
{
    var h = Math.floor(seconds/3600) 
    var m = Math.floor(seconds%3600/60) 
    var s = seconds%60

    h = h<10?'0'+h:h
    m = m<10?'0'+m:m
    s = s<10?'0'+s:s

    return h + ':' + m + ':' + s
}

function max(num1, num2)
{
    return Math.max(num1, num2)
}

function getRandNum(minNum, maxNum)
{
    var r = Math.ceil(Math.random()*100)%(maxNum-minNum+1) + minNum
    return r
}

function getDiffer(parent, child)
{
    var differ = []
    for(var i=0;i<parent.length;i++)
    {
        var p = parent[i]
        var isInChild = false
        for(var ii=0;ii<child.length;ii++)
        {
            if(p==child[ii])
            {
                isInChild = true
                break
            }
        }

        if(!isInChild)
           differ[differ.length] = p 
    }
    return differ
}

function combination(totalPool, pickNum)
{
    var pickedPartList = []
    var pickedPart = []

    var fun = function(start, picked, _totalNum, _pickNum)
    {
        if(picked == _pickNum) 
        {
            pickedPartList[pickedPartList.length] = clone(pickedPart)
            return
        }
        //选取第picked个数时，最大totalPool下标， 例如第picked=0个数时 max = 4 - 2 + 0,
        var max = _totalNum - _pickNum + picked;    
        for (var i = start; i <= max; i++) 
        {
            pickedPart[picked] = totalPool[i]
            fun(i+1, picked+1, totalPool.length, pickNum)
        }
    }
    fun(0, 0, totalPool.length, pickNum)

    return pickedPartList
}

// function combination(totalNum, pickNum)
// {
//     var pickedPartIdxsList = []
//     var pickedPartIdxs = []

//     var fun = function(start, picked, _totalNum, _pickNum)
//     {
//         if(picked == _pickNum) 
//         {
//             pickedPartIdxsList[pickedPartIdxsList.length] = clone(pickedPartIdxs)
//             return
//         }
//         //选取第x个数时，最大pickPool下标， 例如第一个数时 max = 4 - 2 + 0,
//         var max = _totalNum - _pickNum + picked;    
//         for (var i = start; i <= max; i++) 
//         {
//             pickedPartIdxs[picked] = i
//             fun(i+1, picked+1, totalNum, pickNum)
//         }
//     }
//     fun(0, 0, totalNum, pickNum)

//     return pickedPartIdxsList
// }
