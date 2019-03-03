import * as React from 'react';
import './match-list.component.scss';
import { Grid } from 'semantic-ui-react'
import { SummonerMatchStatistic } from 'src/models/summoner-match-statistic';
import { SummonerMatches } from 'src/models/summoner-matches';

interface MatchListProps {
  // matches: SummonerMatchStatistic[]
  matches: SummonerMatches | undefined;
}

export class MatchListComponent extends React.Component<MatchListProps, {}> {
  constructor(props: MatchListProps) {
    super(props);
  }

  
  componentDidUpdate(prevProps: MatchListProps) {
    console.log(prevProps);
  } 
  // DO NOT push boolean in JSX expression. It will fix this issue.
  // https://github.com/react-toolbox/react-toolbox/issues/1523
  render() {
    if (this.props.matches && this.props.matches.matchStats && this.props.matches.matchStats.length > 0) {
      return ( 
        // <>
          <Grid padded>
            {this.props.matches.matchStats.map( (matchStat) => (
              <Grid.Row color={'red'} key={matchStat.id}>
                <Grid.Column>{matchStat.id}</Grid.Column>
              </Grid.Row>
            ))}
          </Grid>
        // </>
      );
    }
    else {
      return(
        <div>No match histories found</div>
      );
    }

  }
}