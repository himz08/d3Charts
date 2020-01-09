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

export interface DruidData   {
    'version': string;
    'timestamp': string;
    'average'?: number;
    'instance_name'?: string;
    'event': {
      'project_uuid': string;
      'other_details': null,
      'average': number;
      'total': 5,
      'instance_name': string;
      'metric_type': string;
      'instance_uuid': string;
      'double_sum': number;
    };
  }
