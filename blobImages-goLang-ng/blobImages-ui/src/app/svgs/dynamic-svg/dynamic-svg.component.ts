import { Component, Input } from '@angular/core';

interface Size {
  width: number;
  height: number;
}

@Component({
  selector: 'app-dynamic-svg',
  imports: [],
  templateUrl: './dynamic-svg.component.html',
  styleUrl: './dynamic-svg.component.scss'
})
export class DynamicSvgComponent {
  @Input() size: Size = { width: 28, height: 28 };
}
