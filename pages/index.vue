<template lang="pug">
  .main-page
    v-card.pa-4(elevation="2" )
      b.text-uppercase.d-flex.justify-center.mb-2 Arsipa Fe Challenge
      .buttons.d-flex.justify-center
        v-btn.justify-center.mr-2(color="blue-grey" v-text="userPageText" outlined  @click="gotoUserPage")
        v-btn.justify-center(color="blue-grey" v-text="bookPageText" outlined  @click="gotoBookPage")

</template>

<script>
import {defineComponent, ref, useRouter} from '@nuxtjs/composition-api';

export default defineComponent({
  setup(props, {emit}) {
    const router=useRouter()
    const userPageText=ref('User List Page')
    const bookPageText=ref('Book Cover Page')

    const gotoUserPage=()=>{
      router.push('/user-list')
    }
    const gotoBookPage=()=>{
      router.push('/book-cover')
    }
    return {
      userPageText,
      bookPageText,
       gotoBookPage,
      gotoUserPage
    }
  },
});
</script>

<style lang="scss">
.main-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to bottom right, #9DF9DB, #6799D4);

  .v-card {
    max-width: 500px;
    width: 90%;
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
  }

  b {
    font-size: 1.5rem;
    font-weight: 700;
    color: #37474f;
    margin-bottom: 1rem;
  }

  /* Butonlar stili */
  .v-btn {
    font-size: 1rem;
    font-weight: 500;
    text-transform: uppercase;
    padding: 0.75rem 1.5rem;
    border: 2px solid #b0bec5;
    border-radius: 8px;
    color: #37474f;
    background-color: transparent;
    transition: all 0.3s ease;
  }

  .v-btn:hover {
    background-color: #000000;
    border-color: #607d8b;
    color: #ffffff !important;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

}


/* Mobil uyumluluk */
@media (max-width: 600px) {
  .main-page {
    padding: 1rem;

    .v-card {
      height: auto;
      padding: 2rem;
    }

    b {
      font-size: 1.25rem;
    }

    .v-btn {
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
    }
  }

}

</style>
