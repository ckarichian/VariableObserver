# VariableObserver
A simple alternative to `Object.prototype.observe()` to easy attach onChange listeners/triggers for variables. 

Have you ever wanted to be able to trigger an event whenever a variable is changed, but don't want to rely on the not widely supported `Object.observe()` or `Object.watch()` methods? Now you can. Simply define certain variables you wish to watch and dynamically lock, unlock, set onChange, or onGet events.

## Setup

1. Include `variableObserver.js` in your script
2. Create a new instance of the `VariableObserver()` to hold a set of variables you wish to watch:
```javascript
var bank = new VariableObserver();
```
3. Add variables you wish to watch:
```javascript
bank.add('currentColor','Green').onChange(function(newVal, oldVal) { console.log('The currentColor was changed from '+oldVal+' to '+newVal)  });
```
4. Change your variable as much as you want:
```javascript
bank.currentColor = 'Red' // The currentColor was changed from Green to Red
```
5. Or read the variable as much as you want:
```javascript
console.log(bank.currentColor); // Red
bank.currentColor = 'Yellow'; // The currentColor was changed from Red to Yellow
console.log(bank.currentColor); // Yellow
```

## Chaining

You can chain any of the commands, or use them separately:

 ```javascript
bank.add('currentColor','Green').onChange(function(newVal, oldVal) { console.log('You changed currentColor')  });
```

is equivalent to 

 ```javascript
bank.add('currentColor','Green');
bank.onChange('currentColor',function(newVal, oldVal) { console.log('You changed currentColor')  });
```

## Methods

#### `.add(paramName[, startValue, onChange])`
- Add a variable to be watched. 
- @param {string} paramName - the variable name that you wish to append to the watched object.
- @param {string} [startValue=null] - the initial value of the variable
- @param {requestCallback} [onChange] - the function to call when the variable is changed. Returns `function(newVal, oldVal).

#### `.lock([paramName])`
- Prevents a variable from being changed
- @param {string} [paramName] - the variable name to lock; It must exist or else no action will occur
- Leave paramName blank if you are chaining

#### `.unlock([paramName])`
- Removes the lock from a variable
- @param {string} [paramName] - the variable name to unlock; It must exist or else no action will occur
- Leave paramName blank if you are chaining

#### `.silence([paramName])`
- Clears the onChange callback for the variable
- @param {string} [paramName] - the variable name to silence; It must exist or else no action will occur
- Leave paramName blank if you are chaining

#### `.select(paramName)`
- Selects a variable for the purposes of chaining
- @param {string} paramName - the variable name to select; A non-existing variable will return `false`

#### `.onChange([paramName,] onChange)`
- Set a function to trigger when the `paramName` value changes
- @param {string} [paramName] - the variable name that you wish to append to the watched object.
- @param {requestCallback} [onChange] - the function to call when the variable is changed. Returns `function(newVal, oldVal)`.

#### `.onGet([paramName,] onChange)`
#### `.toggle(paramName)`

## Debugging

Set `debug` to true to print debugging messages

```javascript
var bank = new VariableObserver();
bank.debug = true;
```

##Reserved Keywords

The following keywords cannot be added as they are reserved: debug, protoype, hasOwnProperty, constructor, propertyIsEnumerable, [as well as all reserved javascript keywords]
