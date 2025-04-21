export interface OrgChartNode {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  imageUrl: string;
  children: OrgChartNode[];
} 