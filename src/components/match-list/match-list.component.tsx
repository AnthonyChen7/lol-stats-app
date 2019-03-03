import * as React from 'react';
import './match-list.component.scss';
import { Grid, Header } from 'semantic-ui-react'
import { SummonerMatches } from 'src/models/summoner-matches';

interface MatchListProps {
  matches: SummonerMatches | undefined;
}

export class MatchListComponent extends React.Component<MatchListProps, {}> {
  constructor(props: MatchListProps) {
    super(props);
  }

  // DO NOT push boolean in JSX expression. It will fix this issue.
  // https://github.com/react-toolbox/react-toolbox/issues/1523
  render() {
    if (this.props.matches && this.props.matches.matchStats && this.props.matches.matchStats.length > 0) {
      return ( 
        <>
          <Header as='h1'>Match History for {this.props.matches.summonerName}</Header>
          <Grid padded>
            {this.props.matches.matchStats.map( (matchStat) => (
              <Grid.Row color={'red'} key={matchStat.id}>
                <Grid.Column>{matchStat.champName}</Grid.Column>
              </Grid.Row>
            ))}
          </Grid>
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