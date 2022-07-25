<template>
  <div class="entry-list-container">
    <div class="px-2 py-2">
        <input
          class="form-control"
          placeholder="Search Entry"
          type="text"
        >
    </div>

    <div class="entry-scrollarea">
        <Entry
          v-for="item in 100"
          :key="item"
        />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
  components: {
    Entry: defineAsyncComponent(() => import(/* webpackChunkName: "DaybookEntry" */ '@/modules/daybook/components/Entry.vue'))
  }
};
</script>

<style lang="scss" scoped>
.entry-list-container {
  border-right: 1px solid #2c3e50;
  height: calc(100vh - 56px);
}

.entry-scrollarea {
  height: calc(100vh - 105px);
  overflow: scroll;
}
</style>
