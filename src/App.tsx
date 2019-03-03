import * as React from 'react';
import './App.css';

import {SearchBarComponent} from './components/search-bar/search-bar.component';
import {MatchListComponent} from './components/match-list/match-list.component';
import { MatchStatisticService } from './services/match-statistic.service';

// TODO fix his
// const SEARCH_BAR_REGEX = '^[0-9]+$';
const SEARCH_BAR_REGEX = undefined;


// TODO fix this
// const SEARCH_BAR_ERROR_MSG = 'Value be must be a number';
const SEARCH_BAR_ERROR_MSG = undefined;

class App extends React.Component<{}, {}> {
  private matchStatsService: MatchStatisticService;
  constructor() {
    super({});
    this.matchStatsService = new MatchStatisticService();
  }

  onSearchClicked(searchVal: string): void {
    this.matchStatsService.getMatchStatisticsForSummoner(searchVal);
  }
  public render() {
    return (
      // https://errors.wtf/left-side-of-comma-operator-is-unused-and-has-no-side-effects/
      <div>
        <SearchBarComponent
          regularExp = {SEARCH_BAR_REGEX}
          errorMsg = {SEARCH_BAR_ERROR_MSG} 
          searchClicked = { (searchVal: string) => this.onSearchClicked(searchVal) } />
        <MatchListComponent />
      </div>
      
    );
  }
}

export default App;
