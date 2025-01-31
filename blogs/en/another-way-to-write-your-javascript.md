---
title: Another way to write your JavaScript
date: "2019-09-09"
author: zeyadetman
tags:
  - programming
  - javascript
  - frontend
comments: true
---

Hi all, in this post I'll share with you some frontend code, that we can write it in another way,
And everything is working well, doesn't break the rules or putting smells in code, is cool.
<br />

## 1. Generate an array of sequential numbers `[1, 2, 3, ...., n]`

If we want to generate an array like this `[1, 2, 3, 4, 5, 6, ...., n]`, We can write code using `new Array()` with
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill">`Array.fill()`</a> so it'll be

```javascript
const N = 10;
new Array(N).fill().map((_, indx) => indx + 1); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

<a style="margin-bottom: 20px;" href="https://docs.google.com/document/d/1FBxDuUJmUt_udO9ofJGXF4GAM2ZoiWI-PTEeq9Gbf1w/edit#heading=h.yf7gjfvrq7gx">
Why `new Array(N).map()` doesn't work?
</a>

Cool, But if we're working on a large array of sequential numbers, Is this method will be the best?
Mmmm, No! because `new Array()` creates <a href="https://v8.dev/blog/elements-kinds">a holey array</a>
which is slow compared to <a href="https://v8.dev/blog/elements-kinds">packed arrays</a>. So we can avoid this and re-write this method
using <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from">`Array.from()`</a>
So the code will be

```javascript
const N = 10;
Array.from({ length: N }, (_, indx) => indx + 1); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

<figure style="margin: 15px">
    <img src="https://i.imgur.com/UWkajiz.png" width="700px" alt="new array()" />
    <i><figcaption>source: <a href="https://slidr.io/mathiasbynens/v8-internals-for-javascript-developers#102">
    https://slidrio-decks.global.ssl.fastly.net/1259/original.pdf?1521622174</a> <br />slide: 102</figcaption></i>
</figure>

you can check the holey array in your Chrome Console, so if we write this `new Array(10)` your console will display
`[empty × 10]` which is an array of empty values.

More Resources:

1. https://v8.dev/blog/elements-kinds
2. https://stackoverflow.com/questions/3746725/how-to-create-an-array-containing-1-n

## 2. Number formatting

Sometimes you want to write a money with specific currency `EGP 1000` or a size of something `50 kB` one of the ways to write it,
simply `const money = '1000 EGP'`. But there's a nicer way to write formatted numbers using <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat">`Intl.NumberFormat`</a>. So this strings will be

```javascript
const money = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "EGP",
  useGrouping: false,
  maximumSignificantDigits: 1
}).format(1000);
// "EGP 1000"

const storage = new Intl.NumberFormat("en", {
  style: "unit",
  unit: "kilobyte"
}).format(50);
// "50 kB"
```

_Note: style `units` works on chrome 77+, so you can use babel to compile it._

This is so cool, if you're working on multiple locale and want to switch between them in a better and fully customized way.
More info from <a href="https://v8.dev/features/intl-numberformat">V8 Blog: Intl.NumberFormat</a>

## 3. Styling NonInteracitve elements on focus
You can't do this using css/html without `tabindex` and according to [MDN][1]:

> Avoid using the `tabindex` attribute in conjunction with non-interactive content to make something intended to be interactive focusable by keyboard input. An example of this would be using an `<div>` element to describe a button, instead of the `<button>` element.

[and w3 says:][2]

> The content should be semantically described using interactive elements (`<a>`, `<button>`, `<details>`, `<input>`, `<select>`, `<textarea>`, etc.) instead.

So the best practice for this is using `addEventListener()` in `JavaScript`, But if you want to use `tabindex` don't forget to add `tabindex` to inner html content.

### Another solution

You don't have to use `tabindex` if you just want to change the `div` border.
you can use `:focus-within` and just change the border.

```css
.search-box {
  margin-left: 1%;
  outline: red;
  border: 1px solid #fc3;
}

.search-input {
  border: none;
}

.search-input:focus {
  outline: none;
}

.search-box:focus-within {
  border: 2px solid #53c9fc;
}
```

```html
<div class="search-box">
  <Row>
    <div class="search-box-icon"></div>
    <input class="search-input" placeholder="search in listbox" />
  </Row>
</div>
```

<a href="https://stackoverflow.com/a/55087153/5721245">_I published this as an answer on stackoverflow_</a>

Finally, I believe that everyone of us has a style writing code, his favorite practices that they don't break the rules,
or putting smells in code.

[1]: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex#Accessibility_concerns
[2]: https://www.w3.org/TR/html401/interact/forms.html#adef-tabindex
