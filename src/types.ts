export interface Task {
    id: number;
    title: string;
    isChecked: boolean;
}

export type Tabs = 'all' | 'completed' | 'pending'

export interface TabItem {
    id: Tabs;
    tabTitle: string;
    tabContent: string;
}