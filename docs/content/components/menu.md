+++
date = '2025-10-06T05:38:50+06:30'
draft = false
title = 'Menu'
+++

Menus are just like the context menu you often see in most web browsers and applications. They are really helpful components because they don't take up any permanent space on the UI; they are hidden until the user clicks the related anchor element.

## Examples

### Default

Normally, the menu opens below its anchor element while still preserving the overflowing outside the viewport. If there isn't enough space at the bottom of the anchor element to display the menu, the menu will try to be displayed above, left, or right.

{{< example example=menu-1 >}}

### Leading icon and Trailing text

Menu items can include a leading icon, trailing icon, and trailing text. Trailing text is primarily used to display the keyboard shortcut of that menu item, and they are displayed in a lower contrast than the item's label.

{{< example example=menu-2 >}}

### Nested Sub-Menus

Menus can also include nested submenus that also contain other nested submenus. However, using deeply nested menus isn't recommended; they can be hard to navigate and confuse the user.

{{< example example=menu-3 >}}

### Placement

The menu supports above, below, left, and right placements relative to its anchor element. Default placement is below. You can modify the placement using `data-flexy-menu-placement` attribute.

{{< example example=menu-4 >}}

## Accessibility

Flexy menus are fully compatible with WAI-ARIA keyboard navigation standards.

Refer to the [W3C Menu Accessibility Guidelines](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/#keyboardinteraction).


## Customization

### Supported Classes

- `flexy-menu`
- `flexy-menuitem`
- `flexy-menuitem__leading-icon`
- `flexy-menuitem__trailing-icon`
- `flexy-menuitem__trailing-text`

### Supported Tokens

- `container-color`
- `container-padding`
- `container-shape`
- `container-shadow`
- `divider-spacing`
- `divider-color`
- `item-content-spacing`
- `item-height`
- `item-icon-size`
- `item-label-color`
- `item-padding`
- `item-shape`
- `item-leading-icon-color`
- `item-trailing-icon-color`
- `item-trailing-text-color`
- `items-spacing`
- `close-animation-duration`
