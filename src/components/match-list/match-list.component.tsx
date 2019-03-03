import * as React from 'react';
import './match-list.component.scss';
import { Grid } from 'semantic-ui-react'
import { SummonerMatchStatistic } from 'src/models/summoner-match-statistic';


interface MatchListProps {
  matches:SummonerMatchStatistic[]
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
    if (this.props.matches && this.props.matches.length > 0) {
      return ( 
        // <>
          <Grid padded>
            {this.props.matches.map( (match, index) => (
              <Grid.Row color={'red'} key={index}>
                <Grid.Column>{match.items}</Grid.Column>
              </Grid.Row>
            ))}
          </Grid>
        // </>
      );
    }
    else {
      return(
        <div>No results</div>
      );
    }

  }
}