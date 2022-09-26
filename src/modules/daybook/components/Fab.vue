<template>
  <button
    class="btn btn-primary"
    @click="$emit('fab:click')"
  >
    <i
      class="fa fa-2x"
      :class="icon"
    ></i>
  </button>
</template>

<script>
export default {
  props: {
    icon: { 
      default: 'fa-plus',
      required: false,
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
button {
  border-radius: 100%;
  bottom: 20px;
  height: 70px;
  position: fixed;
  right: 20px;
  width: 70px;
}
</style>
