# Example Usage
```javascript
var bank = new VariableObserver();

bank.add('savings');
bank.select('savings').onchange(function(n,o) { console.log(o+'->'+n) });
bank.savings = '100'; // Console: undefined->100
bank.lock('savings');
bank.savings = '200';
console.log(bank.savings); // Console: 100
bank.toggle('savings');
bank.savings = '300'; // Console: 100->300
console.log(bank.savings); // Console: 300
bank.add('chequing',500,function(n,o) { console.log('Stop spending your money!') });
bank.chequing++; //Console: Stop spending your money
console.log(bank.chequing); // Console: 501
bank.onget('savings',function () { bank.chequing = bank.chequing - 10; });
console.log(bank.savings); // Console: Stop Spending your money! // Console: 300
console.log(bank.chequing); // Console: 491
```
