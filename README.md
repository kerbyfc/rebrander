rebrander
=========

rebrands site logo with SVG

dependenciees: ***jquery.js, svg.js***
```html
<img id="brand" src="http://upload.wikimedia.org/wikipedia/ru/8/8e/F2k_new_logo.png" width="50px" height="50px" />
```
```javascript
  $(document).ready(function(){
      $('#brand').rebrand({
        interval: 150,
        red: 156,
        green: 191,
        blue: 144,
      });
    })
```

