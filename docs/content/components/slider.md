+++
date = '2025-09-06T05:04:40+06:30'
draft = false
title = 'Slider'
+++

A slider allows quickly selecting a value from a range. Common uses include seeking through audio or video, changing a volume level, or setting values in image editors.

<!--more-->

## Examples

### Default

{{< example example=slider-default >}}

### Thumb Ripple

{{< example example=slider-ripple >}}

### Tick Marks

{{< example example=slider-tick-marks >}}

### Value Indicator

{{< example example=slider-value-indicator >}}

### Material 3 Value Indicator

{{< example example=slider-value-indicator-m3 >}}

### Material 3 Latest Design

Normally, the slider doesn’t support the latest Material 3 design, but you can
use its design tokens and a few tricks to style it as close as possible to the
Material 3 slider.

See [Material 3 Slider](https://m3.material.io/components/sliders/overview) for
Latest Material 3 Design slider.

{{< example example=slider-m3-latest >}}

### Gradient Track

In this example, the slider is styled as a YouTube video player progress bar
using the `track-active-gradient` token, which applies a linear gradient to the
active track. You can also apply a gradient to the inactive track using the
`track-inactive-gradient` token.

To see the result more clearly, use the dark mode by clicking the theme toggle
button on the top navigation bar.

{{< example example=slider-gradient >}}

## Customization

### Supported Classes

- `flexy-slider`
- `flexy-slider--noanimation`

### Supported Tokens

#### Thumb

- `thumb-outline-width`
- `thumb-outline-color`
- `thumb-color`
- `thumb-height`
- `thumb-shape`
- `thumb-width`
- `thumb-icon-color`
- `ripple-size`

#### Track

- `track-active-color`
- `track-active-gradient`
- `track-height`
- `track-inactive-color`
- `track-inactive-gradient`
- `track-shape`

#### Ticks

- `ticks-inactive-color`
- `ticks-active-color`
- `ticks-size`

#### Value Indicator

- `value-indicator-arrow-size`
- `value-indicator-bottom-spacing`
- `value-indicator-height`
- `value-indicator-width`
- `value-indicator-shape`
- `value-indicator-fill-color`
- `value-indicator-text-color`
- `value-indicator-text-size`
- `value-indicator-m3-size`

#### Animation

- `animation-jumping-duration`
- `animation-jumping-easing`
- `animation-sliding-duration`
- `animation-sliding-easing`

#### Others

- `focus-ring-color`
