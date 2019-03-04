import { SummonerMatchStatistic } from 'src/models/summoner-match-statistic';
import { isNullOrUndefined } from 'util';

// TODO turn this into a service
// TODO somehow learn to integrate depedency injection
// TODO might want to rename this in the future to something more general

// TODO this is a terrible idea. should put API key somwhere else
const API_KEY = 'RGAPI-c823e107-e4c1-4e63-be3d-45044eb2d3d5';

// TODO remove this
const TEST_SUMMONER = 'flyinXhobo';


const CHAMPIONS_DATA_URL = 'http://ddragon.leagueoflegends.com/cdn/8.14.1/data/en_US/champion.json';
const ITEMS_DATA_URL = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/item.json';
const SUMMONER_SPELL_DATA_URL = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/summoner.json';
const RUNES_DATA_URL = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/rune.json';

export class MatchStatisticService {
  private championMap: Map<string, string>;
  private itemsMap: Map<string, string>;
  private summonerSpellsMap: Map<string, string>;
  private runesMap: Map<string, string>;

  async loadStaticData() {
    await this.loadChampions();
    await this.loadItems();
    await this.loadSummonerSpells();
    await this.loadRunes();
  }

  async loadRunes () {
    if (!this.runesMap) {
      const runesJson = await this.getRunesJSON();
      this.runesMap = new Map<string, string>();
      for (const runeId of Object.keys(runesJson.data)) {
        const value = runesJson.data[runeId]['name'];
        this.runesMap.set(runeId, value);
      }
    }
  }
  // TODO should fix this
  async loadChampions() {
    if (!this.championMap) {
      const championJson = await this.getChampionJSON();
      this.championMap = new Map<string, string>();
      for (const champName of Object.keys(championJson.data)) {
        const key: string = championJson.data[champName]['key'];
        this.championMap.set(key, champName);
      }
    }
  }

  async loadSummonerSpells() {
    if (!this.summonerSpellsMap) {
      const summonerSpellsJson = await this.getSummonerSpellJSON();
      this.summonerSpellsMap = new Map<string, string>();
      for (const jsonKey of Object.keys(summonerSpellsJson.data)) {
        const key: string = summonerSpellsJson.data[jsonKey]['key'];
        const value: string = summonerSpellsJson.data[jsonKey]['name'];
        this.summonerSpellsMap.set(key, value);
      }
    }
  }

  async loadItems() {
    if (!this.itemsMap) {
      const itemsJson = await this.getItemsJSON();
      this.itemsMap = new Map<string, string>();
      for (const itemId of Object.keys(itemsJson.data)) {
        const value: string = itemsJson.data[itemId]['name'];
        this.itemsMap.set(itemId, value);
      }
    }
  }
  // TODO refactor and clean this up
  async getMatchStatisticsForSummoner(summonerName: string, begin?: number, end?: number): Promise<SummonerMatchStatistic[]>  {
    const summonerMatchStats : SummonerMatchStatistic[] = [];
    let  responseJson = await this.getSummonerNameInfo(summonerName);

    const summonerNameResponse = responseJson['name'];

    const accountId = responseJson['accountId'];

    responseJson = await this.getMatchListsByAccountId(accountId,begin ,end);

    const matchIds = (responseJson['matches'] as any[]).map(element => element['gameId']);

    if (matchIds) {
      for (let i = 0 ; i < matchIds.length; i++) {
        responseJson = await this.getMatchInfoByMatchId(matchIds[i]);
        const summonerMatchStat = new SummonerMatchStatistic();
        summonerMatchStat.id = matchIds[i];
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
              // cast to string because api store it as an int
              summonerMatchStat.champName = this.championMap.get('' +participant.championId);

              summonerMatchStat.summonerSpells = {
                // cast to string because api store it as an int
                firstSummonerSpell: this.summonerSpellsMap.get(''+participant.spell1Id),
                secondSummonerSpell: this.summonerSpellsMap.get(''+participant.spell2Id)
              };

              if(participant.runes) {
                summonerMatchStat.runes = [];
                // cast to string because api store it as an int
                for( const runeInfo of participant.runes) {
                  if (this.runesMap.has('' + runeInfo.runeId)) {
                    summonerMatchStat.runes.push(this.runesMap.get('' + runeInfo.runeId));
                  }
                }
              }

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
                  // cast to string because api store it as an int
                  this.itemsMap.get(''+stats.item0),
                  this.itemsMap.get(''+stats.item1),
                  this.itemsMap.get(''+stats.item2),
                  this.itemsMap.get(''+stats.item3),
                  this.itemsMap.get(''+stats.item4),
                  this.itemsMap.get(''+stats.item5),
                  this.itemsMap.get(''+stats.item6),
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

  private async getChampionJSON() {
    let response = await fetch(CHAMPIONS_DATA_URL);
    return response.json();
  }

  private async getItemsJSON() {
    let response = await fetch(ITEMS_DATA_URL);
    return response.json();
  }

  private async getSummonerSpellJSON() {
    let response = await fetch(SUMMONER_SPELL_DATA_URL);
    return response.json();
  }

  private async getRunesJSON() {
    let response = await fetch(RUNES_DATA_URL);
    return response.json();
  }
}