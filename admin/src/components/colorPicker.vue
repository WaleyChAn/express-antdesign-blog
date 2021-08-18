<template>
  <div class="badmin-colorpicker">
    <div class="badmin-tags">
      <div v-for="(item, index) in presets"
           :key="index"
           class="tags-radio"
           :class="{'active': item === tmpValue}"
           :style="{borderColor: item}"
           @click="tmpValue = item">
        <div :style="{backgroundColor: item}"
             class="tags-item">颜色-{{ index+1 }}</div>
      </div>
      <a-popover trigger="click"
                 @visibleChange="handleVisible">
        <template slot="content">
          <chrome-picker v-model="pickerValue"
                         @input="updateValue"></chrome-picker>
        </template>
        <div class="tags-radio"
             :class="{'active': tmpValue && presets.indexOf(tmpValue) === -1}"
             :style="{borderColor: tmpValue}">
          <div class="tags-item"
               :style="{backgroundColor: presets.indexOf(tmpValue) === -1 ? tmpValue : ''}">自定义</div>
        </div>
      </a-popover>
    </div>
  </div>
</template>

<script>
import { Chrome as ChromePicker } from 'vue-color'
export default {
  name: 'BadminColorPicker',
  components: {
    ChromePicker
  },
  props: {
    value: {
      type: [String, Object],
      default: ''
    },
    presets: {
      type: Array,
      default () {
        return [
          '#409eff',
          '#67c23a',
          '#f56c6c',
          '#f8b62b',
          '#c0c4cc'
        ]
      }
    }
  },
  data () {
    return {
      tmpValue: '',
      pickerValue: {}
    }
  },
  watch: {
    value: {
      handler (n) {
        this.tmpValue = n
      },
      deep: true
    },
    tmpValue: {
      handler (n) {
        this.$emit('input', n)
      },
      deep: true
    }
  },
  created () {
    this.tmpValue = this.value
  },
  methods: {
    handleVisible (visible) {
      if (visible) {
        this.pickerValue = JSON.parse(JSON.stringify(this.tmpValue))
      }
    },
    updateValue (color) {
      const colorRGBA = color.rgba || {}
      const colorStyle = 'rgba(' + colorRGBA.r + ', ' + colorRGBA.g + ', ' + colorRGBA.b + ', ' + colorRGBA.a + ')'
      this.tmpValue = colorStyle
    }
  }
}
</script>

<style scoped lang="less">
</style>
