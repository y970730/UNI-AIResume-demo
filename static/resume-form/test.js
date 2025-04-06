let objA = { name: 'Alice' };
let arrA = [];

arrA.push(objA);  // 将 objA 的引用推入 arrA
console.log(arrA);  // [{ name: 'Alice' }]

objA.name = 'Bob';  // 修改 objA 为新的对象
arrA.push(objA);  // 将新的 objA（即 objB）推入 arrA
console.log(arrA); 