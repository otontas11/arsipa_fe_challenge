<template lang="pug">
  .user-list-table
    v-card.font-weight-600(elevation="3" )
      .d-flex.justify-space-between.pa-4
        v-card-title.font-size-20  User List
        v-btn.d-flex.justify-end.mb-2(color="primary"  dark class="mb-2" @click="addNewUser" v-text="'Add New User'")

      v-data-table(:headers='headers' :items='userList'  class='elevation-1')
        template(v-slot:item.actions='{ item }')
          v-icon( class='mr-8' v-text="'mdi-information-slab-circle-outline'" @click='showUserInfo(item)' color="#0056ae" )
          v-icon( class='mr-8' v-text="'mdi-pencil'" @click='updateUser(item)'  color="#0fa704")
          v-icon( v-text="'mdi-delete'" @click='openDeleteDialog(item)'  color="#a71704")
        template(v-slot:footer)

      .text-center
        v-dialog(v-model='dialog' width='500')
          //delete user
          v-card(v-if="crudType===crudTypes.DELETE" )
            v-card-title.text-h5.primary.lighten-2.white--text Are you sure to delete {{selectedUserInfo?.firstName}}?
            v-divider
            v-card-actions
              v-btn.font-size-20(color="#ce2b2b" x-large text @click='dialog=false') Cancel
              v-spacer
              v-btn.font-size-20(color="#ce2b2b" x-large text @click='deleteUser') Delete User
          //add + update + show user
          v-card.px-4(v-else)
            user-form(:header="userFormHeader" :user-info="selectedUserInfo" :crudType="crudType" @showDialog="showDialog")

</template>

<script>
import {nextTick, onMounted, ref } from 'vue'
import {computed, useContext } from '@nuxtjs/composition-api'
import UserForm from "~/components/form/user-form/user-form.vue";
import crudTypes from "~/constants/crudTypes";

export default {
  name: 'UserList',
  components: {UserForm},

  setup() {
    const { store} = useContext()
    const dialog = ref(false)
    const dialogDelete = ref(false)
    const selectedUserInfo = ref({})
    const editText = computed(() => 'Read - Update - Delete')
    const search = ref('');
    const userList = computed(() => store.state['users'].userList)
    const crudType = ref(crudTypes.CREATE)

    const userFormHeader=computed(()=>{
      if(crudType.value===crudTypes.CREATE){
        return 'Add New User'
      }else  if(crudType.value===crudTypes.UPDATE){
        return 'Update User'
      }else  if(crudType.value===crudTypes.READ){
        return'User Info'
      }
    })

    const headers = ref([
      {text: 'Name', value: 'firstName', sortable: false},
      {text: 'Surname', value: 'lastName', sortable: false},
      {text: 'Country', value: 'country', sortable: false},
      {text: 'City', value: 'city', sortable: false},
      {text: editText.value, value: 'actions', sortable: false},
    ])

    onMounted(async () => {
      await nextTick()
      await getUserList()
    });

    const getUserList = async () => {
      try {
        await store.dispatch('users/getUsers')
      } catch (error) {
        console.error('Error fetching user list:', error);
      }
    };

    const openDeleteDialog = async (item) => {
      dialog.value = true
      crudType.value = crudTypes.DELETE
      selectedUserInfo.value = item
    }

    const addNewUser = () => {
      crudType.value = crudTypes.CREATE
      dialog.value = true
      selectedUserInfo.value={}
    }

    const updateUser = (user) => {
      dialog.value = true
      crudType.value = crudTypes.UPDATE
      selectedUserInfo.value = user
    }

    const deleteUser = async () => {
      try {
        await store.dispatch('users/deleteSelectedUser', { userId: selectedUserInfo.value?.id });
        await store.dispatch('users/getUsers');
        dialog.value = false;
      } catch (error) {
        console.error("user delete error:", error);
      }
    };

    const showUserInfo = (user) => {
      selectedUserInfo.value= {...user}
      crudType.value = crudTypes.READ
      dialog.value = true
    }

    const showDialog = (isDialogActive) => {
      dialog.value = isDialogActive
    }

    return {
      search,
      headers,
      userList,
      dialog,
      dialogDelete,
      selectedUserInfo,
      crudType,
      userFormHeader,
      crudTypes,
      updateUser,
      openDeleteDialog,
      deleteUser,
      showUserInfo,
      addNewUser,
      showDialog
    };
  },

};
</script>

<style lang="scss" src="./user-list.scss" />
