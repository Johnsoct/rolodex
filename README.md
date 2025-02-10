# Rolodex

A web component for animating "power" or "audience-specific" text in HTML header elements.

```js
// index.js
import "@chrisjohnsoct/rolodex"
```

```HTML
<h1>
    GitHub... the most
    <rolodex-animation 
        interval="3000"
        options="['amazing', 'wonderful', 'incredible']"
        transition-duration="1"
        transition-timing-function="step-start"
    ></rolodex-animation>
    GIT repository in the world!
</h1>
```

https://github.com/user-attachments/assets/4417e1b4-f8d4-486d-9c80-ce29d2c4650b


## Options (attributes)

| option | required | default | description |
| --- | --- | --- | --- |
| interval | No | 3000 | Interval milliseconds for time between animations |
| options | Yes | [] | An array of text options to animate through |
| transition-duration | No | 1 | Number of seconds of the animation in and out |
| transition-timing-function | No | "ease-in" | Animation curve of elements coming in and out |

## Intentions

1. Framework/library agnostic
2. Target multiple audiences without writing custom copy for every audience deviation within your product or service, such as:

```html
<h1>
    Attention
    <rolodex-animation options="['Mac', 'Linux']"></rolodex-animation>
    users!
</h1>
```

## Rolodex? What's a rolodex?

The original contacts app...

<br>
<br>
<img src="https://github.com/user-attachments/assets/787bc819-2650-4051-ba7a-8317922557b3" alt="rolodex" width="200"/>

## Tech

I chose a very complex, but highly optimal, type-safe, scalable, and reliable tech stack...

- HTML
- CSS
- Typescript
