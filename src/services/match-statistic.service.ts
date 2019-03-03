import { SummonerMatchStatistic } from 'src/models/summoner-match-statistic';
import { isNullOrUndefined } from 'util';

// TODO turn this into a service
// TODO somehow learn to integrate depedency injection
// TODO might want to rename this in the future to something more general

// TODO this is a terrible idea. should put API key somwhere else
const API_KEY = 'RGAPI-ee1825b5-50e7-4c2c-aa27-3208c10ccff2';

// TODO remove this
const TEST_SUMMONER = 'flyinXhobo';

export class MatchStatisticService {
  // TODO refactor and clean this up
  async getMatchStatisticsForSummoner(summonerName: string, begin?: number, end?: number): Promise<SummonerMatchStatistic[]>  {
    const summonerMatchStats : SummonerMatchStatistic[] = [];
    let  responseJson = await this.getSummonerNameInfo(summonerName);

    const summonerNameResponse = responseJson['name'];

    const accountId = responseJson['accountId'];

    responseJson = await this.getMatchListsByAccountId(accountId,begin ,end);

    const matches = (responseJson['matches'] as any[]).map(element => element['gameId']);

    if (matches) {
      for (let i = 0 ; i < matches.length; i++) {
        responseJson = await this.getMatchInfoByMatchId(matches[i]);
        const summonerMatchStat = new SummonerMatchStatistic();

        summonerMatchStat.summonerName = summonerNameResponse;
        summonerMatchStat.gameDurationInSeconds = responseJson['gameDuration'];

        const participantIdentities = responseJson['participantIdentities'] as any[];
        const participantIdentity = participantIdentities.find(element => 
           (element.player && element.player.summonerName === summonerNameResponse));
        if (participantIdentity) {
          const participantId = participantIdentity.participantId;

          const participants = responseJson['participants'] as any[];
          for (const participant of participants) {
            if (participant.participantId === participantId) {

              summonerMatchStat.champId = participant.championId;

              summonerMatchStat.summonerSpellIds = {
                firstSummonerSpellId: participant.spell1Id,
                secondSummonerSpellId: participant.spell2Id
              };

              const stats = participant.stats;
              if (stats) {
                summonerMatchStat.isWin = stats.win;

                // refactor into object?
                summonerMatchStat.numKills = stats.kills;
                summonerMatchStat.numDeaths = stats.deaths;
                summonerMatchStat.numAssists = stats.assists;

                // TODO refactor this by creating possibly an interface for it
                summonerMatchStat.neutralMinionsKilled = stats.neutralMinionsKilled;
                summonerMatchStat.neutralMinionsKilledTeamJungle = stats.neutralMinionsKilledTeamJungle;
                summonerMatchStat.totalMinionsKilled = stats.totalMinionsKilled;
                summonerMatchStat.neutralMinionsKilledEnemyJungle = stats.neutralMinionsKilledEnemyJungle;
                
                summonerMatchStat.champLvl = stats.champLevel;

                summonerMatchStat.items = [
                  stats.item0,
                  stats.item1,
                  stats.item2,
                  stats.item3,
                  stats.item4,
                  stats.item5,
                  stats.item6,
                ];

                summonerMatchStat.perks = [
                  stats.perk0,
                  stats.perk1,
                  stats.perk2,
                  stats.perk3,
                  stats.perk4,
                  stats.perk5
                ];
                summonerMatchStats.push(summonerMatchStat);
              }
      
              break;
            }
          }
        }
      }
    }

    return summonerMatchStats;
  }

  private async getSummonerNameInfo(summonerName: string) {
    // https://developer.riotgames.com/api-methods/#summoner-v4/GET_getBySummonerName
    let response =
      await fetch(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${TEST_SUMMONER}?api_key=${API_KEY}`);
      return response.json();
  }

  private async getMatchListsByAccountId(accountId: string, begin?: number, end?: number) {
    // https://developer.riotgames.com/api-methods/#match-v4/GET_getMatchlist
    const beginQueryParam = isNullOrUndefined(begin) || begin < 0 ? 0 : begin;
    const endQueryParam = isNullOrUndefined(end) || end > 100 ? 100 : end;
    let response =
      await fetch(`https://na1.api.riotgames.com/lol/match/v4/matchlists/by-account/${accountId}?api_key=${API_KEY}&beginIndex=${begin}&endIndex=${end}`);
      return response.json();
  }

  private async getMatchInfoByMatchId(matchId: string) {
    // https://developer.riotgames.com/api-methods/#match-v4/GET_getMatchlist
    
    let response =
      await fetch(`https://na1.api.riotgames.com/lol/match/v4/matches/${matchId}?api_key=${API_KEY}`);
      return response.json();
  }
}