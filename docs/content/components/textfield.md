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

{{< example example=textfield-default >}}

### Leading icon

Leading icons can be used to display type type of the text field. Adding a
click action to the leading icon isn't recommended; if you need an icon with a
click action, use a trailing icon instead.

{{< example example=textfield-leading-icon >}}

### Trailing icon

Trailing icons can be used to indicate the status of the input text field or
trigger a specific action. Action must be relative to its text field; don't add
non-relative actions.

{{< example example=textfield-trailing-icon >}}

### Floating label

You can use a floating label to display some short label directly over the
input element. Always use short and descriptive text for floating labels. The
label will be floated when the input gets focused or it's not empty.

{{< example example=textfield-floating-label >}}

### Use both floating label leading icon

{{< example example=textfield-floating-label-2 >}}

### Prefix text

{{< example example=textfield-prefix-text >}}

### Suffix text

{{< example example=textfield-suffix-text >}}

### Supporting text

Supporting text can be used to display some important information or error
messages to users. In this example, simple password validation is used to
display an error message in the supporting text.

{{< example example=textfield-supporting-text >}}
