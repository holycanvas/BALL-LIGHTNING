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
    get renderer () {
        if (!this._renderer) {
            var renderer = new THREE.WebGLRenderer( { canvas: platform.canvas, context: platform.context } );
            renderer.setPixelRatio( platform.systemInfo.devicePixelRatio );
            renderer.setSize( platform.systemInfo.screenWidth, platform.systemInfo.screenHeight );
            renderer.setClearColor(0xEEEEEE);
        }
        return this._renderer;
    },

    start: function (func) {
        gameCycle = func;
        this.resume();
    },

    pause: function () {
        if (routine != undefined) {
            cancelAnimationFrame(routine);
            routine = undefined;
        }
    },

    resume: function () {
        (function animate() {
            routine = requestAnimationFrame( animate );
            gameCycle();
        })();
    },

    loadLevel: function (name, onComplete) {
        var path = 'levels/' + name + '/config.json';
        App.context = { assets: {}};
        platform.fileSystem.readFile(path, 'utf8', function(err, config) {
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
                    onComplete && onComplete(err); 
                }
            }
        });
    }
}

export default bl;