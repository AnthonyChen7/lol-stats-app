import * as React from 'react';
import './search-bar.component.scss';
import { Icon, Input } from 'semantic-ui-react'

// TODO maybe make use of a form library instead

interface SearchBarState {
  searchBarVal: string;
  isValid: boolean;
  isDirty: boolean;
}
interface SearchBarProps {
  regularExp?: string;
  errorMsg?: string;
  searchClicked: (searchBarVal: string) => void;
}
export class SearchBarComponent extends React.Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props);
    this.state = {searchBarVal: '', isValid: false, isDirty: false};
  }

  searchClicked() {
    if (this.state.isValid) {
      this.props.searchClicked(this.state.searchBarVal);
    }
  }

  onKeyUp (event : KeyboardEvent) {
    if (event.key === 'Enter') {
      this.searchClicked();
    }
  }

  handleChange(e: React.FormEvent<HTMLInputElement>) {
    this.setState({
      isDirty: true
    });
    const newValue: string = e.currentTarget.value;
    
    if ( newValue !== '' && (!this.props.regularExp || newValue.match(this.props.regularExp)) ) {
      this.setState({
        isValid: true
      });
    }
    else {
      this.setState({
        isValid: false
      });
    }

    this.setState({
      searchBarVal: newValue
    });
  }

  render() {
    return (
      <>
      <Input 
        icon={
          <Icon 
            name='search' 
            inverted 
            circular 
            link
            color = {this.state.isValid ? 'green' : 'grey'}
            disabled = {this.state.isValid ? false : true} 
            onClick={() => this.searchClicked() }/>
        } 
        placeholder='Search For Summoner...' 
        onChange={ (e: React.FormEvent<HTMLInputElement>) => this.handleChange(e)}
        onKeyUp = { (event : KeyboardEvent) => this.onKeyUp(event) }
        error = { !this.state.isDirty || this.state.isValid ? false : true}/>
        {this.state.isDirty && !this.state.isValid && !this.props.errorMsg && <div>Value is invalid</div>}
        {this.state.isDirty && !this.state.isValid && this.props.errorMsg && <div>{this.props.errorMsg}</div>}
      </>

      
    );
  }
}