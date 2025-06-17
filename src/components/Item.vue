<script setup lang="ts">
import {defineProps, ref} from 'vue'
import { Task } from '/src/types.ts'

const props =defineProps<{
  task: Task
}>()

const emit = defineEmits(['deleteItem', 'sendCheckboxState'])
function removeItem(id){
  emit('deleteItem', props.task.id)
}
function sendCheckboxState(){
  emit('sendCheckboxState', { id: props.task.id, completed: checkedState.value })
}

function handleCheckboxChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('sendCheckboxState', { id: props.task.id, status: target.checked })
}
</script>

<template>
  <p  class="big">{{ task.title }}</p>

  <form>
    <input
        type="checkbox"
        id="checkbox"
        class="edit-input"
        :checked="task.isChecked"
        @change="handleCheckboxChange"
    />
    <label>Done</label>
  </form>
  <button @click="removeItem()" class="delete">Delete</button>

</template>

<style>

.big {
  width: 180px;
  height: 30px;
  font-size: 20px;
}

.delete {
  background-color: red;
  color: white;
  width: 60px;
  height: 30px;
  border: 1px solid darkred;
  border-radius: 10px;
}

.edit-input {
  font-size: 16px;
  padding: 5px;
  border: 1px solid #5b5b5b;
  border-radius: 5px;
}

</style>