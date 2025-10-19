+++
date = '2025-09-16T13:21:32+06:30'
draft = false
title = 'Textfield'
+++

Text fields are very important components in a UI; they can be used to accept
different kinds of information from users. The design of the text field is
inspired by Material UI with some changes.

<!--more-->

## Examples

### Default

Text Field has two variants: filled and outlined.

{{< example example=textfield/textfield-default >}}

### Leading icon

Leading icons can be used to display type type of the text field. Adding a
click action to the leading icon isn't recommended; if you need an icon with a
click action, use a trailing icon instead.

{{< example example=textfield/textfield-leading-icon >}}

### Trailing icon

Trailing icons can be used to indicate the status of the input text field or
trigger a specific action. Action must be relative to its text field; don't add
non-relative actions.

{{< example example=textfield/textfield-trailing-icon >}}

### Floating label

You can use a floating label to display some short label directly over the
input element. Always use short and descriptive text for floating labels. The
label will be floated when the input gets focused or it's not empty.

{{< example example=textfield/textfield-floating-label >}}

### Use both floating label leading icon

{{< example example=textfield/textfield-floating-label-2 >}}

### Prefix text

{{< example example=textfield/textfield-prefix-text >}}

### Suffix text

{{< example example=textfield/textfield-suffix-text >}}

### Supporting text

Supporting text can be used to display some important information or error
messages to users. In this example, simple password validation is used to
display an error message in the supporting text.

{{< example example=textfield/textfield-supporting-text >}}

## Customization

### Supported Classes

- `flexy-textfield`
- `flexy-textfield--filled`
- `flexy-textfield--outlined`
- `flexy-textfield--with-floating-label`
- `flexy-textfield--with-leading-icon`
- `flexy-textfield--with-trailing-icon`

### Supported Tokens

- `container-height`
- `container-padding`
- `container-shape`
- `placeholder-color`
- `icon-leading-spacing`
- `icon-trailing-spacing`
- `icon-leading-margin`
- `icon-trailing-margin`
- `icon-color`
- `icon-hovered-color`
- `icon-focused-color`
- `icon-size`
- `label-floating-scale`
- `label-floating-top-margin`
- `label-floating-transition-duration`
- `label-floating-transition-easing`
- `prefix-text-margin`
- `prefix-text-color`
- `suffix-text-margin`
- `suffix-text-color`
- `supporting-text-size`
- `supporting-text-top-margin`
- `supporting-text-left-margin`
- `supporting-help-text-color`
- `supporting-error-text-color`
- `enabled-fill-color`
- `enabled-outline-color`
- `enabled-outline-width`
- `enabled-label-color`
- `hovered-fill-color`
- `hovered-outline-color`
- `hovered-label-color`
- `focused-fill-color`
- `focused-outline-color`
- `focused-outline-width`
- `focused-label-color`
- `invalid-outline-width`
- `invalid-outline-color`
- `invalid-label-color`
