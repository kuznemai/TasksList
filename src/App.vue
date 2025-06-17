<script setup lang="ts">
import Item from "@/components/Item.vue";
import {useStore} from "vuex";
import {onMounted, ref, watch} from "vue";
import {computed} from "@vue/runtime-dom";
import { Task } from './types'


const store = useStore()
const newTask = ref('')

const tabs = ['all', 'completed', 'pending']
const tabTitles: Record<string, string> = {
  all: 'Все',
  completed: 'Выполненные',
  pending: 'Невыполненные'
}

const activeTab = ref<'all' | 'completed' | 'pending'>('all')

watch(activeTab, (newTab) => {
  store.state.filter = newTab
})

const tasks = computed(() => store.getters.filteredTasks as Task[])

onMounted(() => {
  store.dispatch('loadTasks')
})
function addTask() {
  if (newTask.value.trim() !== '') {
    store.dispatch('addItem', newTask.value.trim())
    newTask.value = ''
  }
}
function removeTask(id: number){
  store.dispatch('deleteTask', id)
}

</script>


<template>
  <div class="wrapper">
    <div class="tabs">
      <div class="tab-buttons">
        <button
            v-for="tab in tabs"
            :key="tab"
            :class="{ active: tab === activeTab }"
            @click="activeTab = tab"
        >
          {{ tabTitles[tab] }}
        </button>
      </div>

      <div class="tab-content">
        <div v-if="activeTab === 'all'">Все задачи</div>
        <div v-else-if="activeTab === 'completed'">Выполненные задачи</div>
        <div v-else-if="activeTab === 'pending'">Невыполненные задачи</div>
      </div>
    </div>
    <div class="inprocess">
        <ul>
          <li
              class="list-item"
              v-for="task in tasks"
              :key="task.id"
          >
            <Item
                :task="task"
                @delete-item="removeTask"
                @sendCheckboxState="store.dispatch('changeCheckboxState', $event)"
            />
          </li>
        </ul>
    </div>
    <button @click="addTask" class="addbutton">Добавить заметку</button>
    <input
        v-model="newTask"
        type="text"
        class="edit-input"
        placeholder="Введите вашу заметку"
    />
  </div>
</template>

<style>
.wrapper {
  width: 100%;
}

.inprocess {
  width: 95%;
  gap: 10px;
}

.list-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  width: 200px;
  height: 300px;
  border: 1px solid #000000;
  border-radius: 20px;
  gap: 20px;
  list-style-type: none;
  margin-bottom: 15px;
}

.items_list {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
  padding-bottom: 50px;
  border-bottom: 5px dashed grey;
  height: 350px;
}

.right_list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
  height: 350px;
}

.header_title {
  font-size: 24px;
  width: 100%;
  height: 40px;
}

.done {
  width: 45%;
}

.addbutton {
  width: 150px;
  height: 40px;
  background-color: #17880f;
  border-radius: 10px;
  color: beige;
  font-size: 16px;
  margin: 20px;
}

.tab-buttons {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.tab-buttons button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: #eee;
  cursor: pointer;
  border-radius: 5px;
}

.tab-buttons button.active {
  background-color: #17880f;
  color: white;
  font-weight: bold;
}
</style>
