# Rolodex 
A web component for animating "power words" in HTML header elements (vue component version coming soon!)
```HTML
<head>
    <script src="rolodex.js" type="module"></script>
</head>
<body>
    <!-- I'd probably never actually break a text component down like this, but for line length sake... -->
    <h1>
        GitHub... the most
        <rolodex-animation options='["amazing", "wonderful", "incredible"]'</rolodex-animation>
        GIT repository in the world!
      </h1>
</body>
```



https://github.com/user-attachments/assets/4417e1b4-f8d4-486d-9c80-ce29d2c4650b



## Intentions
1. Importable into any web project using JavaScript on the client (all of them?), regardless of CSS, SCSS/SASS, Less, etc.
2. Ability to connect with multiple user targets with the same copy (i.e. instead of rendering different text for different targets, such as mac or Linux uses for a CLI, you could just say:

```html
<body>
    <h1>Attention <rolodex-animation='["Mac", "Linux"]'></rolodex-animation> users!</h1>
</body>
```


Uploading Screen Recording 2024-11-25 at 9.25.22 PM.mov…



## Rolodex? What's a rolodex?
The original contacts app...
<br><br>
<img src="https://github.com/user-attachments/assets/787bc819-2650-4051-ba7a-8317922557b3" alt="rolodex" width="200"/>

## Tech
I chose a very complex, but highly optimal, type-safe, scalable, and reliable tech stack...
- HTML
- CSS
- Vanilla JavaScript
