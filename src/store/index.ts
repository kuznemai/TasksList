import { createStore } from 'vuex'
import { Task } from '../types'
import {ref} from "vue";

interface State {
    tasks: Task[];
    filter: 'all' | 'completed' | 'pending';
}
let taskId = ref(0);

function simulateApi<T>(data: T, delay = 500): Promise<T> {
    return new Promise(resolve => setTimeout(() => resolve(data), delay))
}
export default createStore<State>({
    state: {
        tasks: [],
        filter: 'all',
    },
    mutations: {
        setTasks(state, tasks: Task[]) {
            state.tasks = tasks;
        },
        addItem(state, title: string) {
            state.tasks.push({ id: taskId.value++, title: title, isChecked: false})
        },
        deleteTask(state, id: number) {
            state.tasks = state.tasks.filter(item => item.id !== id)
        },
        changeCheckboxState(state, {id, status}) {
            const item = state.tasks.find(item => item.id === id)
            if (item) {
                item.isChecked = status
            }
        }
    },
    actions: {
        async loadTasks({ commit }) {
            const mockTasks: Task[] = [
                { id: taskId.value++, title: 'Я заметка номер 1', isChecked: false },
                { id: taskId.value++, title: 'Я заметка номер 2', isChecked: false },
            ]
            const tasks = await simulateApi(mockTasks)
            commit('setTasks', tasks)
        },
        async addItem({ commit }, title: string) {
            await simulateApi(null)
            commit('addItem', title)
        },
        async deleteTask({ commit }, id: number) {
            await simulateApi(null)
            commit('deleteTask', id)
        },
        async changeCheckboxState({ commit }, payload: { id: number; status: boolean }) {
                await simulateApi(null)
                commit('changeCheckboxState', payload)
            },
    },
    getters: {
        filteredTasks(state): Task[] {
            switch (state.filter) {
                case 'completed':
                    return state.tasks.filter(t => t.isChecked)
                case 'pending':
                    return state.tasks.filter(t => !t.isChecked)
                default:
                    return state.tasks
            }
        }
    }
})