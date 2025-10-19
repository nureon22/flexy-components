+++
date = '2025-09-14T04:16:33+06:30'
draft = false
title = 'Checkbox'
+++

Checkboxes are used to toggle binary options or properties. Although switches
are typically preferred for on/off states, checkboxes can be more appropriate
when multiple selections or partial states are involved.

<!--more-->

## Examples

### Default

{{< example example=checkbox/checkbox-default >}}

### Checked

To render a checkbox as selected by default, add the `checked` attribute to the &lt;input&gt; element.

{{< example example=checkbox/checkbox-checked >}}

### Disabled

To render a checkbox as non-interactive, add the `disabled` attribute to the &lt;input&gt; element.

{{< example example=checkbox/checkbox-disabled >}}

### Indeterminate

To render a checkbox in an indeterminate (partially selected) state, define its related child checkboxes using the `aria-controls` attribute.
The value of `aria-controls` should be a space-separated list of the child checkbox IDs.

{{< example example=checkbox/checkbox-indeterminate >}}

## Customization

### Supported Classes

- `flexy-checkbox`

### Supported Tokens

- `size`
- `outline-width`
- `mark-color`
- `mark-size`
- `unselected-fill-color`
- `unselected-outline-color`
- `unselected-hovered-outline-color`
- `selected-fill-color`
- `selected-outline-color`
- `state-transition-duration`
- `state-transition-easing`
