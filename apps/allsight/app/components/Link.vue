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

    const linkClasses = computed(() => {
      const colorClasses = {
        gray: "text-gray-600 hover:text-gray-800 underline underline-offset-4",
        black: "text-black hover:text-gray-600 underline underline-offset-4",
      }

      return colorClasses[props.color!]
    })

    return () => {
      if (!props.asChild) {
        const { class: classAttr, ...otherAttrs } = attrs
        const mergedClass = classAttr
          ? `${linkClasses.value} ${classAttr}`
          : linkClasses.value

        return h(
          "a",
          {
            class: mergedClass,
            ...otherAttrs,
          },
          slots.default?.()
        )
      }

      const slotContent = slots.default?.()
      if (!slotContent || slotContent.length === 0) {
        return h("a", {
          class: linkClasses.value,
          ...attrs,
        })
      }

      const childVNode = slotContent[0]
      if (!childVNode) {
        return
      }

      const existingClass = childVNode.props?.class || ""
      const mergedClass = `${existingClass} ${linkClasses.value}`.trim()

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
