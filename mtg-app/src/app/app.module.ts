import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { TokenInterceptorService } from './token-interceptor.service';
import { Token } from '@angular/compiler';
import { GatheringComponent } from './gathering/gathering.component';
import { GatheringService } from './gathering.service';
import { TradeService} from './trading/trade.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule,
         MatInputModule,
         MatTabsModule,
         MatTableModule,
         MatFormFieldModule,
         MatAutocompleteModule,
         MatSidenavModule} from '@angular/material';
import { EditListComponent } from './edit-list/edit-list.component';
import { ViewListComponent } from './view-list/view-list.component';
import { EditCollectionComponent } from './edit-collection/edit-collection.component';
import { ViewCollectionComponent } from './view-collection/view-collection.component';
import { GatheringAquireComponent } from './gathering-aquire/gathering-aquire.component';
import { HomeComponent } from './home/home.component';
import { GatheringTableComponent } from './gathering-table/gathering-table.component';
import { CardShowComponent } from './card-show/card-show.component';
import { NavbarComponent } from './navbar/navbar.component';
import { EditCardComponent } from './edit-card/edit-card.component';
import { TradeComponent } from './trading/trade/trade.component';
import { TradeMessageComponent } from './trading/trade-message/trade-message.component';
import { TradeDisplayComponent } from './trading/trade-display/trade-display.component';
import { TradeTrayComponent } from './trading/trade-tray/trade-tray.component';
import { ProfileComponent } from './profile/profile.component';
import { FilterComponent } from './filter/filter.component';
import { AutocompleteComponent } from './autocomplete/autocomplete.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    PageNotFoundComponent,
    GatheringComponent,
    EditListComponent,
    ViewListComponent,
    GatheringAquireComponent,
    HomeComponent,
    EditCollectionComponent,
    ViewCollectionComponent,
    GatheringTableComponent,
    CardShowComponent,
    NavbarComponent,
    EditCardComponent,
    TradeComponent,
    TradeMessageComponent,
    TradeDisplayComponent,
    TradeTrayComponent,
    ProfileComponent,
    FilterComponent,
    AutocompleteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatInputModule,
    MatTabsModule,
    MatTableModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSidenavModule
  ],
  providers: [AuthService, AuthGuard, GatheringService, TradeService, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
