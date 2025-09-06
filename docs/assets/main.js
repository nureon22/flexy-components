"use strict";
(() => {
  // node_modules/@nureon22/ripple-effect/dist/main.esm.js
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var uniqueID = (() => {
    return String(Math.random()).slice(2);
  })();
  async function waitAnimationFrame() {
    return new Promise((resolve) => {
      window.requestAnimationFrame(resolve);
    });
  }
  function setCSSProperties(element, properties) {
    for (let key in properties) {
      element.style.setProperty(key, properties[key]);
    }
  }
  var _RippleEffect = class _RippleEffect2 {
    /**
     * @param {HTMLElement} target
     * @param {?RippleEffectOptions=} [options]
     */
    constructor(target, options) {
      __publicField(this, "_destroy_tasks", []);
      __publicField(this, "document");
      __publicField(this, "options");
      if (!(target instanceof HTMLElement)) {
        throw new TypeError("Argument 1 must be instanceof HTMLElement");
      }
      this.target = target;
      this.document = this.target.ownerDocument;
      this.options = {
        trigger: target,
        ..._RippleEffect2.defaultOptions,
        ...options
      };
      this.wrapper = this.document.createElement("span");
      setCSSProperties(this.wrapper, {
        "display": "block",
        "position": "absolute",
        "top": "0px",
        "right": "0px",
        "bottom": "0px",
        "left": "0px",
        "border-radius": this.options.rounded ? "50%" : "inherit",
        "color": this.options.color || "currentColor",
        "overflow": this.options.unbounded ? "visible" : "hidden",
        "pointer-events": "none"
      });
      this.target.prepend(this.wrapper);
      const hoveredAndFocusedLayerStyles = {
        "display": "block",
        "position": "absolute",
        "top": "0px",
        "right": "0px",
        "bottom": "0px",
        "left": "0px",
        "background-color": "currentColor",
        "opacity": "0",
        "transition": `opacity ${this.options.duration / 2}ms ${this.options.easing} 0ms`
      };
      this.focusedLayer = this.document.createElement("span");
      setCSSProperties(this.focusedLayer, hoveredAndFocusedLayerStyles);
      this.wrapper.prepend(this.focusedLayer);
      this.hoveredLayer = this.document.createElement("span");
      setCSSProperties(this.hoveredLayer, hoveredAndFocusedLayerStyles);
      this.wrapper.prepend(this.hoveredLayer);
      let targetCSSPosition = getComputedStyle(this.target).getPropertyValue(
        "position"
      );
      if (targetCSSPosition != "relative" && targetCSSPosition != "absolute") {
        this.target.style.position = "relative";
      }
      const onKeyDown = (event) => {
        if (event.key != " ") {
          return;
        }
        let pressing = true;
        let x, y;
        const rect = this.wrapper.getBoundingClientRect();
        x = rect.width / 2;
        y = rect.height / 2;
        if (this.options.autoexit) {
          let exit;
          this.trigger(x, y, (e) => {
            exit = e;
            !pressing && exit();
          });
          window.addEventListener(
            "keyup",
            () => {
              pressing = false;
              exit && exit();
            },
            { once: true }
          );
        } else {
          this.trigger(x, y);
        }
      };
      const onTouch = (event) => {
        const isMouseEvent = event instanceof MouseEvent;
        if (isMouseEvent && isTouchscreen)
          return;
        let pressing = true;
        let x, y;
        const rect = this.wrapper.getBoundingClientRect();
        if (this.options.centered) {
          x = rect.width / 2;
          y = rect.height / 2;
        } else if (isMouseEvent) {
          x = event.x - rect.x;
          y = event.y - rect.y;
        } else {
          x = event.targetTouches[0].clientX - rect.x;
          y = event.targetTouches[0].clientY - rect.y;
        }
        if (this.options.autoexit) {
          let exit;
          this.trigger(x, y, (e) => {
            exit = e;
            !pressing && exit();
          });
          window.addEventListener(
            "mouseup",
            () => {
              !isTouchscreen && (pressing = false, exit && exit());
            },
            { once: true }
          );
          window.addEventListener(
            "touchend",
            () => {
              pressing = false;
              exit && exit();
            },
            { once: true }
          );
        } else {
          this.trigger(x, y);
        }
      };
      const onHover = (event) => {
        const isHovered = event.type == "mouseenter";
        this.hoveredLayer.style.opacity = String(
          isHovered ? this.options.hoveredOpacity : 0
        );
      };
      const onFocusChange = (event) => {
        const isFocused = event.type == "focus";
        this.focusedLayer.style.opacity = String(
          isFocused ? this.options.focusedOpacity : 0
        );
      };
      const trigger = this.options.trigger ?? this.target;
      if (this.options.keydown) {
        trigger.addEventListener("keydown", onKeyDown);
      }
      trigger.addEventListener("mousedown", onTouch);
      trigger.addEventListener("touchstart", onTouch);
      trigger.addEventListener("mouseenter", onHover);
      trigger.addEventListener("mouseleave", onHover);
      trigger.addEventListener("focus", onFocusChange);
      trigger.addEventListener("blur", onFocusChange);
      this._destroy_tasks.push(() => {
        if (this.options.keydown) {
          trigger.removeEventListener("keydown", onKeyDown);
        }
        trigger.removeEventListener("mousedown", onTouch);
        trigger.removeEventListener("touchstart", onTouch);
        trigger.removeEventListener("mouseenter", onHover);
        trigger.removeEventListener("mouseleave", onHover);
        trigger.removeEventListener("focus", onFocusChange);
        trigger.removeEventListener("blur", onFocusChange);
      });
      this._destroy_tasks.push(() => {
        this.wrapper.remove();
      });
    }
    /**
     * Trigger a new ripple effect
     * @param {number} x
     * @param {number} y
     * @param {((exit: () => void) => void)} [exitFn] If exitFn is given, the created ripple effect will not exit even after enter animation is finished. You need to call the exit function passed to exitFn as a first argument.
     */
    async trigger(x, y, exitFn) {
      if (Number.isNaN(x))
        throw new TypeError("Argument 1 must be a valid number");
      if (Number.isNaN(y))
        throw new TypeError("Argument 2 must be a valid number");
      const rect = this.wrapper.getBoundingClientRect();
      const size = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)) * 2;
      const effect = this.document.createElement("span");
      setCSSProperties(effect, {
        "display": "block",
        "background-color": "currentColor",
        "position": "absolute",
        "left": x + "px",
        "top": y + "px",
        "width": size + "px",
        "height": size + "px",
        "border-radius": "50%",
        "opacity": "0",
        "transform": "translate(-50%, -50%) scale(0)",
        "transition": `transform ${this.options.duration}ms ${this.options.easing} 0ms, opacity 0ms linear 0ms`
      });
      const exit = () => {
        effect.style.transitionDuration = `${this.options.duration}ms, ${this.options.duration / 2}ms`;
        effect.style.opacity = "0";
        setTimeout(() => {
          effect.remove();
        }, this.options.duration);
      };
      await waitAnimationFrame();
      this.wrapper.append(effect);
      await waitAnimationFrame();
      effect.style.opacity = this.options.pressedOpacity + "";
      effect.style.transform = "translate(-50%, -50%) scale(1)";
      window.setTimeout(() => {
        if (typeof exitFn === "function") {
          exitFn(exit);
        } else {
          exit();
        }
      }, this.options.duration + this.options.exitdelay);
    }
    destroy() {
      this._destroy_tasks.forEach((task) => task.call(this));
      delete this.target[`__${uniqueID}_RippleEffect`];
    }
    /**
     * @param {HTMLElement} target
     * @param {RippleEffectOptions} options
     * @return {RippleEffect}
     */
    static attachTo(target, options) {
      if (!(target[`__${uniqueID}_RippleEffect`] instanceof _RippleEffect2)) {
        return target[`__${uniqueID}_RippleEffect`] = new _RippleEffect2(
          target,
          options
        );
      }
      return target[`__${uniqueID}_RippleEffect`];
    }
  };
  __publicField(_RippleEffect, "defaultOptions", {
    color: "currentColor",
    duration: 400,
    unbounded: false,
    autoexit: true,
    exitdelay: 0,
    centered: false,
    rounded: false,
    easing: "ease-in",
    keydown: true,
    hoveredOpacity: 0.08,
    focusedOpacity: 0.08,
    pressedOpacity: 0.12
  });
  var RippleEffect = _RippleEffect;
  var isTouchscreen = false;
  if (typeof window == "object") {
    Object.defineProperty(window, "RippleEffect", {
      value: RippleEffect,
      configurable: true,
      enumerable: false,
      writable: true
    });
    window.addEventListener(
      "touchstart",
      () => {
        isTouchscreen = true;
      },
      { once: true }
    );
  }

  // src/components/base.ts
  var FlexyBaseComponent = class {
    constructor(host) {
      this.host = host;
      this.destroyTasks = /* @__PURE__ */ new Set();
    }
    addDestroyTasks(task) {
      this.destroyTasks.add(task);
    }
    destroy() {
      this.destroyTasks.forEach((task) => task());
      this.destroyTasks.clear();
    }
  };

  // src/components/button/button.ts
  var FlexyButtonComponent = class extends FlexyBaseComponent {
    constructor(host) {
      super(host);
      const ripple = RippleEffect.attachTo(host, {
        duration: 250,
        exitdelay: 150,
        hoveredOpacity: 0.12,
        focusedOpacity: 0,
        pressedOpacity: 0.12,
        keydown: true
      });
      this.addDestroyTasks(() => ripple.destroy());
      this.host.addEventListener("keydown", (e) => console.log(e.type));
      this.host.addEventListener("keyup", (e) => console.log(e.type));
    }
  };

  // src/components/slider/slider.ts
  var FlexySliderComponent = class extends FlexyBaseComponent {
    constructor(host) {
      super(host);
      this.input = this.host.querySelector("input");
      this._children = {
        activeTrack: this.getChild("active-track"),
        inactiveTrack: this.getChild("inactive-track"),
        thumb: this.getChild("thumb")
      };
      this._inputEventCount = 0;
      if (this.input) {
        this.input.min ||= "0";
        this.input.max ||= "100";
        this.update();
        this.input.addEventListener("input", this.handleInputEvent.bind(this));
        this.input.addEventListener("change", this.handleInputEvent.bind(this));
      }
    }
    handleInputEvent(event) {
      switch (event.type) {
        case "input":
          if (this._inputEventCount == 1) {
            this.host.classList.add("flexy-slider--sliding");
          }
          this._inputEventCount++;
          break;
        case "change":
          this.host.classList.remove("flexy-slider--sliding");
          this._inputEventCount = 0;
          break;
      }
      this.update();
    }
    getChild(selector) {
      return this.host.querySelector(".flexy-slider__" + selector);
    }
    update() {
      if (!this.input) return;
      const { inactiveTrack, activeTrack, thumb } = this._children;
      const min = Number(this.input.min || "0");
      const max = Number(this.input.max || "100");
      const value = Number(this.input.value || "0");
      const progress = (value - min) / (max - min) * 100;
      if (inactiveTrack) {
        inactiveTrack.style.transform = `translateX(${progress}%)`;
      }
      if (activeTrack) {
        activeTrack.style.transform = `translateX(${progress - 100}%)`;
      }
      if (thumb) {
        thumb.style.transform = `translateX(${progress - 100}%)`;
      }
    }
  };

  // src/components/switch/switch.ts
  var FlexySwitchComponent = class extends FlexyBaseComponent {
    constructor(host) {
      super(host);
      this.input = this.host.querySelector("input");
    }
  };

  // src/utils.ts
  function afterPageLoad() {
    return new Promise((resolve) => {
      if (document.readyState == "complete") {
        resolve();
      } else {
        window.addEventListener("load", () => resolve());
      }
    });
  }

  // src/main.ts
  afterPageLoad().then(() => {
    document.querySelectorAll(".flexy-button").forEach((el) => {
      if (el instanceof HTMLElement) new FlexyButtonComponent(el);
    });
    document.querySelectorAll(".flexy-switch").forEach((el) => {
      if (el instanceof HTMLElement) new FlexySwitchComponent(el);
    });
    document.querySelectorAll(".flexy-slider").forEach((el) => {
      if (el instanceof HTMLElement) new FlexySliderComponent(el);
    });
  });
})();
//# sourceMappingURL=main.js.map
