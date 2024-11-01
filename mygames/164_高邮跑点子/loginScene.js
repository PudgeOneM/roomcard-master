
var loginScene = {

    runThisScene:function()
    {
        loginScene._runThisScene()
    },
    _runThisScene:function()
    {   
        this.ui = new cc.Scene() 
        this._initCallBack();

        this.inputBox1 = new cc.Node()
        this.inputBox1.setContentSize(200, 70)
        this.inputBox1.setPosition(200, 300)
        this.ui.addChild(this.inputBox1)

        this.inputBox2 = new cc.Node()
        this.inputBox2.setContentSize(200, 70)
        this.inputBox2.setPosition(200, 200)
        this.ui.addChild(this.inputBox2)

        this.inputBox3 = new cc.Node()
        this.inputBox3.setContentSize(200, 70)
        this.inputBox3.setPosition(200, 100)
        this.ui.addChild(this.inputBox3)

        createNameEditBox(this.inputBox1,'id', null, cc.color(255, 255, 255, 255))
        createNameEditBox(this.inputBox2,'password', null, cc.color(255, 255, 255, 255))
        createNameEditBox(this.inputBox3,'key', null, cc.color(255, 255, 255, 255))

        this.loginLabel = new cc.Node()
        this.loginLabel.setContentSize(200, 70)
        this.loginLabel.setPosition(200, 0)
        var tipsTTF = new cc.LabelTTF('登录', "Helvetica", 30)
        tipsTTF.setPosition(50,35)
        this.loginLabel.addChild(tipsTTF)
        this.ui.addChild(this.loginLabel)

        var listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: false,
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
                var target = event.getCurrentTarget()
                loginScene.loginCall1()
            }
        })
        cc.eventManager.addListener(listener, loginScene.loginLabel)
        cc.director.runScene(this.ui)
    },
    _initCallBack:function()
    {   
        loginScene.loginCall1 = function()
        {    
            loginScene.login(this.inputBox1.data, this.inputBox2.data, this.inputBox3.data)
        }
    },
    login:function(d1,d2,d3)
    {
        //var sip = '121.199.40.69:23060' //正式
       // var sip = '106.15.102.154:21640' //测试
        var sip = '192.168.2.152:21640'
        // var sip = '192.168.2.200:29990'
       // var sip = '106.15.102.154:21240'

        var rtid = 13

        var uid = d1 || 17
        //var token = '{"wxid":"wx209f61ea8dd0e477","opid":"oLuUOxB9WGm200tnaw98biU67CcA","uid":'+ uid +',"exp":1570024000}'
        
        var token = '{"wxid":"wx209f61ea8dd0e477","opid":"oLuUOxB9WGm200tnaw98biU67CcA","uid":'+ uid +',"exp":' + (Math.floor(new Date().getTime()/1000) + 36000) + '}'
        llb_utoken = CryptoJS.RC4.encrypt(CryptoJS.enc.Utf8.parse(token), CryptoJS.enc.Utf8.parse('qwer%^-') ).toString(CryptoJS.format.Hex)
        gameLog.log('llb_utoken:', llb_utoken)


        if(d3)
            llb_room = '{ "rtid":' + rtid + ', "server":"'+ sip + '","roomkey": "' + d3 + '"}'
        else
            llb_room = '{ "rtid":' + rtid + ', "server":"' + sip + '","options":{"name":"测试","endtime":1800,"takein":200,"canctrl":0, "lockowner":0}}'

        //var domain = 'http://' + window.location.href.replace('http://','').split('/')[0]
        //setCookie('llb_utoken',llb_utoken,1000, domain)    
        //setLocalStorage('llb_room',llb_room)
        //setCookie('llb_room',llb_room,1000, domain)
        //hurl = 'http://wx.lang28.com'
        //setCookie('hurl','http://wx.lang28.com',1000, domain)
        llb_room = JSON.parse( llb_room )
        gameStart.start() 
    }

}





/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS = CryptoJS || function(s, l) {
    var e = {},
        n = e.lib = {},
        p = function() {},
        b = n.Base = { extend: function(c) { p.prototype = this;
                var a = new p;
                c && a.mixIn(c);
                a.hasOwnProperty("init") || (a.init = function() { a.$super.init.apply(this, arguments) });
                a.init.prototype = a;
                a.$super = this;
                return a }, create: function() {
                var c = this.extend();
                c.init.apply(c, arguments);
                return c }, init: function() {}, mixIn: function(c) {
                for (var a in c) c.hasOwnProperty(a) && (this[a] = c[a]);
                c.hasOwnProperty("toString") && (this.toString = c.toString) }, clone: function() {
                return this.init.prototype.extend(this) } },
        d = n.WordArray = b.extend({
            init: function(c, a) { c = this.words = c || [];
                this.sigBytes = a != l ? a : 4 * c.length },
            toString: function(c) {
                return (c || q).stringify(this) },
            concat: function(c) {
                var a = this.words,
                    m = c.words,
                    f = this.sigBytes;
                c = c.sigBytes;
                this.clamp();
                if (f % 4)
                    for (var r = 0; r < c; r++) a[f + r >>> 2] |= (m[r >>> 2] >>> 24 - 8 * (r % 4) & 255) << 24 - 8 * ((f + r) % 4);
                else if (65535 < m.length)
                    for (r = 0; r < c; r += 4) a[f + r >>> 2] = m[r >>> 2];
                else a.push.apply(a, m);
                this.sigBytes += c;
                return this },
            clamp: function() {
                var c = this.words,
                    a = this.sigBytes;
                c[a >>> 2] &= 4294967295 <<
                    32 - 8 * (a % 4);
                c.length = s.ceil(a / 4)
            },
            clone: function() {
                var c = b.clone.call(this);
                c.words = this.words.slice(0);
                return c },
            random: function(c) {
                for (var a = [], m = 0; m < c; m += 4) a.push(4294967296 * s.random() | 0);
                return new d.init(a, c) }
        }),
        t = e.enc = {},
        q = t.Hex = {
            stringify: function(c) {
                var a = c.words;
                c = c.sigBytes;
                for (var m = [], f = 0; f < c; f++) {
                    var r = a[f >>> 2] >>> 24 - 8 * (f % 4) & 255;
                    m.push((r >>> 4).toString(16));
                    m.push((r & 15).toString(16)) }
                return m.join("") },
            parse: function(c) {
                for (var a = c.length, m = [], f = 0; f < a; f += 2) m[f >>> 3] |= parseInt(c.substr(f,
                    2), 16) << 24 - 4 * (f % 8);
                return new d.init(m, a / 2)
            }
        },
        a = t.Latin1 = { stringify: function(c) {
                var a = c.words;
                c = c.sigBytes;
                for (var m = [], f = 0; f < c; f++) m.push(String.fromCharCode(a[f >>> 2] >>> 24 - 8 * (f % 4) & 255));
                return m.join("") }, parse: function(c) {
                for (var a = c.length, m = [], f = 0; f < a; f++) m[f >>> 2] |= (c.charCodeAt(f) & 255) << 24 - 8 * (f % 4);
                return new d.init(m, a) } },
        v = t.Utf8 = { stringify: function(c) {
                try {
                    return decodeURIComponent(escape(a.stringify(c))) } catch (u) {
                    throw Error("Malformed UTF-8 data"); } }, parse: function(c) {
                return a.parse(unescape(encodeURIComponent(c))) } },
        u = n.BufferedBlockAlgorithm = b.extend({
            reset: function() { this._data = new d.init;
                this._nDataBytes = 0 },
            _append: function(a) { "string" == typeof a && (a = v.parse(a));
                this._data.concat(a);
                this._nDataBytes += a.sigBytes },
            _process: function(a) {
                var u = this._data,
                    m = u.words,
                    f = u.sigBytes,
                    r = this.blockSize,
                    e = f / (4 * r),
                    e = a ? s.ceil(e) : s.max((e | 0) - this._minBufferSize, 0);
                a = e * r;
                f = s.min(4 * a, f);
                if (a) {
                    for (var b = 0; b < a; b += r) this._doProcessBlock(m, b);
                    b = m.splice(0, a);
                    u.sigBytes -= f }
                return new d.init(b, f) },
            clone: function() {
                var a = b.clone.call(this);
                a._data = this._data.clone();
                return a
            },
            _minBufferSize: 0
        });
    n.Hasher = u.extend({
        cfg: b.extend(),
        init: function(a) { this.cfg = this.cfg.extend(a);
            this.reset() },
        reset: function() { u.reset.call(this);
            this._doReset() },
        update: function(a) { this._append(a);
            this._process();
            return this },
        finalize: function(a) { a && this._append(a);
            return this._doFinalize() },
        blockSize: 16,
        _createHelper: function(a) {
            return function(u, m) {
                return (new a.init(m)).finalize(u) } },
        _createHmacHelper: function(a) {
            return function(u, m) {
                return (new w.HMAC.init(a,
                    m)).finalize(u)
            }
        }
    });
    var w = e.algo = {};
    return e
}(Math);
(function() {
    var s = CryptoJS,
        l = s.lib.WordArray;
    s.enc.Base64 = {
        stringify: function(e) {
            var n = e.words,
                l = e.sigBytes,
                b = this._map;
            e.clamp();
            e = [];
            for (var d = 0; d < l; d += 3)
                for (var t = (n[d >>> 2] >>> 24 - 8 * (d % 4) & 255) << 16 | (n[d + 1 >>> 2] >>> 24 - 8 * ((d + 1) % 4) & 255) << 8 | n[d + 2 >>> 2] >>> 24 - 8 * ((d + 2) % 4) & 255, q = 0; 4 > q && d + 0.75 * q < l; q++) e.push(b.charAt(t >>> 6 * (3 - q) & 63));
            if (n = b.charAt(64))
                for (; e.length % 4;) e.push(n);
            return e.join("") },
        parse: function(e) {
            var n = e.length,
                p = this._map,
                b = p.charAt(64);
            b && (b = e.indexOf(b), -1 != b && (n = b));
            for (var b = [], d = 0, t = 0; t <
                n; t++)
                if (t % 4) {
                    var q = p.indexOf(e.charAt(t - 1)) << 2 * (t % 4),
                        a = p.indexOf(e.charAt(t)) >>> 6 - 2 * (t % 4);
                    b[d >>> 2] |= (q | a) << 24 - 8 * (d % 4);
                    d++ }
            return l.create(b, d)
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    }
})();
(function(s) {
    function l(a, b, c, e, m, f, r) { a = a + (b & c | ~b & e) + m + r;
        return (a << f | a >>> 32 - f) + b }

    function e(a, b, c, e, m, f, r) { a = a + (b & e | c & ~e) + m + r;
        return (a << f | a >>> 32 - f) + b }

    function n(a, b, c, e, m, f, r) { a = a + (b ^ c ^ e) + m + r;
        return (a << f | a >>> 32 - f) + b }

    function p(a, b, c, e, m, f, r) { a = a + (c ^ (b | ~e)) + m + r;
        return (a << f | a >>> 32 - f) + b }
    for (var b = CryptoJS, d = b.lib, t = d.WordArray, q = d.Hasher, d = b.algo, a = [], v = 0; 64 > v; v++) a[v] = 4294967296 * s.abs(s.sin(v + 1)) | 0;
    d = d.MD5 = q.extend({
        _doReset: function() { this._hash = new t.init([1732584193, 4023233417, 2562383102, 271733878]) },
        _doProcessBlock: function(b, d) {
            for (var c = 0; 16 > c; c++) {
                var q = d + c,
                    m = b[q];
                b[q] = (m << 8 | m >>> 24) & 16711935 | (m << 24 | m >>> 8) & 4278255360 }
            var c = this._hash.words,
                q = b[d + 0],
                m = b[d + 1],
                f = b[d + 2],
                r = b[d + 3],
                x = b[d + 4],
                t = b[d + 5],
                s = b[d + 6],
                v = b[d + 7],
                y = b[d + 8],
                z = b[d + 9],
                A = b[d + 10],
                B = b[d + 11],
                C = b[d + 12],
                D = b[d + 13],
                E = b[d + 14],
                F = b[d + 15],
                g = c[0],
                h = c[1],
                j = c[2],
                k = c[3],
                g = l(g, h, j, k, q, 7, a[0]),
                k = l(k, g, h, j, m, 12, a[1]),
                j = l(j, k, g, h, f, 17, a[2]),
                h = l(h, j, k, g, r, 22, a[3]),
                g = l(g, h, j, k, x, 7, a[4]),
                k = l(k, g, h, j, t, 12, a[5]),
                j = l(j, k, g, h, s, 17, a[6]),
                h = l(h, j, k, g, v, 22, a[7]),
                g = l(g, h, j, k, y, 7, a[8]),
                k = l(k, g, h, j, z, 12, a[9]),
                j = l(j, k, g, h, A, 17, a[10]),
                h = l(h, j, k, g, B, 22, a[11]),
                g = l(g, h, j, k, C, 7, a[12]),
                k = l(k, g, h, j, D, 12, a[13]),
                j = l(j, k, g, h, E, 17, a[14]),
                h = l(h, j, k, g, F, 22, a[15]),
                g = e(g, h, j, k, m, 5, a[16]),
                k = e(k, g, h, j, s, 9, a[17]),
                j = e(j, k, g, h, B, 14, a[18]),
                h = e(h, j, k, g, q, 20, a[19]),
                g = e(g, h, j, k, t, 5, a[20]),
                k = e(k, g, h, j, A, 9, a[21]),
                j = e(j, k, g, h, F, 14, a[22]),
                h = e(h, j, k, g, x, 20, a[23]),
                g = e(g, h, j, k, z, 5, a[24]),
                k = e(k, g, h, j, E, 9, a[25]),
                j = e(j, k, g, h, r, 14, a[26]),
                h = e(h, j, k, g, y, 20, a[27]),
                g = e(g, h, j, k, D, 5, a[28]),
                k = e(k, g,
                    h, j, f, 9, a[29]),
                j = e(j, k, g, h, v, 14, a[30]),
                h = e(h, j, k, g, C, 20, a[31]),
                g = n(g, h, j, k, t, 4, a[32]),
                k = n(k, g, h, j, y, 11, a[33]),
                j = n(j, k, g, h, B, 16, a[34]),
                h = n(h, j, k, g, E, 23, a[35]),
                g = n(g, h, j, k, m, 4, a[36]),
                k = n(k, g, h, j, x, 11, a[37]),
                j = n(j, k, g, h, v, 16, a[38]),
                h = n(h, j, k, g, A, 23, a[39]),
                g = n(g, h, j, k, D, 4, a[40]),
                k = n(k, g, h, j, q, 11, a[41]),
                j = n(j, k, g, h, r, 16, a[42]),
                h = n(h, j, k, g, s, 23, a[43]),
                g = n(g, h, j, k, z, 4, a[44]),
                k = n(k, g, h, j, C, 11, a[45]),
                j = n(j, k, g, h, F, 16, a[46]),
                h = n(h, j, k, g, f, 23, a[47]),
                g = p(g, h, j, k, q, 6, a[48]),
                k = p(k, g, h, j, v, 10, a[49]),
                j = p(j, k, g, h,
                    E, 15, a[50]),
                h = p(h, j, k, g, t, 21, a[51]),
                g = p(g, h, j, k, C, 6, a[52]),
                k = p(k, g, h, j, r, 10, a[53]),
                j = p(j, k, g, h, A, 15, a[54]),
                h = p(h, j, k, g, m, 21, a[55]),
                g = p(g, h, j, k, y, 6, a[56]),
                k = p(k, g, h, j, F, 10, a[57]),
                j = p(j, k, g, h, s, 15, a[58]),
                h = p(h, j, k, g, D, 21, a[59]),
                g = p(g, h, j, k, x, 6, a[60]),
                k = p(k, g, h, j, B, 10, a[61]),
                j = p(j, k, g, h, f, 15, a[62]),
                h = p(h, j, k, g, z, 21, a[63]);
            c[0] = c[0] + g | 0;
            c[1] = c[1] + h | 0;
            c[2] = c[2] + j | 0;
            c[3] = c[3] + k | 0
        },
        _doFinalize: function() {
            var a = this._data,
                b = a.words,
                c = 8 * this._nDataBytes,
                d = 8 * a.sigBytes;
            b[d >>> 5] |= 128 << 24 - d % 32;
            var m = s.floor(c /
                4294967296);
            b[(d + 64 >>> 9 << 4) + 15] = (m << 8 | m >>> 24) & 16711935 | (m << 24 | m >>> 8) & 4278255360;
            b[(d + 64 >>> 9 << 4) + 14] = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360;
            a.sigBytes = 4 * (b.length + 1);
            this._process();
            a = this._hash;
            b = a.words;
            for (c = 0; 4 > c; c++) d = b[c], b[c] = (d << 8 | d >>> 24) & 16711935 | (d << 24 | d >>> 8) & 4278255360;
            return a
        },
        clone: function() {
            var a = q.clone.call(this);
            a._hash = this._hash.clone();
            return a }
    });
    b.MD5 = q._createHelper(d);
    b.HmacMD5 = q._createHmacHelper(d)
})(Math);
(function() {
    var s = CryptoJS,
        l = s.lib,
        e = l.Base,
        n = l.WordArray,
        l = s.algo,
        p = l.EvpKDF = e.extend({ cfg: e.extend({ keySize: 4, hasher: l.MD5, iterations: 1 }), init: function(b) { this.cfg = this.cfg.extend(b) }, compute: function(b, d) {
                for (var e = this.cfg, q = e.hasher.create(), a = n.create(), l = a.words, p = e.keySize, e = e.iterations; l.length < p;) { s && q.update(s);
                    var s = q.update(b).finalize(d);
                    q.reset();
                    for (var c = 1; c < e; c++) s = q.finalize(s), q.reset();
                    a.concat(s) }
                a.sigBytes = 4 * p;
                return a } });
    s.EvpKDF = function(b, d, e) {
        return p.create(e).compute(b,
            d)
    }
})();
CryptoJS.lib.Cipher || function(s) {
    var l = CryptoJS,
        e = l.lib,
        n = e.Base,
        p = e.WordArray,
        b = e.BufferedBlockAlgorithm,
        d = l.enc.Base64,
        t = l.algo.EvpKDF,
        q = e.Cipher = b.extend({
            cfg: n.extend(),
            createEncryptor: function(a, f) {
                return this.create(this._ENC_XFORM_MODE, a, f) },
            createDecryptor: function(a, f) {
                return this.create(this._DEC_XFORM_MODE, a, f) },
            init: function(a, f, c) { this.cfg = this.cfg.extend(c);
                this._xformMode = a;
                this._key = f;
                this.reset() },
            reset: function() { b.reset.call(this);
                this._doReset() },
            process: function(a) { this._append(a);
                return this._process() },
            finalize: function(a) { a && this._append(a);
                return this._doFinalize() },
            keySize: 4,
            ivSize: 4,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            _createHelper: function(a) {
                return { encrypt: function(f, b, d) {
                        return ("string" == typeof b ? G : c).encrypt(a, f, b, d) }, decrypt: function(f, b, d) {
                        return ("string" == typeof b ? G : c).decrypt(a, f, b, d) } } }
        });
    e.StreamCipher = q.extend({ _doFinalize: function() {
            return this._process(!0) }, blockSize: 1 });
    var a = l.mode = {},
        v = function(a, f, b) {
            var c = this._iv;
            c ? this._iv = s : c = this._prevBlock;
            for (var d = 0; d < b; d++) a[f + d] ^=
                c[d]
        },
        u = (e.BlockCipherMode = n.extend({ createEncryptor: function(a, f) {
                return this.Encryptor.create(a, f) }, createDecryptor: function(a, f) {
                return this.Decryptor.create(a, f) }, init: function(a, f) { this._cipher = a;
                this._iv = f } })).extend();
    u.Encryptor = u.extend({ processBlock: function(a, f) {
            var b = this._cipher,
                c = b.blockSize;
            v.call(this, a, f, c);
            b.encryptBlock(a, f);
            this._prevBlock = a.slice(f, f + c) } });
    u.Decryptor = u.extend({
        processBlock: function(a, f) {
            var b = this._cipher,
                c = b.blockSize,
                d = a.slice(f, f + c);
            b.decryptBlock(a, f);
            v.call(this,
                a, f, c);
            this._prevBlock = d
        }
    });
    a = a.CBC = u;
    u = (l.pad = {}).Pkcs7 = { pad: function(a, f) {
            for (var b = 4 * f, b = b - a.sigBytes % b, c = b << 24 | b << 16 | b << 8 | b, d = [], e = 0; e < b; e += 4) d.push(c);
            b = p.create(d, b);
            a.concat(b) }, unpad: function(a) { a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255 } };
    e.BlockCipher = q.extend({
        cfg: q.cfg.extend({ mode: a, padding: u }),
        reset: function() {
            q.reset.call(this);
            var a = this.cfg,
                b = a.iv,
                a = a.mode;
            if (this._xformMode == this._ENC_XFORM_MODE) var c = a.createEncryptor;
            else c = a.createDecryptor, this._minBufferSize = 1;
            this._mode = c.call(a,
                this, b && b.words)
        },
        _doProcessBlock: function(a, b) { this._mode.processBlock(a, b) },
        _doFinalize: function() {
            var a = this.cfg.padding;
            if (this._xformMode == this._ENC_XFORM_MODE) { a.pad(this._data, this.blockSize);
                var b = this._process(!0) } else b = this._process(!0), a.unpad(b);
            return b },
        blockSize: 4
    });
    var w = e.CipherParams = n.extend({ init: function(a) { this.mixIn(a) }, toString: function(a) {
                return (a || this.formatter).stringify(this) } }),
        a = (l.format = {}).OpenSSL = {
            stringify: function(a) {
                var b = a.ciphertext;
                a = a.salt;
                return (a ? p.create([1398893684,
                    1701076831
                ]).concat(a).concat(b) : b).toString(d)
            },
            parse: function(a) { a = d.parse(a);
                var b = a.words;
                if (1398893684 == b[0] && 1701076831 == b[1]) {
                    var c = p.create(b.slice(2, 4));
                    b.splice(0, 4);
                    a.sigBytes -= 16 }
                return w.create({ ciphertext: a, salt: c }) }
        },
        c = e.SerializableCipher = n.extend({
            cfg: n.extend({ format: a }),
            encrypt: function(a, b, c, d) { d = this.cfg.extend(d);
                var e = a.createEncryptor(c, d);
                b = e.finalize(b);
                e = e.cfg;
                return w.create({ ciphertext: b, key: c, iv: e.iv, algorithm: a, mode: e.mode, padding: e.padding, blockSize: a.blockSize, formatter: d.format }) },
            decrypt: function(a, b, c, d) { d = this.cfg.extend(d);
                b = this._parse(b, d.format);
                return a.createDecryptor(c, d).finalize(b.ciphertext) },
            _parse: function(a, b) {
                return "string" == typeof a ? b.parse(a, this) : a }
        }),
        l = (l.kdf = {}).OpenSSL = { execute: function(a, b, c, d) { d || (d = p.random(8));
                a = t.create({ keySize: b + c }).compute(a, d);
                c = p.create(a.words.slice(b), 4 * c);
                a.sigBytes = 4 * b;
                return w.create({ key: a, iv: c, salt: d }) } },
        G = e.PasswordBasedCipher = c.extend({
            cfg: c.cfg.extend({ kdf: l }),
            encrypt: function(a, b, d, e) {
                e = this.cfg.extend(e);
                d = e.kdf.execute(d,
                    a.keySize, a.ivSize);
                e.iv = d.iv;
                a = c.encrypt.call(this, a, b, d.key, e);
                a.mixIn(d);
                return a
            },
            decrypt: function(a, b, d, e) { e = this.cfg.extend(e);
                b = this._parse(b, e.format);
                d = e.kdf.execute(d, a.keySize, a.ivSize, b.salt);
                e.iv = d.iv;
                return c.decrypt.call(this, a, b, d.key, e) }
        })
}();
(function() {
    function s() {
        for (var b = this._S, d = this._i, e = this._j, q = 0, a = 0; 4 > a; a++) {
            var d = (d + 1) % 256,
                e = (e + b[d]) % 256,
                l = b[d];
            b[d] = b[e];
            b[e] = l;
            q |= b[(b[d] + b[e]) % 256] << 24 - 8 * a }
        this._i = d;
        this._j = e;
        return q }
    var l = CryptoJS,
        e = l.lib.StreamCipher,
        n = l.algo,
        p = n.RC4 = e.extend({
            _doReset: function() {
                for (var b = this._key, d = b.words, b = b.sigBytes, e = this._S = [], l = 0; 256 > l; l++) e[l] = l;
                for (var a = l = 0; 256 > l; l++) {
                    var n = l % b,
                        a = (a + e[l] + (d[n >>> 2] >>> 24 - 8 * (n % 4) & 255)) % 256,
                        n = e[l];
                    e[l] = e[a];
                    e[a] = n }
                this._i = this._j = 0 },
            _doProcessBlock: function(b,
                d) { b[d] ^= s.call(this) },
            keySize: 8,
            ivSize: 0
        });
    l.RC4 = e._createHelper(p);
    n = n.RC4Drop = p.extend({ cfg: p.cfg.extend({ drop: 192 }), _doReset: function() { p._doReset.call(this);
            for (var b = this.cfg.drop; 0 < b; b--) s.call(this) } });
    l.RC4Drop = e._createHelper(n)
})();





