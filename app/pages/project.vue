<script setup lang="ts">
const project = {
    name: "test project",
    proj: "details",
    partners: ["partner1", "partner2", "partner3"],
    logoFilePath: 'KNMI.png'
}
</script>


<template>
  <div>
    <div class="flex">
        <h1 class = "toptext">{{ project.name }}</h1>
        <img :src="'/project_images/' + project?.logoFilePath "/> 
    </div>
    <p class = "middletext">{{ project.proj }}</p>
    <ul class = "middletext">
  <li v-for="partner in project.partners">{{ partner }}</li>
</ul>
  </div>
</template>


<style>
.middletext {
  font-Size: 20px;
  margin-left: 10px;
  overflow-wrap: break-word;
}
.toptext {
  font-Size: 45px;
  margin-left: 10px;
}
.bottomtext {
  font-Size: 25px;
  margin-left: 10px;
}
.imageadjust {
  text-align: center;
}
</style>

