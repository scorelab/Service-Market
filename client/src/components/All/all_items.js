import React, { Component } from 'react';
import MainBlock from '../Common/main-block';
import ShowCase from '../Common/grid';
import { withFirebase } from '../Firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';


class AllItemPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      services: [],
      intermediaries: []
    };
  }

  componentDidMount() {
    if (!this.state.services.length) {
      this.setState({ loading: true });
    }
    this.onListenForServices();
  }

  onListenForServices = () => {
      this.props.firebase
        .services()
        .on('value', snapshot => {
          this.setState({ loading: false, services: snapshot.val() });
        });
        this.props.firebase
        .intermediaries()
        .on('value', snapshot => {
          this.setState({ loading: false, intermediaries: snapshot.val() });
        });
    
  };

  componentWillUnmount() {
    this.props.firebase.services().off();
    this.props.firebase.intermediaries().off();
  }


  render() {
    const { services, intermediaries, loading } = this.state;

    return (
      <MainBlock title="">
        {loading && <div>Loading ...</div>}

        {services && (
          <ShowCase services={services} intermediaries={intermediaries}/>
        )}

        {!services && intermediaries && <div>There are no items ...</div>}

      </MainBlock>
    );
  }
}


export default compose(
  withFirebase,
)(AllItemPage);
