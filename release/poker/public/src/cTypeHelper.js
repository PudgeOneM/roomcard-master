
var WORD =
{   
    isBaseType:true,
    size:2,
    bufferType:'Uint16'
}

var bool =
{   
    isBaseType:true,
    size:1,
    bufferType:'Uint8'
}

var UCHAR =
{
    isBaseType:true,
    size:1,
    bufferType:'Uint8',
    setBuffer:function(dataView, pos, v)
    {
        dataView['set' + this.bufferType](pos, v.charCodeAt(), true) 
    },
    getBuffer:function(dataView, pos)
    {
        var v = dataView['get' + this.bufferType](pos, true) 
        v = String.fromCharCode.apply(null, [v])
        return v
    }
} 

var TCHAR =
{
    isBaseType:true,
    size:2,
    bufferType:'Uint16',
    setBuffer:function(dataView, pos, v)
    {
        dataView['set' + this.bufferType](pos, v.charCodeAt(), true) 
    },
    getBuffer:function(dataView, pos)
    {
        var v = dataView['get' + this.bufferType](pos, true) 
        v = String.fromCharCode.apply(null, [v])
        return v
    }
} 

var UINT =
{   
    isBaseType:true,
    size:4,
    bufferType:'Uint32'
}

var BYTE =
{   
    isBaseType:true,
    size:1,
    bufferType:'Uint8'
}

var DWORD =
{   
    isBaseType:true,
    size:4,
    bufferType:'Uint32'
}

var DOUBLE =
{   
    isBaseType:true,
    size:8,
    bufferType:'Float64'
}

var int =
{   
    isBaseType:true,
    size:4,
    bufferType:'Int32',
    // setBuffer:function(dataView, pos, v)
    // {   
    //     var part1 = v>0?0x00000000:0x80000000
    //     var part2 = Math.abs(v)

    //     dataView.setInt32(pos, part2, true)
    //     dataView.setInt32(pos+4, part1, true)
    // },
    // getBuffer:function(dataView, pos)
    // {
    //     var v = dataView.getInt32(pos, true)
    //     v = dataView.getInt32(pos+4, true)>0?-Math.abs(v):Math.abs(v)
    //     return v
    // }
}

var LONG =
{   
    isBaseType:true,
    size:4,
    bufferType:'Int32',
    // setBuffer:function(dataView, pos, v)
    // {   
    //     var part1 = v>0?0x00000000:0x80000000
    //     var part2 = Math.abs(v)

    //     dataView.setInt32(pos, part2, true)
    //     dataView.setInt32(pos+4, part1, true)
    // },
    // getBuffer:function(dataView, pos)
    // {
    //     var v = dataView.getInt32(pos, true)
    //     v = dataView.getInt32(pos+4, true)>0?-Math.abs(v):Math.abs(v)
    //     return v
    // }
}

//js不支持int64 加减乘除位操作等都不支持
//如果服务器传来的是64位 只取32位；
var LONGLONG = 
{   
    isBaseType:true,
    size:8,
    bufferType:'Int64',
    setBuffer:function(dataView, pos, v)
    {   
        var part1 = v>0?0x00000000:0x80000000
        var part2 = Math.abs(v)

        dataView.setInt32(pos, part2, true)
        dataView.setInt32(pos+4, part1, true)
    },
    getBuffer:function(dataView, pos)
    {
        var v = dataView.getInt32(pos, true)
        v = dataView.getInt32(pos+4, true)==0?Math.abs(v):-Math.abs(v)
        return v
    }
}

var SCORE = 
{   
    isBaseType:true,
    size:8,
    bufferType:'Int64',
    setBuffer:function(dataView, pos, v)
    {   
        var part1 = v>0?0x00000000:0x80000000
        var part2 = Math.abs(v)

        dataView.setInt32(pos, part2, true)
        dataView.setInt32(pos+4, part1, true)
    },
    getBuffer:function(dataView, pos)
    {
        var v = dataView.getInt32(pos, true)
        v = dataView.getInt32(pos+4, true)==0?Math.abs(v):-Math.abs(v)
        return v
    }
}

//参数是类型对象
var sizeof = function(type)
{   
    return type&&type.isBaseType?type.size:getStructSize(type)
}


//参数是类型对象
function getStructSize(type)
{     
    try
    {   
        var size = 0

        var struct = type.structName?eval(type.structName):type

        for(var i=0;i<struct.length;i++)
        {
            var subStruct = struct[i]
            var sizet = sizeof(eval(subStruct[0]))

            for(var j=2;j<subStruct.length;j++)
            {
                sizet = sizet * subStruct[j]
            }
            size = size + sizet
        }
        return  size
    }
    catch(e)
    {   
        return  'getStructSize fail' 
    }   
}

function getObjWithStructName(structName)
{
    try
    {   
        var struct = eval(structName)
        var obj = {}
        for(var i=0;i<struct.length;i++)
        {
            var subStruct = struct[i]
            var t = eval(subStruct[0])

            var sizeArray = []
            for(var j=2;j<subStruct.length;j++)
            {   
                sizeArray[sizeArray.length] = subStruct[j]
            }

            var defaultValue 
            if(t.isBaseType)
            {   
                defaultValue = null
            }
            else
            {   
                defaultValue = getObjWithStructName(subStruct[0])
            }
            obj[subStruct[1]] = sizeArray.length==0?defaultValue:createMultiArray(sizeArray, defaultValue)
        }

        obj.structName = structName

        return obj
    }
    catch(e)
    {
        return  'getObjWithStructName fail' 
    }     
}

function structObj2Buffer(structObj)
{
    var struct = eval(structObj.structName)
    var size = sizeof(struct)
    var buffer  = new ArrayBuffer(size)
    var dataView = new DataView(buffer,0)   
    
    var pos = 0

    function fillBuffer(structObj)
    {   
        var struct = eval(structObj.structName)
    
        for(var i=0;i<struct.length;i++)
        {
            var subStruct = struct[i]
            var t = eval(subStruct[0])

            var arraySize = 1
            var sizeArray = []

            for(var ii=2;ii<subStruct.length;ii++)
            {
                arraySize = arraySize * subStruct[ii]
                sizeArray[sizeArray.length] = subStruct[ii]
            }

            for(var ii=0;ii<arraySize;ii++)
            {
                var v = arraySize==1?structObj[subStruct[1]]:getWithIdxArray(idx2IdxArray(ii, sizeArray), structObj[subStruct[1]])
                if(t.isBaseType)
                {
                    if(v)
                    {
                        t.setBuffer?t.setBuffer(dataView, pos, v):dataView['set' + t.bufferType](pos, v, true) 
                    }
                    pos = pos + t.size
                }
                else
                {
                    fillBuffer(v)
                }
            }

        }
    }

    fillBuffer(structObj)

    return dataView.buffer
}

function buffer2StructObj(buffer, structName)
{   
    var pos = 0
    var dataView = new DataView(buffer,0)    

    function fillStructObj(structName)
    {   
        var structObj = getObjWithStructName(structName)
        if(pos >= buffer.byteLength)
            return structObj
        try
        {
            var struct = eval(structName)
            for(var i=0;i<struct.length;i++)
            {
                var subStruct = struct[i]
                var t = eval(subStruct[0])

                var arraySize = 1
                var sizeArray = []
                for(var ii=2;ii<subStruct.length;ii++)
                {
                    arraySize = arraySize * subStruct[ii]
                    sizeArray[sizeArray.length] = subStruct[ii]
                }

                for(var ii=0;ii<arraySize;ii++)
                {   
                    var v 
                    if(t.isBaseType)
                    {
                        v = t.getBuffer?t.getBuffer(dataView, pos):dataView['get' + t.bufferType](pos, true)  
                        pos = pos + sizeof(t)
                    }
                    else
                    {
                        v = fillStructObj(subStruct[0])
                    }
                    sizeArray.length==0?structObj[subStruct[1]] = v:setWithIdxArray(idx2IdxArray(ii, sizeArray), structObj[subStruct[1]], v)  
                }
            }    
        }
        catch(e)
        {
            //gameLog.log('buffer2StructObj catch', e)
        }

        return structObj
    }

    return fillStructObj(structName)
}






