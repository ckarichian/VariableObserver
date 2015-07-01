/*
	VariableObserver (version 0.1beta)
	A simple alternative to Object.prototype.observe() to easy attach onChange listeners/triggers for variables. 

	The MIT License (MIT)
	Copyright (c) 2015 Carl Karichian

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
	*/
(function(global, factory)
{
	if (typeof define === 'function' &&
		define.amd)
	{
		define([], factory);
	}
	else if (typeof module !==
		'undefined' && module.exports)
	{
		module.exports = factory();
	}
	else
	{
		global.VariableObserver = factory();
	}
})(this, function()
{

	//Define the VariableObserver and its properties
	function VariableObserver()
	{
		/**
			Private Variables 
		*/

		/** private variable to hold the values of the set variables. The benefit to this method 
		   is that the variables cannot be accessed any other way */
		var properties = {};

		/** the current parameter being worked on, for chaining */
		var cur_param = null;

		/** variable to refer to self */
		var self = this;
		
		/** forbidden variable names */
		var forbidden = ['debug', 'prototype', 'hasOwnProperty', 'constructor', 'propertyIsEnumerable'];

		/**
			Public Variables 
		*/

		/** determine whether debug messages should be printed to the console */
		this.debug = false;

		/**
		*	A helper function to determine whether to chain or not
		*	@param {string} p - the parameter name to check
		*/
		var check = function(p)
		{
			cur_param = (typeof(p) !== 'undefined' &&
				typeof(p) === 'string' &&
				properties.hasOwnProperty(p)) ? p : cur_param;
			if(cur_param == null) throw 'PARAM_MISSING : A variable name must be entered or chained to silence it';
			return true;
		}

		/**
		*	Ends the chain
		*/
		this.end = function()
		{
			cur_param = null;
			return self;
		}

		/**
		*	Add a new variable to the watcher bank
		*	@param {string} param - the parameter name to add
		*	@param {string} [initialValue] - the starting value of the variable
		*   @param {requestCallback} [onChange] - the function to call when the variable is changed
		*/
		this.add = function(param, initialValue, onChange)
		{
			if(typeof(param) != 'string' || forbidden.indexOf(param) > -1) 
				throw 'ADD_ERROR: Invalid variable name';
			
			cur_param = param;
						
			if (this.hasOwnProperty(param))	delete this[param];
			properties[param] = 
			{
				stored: initialValue,
				onchange: ((typeof(onChange) == 'function') ? onChange : function () {}),
				onget: function () {},
				locked: false
			}

			Object.defineProperty(this, param,
			{
				get: function()
				{
					properties[param].onget();
					return properties[param].stored;
				},
				set: function(value)
				{
					if (!properties[param].locked)
					{
						properties[param].onchange(value, properties[param].stored);
						properties[param].stored = value;
					}
				}
			});

			return self;
		}
		
		/**
		*	Silence the onGet and onChange listeners for a particular variable. 
		*	@param {string} [param] - the parameter name to silence
		*/
		this.silence = function(param)
		{
			check(param);
			properties[cur_param].onGet = function() {};
			properties[cur_param].onChange = function() {};
			if(this.debug) console.debug('VariableObserver','silenced',cur_param);
			return self;
		}

		/**
		*	Lock a variable from being changed. Setting a locked variable value will have no effect
		*	@param {string} [param] - the parameter name to lock
		*/
		this.lock = function(param)
		{
			check(param);
			properties[cur_param].locked = true;
			if(this.debug) console.debug('VariableObserver','locked',cur_param);
			return self;
		}

		/**
		*	Toggle a variable's lock state from being changed
		*	@param {string} [param] - the parameter name to toggle
		*/
		this.toggle = function(param)
		{
			check(param);
			properties[cur_param].locked = !properties[cur_param].locked;
			if(this.debug) console.debug('VariableObserver',((properties[cur_param].locked)? 'locked' : 'unlocked'),cur_param);
			return self;
		}
		
		/**
		*	Unlock a variable's lock state
		*	@param {string} [param] - the parameter name to unlock
		*/
		this.unlock = function(param)
		{
			check(param);
			properties[cur_param].locked = false;
			if(this.debug) console.debug('VariableObserver','unlocked',cur_param);
			return self;
		}

		/**
		*	Attach a listener for the variable onChange
		*	@param {string} [param] - the parameter name to set
		*   @param {requestCallback} onChange - the function to call when the variable is changed
		*/
		this.onchange = function(param, onChange)
		{			
			if(this.debug) console.debug('VariableObserver','addlistener onchange',cur_param);
			return this.addListener('onchange',param,onChange);
		}

		/**
		*	Attach a listener for the variable onGet
		*	@param {string} [param] - the parameter name to set
		*   @param {requestCallback} onChange - the function to call when the variable is retrieved
		*/
		this.onget = function(param, onGet)
		{		
			if(this.debug) console.debug('VariableObserver','addlistener onget',cur_param);
			return this.addListener('onget',param,onGet);
		}

		/**
		*	Attach a listener to the properties
		*	@param {string} callCase - whether to set the onget or the onchange
		*	@param {string} param - the parameter name
		*   @param {requestCallback} listener - the function to call when the variable is changed
		*/
		this.addListener = function(callCase, param, listener)
		{
			switch(typeof(param)) 
			{
				case 'function':
					check(cur_param);
					listener = param;  
				break;
				case 'string':
					check(param);
					listener = (typeof(listener) == 'function') ? listener : null;
				break;
				default:
					throw 'LISTENER_ERROR : Improperly defined listener requested';
			}
			
			if(!listener) throw 'LISTENER_ERROR : The listener was not properly defined';
			
			properties[cur_param][callCase] = listener;
			
			return self;
		}
		
		/**
		*	Select a variable for the purposes of chaining
		*	@param {string} [param] - the parameter name to chain
		*/
		this.select = function(param)
		{
			if (typeof(param) != 'string' && !properties.hasOwnProperty(param)) 
				throw 'SELECT_ERROR : A proper parameter must be identified to select';
			cur_param = param;
			return self;
		}
	}
	return VariableObserver;
});
