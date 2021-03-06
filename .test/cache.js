#!/usr/bin/env node
import tape from "tape"
import Promiser from "../promiser.js"
import events from "events"

tape( "promiser", async function( t){
	const
		// start with an EventEmitter
		ee= new events.EventEmitter(),
		// create an accessor/cache object
		self= {},
		// populate accessor with getters
		promiser= Promiser.call( self, ee, "data"),
		// use the data getter
		data= self.data
	ee.emit( "data", 42)
	const result= await data
	t.equal( result, 42)
	t.end()
})

tape( "promiser on event-emitter", async function( t){
	const
		// start with an EventEmitter
		ee= new events.EventEmitter(),
		// populate accessor with getters
		promiser= Promiser( ee, "data"),
		// use the data getter now on event-emitter
		data= ee.data
	ee.emit( "data", 42)
	const result= await data
	t.equal( result, 42)
	t.end()
})

tape( "promiser caches", async function( t){
	const
		// start with an EventEmitter
		ee= new events.EventEmitter(),
		// populate accessor with getters
		promiser= Promiser( ee, "data"),
		// use the data getter now on event-emitter
		data1= ee.data,
		data2= ee.data
	t.equal( data1, data2)
	t.end()
})

tape( "promiser cache disabled", async function( t){
	const
		// start with an EventEmitter
		ee= new events.EventEmitter(),
		// populate accessor with getters
		promiser= Promiser( ee,{ cache: false}, "data"),
		// use the data getter now on event-emitter
		data1= ee.data,
		data2= ee.data
	t.notEqual( data1, data2)
	t.end()
})


// promiser can create multiple promises

// no cache
