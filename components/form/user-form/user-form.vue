<template lang="pug">
  .user-form
    v-container
      v-form(@submit.prevent="registerForm" :disabled="isReadMode")
        v-row(dense)
          v-col
            b.d-flex.justify-center.text-uppercase {{header}}
          v-col(cols="12")
            v-row(dense)
              v-col(cols="12" md="6")
                span Name
                v-text-field(v-model="form.firstName" outlined placeholder="Name" hide-details )
              v-col(cols="12" md="6")
                span Surname
                v-text-field(v-model="form.lastName"  outlined placeholder="Surname" hide-details)
              v-col(cols="12" md="6")
                span Country
                v-text-field(v-model="form.country" outlined placeholder="Country" hide-details )
              v-col(cols="12" md="6")
                span City
                v-text-field(v-model="form.city"  outlined placeholder="City" hide-details)
              v-col(cols="12" md="6")
                span House Number
                v-text-field(v-model="form.houseNumber"  outlined placeholder="House Number" hide-details)
              v-col(cols="12" md="6")
                span Zip
                v-text-field(v-model="form.zip"  outlined placeholder="Zip Number" hide-details)
              v-col(cols="12")
                span Street Address
                v-text-field(v-model="form.streetAddress" outlined placeholder="Street Address" hide-details )

          v-col.d-flex.justify-center( v-if="!isReadMode")
            v-btn( color="primary" x-large block v-text="saveBtnText" type="submit" height="48" )
</template>

<script>
import {onMounted, ref, watch} from 'vue'
import {computed, useContext} from '@nuxtjs/composition-api'
import crudTypes from "~/constants/crudTypes";

export default {
  name: 'UserFrom',
  components: {},
  props: {
    header: {
      type: String,
      default: ''
    },
    crudType: {
      type: Number,
      default: 1
    },
    userInfo: {
      type: Object,
      default: () => {
      }
    }
  },

  setup(props, {emit}) {
    const {store} = useContext()

    const saveBtnText = computed(() => props.crudType === crudTypes.UPDATE ? 'Update' : 'Save')
    const isReadMode = computed(() => props.crudType === crudTypes.READ)

    const disableBtn = ref(false)

    const form = ref({
      firstName: '',
      lastName: '',
      country: '',
      city: '',
      streetAddress: '',
      houseNumber: '',
      zip: '',
      id: ''
    })

    onMounted(() => {
      getFormOperations()
    })

    watch(() => props.userInfo, () => {
      getFormOperations()
    })

    const getFormOperations = async () => {
      if (props.crudType === crudTypes.READ || props.crudType === crudTypes.UPDATE) {
        form.value = {...props.userInfo}
      } else if (props.crudType === crudTypes.CREATE) {
        resetForm()
      }
    }

    const resetForm = () => {
      form.value = {
        firstName: '',
        lastName: '',
        country: '',
        city: '',
        streetAddress: '',
        houseNumber: '',
        zip: '',
        id: ''
      };
    }

    const registerForm = async () => {
      if (props.crudType === crudTypes.CREATE) {
        await addNewUser()
      } else if (props.crudType === crudTypes.UPDATE) {
        await updateUser()
      }
    }

    const addNewUser = async () => {
      try {
        await store.dispatch('users/addNewUser', {user: form.value});
        await store.dispatch('users/getUsers');
        emit('showDialog', false);
      } catch (error) {
        console.error("user add error:", error);
      }
    };

    const updateUser = async () => {
      try {
        await store.dispatch('users/updateSelectedUser', {
          userId: form.value.id,
          userData: form.value
        });
        await store.dispatch('users/getUsers');
        emit('showDialog', false);
      } catch (error) {
        console.error("user update error:", error);
      }
    };

    return {
      form,
      disableBtn,
      saveBtnText,
      isReadMode,
      crudTypes,
      registerForm,
      addNewUser
    };
  },

};
</script>

<style lang="scss" src="./user-form.scss"/>
