<script setup lang="ts">
import Item from "@/components/Item.vue";
import { useStore } from "vuex";
import { onMounted, ref, watch } from "vue";
import { computed } from "@vue/runtime-dom";
import { TabItem, Tabs, Task } from "./types";

const store = useStore();
const newTask = ref("");

const tabs: TabItem[] = [
  { id: "all", tabTitle: "Все", tabContent: "Все задачи" },
  {
    id: "completed",
    tabTitle: "Выполненные",
    tabContent: "Выполненные задачи",
  },
  {
    id: "pending",
    tabTitle: "Невыполненные",
    tabContent: "Невыполненные задачи",
  },
];

const activeTab = ref<Tabs>("all");

watch(activeTab, (newTab) => {
  store.state.filter = newTab;
});

const activeTabContent = computed(() => {
  const current = tabs.find((tab) => tab.id === activeTab.value);
  return current?.tabContent || "";
});

const tasks = computed(() => store.getters.filteredTasks as Task[]);

onMounted(() => {
  store.dispatch("loadTasks");
});

function addTask() {
  if (newTask.value.trim() !== "") {
    store.dispatch("addItem", newTask.value.trim());
    newTask.value = "";
  }
}

function removeTask(id: number) {
  store.dispatch("deleteTask", id);
}
</script>

<template>
  <div class="wrapper">
    <div class="tabs">
      <div class="tab-buttons">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="{ active: tab.id === activeTab }"
          @click="activeTab = tab.id"
        >
          {{ tab.tabTitle }}
        </button>
      </div>

      <div class="tab-content">
        <div>{{ activeTabContent }}</div>
      </div>

      <div class="note_adding_block">
        <input
          v-model="newTask"
          type="text"
          class="edit-input"
          placeholder="Введите вашу заметку"
        />
        <button @click="addTask" class="addbutton">Добавить заметку</button>
      </div>
    </div>
    <div class="inprocess">
      <ul>
        <li class="list-item" v-for="task in tasks" :key="task.id">
          <Item
            :task="task"
            @delete-item="removeTask"
            @sendCheckboxState="store.dispatch('changeCheckboxState', $event)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
$primary-color: #757575;
$secondary-color: #f0f0f0;
$text-color: #333;
$bg-color: #ffffff;
$accent-color: #e0e0e0;
$border-radius: 12px;
$spacing: 16px;
$font-size: 16px;
$transition: 0.2s ease-in-out;

.wrapper {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: $spacing;
  font-family: "Segoe UI", sans-serif;
  background-color: $bg-color;
  color: $text-color;
}

.tabs {
  margin-bottom: $spacing * 1.5;

  .tab-buttons {
    display: flex;
    gap: $spacing;
    margin-bottom: $spacing;

    button {
      flex: 1;
      padding: 10px 20px;
      border: none;
      background-color: $accent-color;
      color: $text-color;
      border-radius: $border-radius;
      cursor: pointer;
      transition: background-color $transition;

      &:hover {
        background-color: darken($accent-color, 5%);
      }

      &.active {
        background-color: $primary-color;
        color: white;
        font-weight: 600;
      }
    }
  }

  .tab-content {
    margin-bottom: $spacing;
    font-size: $font-size;
    padding: 8px 0;
  }

  .note_adding_block {
    display: flex;
    gap: $spacing;
    flex-wrap: wrap;

    input.edit-input {
      flex: 1;
      padding: 10px;
      font-size: $font-size;
      border: 1px solid #ccc;
      border-radius: $border-radius;
      transition: border-color $transition;

      &:focus {
        border-color: $primary-color;
        outline: none;
      }
    }

    .addbutton {
      padding: 10px 20px;
      background-color: $primary-color;
      color: white;
      border: none;
      border-radius: $border-radius;
      font-size: $font-size;
      cursor: pointer;
      transition: background-color $transition;

      &:hover {
        background-color: darken($primary-color, 5%);
      }
    }
  }
}

.inprocess {
  margin-top: $spacing;

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: $spacing;
    padding: 0;
    margin: 0;

    .list-item {
      flex: 1 1 calc(33% - #{$spacing});
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: $spacing;
      min-width: 220px;
      background-color: $secondary-color;
      border-radius: $border-radius;
      list-style: none;
      border: 1px solid #ddd;
      transition: box-shadow $transition;
      gap: 10px;

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }
    }
  }
}
</style>
