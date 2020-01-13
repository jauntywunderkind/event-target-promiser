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
		dataPromise= self.data
	ee.emit( "data", 42) // create 4
	const data= await dataPromise
	t.equal( data, 42, "data=42")
	t.notOk( ee.data, "EventTarget is unchanged")
	t.end()
})

tape( "promiser on event-emitter", async function( t){
	const
		// start with an EventEmitter
		ee= new events.EventEmitter(),
		// populate accessor with getters
		promiser= Promiser( ee, "data"),
		// use the data getter now on event-emitter
		dataPromise= ee.data
	ee.emit( "data", 42)
	const data= await dataPromise
	t.equal( data, 42)
	t.end()
})
