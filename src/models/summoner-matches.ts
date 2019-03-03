import { SummonerMatchStatistic } from './summoner-match-statistic';

export class SummonerMatches {
  constructor(public summonerName: string, public matchStats?: SummonerMatchStatistic[]) {
    this.matchStats = this.matchStats ? this.matchStats : [];
  }
}