<script lang="ts">
import { computed, defineComponent, h, useAttrs, useSlots } from "vue"

export default defineComponent({
  props: {
    color: {
      type: String as () => "gray" | "black",
      default: "black",
    },
    asChild: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const slots = useSlots()
    const attrs = useAttrs()

    const buttonClasses = computed(() => {
      const baseClasses =
        "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-white ring-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-8 px-4 py-2"

      const colorClasses = {
        gray: "bg-gray-500 text-white hover:bg-gray-600",
        black: "bg-black text-white hover:bg-gray-800",
      }

      return `${baseClasses} ${colorClasses[props.color!]}`
    })

    return () => {
      if (!props.asChild) {
        const { class: classAttr, ...otherAttrs } = attrs
        const mergedClass = classAttr
          ? `${buttonClasses.value} ${classAttr}`
          : buttonClasses.value

        return h(
          "button",
          {
            class: mergedClass,
            ...otherAttrs,
          },
          slots.default?.()
        )
      }

      const slotContent = slots.default?.()
      if (!slotContent || slotContent.length === 0) {
        return h("button", {
          class: buttonClasses.value,
          ...attrs,
        })
      }

      const childVNode = slotContent[0]
      if (!childVNode) {
        return
      }

      const existingClass = childVNode.props?.class || ""
      const mergedClass = `${existingClass} ${buttonClasses.value}`.trim()

      // @ts-ignore - Dynamic component type from slot content
      return h(
        childVNode.type,
        {
          ...childVNode.props,
          ...attrs,
          class: mergedClass,
        },
        childVNode.children
      )
    }
  },
})
</script>
