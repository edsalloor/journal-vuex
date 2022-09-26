<template>
  <template v-if="entry">
    <div class="entry-title d-flex justify-content-between p-2">
      <div>
        <span class="text-success fs-3 fw-bold">{{ day }}</span>
        <span class="mx-1 fs-3">{{ month }}</span>
        <span class="mx-2 fs-4 fw-light">{{ yearDay }}</span>
      </div>

      <div>
        <button
          v-if="entry.id"
          class="btn btn-danger mx-2"
          @click="onDeleteEntry"
        >
          Delete
          <i class="fa fa-trash-alt"></i>
        </button>
        
        <button
          class="btn btn-primary"
          @click="onUploadImage"
        >
          Upload Photo
          <i class="fa fa-upload"></i>
          <input
            @change="onSelectedImage"
            accept="image/png, image/jpeg, image/webp"
            ref="imageSelector"
            type="file"
            v-show="false"
          >
        </button>
      </div>
    </div>

    <hr>

    <div class="d-flex flex-column px-3 h-75">
      <textarea
        v-model="entry.text"
        placeholder="What's happened today?"
      ></textarea>
    </div>

    <img
      v-if="localImage || entry.picture"
      :src="localImage || entry.picture"
      alt="entry-picture"
      class="img-thumbnail"
    >
  </template>

  <Fab
    icon="fa-save"
    @fab:click="saveEntry"
  />
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import Swal from 'sweetalert2';

import getDayMonthYear from '@/modules/daybook/helpers/getDayMonthYear';
import uploadImage from '@/modules/daybook/helpers/uploadImage';

export default {
  name: 'EntryView',
  props: {
    id: {
      required: true,
      type: String
    }
  },
  components: {
    Fab: defineAsyncComponent(() => import('@/modules/daybook/components/Fab.vue'))
  },
  data () {
    return {
      entry: null,
      localImage: null,
      imageFile: null
    };
  },
  computed: {
    ...mapGetters('journal', ['getEntryById']),
    day() {
      const { day } = getDayMonthYear(this.entry.date);
      return day;
    },
    month() {
      const { month } = getDayMonthYear(this.entry.date);
      return month;
    },
    yearDay() {
      const { yearDay } = getDayMonthYear(this.entry.date);
      return yearDay;
    }
  },
  methods: {
    ...mapActions('journal', ['updateEntry', 'createEntry', 'deleteEntry']),
    loadEntry() {
      let entry;

      if (this.id === 'new') {
        entry = {
          text: '', date: new Date().getTime()
        };
      } else {
        entry = this.getEntryById(this.id);
        if(!entry) return this.$router.push({ name: 'no-entry' });
      }

      this.entry = entry;
      this.localImage = null;
    },
    async saveEntry() {
      Swal.fire({
        title: 'Wait please...',
        allowOutsideClick: false
      });
      Swal.showLoading();

      const imageUrl = await uploadImage(this.imageFile);
      this.entry.picture = imageUrl;

      if (this.entry.id) {
        await this.updateEntry(this.entry);
      } else {
        const { id } = await this.createEntry(this.entry);
        this.$router.push({name: 'entry', params: { id }});
      }

      this.localImage = null;
      Swal.fire('Saved', 'Entry successfully created.', 'success');
    },
    async onDeleteEntry() {
      const { isConfirmed } = await Swal.fire({
        title: 'Do you want to delete this entry?',
        text: 'This action can not be undone.',
        showDenyButton: true,
        confirmButtonText: 'Delete'
      });

      if (!isConfirmed) return;

      Swal.fire({
        title: 'Please wait...',
        allowOutsideClick: false
      });
      Swal.showLoading();

      await this.deleteEntry(this.entry.id);
      this.$router.push({ name: 'no-entry' });

      Swal.fire('Entry deleted', '', 'success');
    },
    onSelectedImage(event) {
      const file = event.target.files[0];

      if (!file) {
        this.localImage = null;
        this.imageFile = null;
        return;
      }

      this.imageFile = file;

      const fr = new FileReader();
      fr.onload = () => this.localImage = fr.result;
      fr.readAsDataURL(file);
    },
    onUploadImage() {
      this.$refs.imageSelector.click();
    }
  },
  created() {
    this.loadEntry();
  },
  watch: {
    id() {
      this.loadEntry();
    }
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
