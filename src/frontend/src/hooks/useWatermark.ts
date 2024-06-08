import { type Ref, onBeforeUnmount, ref } from "vue"
import { debounce } from "lodash-es"

type Observer = {
  watermarkElMutationObserver?: MutationObserver
  parentElMutationObserver?: MutationObserver
  parentElResizeObserver?: ResizeObserver
}

type DefaultConfig = typeof defaultConfig

/** default allocation */
const defaultConfig = {
  /** Defense (enabled by default, can prevent watermarks from being deleted or hidden, but there may be performance losses) */
  defense: true,
  /** Text color */
  color: "#c0c4cc",
  /** Text transparency */
  opacity: 0.5,
  /** Text font size */
  size: 16,
  /** Text font */
  family: "serif",
  /** Text tilt angle */
  angle: -20,
  /** The width occupied by a watermark (the larger the value, the lower the watermark density) */
  width: 300,
  /** The height occupied by a watermark (the larger the value, the lower the watermark density) */
  height: 200
}

/** body element */
const bodyEl = ref<HTMLElement>(document.body)

/**
 * Create watermark
 * 1. You can choose to pass in the container element to mount the watermark, the default is body
 * 2. Watermark defense is implemented, which can effectively prevent others from opening the console to delete or hide the watermark.
 */
export function useWatermark(parentEl: Ref<HTMLElement | null> = bodyEl) {
  /** Backup text */
  let backupText: string
  /** Final configuration */
  let mergeConfig: DefaultConfig
  /** Watermark element */
  let watermarkEl: HTMLElement | null = null
  /** Observer */
  const observer: Observer = {
    watermarkElMutationObserver: undefined,
    parentElMutationObserver: undefined,
    parentElResizeObserver: undefined
  }

  /** Set watermark */
  const setWatermark = (text: string, config: Partial<DefaultConfig> = {}) => {
    if (!parentEl.value) {
      console.warn("请在 DOM 挂载完成后再调用 setWatermark 方法设置水印")
      return
    }
    // Backup text
    backupText = text
    // Merge configuration
    mergeConfig = { ...defaultConfig, ...config }
    //Create or update watermark element
    watermarkEl ? updateWatermarkEl() : createWatermarkEl()
    // Monitor changes in watermark elements and container elements
    addElListener(parentEl.value)
  }

  /** Create watermark element */
  const createWatermarkEl = () => {
    const isBody = parentEl.value!.tagName.toLowerCase() === bodyEl.value.tagName.toLowerCase()
    const watermarkElPosition = isBody ? "fixed" : "absolute"
    const parentElPosition = isBody ? "" : "relative"
    watermarkEl = document.createElement("div")
    watermarkEl.style.pointerEvents = "none"
    watermarkEl.style.top = "0"
    watermarkEl.style.left = "0"
    watermarkEl.style.position = watermarkElPosition
    watermarkEl.style.zIndex = "99999"
    const { clientWidth, clientHeight } = parentEl.value!
    updateWatermarkEl({ width: clientWidth, height: clientHeight })
    // Set the watermark container to relative positioning
    parentEl.value!.style.position = parentElPosition
    //Add the watermark element to the watermark container
    parentEl.value!.appendChild(watermarkEl)
  }

  /** Update watermark element */
  const updateWatermarkEl = (
    options: Partial<{
      width: number
      height: number
    }> = {}
  ) => {
    if (!watermarkEl) return
    backupText && (watermarkEl.style.background = `url(${createBase64()}) left top repeat`)
    options.width && (watermarkEl.style.width = `${options.width}px`)
    options.height && (watermarkEl.style.height = `${options.height}px`)
  }

  /** Create base64 image */
  const createBase64 = () => {
    const { color, opacity, size, family, angle, width, height } = mergeConfig
    const canvasEl = document.createElement("canvas")
    canvasEl.width = width
    canvasEl.height = height
    const ctx = canvasEl.getContext("2d")
    if (ctx) {
      ctx.fillStyle = color
      ctx.globalAlpha = opacity
      ctx.font = `${size}px ${family}`
      ctx.rotate((Math.PI / 180) * angle)
      ctx.fillText(backupText, 0, height / 2)
    }
    return canvasEl.toDataURL()
  }

  /** Clear watermark */
  const clearWatermark = () => {
    if (!parentEl.value || !watermarkEl) return
    //Remove monitoring of watermark elements and container elements
    removeListener()
    //Remove watermark element
    try {
      parentEl.value.removeChild(watermarkEl)
    } catch {
      // For example, in a defenseless situation, the user opens the console and deletes this element.
      console.warn("The watermark element no longer exists, please create it again.")
    } finally {
      watermarkEl = null
    }
  }

  /** Refresh watermark (called during defense) */
  const updateWatermark = debounce(() => {
    clearWatermark()
    createWatermarkEl()
    addElListener(parentEl.value!)
  }, 100)

  /** Monitor changes in watermark elements and container elements (DOM changes & DOM size changes) */
  const addElListener = (targetNode: HTMLElement) => {
    // Determine whether to enable defense
    if (mergeConfig.defense) {
      // Prevent repeated addition of listeners
      if (!observer.watermarkElMutationObserver && !observer.parentElMutationObserver) {
        // Monitor DOM changes
        addMutationListener(targetNode)
      }
    } else {
      // No need for mutation monitoring when there is no defense
      removeListener("mutation")
    }
    // Prevent repeated addition of listeners
    if (!observer.parentElResizeObserver) {
      // Monitor DOM size changes
      addResizeListener(targetNode)
    }
  }

  /** Remove the monitor for watermark elements and container elements. Pass the parameter to specify which monitor to remove. If not passed, all monitors will be removed by default */
  const removeListener = (kind: "mutation" | "resize" | "all" = "all") => {
    //Remove mutation listener
    if (kind === "mutation" || kind === "all") {
      observer.watermarkElMutationObserver?.disconnect()
      observer.watermarkElMutationObserver = undefined
      observer.parentElMutationObserver?.disconnect()
      observer.parentElMutationObserver = undefined
    }
    //Remove resize listener
    if (kind === "resize" || kind === "all") {
      observer.parentElResizeObserver?.disconnect()
      observer.parentElResizeObserver = undefined
    }
  }

  /** Monitor DOM changes */
  const addMutationListener = (targetNode: HTMLElement) => {
    //Callback executed when changes are observed
    const mutationCallback = debounce((mutationList: MutationRecord[]) => {
      // Watermark defense (prevent users from manually deleting watermark elements or hiding watermarks through CSS)
      mutationList.forEach(
        debounce((mutation: MutationRecord) => {
          switch (mutation.type) {
            case "attributes":
              mutation.target === watermarkEl && updateWatermark()
              break
            case "childList":
              mutation.removedNodes.forEach((item) => {
                item === watermarkEl && targetNode.appendChild(watermarkEl)
              })
              break
          }
        }, 100)
      )
    }, 100)
    //Create an observer instance and pass in the callback
    observer.watermarkElMutationObserver = new MutationObserver(mutationCallback)
    observer.parentElMutationObserver = new MutationObserver(mutationCallback)
    // Start observing the target node with the above configuration
    observer.watermarkElMutationObserver.observe(watermarkEl!, {
      // Observe whether the target node attributes change, the default is true
      attributes: true,
      // Observe whether the target child node is added or deleted, the default is false
      childList: false,
      // Whether to expand to observe all descendant nodes, the default is false
      subtree: false
    })
    observer.parentElMutationObserver.observe(targetNode, {
      attributes: false,
      childList: true,
      subtree: false
    })
  }

  /** Monitor DOM size changes */
  const addResizeListener = (targetNode: HTMLElement) => {
    //Update the size of the entire watermark when the size of the targetNode element changes
    const resizeCallback = debounce(() => {
      const { clientWidth, clientHeight } = targetNode
      updateWatermarkEl({ width: clientWidth, height: clientHeight })
    }, 500)
    //Create an observer instance and pass in the callback
    observer.parentElResizeObserver = new ResizeObserver(resizeCallback)
    //Start observing the target node
    observer.parentElResizeObserver.observe(targetNode)
  }

  /** Remove watermarks and various monitors before component uninstallation */
  onBeforeUnmount(() => {
    clearWatermark()
  })

  return { setWatermark, clearWatermark }
}
