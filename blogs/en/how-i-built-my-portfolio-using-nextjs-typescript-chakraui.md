---
title: How I built my portfolio using NextJS, Typescript, and Chakra UI
date: "2021-10-24"
author: zeyadetman
tags:
  - programming
  - javascript
  - frontend
  - nextjs
  - chakra-ui
  - typescript
comments: true
layout: post
---

In this post I’ll go with you in a detailed way on how i created my blog/portfolio from scratch using NextJS and Chakra UI, from creating the pages and posts markdown files to displaying them as html files, And how I handled newsletter service, and deploying the project on Vercel, Handling custom domains. So this post will good for you if you want to know more about anything that I’ve implemented here on my blog.

**[Here's the source code for this site.](https://github.com/zeyadetman/zeyadetman.com)**

## NextJS + Typescript + Chakra UI
[`NextJS`](https://nextjs.org/) is one of the strongest framework to build a production project. I've used some features like SSG or pre-render pages at build time, API routes, file-system routing, fast refresh, configuration and deployments are super easy.

To get started just write this [`npx create-next-app@latest --ts`](https://nextjs.org/docs/api-reference/create-next-app).

The structure of the portfolio goes like that:

```
.
├── components
│   ├── Admin
│   ├── CareerStack
│   ├── ColorModeIcon
│   ├── Footer
│   ├── Layout
│   ├── MarkdownRender
│   ├── Navbar
│   └── Newsletter
├── configs
├── interfaces
├── libs
├── pages
│   ├── api
│   │   └── auth
│   └── posts
├── public
│   └── static
│       ├── images
│       └── sounds
├── styles
│   └── theme
└── utils
```

<br />
NextJS uses the `pages` folder to handle the app routes, as you may know if you created a file called `pages/hello.tsx` you can open it by visiting `your-app.com/hello` and that's super cool. So I created a folder called pages to handle the routes for the app. Also I created another folder called `components` to handle the react components that will be used across the pages.

Another feature of using NextJS is creating API routes, To do so you can create this folder `pages/api` and then create your apis inside it.

If you're building your projects with javascript, then you have to try [`typescript`](https://www.typescriptlang.org/), Typescript will definitely help you documenting your code as you go, Also it forces you to use the right type so this will decrease the bugs and speed up your productivity while you're coding.

Here's the styling part, I use [`chakra-ui`](https://chakra-ui.com/) for creating reactjs components and styles without writing css. Also Chakra ui is handling the app color mode, and much more in the styling part. You can customize the theme, declaring the default values for the app you can check this folder for further information about this `styles/theme`.

In the mode icon that appears at the top of the site, I've used two things to get this icon based on the current weather of your location. In your first visiting the app, I'm getting your location from `https://geolocation-db.com/json/` then store it in the cookies with `max-age=3600` expired after 60minutes. When i got your location, I got also the location's weather, then display the icon based on weather. I implemented the logic in this file `components/ColorModeIcon/index.tsx`.


## Name pronunciation
You probably have heard the pronunciation of my name when you clicked on the sound icon next to my name on the home page.

For this sound i just used [`Vocalizer`](https://github.com/atifazam/vocalizer) and downloaded my name's sound.
Added it to webpack config to identify the file extension and location `next.config.js`

```javascript
config.module.rules.push({
  test: /\.mp3$/,
  use: {
    loader: 'file-loader',
    options: {
      publicPath: '/_next/static/sounds/',
      outputPath: 'static/sounds/',
      name: '[name].[ext]',
      esModule: false,
    },
  },
});
```

And used it like below inside the `onClick` event handler for the icon:

```javascript
const audio = new Audio('/static/sounds/zeyad_ar.mp3');
audio.play();
```

## Analytics
Analytics is one of the most important parts for any product that users could use. I use Analytics here to just
track page views, but in the future i may use it for event tracking like clicking on subscription button
(Room for improvement).

To achieve this, I use Google Analytics and [countapi-js](https://github.com/mlomb/countapi-js).

I faced a problem here while using `countapi-js` because all of my old analytics have been tracked by Google analytics not `countapi-js`, and the target is delievering the actual pageviews for all pages, So i collect the old analytics from GA via this tool https://ga-dev-tools.web.app/query-explorer/

```
metrics= ga:pageviews
dimensions= ga:pagePath
```

After that I created a function to create a key in `countapi-js` set the key to page path and the default value is the GA pagePath page views count.

```javascript
countapi
  .create({
    namespace: site.namespace,
    key: pagePath,
    value: pageViews,
  })
```

For GA, I just added its initialization to `_document.tsx` file and using it via this line `gtag.pageview(url);` in the `_app.tsx` to track all pages listening to router changes.

So in the final producation version, The site is running with two tracking services GA and `countapi-js` and they're running independently. But I depend on `countapi-js` to view page views and it delivers the actual count as GA.

## Posts
Here's the most complicated part of the site, The Blog. But Nextjs made it so simple to organize and retrieve posts, In this section i'll go with you how i organized the blog posts files, not how i handled the markdown files, will explain this in the next section. So, Let's get started.

One of the biggest features in NextJS is [Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes). I created two files to handle the structure of the blogs `pages/posts/index.tsx` and `pages/posts/[slug].tsx` to handle the posts list, and the post page respectively.

I created a folder `blogs` in the project root for the blogs `.md` files, and in `libs/posts.ts` file, I created two helper functions `getPosts(): Promise<IPost[]>` and `getPostBySlug(slug: string): Promise<null | IPost>` - will explain more in the next section -, And used them in `pages/posts/index.tsx` and `pages/posts/[slug].tsx` in `getStaticProps()` Because we need this data to be updated in build time (rebuilding the site) and that make sense.

To know more about nextjs rendering/generating pages/data, look at this [site](https://static-next-willemliu.vercel.app/).

And here's how I use Next Link component with Chakra UI Link to do client-side routing, note that we're using `passHref` prop to pass href to the Link component. In this way we guarantee that the `[slug].ts` is reading the slug correctly using `router.query.slug`.

```javascript
// pages/posts/index.tsx

<NextLink href={`/posts/${fileName}`} passHref>
  <Link
    {...props}
  >
    {post.title}
  </Link>
</NextLink>
```

To handle the `404` in the not existing post urls, I use `getStaticPaths()` with `fallback: false`, Here's its code:

```javascript
export const getStaticPaths: GetStaticPaths = async () => {
  const postsSlugs = await getPosts();
  const slugs = postsSlugs.map((post) => ({
    params: { slug: post?.fileName },
  }));

  return {
    paths: slugs, // predefined posts urls
    fallback: false, // any paths not returned by getStaticPaths will result in a 404 page
  };
};
```

That's pretty much for this section, let's go with the next one, rendering markdown files.

## Rendering Markdown files
From the previous section, you should know that we're handling the post rendering in the `pages/posts/[slug].tsx`, So in this section we'll discuss the journey from writing the markdown files to rendering it as html file.

Libraries I've used to achieve this:
- [gray-matter](https://www.npmjs.com/package/gray-matter): Converts a string with front-matter to object.
- [reading-time](https://www.npmjs.com/package/reading-time): How long an article will take to read.
- [react-markdown](https://www.npmjs.com/package/react-markdown): Markdown component for React using remark.
- [react-syntax-highlighter](https://www.npmjs.com/package/react-syntax-highlighter): Syntax highlighting component for React.
- [rehype-raw](https://www.npmjs.com/package/rehype-raw): parse the tree again (and raw nodes). Keeping positional info OK.
- [remark-gfm](https://www.npmjs.com/package/remark-gfm): remark plugin to support GitHub Flavored Markdown.
- [remark-lint](https://www.npmjs.com/package/remark-lint): remark plugin to lint Markdown code style.

Now we've this folder `./blogs/` containing markdown files with front-matter and we need to convert these files to array of objects, sorted by date.

The below code snippet is to get the filenames.
```javascript
// libs/posts.ts

const { serverRuntimeConfig } = getConfig();
const postsDirectory = path.join(serverRuntimeConfig.PROJECT_ROOT, 'blogs');
const filenames = fs.readdirSync(postsDirectory);
```

Then I iterate over them to get the file contents using `gray-matter` and its readingTime estimation using `reading-time`
```javascript
// libs/posts.ts

const posts = filenames.map((filename: string) => {
  const filePath = path.join(postsDirectory, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { content, data, excerpt } = matter(fileContents, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line
    excerpt: (file: any): void => {
      file.excerpt = file.content
        .split('\n')
        .slice(
          0,
          site.post?.excerpt?.noOfLines
            ? site.post?.excerpt?.noOfLines + 1
            : 4
        )
        .join(' ');
    },
  });

  return {
    content,
    excerpt,
    data,
    fileName: path.parse(filePath).name,
    readingTime: readingTime(content),
  };
});

const postsSortedByDate = posts.sort(
  (a, b) => +new Date(b.data.date) - +new Date(a.data.date)
);
```

At this point we've the list of posts as objects. That's super cool! Let's continue, Now we need a react component to render the post content in html page without breaking the styles/markup language.

To do this, I've created a component `MarkdownWrapper` using `react-markdown` wrapper, Here's what i've done:

- For render `img` tag, I replaced it by `next/image` component, to handle image optimization on blog post images, Also i just added some styles to force the responsiveness of the rendered images

```javascript
// components/MarkdownRender/index.tsx

img({ src, alt }) {
  return (
    <Box width="100%" className="post-image-container">
      <Image
        src={src || ''}
        alt={alt}
        layout="fill"
        className="image"
      />
    </Box>
  );
},
```

```css
/* styles/globals.css */

.post-image-container {
  width: 100%;
}

.post-image-container > div {
  position: unset !important;
}

.post-image-container .image {
  object-fit: contain;
  width: 100% !important;
  position: relative !important;
  height: unset !important;
}
```
There's an important note here, Don't forget to update images domains in the `next.config.js` file.

- For code rendering, I use `react-syntax-highlighter` and `vscDarkPlus` theme like below

```javascript
// components/MarkdownRender/index.tsx

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

code({ inline, className, children, ...props }) {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match?.[1] === 'js' ? 'javascript' : match?.[1];
  return !inline && match ? (
    <SyntaxHighlighter
      style={vscDarkPlus}
      PreTag="div"
      showLineNumbers
      showInlineLineNumbers
      language={lang}
      customStyle={{ marginBottom: '2rem' }}
    >
      {String(children).replace(/\n$/, '') || ''}
    </SyntaxHighlighter>
  ) : (
    <Code {...props}>{children}</Code>
  );
},
```

That's all for this section. You can know more just looking at this file `components/MarkdownRender/index.tsx`.

## RSS and Newsletter
Okay, Here we have to do two things, first we need a `rss.xml` file generated from our posts files, second a newsletter service to send my new emails to followers - I hope you're one of them - And this service is https://www.getrevue.co/ It's free and promote the newsletter to your twitter profile.

So first thing we need to do is generating the `rss.xml` file, so we can list your blog posts as issues in your getrevue account.

To generate the `rss.xml` I used [`feed`](https://www.npmjs.com/package/feed) in `generateRSSFeed()` located here `libs/feed.ts` and calling it in a `getStaticProps()` function located in `pages/posts/index.tsx` to re-generate that file in build time.

After building and deploying the code I got this url https://www.zeyadetman.com/rss.xml with all posts metadata, Heading to https://www.getrevue.co/app/integrations/rss, And add the production url to `ADD A FEED` input. This will reflect in the issues page on getrevue account.

I highly recommend enabling Show newsletter on Twitter profile https://www.getrevue.co/app/integrations/twitter.

Right now we've just configured the newsletter service and RSS feeds. Another thing you may noticed if you want to add their  subscription form into your blog, It requires users to confirm subscription from their emails. You can disable this by using getrevue api with `double_opt_in: false` creating a custom form.

I used [`react-hook-form`](https://www.npmjs.com/package/react-hook-form) to create the form, Also created an api to handle the request

```javascript
// pages/api/subscribers.ts

const subscribeHandler = async (
	req: NextApiRequest,
	res: NextApiResponse<Data>
): Promise<NextApiResponse<Data> | void> => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const result = await fetch('https://www.getrevue.co/api/v2/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Token ${process.env.GETREVUE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, double_opt_in: false }), // to disable the confirmation email
  });

  const data = await result.json();

  if (!result.ok) {
    return res.status(500).json({ error: data.error.email[0] });
  }

  return res.status(201).json({ error: '' });
};
```
And used it simply like this

```javascript
// components/Newsletter/index.tsx

const { status } = await fetch('/api/subscribers', {
  method: 'POST',
  body: JSON.stringify({
    email: data.email,
  }),
  headers: {
    'Content-Type': 'application/json',
  },
});
```

To read more about handling the subscription form look at this file `components/Newsletter/index.tsx`, Also to know more about handling https in the custom domains for your getrevue, Please read the deployment section.

## Deployment
The final part is going production.
Until now I have implemented the app, and want to go production, I use [`vercel`](https://vercel.com/) it's the easist way to deploy your nextjs app.

Create new project, add the github repo of your project, don't forget to add the environment variables.

I'll keep this blog updated whenver I add a new feature to the blog. Just subscribe to the newsletter and I'll notify you via email.

### Here's some resources that helped me:
- [Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains#): This helps me link my godaddy custom domain to vercel deployment.
- [How to make your custom domain secure with SSL](http://help.getrevue.co/en/articles/4465817-how-to-make-your-custom-domain-secure-with-ssl): This helps me creating `https://feed.zeyadetman.com` and added it to getrevue custom domain.
- [How I Added an RSS Feed to My Next.js Site](https://ashleemboyer.com/how-i-added-an-rss-feed-to-my-nextjs-site): This helped me generating the rss.xml page.
- [How to Set up GoDaddy Domain with Vercel](https://kswanie21.medium.com/how-to-set-up-godaddy-domain-with-vercel-f42430ed4f6).


### Inspired Blogs:
- https://francoisbest.com/
- https://leerob.io/