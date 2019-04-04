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
var routine, gameCycle, textureLoader;
 
var bl = {
    get version () {
        return 1;
    },

    get canvas () {
        return canvas;
    },

    get context () {
        return this._context;
    },

    get renderer () {
        return this._renderer;
    },

    get fileSystem () {
        return this._fs;
    },

    get systemInfo () {
        return this._systemInfo;
    },

    init: function () {
        try {
            this._systemInfo = wx.getSystemInfoSync();
            this._fs = wx.getFileSystemManager();
            this._context = this.canvas.getContext( 'webgl' );
            this._renderer = new THREE.WebGLRenderer( { canvas: this.canvas, context: this.context } );
            this.renderer.setPixelRatio( this.systemInfo.devicePixelRatio );
            this.renderer.setSize( this.systemInfo.screenWidth, this.systemInfo.screenHeight );
            this.renderer.setClearColor(0xEEEEEE);
        }
        catch (e) {
            console.error(e)
            this.exit();
        }
    },

    exit: function () {
        wx.exitMiniProgram();
    }
}

App.readFile = function (path, encoding, callback) {
    fs.readFile({
        filePath: path,
        encoding: encoding,
        success: function (res) {
            callback(null, res.data);
        },

        fail: function () {
            callback(new Error('read file failed!'));
        }
    })
};

App.run = function (func) {
    gameCycle = func;
    this.resume();
};

App.pause = function () {
    if (routine != undefined) {
        cancelAnimationFrame(routine);
        routine = undefined;
    }
};

App.resume = function () {
    (function animate() {
        routine = requestAnimationFrame( animate );
        gameCycle();
    })();
};

App.startLevel = function (name, callback) {
    var path = 'levels/' + name + '/config.json';
    App.context = { assets: {}};
    this.readFile(path, 'utf8', function(err, config) {
        if (!err) {
            config = JSON.parse(config);
            var sharedAssets = config.sharedAssets;
            for (var i = 0, j = sharedAssets.length; i < j; i ++) {

            }

            var assets = config.assets;
            let count = 0;
            for (let i = 0, j = assets.length; i < j; i ++) {
                var asset = assets[i];
                if (asset.type === 'texture') {
                    textureLoader.load('levels/' + name + '/' + asset.url, function (texture) {
                        App.context.assets[asset.url] = texture;
                        count++;
                        if (count === assets.length) loadScripts();
                    });
                }
            }
            function loadScripts () {
                var deps = config.deps;
                for (let i = 0, j = deps.length; i < j; i ++) {
                    require('../' + deps[i]);
                }
    
                var scripts = config.scripts;
                for (let i = 0, j = scripts.length; i < j; i ++) {
                    require('../' + scripts[i]);
                }
                callback && callback(err); 
            }
        }
        
    });
}

export default App;