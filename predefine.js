/***************************************************************************
MIT License

Copyright (c) 2019 Santy-Wang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*****************************************************************************/
var _global = typeof window === 'undefined' ? global : window;
var globalDefs = {};

function defineMacro (name, value) {
    globalDefs[name] = _global[name] = value;
}

defineMacro('BL_DEV', typeof BL_DEV !== 'undefined' ? BL_DEV : (typeof global === 'undefined' ? false : true));
defineMacro('BL_TEST', (typeof BL_TEST !== 'undefined' ? BL_TEST : false) && BL_DEV);
defineMacro('BL_BUILD', !BL_DEV);
defineMacro('BL_DEBUG', typeof BL_DEBUG !== 'undefined' ? BL_DEBUG : false);
defineMacro('BL_RELEASE', BL_BUILD && !BL_DEBUG);
defineMacro('BL_WECHAT', typeof BL_WECHAT !== 'undefined' ? BL_WECHAT : typeof wx === 'undefined' ? false : true);
defineMacro('BL_FACEBOOK', typeof BL_FACEBOOK !== 'undefined' ? BL_FACEBOOK :typeof FBInstant === 'undefined' ? false : true);
defineMacro('BL_PC', !BL_WECHAT && !BL_FACEBOOK);

module.exports = globalDefs;
