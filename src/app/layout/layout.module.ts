import { NgModule } from '@angular/core';
import { HeaderBarComponent } from './header-bar/header-bar.component';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from './side-bar/side-bar.component';

const shared = [
    HeaderBarComponent,
    SideBarComponent
];

@NgModule({
    declarations: [
        ...shared
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        ...shared
    ]
})
export class LayoutModule { }
