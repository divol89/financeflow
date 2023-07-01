(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9755],{86010:function(e,r,t){"use strict";function o(){for(var e,r,t=0,o="";t<arguments.length;)(e=arguments[t++])&&(r=function e(r){var t,o,s="";if("string"==typeof r||"number"==typeof r)s+=r;else if("object"==typeof r){if(Array.isArray(r))for(t=0;t<r.length;t++)r[t]&&(o=e(r[t]))&&(s&&(s+=" "),s+=o);else for(t in r)r[t]&&(s&&(s+=" "),s+=t)}return s}(e))&&(o&&(o+=" "),o+=r);return o}t.r(r),t.d(r,{clsx:function(){return o}}),r.default=o},12294:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.EthereumProviderError=r.EthereumRpcError=void 0;let o=t(4445);class s extends Error{constructor(e,r,t){if(!Number.isInteger(e))throw Error('"code" must be an integer.');if(!r||"string"!=typeof r)throw Error('"message" must be a nonempty string.');super(r),this.code=e,void 0!==t&&(this.data=t)}serialize(){let e={code:this.code,message:this.message};return void 0!==this.data&&(e.data=this.data),this.stack&&(e.stack=this.stack),e}toString(){return o.default(this.serialize(),i,2)}}function i(e,r){if("[Circular]"!==r)return r}r.EthereumRpcError=s,r.EthereumProviderError=class extends s{constructor(e,r,t){if(!(Number.isInteger(e)&&e>=1e3&&e<=4999))throw Error('"code" must be an integer such that: 1000 <= code <= 4999');super(e,r,t)}}},92662:function(e,r){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.errorValues=r.errorCodes=void 0,r.errorCodes={rpc:{invalidInput:-32e3,resourceNotFound:-32001,resourceUnavailable:-32002,transactionRejected:-32003,methodNotSupported:-32004,limitExceeded:-32005,parse:-32700,invalidRequest:-32600,methodNotFound:-32601,invalidParams:-32602,internal:-32603},provider:{userRejectedRequest:4001,unauthorized:4100,unsupportedMethod:4200,disconnected:4900,chainDisconnected:4901}},r.errorValues={"-32700":{standard:"JSON RPC 2.0",message:"Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text."},"-32600":{standard:"JSON RPC 2.0",message:"The JSON sent is not a valid Request object."},"-32601":{standard:"JSON RPC 2.0",message:"The method does not exist / is not available."},"-32602":{standard:"JSON RPC 2.0",message:"Invalid method parameter(s)."},"-32603":{standard:"JSON RPC 2.0",message:"Internal JSON-RPC error."},"-32000":{standard:"EIP-1474",message:"Invalid input."},"-32001":{standard:"EIP-1474",message:"Resource not found."},"-32002":{standard:"EIP-1474",message:"Resource unavailable."},"-32003":{standard:"EIP-1474",message:"Transaction rejected."},"-32004":{standard:"EIP-1474",message:"Method not supported."},"-32005":{standard:"EIP-1474",message:"Request limit exceeded."},4001:{standard:"EIP-1193",message:"User rejected the request."},4100:{standard:"EIP-1193",message:"The requested account and/or method has not been authorized by the user."},4200:{standard:"EIP-1193",message:"The requested method is not supported by this Ethereum provider."},4900:{standard:"EIP-1193",message:"The provider is disconnected from all chains."},4901:{standard:"EIP-1193",message:"The provider is disconnected from the specified chain."}}},68797:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.ethErrors=void 0;let o=t(12294),s=t(68753),i=t(92662);function n(e,r){let[t,i]=d(r);return new o.EthereumRpcError(e,t||s.getMessageFromCode(e),i)}function a(e,r){let[t,i]=d(r);return new o.EthereumProviderError(e,t||s.getMessageFromCode(e),i)}function d(e){if(e){if("string"==typeof e)return[e];if("object"==typeof e&&!Array.isArray(e)){let{message:r,data:t}=e;if(r&&"string"!=typeof r)throw Error("Must specify string message.");return[r||void 0,t]}}return[]}r.ethErrors={rpc:{parse:e=>n(i.errorCodes.rpc.parse,e),invalidRequest:e=>n(i.errorCodes.rpc.invalidRequest,e),invalidParams:e=>n(i.errorCodes.rpc.invalidParams,e),methodNotFound:e=>n(i.errorCodes.rpc.methodNotFound,e),internal:e=>n(i.errorCodes.rpc.internal,e),server(e){if(!e||"object"!=typeof e||Array.isArray(e))throw Error("Ethereum RPC Server errors must provide single object argument.");let{code:r}=e;if(!Number.isInteger(r)||r>-32005||r<-32099)throw Error('"code" must be an integer such that: -32099 <= code <= -32005');return n(r,e)},invalidInput:e=>n(i.errorCodes.rpc.invalidInput,e),resourceNotFound:e=>n(i.errorCodes.rpc.resourceNotFound,e),resourceUnavailable:e=>n(i.errorCodes.rpc.resourceUnavailable,e),transactionRejected:e=>n(i.errorCodes.rpc.transactionRejected,e),methodNotSupported:e=>n(i.errorCodes.rpc.methodNotSupported,e),limitExceeded:e=>n(i.errorCodes.rpc.limitExceeded,e)},provider:{userRejectedRequest:e=>a(i.errorCodes.provider.userRejectedRequest,e),unauthorized:e=>a(i.errorCodes.provider.unauthorized,e),unsupportedMethod:e=>a(i.errorCodes.provider.unsupportedMethod,e),disconnected:e=>a(i.errorCodes.provider.disconnected,e),chainDisconnected:e=>a(i.errorCodes.provider.chainDisconnected,e),custom(e){if(!e||"object"!=typeof e||Array.isArray(e))throw Error("Ethereum Provider custom errors must provide single object argument.");let{code:r,message:t,data:s}=e;if(!t||"string"!=typeof t)throw Error('"message" must be a nonempty string');return new o.EthereumProviderError(r,t,s)}}}},79826:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.getMessageFromCode=r.serializeError=r.EthereumProviderError=r.EthereumRpcError=r.ethErrors=r.errorCodes=void 0;let o=t(12294);Object.defineProperty(r,"EthereumRpcError",{enumerable:!0,get:function(){return o.EthereumRpcError}}),Object.defineProperty(r,"EthereumProviderError",{enumerable:!0,get:function(){return o.EthereumProviderError}});let s=t(68753);Object.defineProperty(r,"serializeError",{enumerable:!0,get:function(){return s.serializeError}}),Object.defineProperty(r,"getMessageFromCode",{enumerable:!0,get:function(){return s.getMessageFromCode}});let i=t(68797);Object.defineProperty(r,"ethErrors",{enumerable:!0,get:function(){return i.ethErrors}});let n=t(92662);Object.defineProperty(r,"errorCodes",{enumerable:!0,get:function(){return n.errorCodes}})},68753:function(e,r,t){"use strict";Object.defineProperty(r,"__esModule",{value:!0}),r.serializeError=r.isValidCode=r.getMessageFromCode=r.JSON_RPC_SERVER_ERROR_MESSAGE=void 0;let o=t(92662),s=t(12294),i=o.errorCodes.rpc.internal,n={code:i,message:a(i)};function a(e,t="Unspecified error message. This is a bug, please report it."){if(Number.isInteger(e)){let s=e.toString();if(c(o.errorValues,s))return o.errorValues[s].message;if(e>=-32099&&e<=-32e3)return r.JSON_RPC_SERVER_ERROR_MESSAGE}return t}function d(e){if(!Number.isInteger(e))return!1;let r=e.toString();return!!(o.errorValues[r]||e>=-32099&&e<=-32e3)}function u(e){return e&&"object"==typeof e&&!Array.isArray(e)?Object.assign({},e):e}function c(e,r){return Object.prototype.hasOwnProperty.call(e,r)}r.JSON_RPC_SERVER_ERROR_MESSAGE="Unspecified server error.",r.getMessageFromCode=a,r.isValidCode=d,r.serializeError=function(e,{fallbackError:r=n,shouldIncludeStack:t=!1}={}){if(!r||!Number.isInteger(r.code)||"string"!=typeof r.message)throw Error("Must provide fallback error with integer number code and string message.");if(e instanceof s.EthereumRpcError)return e.serialize();let o={};if(e&&"object"==typeof e&&!Array.isArray(e)&&c(e,"code")&&d(e.code))o.code=e.code,e.message&&"string"==typeof e.message?(o.message=e.message,c(e,"data")&&(o.data=e.data)):(o.message=a(o.code),o.data={originalError:u(e)});else{o.code=r.code;let i=null==e?void 0:e.message;o.message=i&&"string"==typeof i?i:r.message,o.data={originalError:u(e)}}let l=null==e?void 0:e.stack;return t&&e&&l&&"string"==typeof l&&(o.stack=l),o}},4445:function(e){e.exports=n,n.default=n,n.stable=u,n.stableStringify=u;var r="[...]",t="[Circular]",o=[],s=[];function i(){return{depthLimit:Number.MAX_SAFE_INTEGER,edgesLimit:Number.MAX_SAFE_INTEGER}}function n(e,n,d,u){void 0===u&&(u=i()),function e(o,s,i,n,d,u,c){if(u+=1,"object"==typeof o&&null!==o){for(l=0;l<n.length;l++)if(n[l]===o){a(t,o,s,d);return}if(void 0!==c.depthLimit&&u>c.depthLimit||void 0!==c.edgesLimit&&i+1>c.edgesLimit){a(r,o,s,d);return}if(n.push(o),Array.isArray(o))for(l=0;l<o.length;l++)e(o[l],l,l,n,o,u,c);else{var l,f=Object.keys(o);for(l=0;l<f.length;l++){var p=f[l];e(o[p],p,l,n,o,u,c)}}n.pop()}}(e,"",0,[],void 0,0,u);try{f=0===s.length?JSON.stringify(e,n,d):JSON.stringify(e,c(n),d)}catch(l){return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]")}finally{for(;0!==o.length;){var f,p=o.pop();4===p.length?Object.defineProperty(p[0],p[1],p[3]):p[0][p[1]]=p[2]}}return f}function a(e,r,t,i){var n=Object.getOwnPropertyDescriptor(i,t);void 0!==n.get?n.configurable?(Object.defineProperty(i,t,{value:e}),o.push([i,t,r,n])):s.push([r,t,e]):(i[t]=e,o.push([i,t,r]))}function d(e,r){return e<r?-1:e>r?1:0}function u(e,n,u,l){void 0===l&&(l=i());var f,p=function e(s,i,n,u,c,l,f){if(l+=1,"object"==typeof s&&null!==s){for(g=0;g<u.length;g++)if(u[g]===s){a(t,s,i,c);return}try{if("function"==typeof s.toJSON)return}catch(p){return}if(void 0!==f.depthLimit&&l>f.depthLimit||void 0!==f.edgesLimit&&n+1>f.edgesLimit){a(r,s,i,c);return}if(u.push(s),Array.isArray(s))for(g=0;g<s.length;g++)e(s[g],g,g,u,s,l,f);else{var g,h={},m=Object.keys(s).sort(d);for(g=0;g<m.length;g++){var E=m[g];e(s[E],E,g,u,s,l,f),h[E]=s[E]}if(void 0===c)return h;o.push([c,i,s]),c[i]=h}u.pop()}}(e,"",0,[],void 0,0,l)||e;try{f=0===s.length?JSON.stringify(p,n,u):JSON.stringify(p,c(n),u)}catch(g){return JSON.stringify("[unable to serialize, circular reference is too complex to analyze]")}finally{for(;0!==o.length;){var h=o.pop();4===h.length?Object.defineProperty(h[0],h[1],h[3]):h[0][h[1]]=h[2]}}return f}function c(e){return e=void 0!==e?e:function(e,r){return r},function(r,t){if(s.length>0)for(var o=0;o<s.length;o++){var i=s[o];if(i[1]===r&&i[0]===t){t=i[2],s.splice(o,1);break}}return e.call(this,r,t)}}}}]);