import * as React from 'react';
import './match-list.component.scss';
import { Grid, Header, Table } from 'semantic-ui-react'
import { SummonerMatches } from 'src/models/summoner-matches';
import { WinLossEnum } from 'src/models/summoner-match-statistic';

interface MatchListProps {
  matches: SummonerMatches | undefined;
}

export class MatchListComponent extends React.Component<MatchListProps, {}> {
  constructor(props: MatchListProps) {
    super(props);
  }

  getRowColor(winLossEnum: WinLossEnum | undefined) {
    if (winLossEnum === WinLossEnum.WIN) {
      return 'green';
    }
    else if (winLossEnum === WinLossEnum.LOST) {
      return 'red';
    }
    return 'grey';
  }

  // DO NOT push boolean in JSX expression. It will fix this issue.
  // https://github.com/react-toolbox/react-toolbox/issues/1523
  render() {
    if (this.props.matches && this.props.matches.matchStats && this.props.matches.matchStats.length > 0) {
      return ( 
        <>
          <Header as='h1'>Match History for {this.props.matches.summonerName}</Header>
          <Table>
          
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Outcome</Table.HeaderCell>
              <Table.HeaderCell>Game Duration (in minutes)</Table.HeaderCell>
              <Table.HeaderCell>Summoner Spells</Table.HeaderCell>
              <Table.HeaderCell>Summoner Runes</Table.HeaderCell>
              <Table.HeaderCell>Champion Used</Table.HeaderCell>
              <Table.HeaderCell>Champion Level</Table.HeaderCell>
              <Table.HeaderCell>Kills / Deaths / Assists</Table.HeaderCell>
              <Table.HeaderCell>Items Bought</Table.HeaderCell>
              <Table.HeaderCell>Neutral Minions Killed</Table.HeaderCell>
              <Table.HeaderCell>Total Minions Killed</Table.HeaderCell>
              <Table.HeaderCell>Neutral Minions Killed in Enemy Jungle</Table.HeaderCell>
              <Table.HeaderCell>Neutral Minions Killed in Team Jungle</Table.HeaderCell>
              <Table.HeaderCell>Creep Score Per Minute</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.props.matches.matchStats.map((matchStat)=> (
              <Table.Row key={matchStat.id}>
                <Table.Cell>
                  {matchStat.getWinLost}
                </Table.Cell>
                <Table.Cell>
                  {matchStat.gameDurationInMinutes}
                </Table.Cell>
                <Table.Cell>
                  {matchStat.summonerSpells ? <div>{matchStat.summonerSpells.firstSummonerSpell}</div> : <div>'N/A'</div>}
                  {matchStat.summonerSpells ? <div>{matchStat.summonerSpells.secondSummonerSpell}</div> : <div>'N/A'</div>}
                </Table.Cell>
                <Table.Cell>
                  {
                    matchStat.runes ?
                    matchStat.runes.map((rune, index) => (
                      <div key = {index}>
                        {rune}
                      </div>
                    ))
                    :
                    <div>N/A</div>
                  }
                </Table.Cell>
                <Table.Cell>
                  {matchStat.champName}
                </Table.Cell>
                <Table.Cell>
                  {matchStat.champLvl}
                </Table.Cell>
                <Table.Cell>
                  {matchStat.numKills} / {matchStat.numDeaths} / {matchStat.numAssists}
                </Table.Cell>
                <Table.Cell>
                  {
                    matchStat.items ?
                    matchStat.items.map((item, index) => (
                      <div key = {index}>
                        {item}
                      </div>
                    ))
                    :
                    <div>N/A</div>
                  }
                </Table.Cell>

                <Table.Cell>
                  {matchStat.neutralMinionsKilled}
                </Table.Cell>

                <Table.Cell>
                  {matchStat.totalMinionsKilled}
                </Table.Cell>

                <Table.Cell>
                  {matchStat.neutralMinionsKilledEnemyJungle}
                </Table.Cell>

                <Table.Cell>
                  {matchStat.neutralMinionsKilledTeamJungle}
                </Table.Cell>

                <Table.Cell>
                  {matchStat.creepScorePerMinute}
                </Table.Cell>
                
              </Table.Row>
            ))}
              </Table.Body>
          </Table>
        </>
      );
    }
    else {
      return(
        <div>No match histories found</div>
      );
    }
  }
}