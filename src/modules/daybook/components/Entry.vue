<template>
  <div
    class="entry-container mb-3 pointer p-2"
    @click="$router.push({ name: 'entry', params: { id: entry.id } })"
  >

    <div class="entry-title d-flex">
      <span class="text-success fs-5 fw-bold">{{ day }}</span>
      <span class="mx-1 fs-5">{{ month }}</span>
      <span class="mx-5 fw-light">{{ yearDay }}</span>
    </div>

    <div class="entry-description">
      {{ shortText }}
    </div>
  </div>
</template>

<script>
const months = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];
const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];


export default {
  props: {
    entry: {
      type: Object,
      required: true
    }
  },
  computed: {
    shortText() {
      const entryText = this.entry.text;
      return entryText.length > 130
        ? entryText.substring(0, 130) + '...'
        : entryText;
    },
    day() {
      const date = new Date(this.entry.date);
      return date.getDate();
    },
    month() {
      const date = new Date(this.entry.date);
      return months[date.getMonth()];
    },
    yearDay() {
      const date = new Date(this.entry.date);
      return `${ date.getFullYear() }, ${ days[date.getDay()] }`;
    }
  }
};
</script>

<style lang="scss" scoped>
.entry-container {
  border-bottom: 1px solid #2c3e50;
  transition: 0.2s all ease-in;

  &:hover {
    background-color: lighten($color: grey, $amount: 45);
    transition: 0.2s all ease-in;
  }

  .entry-description {
    font-size: 12px;
  }
}
</style>
