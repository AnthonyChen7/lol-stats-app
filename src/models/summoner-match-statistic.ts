export class SummonerMatchStatistic {
  // TODO write fxn to getthat thing where you need to calculate
  // gameDuration is in seconds
  // TODO might want to remove summonerName in future... ?
  constructor(public summonerName?: string, public gameDurationInSeconds?: number, public champName?: string, public summonerSpells?: SummonerSpellInfo, public isWin?: boolean, public numKills?: number, public numDeaths?: number, public numAssists?: number,
    public neutralMinionsKilled?: number, public neutralMinionsKilledTeamJungle?: number, public champLvl?: number,
    public items?: (string| undefined)[], public totalMinionsKilled?: number, public neutralMinionsKilledEnemyJungle?: number,
    public runes?: (string| undefined)[], public id?: string | number) {

  }

  get gameDurationInMinutes() {
    return this.gameDurationInSeconds === undefined ? 0 : this.gameDurationInSeconds / 60;
  }

  get creepScorePerMinute() {
    return this.totalMinionsKilled === undefined ? 0 : this.totalMinionsKilled / this.gameDurationInMinutes;
  }

  get getWinLost() {
    if (this.isWin === true) {
      return WinLossEnum.WIN;
    }
    else if (this.isWin === false) {
      return WinLossEnum.LOST
    }
    else {
      return undefined;
    }
  }
}

export interface SummonerSpellInfo {
  firstSummonerSpell: string | undefined;
  secondSummonerSpell: string | undefined;
}

export enum WinLossEnum {
  WIN = 'Win',
  LOST = 'Lost'
}