+++
date = '2025-10-04T17:04:18+06:30'
draft = false
title = 'Progresscircle'
+++

A progress circle can be used to display the progress of an action or task (e.g., download progress). progress circles should be read-only for users. A progress circle can be either determinate or indeterminate. In the determinate state, its value can be defined using aria-valuenow between 1 and 100. Indeterminate progress should be used only when the estimated time of the task cannot be calculated.

## Examples

### Default

In this example, simulated determinate progress is used. To update the progress, simply change the value of aria-valuenow, and the rest will be handled automatically by JavaScript when the attribute is updated.

{{< example example=progresscircle-default >}}

### Indeterminate

To use an indeterminate progress circle, simply remove the aria-valuenow attribute.

{{< example example=progresscircle-indeterminate >}}

## Customization

### Supported Classes

- `flexy-progresscircle`

### Supported Tokens

- `container-size`
- `indeterminate-animation-duration`
- `jump-animation-duration`
- `track-active-color`
- `track-height`
- `track-inactive-color`
- `track-inactive-opacity`
