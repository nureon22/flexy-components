+++
date = '2025-09-21T19:37:32+06:30'
draft = false
title = 'Tooltip'
+++

Tooltips are used primarily to display additional information regarding a UI
element when it's hovered or focused. Tooltips can be used on every UI.
element.

A tooltip appears only when the user hovers over its corresponding element or if
that element has focus.

Normally, when you use a tooltip, you have to give an ID to the tooltip element and mention that ID within the aria-describedby attribute of its corresponding element.

If you don't want to set the ID manually, you can place the tooltip element as the next sibling element of its associated element. The id and aria-describedby attributes will automatically be generated once the component is initialized.

<!--more-->

## Examples

### Default

{{< example example=tooltip/tooltip-default >}}

### Placement

Tooltips support four placements: above, right, below (default), and left. In some cases, the placement may be flipped (e.g., a left tooltip appearing on the right) if there is not enough space to render the tooltip within the viewport.

To preview this behavior, try resizing your window to a very small width.

{{< example example=tooltip/tooltip-placements >}}

### Delays

Tooltips support configurable show and hide delays via the
`data-flexy-tooltip-showdelay` and `data-flexy-tooltip-hidedelay` attributes,
specified in milliseconds. These delays apply only to hover interactions; focus
and keyboard Events will ignore them.

Following example set 0.5s for show delay and 1s for hide delay.

{{< example example=tooltip/tooltip-delays >}}

### NoInteractive

Normally, you can interact with rendered tooltips (e.g., you can hover over
them or select their text). If you want, you can disable this behavior with
`flexy-tooltip--nointeractive` CSS class.

{{< example example=tooltip/tooltip-nointeractive >}}

## Customization

### Supported Classes

- `flexy-tooltip`
- `flexy-tooltip--nointeractive`

### Supported Attributes

- `data-flexy-tooltip-placement`
- `data-flexy-tooltip-showdelay`
- `data-flexy-tooltip-hidedelay`

### Supported Tokens

- `animation-duration`
- `animation-easing`
- `fill-color`
- `max-width`
- `padding`
- `shadow`
- `shape`
- `spacing`
- `text-color`
- `text-height`
- `text-size`
