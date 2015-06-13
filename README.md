# Principle
This library turns a traditional navigation per page, by using ajax navigation tabs in javascript. All pages changes are in tabs (except specific configuration, see below). The mechanism intercepts all links and submit of pages (unless excluded, see below).

See documentation:
http://lagrede.alwaysdata.net/site_media/github/ajaxify/site/index.html

# Features
* Opened in __JS tab__ (same or new) the next page
* Use the HTML5's __history__ object (for the browser previous / next buttons)
* Automatically __reopens tabs__ of the previous navigation (using localeStorage)
* __Remove__ the tabs __saved after a logout__
* __Merges__ __&lt;script&gt;, &lt;style&gt; and &lt;head&gt;__ elements when loading a new page (lazy loading)
* __Runs inline Javascript__ on the page (Keeps events and DOM changes)
* __Keyboard navigation__ between tabs with shortcut: Ctrl + Shift + left / right arrow
* Allow to display page in __modal__
* Managing the server error page (500) for display in errors
* Can __refresh one or more tabs__ / subparts tabs
* __Closing a tab__ after a form validation

# Examples
Open __next page__ in JS tab
```html
<a class="tab" href="/index">Welcome</a>
```

Open page in __JS modal__ (on the target page)
```html
<head>
    <modal/>
</head>
```
