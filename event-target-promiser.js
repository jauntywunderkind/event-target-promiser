export function EventTargetPromiserDescriptors( target, opt, ...names){
	if( typeof opt=== "string"){
		names.unshift( opt)
		opt= null
	}
	if( opt.names){
		names= [ ...opt.names, ...names]
	}
	opt= opt|| {}
	const
		props= {},
		cache= opt.cache!== false,
		passive= opt.passive!== false,
		listenerOptions= opt.listenerOptions|| {
			passive: opt.passive!== false,
			capture: opt.capture,
			once: true
		},
		early= opt.early,
		self= opt.self|| (this!== globalThis&& this)|| target, // only used by early
		target_= target

	for( let name of names){
		// build a getter for this name
		function get(){
			// figure out where we'll cache the resulting promise
			let
				cacheSymbol= get.cacheSymbol,
				cached= cacheSymbol&& this[ cacheSymbol]
			if( cached){
				// return cached promise
				return cached
			}
			// build a listener
			let resolve, reject
			function listener(){
				resolve()
			}
			// make a promise that returns
			const promise= new Promise( resolve_, reject_=> {
				resolve= resolve_
				reject= reject_
				// listen to EventTarget
				if( target.addEventListener){
					target.addEventListener( name, listener, listenerOptions)
				}else if( target.once){
					target.once( name, listener)
				}
				reject( new Error("Could find addEventListener"))
				
			})
			// store our in-progress state
			promise.listener= listener
			promise.target= target
			// cache for latter
			if( cacheSymbol){
				this[ cacheSymbol]= promise
			}
			return promise
		}
		if( cache){
			get.cacheSymbol= Symbol.for( name+ "PromiseCache")
		}
		if( early){
			// by running, we'll create the cached promise immediately
			get.call( self)
		}
		props[ name]= {
			get
		}
	}
	return props
}
export {
	EventTargetPromiserDescriptors as promiserDescriptors,
	EventTargetPromiserDescriptors as PromiserDescriptors
}

export function ApplyEventTargetPromiser( target, opt, ...names){
	if( typeof opt=== "string"){
		names.unshift( opt)
		opt= null
	}
	if( opt.names){
		names= [ ...opt.names, ...names]
	}
	opt= opt|| opt

	const
		self= opt.self|| (this!== globalThis&& this)|| target,
		props= EventTargetPromiserDescriptors( et, opt, ...names)
	Object.defineProperties( target, props)
	return self
}
export {
	ApplyEventTargetPromiser as default,
	ApplyEventTargetPromiser as applyEventTargetPromiser
}
