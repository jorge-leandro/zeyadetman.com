---
title: ازاي تويتر بيهندل ال emojis
date: "2021-11-06"
tags:
  - technical
  - emojis
layout: post
author: zeyadetman
comments: true
---

<div dir="rtl">
تعالوا نحكي فالثريد دي ازاي تويتر بيهندل ال emojis.
ال emojis دي زيها زي اي حاجة انت بتكتبها من الكيبورد عبارة عن unicode بيتحول لشكل character معين، زي حرف "أ" مثلًا او "A" او اي حاجة فاي لغة، بس مش كل الحروف طبعًا ليها نفس عدد ال unicodes chars يعني.
</br></br>
يعني ممكن تلاقي حرف في لغة تويتر بيحسبه بواحد وحرف في لغة تانية تويتر بيحسبه بحرفين من ال 280، ده بيرجع لان عشان ال character ده يترسم فالتويتة بتاعتك بياخد 2 unicodes مش واحد - بالمناسبة تويتر بيعمل normalize لل unicodes لو الحرف بياخد اكتر من unicode - المهم نرجع لل emojis فرضًا ال emoji ده ليه unicode كدة U+1f4bb فتويتر عشان تعرضه بتضطر تعمله serve as an image مش بتستني ال operating system/ browser يعرضه عشان مش كل ال OS هتعرض كل ال emojis بنفس الطريقة او هتعرضهم اصلا، فهو بياخد ال unicode ويحوله ل codepoint hex فبيبقي كدة 1f4bb

بعدين hex codepoint ده بيروح ع url بي serve ال emojis as svg زي كدة
https://twemoji.maxcdn.com/v/latest/svg/${codepoint}.svg

فبيكون كدة https://twemoji.maxcdn.com/v/latest/svg/1f4bb.svg وبكدة يكون عرف يعرض ال emoji on whatever device/OS/Browser you're running

لو مثلًا ال emoji بيتكون من 2 unicode characters فتويتر بي join بين ال codepoints بتوعهم ب dash - عشان ال path بتاعهم يكون valid

<h2>ليه بعض المرات لما تنزل ايموجيز جديدة لل ios ما تظهر في الأندرويد</h2>

ده بسبب ان ال emojis مش cross platform، فكل OS بتهندل ال unicodes بطريقة مختلفة، زيها بالظبط زى ال fonts، كل حرف ليه unicode معين بس كل font بيرسمه بشكل معين عشان كدة لو هتستخدم ال emojis on web فالافضل تستخدمهم كصور مش ك unicode عشان تضمن يتعرضوا فكل مكان

المصدر: https://github.com/twitter/twemoji-parser/blob/937079b964bd07381350ac2ea966e5c78c2a39ea/src/index.js#L20

الثريد ع تويتر:

<blockquote class="twitter-tweet"><p lang="ar" dir="rtl">تعالوا نحكي فالثريد دي ازاي تويتر بيهندل ال emojis.<br>ال emojis دي زيها زي اي حاجة انت بتكتبها من الكيبورد عبارة عن unicode بيتحول لشكل character معين، زي حرف &quot;أ&quot; مثلًا او &quot;A&quot; او اي حاجة فاي لغة، بس مش كل الحروف طبعًا ليها نفس عدد ال unicodes chars يعني .1</p>&mdash; Zeyad (🧑🏻‍💻from🏠) 🇪🇬🇵🇸 (@zeyadetman) <a href="https://twitter.com/zeyadetman/status/1299011072150601730?ref_src=twsrc%5Etfw">August 27, 2020</a></blockquote>

</div>
