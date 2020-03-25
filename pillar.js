/*! Copyright (C) 2015 - 2020 Manoel Neco. Todos Direitos Reservados */

let = Pi = {};
let global = {};

/**
 * @class Pi.Object
 */
Pi.Object = {};

Pi.Object.extractProperty = function (obj, property) {
    let p = property.split('.');

    if (p.length > 1) {
        for (let i = 0; i < p.length - 1; i++) {
            let m = p[i];
            if (obj[m] == undefined) obj[m] = {};
            obj = obj[m];
        }
    } else {
        return obj[property];
    }

    return obj;
}

Pi.Object.extractValue = function (obj, property) {
    if (property.indexOf('.') > -1) {
        let p = property.split('.');
        for (let i = 0; i < p.length; i++) {
            obj = obj[p[i]]
            if (obj == undefined) break;
        }

        return obj;
    } else {
        return obj[property];
    }
}

/**
 * Verifica se nao ha nenhuma propriedade adicionada ao objeto
 * 
 * @method Pi.Object.isEmpty
 * @param {object} obj 
 * @return {boolean}
 */
Pi.Object.isEmpty = function (obj) {
    if (Pi.Type.isArray(obj) && obj.length == 0) return true;

    if (!Pi.Type.isObject(obj)) return false;

    let c = 0;
    for (let i in obj) {
        c++;
        break;
    }

    if (c == 0) return true;
    else return false;
}

/**
 * Adiciona todas as propriedades e metodos de todos os parametros no primeiro
 * 
 * @method Pi.Object.extend
 * @param {arguments} arg
 * @return {object}
 */
Pi.Object.extend = function () {
    for (let i = 1; i < arguments.length; i++) {
        let obj = arguments[i];
        for (let v in obj) {
            arguments[0][v] = obj[v];
        }
    }

    return arguments[0];
}

Pi.Object.extendAndCall = function () {
    let dst = arguments[0];

    for (let i = arguments.length - 1; i > 0; i--) {
        let obj = arguments[i];

        for (let p in obj) {
            if (typeof dst[p] == 'function') {
                dst[p](obj[p]);
            } else {
                dst[p] = obj[p];
            }
        }
    }

    return dst;
}/**
 * @class Pi.String
 */
Pi.String = {};

Pi.String.insert = function (str, beginIndex, endIndexOrText, text) {
    if (text == undefined) {
        text = endIndexOrText;
        return str.substring(0, beginIndex) + text + str.substring(beginIndex);
    } else {
        return str.substring(0, beginIndex) + text + str.substring(endIndexOrText);
    }
};

Pi.String.indexOfs = function (str, beginWord, endWord) {
    let arr = [];
    let i = -1;

    while (true) {
        i = str.indexOf(beginWord, i + 1);
        let beginIndex = i;

        if (i == -1) break;
        i += beginWord.length;

        let f = str.indexOf(endWord, i + 1);
        if (f == -1) break;
        let endIndex = f;

        let inner = str.substr(i, f - i);
        arr.push({
            beginOuterIndex: beginIndex,
            endOuterIndex: endIndex + 1,

            beginInnerIndex: beginIndex + beginWord.length,
            endInnerIndex: endIndex + endWord.length,

            inner: inner,
            outer: beginWord + inner + endWord
        });

        i = f + 1;
    }

    return arr;
};

Pi.String.clips = function (text, beginWord, endWord) {
    let arr = [];
    let i = -1;

    while (true) {
        i = text.indexOf(beginWord, i + 1);
        if (i == -1) break;
        i += beginWord.length;

        let f = text.indexOf(endWord, i + 1);
        if (f == -1) break;

        arr.push(text.substr(i, f - i));
        i = f + 1;
    }

    return arr;
};

Pi.String.clip = function (text, wordBegin, wordEnd) {
    if (Pi.Type.isNumber(wordBegin)) {
        let i = wordBegin;
        let f = text.indexOf(wordEnd);
        return text.substr(i, f - i);
    }

    if (Pi.Type.isNumber(wordEnd)) {
        let i = text.indexOf(wordBegin);
        let f = wordEnd;
        return text.substr(i, f - i);
    }

    let i = text.indexOf(wordBegin);
    if (i == -1) return "";
    i += wordBegin.length;

    let f = text.indexOf(wordEnd, i + 1);
    if (f == -1) return "";

    return text.substr(i, f - i);
};

Pi.String.format = function (format, ...args) {
    return format.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
};


/**
 * Remove todos os acentos da string
 * 
 * @method Pi.String.removeAcentos
 * @param {string} str
 * @return {string}
 */
Pi.String.removeAcentos = function (str) {
    let str2 = str.replace(/[èìòùîàâêôûãõáéíóúçüÀÂÊÔÛÃÕÁÉÍÓÚÇÜ]/mgi, function (p) {
        let comAcento = "èìòùî àâêôûãõáéíóúçüÀÂÊÔÛÃÕÁÉÍÓÚÇÜ",
            semAcento = "eioui aaeouaoaeioucuAAEOUAOAEIOUCU";

        return semAcento.charAt(comAcento.indexOf(p));
    });

    return str2;
};

/**
 * Convert todos os espaços para código html &nbsp;
 * 
 * @method Pi.String.space2nbsp
 * @param {string} str 
 * @return {string}
 */
Pi.String.space2nbsp = function (str) {
    if (str == null) return '';
    return str.replace(/\s/gi, '&nbsp;').replace(/\-/gi, '&nbsp;-&nbsp;');
};

/**
 * Adiciona três pontos ao final da string de seu tamanho exceder o limite fornecido
 * 
 * @method Pi.String.reticencias
 * @param {string} str 
 * @param {int} length 
 * @return {string}
 */
Pi.String.reticencias = function (str, length) {
    if (str.length > length) return str.substring(0, length) + '...';
    else return str;
}
    ;
/**
 * Remove todos os espaços da string
 * 
 * @method Pi.String.removeSpace
 * @param {string} str 
 * @return {string}
 */
Pi.String.removeSpace = function (str) {
    return (str || '').replace(/\s*/gi, '');
};

/**
 * Retorna a primeira palavra da string
 * 
 * @method Pi.String.firtWord
 * @param {string} str 
 * @return {string}
 */
Pi.String.firstWord = function (str) {
    if (Pi.Type.isString(str)) {
        return str.split(' ')[0];
    } else {
        return '';
    }
};

/**
 * Retorna a última palavra da string
 * 
 * @method Pi.String.lastWord
 * @param {string} str 
 * @return {string}
 */
Pi.String.lastWord = function (str) {
    if (Pi.Type.isString(str)) {
        let p = str.split(' ');
        return p[p.length - 1];
    } else {
        return '';
    }

};

/**
 * Retorna a primeira e última palavras da string
 * 
 * @method Pi.String.firstAndlastWord
 * @param {string} str 
 * @return {string}
 */
Pi.String.firstAndlastWord = function (str) {
    let p = str.split(' ');
    let first = '';

    if (p.length == 1) return str;

    first = str.split(' ')[0];

    return first + ' ' + p[p.length - 1];
};

/**
 * Converte todas as palavras da string para capital. As palavras podem estar seperadas por espaço ou _
 * 
 * @method Pi.String.capital
 * @param {string} str 
 * @return {string}
 */
Pi.String.capital = function (str) {
    if (!Pi.Type.isString(str)) return '';

    str = str.toLowerCase();

    let p = /(^[\s_\.-]*\w|[\s\._-]\w)+/gi,
        m = str.match(p);

    for (let v in m) {
        str = str.replace(m[v], m[v].toUpperCase());
    }

    return str;
};

Pi.String.replace = function (input, search, replacement) {
    return input.replace(new RegExp(search, 'g'), replacement);
};

/**
 * Reduz um nome em n - 1 palavras iniciais mais a ultima palavra
 * 
 * @method Pi.String.cut
 * @param {string} str 
 * @param {int} total 
 * @return {string}
 */
Pi.String.cut = function (str, total) {
    if (!Pi.Type.isString(str) || total < 0) return str;

    let p = str.split(' '),
        arr = [];

    //adiciona a primeira palavra
    arr.push(p[0]);

    if (total > p.length) total = p.length;

    for (let i = 1; i < total; i++) {
        arr.push(p[i]);
    }

    //adiciona a ultima palavra
    if (p.length > total) {
        arr.push(p[p.length - 1]);
    }

    return arr.join(' ');
};

/**
 * Retorna a primeira a segunda abreviada e a ultima palavra de um nome
 * 
 * @method abbr
 * @param {string} str
 * @return {string}
 */
Pi.String.abbr = function (str) {
    let s = Pi.String.cut(str, 3);
    let p = s.split(' ');

    if (p.length >= 3) return p[0] + ' ' + p[1][0] + '. ' + p[p.length - 1];
    else return p.join(' ');

};/**
 * @class Pi.Array
 */
Pi.Array = {};

/**
 * Inserer propriedade em todo os elementos do array
 * 
 * @method insert
 * @param {array} arr
 * @param {object} obj
 * @return {array}
 */
Pi.Array.insert = function (arr, obj) {
    for (let i = arr.length - 1; i >= 0; i--) {
        arr[i] = $.extend({}, arr[i], obj);
    };
};

/**
 * Remove toda repeticao do array tornado-o array com elementos unicos
 *
 * @method Pi.Array.removeRepeticao
 * @param {array} arr
 * @return {array}
 */
Pi.Array.removeRepeticao = function (arr) {
    if (Pi.Type.isString(arr)) {
        let a = [];
        a.push(arr);
        arr = a;
    }

    if (!Pi.Type.isArray(arr)) return null;

    let _arr = [],
        last = '';

    arr.sort();

    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] === last) continue;
        last = arr[i];

        _arr.push(arr[i]);
    }

    return _arr;
};

/**
 * Retorna um subarray de um array ou null se parametro arr nao for do tipo array
 * 
 * @method Pi.Array.sub
 * @param {array} arr 
 * @param {int} inicio zero index
 * @param fim {int}
 * @return {array} array || null
*/
Pi.Array.sub = function (arr, inicio, length) {
    if (!Pi.Type.isArray(arr)) return null;

    let _arr = [];

    inicio = inicio || 0;
    length = length || arr.length - 1;

    if (length < 1) return null;

    for (let i = inicio; i <= length; i++) {
        _arr.push(arr[i]);
    }

    return _arr;
};

/**
 * Remove um item de um array
 *
 * @method Pi.ARray.removeByIndex
 * @param {array} arr 
 * @param {int} position zero index
 * @return {array}
*/
Pi.Array.removeByIndex = function (arr, pos) {
    pos = parseInt(pos);
    if (pos >= 0 && Pi.Type.isNumber(pos)) {
        arr.splice(pos, 1);
    }

    return arr;
};

/**
 * Remove um elemento do array. Se o primeiro parametro for uma function remove o elemento se o retorno for verdadeiro
 *
 * @method Pi.Array.remove
 * @param {array} arr 
 * @param {function} cb  function || index
 * @return array
 */
Pi.Array.remove = function (arr, cb) {
    if (Pi.Type.isFunction(cb)) {
        for (let i in arr) {
            if (cb(arr[i])) {
                Pi.Array.removeByIndex(arr, i);
            }
        }
    } else {
        Pi.Array.removeByIndex(arr, cb);
    }

    return arr;
};

/**
 * Verifica se um array possui um elemento especificado
 *
 * @method Pi.Array.contains
 * @param {array} arr 
 * @param {mix} el
 * @return {boolean}
*/
Pi.Array.contains = function (arr, el) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == el) return true;
    }

    return false;
};

Pi.Array.insert = function (arr, element, index) {
    arr.splice(index, 0, element);
};

/**
 * Verifica se os arrays parametrizados sao iguais
 *
 * @method Pi.Array.equals
 * @param {array} arr1 
 * @param {array} arr2 
 * @return {boolean}
*/
Pi.Array.equals = function (arr1, arr2) {
    if (arr1.length != arr2.length) return false;

    arr1.sort();
    arr2.sort();

    for (let i = arr1.length - 1; i >= 0; i--) {
        if (arr1[i] != arr2[i]) return false;
    }

    return true;
};
Pi.Type = {};

Pi.Type.isUndefined = function (obj) {
    if (obj === null) return false;
    else if (obj == undefined) return true;
    else return false;
};

Pi.Type.typeof = function (obj) {
    let v = null;

    if (obj != undefined && obj != null && !Pi.Type.isNumber(obj)) {
        try {
            v = obj.constructor.name;
            if (v == '') v = 'Object';
        } catch (ex) {

        }
    } else if (Pi.Type.isNumber(obj)) {
        return 'Number';
    } else if (obj === undefined) {
        return 'Undefined'
    } else if (obj === null) {
        return 'Null';
    }

    return v;
};

Pi.Type.isNumber = function (obj) {
    if (typeof obj == 'number' && isFinite(obj) && !isNaN(obj)) return true;
    else return false;
};

Pi.Type.isNullOrUndefined = function (obj) {
    if (obj == null || obj == undefined) return true;
    else return false;
};

Pi.Type.isFunction = function (obj) {
    if (typeof obj == 'function') return true;
    else return false;
};

Pi.Type.isArray = function (obj) {
    if (Pi.Type.typeof(obj) == 'Array') return true;

    if (Pi.Type.typeof(obj) == 'String') {
        if (/^\[.*\]$/gi.test(obj)) {
            return true;
        }
    }

    return false;
};

Pi.Type.isObject = function (obj) {
    if (Pi.Type.typeof(obj) == 'Object') return true;
    if (typeof obj == 'object') return true;

    if (Pi.Type.typeof(obj) == 'String') {
        if (/^\{.*\}$/gi.test(obj)) {
            return true;
        }
    }

    return false;
};

Pi.Type.isString = function (obj) {
    if (typeof obj == 'string') return true;
    else return false;
};

Pi.Type.isBoolean = function (obj) {
    if (typeof obj == 'boolean') return true;
    else return false;
};

Pi.Type.isClass = function (obj) {
    if (obj.getClassName == undefined) return false;
    else return true;
};/**
 * @class Pi.Util
 */
Pi.Util = {};
Pi.seed = 0;

/**
 * Gera uma string aleatórioa no formato xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * 
 * @method Pi.Util.UUID
 * @return {string}
 */
Pi.Util.UUID = function (format) {
    let d = new Date().getTime();
    let uuid = (format || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid + (Pi.seed++);
}; Pi.Namespace = function (ns_string, builder) {
    var parts = ns_string.split('.'),
        s = Pi,
        i;

    for (i = 1; i < parts.length; i++) {

        if (typeof s[parts[i]] === "undefined") {
            s[parts[i]] = i + 1 == parts.length ? builder : {};
        }

        s = s[parts[i]];
    }

    if (builder.prototype) {
        builder.prototype.getClassName = function () {
            return ns_string;
        }
    }

    return builder;
};

Pi.Define = Pi.Namespace;
Pi.Export = Pi.Namespace;
Pi.Constant = Pi.Namespace; Pi.Namespace('Pi.Class', class Class {

    constructor(...args) {
        this.defaults();
        this.instances();

        if (Pi.Type.isObject(args[0])) {
            Pi.Object.extendAndCall(this, args[0]);
        }

        this.options = args[0] == undefined ? {} : args[0];

        this.init(...args);
    }

    instances() {

    }

    defaults() {

    }

    inject(json) {
        for (var property in json) {
            this[property] = json[property];
        }

        return this;
    }

    init() {

    }

    jsonWillConvert() {

    }

    toJson() {
        this.jsonWillConvert();
        let json = JSON.parse(JSON.stringify(this));
        delete json.options;
        this.jsonDidConvert(json);

        return json;
    }

    jsonDidConvert(json) {
        delete json.options;
    }

    cloneWillLoad() {

    }

    clone() {
        this.cloneWillLoad();
        let json = this.toJson();
        let clone = this.builder().create(json);
        this.cloneDidLoad(clone);

        return clone;
    }

    cloneDidLoad() {

    }

    builder() {
        let p = this.getClassName().split('.');
        let obj = global;

        for (let i = 0; i < p.length; i++) {
            obj = obj[p[i]]
        }

        return obj;
    }

    proxy(fn) {
        const self = this;
        return function () {
            return fn.apply(self, arguments);
        };
    }

    static create(...args) {
        return new this(...args);
    }

}); Pi.Namespace('Pi.Collection', class picallback extends Array {

    remove(i) {
        this.splice(i, 1);
    }

}); Pi.Namespace('Pi.Hook', class picallback extends Pi.Class {

    instances() {
        super.instances();

        this.list = [];
    }

    clear() {
        this.list = [];
    }

    register(name, fn, ctx) {
        this.list[name] = { name: name, fn: fn, ctx: ctx };

        return this;
    }

    unregister(name) {
        delete this.list[name];

        return this;
    }

    exist(name) {
        return this.list[name] != undefined;
    }

    get(name) {
        return this.list[name];
    }

    invoke(name, ...args) {
        if (!this.exist(name)) return null;

        var item = this.list[name];
        return item.fn.apply(item.ctx, args);
    }
}); (function () {

    Pi.Namespace('Pi.Interval', class piinterval extends Pi.Class {

        static wait(time) {
            const promise = new Pi.Promise();
            const hw = setInterval(() => {
                promise.resolve();
            }, time);

            return new Pi.Interval({ _hw: hw, _promise: promise });
        }

        ok(fn, context) {
            this._promise.ok(fn, context);

            return this;
        }

        clear() {
            this._promise.clear();

            clearInterval(this._hw);

            return this;
        }

    });

})(); (function () {

    Pi.Namespace('Pi.Timeout', class pitimeout extends Pi.Class {

        static wait(time) {
            const promise = new Pi.Promise();
            const hw = setTimeout(function () {
                promise.resolve();
            }, time);

            return new Pi.Timeout({ _hw: hw, _promise: promise });
        }

        clear() {
            this._promise.clear();

            clearTimeout(this._hw);

            return this;
        }

    });

})(); Pi.Namespace('Pi.Random', class pirandom extends Pi.Class {

    generator() {
        return Pi.Random.range(0, Number.MAX_VALUE);
    }

    range(_min, _max) {
        _min = _min || 0;
        _max = _max || Number.MAX_VALUE;

        let random = Math.floor(Math.random() * (1 + _max - _min)) + _min;

        if (random > _max) return _max;
        else return random;
    }

}); Pi.Namespace('Pi.List', class pilist extends Pi.Class {
    constructor() {
        super();

        this.list = [];
    }

    add(item) {
        item.uuid = Pi.Util.UUID('xxx-xxx');
        this.list.push(item);

        return item.uuid;
    }

    load(list) {
        this.list = list;

        return this;
    }

    exist(cb) {
        let arr = this.list;

        for (let i = arr.length - 1; i >= 0; i--) {
            if (cb(arr[i])) return true;
        };

        return false;
    }

    first() {
        if (this.list.length == 0) return null;
        return this.list[0];
    }

    last() {
        if (this.list.length == 0) return null;
        return this.list[this.list.length - 1];
    }

    clear() {
        this.list = [];
    }

    count() {
        return this.list.length;
    }

    remove(item) {
        let isCallback = Pi.Type.isFunction(item);

        for (let i = 0; i < this.list.length; i++) {
            if ((isCallback && item(this.list[i])) || (this.list[i].uuid === item.uuid)) {
                delete this.list[i].uuid;
                this.list.splice(i, 1);
                i--;
            }
        }
    }

    find(property, value) {
        let b = value == undefined;

        for (let i = 0; i < this.list.length; i++) {
            if (b) {
                if (property(this.list[i])) return this.list[i];
            } else {
                if (this.list[i][property] == value) return this.list[i];
            }
        }

        return null;
    }

    toArray() {
        for (let i = 0; i < this.list.length; i++) {
            delete this.list[i].uuid;
        }

        return this.list;
    }

    destroy() {
        this.list = null;
    }
}); Pi.Namespace('Pi.Dictionary', class pidic extends Pi.Class {

    constructor(...args) {
        super(...args);

        this.list = [];
    }

    add(key, value) {
        this.list[key] = value;

        return this;
    }

    existKey(key) {
        return this.list[key] != undefined;
    }

    existValue(value) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            if (this.list[i] == value) return true;
        }

        return false;
    }

    getValue(key) {
        return this.list[key];
    }

    remove(key) {
        delete this.list[key];

        return this;
    }

    clear() {
        this.list = [];

        return this;
    }

    toArray() {
        return this.list;
    }

}); Pi.Namespace('Pi.As', class pias extends Pi.Class {

    constructor(...args) {
        super(...args);

        this.alias = new Pi.Dictionary();
    }

    add() {
        if (arguments.length < 2) {
            console.log("Pi.As: numero insulficiente de parametros");
            return false;
        }

        if (this.alias.existKey(arguments[0])) {
            console.log("Pi.As: este apelido ja foi definido: " + arguments[0]);
            return false;
        }

        let value = "";
        for (let i = 1; i < arguments.length; i++) {
            let as = arguments[i];

            if (this.alias.existKey(as)) {
                value += this.alias.getValue(as);
            } else {
                value += as;
            }
        }

        this.alias.add(arguments[0], value);

        return true;
    }

    update() {
        if (arguments.length < 2) {
            console.log("Pi.As: numero insulficiente de parametros");
            return false;
        }

        if (this.alias.existKey(arguments[0])) {
            this.remove(arguments[0]);
            return false;
        }

        let value = "";
        for (let i = 1; i < arguments.length; i++) {
            let as = arguments[i];

            if (this.alias.existKey(as)) {
                value += this.alias.getValue(as);
            } else {
                value += as;
            }
        }

        this.alias.add(arguments[0], value);

        return true;
    }

    remove(as) {
        this.alias.remove(as);

        return this;
    }

    exist(as) {
        return this.alias.existKey(as);
    }

    getValue(as) {
        let v = this.alias.getValue(as);

        if (this.exist(as) == false) {
            return null;
        } else if (this.alias.existKey(v)) {
            return this.getValue(v);
        } else {
            return v;
        }
    }

}); Pi.Namespace('Pi.Event', class pievent extends Pi.Class {

    constructor() {
        super();

        this.list = [];
    }

    listen(event, callback, ctx, once = false) {
        callback.id = Pi.Util.UUID('xxx-xx');
        this.list.push({ event: event, cb: callback, ctx: ctx, once: once });

        return this;
    }

    unlisten(event, cb = '*') {
        for (let i = this.list.length - 1; i >= 0; i--) {
            let item = this.list[i];
            if (item.event == event) {
                if (cb == '*' || cb.id == item.cb.id) {
                    this.list.splice(i, 1);
                    i--;
                }
            }
        }

        return this;
    }

    once(event, callback, ctx) {
        this.listen(event, callback, ctx, true);

        return this;
    }

    trigger(event, ...args) {
        let eventsOnce = [];

        for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].event == event) {
                let item = this.list[i];
                item.cb.apply(item.ctx, args);

                if (item.once) {
                    eventsOnce.push(item);
                }
            }
        }

        for (let i = eventsOnce.length - 1; i >= 0; i--) {
            this.unlisten(eventsOnce[i].event, eventsOnce[i].cb);
        }

        return this;
    }

    exist(event) {
        for (let i = this.list.length - 1; i >= 0; i--) {
            if (this.list[i].event == event) return true;
        }

        return false;
    }

    count() {
        return this.list;
    }

    clear() {
        this.list = [];

        return this;
    }

});

Pi.Namespace('Pi.PromiseCollection', class picollection extends Pi.Class {

    instances() {
        this.list = [];
    }

    add(p) {
        this.list.push(p);
    }

    wait() {
        return Pi.Promise.wait.apply(Pi.Promise, this.list);
    }

});

Pi.Namespace('Pi.Promise', class pipromise extends Pi.Class {

    constructor() {
        super();

        this.isOnce = false;

        this.clear();
    }

    static wait() {
        var promise = new Pi.Promise();
        var count = 0;
        var success = true;

        for (let i = 0; i < arguments.length; i++) {
            const arg = arguments[i];
            arg.done(() => {
                count++;
                if (count == arguments.length) {
                    success ? promise.callDone() : promise.callErr();
                }
            }).error(() => {
                success = false;
            });
        }

        return promise;
    }

    reset() {
        this.cbOk = [];
        this.cbErr = [];
        this.cbDone = [];

        return this;
    }

    clear() {
        this.cbOk = [];
        this.cbErr = [];
        this.cbDone = [];
        this.cbOnce = [];

        this.isOk = false;
        this.isErr = false;
        this.isDone = false;

        this.argOk = [];
        this.argErr = [];

        return this;
    }

    call(arr, args) {
        for (let i = arr.length - 1; i >= 0; i--) {
            arr[i].cb.apply(arr[i].context, args);
        }
    }

    callOnce() {
        this.isOk = true;
        this.call(this.cbOnce, this.argOk);
        this.cbOnce = [];
    }

    callOk() {
        this.isOk = true;
        this.call(this.cbOk, this.argOk);
    }

    callErr() {
        this.isErr = true;
        this.call(this.cbErr, this.argErr);
    }

    callDone() {
        this.isDone = true;
        this.call(this.cbDone, []);
    }

    resolve() {
        this.argOk = arguments;

        this.callOk();
        this.callOnce();
        this.callDone();

        if (this.isOnce) this.reset();

        return this;
    }

    reject() {
        this.argErr = arguments;

        this.callErr();
        this.callDone();

        if (this.isOnce) this.reset();

        return this;
    }

    ok(cb, context) {
        this.cbOk.push({ cb: cb, context: context });

        if (this.isOk) {
            this.callOk();
        }

        return this;
    }

    once(cb, context) {
        this.cbOnce.push({ cb: cb, context: context });

        if (this.isOk) {
            this.callOnce();
        }

        return this;
    }

    onceReady(cb, context) {
        if (this.isOk) {
            this.cbOnce.push({ cb: cb, context: context });
            this.callOnce();
        }

        return this;
    }

    error(cb, context) {
        this.cbErr.push({ cb: cb, context: context });

        if (this.isErr) {
            this.callErr();
        }

        return this;
    }

    done(cb, context) {
        this.cbDone.push({ cb: cb, context: context });

        if (this.isDone) {
            this.callDone();
        }

        return this;
    }
});

Pi.Namespace('Pi.Subdomains', class pisubdomains extends Pi.Class {

    instances() {
        this.list = [];
    }

    next(m) {
        var s = this.get(m);
        s.total++;
        return s.subdomains[s.subdomains.length % s.total];
    }

    exist(m) {
        return this.get(m) == null ? false : true;
    }

    add(m, s) {
        this.list.push({
            index: 0,
            module: m,
            subdomains: s,
            total: 0
        });
    }

    get(m) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].module == m) return this.list[i];
        }

        return null;
    }

});

Pi.Subdomains = new Pi.Subdomains();

Pi.Namespace('Pi.Callback', class picallback extends Pi.Class {

    constructor(...args) {
        super(...args);

        this.list = [];
    }

    clear() {
        this.list = [];
    }

    add(name, fn, ctx) {
        if (this.list[name] == null) {
            this.list[name] = [];
        }

        this.list[name].push({ name: name, fn: fn, ctx: ctx });

        return this;
    }

    remove(item) {
        if (!this.exist(item)) return this;

        this.list[name] = [];

        return this;
    }

    exist(name) {
        return this.list[name] != null;
    }

    get(name) {
        if (!this.exist(name)) return [];
        return this.list[name];
    }

    findAll(name) {
        return this.get(name);
    }

    trigger(name, ...args) {
        let arr = this.findAll(name);
        let r = undefined;

        for (let i = 0; i < arr.length; i++) {
            let item = arr[i];

            r = item.fn.apply(item.ctx, args);
        }

        return r;
    }
}); Pi.Namespace('Pi.Convert', class piconvert extends Pi.Class {

    static toPercent(n, dec = 2) {
        return new Number(n * 100).toFixed(dec);
    }

    static pixelToNumber(pixel) {
        let s = pixel.toString().replace(/px/gi, '');
        return Pi.Convert.stringToNumber(s);
    }

    static rgbToHex(rgb) {
        var _ = rgb.replace('rgb(', '').replace(')', '').replace(/\s*/, '');
        var p = _.split(',')
        var r = parseInt(p[0]);
        var g = parseInt(p[1]);
        var b = parseInt(p[2]);

        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    static numberToPixel(number) {
        if (Pi.Type.isNumber(number)) {
            return number + 'px';
        }

        if (number.toString().toLowerCase().indexOf('px') > -1) {
            return number;
        }

        return number + 'px';
    }

    static stringToNumber(str) {
        let n = Number(str);
        if (Pi.Type.isNumber(n)) return n;
        else return false;
    }

    static stringToBoolean(str) {
        if (str == undefined || str == null) return false;
        str = str.toString().toUpperCase();

        if (str == 'FALSE' || str == '0' || str == 0) return false;
        else return true;
    }

    static realToNumber(real) {
        real = real.toString();
        if (real.length == 0) return 0.00;

        let s = real.replace('R$', '').replace(/\s*/gi, '').replace(/\(/, '-').replace(/\)/, '').replace(/\./, "");
        s = s.replace(/\./, '');
        s = s.replace(/\,/, ".");

        return parseFloat(s);
    }

    static realToInt(real) {
        let n = Pi.Convert.realToNumber(real);
        return new Number(new Number(n).toFixed(0));
    }

    static numberToReal(dolar) {
        if (dolar == undefined) return '';
        if (dolar == null) return '';

        let c = new Number(dolar).toFixed(2),
            h = "",
            f = c.toString().split("."),
            a = f[0].toString().replace("-", ""),
            b = typeof f[1] == "undefined" ? "00" : f[1],
            g = "",
            d = 1;

        if (c.toString().indexOf("-") > -1) {
            h = "-"
        }

        for (var e = a.length - 1; e >= 0; e--) {
            g = a.charAt(e) + g;
            if (d % 3 == 0 && e != 0 && isFinite(a.charAt(e)) == true) {
                g = "." + g
            }
            d++
        }

        if (b.length == 1) {
            b += "0"
        }

        return h + g + "," + b
    }

});

module.exports = {
    Object: Pi.Object
};