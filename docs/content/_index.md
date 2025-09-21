+++
date = '2025-09-05T09:41:55+06:30'
draft = false
title = 'Flexy UI Components'
+++

## What is Flexy UI?

Flexy UI is a collection of **flexible and customizable web components** designed to enhance native HTML elements.
Each component builds on standard HTML functionality while adding useful features and behaviors.

You can use components directly in plain HTML **without writing any JavaScript**.
However, if you add components dynamically after the page has loaded, **JavaScript initialization is required**.

Some components include more complex HTML templates, which must be written manually.
This can be repetitive or inconvenient when reusing components across multiple pages or projects.

To simplify this, **helper libraries** for popular frameworks like **React, Angular, Svelte, and Hugo** will be provided once the core library is complete.
These helpers let you integrate components seamlessly without manually writing templates.

---

## Why use Flexy UI?

### Customizable

All components come with **design tokens** that allow you to easily customize their **appearance, layout, and animations**, making it simple to match your brand or project style.

### High Performance

Flexy UI components are designed to include only the **essential features**, reducing unnecessary JavaScript execution.
Some components even require **no JavaScript at all**, ensuring smooth, performant user interfaces.

---

## Components Roadmap

### In Progress

- Button
- Checkbox
- Radio
- Slider
- Switch
- Tabs
- TextField

### Comming Soon

- Menu
- ProgressBar
- ProgressSpinner

---

## Usage

Flexy Components can be used either via **NPM** or **CDN**, depending on your project setup.

### Using NPM

For **static websites** where all components templates are already present in the HTML from the start:

```js
import 'flexy-components/styles';
import 'flexy-components';
```

If you need to add components dynamically after the page has loaded, you can import and initialize them individually:

```js
import 'flexy-components/styles';
import { FlexyCheckboxComponent } from 'flexy-components';

const checkbox = document.querySelector('#your-checkbox.flexy-checkbox');
new FlexyCheckboxComponent(checkbox);
```

### Via CDN

Include the stylesheet and script directly in your HTML:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/flexy-components/dist/iife/main.css"
/>
<script
  defer
  src="https://cdn.jsdelivr.net/npm/flexy-components/dist/iife/main.js"
></script>
```
