import React, { Component } from 'react';
import MainBlock from '../Common/main-block';
import ShowCase from '../Common/grid';
import { withFirebase } from '../Firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';


class ServicePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      services:[],
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
      .orderByChild('createdAt')
      .limitToLast(5)
      .on('value', snapshot => {
        this.setState({ loading: false, services:snapshot.val() });
      });
  };

  componentWillUnmount() {
    this.props.firebase.services().off();
  }


  render() {
    const { services,loading } = this.state;

    return (
      <MainBlock title="My Services">
        {loading && <div>Loading ...</div>}

        {services && (
          <ShowCase
            services={services}
          />
        )}

        {!services && <div>There are no services ...</div>}

      </MainBlock>
    );
  }
}



const mapStateToProps = state => ({
  authUser: state.sessionState.authUser,
});

export default compose(
  withFirebase,
  connect(
    mapStateToProps,
  ),
)(ServicePage);
