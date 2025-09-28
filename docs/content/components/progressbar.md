+++
date = '2025-09-28T15:56:37+06:30'
draft = false
title = 'Progressbar'
+++

A progress bar can be used to display the progress of an action or task (e.g., download progress). Progress bars should be read-only for users. A progress bar can be either determinate or indeterminate. In the determinate state, its value can be defined using aria-valuenow between 1 and 100. Indeterminate progress should be used only when the estimated time of the task cannot be calculated.

## Examples

### Default

In this example, simulated determinate progress is used. To update the progress, simply change the value of aria-valuenow, and the rest will be handled automatically by JavaScript when the attribute is updated.

{{< example example=progressbar-default >}}

### Indeterminate

To use an indeterminate progress bar, simply remove the aria-valuenow attribute.

{{< example example=progressbar-indeterminate >}}

## Customization

### Supported Classes

- `flexy-progressbar`

### Supported Tokens

- `indeterminate-animation-duration`
- `jump-animation-duration`
- `track-active-color`
- `track-height`
- `track-inactive-color`
- `track-inactive-opacity`
- `track-shape`
