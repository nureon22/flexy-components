+++
date = '2025-09-06T05:04:40+06:30'
draft = false
title = 'Switch'
+++

Switches can be used for controlling features, settings or hardware that have a clear on/off logic.

<!--more-->

## Examples

### Default

{{< example example=switch-default >}}

### Indicator

The indicator can display the on/off icon inside the track. It is optional and
can be enabled by adding an element with the class `flexy-switch__indicator`
after the track element. You can customize its icon and color using the tokens
described in the customization section at the bottom of this page.

{{< example example=switch-indicator >}}

### Thumb Icon

In this example, horizontal line and checkmark icons are used, but you can use
whatever icon you want.

{{< example example=switch-thumb-icon >}}

### Disabled

To render a switch as selected by default, add the checked attribute to the &lt;input&gt; element.

{{< example example=switch-disabled >}}

### Custom

You can use design tokens to customize the appearance of the switch to your preferences. In this example, the switch is customized to look like a Material Design 2 switch.

{{< example example=switch-custom >}}

## Customization

### Supported Classes

- `flexy-switch`

### Supported Token

- `thumb-height`
- `thumb-shadow`
- `thumb-shape`
- `thumb-width`
- `track-height`
- `track-shape`
- `track-width`
- `icon-size`
- `indicator-size`
- `focus-ring-color`
- `unselected-indicator-color`
- `unselected-indicator-icon`
- `unselected-track-color`
- `unselected-thumb-color`
- `unselected-icon-color`
- `selected-indicator-color`
- `selected-indicator-icon`
- `selected-track-color`
- `selected-thumb-color`
- `selected-icon-color`
- `disabled-unselected-indicator-color`
- `disabled-unselected-track-color`
- `disabled-unselected-thumb-color`
- `disabled-unselected-icon-color`
- `disabled-selected-indicator-color`
- `disabled-selected-track-color`
- `disabled-selected-thumb-color`
- `disabled-selected-icon-color`
