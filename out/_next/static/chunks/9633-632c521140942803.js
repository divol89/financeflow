(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9633],{9008:function(t,e,n){t.exports=n(83121)},11163:function(t,e,n){t.exports=n(80880)},88357:function(t,e,n){"use strict";n.d(e,{w_:function(){return a}});var i=n(67294),r={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},o=i.createContext&&i.createContext(r),u=function(){return(u=Object.assign||function(t){for(var e,n=1,i=arguments.length;n<i;n++)for(var r in e=arguments[n])Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r]);return t}).apply(this,arguments)},s=function(t,e){var n={};for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&0>e.indexOf(i)&&(n[i]=t[i]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols)for(var r=0,i=Object.getOwnPropertySymbols(t);r<i.length;r++)0>e.indexOf(i[r])&&Object.prototype.propertyIsEnumerable.call(t,i[r])&&(n[i[r]]=t[i[r]]);return n};function a(t){return function(e){return i.createElement(c,u({attr:u({},t.attr)},e),function t(e){return e&&e.map(function(e,n){return i.createElement(e.tag,u({key:n},e.attr),t(e.child))})}(t.child))}}function c(t){var e=function(e){var n,r=t.attr,o=t.size,a=t.title,c=s(t,["attr","size","title"]),f=o||e.size||"1em";return e.className&&(n=e.className),t.className&&(n=(n?n+" ":"")+t.className),i.createElement("svg",u({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},e.attr,r,c,{className:n,style:u(u({color:t.color||e.color},e.style),t.style),height:f,width:f,xmlns:"http://www.w3.org/2000/svg"}),a&&i.createElement("title",null,a),t.children)};return void 0!==o?i.createElement(o.Consumer,null,function(t){return e(t)}):e(r)}},46747:function(t,e,n){"use strict";n.d(e,{QueryClient:function(){return i.S}});var i=n(56538),r=n(86755);n.o(r,"QueryClientProvider")&&n.d(e,{QueryClientProvider:function(){return r.QueryClientProvider}})},41909:function(t,e,n){"use strict";n.d(e,{E:function(){return o},j:function(){return r}});var i=console;function r(){return i}function o(t){i=t}},101:function(t,e,n){"use strict";n.d(e,{V:function(){return r}});var i=n(52288),r=new(function(){function t(){this.queue=[],this.transactions=0,this.notifyFn=function(t){t()},this.batchNotifyFn=function(t){t()}}var e=t.prototype;return e.batch=function(t){var e;this.transactions++;try{e=t()}finally{this.transactions--,this.transactions||this.flush()}return e},e.schedule=function(t){var e=this;this.transactions?this.queue.push(t):(0,i.A4)(function(){e.notifyFn(t)})},e.batchCalls=function(t){var e=this;return function(){for(var n=arguments.length,i=Array(n),r=0;r<n;r++)i[r]=arguments[r];e.schedule(function(){t.apply(void 0,i)})}},e.flush=function(){var t=this,e=this.queue;this.queue=[],e.length&&(0,i.A4)(function(){t.batchNotifyFn(function(){e.forEach(function(e){t.notifyFn(e)})})})},e.setNotifyFunction=function(t){this.notifyFn=t},e.setBatchNotifyFunction=function(t){this.batchNotifyFn=t},t}())},56538:function(t,e,n){"use strict";n.d(e,{S:function(){return O}});var i=n(87462),r=n(52288),o=n(94578),u=n(101),s=n(41909),a=function(){function t(){this.listeners=[]}var e=t.prototype;return e.subscribe=function(t){var e=this,n=t||function(){};return this.listeners.push(n),this.onSubscribe(),function(){e.listeners=e.listeners.filter(function(t){return t!==n}),e.onUnsubscribe()}},e.hasListeners=function(){return this.listeners.length>0},e.onSubscribe=function(){},e.onUnsubscribe=function(){},t}(),c=new(function(t){function e(){var e;return(e=t.call(this)||this).setup=function(t){var e;if(!r.sk&&(null==(e=window)?void 0:e.addEventListener)){var n=function(){return t()};return window.addEventListener("visibilitychange",n,!1),window.addEventListener("focus",n,!1),function(){window.removeEventListener("visibilitychange",n),window.removeEventListener("focus",n)}}},e}(0,o.Z)(e,t);var n=e.prototype;return n.onSubscribe=function(){this.cleanup||this.setEventListener(this.setup)},n.onUnsubscribe=function(){if(!this.hasListeners()){var t;null==(t=this.cleanup)||t.call(this),this.cleanup=void 0}},n.setEventListener=function(t){var e,n=this;this.setup=t,null==(e=this.cleanup)||e.call(this),this.cleanup=t(function(t){"boolean"==typeof t?n.setFocused(t):n.onFocus()})},n.setFocused=function(t){this.focused=t,t&&this.onFocus()},n.onFocus=function(){this.listeners.forEach(function(t){t()})},n.isFocused=function(){return"boolean"==typeof this.focused?this.focused:"undefined"==typeof document||[void 0,"visible","prerender"].includes(document.visibilityState)},e}(a)),f=new(function(t){function e(){var e;return(e=t.call(this)||this).setup=function(t){var e;if(!r.sk&&(null==(e=window)?void 0:e.addEventListener)){var n=function(){return t()};return window.addEventListener("online",n,!1),window.addEventListener("offline",n,!1),function(){window.removeEventListener("online",n),window.removeEventListener("offline",n)}}},e}(0,o.Z)(e,t);var n=e.prototype;return n.onSubscribe=function(){this.cleanup||this.setEventListener(this.setup)},n.onUnsubscribe=function(){if(!this.hasListeners()){var t;null==(t=this.cleanup)||t.call(this),this.cleanup=void 0}},n.setEventListener=function(t){var e,n=this;this.setup=t,null==(e=this.cleanup)||e.call(this),this.cleanup=t(function(t){"boolean"==typeof t?n.setOnline(t):n.onOnline()})},n.setOnline=function(t){this.online=t,t&&this.onOnline()},n.onOnline=function(){this.listeners.forEach(function(t){t()})},n.isOnline=function(){return"boolean"==typeof this.online?this.online:"undefined"==typeof navigator||void 0===navigator.onLine||navigator.onLine},e}(a));function l(t){return Math.min(1e3*Math.pow(2,t),3e4)}function h(t){return"function"==typeof(null==t?void 0:t.cancel)}var d=function(t){this.revert=null==t?void 0:t.revert,this.silent=null==t?void 0:t.silent};function v(t){return t instanceof d}var y=function(t){var e,n,i,o,u=this,s=!1;this.abort=t.abort,this.cancel=function(t){return null==e?void 0:e(t)},this.cancelRetry=function(){s=!0},this.continueRetry=function(){s=!1},this.continue=function(){return null==n?void 0:n()},this.failureCount=0,this.isPaused=!1,this.isResolved=!1,this.isTransportCancelable=!1,this.promise=new Promise(function(t,e){i=t,o=e});var a=function(e){u.isResolved||(u.isResolved=!0,null==t.onSuccess||t.onSuccess(e),null==n||n(),i(e))},v=function(e){u.isResolved||(u.isResolved=!0,null==t.onError||t.onError(e),null==n||n(),o(e))};!function i(){var o;if(!u.isResolved){try{o=t.fn()}catch(y){o=Promise.reject(y)}e=function(t){if(!u.isResolved&&(v(new d(t)),null==u.abort||u.abort(),h(o)))try{o.cancel()}catch(e){}},u.isTransportCancelable=h(o),Promise.resolve(o).then(a).catch(function(e){if(!u.isResolved){var o,a,h=null!=(o=t.retry)?o:3,d=null!=(a=t.retryDelay)?a:l,y="function"==typeof d?d(u.failureCount,e):d,p=!0===h||"number"==typeof h&&u.failureCount<h||"function"==typeof h&&h(u.failureCount,e);if(s||!p){v(e);return}u.failureCount++,null==t.onFail||t.onFail(u.failureCount,e),(0,r.Gh)(y).then(function(){if(!c.isFocused()||!f.isOnline())return new Promise(function(e){n=e,u.isPaused=!0,null==t.onPause||t.onPause()}).then(function(){n=void 0,u.isPaused=!1,null==t.onContinue||t.onContinue()})}).then(function(){s?v(e):i()})}})}}()},p=function(){function t(t){this.abortSignalConsumed=!1,this.hadObservers=!1,this.defaultOptions=t.defaultOptions,this.setOptions(t.options),this.observers=[],this.cache=t.cache,this.queryKey=t.queryKey,this.queryHash=t.queryHash,this.initialState=t.state||this.getDefaultState(this.options),this.state=this.initialState,this.meta=t.meta,this.scheduleGc()}var e=t.prototype;return e.setOptions=function(t){var e;this.options=(0,i.Z)({},this.defaultOptions,t),this.meta=null==t?void 0:t.meta,this.cacheTime=Math.max(this.cacheTime||0,null!=(e=this.options.cacheTime)?e:3e5)},e.setDefaultOptions=function(t){this.defaultOptions=t},e.scheduleGc=function(){var t=this;this.clearGcTimeout(),(0,r.PN)(this.cacheTime)&&(this.gcTimeout=setTimeout(function(){t.optionalRemove()},this.cacheTime))},e.clearGcTimeout=function(){this.gcTimeout&&(clearTimeout(this.gcTimeout),this.gcTimeout=void 0)},e.optionalRemove=function(){!this.observers.length&&(this.state.isFetching?this.hadObservers&&this.scheduleGc():this.cache.remove(this))},e.setData=function(t,e){var n,i,o=this.state.data,u=(0,r.SE)(t,o);return(null==(n=(i=this.options).isDataEqual)?void 0:n.call(i,o,u))?u=o:!1!==this.options.structuralSharing&&(u=(0,r.Q$)(o,u)),this.dispatch({data:u,type:"success",dataUpdatedAt:null==e?void 0:e.updatedAt}),u},e.setState=function(t,e){this.dispatch({type:"setState",state:t,setStateOptions:e})},e.cancel=function(t){var e,n=this.promise;return null==(e=this.retryer)||e.cancel(t),n?n.then(r.ZT).catch(r.ZT):Promise.resolve()},e.destroy=function(){this.clearGcTimeout(),this.cancel({silent:!0})},e.reset=function(){this.destroy(),this.setState(this.initialState)},e.isActive=function(){return this.observers.some(function(t){return!1!==t.options.enabled})},e.isFetching=function(){return this.state.isFetching},e.isStale=function(){return this.state.isInvalidated||!this.state.dataUpdatedAt||this.observers.some(function(t){return t.getCurrentResult().isStale})},e.isStaleByTime=function(t){return void 0===t&&(t=0),this.state.isInvalidated||!this.state.dataUpdatedAt||!(0,r.Kp)(this.state.dataUpdatedAt,t)},e.onFocus=function(){var t,e=this.observers.find(function(t){return t.shouldFetchOnWindowFocus()});e&&e.refetch(),null==(t=this.retryer)||t.continue()},e.onOnline=function(){var t,e=this.observers.find(function(t){return t.shouldFetchOnReconnect()});e&&e.refetch(),null==(t=this.retryer)||t.continue()},e.addObserver=function(t){-1===this.observers.indexOf(t)&&(this.observers.push(t),this.hadObservers=!0,this.clearGcTimeout(),this.cache.notify({type:"observerAdded",query:this,observer:t}))},e.removeObserver=function(t){-1!==this.observers.indexOf(t)&&(this.observers=this.observers.filter(function(e){return e!==t}),this.observers.length||(this.retryer&&(this.retryer.isTransportCancelable||this.abortSignalConsumed?this.retryer.cancel({revert:!0}):this.retryer.cancelRetry()),this.cacheTime?this.scheduleGc():this.cache.remove(this)),this.cache.notify({type:"observerRemoved",query:this,observer:t}))},e.getObserversCount=function(){return this.observers.length},e.invalidate=function(){this.state.isInvalidated||this.dispatch({type:"invalidate"})},e.fetch=function(t,e){var n,i,o,u,a,c,f=this;if(this.state.isFetching){if(this.state.dataUpdatedAt&&(null==e?void 0:e.cancelRefetch))this.cancel({silent:!0});else if(this.promise)return null==(n=this.retryer)||n.continueRetry(),this.promise}if(t&&this.setOptions(t),!this.options.queryFn){var l=this.observers.find(function(t){return t.options.queryFn});l&&this.setOptions(l.options)}var h=(0,r.mc)(this.queryKey),d=(0,r.G9)(),p={queryKey:h,pageParam:void 0,meta:this.meta};Object.defineProperty(p,"signal",{enumerable:!0,get:function(){if(d)return f.abortSignalConsumed=!0,d.signal}});var m=function(){return f.options.queryFn?(f.abortSignalConsumed=!1,f.options.queryFn(p)):Promise.reject("Missing queryFn")},b={fetchOptions:e,options:this.options,queryKey:h,state:this.state,fetchFn:m,meta:this.meta};return(null==(u=this.options.behavior)?void 0:u.onFetch)&&(null==(i=this.options.behavior)||i.onFetch(b)),this.revertState=this.state,this.state.isFetching&&this.state.fetchMeta===(null==(a=b.fetchOptions)?void 0:a.meta)||this.dispatch({type:"fetch",meta:null==(o=b.fetchOptions)?void 0:o.meta}),this.retryer=new y({fn:b.fetchFn,abort:null==d?void 0:null==(c=d.abort)?void 0:c.bind(d),onSuccess:function(t){f.setData(t),null==f.cache.config.onSuccess||f.cache.config.onSuccess(t,f),0===f.cacheTime&&f.optionalRemove()},onError:function(t){v(t)&&t.silent||f.dispatch({type:"error",error:t}),v(t)||(null==f.cache.config.onError||f.cache.config.onError(t,f),(0,s.j)().error(t)),0===f.cacheTime&&f.optionalRemove()},onFail:function(){f.dispatch({type:"failed"})},onPause:function(){f.dispatch({type:"pause"})},onContinue:function(){f.dispatch({type:"continue"})},retry:b.options.retry,retryDelay:b.options.retryDelay}),this.promise=this.retryer.promise,this.promise},e.dispatch=function(t){var e=this;this.state=this.reducer(this.state,t),u.V.batch(function(){e.observers.forEach(function(e){e.onQueryUpdate(t)}),e.cache.notify({query:e,type:"queryUpdated",action:t})})},e.getDefaultState=function(t){var e="function"==typeof t.initialData?t.initialData():t.initialData,n=void 0!==t.initialData?"function"==typeof t.initialDataUpdatedAt?t.initialDataUpdatedAt():t.initialDataUpdatedAt:0,i=void 0!==e;return{data:e,dataUpdateCount:0,dataUpdatedAt:i?null!=n?n:Date.now():0,error:null,errorUpdateCount:0,errorUpdatedAt:0,fetchFailureCount:0,fetchMeta:null,isFetching:!1,isInvalidated:!1,isPaused:!1,status:i?"success":"idle"}},e.reducer=function(t,e){var n,r;switch(e.type){case"failed":return(0,i.Z)({},t,{fetchFailureCount:t.fetchFailureCount+1});case"pause":return(0,i.Z)({},t,{isPaused:!0});case"continue":return(0,i.Z)({},t,{isPaused:!1});case"fetch":return(0,i.Z)({},t,{fetchFailureCount:0,fetchMeta:null!=(n=e.meta)?n:null,isFetching:!0,isPaused:!1},!t.dataUpdatedAt&&{error:null,status:"loading"});case"success":return(0,i.Z)({},t,{data:e.data,dataUpdateCount:t.dataUpdateCount+1,dataUpdatedAt:null!=(r=e.dataUpdatedAt)?r:Date.now(),error:null,fetchFailureCount:0,isFetching:!1,isInvalidated:!1,isPaused:!1,status:"success"});case"error":var o=e.error;if(v(o)&&o.revert&&this.revertState)return(0,i.Z)({},this.revertState);return(0,i.Z)({},t,{error:o,errorUpdateCount:t.errorUpdateCount+1,errorUpdatedAt:Date.now(),fetchFailureCount:t.fetchFailureCount+1,isFetching:!1,isPaused:!1,status:"error"});case"invalidate":return(0,i.Z)({},t,{isInvalidated:!0});case"setState":return(0,i.Z)({},t,e.state);default:return t}},t}(),m=function(t){function e(e){var n;return(n=t.call(this)||this).config=e||{},n.queries=[],n.queriesMap={},n}(0,o.Z)(e,t);var n=e.prototype;return n.build=function(t,e,n){var i,o=e.queryKey,u=null!=(i=e.queryHash)?i:(0,r.Rm)(o,e),s=this.get(u);return s||(s=new p({cache:this,queryKey:o,queryHash:u,options:t.defaultQueryOptions(e),state:n,defaultOptions:t.getQueryDefaults(o),meta:e.meta}),this.add(s)),s},n.add=function(t){this.queriesMap[t.queryHash]||(this.queriesMap[t.queryHash]=t,this.queries.push(t),this.notify({type:"queryAdded",query:t}))},n.remove=function(t){var e=this.queriesMap[t.queryHash];e&&(t.destroy(),this.queries=this.queries.filter(function(e){return e!==t}),e===t&&delete this.queriesMap[t.queryHash],this.notify({type:"queryRemoved",query:t}))},n.clear=function(){var t=this;u.V.batch(function(){t.queries.forEach(function(e){t.remove(e)})})},n.get=function(t){return this.queriesMap[t]},n.getAll=function(){return this.queries},n.find=function(t,e){var n=(0,r.I6)(t,e)[0];return void 0===n.exact&&(n.exact=!0),this.queries.find(function(t){return(0,r._x)(n,t)})},n.findAll=function(t,e){var n=(0,r.I6)(t,e)[0];return Object.keys(n).length>0?this.queries.filter(function(t){return(0,r._x)(n,t)}):this.queries},n.notify=function(t){var e=this;u.V.batch(function(){e.listeners.forEach(function(e){e(t)})})},n.onFocus=function(){var t=this;u.V.batch(function(){t.queries.forEach(function(t){t.onFocus()})})},n.onOnline=function(){var t=this;u.V.batch(function(){t.queries.forEach(function(t){t.onOnline()})})},e}(a),b=function(){function t(t){this.options=(0,i.Z)({},t.defaultOptions,t.options),this.mutationId=t.mutationId,this.mutationCache=t.mutationCache,this.observers=[],this.state=t.state||{context:void 0,data:void 0,error:null,failureCount:0,isPaused:!1,status:"idle",variables:void 0},this.meta=t.meta}var e=t.prototype;return e.setState=function(t){this.dispatch({type:"setState",state:t})},e.addObserver=function(t){-1===this.observers.indexOf(t)&&this.observers.push(t)},e.removeObserver=function(t){this.observers=this.observers.filter(function(e){return e!==t})},e.cancel=function(){return this.retryer?(this.retryer.cancel(),this.retryer.promise.then(r.ZT).catch(r.ZT)):Promise.resolve()},e.continue=function(){return this.retryer?(this.retryer.continue(),this.retryer.promise):this.execute()},e.execute=function(){var t,e=this,n="loading"===this.state.status,i=Promise.resolve();return n||(this.dispatch({type:"loading",variables:this.options.variables}),i=i.then(function(){null==e.mutationCache.config.onMutate||e.mutationCache.config.onMutate(e.state.variables,e)}).then(function(){return null==e.options.onMutate?void 0:e.options.onMutate(e.state.variables)}).then(function(t){t!==e.state.context&&e.dispatch({type:"loading",context:t,variables:e.state.variables})})),i.then(function(){return e.executeMutation()}).then(function(n){t=n,null==e.mutationCache.config.onSuccess||e.mutationCache.config.onSuccess(t,e.state.variables,e.state.context,e)}).then(function(){return null==e.options.onSuccess?void 0:e.options.onSuccess(t,e.state.variables,e.state.context)}).then(function(){return null==e.options.onSettled?void 0:e.options.onSettled(t,null,e.state.variables,e.state.context)}).then(function(){return e.dispatch({type:"success",data:t}),t}).catch(function(t){return null==e.mutationCache.config.onError||e.mutationCache.config.onError(t,e.state.variables,e.state.context,e),(0,s.j)().error(t),Promise.resolve().then(function(){return null==e.options.onError?void 0:e.options.onError(t,e.state.variables,e.state.context)}).then(function(){return null==e.options.onSettled?void 0:e.options.onSettled(void 0,t,e.state.variables,e.state.context)}).then(function(){throw e.dispatch({type:"error",error:t}),t})})},e.executeMutation=function(){var t,e=this;return this.retryer=new y({fn:function(){return e.options.mutationFn?e.options.mutationFn(e.state.variables):Promise.reject("No mutationFn found")},onFail:function(){e.dispatch({type:"failed"})},onPause:function(){e.dispatch({type:"pause"})},onContinue:function(){e.dispatch({type:"continue"})},retry:null!=(t=this.options.retry)?t:0,retryDelay:this.options.retryDelay}),this.retryer.promise},e.dispatch=function(t){var e=this;this.state=function(t,e){switch(e.type){case"failed":return(0,i.Z)({},t,{failureCount:t.failureCount+1});case"pause":return(0,i.Z)({},t,{isPaused:!0});case"continue":return(0,i.Z)({},t,{isPaused:!1});case"loading":return(0,i.Z)({},t,{context:e.context,data:void 0,error:null,isPaused:!1,status:"loading",variables:e.variables});case"success":return(0,i.Z)({},t,{data:e.data,error:null,status:"success",isPaused:!1});case"error":return(0,i.Z)({},t,{data:void 0,error:e.error,failureCount:t.failureCount+1,isPaused:!1,status:"error"});case"setState":return(0,i.Z)({},t,e.state);default:return t}}(this.state,t),u.V.batch(function(){e.observers.forEach(function(e){e.onMutationUpdate(t)}),e.mutationCache.notify(e)})},t}(),g=function(t){function e(e){var n;return(n=t.call(this)||this).config=e||{},n.mutations=[],n.mutationId=0,n}(0,o.Z)(e,t);var n=e.prototype;return n.build=function(t,e,n){var i=new b({mutationCache:this,mutationId:++this.mutationId,options:t.defaultMutationOptions(e),state:n,defaultOptions:e.mutationKey?t.getMutationDefaults(e.mutationKey):void 0,meta:e.meta});return this.add(i),i},n.add=function(t){this.mutations.push(t),this.notify(t)},n.remove=function(t){this.mutations=this.mutations.filter(function(e){return e!==t}),t.cancel(),this.notify(t)},n.clear=function(){var t=this;u.V.batch(function(){t.mutations.forEach(function(e){t.remove(e)})})},n.getAll=function(){return this.mutations},n.find=function(t){return void 0===t.exact&&(t.exact=!0),this.mutations.find(function(e){return(0,r.X7)(t,e)})},n.findAll=function(t){return this.mutations.filter(function(e){return(0,r.X7)(t,e)})},n.notify=function(t){var e=this;u.V.batch(function(){e.listeners.forEach(function(e){e(t)})})},n.onFocus=function(){this.resumePausedMutations()},n.onOnline=function(){this.resumePausedMutations()},n.resumePausedMutations=function(){var t=this.mutations.filter(function(t){return t.state.isPaused});return u.V.batch(function(){return t.reduce(function(t,e){return t.then(function(){return e.continue().catch(r.ZT)})},Promise.resolve())})},e}(a);function C(t,e){return null==t.getNextPageParam?void 0:t.getNextPageParam(e[e.length-1],e)}var O=function(){function t(t){void 0===t&&(t={}),this.queryCache=t.queryCache||new m,this.mutationCache=t.mutationCache||new g,this.defaultOptions=t.defaultOptions||{},this.queryDefaults=[],this.mutationDefaults=[]}var e=t.prototype;return e.mount=function(){var t=this;this.unsubscribeFocus=c.subscribe(function(){c.isFocused()&&f.isOnline()&&(t.mutationCache.onFocus(),t.queryCache.onFocus())}),this.unsubscribeOnline=f.subscribe(function(){c.isFocused()&&f.isOnline()&&(t.mutationCache.onOnline(),t.queryCache.onOnline())})},e.unmount=function(){var t,e;null==(t=this.unsubscribeFocus)||t.call(this),null==(e=this.unsubscribeOnline)||e.call(this)},e.isFetching=function(t,e){var n=(0,r.I6)(t,e)[0];return n.fetching=!0,this.queryCache.findAll(n).length},e.isMutating=function(t){return this.mutationCache.findAll((0,i.Z)({},t,{fetching:!0})).length},e.getQueryData=function(t,e){var n;return null==(n=this.queryCache.find(t,e))?void 0:n.state.data},e.getQueriesData=function(t){return this.getQueryCache().findAll(t).map(function(t){return[t.queryKey,t.state.data]})},e.setQueryData=function(t,e,n){var i=(0,r._v)(t),o=this.defaultQueryOptions(i);return this.queryCache.build(this,o).setData(e,n)},e.setQueriesData=function(t,e,n){var i=this;return u.V.batch(function(){return i.getQueryCache().findAll(t).map(function(t){var r=t.queryKey;return[r,i.setQueryData(r,e,n)]})})},e.getQueryState=function(t,e){var n;return null==(n=this.queryCache.find(t,e))?void 0:n.state},e.removeQueries=function(t,e){var n=(0,r.I6)(t,e)[0],i=this.queryCache;u.V.batch(function(){i.findAll(n).forEach(function(t){i.remove(t)})})},e.resetQueries=function(t,e,n){var o=this,s=(0,r.I6)(t,e,n),a=s[0],c=s[1],f=this.queryCache,l=(0,i.Z)({},a,{active:!0});return u.V.batch(function(){return f.findAll(a).forEach(function(t){t.reset()}),o.refetchQueries(l,c)})},e.cancelQueries=function(t,e,n){var i=this,o=(0,r.I6)(t,e,n),s=o[0],a=o[1],c=void 0===a?{}:a;return void 0===c.revert&&(c.revert=!0),Promise.all(u.V.batch(function(){return i.queryCache.findAll(s).map(function(t){return t.cancel(c)})})).then(r.ZT).catch(r.ZT)},e.invalidateQueries=function(t,e,n){var o,s,a,c=this,f=(0,r.I6)(t,e,n),l=f[0],h=f[1],d=(0,i.Z)({},l,{active:null==(o=null!=(s=l.refetchActive)?s:l.active)||o,inactive:null!=(a=l.refetchInactive)&&a});return u.V.batch(function(){return c.queryCache.findAll(l).forEach(function(t){t.invalidate()}),c.refetchQueries(d,h)})},e.refetchQueries=function(t,e,n){var o=this,s=(0,r.I6)(t,e,n),a=s[0],c=s[1],f=Promise.all(u.V.batch(function(){return o.queryCache.findAll(a).map(function(t){return t.fetch(void 0,(0,i.Z)({},c,{meta:{refetchPage:null==a?void 0:a.refetchPage}}))})})).then(r.ZT);return(null==c?void 0:c.throwOnError)||(f=f.catch(r.ZT)),f},e.fetchQuery=function(t,e,n){var i=(0,r._v)(t,e,n),o=this.defaultQueryOptions(i);void 0===o.retry&&(o.retry=!1);var u=this.queryCache.build(this,o);return u.isStaleByTime(o.staleTime)?u.fetch(o):Promise.resolve(u.state.data)},e.prefetchQuery=function(t,e,n){return this.fetchQuery(t,e,n).then(r.ZT).catch(r.ZT)},e.fetchInfiniteQuery=function(t,e,n){var i=(0,r._v)(t,e,n);return i.behavior={onFetch:function(t){t.fetchFn=function(){var e,n,i,o,u,s,a,c=null==(e=t.fetchOptions)?void 0:null==(n=e.meta)?void 0:n.refetchPage,f=null==(i=t.fetchOptions)?void 0:null==(o=i.meta)?void 0:o.fetchMore,l=null==f?void 0:f.pageParam,d=(null==f?void 0:f.direction)==="forward",v=(null==f?void 0:f.direction)==="backward",y=(null==(u=t.state.data)?void 0:u.pages)||[],p=(null==(s=t.state.data)?void 0:s.pageParams)||[],m=(0,r.G9)(),b=null==m?void 0:m.signal,g=p,O=!1,q=t.options.queryFn||function(){return Promise.reject("Missing queryFn")},P=function(t,e,n,i){return g=i?[e].concat(g):[].concat(g,[e]),i?[n].concat(t):[].concat(t,[n])},F=function(e,n,i,r){if(O)return Promise.reject("Cancelled");if(void 0===i&&!n&&e.length)return Promise.resolve(e);var o=q({queryKey:t.queryKey,signal:b,pageParam:i,meta:t.meta}),u=Promise.resolve(o).then(function(t){return P(e,i,t,r)});return h(o)&&(u.cancel=o.cancel),u};if(y.length){if(d){var w=void 0!==l,E=w?l:C(t.options,y);a=F(y,w,E)}else if(v){var S,Q=void 0!==l,Z=Q?l:null==(S=t.options).getPreviousPageParam?void 0:S.getPreviousPageParam(y[0],y);a=F(y,Q,Z,!0)}else!function(){g=[];var e=void 0===t.options.getNextPageParam;a=!c||!y[0]||c(y[0],0,y)?F([],e,p[0]):Promise.resolve(P([],p[0],y[0]));for(var n=function(n){a=a.then(function(i){if(!c||!y[n]||c(y[n],n,y)){var r=e?p[n]:C(t.options,i);return F(i,e,r)}return Promise.resolve(P(i,p[n],y[n]))})},i=1;i<y.length;i++)n(i)}()}else a=F([]);var A=a.then(function(t){return{pages:t,pageParams:g}});return A.cancel=function(){O=!0,null==m||m.abort(),h(a)&&a.cancel()},A}}},this.fetchQuery(i)},e.prefetchInfiniteQuery=function(t,e,n){return this.fetchInfiniteQuery(t,e,n).then(r.ZT).catch(r.ZT)},e.cancelMutations=function(){var t=this;return Promise.all(u.V.batch(function(){return t.mutationCache.getAll().map(function(t){return t.cancel()})})).then(r.ZT).catch(r.ZT)},e.resumePausedMutations=function(){return this.getMutationCache().resumePausedMutations()},e.executeMutation=function(t){return this.mutationCache.build(this,t).execute()},e.getQueryCache=function(){return this.queryCache},e.getMutationCache=function(){return this.mutationCache},e.getDefaultOptions=function(){return this.defaultOptions},e.setDefaultOptions=function(t){this.defaultOptions=t},e.setQueryDefaults=function(t,e){var n=this.queryDefaults.find(function(e){return(0,r.yF)(t)===(0,r.yF)(e.queryKey)});n?n.defaultOptions=e:this.queryDefaults.push({queryKey:t,defaultOptions:e})},e.getQueryDefaults=function(t){var e;return t?null==(e=this.queryDefaults.find(function(e){return(0,r.to)(t,e.queryKey)}))?void 0:e.defaultOptions:void 0},e.setMutationDefaults=function(t,e){var n=this.mutationDefaults.find(function(e){return(0,r.yF)(t)===(0,r.yF)(e.mutationKey)});n?n.defaultOptions=e:this.mutationDefaults.push({mutationKey:t,defaultOptions:e})},e.getMutationDefaults=function(t){var e;return t?null==(e=this.mutationDefaults.find(function(e){return(0,r.to)(t,e.mutationKey)}))?void 0:e.defaultOptions:void 0},e.defaultQueryOptions=function(t){if(null==t?void 0:t._defaulted)return t;var e=(0,i.Z)({},this.defaultOptions.queries,this.getQueryDefaults(null==t?void 0:t.queryKey),t,{_defaulted:!0});return!e.queryHash&&e.queryKey&&(e.queryHash=(0,r.Rm)(e.queryKey,e)),e},e.defaultQueryObserverOptions=function(t){return this.defaultQueryOptions(t)},e.defaultMutationOptions=function(t){return(null==t?void 0:t._defaulted)?t:(0,i.Z)({},this.defaultOptions.mutations,this.getMutationDefaults(null==t?void 0:t.mutationKey),t,{_defaulted:!0})},e.clear=function(){this.queryCache.clear(),this.mutationCache.clear()},t}()},86755:function(){},52288:function(t,e,n){"use strict";n.d(e,{A4:function(){return O},G9:function(){return q},Gh:function(){return C},I6:function(){return l},Kp:function(){return c},PN:function(){return s},Q$:function(){return function t(e,n){if(e===n)return e;var i=Array.isArray(e)&&Array.isArray(n);if(i||m(e)&&m(n)){for(var r=i?e.length:Object.keys(e).length,o=i?n:Object.keys(n),u=o.length,s=i?[]:{},a=0,c=0;c<u;c++){var f=i?c:o[c];s[f]=t(e[f],n[f]),s[f]===e[f]&&a++}return r===u&&a===r?e:s}return n}},Rm:function(){return v},SE:function(){return u},X7:function(){return d},ZT:function(){return o},_v:function(){return f},_x:function(){return h},mc:function(){return a},sk:function(){return r},to:function(){return p},yF:function(){return y}});var i=n(87462),r="undefined"==typeof window;function o(){}function u(t,e){return"function"==typeof t?t(e):t}function s(t){return"number"==typeof t&&t>=0&&t!==1/0}function a(t){return Array.isArray(t)?t:[t]}function c(t,e){return Math.max(t+(e||0)-Date.now(),0)}function f(t,e,n){return g(t)?"function"==typeof e?(0,i.Z)({},n,{queryKey:t,queryFn:e}):(0,i.Z)({},e,{queryKey:t}):t}function l(t,e,n){return g(t)?[(0,i.Z)({},e,{queryKey:t}),n]:[t||{},e]}function h(t,e){var n=t.active,i=t.exact,r=t.fetching,o=t.inactive,u=t.predicate,s=t.queryKey,a=t.stale;if(g(s)){if(i){if(e.queryHash!==v(s,e.options))return!1}else if(!p(e.queryKey,s))return!1}var c=!0===n&&!0===o||null==n&&null==o?"all":!1===n&&!1===o?"none":(null!=n?n:!o)?"active":"inactive";if("none"===c)return!1;if("all"!==c){var f=e.isActive();if("active"===c&&!f||"inactive"===c&&f)return!1}return("boolean"!=typeof a||e.isStale()===a)&&("boolean"!=typeof r||e.isFetching()===r)&&(!u||!!u(e))}function d(t,e){var n=t.exact,i=t.fetching,r=t.predicate,o=t.mutationKey;if(g(o)){if(!e.options.mutationKey)return!1;if(n){if(y(e.options.mutationKey)!==y(o))return!1}else if(!p(e.options.mutationKey,o))return!1}return("boolean"!=typeof i||"loading"===e.state.status===i)&&(!r||!!r(e))}function v(t,e){return((null==e?void 0:e.queryKeyHashFn)||y)(t)}function y(t){return JSON.stringify(a(t),function(t,e){return m(e)?Object.keys(e).sort().reduce(function(t,n){return t[n]=e[n],t},{}):e})}function p(t,e){return function t(e,n){return e===n||typeof e==typeof n&&!!e&&!!n&&"object"==typeof e&&"object"==typeof n&&!Object.keys(n).some(function(i){return!t(e[i],n[i])})}(a(t),a(e))}function m(t){if(!b(t))return!1;var e=t.constructor;if(void 0===e)return!0;var n=e.prototype;return!!(b(n)&&n.hasOwnProperty("isPrototypeOf"))}function b(t){return"[object Object]"===Object.prototype.toString.call(t)}function g(t){return"string"==typeof t||Array.isArray(t)}function C(t){return new Promise(function(e){setTimeout(e,t)})}function O(t){Promise.resolve().then(t).catch(function(t){return setTimeout(function(){throw t})})}function q(){if("function"==typeof AbortController)return new AbortController}},88767:function(t,e,n){"use strict";n.d(e,{QueryClient:function(){return i.QueryClient},QueryClientProvider:function(){return r.QueryClientProvider}});var i=n(46747);n.o(i,"QueryClientProvider")&&n.d(e,{QueryClientProvider:function(){return i.QueryClientProvider}});var r=n(31373)},31373:function(t,e,n){"use strict";n.d(e,{QueryClientProvider:function(){return f}});var i=n(101),r=n(73935).unstable_batchedUpdates;i.V.setBatchNotifyFunction(r);var o=n(41909),u=console;(0,o.E)(u);var s=n(67294),a=s.createContext(void 0),c=s.createContext(!1),f=function(t){var e=t.client,n=t.contextSharing,i=void 0!==n&&n,r=t.children;s.useEffect(function(){return e.mount(),function(){e.unmount()}},[e]);var o=i&&"undefined"!=typeof window?(window.ReactQueryClientContext||(window.ReactQueryClientContext=a),window.ReactQueryClientContext):a;return s.createElement(c.Provider,{value:i},s.createElement(o.Provider,{value:e},r))}},94578:function(t,e,n){"use strict";n.d(e,{Z:function(){return r}});var i=n(89611);function r(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,(0,i.Z)(t,e)}},89611:function(t,e,n){"use strict";function i(t,e){return(i=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(t,e){return t.__proto__=e,t})(t,e)}n.d(e,{Z:function(){return i}})}}]);