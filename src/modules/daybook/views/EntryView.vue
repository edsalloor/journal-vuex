<template>
  <div class="entry-title d-flex justify-content-between p-2">
    <div>
      <span class="text-success fs-3 fw-bold">15</span>
      <span class="mx-1 fs-3">July</span>
      <span class="mx-2 fs-4 fw-light">2022, Thursday</span>
    </div>

    <div>
      <button class="btn btn-danger mx-2">
        Delete
        <i class="fa fa-trash-alt"></i>
      </button>
      
      <button class="btn btn-primary">
        Upload Photo
        <i class="fa fa-upload"></i>
      </button>
    </div>
  </div>

  <hr>

  <div class="d-flex flex-column px-3 h-75">
    <textarea placeholder="What's happened today?"></textarea>
  </div>

  <Fab icon="fa-save"/>

  <img
    src="https://img.freepik.com/free-vector/colorful-palm-silhouettes-background_23-2148541792.jpg?w=2000"
    alt="entry-picture"
    class="img-thumbnail"
  >
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
  components: {
    Fab: defineAsyncComponent(() => import('@/modules/daybook/components/Fab.vue'))
  }
};
</script>

<style lang="scss" scoped>
textarea {
  font-size: 20px;
  border: none;
  height: 100%;

  &:focus {
    outline: none;
  }
}

img {
  bottom: 150px;
  box-shadow: 0px 5px 10px rgba($color: #000000, $alpha: 0.2);
  position: fixed;
  right: 20px;
  width: 200px;
}
</style>
