import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayComponent } from './play/play.component';
import { SettingsPageComponent } from './settings-page/settings-page.component';

const routes: Routes = [
   { path: "play", component: PlayComponent },
   { path: "settings", component: SettingsPageComponent }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
