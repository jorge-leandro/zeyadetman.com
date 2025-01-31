---
title: JavaScript and Object Keys
date: "2020-01-06"
author: zeyadetman
tags:
  - programming
  - javascript
  - frontend
comments: true
layout: post
---

Hello 👋 In this post we will try to use objects in a different wrong way 😃 by implement a frequency array in javascript.
But before we dive into this, We will discover what's the frequency array?

## Frequency Array on a sorted array
For example, If you have an array like this `const arr = [1,2,2,3,3,4];` and you want to count occurrences of each element, then you can iterate over the values and store them as keys of object and its value increasing according to the number of occurrences in the remainig array. And this is called a frequency array. The code below go through what I'm saying (Please Don't do this again):

```js
const arr = [1,2,2,3,3,4];
const result = {};
for(let i=0; i<arr.length; i++){
  if(arr[i] in result) result[arr[i]]++;
  else result[arr[i]] = 1;
}

console.log(result); // {1: 1, 2: 2, 3: 2, 4: 1}
```

Wow! that's cool and Right! But No. That's wrong! Why??
You're write this code and seems that works well, but try to add `-1` to the first of your array, then you'll discover that the final result is `{1: 1, 2: 2, 3: 2, 4: 1, -1: 1}`, Wait... But Why? You're wondering why the `-1` is in the end of the result object and you know the object in javascript sorting the keys by default. (Ummm not exactly!)
Objects' Keys in Javascript are `strings` and `symbols` only, you can't use any primitive values as keys except `strings` and `symbols` So the keys in your result aren't `numbers`, they're parsed to `strings` before storing as keys in object, but `"-1" < "1" === true` so still why `-1` moved to the end?!

*Note: `Symbol` Can be a key for objects, but it doesn't work like `strings`. [Read more...](https://2ality.com/2014/12/es6-symbols.html)*

## How Javascript objects order their keys?
Keys in Javascript objects are three types, +integer-like (0,1,2,3), strings, and symbols. And the order goes:
1. +Integer-like in ascending order. `-1` like our previous example or negatives in general aren't valid as an index, there's no `-1` index, So they're ordered as `strings`.
2. Strings in order of created, without any sort or comparison.
3. Symbols in order of created, without any sort or comparison.

Okay, So in our previous example, we figured out what happens while getting the result, Right?
But what if we want to get the right order?

## new Map()
To achieve our frequency array respecting keys insertion order we can use `new Map()` which allows keys to be anytype, so the code for this will be like this:

```js
const arr = [-1,1,2,3,4,3,2];
var result = new Map();
for(let i=0; i<arr.length; i++){
  if(result.has(arr[i])) {
    result.set(arr[i], result.get(arr[i])+1);
  }
  else result.set(arr[i], 1);
}

console.log(result); //Map(5) {-1 => 1, 1 => 1, 2 => 2, 3 => 2, 4 => 1}
```
Then we can iterate over it using `forEach` method.

## Resources
- [Symbols in ECMAScript 6](https://2ality.com/2014/12/es6-symbols.html)
- [14.4.2 Traversal order of properties](https://exploringjs.com/es6/ch_oop-besides-classes.html#_traversal-order-of-properties)
- [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
