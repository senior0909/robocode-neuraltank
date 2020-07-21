export default "importScripts('lib/tank.js');\n\nvar TankAI=function(t){var e={};function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){\"undefined\"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:\"Module\"}),Object.defineProperty(t,\"__esModule\",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&\"object\"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,\"default\",{enumerable:!0,value:t}),2&e&&\"string\"!=typeof t)for(var r in t)n.d(i,r,function(e){return t[e]}.bind(null,r));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,\"a\",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p=\"\",n(n.s=1)}([function(t,e,n){\"use strict\";Object.defineProperty(e,\"__esModule\",{value:!0}),e.BrainFieldType=void 0,function(t){t[t.ConnectionWeight=0]=\"ConnectionWeight\",t[t.Bias=1]=\"Bias\",t[t.ActivationType=2]=\"ActivationType\"}(e.BrainFieldType||(e.BrainFieldType={}))},function(t,e,n){\"use strict\";Object.defineProperty(e,\"__esModule\",{value:!0});var i=n(2),r=function(){function t(){this._collisionCounter=0}return t.prototype.init=function(t,e){this._brain=new i.default,this._brain.createLayers([6,7,6,4]),this._brain.restoreSnapshot(e.initData.braindump)},t.prototype.loop=function(t,e){var n,i;this._collisionCounter>0&&this._collisionCounter--;var r=null!==t.radar.wallDistance?t.radar.wallDistance:300;r=r/150-1;var o,a=300,u=0;if(t.radar.enemy){for(n=t.radar.enemy.x-t.x,i=t.radar.enemy.y-t.y,a=Math.sqrt(n*n+i*i),u=180/Math.PI*Math.atan2(t.radar.enemy.y-t.y,t.radar.enemy.x-t.x),u-=t.angle;u>180;)u-=360;for(;u<-180;)u+=360;u/=8}a=a/150-1,(t.collisions.ally||t.collisions.enemy||t.collisions.wall)&&(this._collisionCounter=30),o=[r,a,u,this._collisionCounter>0?1:0,t.radar.targetingAlarm?1:0,t.boost/200-1];var s=this._brain.process(o);e.THROTTLE=s[0],e.TURN=s[1],e.SHOOT=s[2]>0?.1:0,e.BOOST=s[3]>0?1:0},t}();e.default=r},function(t,e,n){\"use strict\";Object.defineProperty(e,\"__esModule\",{value:!0});var i=n(3),r=n(0),o=n(6),a=function(){function t(){this._network=[],this._connections=[],this._nodes=[],this.serializer=new o.default}return t.prototype.createLayers=function(t){var e,n,r;for(e=0;e<t.length;e++)for(this._network[e]=[],n=0;n<t[e];n++)this._network[e][n]=new i.default,this._nodes.push(this._network[e][n]);for(e=1;e<this._network.length;e++)for(n=0;n<this._network[e].length;n++)for(r=0;r<this._network[e-1].length;r++)this._network[e][n].setInput(r,this._network[e-1][r].getOutput(n)),this._connections.push(this._network[e-1][r].getOutput(n))},t.prototype.randomize=function(){for(var t=0;t<this._network.length;t++)for(var e=0;e<this._network[t].length;e++)this._network[t][e].randomize()},t.prototype.getNode=function(t,e){if(!this._network[t]||!this._network[t][e])throw new Error(\"Node not found (\"+t+\":\"+e+\")\");return this._network[t][e]},Object.defineProperty(t.prototype,\"layerCount\",{get:function(){return this._network.length},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,\"connectionCount\",{get:function(){return this._connections.length},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,\"nodeCount\",{get:function(){return this._nodes.length},enumerable:!1,configurable:!0}),t.prototype.getLayerSize=function(t){return this._network[t]?this._network[t].length:0},t.prototype.process=function(t){var e,n=[];for(e=0;e<t.length;e++)this.getNode(0,e).getInput(0).input=t[e];for(e=0;e<this._nodes.length;e++)this._nodes[e].process();var i=this._network[this._network.length-1];for(e=0;e<i.length;e++)n.push(i[e].getOutput(0).process());return n},t.prototype.createSnapshot=function(){this.serializer.allocate(2*this._nodes.length+this._connections.length);for(var t=0,e=0,n=0,i=0;i<this._network.length;i++)for(e=0;e<this._network[i].length;e++)if(this.serializer.write(this._network[i][e].bias,t++,r.BrainFieldType.Bias),this.serializer.write(this._network[i][e].activationType,t++,r.BrainFieldType.ActivationType),i!=this._network.length-1)for(n=0;n<this._network[i][e].outputCount;n++)this.serializer.write(this._network[i][e].getOutput(n).weight,t++,r.BrainFieldType.ConnectionWeight);return this.serializer.serialize()},t.prototype.restoreSnapshot=function(t){this.serializer.deserialize(t);for(var e=0,n=0,i=0,o=0;o<this._network.length;o++)for(n=0;n<this._network[o].length;n++)if(this._network[o][n].bias=this.serializer.read(e++,r.BrainFieldType.Bias),this._network[o][n].activationType=this.serializer.read(e++,r.BrainFieldType.ActivationType),o!=this._network.length-1)for(i=0;i<this._network[o][n].outputCount;i++)this._network[o][n].getOutput(i).weight=this.serializer.read(e++,r.BrainFieldType.ConnectionWeight)},t}();e.default=a},function(t,e,n){\"use strict\";Object.defineProperty(e,\"__esModule\",{value:!0});var i=n(4),r=n(5),o=function(){function t(){this._inputs=[],this._outputs=[],this._value=0,this._activation=new r.default(r.ActivationType.Linear),this.bias=0,this._inputCount=0,this._outputCount=0}return Object.defineProperty(t.prototype,\"inputCount\",{get:function(){return this._inputCount},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,\"outputCount\",{get:function(){return this._outputCount},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,\"activationType\",{get:function(){return this._activation.type},set:function(t){this._activation=new r.default(t)},enumerable:!1,configurable:!0}),t.prototype.getInput=function(t){return this._inputs[t]||(this._inputs[t]=new i.default),this._inputCount=Math.max(this._inputCount,t+1),this._inputs[t]},t.prototype.setInput=function(t,e){this._inputs[t]=e},t.prototype.getOutput=function(t){return this._outputs[t]||(this._outputs[t]=new i.default,this._outputs[t].input=this._value),this._outputCount=Math.max(this._outputCount,t+1),this._outputs[t]},t.prototype.configure=function(t,e,n,i){var r;for(r=0;r<t.length;r++)this.getInput(r).weight=t[r];for(r=0;r<e.length;r++)this.getOutput(r).weight=e[r];this.bias=n,this.activationType=i},t.prototype.randomize=function(){for(var t=0,e=this._inputs;t<e.length;t++){e[t].weight=2*Math.random()-1}for(var n=0,i=this._outputs;n<i.length;n++){i[n].weight=2*Math.random()-1}this.bias=2*Math.random()-1;var o=Object.keys(r.ActivationType).map((function(t){return Number.parseInt(t)})).filter((function(t){return!Number.isNaN(t)}));this.activationType=o[Math.floor(Math.random()*o.length)]},t.prototype.process=function(){for(var t=0,e=0,n=this._inputs;e<n.length;e++){t+=n[e].process()}t+=this.bias,t=this._activation.process(t),this._value=t;for(var i=0,r=this._outputs;i<r.length;i++){r[i].input=t}},t}();e.default=o},function(t,e,n){\"use strict\";Object.defineProperty(e,\"__esModule\",{value:!0});var i=function(){function t(){this.input=0,this.weight=1}return t.prototype.process=function(){return this.input*this.weight},t}();e.default=i},function(t,e,n){\"use strict\";var i;Object.defineProperty(e,\"__esModule\",{value:!0}),e.ActivationType=void 0,function(t){t[t.Linear=0]=\"Linear\",t[t.BinaryStep=1]=\"BinaryStep\",t[t.Sigmoid=2]=\"Sigmoid\",t[t.TanH=3]=\"TanH\",t[t.ReLU=4]=\"ReLU\",t[t.SoftPlus=5]=\"SoftPlus\",t[t.LeakyReLU=6]=\"LeakyReLU\",t[t.Gaussian=7]=\"Gaussian\"}(i=e.ActivationType||(e.ActivationType={}));var r=function(){function t(t){this._type=i.Linear,this._type=t}return Object.defineProperty(t.prototype,\"type\",{get:function(){return this._type},enumerable:!1,configurable:!0}),t.prototype.process=function(t){switch(this._type){case i.Linear:return t;case i.BinaryStep:return t<0?0:1;case i.Sigmoid:return t>100?1:t<-100?0:1/(1+Math.exp(-t));case i.TanH:return t>100?1:t<-100?-1:(Math.exp(t)-Math.exp(-t))/(Math.exp(t)+Math.exp(-t));case i.ReLU:return t<0?0:t;case i.SoftPlus:return t>100?t:Math.log(1+Math.exp(t));case i.LeakyReLU:return t>100?t:t<0?.1*t:t;case i.Gaussian:return t>100||t<-100?0:Math.exp(-t*t);default:throw new Error(\"Unsupported  activation type: \"+this._type)}},t}();e.default=r},function(t,e,n){\"use strict\";Object.defineProperty(e,\"__esModule\",{value:!0});var i=n(0),r=function(){function t(){}return t.prototype.allocate=function(t){this._data=new Uint32Array(t)},t.prototype.writeRaw=function(t,e,n,i){if(isNaN(t))throw new Error(\"valid numeric value is erquired\");if(n>=i)throw new Error(\"Incorrect scale (\"+n+\" - \"+i+\")\");if(e>=this._data.length)throw new Error(\"Index \"+e+\" out of range. Allocation: \"+this._data.length);t=((t=Math.min(i,Math.max(n,t)))-n)/(i-n),t*=4294967295,t=Math.round(t),this._data[e]=t},t.prototype.readRaw=function(t,e,n){if(e>=n)throw new Error(\"Incorrect scale (\"+e+\" - \"+n+\")\");var i=this._data[t];return i/=4294967295,i*=n-e,i+=e},t.prototype.write=function(t,e,n){switch(n){case i.BrainFieldType.ConnectionWeight:return this.writeRaw(t,e,-4,4);case i.BrainFieldType.Bias:return this.writeRaw(t,e,-1,1);case i.BrainFieldType.ActivationType:return this.writeRaw(Math.round(t),e,0,7);default:throw new Error(\"BrainFieldType(\"+n+\") not supported\")}},t.prototype.read=function(t,e){switch(e){case i.BrainFieldType.ConnectionWeight:return this.readRaw(t,-4,4);case i.BrainFieldType.Bias:return this.readRaw(t,-1,1);case i.BrainFieldType.ActivationType:return Math.round(this.readRaw(t,0,7));default:throw new Error(\"BrainFieldType(\"+e+\") not supported\")}},t.prototype.serialize=function(){if(!this._data)throw new Error(\"No data to serialize\");return this._data.buffer},t.prototype.deserialize=function(t){this._data=new Uint32Array(t)},t}();e.default=r}]);\n\nconst ai = new TankAI.default();\n\ntank.init(function(settings, info) {\n  ai.init(settings, info)\n});\n\ntank.loop(function(state, control) {\n  ai.loop(state, control);\n});\n";