import * as React from 'react';
import './App.css';

import {SearchBarComponent} from './components/search-bar/search-bar.component';
import {MatchListComponent} from './components/match-list/match-list.component';
import { MatchStatisticService } from './services/match-statistic.service';
import { SummonerMatchStatistic } from './models/summoner-match-statistic';
import { SummonerMatches } from './models/summoner-matches';

// TODO fix his
// const SEARCH_BAR_REGEX = '^[0-9]+$';
const SEARCH_BAR_REGEX = undefined;

// TODO fix this
// const SEARCH_BAR_ERROR_MSG = 'Value be must be a number';
const SEARCH_BAR_ERROR_MSG = undefined;
interface AppState {
  searchResult?: SummonerMatches | undefined;
}
class App extends React.Component<{}, AppState> {
  private matchStatsService: MatchStatisticService;
  // private searchResults: SummonerMatchStatistic[];
  constructor() {
    super({});
    this.matchStatsService = new MatchStatisticService();
  }

  componentDidMount() {
    this.matchStatsService.loadChampions();
    this.matchStatsService.loadItems();
  }

  onSearchClicked(searchVal: string): void {
    // TODO do it like this for now
    this.matchStatsService.getMatchStatisticsForSummoner(searchVal, 0 ,25)
    .then((result: SummonerMatchStatistic[]) => {
      // this.searchResults = result;
      this.setState({searchResult: new SummonerMatches(searchVal, result)});
    })
    .catch();
  }
  public render() {
    return (
      // https://errors.wtf/left-side-of-comma-operator-is-unused-and-has-no-side-effects/
      <div>
        <SearchBarComponent
          regularExp = {SEARCH_BAR_REGEX}
          errorMsg = {SEARCH_BAR_ERROR_MSG} 
          searchClicked = { (searchVal: string) => this.onSearchClicked(searchVal) } />
        {this.state && this.state.searchResult && 
        <MatchListComponent
          matches = {this.state.searchResult}
         />
         }
      </div>
      
    );
  }
}

export default App;
