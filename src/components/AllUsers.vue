<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import axiosInstance from '../router/axios';
import Card from 'primevue/card';



const users = ref([]);
const loading = ref(false);

const columns = ref([
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' },
  { field: 'email', header: 'Email' },
  { field: 'phone', header: 'phone' },
]);

onMounted(async () => {
  loading.value = true;
  try {
    const response = await axiosInstance.get('/admin/users');
    users.value = response.data; 
  } catch (error) {
    console.error("Failed to fetch users:", error);
  } finally {
    loading.value = false;
  }
  console.log(users);
  

});
</script>

<template>

  <div class=" gap-10  flex flex-wrap w-full">
    <Card v-for="(user, index) in users" :key="index" class="basis-1/4  bg-white border ">
        <template  #title>
          <div style="color: black;">
            {{ user.name }}
          </div></template>
        <template #content>
            <p class="m-0 text-gray-700">
               {{ user.email }}
            </p>
            <p class="m-0 text-gray-700">
                {{ user.role }}
            </p>
            <p class="m-0 text-gray-700">
                {{ user.phone }}
            </p>
        </template>
        
    </Card>
  </div>

</template>
