<script setup>
import { onBeforeMount, reactive } from 'vue';

import Card from 'primevue/card';

import { logout } from '../Authentication/auth';

import axiosInstance from '../router/axios';

let profileDetails = reactive({

});
onBeforeMount(async () => {
    try {
        const response = await axiosInstance.get('/user/profile')
        Object.assign(profileDetails, response.data);
    } catch (error) {
        console.log('error fetching profile details', error);
    }

})

const handleLogout = () => {
    logout();
}


</script>


<template>
    <Card style="background-color: white; margin-top: 25px; z-index: 10; width: 18rem; overflow: hidden; right: 10px; position: absolute;">
        
        <template #title>
            <p class="text-gray-600 m-0"  >{{ profileDetails.name }}</p></template>
        <template #content>
            <p class=" text-gray-400 m-0">
               Email: {{ profileDetails.email }}
            </p>
            <p class=" text-gray-400 m-0">
                Role: {{ profileDetails.role }}
            </p>
            
        </template>
        <template #footer>
        <div class=" flex gap-4 mt-1 logout-button">
            <Button 
  :onclick="handleLogout"
  label="LOGOUT"
  class="w-full"
  style="color: white; background: linear-gradient(135deg, #1e398a 0%, #1d4ed8 100%); border: none;"
/>

        </div>
    </template>
    </Card>
</template>
