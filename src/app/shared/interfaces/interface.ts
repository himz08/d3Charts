export interface BarChartData {
    Name: string;
    Orders: number;
    id?: any;
}

export interface PiChartData {
    name: string;
    cost: number;
    id?: any;
}

export interface LineChartData {
    distance: number;
    server: number;
    date: string;
    id?: any;
}

export interface HChartData {
    name: string;
    parent: string;
    department: string;
    id?: any;
}
